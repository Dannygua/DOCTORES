import { Alert, Button } from "antd"
import { useState } from "react"
import { message } from 'antd'
import { postData } from "../../services/common/postData"


const SendAlertButton = ({ email, imcValue }: any) => {

    const [sending, setSending] = useState(false)

    const sendEmail = async () => {
        setSending(true)
        const request = await postData('api/users/sendWarning', {
            email,
            code: process.env.REACT_APP_SG_API_KEY,
            sendToNutri: parseFloat(imcValue) >= 40
        })

        if (request.status) {
            message.success("Correo de advertencia enviado exitosamente!")
            setSending(false)
            return;
        }
        message.error("Algo salió mal")
        setSending(false)
    }
    return (
        <Button type="primary" onClick={sendEmail} loading={sending}>Enviar Correo de alerta</Button>
    )
}

export default SendAlertButton
