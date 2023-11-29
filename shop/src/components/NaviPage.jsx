import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import SearchPage from './shop/SearchPage';
import ShopList from './shop/ShopList';
import ShopUpdate from './shop/ShopUpdate';
import LoginPage from './user/LoginPage';
import { getCookie, delCookie } from '../common';
import HomePage from './HomePage';
import ShopInfo from './shop/ShopInfo';
import CartList from './shop/CartList';
import { MdOutlineShoppingCart } from "react-icons/md";
import MyPage from './user/MyPage';
import OrderComplete from './order/OrderComplete';
import OrderList from './order/OrderList';

const NaviPage = () => {
    const location = useLocation();
    const path = location.pathname;
    const onLogout = (e) => {
        e.preventDefault();
        if (window.confirm("로그아웃 하시겠습니까?")) {
            sessionStorage.clear();
            delCookie('uid')
            window.location.href = "/";
        }
    }
    const uid = getCookie('uid');
    if(uid) sessionStorage.setItem("uid", uid);
    return (
        <>
            <Navbar expand="lg" bg="primary" data-bs-theme="dark">
                <Container fluid>
                    <Navbar.Brand href="/">LOGO</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100%' }}
                            navbarScroll>
                            <Nav.Link href="/shop/search" className={path.indexOf('/shop/search') !== -1 && 'active'}>상품검색</Nav.Link>
                            <Nav.Link href="/shop/list" className={path.indexOf('/shop/') !== -1 && 'active'}>상품관리</Nav.Link>
                            <Nav.Link href="/order/list" className={path.indexOf('/order/') !== -1 && 'active'}>주문목록</Nav.Link>
                        </Nav>
                        <Nav>
                            {sessionStorage.getItem("uid") ?
                                <>
                                    <Nav.Link href="/cart/list" className={path.indexOf('/cart/') !== -1 && 'active'}><MdOutlineShoppingCart /></Nav.Link>
                                    <Nav.Link href="/mypage" className='active'>{sessionStorage.getItem("uid")}</Nav.Link>
                                    <Nav.Link href="/logout" onClick={onLogout}>로그아웃</Nav.Link>
                                </>
                                :
                                <Nav.Link href="/login" className={path.indexOf('/login') !== -1 && 'active'}>로그인</Nav.Link>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/mypage' element={<MyPage />} />

                <Route path='/shop/search' element={<SearchPage />} />
                <Route path='/shop/list' element={<ShopList />} />
                <Route path='/shop/update/:pid' element={<ShopUpdate />} />
                <Route path='/shop/info/:pid' element={<ShopInfo />} />

                <Route path='/cart/list' element={<CartList/>}/>
                <Route path='/order/complete/:oid' element={<OrderComplete/>}/>
                <Route path='/order/list' element={<OrderList/>}/>
            </Routes>
        </>
    )
}

export default NaviPage