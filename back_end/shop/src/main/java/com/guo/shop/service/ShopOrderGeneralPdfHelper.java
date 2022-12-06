package com.guo.shop.service;

import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.alignment.HorizontalAlignment;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.sun.org.apache.xml.internal.serializer.ElemDesc;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;
import java.util.Map;
@Service
public class ShopOrderGeneralPdfHelper {
    static String fontFileLocation;
    @Value("${font.traditional_chinese}")
    public  void setFontFileLocation(String fontFileLocation) {
        ShopOrderGeneralPdfHelper.fontFileLocation = fontFileLocation;
    }
    Font fontChinese;
    @PostConstruct
    public void setFont() throws IOException {
        BaseFont bfChinese = BaseFont.createFont(fontFileLocation, "Identity-H", BaseFont.NOT_EMBEDDED);
        this.fontChinese = new Font(bfChinese, 11, Font.NORMAL);
    }
    public PdfPCell getProductTable(List<Map<String,Object>> orderProductList){

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        String[] titleArray = new String[] {"商品名稱","單價","數量","小計"};
        PdfPCell cell;
        for (String colTitle :titleArray) {
            cell = new PdfPCell(new Paragraph(colTitle,fontChinese));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5f);
            table.addCell(cell);
        }
        for(int i=0;i<orderProductList.size();i++){
            Map<String,Object> map = orderProductList.get(i);
            for(Map.Entry<String, Object> entry:map.entrySet()){
                cell = new PdfPCell(new Paragraph(entry.getValue().toString(),fontChinese));
                cell.setBorderWidthTop(0);
                cell.setBorderWidthBottom(0);
                cell.setPadding(5f);
                table.addCell(cell);
            }
            int total = Integer.parseInt(map.get("price").toString())*Integer.parseInt(map.get("user_demand_quantity").toString());
            cell = new PdfPCell(new Paragraph(String.valueOf(total),fontChinese));
            cell.setBorderWidthTop(0);
            cell.setBorderWidthBottom(0);
            cell.setPadding(5f);
            table.addCell(cell);
        }
        PdfPCell  mergeTableCell ;
        mergeTableCell = new PdfPCell(table);
        mergeTableCell.setPadding(0f);
        mergeTableCell.setMinimumHeight(650f);
        return mergeTableCell;
    }
    public PdfPCell getDeliveryTable(List<Map<String,Object>> deliveryInfoList){
        PdfPTable table = new PdfPTable(4);
        String[] titleArray = new String[] {"取貨人姓名","手機號碼","配送需知","配送類別","位址"};
        PdfPCell cell;
        Map<String,Object> map = deliveryInfoList.get(0);
        int count=0;
        for(Map.Entry<String, Object> entry:map.entrySet()){
            cell = new PdfPCell(new Paragraph(titleArray[count++],fontChinese));
            cell.setPadding(5f);
            table.addCell(cell);

            cell = new PdfPCell(new Paragraph(entry.getValue().toString(),fontChinese));
            cell.setColspan(3);
            cell.setPadding(5f);
            table.addCell(cell);
        }
        PdfPCell  mergeTableCell ;
        mergeTableCell = new PdfPCell(table);
        mergeTableCell.setBorder(0);
        mergeTableCell.setPadding(0f);
        return mergeTableCell;
    }
    public PdfPCell getOrderTotalInfoTable(String total){
        PdfPTable table = new PdfPTable(4);
        PdfPCell cell;
        cell = new PdfPCell(new Paragraph("總計",fontChinese));
        cell.setPadding(5f);
        table.addCell(cell);
        cell = new PdfPCell(new Paragraph(total+"元",fontChinese));
        cell.setColspan(3);
        cell.setPadding(5f);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cell);

        PdfPCell  mergeTableCell ;
        mergeTableCell = new PdfPCell(table);
        mergeTableCell.setBorder(0);
        mergeTableCell.setPadding(0f);
        return mergeTableCell;
    }
}
