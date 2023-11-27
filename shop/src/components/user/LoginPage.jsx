import axios from 'axios';
import React, { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { setCookie } from "../../common.js"

const LoginPage = () => {
    const [checked, setChecked] = useState(false);
    const [form, setForm] = useState({
        uid: '',
        upass: ''
    });
    const { uid, upass } = form;
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post("/user/login", form);
        if (res.data === 0) {
            alert("존재하지 않는 아이디입니다.");
        } else if (res.data === 2) {
            alert("비밀번호가 일치하지 않습니다.");
        } else {
            if (checked) {
                setCookie("uid", uid, 7)
            }
            sessionStorage.setItem("uid", uid);
            if(sessionStorage.getItem("target")){
                window.location.href=sessionStorage.getItem("target");
            }else{
                window.location.href = "/";
            }
        }
    }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>로그인</h1>
            <Row className='justify-content-center'>
                <Col md={5}>
                    <Card className='p-3'>
                        <form onSubmit={onSubmit}>
                            <Form.Control name='uid' placeholder='아이디' className='mb-2' value={uid} onChange={onChange} />
                            <Form.Control name='upass' placeholder='비밀번호' type='password' className='mb-2' value={upass} onChange={onChange} />
                            <Button className='w-100 mb-2' type="submit">로그인</Button>
                            <Button className='w-100' variant='secondary'>회원가입</Button>
                            {/*<div className='text-center'>
                                <a href='/'>아이디</a>|<a href='/'>비밀번호 찾기</a>
                            </div>*/}
                        </form>
                        <div className='mt-2 text-end'>
                            <input type='checkbox' checked={checked} onChange={(e) => setChecked(e.target.checked)} />
                            <span className='ms-2'>자동로그인</span>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default LoginPage