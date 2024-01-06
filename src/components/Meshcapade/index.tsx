import { Button, Card, Col, Form, Row, Select, Spin, Typography, Upload, message } from "antd";
import { useContext, useEffect, useState } from "react";
import { getData } from "../../services/common/getData";
import { createAvatar, createImage, fitAvatar, getAvatar, uploadImage } from "../../services/meshcapade";
import type { RcFile } from 'antd/es/upload/interface';
import { PlusOutlined } from "@ant-design/icons";
import { uploadImageToCloudinary } from "../../utils/uploader";
import { postData } from "../../services/common/postData";
import Mymesh from "./Mymesh";
import { AuthContext } from "../../context/AuthContext";


const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};





const { Option } = Select

function Meshcapade() {

    const [processing, setProcessing] = useState(false)
    const [resultUrl, setResultUrl] = useState('')

    const [selectedImageUrl, setSelectedImageUrl] = useState('')

    const [loadingPatients, setLoadingPatients] = useState(false)
    const [patients, setPatients] = useState([])

    const [simulationUrl, setSimulationUrl] = useState('')


    const [form] = Form.useForm()


    const getPatients = async () => {
        setLoadingPatients(true);
        const request = await getData('api/users/patients')
        console.log('r', request)
        if (request.status) {
            setPatients(request.data)
            setLoadingPatients(false)
        }

    }

    useEffect(() => {
        getPatients()
    }, [])




    const handleFinish = async (values: any) => {
        console.log('values', values)
        setProcessing(true);
        if (values.imagen) {
            const uploadPreset = "imagePreset";
            const imageForm = new FormData()
            imageForm.append('file', values.imagen)
            imageForm.append("upload_preset", uploadPreset);

            const uploadedImage = await uploadImageToCloudinary(imageForm)
            console.log('ui', uploadedImage)

            if (!uploadedImage) {
                message.error("Algo ha salido mal procesando la imagen :( , por favor intenta de nuevo")
                setProcessing(false)
                return
            }

            const url = "https://api.meshcapade.com/api/v1/avatars/create/from-images"


            const createAvatarR = await postData('api/mesh/createAvatar', { url })
            console.log('createAvatar', createAvatarR)

            if ('data' in createAvatarR) {
                const imageUrl = createAvatarR['data']['links']['image_upload']
                const avatarUrl = createAvatarR['data']['links']['self']
                const createImageR = await postData('api/mesh/createImage', { url: imageUrl })
                console.log('createImage', createImageR)
                if ('data' in createImageR) {
                    const uploadUrl = createImageR['data']['links']['upload']
                    const uploadImageR = await uploadImage(uploadUrl, uploadedImage)
                    console.log('uir', uploadImageR)

                    const fitUrl = avatarUrl + "/fit-to-images"

                    let patientHeight = 170
                    let patientWeight = 90

                    const selectedPatient: any = patients.filter((p: any) => p._id === values.patientId)

                    const datesWithRecords = selectedPatient[0].dates.filter((date: any) => "record" in date);


                    if (datesWithRecords.length > 0) {
                        const datesWithMedicalInfo = datesWithRecords.filter((date: any) => 'medicalInfo' in date.record)
                        patientHeight = Math.round(datesWithMedicalInfo[0].record.medicalInfo.height * 100)
                        patientWeight = datesWithMedicalInfo[0].record.medicalInfo.weight
                    }

                    const avatarData = {
                        avatarname: selectedPatient[0].email,
                        /*height: patientHeight,
                        weight: patientWeight,
                        */
                        gender: "male"
                    }

                    const fitR = await postData('api/mesh/fitAvatar', { url: fitUrl, data: avatarData })
                    console.log('fitR', fitR)
                    if ('data' in fitR) {
                        console.log('DATA IN FITR')
                        async function fetchAndLogAvatar() {
                            console.log('resultUrl', resultUrl)
                            if (resultUrl === "") {
                                setProcessing(true)
                                const getAvatarR = await postData('api/mesh/getAvatar', { url: avatarUrl })
                                console.log('getAvatarR', getAvatarR);
                                if (getAvatarR && getAvatarR.data && getAvatarR.data.attributes &&
                                    getAvatarR.data.attributes.metadata && getAvatarR.data.attributes.metadata.bodyShape &&
                                    getAvatarR.data.attributes.metadata.bodyShape.mesh_measurements) {

                                    const height = getAvatarR.data.attributes.metadata.bodyShape.mesh_measurements.Height;
                                    const parsedHeight = parseFloat(height.toFixed(1))

                                    const weight = getAvatarR.data.attributes.metadata.bodyShape.mesh_measurements.Weight;
                                    const parsedWeight = parseFloat(weight.toFixed(1))


                                    const ccm = getAvatarR.data.attributes.metadata.bodyShape.mesh_measurements['Bust_girth'];
                                    const parsedCcm = parseFloat(ccm.toFixed(1))


                                    const wc = getAvatarR.data.attributes.metadata.bodyShape.mesh_measurements['Waist_girth'];
                                    const parsedWc = parseFloat(wc.toFixed(1))


                                    const hc = getAvatarR.data.attributes.metadata.bodyShape.mesh_measurements['Top_hip_girth'];
                                    const parsedHc = parseFloat(hc.toFixed(1))



                                    const i = getAvatarR.data.attributes.metadata.bodyShape.mesh_measurements['Inside_leg_height'];
                                    const parsedI = parseFloat(i.toFixed(1))


                                    const meshUrl = `https://me.meshcapade.com/from-measurements?n=${avatarData.avatarname}&g=m&m=x&h=${parsedHeight}&w=${parsedWeight}&ccm=${parsedCcm}&wc=${parsedWc}&hc=${parsedHc}&i=${parsedI}`


                                    const simulationData: any = {
                                        idpatient: values.patientId,
                                        currentPhoto: uploadedImage,
                                        currentMeasures: {
                                            chest: 80,
                                            hip: 80,
                                            waist: 80,
                                            legs: 80,
                                            arms: 80
                                        },
                                        simlationPhoto: meshUrl,
                                        simulationMeasures: {
                                            chest: 80,
                                            hip: 80,
                                            waist: 80,
                                            legs: 80,
                                            arms: 80
                                        }
                                    }

                                    const saveSimulation = await postData('api/simulations', simulationData)

                                    if (saveSimulation.status) {
                                        setResultUrl(meshUrl)
                                        setProcessing(false)
                                    }

                                    // Ahora puedes usar 'height' de manera segura
                                    console.log('Altura:', height);
                                } else {
                                    // Algunas propiedades no están definidas, manejar el caso en consecuencia
                                    console.error('No se puede acceder a la propiedad "height" debido a propiedades no definidas.');
                                }
                            }
                        }

                        // Iniciar el intervalo y ejecutar fetchAndLogAvatar cada 30 segundos
                        const intervalId = setInterval(fetchAndLogAvatar, 30000);

                        // Detener el intervalo después de 5 minutos (300,000 milisegundos)
                        setTimeout(() => {
                            clearInterval(intervalId);
                            console.log('Operación detenida después de 5 minutos');
                        }, 240000);

                        /*
                        // Programar el segundo fetch después de un minuto (60000 milisegundos)
                        setTimeout(fetchAndLogAvatar, 180000);
                        */
                    }

                }
            }
            //setProcessing(false)
            return;
        }


        alert('Hubo un problema al cargar los archivos, por favor intenta de nuevo')
        setProcessing(false);
        return;
    }




    const getFile = (e: any) => {

        getBase64(e.file.originFileObj as RcFile, (url) => {
            setSelectedImageUrl(url);
        });

        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            console.log('is arrayy!!')
            return e
        }
        return e && e.file.originFileObj;
    };

    const [disabledOriginals, setDisabledOriginals] = useState(false)

    const handleSelectPatient = (patientId: any) => {
        console.log('patient id', patientId)
        getLastSimulation(patientId)
    }

    const [loadingLastSim, setLoadingLastSim] = useState(false)

    const [lastSimulation, setLastSimulation] = useState<undefined | any>()

    const getLastSimulation = async (patientId: any) => {
        setLoadingLastSim(true)
        const request = await getData('api/simulations/byPatient/' + patientId)
        if (request.status) {
            setLastSimulation(request.data[0])
            setLoadingLastSim(false)
        }
    }


    const { user }: any = useContext(AuthContext)


    return (
        <Card>
            {user.isDoctor ? (
                <div>
                    <Form onFinish={handleFinish} form={form}>
                        <Row>
                            {loadingPatients && <Spin />}
                            {!loadingPatients && patients && patients.length > 0 && (
                                <Col span={24}>
                                    <Form.Item
                                        label="Paciente"
                                        name="patientId"
                                    >
                                        <Select placeholder="Seleccionar paciente" onChange={handleSelectPatient}>
                                            {patients.map((patient: any) =>
                                                <Option value={patient._id}>{patient.firstname} {patient.lastname}</Option>
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            )}
                            <Col span={24}>
                                <Form.Item
                                    label="Fotografía"
                                    name='imagen'
                                    getValueFromEvent={getFile}
                                    style={{ marginTop: 40 }}
                                >

                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                    >
                                        {selectedImageUrl !== "" ? <img src={selectedImageUrl} alt="avatar" style={{ width: '100%' }} /> : (
                                            <div>
                                                {!processing && <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        )}
                                    </Upload>

                                </Form.Item>
                            </Col>


                        </Row>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <Button htmlType="submit" type="primary" loading={processing}>Simular</Button>
                        </div>
                    </Form>

                    {processing && <Typography.Title>Tu simulación estará lista en pocos minutos, por favor espera...</Typography.Title>}

                    {resultUrl !== "" && (
                        <embed src={resultUrl} style={{ width: '100%', height: 900, marginTop: 20 }} />
                    )}

                    {loadingLastSim && <Spin />}

                    {typeof (lastSimulation) !== "undefined" && (
                        lastSimulation.simlationPhoto.includes("meshcapade") ?
                            <embed src={lastSimulation && lastSimulation.simlationPhoto} style={{ width: '100%', height: 900, marginTop: 20 }} />
                            :
                            <img src={lastSimulation && lastSimulation.simlationPhoto} alt="Bad URI" height={800}
                                style={{ width: '100%' }} />
                    )}

                </div>
            ) : (
                <Mymesh />
            )}


        </Card>
    )
}

export default Meshcapade;