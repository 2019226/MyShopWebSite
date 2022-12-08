package com.guo.shop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;

@Service
public class DataBaseService {
    @Autowired
    JdbcTemplate jdbcTemplate;
    public synchronized List<Map<String, Object>> query(String sql, Object... args){
        return jdbcTemplate.queryForList(sql,args);
    }
    public synchronized int excute(String sql,Object... args){
        return jdbcTemplate.update(sql,args);
    }
    public synchronized JdbcTemplate getJdbcTemplate(){
        return this.jdbcTemplate;
    }
    @PostConstruct
    public void init() {
        String CreateShopProductTableSql="CREATE TABLE  IF NOT EXISTS `shop_product` ( `id` VARCHAR(10) , `name` VARCHAR(45) , `price` VARCHAR(5) , `describe` VARCHAR(45) , `quantity` VARCHAR(45) , `image_url` VARCHAR(300) , PRIMARY KEY (`id`) );";
        String CreateUserTableSql="CREATE TABLE  IF NOT EXISTS  `user` ( `id` VARCHAR(50) , `loginType` VARCHAR(10) , `email` VARCHAR(100) , `name` VARCHAR(50) , `picture_url` VARCHAR(300) , `password` VARCHAR(1000), PRIMARY KEY (`id`)   );";
        String CreateShoppingCartTableSql="CREATE TABLE  IF NOT EXISTS  `shopping_cart` ( `user_id` VARCHAR(50) , `product_id` VARCHAR(10) , `demand_quantity` VARCHAR(100) );";
        String CreateOrderTableSql="CREATE TABLE  IF NOT EXISTS  `order` ( `order_id` VARCHAR(10) , `user_id` VARCHAR(50) , `picker` VARCHAR(10) , `cell_phone_number` VARCHAR(10) , `notice` VARCHAR(300) , `delivery_type` VARCHAR(4) , `address` VARCHAR(100) , `status` VARCHAR(10) , `transaction_id` VARCHAR(20)  );";
        String CreateOrderListTableSql="CREATE TABLE  IF NOT EXISTS  `order_list` ( `order_id` VARCHAR(10) , `product_id` VARCHAR(10) , `product_name` VARCHAR(10) , `product_price` VARCHAR(10) , `product_describe` VARCHAR(300) ,  `product_image_url` VARCHAR(100) ,`user_demand_quantity` varchar(4)  );";
        String CreateOrderHistoryStatusTableSql="CREATE TABLE IF NOT EXISTS `order_history_status` ( `order_id` VARCHAR(10) , `status` VARCHAR(5) , `date` VARCHAR(8) );";
        jdbcTemplate.execute(CreateShopProductTableSql);
        jdbcTemplate.execute(CreateUserTableSql);
        jdbcTemplate.execute(CreateShoppingCartTableSql);
        jdbcTemplate.execute(CreateOrderTableSql);
        jdbcTemplate.execute(CreateOrderListTableSql);
        jdbcTemplate.execute(CreateOrderHistoryStatusTableSql);


    }
}
