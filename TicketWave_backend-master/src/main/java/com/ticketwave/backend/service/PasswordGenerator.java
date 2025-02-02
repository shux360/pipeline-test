package com.ticketwave.backend.service;

import java.security.SecureRandom;
import java.util.Base64;

public class PasswordGenerator {
    private static final int PASSWORD_LENGTH = 10;

    public static String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        byte[] passwordBytes = new byte[PASSWORD_LENGTH];
        random.nextBytes(passwordBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(passwordBytes).substring(0, PASSWORD_LENGTH);
    }
}
