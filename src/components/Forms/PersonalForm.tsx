import { Button, Checkbox, Col, Form, Input, Row, Select, message } from "antd";
import { postData } from "../../services/common/postData";
import { emailRgx, onlyChars } from "../../utils/exp";

const PersonalForm = ({ handleCancel, setSpecialists, specialists }: any) => {
  const onFinish = async (values: any) => {
    console.log("values:", values);

    try {
      if (values.rol === "Nutriologo") {
        const specialist = {
          ...values,
          isNutri: true,
          code: process.env.REACT_APP_SG_API_KEY
        };
        const request = await postData("api/users/nutri", specialist);

        setSpecialists([...specialists, request.msg]);

        if (request.status) {
          handleCancel();
          message.success("Especialista agregado correctamente");
        } else {
          message.error("Algo salió mal, es posible que ya exista un usuario con el correo especificado")
        }
      } else {
        const specialist = {
          ...values,
          isPychologist: true,
          code: process.env.REACT_APP_SG_API_KEY
        };
        const request = await postData("api/users/psicologist", specialist);
        setSpecialists([...specialists, request.msg]);

        if (request.status) {
          handleCancel();
          message.success("Especialista agregado correctamente");
        } else {
          message.error("Algo salió mal, es posible que ya exista un usuario con el correo especificado")
        }
      }
    } catch (error: any) {
      console.log(error.response);
      message.success(error.response.data.msg);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const { Option } = Select;

  return (
    <Form
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Row>
        <Col xl={{ span: 11 }} xxl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 24}} sm={{ span: 24}} xs={{ span: 24 }}>
          <Form.Item
            label="Nombre"
            name="firstname"
            rules={[
              { required: true, message: "Se requiere un Nombre" },
              { pattern: onlyChars, message: "Sólo debe contener letras"  }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11, offset:1 }} xxl={{ span: 11, offset:1 }} lg={{ span: 11, offset:1 }} md={{ span: 24}} sm={{ span: 24}} xs={{ span: 24 }} >
          <Form.Item
            label="Apellido"
            name="lastname"
            rules={[
              { required: true, message: "Se requiere un Apellido" },
              { pattern: onlyChars, message: "Sólo debe contener letras" }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11 }} xxl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 24}} sm={{ span: 24}} xs={{ span: 24 }}>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Se requiere un Email" },
              { type: "email", message: "El texto introducido no es un email" },
              { pattern: emailRgx, message: "El email es incorrecto"  }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xl={{ span: 11, offset:1 }} xxl={{ span: 11, offset:1 }} lg={{ span: 11, offset:1 }} md={{ span: 24}} sm={{ span: 24}} xs={{ span: 24 }}>

          <Form.Item
            label="Especialidad"
            name="rol"
            rules={[{ required: true, message: "Se requiere una Especialidad" }]}
          >
            <Select placeholder="Seleccione una Especialidad">
              <Option value="Nutriologo">Nutriologo</Option>
              <Option value="Psicologo">Psicologo</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          marginRight: 36,
        }}
      >
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </div>
    </Form>
  );
};

export default PersonalForm;
