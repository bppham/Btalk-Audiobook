package com.project.audiobook.service;

import com.project.audiobook.dto.request.AudioBook.AudioBookRequest;
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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AudioBookService {
    AudioBookMapper audioBookMapper;
    AudioBookRepository audioBookRepository;
    AudioFileRepository audioFileRepository;
    FileStorageService fileStorageService;

    AuthorRepository authorRepository;
    VoiceRepository voiceRepository;
    CategoryRepository categoryRepository;

    public AudioBookResponse createRequest(AudioBookRequest request, MultipartFile image, List<MultipartFile> audioFiles) {
        if (audioBookRepository.existsByTitle(request.getTitle())) {
            throw new AppException(ErrorCode.AUDIOBOOK_EXISTED);
        }

        // Tìm Author, Voice, Category
        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));
        Voice voice = voiceRepository.findById(request.getVoiceId())
                .orElseThrow(() -> new AppException(ErrorCode.VOICE_NOT_FOUND));
        List<Category> categories = (request.getCategoryIds() != null) ? categoryRepository.findAllById(request.getCategoryIds()) : new ArrayList<>();

        // Upload ảnh
        if (image != null) {
            String urlImage = fileStorageService.storeFile(image, request.getTitle(), true);
            request.setImage(urlImage);
        }

        // Chuyển từ DTO -> Entity và lưu vào DB
        AudioBook audioBook = audioBookMapper.toAudioBook(request, author, voice, categories);
        audioBook = audioBookRepository.save(audioBook);

        // Upload audio files
        List<AudioFile> uploadedAudioFiles = new ArrayList<>();
        if (audioFiles != null) {
            for (MultipartFile file : audioFiles) {
                String filePath = fileStorageService.storeFile(file, request.getTitle(), false);
                uploadedAudioFiles.add(new AudioFile(null, file.getOriginalFilename(), filePath, audioBook));
            }
        }
        audioFileRepository.saveAll(uploadedAudioFiles);

        return audioBookMapper.toAudioBookResponse(audioBook);
    }

    public AudioBookResponse getAudioBookById(Long id) {
        AudioBook audioBook = audioBookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));
        return audioBookMapper.toAudioBookResponse(audioBook);
    }

    public List<AudioBookResponse> getAllAudioBooks() {
        return audioBookRepository.findAll().stream().map(audioBook -> {
            AudioBookResponse response = audioBookMapper.toAudioBookResponse(audioBook);

            // Chuẩn hóa lại đường dẫn ảnh
            String safeTitle = HandleFile.normalizeTitle(audioBook.getTitle());
            if (audioBook.getImage() != null) {
                response.setImage(audioBook.getImage());
            }

            return response;
        }).toList();
    }

    public void deleteAudioBook(Long id){
        AudioBook audioBook = audioBookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));
        audioBookRepository.deleteById(id);
    }

    @Transactional
    public AudioBookResponse updateAudioBook(Long id, AudioBookRequest request, MultipartFile image, List<MultipartFile> audioFiles) {
        // Kiểm tra xem audiobook có tồn tại không
        AudioBook audioBook = audioBookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));

        // Tìm Author, Voice, Category nếu có thay đổi
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

        // Cập nhật thông tin chung
        audioBook.setTitle(request.getTitle() != null ? request.getTitle() : audioBook.getTitle());
        audioBook.setDescription(request.getDescription() != null ? request.getDescription() : audioBook.getDescription());
        audioBook.setNote(request.getNote() != null ? request.getNote() : audioBook.getNote());

        // Cập nhật ảnh nếu có
        if (image != null) {
            String urlImage = fileStorageService.storeFile(image, audioBook.getTitle(), true);
            audioBook.setImage(urlImage);
        }

        // Lưu thay đổi audiobook
        audioBook = audioBookRepository.save(audioBook);

        audioFileRepository.deleteByAudioBookId(audioBook.getId());

        // Cập nhật danh sách audioFiles (nếu có)
        if (audioFiles != null && !audioFiles.isEmpty()) {

            // Upload và lưu file mới
            List<AudioFile> uploadedAudioFiles = new ArrayList<>();
            for (MultipartFile file : audioFiles) {
                String filePath = fileStorageService.storeFile(file, audioBook.getTitle(), false);
                uploadedAudioFiles.add(new AudioFile(null, file.getOriginalFilename(), filePath, audioBook));
            }
            audioFileRepository.saveAll(uploadedAudioFiles);
        }

        return audioBookMapper.toAudioBookResponse(audioBook);
    }

}
