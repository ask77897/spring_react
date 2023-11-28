import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import "./Pagination.css";
import Pagination from 'react-js-pagination';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoHeartFill, GoComment } from "react-icons/go";

const HomePage = () => {
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const navi = useNavigate();
    const size = 6;
    const page = search.get("page") ? parseInt(search.get("page")) : 1;
    const [query, setQuery] = useState('');
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const getList = async () => {
        setLoading(true);
        const res = await axios(`/shop/list.json?page=${page}&size=${size}&query=${query}`);
        //console.log(res.data);
        setList(res.data.list);
        setTotal(res.data.total);
        setLoading(false);
    }

    useEffect(() => {
        getList();
        //eslint-disable-next-line
    }, [location]);

    const onSubmit = (e) => {
        e.preventDefault();
        navi(`/?page=1&size=${size}&query=${query}`);
    }

    if(loading) return <div className='text-center my-5'><Spinner /></div>
    return (
        <div className='my-5'>
            <Row className='mb-2'>
                <Col md={4} className='mb-2'>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control placeholder='상품명, 제조사' value={query} onChange={(e)=>setQuery(e.target.value)} />
                            <Button type='submit'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
                <Col>
                    <span>상품 수 : {total}개</span>
                </Col>
            </Row>
            <Row>
                {list.map(shop=>
                <Col key={shop.pid} xs={6} md={4} lg={2} className='mb-3' >
                    <Card style={{cursor:'pointer'}}>
                        <Link to={`/shop/info/${shop.pid}`}>
                            <Card.Body>
                                <img src={`/display?file=${shop.image}`} alt='' width="90%" />
                                <div className='ellipsis'>{shop.title}</div>
                                <div className='price'>{shop.fmtprice}</div>
                            </Card.Body>
                        </Link>
                        <Card.Footer>
                            <div className='text-end'>
                                <GoHeartFill className='heart' />
                                <small style={{fontSize:'0.7rem'}} >{shop.fcnt}</small>
                                <GoComment className='ms-2'/>
                                <small style={{fontSize:'0.7rem'}}>{shop.reviewcnt}</small>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
                )}
            </Row>
            {total > size &&
                <Pagination
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={total}
                    pageRangeDisplayed={10}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={(page)=>{navi(`/?page=${page}&size=${size}&query=${query}`)}}/>
            }
        </div>
    )
}

export default HomePage