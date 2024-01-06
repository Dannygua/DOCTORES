import { useState, useEffect, useContext, useRef } from "react";
import { Card, Col, Dropdown, InputRef, MenuProps, Row, Space, Tag, message } from "antd";
import { Button, Input, Table, Modal, Tooltip } from "antd";
import { postData } from "../../../services/common/postData";
import { getData } from "../../../services/common/getData";
import PatientHistory from "../../../components/PatientHistory";
import ExamHistory from "../../../components/ExamHistory";
import Report from "../../../components/Report";
import { AuthContext } from "../../../context/AuthContext";
import {
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";
import './styles.css'
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import ModalHeader from "../../../components/ModalHeader";
import { isMobile } from "react-device-detect";

const MyDrop = ({ record, changeState, user, showModal, showInformModal, showExamModal }: any) => {
  let docItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a rel="noopener noreferrer" onClick={() => changeState(record._id)}>
          {record.active ? "Desactivar" : "Activar"}
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={() => showModal(record)} >
          Historia médica
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={() => showInformModal(record)} >
          Informe analítico
        </a>
      ),
    },
    {
      key: '4',
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={() => showExamModal(record)} >
          Resultados de exámenes 
        </a>
      ),
    },
  ];



  let items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={() => showModal(record)} >
          Historia médica
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={() => showInformModal(record)} >
          Informe analítico
        </a>
      ),
    },
  ];


  return (
    <Dropdown
      menu={{ items: user.isDoctor ? docItems : items }}
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

const PatientsPage = () => {
  const { user }: any = useContext(AuthContext);
  const [loadingData, setLoadingData] = useState(false);
  const [initialData, setInitialData] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>({});
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const [isInformOpen, setIsInformOpen] = useState(false);

  const ChangeState = async (id: any) => {
    try {
      const request = await postData("api/users/changestate", { id: id });

      if (request.status) {
        handleCancel();
        message.success("Cambio de estado exitoso");
      }

      const patientIndex = patients.findIndex((patient: any) => patient._id === id)
      if (patientIndex !== -1) {
        const copy = [...patients]
        copy[patientIndex].active = !copy[patientIndex].active
        setPatients(copy)
      }

    } catch (error) {
      console.log(error);
    }
  };

  const getPatients = async (search: string) => {
    setLoadingData(true);
    const requestPatients = await getData("api/users/searchPatients?search=" + search);
    if (requestPatients.status) {
      setPatients(requestPatients.data);
      setInitialData(requestPatients.data);
      setLoadingData(false);
      return;
    }
    setLoadingData(false)
  };

  /*useEffect(() => {
    getPatients();
  }, []);*/

  const showModal = (record: any) => {
    setSelectedPatient(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setSelectedPatient({});
    setIsModalOpen(false);
  };

  const showInformModal = (record: any) => {
    setSelectedPatient(record);
    setIsInformOpen(true);
  };

  const handleCancelInformModal = () => {
    setSelectedPatient({});
    setIsInformOpen(false);
  }

  const showExamModal = (record: any) => {
    setSelectedPatient(record);
    setIsExamModalOpen(true);
  }

  const handleCancelExamModal = () => {
    setSelectedPatient({});
    setIsExamModalOpen(false);
  }


  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  interface DataType {
    key: string;
    firstname: string;
    lastname: string;
    email: string;
    active: boolean;
  }

  type DataIndex = keyof DataType;

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar...`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      console.log('dataIndex', dataIndex)
      console.log('record', record)
      if (dataIndex in record) {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase())
      }
      return false
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre",
      dataIndex: "firstname",
      key: "firstname",
      width: "30%",
      /*...getColumnSearchProps('firstname'),
       sorter: (a, b) => a.firstname.localeCompare(b.firstname)
       */
    },
    {
      title: "Apellido",
      dataIndex: "lastname",
      key: "lastname",
      width: "20%",
      /*...getColumnSearchProps('lastname'),
      sorter: (a, b) => a.lastname.localeCompare(b.lastname)
      */
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["lg", "xl", "xxl"],
      /*...getColumnSearchProps('email'),
      sorter: (a, b) => a.email.localeCompare(b.email)*/
    },
    {
      title: "Estado",
      key: "active",
      width: "20%",
      render: (record) => (
        <p>
          {record.active ? (
            <Tag color="blue">Activo</Tag>
          ) : (
            <Tag color="red">Inactivo</Tag>
          )}
        </p>
      ),
      responsive: ["lg", "xl", "xxl"],
      /*filters: [
        {
          text: 'Activo',
          value: 'A',
        },
        {
          text: 'Inactivo',
          value: 'I',
        },
      ],
      onFilter: (value: any, record) => {
        let parsedValue = value === "I" ? false : true
        return record.active === parsedValue
      },*/
    },
    {
      title: "Acciones",
      dataIndex: "",
      key: "x",
      render: (record) => (
        <div>
          <MyDrop
            record={record}
            changeState={ChangeState}
            user={user}
            showModal={showModal}
            showInformModal={showInformModal}
            showExamModal={showExamModal}
          />
        </div>
      ),
    },
  ];


  const getModalTitle = (baseTitle: string) => {
    if ("firstname" in selectedPatient) {
      const { firstname, lastname } = selectedPatient
      return baseTitle + " de: " + firstname + " " + lastname
    }
    return baseTitle
  }

  const [searchValue, setSearchValue] = useState('')

  return (
    <Card title="Pacientes">
      <Row style={{ marginBottom: 12 }}>
        <Col span={8}>
          <Input
            allowClear={true}
            placeholder="Buscar por nombre, apellido o email..."
            onChange={(e) => {
              const value = e.target.value;
              setSearchValue(value)
              setPatients([])
              setInitialData([])

              if (value.length >= 3) {
                getPatients(value)
              }
            }}
          />
        </Col>
      </Row>
      <Table loading={loadingData} columns={columns} dataSource={searchValue.length === 0 ? [] : patients} />
      <Modal
        title={<ModalHeader title={getModalTitle("Historia médica")} />}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={ isMobile ? "100%" : "60%"}
        maskClosable={false}
      >
        <PatientHistory selectedPatient={selectedPatient} 
        />
      </Modal>

      <Modal
        title={<ModalHeader title={getModalTitle("Informe Analítico")} />}
        open={isInformOpen}
        onCancel={handleCancelInformModal}
        footer={null}
        width={ isMobile ? "100%" : "60%"}
        maskClosable={false}
      >
        <Report selectedPatient={selectedPatient} />
      </Modal>
      
      <Modal
        title={<ModalHeader title={getModalTitle("Historial exámenes")} />}
        open={isExamModalOpen}
        onCancel={handleCancelExamModal}
        footer={null}
        width={ isMobile ? "100%" : "60%"}
        maskClosable={false}
      >
        <ExamHistory selectedPatient={selectedPatient} 
        />
      </Modal>
    </Card>
  );
};

export default PatientsPage;
