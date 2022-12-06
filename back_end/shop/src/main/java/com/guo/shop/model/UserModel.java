package com.guo.shop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Component;

@Component
public class UserModel {

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    public String id;
    public String loginType;
    public String email;
    public String name;
    public String picture;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    public String password;



    public String getPassword() {
        return password;
    }

    //以後改用Spring Security取代掉
    public void setPassword(String password) {
        String hashPassword = DigestUtils.sha256Hex(password);
        this.password = hashPassword;
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLoginType() {
        return loginType;
    }

    public void setLoginType(String loginType) {
        this.loginType = loginType;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }
}
