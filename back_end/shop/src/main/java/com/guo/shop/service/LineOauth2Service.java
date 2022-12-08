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
public class LineOauth2Service {
    @Autowired
    MyToolService myToolService;
    @Autowired
    UserService userService;

    public static String verifyIdTokenUrl;

    public static String lineAccessTokenApiUrl;

    public static String clientId;

    public static String clientSecret;

    public static String verifyAccessTokenUrl;


    public static String refreshAccessTokenUrl;

    public static String revokeAccessTokenUrl;

    public static String redirectUrl;

    public static String scope;


    @Value("${line.oauth2.access_token_url}")
    public  void setLineAccessTokenApiUrl(String lineAccessTokenApiUrl) {
        LineOauth2Service.lineAccessTokenApiUrl = lineAccessTokenApiUrl;
    }
    @Value("${line.oauth2.login.client_id}")
    public  void setClientId(String clientId) {
        LineOauth2Service.clientId = clientId;
    }
    @Value("${line.oauth2.login.client_secret}")
    public  void setClientSecret(String clientSecret) {
        LineOauth2Service.clientSecret = clientSecret;
    }
    @Value("${line.oauth2.verify_access_token_url}")
    public  void setVerifyAccessTokenUrl(String verifyAccessTokenUrl) {
        LineOauth2Service.verifyAccessTokenUrl = verifyAccessTokenUrl;
    }
    @Value("${line.oauth2.refresh_access_token_url}")
    public  void setRefreshAccessTokenUrl(String refreshAccessTokenUrl) {
        LineOauth2Service.refreshAccessTokenUrl = refreshAccessTokenUrl;
    }
    @Value("${line.oauth2.revoke_access_token_url}")
    public  void setRevokeAccessTokenUrl(String revokeAccessTokenUrl) {
        LineOauth2Service.revokeAccessTokenUrl = revokeAccessTokenUrl;
    }
    @Value("${line.oauth2.login.redirect_url}")
    public  void setAfterGetCodeRedirectUrl(String redirectUrl) {
        LineOauth2Service.redirectUrl = redirectUrl;
    }
    @Value("${line.oauth2.verify_id_token_url}")
    public  void setVerifyIdTokenUrl(String verifyIdTokenUrl) {
        LineOauth2Service.verifyIdTokenUrl = verifyIdTokenUrl;
    }
    @Value("${line.oauth2.login.scope}")
    public  void setScope(String scope) {
        LineOauth2Service.scope = scope;
    }
    public String getAccessToken(String code) throws Exception {
        URL url = new URL(lineAccessTokenApiUrl);
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


    public boolean isValidityAccessToken(String accessToken) throws Exception {
        Map<String,String> params = new LinkedHashMap<>();
        params.put("access_token",accessToken);
        URL url=myToolService.createQueryParamterUri(verifyAccessTokenUrl,params);
        HttpURLConnection conn = (HttpURLConnection)url.openConnection();
        conn.setRequestMethod("GET");
        int statusCode = conn.getResponseCode();
        if(statusCode==200){
            return true;
        }else if(statusCode==400){
            return false;
        }
        throw new Exception("發生不知名錯誤");
    }


    public String refreshAccessToken(String needRefreshToken) throws Exception {
        URL url = new URL(refreshAccessTokenUrl);
        Map<String,String> params = new LinkedHashMap<>();
        params.put("grant_type", "refresh_token");
        params.put("refresh_token", needRefreshToken);
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


    public boolean revokeAccessToken(String needRevokeToken) throws Exception {
        URL url = new URL(revokeAccessTokenUrl);
        Map<String,String> params = new LinkedHashMap<>();
        params.put("access_token", needRevokeToken);
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
            return true;
        }
        throw new Exception("發生不知名錯誤");
    }
    public String getAccessCodeUrl() throws UnknownHostException {
        int randomNumber = 0;
        randomNumber = (int)(Math.random()*100000)+1;
        StringBuilder url =new StringBuilder("https://access.line.me/oauth2/v2.1/authorize");
        url.append("?");
        url.append("response_type=code").append("&");
        url.append("client_id="+ clientId).append("&");
        url.append("redirect_uri="+ redirectUrl).append("&");
        url.append("state="+ String.valueOf(randomNumber)).append("&");
        url.append("scope="+scope).append("&");
        url.append("nonce=09876xyz").append("&");
        url.append("initial_amr_display=lineqr");

        return url.toString();
    }
    public  UserModel getUserInfoByIdToken(String idToken) throws Exception {
        UserService uesrService = new UserService();
        UserModel userModel;
        URL url = new URL(verifyIdTokenUrl);
        Map<String,String> params = new LinkedHashMap<>();
        params.put("id_token", idToken);
        params.put("client_id", clientId);


        byte[] postDataBytes = myToolService.convertToDataBytes(params);
        HttpURLConnection conn = (HttpURLConnection)url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
        conn.setDoOutput(true);
        conn.getOutputStream().write(postDataBytes);
        int statusCode = conn.getResponseCode();
        String echo="";
        if(statusCode==200){
            echo   = myToolService.getRemoteServiceResponseContent(conn.getInputStream());
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> userInfo = objectMapper.readValue(echo, new TypeReference<HashMap<String, Object>>() {});

            userModel = userService.getUserById(userInfo.get("sub").toString());
            if(userModel==null){
                userModel =new UserModel();
                userModel.setId(userInfo.get("sub").toString());
                userModel.setEmail(userInfo.get("email").toString());
                //可能沒有頭像
                userModel.setPicture(null);
                if(userInfo.get("picture")!=null){
                    userModel.setPicture(userInfo.get("picture").toString());
                }
                userModel.setLoginType("line");
                userModel.setName(userInfo.get("name").toString());
                userModel=userService.createUser(userModel);
            }
            return userModel;


        }else if(statusCode==400){
            echo   = myToolService.getRemoteServiceResponseContent(conn.getErrorStream());
            System.out.println(echo);
        }
        throw new Exception("發生不知名錯誤");

    }


}
