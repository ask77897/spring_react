import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert, Button, Form, InputGroup, Table } from 'react-bootstrap'
import ModalPost from '../user/ModalPost'

const OrderPage = ({ list, sum }) => {
    const [form, setForm] = useState('');
    const { uid, uname, phone, address1, address2 } = form;
    const getUser = async () => {
        const res = await axios(`/user/read?uid=${sessionStorage.getItem("uid")}`);
        setForm(res.data);
    }

    useEffect(() => {
        getUser();
    }, []);

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
    const onOrder = async () =>{
        if(window.confirm("위 상품들을 주문하시겠습니까?")){
            const orders = list.filter(s => s.checked);
            const res = await axios.post("/purchase/insert", 
                {
                    ...form,
                    sum:sum,
                    orders
                });
            for(const order of orders){
                await axios.post(`/cart/delete/${order.cid}`);
            }
            //console.log(res);
            //alert(res.data);
            window.location.href=`/order/complete/${res.data}`;
        }

    }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>주문하기</h1>
            <Table>
                <thead>
                    <tr className='text-center'>
                        <td colSpan={2}>상품명</td>
                        <td>상품가격</td>
                        <td>상품수량</td>
                        <td>합계</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(s => s.checked &&
                        <tr key={s.cid}>
                            <td><img src={`/display?file=${s.image}`} alt='' width='30' /></td>
                            <td>{s.title}</td>
                            <td className='text-end'>{s.fmtprice}</td>
                            <td>{s.qnt}개</td>
                            <td className='text-end'>{s.fmtsum}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Alert className='text-end'>
                <span>합계 : {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</span>
            </Alert>
            <h1 className='text-center mb-5'>주문자 정보</h1>
            <div>
                <form>
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
                </form>
                <div className='text-center mt-2'>
                    <Button onClick={onOrder}>주문하기</Button>
                </div>
            </div>
        </div>
    )
}

export default OrderPage