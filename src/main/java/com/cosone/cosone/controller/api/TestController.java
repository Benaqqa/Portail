package com.cosone.cosone.controller.api;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {

    @GetMapping("/ping")
    public Map<String, String> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        response.put("message", "API fonctionne");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }

    @GetMapping("/centres-mock")
    public Map<String, Object> getMockCentres() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", new Object[]{
            Map.of(
                "id", 1L,
                "nom", "Centre Agadir",
                "adresse", "Boulevard Hassan II",
                "ville", "Agadir",
                "telephone", "0528-123456",
                "description", "Centre de vacances en bord de mer",
                "rating", 4.5,
                "actif", true
            ),
            Map.of(
                "id", 2L,
                "nom", "Centre Atlas",
                "adresse", "Route de l'Atlas",
                "ville", "Ifrane",
                "telephone", "0535-789012",
                "description", "Centre de montagne",
                "rating", 4.8,
                "actif", true
            )
        });
        return response;
    }
}
