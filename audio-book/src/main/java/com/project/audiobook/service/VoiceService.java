package com.project.audiobook.service;

import com.project.audiobook.dto.request.Voice.VoiceRequest;
import com.project.audiobook.dto.response.Audiobook.VoiceResponse;
import com.project.audiobook.entity.Voice;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.mapper.VoiceMapper;
import com.project.audiobook.repository.VoiceRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VoiceService {
    VoiceRepository voiceRepository;
    VoiceMapper voiceMapper;

    public VoiceResponse createRequest (VoiceRequest request){
        if(voiceRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.VOICE_EXISTED);
        }

        Voice voice = voiceMapper.toVoice(request);
        voice = voiceRepository.save(voice);
        return voiceMapper.toVoiceResponse(voice);
    }

    public VoiceResponse getVoice(Long id){
        return voiceMapper.toVoiceResponse(voiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOICE_NOT_FOUND)));
    }

    public VoiceResponse updateVoice(Long id, VoiceRequest request){
        Voice voice = voiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOICE_NOT_FOUND));
        if(voiceRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.VOICE_EXISTED);
        }
        voice.setName(request.getName());
        return voiceMapper.toVoiceResponse(voiceRepository.save(voice));
    }

    // Lỗi
    public void deleteVoice(Long id){
        Voice voice = voiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOICE_NOT_FOUND));
        try {
            voiceRepository.deleteById(id);
        } catch (DataIntegrityViolationException e){
            throw new AppException(ErrorCode.VOICE_HAS_AUDIOBOOK);
        }

    }
    // Lỗi
    public List<VoiceResponse> getAllVoices(){
        return voiceRepository.findAll().stream().map(voiceMapper::toVoiceResponse).toList();
    }

}
