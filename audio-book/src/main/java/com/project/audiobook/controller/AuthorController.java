package com.project.audiobook.controller;

import com.project.audiobook.dto.request.Author.AuthorRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Audiobook.AuthorResponse;
import com.project.audiobook.service.AuthorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/authors")
public class AuthorController {

    @Autowired
    private AuthorService authorService;

    @PostMapping
    ApiResponse<AuthorResponse> addAuthor(@RequestBody @Valid AuthorRequest request) {
        return ApiResponse.<AuthorResponse>builder()
                .result(authorService.createRequest(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<AuthorResponse>> getAllAuthors() {
        return ApiResponse.<List<AuthorResponse>>builder()
                .result(authorService.getAllAuthors())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<AuthorResponse> getAuthorById(@PathVariable Long id) {
        return ApiResponse.<AuthorResponse>builder()
                .result(authorService.getAuthor(id))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<AuthorResponse> updateAuthor(@PathVariable Long id, @RequestBody AuthorRequest request) {
        return ApiResponse.<AuthorResponse>builder()
                .result(authorService.updateAuthor(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<String> deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return ApiResponse.<String>builder().result("Author has been deleted").build();
    }
}
