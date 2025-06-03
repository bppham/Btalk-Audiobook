package com.project.audiobook.mapper;

import com.project.audiobook.dto.response.Audiobook.LibraryResponse;
import com.project.audiobook.entity.Library;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LibraryMapper {
    @Mapping(source = "audioBook.id", target = "audioBookId")
    @Mapping(source = "audioBook.title", target = "title")
    @Mapping(source = "audioBook.image", target = "image")
    LibraryResponse toLibraryResponse(Library library);

    List<LibraryResponse> toLibraryResponseList(List<Library> items);
}
