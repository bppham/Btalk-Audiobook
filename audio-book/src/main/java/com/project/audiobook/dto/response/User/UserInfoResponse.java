package com.project.audiobook.dto.response.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponse extends UserResponse{
    private Long id;
    private Long numLikeAudiobook;
    private Long numRatingAudiobook;
    private Long numAudiobookInLibrary;
}
