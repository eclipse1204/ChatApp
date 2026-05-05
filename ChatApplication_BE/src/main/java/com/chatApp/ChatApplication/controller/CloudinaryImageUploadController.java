package com.chatApp.ChatApplication.controller;

import com.chatApp.ChatApplication.dto.CloudinaryResponseDto;
import com.chatApp.ChatApplication.service.CloudinaryImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/file")
@CrossOrigin
public class CloudinaryImageUploadController {

    @Autowired
    private CloudinaryImageUploadService cloudinaryImageUploadService;

    @PostMapping("/upload")
    public ResponseEntity<CloudinaryResponseDto> upload(@RequestParam(name = "file") MultipartFile file){
        return ResponseEntity.ok(cloudinaryImageUploadService.upload(file));
    }
}
