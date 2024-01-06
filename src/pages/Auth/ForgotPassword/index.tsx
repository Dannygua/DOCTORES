import { Button, Card, Form, Input, Row, message } from "antd";
import { postData } from "../../../services/common/postData";
import './styles.css';
import { isMobile } from "react-device-detect";
import { DefaultNav, MobileNav } from "../../AllUsers/InfoPage";

interface IFormData {
    email: string
};

const ForgotPassword = () => {  

    const handleFinish = async (data: IFormData) => {
        const request = await postData('api/users/forget-password', {...data, 
            code: process.env.REACT_APP_SG_API_KEY})
        console.log('request', request);
        if('msg' in request){
            message.success(request.msg)
        }
    }

    return (
        <>
        {isMobile ? <MobileNav /> : <DefaultNav /> }
        <Row justify="center" className="container">
            <Card title="Recuperación de contraseña">
                <Form onFinish={handleFinish} >
                    <Form.Item name="email" extra="Te enviaremos un correo con un enlace para regenerar tu contraseña">
                        <Input placeholder="Ingresa el correo electrónico asociado a tu cuenta de bypassgastrico" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Enviar Correo</Button>
                </Form>
            </Card>
        </Row>
        </>
    )
}

export default ForgotPassword;