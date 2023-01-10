package com.guo.shop.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.guo.shop.model.BaseShopProductModel;
import com.guo.shop.model.ManifoldShopProductModel;
import com.guo.shop.service.FileService;
import com.guo.shop.service.ShopProductService;
import com.guo.shop.service.UserService;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/backend")
public class ShopProductApi {
    @Autowired
    ShopProductService shopProductService;
    @Autowired
    UserService userService;
    @Autowired
    FileService fileService;

    @PostMapping("/shop/product")
    public ResponseEntity createProduct(HttpSession session,@RequestPart("productImg")MultipartFile  productImg, @RequestPart("product")String productInfoJson) throws IOException {
        boolean isAdmin = userService.isAdmin(session.getAttribute("id"));
        ResponseEntity responseEntity ;
        if(isAdmin) {
            ObjectMapper objectMapper = new ObjectMapper();
            HashMap<String, String> productMap = objectMapper.readValue(productInfoJson, new TypeReference<HashMap<String, String>>() {
            });
            BaseShopProductModel product = new BaseShopProductModel();
            product.setId(productMap.get("id"));
            product.setName(productMap.get("name"));
            product.setPrice(productMap.get("price"));
            product.setDescribe(productMap.get("describe"));
            product.setQuantity(productMap.get("quantity"));
            product.setImageUrl(fileService.createFileThenReturnPath(productImg));
            shopProductService.createProduct(product);
            responseEntity = new ResponseEntity(product, HttpStatus.OK);
            return responseEntity;
        }
        responseEntity = new ResponseEntity( HttpStatus.BAD_REQUEST);
        return responseEntity;
    }
    @GetMapping("/shop/product/{productId}")
    public ResponseEntity getProductList(@PathVariable("productId") String id){
        BaseShopProductModel product=shopProductService.getProductById(id);
        ResponseEntity responseEntity;
        if(product==null){
            responseEntity = new ResponseEntity(HttpStatus.BAD_REQUEST);
            return responseEntity;
        }
        responseEntity = new ResponseEntity(product,HttpStatus.OK);
        return responseEntity;
    }
    @GetMapping("/shop/product")
    public ResponseEntity getProductList(HttpSession session){
        List<ManifoldShopProductModel> productList=shopProductService.getProductList();
        ResponseEntity responseEntity = new ResponseEntity(productList,HttpStatus.OK);
        String userId = session.getAttribute("id")==null?null:session.getAttribute("id").toString();
        if(userId!=null){
            productList=shopProductService.getProductList(userId);
            responseEntity = new ResponseEntity(productList,HttpStatus.OK);
        }
        return responseEntity;
    }
    @DeleteMapping("/shop/product/{productId}")
    public ResponseEntity deleteProductById(HttpSession session,@PathVariable("productId") String id){

        boolean isAdmin = userService.isAdmin(session.getAttribute("id"));
        ResponseEntity responseEntity;
        if(isAdmin) {
            boolean isDelete = shopProductService.deleteProductById(id);
            if (isDelete) {
                responseEntity = new ResponseEntity(HttpStatus.OK);
                return responseEntity;
            }
        }
        responseEntity = new ResponseEntity(HttpStatus.BAD_REQUEST);
        return responseEntity;
    }
    @PutMapping("/shop/product/{productId}")
    public ResponseEntity UpdateProductById(HttpSession session,@PathVariable("productId") String id,@RequestPart("product")String productInfoJson,@RequestPart("productImg")MultipartFile  productImg) throws IOException {
        boolean isAdmin = userService.isAdmin(session.getAttribute("id"));
        ResponseEntity responseEntity;
        if(isAdmin) {
            ObjectMapper objectMapper = new ObjectMapper();
            HashMap<String, String> productMap = objectMapper.readValue(productInfoJson, new TypeReference<HashMap<String, String>>() {
            });
            BaseShopProductModel product = new BaseShopProductModel();
            product.setId(productMap.get("id"));
            product.setName(productMap.get("name"));
            product.setPrice(productMap.get("price"));
            product.setDescribe(productMap.get("describe"));
            product.setQuantity(productMap.get("quantity"));
            if (!productImg.isEmpty()) {
                product.setImageUrl(fileService.createFileThenReturnPath(productImg));
            }
            boolean isUpdate = shopProductService.updateProductById(id, product);
            if (isUpdate) {
                responseEntity = new ResponseEntity(HttpStatus.OK);
                return responseEntity;
            }
        }
        responseEntity = new ResponseEntity(HttpStatus.BAD_REQUEST);
        return responseEntity;


    }
    @GetMapping("/shop/product/image/{productId}")
    public void getProductImage(@PathVariable("productId") String id  ,@RequestParam String rand, HttpServletResponse response) throws IOException {
        File file = shopProductService.getProductImageById(id);
        if(file==null){
            response.setStatus(400);
            return;
        }
        InputStream inputStream = new FileInputStream(file); //load the file
        IOUtils.copy(inputStream, response.getOutputStream());
        response.flushBuffer();
    }

}
