import { Card } from "antd";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import PatientCalendar from "../../components/Calendar/Patient";
import DoctorCalendar from "../../components/Calendar/Doctor";
import NewCalendar from "../../components/NewCalendar";


export default function CalendarPage() {
    const { user }: any = useContext(AuthContext);
    return (
        <Card title="Calendario">
            {user.isPatient && <NewCalendar />}
            {(user.isDoctor || user.isNutri || user.isPychologist) && (<DoctorCalendar />)}
        </Card >
    );
}
