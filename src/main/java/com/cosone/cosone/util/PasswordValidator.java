package com.cosone.cosone.util;

import java.util.regex.Pattern;

public class PasswordValidator {
    
    public static boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        // Check for at least one uppercase letter
        if (!Pattern.compile("[A-Z]").matcher(password).find()) {
            return false;
        }
        
        // Check for at least one lowercase letter
        if (!Pattern.compile("[a-z]").matcher(password).find()) {
            return false;
        }
        
        // Check for at least one digit
        if (!Pattern.compile("\\d").matcher(password).find()) {
            return false;
        }
        
        // Check for at least one special character
        if (!Pattern.compile("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]").matcher(password).find()) {
            return false;
        }
        
        return true;
    }
    
    public static String getPasswordRequirements() {
        return "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    }
} 