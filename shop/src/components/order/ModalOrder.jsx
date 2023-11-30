import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalOrder = ({ p }) => {
    const [show, setShow] = useState(false);
    const [orders, setOrders] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const getOrders = async () => {
        const res = await axios(`/purchase/list.json/${p.oid}`);
        console.log(res.data);
        setOrders(res.data);
    }

    useEffect(() => {
        getOrders();
        //eslint-disable-next-line
    }, [])
    return (
        <>
            <Button variant="primary btn-sm" onClick={handleShow}>
                상세보기
            </Button>

            <Modal size='lg' show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>주문번호 : {p.oid}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div>주문자 : {p.uname}({p.uid})</div>
                            <div>전화번호 : {p.phone}</div>
                            <div>배송지 : {p.address1}({p.address2})</div>
                            <div>합계 : {p.fmtsum}</div>
                        </Card.Body>
                    </Card>
                    <h3 className='text-center my-3'>주문상품</h3>
                    <Table striped bordered>
                        <thead>
                            <tr className='text-center'>
                                <th colSpan={2}>상품명</th>
                                <th>가격</th>
                                <th>수량</th>
                                <th>합계</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o=>
                            <tr key={o.pid}>
                                <td><img src={`/display?file=${o.image}`} alt='' width='50'/></td>
                                <td>{o.title}</td>
                                <td className='text-end'>{o.fmtprice}원</td>
                                <td>{o.qnt}</td>
                                <td className='text-end'>{o.fmtsum}원</td>
                            </tr>
                            )}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalOrder