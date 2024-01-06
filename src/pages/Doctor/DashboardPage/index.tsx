import React, { useEffect, useState, useContext } from 'react';
import { UserAddOutlined, LoginOutlined, CalendarOutlined, FileAddOutlined, UserOutlined } from "@ant-design/icons"
import { Row, Col, Card, Spin, List, Typography } from "antd"
import { getData } from '../../../services/common/getData';
import { format } from 'date-fns'
import es from 'date-fns/locale/es';
import './styles.css';
import { AuthContext } from '../../../context/AuthContext';
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const gridStyle: React.CSSProperties = {
    width: '50%',
    textAlign: 'center',
};

const fullGridStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    cursor: 'pointer'
};
const DashboardPage = () => {
    const navigate = useNavigate()
    const [recentUsers, setRecentUsers] = useState([])
    const [recentRegisterUsers, setRecentRegisterUsers] = useState([])
    const [recentDates, setRecentDates] = useState([])
    const [recentRecords, setRecentRecords] = useState([])
    const [loadingData, setLoadingData] = useState(false)
    const { user }: any = useContext(AuthContext)
    const [todayDates, setTodayDates] = useState([])

    const [patientStats, setPatientStats] = useState([])

    const getRecentUsers = async () => {
        setLoadingData(true)
        const request = await getData('api/users/usersrecent')
        console.log('request', request);
        if (request.status) {
            setRecentUsers(request.data)
            setLoadingData(false)
        }
    }


    const getRecentRegisterUsers = async () => {
        setLoadingData(true)
        const request = await getData('api/users/usersregisterrecent')
        console.log('request2', request)
        if (request.status) {
            setRecentRegisterUsers(request.data)
            setLoadingData(false)
        }
    }

    const getRecentDates = async () => {
        setLoadingData(true)
        const request = await getData('api/dates/datesrecent')
        console.log('request3', request)
        if (request.status) {
            setRecentDates(request.data)
            setLoadingData(false)
        }
    }

    const getRecentRecords = async () => {
        setLoadingData(true)
        const request = await getData('api/records/recordsrecent')
        console.log('request4', request)
        if (request.status) {
            setRecentRecords(request.data)
            setLoadingData(false)
        }
    }



    const getTodayDates = (data: any) => {
        const filteredDates = data.filter((date: any) =>
            moment().isSame(date.start, "day")
        );
        setTodayDates(filteredDates);
    };


    const getDates = async () => {
        setLoadingData(true);
        let url = "";
        if (!user.isPatient) {
            url = "api/dates/byEspecialist/";
        };

        if (user.isPatient) {
            url = "api/dates/byPatient/";
        };

        const request = await getData(url + user._id);
        if (request.status) {
            const requestPatients = await getData("api/users/patients");

            let patients: any = [];
            if (requestPatients.status) {
                patients = requestPatients.data;
            }

            let specialists: any = [];
            const requestSpecialists = await getData("api/users/specialists");
            if (requestSpecialists.status) {
                specialists = requestSpecialists.data;
            }

            if (patients.length > 0 && specialists.length > 0) {
                const fullDates = request.data.map((date: any) => {
                    return {
                        ...date,
                        specialist: specialists.find(
                            (sp: any) => sp._id === date.idespecialist
                        ),
                        patient: patients.find((pt: any) => pt._id === date.idpatient),
                    };
                });
                getTodayDates(fullDates.reverse());
            }
            setLoadingData(false);
        }
    };

    const getPatients = async () => {
        const requestPatients = await getData("api/users/patients");

        let patients: any = [];
        if (requestPatients.status) {
            patients = requestPatients.data;
        }

        const p = patients.filter((patient:any) => patient.dates.length > 0)
        console.log('p', p)
        const patientsWithInfo = patients.filter((patient: any) => 'generalInfo' in patient)
        const places = ["Azuay", "Manabí", "Guayas", "Manabí", "Pichincha"]
        const results = []

        console.log('1', patientsWithInfo)
        if (patientsWithInfo.length > 0) {
            places.forEach((place: string) => {
                const patientsWithBorn = patientsWithInfo.filter((patient: any) => 'bornPlace' in patient.generalInfo)
                console.log('2', patientsWithBorn)
                if (patientsWithBorn.length > 0) {
                    const byBorn = patientsWithBorn.filter((patient: any) => patient.generalInfo.bornPlace === place)
                    results.push({
                        place,
                        count: byBorn.length
                    })
                }
            });
        }
    }



    useEffect(() => {
        getRecentUsers()
        getRecentRegisterUsers()
        getRecentDates()
        getRecentRecords()
        getDates()
        getPatients()
    }, [])


    return (
        <Card title="Actividad Reciente">
            <Card.Grid style={gridStyle} onClick={() => navigate("/citas")} >
                {loadingData ? <Spin /> : (
                    <div>
                        <CalendarOutlined className="stat-icon" />
                        <h3 className="stat-title">Citas de hoy {todayDates.length}</h3>
                    </div>
                )}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
                {loadingData ? <Spin /> : (
                    <div>
                        <UserOutlined className="stat-icon" />
                        <h3 className="stat-title">Pacientes por provincia</h3>
                        <div>
                            {
                                patientStats && patientStats.length > 0 && (
                                    <List
                                        header={<div>Header</div>}
                                        footer={<div>Footer</div>}
                                        bordered
                                        dataSource={patientStats}
                                        renderItem={(item:any) => (
                                            <List.Item>
                                                <span>{item.place} ({item.count})</span>
                                            </List.Item>
                                        )}
                                    />
                                )
                            }
                        </div>
                    </div>
                )}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
                {loadingData ? <Spin /> : (
                    <div>
                        <UserAddOutlined className="stat-icon" />
                        <h3 className="stat-title">Usuarios registrados {recentRegisterUsers.length}</h3>
                        <List
                            dataSource={recentRegisterUsers.slice(0, 5)}
                            renderItem={(user: any) => (
                                <List.Item>
                                    {user.firstname} {user.lastname}
                                    <span style={{ display: 'block' }}>{format(new Date(user.createdAt), 'd MMMM, yyyy h:mm a', { locale: es })}</span>
                                </List.Item>
                            )}
                        />
                    </div>
                )}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
                {loadingData ? <Spin /> : (
                    <div>
                        <LoginOutlined className="stat-icon" />
                        <h3 className="stat-title">Usuarios autenticados {recentUsers.length}</h3>
                        <List
                            dataSource={recentUsers.slice(0, 5)}
                            renderItem={(user: any) => (
                                <List.Item>
                                    {user.firstname} {user.lastname}
                                    <span style={{ display: 'block' }}>{format(new Date(user.lastLoginDate), 'd MMMM, yyyy h:mm a', { locale: es })}</span>
                                </List.Item>
                            )}
                        />
                    </div>
                )}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
                {loadingData ? <Spin /> : (
                    <div>
                        <CalendarOutlined className="stat-icon" />
                        <h3 className="stat-title">Citas agendadas {recentDates.length}</h3>
                    </div>
                )}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
                {loadingData ? <Spin /> : (
                    <div>
                        <FileAddOutlined className="stat-icon" />
                        <h3 className="stat-title">Registros médicos creados {recentRecords.length}</h3>
                    </div>
                )}
            </Card.Grid>
        </Card>
    )
}

export default DashboardPage; 