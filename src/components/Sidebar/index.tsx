import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Layout, Menu, MenuTheme, Modal, Row, Col, MenuProps, Dropdown, Space, Typography } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  DashboardOutlined,
  CalendarOutlined,
  FolderOutlined,
  TeamOutlined,
  WomanOutlined,
  QuestionCircleOutlined,
  HeartOutlined,
  DownOutlined,
  BarChartOutlined,
  ExperimentOutlined,
  FileTextOutlined 
} from "@ant-design/icons";
import "./styles.css";
import { AuthContext } from "../../context/AuthContext";
import NotificationList from "../NotificationList";


interface IMenuOptionsProps {
  theme?: MenuTheme;
  closeModal?: any
}

const MenuOptions = ({ theme = "dark", closeModal = () => console.log('Default close') }: IMenuOptionsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user }: any = useContext(AuthContext);

  const goToPage = (page: string) => {
    //Se valida que la ruta la que quiero ir es diferente a la de origen, sino no tiene sentido navegar ni reiniciar el state de items
    if (location.pathname !== page) {
      navigate(page);
      closeModal()
    }
  };

  return (
    <Menu theme={theme} defaultSelectedKeys={["1"]} mode="inline" className="auth-menu">
      {user.isDoctor && (
        <>
          <Menu.Item
            key="2"
            icon={<FolderOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/citas")}
          >
            Citas
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<WomanOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/pacientes")}
          >
            Pacientes
          </Menu.Item>

          <Menu.Item
            key="4"
            icon={<CalendarOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/calendario")}
          >
            Calendario
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<TeamOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/personal")}
          >
            Personal
          </Menu.Item>
          <Menu.Item
            key="6"
            icon={<QuestionCircleOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/preguntas")}
          >
            Preguntas frecuentes
          </Menu.Item>
          <Menu.Item
            key="7"
            icon={<HeartOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/simulacion")}
          >
            Simulación corporal
          </Menu.Item>

          <Menu.Item
            key="8"
            icon={<ExperimentOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/examenes")}
          >
            Exámenes
          </Menu.Item>

          <Menu.Item
            key="9"
            icon={< FileTextOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/cirugiaIndicaciones")}
          >
            Indicaciones para cirugia
          </Menu.Item>
        </>
      )}
      {user.isPatient && (
        <>
          <Menu.Item
            key="1"
            icon={<CalendarOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/calendario")}
          >
            Calendario
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<FolderOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/citas")}
          >
            Citas
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<BarChartOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/avance")}
          >
            Informe analítico
          </Menu.Item>

          <Menu.Item
            key="5"
            icon={<HeartOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/simulacion")}
          >
            Simulación corporal
          </Menu.Item>


        </>
      )}

      {user.isNutri && (
        <>
          <Menu.Item
            key="1"
            icon={<FolderOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/citas")}
          >
            Citas
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<CalendarOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/calendario")}
          >
            Calendario
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<WomanOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/pacientes")}
          >
            Pacientes
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<HeartOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/simulacion")}
          >
            Simulación corporal
          </Menu.Item>
        </>
      )}


      {user.isPychologist && (
        <>
          <Menu.Item
            key="1"
            icon={<FolderOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/citas")}
          >
            Citas
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<WomanOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/pacientes")}
          >
            Pacientes
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<CalendarOutlined />}
            className="navbar-brand"
            onClick={() => goToPage("/calendario")}
          >
            Calendario
          </Menu.Item>
        </>
      )}
    </Menu>
  );
};

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mobile-menu">
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={() => setIsOpen(true)}
      />
      <Modal open={isOpen} footer={null} onCancel={() => setIsOpen(false)}>
        <div style={{ marginTop: 20 }}>
          <MenuOptions theme="light" closeModal={() => setIsOpen(false)} />
        </div>
      </Modal>
    </div>
  );
};


const MyDrop = ({ user, logout }: any) => {
  const navigate = useNavigate()

  const fullLogout = () => {
    logout()
    localStorage.clear();
    navigate('/')
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a rel="noopener noreferrer" onClick={fullLogout}>
          Cerrar sesión
        </a>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <UserOutlined />
          {user.firstname + " " + user.lastname}
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  )
}




export const SideBar = ({ children }: any) => {
  const { Content, Footer, Sider } = Layout;
  const [collapsed, setCollapsedt] = useState(false);
  const onCollapse = (collapsed: boolean) => setCollapsedt(collapsed);

  const { user, logout }: any = useContext(AuthContext);

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          className="desktop-sidebar"
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="logo" />
          <MenuOptions />
        </Sider>

        <Layout className="custom-right"
          style={{ marginLeft: !collapsed ? 200 : 80 }}>
          <Layout.Header style={{ padding: 0, background: 'white', borderTopLeftRadius: 35 }}>
            <Row>
              <Col xxl={20} xl={20} lg={20} md={20} sm={14} xs={14} style={{ paddingLeft: 28, paddingTop: 4 }}>
                <img src="./logo.jpg" alt="" style={{ height: 60 }} />
              </Col>
              <Col xxl={4} xl={4} lg={4} md={4} sm={10} xs={10}>
                <span style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }} >
                  <NotificationList />
                  <MyDrop user={user} logout={logout} />
                </span>
              </Col>
            </Row>
          </Layout.Header>
          <Content style={{ background: 'white', borderBottomLeftRadius: 35 }}>
            <div style={{ padding: 24, minHeight: 360 }}>
              {children}
            </div>
            <MobileMenu />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
