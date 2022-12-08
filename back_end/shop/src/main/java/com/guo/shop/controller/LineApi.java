package com.guo.shop.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.guo.shop.model.UserModel;
import com.guo.shop.service.LineOauth2Service;
import com.guo.shop.service.LinePayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/backend")
public class LineApi {
    @Autowired
    LineOauth2Service lineOauth2Service;
    @Autowired
    LinePayService linePayService;
    @GetMapping("/redirection/line/login")
    public ResponseEntity lineLogin(@RequestParam(value="code") Optional<String> code, @RequestParam(value="state") Optional<String> state, HttpSession session) throws Exception {
        //當使用者登入後會回傳query parameter code和 state(暫時沒用)
        if(code.isPresent()&&state.isPresent()) {
            String json = lineOauth2Service.getAccessToken(code.get());
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> tokenInfo = objectMapper.readValue(json, new TypeReference<HashMap<String, String>>() {});
            UserModel userModel = lineOauth2Service.getUserInfoByIdToken(tokenInfo.get("id_token"));
            session.setAttribute("id",userModel.getId());

            HttpHeaders headers = new HttpHeaders();
            headers.add("Location", "/loginSuccess.html");
            ResponseEntity responseEntity = new ResponseEntity<String>(headers,HttpStatus.TEMPORARY_REDIRECT);
            return responseEntity;

        }

        // 前端嘗試使用line login 登入
        // 但是沒夾帶query parameter
        // 就回傳line登入畫面(依照Line官方文件建立URL)
        String lineLoginCodeUrl=lineOauth2Service.getAccessCodeUrl();
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(new URL(lineLoginCodeUrl).toURI());
        ResponseEntity responseEntity =new ResponseEntity(null,headers, HttpStatus.TEMPORARY_REDIRECT);
        return  responseEntity;
    }
    @GetMapping("/linepay/getPaymentUrl")
    public ResponseEntity getLinePayUrl(HttpSession session) throws IOException, URISyntaxException {
        ResponseEntity responseEntity = new ResponseEntity(HttpStatus.BAD_REQUEST);
        if(session.getAttribute("id")==null){
            return responseEntity;
        }
        String userId = session.getAttribute("id").toString();

        String paymentUrlInfoJson  = linePayService.gereralLinePaymentUrlByOrderInfo(userId);
        ObjectMapper objectMapper =new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(paymentUrlInfoJson);
        String paymentUrl  = jsonNode.get("info").get("paymentUrl").get("web").asText();
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(new URI(paymentUrl));
        responseEntity = new ResponseEntity(headers,HttpStatus.SEE_OTHER);
        return responseEntity;
    }
    @Deprecated
    @GetMapping("/linepay/refund")
    public ResponseEntity refundOrder(@RequestParam(value="transactionId") String transactionId) throws Exception {

        //跟資料庫串接回傳linePay對應格式
        String paymentUrl  = linePayService.refundOrderByTransactionId(transactionId,"0000");
        ResponseEntity responseEntity = new ResponseEntity(paymentUrl,HttpStatus.OK);
        return responseEntity;
    }
    @Deprecated
    @GetMapping("/linepay/confirm")
    public ResponseEntity confirmOrder(@RequestParam(value="transactionId") String transactionId) throws Exception {

        //跟資料庫串接回傳linePay對應格式
        String paymentUrl  = linePayService.confirmOrderByTransactionId(transactionId,"0000");
        ResponseEntity responseEntity = new ResponseEntity(paymentUrl,HttpStatus.OK);
        return responseEntity;
    }
    @Deprecated
    @GetMapping("/linepay/capture")
    public ResponseEntity capturerder(@RequestParam(value="transactionId") String transactionId) throws Exception {

        //跟資料庫串接回傳linePay對應格式
        String paymentUrl  = linePayService.captureOrderByTransactionId(transactionId);
        ResponseEntity responseEntity = new ResponseEntity(paymentUrl,HttpStatus.OK);
        return responseEntity;
    }
    @Deprecated
    @GetMapping("/linepay/void")
    public ResponseEntity voidOrder(@RequestParam(value="transactionId") String transactionId) throws Exception {

        //跟資料庫串接回傳linePay對應格式
        String paymentUrl  = linePayService.voidOrderByTransactionId(transactionId);
        ResponseEntity responseEntity = new ResponseEntity(paymentUrl,HttpStatus.OK);
        return responseEntity;
    }


}
