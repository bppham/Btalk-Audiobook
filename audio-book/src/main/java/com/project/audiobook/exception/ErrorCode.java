package com.project.audiobook.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized Exception"),
    INVALID_KEY(9998, "Invalid message key"),
    // Category
    CATEGORY_EXISTED(1001, "Category already existed"),
    CATEGORY_BLANK(1002, "Category cannot be blank"),
    CATEGORY_NOT_FOUND(1003, "Category not found"),
    CATEGORY_HAS_AUDIOBOOK(1004, "Category still has audiobooks"),
    // Author
    AUTHOR_EXISTED(2001, "Author already existed"),
    AUTHOR_BLANK(2002, "Author cannot be blank"),
    AUTHOR_NOT_FOUND(2003, "Author not found"),
    AUTHOR_HAS_AUDIOBOOK(2004, "Author still has audiobooks"),
    // Voice
    VOICE_EXISTED(3001, "Voice already existed"),
    VOICE_BLANK(3002, "Voice cannot be blank"),
    VOICE_NOT_FOUND(3003, "Voice not found"),
    VOICE_HAS_AUDIOBOOK(3004, "Voice still has audiobooks"),
    // AudioBook
    AUDIOBOOK_EXISTED(4001, "Audio book already existed"),
    AUDIOBOOK_BLANK(4002, "Audio book cannot be blank"),
    AUDIOBOOK_NOT_FOUND(4003, "Audio book not found"),
    RATING_VALUE_INVALID(4004, "Rating value must between 0 and 5"),
    // Employee
    EMPLOYEE_EXISTED(5001, "Employee already existed"),
    EMPLOYEE_BLANK(5002, "Employee cannot be blank"),
    EMPLOYEE_NOT_FOUND(5003, "Employee not found"),
    EMPLOYEE_EMAIL_EXISTED(5004, "Employee's email already existed"),
    ROLE_NOT_FOUND(5005, "Role is not existed"),
    // Auth
    INVALID_CREDENTIALS(6001, "Login failed"),
    INVALID_EMPLOYEE_EMAIL(6002, "Cannot find email"),
    INVALID_VERIFY_CODE(6003, "The code is not valid"),
    EXPIRED_VERIFY_CODE(6003, "The code is expired"),
    UNAUTHORIZED(6004, "Token not found or error"),
    INTERNAL_SERVER_ERROR(6005, "Google token verification failed"),
    // User
    USER_EXISTED(7001, "User already existed"),
    USER_BLANK(7002, "User cannot be blank"),
    USER_NOT_FOUND(7003, "User not found"),
    USER_EMAIL_EXISTED(7004, "User's email already existed"),
    ACCOUNT_NO_PASSWORD(7005, "Account has only Google login"),

    ;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    private int code;
    private String message;


}
