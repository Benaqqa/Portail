package com.cosone.cosone.service;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CentresCsvService {
    
    private static final String CSV_FILE_PATH = "static/csv/output.csv";
    
    public List<Map<String, Object>> loadCentresFromCsv() {
        List<Map<String, Object>> centres = new ArrayList<>();
        
        try {
            ClassPathResource resource = new ClassPathResource(CSV_FILE_PATH);
            
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                
                String line;
                String[] headers = null;
                boolean isFirstLine = true;
                
                while ((line = reader.readLine()) != null) {
                    if (isFirstLine) {
                        // Parse headers
                        headers = parseCsvLine(line);
                        isFirstLine = false;
                        continue;
                    }
                    
                    // Parse data line
                    String[] values = parseCsvLine(line);
                    if (values.length > 0 && headers != null) {
                        Map<String, Object> centre = new HashMap<>();
                        
                        for (int i = 0; i < Math.min(headers.length, values.length); i++) {
                            String value = values[i];
                            if (StringUtils.hasText(value)) {
                                // Map CSV columns to our expected format
                                switch (headers[i].toLowerCase()) {
                                    case "name":
                                        centre.put("name", value);
                                        break;
                                    case "description":
                                        centre.put("description", value);
                                        break;
                                    case "rating":
                                        try {
                                            double rating = Double.parseDouble(value);
                                            centre.put("rating", rating);
                                        } catch (NumberFormatException e) {
                                            centre.put("rating", 0.0);
                                        }
                                        break;
                                    case "website":
                                        centre.put("website", value);
                                        break;
                                    case "phone":
                                        centre.put("phone", value);
                                        break;
                                    case "featured_image":
                                        centre.put("image", value);
                                        break;
                                    case "address":
                                        centre.put("address", value);
                                        // Extract city from address if possible
                                        String city = extractCityFromAddress(value);
                                        if (city != null) {
                                            centre.put("ville", city);
                                        }
                                        break;
                                }
                            }
                        }
                        
                        // Set default values for missing fields
                        if (!centre.containsKey("name")) {
                            centre.put("name", "Centre sans nom");
                        }
                        if (!centre.containsKey("address")) {
                            centre.put("address", "Adresse non disponible");
                        }
                        if (!centre.containsKey("ville")) {
                            centre.put("ville", "Ville non disponible");
                        }
                        if (!centre.containsKey("phone")) {
                            centre.put("phone", "Téléphone non disponible");
                        }
                        if (!centre.containsKey("description")) {
                            centre.put("description", "Aucune description disponible");
                        }
                        
                        // Set status as active by default
                        centre.put("actif", true);
                        
                        // Only add centres that have at least a name
                        if (StringUtils.hasText((String) centre.get("name"))) {
                            centres.add(centre);
                        }
                    }
                }
            }
            
        } catch (IOException e) {
            // Log error and return empty list
            System.err.println("Error reading CSV file: " + e.getMessage());
        }
        
        return centres;
    }
    
    private String[] parseCsvLine(String line) {
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;
        
        for (char c : line.toCharArray()) {
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                result.add(current.toString().trim());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        
        // Add the last field
        result.add(current.toString().trim());
        
        return result.toArray(new String[0]);
    }
    
    private String extractCityFromAddress(String address) {
        if (!StringUtils.hasText(address)) {
            return null;
        }
        
        // Try to extract city from common patterns
        String[] parts = address.split(",");
        if (parts.length > 1) {
            // Look for the last part that might be a city
            for (int i = parts.length - 1; i >= 0; i--) {
                String part = parts[i].trim();
                if (StringUtils.hasText(part) && !part.matches(".*\\d+.*")) {
                    // Remove common prefixes and clean up
                    part = part.replaceAll("^(Route|Avenue|Boulevard|Rue|Place)\\s+", "");
                    if (part.length() > 2 && part.length() < 50) {
                        return part;
                    }
                }
            }
        }
        
        return null;
    }
}
