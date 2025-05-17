package com.project.audiobook.mapper;

import com.project.audiobook.dto.request.AudioBook.AudioBookRequest;
import com.project.audiobook.dto.response.Audiobook.AudioBookResponse;
import com.project.audiobook.entity.AudioBook;
import com.project.audiobook.entity.Author;
import com.project.audiobook.entity.Category;
import com.project.audiobook.entity.Voice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface AudioBookMapper {
    // Chuyển từ AudioBookRequest -> AudioBook
    @Mapping(target = "author", source = "author")
    @Mapping(target = "voice", source = "voice")
    @Mapping(target = "categories", source = "categories")
    @Mapping(target = "id", ignore = true) // ID được generate, không map từ request
    AudioBook toAudioBook(AudioBookRequest request, Author author, Voice voice, List<Category> categories);

    // Chuyển từ AudioBook -> AudioBookResponse
    @Mapping(source = "id", target = "id")
    @Mapping(source = "author.id", target = "authorId")
    @Mapping(source = "voice.id", target = "voiceId")
    @Mapping(source = "categories", target = "categoryIds", qualifiedByName = "mapCategories")
    @Mapping(target = "audioFiles", source = "audioFiles")
    @Mapping(target = "authorName", expression = "java(audioBook.getAuthor() != null ? audioBook.getAuthor().getName() : \"\")")
    @Mapping(target = "voiceName", expression = "java(audioBook.getVoice() != null ? audioBook.getVoice().getName() : \"\")")
    @Mapping(target = "categoryNames", source = "categories", qualifiedByName = "mapCategoryNames")
    AudioBookResponse toAudioBookResponse(AudioBook audioBook);

    @Named("mapCategories")
    default List<Long> mapCategories(List<Category> categories) {
        return (categories != null) ? categories.stream().map(Category::getId).collect(Collectors.toList()) : null;
    }

    @Named("mapCategoryNames")
    default List<String> mapCategoryNames(List<Category> categories) {
        if (categories != null) {
            return categories.stream().map(Category::getName).collect(Collectors.toList());
        }
        return null;
    }

}
