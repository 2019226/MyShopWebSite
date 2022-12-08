package com.guo.shop.service;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.InetAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileService {
    static String fileUploadPath;
    @Value("${shop.file.upload_path}")
    public  void setFileUploadPath(String fileUploadPath) {
        FileService.fileUploadPath = fileUploadPath;
    }
    public String createFileThenReturnPath(MultipartFile file) throws IOException {
        Path checkDir = Paths.get(fileUploadPath);
        if(!Files.exists(checkDir)||!Files.isDirectory(checkDir)){
            Files.createDirectory(Paths.get(fileUploadPath));
        }
        Path path = Paths.get(fileUploadPath + file.getOriginalFilename());
        String extension = getExtension(file.getOriginalFilename());
        String name = getName(file.getOriginalFilename());
        int count=1;
        while(Files.exists(path)){
            String newFileName=name+"("+String.valueOf(count)+")."+extension;
            path = Paths.get(fileUploadPath +newFileName);
            count++;
        }
        Files.write(path, file.getBytes());
        return fileUploadPath+path.getFileName().toString();
    }
    private String getExtension(String fileOriginalFilename)  {
        String[] fileNameArr = fileOriginalFilename.split("\\.");
        int extensionIndex = fileNameArr.length-1;
        return fileNameArr[extensionIndex];
    }
    public File getFileByPath(String filePath) throws FileNotFoundException {
        File file = new File(filePath);
        return file;
    }
    private String getName(String fileOriginalFilename)  {

        String[] fileNameArr = fileOriginalFilename.split("\\.");
        int extensionIndex = fileNameArr.length-1;
        StringBuilder stringBuilder =new StringBuilder();
        for (int i = 0;i<extensionIndex;i++){

            stringBuilder.append(fileNameArr[i]);
        }
        return stringBuilder.toString();
    }
}
