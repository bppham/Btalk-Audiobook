package com.project.audiobook.dto.response.Audiobook;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    private boolean likedByCurrentUser;
    private long ratingCount;
    private double averageRating;
    private Double userRating;
    private boolean savedByCurrentUser;
}
