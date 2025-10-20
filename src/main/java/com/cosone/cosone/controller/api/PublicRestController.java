package com.cosone.cosone.controller.api;

import com.cosone.cosone.model.Actualite;
import com.cosone.cosone.repository.ActualiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:3000")
public class PublicRestController {

    @Autowired
    private ActualiteRepository actualiteRepository;

    @GetMapping("/actualites")
    public ResponseEntity<?> listActualites() {
        List<Actualite> actualites = actualiteRepository.findAllByOrderByFeaturedDescDatePublicationDescCreatedAtDesc();
        Map<String, Object> response = new HashMap<>();
        response.put("actualites", actualites);
        return ResponseEntity.ok(response);
    }
}


