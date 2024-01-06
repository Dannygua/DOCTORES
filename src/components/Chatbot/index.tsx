import { ChatOutlined } from "@mui/icons-material";
import './styles.css'
import { Form, Input, Spin, Tooltip } from "antd";
import { getData } from "../../services/common/getData";
import { useEffect, useState } from "react";
import { CloseOutlined, LeftOutlined } from "@ant-design/icons";


interface IQuestion {
    question: string
    answer: string
    active: boolean
}

const Chatbot = () => {
    const [openChat, setOpenChat] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const [questions, setQuestions] = useState<IQuestion[]>([])
    const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null)
    const [gettingAnswer, setGettingAnswer] = useState(false)

    const handleChat = () => {
        setOpenChat((prevState: boolean) => !prevState)
        setSelectedQuestion(null)
    }

    const getQuestions = async () => {
        setLoadingData(true);
        const request = await getData('api/frequentQuestions/?justActive=' + true)
        if (request.status) {
            setQuestions(request.data)
            setLoadingData(false)
        }
    }

    const handleSelectQuestion = (question: IQuestion) => {
        setGettingAnswer(true)
        setTimeout(() => {
            setSelectedQuestion(question)
            setGettingAnswer(false)
        }, 1000)
    }


    useEffect(() => {
        getQuestions()
    }, [])

    return (
        <div className="chatbot-container">

            {
                openChat && (
                    <div className="chat-container">
                        <div className="close-container" onClick={handleChat}>
                            <CloseOutlined />
                        </div>
                        <h4>Preguntas frecuentes</h4>
                        {
                            selectedQuestion === null && questions && questions.length > 0 &&
                            questions.map((question: IQuestion) => <div className="question-item"
                                onClick={() => handleSelectQuestion(question)}
                            >
                                <span>{question.question}</span>
                            </div>)
                        }
                        {
                            gettingAnswer && <Spin />
                        }
                        {
                            selectedQuestion !== null && (
                                <div>
                                    <div className="back-container" onClick={() => setSelectedQuestion(null)}>
                                        <LeftOutlined /> Volver
                                    </div>
                                    <div className="question-item">
                                        <span>{selectedQuestion.question}</span>
                                    </div>
                                    <div className="answer-item">
                                        <span>{selectedQuestion.answer}</span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )
            }

            <Tooltip title="Tienes alguna duda?" placement="left">
            <div className="icon-container" onClick={handleChat}>
                <ChatOutlined />
            </div>
            </Tooltip>

        </div>
    )
}

export default Chatbot; 