package com.project.audiobook.controller;

import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.service.AudioBookService;
import com.project.audiobook.service.ListenService;
import com.project.audiobook.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {
    @Autowired
    UserService userService;
    @Autowired
    AudioBookService audioBookService;
    @Autowired
    ListenService listenService;

    @GetMapping("/user/count")
    ApiResponse<Long> getTotalUser() {
        return ApiResponse.<Long>builder()
                .result(userService.getTotalUsers())
                .build();
    }

    @GetMapping("/audiobook/count")
    ApiResponse<Long> getTotalAudiobooks() {
        return ApiResponse.<Long>builder()
                .result(audioBookService.getTotalAudiobooks())
                .build();
    }

    @GetMapping("/audiobook/listen-count/yearly")
     ApiResponse<Long> getTotalListenThisYear() {
        return ApiResponse.<Long>builder()
                .result(listenService.getTotalListenCountThisYear())
                .build();
    }

    @GetMapping("/audiobook/listen-count/by-month")
     ApiResponse<Map<Integer, Long>> getMonthlyListenStats() {
        return ApiResponse.<Map<Integer, Long>>builder()
                .result(listenService.getMonthlyListenStatsThisYear())
                .build();
    }
}
