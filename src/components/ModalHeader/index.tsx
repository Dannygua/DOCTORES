import { Col, Row, Typography } from 'antd'

const ModalHeader = ({ title, inSubmodal = false }: any) => {
    return (
        <>
            {
                inSubmodal ?
                    (
                        <Row style={{ marginTop: 24 }} >
                            <Col span={24}>
                                <img src="./logo.jpg" alt="" style={{ width: '100%' }} />
                            </Col>
                            <Col span={24} style={{ textAlign: 'center', background: '#007E85' }}>
                                <Typography.Text style={{ color: 'white', fontSize: 20 }}>{title}</Typography.Text>
                            </Col>
                        </Row >
                    )
                    :
                    (

                        <Row style={{ marginTop: 24 }}>
                            <Col xxl={4} xl={4} lg={4} md={4} sm={24} xs={24}>
                                <img src="./logo.jpg" alt="" style={{ width: '100%' }} />
                            </Col>
                            <Col xxl={20} xl={20} lg={20} md={20} sm={24} xs={24} style={{ textAlign: 'center', background: '#007E85' }}>
                                <Typography.Title style={{ color: 'white' }}>{title}</Typography.Title>
                            </Col>
                        </Row>
                    )
            }
        </>
    )

}

export default ModalHeader