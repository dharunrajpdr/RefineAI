package com.dharmaraj.RefineAI.exceptions;

import com.dharmaraj.RefineAI.dtos.ApiResponseDto;
import com.dharmaraj.RefineAI.enums.Status;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponseDto> handleInvalidRequestBody(HttpMessageNotReadableException e) {
        ApiResponseDto responseDto = new ApiResponseDto();
        responseDto.setErrorMessage("Invalid refinement request. Check the request fields and values.");
        responseDto.setStatus(Status.FAILURE);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseDto);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponseDto> handleException(RuntimeException e) {

        ApiResponseDto responseDto = new ApiResponseDto();
        responseDto.setErrorMessage("An error occurred: " + e.getMessage());
        responseDto.setStatus(Status.FAILURE);
        return ResponseEntity.status(500).body(responseDto);
    }
}
