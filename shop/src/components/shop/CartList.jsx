import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import "../Pagination.css";
import Pagination from 'react-js-pagination';
import OrderPage from './OrderPage';

const CartList = () => {
    const [isOrder, setIsOrder] = useState(false);
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [cnt, setCnt] = useState(0);
    const [sum, setSum] = useState(0);
    const [checksum, setCheckSum] = useState(0);
    const size = 50;
    const uid = sessionStorage.getItem("uid");
    const getList = async () => {
        const res = await axios(`/cart/list.json?page=${page}&size=${size}&uid=${uid}`);
        //console.log(res.data);
        const data = res.data.list.map(c => c && { ...c, checked: false })
        setList(data);
        setTotal(res.data.total);
        setSum(res.data.sum);
    }

    useEffect(() => {
        getList();
        //eslint-disable-next-line
    }, [page])
    useEffect(() => {
        let count = 0;
        let sum = 0;
        list.forEach(c => {
            if (c.checked) {
                count++;
                sum += c.sum;
            }
        });
        //console.log(count);
        setCnt(count);
        setCheckSum(sum);
    }, [list])

    const onDelete = async (cid) => {
        await axios.post(`/cart/delete/${cid}`)
        getList();
    }
    const onChangeAll = (e) => {
        const data = list.map(c => c && { ...c, checked: e.target.checked });
        setList(data);
    }
    const onChangeSingle = (e, cid) => {
        const data = list.map(c => c.cid === cid ? { ...c, checked: e.target.checked } : c);
        setList(data);
    }
    const onDeleteChecked = async () => {
        if (cnt === 0) {
            alert("삭제할 상품을 선택해주세요.");
        } else {
            for (const c of list) {
                if (c.checked) {
                    //console.log(c);
                    await axios.post(`/cart/delete/${c.cid}`)
                }
            }
            getList();
        }
    }
    const onChangeQnt = (e, cid) => {
        const data = list.map(c => c.cid === cid ? { ...c, qnt: e.target.value } : c);
        setList(data);
    }
    const onUpdateQnt = async (cid, qnt) => {
        await axios.post("/cart/update/qnt", { cid, qnt });
        alert("수정되었습니다.")
        getList();
    }
    const onClickOrder = () => {
        if (cnt === 0) {
            alert("주문할 상품을 선택해주세요.");
        } else {
            setIsOrder(true);
        }
    }

    return (
        <>
            {!isOrder ?
                <div className='my-5'>
                    <h1 className='text-center mb-5'>장바구니</h1>
                    {list.length > 0 ?
                        <>
                            <Row>
                                <Col>
                                    <span>상품 수 : {total}</span>
                                </Col>
                                <Col className='text-end mb-2'>
                                    <Button className='btn-sm' onClick={onDeleteChecked}>선택상품삭제</Button>
                                </Col>
                            </Row>
                            <Table striped bordered>
                                <thead className='text-center'>
                                    <tr>
                                        <th><input type='checkbox' checked={list.length === cnt} onChange={onChangeAll} /></th>
                                        <th colSpan={2}>상품명</th>
                                        <th>가격</th>
                                        <th>수량</th>
                                        <th>합계</th>
                                        <th>삭제</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map(c =>
                                        <tr key={c.cid} className='text-center'>
                                            <td><input type='checkbox' checked={c.checked} onChange={(e) => onChangeSingle(e, c.cid)} /></td>
                                            <td><img src={`/display?file=${c.image}`} alt='' width='50' /></td>
                                            <td className='text-start'>{c.title}</td>
                                            <td className='text-end'>{c.fmtprice}원</td>
                                            <td>
                                                <InputGroup className='cart_input_group'>
                                                    <Form.Control onChange={(e) => onChangeQnt(e, c.cid)} type='number' min={1} value={c.qnt} />
                                                    <Button variant='outline-dark' onClick={() => onUpdateQnt(c.cid, c.qnt)}>수정</Button>
                                                </InputGroup>
                                            </td>
                                            <td className='text-end'>{c.fmtsum}원</td>
                                            <td><Button variant='danger btn-sm' onClick={() => onDelete(c.cid)}>삭제</Button></td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            <Alert>
                                <Row>
                                    <Col>
                                        선택 합계 : {checksum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
                                    </Col>
                                    <Col className='text-end'>
                                        전체 합계 : {sum}원
                                    </Col>
                                </Row>
                            </Alert>
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
                            <div className='text-center'>
                                <Button className='px-5' onClick={onClickOrder}>주문하기</Button>
                            </div>
                        </>
                        :
                        <Alert className='text-center'>
                            장바구니가 비었습니다.
                        </Alert>
                    }
                </div>
                :
                <OrderPage list={list} sum={checksum} />
            }
        </>
    )
}

export default CartList