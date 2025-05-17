package com.project.audiobook.mapper;

import com.project.audiobook.dto.request.Voice.VoiceRequest;
import com.project.audiobook.dto.response.Audiobook.VoiceResponse;
import com.project.audiobook.entity.Voice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface VoiceMapper {
    Voice toVoice(VoiceRequest request);
    @Mapping(target = "audioBookCount", expression = "java(voice.getAudioBooks() != null ? voice.getAudioBooks().size() : 0)")
    VoiceResponse toVoiceResponse(Voice voice);
    void updateVoice(@MappingTarget Voice voice, VoiceRequest request);
}
