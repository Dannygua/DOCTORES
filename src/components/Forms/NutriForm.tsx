import {
  Form,
  Input,
  message,
  Button,
  Select,
  InputNumber,
  Col,
  Row,
  Space,
  Collapse,
} from "antd";
import { postData } from "../../services/common/postData";
import { useEffect, useState } from "react";
import { IMedicalRecordFormProps } from "./MedicalRecordForm";
import { putData } from "../../services/common/putData";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { lostDiet, postDiet, postDietFour, postDietOne, postDietThree, postDietTwo, preDiet, preDietOne, preDietThree, preDietTwo } from "../../mockData/diets";
import { groupDates } from "../../utils/dates";
import LastDate from "../LastDate";
import moment from "moment";
import { measurementsRgx } from "../../utils/exp";
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';

const { TextArea } = Input;

const NutriForm = ({
  form,
  toggleModal,
  date,
  setRefresh,
}: IMedicalRecordFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const change = (selectedValue: any) => {
    if (selectedValue === 1) {
      form.setFieldValue("diet", lostDiet)
    }

    if (selectedValue === 2) {
      form.setFieldValue("diet", preDietOne)
    }

    if (selectedValue === 3) {
      form.setFieldValue("diet", preDietTwo)
    }

    if (selectedValue === 4) {
      form.setFieldValue("diet", preDietThree)
    }

    if (selectedValue === 5) {
      form.setFieldValue("diet", postDietOne)
    }

    if (selectedValue === 6) {
      form.setFieldValue("diet", postDietTwo)
    }

    if (selectedValue === 7) {
      form.setFieldValue("diet", postDietThree)
    }

    if (selectedValue === 8) {
      form.setFieldValue("diet", postDietFour)
    }
  }


  const handleFinish = async (values: any) => {
    setIsSubmitting(true);
    console.log(values);

    const completeValues = {
      iddate: date._id,
      isMain: false,
      idpatient: date.idpatient,
      idespecialist: date.idespecialist,
      esAptoOperation: values.esAptoOperation,
      diet: values.diet,
      activity: values.activity,
      nutriInfo: {
        ...values,
        neckMeasurement: parseFloat(values.neckMeasurement),
        armsMeasurement: parseFloat(values.armsMeasurement),
        hipMeasurement: parseFloat(values.hipMeasurement),
        legsMeasurement: parseFloat(values.legsMeasurement)
      },
    };

    if ("record" in date) {
      const request = await putData(
        "api/records/" + date.record._id,
        completeValues
      );
      if (request.status) {
        message.success("Ficha médica actualizada exitosamente");
        setIsSubmitting(false);
        setRefresh((prevState: boolean) => !prevState);
        toggleModal();
        return;
      }
      setIsSubmitting(false);
      message.error(request.msg);
    } else {
      const request = await postData("api/records", completeValues);
      if (request.status) {
        message.success("Ficha médica creada exitosamente");
        setIsSubmitting(false);
        setRefresh((prevState: boolean) => !prevState);
        toggleModal();
        return;
      }
      setIsSubmitting(false);
      message.error(request.msg);
    }
  };


  const [lastDate, setLastDate] = useState<any>([])


  useEffect(() => {
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

          // Filtrar eventos excluyendo las fechas posteriores a la fecha actual
          const eventosFiltrados = date.patient.dates.filter((evento: any) => {
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
            }
          }

        }
      }
    }

  }, [date])

  const { Panel } = Collapse

  return (
    <>
      <Collapse accordion>
        <Panel header="Cita previa" key="0">
          <LastDate date={lastDate} patient={date.patient} />
        </Panel>
      </Collapse>
      <Collapse accordion>

        <Panel header="Información nutricional" key="1">
          <Form form={form} onFinish={handleFinish}>
            <Row>
              <Col span={11}>
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
            </Row>

            <Row>
              <Col xxl={{ span: 7 }} xl={{ span: 7 }} lg={{ span: 7 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }}>
                <Form.Item
                  name="exercisePerWeek"
                  label="Ejercicio por semana"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <InputNumber min={0} max={7} />
                </Form.Item>
              </Col>
              <Col xxl={{ span: 7 }} xl={{ span: 7 }} lg={{ span: 7 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }} offset={1}>

                <Form.Item
                  name="dailyWater"
                  label="Vasos de agua por día"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <InputNumber min={0} />
                </Form.Item>
              </Col>
              <Col xxl={{ span: 7, offset:1 }} xl={{ span: 7, offset:1 }} lg={{ span: 7, offset:1 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24  }}>

                <Form.Item 
                  label="Apto para cirugía"
                  name="esAptoOperation"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese si es apto o no",
                      type: 'boolean',  
                    },
                  ]}
                  valuePropName="value"
                >
                  <Radio.Group >
                    <Radio value={true}>Sí</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="comments" label="Observaciones">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Row>
              <Col span={24}>
                <h2>DIETA</h2>
              </Col>

              <Col span={24}>
                <Select
                  options={[
                    { label: 'Dieta pérdida de peso', value: 1 },
                    { label: 'Dieta pre cirugía FASE 1', value: 2 },
                    { label: 'Dieta pre cirugía FASE 2', value: 3 },
                    { label: 'Dieta pre cirugía FASE 3', value: 4 },
                    { label: 'Dieta post cirugía FASE 1', value: 5 },
                    { label: 'Dieta post cirugía FASE 2', value: 6 },
                    { label: 'Dieta post cirugía FASE 3', value: 7 },
                    { label: 'Dieta post cirugía FASE 4', value: 8 }
                  ]}
                  placeholder="Seleccione una dieta precargada"
                  onChange={change}
                />
              </Col>

              <Col span={24}>

                <Form.List name="diet">
                  {(fields, { add, remove }) => (
                    <Row>
                      {fields.map(({ key, name, ...restField }: any) => (
                        <Col
                          span={12}
                          key={key}
                          style={{ display: "flex", marginBottom: 8 }}
                        //align="baseline"
                        >
                          <Row>
                            <Col span={24}>
                              <h2> Comida {key + 1} <MinusCircleOutlined onClick={() => remove(name)} /></h2>
                            </Col>
                            <Col span={24}>
                              <Form.Item
                                {...restField}
                                name={[name, "description"]}
                                label="Descripcion"
                                rules={[
                                  {
                                    required: true,
                                    message: "Ingrese la descripcion de la comida",
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
                            Agregar Comida
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </Form.List>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <h2>ACTIVIDAD</h2>
              </Col>

              <Col span={24}>
                <Form.List name="activity">
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
                              <h2> Actividad {key + 1}
                                <MinusCircleOutlined onClick={() => remove(name)} />
                              </h2>
                            </Col>
                            <Col span={24}>
                              <Form.Item
                                {...restField}
                                name={[name, "description"]}
                                label="Actividad"
                                rules={[
                                  {
                                    required: true,
                                    message: "Ingrese Actividad",
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
                            Agregar Actividad
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </Form.List>
              </Col>
            </Row>
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
        </Panel>
      </Collapse >
    </>
  );
};

export default NutriForm;
