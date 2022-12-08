package shop.test;


import java.io.*;
import java.net.*;
import java.sql.ResultSet;
import java.time.Instant;
import java.util.*;

import com.fasterxml.jackson.databind.ObjectMapper;
//import com.mysql.jdbc.Driver;
import shop.config.*;
import shop.model.Product;

import com.fasterxml.jackson.core.JsonProcessingException;
import shop.repository.SqlConnectors;
import shop.repository.SqlConnectors.MysqlConnector;
import shop.service.LinePayService;
import shop.service.OrderService;

class Test {
    public static void main(String[] args) throws Exception {
    	
//    	MysqlConnector mysqlConnector= SqlConnectors.getMysqlConnector(ENV.get());
//    	ResultSet resultSet =mysqlConnector.query("select * from user_info");
    	
    	LinePayService linePayService =new LinePayService();    	
    	
    	
    	OrderService orderService =new OrderService();
    	
    	
    	
    	Product product =new  Product();
    	product.setId("yioyio");
    	product.setImageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7yLRnLSA2d86tAtikyNLD4QgL-Q4w5RIDIpoxaBo&s");
    	product.setName("Tonyyyy");
    	product.setPrice(99999);
    	product.setQuantity(1);
    	orderService.createNewPackage("new package", 0);
    	orderService.appendProduct(product);
    	
    	/*
    	
    	product =new  Product();
    	product.setId("AASDS");
    	product.setImageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7yLRnLSA2d86tAtikyNLD4QgL-Q4w5RIDIpoxaBo&s");
    	product.setName("wqqqweq");
    	product.setPrice(45);
    	product.setQuantity(3);
    	orderService.appendProduct(product);
    	
    	
    	
    	product =new  Product();
    	product.setId("33333");
    	product.setImageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7yLRnLSA2d86tAtikyNLD4QgL-Q4w5RIDIpoxaBo&s");
    	product.setName("asfdqawdsadsa");
    	product.setPrice(25);
    	product.setQuantity(3);
    	orderService.appendProduct(product);
    	*/
    	
    	
    	String lineOrderInfo = orderService.toJson();
    	System.out.println(lineOrderInfo);
    	
    	String channelId="1657083408";
    	String channelSecret="6536219bc4d260ed7321314185effa54";
    	String requestUrl =  "/v3/payments/request";
    	String requestBody = lineOrderInfo;
    	String nonce = String.valueOf(Instant.now().getEpochSecond());
    	System.out.println(nonce);
    	String data = channelSecret+requestUrl+requestBody+nonce;
    	String signature = linePayService.getPaymentUrl(data);
    	
    	
    	String linePayRequestUrl ="https://sandbox-api-pay.line.me/v3/payments/request";
        URL url = new URL(linePayRequestUrl);

        HttpURLConnection conn = (HttpURLConnection)url.openConnection();
        conn.setRequestMethod("POST");
        
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("X-LINE-ChannelId", channelId);
        conn.setRequestProperty("X-LINE-Authorization-Nonce", nonce);
        conn.setRequestProperty("X-LINE-Authorization", signature);
        conn.setRequestProperty("Content-Length", String.valueOf(requestBody.length()));
        conn.setDoOutput(true);
        conn.getOutputStream().write(requestBody.getBytes());
        
        String echo   = getEcho(conn.getInputStream());
        System.out.println(echo);

        


    	
    }
	private static String  getEcho(InputStream inputStream) throws IOException {
        Reader in = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
        StringBuffer sb = new StringBuffer(); 
        for (int c; (c = in.read()) >= 0;)
        	sb.append((char)c);
        return sb.toString();
		  
	}
}