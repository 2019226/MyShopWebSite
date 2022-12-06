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
        String CreateShopProductTableSql="CREATE TABLE  IF NOT EXISTS `shop_website`.`shop_product` ( `id` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NOT NULL, `name` VARCHAR(45) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `price` VARCHAR(5) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `describe` VARCHAR(45) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `quantity` VARCHAR(45) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `image_url` VARCHAR(300) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, PRIMARY KEY (`id`) );";
        String CreateUserTableSql="CREATE TABLE  IF NOT EXISTS  `shop_website`.`user` ( `id` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NOT NULL, `loginType` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `email` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `name` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `picture_url` VARCHAR(300) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, PRIMARY KEY (`id`), `password` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `password_salt` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL );";
        String CreateShoppingCartTableSql="CREATE TABLE  IF NOT EXISTS  `shop_website`.`shopping_cart` ( `user_id` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci'  NULL, `product_id` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `demand_quantity` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL);";
        String CreateOrderTableSql="CREATE TABLE  IF NOT EXISTS  `shop_website`.`order` ( `order_id` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NOT NULL, `user_id` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `picker` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `cell_phone_number` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `notice` VARCHAR(300) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `delivery_type` VARCHAR(4) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `address` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `status` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `transaction_id` VARCHAR(20) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL );";
        String CreateOrderListTableSql="CREATE TABLE  IF NOT EXISTS  `shop_website`.`order_list` ( `order_id` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NOT NULL, `product_id` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `product_name` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `product_price` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `product_describe` VARCHAR(300) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL,  `product_image_url` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL,`user_demand_quantity` varchar(4) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL );";
        String CreateOrderHistoryStatusTableSql="CREATE TABLE IF NOT EXISTS `shop_website`.`order_history_status` ( `order_id` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `status` VARCHAR(5) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL, `date` VARCHAR(8) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NULL);";
        jdbcTemplate.execute(CreateShopProductTableSql);
        jdbcTemplate.execute(CreateUserTableSql);
        jdbcTemplate.execute(CreateShoppingCartTableSql);
        jdbcTemplate.execute(CreateOrderTableSql);
        jdbcTemplate.execute(CreateOrderListTableSql);
        jdbcTemplate.execute(CreateOrderHistoryStatusTableSql);
        String queryHasAdminAccount = "select id from `user` where email='admin@mywebsite'";
        List<Map<String, Object>> data = jdbcTemplate.queryForList(queryHasAdminAccount);
        if(data.size()==0){
            String insertAdminAccountInfo = "insert into `user` (id,loginType,email,name,password) values (?,?,?,?,?)";
            jdbcTemplate.update(
                    insertAdminAccountInfo,
                    "0000000001",
                    "website",
                    "admin@mywebsite",
                    "管理者",
                    "12345678"
            );
        }

    }
}
