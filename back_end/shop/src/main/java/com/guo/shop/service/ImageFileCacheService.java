package com.guo.shop.service;

import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.util.LinkedHashMap;
import java.util.Map;
@Service
public class ImageFileCacheService {
    Map<String, File> map;
    long buffSize;
    @PostConstruct
    public void init(){
        map = new LinkedHashMap<String, File>();
        buffSize =200000000;//200MB
    }
    public File get(String id ){
        return this.map.get(id);
    }
    public void put(String id, File imageFile){
        if(this.map.containsKey(id)){
            update(id,imageFile);
        }
        whenOverBuffSizeThenRetrieveElements(0-imageFile.length());
        this.map.put(id , imageFile);
    }
    public void del(String id){
        this.buffSize +=  this.map.get(id).length();
        this.map.remove(id);
    }
    public void update(String id,File imageFile){
        if(!this.map.containsKey(id)){
            put(id,imageFile);
        }
        long oldFileSize = this.map.get(id).length();
        long swapBuffSize =oldFileSize-imageFile.length();//10MB = 8MB -5MB =13MB;10MB = 5MB -8MB =7MB;
        whenOverBuffSizeThenRetrieveElements(swapBuffSize);
        this.map.put(id , imageFile);
    }
    private  void whenOverBuffSizeThenRetrieveElements(long swapBuffSize){
        this.buffSize +=swapBuffSize;
        while(this.buffSize <=0){
            for (Map.Entry<String,File> entry:this.map.entrySet()) {
                this.buffSize+= entry.getValue().length();
                this.map.remove(entry.getKey());
            }
        }
        System.gc();
    }
}
