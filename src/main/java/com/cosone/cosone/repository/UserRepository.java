package com.cosone.cosone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.cosone.cosone.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByNumCin(String numCin);
    Optional<User> findByMatricule(String matricule);
    Optional<User> findByPhoneNumber(String phoneNumber);
} 