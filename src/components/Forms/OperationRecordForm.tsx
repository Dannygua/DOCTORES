import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Collapse,
  Select,
  DatePicker,
  DatePickerProps,
  message,
  Space,
  Upload,
  Alert,
  UploadProps,
  UploadFile,
} from "antd";
import { postData, postFormData } from "../../services/common/postData";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { putData } from "../../services/common/putData";
import { groupDates } from "../../utils/dates";
import LastDate from "../LastDate";
import SendAlertButton from "../SendAlertButton";
import { measurementsRgx, onlyChars } from "../../utils/exp";
import { Cedula } from "../../validation/Cedula";
import { getData } from "../../services/common/getData";
import { uploadFileToCloudinary } from "../../utils/uploader";
import { Hidden } from "@mui/material";

const { Panel } = Collapse;
const { TextArea } = Input;


export interface IMedicalRecordFormProps {
  toggleModal: Function;
  form: any;
  date: any;
  setRefresh: any;
}

const OperationRecordForm = ({
  form,
  toggleModal,
  date,
  setRefresh,
}: IMedicalRecordFormProps) => {

  let patientHasMainRecord = false;
  if (typeof (date) !== "undefined") {
    if ("patient" in date) {
      if ("dates" in date.patient) {
        const datesWithRecord = date.patient.dates.filter(
          (date: any) => "record" in date
        );
        if (datesWithRecord.length > 0) {
          patientHasMainRecord =
            datesWithRecord.filter((date: any) => date.record?.isMain).length > 0;
        }
      }
    }
  }

  const [disabledHeight, setDisabledHeight] = useState(false)

  const setSomeValues = (date: any) => {
    console.log('handling...', date[0])
    if (date.length > 0) {

      if ('record' in date[0]) {
        if ('generalInfo' in date[0].record) {
          var bornDate = new Date(date[0].record.generalInfo?.bornDate);
          console.log('aaaaaa', date[0])

          form.setFieldValue("ci", date[0].record.generalInfo.ci?.toString())
          form.setFieldValue("civilState", date[0].record.generalInfo?.civilState)
          form.setFieldsValue({ bornDate: moment(bornDate), });
          form.setFieldValue("bornPlace", date[0].record.generalInfo?.bornPlace)
          form.setFieldValue("ocupation", date[0].record.generalInfo?.ocupation)
          form.setFieldValue("profession", date[0].record.generalInfo?.profession)
          form.setFieldValue("referredBy", date[0].record.generalInfo?.referredBy)

        }

        if ('contactInfo' in date[0].record) {
          form.setFieldValue("address", date[0].record.contactInfo?.address)
          form.setFieldValue("phone", "0" + date[0].record.contactInfo?.phone)
        }

        if ('nutriInfo' in date[0].record) {
          form.setFieldValue("armsMeasurement", date[0].record.nutriInfo?.armsMeasurement)
          form.setFieldValue("backMeasurement", date[0].record.nutriInfo?.backMeasurement)
          form.setFieldValue("hipMeasurement", date[0].record.nutriInfo?.hipMeasurement)
          form.setFieldValue("legsMeasurement", date[0].record.nutriInfo?.legsMeasurement)
          form.setFieldValue("neckMeasurement", date[0].record.nutriInfo?.neckMeasurement)
          form.setFieldValue("waistMeasurement", date[0].record.nutriInfo?.waistMeasurement)
        }
      }

      if ('record' in date[0]) {
        console.log('bbbbbb', date[0])
        if ('medicalInfo' in date[0].record) {
          console.log('cccccc', date[0].record.medicalInfo)
          const { medicalInfo } = date[0].record
          form.setFieldValue("height", medicalInfo.height?.toString())
          form.setFieldValue("weight", medicalInfo.weight?.toString())
          form.setFieldValue("imc", medicalInfo.imc?.toString())
          setDisabledHeight(true)
        }
      }
    }
  }


  const [lastDate, setLastDate] = useState<any>([])


  useLayoutEffect(() => {
    getTests()
  }, [])

  useEffect(() => {
    if (typeof (date) !== "undefined") {
      if ("patient" in date) {
        /*
        const ld = getLastDate(date.patient)
        if (ld !== false) {
          setLastDate(ld)
        }
        */

        if ("dates" in date.patient) {
          if (date.patient.dates.length > 0) {


            const fechaActual = moment(date.start);

            const datesWithRecord = date.patient.dates.filter((date: any) => 'record' in date)


            if (datesWithRecord.length > 0) {
              // Filtrar eventos excluyendo las fechas posteriores a la fecha actual
              const eventosFiltrados = datesWithRecord.filter((evento: any) => {
                const fechaEvento = moment(evento.start);
                return fechaEvento.isBefore(fechaActual);
              });


              const comparareDates = (a: any, b: any) => {
                return b.start.localeCompare(a.start);
              };
              const sortedDates = eventosFiltrados.sort(comparareDates);

              console.log('sd', sortedDates)

              const gd: any = groupDates(sortedDates)

              console.log('gd', gd)

              if (gd !== false) {
                if (gd.length > 0) {
                  const recentGroup = gd[0]
                  setLastDate(recentGroup)
                  setSomeValues(recentGroup)
                }
              }
            }

          }
        }
      }

    }
  }, [date])


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<any>([])



  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    form.setFieldsValue({ bornDate: date });
  };

  const disabledDate = (current: any) => {
    const eighteenYearsAgo = moment().subtract(18, "years");
    return current && current > eighteenYearsAgo;
  };

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    console.log("valores del form:", values);




    let testsToApi = [];
    if (values.Test) {
      testsToApi = values.Test.map((test: any) => {
        return {
          name: typeof test === "string" ? test : test.value,
        };
      });
    }


    let testResultsToApi = []
    if (values.testResults) {
      const imageForm = new FormData()

      const uploadPreset = "imagePreset";
      imageForm.append('file', values.testResults)
      imageForm.append("upload_preset", uploadPreset);


      const uploadImage = await uploadFileToCloudinary(imageForm)
      console.log('ui', uploadImage)

      if (!uploadImage) {
        message.error("Algo ha salido mal procesando la imagen :( , por favor intenta de nuevo")
        setIsSubmitting(false)
        return
      }

      let at = values.associatedTests

      console.log('at', at)

      testResultsToApi.push(
        {
          url: uploadImage
        }
      )

      for (let i = 0; i < testResultsToApi.length; i++) {
        testResultsToApi[i] = {
          url: testResultsToApi[i].url,
          name: at[i]
        }
      }
    }


    const completeValues = {
      iddate: date._id,
      isMain: patientHasMainRecord ? false : true,
      idpatient: date.idpatient,
      idespecialist: date.idespecialist,

      generalInfo: {
        bornDate: new Date(values.bornDate),
        bornPlace: values.bornPlace,
        ci: values.ci,
        civilState: values.civilState,
        ocupation: values.ocupation,
        profession: values.profession,
        referredBy: values.referredBy
      },
      contactInfo: {
        address: values.address,
        phone: parseInt(values.phone),
      },
      medicalInfo: {
        weight: parseFloat(values.weight),
        height: parseFloat(values.height),
        imc: parseFloat(values.imc),
        comments: typeof (values.comments) === "undefined" ? "" : values.comments
      },
      Test: testsToApi,
      testResults: testResultsToApi,
      recipe: values.recipe,
      care: values.care,
      diet: values.diet,
      nutriInfo: {
        backMeasurement: parseFloat(values.backMeasurement),
        waistMeasurement: parseFloat(values.waistMeasurement),
        neckMeasurement: parseFloat(values.neckMeasurement),
        armsMeasurement: parseFloat(values.armsMeasurement),
        hipMeasurement: parseFloat(values.hipMeasurement),
        legsMeasurement: parseFloat(values.legsMeasurement)
      },
    };


    console.log("valores que se mandan", completeValues)
    if ("record" in date) {
      const request = await putData(
        "api/records/" + date.record._id,
        completeValues
      );
      if (request.status) {
        message.success("Ficha cirugia actualizada exitosamente");
        setIsSubmitting(false);
        setRefresh((prevState: boolean) => !prevState);
        toggleModal();
        return;
      }
      setIsSubmitting(false);
      message.error(request.msg);
    } else {
      const request = await postData("api/records", completeValues);
      console.log(completeValues)
      console.log(request)
      if (request.status) {
        message.success("Ficha cirugia creada exitosamente");
        setIsSubmitting(false);
        setRefresh((prevState: boolean) => !prevState);
        toggleModal();
        return;
      }
      setIsSubmitting(false);
      message.error(request.msg);
    }
  };


  const [showAlert, setShowAlert] = useState(false)

  const onChangeWeight = (value: string) => {
    if (value !== "") {
      const weightValue = parseFloat(value);
      const heightValue = form.getFieldValue("height");
      if (heightValue) {
        const result =
          weightValue / (parseFloat(heightValue) * parseFloat(heightValue));

        form.setFieldsValue({ imc: result.toFixed(2) });
        /*if (result > 25) {
          setShowAlert(true)
        }*/
      }
    }
  };

  const onChangeHeight = (value: string) => {
    if (value !== "") {
      const heightValue = parseFloat(value);
      const weightValue = form.getFieldValue("weight");
      if (weightValue) {
        const result = parseFloat(weightValue) / (heightValue * heightValue);
        form.setFieldsValue({ imc: result.toFixed(2) });
        /*if (result > 25) {
          setShowAlert(true)
        }*/
      }
    }
  };

  const testsMock = [
    "Biometria Hemática",
    "Glucosa",
    "Insulina",
    "Hemoglobina glicosilada",
    "Triglicéridos",
    "Colesterol",
    "Hdl",
    "ldl",
    "Creatinina",
    "Ácido úrico",
    "TSH",
    "T3",
    "T4",
    "Proteínas totales albumina",
    "TP - TTP",
    "Endoscopia Digestiva Alta",
  ];

  const generateTests = () => {
    const fullTests = testsMock.map((test: string) => {
      return { label: test, value: test };
    });
    return fullTests;
  };


  const [tests, setTests] = useState([])

  const getTests = async () => {
    const requestTests = await getData("api/tests/?justActive=" + true)
    if (requestTests.status) {
      const testToSelect = requestTests.data.map((test: any) => {
        return { label: test.name, value: test.name }
      })
      setTests(testToSelect)
    }
  }

  const [imageUrl, setImageUrl] = useState('')

  const getFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      console.log('is arrayy!!')
      return e
    }
    return e && e.file.originFileObj;
  };

  const tr = form.getFieldValue('testResults')

  console.log('tr', tr)

  const dfl = (tr && tr.length > 0) ? tr.map((result: any, index: any) => {
    return {
      uid: index,
      name: result.url,
      status: 'done',
      url: result.url,
    }
  })
    :
    []


  console.log('dfl', dfl)


  const imcValue = Form.useWatch('imc', form);
  const heightValue = Form.useWatch('height', form);

  console.log('imcValue', imcValue)

  const getImcMessage = () => {
    let dinamicText = ""
    let baseText = "El IMC indica "
    const parsedValue = parseFloat(imcValue)
    if (parsedValue < 15) {
      dinamicText = "Delgadez muy severa"
      return baseText + dinamicText;
    }
    if (parsedValue >= 15 && parsedValue <= 15.9) {
      dinamicText = "Delgadez severa"
      return baseText + dinamicText;
    }

    if (parsedValue > 16 && parsedValue <= 18.4) {
      dinamicText = "Delgadez"
      return baseText + dinamicText;
    }


    if (parsedValue > 18.5 && parsedValue <= 24.9) {
      dinamicText = "Peso saludable"
      return baseText + dinamicText;

    }

    if (parsedValue > 25 && parsedValue <= 29.9) {
      dinamicText = "Sobrepeso"
      return baseText + dinamicText;

    }

    if (parsedValue > 30 && parsedValue <= 34.9) {
      dinamicText = "Obesidad moderada"
      return baseText + dinamicText;
    }

    if (parsedValue > 35 && parsedValue <= 39.9) {
      dinamicText = "Obesidad severa"
      return baseText + dinamicText;
    }

    if (parsedValue > 40) {
      dinamicText = "Obesidad mórbida"
      return baseText + dinamicText;
    }
  }


  const [fileList, setFileList] = useState<UploadFile[]>([])

  const onChangeUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => {

    const updatedList = []

    const tr = form.getFieldValue('testResults')

    console.log('tr', tr)

    const dfl = (tr && tr.length > 0) ? tr.map((result: any, index: any) => {
      return {
        uid: index,
        name: result.url,
        status: 'done',
        url: result.url,
      }
    })
      :
      []

    console.log('dfl', dfl)

    console.log('new file list', newFileList)

    const cleanNfl = newFileList.map((file: any) => {
      return {
        ...file,
        status: 'done'
      }
    })

    setFileList(cleanNfl);
  };

  return (
    <>
      {/* {
        lastDate.length > 0 && (
          <Collapse accordion>
            <Panel header="Cita previa" key="0">
              <LastDate date={lastDate} patient={date.patient} />
            </Panel>
          </Collapse>
        )
      } */}
      <Form onFinish={onFinish} form={form}>
        <Collapse accordion>

          <>
            <div style={{ display: "none" }}>


              <Panel header="Información General" key="1" style={{ display: "none" }}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      label="Cédula/Pasaporte"
                      name="ci"
                      rules={[
                        {
                          required: true,
                          message:
                            "Por favor ingrese el número de cédula o pasaporte del paciente",
                        },
                        {
                          max: 12,
                          message: "No debe exceder los 10 dígitos",
                        },
                        {
                          min: 9,
                          message: "No debe ser menos de 10 dígitos",
                        },
                        {
                          validator: async (_, value) => Cedula(value),
                          message: "Cédula no valida!",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item
                      label="Estado Civil"
                      name="civilState"
                      rules={[
                        {
                          required: true,
                          message:
                            "Por favor ingrese el estado civil del paciente",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Seleccione una opción"
                        options={[
                          { value: "Soltero", label: "Soltero" },
                          { value: "Casado", label: "Casado" },
                          { value: "Divorciado", label: "Divorciado" },
                          { value: "Viudo", label: "Viudo" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      label="Fecha de Nacimiento"
                      name="bornDate"
                      rules={[
                        {
                          required: true,
                          message:
                            "Por favor ingrese la fecha de nacimiento del paciente",
                        },
                      ]}
                    >
                      <DatePicker
                        onChange={onChange}
                        style={{ width: "100%" }}
                        disabledDate={disabledDate}
                        placeholder="1989-03-21"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item
                      label="Lugar de nacimiento"
                      name="bornPlace"
                      rules={[
                        {
                          required: true,
                          message:
                            "Por favor ingrese el lugar de nacimiento del paciente",
                        },
                        {
                          pattern: onlyChars,
                          message: "Sólo puedes ingresar letras"
                        }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="Ocupación" name="ocupation"
                      rules={[
                        {
                          pattern: onlyChars,
                          message: "Sólo puedes ingresar letras"
                        }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item label="Profesión" name="profession"
                      rules={[
                        {
                          pattern: onlyChars,
                          message: "Sólo puedes ingresar letras"
                        }
                      ]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="Referido por" name="referredBy" rules={[
                      {
                        pattern: onlyChars,
                        message: "Sólo puedes ingresar letras"
                      }
                    ]}>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
              <Panel header="Información de contacto" key="2">
                <Row>
                  <Col span={11}>
                    <Form.Item
                      label="Dirección"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese la dirección del paciente",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item
                      label="Teléfono"
                      name="phone"
                      rules={[
                        {
                          pattern: /^\d+$/,
                          message: "Sólo debe contener caracteres numéricos",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
            </div>
          </>

          <Panel header="Información médica" key="3">
            <Row>
              <div style={{ display: "none" }}>
                <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Row style={{ display: "none" }}>
                    <Col span={11}>
                      <Form.Item

                        label="Altura"
                        name="height"
                        rules={[
                          {
                            required: true,
                            message: "Por favor ingrese la altura del paciente",
                          },
                          { pattern: /^(2(\.0+)?|1(\.[0-9]+)?|0(\.[0-9]+)?)\s*$/, message: 'Estatura incorrecta' }
                        ]}
                      >
                        <Input
                          // disabled={disabledHeight}
                          onChange={(e) => onChangeHeight(e.target.value)} suffix="m" />
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                      <Form.Item
                        label="Peso"
                        name="weight"
                        rules={[
                          {
                            required: true,
                            message: "Por favor ingrese el peso del paciente",
                          },
                          { pattern: /^(200(\.0+)?|((?:[0-1]?\d{0,2}|2[0-1]\d)(\.\d+)?))\s*$/, message: 'Peso incorrecto' }
                        ]}
                      >
                        <Input onChange={(e) => onChangeWeight(e.target.value)} suffix="kg" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        label="IMC"
                        name="imc"
                        rules={[
                          {
                            required: true,
                            message: "Por favor ingrese el cálculo de IMC del paciente",
                          },
                        ]}
                      >
                        <Input disabled />
                      </Form.Item>
                      {typeof (imcValue) !== "undefined" && (
                        <>
                          <Alert style={{ marginTop: -12, marginBottom: 4 }} type="error" message={getImcMessage()} />
                          {(parseFloat(imcValue) >= 40) && (
                            <SendAlertButton email={date.patient.email} imcValue={imcValue} />
                          )}
                        </>
                      )}

                    </Col>
                  </Row>
                </Col>
              </div>

              <div style={{ display: "none" }}>
                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24} offset={1}>
                  <Row>
                    <Col span={24}>
                      <Form.Item label="Exámenes" name="Test">
                        {tests && tests.length > 0 && (
                          <Select
                            placeholder="Seleccione los exámenes que debe realizarse el paciente"
                            options={tests}
                            mode="multiple"
                            allowClear
                            style={{ width: "100%" }}
                          />
                        )}

                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Resultados"
                        name='testResults'
                        getValueFromEvent={getFile}
                      >
                        <Upload
                          showUploadList={true}
                          multiple={true}
                          fileList={fileList}
                          onChange={onChangeUpload}

                        >
                          <Button icon={<UploadOutlined />}>Subir archivo</Button>
                        </Upload>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name='associatedTests'
                        extra="Siga el orden en que fueron cargados los mismos"
                      >
                        {tests && tests.length > 0 && (
                          <Select
                            placeholder="Seleccione los exámenes a los que están asociados los resultados"
                            options={tests}
                            allowClear
                            style={{ width: "100%" }}
                            mode="multiple"
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </div>

              <Col span={24}>
                <h2>RECETA</h2>
              </Col>
              <Form.List name="recipe">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }: any) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Row>
                          <Col span={24}>
                            <h2> Medicamento {key + 1}</h2>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              {...restField}
                              name={[name, "name"]}
                              label="Medicamento"
                              rules={[
                                {
                                  required: true,
                                  message: "Ingrese el nombre del medicamento",
                                },
                              ]}
                            >
                              <Input placeholder="Nombre" />
                            </Form.Item>
                          </Col>
                          <Form.Item
                            {...restField}
                            name={[name, "dose"]}
                            label="Dosis"
                            rules={[
                              {
                                required: true,
                                message: "Ingrese la dosis del medicamento",
                              },
                            ]}
                          >
                            <Input placeholder="Dosis" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "frequency"]}
                            label="Frecuencia"
                            rules={[
                              {
                                required: true,
                                message: "Ingrese la frecuencia del medicamento",
                              },
                            ]}
                          >
                            <Input placeholder="Frecuencia" />
                          </Form.Item>
                        </Row>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Col span={24}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Agregar medicamento
                        </Button>
                      </Form.Item>
                    </Col>
                  </>
                )}
              </Form.List>
              <Col span={24}>
                <h2>CUIDADO DE LA HERIDA</h2>
              </Col>

              <Col span={24}>

                <Form.List name="care">
                  {(fields, { add, remove }) => (
                    <Row>
                      {fields.map(({ key, name, ...restField }: any) => (
                        <Col
                          span={12}
                          style={{ display: "flex", marginBottom: 8 }}
                        // align="baseline"
                        >
                          <Row>
                            <Col span={24}>
                              <h2> Cuidado {key + 1}
                                <MinusCircleOutlined onClick={() => remove(name)} /></h2>
                            </Col>
                            <Col span={24}>
                              <Form.Item
                                {...restField}
                                name={[name, "description"]}
                                label="Cuidado"
                                rules={[
                                  {
                                    required: true,
                                    message: "Ingrese el cuidado de la herida",
                                  },
                                ]}
                              >
                                <TextArea rows={4} />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      ))}
                      <Col span={24}>
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Agregar cuidado
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </Form.List>
              </Col>

              <div style={{ display: "none" }}>
                <Col span={24}>
                  <h2>MEDIDAS</h2>
                </Col>
                <Col span={11} >
                  <Form.Item
                    name="neckMeasurement"
                    label="Medida de cuello"
                    rules={[
                      { required: true, message: "Campo requerido" },
                      { pattern: measurementsRgx, message: "Medida inválida" }
                    ]}
                  >
                    <Input suffix={<span>cm</span>} />
                  </Form.Item>
                </Col>
                <Col span={11} offset={1}>

                  <Form.Item
                    name="armsMeasurement"
                    label="Medida de brazos"
                    rules={[
                      { required: true, message: "Campo requerido" },
                      { pattern: measurementsRgx, message: "Medida inválida" }
                    ]}
                  >
                    <Input suffix={<span>cm</span>} />
                  </Form.Item>
                </Col>
                <Col span={11}>

                  <Form.Item
                    name="backMeasurement"
                    label="Medida de pecho"
                    rules={[
                      { required: true, message: "Campo requerido" },
                      { pattern: measurementsRgx, message: "Medida inválida" }
                    ]}
                  >
                    <Input suffix={<span>cm</span>} />
                  </Form.Item>
                </Col>
                <Col span={11} offset={1}>

                  <Form.Item
                    name="waistMeasurement"
                    label="Medida de cintura"
                    rules={[
                      { required: true, message: "Campo requerido" },
                      { pattern: measurementsRgx, message: "Medida inválida" }
                    ]}
                  >
                    <Input suffix={<span>cm</span>} />
                  </Form.Item>
                </Col>
                <Col span={11}>

                  <Form.Item
                    name="hipMeasurement"
                    label="Medida de cadera"
                    rules={[
                      { required: true, message: "Campo requerido" },
                      { pattern: measurementsRgx, message: "Medida inválida" }
                    ]}
                  >
                    <Input suffix={<span>cm</span>} />
                  </Form.Item>
                </Col>
                <Col span={11} offset={1}>

                  <Form.Item
                    name="legsMeasurement"
                    label="Medida de piernas"
                    rules={[
                      { required: true, message: "Campo requerido" },
                      { pattern: measurementsRgx, message: "Medida inválida" }
                    ]}
                  >
                    <Input suffix={<span>cm</span>} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Observaciones" name="comments" style={{ marginTop: 12 }} >
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </Col>
              </div>
            </Row>
          </Panel>

        </Collapse>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            marginTop: 16,
          }}
        >
          <Button htmlType="submit" type="primary" loading={isSubmitting}>
            Guardar
          </Button>
        </div>
      </Form>
    </>

  );
};

export default OperationRecordForm;