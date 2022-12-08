package com.guo.shop.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class LinePayPackage {
    String id;
    int amount;
    int userFee;
    String name;
    @JsonProperty("products")
    List<LineProductModel> productList;
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public int getAmount() {
        return amount;
    }
    public void setAmount(int amount) {
        this.amount = amount;
    }
    public int getUserFee() {
        return userFee;
    }
    public void setUserFee(int userFee) {
        this.userFee = userFee;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public List<LineProductModel> getProductList() {
        return productList;
    }
    public void setProductList(List<LineProductModel> product) {
        this.productList = product;
    }
}
