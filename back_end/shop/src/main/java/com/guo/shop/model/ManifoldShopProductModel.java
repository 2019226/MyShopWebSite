package com.guo.shop.model;

import com.guo.shop.service.MyToolService;

import java.util.Objects;

public class ManifoldShopProductModel extends  BaseShopProductModel {
    public boolean isAddToCart;
    public String inventoryQuantity;
    public String customDemandQuantity;


    @Override
    public void setImageUrl(String imageUrl) {
        String randomStr = "?rand="+ MyToolService.getRandomString(20);
        super.setImageUrl(imageUrl+randomStr);
    }
    public boolean getIsAddToCart() {
        if(Objects.isNull(isAddToCart)){
            isAddToCart = false;
        }
        return isAddToCart;
    }

    public void setIsAddToCart(boolean isAddToCart) {
        this.isAddToCart = isAddToCart;
    }


    public String getInventoryQuantity() {
        if(Objects.isNull(inventoryQuantity)){
            return "not found";
        }
        return inventoryQuantity;
    }

    public void setInventoryQuantity(String inventoryQuantity) {
        this.inventoryQuantity = inventoryQuantity;
    }
    public String getCustomDemandQuantity() {
        if(Objects.isNull(customDemandQuantity)){
            return "not found";
        }
        return customDemandQuantity;
    }
    public void setCustomDemandQuantity(String customDemandQuantity) {
        this.customDemandQuantity = customDemandQuantity;
    }


}
