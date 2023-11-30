import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Form, Tab, Tabs } from 'react-bootstrap';
import axios from 'axios';

const ContentPage = ({ pid, form, setForm, getShop }) => {
    const onChangeContent = (data) => {
        //console.log(data);
        setForm({
            ...form,
            content: data
        })
    }
    const onClickSave = async () => {
        if (form.content === "") {
            alert("내용을 입력해주세요.")
        } else {
            if (window.confirm("저장하시겠습니까?")) {
                const data = { pid, content: form.content };
                //console.log(data);
                await axios.post("/shop/update/content", data);
                alert("수정완료");
                getShop();
            }
        }
    }
    const onClickSaveHtml = async () => {
        if (form.html === "") {
            alert("내용을 입력해주세요.")
        } else {
            if (window.confirm("저장하시겠습니까?")) {
                const data = { pid, content: form.html };
                //console.log(data);
                await axios.post("/shop/update/content", data);
                alert("수정완료");
                getShop();
            }
        }
    }
    const onChangeHTML = (e) => {
        setForm({
            ...form,
            html:e.target.value
        });
    }

    return (
        <>
            <Tabs defaultActiveKey="editor" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="editor" title="editor">
                    <div className='text-end mb-2'>
                        <Button className='px-5' onClick={onClickSave}>저장</Button>
                    </div>
                    <CKEditor config={{ ckfinder: { uploadUrl: '/shop/ckupload/' + pid } }}
                        editor={ClassicEditor}
                        data={form.content}
                        onChange={(event, editor) => { onChangeContent(editor.getData()); }} />
                </Tab>
                <Tab eventKey="html" title="HTML">
                    <div className='text-end mb-2'>
                        <Button className='px-5' onClick={onClickSaveHtml}>저장</Button>
                    </div>
                    <Form.Control onChange={onChangeHTML} as="textarea" rows={20} value={form.html} />
                </Tab>
            </Tabs>
        </>
    )
}

export default ContentPage