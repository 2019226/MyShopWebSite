package com.guo.shop.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.guo.shop.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.*;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
@Service
public class GoogleOauth2Service {
    @Autowired
    MyToolService myToolService;
    @Autowired
    UserService userService;
    public static String clientId;
    public static String redirectUrl;
    public static String scope;
    public static String googleAccessTokenApiUrl;
    public static String clientSecret;
    public static String googleUserInfoApiUrl;
    public static String verifyIdTokenUrl;

    @Value("${google.oauth2.login.client_id}")
    public  void setClientId(String clientId) {
        GoogleOauth2Service.clientId = clientId;
    }
    @Value("${google.oauth2.login.redirect_url}")
    public  void setRedirectUrl(String redirectUrl) {
        GoogleOauth2Service.redirectUrl = redirectUrl;
    }
    @Value("${google.oauth2.login.scope}")
    public  void setScope(String scope) {
        GoogleOauth2Service.scope = scope;
    }
    @Value("${google.oauth2.access_token_url}")
    public  void setGoogleAccessTokenApiUrl(String googleAccessTokenApiUrl) {
        GoogleOauth2Service.googleAccessTokenApiUrl = googleAccessTokenApiUrl;
    }
    @Value("${google.oauth2.login.client_secret}")
    public  void setClientSecret(String clientSecret) {
        GoogleOauth2Service.clientSecret = clientSecret;
    }
    @Value("${google.oauth2.login.client_secret}")
    public  void setGoogleUserInfoApiUrl(String googleUserInfoApiUrl) {
        GoogleOauth2Service.googleUserInfoApiUrl = googleUserInfoApiUrl;
    }
    @Value("${google.oauth2.verify_id_token_url}")
    public  void setVerifyIdTokenUrl(String verifyIdTokenUrl) {
        GoogleOauth2Service.verifyIdTokenUrl = verifyIdTokenUrl;
    }




    public String getAccessToken(String code) throws Exception {
        URL url = new URL(googleAccessTokenApiUrl);
        Map<String,String> params = new LinkedHashMap<>();
        params.put("grant_type", "authorization_code");
        params.put("code", code);
        params.put("redirect_uri", redirectUrl);
        params.put("client_id", clientId);
        params.put("client_secret", clientSecret);

        byte[] postDataBytes = myToolService.convertToDataBytes(params);
        HttpURLConnection conn = (HttpURLConnection)url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
        conn.setDoOutput(true);
        conn.getOutputStream().write(postDataBytes);
        int statusCode = conn.getResponseCode();
        if(statusCode==200){
            String echo   = myToolService.getRemoteServiceResponseContent(conn.getInputStream());
            return echo;
        }else if(statusCode==400){
            String echo   = myToolService.getRemoteServiceResponseContent(conn.getErrorStream());
            return echo;
        }
        throw new Exception("發生不知名錯誤");

    }
    public  UserModel getUserInfoByIdToken(String idToken) throws Exception {
        UserModel userModel;

        Map<String,String> params = new LinkedHashMap<>();
        params.put("id_token",idToken);
        URL url=myToolService.createQueryParamterUri(verifyIdTokenUrl,params);
        HttpURLConnection conn = (HttpURLConnection)url.openConnection();
        conn.setRequestMethod("GET");
        int statusCode = conn.getResponseCode();
        String echo="";
        if(statusCode==200){
            echo   = myToolService.getRemoteServiceResponseContent(conn.getInputStream());
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> userInfo = objectMapper.readValue(echo, new TypeReference<HashMap<String, String>>() {});
            userModel = userService.getUserById(userInfo.get("sub"));
            if(userModel==null){
                userModel =new UserModel();
                userModel.setId(userInfo.get("sub"));
                userModel.setEmail(userInfo.get("email"));
                //可能沒有頭像
                userModel.setPicture(null);
                if(userInfo.get("picture")!=null){
                    userModel.setPicture(userInfo.get("picture").toString());
                }
                userModel.setLoginType("google");
                userModel.setName(userInfo.get("name"));
                userModel=userService.createUser(userModel);
            }
            return userModel;

        }else if(statusCode==400){
            echo   = myToolService.getRemoteServiceResponseContent(conn.getErrorStream());
            System.out.println(echo);
        }
        throw new Exception("發生不知名錯誤");

    }
    public String getAccessCodeUrl() throws UnknownHostException {

        int randomNumber = 0;
        randomNumber = (int)(Math.random()*100000)+1;
        StringBuilder url =new StringBuilder("https://accounts.google.com/o/oauth2/v2/auth");
        url.append("?");
        url.append("scope="+scope).append("&");
        url.append("access_type=offline").append("&");
        url.append("include_granted_scopes=true").append("&");
        url.append("response_type=code&").append("&");
        url.append("state="+ String.valueOf(randomNumber)).append("&");
        url.append("redirect_uri="+ redirectUrl).append("&");
        url.append("client_id="+ clientId);

        return url.toString();
    }



}
