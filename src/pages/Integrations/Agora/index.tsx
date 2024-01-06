import AgoraUIKit from 'agora-react-uikit';
import { Button } from 'antd';
import {useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';


const Agora = () => {
  const navigate = useNavigate()
    
  let { channel="test" } = useParams();
    
    const [videoCall, setVideoCall] = useState(true)
    const rtcProps = {    
        appId: 'c4ad672c0b2d42b5abe0ee24eae25b36', 
        channel: channel,
        token: null
    };
  
    const callbacks = {
      EndCall: () => {
        setVideoCall(false)
      }
    };
    
    return videoCall ? (
      <div style={{display: 'flex', height: 800}}>
        <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
      </div>
    ):(
      <div style={{ display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <h3>Gracias por asistir a la cita!</h3>
        <img src={'/jump2.png'} alt="ABC" style={{ width: '50%' }} /> 
      </div>
    )
};

export default Agora; 