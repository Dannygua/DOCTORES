import { Scheduler } from "@aldabil/react-scheduler";
import {
    EventActions,
    ProcessedEvent,
    ViewEvent
} from "@aldabil/react-scheduler/types";
import { useContext, useEffect, useState } from "react";
import { getData } from "../../../services/common/getData";
import { AuthContext } from "../../../context/AuthContext";
import { Spin, message } from "antd";

import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { postData } from "../../../services/common/postData";
import { putData } from "../../../services/common/putData";
import moment from "moment";
import { moreThanHour, outHour } from "../../../utils/calendar";
import { deleteData } from "../../../services/deleteData";
import { launchNotif } from "../../../utils/notifications";
import { createClient } from "@supabase/supabase-js";


const PatientCalendar = () => {
    const { user }: any = useContext(AuthContext);

    const [events, setEvents] = useState([])
    const [loadingEvents, setLoadingEvents] = useState(false)

    const [loadingSpecialists, setLoadingSpecialists] = useState(false);
    const [specialists, setSpecialists]: any = useState([])

    const [selectedSpecialist, setSelectedSpecialist] = useState('')


    const disabledToUser = (userId: any, date: any) => {
        let validate = userId !== date.idpatient
        return validate;
    }

    const getEvents = async () => {
        setLoadingEvents(true)
        const specialistId = selectedSpecialist === "" ? specialists[0].id : selectedSpecialist
        const request = await getData('api/dates/byEspecialist/' + specialistId)
        let specialistEvents = []
        if (request.status) {
            specialistEvents = request.data.map((date: any) => {
                return {
                    event_id: date._id,
                    title: date.title || "Cita agendada",
                    start: new Date(new Date(date.start)),
                    end: new Date(new Date(date.end)),
                    disabled: disabledToUser(user._id, date),
                    idPatient: date.idpatient
                }
            })
        }
        
        const requestPatientEvents = await getData('api/dates/byPatient/' + user._id)
        if (requestPatientEvents.status) {
            const patientEvents = requestPatientEvents.data.map((date: any) => {
                try {
                    return {
                        event_id: date._id,
                        title: date.title || "Cita agendada",
                        start: new Date(new Date(date.start)),
                        end: new Date(new Date(date.end)),
                        idPatient: date.idpatient
                    }
                } catch (error) {
                    return {
                        event_id: date._id,
                        title: date.title || "Cita agendada",
                        start: new Date(),
                        end: new Date(),
                        idPatient: date.idpatient
                    }
                }
            })
            const mergedEvents = specialistEvents.concat(patientEvents)
            setEvents(mergedEvents);
            setLoadingEvents(false);
        }
    }

    const getSpecialists = async () => {
        setLoadingSpecialists(true)
        const request = await getData('api/users/specialists')
        if (request.status) {
            const cleanData = request.data.map((specialist: any) => {
                return {
                    id: specialist._id,
                    text: specialist.firstname + " " + specialist.lastname,
                    value: specialist._id
                }
            })
            setSpecialists(cleanData);
            setSelectedSpecialist(cleanData[0].id);
            setLoadingSpecialists(false);
        }
    }


    useEffect(() => {
        getSpecialists();
    }, [])

    useEffect(() => {
        getEvents()
    }, [selectedSpecialist])

    useEffect(() => {
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
                async (payload) => {
                    console.log('PAYLOAD--', payload);
                    getSpecialists();
                    getEvents();
                }
            )
            .subscribe();
        // END LISTEN CHANGES FOR IN-APP NOTIF
    }, [])


    const handleConfirm = async (
        event: ProcessedEvent,
        action: EventActions
    ): Promise<ProcessedEvent> => {
        return new Promise(async (res, rej) => {
            if (action === "edit") {

                if (moreThanHour(event)) {
                    alert('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
                    rej('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
                } else {
                    if (checkAppointmentOverlap(event)) {
                        alert('La nueva cita se superpone con una cita existente. Por favor, elige otro horario.');
                        rej('La nueva cita se superpone con una cita existente. Por favor, elige otro horario.');
                    } else {
                        const check = moment(event.start).isBefore(moment())
                        if (check) {
                            alert("No puedes agendar una cita en el pasado!")
                            rej("No puedes agendar una cita en el pasado!");
                        } else {
                            let fullEvent = {
                                ...event,
                                idpatient: user._id,
                                idespecialist: event.idSpecialist,
                                code: process.env.REACT_APP_SG_API_KEY
                            }
                            const request = await putData('api/dates/' + event.event_id, fullEvent)
                            if (request.status) {
                                message.success("Cita actualizada exitosamente!")
                                launchNotif(undefined, false)
                                res({
                                    ...event,
                                    event_id: event.event_id || Math.random()
                                });
                            }

                        }
                    }
                }


            } else if (action === "create") {

                if (moreThanHour(event)) {
                    alert('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
                    rej('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
                } else {
                    if (checkAppointmentOverlap(event)) {
                        alert('La nueva cita se superpone con una cita existente. Por favor, elige otro horario.');
                        rej('La nueva cita se superpone con una cita existente. Por favor, elige otro horario.');
                    } else {
                        const check = moment(event.start).isBefore(moment())
                        if (check) {
                            alert("No puedes agendar una cita en el pasado!")
                            rej("No puedes agendar una cita en el pasado!");
                        } else {
                            let fullEvent = {
                                ...event,
                                event_id: event.event_id || Math.random(),
                                idpatient: user._id,
                                idespecialist: event.idSpecialist,
                                code: process.env.REACT_APP_SG_API_KEY
                            }
                            const request = await postData('api/dates', fullEvent);
                            if (request.status) {
                                message.success("Cita agendada exitosamente!")
                                launchNotif(undefined, false)
                                res({
                                    ...event,
                                    event_id: event.event_id || Math.random()
                                });
                            }
                        }
                    }
                }
            }
        });
    };


    const handleEventDrop = async (droppedOn: Date, updatedEvent: ProcessedEvent, originalEvent: ProcessedEvent): Promise<ProcessedEvent> => {
        return new Promise(async (res, rej) => {
            if (moreThanHour(updatedEvent)) {
                alert('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
                rej('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
            } else {
                if (checkAppointmentOverlap(updatedEvent)) {
                    alert('La nueva cita se superpone con una cita existente. Por favor, elige otro horario.');
                    rej('La nueva cita se superpone con una cita existente. Por favor, elige otro horario.');
                } else {
                    let fullEvent = {
                        ...updatedEvent,
                        idpatient: user._id,
                        idespecialist: updatedEvent.idSpecialist,
                        code: process.env.REACT_APP_SG_API_KEY
                    }
                    const request = await putData('api/dates/' + originalEvent.event_id, fullEvent)
                    if (request.status) {
                        message.success("Cita actualizada exitosamente!")
                        launchNotif(undefined, false)
                        res({
                            ...updatedEvent,
                            event_id: updatedEvent.event_id || Math.random()
                        });
                    }
                }
            }

        })
    }

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedSpecialist(event.target.value as string);
    };


    const checkAppointmentOverlap = (event: ProcessedEvent): any => {
        // Verificar si la nueva cita se superpone con alguna cita existente
        return events.some((ev: any) => {
            const newStart = event.start.getTime();
            const newEnd = event.end.getTime();
            const existingStart = ev.start.getTime();
            const existingEnd = ev.end.getTime();


            if (ev.event_id === event.event_id) {
                return false
            }

            // Comprobar si la nueva cita se superpone con la cita existente
            if ((newStart >= existingStart && newStart < existingEnd) || (newEnd > existingStart && newEnd <= existingEnd)) {
                return true; // Se superpone
            }
            return false; // No se superpone
        });
    };


    const handleDelete = async (deletedId: string): Promise<string> => {
        // Simulate http request: return the deleted id
        return new Promise(async (res, rej) => {
            const event: any = events.filter((ev: any) => ev.event_id === deletedId)
            if (event.length > 0) {
                const check = moment(event[0].start).isBefore(moment())
                if (check) {
                    alert("No puedes eliminar una cita pasada!")
                    rej("No puedes eliminar una cita pasada!");
                }

                const request = await deleteData('api/dates/' + event[0].event_id)
                if (request.status) {
                    message.success("Cita eliminada exitosamente!")
                    const copyData = [...events]
                    console.log('deletedId', deletedId)
                    const filteredEvents = copyData.filter((ev: any) => ev.event_id !== deletedId)
                    console.log('fe', filteredEvents)
                    setEvents(filteredEvents)
                    res(deletedId);
                }
            }
        });
    };

    return (
        <div>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Especialista</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedSpecialist}
                        label="Especialista"
                        onChange={handleChange}
                    >
                        {specialists.map((sp: any) =>
                            <MenuItem value={sp.id}>{sp.text}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>
            {
                (loadingSpecialists || loadingEvents) ? <Spin /> : (
                    <Scheduler
                        view="week"
                        events={events}
                        onConfirm={handleConfirm}
                        onEventDrop={handleEventDrop}
                        onDelete={handleDelete}
                        fields={
                            [
                                {
                                    name: "idSpecialist",
                                    type: "select",
                                    // Should provide options with type:"select"
                                    options: specialists,
                                    config: { label: "Especialista", required: true, errMsg: "Por favor seleccione un especialista" }
                                }
                            ]
                        }

                        eventRenderer={(event: any) => {
                            if (event.event.idPatient !== user._id) {
                                return (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            height: "100%",
                                            backgroundColor: 'silver'
                                        }}
                                    >
                                        { }
                                    </div>
                                );
                            }
                            return null;
                        }}

                    />
                )
            }
        </div>
    )
}

export default PatientCalendar; 