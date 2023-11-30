import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import "../Pagination.css";
import Pagination from 'react-js-pagination';
import ModalOrder from '../order/ModalOrder';

const OrderList = () => {
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [key, setKey] = useState("uid");
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const size = 3;

    const getList = async () => {
        const res = await axios(`/purchase/admin/list.json?key=${key}&query=${query}&page=${page}&size=${size}`);
        //console.log(res.data);
        setList(res.data.list);
        setTotal(res.data.total);
    }

    useEffect(() => {
        getList();
        //eslint-disable-next-line
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        getList();
    }
    const onChangeStatus = (e, oid) => {
        const data = list.map(p => p.oid === oid ? { ...p, status: e.target.value } : p);
        setList(data);
    }
    const onClickStaus = async (status, oid) => {
        await axios.post('/purchase/update/status', { status, oid });
        alert("상태변경");
        getList();
    }
    const onChangeKey = (e) => {
        setQuery("");
        setKey(e.target.value);
    }
    // const onSubmitStatus = (e) => {
    //     e.preventDefault();
    //     setKey("status");
    //     setPage(1);
    //     getList();
    // }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>주문관리</h1>
            <Row className='mb-2'>
                <Col md={5}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Select onChange={onChangeKey}>
                                <option value="oid">주문번호</option>
                                <option value="uname">주문자명</option>
                                <option value="uid">아이디</option>
                                <option value="address1">배송지</option>
                                <option value="phone">전화번호</option>
                                <option value="status">주문상태</option>
                            </Form.Select>
                            {key === 'status' ?
                                <Form.Select onChange={(e) => setQuery(e.target.value)}>
                                    <option value={""}>모든주문</option>
                                    <option value={0}>결제확인중</option>
                                    <option value={1}>결제완료</option>
                                    <option value={2}>배송준비중</option>
                                    <option value={3}>배송중</option>
                                    <option value={4}>배송완료</option>
                                    <option value={5}>주문완료</option>
                                </Form.Select>
                                :
                                <Form.Control placeholder='검색어' value={query} onChange={(e) => setQuery(e.target.value)} />
                            }
                            <Button type='submit'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
                <Col className='text-end'>
                    <span className='mt-2'>검색 수 : {total}건</span>
                </Col>
                {/* <Col col={4} className='text-end'>
                    <InputGroup>
                        <Form.Select onChange={(e) => setQuery(e.target.value)} onClick={onSubmitStatus}>
                            <option value={0}>결제확인중</option>
                            <option value={1}>결제완료</option>
                            <option value={2}>배송준비중</option>
                            <option value={3}>배송중</option>
                            <option value={4}>배송완료</option>
                            <option value={5}>주문완료</option>
                        </Form.Select>
                    </InputGroup>
                </Col> */}
            </Row>
            <Table striped bordered>
                <thead>
                    <tr className='text-center'>
                        <td>주문번호</td>
                        <td>주문자명</td>
                        <td>배송지</td>
                        <td>전화번호</td>
                        <td>주문상태</td>
                        <td>상세정보</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(p =>
                        <tr key={p.oid} className='text-center'>
                            <td>{p.oid}</td>
                            <td>{p.uname}({p.uid})</td>
                            <td>{p.address1}</td>
                            <td>{p.phone}</td>
                            <td>
                                <InputGroup>
                                    <Form.Select value={p.status} onChange={(e) => onChangeStatus(e, p.oid)} >
                                        <option value={0}>결제확인중</option>
                                        <option value={1}>결제완료</option>
                                        <option value={2}>배송준비중</option>
                                        <option value={3}>배송중</option>
                                        <option value={4}>배송완료</option>
                                        <option value={5}>주문완료</option>
                                    </Form.Select>
                                    <Button onClick={() => onClickStaus(p.status, p.oid)}>변경</Button>
                                </InputGroup>
                            </td>
                            <td><ModalOrder p={p}/></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {total > size &&
                <Pagination
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={total}
                    pageRangeDisplayed={10}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={(page) => setPage(page)} />
            }
        </div>
    )
}

export default OrderList