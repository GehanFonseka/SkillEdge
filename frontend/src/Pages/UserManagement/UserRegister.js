import React, { useState } from 'react';
import { FaUserCircle, FaUser, FaTools } from 'react-icons/fa';
import GoogalLogo from './img/glogo.png';
import { IoMdAdd } from "react-icons/io";

function UserRegister() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        phone: '',
        skills: [],
        bio: '',
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [userEnteredCode, setUserEnteredCode] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddSkill = () => {
        if (skillInput.trim()) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput] });
            setSkillInput('');
        }
    };

    const removeSkill = (indexToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((_, index) => index !== indexToRemove)
        });
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('profilePictureInput').click();
    };

    const sendVerificationCode = async (email) => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('verificationCode', code);
        try {
            await fetch('http://localhost:8080/sendVerificationCode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
        } catch (error) {
            console.error('Error sending verification code:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (!formData.email) {
            alert("Email is required");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            alert("Email is invalid");
            isValid = false;
        }

        if (!profilePicture) {
            alert("Profile picture is required");
            isValid = false;
        }
        if (formData.skills.length < 2) {
            alert("Please add at least two skills.");
            isValid = false;
        }
        if (!isValid) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullname: formData.fullname,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    skills: formData.skills,
                    bio: formData.bio,
                }),
            });

            if (response.ok) {
                const userId = (await response.json()).id;

                if (profilePicture) {
                    const profileFormData = new FormData();
                    profileFormData.append('file', profilePicture);
                    await fetch(`http://localhost:8080/user/${userId}/uploadProfilePicture`, {
                        method: 'PUT',
                        body: profileFormData,
                    });
                }

                sendVerificationCode(formData.email);
                setIsVerificationModalOpen(true);
            } else if (response.status === 409) {
                alert('Email already exists!');
            } else {
                alert('Failed to register user.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleVerifyCode = () => {
        const savedCode = localStorage.getItem('verificationCode');
        if (userEnteredCode === savedCode) {
            alert('Verification successful!');
            localStorage.removeItem('verificationCode');
            window.location.href = '/';
        } else {
            alert('Invalid verification code. Please try again.');
        }
    };

    const nextStep = () => {
        let isValid = true;

        if (currentStep === 1) {
            if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
                alert("Valid email is required");
                isValid = false;
            }
            if (!formData.fullname || !formData.password || !formData.phone) {
                alert("All fields are required");
                isValid = false;
            }
            if (!profilePicture) {
                alert("Profile picture is required");
                isValid = false;
            }
        }

        if (isValid) {
            setCurrentStep(2);
        }
    };

    const prevStep = () => {
        setCurrentStep(1);
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-left">
                    <div className="auth-overlay">
                        <h1>Create Account</h1>
                        <p>Join our community and share your skills</p>
                    </div>
                </div>
                <div className="auth-right">
                    <div className="auth-box">
                        <h2>Sign Up</h2>
                        <p className="auth-subtitle">Please fill in your details</p>

                        <div className="stepper-container">
                            <div className={`stepper-step ${currentStep >= 1 ? 'active' : ''}`}>
                                <div className="step-icon">
                                    <FaUser />
                                </div>
                                <div className="step-content">
                                    <span className="step-label">Basic Info</span>
                                    <span className="step-desc">Personal details</span>
                                </div>
                            </div>
                            <div className={`stepper-connector ${currentStep >= 2 ? 'active' : ''}`}>
                                <div className="connector-line"></div>
                            </div>
                            <div className={`stepper-step ${currentStep >= 2 ? 'active' : ''}`}>
                                <div className="step-icon">
                                    <FaTools />
                                </div>
                                <div className="step-content">
                                    <span className="step-label">Skills & Bio</span>
                                    <span className="step-desc">Your expertise</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {currentStep === 1 ? (
                                <>
                                    <div className="form-group profile-upload">
                                        <label className="upload-label">Profile Picture</label>
                                        <div className="profile-upload-container" onClick={triggerFileInput}>
                                            <div className="profile-preview">
                                                {previewImage ? (
                                                    <img
                                                        src={previewImage}
                                                        alt="Selected Profile"
                                                        className="preview-image"
                                                    />
                                                ) : (
                                                    <div className="upload-placeholder">
                                                        <FaUserCircle className="placeholder-icon" />
                                                        <div className="upload-text">
                                                            <p className="primary-text">Click to Upload</p>
                                                            <p className="secondary-text">JPG, PNG or GIF (Max 2MB)</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                id="profilePictureInput"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleProfilePictureChange}
                                                hidden
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="fullname"
                                            value={formData.fullname}
                                            onChange={handleInputChange}
                                            required
                                            className="form-control"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="form-control"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            className="form-control"
                                            placeholder="Create a password"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                const re = /^[0-9\b]{0,10}$/;
                                                if (re.test(e.target.value)) {
                                                    handleInputChange(e);
                                                }
                                            }}
                                            maxLength="10"
                                            pattern="[0-9]{10}"
                                            required
                                            className="form-control"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>

                                    <button type="button" onClick={nextStep} className="auth-button">
                                        Next Step
                                    </button>

                                    <div className="auth-divider">
                                        <span>or continue with</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                                        className="google-button"
                                    >
                                        <img src={GoogalLogo} alt="Google" className="google-icon" />
                                        Google
                                    </button>

                                    <p className="auth-footer">
                                        Already have an account?{' '}
                                        <span onClick={() => window.location.href = '/'} className="auth-link">
                                            Sign in
                                        </span>
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label>Skills (minimum 2)</label>
                                        <div className="skills-container">
                                            {formData.skills.map((skill, index) => (
                                                <span key={index} className="skill-badge">
                                                    {skill}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeSkill(index)}
                                                        className="skill-remove-btn"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="skill-input-wrapper">
                                            <input
                                                type="text"
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                className="form-control"
                                                placeholder="Type a skill and press Add"
                                            />
                                            <button type="button" onClick={handleAddSkill} className="skill-add-btn">
                                                <IoMdAdd />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            required
                                            className="form-control"
                                            placeholder="Write a short bio..."
                                            rows={3}
                                        />
                                    </div>

                                    <div className="button-group">
                                        <button type="button" onClick={prevStep} className="auth-button outline">
                                            Back
                                        </button>
                                        <button type="submit" className="auth-button">
                                            Create Account
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {isVerificationModalOpen && (
                <div className="verification-modal">
                    <div className="modal-content">
                        <h3>Verify Your Email</h3>
                        <p>Please enter the verification code sent to your email.</p>
                        <input
                            type="text"
                            value={userEnteredCode}
                            onChange={(e) => setUserEnteredCode(e.target.value)}
                            placeholder="Enter verification code"
                            className="login-input"
                        />
                        <button onClick={handleVerifyCode} className="login-button">
                            Verify
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserRegister;
