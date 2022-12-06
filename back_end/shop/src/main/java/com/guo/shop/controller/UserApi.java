package com.guo.shop.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.guo.shop.model.ShopProductModel;
import com.guo.shop.model.UserModel;
import com.guo.shop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/backend")
public class UserApi {
    @Autowired
    UserService userService;


    @PostMapping("/shop/user/login")
    public ResponseEntity getUserByEmailAndPassword(@RequestBody UserModel tryToFindThisUserModel , HttpSession session ) throws IOException {

        UserModel userModel = userService.getUserByEmailAndPassword(tryToFindThisUserModel);
        Map needRedirect = new HashMap<String,String>();
        needRedirect.put("redirectUrl","./home.html");
        ResponseEntity responseEntity = new ResponseEntity(needRedirect,HttpStatus.OK);
        if(userModel==null){
            responseEntity = new ResponseEntity(HttpStatus.BAD_REQUEST);
            return responseEntity;
        }
        session.setAttribute("id",userModel.getId());
        session.setAttribute("name",userModel.getName());
        session.setAttribute("loginType",userModel.getLoginType());
        session.setAttribute("picture",userModel.getPicture());
        session.setAttribute("email",userModel.getEmail());
        if(userModel.getEmail().equals("admin@mywebsite")){
            needRedirect.put("redirectUrl","./backstageManagement.html");
            responseEntity = new ResponseEntity(needRedirect,HttpStatus.OK);
        }

        return responseEntity;
    }
    @PostMapping("/shop/user/password/change")
    public ResponseEntity changePassword(@RequestBody UserModel tryToFindThisUserModel , HttpSession session ) throws IOException {

        boolean isChangePassword = userService.changePassword(tryToFindThisUserModel);
        ResponseEntity responseEntity = new ResponseEntity(HttpStatus.OK);
        if(!isChangePassword){
            responseEntity = new ResponseEntity(HttpStatus.BAD_REQUEST);
            return responseEntity;
        }
        return responseEntity;
    }
    @PostMapping("/shop/user")
    public ResponseEntity createUser(@RequestBody UserModel userModel) throws IOException {
        userModel.setLoginType("webSite");
        UserModel newUserModel = userService.createUser(userModel);
        ResponseEntity responseEntity = new ResponseEntity(newUserModel,HttpStatus.OK);
        if(newUserModel==null){
            responseEntity = new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        return responseEntity;
    }
    @GetMapping("/shop/user/info")
    public ResponseEntity getUserInfo(HttpSession session) throws Exception {

        if(Objects.isNull(session.getAttribute("id"))){
            Map<String,String> errorMessage = new HashMap<String,String>();
            errorMessage.put("status","error");
            errorMessage.put("type","valid authentication");
            errorMessage.put("message","請先登入");
            ResponseEntity responseEntity = new ResponseEntity(errorMessage,HttpStatus.FORBIDDEN);
            return responseEntity;
        }
        UserModel userModel = userService.getUserById(session.getAttribute("id").toString());
        ResponseEntity responseEntity = new ResponseEntity(userModel,HttpStatus.OK);
        return responseEntity;
    }
    @GetMapping("/shop/user/logout")
    public ResponseEntity logout( HttpSession session) throws MalformedURLException, URISyntaxException, UnknownHostException {

        session.removeAttribute("id");
        HttpHeaders headers = new HttpHeaders();
        headers.add("Location", "/login.html");
        ResponseEntity responseEntity =new ResponseEntity(null,headers, HttpStatus.TEMPORARY_REDIRECT);
        return responseEntity;
    }
    @GetMapping("/shop/user/admin")
    public ResponseEntity getRole( HttpSession session) throws MalformedURLException, URISyntaxException, UnknownHostException {
        ResponseEntity responseEntity =  new ResponseEntity(HttpStatus.BAD_REQUEST);
        if(Objects.isNull(session.getAttribute("id"))){
            return responseEntity;
        }
        UserModel userModel = userService.getUserById(session.getAttribute("id").toString());
        if(userModel.getEmail().equals("admin@mywebsite")){
            responseEntity= new ResponseEntity(HttpStatus.OK);

        }
        return responseEntity;

    }
}
