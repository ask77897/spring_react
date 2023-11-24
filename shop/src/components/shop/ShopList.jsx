import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, InputGroup, Row, Spinner, Table } from 'react-bootstrap';
import "../Pagination.css";
import Pagination from 'react-js-pagination';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ShopList = () => {
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const navi = useNavigate();
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const size = 5;
    const page = search.get("page") ? parseInt(search.get("page")) : 1;
    const getList = async () => {
        setLoading(true);
        const res = await axios.get(`/shop/list.json?page=${page}&size=${size}&query=${query}`);
        //console.log(res.data);
        const data = res.data.list.map(s=>s && {...s, title:stripHtmlTags(s.title)});
        setList(data);
        setTotal(res.data.total);
        setLoading(false);
    }

    // HTML 태그를 제거하는 함수
    const stripHtmlTags = (htmlString) => {
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        return doc.body.textContent || "";
    }

    const onSubmit = (e) => {
        e.preventDefault();
        navi(`/shop/list?page=1&size=${size}&query=${query}`);
    }
    const onDelete = async (shop) => {
        if(window.confirm(`${shop.pid}번 상품을 삭제하시겠습니까?`)){
            await axios(`/shop/delete?pid=${shop.pid}`);
            await axios(`/deleteFile?file=${shop.image}`);
            alert("삭제완료");
            navi(`/shop/list?page=1&size=${size}&query=${query}`);
        }
    }

    useEffect(()=>{
        getList();
        //eslint-disable-next-line
    },[location])

    if(loading) return <div className='text-center my-5'><Spinner/></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>상품목록</h1>
            <Row className='mb-2'>
                <Col md={5}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control placeholder='상품명, 제조사' value={query} onChange={(e)=>setQuery(e.target.value)}/>
                            <Button type='submit'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
                <Col>
                    <span>상품수 : {total}개</span>
                </Col>
            </Row>
            <Table striped bordered>
                <thead>
                    <tr className='text-center'>
                        <td colSpan={2}>ID</td>
                        <td>상품명</td>
                        <td>상품가격</td>
                        <td>제조사</td>
                        <td>등록일</td>
                        <td>삭제</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(s=>
                        <tr key={s.pid}>
                            <td>{s.pid}</td>
                            <td><img src={`/display?file=${s.image}`} alt='' width='50px'/></td>
                            <td>
                                <Link to={`/shop/update/${s.pid}`}>
                                    <div className='ellipsis2'>{s.title}</div>
                                </Link>
                            </td>
                            <td className='text-end'>{s.fmtprice}원</td>
                            <td>{s.maker}</td>
                            <td>{s.fmtdate}</td>
                            <td><Button className='btn-sm' variant='danger' onClick={()=>onDelete(s)}>삭제</Button></td>
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
                    onChange={(page)=>{navi(`/shop/list?page=${page}&size=${size}&query=${query}`)}}/>
            }
        </div>
    )
}

export default ShopList