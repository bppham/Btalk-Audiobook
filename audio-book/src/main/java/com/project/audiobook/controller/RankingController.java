package com.project.audiobook.controller;

import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Audiobook.AudioBookResponse;
import com.project.audiobook.dto.response.Audiobook.AuthorResponse;
import com.project.audiobook.service.RankingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.YearMonth;

@RestController
@RequestMapping("/ranking")
public class RankingController {
    @Autowired
    private RankingService rankingService;

    @GetMapping("/day")
    ApiResponse<Page<AudioBookResponse>> getTopByDay(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<AudioBookResponse>>builder()
                .result(rankingService.getTopByDay(date, page, size))
                .build();
    }

    @GetMapping("/month")
    ApiResponse<Page<AudioBookResponse>> getTopByMonth(
            @RequestParam("month") @DateTimeFormat(pattern = "yyyy-MM") YearMonth month,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<AudioBookResponse>>builder()
                .result(rankingService.getTopByMonth(month, page, size))
                .build();
    }

    @GetMapping("/year")
    ApiResponse<Page<AudioBookResponse>> getTopByYear(
            @RequestParam("year") int year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<AudioBookResponse>>builder()
                .result(rankingService.getTopByYear(year, page, size))
                .build();
    }

    @GetMapping("/all")
    ApiResponse<Page<AudioBookResponse>> getTopByAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<AudioBookResponse>>builder()
                .result(rankingService.getTopByAll(page, size))
                .build();
    }

    @GetMapping("/likes")
    ApiResponse<Page<AudioBookResponse>> getTopByLikes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<AudioBookResponse>>builder()
                .result(rankingService.getTopByLike(page, size))
                .build();
    }

    @GetMapping("/rating")
    ApiResponse<Page<AudioBookResponse>> getTopByRating(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<AudioBookResponse>>builder()
                .result(rankingService.getTopByRating(page, size))
                .build();
    }
}
