package com.cosone.cosone.service;

import java.util.Map;

public interface SmsService {
    void sendSms(String phoneNumber, String message);
    Map<String, String> getAllLatestSms();
} 