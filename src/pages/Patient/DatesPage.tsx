import React, { useContext, useState, useEffect } from "react";
import { Card, Form, Select, Row, Col, Spin, Collapse, Modal, Button, MenuProps, Dropdown, Space, Pagination, List, message, DatePickerProps, DatePicker, Tag } from "antd";
import moment from "moment";
import { CalendarOutlined, DownOutlined } from "@ant-design/icons";
import { getData } from "../../services/common/getData";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CallContext } from "../../context/CallContext";
import AgoraUIKit from "agora-react-uikit";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Recepepdf from "../../components/PDF/Recepepdf";
import LastDate from "../../components/LastDate";
import es from 'date-fns/locale/es';
import { format } from 'date-fns'
import { RangePickerProps } from "antd/es/date-picker";
import AgoraRTC from 'agora-rtc-sdk-ng';
import { NewCallContext } from "../../context/NewCallContext";
import { postData } from "../../services/common/postData";
import { launchNotif } from "../../utils/notifications";
import { ClockCircleOutlined, EyeOutlined, CloudDownloadOutlined} from '@ant-design/icons';
import { createClient } from "@supabase/supabase-js";

const { Panel } = Collapse;

const gridStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "center",
};

export const CiruInfo = ({ date, firstname, lastname, onlyHour, hideDatetime }: any) => {
  return (
      <>
       <Card
            title="Cuidados y receta"
            extra={<>
                {!hideDatetime && (
                    <>
                        <ClockCircleOutlined /> {" "} {onlyHour ? 'Hora:' : 'Fecha y Hora:'} {format(new Date(date.start), onlyHour ? 'h:mm a' : 'd MMMM, yyyy h:mm a', { locale: es })}
                    </>
                )}
            </>}>
            
            <div style={{display:"flex", flexDirection: "column"}}>
                <div style={{ display: 'flex', padding: 12 , marginTop: "20px"}}>
                    {/* muestra los tests */}
                    { "care" in date.record && date.record.care.length > 0 && (
                        <div>
                        
                            {date.record.care.map((care: any, index: number) => (
                                <span key={index} style={{ display: "block",  }}>
                                    - Cuidado {index + 1} : {care.description}
                                </span>
                            ))}
                        </div>
                    )}
                    
                </div>
                <div style={{ display: 'flex', padding: 12}}>
                {date?.record?.recipe[0] && (
                        <PDFDownloadLink
                            document={
                                <Recepepdf
                                    date={date}
                                    firstname={firstname}
                                    lastname={lastname}
                                />
                            }
                            fileName="receta.pdf"
                        >
                            <Button type="primary" icon={<CloudDownloadOutlined />}>Descargar Receta </Button>
                        </PDFDownloadLink>
                    )}
                </div>
            </div>
            
        </Card>
      </>
  )
}


const EmptyDate = ({ date, onlyHour, hideDatetime }: any) => {
  console.log('date', date)
  return (
      <Card title="No existe registro de exámenes y cuidado de la herida para esta cirugía todavia"
          extra={<>
              {!hideDatetime && (
                  <>
                      <ClockCircleOutlined /> {" "} {onlyHour ? 'Hora:' : 'Fecha y Hora:'} {format(new Date(date.start), onlyHour ? 'h:mm a' : 'd MMMM, yyyy h:mm a', { locale: es })}
                  </>
              )}
          </>}>

          <></>
      </Card>
  )
}

export const IndividualDate = ({ date, patient, onlyHour, hideDatetime }: any) => {
  console.log('date', date)
  const { firstname, lastname } = patient

  return (
      <div>
          <>
              {"record" in date ? (
                  <Row style={{ marginBottom: 12 }}>
                      {date.record !== null && "Test" in date.record &&
                           (
                              <>
                                  <Col span={24}>
                                      <CiruInfo date={date} firstname={firstname} lastname={lastname} onlyHour={onlyHour} hideDatetime={hideDatetime} />
                                  </Col>
                                  
                              </>
                              
                          )}
                      
                  </Row>
              ) : (
                  <EmptyDate date={date} onlyHour={onlyHour} hideDatetime={hideDatetime} />
              )}

          </>

      </div>
  )
}

const LastDateCiru = ({ date, patient, onlyHour = false, hideDatetime = false }: any) => {
  console.log('date', date)
  console.log('length', date.length)
  return (
      <div style={{ width: '100%' }}>
          {date.length === 1 && <IndividualDate date={date[0]} patient={patient} onlyHour={onlyHour} hideDatetime={hideDatetime} />}
          {date.length > 1 && date.map((dateItem: any) =>
              <IndividualDate date={dateItem} patient={patient} onlyHour={onlyHour} hideDatetime={hideDatetime} />)}
      </div>
  )
}


const MyDrop = ({ date, join }: any) => {

  const { joinHuman }: any = useContext(NewCallContext)

  const generateAgoraToken = async (channelName: any, userId: any, role: any) => {
    try {
      const resp = await postData('api/agora', {
        channelName,
        userId,
        role,
      })
      return resp.token;
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  };

  let items: MenuProps['items'] = [];

  if (moment().isBetween(date.start, date.end, null, '[]')) {
    
      items.push({
        key: '1',
        label: (
          <a rel="noopener noreferrer" onClick={join}>
            Ingresar a videollamada
          </a>
        ),
      });
    
  }

  if ("callUrl" in date) {
    if (date.callUrl !== "") {
      items.push({
        key: '3',
        label: (
          <a rel="noopener noreferrer" href={date.callUrl} target="_blank">
            Ver videollamada guardada
          </a>
        )
      })
    }
  }

  if ("record" in date) {
    if (date.record.recipe[0]) {
      items.push({
        key: '4',
        label: (
          <PDFDownloadLink
            document={<Recepepdf date={date} />}
            fileName="receta.pdf"
          >
            <a rel="noopener noreferrer">
              Descargar receta
            </a>
          </PDFDownloadLink>
        )
      })
    }
  }

  return (
    <Dropdown
      menu={{ items }}
    >
      <Button type="primary">
        <Space>
          Acciones
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  )
}



const DatesPage = () => {
  const navigate = useNavigate()
  const { user }: any = useContext(AuthContext);
  const [initialData, setInitialData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [filterBy, setFilterBy] = useState("today");
  const { join, isActive, call, leave }: any = useContext(CallContext)

  const [totalItems, setTotalItems] = useState(0)

  const [startDate, setStartDate] = useState<any>('')
  const [endDate, setEndDate] = useState<any>('')
  const [dates, setDates] = useState([]);
  const [filteredDates, setFilteredDates] = useState<any>([])
  const [filtered, setFiltered] = useState(false)
  const [showingToday, setShowingToday] = useState(false)
  

  const [startDateOperation, setStartDateOperation] = useState<any>('')
  const [endDateOperation, setEndDateOperation] = useState<any>('')
  const [datesOperation, setDatesOperation] = useState<any>([])
  const [filteredDatesOperation, setFilteredDatesOperation] = useState<any>([])
  const [filteredOperation, setFilteredOperation] = useState(false)
  
  const [showingTodayOperation, setShowingTodayOperation] = useState(false)





  const getDates = async () => {
    setLoadingData(true);
    let url = "api/dates/byPatient"
    const request = await getData(url + "/" + user._id + "/?fp=" + true);
    if (request.status) {
      let specialists: any = [];
      const requestSpecialists = await getData("api/users/specialists");
      if (requestSpecialists.status) {
        specialists = requestSpecialists.data;
      }

      if (specialists.length > 0) {
        const fullDates = request.data.map((date: any) => {
          return {
            ...date,
            specialist: specialists.find(
              (sp: any) => sp._id === date.idespecialist._id
            ),
            patient: user,
          };
        });
        console.log('fulldates', fullDates)
        setInitialData(fullDates.reverse());
        getTodayDates(fullDates.reverse());

        const comparareDates = (a: any, b: any) => {
          return a.start.localeCompare(b.start);
        };
        const sortedDates = fullDates.sort(comparareDates);
        console.log('sortedDates', sortedDates)

        const citasDates = sortedDates.filter((date:any) => !('tipoAgenda' in date) || date.tipoAgenda === 'Cita General');
        const cirugiaDates = sortedDates.filter((date:any) => date.tipoAgenda === 'Cirugía');
        console.log("cirugias total: ", cirugiaDates)
        console.log("citas total: ", citasDates)
        console.log(citasDates.length)
        console.log(cirugiaDates.length)
        setTotalItems(sortedDates.length)

        setDates(citasDates)
        getTodayDates(citasDates)

        setDatesOperation(cirugiaDates)
        getTodayDatesOperation(cirugiaDates)
      }
      setLoadingData(false);
    }
  };

  useEffect(() => {
    getDates();
  }, []);

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
                    console.log('PAYLOAD--', payload);
                    getDates()
                }
            )
            .subscribe();
        // END LISTEN CHANGES FOR IN-APP NOTIF
    } catch (error) {
        getDates()
    }
}, [])

  const getTodayDates = (data: any) => {
    const todayDates = data.filter((date: any) =>
      moment().isSame(date.start, "day")
    );
    console.log('todayDates', todayDates)
    setFilteredDates(todayDates);
    setShowingToday(true)
  };

  const getTodayDatesOperation = (data: any) => {
    const todayDates = data.filter((date: any) =>
      moment().isSame(date.start, "day")
    );
    console.log('todayDates', todayDates)
    setFilteredDatesOperation(todayDates);
    setShowingTodayOperation(true)
  };

  const handleChangeFilter = (value: any) => {
    setFilterBy(value);
    if (value === "today") {
      getTodayDates(initialData);
      getTodayDatesOperation(initialData)
      return;
    }

    if (value === "all") {
      setDates(initialData);
      setDatesOperation(initialData)
      return;
    }
  };

  const formatIndicaciones = (indicaciones:string) => {
    
    const indicacionesArray = indicaciones.split('\n').map((item) => item.trim());
    const filteredIndicaciones = indicacionesArray.filter((item) => item !== '');
    const formattedIndicaciones = filteredIndicaciones.map((item) => `  ${item}<br />`);
    return formattedIndicaciones.join('');
  };
  


  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    if (dateString[0] === "" && dateString[1] === "") {
      setFiltered(false)
    }

    setStartDate(dateString[0])
    setEndDate(dateString[1])

    filterDates(dateString[0], dateString[1])
  };

  const onChangeOperation = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    if (dateString[0] === "" && dateString[1] === "") {
      setFilteredOperation(false)
    }

    setStartDateOperation(dateString[0])
    setEndDateOperation(dateString[1])

    filterDatesOperation(dateString[0], dateString[1])
  };


  const filterDates = (sd: any, ed: any) => {

    const startDate = sd
    const endDate = ed

    if (startDate !== "" && endDate === "") {
      message.error("Por favor selecciona una fecha final")
      return;
    }

    if (startDate === "" && endDate !== "") {
      message.error("Por favor selecciona una fecha inicial")
      return;
    }

    if (startDate === "" && endDate === "") {
      const comparareDates = (a: any, b: any) => {
        return a.start.localeCompare(b.start);
      };
      const sortedDates = dates.sort(comparareDates);


      setTotalItems(sortedDates.length)
      getTodayDatesOperation(sortedDates)

      setFiltered(false)
      setShowingToday(false)
      return;
    }

    if (startDate !== "" && endDate !== "") {
      const sd = moment(startDate)
      const ed = moment(endDate)
      const filtered = dates.filter((date: any) => moment(date.start).isBetween(sd, ed, 'days', '[]'));
      const comparareDates = (a: any, b: any) => {
        return a.start.localeCompare(b.start);
      };
      const sortedDates = filtered.sort(comparareDates);
      setTotalItems(sortedDates.length)
      setFilteredDates(sortedDates)

      setFiltered(true)
      setShowingToday(false)
    }

  }

  const filterDatesOperation = (sd: any, ed: any) => {

    const startDate = sd
    const endDate = ed

    if (startDate !== "" && endDate === "") {
      message.error("Por favor selecciona una fecha final")
      return;
    }

    if (startDate === "" && endDate !== "") {
      message.error("Por favor selecciona una fecha inicial")
      return;
    }

    if (startDate === "" && endDate === "") {
      const comparareDates = (a: any, b: any) => {
        return a.start.localeCompare(b.start);
      };
      const sortedDates = datesOperation.sort(comparareDates);


      setTotalItems(sortedDates.length)
      getTodayDates(sortedDates)

      getTodayDatesOperation(sortedDates) 

      setFilteredOperation(false)
      setShowingTodayOperation(false)
      return;
    }

    if (startDate !== "" && endDate !== "") {
      const sd = moment(startDate)
      const ed = moment(endDate)
      const filtered = datesOperation.filter((date: any) => moment(date.start).isBetween(sd, ed, 'days', '[]'));
      const comparareDates = (a: any, b: any) => {
        return a.start.localeCompare(b.start);
      };
      const sortedDates = filtered.sort(comparareDates);
      setTotalItems(sortedDates.length)

      setFilteredDatesOperation(sortedDates) //cirugia

      setFilteredOperation(true)
      setShowingTodayOperation(false)
    }

  }


  return (
    <>
    
    <Card
      title="Citas"
      extra={
        <Row align="middle" style={{ marginBottom: 8 }}>
          <Col>Filtro:</Col>
          <Col style={{ paddingLeft: 8 }}>
            <Space>
              <DatePicker.RangePicker onChange={onChange} />

            </Space>
          </Col>
        </Row>
      }
    >
      <Card.Grid style={gridStyle} hoverable={false}>
        {loadingData ? (
          <Spin />
        ) : (
          <div>
            <CalendarOutlined className="stat-icon" />
            <h3 className="stat-title">
              {(filtered) ? "Citas entre " + startDate + " y " + endDate
                : "Citas de hoy"
              }
            </h3>

          </div>
        )}
      </Card.Grid>

      <List
        style={{ width: "100%" }}
        loading={loadingData}
        bordered
        dataSource={filteredDates}
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
          showSizeChanger: false
        }}

        renderItem={(date: any) => (
          <>
            {" "}
            <Collapse accordion>
              <Panel key={date._id} header={
                <>
                  <div>
                    Especialista: {date.idespecialist.firstname + " " + date.idespecialist.lastname} {" "}

                    <p style={{ display: 'inline' }}>
                      {date.idespecialist.isNutri && (
                        <Tag color="green">Nutriologo</Tag>
                      )}
                      {date.idespecialist.isPychologist && (
                        <Tag color="purple">Psicologo</Tag>
                      )}
                      {date.idespecialist.isDoctor && (
                        <Tag color="blue">Cirujano</Tag>
                      )}
                    </p>

                    {"   Fecha: " + format(new Date(date.start), 'd MMMM, yyyy h:mm a', { locale: es })}
                  </div>
                </>
              }>
                <List.Item
                  actions={[
                    <MyDrop
                      date={date}
                      join={() => {

                        join(date._id)

                        //envia notification
                        const notifTitle = user.firstname + " ha ingresado a la llamada"
                        launchNotif({ title: notifTitle, senderId: user._id, receiverId: date.idespecialist._id, refId: date._id })

                        /*
                        navigate("cita-virtual")
                        const currentUrl = window.location.href
                        // Abrir una nueva pestaña con el mismo URL
                        window.open(currentUrl, '_blank');
                        */

                      }}
                    />
                  ]}
                >
                  <LastDate
                    date={[date]}
                    patient={date.patient}
                    hideDatetime={true}
                  />


                </List.Item>
              </Panel>
            </Collapse>
          </>
        )}
      />
    </Card>

    {/* cirguia */}
    <Card
    style={{marginTop: "20px"}}
      title="Cirugia"
      extra={
        <Row align="middle" style={{ marginBottom: 8 }}>
          <Col>Filtro:</Col>
          <Col style={{ paddingLeft: 8 }}>
            <Space>
              <DatePicker.RangePicker onChange={onChangeOperation} />

            </Space>
          </Col>
        </Row>
      }
    >
      <Card.Grid style={gridStyle} hoverable={false}>
        {loadingData ? (
          <Spin />
        ) : (
          <div>
            <CalendarOutlined className="stat-icon" />
            <h3 className="stat-title">
              {(filteredOperation) ? "Cirugia entre " + startDateOperation + " y " + endDateOperation
                : "Cirugia de hoy"
              }
            </h3>

          </div>
        )}
      </Card.Grid>

      <List
        style={{ width: "100%" }}
        loading={loadingData}
        bordered
        dataSource={filteredDatesOperation}
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
          showSizeChanger: false
        }}

        renderItem={(date: any) => (
          <>
            {" "}
            <Collapse accordion>
              <Panel key={date._id} header={
                <>
                  <div>
                    Especialista: {date.idespecialist.firstname + " " + date.idespecialist.lastname} {" "}

                    <p style={{ display: 'inline' }}>
                      {date.idespecialist.isDoctor && (
                        <Tag color="blue">Cirujano</Tag>
                      )}
                    </p>

                    {"   Fecha: " + format(new Date(date.start), 'd MMMM, yyyy h:mm a', { locale: es })}
                    <p>Indicaciones: {date.operationDescrip ? (
                      <span dangerouslySetInnerHTML={{ __html: formatIndicaciones("</br> " + date.operationDescrip) }} />
                    ) : 'No hay indicaciones disponibles'}</p>
                    <p>Observaciones: {date.operationObs ? date.operationObs : 'No hay observaciones disponibles'}</p>
                  </div>
                </>
              }>
                <List.Item
                  actions={[
                    <MyDrop
                      date={date}
                    />
                  ]}
                >
                  <LastDateCiru
                    date={[date]}
                    patient={date.patient}
                    hideDatetime={true}
                  />


                </List.Item>
              </Panel>
            </Collapse>
          </>
        )}
      />
    </Card>
    </>
  );
};

export default DatesPage;