package com.guo.shop.service;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.guo.shop.model.LinePayPackage;
import com.guo.shop.model.LineProductModel;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class LineOrderService {
    @JsonProperty("packages")
    private List<LinePayPackage> packageList = new ArrayList<LinePayPackage>();
    @JsonIgnore
    private List<LineProductModel> productList = new ArrayList<LineProductModel>();
    @JsonIgnore
    private LinePayPackage productPackage = new LinePayPackage();
    @JsonIgnore
    private int packageAmount = 0;
    private int amount =0;
    private String currency ="TWD";
    private String orderId ="";

    private Map<String ,String> redirectUrls = new HashMap<String,String>();

    public int generalProductPackageID() {
        return this.packageList.size()+1;

    }
    public void setRedirectUrls(Map<String, String> redirectUrls) {
        this.redirectUrls = redirectUrls;
    }
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    public void createNewPackage(String packageName,int userFee) {


        settlement();
        productPackage =new LinePayPackage();
        productPackage.setId(String.valueOf(generalProductPackageID()));
        productPackage.setName(packageName);
        productPackage.setUserFee(userFee);


    }
    public void appendProduct(LineProductModel product) {
        packageAmount += product.getPrice()*product.getQuantity();
        productList.add(product);
    }
    public void setProductList(List<LineProductModel> productList) {

        this.productList=productList;
    }
    public void settlement() {
        int amount=0;
        if(productList.size()!=0) {
            productPackage.setAmount(packageAmount);
            productPackage.setProductList(productList);
            packageAmount=0;
            productList = new ArrayList<LineProductModel>();
            packageList.add(productPackage);
        }
        for(LinePayPackage  productPackage: packageList) {
            amount += productPackage.getAmount()+productPackage.getUserFee();
        }
        this.amount =amount;

    }

    public  String toJson() throws JsonProcessingException {


        settlement();

        ObjectMapper mapper = new ObjectMapper();
        mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        String echoJson=mapper.writeValueAsString(this);
        packageList.clear();
        productList.clear();
        productPackage = new LinePayPackage();
        packageAmount = 0;
        orderId ="";
        amount =0;
        redirectUrls = new HashMap<String,String>();
        return	echoJson;
    }
}
