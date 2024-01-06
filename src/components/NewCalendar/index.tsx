import { Button, Card, Col, DatePicker, DatePickerProps, Popconfirm, Radio, RadioChangeEvent, Row, Select, Space, Spin, Tag, Typography, message } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { getData } from '../../services/common/getData'
import moment from 'moment';
import { AuthContext } from '../../context/AuthContext';
import { CalendarFilled } from '@ant-design/icons';
import { postData } from '../../services/common/postData';
import { launchNotif } from '../../utils/notifications';
import { createClient } from '@supabase/supabase-js';
import { CancelOutlined } from '@mui/icons-material';
import DateCard from './DateCard';
import { putData } from '../../services/common/putData';
import { deleteData } from '../../services/deleteData';

const { Option } = Select

function generarHorasDelDia(fechaEspecifica: any) {
    const horasDelDia = [];
    const zonaHoraria = 'America/Guayaquil'; // Cambia esto a la zona horaria deseada
    const horaAnt = new Date(fechaEspecifica);

    // seconds * minutes * hours * milliseconds = 1 day 
    const aDay = 60 * 60 * 24 * 1000;

    const hora = new Date(horaAnt.getTime() + aDay);
    console.log('fecha especifica', hora)

    // Configurar la zona horaria para la fecha
    hora.toLocaleString('en-US', { timeZone: zonaHoraria });
    hora.setHours(9, 0, 0, 0); // Iniciar desde las 08:00:00 en la zona horaria especificada

    while (hora.getHours() < 18) { // Generar hasta las 17:00:00
        horasDelDia.push(new Date(hora)); // Clonar la fecha actual
        hora.setHours(hora.getHours() + 1); // Avanzar una hora
    }

    return horasDelDia;
}


function obtenerHorasDisponibles(citas: any, dia: any) {
    try {
        console.log('voy...')
        const horasDelDia = generarHorasDelDia(dia);

        for (const cita of citas) {
            const inicioCita = new Date(cita.start);
            const finCita = new Date(cita.end);

            for (let i = 0; i < horasDelDia.length; i++) {

                console.log('hora', horasDelDia[i])
                console.log('inicio', inicioCita)

                console.log('r1', horasDelDia[i] >= inicioCita)

                console.log('hora', horasDelDia[i])
                console.log('find', finCita)

                console.log('r2', horasDelDia[i] < finCita)

                if (horasDelDia[i] >= inicioCita && horasDelDia[i] < finCita) {
                    horasDelDia.splice(i, 1); // Eliminar la hora ocupada
                    i--; // Ajustar el índice después de eliminar
                } else {
                    console.log('no entro')
                }
            }
        }

        return horasDelDia;
    } catch (error) {
        console.log('error', error)
    }

}


// Función para verificar si el paciente está parado en el mismo día de la cita
function pacienteEstaEnElMismoDia(cita: any, selectedDate: any) {

    if (selectedDate === "") {
        console.log('SELECTED DATE IS EMPTY')
    }
    console.log('sd', selectedDate)
    console.log('cita', cita.start)

    // No es necesario formatear antes de comparar
    const fechaCita = moment(cita.start);
    const fechaActual = moment(selectedDate);

    console.log('fecha cita', fechaCita.format('YYYY-MM-DD'));
    console.log('fecha actual', fechaActual);

    // Comparar directamente las fechas
    return fechaCita.isSame(fechaActual, 'day');


}



// Función principal para procesar las citas
function procesarCita(cita: any, currentPatientId: any, selectedDay: any) {
    console.log('PROCESAR CITA', selectedDay)
    const idPacienteAutenticado = currentPatientId; // Reemplazar con el ID del paciente autenticado
    console.log('pacienteEstaEnElMismoDia(cita, selectedDate)', pacienteEstaEnElMismoDia(cita, selectedDay))
    if (pacienteEstaEnElMismoDia(cita, selectedDay)) {
        if (cita.idpatient._id === idPacienteAutenticado) {
            console.log("Cita del paciente autenticado para hoy. Agregando al listado.");
            // Agregar lógica para agregar la cita al listado de citas del paciente
            return {ACTION : 'ADD'}
        } else {
            console.log("Cita no es del paciente autenticado para hoy. Retirando disponibilidad.");
            // Agregar lógica para retirar la disponibilidad de horarios para esta cita
            return {ACTION: 'REMOVE'} 
        }
    }
    return {ACTION: 'NOTHING'}
    // En caso de que el paciente no esté parado en el mismo día de la cita, no hacer nada

}



const NewCalendar = () => {

    const { user }: any = useContext(AuthContext)

    const [specialists, setSpecialists] = useState([])

    const [selectedSpecialist, setSelectedSpecialist] = useState('')

    const [ðatesByPatient, setDatesByPatient] = useState([])

    const [availableDates, setAvailableDates] = useState<any>([])

    const [selectedDate, setSelectedDate] = useState('')


    const [day, setDay] = useState('')

    const [loading, setLoading] = useState(false)

    const [datesInDay, setDatesInDay] = useState<any>([])

    const [showAllSpecialists, setShowAllSpecialists] = useState(false)

    const getSpecialists = async () => {
        const requestSpecialists = await getData('api/users/specialists')
        if (requestSpecialists.status) {
            setSpecialists(requestSpecialists.data)
        }
    }

    const getDatesByPatient = async () => {
        setDatesInDay([])
        let url = "api/dates/byPatient"
        const requestDatesByPatient = await getData(url + "/" + user._id + "/?fp=" + true)
        if (requestDatesByPatient.status) {

            if (day !== "") {
                // Obtiene la fecha actual
                const fechaSeleccionada = new Date(day);

                console.log('fs', fechaSeleccionada)

                const increaseDay = 60 * 60 * 24 * 1000;

                const diaCorrecto = new Date(fechaSeleccionada.getTime() + increaseDay);


                // Filtra las citas del paciente en la fecha seleccionada
                const existDates = requestDatesByPatient.data.filter((cita: any) => {
                    const citaFecha = new Date(cita.start);
                    return (
                        citaFecha.getDate() === diaCorrecto.getDate() &&
                        citaFecha.getMonth() === diaCorrecto.getMonth() &&
                        citaFecha.getFullYear() === diaCorrecto.getFullYear()
                    );
                });

                console.log('ed', existDates)


                if (existDates.length > 0) {
                    const fechaActual = moment();

                    const activeDates = existDates.filter((d: any) => moment(d.start).isAfter(fechaActual))
                    if (activeDates.length > 0) {
                        setDatesInDay(activeDates)
                    }
                }
            }


            console.log('')
            const hadDateWithDoctor = requestDatesByPatient.data.map((date: any) => {
                if (date.idespecialist.isDoctor) {
                    console.log('cita con doctor')
                    if ('record' in date) {
                        console.log('cita con record')
                        if ('medicalInfo' in date.record) {
                            console.log('cita con medical info')
                            return true
                        }
                        return false
                    }
                    return false
                }
                return false
            })

            if (hadDateWithDoctor.includes(true)) {
                setShowAllSpecialists(true)
            }
        }
    }

    useEffect(() => {
        getSpecialists()
        getDatesByPatient()
    }, [])


    useEffect(() => {
        console.log('here we go', selectedSpecialist)
        console.log('day', day)
        if (selectedSpecialist !== "" && day !== "") {
            getDatesBySpecialist()
            getDatesByPatient()
        }
    }, [selectedSpecialist, day])

    const afterListen = () => {
        console.log('day in listen', day)
        console.log('ad in listen', availableDates)
    }

    useEffect(() => {
        try {
            // LISTEN CHANGES FOR IN-APP NOTIF
            const client = createClient(
                'https://oqcxpijzaddmvyzlslam.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xY3hwaWp6YWRkbXZ5emxzbGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ0MDMyMDgsImV4cCI6MjAwOTk3OTIwOH0.AwrfE3NvI5pA46ThsDQ0BN7atamyPQmm_Kk8P7Usl48'
            );
            const channel = client.channel('room-1');
            channel
                .on(
                    'broadcast',
                    { event: 'test' },
                    async (payload: any) => {
                        console.log('DAY', localStorage.getItem('sDay'))
                        console.log('PAYLOAD--', payload);
                        console.log('DATA', payload.payload.message.data)
                        const cita = payload.payload.message.data
                        const currentPatientId = user._id
                        
                        const resultProcess = procesarCita(cita, currentPatientId, localStorage.getItem('sDay'))
                        if(resultProcess.ACTION==="ADD"){
                            console.log('EMpezando a agregar...')
                            setDatesInDay((prevState: any) => [...prevState, payload.payload.message.data])
                            
                            console.log('Ahora vamos a filtrar...', availableDates)
                            
                            const filtered = availableDates.filter((ad: any) => ad.value !== moment(cita.start).format('YYYY-MM-DD HH:mm:ss'))
                            console.log('filtered', filtered)
                            
                            setAvailableDates(filtered)
                            localStorage.setItem('sDay', '')
                        }

                        //
                        //VERIFICAR QUE EL PACIENTE ESTE PARADO EN EL MISMO DÍA DE LA CITA 


                        //SI LO ESTA SE VERIFICA QUE LA CITA SEA DE ESE PACIENTE, PARA AGREGARLA AL LISTADO DE LAS CITAS YA AGENDADAS ESE DIA



                        //EN CASO DE QUE LA CITA NO SEA DE ESE PACIENTE, SE RETIRA DE LA DISPONIBILIDAD DE HORARIOS EN ESE DIA


                        //EN CASO DE QUE EL PACIENTE NO ESTE PARADO EN EL MISMO DIA DE LA CITA NO SE HACE NADA...

                        /*
                        getSpecialists();
                        getDatesBySpecialist();
                        getDatesByPatient();
                        */
                    }
                )
                .subscribe();
            // END LISTEN CHANGES FOR IN-APP NOTIF
        } catch (error) {
            console.log('e', error)
            //getSpecialists()
            //getDatesBySpecialist()
            //getDatesByPatient();
        }
    }, [])


    const getDatesBySpecialist = async () => {
        if (selectedSpecialist !== '') {
            setLoading(true)

            const specialistId = JSON.parse(selectedSpecialist)._id
            const requestGetDatesBySpecialist = await getData('api/dates/byEspecialist/' + specialistId)
            if (requestGetDatesBySpecialist.status) {


                // setDatesBySpecialist(requestGetDatesBySpecialist.data)
                const horasDisp = obtenerHorasDisponibles(requestGetDatesBySpecialist.data, day)
                console.log('horasDisp', horasDisp)



                if (Array.isArray(horasDisp)) {
                    const ad = horasDisp.map((hd: any) => {

                        // Crea un objeto Date para la hora actual
                        const horaActual = new Date();

                        // Crea un objeto Date para la hora que deseas verificar
                        const horaDeseada = new Date(hd);

                        //Se verifica que no sea una hora en el pasado
                        if (!(horaDeseada < horaActual)) {
                            return {
                                label: moment(hd).format('HH:mm'),
                                value: moment(hd).format('YYYY-MM-DD HH:mm:ss')
                            }
                        }
                    })
                    console.log('ad', ad)
                    const validDates = ad.filter((ad: any) => typeof (ad) !== "undefined")
                    console.log('valid', validDates)
                    setAvailableDates(validDates)
                    setLoading(false)
                }
            }
        }
    }


    const handleSelectSpecialist = (value: any) => {
        setSelectedSpecialist(value)
    }


    const handleSelectDay: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setDay(dateString)
    };

    const handleSelectDate = ({ target: { value } }: RadioChangeEvent) => {
        console.log('radio3 checked', value);
        setSelectedDate(value)
    };


    const handleSubmit = async () => {
        console.log('selectedDate', selectedDate)
        const start = new Date(selectedDate)

        // Copiar la hora seleccionada a otra variable
        const horaAumentada = new Date(start)
        // Aumentar una hora en la copia
        horaAumentada.setHours(horaAumentada.getHours() + 1);
        let fullEvent = {
            idpatient: user._id,
            idespecialist: JSON.parse(selectedSpecialist)._id,
            start: start.toISOString(),
            end: horaAumentada.toISOString(),
            code: process.env.REACT_APP_SG_API_KEY
        }
        const request = await postData('api/dates', fullEvent);
        console.log('r', request);
        if (request.status) {
            message.success("Cita agendada exitosamente!")
            console.log('selected DAY', day)
            localStorage.setItem('sDay', day)
            setSelectedDate('')
            // getDatesBySpecialist()
            // getDatesByPatient()
            launchNotif(undefined, false, request) //se hace asi para qeu supabase sepa que tiene que actualizar 
            return;
        }

        if (!request.status) {
            if (request.msg === "Ya existe una cita en ese horario!") {
                message.error(request.msg)
                setSelectedDate('')
                getDatesBySpecialist()
                getDatesByPatient()
                return;
            }
        }
    }


    function disabledDate(current: any) {
        // Obtén la fecha actual
        const today = new Date();

        // Comprueba si el día es un sábado o un domingo
        const isWeekend = current.day() === 6 || current.day() === 0;

        // Comprueba si la fecha es pasada al día actual
        const isPast = current.isBefore(today, 'day');

        // Devuelve true para deshabilitar el día si es fin de semana o está en el pasado
        return isWeekend || isPast;
    }


    const handleCancelDate = async (dateId: any) => {
        setLoading(true)
        setDatesInDay([])
        const request = await postData('api/dates/delete/' + dateId, {
            code: process.env.REACT_APP_SG_API_KEY
        })
        if (request.status) {
            message.success("Cita cancelada exitosamente")
            //getDatesByPatient()
            //getDatesBySpecialist()
            launchNotif(undefined, false) //se hace asi para qeu supabase sepa que tiene que actualizar 
            setLoading(false)
            return;
        }

        setLoading(false)
        message.error("Algo salió mal cancelando la cita")
    }

    return (
        <div>
            <Row>
                <Col span={11}>
                    <Space direction="vertical">
                        {specialists && specialists.length > 0 && (
                            <Space>
                                <h4>Especialista: </h4>
                                <Select onChange={handleSelectSpecialist} placeholder="Selecciona un especialista" style={{ width: 225, marginTop: 8 }}>
                                    {showAllSpecialists ? (
                                        <>
                                            {specialists.map((specialist: any) =>
                                                <Option value={JSON.stringify(specialist)}>{specialist.firstname} {specialist.lastname} {" "}
                                                    <p style={{ display: 'inline' }}>
                                                        {specialist.isNutri && (
                                                            <Tag color="green">Nutriologo</Tag>
                                                        )}
                                                        {specialist.isPychologist && (
                                                            <Tag color="purple">Psicologo</Tag>
                                                        )}
                                                        {specialist.isDoctor && (
                                                            <Tag color="blue">Cirujano</Tag>
                                                        )}
                                                    </p>
                                                </Option>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {specialists.filter((specialist: any) => specialist.isDoctor).map((specialist: any) =>
                                                <Option value={JSON.stringify(specialist)}>{specialist.firstname} {specialist.lastname} {" "}
                                                    <p style={{ display: 'inline' }}>
                                                        {specialist.isNutri && (
                                                            <Tag color="green">Nutriologo</Tag>
                                                        )}
                                                        {specialist.isPychologist && (
                                                            <Tag color="purple">Psicologo</Tag>
                                                        )}
                                                        {specialist.isDoctor && (
                                                            <Tag color="blue">Cirujano</Tag>
                                                        )}
                                                    </p>
                                                </Option>
                                            )}
                                        </>
                                    )}
                                </Select>
                            </Space>

                        )}
                        <Space>
                            <h4>Fecha: </h4>
                            <DatePicker onChange={handleSelectDay} disabledDate={disabledDate} />
                        </Space>

                    </Space>
                </Col>
                <Col span={11} offset={1}>
                    {day !== "" && (
                        <>
                            {loading && <Spin />}
                            {datesInDay.length > 0 && (
                                <h3>Ya tienes una(s) cita agendada(s) en el día seleccionado</h3>

                            )}
                            {datesInDay.length > 0 && datesInDay.map((date: any) =>
                                <DateCard selectedDay={date.start} dateId={date._id} specialist={date.idespecialist} handleSubmit={handleCancelDate} />
                            )}
                            {!loading && availableDates && availableDates.length > 0 && (
                                <>
                                    <h4>Horas Disponibles</h4>
                                    <Radio.Group options={availableDates} optionType="button" onChange={handleSelectDate} />
                                </>
                            )}
                            {availableDates && availableDates.length === 0 && day !== "" && (
                                <h4>No existe disponibilidad en el día seleccionado</h4>
                            )}
                        </>
                    )}
                </Col>
            </Row>
            {
                selectedDate !== '' && (
                    <Card style={{ marginTop: 12 }}
                        title={<>
                            <div>Fecha seleccionada: {moment(selectedDate).format('YYYY-MM-DD')}</div>
                            <div>Hora seleccionada: {moment(selectedDate).format('HH:mm')}</div>
                        </>
                        }
                    >
                        <h4>Especialista: {JSON.parse(selectedSpecialist).firstname} {JSON.parse(selectedSpecialist).lastname}</h4>
                        <h4>Paciente: {user.firstname} {user.lastname}</h4>
                        <Popconfirm
                            title="Agendar  cita"
                            description="Está seguro que desea agendar cita en la fecha y horario seleccionado?"
                            onConfirm={handleSubmit}
                            okText="Sí"
                            cancelText="No"
                        >
                            <Button icon={<CalendarFilled />} type='primary'>Agendar</Button>
                        </Popconfirm>
                    </Card>
                )
            }

        </div >
    )
}

export default NewCalendar
