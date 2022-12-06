package com.guo.shop.service;

import org.springframework.stereotype.Service;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

@Service
public class MyToolService {
    public static byte[] convertToDataBytes(Map<String,String> params) throws IOException {
        StringBuilder postData = new StringBuilder();
        for (Map.Entry<String, String> param : params.entrySet()) {
            if (postData.length() != 0) postData.append('&');
            postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
            postData.append('=');
            postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
        }
        byte[] postDataBytes = postData.toString().getBytes("UTF-8");
        return postDataBytes;

    }
    public static String  getRemoteServiceResponseContent(InputStream inputStream) throws IOException {
        Reader in = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
        StringBuffer sb = new StringBuffer();
        for (int c; (c = in.read()) >= 0;)
            sb.append((char)c);
        return sb.toString();

    }
    public static URL createQueryParamterUri(String uri, Map<String,String> paramsMap) throws URISyntaxException, MalformedURLException {
        URL oldUri = new URL(uri);
        StringBuilder newUrl = new StringBuilder(oldUri.toString());
        if (oldUri.getQuery() == null) {
            newUrl = new StringBuilder(oldUri.toString());
            newUrl.append("?");
        }
        for (Map.Entry<String, String> entry : paramsMap.entrySet()) {
            newUrl.append(entry.getKey()+"="+entry.getValue()+"&");
        }
        newUrl.replace(newUrl.length()-1,newUrl.length(),"");
        return new URL(newUrl.toString());
    }
    public static String getRandomString(int length) {
        char[] chars = new char[length];
        int random = 0;
        for (int i = 0; i < chars.length; i++) {
            random = (int) ((Math.random() * 10) % 3);
            switch (random) {
                case 0:
                    chars[i] = (char) (48 + (int) (Math.random() * 10));
                    break;
                case 1:
                    chars[i] = (char) (97 + (int) (Math.random() * 26));
                    break;
                case 2:
                    chars[i] = (char) (65 + (int) (Math.random() * 26));
                    break;

            }

        }
        return String.valueOf(chars);
    }
    public static Map<String,String> writeErrorDescribe(String messageToClient){
        Map<String,String> map =new HashMap<String,String>();
        map.put("status","error");
        map.put("message",messageToClient);
        return map;
    }
}
