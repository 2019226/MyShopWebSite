package com.guo.shop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;
@Service
public class ShoppingCartService {
    String userId;
    @Autowired
    DataBaseService dataBaseService;
    public void setUser(String userId){
        this.userId = userId;
    }
    public boolean appendProduct(String productId,int demandQuantity) throws Exception {
        List<Map<String,Object>> queryData;
        String queryExistThisProduct = "select id from shop_product where id=?";
        queryData =  dataBaseService.query(queryExistThisProduct,productId);
        if(queryData.size()==0){
            throw new Exception("查無此商品");
        }
        String queryProductIsInShoppingCart="select demand_quantity from  shopping_cart where user_id=? and product_id=? ";
        queryData =  dataBaseService.query(queryProductIsInShoppingCart,userId,productId);
        if(queryData.size()>=2){
            throw new Exception("購物車裡面有兩個重複的物品");
        }
        if(queryData.size()==1){
            String queryProductQuantity="select quantity from  shop_product where id=? ";
            queryData =dataBaseService.query(queryProductQuantity,productId);
            int quantity = Integer.valueOf((String)queryData.get(0).get("quantity"));
            if(demandQuantity>quantity){
                return false;
            }
            String updateShoppingCart = "update shopping_cart set demand_quantity=?  where user_id=? and product_id=? ";
            dataBaseService.excute(updateShoppingCart,String.valueOf(demandQuantity),userId,productId);
        }else{
            String sql ="insert into shopping_cart (user_id,product_id,demand_quantity) values (?,?,?)";
            dataBaseService.excute(sql,userId,productId,String.valueOf(demandQuantity));
        }





        return true;
    }
    public boolean deleteProduct(String productId){
        String sql ="delete from shopping_cart where user_id=? and product_id=?";
        dataBaseService.excute(sql,userId,productId);
        return true;
    }
    public List<Map<String,String>> getList(){
        String sql ="select SP.id as 'product_id',SP.name as 'product_name',SP.price as 'product_price',SP.quantity as 'product_quantity',SC.demand_quantity as 'demand_quantity'  " +
                    "from shopping_cart as SC,shop_product as SP where SC.product_id = SP.id  and SC.user_id='"+userId+"'";
        System.out.println(sql);
        JdbcTemplate jdbcTemplate =dataBaseService.getJdbcTemplate();
        List<Map<String,String>>  shopProductList= jdbcTemplate.query(sql, new RowMapper<Map<String,String>>() {
            @Override
            public Map<String,String> mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map<String,String> shoppingCartMap = new HashMap<String,String>();
                shoppingCartMap.put("id",rs.getString("product_id"));
                shoppingCartMap.put("name",rs.getString("product_name"));
                shoppingCartMap.put("price",rs.getString("product_price"));
                shoppingCartMap.put("imageUrl","/backend/shop/product/image/"+rs.getString("product_id"));
                shoppingCartMap.put("inventoryQuantity",rs.getString("product_quantity"));
                shoppingCartMap.put("customDemandQuantity",rs.getString("demand_quantity"));
                return shoppingCartMap;
            }
        });
        return shopProductList;
    }
    //給LinePay使用的方法
    public String getTotalFromShoppingCart(String userId){
        String queryTotalPriceSql="select sum(SC.demand_quantity * SP.price) as 'total' from shopping_cart as SC ,shop_product as SP where SC.product_id = SP.id and SC.user_id=? ";

        String total =dataBaseService.query(queryTotalPriceSql,userId).get(0).get("total").toString();
        return  total;

    }
    public String getAmountFromShoppingCart(String userId){
        String queryAmountSql="select count(*) as 'amount' from shopping_cart as SC where SC.user_id=? ";
        String amount = String.valueOf(dataBaseService.query(queryAmountSql,userId).get(0).get("amount"));
        return  amount;
    }

    public boolean checkOutHandle(String userId) {
        String sql = "select product_id, shop_product.name, shop_product.quantity , shopping_cart.demand_quantity, case when cast(shop_product.quantity as SIGNED) >= cast(shopping_cart.demand_quantity as SIGNED) then 'pass' else 'failed' end  as 'validate' from shopping_cart,shop_product where id = product_id and user_id=?";
        List<Map<String, Object>> data = dataBaseService.query(sql,userId);
        for(Map<String,Object> map : data){
            if(map.get("validate").equals("failed")){
                return false;
            }
        }
        return true;
    }
}
