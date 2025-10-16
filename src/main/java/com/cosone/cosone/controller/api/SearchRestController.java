package com.cosone.cosone.controller.api;

import com.cosone.cosone.model.Centre;
import com.cosone.cosone.service.CentreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/centres")
@CrossOrigin(origins = "http://localhost:3000")
public class SearchRestController {

    @Autowired
    private CentreService centreService;

    @GetMapping("/search")
    public List<Centre> searchCentres(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String centre,
            @RequestParam(required = false) String activityType,
            @RequestParam(required = false) String period,
            @RequestParam(required = false) String budget,
            @RequestParam(required = false) String rating) {
        
        return centreService.searchCentres(query, region, centre, activityType, period, budget, rating);
    }

    @GetMapping
    public List<Centre> getAllCentres() {
        return centreService.getAllCentres();
    }

    @GetMapping("/debug")
    public Map<String, Object> debugCentres() {
        Map<String, Object> debug = new HashMap<>();
        List<Centre> allCentres = centreService.getAllCentres();
        
        debug.put("totalCentres", allCentres.size());
        debug.put("centres", allCentres);
        
        // Test de recherche "casa"
        List<Centre> casaResults = centreService.searchCentres("casa", null, null, null, null, null, null);
        debug.put("casaSearchResults", casaResults.size());
        debug.put("casaResults", casaResults);
        
        return debug;
    }
}
