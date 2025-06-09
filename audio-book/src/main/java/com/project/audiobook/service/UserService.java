package com.project.audiobook.service;

import com.project.audiobook.dto.request.User.UserUpdationInfoRequest;
import com.project.audiobook.dto.request.User.UserUpdationPasswordRequest;
import com.project.audiobook.dto.response.User.UserInfoResponse;
import com.project.audiobook.dto.response.User.UserResponse;
import com.project.audiobook.entity.User;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.mapper.UserMapper;
import com.project.audiobook.repository.LibraryRepository;
import com.project.audiobook.repository.LikeRepository;
import com.project.audiobook.repository.RatingRepository;
import com.project.audiobook.repository.UserRepository;
import com.project.audiobook.enums.AuthProvider;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
public class UserService {
    @Value("${app.default-avatar-url}")
    private String defaultAvatarUrl;
    final UserRepository userRepository;
    final PasswordEncoder passwordEncoder;
    final LikeRepository likeRepository;
    final RatingRepository ratingRepository;
    final LibraryRepository libraryRepository;
    final UserMapper userMapper;

    // Get info
    public UserInfoResponse getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        long audiobooksLikeByUser = likeRepository.countByUser(user);
        long audiobooksRatingByUser = ratingRepository.countByUser(user);
        long audiobooksInUserLibrary = libraryRepository.countByUser(user);

        // Nếu UserMapper không hỗ trợ UserInfoResponse thì gán thủ công
        UserInfoResponse response = new UserInfoResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setPhotoURL(user.getPhotoURL() != null ? user.getPhotoURL() : defaultAvatarUrl);
        response.setNumLikeAudiobook(audiobooksLikeByUser);
        response.setNumRatingAudiobook(audiobooksRatingByUser);
        response.setNumAudiobookInLibrary(audiobooksInUserLibrary);

        return response;
    }

    // Update info (name)
    public UserResponse updateInfo(Long userId, UserUpdationInfoRequest request) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setName(request.getName());
        if (request.getPhotoURL() != null && !request.getPhotoURL().isEmpty()) {
            user.setPhotoURL(request.getPhotoURL());
        }
        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    // Update info (name)
    public UserResponse changePassword(Long userId, UserUpdationPasswordRequest request) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean isGoogleWithoutPassword = user.getAuthProvider() == AuthProvider.GOOGLE
                && (user.getPassword() == null || user.getPassword().isEmpty());

        if (isGoogleWithoutPassword) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        } else {
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new AppException(ErrorCode.WRONG_OLD_PASSWORD);
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    public long getTotalUsers () {
        return userRepository.count();
    }
}
