package com.project.audiobook.mapper;

import com.project.audiobook.dto.response.Audiobook.HistoryResponse;
import com.project.audiobook.entity.ListenHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface HistoryMapper {
    @Mapping(source = "audioBook.id", target = "audioBookId")
    @Mapping(source = "audioBook.title", target = "title")
    @Mapping(source = "audioBook.image", target = "image")
    HistoryResponse toHistoryResponse(ListenHistory history);

    List<HistoryResponse> toHistoryResponseList(List<ListenHistory> items);
}
