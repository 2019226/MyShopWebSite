package com.guo.shop.model;

public class LineProductModel {
    String id;
    String name;
    String imageUrl;
    int quantity;
    int price;
    int originalPrice;


    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public int getPrice() {
        return price;
    }
    public void setPrice(int price) {
        this.originalPrice = price;
        this.price = price;
    }
    public int getOriginalPrice() {

        return originalPrice;
    }
    public void setOriginalPrice(int originalPrice) {
        this.originalPrice = originalPrice;
    }
}
