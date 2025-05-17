package com.project.audiobook.controller;

import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.request.Category.CategoryRequest;
import com.project.audiobook.dto.response.Audiobook.CategoryResponse;
import com.project.audiobook.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping
    ApiResponse<CategoryResponse> createCategory (@RequestBody @Valid CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.createRequest(request))
                .build();
    }

    @GetMapping("{id}")
    ApiResponse<CategoryResponse> getCategory (@PathVariable Long id) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.getCategory(id))
                .build();
    }

    @PutMapping("{id}")
    ApiResponse<CategoryResponse> updateCategory (@PathVariable @Valid Long id, @RequestBody CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.updateCategory(id,request))
                .build();
    }

    @GetMapping
    ApiResponse<List<CategoryResponse>> getCategories(){
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getAllCategories())
                .build();
    }

    @DeleteMapping("{id}")
    ApiResponse<String> deleteCategory (@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.<String>builder().result("Category has been deleted").build();
    }
}
