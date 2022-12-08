package com.guo.shop.controller;

import com.guo.shop.model.ShopProductModel;
import com.guo.shop.model.UserModel;
import com.guo.shop.service.MyToolService;
import com.guo.shop.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/backend")
public class ShoppingCartApi {
    @Autowired
    ShoppingCartService shoppingCartService;

    @PostMapping("/shoppingCart/product")
    public ResponseEntity addProductToShoppingCart(@RequestBody Map<String,String> productInfoMap, HttpSession session) throws Exception {
        shoppingCartService.setUser((String)session.getAttribute("id"));
        boolean isSuccessful=shoppingCartService.appendProduct(productInfoMap.get("productId"),Integer.parseInt(productInfoMap.get("demandQuantity")));
        ResponseEntity responseEntity =new ResponseEntity(HttpStatus.OK);
        if(!isSuccessful){
            responseEntity =new ResponseEntity(
                    MyToolService.writeErrorDescribe("系統發生錯誤,請嘗試將此商品移除後再放入購物車"),
                    HttpStatus.BAD_REQUEST
            );
        }


        return responseEntity;
    }
    @DeleteMapping("/shoppingCart/product/{productId}")
    public ResponseEntity deleteProductInShoppingCart(@PathVariable("productId")String productId , HttpSession session) throws Exception {
        shoppingCartService.setUser((String)session.getAttribute("id"));
        shoppingCartService.deleteProduct(productId);
        ResponseEntity responseEntity =new ResponseEntity(HttpStatus.OK);
        return responseEntity;
    }
    @GetMapping("/shoppingCart/product")
    public ResponseEntity productInShoppingCartList(HttpSession session) throws Exception {
        shoppingCartService.setUser((String)session.getAttribute("id"));
        List<Map<String,String>> productList= shoppingCartService.getList();
        ResponseEntity responseEntity =new ResponseEntity(productList,HttpStatus.OK);
        return responseEntity;
    }
    @GetMapping("/shoppingCart/amount")
    public ResponseEntity getAmount(HttpSession session){
        Object userId =session.getAttribute("id");
        ResponseEntity responseEntity =new ResponseEntity("0",HttpStatus.OK);
        if(userId!=null){
            String amount = shoppingCartService.getAmountFromShoppingCart(userId.toString());
            responseEntity =new ResponseEntity(amount,HttpStatus.OK);
        }
        return responseEntity;
    }
    @GetMapping("/shoppingCart/checkout")
    public ResponseEntity checkout(HttpSession session){
        Object userId =session.getAttribute("id");
        ResponseEntity responseEntity = new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
        if(userId!=null){
            boolean canCreateOrder = shoppingCartService.checkOutHandle(userId.toString());
            if(canCreateOrder){
                responseEntity =new ResponseEntity<String>(HttpStatus.OK);
            }

        }
        return responseEntity;


    }
}
