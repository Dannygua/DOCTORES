/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import { Form, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { postData, postFormData } from '../../../services/common/postData';
import type { RcFile } from 'antd/es/upload/interface';



const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};


const UploadComponent = () => {
    const [form] = Form.useForm();

    const handleUpload = async (data: any) => {
        const imageForm = new FormData()    
        imageForm.append('image', data.image)
        const uploadImage = await postFormData('images', imageForm)

        let uploadedImageUrl;
    
        if (uploadImage.status) {
          uploadedImageUrl = uploadImage['url_images'][0]
        }

        console.log('url', uploadedImageUrl)
    
        if (!uploadImage.status) {
          alert('Hubo un problema al cargar la fotografía, por favor intenta de nuevo')
          return;
        }

    };

    const getFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            console.log('is arrayy!!')
            return e
        }
        return e && e.file.originFileObj;
    };

    return (
        <Form form={form} onFinish={handleUpload}>
            <Form.Item
                label="Foto"
                name='image'
                rules={[
                    { required: true, message: "Campo requerido!" },
                ]}
                getValueFromEvent={getFile}
            >
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    multiple={true}
                >


                    <div>
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>

                </Upload>
            </Form.Item>
            <Button type="primary" htmlType="submit">Enviar</Button>
        </Form>
    );
};

export default UploadComponent;
