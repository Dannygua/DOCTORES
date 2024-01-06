import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState, useEffect, useContext } from "react";
import LineChart from "./LineChart";
import moment from "moment";
import { Button, notification, message, Row, Col, Typography, Badge } from 'antd';
import { postData } from "../../services/common/postData";
import ModalHeader from "../ModalHeader";
import { AuthContext } from "../../context/AuthContext";

export const Data = [
    {
        id: 1,
        year: 2016,
        userGain: 80000,
        userLost: 823
    },
    {
        id: 2,
        year: 2017,
        userGain: 45677,
        userLost: 345
    },
    {
        id: 3,
        year: 2018,
        userGain: 78888,
        userLost: 555
    },
    {
        id: 4,
        year: 2019,
        userGain: 90000,
        userLost: 4555
    },
    {
        id: 5,
        year: 2020,
        userGain: 4300,
        userLost: 234
    }
];

Chart.register(CategoryScale);

export default function Report({ selectedPatient }: any) {

    const [api, contextHolder] = notification.useNotification();
    const [showAlert, setShowAlert] = useState(false)
    const [showAlertPerdidaPeso, setShowAlertPerdidaPeso] = useState(false)
    const [sending, setSending] = useState(false)
    const [chartData, setChartData] = useState({});


    useEffect(() => {
        const uoDates = selectedPatient.dates.filter((date: any) => {
            if ('record' in date) {
                if ('medicalInfo' in date.record) {
                    return date
                }
            }
        })

        const comparareDates = (a: any, b: any) => {
            return a.start.localeCompare(b.start);
        };

        if (uoDates.length === 0) {
            // No hay datos disponibles
            setChartData({});
            return;
        }

        const dates = uoDates.sort(comparareDates);

        const cleanData = dates.map((date: any, index: any) => {
            return {
                id: index,
                date: moment(date.start).format('DD/MM/YYYY'),
                lost: date.record.medicalInfo.weight
            }
        })


        const checkExpectedLost = (dayA: any, dayB: any) => {
            const a = moment(dayA)
            const b = moment(dayB)
            return (a.diff(b, 'days') * 3) / 30
        }

        const generateGoalData = () => {
            let response = []
            for (let i = 0; i < dates.length; i++) {
                response.push({
                    id: i,
                    date: moment(dates[i].start).format('DD/MM/YYYY'),
                    lost: dates[0].record.medicalInfo.weight + checkExpectedLost(dates[0].start, dates[i].start)
                })
            }
            return response
        }

        const genColor = () => {
            if (cleanData[cleanData.length - 1]) {
                const lastWeight = cleanData[cleanData.length - 1].lost
                const goalData = generateGoalData()
                const lastExpectedWeight = goalData[goalData.length - 1].lost

                const minExpected = lastExpectedWeight - 5
                const maxExpected = lastExpectedWeight + 5

                if (lastWeight > maxExpected || lastWeight < minExpected) {
                    return "#ff0000"
                }
                return "#FFFF33"
            }
        }


        setChartData({
            labels: cleanData.map((data: any) => data.date),
            datasets: [
                {
                    label: "Límite máximo",
                    data: generateGoalData().map((data: any) => data.lost + 5),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                        "#ecf0f1",
                        "#50AF95",
                        "#f3ba2f",
                        "#2a71d0"
                    ],
                    borderColor: "#87888a",
                    borderWidth: 2
                },
                {
                    label: "Límite mínimo",
                    data: generateGoalData().map((data: any) => data.lost - 5),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                        "#ecf0f1",
                        "#50AF95",
                        "#f3ba2f",
                        "#2a71d0"
                    ],
                    borderColor: "#87888a",
                    borderWidth: 2
                },
                {
                    label: "Peso ",
                    data: cleanData.map((data: any) => data.lost),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                        "#ecf0f1",
                        "#50AF95",
                        "#f3ba2f",
                        "#2a71d0"
                    ],
                    borderColor: genColor(),
                    borderWidth: 2
                },
                {
                    label: "Peso esperado ",
                    data: generateGoalData().map((data: any) => data.lost),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                        "#ecf0f1",
                        "#50AF95",
                        "#f3ba2f",
                        "#2a71d0"
                    ],
                    borderColor: "#66FF99",
                    borderWidth: 2
                }
            ]
        })


        const checkLost = () => {
            if (cleanData[cleanData.length - 1]) {
                const lastWeight = cleanData[cleanData.length - 1].lost
                const goalData = generateGoalData()
                const lastExpectedWeight = goalData[goalData.length - 1].lost

                const minExpected = lastExpectedWeight - 5
                const maxExpected = lastExpectedWeight + 5
                if (lastWeight > maxExpected || lastWeight < minExpected) {
                    setShowAlert(true)
                    api.warning({
                        message: 'Advertencia de peso',
                        description: 'Hemos detectado una anomalía en la pérdida de peso, por favor agenda una cita lo más pronto posible',
                        duration: 0
                    });
                }
            }
        }

        checkLost()

        const checkWeightTrend = () => {
            console.log(cleanData);
            if (cleanData.length >= 2) {
                const currentWeightData = cleanData[cleanData.length - 1];
                const previousWeightData = cleanData[cleanData.length - 2];
            
                const currentWeight = currentWeightData.lost;
                const previousWeight = previousWeightData.lost;
                const weightDifference = previousWeight - currentWeight;
                const weightLossThreshold = 0;
            
                if (weightDifference >= weightLossThreshold) {
                    const projectedWeightLoss = weightDifference;
            
                    // Calcular la pérdida total hasta ahora
                    const totalWeightLoss = cleanData[0].lost - currentWeight 
            
                    setShowAlertPerdidaPeso(true);
            
                    api.info({
                    message: 'Advertencia de peso',
                    description: `El ${currentWeightData.date}, usted ha perdido ${weightDifference.toFixed(2)} kg. Hasta ahora, ha perdido un total de ${totalWeightLoss.toFixed(2)} kg. Si continúa así, podría perder aproximadamente ${projectedWeightLoss.toFixed(2)} kg en el próximo mes.`,
                    duration: 0,
                    });
                }
            }
        };
          
        
          

        checkWeightTrend()

    }, [selectedPatient])


    const sendEmail = async () => {
        setSending(true)
        const request = await postData('api/users/sendWarning', { email: selectedPatient.email, 
            code: process.env.REACT_APP_SG_API_KEY })
        if (request.status) {
            message.success("Correo de advertencia enviado exitosamente!")
            setSending(false)
            return;
        }
        message.error("Algo salió mal")
        setSending(false)
    }

    const { user }: any = useContext(AuthContext)

    return (
        <div className="App">
            {contextHolder}
            {'labels' in chartData && (
                <>
                    <LineChart chartData={chartData} />
                    <Row justify="center" style={{ marginTop: 18 }} >
                        <Col>
                            <Badge color="#87888a" text="Límite mínimo" />
                            <Badge color="yellow" text="Peso alcanzado" style={{ marginLeft: 32 }} />
                            <Badge color="green" text="Peso esperado" style={{ marginLeft: 32 }} />
                            <Badge color="#87888a" text="Límite máximo" style={{ marginLeft: 32 }} />
                        </Col>
                    </Row>
                    {(showAlert && !user.isPatient) &&
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <Button type="primary" loading={sending} onClick={sendEmail}>Enviar correo de advertencia</Button>
                        </div>
                    }
                    {(showAlertPerdidaPeso && !user.isPatient) &&
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <span style={{marginTop: "1rem"}}>Observamos una tendencia a la pérdida de peso. Si continúa así, podría perder más peso en las próximas semanas.</span>
                        </div>
                    }
                </>
            )}
            {!('labels' in chartData) && (
                <Typography.Title>Todavía no hay datos disponibles</Typography.Title>
            )}
        </div>
    );
}