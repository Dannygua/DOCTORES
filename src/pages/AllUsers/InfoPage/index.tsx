import { useNavigate } from "react-router-dom";
import { Layout, Menu, Row, Col, Button, Form, Input, message, Dropdown, MenuProps } from "antd";
import MainBanner from "../../../components/Home/MainBanner";
import "./styles.css";
import Card from "../../../components/Home/Card";
import {
  LinkedinOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  FacebookOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { postData } from "../../../services/common/postData";
import Chatbot from "../../../components/Chatbot";
import { isMobile } from "react-device-detect";

const { Header, Content, Footer } = Layout;

const MainBannerOne = () => {
  return (
    <MainBanner
      titleOne="Buena calidad de vida al tratar"
      titleTwo="eficazmente"
      titleThree="la obesidad."
      TextContent="El bypass gástrico puede tener beneficios significativos 
      para las personas con obesidad grave que han intentado otros métodos 
      de pérdida de peso sin éxito. Sin embargo, como cualquier cirugía, también 
      conlleva riesgos y complicaciones potenciales. Es importante que las personas 
      consideren cuidadosamente los riesgos y beneficios, y discutan con su médico 
      si el bypass gástrico es adecuado para ellas."
      buttonTitle="Reserva tu cita"
      image="./banner.png"
    />
  );
};

const MainBannerTwo = () => {
  return (
    <MainBanner
      titleTwo="Hay muchas razónes para preferirnos"
      TextContent="Pérdida de peso significativa, 
      Mejora de condiciones médicas relacionadas con la obesidad,
      Cambios en los hábitos alimentarios,
      Mejora de la calidad de vida,
      Enfoque multidisciplinario
      "
      buttonTitle="Inicia Sesion"
      image="./operacion.jpg"
    />
  );
};

const FormBanner = () => {
  const handleFinish = async (data: any) => {
    const request = await postData("api/users/info", {...data, 
      code: process.env.REACT_APP_SG_API_KEY});
    console.log("request", request);
    if ("msg" in request) {
      message.success(request.msg);
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row justify="center">
      <Col
        className="stat-col"
        xs={24}
        sm={24}
        md={24}
        lg={5}
        xl={5}
        xxl={5}
      ></Col>
      <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
        <Form
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          onFinish={handleFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Nombre"
            name="firstname"
            rules={[{ required: true, message: "Ingrese su Nombre" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Telefono"
            name="phone"
            rules={[{ required: true, message: "Ingrese su Telefono" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Ingrese su Email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 11, span: 13 }}>
            <Button type="primary" htmlType="submit">
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col
        className="stat-col"
        xs={24}
        sm={24}
        md={24}
        lg={5}
        xl={5}
        xxl={5}
      ></Col>
    </Row>
  );
};

const Stats = () => {
  return (
    <div>
      <Row className="stats-title-row" justify="center">
        Nuestros resultados en números
      </Row>
      <Row className="stats-row" justify="center">
        <Col className="stat-col" xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
          99%
          <span className="stat-name">Satisfacción del cliente</span>
        </Col>
        <Col className="stat-col" xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
          15k
          <span className="stat-name">Pacientes en línea</span>
        </Col>
        <Col
          className="stat-col bottom-stat"
          xs={12}
          sm={12}
          md={12}
          lg={6}
          xl={6}
          xxl={6}
        >
          12k
          <span className="stat-name">Pacientes atendidos</span>
        </Col>
        <Col
          className="stat-col bottom-stat"
          xs={12}
          sm={12}
          md={12}
          lg={6}
          xl={6}
          xxl={6}
        >
          240%
          <span className="stat-name">Crecimiento de compañía</span>
        </Col>
      </Row>
    </div>
  );
};

const FooterContent = () => {
  return (
    <div className="footer-Content">
      <Row>
        <Col
          style={{ textAlign: "left" }}
          xs={24}
          sm={24}
          md={8}
          lg={8}
          xl={8}
          xxl={8}
        >
          <span className="stat-footer">Bypass Gástrico</span>
          <span className="stat-footer">
            Copyright © 2023 | All Rights Reserved{" "}
          </span>
        </Col>

        <Col
          style={{ textAlign: "center" }}
          xs={24}
          sm={24}
          md={8}
          lg={8}
          xl={8}
          xxl={8}
        >
          <span style={{ fontWeight: "bolder" }} className="stat-footer">
            SERVICIOS{" "}
          </span>
          <span className="stat-footer">Nutrición</span>
          <span className="stat-footer">Psicología</span>
          <span className="stat-footer">Cirugías Bariátricas</span>
        </Col>
        <Col
          style={{ textAlign: "center" }}
          xs={24}
          sm={24}
          md={8}
          lg={8}
          xl={8}
          xxl={8}
        >
          <span style={{ fontWeight: "bolder" }} className="stat-footer">
            SIGUENOS{" "}
          </span>
          <span>
            <Button type="text" href="https://www.facebook.com/">
              <FacebookOutlined />
            </Button>
          </span>
          <span>
            <Button type="text" href="https://twitter.com/">
              <TwitterOutlined />
            </Button>
          </span>
          <span>
            <Button type="text" href="https://www.instagram.com/">
              <InstagramOutlined />
            </Button>
          </span>
          <span>
            <Button type="text" href="https://www.linkedin.com/">
              <LinkedinOutlined />
            </Button>
          </span>
          <span>
            <Button type="text" href="https://www.youtube.com/">
              <YoutubeOutlined />
            </Button>
          </span>
        </Col>
      </Row>
    </div>
  );
};



export const MobileNav = () => {
  const navigate = useNavigate();

  return (
    <Row style={{ background: '#007e85', color: 'white', fontWeight: 'bolder' }} >
      <Col span={24} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <img src="./logo.jpg" style={{ width: '90%', height: 80 }} />
      </Col>
      <Col
        onClick={() => navigate("/login")}
        span={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <span style={{ fontSize: 20 }} >Iniciar sesión</span>
      </Col>

      <Col
        onClick={() => navigate("/register")}
        span={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <span style={{ fontSize: 20 }}>Registrarse</span>
      </Col>
    </Row>
  )
}


export const DefaultNav = () => {
  const navigate = useNavigate();

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        color: "white",
        marginTop: 0,
        backgroundColor: "#007E85",
      }}
    >
      <div
        style={{
          float: "left",
          width: 120,
          height: 31,
        }}
      >
        <img src="./logo.jpg" style={{ width: 200, height: 'auto' }} />
      </div>
      <Menu
        className="info-navbar-menu"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          background: "transparent",
          color: "white",
        }}
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={[
          /*
          {
            key: "home",
            label: "Inicio",
          },
          {
            key: "services",
            label: "Servicios",
          },
          {
            key: "contact",
            label: "Contáctanos",
          },
          */
          {
            key: "signin",
            label: "Iniciar Sesión",
            onClick: () => navigate("/login"),
            style: {
              fontWeight: "bolder",
              color: "white",
            },
          },
          {
            key: "signup",
            label: "Registrarse",
            onClick: () => navigate("/register"),
            style: {
              fontWeight: "bolder",
              color: "white",
            },
          },
        ]}
      />
    </Header>
  )
}





const InfoPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {isMobile && <MobileNav />}
      {!isMobile && <DefaultNav />}
      <Content className="site-layout" style={{ overflow: 'hidden' }} >
        <div style={{ minHeight: 380 }}>
          <div className="Banners">
            <MainBannerOne />
            <Stats />
            <MainBannerTwo />
          </div>

          <Row className="banner-row">
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              xxl={24}
              className="Main-title"
            >
              <h1 style={{ color: "#007E85" }}>Servicios que proveemos</h1>
            </Col>
          </Row>
          <div className="banner-cards-One">
            <Card
              heightCard="first"
              image="./Nutriologo.jpg"
              title="Nutrición"
              content="asesoramiento y orientación dietética a las personas para mejorar su salud, 
              prevenir enfermedades y tratar condiciones relacionadas con la alimentación."
            />
            <Card
              heightCard="first"
              image="./Gastrico.jpg"
              title="Cirugias bariátricas"
              content=" implican modificaciones en el sistema digestivo para limitar la cantidad de alimentos
               que se pueden consumir o la cantidad de nutrientes que se absorben"
            />
            <Card
              heightCard="first"
              image="./psicologos.jpg"
              title="Psicología"
              content="aplican los principios y teorías de la psicología para ayudar a las personas a 
              comprenderse a sí mismas, resolver problemas emocionales o conductuales y 
              mejorar su bienestar mental y emocional"
            />
          </div>
          <Row className="banner-row">
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              xxl={24}
              className="Main-title"
            >
              <h1 style={{ color: "#007E85" }}>Conoce a nuestro equipo</h1>
            </Col>
          </Row>
          <div className="banner-cards-One">
            <Card
              heightCard="second"
              image="./cara1.png"
              title="Dr. Pedro Gamboa Setien"
              subtitle="Alergólogo en Bilbao"
              content="Referente en la especialidad de Alergología. 
              Cuenta con más de 35 años de experiencia en su especialidad y formación. 
              En este sentido, se ha licenciado en Medicina por la Universidad del País 
              Vasco, es Doctor en Medicina por la Universidad de Navarra y es especialista 
              universitario en Angioedema Hereditario"
              Icons={true}
              Linkedin="https://www.linkedin.com/"
              Twitter="https://twitter.com/"
              Instagram="https://www.instagram.com/"
            />
            <Card
              heightCard="second"
              image="./cara2.png"
              title="Dr. Alejandro Rodríguez Morata"
              subtitle="Cirujano vascular en Málaga"
              content="Reputado angiólogo y cirujano vascularen Málaga. 
              Cuenta con más de 15 años de experiencia médica en la profesión 
              y tiene una extensa formación en distintos campos de la especialidad.
               En concreto, es experto en varices, insuficiencia venosa pélvica, 
               trombosis venosa profunda,malformaciones vasculares"
              Icons={true}
            />
            <Card
              heightCard="second"
              image="./cara3.png"
              title="Dr. Julio Ducóns García"
              subtitle="Aparato digestivo en Zaragoza"
              content="especialista en Aparato digestivo en Zaragoza. Cuenta con más 
              de 30 años de experiencia en su especialidad y formación. En este sentido, 
              se licenció en Medicina y Cirugía y es Doctor en Medicina y Cirugía por la 
              Universidad de Zaragoza. Además, se ha especializado en Aparato Digestivo 
              tras completar la formación como médico interno residente"
              Icons={true}
            />
            <Card
              heightCard="second"
              image="./carafinal.png"
              title="Dra. Sandra Villagrá Albert"
              subtitle="Pediatra experto en Cardiología Infantil en Madrid"
              content="reconocida experta en Cardiología Infantil.Cuenta con más de 17 
              años de experiencia en su especialidad y formación.
              y es Doctora por la Universidad Autónoma de Madrid, con calificación de 
              Sobresaliente Cum Laude. En concreto, ha centrado su interés en la Cardiopatías 
              Congénitas del feto, recién nacido, niño, adolescente y adulto"
              Icons={true}
            />
          </div>
          <Row className="banner-row">
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              xxl={24}
              className="Main-title"
            >
              <h1 style={{ color: "#007E85" }}>Testimonios</h1>
            </Col>
          </Row>
          <div className="banner-cards-One">
            <Card
              heightCard="third"
              image="./cara4.jpg"
              title="Muy feliz con su servicio"
              contentTwo="sus representantes siempre han sido muy amables, 
              serviciales y profesionales. Agradezco sus recordatorios por correo 
              electrónico. Muy feliz con sus suministros y servicio"
              content="John Carter"
            />
            <Card
              heightCard="third"
              image="./cara5.jpg"
              title="Excelente servicio al cliente"
              contentTwo="Muchas gracias por ayudar a sus clientes, son los mejores. Gracias 
              por siempre tratar de encontrar una solución para ayudarme."
              content="Sophie Moore"
            />
            <Card
              heightCard="third"
              image="./cara6.jpg"
              title="Excelente servicio"
              contentTwo="Estoy muy satisfecho con el excelente servicio, 
              la buena calidad del producto y la rapidez de la entrega. Gracias!"
              content="Andy Smith"
            />
            <Card
              heightCard="third"
              image="./cara7.jpg"
              title="Buena atencion"
              contentTwo="Tuve una excelente experiencia con Sandra! Fue muy servicial y
               simpática cuando pedí por primera vez insumos para ostomía. ¡Recomendaría a Sandra!"
              content="Donal Matt"
            />
          </div>
          <Row className="banner-row">
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              xxl={24}
              className="Main-title"
            >
              <h1>Contáctanos</h1>
            </Col>
          </Row>
          <FormBanner />
        </div>
      </Content>
      <Footer className="footer-Content">
        <FooterContent />
      </Footer>
    </Layout>
  );
};

export default InfoPage;
