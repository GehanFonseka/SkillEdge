package backend.advisor;


import backend.exception.ResourceNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public Map<String,String> handleResourceNotFoundException(ResourceNotFoundException exception){
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMesssage",exception.getMessage());
        return errorMap;
    }


}
