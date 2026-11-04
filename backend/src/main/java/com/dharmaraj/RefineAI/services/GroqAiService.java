package com.dharmaraj.RefineAI.services;

import com.dharmaraj.RefineAI.dtos.RefinementRequestDto;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public final class GroqAiService {

    private final OpenAiChatModel chatModel;
    private final String modelName;

    public GroqAiService(
            OpenAiChatModel chatModel,
            @Value("${spring.ai.openai.chat.options.model}") String modelName) {
        this.chatModel = chatModel;
        this.modelName = modelName;
    }

    private OpenAiChatOptions getGroqChatOptions() {
        return OpenAiChatOptions.builder()
                .model(modelName)
                .temperature(0.4)
                .build();
    }

    public String getResponse(RefinementRequestDto request) {
        ChatResponse response = chatModel.call(AiRuleSetter.createPrompt(request, getGroqChatOptions()));

        return Objects.requireNonNull(response.getResult()).getOutput().getText();
    }
}