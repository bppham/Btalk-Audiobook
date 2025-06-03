package com.project.audiobook.service;

import com.project.audiobook.dto.request.AudioBook.AudioBookRequest;
import com.project.audiobook.dto.request.AudioFile.AudioFileRequest;
import com.project.audiobook.dto.response.Audiobook.AudioBookResponse;
import com.project.audiobook.entity.*;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.mapper.AudioBookMapper;
import com.project.audiobook.repository.*;
import com.project.audiobook.utils.HandleFile;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
public class AudioBookService {
    @Value("${app.default-book-cover-url}")
    private String defaultBookCover;
    final AudioBookMapper audioBookMapper;
    final AudioBookRepository audioBookRepository;
    final LikeRepository likeRepository;
    final RatingRepository ratingRepository;
    final LibraryRepositry libraryRepositry;

    final AuthorRepository authorRepository;
    final VoiceRepository voiceRepository;
    final CategoryRepository categoryRepository;

    @Transactional
    public AudioBookResponse createRequest(AudioBookRequest request) {
        // Kiểm tra tiêu đề trùng
        if (audioBookRepository.existsByTitle(request.getTitle())) {
            throw new AppException(ErrorCode.AUDIOBOOK_EXISTED);
        }

        // Tìm Author, Voice, Category
        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));

        Voice voice = voiceRepository.findById(request.getVoiceId())
                .orElseThrow(() -> new AppException(ErrorCode.VOICE_NOT_FOUND));

        List<Category> categories = (request.getCategoryIds() != null)
                ? categoryRepository.findAllById(request.getCategoryIds())
                : new ArrayList<>();

        // Nếu không có ảnh thì dùng ảnh mặc định
        if (request.getImage() == null || request.getImage().isEmpty()) {
            request.setImage(defaultBookCover);
        }

        // Map DTO -> Entity
        AudioBook audioBook = audioBookMapper.toAudioBook(request, author, voice, categories);

        // Tạo danh sách AudioFile và gán về AudioBook
        if (request.getAudioFiles() != null && !request.getAudioFiles().isEmpty()) {
            List<AudioFile> audioFiles = request.getAudioFiles().stream()
                    .map(fileRequest -> {
                        AudioFile audioFile = new AudioFile();
                        audioFile.setFileName(fileRequest.getFileName());
                        audioFile.setFileUrl(fileRequest.getFileUrl());
                        audioFile.setAudioBook(audioBook); // liên kết 2 chiều
                        return audioFile;
                    }).collect(Collectors.toList());
            audioBook.setAudioFiles(audioFiles); // gán danh sách vào entity chính
        }

        // Lưu AudioBook (kèm AudioFiles nhờ CascadeType.ALL)
        AudioBook savedAudioBook = audioBookRepository.save(audioBook);

        return audioBookMapper.toAudioBookResponse(savedAudioBook);
    }

    public AudioBookResponse getAudioBookById(Long id, Long userId) {
        AudioBook audioBook = audioBookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));

        AudioBookResponse response = audioBookMapper.toAudioBookResponse(audioBook);

        response.setLikeCount(likeRepository.countByAudioBook(audioBook));
        response.setLikedByCurrentUser(
                userId != null && likeRepository.existsByUserIdAndAudioBookId(userId, audioBook.getId())
        );

        // Đánh giá
        List<Rating> allRatings = ratingRepository.findAllByAudioBook(audioBook);
        response.setRatingCount(allRatings.size());
        response.setAverageRating(
                allRatings.stream().mapToDouble(Rating::getValue).average().orElse(0.0)
        );

        // Đánh giá của người dùng hiện tại (nếu có)
        if (userId != null) {
            ratingRepository.findByUserIdAndAudioBookId(userId, id)
                    .ifPresent(rating -> response.setUserRating(rating.getValue()));
        }
        // Lưu vào thư viện của người dùng hiện tại (nếu có)
        response.setSavedByCurrentUser(
                userId != null && libraryRepositry.existsByUserIdAndAudioBookId(userId, audioBook.getId())
        );

        return response;
    }


    public List<AudioBookResponse> getAllAudioBooks() {
        return audioBookRepository.findAll().stream().map(audioBook -> {
            AudioBookResponse response = audioBookMapper.toAudioBookResponse(audioBook);
            if (audioBook.getImage() != null) {
                response.setImage(audioBook.getImage());
            }

            return response;
        }).toList();
    }

    public void deleteAudioBook(Long id) {
        AudioBook audioBook = audioBookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));
        audioBookRepository.deleteById(id);
    }

    @Transactional
    public AudioBookResponse updateAudioBook(Long id, AudioBookRequest request) {
        AudioBook audioBook = audioBookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));

        if (request.getAuthorId() != null) {
            Author author = authorRepository.findById(request.getAuthorId())
                    .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));
            audioBook.setAuthor(author);
        }

        if (request.getVoiceId() != null) {
            Voice voice = voiceRepository.findById(request.getVoiceId())
                    .orElseThrow(() -> new AppException(ErrorCode.VOICE_NOT_FOUND));
            audioBook.setVoice(voice);
        }

        if (request.getCategoryIds() != null) {
            List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
            audioBook.setCategories(categories);
        }

        audioBook.setTitle(request.getTitle() != null ? request.getTitle() : audioBook.getTitle());
        audioBook.setDescription(request.getDescription() != null ? request.getDescription() : audioBook.getDescription());
        audioBook.setNote(request.getNote() != null ? request.getNote() : audioBook.getNote());

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            audioBook.setImage(request.getImage());
        }

        // Lấy danh sách file hiện tại
        List<AudioFile> existingFiles = new ArrayList<>(audioBook.getAudioFiles());

        // Lấy danh sách file mới từ request
        List<AudioFileRequest> requestFiles = request.getAudioFiles();
        List<AudioFile> updatedFiles = new ArrayList<>();

        if (requestFiles != null && !requestFiles.isEmpty()) {
            for (AudioFileRequest fileReq : requestFiles) {
                // Tìm file trùng (dựa trên fileUrl, có thể đổi thành fileName tùy yêu cầu)
                Optional<AudioFile> matched = existingFiles.stream()
                        .filter(f -> f.getFileUrl().equals(fileReq.getFileUrl()))
                        .findFirst();
                if (matched.isPresent()) {
                    AudioFile old = matched.get();
                    old.setFileName(fileReq.getFileName());
                    updatedFiles.add(old);
                    existingFiles.remove(old);
                } else {
                    AudioFile newFile = new AudioFile(null, fileReq.getFileName(), fileReq.getFileUrl(), audioBook);
                    updatedFiles.add(newFile);
                }
            }

            // Xóa những file đã bị bỏ khỏi danh sách
            for (AudioFile orphan : existingFiles) {
                audioBook.getAudioFiles().remove(orphan);
            }

            // Cập nhật danh sách audioFiles
            audioBook.getAudioFiles().clear();
            audioBook.getAudioFiles().addAll(updatedFiles);
        }


        AudioBook updated = audioBookRepository.save(audioBook);
        return audioBookMapper.toAudioBookResponse(updated);
    }


}
