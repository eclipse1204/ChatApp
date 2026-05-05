package com.chatApp.ChatApplication.dto;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaginatedResponseDto {
    private List<RoomResponseDto> items;
    private Long total;
    private Long pages;
}
