import {
    Form,
    Input,
    message,
    Button,
    Select,
    Collapse
} from "antd";
import { postData } from "../../services/common/postData";
import { useEffect, useState } from "react";
import { IMedicalRecordFormProps } from "./MedicalRecordForm";
import { putData } from "../../services/common/putData";
import { groupDates } from "../../utils/dates";
import LastDate from "../LastDate";
import moment from "moment";

const PsychoForm = ({
    form,
    toggleModal,
    date,
    setRefresh,
}: IMedicalRecordFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFinish = async (values: any) => {
        setIsSubmitting(true);
        const psychologistInfo = {
            comments: values.comments,
            isAllowed: values.isAllowed
        }
        const completeValues = {
            iddate: date._id,
            isMain: false,
            idpatient: date.idpatient,
            idespecialist: date.idespecialist,
            nutriInfo: psychologistInfo,
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
                <Panel header="Información Psicológica" key="1">
                    <Form form={form} onFinish={handleFinish}>
                        <Form.Item name="comments" label="Observaciones">
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item
                            name="isAllowed"
                            label="Apto para cirugía"
                            rules={[{ required: true, message: "Campo requerido" }]}
                        >
                            <Select
                                placeholder="Seleccionar valor"
                                options={[
                                    { label: "Sí", value: true },
                                    { label: "No", value: false },
                                ]}
                            />
                        </Form.Item>
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
            </Collapse>
        </>
    );
};

export default PsychoForm;
