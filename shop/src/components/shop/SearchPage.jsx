import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, InputGroup, Form, Row, Col, Button, Spinner } from 'react-bootstrap';

const SearchPage = () => {
    const [list, setList] = useState([]);
    const [query, setQuery] = useState("노트북");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [cnt, setCnt] = useState(0);
    const getList = async () => {
        setLoading(true);
        const res = await axios(`/search/list.json?page=${page}&size=5&query=${query}`)
        //console.log(res.data);
        let data = res.data.items.map(s => s && { ...s, title: stripHtmlTags(s.title) });
        data = data.map(item => item && { ...item, checked: false });
        setList(data);
        setLoading(false);
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
        if (window.confirm("상품을 등록하시겠습니까?")) {
            //console.log(shop);
            await axios.post("/shop/insert", shop);
            alert("상품등록 완료");
        }
    }
    const onChangeAll = (e) => {
        //console.log(e.target.checked);
        const data = list.map(item => item && { ...item, checked: e.target.checked });
        setList(data);
    }
    const onChangeSingle = (e, productId) => {
        const data = list.map(item => item.productId === productId ? { ...item, checked: e.target.checked } : item);
        setList(data);
    }
    const onCheckedSave = async () => {
        if (cnt === 0) {
            alert("저장할 상품을 선택하세요.");
        } else {
            if (window.confirm(`${cnt}개 상품을 등록하시겠습니까?`)) {
                setLoading(true);
                for (const item of list) {
                    if (item.checked) {
                        //console.log(item);
                        await axios.post("/shop/insert", item);
                    }
                }
                setLoading(false);
                alert("상품등록완료");
                getList();
            }
        }
    }
    // HTML 태그를 제거하는 함수
    const stripHtmlTags = (htmlString) => {
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        return doc.body.textContent || "";
    }

    useEffect(() => {
        let chk = 0;
        list.forEach(item => {
            if (item.checked) chk++;
        });
        //console.log(chk)
        setCnt(chk);
    }, [list])

    useEffect(() => {
        getList();
        // eslint-disable-next-line
    }, [page])

    if (loading) return <div className='text-center my-5'><Spinner /></div>
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
            <Table striped bordered>
                <thead>
                    <tr>
                        <td><input type='checkbox' onChange={onChangeAll} checked={list.length === cnt} /></td>
                        <td>ID</td>
                        <td>이미지</td>
                        <td>품명</td>
                        <td>가격</td>
                        <td>제조사</td>
                        <td><Button onClick={onCheckedSave} className='btn-sm'>선택상품등록</Button></td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(s =>
                        <tr key={s.productId}>
                            <td><input type='checkbox' checked={s.checked} onChange={(e) => { onChangeSingle(e, s.productId) }} /></td>
                            <td>{s.productId}</td>
                            <td><img src={s.image} alt='' width="50" /></td>
                            <td><div className='ellipsis2'>{s.title}</div></td>
                            <td>{s.lprice}</td>
                            <td>{s.maker}</td>
                            <td><Button className='btn-sm' onClick={() => onRegister(s)}>상품등록</Button></td>
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