package com.cosone.cosone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.cosone.cosone.model.ExternAuthCode;

public interface ExternAuthCodeRepository extends JpaRepository<ExternAuthCode, Long> {
    Optional<ExternAuthCode> findByCode(String code);
} 