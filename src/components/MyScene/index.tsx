import { PlusOutlined } from '@ant-design/icons';
import { Row, Col, Button, Upload, Form, message, Select, Spin, Typography, Card, InputNumber, Input } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { ITransformProp, postImageData, transform, transformShape } from '../../services/common/postData';
import type { RcFile } from 'antd/es/upload/interface';
import { putData } from '../../services/common/putData';
import { getData } from '../../services/common/getData';
import { AuthContext } from '../../context/AuthContext';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const { Option } = Select;

const MyScene = () => {
  const [processing, setProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState('')
  const [originalUrl, setOriginalUrl] = useState('')

  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(false)
  const [patients, setPatients] = useState<any>([])

  const [results, setResults] = useState(null)

  const { user }: any = useContext(AuthContext)

  const getPatients = async () => {
    setLoadingData(true);
    const requestPatients = await getData("api/users/patients");
    if (requestPatients.status) {
      setPatients(requestPatients.data);
    }
    setLoadingData(false);
  };

  const getPatient = async () => {
    const request = await getData('api/users/patients/' + user._id)
    let patient: any = null
    if (request.status) {
      if (request.data.length > 0) {
        patient = request.data[0]
      }
    }

    console.log('patient', patient)

    if (patient !== null) {
      setSelectedPatient(patient._id)
      if ('bodyImages' in patient) {
        setResults(patient.bodyImages)
        const getOriginal = patient.bodyImages.length > 0 ? patient.bodyImages.find((bodyImage: any) => bodyImage.name.includes('original')) : ''
        if (getOriginal !== '') {
          setOriginalUrl(getOriginal.url)

          const getLastSim = patient.bodyImages.find((bodyImage: any) => bodyImage.name.includes('last'))
          if (getLastSim) {
            setResults(getLastSim.url)
          }

        }
      }
    }
  }

  useEffect(() => {
    if (!user.isPatient) {
      getPatients();
    }

    if (user.isPatient) {
      getPatient()
    }
  }, []);

  const getFile = (e: any) => {

    getBase64(e.file.originFileObj as RcFile, (url) => {
      setOriginalUrl(url);
    });

    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      console.log('is arrayy!!')
      return e
    }
    return e && e.file.originFileObj;
  };

  const onFinish = async (values: any) => {

    if (selectedPatient === null) {
      message.error("Seleccione un paciente!")
      return;
    }

    setProcessing(true);
    if (values.imagen) {
      const imageForm = new FormData()
      imageForm.append('imagen', values.imagen)
      const uploadImage = await postImageData('images/shape', imageForm)

      if (uploadImage.status) {
        message.success("Imagen procesada exitosamente!")
        //setResultUrl(uploadImage['url_images'][0].url)
        //setResults(uploadImage['url_images'])
        let userId = selectedPatient._id
        if (user.isPatient) {
          userId = user._id
        }
        const updateUser = await putData('api/users/' + userId, { bodyImages: uploadImage['url_images'] })

        console.log('updateUser', updateUser)

        const tData: ITransformProp = {
          "medidas": {
            pecho: values.pecho || 40,
            cadera: values.cadera || 40,
            cintura: values.cintura || 40,
            piernas: values.piernas || 40,
            brazos: values.brazos || 40
          },
          "medidas_original": {
            pecho: 140,
            cadera: 140,
            cintura: 140,
            piernas: 140,
            brazos: 140
          },
          "image_url": uploadImage['url_images'][0].url
        }

        const tRequest = await transform('execute_bash', tData)
        console.log('---REQUEST---', tRequest)
        if('url' in tRequest){
          setResultUrl(tRequest.url)
          setResults(tRequest.url)
          setProcessing(false)
          return
        }
      }
      alert('Hubo un problema al cargar los archivos, por favor intenta de nuevo')
      setProcessing(false);
      return;
    } else {
      if (originalUrl !== "") {
        
        const tData: ITransformProp = {
          "medidas": {
            pecho: values.pecho || 40,
            cadera: values.cadera || 40,
            cintura: values.cintura || 40,
            piernas: values.piernas || 40,
            brazos: values.brazos || 40
          },
          "medidas_original": {
            pecho: 140,
            cadera: 140,
            cintura: 140,
            piernas: 140,
            brazos: 140
          },
          "image_url": originalUrl
        }
        const tRequest = await transform('execute_bash', tData)
        console.log('---REQUEST---', tRequest)
        if('url' in tRequest){
          setResultUrl(tRequest.url)
          setResults(tRequest.url)
          setProcessing(false)
          return
        }
        /*
        const request = await transformShape('images/shape/transform', data)
        if (request.status) {
          setResults(request.result)
          setProcessing(false)
          return;
        }
        */
      }
      message.error("No has seleccionado ninguna imagen!")
      setProcessing(false);
    }
  };


  const getLast = async (patientId: any, url: string, bodyImages: any[]) => {
    setProcessing(true)

    const request = await getData('api/dates/lastMeasuresBy/' + patientId)
    
    if(!request.status){
      setProcessing(false)
      return;
    }


    if (request.status) {

      if (!request.data) {
        setProcessing(false)
        return;
      }

      const data = {
        "medida_cuello": request.data.neckMeasurement,
        "medida_brazos": request.data.armsMeasurement,
        "medida_pecho": request.data.backMeasurement,
        "medida_cintura": request.data.waistMeasurement,
        "medida_cadera": request.data.hipMeasurement,
        "medida_piernas": request.data.legsMeasurement,
        "image_url": url
      }


      form.setFieldValue("cuello", request.data.neckMeasurement)
      form.setFieldValue("brazos", request.data.armsMeasurement)
      form.setFieldValue("pecho", request.data.backMeasurement)
      form.setFieldValue("cintura", request.data.waistMeasurement)
      form.setFieldValue("cadera", request.data.hipMeasurement)
      form.setFieldValue("piernas", request.data.legsMeasurement)

      const tRequest = await transformShape('images/shape/transform', data)

      if (tRequest.status) {

        setResults(tRequest.result)


        bodyImages.push({
          name: "last.jpg",
          url: tRequest.result
        })

        const eRequest = await putData('api/users/' + patientId, {
          bodyImages
        })

        console.log('er', eRequest)
        setProcessing(false)
        return;
      }
    }
  }

  const handleSelectPatient = (patientId: any) => {
    const sp = patients.find((patient: any) => patient._id === patientId)
    console.log('sp', sp)
    if (sp) {
      setSelectedPatient(sp);
      if ('bodyImages' in sp) {
        console.log('b', sp.bodyImages)
        const getOriginal = sp.bodyImages.length > 0 ? sp.bodyImages.find((bodyImage: any) => bodyImage.name.includes('original')) : ''
        if (getOriginal !== '') {
          setOriginalUrl(getOriginal.url)
          form.setFieldValue("imagen", undefined)
          getLast(patientId, getOriginal.url, sp.bodyImages)
        }
      }
    }
  }

  const [form] = Form.useForm()
  return (
    <div>
      {loadingData ? <Spin /> : (<Row style={{ marginBottom: 32 }}>
        <Col span={24}>
          {patients && patients.length > 0 && (
            <Select onChange={handleSelectPatient} style={{ width: '100%' }} placeholder="Seleccionar paciente">
              {
                patients.map((patient: any) => <Option value={patient._id}>{patient.firstname + " " + patient.lastname}</Option>)
              }
            </Select>
          )}
        </Col>
      </Row>)}

      {!user.isPatient && (
        <Form onFinish={onFinish} form={form} >
          <Row>
            <Col span={24}>
              <Form.Item
                label="Fotografía"
                name='imagen'
                getValueFromEvent={getFile}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                >
                  {originalUrl !== "" ? <img src={originalUrl} alt="avatar" style={{ width: '100%' }} /> : (
                    <div>
                      {!processing && <PlusOutlined />}
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label="Cuello"
                    name="cuello"
                    rules={[{ required: true, message: "Medida Requerida" }]}
                  >
                    <InputNumber min={30} max={200} />
                  </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                  <Form.Item
                    label="Brazos"
                    name="brazos"
                    rules={[{ required: true, message: "Medida Requerida" }]}
                  >
                    <InputNumber min={30} max={200} />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    label="Pecho"
                    name="pecho"
                    rules={[{ required: true, message: "Medida Requerida" }]}
                  >
                    <InputNumber min={30} max={200} />
                  </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                  <Form.Item
                    label="Cintura"
                    name="cintura"
                    rules={[{ required: true, message: "Medida Requerida" }]}
                  >
                    <InputNumber min={30} max={200} />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    label="Cadera"
                    name="cadera"
                    rules={[{ required: true, message: "Medida Requerida" }]}
                  >
                    <InputNumber min={30} max={200} />
                  </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                  <Form.Item
                    label="Piernas"
                    name="piernas"
                    rules={[{ required: true, message: "Medida Requerida" }]}
                  >
                    <InputNumber min={30} max={200} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Button htmlType="submit" type="primary" loading={processing}>
                Procesar
              </Button>
            </Col>
            <Col span={24}>
              <label> Procura que la fotografía sea en una posición natural y con un fondo blanco </label>
            </Col>
          </Row>
        </Form>
      )}

      {(!processing && results) && (
        <div>
          <img
            src={results}
            alt=""
          />
        </div>
      )}
    </div>
  );
};

export default MyScene;
