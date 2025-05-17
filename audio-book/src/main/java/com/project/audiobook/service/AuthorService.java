package com.project.audiobook.service;

import com.project.audiobook.dto.request.Author.AuthorRequest;
import com.project.audiobook.dto.response.Audiobook.AuthorResponse;
import com.project.audiobook.entity.Author;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.mapper.AuthorMapper;
import com.project.audiobook.repository.AuthorRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthorService {
    AuthorRepository authorRepository;
    AuthorMapper authorMapper;

    public AuthorResponse createRequest (AuthorRequest request){
        if(authorRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.AUTHOR_EXISTED);
        }

        Author author = authorMapper.toAuthor(request);
        author = authorRepository.save(author);
        return authorMapper.toAuthorResponse(author);
    }

    public AuthorResponse getAuthor(Long id){
        return authorMapper.toAuthorResponse(authorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND)));
    }

    public AuthorResponse updateAuthor(Long id, AuthorRequest request){
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));
        if(authorRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.AUTHOR_EXISTED);
        }
        author.setName(request.getName());
        return authorMapper.toAuthorResponse(authorRepository.save(author));
    }

    public void deleteAuthor(Long id){
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));
        try {
            authorRepository.deleteById(id);
        } catch (DataIntegrityViolationException e){
            throw new AppException(ErrorCode.AUTHOR_HAS_AUDIOBOOK);
        }

    }

    public List<AuthorResponse> getAllAuthors(){
        return authorRepository.findAll().stream().map(authorMapper::toAuthorResponse).toList();
    }

}
