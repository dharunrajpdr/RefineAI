package com.dharmaraj.RefineAI.services;

import com.dharmaraj.RefineAI.dtos.RefinementRequestDto;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.ollama.api.OllamaChatOptions;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public final class OllamaAiService {

    private final ChatModel chatModel;

    public OllamaAiService(@Qualifier("ollamaChatModel") ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    private OllamaChatOptions getOllamaChatOptions() {

        return OllamaChatOptions.builder().model("gemma3:4b").temperature(0.4).build();
    }

    public String getResponse(String message) {

        if (message.trim().isBlank())
            throw new RuntimeException("Prompt cannot be empty");

        var request = new RefinementRequestDto(
                message,
                RefinementRequestDto.Preset.GENERAL,
                RefinementRequestDto.Tone.PROFESSIONAL,
                RefinementRequestDto.Length.SAME_LENGTH);
        ChatResponse response = chatModel.call(AiRuleSetter.createPrompt(request, getOllamaChatOptions()));

        return Objects.requireNonNull(response.getResult()).getOutput().getText();
    }
}
