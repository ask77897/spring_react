package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dao.ReviewDAO;
import com.example.domain.ReviewVO;

@RestController
@RequestMapping("/review")
public class ReviewRestController {
	@Autowired
	ReviewDAO dao;
	
	@PostMapping("/insert")
	public void insert(@RequestBody ReviewVO vo) {
		dao.insert(vo);
	}
}
