import { useState, useEffect, useRef } from "react";
import { Card, Col, Dropdown, InputRef, MenuProps, Row, Space, Tag, message } from "antd";
import { Button, Input, Table, Modal, Tooltip } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import { postData } from "../../../services/common/postData";
import { getData } from "../../../services/common/getData";
import PersonalForm from "../../../components/Forms/PersonalForm";
import { CheckOutlined, CloseOutlined, DownOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { isMobile } from "react-device-detect";


const MyDrop = ({ record, changeState }: any) => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a rel="noopener noreferrer" onClick={() => changeState(record._id)}>
          {record.active ? "Desactivar" : "Activar"}
        </a>
      ),
    },
  ];

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

const PersonalPage = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [initialData, setInitialData] = useState<any[]>([]);
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ChangeState = async (id: any) => {
    try {
      const request = await postData("api/users/changestate", { id: id });

      if (request.status) {
        handleCancel();
        message.success("Cambio de estado exitoso");
      }

      const UpdateSpecialits = specialists.map((proyectoState) =>
        proyectoState._id === request.msg._id ? request.msg : proyectoState
      );
      setSpecialists(UpdateSpecialits);
    } catch (error) {
      console.log(error);
    }
  };


  const getSpecialists = async (search: string) => {
    setLoadingData(true);
    const requestPatients = await getData("api/users/searchSpecialists?search=" + search);
    if (requestPatients.status) {
      setSpecialists(requestPatients.data);
      setInitialData(requestPatients.data);
      setLoadingData(false);
      return;
    }
    setLoadingData(false)
  };

  /*
  useEffect(() => {
    getSpecialists();
  }, []);
  */


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  //FILTERS
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  interface DataType {
    key: string;
    firstname: string;
    lastname: string;
    email: string;
    active: boolean;
    isNutri: boolean;
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
  //END FILTERS

  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre",
      dataIndex: "firstname",
      key: "name",
      width: "30%",
      /*...getColumnSearchProps('firstname'),
      sorter: (a, b) =>  a.firstname.localeCompare(b.firstname)*/
    },
    {
      title: "Apellido",
      dataIndex: "lastname",
      key: "age",
      width: "20%",
      /*...getColumnSearchProps('lastname'),
      sorter: (a, b) =>  a.lastname.localeCompare(b.lastname)*/
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "address",
      responsive: ["lg", "xl", "xxl"],
      /*...getColumnSearchProps('email'),
      sorter: (a, b) =>  a.email.localeCompare(b.email)*/
    },
    {
      title: "Especialidad",
      key: "isNutri",
      width: "20%",
      render: (record) => (
        <p>
          {record.isNutri && (
            <Tag color="green">Nutriologo</Tag>
          )}
          {record.isPychologist && (
            <Tag color="purple">Psicologo</Tag>
          )}
          {record.isDoctor && (
            <Tag color="blue">Doctor</Tag>
          )}
        </p>
      ),
      responsive: ["lg", "xl", "xxl"],
      /*filters: [
        {
          text: 'Nutriólogo',
          value: 'N',
        },
        {
          text: 'Psicólogo',
          value: 'P',
        },
      ],
      onFilter: (value: any, record) => {
        return value==="N" ? record.isNutri : !record.isNutri
      },*/
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
          {!record.isDoctor && (
            <MyDrop
              record={record}
              changeState={ChangeState}
            />
          )}
        </div>
      ),
    },
  ];

  const [searchValue, setSearchValue] = useState('')

  return (
    <Card
      title="Personal"
      extra={
        <Tooltip placement="topLeft" title="Agregar Especialista">
          <Button
            onClick={showModal}
            type="primary"
          >
            <PlusOutlined /> Agregar
          </Button>
        </Tooltip>
      }
    >
      <Row style={{ marginBottom: 12 }}>
        <Col span={8}>
          <Input
            allowClear={true}
            placeholder="Buscar por nombre, apellido o email..."
            onChange={(e) => {
              const value = e.target.value;
              setSearchValue(value)
              setSpecialists([])
              setInitialData([])

              if (value.length >= 3) {
                getSpecialists(value)
              }
            }}
          />
        </Col>
      </Row>
      <Table loading={loadingData} columns={columns} dataSource={searchValue.length === 0 ? [] : specialists} />
      <Modal
        title="Nuevo Especialista"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={isMobile ? "100%" : "60%"}
      >
        <PersonalForm
          handleCancel={handleCancel}
          setSpecialists={setSpecialists}
          specialists={specialists}
        />
      </Modal>
    </Card>
  );
};

export default PersonalPage;
