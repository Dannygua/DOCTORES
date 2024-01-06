import {Col, Row } from 'antd';
import React from 'react'; 
import './styles.css';
import { FormLogin } from '../../components/Login/FormLogin';
import { isMobile } from 'react-device-detect';
import { DefaultNav, MobileNav } from '../AllUsers/InfoPage';


const LoginPage = () => {
    
    return(
        <>
        {isMobile ? <MobileNav /> : <DefaultNav /> }
        <div className='content-principal'>
            <Row>
                <Col xxl={12} xl={12} lg={12}  md={24} sm={24} xs={24} className="login-first-col">
                    <img src="./jump2.png" alt="" />
                </Col>
                <Col xxl={12} xl={12} lg={12}  md={24} sm={24} xs={24} className="login-second-col">
                    <FormLogin />
                </Col>
            </Row>
        </div>
        </>
    )
}

export default LoginPage;