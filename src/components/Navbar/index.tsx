import React, { useContext } from 'react'
import { Menu, Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import "./styles.css";
import { AuthContext } from '../../context/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate()
  const { SubMenu } = Menu;
  const { Header } = Layout;
  const { logout, user }: any = useContext(AuthContext)
  
  console.log('USER', user)

  const fullLogout = () => {
    logout()
    localStorage.clear();
    navigate('/')
  }

  return (
    <>

      <Header className="site-layout-background" style={{ paddingLeft: 0 }} >
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">
            <Menu.Item >
              Bypass Gastrico
            </Menu.Item>

          </Menu.Item>
         
          <SubMenu key="sub1" icon={<UserOutlined />} title={user.firstname + " " + user.lastname}
          style={{
            position:'absolute',
            right: 0
          }}
          >
            <Menu.Item key="6" onClick={fullLogout} >
              Salir
            </Menu.Item>
          </SubMenu>

        </Menu>
      </Header>
    </>
  );
};