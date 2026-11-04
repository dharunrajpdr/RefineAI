package com.dharmaraj.RefineAI;

import com.dharmaraj.RefineAI.dtos.RefinementRequestDto;
import com.dharmaraj.RefineAI.services.AiRuleSetter;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AiRuleSetterTests {

    @Test
    void separatesInputFromInstructionsAndAppliesSelectedOptions() {
        var request = new RefinementRequestDto(
                "hello   there",
                RefinementRequestDto.Preset.EMAIL,
                RefinementRequestDto.Tone.FRIENDLY,
                RefinementRequestDto.Length.SHORTEN);

        var prompt = AiRuleSetter.createPrompt(request, null);
        String instructions = prompt.getSystemMessage().getText();

        assertTrue(instructions.contains("Refine as an email"));
        assertTrue(instructions.contains("Friendly and approachable"));
        assertTrue(instructions.contains("Make the result more concise"));
        assertFalse(instructions.contains("{input}"));
        assertEquals("Text to refine:\nhello   there", prompt.getUserMessage().getText());
    }

    @Test
    void defaultsToGeneralProfessionalSameLengthInstructions() {
        var request = new RefinementRequestDto("Hello", null, null, null);
        String instructions = AiRuleSetter.createPrompt(request, null).getSystemMessage().getText();

        assertTrue(instructions.contains("General writing"));
        assertTrue(instructions.contains("Professional and clear"));
        assertTrue(instructions.contains("Keep approximately the same length"));
        assertEquals("Text to refine:\nHello",
                AiRuleSetter.createPrompt(request, null).getUserMessage().getText());
    }
}
