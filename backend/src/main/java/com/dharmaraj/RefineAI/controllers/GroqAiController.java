package com.dharmaraj.RefineAI.controllers;

import com.dharmaraj.RefineAI.dtos.ApiResponseDto;
import com.dharmaraj.RefineAI.dtos.RefinementRequestDto;
import com.dharmaraj.RefineAI.enums.Status;
import com.dharmaraj.RefineAI.services.GroqAiService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/groq")
public final class GroqAiController {

    private final GroqAiService groqAiService;

    @PostMapping("/response")
    public ResponseEntity<ApiResponseDto> getResponse(
            @RequestBody(required = false) RefinementRequestDto request) {

        if (request == null || request.prompt() == null || request.prompt().isBlank()) {
            ApiResponseDto error = new ApiResponseDto();
            error.setStatus(Status.FAILURE);
            error.setErrorMessage("Enter some text before refining.");
            return ResponseEntity.badRequest().body(error);
        }

        ApiResponseDto responseDto = new ApiResponseDto();
        responseDto.setRefinedText(groqAiService.getResponse(request));
        return ResponseEntity.status(200).body(responseDto);
    }
}