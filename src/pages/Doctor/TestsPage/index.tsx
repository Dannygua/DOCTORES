import { useState, useEffect, useRef } from "react";
import { Card, Form, Tag, InputRef, Space } from "antd";
import { Button, Input, Table, Modal } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import { getData } from "../../../services/common/getData";
import QuestionForm from "../../../components/Forms/QuestionForm";
import Highlighter from "react-highlight-words";
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { isMobile } from "react-device-detect";
import TestForm from "../../../components/Forms/TestForm";

const TestsPage = () => {
    const [loadingData, setLoadingData] = useState(false);
    const [initialData, setInitialData] = useState<any[]>([]);
    const [tests, setTests] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTest, setSelectedTest] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [form] = Form.useForm();

    const getTests = async () => {
        setLoadingData(true);
        const requestQuestions = await getData("api/tests/?justActive=" + false);
        if (requestQuestions.status) {
            setTests(requestQuestions.data);
            setInitialData(requestQuestions.data);
        }
        setLoadingData(false);
    };
    useEffect(() => {
        getTests();
    }, [refresh]);

    const showModal = (record: any) => {
        setSelectedTest(record)
        setIsModalOpen(true);
        form.setFieldValue('name', record.name)
        form.setFieldValue('active', record.active)
 
    };

    const handleCancel = () => {
        setSelectedTest({})
        setIsModalOpen(false);
        form.resetFields()
    };

    //FILTERS
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    interface DataType {
        key: string;
        name: string
        active: boolean
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
            dataIndex: "name",
            key: "name",
            width: "30%",
            ...getColumnSearchProps("name"),
            sorter: (a, b) =>  a.name.localeCompare(b.name)    
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
            filters: [
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
            },
        },
        {
            title: "Acciones",
            dataIndex: "",
            key: "x",
            render: (record) => (
                <Button
                    onClick={() => showModal(record)}
                    type="primary"
                    style={{ marginBottom: 16 }}
                >
                    Editar
                </Button>

            ),
        },
    ];


    return (
        <Card title="Exámenes" extra={<Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined /> Agregar</Button>}>
            <Table loading={loadingData} columns={columns} dataSource={tests} />
            <Modal
                title={'name' in selectedTest ? 'Editar exámen' : 'Nuevo exámen'}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={ isMobile ? "100%" : "60%"}            
            >
                <TestForm  selectedTest={selectedTest} setRefresh={setRefresh} handleCancel={handleCancel} form={form} />
            </Modal>
        </Card>
    );
};

export default TestsPage;


