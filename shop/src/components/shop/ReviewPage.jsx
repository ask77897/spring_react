import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import "../Pagination.css";
import Pagination from 'react-js-pagination';

const ReviewPage = ({ pid }) => {
    const [body, setBody] = useState("");
    const [page, setPage] = useState(1);
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const size = 3;
    const getList = async () => {
        setLoading(true);
        const res = await axios(`/review/list.json?page=${page}&size=${size}&pid=${pid}`)
        //console.log(res.data);
        let data = res.data.list.map(r => r && { ...r, ellipsis: true, view: true, text:r.body });
        setList(data);
        setTotal(res.data.total);
        setLoading(false);
    }
    const onRegister = async () => {
        if (body === "") {
            alert("리뷰내용을 입력하세요.")
        } else {
            const data = { pid, uid: sessionStorage.getItem("uid"), body }
            //console.log(data);
            await axios.post(`/review/insert`, data);
            setBody('');
            getList();
        }
    }

    useEffect(() => {
        getList();
        //eslint-disable-next-line
    }, [page]);

    const onClickLogin = () => {
        sessionStorage.setItem("target", `/shop/info/${pid}`);
        window.location.href = "/login"
    }
    const onClickBody = (cid) => {
        const data = list.map(r => r.cid === cid ? { ...r, ellipsis: !r.ellipsis } : r);
        setList(data);
    }
    const onDelete = async (cid) => {
        if (window.confirm(`${cid}번 리뷰를 삭제하시겠습니까?`)) {
            await axios.post(`/review/delete/${cid}`);
            getList();
        }
    }
    const onClickUpdate = (cid) => {
        const data = list.map(r => r.cid === cid ? { ...r, view: false } : r);
        setList(data);
    }
    const onClickCancel = (cid) => {
        const data = list.map(r => r.cid === cid ? { ...r, view: true, body:r.text } : r);
        setList(data);
    }
    const onChangeBody = (e, cid) => {
        const data = list.map(r => r.cid === cid ? { ...r, body: e.target.value } : r);
        setList(data);
    }
    const onClickSave = async (cid, body, text) => {
        if(body===text){
            onClickCancel(cid);
        }else{
            if(window.confirm(`${cid}번 리뷰를 수정하시겠습니까?`)){
                await axios.post(`/review/update`, {cid, body});
                alert("수정되었습니다.");
                getList();
            }
        }
    }

    if (loading) return <div className='text-center my-5'><Spinner /></div>
    return (
        <div>
            {sessionStorage.getItem("uid") ?
                <div>
                    <Form.Control as="textarea" rows={5} placeholder='리뷰를 입력해주세요' onChange={(e) => setBody(e.target.value)} value={body} />
                    <div className='text-end mt-2'>
                        <Button className='btn-sm px-3 me-2' onClick={onRegister}>등록</Button>
                        <Button variant='secondary btn-sm px-3' type='reset'>취소</Button>
                    </div>
                </div>
                :
                <div className='mb-5'>
                    <Button className='w-100' onClick={onClickLogin}>로그인</Button>
                </div>
            }
            <div><span>리뷰수:{total}</span></div>
            <hr />
            <div className='my-5'>
                {list.map(r =>
                    <div key={r.cid}>
                        <div>
                            <small>{r.uid}</small>
                            <small>({r.regdate})</small>
                        </div>
                        {r.view ?
                            <>
                                <div className={r.ellipsis && "ellipsis2"} onClick={() => onClickBody(r.cid)} style={{ cursor: 'pointer' }}>[{r.cid}] {r.text}</div>
                                {sessionStorage.getItem("uid") === r.uid &&
                                    <div className='text-end'>
                                        <Button onClick={() => onClickUpdate(r.cid)} variant='success btn-sm'>수정</Button>
                                        <Button onClick={() => onDelete(r.cid)} variant='danger btn-sm ms-2'>삭제</Button>
                                    </div>
                                }
                            </>
                            :
                            <div>
                                <Form.Control as="textarea" rows={5} value={r.body} onChange={(e)=>onChangeBody(e, r.cid)} />
                                <div className='text-end mt-2'>
                                    <Button className='btn-sm' onClick={()=>onClickSave(r.cid, r.body, r.text)}>저장</Button>
                                    <Button variant='secondary btn-sm ms-2' onClick={() => onClickCancel(r.cid)}>취소</Button>
                                </div>
                            </div>
                        }
                        <hr />
                    </div>
                )}
            </div>
            {total > size &&
                <Pagination
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={total}
                    pageRangeDisplayed={10}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={(page) => setPage(page)} />
            }
        </div>
    )
}

export default ReviewPage