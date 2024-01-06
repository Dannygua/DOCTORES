import { Button, Form, Input, Select, message } from "antd";
import { postData } from "../../services/common/postData";
import { putData } from "../../services/common/putData";

const TestForm = ({ selectedTest, setRefresh, handleCancel, form }: any) => {

    const handleCloseModal = () => {
        setRefresh((prevState: boolean) => !prevState)
        handleCancel()
    }

    const onFinish = async (values: any) => {

        try {
            if ('name' in selectedTest) {
                const request = await putData("api/tests/" + selectedTest._id, values);
                if (request.status) {
                    message.success("Exámen actualizado correctamente");
                    handleCloseModal();
                    return;
                }
                message.error("Ha existido un error!")
            } else {
                const request = await postData("api/tests", values);
                if (request.status) {
                    message.success("Exámen agregado correctamente");
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

    const {Option} = Select
    
    return (
        <Form
            onFinish={onFinish}
            form={form}
        >
            <Form.Item
                label="Nombre"
                name="name"
                rules={[{ required: true, message: "Campo requerido" }]}
            >
                <Input />
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

export default TestForm;