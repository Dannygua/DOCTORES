  import { Card, Button, message, Form, InputNumber, Spin, Row, Col, Select } from "antd";
  import MyAnimate from "../../../components/Animate";
  import { Tabs } from "antd";
  import type { TabsProps } from "antd";
  import { useState, useContext, useEffect, Suspense } from "react";
  import MyScene from "../../../components/MyScene";
  import { transformShape } from "../../../services/common/postData";
  import { AuthContext } from "../../../context/AuthContext";
  import { getData } from "../../../services/common/getData";
  import './styles.css'
  import { AirlineSeatIndividualSuiteRounded } from "@mui/icons-material";
  import ABC from "./abc";
  import Simulation from "../../../components/Simulation";
  import Meshcapade from "../../../components/Meshcapade";

  const { Option } = Select

  export default function HumanPage() {

    const [selectedPatient, setSelectedPatient] = useState<any>(null)
    const [loadingData, setLoadingData] = useState(false)
    const [patients, setPatients] = useState<any>([])
    const [submitting, setSubmitting] = useState(false)
    const [results, setResults] = useState<any>(null)
    const [originalUrl, setOriginalUrl] = useState('')
    const [value, setValue] = useState<any>(80)


    const { user }: any = useContext(AuthContext)

    const getPatients = async () => {
      setLoadingData(true);
      const requestPatients = await getData("api/users/patients");
      if (requestPatients.status) {
        setPatients(requestPatients.data);
      }
      setLoadingData(false);
    };

    const getPatient = async () => {
      const request = await getData('api/users/patients/' + user._id)
      let patient: any = null
      if (request.status) {
        if (request.data.length > 0) {
          patient = request.data[0]
        }
      }

      console.log('patient', patient)

      if (patient !== null) {
        setSelectedPatient(patient._id)
        if ('bodyImages' in patient) {
          // setResults(patient.bodyImages)
          const getOriginal = patient.bodyImages.length > 0 ? patient.bodyImages.find((bodyImage: any) => bodyImage.name.includes('original')) : ''
          if (getOriginal !== '') {
            setOriginalUrl(getOriginal.url)
          }
        }
      }
    }

    useEffect(() => {
      if (!user.isPatient) {
        getPatients();
      }

      if (user.isPatient) {
        getPatient()
      }
    }, []);

    const onFinish = async (values: any) => {
      setSubmitting(true)
      if (originalUrl !== "") {
        const data = {
          "medida_cuello": values.cuello || 30,
          "medida_brazos": values.brazos || 30,
          "medida_pecho": values.pecho || 30,
          "medida_cintura": values.cintura || 30,
          "medida_cadera": values.cadera || 30,
          "medida_piernas": values.piernas || 30,
          "image_url": originalUrl
        }
        const request = await transformShape('images/shape/transform', data)
        if (request.status) {
          setResults(request.result)
          setSubmitting(false)
          return;
        }
      }
      setSubmitting(false)
      message.error("Error procesando la simulación")
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };


    const handleSelectPatient = (patientId: any) => {
      setResults(null)
      const sp = patients.find((patient: any) => patient._id === patientId)
      console.log('sp', sp)
      if (sp) {
        setSelectedPatient(sp);
        if ('bodyImages' in sp) {
          // setResults(sp.bodyImages)
          const getOriginal = sp.bodyImages.length > 0 ? sp.bodyImages.find((bodyImage: any) => bodyImage.name.includes('original')) : ''
          if (getOriginal !== '') {
            setOriginalUrl(getOriginal.url)
          }
        }

      }
    }

    const [form] = Form.useForm()
    const [showTooltips, setShowTooltips] = useState(true);
    const handleTabChange = (activeKey:any) => {
      if (activeKey === "2") {
        setShowTooltips(false);
      } else {
        setShowTooltips(true);
      }
    };

    const items: TabsProps["items"] = [
      {
        key: "1",
        label: `Por Medidas`,
        children: (
          <Simulation key="simulation" showTooltips={showTooltips}/>
        ),
      },
      {
        key: "2",
        label: `Por Medidas (V2)`,
        children: (
          <Meshcapade key="meshcapade"/> 
        ),
      },
      // {
      //   key: "2",
      //   label: "Version 2.0 (Beta)",
      //   children: (
      //     <embed src="https://bodyvisualizer.com/" style={{width:'100%', height: 1000}}></embed>
      //   )
      // }
    ];

    
    return (
      <>
        <Card title="Simulación corporal">
        <Tabs defaultActiveKey="1" items={items} onChange={handleTabChange} />
        </Card>
      </>
    );
  }