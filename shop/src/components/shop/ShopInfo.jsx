import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Spinner, Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import { GoHeart, GoHeartFill } from "react-icons/go";
import ReviewPage from './ReviewPage';

const ShopInfo = () => {
    const { pid } = useParams();
    const [shop, setShop] = useState('');
    const [loading, setLoading] = useState(false);
    const { title, maker, image, fmtprice, fmtdate, ucnt, fcnt } = shop;

    const getShop = async () => {
        setLoading(true);
        const res = await axios(`/shop/info/${pid}?uid=${sessionStorage.getItem("uid")}`);
        //console.log(res.data);
        setShop(res.data);
        setLoading(false);
    }

    useEffect(() => {
        getShop();
        //eslint-disable-next-line
    }, [])

    const onClickHeart = async () => {
        if (!sessionStorage.getItem("uid")) {
            sessionStorage.setItem("target", `/shop/info/${pid}`);
            window.location.href = "/login";
        } else {
            await axios(`/shop/insert/favorite?uid=${sessionStorage.getItem("uid")}&pid=${pid}`);
            getShop();
        }
    }
    const onClickFillHeart = async () => {
        await axios(`/shop/delete/favorite?uid=${sessionStorage.getItem("uid")}&pid=${pid}`);
        alert("좋아요 취소");
        getShop();
    }

    if (loading) return <div className='text-center my-5'><Spinner /></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>[{pid}]상품정보</h1>
            <Row>
                <Col md={4}>
                    <img src={`/display?file=${image}`} alt='' width='90%' />
                </Col>
                <Col>
                    <h5>
                        [{pid}] {title}
                        <span className='ms-2 heart'>
                            {ucnt === 0 ? <GoHeart onClick={onClickHeart} /> : <GoHeartFill onClick={onClickFillHeart} />}
                            <small style={{ fontSize: '0.7rem' }}>{fcnt}</small>
                        </span>

                    </h5>
                    <hr />
                    <div>가격 : {fmtprice}원</div>
                    <div>제조사 : {maker}</div>
                    <div>등록일 : {fmtdate}</div>
                    <hr />
                    <div className='text-center'>
                        <Button variant='warning px-5'>바로구매</Button>
                        <Button variant='success px-5 ms-3'>장바구니</Button>
                    </div>
                </Col>
            </Row>
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="home" title="상세설명">
                    상세설명
                </Tab>
                <Tab eventKey="profile" title="상품리뷰">
                    <ReviewPage pid={pid}/>
                </Tab>
            </Tabs>
        </div>
    )
}

export default ShopInfo