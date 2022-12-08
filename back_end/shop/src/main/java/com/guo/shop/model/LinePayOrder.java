package com.guo.shop.model;

import java.util.Map;

public class LinePayOrder {
    String orderId;
    String address;
    String productName;
    String imageUrl;
    String quantity;
    String price;
    String amount;
    String currency;
    LinePayPackage packages;
    Map<String, String> redirectUrls;
    public String getOrderId() {
        return orderId;
    }
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    public String getQuantity() {
        return quantity;
    }
    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }
    public String getPrice() {
        return price;
    }
    public void setPrice(String price) {
        this.price = price;
    }
    public String getAmount() {
        return amount;
    }
    public void setAmount(String amount) {
        this.amount = amount;
    }
    public String getCurrency() {
        return currency;
    }
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    public LinePayPackage getPackages() {
        return packages;
    }
    public void setPackages(LinePayPackage packages) {
        this.packages = packages;
    }
    public Map<String, String> getRedirectUrls() {
        return redirectUrls;
    }
    public void setRedirectUrls(Map<String, String> redirectUrls) {
        this.redirectUrls = redirectUrls;
    }

}
