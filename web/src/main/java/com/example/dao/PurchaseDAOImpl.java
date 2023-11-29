package com.example.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.domain.OrderVO;
import com.example.domain.PurchaseVO;
import com.example.domain.UserVO;

@Repository
public class PurchaseDAOImpl implements PurchaseDAO{
	@Autowired
	SqlSession session;
	String namespace="com.example.mapper.PurchaseMapper";
	
	@Override
	public void inpurchase(PurchaseVO vo) {
		session.insert(namespace + ".inpurchase", vo);
	}

	@Override
	public void inorder(OrderVO vo) {
		session.insert(namespace + ".inorder", vo);
	}

	@Override
	public List<HashMap<String, Object>> lipurchase(UserVO vo) {
		vo.setStart((vo.getPage()-1) * vo.getSize());
		return session.selectList(namespace + ".lipurchase", vo);
	}

	@Override
	public int topurchase(String uid) {
		return session.selectOne(namespace + ".topurchase", uid);
	}

	@Override
	public List<HashMap<String, Object>> liorders(String oid) {
		return session.selectList(namespace + ".liorders", oid);
	}

}
