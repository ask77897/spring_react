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
        setList(res.data.list);
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
    }, [page])

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
                <div>
                    <Button className='w-100'>로그인</Button>
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
                        <div>{r.body}</div>
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
                    onChange={(page)=>setPage(page)}/>
            }
        </div>
    )
}

export default ReviewPage