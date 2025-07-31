package com.cosone.cosone.service;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class SmsServiceImpl implements SmsService {
    private static final Logger logger = LoggerFactory.getLogger(SmsServiceImpl.class);
    
    // For development: store latest SMS for each phone number
    private static final Map<String, String> latestSms = new ConcurrentHashMap<>();

    @Override
    public void sendSms(String phoneNumber, String message) {
        // For development, just log the SMS
        // In production, integrate with SMS providers like Twilio, AWS SNS, etc.
        logger.info("SMS to {}: {}", phoneNumber, message);
        
        // Store for development display
        latestSms.put(phoneNumber, message);
    }
    
    // For development: get the latest SMS for a phone number
    public String getLatestSms(String phoneNumber) {
        return latestSms.get(phoneNumber);
    }
    
    // For development: get all latest SMS
    public Map<String, String> getAllLatestSms() {
        return new ConcurrentHashMap<>(latestSms);
    }
} 