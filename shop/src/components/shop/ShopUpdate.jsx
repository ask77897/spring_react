import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, InputGroup, Row, Tabs, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import ContentPage from './ContentPage';

const ShopUpdate = () => {
    const { pid } = useParams();
    const [form, setForm] = useState("");
    const [src, setSrc] = useState("http://via.placeholder.com/200x200");
    const [file, setFile] = useState(null);
    const ref_file = useRef(null);
    const getShop = async () => {
        const res = await axios.get(`/shop/read/${pid}`);
        const data = {...res.data, html:content}
        //console.log(res.data);
        setForm(data);
    }
    const { title, lprice, image, fmtdate, maker, content } = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (window.confirm("상품정보를 수정하시겠습니까?")) {
            //console.log(form);
            await axios.post("/shop/update", form);
            alert("수정완료");
        }
    }
    const onChangeFile = (e) => {
        setSrc(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0]);
    }
    const onSaveImage = async () => {
        if(!file){
            alert('변경할 이미지를 선택해주세요.')
        }else{
            if(window.confirm("이미지를 변경하시겠습니까?")){
                const formData = new FormData();
                formData.append("file", file);
                formData.append("pid", pid);
                await axios.post("/shop/image", formData);
                alert("변경완료");
                await axios(`/deleteFile?file=${image}`);
                getShop();
                setSrc("http://via.placeholder.com/200x200");
                setFile(null);
            }
        }
    }

    useEffect(() => {
        getShop();
        //eslint-disable-next-line
    }, [])
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>상품정보수정</h1>
            <Tabs defaultActiveKey="home" id="fill-tab-example" className="mb-3" fill>
                <Tab eventKey="home" title="상품정보">
                    <Row className='justify-content-center'>
                        <Col md={8}>
                            <form className='card p-3' onSubmit={onSubmit}>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text>상품번호</InputGroup.Text>
                                    <Form.Control value={pid} readOnly />
                                </InputGroup>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text>상품이름</InputGroup.Text>
                                    <Form.Control name='title' value={title} onChange={onChange} />
                                </InputGroup>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text>상품가격</InputGroup.Text>
                                    <Form.Control name='lprice' value={lprice} onChange={onChange} />
                                </InputGroup>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text>제조사</InputGroup.Text>
                                    <Form.Control name='maker' value={maker} onChange={onChange} />
                                </InputGroup>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text>등록일</InputGroup.Text>
                                    <Form.Control value={fmtdate} readOnly />
                                </InputGroup>
                                <div className='text-center mt-3'>
                                    <Button type='submit'>수정</Button>
                                    <Button type='reset' className='ms-2' variant='secondary'>취소</Button>
                                </div>
                            </form>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="profile" title="상품사진">
                    <Row>
                        <Col className='card py-3'>
                            <h5 className='text-center'>변경 전</h5>
                            <div className='text-center'>
                                <img src={`/display?file=${image}`} width="75%" alt='' style={{ border: '1px solid gray' }} />
                            </div>
                        </Col>
                        <Col md={1}></Col>
                        <Col className='card py-3'>
                            <h5 className='text-center'>변경 후</h5>
                            <div className='text-center'>
                                <img onClick={()=>ref_file.current.click()}
                                    src={src} width="75%" alt='' style={{ cursor: 'pointer' }} />
                                <input type='file' ref={ref_file} style={{display:'none'}}  onChange={onChangeFile}/>
                            </div>
                        </Col>
                        <div className='text-center mt-3'>
                            <Button className='w-50' onClick={onSaveImage}>이미지저장</Button>
                        </div>
                    </Row>
                </Tab>
                <Tab eventKey="content" title="상세설명">
                    <ContentPage pid={pid} form={form} setForm={setForm} getShop={getShop} />
                </Tab>
            </Tabs>
        </div>
    )
}

export default ShopUpdate