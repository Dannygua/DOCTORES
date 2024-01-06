import { Scheduler } from "@aldabil/react-scheduler";
import {EventActions, ViewEvent} from "@aldabil/react-scheduler/types";
import type {ProcessedEvent, SchedulerHelpers} from "@aldabil/react-scheduler/types";
import { useContext, useEffect, useState, useLayoutEffect, } from "react";
import { getData } from "../../../services/common/getData";
import { AuthContext } from "../../../context/AuthContext";
import { Modal, Spin, message } from "antd";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { postData } from "../../../services/common/postData";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { putData } from "../../../services/common/putData";
import moment from "moment";
import { moreThanHour, outHour } from "../../../utils/calendar";
import { deleteData } from "../../../services/deleteData";
import { launchNotif } from "../../../utils/notifications";
import { createClient } from "@supabase/supabase-js";
import { TextField, Button, DialogActions } from "@mui/material";
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';
import { scheduler } from "timers/promises";


const { confirm } = Modal;

interface Test {
    value: string;
}

//interface par el custom editor
interface CustomEditorProps {
    scheduler: SchedulerHelpers;
}

interface IPersonInCalendar {
    id: string,
    text: string,
    value: string
}

function clickOnCancel() {
    var botones = document.getElementsByTagName("button");
    for (var i = 0; i < botones.length; i++) {
        if (botones[i].textContent === "Cancel") {
            // Simular un evento de clic en el botón
            var domEvent = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window
            });
            botones[i].dispatchEvent(domEvent);
            break; // Salir del bucle una vez que se haya hecho clic en el botón
        }
    }
}

function verificarHoraEnRango(hora: any) {
    const horaInicio = new Date(hora);
    horaInicio.setHours(9, 0, 0); // Establecer la hora de inicio en 9:00 AM
    const horaFin = new Date(hora);
    horaFin.setHours(17, 0, 0); // Establecer la hora de finalización en 5:00 PM

    return hora >= horaInicio && hora <= horaFin;
}

const DoctorCalendar = () => {
    const { user }: any = useContext(AuthContext);

    const [events, setEvents] = useState([])
    const [loadingEvents, setLoadingEvents] = useState(false);

    const [specialists, setSpecialists]: any = useState([])
    const [loadingSpecialists, setLoadingSpecialists] = useState(false);
    const [selectedSpecialist, setSelectedSpecialist] = useState('')

    const [showoperationDescrip, setShowoperationDescrip] = useState<boolean>(true); // para cirguia descripcion

    const [patients, setPatients]: any = useState([])
    const [patientsOperation, setPatientsOperation]: any = useState([])

    const [loadingPatients, setLoadingPatients] = useState(false);

    
    const [tests, setTests] = useState([])

    const getIndicaciones = async () => {
        const requestInds = await getData("api/operationInd/?justActive=" + true)
        console.log(requestInds)
        if (requestInds.status) {
        const testToSelect = requestInds.data.map((test: any) => {
            return { value: test.name }
        })
        console.log(testToSelect)
        setTests(testToSelect)
        }
    }

    useLayoutEffect(() => {
        getIndicaciones()
      }, [])
    
    
    // esto se muestra los eventos en el calendario
    const getEvents = async () => {
        setLoadingEvents(true)
        const specialistId = selectedSpecialist === "" ? user._id : selectedSpecialist
        const request = await getData('api/dates/byEspecialist/' + specialistId + "/?fp=" + true)
        let datesToCalendar = []
        if (request.status) {
            console.log('request', request)
            datesToCalendar = request.data.map((date: any) => {
                try {
                    return {
                        event_id: date._id,
                        title: date.idpatient.firstname + " " + date.idpatient.lastname,
                        start: new Date(new Date(date.start)),
                        end: new Date(new Date(date.end)),
                        idPatient: date.idpatient._id,
                        tipoAgenda: date.tipoAgenda,
                        operationDescrip: date.operationDescrip,
                        operationObs: date.operationObs,
                        
                    }
                } catch (error) {
                    return {
                        event_id: date._id,
                        title: date.idpatient.firstname + " " + date.idpatient.lastname,
                        start: new Date(),
                        end: new Date(),
                        idPatient: date.idpatient._id
                    }
                }
            })
            setEvents(datesToCalendar);
            setLoadingEvents(false);
        }


    }

    //esto muestra los especialistas para el caledario en el select
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
            setSelectedSpecialist(user._id);
            setLoadingSpecialists(false);
        }
    }

    //esto obtiene los pacientes que se muestrana en el select del add event
    const getPatients = async () => {
        setLoadingPatients(true);
        const request = await getData('api/users/patients')
        console.log("request pacietnes", request)
        
        if (request.status) {
            const patientsToCalendar = request.data.map((patient: any) => {
                return {
                    id: patient._id,
                    text: patient.firstname + " " + patient.lastname,
                    value: patient._id
                }
            })
            console.log("pacientes", patientsToCalendar)
            setPatients(patientsToCalendar)
            setLoadingPatients(false)

            const patientsOperation = request.data.map((patient: any) => {
                const reversedDates = patient.dates.slice().reverse();
                const lastDate = reversedDates.find((date: any) => date && date.record && date.record.esAptoOperation);

                if (lastDate && lastDate.record.esAptoOperation === true) {
                    return {
                        id: patient._id,
                        text: `${patient.firstname} ${patient.lastname}`,
                        value: patient._id,
                        // esAptoOperation: true,
                    };
                } else {
                    return null; 
                }
            }).filter((patient: any) => patient !== null);

                    console.log("pacientes aptos para operación", patientsOperation);
                    setPatientsOperation(patientsOperation);


            


            
        }
    }

    useEffect(() => {
        getSpecialists()
        getPatients()
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
                (payload) => {
                    console.log('PAYLOAD--', payload);
                    getEvents();
                }
            )
            .subscribe();
        // END LISTEN CHANGES FOR IN-APP NOTIF
    }, [])

    //lo utiliza el select para el cambio de especialista
    const handleChangeSpecialist = (event: SelectChangeEvent) => {
        setSelectedSpecialist(event.target.value as string);
    };

    const handleConfirm = async (
        event: ProcessedEvent,
        action: EventActions,
    ): Promise<ProcessedEvent> => {
        return new Promise(async (res, rej) => {
            if (action === "edit") {
                /** PUT event to remote DB */
                console.log(event.start)
                if (!verificarHoraEnRango(event.start) || !verificarHoraEnRango(event.end)) {
                    alert('Sólo puede crear citas de 9am a 5pm');
                    rej('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
                } else {
                    // if (moreThanHour(event)) {
                    //     alert('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
                    //     rej('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
                    // } else {
                        if (checkAppointmentOverlap(event)) {
                            alert('La nueva cita se superpone con una cita existente. Por favor, elige otro horario.');
                            rej('La nueva cita se superpone con una cita existente. Por favor, elige otro horario.');
                        } else {
                            const check = moment(event.start).isBefore(moment())
                            if (check) {
                                // alert("No puedes agendar una cita en el pasado!")
                                message.error("No puedes agendar una cita en el pasado")
                                alert("No puedes agendar una cita en el pasado")
                                clickOnCancel()
                                rej("No puedes agendar una cita en el pasado!");
                            } else {
                                let fullEvent = {
                                    ...event,
                                    idpatient: event.idPatient,
                                    idespecialist: user._id,
                                    code: process.env.REACT_APP_SG_API_KEY,
                                    tipoAgenda: event.tipoAgenda,
                                    operationDescrip: event.operationDescrip,
                                    operationObs: event.operationObs
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
                    // }
                }

            } else if (action === "create") {
                /**POST event to remote DB */
                console.log(event.start)
                if (!verificarHoraEnRango(event.start) || !verificarHoraEnRango(event.end)) {
                    alert('Sólo puede crear citas de 9am a 5pm');
                    rej('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
                } else {
                    // if (moreThanHour(event)) {
                    //     alert('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
                    //     rej('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
                    // } else {
                        if (checkAppointmentOverlap(event)) {
                            alert('La nueva cita se superpone con una cita existente. Por favor, elige otro horario.');
                            rej('La nueva cita se superpone con una cita existente. Por favor, elige otro horario.');
                        } else {
                            const check = moment(event.start).isBefore(moment())
                            if (check) {
                                // alert("No puedes agendar una cita en el pasado!")
                                message.error("No puedes agendar una cita en el pasado")
                                clickOnCancel()
                                rej("No puedes agendar una cita en el pasado!");
                            } else {
                                let fullEvent = {
                                    ...event,
                                    event_id: event.event_id || Math.random(),
                                    idpatient: event.idPatient,
                                    idespecialist: user._id,
                                    code: process.env.REACT_APP_SG_API_KEY,
                                    tipoAgenda: event.tipoAgenda,
                                    operationDescrip: event.operationDescrip,
                                    operationObs: event.operationObs,
                                }
                                const request = await postData('api/dates', fullEvent);
                                console.log(fullEvent);
                                console.log('r', request);
                                if (request.status) {
                                    message.success("Cita agendada exitosamente!")
                                    launchNotif(undefined, false)
                                    res({
                                        ...event,
                                        event_id: event.event_id || Math.random()
                                    });
                                } else {
                                    if (request.msg === "Ya existe una cita en ese horario!") {
                                        message.error(request.msg)
                                    }
                                }
                            }
                        }

                    // }
                }
            }
        });
    };

    // verfica que no se sobreponga
    const handleEventDrop = async (droppedOn: Date, updatedEvent: ProcessedEvent, originalEvent: ProcessedEvent): Promise<ProcessedEvent> => {
        return new Promise(async (res, rej) => {
            // if (moreThanHour(updatedEvent)) {
            //     alert('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
            //     rej('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
            // } else {
                if (checkAppointmentOverlap(updatedEvent)) {
                    alert('La nueva cita se superpone con una cita existente. Por favor, elige otro horario.');
                    rej('La nueva cita se superpone con una cita existente. Por favor, elige otro horario.');
                } else {

                    const check = moment(updatedEvent.start).isBefore(moment())
                    console.log('check', check)
                    if (check) {
                        message.error("No puedes agendar una cita en el pasado")
                        rej("No puedes agendar una cita en el pasado!");
                    } else {
                        let fullEvent = {
                            ...updatedEvent,
                            idpatient: updatedEvent.idPatient,
                            idespecialist: user._id,
                            code: process.env.REACT_APP_SG_API_KEY,
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
            // }
        })
    }

    // verifica la eliminacion
    const handleDelete = async (deletedId: string): Promise<string> => {
        // Simulate http request: return the deleted id
        return new Promise(async (res, rej) => {
            const event: any = events.filter((ev: any) => ev.event_id === deletedId)
            if (event.length > 0) {
                const check = moment(event[0].start).isBefore(moment())
                console.log(check)
                // if (check) {
                //     message.error("No puedes eliminar una cita pasada!")
                //     rej("No puedes eliminar una cita pasada!");
                //     return;
                // } else {

                    const request = await postData('api/dates/delete/' + event[0].event_id, {
                        code: process.env.REACT_APP_SG_API_KEY
                    })
                    if (request.status) {
                        message.success("Cita eliminada exitosamente!")
                        const copyData = [...events]
                        console.log('deletedId', deletedId)
                        const filteredEvents = copyData.filter((ev: any) => ev.event_id !== deletedId)
                        console.log('fe', filteredEvents)
                        setEvents(filteredEvents)
                        res(deletedId);
                    }
                // }
            }

        });
    };
    
    // handleDelete("6579c8f95056b3e9218653dc")
    

    // Verificar si la nueva cita se superpone con alguna cita existente
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
    
    const optionsAgenda = [
        {   
            id: "ciru",
            text: "Cirugía",
            value: "Cirugía",  
        },
        { 
            id: "cita",
            text: "Cita General",
            value: "Cita General"
        }
    ]

    const CustomEditor = ({ scheduler }: CustomEditorProps) => {
        const event = scheduler.edited;
        const [isEditing, setIsEditing] = useState(!!event);
        const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

        const handleChangeSelect = (event: SelectChangeEvent<typeof selectedOptions>) => {
            const selectedValues = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
            setSelectedOptions(selectedValues);
        
            setState((prev) => ({
                ...prev,
                cirugiaDescription: selectedValues,
            }));
        };
        
        // setea un valor cambio dentro de la itneraccion del form652
        const handleChange = (value: string | string[], name: string) => {
            setState((prev) => {
                return {
                    ...prev,
                    [name]: value,
                };
            });
        };

        const inputStyle = {
            padding: "0.5rem",
            border: "1px solid #ddd",  
            borderRadius: "4px",       
            fontSize: "14px",          
            outline: "none",           
            transition: "border-color 0.2s ease-in-out", 
            marginRight: "0.5rem",
        };

        console.log(scheduler.state.start.value)

        const [state, setState] = useState({
            title: event?.title || "",
            description: event?.description || "",
            eventType: event?.tipoAgenda || "",
            cirugiaDescription: event?.operationDescrip ? event?.operationDescrip.split('\n') : [], 
            selectedPacienteId: event?.idPatient || null,
            start: event?.start ? new Date(event.start.getTime() - 5 * 60 * 60 * 1000).toISOString().slice(0, -8) : "", // Verifica si hay un valor en event.start
            end: event?.end ? new Date(event.end.getTime() - 5 * 60 * 60 * 1000).toISOString().slice(0, -8) : "", // Verifica si hay un valor en event.end
            operationObs: event?.operationObs || "",
        });
    
        console.log(state)
        const [error, setError] = useState("");
        
        
        useEffect(() => {
            if (!isEditing) {
                // Establecer automáticamente las fechas solo al crear un nuevo evento
                setState((prev) => ({
                    ...prev,
                    start: scheduler?.state?.start?.value ? new Date(scheduler.state.start.value.getTime() - 5 * 60 * 60 * 1000).toISOString().slice(0, -8) : "",
                    end: scheduler?.state?.end?.value ? new Date(scheduler.state.end.value.getTime() - 5 * 60 * 60 * 1000).toISOString().slice(0, -8) : "",
                }));
            } else if (event) {
                // Si estamos editando un evento, actualiza el estado con las fechas del evento existente
                setState((prev) => ({
                    ...prev,
                    start: event?.start ? new Date(event.start.getTime() - 5 * 60 * 60 * 1000).toISOString().slice(0, -8) : "",
                    end: event?.end ? new Date(event.end.getTime() - 5 * 60 * 60 * 1000).toISOString().slice(0, -8) : "",
                }));
                // Inicializar cirugiaDescription con las opciones del evento existente
                if (event.tipoAgenda === "Cirugía") {
                    setState((prev) => ({
                        ...prev,
                        cirugiaDescription: event.operationDescrip ? event.operationDescrip.split('\n') : [],
                    }));
                }
            }
        }, [isEditing, event, scheduler.state.start.value, scheduler.state.end.value]);
    
        
        

        

        const handleConfirmClick = async () => {
            const startDate = new Date(state.start);
            const endDate = new Date(state.end);
            
            if (state.eventType === "Cirugía") {
                const startDate = new Date(state.start);
                const endDate = new Date(state.end);
                if (endDate.getTime() <= startDate.getTime()) {
                    message.error("La fecha de finalización debe ser posterior a la fecha de inicio. Por favor, ajusta las fechas.");
                    alert("La fecha de finalización debe ser posterior a la fecha de inicio. Por favor, ajusta las fechas.")
                    return; 
                }

                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    message.error("Las fechas no son válidas. Por favor, selecciona fechas válidas.");
                    return; 
                }

                const timeDifference = endDate.getTime() - startDate.getTime();

                if (timeDifference > 2 * 60 * 60 * 1000) { 
                    alert("Las cirugias no deben sobrepasar las dos horas, selecciona otra vez las fechas.");
                    message.error("Las cirugias no deben sobrepasar las dos horas, selecciona otra vez las fechas.");
                    return; 
                }
            } else if (state.eventType === "Cita General") {
                const startDate = new Date(state.start);
                const endDate = new Date(state.end);

                if (endDate.getTime() <= startDate.getTime()) {
                    message.error("La fecha de finalización debe ser posterior a la fecha de inicio. Por favor, ajusta las fechas.");
                    alert("La fecha de finalización debe ser posterior a la fecha de inicio. Por favor, ajusta las fechas.");
                    return; 
                }
              
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    message.error("Las fechas no son válidas. Por favor, selecciona fechas válidas.");
                    return; 
                }

                const timeDifferenceInMilliseconds = endDate.getTime() - startDate.getTime();

                if (timeDifferenceInMilliseconds > 60 * 60 * 1000) { 
                    message.error("Las citas no deben sobrepasar la hora de duracion, selecciona otra vez las fechas.");
                    alert("Las citas no deben sobrepasar la hora de duracion, selecciona otra vez las fechas.");
                    return; 
                }
            }      

            const operationDescripAsString = state.cirugiaDescription.join('\n');

            try {
                scheduler.loading(true);
                const updatedEvent = {
                    ...event,
                    title: state.title,
                    description: state.description,
                    tipoAgenda: state.eventType,
                    operationDescrip: operationDescripAsString,
                    operationObs: state.operationObs,
                    idPatient: state.selectedPacienteId,
                    event_id: event?.event_id || "", 
                    start: new Date(state.start),
                    end: new Date(state.end),
                };

                const isOverlapping = checkAppointmentOverlap(updatedEvent);
            
                if (isOverlapping) {
                    message.error("La nueva cita se superpone con eventos existentes. Por favor, ajusta las fechas.");
                    alert("La nueva cita se superpone con eventos existentes. Por favor, ajusta las fechas.");
                    scheduler.loading(false);
                    return;
                }
                const confirmedEvent = await handleConfirm(updatedEvent, event ? "edit" : "create");
                scheduler.loading(false);
            } catch (error) {
                console.error("Error al confirmar:", error);
                scheduler.loading(false);
            }        
        };
    
        return (
            <>
            <div style={{ padding: "1rem" }}>
                <p>{event ? "Editar evento" : "Ingrese un nuevo evento"}</p>
                
                <InputLabel id="event-type-label">Cita / Cirugía </InputLabel>
                <Select
                placeholder="Seleccione cita o cirugía"
                labelId="event-type-label"
                value={state.eventType}
                onChange={(e) => handleChange(e.target.value, "eventType")}
                fullWidth
                >
                {optionsAgenda.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                    {option.text}
                    </MenuItem>
                ))}
                </Select>
                {state.eventType === "Cirugía" ? (
                <>
                    <InputLabel id="pacient-label">Paciente aptos para cirugía</InputLabel>
                    <Select
                        labelId="paciente"
                        value={state.selectedPacienteId || ""}
                        onChange={(e) => handleChange(e.target.value, "selectedPacienteId")}
                        fullWidth
                        >
                            {patientsOperation.map((paciente: any) => (
                                <MenuItem key={paciente.id} value={paciente.id}>
                                {paciente.text}
                                </MenuItem>
                            ))}
                    </Select>
                    <div style={{marginTop:"0.7rem"}}>
                        {/* selector de fechas */}
                        <label>Fecha de inicio: </label>
                            <input
                                type="datetime-local"
                                value={state.start}
                                onChange={(e) => setState({ ...state, start: e.target.value })}
                                style={inputStyle}
                                
                            />

                        <label>Fecha de fin: </label>
                        <input
                            type="datetime-local"
                            value={state.end}
                            onChange={(e) => setState({ ...state, end: e.target.value })}
                            style={inputStyle}
                            
                        />
                    </div>
                    <label style={{marginTop:"10px"}} >Indicaciones para la cirugía</label>
                    <Select
                        placeholder="Indicaciones para cirugia"
                        
                        fullWidth
                        labelId="multiple-select-label"
                        id="multiple-select"
                        multiple
                        value={Array.isArray(state.cirugiaDescription) ? state.cirugiaDescription : []}
                        onChange={handleChangeSelect}
                        label="Selecciona las indicaciones"
                        renderValue={(selected: string[]) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} sx={{ margin: 0.5 }} />
                                ))}
                            </Box>
                        )}
                    >
                        {tests.map((option: Test) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.value}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                    style={{marginTop:"10px"}}
                    label="Observaciones para la cirugía"
                    value={state.operationObs}
                    onChange={(e) => handleChange(e.target.value, "operationObs")}
                    fullWidth
                    />
                </>
                ) : (
                    <>
                        {state.eventType === "Cita General" && (
                        <>
                            <div style={{marginTop:"0.7rem"}}>
                                {/* selector de fechas */}
                                <label>Fecha de inicio: </label>
                                    <input
                                        type="datetime-local"
                                        value={state.start}
                                        onChange={(e) => setState({ ...state, start: e.target.value })}
                                        style={inputStyle}
                                    />

                                <label>Fecha de fin: </label>
                                <input
                                    type="datetime-local"
                                    value={state.end}
                                    onChange={(e) => setState({ ...state, end: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <InputLabel id="pacient-label">Paciente</InputLabel>
                            <Select
                            labelId="paciente"
                            value={state.selectedPacienteId || ""}
                            onChange={(e) => handleChange(e.target.value, "selectedPacienteId")}
                            fullWidth
                            >
                                {patients.map((paciente: any) => (
                                    <MenuItem key={paciente.id} value={paciente.id}>
                                    {paciente.text}
                                    </MenuItem>
                                ))}
                            </Select>
                        </>  
                        )}
                    </>
                )}
            </div>
            <DialogActions>
                <Button onClick={scheduler.close}>Cancelar</Button>
                <Button onClick={handleConfirmClick}>Confirmar</Button>
            </DialogActions>
            </>
        );
    };

    return (
        <div>
            {
                loadingEvents || loadingSpecialists ?
                    <Spin />
                    :
                    <div>
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Especialista</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedSpecialist}
                                    label="Especialista"
                                    onChange={handleChangeSpecialist}
                                >
                                    {specialists.map((pt: any) =>
                                        <MenuItem value={pt.id}>{pt.text}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Box>
                        
                        <Scheduler
                            //vista del calendario
                            customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
                            week={{
                                weekDays: [0, 1, 2, 3, 4],
                                weekStartOn: 1,
                                startHour: 9,
                                endHour: 17,
                                step: 60,
                            }}
                            view="week"
                            events={events}
                            
                            //logica
                            onConfirm={handleConfirm}
                            onEventDrop={handleEventDrop}
                            onDelete={handleDelete}
                            

                            //estilo
                            eventRenderer={({ event, ...props }) => {
                                // {console.log("eventos:", event)}
                                if (event.tipoAgenda === "Cirugía") {
                                    return (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                height: "100%",
                                                color: "white",
                                                backgroundColor: "orange", 
                                            }}
                                            {...props}
                                        >   
                                            <div style={{ padding: "1px", fontSize: "13px", marginLeft: "3px" }}>
                                                <div>{event.title}</div>
                                                {event.tipoAgenda} <br />

                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <div>
                                                        Inicio: {event.start.getHours()}:{event.start.getMinutes()}
                                                    </div>
                                                    <div>
                                                        Fin: {event.end.getHours()}:{event.end.getMinutes()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                height: "100%",
                                                color: "white",
                                                backgroundColor: "#Oae", 
                                            }}
                                            {...props}
                                        >   
                                            <div style={{ padding: "1px", fontSize: "13px", marginLeft: "3px" }}>
                                                <div>{event.title}</div>
                                                {event.tipoAgenda} <br />

                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <div>
                                                        Inicio: {event.start.getHours()}:{event.start.getMinutes()}
                                                    </div>
                                                    <div>
                                                        Fin: {event.end.getHours()}:{event.end.getMinutes()}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                    </div>
            }
        </div>
    )
}

export default DoctorCalendar;