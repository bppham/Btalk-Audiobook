package com.project.audiobook.dto.response.Audiobook;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LikeResponse {
    private Long audioBookId;
    private Long likeCount;
    private boolean likedByCurrentUser;
}
