package com.guo.shop.service;

import com.guo.shop.model.ShopProductModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.InputStream;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Service
public class ShopProductService {
    @Autowired
    DataBaseService dataBaseService;
    @Autowired
    MyToolService myToolService;
    @Autowired
    FileService fileService;
    Map<String,File> cacheImageFile;
    public boolean createProduct(ShopProductModel product){


        String id = myToolService.getRandomString(10);
        List queryResult = dataBaseService.query("select id from shop_product where id=?",id);
        while(queryResult.size()==1){
            id = myToolService.getRandomString(10);
            queryResult = dataBaseService.query("select id from shop_product where id=?",id);
        }
        dataBaseService.excute(
                "insert into shop_product (id,name,price,`describe`,quantity,image_url) values (?,?,?,?,?,?)",
                id,
                product.getName(),
                product.getPrice(),
                product.getDescribe(),
                product.getQuantity(),
                product.getImageUrl()
        );
        return true;
    }
    public ShopProductModel getProductById(String id){

        List<Map<String,Object>> queryResult =  dataBaseService.query("select id,name,price,`describe`,quantity,image_url from shop_product where id =? ",id);
        if(queryResult.size()==0){
            return  null;
        }
        Map shopProductTableMap= queryResult.get(0);
        ShopProductModel product= new ShopProductModel();
        product.setId(shopProductTableMap.get("id").toString());
        product.setName(shopProductTableMap.get("name").toString());
        product.setPrice(shopProductTableMap.get("price").toString());
        product.setDescribe(shopProductTableMap.get("describe").toString());
        product.setQuantity(shopProductTableMap.get("quantity").toString());
        product.setImageUrl(shopProductTableMap.get("image_url").toString());
        return product;
    }
    public boolean deleteProductById(String id){
        dataBaseService.excute("delete  from shop_product where id=?",id);
        dataBaseService.excute("delete  from shopping_cart where product_id=?",id);
        return true;
    }
    public boolean updateProductById(String id,ShopProductModel shopProduct){
        String updateSql="";

        if(Objects.isNull(shopProduct.getImageUrl())){
            updateSql ="update shop_product set name=?,price=?,`describe`=?,quantity=? where id=?";
            dataBaseService.excute(updateSql,
                    shopProduct.getName(),
                    shopProduct.getPrice(),
                    shopProduct.getDescribe(),
                    shopProduct.getQuantity(),
                    id);
            return true;
        }
        updateSql ="update shop_product set name=?,price=?,`describe`=?,image_url=?,quantity=? where id=?";
        dataBaseService.excute(updateSql,
                shopProduct.getName(),
                shopProduct.getPrice(),
                shopProduct.getDescribe(),
                shopProduct.getImageUrl(),
                shopProduct.getQuantity(),
                id);
        return true;
    }
    public List<Map<String,Object>> getProductList(String userId){
        String queryProductListSql ="select id,name,price,`describe`,quantity,image_url, (case when (select demand_quantity from shopping_cart  where product_id =id and user_id=?) is not null then true else false  end ) as 'isAddToCart'   from shop_product";
        JdbcTemplate jdbcTemplate= dataBaseService.getJdbcTemplate();


        List<Map<String,Object>>  shopProductList = jdbcTemplate.query(
                queryProductListSql,
                new RowMapper<Map<String,Object>>() {
                    @Override
                    public Map<String,Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
                        Map<String,Object> map =new HashMap<String,Object>();
                        map.put("id",rs.getString("id"));
                        map.put("name",rs.getString("name"));
                        map.put("describe",rs.getString("describe"));
                        map.put("price",rs.getString("price"));
                        map.put("quantity",rs.getString("quantity"));
                        map.put("imageUrl","/backend/shop/product/image/"+rs.getString("id"));
                        if(rs.getString("isAddToCart").equals("0")){
                            map.put("isAddToCart",false);
                        }else{
                            map.put("isAddToCart",true);
                        }

                        return map;
                    }
                },
                userId
        );
        return shopProductList;
    }
    public List<ShopProductModel> getProductList(){
        String queryProductListSql ="select id,name,price,`describe`,quantity,image_url   from shop_product ";
        JdbcTemplate jdbcTemplate= dataBaseService.getJdbcTemplate();
        List<ShopProductModel>  shopProductList = jdbcTemplate.query(
                queryProductListSql,
                new RowMapper<ShopProductModel>() {
                    @Override
                    public ShopProductModel mapRow(ResultSet rs, int rowNum) throws SQLException {
                        ShopProductModel shopProductModel = new ShopProductModel();
                        shopProductModel.setId(rs.getString("id"));
                        shopProductModel.setName(rs.getString("name"));
                        shopProductModel.setDescribe(rs.getString("describe"));
                        shopProductModel.setPrice(rs.getString("price"));
                        shopProductModel.setQuantity(rs.getString("quantity"));
                        shopProductModel.setImageUrl("/backend/shop/product/image/"+rs.getString("id"));
                        return shopProductModel;
                    }
                }
        );
        return shopProductList;
    }
    public File getProductImageById(String id){
        if(cacheImageFile.get(id)!=null){
            return    cacheImageFile.get(id);
        }
        String queryImagePath ="select image_url from shop_product where id=?";
        List<Map<String,Object>> data =dataBaseService.query(queryImagePath,id);
        if(data.size()==0){
            return null;
        }
        String path = data.get(0).get("image_url").toString();
        try{
            cacheImageFile.put(id,fileService.getFileByPath(path));
            return cacheImageFile.get(id);
        }catch (Exception e){
            return null;
        }

    }
}
