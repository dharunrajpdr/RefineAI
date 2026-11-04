package com.dharmaraj.RefineAI.exceptions;

import com.dharmaraj.RefineAI.dtos.ApiResponseDto;
import com.dharmaraj.RefineAI.enums.Status;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponseDto> handleInvalidRequestBody(HttpMessageNotReadableException e) {
        ApiResponseDto responseDto = new ApiResponseDto();
        responseDto.setErrorMessage("Invalid refinement request. Check the request fields and values.");
        responseDto.setStatus(Status.FAILURE);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseDto);
    }

    @ExceptionHandler(NonTransientAiException.class)
    public ResponseEntity<ApiResponseDto> handleAiProviderRejection(NonTransientAiException e) {
        logger.warn("AI provider rejected the refinement request: {}", e.getMessage());
        ApiResponseDto responseDto = new ApiResponseDto();
        String message = e.getMessage() != null && e.getMessage().contains("invalid_api_key")
                ? "Groq rejected the API key. Set a valid GROQ_API_KEY and restart the backend."
                : "The AI provider rejected the request. Check the backend API key and model configuration.";
        responseDto.setErrorMessage(message);
        responseDto.setStatus(Status.FAILURE);
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(responseDto);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponseDto> handleException(RuntimeException e) {

        ApiResponseDto responseDto = new ApiResponseDto();
        responseDto.setErrorMessage("An error occurred: " + e.getMessage());
        responseDto.setStatus(Status.FAILURE);
        return ResponseEntity.status(500).body(responseDto);
    }
}
