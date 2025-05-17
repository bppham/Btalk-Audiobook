package com.project.audiobook.mapper;

import com.project.audiobook.dto.request.AudioFile.AudioFileRequest;
import com.project.audiobook.dto.response.Audiobook.AudioBookResponse;
import com.project.audiobook.entity.AudioBook;
import com.project.audiobook.entity.AudioFile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AudioFileMapper {
    AudioFile toAudioFile(AudioFileRequest request);

    AudioBookResponse toAudioBookResponse(AudioBook audioBook);

}
