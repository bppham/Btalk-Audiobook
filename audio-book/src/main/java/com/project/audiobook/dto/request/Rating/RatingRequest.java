package com.project.audiobook.dto.request.Rating;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingRequest {
    private Long audioBookId;
    private double value; // từ 1 đến 5
}
