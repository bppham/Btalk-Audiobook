package com.project.audiobook.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailUtil {
    JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Password Reset Verification Code");
            helper.setFrom("your_email@gmail.com");

            String html = getEmailTemplate().replace("{{CODE}}", code);
            helper.setText(html, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String getEmailTemplate() {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>Verification Code</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
              <div style="max-width: 500px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <h2 style="color: #333;">Password Reset Verification</h2>
                <p>Hello,</p>
                <p>You recently requested to reset your password. Use the verification code below to proceed:</p>
                <div style="font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0;">
                  {{CODE}}
                </div>
                <p>This code is valid for 2 minutes.</p>
                <p>If you did not request this, you can safely ignore this email.</p>
                <p>Thanks,<br>Your App Team</p>
              </div>
            </body>
            </html>
            """;
    }

}
