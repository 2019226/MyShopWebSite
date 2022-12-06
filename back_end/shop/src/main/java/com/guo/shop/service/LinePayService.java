package com.guo.shop.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guo.shop.model.LineProductModel;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.Instant;
import java.util.*;

@Service
public class LinePayService {
    @Autowired
    LineOrderService lineOrderService;
    @Autowired
    MyToolService myToolService;
    @Autowired
    ShoppingCartService shoppingCartService ;
    static String linePayConfirmUrl;
    static String redirectLinePayConfirmUrl;
    static String redirectLinePayCancelUrl;
    static String channelId;
    static String channelSecret;
    static String linePayRequestUrl;
    static String linePayCaptureUrl;
    static String linePayVoidUrl;
    static String linePayRefundUrl;
    static String encryptionAlgorithm;
    static String baseUrl;
    @Value("${line.pay.base_url}")
    public  void setBaseUrl(String baseUrl) {
        LinePayService.baseUrl = baseUrl;
    }
    @Value("${line.pay.confirm_url}")
    public  void setLinePayConfirmUrl(String linePayConfirmUrl) {
        LinePayService.linePayConfirmUrl = linePayConfirmUrl;
    }
    @Value("${line.pay.channel_id}")
    public  void setChannelId(String channelId) {
        LinePayService.channelId = channelId;
    }
    @Value("${line.pay.channel_secret}")
    public  void setChannelSecret(String channelSecret) {
        LinePayService.channelSecret = channelSecret;
    }
    @Value("${line.pay.request_url}")
    public  void setLinePayRequestUrl(String linePayRequestUrl) {
        LinePayService.linePayRequestUrl = linePayRequestUrl;
    }
    @Value("${line.pay.encryption_algorithm}")
    public  void setEncryptionAlgorithm(String encryptionAlgorithm) {
        LinePayService.encryptionAlgorithm = encryptionAlgorithm;
    }
    @Value("${line.pay.capture_url}")
    public  void setLinePayCaptureUrl(String linePayCaptureUrl) {
        LinePayService.linePayCaptureUrl = linePayCaptureUrl;
    }
    @Value("${line.pay.void_url}")
    public void setLinePayVoidUrl(String linePayVoidUrl) {
        LinePayService.linePayVoidUrl = linePayVoidUrl;
    }
    @Value("${line.pay.redirect_confirm_url}")
    public  void setRedirectLinePayConfirmUrl(String redirectLinePayConfirmUrl) {
        LinePayService.redirectLinePayConfirmUrl = redirectLinePayConfirmUrl;
    }
    @Value("${line.pay.redirect_cancel_url}")
    public  void setRedirectLinePayCancelUrl(String redirectLinePayCancelUrl) {
        LinePayService.redirectLinePayCancelUrl = redirectLinePayCancelUrl;
    }
    @Value("${line.pay.refund_url}")
    public  void setLinePayRefundUrl(String linePayRefundUrl) {
        LinePayService.linePayRefundUrl = linePayRefundUrl;
    }

    public String gereralLinePaymentUrlByOrderInfo(String userId) throws IOException {
        String requestUrlToLineService = LinePayService.baseUrl+LinePayService.linePayRequestUrl;
        //訂單的初始設定
        Map<String,String> redirectUrls = new HashMap<String,String>();
        redirectUrls.put("confirmUrl", LinePayService.redirectLinePayConfirmUrl);
        redirectUrls.put("cancelUrl", LinePayService.redirectLinePayCancelUrl);
        lineOrderService.setOrderId(getOrderId());
        lineOrderService.setRedirectUrls(redirectUrls);
        String total = shoppingCartService.getTotalFromShoppingCart(userId);
        LineProductModel product =new LineProductModel();
        product.setId("1");
        product.setImageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7yLRnLSA2d86tAtikyNLD4QgL-Q4w5RIDIpoxaBo&s");
        product.setName("購物網站");
        product.setPrice(Integer.valueOf(total));
        product.setQuantity(1);
        lineOrderService.createNewPackage("new package", 0);
        lineOrderService.appendProduct(product);
        String lineOrderInfo = lineOrderService.toJson();
        String echo   = toLinePayService(LinePayService.linePayRequestUrl,lineOrderInfo);
        return echo;


    }


    public String  confirmOrderByTransactionId(String transactionId,String Amount) throws Exception {

        Map<String,String> params = new LinkedHashMap<>();
        params.put("amount", Amount);
        params.put("currency", "TWD");
        ObjectMapper objectMapper= new ObjectMapper();
        String data =objectMapper.writeValueAsString(params);
        String url = linePayConfirmUrl.replace("{transactionId}",transactionId);
        return toLinePayService(url,data);


    }
    public String captureOrderByTransactionId(String transactionId) throws Exception {

        Map<String,String> params = new LinkedHashMap<>();
        params.put("amount", "350");
        params.put("currency", "TWD");
        ObjectMapper objectMapper= new ObjectMapper();
        String data =objectMapper.writeValueAsString(params);
        String url = linePayCaptureUrl.replace("{transactionId}",transactionId);
        return toLinePayService(url,data);


    }
    public String voidOrderByTransactionId(String transactionId) throws Exception {

        Map<String,String> params = new LinkedHashMap<>();
        params.put("amount", "350");
        params.put("currency", "TWD");
        ObjectMapper objectMapper= new ObjectMapper();
        String data =objectMapper.writeValueAsString(params);
        String url = linePayVoidUrl.replace("{transactionId}",transactionId);
        return toLinePayService(url,data);


    }
    public String refundOrderByTransactionId(String transactionId,String amount) throws Exception {

        Map<String,String> params = new LinkedHashMap<>();
        params.put("refundAmount", amount);
        ObjectMapper objectMapper= new ObjectMapper();
        String data =objectMapper.writeValueAsString(params);
        String url = linePayRefundUrl.replace("{transactionId}",transactionId);
        return toLinePayService(url,data);

    }
    private String getOrderId(){
        String nonce = String.valueOf(Instant.now().getEpochSecond());
        return nonce;
    }
    public static String getSignature(String data) {


        String secretMessage="";
        byte[] byteArrTmp ;

        Mac mac = HmacUtils.getInitializedMac(encryptionAlgorithm, LinePayService.channelSecret.getBytes());
        byteArrTmp = mac.doFinal(data.getBytes());
        byteArrTmp = Base64.encodeBase64(byteArrTmp);
        secretMessage =   new String(byteArrTmp);
        return secretMessage;
    }
    public static String toLinePayService(String whatTypeOfThisRequestToLineService, String requestData) throws IOException {
        String requestUrlToLineService = LinePayService.baseUrl+whatTypeOfThisRequestToLineService;


        String nonce = String.valueOf(Instant.now().getEpochSecond());
        //取得簽章
        String data = channelSecret+whatTypeOfThisRequestToLineService+requestData+nonce;
        byte[] byteArrTmp ;
        Mac mac = HmacUtils.getInitializedMac(encryptionAlgorithm, LinePayService.channelSecret.getBytes());
        byteArrTmp = mac.doFinal(data.getBytes());
        byteArrTmp = Base64.encodeBase64(byteArrTmp);
        String signature =  new String(byteArrTmp);
        //向LinePayService提出請求
        URL url = new URL(requestUrlToLineService);
        HttpURLConnection conn = (HttpURLConnection)url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("X-LINE-ChannelId", LinePayService.channelId);
        conn.setRequestProperty("X-LINE-Authorization-Nonce", nonce);
        conn.setRequestProperty("X-LINE-Authorization", signature);
        conn.setRequestProperty("Content-Length", String.valueOf(requestData.length()));
        conn.setDoOutput(true);
        conn.getOutputStream().write(requestData.getBytes());
        String echo   = MyToolService.getRemoteServiceResponseContent(conn.getInputStream());
        return echo;

    }
}
