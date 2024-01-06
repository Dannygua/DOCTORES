import { Row, Col, Collapse, Button, DatePicker, DatePickerProps, message, Space, Typography, List, Pagination, Card } from "antd";
import moment from "moment";
import "moment/locale/es";
import { useEffect, useState } from "react";
import "./styles.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Recepepdf from "../PDF/Recepepdf";
import { RangePickerProps } from "antd/es/date-picker";
import ModalHeader from "../ModalHeader";
// import LastDate from "../LastDate";
import { groupDates } from "../../utils/dates";
import { ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { format } from 'date-fns'
import es from 'date-fns/locale/es';

const { Panel } = Collapse;
interface IProps {
  selectedPatient: any;
}

export const ExamInfo = ({ date, firstname, lastname, onlyHour, hideDatetime }: any) => {
  return (
      <>
      {console.log("date para examens: ", date)}
      <Card
          title="Listado de examenes"
          extra={<>
              {!hideDatetime && (
                  <>
                      <ClockCircleOutlined /> {" "} {onlyHour ? 'Hora:' : 'Fecha y Hora:'} {format(new Date(date.start), onlyHour ? 'h:mm a' : 'd MMMM, yyyy h:mm a', { locale: es })}
                  </>
              )}
          </>}>
          <span style={{ display: "flex", marginLeft: "20px", marginTop:"20px"}}>Resultados de Exámenes:</span>
          <div style={{ display: 'flex', padding: 12 , marginTop: "35px"}}>
              {/* muestra los tests */}
              { "associatedTests" in date.record && date.record.associatedTests.length > 0 && (
                  <div>
                     
                      {date.record.associatedTests.map((test: any, index: number) => (
                          <span key={index} style={{ display: "block" }}>
                              - Examen {index + 1}: {test.name}
                          </span>
                      ))}
                  </div>
              )}
              {/* //muestra los resultados */}
              {"testResults" in date.record && (
                  <>
                      {date.record.testResults.length > 0 && date.record.testResults.map((result: any, index:number) => (
                          <Button
                              type="primary"
                              icon={<EyeOutlined />}
                              href={result.url}
                              target="_blank"
                              style={{marginLeft:"20px"}}
                              key={index}
                          >
                              Resultado de examen {index + 1}: {result.name}
                          </Button>
                      ))
                      }
                  </>
              )}
          </div>
      </Card>
      </>
  )
}


const EmptyDate = ({ date, onlyHour, hideDatetime }: any) => {
  console.log('date', date)
  return (
      <Card title="No existe registro de resultado de exámenes en esta cita"
          extra={<>
              {!hideDatetime && (
                  <>
                      <ClockCircleOutlined /> {" "} {onlyHour ? 'Hora:' : 'Fecha y Hora:'} {format(new Date(date.start), onlyHour ? 'h:mm a' : 'd MMMM, yyyy h:mm a', { locale: es })}
                  </>
              )}
          </>}
          style={{display:"none"}}
          >
          <></>
      </Card>
  )
}

export const IndividualDate = ({ date, patient, onlyHour, hideDatetime }: any) => {
  console.log('date', date)
  const { firstname, lastname } = patient
  // const [examInfoShown, setExamInfoShown] = useState(false);
  // useEffect(() => {
  //     if (date.record !== null && "Test" in date.record) {
  //       setExamInfoShown(true);
  //     }
  //   }, [date.record]);

  return (
    <div>
      <>
        {"record" in date ? (
          <Row style={{ marginBottom: 12 }}>
            {date.record !== null && (
              <>
                {"Test" in date.record && date.record.Test.length > 0 || date.record.associatedTests.length > 0 ? (
                  <>
                    <Col span={24}>
                      <ExamInfo date={date} firstname={firstname} lastname={lastname} onlyHour={onlyHour} hideDatetime={hideDatetime} />
                    </Col>
                  </>
                ) : (
                  <Col span={24}>
                    <EmptyDate date={date} onlyHour={onlyHour} hideDatetime={hideDatetime} />
                  </Col>
                )}
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

const LastDate = ({ date, patient, onlyHour = false, hideDatetime = false }: any) => {
  console.log('last date', date)
  console.log('length', date.length)
  return (
      <div style={{ width: '100%' }}>
          {date.length === 1 && <IndividualDate date={date[0]} patient={patient} onlyHour={onlyHour} hideDatetime={hideDatetime} />}
          {date.length > 1 && date.map((dateItem: any) =>
              <IndividualDate date={dateItem} patient={patient} onlyHour={onlyHour} hideDatetime={hideDatetime} />)}
      </div>
  )
}


const ExamHistory = ({ selectedPatient }: IProps) => {
  const { firstname, lastname, email, dates } = selectedPatient;

  const [infoFromMain, setInfoFromMain] = useState({
    bornDate: "",
    bornPlace: "",
    civilState: "",
    address: "",
    phone: "",
  });

  const generateInfoFromMainRecord = () => {
    setInfoFromMain({
      bornDate: "",
      bornPlace: "",
      civilState: "",
      address: "",
      phone: "",
    })
    if (dates) {
      const datesWithRecords = dates.filter((date: any) => "record" in date);

      if (datesWithRecords.length === 0) {
        return false;
      }

      if (datesWithRecords.length > 0) {
        const mainRecord = datesWithRecords.find(
          (date: any) => date.record?.isMain
        );
        if (mainRecord) {
          console.log("mr", mainRecord);
          setInfoFromMain({
            bornDate: mainRecord.record.generalInfo.bornDate,
            bornPlace: mainRecord.record.generalInfo.bornPlace,
            civilState: mainRecord.record.generalInfo.civilState,
            address: mainRecord.record.contactInfo.address,
            phone: mainRecord.record.contactInfo.phone,
          });
        } else {
          return false;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    generateInfoFromMainRecord();
  }, [selectedPatient]);


  const [filteredDates, setFilteredDates] = useState<any>([])

  const [startDate, setStartDate] = useState<any>("")
  const [endDate, setEndDate] = useState<any>("")


  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    setStartDate(dateString[0])
    setEndDate(dateString[1])
  };


  const filterDates = () => {

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
        return b.start.localeCompare(a.start);
      };
      const sortedDates = dates.sort(comparareDates);

      console.log('sd', sortedDates)


      const gd = groupDates(sortedDates)

      if (gd !== false) {
        setTotalItems(gd.length)
        setFilteredDates(gd.slice(0, 5))
      }

      // setFilteredDates(dates)
      return;
    }





    if (startDate !== "" && endDate !== "") {
      const sd = moment(startDate)
      const ed = moment(endDate)
      const filtered = dates.filter((date: any) => moment(date.start).isBetween(sd, ed, 'days', '[]'));
      const comparareDates = (a: any, b: any) => {
        return b.start.localeCompare(a.start);
      };
      const sortedDates = filtered.sort(comparareDates);

      console.log('sd', sortedDates)


      const gd = groupDates(sortedDates)

      if (gd !== false) {
        setTotalItems(gd.length)
        setFilteredDates(gd)
      }

      // setFilteredDates(filtered)
    }

  }



  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  
  useEffect(() => {


    
    if (dates && dates.length > 0) {
      const comparareDates = (a: any, b: any) => {
        return b.start.localeCompare(a.start);
      };


      let sortedDates = dates.sort(comparareDates);
      if(filteredDates && filterDates.length>0){
        sortedDates = filteredDates.sort(comparareDates)
      }
      
      
      const gd = groupDates(sortedDates)

      if (gd !== false) {
        setTotalItems(gd.length)
        const start = page === 1 ? (page - 1) : (page - 1) * 5
        const end = start + 5
        setFilteredDates(gd.slice(start, end))
      }
    } else {
      setFilteredDates([])
    }
  }, [dates])


  const handlePage = (value: any) => {
      setPage(value)
  }



  return (
    <Row>
      <Col span={12} style={{ fontSize: 16, marginTop: 8 }}>
        <span style={{ display: "block", fontSize: 22, fontWeight: "bolder" }}>
          Nombre: {firstname} {lastname}
        </span>
        {infoFromMain.bornDate !== "" && (
          <>
            <span style={{ display: "block" }}>
              Fecha de nacimiento: {moment(infoFromMain.bornDate).format("D MMMM YYYY")}
            </span>
            <span style={{ display: "block" }}>Provincia: {infoFromMain.bornPlace}</span>
            <span style={{ display: "block" }}>Estado civil: {infoFromMain.civilState}</span>
          </>
        )}
      </Col>

      <Col span={12} style={{ fontSize: 16, marginTop: 8 }}>
        <span style={{ display: "block", fontSize: 22, fontWeight: "bolder" }}>
          Información de contacto
        </span>
        <span style={{ display: "block" }}>Email: {email}</span>
        {infoFromMain.bornDate !== "" && (
          <>
            <span style={{ display: "block" }}>Dirección: {infoFromMain.address}</span>
            <span style={{ display: "block" }}>Teléfono: {infoFromMain.phone}</span>
          </>
        )}
      </Col>

      <Col span={24}>
        <span style={{ display: "block", fontSize: 22, fontWeight: "bolder" }}>
          Examenes
        </span>

        <Space style={{ marginBottom: 8 }}>
          <DatePicker.RangePicker onChange={onChange} />
          <Button type="primary" onClick={filterDates}>Filtrar por fecha</Button>
        </Space>

        <Collapse accordion>
          {console.log(filteredDates)}
          {console.log(filteredDates.length)}
          {filteredDates &&
            filteredDates.length > 0 &&
            filteredDates.map((group: any, index: any) => {
              // Filtrar solo las citas generales
              const citasGenerales = group.filter(
                (item: any) => item.tipoAgenda === "Cita General"
              );

              // Verificar si hay al menos una cita general con associatedTests
              const hasAssociatedTests = citasGenerales.some(
                (cita: any) => cita.record?.associatedTests?.length > 0
              );

              // Mostrar el panel solo si hay citas generales con associatedTests en la fecha
              if (hasAssociatedTests) {
                return (
                  <Panel
                    style={{ width: "100%" }}
                    header={"Fecha: " + moment(group[0].start).format("D MMMM YYYY")}
                    key={group[0]._id}
                  >
                    <LastDate date={citasGenerales} patient={selectedPatient} onlyHour={true}/>
                  </Panel>
                );
              }

              // No hay citas generales con associatedTests en esta fecha
              return null;
            })}
        </Collapse>


        <Row justify="end" style={{ marginTop: 16 }} >
          <Col>
            <Pagination defaultCurrent={1} total={totalItems} defaultPageSize={5} onChange={handlePage} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ExamHistory;