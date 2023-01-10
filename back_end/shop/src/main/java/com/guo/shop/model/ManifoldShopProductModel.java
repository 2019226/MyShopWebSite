package com.guo.shop.model;

import com.guo.shop.service.MyToolService;

import java.util.Objects;

public class ManifoldShopProductModel extends  BaseShopProductModel {
    public boolean isAddToCart;

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
}
