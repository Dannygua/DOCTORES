import React, { useContext, useEffect, useRef } from 'react';
import { CallContext } from '../../context/CallContext';
import { AuthContext } from '../../context/AuthContext';
import { Card, Typography } from 'antd';


const VideoCall = () => {
  const containerRef = useRef();
  let api = {}

  const { leave, call, isActive } = useContext(CallContext)

  const { user } = useContext(AuthContext)

  console.log('call', call)
  useEffect(() => {
    const domain = 'meet.jit.si';
    const options = {
      roomName: call ? call : 'J1T$I_M33T',
      parentNode: containerRef.current,
      configOverwrite: {
        prejoinPageEnabled: false,
        buttonsWithNotifyClick: ['hangup']
      },
      interfaceConfigOverwrite: {
        // overwrite interface properties if you want
      },
      lang: 'es',
      userInfo: {
        email: user.email,
        displayName: user.firstname
      }
    };

    /*api = new window.JitsiMeetExternalAPI("8x8.vc", {
      roomName: "vpaas-magic-cookie-b8718f4a901c446fb269aad6eb41a81d/Bypassgastrico",
      parentNode: containerRef.current,
      configOverwrite: { prejoinPageEnabled: false, buttonsWithNotifyClick: ['hangup'] },
      interfaceConfigOverwrite: {
      },
      // Make sure to include a JWT if you intend to record,
      // make outbound calls or use any other premium features!
      jwt: "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtYjg3MThmNGE5MDFjNDQ2ZmIyNjlhYWQ2ZWI0MWE4MWQvNmE0MzI0LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE2ODk5Mjg3MTQsImV4cCI6MTY4OTkzNTkxNCwibmJmIjoxNjg5OTI4NzA5LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtYjg3MThmNGE5MDFjNDQ2ZmIyNjlhYWQ2ZWI0MWE4MWQiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJvdXRib3VuZC1jYWxsIjpmYWxzZSwic2lwLW91dGJvdW5kLWNhbGwiOmZhbHNlLCJ0cmFuc2NyaXB0aW9uIjpmYWxzZSwicmVjb3JkaW5nIjpmYWxzZX0sInVzZXIiOnsiaGlkZGVuLWZyb20tcmVjb3JkZXIiOmZhbHNlLCJtb2RlcmF0b3IiOnRydWUsIm5hbWUiOiJUZXN0IFVzZXIiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTEwOTc5ODM0NjY4MDI3OTEyODc1IiwiYXZhdGFyIjoiIiwiZW1haWwiOiJ0ZXN0LnVzZXJAY29tcGFueS5jb20ifX0sInJvb20iOiIqIn0.d_W1mFjXQDXA1nMlXXkJ2faBVRkkwPKcf6A1OmNt3ord4mqedVSBuUg2bSb00z9YUdcyE93Hcb-0LrZyvTgMKYJdkRyAS9aPeAQ-IObjgg4BBuz9QQH5BojpSJx3v0FRI_-awSThkzR0aaCIVq8_q0vrc97XAkbRwEbhFd3OOuJdb5wI_wl7Z6-dtQzI_7gBgV6LTSCfICv4uqJheyeSLH9Iyl0fM1adcHFdPMTMI_y4P8iRzn1plVWvJrKO4b2A3YI-RRpQKxu7yAn94eZjkGooHVJuDyAvQeYh2eQ82WjRjimx92UKXAhqocdj-2qGM0vS5e8ak0ZOUGQN-CD68g",
      lang: 'es'
    });*/

    api = new window.JitsiMeetExternalAPI(domain, options)


    api.addListener("toolbarButtonClicked", function (e) {
      console.log("toolbarButtonClicked triggered with", e);

      if (e.key === 'hangup') {
        console.log("Before hangup command");
        api.executeCommand('hangup');
        const frame = document.getElementById("jitsiConferenceFrame0")
        console.log('frame', frame)
        if(frame!==null){
          frame.style.display = "none"
        }
        leave()
      }
    });

    return () => {
      api.dispose();
    };
  }, []);




  return (
      <>
      {
        (call!== null && isActive) ? 
        
        <div ref={containerRef} style={{ height: '90vh', width: '100%' }} />
        :
        <div style={{ display: 'flex', flexDirection:'column', justifyContent:'center', alignItems: 'center', height: '80vh' }} >
          <img src="https://imgtr.ee/images/2023/07/21/82455d36fee03199e06d12216b728bd4.png" alt="82455d36fee03199e06d12216b728bd4.png" border="0" style={{ width: 240, height: 240 }} />
          <Typography.Title>Gracias por asistir a tu cita!</Typography.Title>
        </div>
      }
      </>
  )
};

export default VideoCall;