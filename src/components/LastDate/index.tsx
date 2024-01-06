import { PDFDownloadLink } from '@react-pdf/renderer'
import Recepepdf from '../PDF/Recepepdf'
import { Button, Row, Col, Modal, Card } from 'antd'
import es from 'date-fns/locale/es';
import { format, isAfter } from 'date-fns'

import { ClockCircleOutlined, CloudDownloadOutlined, DownloadOutlined, EyeFilled, EyeOutlined, VideoCameraOutlined } from '@ant-design/icons';
import ModalHeader from '../ModalHeader';
import { DownloadDoneOutlined, VideocamOutlined } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';

export const CiruInfo = ({ date, firstname, lastname, onlyHour, hideDatetime }: any) => {
    return (
        <>
        <Card
            title="Cuidados y recetas || POST OPERACION"
            extra={<>
                {!hideDatetime && (
                    <>
                        <ClockCircleOutlined /> {" "} {onlyHour ? 'Hora:' : 'Fecha y Hora:'} {format(new Date(date.start), onlyHour ? 'h:mm a' : 'd MMMM, yyyy h:mm a', { locale: es })}
                    </>
                )}
            </>}>
            
            <div style={{display:"flex", flexDirection: "column"}}>
                <div style={{ display: 'flex', padding: 12 , marginTop: "20px"}}>
                    {/* muestra los tests */}
                    { "care" in date.record && date.record.care.length > 0 && (
                        <div>
                        
                            {date.record.care.map((care: any, index: number) => (
                                <span key={index} style={{ display: "block" }}>
                                    - Cuidado {index + 1} : {care.description}
                                </span>
                            ))}
                        </div>
                    )}
                    
                </div>
                <div style={{ display: 'flex', padding: 12}}>
                {date?.record?.recipe[0] && (
                        <PDFDownloadLink
                            document={
                                <Recepepdf
                                    date={date}
                                    firstname={firstname}
                                    lastname={lastname}
                                />
                            }
                            fileName="receta.pdf"
                        >
                            <Button type="primary" icon={<CloudDownloadOutlined />}>Descargar Receta</Button>
                        </PDFDownloadLink>
                    )}
                </div>
            </div>
            
        </Card>
        </>
    )
}

export const ExamInfo = ({ date, firstname, lastname, onlyHour, hideDatetime }: any) => {
    return (
        <>
        <Card
            title="Listado de examenes"
            extra={<>
                {!hideDatetime && (
                    <>
                        <ClockCircleOutlined /> {" "} {onlyHour ? 'Hora:' : 'Fecha y Hora:'} {format(new Date(date.start), onlyHour ? 'h:mm a' : 'd MMMM, yyyy h:mm a', { locale: es })}
                    </>
                )}
            </>}>
            <span style={{ display: "flex", marginLeft: "20px", marginTop:"20px"}}>Exámenes:</span>
            <div style={{ display: 'flex', padding: 12 , marginTop: "35px"}}>
                {/* muestra los tests */}
                { "Test" in date.record && date.record.Test.length > 0 && (
                    <div>
                       
                        {date.record.Test.map((test: any, index: number) => (
                            <span key={index} style={{ display: "block" }}>
                                - Examen {index + 1}: {test.name}
                            </span>
                        ))}
                    </div>
                )}
                {/* //muestra los resultados */}
                {"testResults" in date.record && (
                    <>
                        {date.record.testResults.length > 0 && date.record.testResults.map((result: any, index:number) => (
                            <Button
                                type="primary"
                                icon={<EyeOutlined />}
                                href={result.url}
                                target="_blank"
                                style={{marginLeft:"20px"}}
                                key={index}
                            >
                                Resultado de examen {index + 1}: {result.name}
                            </Button>
                        ))
                        }
                    </>
                )}
            </div>
        </Card>
        </>
    )
}

const MedicalInfo = ({ date, firstname, lastname, onlyHour, hideDatetime }: any) => {
    {console.log(date)}
    return (
        <>
        {date.tipoAgenda === "Cita General" ? (
            <Card
            title={`Información de cita médica`}
            extra={<>
                {!hideDatetime && (
                    <>
                        <ClockCircleOutlined /> {" "} {onlyHour ? 'Hora:' : 'Fecha y Hora:'} {format(new Date(date.start), onlyHour ? 'h:mm a' : 'd MMMM, yyyy h:mm a', { locale: es })}
                    </>
                )}
            </>}>
            <div style={{ display: 'block', padding: 16 }}>
                <span style={{ display: "block" }}>
                    Talla: {date.record.medicalInfo.height}m
                </span>
                <span style={{ display: "block" }}>
                    Peso: {date.record.medicalInfo.weight}kg
                </span>
                <span style={{ display: "block" }}>
                    IMC: {date.record.medicalInfo.imc}
                </span>
                {'isAllowed' in date.record.medicalInfo && (
                    <span style={{ display: "block" }}>
                        Apto para cirugía: {date.record.medicalInfo.allowed ? "Sí" : "No"}
                    </span>
                )}
                
                <span style={{ display: "block" }}>
                    Medida de cuello:{" "}
                    {date.record.nutriInfo.neckMeasurement}cm
                </span>

                <span style={{ display: "block" }}>
                    Medida de brazos:{" "}
                    {date.record.nutriInfo.armsMeasurement}cm
                </span>

                <span style={{ display: "block" }}>
                    Medida de pecho:{" "}
                    {date.record.nutriInfo.backMeasurement}cm
                </span>


                <span style={{ display: "block" }}>
                    Medida de cintura:{" "}
                    {date.record.nutriInfo.waistMeasurement}cm
                </span>

                <span style={{ display: "block" }}>
                    Medida de cadera:{" "}
                    {date.record.nutriInfo.hipMeasurement}cm
                </span>

                <span style={{ display: "block" }}>
                    Medida de piernas:{" "}
                    {date.record.nutriInfo.legsMeasurement}cm
                </span>

                {/* {"Test" in date.record && date.record.Test.length > 0 && (
                    <div>
                        <span style={{ display: "block" }}>Exámenes:</span>
                        {date.record.Test.map((test: any) => (
                            <span style={{ display: "block" }}>
                                - {test.name}
                            </span>
                        ))}
                    </div>
                )} */}

                {"care" in date.record && (
                    <>
                        {date.record.care.length > 0 && date.record.care.map((careItem: any) =>
                            <>
                                Cuidado de herida: {" "}
                                <span style={{ display: 'block' }}>{careItem.description}</span>
                            </>
                        )}
                    </>
                )}

                {"comments" in date.record.medicalInfo && (
                    <>
                        Comentarios: {" "}
                        <span style={{ display: 'block' }}>
                            {date.record.medicalInfo.comments}
                        </span>
                    </>
                )}

                {/* {"testResults" in date.record && (
                    <>
                        {date.record.testResults.length > 0 && date.record.testResults.map((result: any) => (
                            <Button
                                type="primary"
                                icon={<EyeOutlined />}
                                href={result.url}
                                target="_blank"
                            >
                                Ver resultados de exámenes
                            </Button>
                        ))
                        }
                    </>
                )} */}

                {date?.record?.recipe[0] && (
                    <PDFDownloadLink
                        document={
                            <Recepepdf
                                date={date}
                                firstname={firstname}
                                lastname={lastname}
                            />
                        }
                        fileName="receta.pdf"
                    >
                        <Button type="primary" icon={<CloudDownloadOutlined />}>Descargar Receta</Button>
                    </PDFDownloadLink>
                )}

                {"callUrl" in date && (
                    <div>
                        {date.callUrl !== "" && <Button
                            icon={<VideoCameraOutlined />}
                            type="primary"
                            href={date.callUrl}
                            target="_blank"
                        >
                            Ver videollamada guardada
                        </Button>}
                    </div>
                )}

            </div>

        </Card>
        ) : (
            <Card
            title={`Información de Cirugia`}
            extra={<>
                {!hideDatetime && (
                    <>
                        <ClockCircleOutlined /> {" "} {onlyHour ? 'Hora:' : 'Fecha y Hora:'} {format(new Date(date.start), onlyHour ? 'h:mm a' : 'd MMMM, yyyy h:mm a', { locale: es })}
                    </>
                )}
            </>}>
            <div style={{ display: 'block', padding: 16 }}>

                {"care" in date.record && (
                    <>
                        {date.record.care.length > 0 && date.record.care.map((careItem: any) =>
                            <>
                                Cuidado de herida: {" "}
                                <span style={{ display: 'block' }}>{careItem.description}</span>
                            </>
                        )}
                    </>
                )}

                {date?.record?.recipe[0] && (
                    <PDFDownloadLink
                        document={
                            <Recepepdf
                                date={date}
                                firstname={firstname}
                                lastname={lastname}
                            />
                        }
                        fileName="receta.pdf"
                    >
                        <Button type="primary" icon={<CloudDownloadOutlined />}>Descargar Receta</Button>
                    </PDFDownloadLink>
                )}

            </div>

        </Card>
        )}
        
        </>
    )
}


const NutriInfo = ({ date, firstname, lastname, onlyHour, hideDatetime }: any) => {
    const [openDietModal, setOpenDietModal] = useState(false)
    return (
        <Card title="Información nutricional"
            extra={<>
                {!hideDatetime && (
                    <>
                        <ClockCircleOutlined /> {" "} {onlyHour ? 'Hora:' : 'Fecha y Hora:'} {format(new Date(date.start), onlyHour ? 'h:mm a' : 'd MMMM, yyyy h:mm a', { locale: es })}
                    </>
                )}
            </>}>
            <div style={{ display: 'block', padding: 16 }}>
                <span style={{ display: "block" }}>
                    Medida de cuello:{" "}
                    {date.record.nutriInfo.neckMeasurement}cm
                </span>

                <span style={{ display: "block" }}>
                    Medida de brazos:{" "}
                    {date.record.nutriInfo.armsMeasurement}cm
                </span>

                <span style={{ display: "block" }}>
                    Medida de pecho:{" "}
                    {date.record.nutriInfo.backMeasurement}cm
                </span>


                <span style={{ display: "block" }}>
                    Medida de cintura:{" "}
                    {date.record.nutriInfo.waistMeasurement}cm
                </span>

                <span style={{ display: "block" }}>
                    Medida de cadera:{" "}
                    {date.record.nutriInfo.hipMeasurement}cm
                </span>

                <span style={{ display: "block" }}>
                    Medida de piernas:{" "}
                    {date.record.nutriInfo.legsMeasurement}cm
                </span>

                <span style={{ display: "block" }}>
                    Ejercicio por semana:{" "}
                    {date?.record?.nutriInfo?.exercisePerWeek?.toString()}
                </span>
                <span style={{ display: "block" }}>
                    Vasos de agua diarios:{" "}
                    {date?.record?.nutriInfo?.dailyWater?.toString()}
                </span>
                <span style={{ display: "block" }}>
                    Apto para cirugía:{" "}
                    {date.record.nutriInfo.isAllowed ? "Sí" : "No"}
                </span>

                {"activity" in date.record && (
                    <>
                        {date.record.activity.length > 0 && date.record.activity.map((recordIt: any) =>
                            <>
                                Actividades: {" "}
                                <span style={{ display: 'block' }}>{recordIt.description}</span>
                            </>
                        )}
                    </>
                )

                }
                {
                    "comments" in date.record.nutriInfo && (
                        <>
                            Comentarios:{" "}
                            <span style={{ display: "block" }}>
                                {date.record.nutriInfo.comments}
                            </span>
                        </>
                    )
                }
                {"diet" in date.record &&
                    <>
                        {date.record.diet.length > 0 && (
                            <>
                                <Button type="primary" icon={<EyeFilled />} onClick={() => setOpenDietModal(true)}>Ver dieta</Button>
                                <Modal
                                    open={openDietModal}
                                    onCancel={() => setOpenDietModal(false)}
                                    title={<ModalHeader title={"Dieta de: " + firstname + " " + lastname} inSubmodal={true} />}
                                    footer={null}
                                >
                                    {date.record.diet.map((dietItem: any) =>
                                        <Card style={{ marginBottom: 12 }} >
                                            <span>{dietItem.description}</span>
                                        </Card>
                                    )}
                                </Modal>
                            </>
                        )}
                    </>
                }



                {"callUrl" in date && (
                    <div>
                        {date.callUrl !== "" && <Button
                            icon={<VideoCameraOutlined />}
                            type="primary"
                            href={date.callUrl}
                            target="_blank"
                        >
                            Ver videollamada guardada
                        </Button>}
                    </div>
                )}
            </div>
        </Card>
    )
}


const PsycoInfo = ({ date, onlyHour, hideDatetime }: any) => {
    return (
        <Card title="Información psicólogica"
            extra={<>
                {!hideDatetime && (
                    <>
                        <ClockCircleOutlined /> {" "} {onlyHour ? 'Hora:' : 'Fecha y Hora:'} {format(new Date(date.start), onlyHour ? 'h:mm a' : 'd MMMM, yyyy h:mm a', { locale: es })}
                    </>
                )}
            </>}>

            <div style={{ display: 'block', padding: 16 }}>

                <>
                    Comentarios:{" "}
                    <span style={{ display: "block" }}>
                        {date.record.psychologistInfo.comments}
                    </span>
                </>
                <span style={{ display: "block" }}>
                    Apto para cirugía:{" "}
                    {date.record.psychologistInfo.isAllowed ? "Sí" : "No"}
                </span>

                {"callUrl" in date && (
                    <div>
                        {date.callUrl !== "" && <Button
                            icon={<VideoCameraOutlined />}
                            type="primary"
                            href={date.callUrl}
                            target="_blank"
                        >
                            Ver videollamada guardada
                        </Button>}
                    </div>
                )}
            </div>
        </Card>
    )
}


const EmptyDate = ({ date, onlyHour, hideDatetime }: any) => {
    console.log('date', date)
    const isFutureAppointment = isAfter(new Date(date.start), new Date());

    return (
        
        <Card 
        title={
            isFutureAppointment
              ? `Aún no es hora para la ${date.tipoAgenda === 'Cirugía' ? 'cirugía' : 'cita'}`
              : `No asistió a la ${date.tipoAgenda === 'Cita General' ? 'cita' : 'cirugía'}`
          }
            extra={<>
                {!hideDatetime && (
                    <>
                        <ClockCircleOutlined /> {" "} {onlyHour ? 'Hora:' : 'Fecha y Hora:'} {format(new Date(date.start), onlyHour ? 'h:mm a' : 'd MMMM, yyyy h:mm a', { locale: es })}
                    </>
                )}
            </>}>

            <></>
        </Card>
    )
}


export const IndividualDate = ({ date, patient, onlyHour, hideDatetime }: any) => {
    console.log('date', date)
    const { firstname, lastname } = patient

    return (
        <div>
            <>
                {"record" in date ? (
                    <Row style={{ marginBottom: 12 }}>
                        {date.record !== null  && "medicalInfo" in date.record && (
                            <Col span={24}>
                                <MedicalInfo date={date} firstname={firstname} lastname={lastname} onlyHour={onlyHour} hideDatetime={hideDatetime} />
                            </Col>
                        )}
                        {date.record !== null && !("medicalInfo" in date.record) &&  "nutriInfo" in date.record &&
                            "backMeasurement" in date.record.nutriInfo && (
                                <Col span={24}>
                                    <NutriInfo date={date} firstname={firstname} lastname={lastname} onlyHour={onlyHour} hideDatetime={hideDatetime} />
                                </Col>
                            )}
                        {date.record !== null && "psychologistInfo" in date.record &&
                            "comments" in date.record.psychologistInfo && (
                                <Col span={24}>
                                    <PsycoInfo date={date} onlyHour={onlyHour} hideDatetime={hideDatetime} />
                                </Col>
                            )}
                    </Row>
                ) : (
                    <EmptyDate date={date} onlyHour={onlyHour} hideDatetime={hideDatetime} />
                )}

            </>

        </div>
    )
}


const LastDate = ({ date, patient, onlyHour = false, hideDatetime = false }: any) => {
    console.log('date', date)
    console.log('length', date.length)
    return (
        <div style={{ width: '100%' }}>
            {date.length === 1 && <IndividualDate date={date[0]} patient={patient} onlyHour={onlyHour} hideDatetime={hideDatetime} />}
            {date.length > 1 && date.map((dateItem: any) =>
                <IndividualDate date={dateItem} patient={patient} onlyHour={onlyHour} hideDatetime={hideDatetime} />)}
        </div>
    )
}

export default LastDate

