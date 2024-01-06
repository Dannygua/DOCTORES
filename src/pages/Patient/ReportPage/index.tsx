import { useContext, useEffect, useState } from "react";
import Report from "../../../components/Report";
import { AuthContext } from "../../../context/AuthContext";
import { getData } from "../../../services/common/getData";
import { Card, Spin, message } from "antd";

const ReportPage = () => {
    const { user }: any = useContext(AuthContext);

    const [patient, setPatient] = useState({})
    const [loading, setLoading] = useState(false)
    
    const getDates = async () => {
        setLoading(true)
        const request = await getData('api/dates/byPatient/' + user._id)
        if (request.status) {
            setPatient({ dates: request.data })
        } else {
            message.error("Algo salió mal!!")
        }
        setLoading(false)
    }

    useEffect(() => {
        getDates()
    }, [])


    return (
        <Card title="Avance">
            {!loading && 'dates' in patient ? <Report selectedPatient={patient} /> : <Spin />}
        </Card>
    )
}

export default ReportPage; 