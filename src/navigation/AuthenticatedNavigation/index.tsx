/* eslint-disable react-hooks/exhaustive-deps */
import { Routes, Route, useNavigate } from "react-router-dom";
import { Button, Layout, Modal, Tooltip } from "antd";
import { SideBar } from "../../components/Sidebar";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import DashboardPage from "../../pages/Doctor/DashboardPage";
import CalendarPage from "../../pages/Doctor/CalendarPage";
import PatientsPage from "../../pages/Doctor/PatientsPage";
import DatesPage from "../../pages/Doctor/DatesPage";
import PersonalPage from "../../pages/Doctor/PersonalPage";
import PatientDatesPage from "../../pages/Patient/DatesPage";
import FrequentQuestionsPage from "../../pages/Doctor/FrequentQuestionsPage";
import ReportPage from "../../pages/Patient/ReportPage";
import HumanPage from "../../pages/Doctor/HumanPage";
import Agora from "../../pages/Integrations/Agora";
import ScreenRecording from "../../pages/Integrations/ScreenRecord";
import './styles.css'
import AgoraComponent from "../../components/AgoraComponent";
import { NewCallContext } from "../../context/NewCallContext";
import { FullscreenOutlined } from "@ant-design/icons";
import VideoCall from "../../components/JitsiComponent";
import Videocall from "../../components/Videocall";
import TestsPage from "../../pages/Doctor/TestsPage";
import { CallContext } from "../../context/CallContext";
import Window from "floating-window-ui";
import OperationPage from "../../pages/Doctor/OperationPage";


const AuthenticatedNavigation = () => {

  const navigate = useNavigate();
  const { user }: any = useContext(AuthContext);

  const { joinSuccess, openDrawer, showDrawer }: any = useContext(NewCallContext)

  const { isActive }: any = useContext(CallContext)

  useEffect(() => {
    (user.isDoctor || user.isPychologist || user.isNutri) && navigate("/citas");
    user.isPatient && navigate("/calendario");
  }, []);



  return (
    <>
      <Layout>
        <SideBar>
          {user.isDoctor && (
            <Routes>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="citas" element={<DatesPage />} />
              <Route path="calendario" element={<CalendarPage />} />
              <Route path="personal" element={<PersonalPage />} />
              <Route path="pacientes" element={<PatientsPage />} />
              <Route path="preguntas" element={<FrequentQuestionsPage />} />
              <Route path="simulacion" element={<HumanPage />} />
              <Route path="citas/cita-virtual/:channel" element={<Agora />} />
              <Route path="recordTest" element={<ScreenRecording
                screen={true}
                audio={true}
                video={false}
                downloadRecordingPath="Screen_Recording_Demo"
                downloadRecordingType="mp4"
                emailToSupport="support@xyz.com"
              />
              } />
              <Route path="citas/cita-virtual" element={<Videocall />} />

              <Route path="examenes" element={<TestsPage />} />
              <Route path="cirugiaIndicaciones" element={<OperationPage />} />
            </Routes>
          )}

          {user.isPatient && (
            <Routes>
              <Route path="avance" element={<ReportPage />} />
              <Route path="calendario" element={<CalendarPage />} />
              <Route path="citas" element={<PatientDatesPage />} />
              <Route path="simulacion" element={<HumanPage />} />
              <Route path="citas/cita-virtual" element={<Videocall />} />
            </Routes>
          )}

          {user.isPychologist && (
            <Routes>
              <Route path="citas" element={<DatesPage />} />
              <Route path="calendario" element={<CalendarPage />} />
              <Route path="pacientes" element={<PatientsPage />} />
              <Route path="citas/cita-virtual" element={<Videocall />} />
            </Routes>
          )}

          {user.isNutri && (
            <Routes>
              <Route path="citas" element={<DatesPage />} />
              <Route path="calendario" element={<CalendarPage />} />
              <Route path="pacientes" element={<PatientsPage />} />
              <Route path="simulacion" element={<HumanPage />} />
              <Route path="citas/cita-virtual" element={<Videocall />} />
            </Routes>
          )}

        </SideBar>
      </Layout>


      {
        joinSuccess &&
        (
          <div className="call-container">
            <AgoraComponent />
            {!openDrawer && (
              <Tooltip title="Mostrar llamada">
                <Button onClick={showDrawer} icon={<FullscreenOutlined />}>Mostrar llamada</Button>
              </Tooltip>
            )}
          </div>
        )
      }

      {isActive && (
        <Window
          id="react-window"
          height={400}
          width={400}
          resizable={true}
          titleBar={{
            icon: "⚛",
            title: "Videollamada",
            buttons: { minimize: true, maximize: true },
          }}
        >
          <Videocall />
        </Window>
      )}
    </>
  );
};

export default AuthenticatedNavigation;