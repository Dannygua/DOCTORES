import { Button, Form, Input, Select, message } from "antd";
import { postData } from "../../services/common/postData";
import { putData } from "../../services/common/putData";

const PersonalForm = ({ selectedQuestion, setRefresh, handleCancel, form }: any) => {

    const handleCloseModal = () => {
        setRefresh((prevState: boolean) => !prevState)
        handleCancel()
    }

    const onFinish = async (values: any) => {

        try {
            if ('question' in selectedQuestion) {
                const request = await putData("api/frequentQuestions/" + selectedQuestion._id, values);
                if (request.status) {
                    message.success("Pregunta editada correctamente");
                    handleCloseModal();
                    return;
                }
                message.error("Ha existido un error!")
            } else {
                const request = await postData("api/frequentQuestions", values);
                if (request.status) {
                    message.success("Pregunta agregado correctamente");
                    handleCloseModal();
                    return;
                }
                message.error("Ha existido un error!")
            }
        } catch (error: any) {
            console.log(error.response);
            message.success(error.response.data.msg);
        }
    };


    const { Option } = Select;

    return (
        <Form
            onFinish={onFinish}
            form={form}
        >
            <Form.Item
                label="Pregunta"
                name="question"
                rules={[{ required: true, message: "Se requiere una pregunta" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Respuesta"
                name="answer"
                rules={[{ required: true, message: "Se requiere una respuesta" }]}
            >
                <Input.TextArea />
            </Form.Item>

            <Form.Item
                label="Estado"
                name="active"
                rules={[{ required: true, message: "Se requiere un estado" }]}
            >
                <Select placeholder="Seleccione un estado">
                    <Option value={true}>Activo</Option>
                    <Option value={false}>Inactivo</Option>
                </Select>
            </Form.Item>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "end",
                    
                }}
            >
                <Button type="primary" htmlType="submit">
                    Guardar
                </Button></div>
        </Form>
    );
};

export default PersonalForm;