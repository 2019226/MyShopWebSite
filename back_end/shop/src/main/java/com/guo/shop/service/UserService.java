package com.guo.shop.service;

import com.guo.shop.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class UserService {
    @Autowired
    DataBaseService dataBaseService;
    @Autowired
    MyToolService myToolService;

    public UserModel getUserById(String id){
        UserModel userModel =new UserModel();
         String queryUser ="select id,loginType,email,name,picture_url from `user` where id =?";
        List<Map<String,Object>> data  = dataBaseService.query(queryUser,id);

        if(data.size()==0){
            return null;
        }
        Map<String,Object> userMap = data.get(0);
        userModel.setEmail((String) userMap.get("email"));
        userModel.setId((String) userMap.get("id"));
        userModel.setLoginType((String) userMap.get("loginType"));
        userModel.setPicture((String) userMap.get("picture_url"));
        userModel.setName((String) userMap.get("name"));

        return userModel;
    }
    public UserModel getUserByEmailAndPassword(UserModel tryToFindThisUserModel){
        UserModel userModel =new UserModel();
        String queryUser ="select id,loginType,email,name,picture_url from `user` where email =? and password=? and loginType='webSite'";
        List<Map<String,Object>> data  = dataBaseService.query(queryUser,tryToFindThisUserModel.getEmail(),tryToFindThisUserModel.getPassword());
        if(data.size()==0){
            return null;
        }
        Map<String,Object> userMap = data.get(0);
        userModel.setEmail((String) userMap.get("email"));
        userModel.setId((String) userMap.get("id"));
        userModel.setLoginType((String) userMap.get("loginType"));
        userModel.setPicture((String) userMap.get("picture_url"));
        userModel.setName((String) userMap.get("name"));

        return userModel;
    }
    public boolean changePassword(UserModel userModel){
        String updatePassword ="update `user` set password=? where  email =?  and loginType='website';";
        int affectRow=dataBaseService.excute(
                updatePassword,
                userModel.getPassword(),
                userModel.getEmail()
        );

        return affectRow==0?false:true;
    }
    public UserModel createUser(UserModel userModel){
        String queryIsExistThisEmail = "select id,loginType,email,name,picture_url from `user` where email=?";
        List<Map<String,Object>> data = dataBaseService.query(queryIsExistThisEmail,userModel.getEmail());
        if(data.size()!=0){
            return null;
        }
        String id =userModel.getId();
        if(Objects.isNull(id)){
            id =myToolService.getRandomString(50);
            while(getUserById(id)!=null){
                id =myToolService.getRandomString(50);
            }
        }
        String insertUser="insert into `user` (id,loginType,email,name,picture_url,password) values (?,?,?,?,?,?)";
        dataBaseService.excute(
                insertUser,
                id,
                userModel.getLoginType(),
                userModel.getEmail(),
                userModel.getName(),
                userModel.getPicture(),
                userModel.getPassword()
        );
        userModel.setId(id);
        return userModel;


    }
    public boolean isAdmin(String id){
        UserModel userModel = this.getUserById(id);
        if(userModel.getEmail().equals("admin@mywebsite")){
            return true;
        }
        return false;
    }
    public boolean isAdmin(Object id){
        if (id == null) {
            return false;
        }
        String userId = id.toString();
        UserModel userModel = this.getUserById(userId);
        if(userModel.getEmail().equals("admin@mywebsite")){
            return true;
        }
        return false;
    }
}
