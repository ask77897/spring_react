import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import ModalPost from './ModalPost';

const MyPage = () => {
    const [form, setForm] = useState('');
    const { uid, uname, address1, address2, phone } = form;
    const getUser = async () => {
        const res = await axios(`/user/read?uid=${sessionStorage.getItem("uid")}`);
        //console.log(res.data);
        setForm(res.data);

    }

    useEffect(() => {
        getUser();
    }, [])

    const onChangeForm = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        });
    }
    const onPostCode = (address) => {
        setForm({
            ...form,
            address1:address
        })
    }
    const onReset = (e) => {
        e.preventDefault();
        getUser();
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if(window.confirm("수정된 내용을 저장하시겠습니까?")){
            await axios.post("/user/update", form);
            alert("수정되었습니다.")
            window.location.href="/"
        }
    }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>정보수정</h1>
            <Row className='justify-content-center'>
                <Col md={8}>
                    <form name='frm' onReset={onReset} onSubmit={onSubmit}>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text>아이디</InputGroup.Text>
                            <Form.Control name='uid' value={uid} readOnly />
                        </InputGroup>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text>이름</InputGroup.Text>
                            <Form.Control name='uname' onChange={onChangeForm} value={uname} />
                        </InputGroup>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text>전화</InputGroup.Text>
                            <Form.Control name='phone' onChange={onChangeForm} value={phone} />
                        </InputGroup>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text>주소</InputGroup.Text>
                            <Form.Control name='address1' value={address1} readOnly />
                            <ModalPost onPostCode={onPostCode} />
                        </InputGroup>
                        <Form.Control name='address2' onChange={onChangeForm} value={address2} placeholder='상세주소' />
                        <div className='text-center mt-3'>
                            <Button type="submit">수정</Button>
                            <Button type='reset' variant='secondary ms-2'>취소</Button>
                        </div>
                    </form>
                </Col>
            </Row>
        </div>
    )
}

export default MyPage