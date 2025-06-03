package com.project.audiobook.dto.response.Audiobook;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {
    private Long audioBookId;
    private double averageRating;
    private int totalRatings;
    private double userRating;
}
