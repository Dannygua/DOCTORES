import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { getData } from "../../services/common/getData"
import { Spin, Typography } from "antd"

const Mymesh = () => {
    const [lastSimulation, setLastSimulation] = useState<undefined | any>()
    const [loading, setLoading] = useState(false)
    const { user }: any = useContext(AuthContext)

    const getLastSimulation = async () => {
        setLoading(true)
        const request = await getData('api/simulations/byPatient/' + user._id)
        if (request.status) {
            setLastSimulation(request.data[0])
            setLoading(false)
        }
    }

    useEffect(() => {
        getLastSimulation()
    }, [])

    return (
        <div>
            {loading ? <Spin /> : (
                <div>
                    {typeof (lastSimulation) !== "undefined" ? (
                        lastSimulation.simlationPhoto.includes("meshcapade") ?
                            <embed src={lastSimulation && lastSimulation.simlationPhoto} style={{ width: '100%', height: 900, marginTop: 20 }} />
                            :
                            <img src={lastSimulation && lastSimulation.simlationPhoto} alt="Bad URI" height={800}
                                style={{ width: '100%' }} />
                    ) : (
                        <Typography.Title>No existen simulaciones a su nombre</Typography.Title>
                    )}

                </div>
            )}
        </div>
    )
}

export default Mymesh