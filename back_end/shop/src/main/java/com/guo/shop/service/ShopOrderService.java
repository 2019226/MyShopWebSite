package com.guo.shop.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.guo.shop.model.LineProductModel;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.io.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;

@Service
public class ShopOrderService {
    @Autowired
    DataBaseService dataBaseService;
    @Autowired
    UserService userService;
    @Autowired
    ShopOrderGeneralPdfHelper shopOrderGeneralPdfHelper;
    @Autowired
    LinePayService linePayService;
    @Autowired
    ShoppingCartService shoppingCartService;
    @Transactional()
    public Boolean createOrder(String userId, String orderId, String transactionId, Map<String,String>orderInfoMap) throws Exception {
        List<Map<String,Object>> dbData ;
        String queryIsExistThisOrderId ="select order_id from `order` where order_id=?";
        dbData = dataBaseService.query(queryIsExistThisOrderId,orderId);
        if(dbData.size()!=0){
            return false;
        }
        String insertNewOrder ="insert into `order` (order_id,transaction_id,user_id,picker,cell_phone_number,notice,delivery_type,address,status) values (?,?,?,?,?,?,?,?,?)";
        dataBaseService.excute(
                insertNewOrder,
                orderId,
                transactionId,
                userId,
                orderInfoMap.get("picker"),
                orderInfoMap.get("cellPhoneNumber"),
                orderInfoMap.get("notice"),
                orderInfoMap.get("deliveryType"),
                orderInfoMap.get("address"),
                "待處理"
        );
        //抓取商品資料,準備寫入order_list
        String queryProductAndShoppingCartInfo = "select SP.id as 'product_id', SP.`name` as 'product_name', SP.price as 'product_price', SP.`describe` as 'product_describe', SP.quantity as 'product_quantity', SP.image_url as 'product_image_url', SC.demand_quantity as 'user_demand_quantity' from shopping_cart as SC,shop_product as SP where SC.product_id=SP.id and SC.user_id=?";
        dbData = dataBaseService.query(queryProductAndShoppingCartInfo,userId);
        Map<String,Object> dataMap ;
        String insertOrderProductList="insert into order_list (`order_id`,`product_id`,`product_name`,`product_price`,`product_describe`,`product_image_url`,`user_demand_quantity`) values (?,?,?,?,?,?,?) ";
        for(int i=0;i<dbData.size();i++){
            dataMap=dbData.get(i);
            dataBaseService.excute(
                    insertOrderProductList,
                    orderId,
                    dataMap.get("product_id").toString(),
                    dataMap.get("product_name").toString(),
                    dataMap.get("product_price").toString(),
                    dataMap.get("product_describe").toString(),
                    dataMap.get("product_image_url").toString(),
                    dataMap.get("user_demand_quantity").toString()
            );
        }
        //使用已抓取的商品資料,準備改寫商品庫存數量
        String updateProductQuantity = "update shop_product set quantity=? where id=?";
        List<Map<String,Object>> inShpppingCartProduct = dbData;
        int userDemandQuantity =0;
        int productQuantit =0;
        int newProductQuantity = 0;
        for(Map<String,Object> productMap : inShpppingCartProduct){
            userDemandQuantity =Integer.valueOf(productMap.get("user_demand_quantity").toString());
            productQuantit = Integer.valueOf(productMap.get("product_quantity").toString());
            if(userDemandQuantity>productQuantit){
                throw  new  Exception("庫存數量不足,交易失敗");
            }
            newProductQuantity = productQuantit - userDemandQuantity;
            dataBaseService.excute(updateProductQuantity,newProductQuantity,productMap.get("product_id").toString());

        }
        //補上待處理狀態
        Calendar cal = Calendar.getInstance();
        Date date=cal.getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        String formattedDate=dateFormat.format(date);
        String insertOrderHistoryStatus ="INSERT INTO `order_history_status` (`order_id`, `status`, `date`) VALUES (?,?,?) ";
        dataBaseService.excute(insertOrderHistoryStatus,orderId,"待處理",formattedDate);
        //跟LinePay確認使用者付款請求
        String amount = shoppingCartService.getTotalFromShoppingCart(userId);
        String echo = linePayService.confirmOrderByTransactionId(transactionId,amount);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode=objectMapper.readTree(echo);
        String returnCode = jsonNode.get("returnCode").textValue();
        if(!"0000".equals(returnCode)){
            throw new Exception("結帳失敗!! 結果代碼為:"+returnCode);
        }
        //刪除購物車資料
        String deleteShoppingCart="delete from shopping_cart where user_id=? ";
        dataBaseService.excute(deleteShoppingCart,userId);
        return true;
    }
    public List<Map<String,Object>> getOrderListByStatus(String userId,String status){
        String queryOrderList ="";
        if(userService.isAdmin(userId)){
            queryOrderList ="SELECT OL.order_id as 'id', GROUP_CONCAT(OL.product_name ||  'x ' || OL.user_demand_quantity ) as 'describe', sum(OL.product_price*OL.user_demand_quantity) as 'total' FROM order_list AS OL,`order` AS O where O.order_id=OL.order_id  and O.status=? GROUP BY OL.order_id;";
            System.out.println(queryOrderList);
            return dataBaseService.query(queryOrderList,status);
        }
        queryOrderList ="SELECT OL.order_id as 'id', GROUP_CONCAT(OL.product_name ||  'x ' || OL.user_demand_quantity ) as 'describe', sum(OL.product_price*OL.user_demand_quantity) as 'total' FROM order_list AS OL,`order` AS O where O.order_id=OL.order_id and O.user_id=? and O.status=? GROUP BY OL.order_id;";
        return dataBaseService.query(queryOrderList,userId,status);


    }

    public boolean changeOrderStatus(String userId,String orderId,String status) throws Exception {
        if(!userService.isAdmin(userId)){
            return false;
        }
        Calendar cal = Calendar.getInstance();
        Date date=cal.getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        String formattedDate=dateFormat.format(date);
        String updateOrderStatus ="update `order` set `status`=? where order_id=?";
        String insertOrderHistoryStatus ="INSERT INTO `order_history_status` (`order_id`, `status`, `date`) VALUES (?,?,?) ";
        dataBaseService.excute(updateOrderStatus,status,orderId);
        dataBaseService.excute(insertOrderHistoryStatus,orderId,status,formattedDate);
        //如果是要取消訂單,則要將未完成的狀態更新為已取消
        if("取消訂單".equals(status)){
            String[] statusArray = new String[] {"待處理","賣家確認","處理商品","已送貨","完成訂單"};
            String queryOrderHistoryInfo ="select `status`, substr(`date`, 1, 4) || '/' ||substr(`date`, 5, 2) || '/' ||substr(`date`, 7, 2) as 'date' from order_history_status where order_id=?";
            List<Map<String,Object>> orderProcessInfo= dataBaseService.query(queryOrderHistoryInfo,orderId);
            for(String item: statusArray){
                if(isContainThisStatus(orderProcessInfo,item)){
                    continue;
                }
                dataBaseService.excute(insertOrderHistoryStatus,orderId,item,"已取消");
            }
//            關於退錢這件事情,自己退！！！
//            String queryTransactionId = "select transaction_id from `order` where order_id =?";
//            String transactionId = dataBaseService.query(queryTransactionId,orderId).get(0).get("transaction_id").toString();
//            linePayService.refundOrderByTransactionId(transactionId,getTotalById(orderId));
        }
        return true;
    }
    public  Map<String,Object> getOrderInfoByOrderId(String userId,String orderId){
//不是管理員,需要檢查這個單號有沒有跟使用者編號有關聯
        Boolean isAdmin  = userService.isAdmin(userId);
        if(!isAdmin){
            String checkOrderAndUserRelational="select order_id from `order` where user_id=? and order_id=? ";
            List tmpData = dataBaseService.query(checkOrderAndUserRelational,userId,orderId);
            if(tmpData.size()==0){
                return null;
            }
        }
//處理狀態
        String[] statusArray = new String[] {"待處理","賣家確認","處理商品","已送貨","完成訂單"};
        Map<String,Object> orderInfoMap =new HashMap<String,Object>();
        String queryOrderHistoryInfo ="select `status`,  case when `date`='已取消' then `date` else substr(`date`, 1, 4) || '/' ||substr(`date`, 5, 2) || '/' ||substr(`date`, 7, 2)  end as 'date' from order_history_status where order_id=?";
        List<Map<String,Object>> orderProcessInfo= dataBaseService.query(queryOrderHistoryInfo,orderId);
        boolean isFirstFound=true;
        for(String status: statusArray){
            if(isContainThisStatus(orderProcessInfo,status)){
                continue;
            }
            Map<String,Object> tmpMap =new HashMap<String,Object>();
            tmpMap.put("status",status);
            tmpMap.put("date","...");
            if(isFirstFound){
                tmpMap.put("date","處理中");
                isFirstFound=false;
            }
            orderProcessInfo.add(tmpMap);
        }
        orderInfoMap.put("orderProcessInfo",orderProcessInfo);
//商品資料
        String queryOrderProductInfo="select product_name as 'name',product_price as 'price' ,user_demand_quantity from order_list where order_id=?;";
        List<Map<String,Object>> orderProductList =dataBaseService.query(queryOrderProductInfo,orderId);
        orderInfoMap.put("orderProductList",orderProductList);
//送貨資料
        String queryOrderInfo ="select picker,cell_phone_number,notice,delivery_type,address from `order` where order_id=?";
        List<Map<String,Object> > data =dataBaseService.query(queryOrderInfo,orderId);
        Map<String,Object> deliveryInfo =data.get(0);
        orderInfoMap.put("deliveryInfo",deliveryInfo);

        return orderInfoMap;
    }
    public Map<String,Object> getDeliveryInfo(String orderId){
        String[] statusArray = new String[] {"待處理","賣家確認","處理商品","已送貨","完成訂單"};
        String queryOrderHistoryInfo ="select `status`, substr(`date`, 1, 4) || '/' ||substr(`date`, 5, 2) || '/' ||substr(`date`, 7, 2) as 'date' from order_history_status where order_id=?";
        List<Map<String,Object>> orderProcessInfo= dataBaseService.query(queryOrderHistoryInfo,orderId);
        boolean isFirstFound=true;
        for(String status: statusArray){
            if(isContainThisStatus(orderProcessInfo,status)){
                continue;
            }
            Map<String,Object> tmpMap =new HashMap<String,Object>();
            tmpMap.put("status",status);
            tmpMap.put("date","...");
            if(isFirstFound){
                tmpMap.put("date","處理中");
                isFirstFound=false;
            }
            orderProcessInfo.add(tmpMap);
        }
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("orderProcessInfo",orderProcessInfo);
        return  map;
    }
    public InputStream exportExcel(Object userId, String orderId) throws IOException {
//不是管理員,需要檢查這個單號有沒有跟使用者編號有關聯
        Boolean isAdmin  = userService.isAdmin(userId);
        if(!isAdmin){
            String checkOrderAndUserRelational="select order_id from `order` where user_id=? and order_id=? ";
            List tmpData = dataBaseService.query(checkOrderAndUserRelational,userId,orderId);
            if(tmpData.size()==0){
                return null;
            }
        }
//商品資料
        String queryOrderProductInfo="select product_name as 'name',product_price as 'price' ,user_demand_quantity from order_list where order_id=?;";
        List<Map<String,Object>> orderProductList =dataBaseService.query(queryOrderProductInfo,orderId);
//送貨資料
        String queryOrderInfo ="select picker,cell_phone_number,notice,delivery_type,address from `order` where order_id=?";
        List<Map<String,Object> > deliveryInfoList =dataBaseService.query(queryOrderInfo,orderId);
//建立excel

        Workbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("訂單資料");
        String[] productListTitleArray = new String[] {"商品名稱","單價","數量","小計"};
        int rowNumberCursor =0;
        Row titleRow = sheet.createRow(rowNumberCursor++);
        CellStyle style = wb.createCellStyle();
        for (int i = 0; i < productListTitleArray.length; i++) {
            style.setAlignment(HorizontalAlignment.CENTER);
            titleRow.setHeightInPoints(15f);
            Cell cell= titleRow.createCell(i);
            cell.setCellValue(productListTitleArray[i]);
            cell.setCellStyle(style);

        }
        for (int i=0;i<orderProductList.size();i++ ) {
            Map<String,Object> map =  orderProductList.get(i);
            Row row = sheet.createRow(rowNumberCursor++);
            row.setHeightInPoints(15f);
            row.createCell(0).setCellValue(map.get("name").toString());
            row.createCell(1).setCellValue(map.get("price").toString());
            row.createCell(2).setCellValue(map.get("user_demand_quantity").toString());
            int price =Integer.valueOf(map.get("price").toString());
            int quantity=Integer.valueOf(map.get("user_demand_quantity").toString());
            int total = price*quantity;
            row.createCell(3).setCellValue(total);
        }
        //兩段空白行
        sheet.createRow(rowNumberCursor++);
        sheet.createRow(rowNumberCursor++);
        //增加總計
        Row row = sheet.createRow(rowNumberCursor);
        row.setHeightInPoints(15f);
        row.createCell(0).setCellValue("總計");
        row.createCell(1).setCellValue(getTotalById(orderId)+"元");
        rowNumberCursor++;
        String[] deliveryTitleArray = new String[] {"取貨人姓名","手機號碼","配送需知","配送類別","位址"};
        Map<String,Object> map =deliveryInfoList.get(0);
        int recalculate = rowNumberCursor;
        for(Map.Entry<String,Object> data: map.entrySet()){
            row = sheet.createRow(rowNumberCursor);
            row.setHeightInPoints(15f);
            row.createCell(0).setCellValue(deliveryTitleArray[rowNumberCursor-recalculate].toString());
            row.createCell(1).setCellValue(data.getValue().toString());
            rowNumberCursor++;
        }
        int[] columnWidth = new int[] {20,20,20,20};
        for(int i=0;i<columnWidth.length;i++){
            sheet.setColumnWidth(i,255*( columnWidth[i]));
        }
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        wb.write(out);
        InputStream in = new ByteArrayInputStream(out.toByteArray());
        return in;
    }
    public InputStream exportPdf(Object userId, String orderId) throws IOException {
//不是管理員,需要檢查這個單號有沒有跟使用者編號有關聯
        Boolean isAdmin  = userService.isAdmin(userId);
        if(!isAdmin){
            String checkOrderAndUserRelational="select order_id from `order` where user_id=? and order_id=? ";
            List tmpData = dataBaseService.query(checkOrderAndUserRelational,userId,orderId);
            if(tmpData.size()==0){
                return null;
            }
        }
//商品資料
        String queryOrderProductInfo="select product_name as 'name',product_price as 'price' ,user_demand_quantity from order_list where order_id=?;";
        List<Map<String,Object>> orderProductList =dataBaseService.query(queryOrderProductInfo,orderId);
//送貨資料
        String queryOrderInfo ="select picker,cell_phone_number,notice,delivery_type,address from `order` where order_id=?";
        List<Map<String,Object> > deliveryInfoList =dataBaseService.query(queryOrderInfo,orderId);
//建立PDF
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 20, 20, 20, 25);
        PdfWriter.getInstance(document,out);
        document.open();
        PdfPTable mergeTable ;
        mergeTable = new PdfPTable(new float [] {1f});
        mergeTable.setWidthPercentage(100);
        mergeTable.addCell(shopOrderGeneralPdfHelper.getProductTable(orderProductList));
        mergeTable.addCell(shopOrderGeneralPdfHelper.getOrderTotalInfoTable(getTotalById(orderId)));
        mergeTable.addCell(shopOrderGeneralPdfHelper.getDeliveryTable(deliveryInfoList));
        mergeTable.setKeepTogether(true);
        mergeTable.setSplitLate(false);
        document.add(mergeTable);
        document.close();

        InputStream in = new ByteArrayInputStream(out.toByteArray());
        return in;
    }
    public String getTotalById(String orderId){

        String queryTotalPriceSql="select sum(product_price * user_demand_quantity) as 'total' from order_list where order_id=? ";

        String total = dataBaseService.query(queryTotalPriceSql,orderId).get(0).get("total").toString();
        return  total;
    }

    private boolean isContainThisStatus(List<Map<String, Object>> orderProcessInfo, String status) {
        boolean find=false;
        Map<String, Object> map ;
        for(int i = 0 ;i<orderProcessInfo.size();i++){
            map=orderProcessInfo.get(i);
            find = status.equals(map.get("status"))?true:find;
        }
        return find;
    }
}



