import { useNavigate } from "react-router-dom";
import { Row, Col, Button } from "antd";

const MainBanner = ({
  titleOne,
  titleTwo,
  titleThree,
  TextContent,
  buttonTitle,
  image,
}: any) => {
  const navigate = useNavigate();

  return (
    <Row className="banner-row">
      <Col
        xs={24}
        sm={24}
        md={12}
        lg={12}
        xl={12}
        xxl={12}
        className="banner-first-col"
      >
        <h1>{titleOne}</h1>
        <h1>
          {" "}
          <label style={{ color: "#007E85" }}>{titleTwo}</label> {titleThree}
        </h1>
        <label>{TextContent}</label>
        <Button type="primary" onClick={() => navigate("/login")}>
          {buttonTitle}
        </Button>
      </Col>
      <Col
        xs={24}
        sm={24}
        md={12}
        lg={12}
        xl={12}
        xxl={12}
        className="banner-second-col"
      >
        <div className="operacion">
          <img className="operacion" src={image} alt="" />
        </div>
      </Col>
    </Row>
  );
};

export default MainBanner;
