package com.dharmaraj.RefineAI;

import com.dharmaraj.RefineAI.exceptions.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GlobalExceptionHandlerTests {

    @Test
    void reportsInvalidGroqKeysAsBadGatewayWithActionableMessage() {
        var response = new GlobalExceptionHandler().handleAiProviderRejection(
                new NonTransientAiException("HTTP 401 - invalid_api_key"));

        assertEquals(HttpStatus.BAD_GATEWAY, response.getStatusCode());
        assertEquals(
                "Groq rejected the API key. Set a valid GROQ_API_KEY and restart the backend.",
                response.getBody().getErrorMessage());
    }
}
