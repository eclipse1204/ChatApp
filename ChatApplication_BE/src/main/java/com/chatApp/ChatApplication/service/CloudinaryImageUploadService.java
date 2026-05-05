package com.chatApp.ChatApplication.service;

import com.chatApp.ChatApplication.dto.CloudinaryResponseDto;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryImageUploadService {

    @Autowired
    private Cloudinary cloudinary;

    public CloudinaryResponseDto upload(MultipartFile file){
        try {
            String publicId = file.getOriginalFilename()
                    .replaceFirst("[.][^.]+$", "");
            Map map=cloudinary.uploader().upload(file.getBytes(),Map.of("resource_type", "auto","public_id", publicId));
            return new CloudinaryResponseDto((String)map.get("secure_url"),(String)map.get("public_id"));
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file");
        }

    }
}
