import { Button, Card, Form, Input, Row, message } from "antd";
import { postData } from "../../../services/common/postData";
import '../ForgotPassword/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { isMobile } from "react-device-detect";
import { DefaultNav, MobileNav } from "../../AllUsers/InfoPage";


interface IFormData {
    password: string
};

const NewPassword = () => {

    const navigate = useNavigate()

    let { token } = useParams();

    const handleFinish = async (data: IFormData) => {
        const request = await postData('api/users/forget-password/' + token, data)
        console.log('request', request);

        if(!request.status) {
            message.error("Token no válido")
            return; 
        }


        if ('msg' in request && request.status) {
            message.success(request.msg)
            navigate("/login")
        }
    }

    return (
        <>
        {isMobile ? <MobileNav /> : <DefaultNav /> }
        <Row justify="center" className="container">
            <Card title="Nueva contraseña">
                <Form onFinish={handleFinish} >
                    <Form.Item name="password">
                        <Input placeholder="Ingresa la nueva contraseña" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Guardar nueva contraseña</Button>
                </Form>
            </Card>
        </Row>
        </>
    )
}

export default NewPassword;