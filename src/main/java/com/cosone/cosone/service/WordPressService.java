package com.cosone.cosone.service;

import com.cosone.cosone.model.WordPressArticle;
import java.util.List;

public interface WordPressService {
    List<WordPressArticle> getArticles();
    List<WordPressArticle> getArticlesByCategory(String category);
    List<WordPressArticle> searchArticles(String searchTerm);
    List<WordPressArticle> getArticlesWithFilters(String category, String searchTerm);
} 