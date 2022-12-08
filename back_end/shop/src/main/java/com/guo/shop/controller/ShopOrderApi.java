package com.guo.shop.controller;

import com.guo.shop.service.ShopOrderService;
import com.guo.shop.service.UserService;
import org.apache.http.Header;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/backend")
public class ShopOrderApi {
    @Autowired
    ShopOrderService shopOrderService;

    @PostMapping("/shop/order")
    public ResponseEntity createOrder(HttpSession session,@RequestParam(value="orderId")String orderId,@RequestParam(value="transactionId")String transactionId, @RequestBody Map<String,String> orderInfoMap) throws Exception {
        Object userId =session.getAttribute("id");
        ResponseEntity responseEntity =new ResponseEntity(HttpStatus.OK);
        if(userId!=null){
            boolean isCreateOrder = shopOrderService.createOrder(userId.toString(),orderId,transactionId,orderInfoMap);
            if(!isCreateOrder){
                responseEntity = new ResponseEntity( HttpStatus.BAD_REQUEST);
            }
        }
        return responseEntity;
    }
    @GetMapping("/shop/order")
    public ResponseEntity getOrderListByStatus(HttpSession session,@RequestParam(value="status")String status){
        Object userId =session.getAttribute("id");
        ResponseEntity responseEntity =new ResponseEntity(HttpStatus.BAD_REQUEST);
        if(userId!=null){
            List<Map<String, Object>> data = shopOrderService.getOrderListByStatus(userId.toString(),status);
            responseEntity = new ResponseEntity( data,HttpStatus.OK);
        }
        return responseEntity;
    }
    @GetMapping("/shop/order/{orderId}")
    public ResponseEntity getOrderInfoById(HttpSession session,@PathVariable(value="orderId")String orderId){
        Object userId =session.getAttribute("id");
        ResponseEntity responseEntity;
        if(userId!=null) {
            Map<String, Object> data = shopOrderService.getOrderInfoByOrderId(userId.toString(),orderId);
            responseEntity = new ResponseEntity(data, HttpStatus.OK);
            return responseEntity;
        }
        responseEntity = new ResponseEntity( HttpStatus.BAD_REQUEST);
        return responseEntity;
    }
    @PutMapping("/shop/order/{orderId}/{newStatus}")
    public ResponseEntity changeOrderStatus(HttpSession session,@PathVariable(value="orderId")String orderId,@PathVariable(value="newStatus")String newStatus) throws Exception {
        Object userId =session.getAttribute("id");
        ResponseEntity responseEntity =new ResponseEntity(HttpStatus.BAD_REQUEST);
        if(userId!=null){
            boolean isChange = shopOrderService.changeOrderStatus(userId.toString(),orderId,newStatus);
            Map<String, Object> processInfo = shopOrderService.getDeliveryInfo(orderId);
            responseEntity = new ResponseEntity( processInfo, HttpStatus.OK);
            if(!isChange){
                responseEntity = new ResponseEntity( HttpStatus.BAD_REQUEST);
            }
        }

        return responseEntity;
    }
    @GetMapping("/shop/order/{orderId}/excel")
    public ResponseEntity exportExcelOrderInfoById(HttpSession session,@PathVariable(value="orderId")String orderId) throws IOException {
        Object userId =session.getAttribute("id");
        InputStream in = shopOrderService.exportExcel(userId,orderId);
        if(in==null){
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        InputStreamResource inputStreamResource = new InputStreamResource(in);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");
        headers.set("Content-disposition", "attachment; filename=" + orderId+".xlsx");
        return new ResponseEntity(inputStreamResource, headers, HttpStatus.OK);


    }
    @GetMapping("/shop/order/{orderId}/pdf")
    public ResponseEntity exportPdfOrderInfoById(HttpSession session,@PathVariable(value="orderId")String orderId) throws IOException {
        Object userId =session.getAttribute("id");
        InputStream in = shopOrderService.exportPdf(userId,orderId);
        if(in==null){
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        InputStreamResource inputStreamResource = new InputStreamResource(in);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");
        headers.set("Content-disposition", "attachment; filename=" + orderId+".pdf");
        return new ResponseEntity(inputStreamResource, headers, HttpStatus.OK);


    }

}
