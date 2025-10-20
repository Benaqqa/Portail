package com.cosone.cosone.repository;

import com.cosone.cosone.model.Actualite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActualiteRepository extends JpaRepository<Actualite, Long> {
    java.util.List<Actualite> findAllByOrderByFeaturedDescDatePublicationDescCreatedAtDesc();
}


