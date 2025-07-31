package com.cosone.cosone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.cosone.cosone.model.PhoneVerificationCode;

public interface PhoneVerificationCodeRepository extends JpaRepository<PhoneVerificationCode, Long> {
    Optional<PhoneVerificationCode> findByPhoneNumberAndCode(String phoneNumber, String code);
    Optional<PhoneVerificationCode> findByPhoneNumber(String phoneNumber);
} 