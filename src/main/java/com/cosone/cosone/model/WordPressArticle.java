package com.cosone.cosone.model;

import java.time.LocalDateTime;
import java.util.List;

public class WordPressArticle {
    private Long id;
    private String title;
    private String excerpt;
    private String content;
    private String link;
    private String featuredImageUrl;
    private LocalDateTime publishedDate;
    private LocalDateTime modifiedDate;
    private String author;
    private List<String> categories;
    private List<String> tags;
    private String status;
    private String slug;

    // Constructors
    public WordPressArticle() {}

    public WordPressArticle(Long id, String title, String excerpt, String content, String link, 
                          String featuredImageUrl, LocalDateTime publishedDate) {
        this.id = id;
        this.title = title;
        this.excerpt = excerpt;
        this.content = content;
        this.link = link;
        this.featuredImageUrl = featuredImageUrl;
        this.publishedDate = publishedDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getExcerpt() {
        return excerpt;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getFeaturedImageUrl() {
        return featuredImageUrl;
    }

    public void setFeaturedImageUrl(String featuredImageUrl) {
        this.featuredImageUrl = featuredImageUrl;
    }

    public LocalDateTime getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(LocalDateTime publishedDate) {
        this.publishedDate = publishedDate;
    }

    public LocalDateTime getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(LocalDateTime modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    @Override
    public String toString() {
        return "WordPressArticle{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", publishedDate=" + publishedDate +
                ", link='" + link + '\'' +
                '}';
    }
} 