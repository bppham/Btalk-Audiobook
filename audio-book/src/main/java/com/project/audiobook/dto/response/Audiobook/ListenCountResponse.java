package com.project.audiobook.dto.response.Audiobook;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListenCountResponse {
    private Long audioBookId;
    private Long listenCount;
    private Long todayListenCount;
    private Long monthListenCount;
    private Long yearListenCount;
}
