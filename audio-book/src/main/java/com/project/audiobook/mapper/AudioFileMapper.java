package com.project.audiobook.mapper;

import com.project.audiobook.dto.request.AudioFile.AudioFileRequest;
import com.project.audiobook.dto.response.Audiobook.AudioBookResponse;
import com.project.audiobook.entity.AudioBook;
import com.project.audiobook.entity.AudioFile;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface AudioFileMapper {
    AudioFile toAudioFile(AudioFileRequest request);
    default List<AudioFile> toAudioFiles(List<AudioFileRequest> requests, AudioBook audioBook) {
        if (requests == null) {
            return null;
        }
        return requests.stream()
                .map(req -> {
                    AudioFile file = toAudioFile(req);
                    file.setAudioBook(audioBook); // cực kỳ quan trọng
                    return file;
                })
                .collect(Collectors.toList());
    }
}
