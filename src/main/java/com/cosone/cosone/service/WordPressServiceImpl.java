package com.cosone.cosone.service;

import com.cosone.cosone.model.WordPressArticle;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WordPressServiceImpl implements WordPressService {
    
    private static final Logger logger = LoggerFactory.getLogger(WordPressServiceImpl.class);
    
    @Value("${wordpress.api.url:https://your-wordpress-site.com/wp-json/wp/v2}")
    private String wordpressApiUrl;
    
    @Value("${wordpress.api.timeout:5000}")
    private int timeout;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public WordPressServiceImpl() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    @Override
    public List<WordPressArticle> getArticles() {
        return getArticlesWithFilters(null, null);
    }
    
    @Override
    public List<WordPressArticle> getArticlesByCategory(String category) {
        return getArticlesWithFilters(category, null);
    }
    
    @Override
    public List<WordPressArticle> searchArticles(String searchTerm) {
        return getArticlesWithFilters(null, searchTerm);
    }
    
    @Override
    public List<WordPressArticle> getArticlesWithFilters(String category, String searchTerm) {
        try {
            String url = buildApiUrl(category, searchTerm);
            logger.info("Fetching WordPress articles from: {}", url);
            
            String response = restTemplate.getForObject(url, String.class);
            if (response == null) {
                logger.warn("No response received from WordPress API");
                return new ArrayList<>();
            }
            
            JsonNode articlesNode = objectMapper.readTree(response);
            List<WordPressArticle> articles = new ArrayList<>();
            
            for (JsonNode articleNode : articlesNode) {
                WordPressArticle article = parseArticle(articleNode);
                if (article != null) {
                    articles.add(article);
                }
            }
            
            logger.info("Successfully fetched {} articles from WordPress", articles.size());
            return articles;
            
        } catch (ResourceAccessException e) {
            logger.error("Failed to connect to WordPress API: {}", e.getMessage());
            return getMockArticles(); // Return mock data for development
        } catch (Exception e) {
            logger.error("Error fetching WordPress articles: {}", e.getMessage(), e);
            return getMockArticles(); // Return mock data for development
        }
    }
    
    private String buildApiUrl(String category, String searchTerm) {
        StringBuilder url = new StringBuilder(wordpressApiUrl + "/posts");
        List<String> params = new ArrayList<>();
        
        // Add parameters
        params.add("per_page=20");
        params.add("_embed");
        params.add("status=publish");
        
        if (category != null && !category.trim().isEmpty()) {
            params.add("categories=" + category);
        }
        
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            params.add("search=" + searchTerm);
        }
        
        if (!params.isEmpty()) {
            url.append("?").append(String.join("&", params));
        }
        
        return url.toString();
    }
    
    private WordPressArticle parseArticle(JsonNode articleNode) {
        try {
            WordPressArticle article = new WordPressArticle();
            
            // Basic fields
            article.setId(articleNode.get("id").asLong());
            article.setTitle(parseTitle(articleNode.get("title")));
            article.setExcerpt(parseExcerpt(articleNode.get("excerpt")));
            article.setContent(parseContent(articleNode.get("content")));
            article.setLink(articleNode.get("link").asText());
            article.setSlug(articleNode.get("slug").asText());
            article.setStatus(articleNode.get("status").asText());
            
            // Dates
            if (articleNode.has("date")) {
                article.setPublishedDate(parseDate(articleNode.get("date").asText()));
            }
            if (articleNode.has("modified")) {
                article.setModifiedDate(parseDate(articleNode.get("modified").asText()));
            }
            
            // Author
            if (articleNode.has("_embedded") && articleNode.get("_embedded").has("author")) {
                JsonNode authorNode = articleNode.get("_embedded").get("author").get(0);
                article.setAuthor(authorNode.get("name").asText());
            }
            
            // Featured image
            if (articleNode.has("_embedded") && articleNode.get("_embedded").has("wp:featuredmedia")) {
                JsonNode mediaNode = articleNode.get("_embedded").get("wp:featuredmedia").get(0);
                if (mediaNode.has("source_url")) {
                    article.setFeaturedImageUrl(mediaNode.get("source_url").asText());
                }
            }
            
            // Categories
            if (articleNode.has("_embedded") && articleNode.get("_embedded").has("wp:term")) {
                JsonNode termsNode = articleNode.get("_embedded").get("wp:term");
                List<String> categories = new ArrayList<>();
                for (JsonNode termGroup : termsNode) {
                    for (JsonNode term : termGroup) {
                        if (term.has("taxonomy") && "category".equals(term.get("taxonomy").asText())) {
                            categories.add(term.get("name").asText());
                        }
                    }
                }
                article.setCategories(categories);
            }
            
            return article;
            
        } catch (Exception e) {
            logger.error("Error parsing article: {}", e.getMessage());
            return null;
        }
    }
    
    private String parseTitle(JsonNode titleNode) {
        if (titleNode != null && titleNode.has("rendered")) {
            return titleNode.get("rendered").asText();
        }
        return "";
    }
    
    private String parseExcerpt(JsonNode excerptNode) {
        if (excerptNode != null && excerptNode.has("rendered")) {
            String excerpt = excerptNode.get("rendered").asText();
            // Remove HTML tags
            return excerpt.replaceAll("<[^>]*>", "").trim();
        }
        return "";
    }
    
    private String parseContent(JsonNode contentNode) {
        if (contentNode != null && contentNode.has("rendered")) {
            return contentNode.get("rendered").asText();
        }
        return "";
    }
    
    private LocalDateTime parseDate(String dateString) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            return LocalDateTime.parse(dateString, formatter);
        } catch (Exception e) {
            logger.warn("Could not parse date: {}", dateString);
            return LocalDateTime.now();
        }
    }
    
    // Mock data for development/testing when WordPress API is not available
    private List<WordPressArticle> getMockArticles() {
        List<WordPressArticle> mockArticles = new ArrayList<>();
        
        WordPressArticle article1 = new WordPressArticle();
        article1.setId(1L);
        article1.setTitle("Guide de Réservation en Ligne");
        article1.setExcerpt("Découvrez comment réserver facilement vos services en ligne avec notre nouveau système de réservation.");
        article1.setContent("Contenu complet de l'article sur la réservation en ligne...");
        article1.setLink("https://example.com/guide-reservation");
        article1.setPublishedDate(LocalDateTime.now().minusDays(2));
        article1.setAuthor("Équipe COSONE");
        article1.setCategories(List.of("Réservation", "Guide"));
        
        WordPressArticle article2 = new WordPressArticle();
        article2.setId(2L);
        article2.setTitle("Nouveaux Services Disponibles");
        article2.setExcerpt("Nous avons ajouté de nouveaux services à notre catalogue. Découvrez-les dès maintenant !");
        article2.setContent("Détails sur les nouveaux services disponibles...");
        article2.setLink("https://example.com/nouveaux-services");
        article2.setPublishedDate(LocalDateTime.now().minusDays(5));
        article2.setAuthor("Équipe COSONE");
        article2.setCategories(List.of("Services", "Actualités"));
        
        WordPressArticle article3 = new WordPressArticle();
        article3.setId(3L);
        article3.setTitle("Maintenance Planifiée - 15 Janvier");
        article3.setExcerpt("Notre système sera en maintenance le 15 janvier de 2h à 6h du matin.");
        article3.setContent("Informations détaillées sur la maintenance...");
        article3.setLink("https://example.com/maintenance-15-janvier");
        article3.setPublishedDate(LocalDateTime.now().minusDays(1));
        article3.setAuthor("Équipe Technique");
        article3.setCategories(List.of("Maintenance", "Actualités"));
        
        mockArticles.add(article1);
        mockArticles.add(article2);
        mockArticles.add(article3);
        
        return mockArticles;
    }
} 