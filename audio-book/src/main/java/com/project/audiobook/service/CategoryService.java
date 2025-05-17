package com.project.audiobook.service;

import com.project.audiobook.dto.request.Category.CategoryRequest;
import com.project.audiobook.dto.response.Audiobook.CategoryResponse;
import com.project.audiobook.entity.Category;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.mapper.CategoryMapper;
import com.project.audiobook.repository.CategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService {
    CategoryMapper categoryMapper;
    CategoryRepository categoryRepository;

    public CategoryResponse createRequest (CategoryRequest request){
        if(categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }

        Category category = categoryMapper.toCategory(request);
        category = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(category);
    }

    public CategoryResponse getCategory(Long id){
        return categoryMapper.toCategoryResponse(categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND)));
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request){
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        if(categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }
        category.setName(request.getName());
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    // Lỗi
    public void deleteCategory(Long id){
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        try {
            categoryRepository.deleteById(id);
        } catch (DataIntegrityViolationException e){
            throw new AppException(ErrorCode.CATEGORY_HAS_AUDIOBOOK);
        }

    }
    // Lỗi
    public List<CategoryResponse> getAllCategories(){
        return categoryRepository.findAll().stream().map(categoryMapper::toCategoryResponse).toList();
    }

}
