import { Button, Card, Popconfirm } from 'antd'
import moment from 'moment'
import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { DeleteOutlined } from '@ant-design/icons'

function DateCard({ selectedDay, specialist, handleSubmit, dateId }: any) {
    const { user }: any = useContext(AuthContext)

    return (
            <Card style={{ marginTop: 12 }}
                title={<>
                    <div>Fecha seleccionada: {moment(selectedDay).format('YYYY-MM-DD')}</div>
                    <div>Hora seleccionada: {moment(selectedDay).format('HH:mm')}</div>
                </>
                }
            >
                <h4>Especialista: {specialist.firstname} {specialist.lastname}</h4>
                <h4>Paciente: {user.firstname} {user.lastname}</h4>
                <Popconfirm
                    title="Cancelar cita"
                    description="Está seguro que desea cancelar la cita en la fecha y horario seleccionado?"
                    onConfirm={() => handleSubmit(dateId)}
                    okText="Sí"
                    cancelText="No"
                >
                    <Button icon={ <DeleteOutlined/> } type='primary'>Cancelar</Button>
                </Popconfirm>
            </Card>
    )
}

export default DateCard
