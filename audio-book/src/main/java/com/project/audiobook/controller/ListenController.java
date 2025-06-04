package com.project.audiobook.controller;

import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Audiobook.HistoryResponse;
import com.project.audiobook.dto.response.Audiobook.ListenCountResponse;
import com.project.audiobook.service.ListenService;
import com.project.audiobook.utils.JwtRequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/listen")
public class ListenController {
    @Autowired
    private ListenService listenService;
    @Autowired
    private JwtRequestUtil jwtRequestUtil;

    @PostMapping("/{id}")
    ApiResponse<ListenCountResponse> listenAudioBook(@PathVariable Long id) {
        return ApiResponse.<ListenCountResponse>builder()
                .result(listenService.increaseListenCount(id))
                .build();
    }

    @PostMapping("/{id}/history")
    public ApiResponse<String> saveListeningHistory(
            @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {
        Long userId = jwtRequestUtil.getUserIdFromRequest(httpRequest);

        listenService.saveListeningHistory(id, userId);
        return ApiResponse.<String>builder()
                .result("History saved")
                .build();
    }

    @GetMapping
    public ApiResponse<List<HistoryResponse>> getUserHistory(HttpServletRequest httpRequest) {
        Long userId = jwtRequestUtil.getUserIdFromRequest(httpRequest);
        List<HistoryResponse> response = listenService.getUserListenHistory(userId);
        return ApiResponse.<List<HistoryResponse>>builder()
                .result(response)
                .build();
    }

}
