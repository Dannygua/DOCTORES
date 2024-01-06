import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';

interface IProps {
    setFiles: any
    form: any
}


const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

function MultipleFileInput({ setFiles, form }: IProps) {

    const handleUpload = (files: any) => {
        // Aquí puedes realizar acciones con los archivos seleccionados, como enviarlos a un servidor.
        console.log(files);
        setFiles(files)
    };


    const dfl = form.getFieldValue("testResults") ?  form.getFieldValue("testResults").map((tr: any) => {
        return {
            uid: '1',
            name: tr.namePhoto,
            //status: 'uploading',
            url: tr.name,
            //percent: 33,
        }
    })
    :
    []

    const fileProps = {
        beforeUpload: () => false, // Desactiva la subida automática de los archivos
        onChange: (info: any) => {
            console.log('info', info)
            const { fileList } = info;
            if (fileList && fileList.length > 0) {
                handleUpload(fileList);
            }
        },
        defaultFileList: dfl
    };

    return (
        <Upload {...fileProps} multiple>
            <Button icon={<UploadOutlined />}>Seleccionar archivos</Button>
        </Upload>
    );
}


export default MultipleFileInput;