package com.project.audiobook.dto.response.Audiobook;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AudioBookResponse {
    private Long id;
    private String title;
    private Long authorId;
    private String authorName;
    private String image;
    private Long voiceId;
    private String voiceName;
    private String description;
    private String note;
    private List<Long> categoryIds;
    private List<String> categoryNames;
    private List<AudioFileResponse> audioFiles;
    private Long likeCount;
    private long ratingCount;
    private double averageRating;
    private Long dailyListenCount;
    private Long monthlyListenCount;
    private Long yearlyListenCount;
    private Long listenCount;
}
