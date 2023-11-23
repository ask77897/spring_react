import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, InputGroup, Form, Row, Col, Button } from 'react-bootstrap';

const SearchPage = () => {
    const [list, setList] = useState([]);
    const [query, setQuery] = useState("노트북");
    const [page, setPage] = useState(1);
    const getList = async () => {
        const res = await axios(`/search/list.json?page=${page}&size=5&query=${query}`)
        //console.log(res.data);
        const data = res.data.items;
        setList(data);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (query === "") {
            alert("검색어를 입력해주세요.")
        } else {
            getList();
        }
    }
    const onRegister = async (shop) => {
        if(window.confirm("상품을 등록하시겠습니까?")){
            //console.log(shop);
            await axios.post("/shop/insert", shop);
            alert("상품등록 완료");
        }
    }

    useEffect(() => {
        getList();
        // eslint-disable-next-line
    }, [page])
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>상품검색</h1>
            <Row className='mb-2'>
                <Col md={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control placeholder='상품명, 제조사' value={query} onChange={(e) => setQuery(e.target.value)} />
                            <Button type='submit'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>이미지</td>
                        <td>품명</td>
                        <td>가격</td>
                        <td>제조사</td>
                        <td>상품등록</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(s =>
                        <tr key={s.productId}>
                            <td>{s.productId}</td>
                            <td><img src={s.image} alt='' width="50" /></td>
                            <td><div className='ellipsis'>{s.title}</div></td>
                            <td>{s.lprice}</td>
                            <td>{s.maker}</td>
                            <td><Button className='btn-sm' onClick={()=>onRegister(s)}>상품등록</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className='text-center'>
                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>이전</Button>
                <span className='mx-2'>{page}</span>
                <Button onClick={() => setPage(page + 1)} disabled={page === 10}>다음</Button>
            </div>
        </div>
    )
}

export default SearchPage