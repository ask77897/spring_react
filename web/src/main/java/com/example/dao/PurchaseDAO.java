package com.example.dao;

import java.util.HashMap;
import java.util.List;

import com.example.domain.OrderVO;
import com.example.domain.PurchaseVO;
import com.example.domain.QueryVO;
import com.example.domain.UserVO;

public interface PurchaseDAO {
	public void inpurchase(PurchaseVO vo);
	public void inorder(OrderVO vo);
	public List<HashMap<String, Object>> lipurchase(UserVO vo);
	public int topurchase(String uid);
	public List<HashMap<String, Object>> liorders(String oid);
	public List<HashMap<String, Object>> liadmin(QueryVO vo);
	public int toadmin(QueryVO vo);
	public void upstatus(PurchaseVO vo);
}
