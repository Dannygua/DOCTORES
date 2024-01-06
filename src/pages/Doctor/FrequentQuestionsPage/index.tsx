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

const FrequentQuestionsPage = () => {
    const [loadingData, setLoadingData] = useState(false);
    const [initialData, setInitialData] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [form] = Form.useForm();

    const getQuestions = async () => {
        setLoadingData(true);
        const requestQuestions = await getData("api/frequentQuestions/?justActive=" + false);
        if (requestQuestions.status) {
            setQuestions(requestQuestions.data);
            setInitialData(requestQuestions.data);
        }
        setLoadingData(false);
    };
    useEffect(() => {
        getQuestions();
    }, [refresh]);

    const showModal = (record: any) => {
        setSelectedQuestion(record)
        setIsModalOpen(true);
        form.setFieldValue('question', record.question)
        form.setFieldValue('answer', record.answer)
        form.setFieldValue('active', record.active)
    };

    const handleCancel = () => {
        setSelectedQuestion({})
        setIsModalOpen(false);
        form.resetFields()
    };

    //FILTERS
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    interface DataType {
        key: string;
        question: string;
        answer: string;
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
    //END FILTERS

    const columns: ColumnsType<DataType> = [
        {
            title: "Pregunta",
            dataIndex: "question",
            key: "question",
            width: "30%",
            ...getColumnSearchProps("question"),
            sorter: (a, b) =>  a.question.localeCompare(b.question)    
        },
        {
            title: "Respuesta",
            dataIndex: "answer",
            key: "answer",
            width: "30%",
            responsive: ["lg", "xl", "xxl"],
            ...getColumnSearchProps("answer"),
            sorter: (a, b) =>  a.answer.localeCompare(b.answer)
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
        <Card title="Preguntas frecuentes" extra={<Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined /> Agregar</Button>}>
            <Table loading={loadingData} columns={columns} dataSource={questions} />
            <Modal
                title={'question' in selectedQuestion ? 'Editar pregunta' : 'Nueva pregunta'}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={ isMobile ? "100%" : "60%"}            
            >
                <QuestionForm selectedQuestion={selectedQuestion} setRefresh={setRefresh} handleCancel={handleCancel} form={form} />
            </Modal>
        </Card>
    );
};

export default FrequentQuestionsPage;


