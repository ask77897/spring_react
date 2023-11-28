package com.example.dao;

import java.util.HashMap;
import java.util.List;

import com.example.domain.ReviewVO;

public interface ReviewDAO {
	public void insert(ReviewVO vo);
	public List<HashMap<String, Object>> list(int pid, int page, int size);
	public int total(int pid);
	public void delete(int cid);
	public void uprevcnt(int pid, int amount);
	public ReviewVO read(int cid);
	public void update(ReviewVO vo);
}
