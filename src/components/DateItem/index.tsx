import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import PersonIcon from '@mui/icons-material/Person';
import { Row, Col } from 'antd'
import es from 'date-fns/locale/es';
import { format } from 'date-fns'
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const DateItem = ({ date }: any) => {
    return (
        <div style={{ width:'90%'}}>
            <Row>
                <Col xxl={1} xl={1} lg={1} md={24} sm={24} xs={24}>
                    <PersonIcon />
                </Col>
                <Col span={20}>
                    Paciente: {date.patient && date.patient.firstname + ' ' + date.patient.lastname}
                </Col>
            </Row>

            <Row>
                <Col xxl={1} xl={1} lg={1} md={24} sm={24} xs={24}>
                    <AccessTimeIcon />
                </Col>
                <Col span={20}>
                    Fecha y Hora: {format(new Date(date.start), 'd MMMM, yyyy h:mm a', { locale: es })}
                </Col>
            </Row>
        </div>
    )
}

export default DateItem; 