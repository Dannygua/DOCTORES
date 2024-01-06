import { Row, Col, Collapse, Button, DatePicker, DatePickerProps, message, Space, Typography, List, Pagination } from "antd";
import moment from "moment";
import "moment/locale/es";
import { useEffect, useState } from "react";
import "./styles.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Recepepdf from "../PDF/Recepepdf";
import { RangePickerProps } from "antd/es/date-picker";
import ModalHeader from "../ModalHeader";
import LastDate from "../LastDate";
import { groupDates } from "../../utils/dates";
const { Panel } = Collapse;

interface IProps {
  selectedPatient: any;
}

const PatientHistory = ({ selectedPatient }: IProps) => {
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
          Citas
        </span>

        <Space style={{ marginBottom: 8 }}>
          <DatePicker.RangePicker onChange={onChange} />
          <Button type="primary" onClick={filterDates}>Filtrar por fecha</Button>
        </Space>

        <Collapse accordion>
          {filteredDates && filteredDates.length > 0 && filteredDates.map((group: any, index: any) => (
            <Panel
              style={{ width: "100%" }}
              header={
                "Fecha: " + moment(group[0].start).format("D MMMM YYYY")
              }
              key={group[0]._id}
            >
              <LastDate date={group} patient={selectedPatient} onlyHour={true} />
            </Panel>
          ))}
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

export default PatientHistory;