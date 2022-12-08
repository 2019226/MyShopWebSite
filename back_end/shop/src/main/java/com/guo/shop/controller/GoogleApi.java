package com.guo.shop.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.guo.shop.model.UserModel;
import com.guo.shop.service.GoogleOauth2Service;
import com.guo.shop.service.LineOauth2Service;
import com.guo.shop.service.LinePayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/backend")
public class GoogleApi {
    @Autowired
    GoogleOauth2Service googleOauth2Service;

    @GetMapping("/redirection/google/login")
    public ResponseEntity googleLogin(@RequestParam(value="code") Optional<String> code, @RequestParam(value="state") Optional<String> state, HttpSession session) throws Exception {
        //當使用者登入後會回傳query parameter code和 state(暫時沒用)
        if(code.isPresent()&&state.isPresent()) {
            String json = googleOauth2Service.getAccessToken(code.get());
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> tokenInfo = objectMapper.readValue(json, new TypeReference<HashMap<String, String>>() {});
//            //抓取使用者資訊
            UserModel userModel = googleOauth2Service.getUserInfoByIdToken(tokenInfo.get("id_token"));
            session.setAttribute("id",userModel.getId());

            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(new URL("http://127.0.0.1/loginSuccess.html").toURI());
            ResponseEntity responseEntity =new ResponseEntity(null,headers, HttpStatus.TEMPORARY_REDIRECT);
            return responseEntity;
        }
        String loginCodeUrl=googleOauth2Service.getAccessCodeUrl();
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(new URL(loginCodeUrl).toURI());
        ResponseEntity responseEntity =new ResponseEntity(null,headers, HttpStatus.TEMPORARY_REDIRECT);
        return  responseEntity;
    }



}
