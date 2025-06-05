package com.project.audiobook.dto.response.Audiobook;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class UserAudioBookResponse extends AudioBookResponse{
    private boolean likedByCurrentUser;
    private Double userRating;
    private boolean savedByCurrentUser;
}
