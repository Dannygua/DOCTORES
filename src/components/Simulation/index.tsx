/* eslint-disable array-callback-return */
import { Button, Col, Form, Row, Select, Slider, Spin, Typography, Upload, message, Card } from 'antd'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { ITransformProp, postData, postImageData, transform } from '../../services/common/postData'
import { PlusOutlined } from '@ant-design/icons'
import type { RcFile } from 'antd/es/upload/interface';
import { getData } from '../../services/common/getData';
import { AuthContext } from '../../context/AuthContext';
import { uploadImageToCloudinary } from '../../utils/uploader';


const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};


const { Option } = Select


interface ISimulation {
    idpatient: string
    currentPhoto: string,
    currentMeasures: {
        chest: Number
        hip: Number
        waist: Number
        legs: Number
        arms: Number
    },
    simlationPhoto: string
    simulationMeasures: {
        chest?: Number
        hip?: Number
        waist?: Number
        legs?: Number
        arms?: Number
    },
}


const MySimulation = () => {
    const [lastSimulation, setLastSimulation] = useState<undefined | ISimulation>()
    const [loading, setLoading] = useState(false)
    const { user }: any = useContext(AuthContext)

    const getLastSimulation = async () => {
        setLoading(true)
        const request = await getData('api/simulations/byPatient/' + user._id)
        if (request.status) {
            setLastSimulation(request.data[0])
            setLoading(false)
        }
    }

    useEffect(() => {
        getLastSimulation()
    }, [])

    return (
        <div>
            {loading ? <Spin /> : (
                <div>
                    {typeof (lastSimulation) !== "undefined" ? (
                        <Row>
                            <Col span={12}>
                                <Typography.Title style={{ display: 'block' }}>Medidas actuales</Typography.Title>
                                <Typography.Text style={{ display: 'block' }} strong>Pecho: {lastSimulation?.currentMeasures.chest.toString()} cm</Typography.Text>
                                <Typography.Text style={{ display: 'block' }} strong>Cadera: {lastSimulation?.currentMeasures.hip.toString()} cm</Typography.Text>
                                <Typography.Text style={{ display: 'block' }} strong>Cintura: {lastSimulation?.currentMeasures.waist.toString()} cm</Typography.Text>
                                <Typography.Text style={{ display: 'block' }} strong>Piernas: {lastSimulation?.currentMeasures.legs.toString()} cm</Typography.Text>
                                <Typography.Text style={{ display: 'block' }} strong>Brazos: {lastSimulation?.currentMeasures.arms.toString()} cm</Typography.Text>
                                <img src={lastSimulation && lastSimulation.currentPhoto} alt="Bad URI" height={800}
                                    style={{ width: '100%' }} />
                            </Col>
                            <Col span={12}>
                                <Typography.Title>Medidas simuladas</Typography.Title>

                                <Typography.Text style={{ display: 'block' }} strong>Pecho: {lastSimulation?.simulationMeasures.chest?.toString()} cm</Typography.Text>
                                <Typography.Text style={{ display: 'block' }} strong>Cadera: {lastSimulation?.simulationMeasures.hip?.toString()} cm</Typography.Text>
                                <Typography.Text style={{ display: 'block' }} strong>Cintura: {lastSimulation?.simulationMeasures.waist?.toString()} cm</Typography.Text>
                                <Typography.Text style={{ display: 'block' }} strong>Piernas: {lastSimulation?.simulationMeasures.legs?.toString()} cm</Typography.Text>
                                <Typography.Text style={{ display: 'block' }} strong>Brazos: {lastSimulation?.simulationMeasures.arms?.toString()} cm</Typography.Text>
                                {typeof (lastSimulation) !== "undefined" && (
                                    lastSimulation.simlationPhoto.includes("meshcapade") ?
                                        <embed src={lastSimulation && lastSimulation.simlationPhoto} style={{ width: '100%', height: 900, marginTop: 20 }} />
                                        :
                                        <img src={lastSimulation && lastSimulation.simlationPhoto} alt="Bad URI" height={800}
                                            style={{ width: '100%' }} />
                                )}
                            </Col>
                        </Row>
                    ) : (
                        <Typography.Title>No existen simulaciones a su nombre</Typography.Title>
                    )}

                </div>
            )}
        </div>
    )
}

const Simulation = ({showTooltips}:any) => {

   
    //esto es para que el slider se muestre los numeros a partir del 1
    const [tooltipOpenPecho, setTooltipOpenPecho] = useState(false);
    const [tooltipOpenCadera, setTooltipOpenCadera] = useState(false);
    const [tooltipOpenCintura, setTooltipOpenCintura] = useState(false);
    const [tooltipOpenPiernas, setTooltipOpenPiernas] = useState(false);
    const [tooltipOpenBrazos, setTooltipOpenBrazos] = useState(false);

    const [tooltipOpenAct, setTooltipOpenAct] = useState(false);


    const handleSliderChange = (sliderName: any, value: any) => {
        // Actualiza el estado para abrir o cerrar el tooltip según el valor del Slider
        switch (sliderName) {
            case 'pecho':
                setTooltipOpenPecho(true);
                break;
            case 'cadera':
                setTooltipOpenCadera(value >= 1);
                break;
            case 'cintura':
                setTooltipOpenCintura(value >= 1);
                break;
            case 'piernas':
                setTooltipOpenPiernas(value >= 1);
                break;
            case 'brazos':
                setTooltipOpenBrazos(value >= 1);
                break;
            default:
                break;
        }
    };

    const [processing, setProcessing] = useState(false)
    const [resultUrl, setResultUrl] = useState('')
    const [selectedImageUrl, setSelectedImageUrl] = useState('')


    const [loadingPatients, setLoadingPatients] = useState(false)
    const [patients, setPatients] = useState([])

    const [simulationUrl, setSimulationUrl] = useState('')

    const { user }: any = useContext(AuthContext)

    const [form] = Form.useForm()

    

    const getPatients = async () => {
        setLoadingPatients(true);
        const request = await getData('api/users/patients')
        console.log('r', request)
        if (request.status) {
            setPatients(request.data)
            setLoadingPatients(false)
        }
        const sRequest = await getData('api/envs')
        console.log('sr', sRequest)
        if ('simulationApiUrl' in sRequest) {
            setSimulationUrl(sRequest.simulationApiUrl)
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
            //const uploadImage = await postImageData('images/shape', imageForm)

            const uploadImage = await uploadImageToCloudinary(imageForm, true)
            console.log('ui', uploadImage)

            if (!uploadImage) {
                message.error("Algo ha salido mal procesando la imagen :( , por favor intenta de nuevo")
                setProcessing(false)
                return
            }

            if (uploadImage) {
                const tData: ITransformProp = {
                    "medidas_original": {
                        pecho: values['pecho_original'],
                        cadera: values['cadera_original'],
                        cintura: values['cintura_original'],
                        piernas: values['piernas_original'],
                        brazos: values['brazos_original']
                    },
                    "medidas": {
                        pecho: values.pecho || 80,
                        cadera: values.cadera || 80,
                        cintura: values.cintura || 80,
                        piernas: values.piernas || 80,
                        brazos: values.brazos || 80
                    },
                    "image_url": uploadImage
                }

                const tRequest = await transform(`${simulationUrl}/execute_bash`, tData)
                console.log('---REQUEST---', tRequest)
                if ('url' in tRequest) {

                    const simulationData: ISimulation = {
                        idpatient: values.patientId,
                        currentPhoto: uploadImage,
                        currentMeasures: {
                            chest: values['pecho_original'],
                            hip: values['cadera_original'],
                            waist: values['cintura_original'],
                            legs: values['piernas_original'],
                            arms: values['brazos_original']
                        },
                        simlationPhoto: tRequest.url,
                        simulationMeasures: {
                            chest: values.pecho || 80,
                            hip: values.cadera || 80,
                            waist: values.cintura || 80,
                            legs: values.piernas || 80,
                            arms: values.brazos || 80
                        }
                    }

                    console.log('simdata', simulationData)

                    const saveSimulation = await postData('api/simulations', simulationData)

                    console.log('save simulation')
                    if (saveSimulation.status) {
                        setResultUrl(tRequest.url)
                        setProcessing(false)
                    }
                    return
                }
            }

            /*if (uploadImage.status) {
                if(uploadImage['url_images'][0].url===false){
                    message.error("Algo ha salido mal procesando la imagen :( , por favor intenta de nuevo")
                    setProcessing(false)
                    return
                }

                message.success("Imagen procesada exitosamente!")

                const tData: ITransformProp = {
                    "medidas_original": {
                        pecho: values['pecho_original'],
                        cadera: values['cadera_original'],
                        cintura: values['cintura_original'],
                        piernas: values['piernas_original'],
                        brazos: values['brazos_original']
                    },
                    "medidas": {
                        pecho: values.pecho || 80,
                        cadera: values.cadera || 80,
                        cintura: values.cintura || 80,
                        piernas: values.piernas || 80,
                        brazos: values.brazos || 80
                    },
                    "image_url": uploadImage['url_images'][0].url
                }

                const tRequest = await transform('execute_bash', tData)
                console.log('---REQUEST---', tRequest)
                if ('url' in tRequest) {

                    const simulationData: ISimulation = {
                        idpatient: values.patientId,
                        currentPhoto: uploadImage['url_images'][0].url,
                        currentMeasures: {
                            chest: values['pecho_original'],
                            hip: values['cadera_original'],
                            waist: values['cintura_original'],
                            legs: values['piernas_original'],
                            arms: values['brazos_original']
                        },
                        simlationPhoto: tRequest.url,
                        simulationMeasures: {
                            chest: values.pecho || 80,
                            hip: values.cadera || 80,
                            waist: values.cintura || 80,
                            legs: values.piernas || 80,
                            arms: values.brazos || 80
                        }
                    }
                    const saveSimulation = await postData('api/simulations', simulationData)
                    if (saveSimulation.status) {
                        setResultUrl(tRequest.url)
                        setProcessing(false)
                    }
                    return
                }
            }*/
            alert('Hubo un problema al cargar los archivos, por favor intenta de nuevo')
            setProcessing(false);
            return;
        }
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
        setDisabledOriginals(false)
        form.setFieldValue("pecho_original", undefined)
        form.setFieldValue("cadera_original", undefined)
        form.setFieldValue("cintura_original", undefined)
        form.setFieldValue("piernas_original", undefined)
        form.setFieldValue("brazos_original", undefined)


        const selectedPatient: any = patients.find((patient: any) => patient._id === patientId)
        if (selectedPatient) {
            const hasDates = 'dates' in selectedPatient
            if (hasDates) {
                if (selectedPatient.dates.length > 0) {
                    const datesWithRecord = selectedPatient.dates.filter((date: any) => 'record' in date)
                    console.log('d', datesWithRecord)

                    const datesWithNutri = datesWithRecord.map((date: any) => {
                        console.log('date', date)
                        if ('nutriInfo' in date.record) {
                            console.log('voy b')
                            return date
                        } else {
                            console.log('estoy aca')
                        }
                    })

                    console.log('dwn', datesWithNutri)
                    if (datesWithNutri.length > 0) {
                        const lastDateWithNutri = datesWithNutri[datesWithNutri.length - 1]
                        console.log('ldw', lastDateWithNutri)
                        setDisabledOriginals(true)
                        form.setFieldValue("pecho_original", lastDateWithNutri.record.nutriInfo.backMeasurement)
                        form.setFieldValue("cadera_original", lastDateWithNutri.record.nutriInfo.hipMeasurement)
                        form.setFieldValue("cintura_original", lastDateWithNutri.record.nutriInfo.waistMeasurement)
                        form.setFieldValue("piernas_original", lastDateWithNutri.record.nutriInfo.legsMeasurement)
                        form.setFieldValue("brazos_original", lastDateWithNutri.record.nutriInfo.armsMeasurement)
                        setTooltipOpenAct(true);

                    }
                }
            }
        }
    }



    return (
        <div>
            <Card>

            {!user.isPatient ?
                <>
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
                            <Col span={11}>


                                <Typography.Title>Medidas Actuales</Typography.Title>
                                <Form.Item label="Pecho" name="pecho_original" rules={[{ required: true, message: "Medida Requerida" }]}>
                                    <Slider disabled={disabledOriginals} max={180} tooltip={{ open: tooltipOpenAct }} />
                                </Form.Item>
                                <Form.Item label="Cadera" name="cadera_original" rules={[{ required: true, message: "Medida Requerida" }]}>
                                    <Slider disabled={disabledOriginals} max={180} tooltip={{ open: tooltipOpenAct }} />

                                </Form.Item>
                                <Form.Item label="Cintura" name="cintura_original" rules={[{ required: true, message: "Medida Requerida" }]}>
                                    <Slider disabled={disabledOriginals} max={180} tooltip={{ open: tooltipOpenAct }} />

                                </Form.Item>
                                <Form.Item label="Piernas" name="piernas_original" rules={[{ required: true, message: "Medida Requerida" }]}>
                                    <Slider disabled={disabledOriginals} max={180} tooltip={{ open: tooltipOpenAct }} />

                                </Form.Item>
                                <Form.Item label="Brazos" name="brazos_original" rules={[{ required: true, message: "Medida Requerida" }]}>
                                    <Slider disabled={disabledOriginals} max={180} tooltip={{ open: tooltipOpenAct }} />
                                </Form.Item>

                            </Col>


                            <Col span={11}>
                                <Typography.Title>Medidas A Simular</Typography.Title>

                                <Form.Item label="Pecho" name="pecho">
                                    <Slider max={180} tooltip={{ open: showTooltips && tooltipOpenPecho  }} onChange={(value) => handleSliderChange('pecho', value)} />
                                </Form.Item>
                                <Form.Item label="Cadera" name="cadera">
                                    <Slider max={180} tooltip={{ open: showTooltips && tooltipOpenCadera }} onChange={(value) => handleSliderChange('cadera', value)} />
                                </Form.Item>
                                <Form.Item label="Cintura" name="cintura">
                                    <Slider max={180} tooltip={{ open: showTooltips && tooltipOpenCintura  }} onChange={(value) => handleSliderChange('cintura', value)} />
                                </Form.Item>
                                <Form.Item label="Piernas" name="piernas">
                                    <Slider max={180} tooltip={{ open: showTooltips && tooltipOpenPiernas }} onChange={(value) => handleSliderChange('piernas', value)} />
                                </Form.Item>
                                <Form.Item label="Brazos" name="brazos">
                                    <Slider  max={180} tooltip={{ open: showTooltips && tooltipOpenBrazos }} onChange={(value) => handleSliderChange('brazos', value)} />
                                </Form.Item>

                            </Col>

                        </Row>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <Button htmlType="submit" type="primary" loading={processing}>Simular</Button>
                        </div>
                    </Form>


                    {(!processing && resultUrl !== "") && (
                        <Row>
                            <Col span={12}>
                                {selectedImageUrl !== "" && <img src={selectedImageUrl} alt="" height={800} style={{ width: '100%' }} />}
                            </Col>
                            <Col span={12}>
                                <img
                                    src={resultUrl}
                                    alt=""
                                    height={800}
                                    style={{ width: '100%' }}
                                    />
                            </Col>
                        </Row>
                    )}
                </>
                :
                (
                    <MySimulation />
                    )
                }
                </Card>


        </div>
    )
}

export default Simulation
