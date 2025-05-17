package com.project.audiobook.mapper;

import com.project.audiobook.dto.request.Author.AuthorRequest;
import com.project.audiobook.dto.response.Audiobook.AuthorResponse;
import com.project.audiobook.entity.Author;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthorMapper {
    Author toAuthor(AuthorRequest request);
    @Mapping(target = "audioBookCount", expression = "java(author.getAudioBooks() != null ? author.getAudioBooks().size() : 0)")
    AuthorResponse toAuthorResponse(Author author);
}
