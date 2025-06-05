package com.project.audiobook.service;

import com.project.audiobook.dto.request.LibraryRequest.LibraryRequest;
import com.project.audiobook.dto.response.Audiobook.LibraryResponse;
import com.project.audiobook.entity.AudioBook;
import com.project.audiobook.entity.Library;
import com.project.audiobook.entity.User;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.mapper.LibraryMapper;
import com.project.audiobook.repository.AudioBookRepository;
import com.project.audiobook.repository.LibraryRepository;
import com.project.audiobook.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LibrarySerivce {
    LibraryRepository libraryRepositry;
    UserRepository userRepository;
    AudioBookRepository audioBookRepository;
    LibraryMapper libraryMapper;

    @Transactional
    public LibraryResponse saveToLibrary(Long userId, LibraryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        AudioBook audioBook = audioBookRepository.findById(request.getAudioBookId())
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));

        if (libraryRepositry.existsByUserAndAudioBook(user, audioBook)) {
            throw new AppException(ErrorCode.ALREADY_IN_LIBRARY);
        }

        Library item = new Library();
        item.setUser(user);
        item.setAudioBook(audioBook);
        item.setSavedAt(LocalDateTime.now());
        Library saved = libraryRepositry.save(item);
        return libraryMapper.toLibraryResponse(saved);
    }

    @Transactional
    public LibraryResponse removeFromLibrary(Long userId, LibraryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        AudioBook audioBook = audioBookRepository.findById(request.getAudioBookId())
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));

        Library item = libraryRepositry.findByUserAndAudioBook(user, audioBook)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND_IN_LIBRARY));

        libraryRepositry.delete(item);

        return libraryMapper.toLibraryResponse(item);
    }

    public List<LibraryResponse> getUserLibrary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        List<Library> items = libraryRepositry.findAllByUser(user);
        return libraryMapper.toLibraryResponseList(items);
    }
}
