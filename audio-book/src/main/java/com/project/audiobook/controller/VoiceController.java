package com.project.audiobook.controller;

import com.project.audiobook.dto.request.Voice.VoiceRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Audiobook.VoiceResponse;
import com.project.audiobook.service.VoiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/voices")
public class VoiceController {

    @Autowired
    private VoiceService voiceService;

    @PostMapping
    ApiResponse<VoiceResponse> addVoice(@RequestBody @Valid VoiceRequest request) {
        return ApiResponse.<VoiceResponse>builder()
                .result(voiceService.createRequest(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<VoiceResponse>> getAllVoices() {
        return ApiResponse.<List<VoiceResponse>>builder()
                .result(voiceService.getAllVoices())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<VoiceResponse> getVoiceById(@PathVariable Long id) {
        return ApiResponse.<VoiceResponse>builder()
                .result(voiceService.getVoice(id))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<VoiceResponse> updateVoice(@PathVariable Long id, @RequestBody VoiceRequest request) {
        return ApiResponse.<VoiceResponse>builder()
                .result(voiceService.updateVoice(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<String> deleteVoice(@PathVariable Long id) {
        voiceService.deleteVoice(id);
        return ApiResponse.<String>builder().result("Voice has been deleted").build();
    }
}
