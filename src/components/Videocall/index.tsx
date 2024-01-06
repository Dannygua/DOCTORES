import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
    Constants,
    MeetingProvider,
    useMeeting,
    useParticipant,
} from "@videosdk.live/react-sdk";
// import { authToken, createMeeting } from "./API";
import ReactPlayer from "react-player";
import { putData } from "../../services/common/putData";
import { Button, Col, Row, Spin, message } from "antd";
import { CallContext } from "../../context/CallContext";
import { getData } from "../../services/common/getData";
import { EyeInvisibleOutlined, EyeOutlined, ShareAltOutlined } from "@ant-design/icons";
import { ExitToAppOutlined, MicExternalOff, MicExternalOn } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";

import { CiMicrophoneOn, CiMicrophoneOff } from "react-icons/ci";
import { BiCamera, BiCameraOff } from "react-icons/bi";
import { RxExit } from "react-icons/rx";
import { MdOutlineScreenShare } from "react-icons/md";
import { PiRecordFill } from "react-icons/pi";
import { PiStopCircleBold } from "react-icons/pi";


//Auth token we will use to generate a meeting and connect to it
export const authToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJmYjA1MmVlZC05ODQyLTRiMDgtYTE2Ny0wYWVjNTRmNTQxZjkiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwMDE1MjI5NCwiZXhwIjoxNzA3OTI4Mjk0fQ.VbG5HSULSsAx4vSZbXlLe1BkS9JXgkZ3cibgy1hYbhc"

// API call to create meeting
export const createMeeting = async ({ token }: { token: string }) => {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
        method: "POST",
        headers: {
            authorization: `${authToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });
    //Destructuring the roomId from the response
    const { roomId }: { roomId: string } = await res.json();
    return roomId;
};

function JoinScreen({
    getMeetingAndToken,
}: {
    getMeetingAndToken: (meeting?: string) => void;
}) {
    const [meetingId, setMeetingId] = useState<string | undefined>();
    const onClick = async () => {
        getMeetingAndToken(meetingId);
    };
    return (
        <div>
            <input
                type="text"
                placeholder="Enter Meeting Id"
                onChange={(e) => {
                    setMeetingId(e.target.value);
                }}
            />
            <button onClick={onClick}>Join</button>
            {" or "}
            <button onClick={onClick}>Create Meeting</button>
        </div>
    );
}

function ParticipantView({ participantId }: { participantId: string }) {
    const micRef: any = useRef();
    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName, screenShareStream, screenShareOn } =
        useParticipant(participantId);

    const { user }: any = useContext(AuthContext)

    const videoStream = useMemo(() => {
        if (webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            console.log('mediastream', mediaStream)
            return mediaStream;
        } else {
            console.log('no cam')
        }
    }, [webcamStream, webcamOn]);

    const screenStream = useMemo(() => {
        if (screenShareOn && screenShareStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(screenShareStream.track);
            console.log('mediastream', mediaStream)
            return mediaStream;
        } else {
            console.log('no screen')
        }
    }, [screenShareStream, screenShareOn]);

    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);

                micRef.current.srcObject = mediaStream;
                micRef.current
                    .play()
                    .catch((error: any) =>
                        console.error("videoElem.current.play() failed", error)
                    );
            } else {
                console.log('no mic')
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);

    return (
        <div key={participantId}>
            <audio ref={micRef} autoPlay muted={isLocal} />


            <div>

                {webcamOn ? (
                    <ReactPlayer
                        //
                        playsinline // very very imp prop
                        pip={false}
                        light={false}
                        controls={false}
                        muted={true}
                        playing={true}
                        //
                        url={videoStream}
                        //
                        height={"100%"}
                        width={"100%"}
                        onError={(err) => {
                            console.log(err, "participant video error");
                        }}
                    />
                ) : (
                    <div>
                        {user.firstname}
                    </div>
                )}

            </div>





        </div >
    );
}

const ScreenView = ({ participantId }: { participantId: string }) => {
    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName, screenShareStream, screenShareOn } =
        useParticipant(participantId);


    const screenStream = useMemo(() => {
        if (screenShareOn && screenShareStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(screenShareStream.track);
            console.log('mediastream', mediaStream)
            return mediaStream;
        } else {
            console.log('no screen')
        }
    }, [screenShareStream, screenShareOn]);


    return (
        <div>
            {screenShareOn && (
                <ReactPlayer
                    //
                    playsinline // very very imp prop
                    pip={false}
                    light={false}
                    controls={false}
                    muted={true}
                    playing={true}
                    //
                    url={screenStream}
                    //
                    height={"100%"}
                    width={"100%"}
                    onError={(err) => {
                        console.log(err, "participant video error");
                    }}
                />
            )}
        </div>
    )
}

function Controls() {

    const { call } = useContext(CallContext)

    console.log('call', call)

    const getRecordings = async () => {
        const options = {
            method: "GET",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            },
        };
        const url = `https://api.videosdk.live/v2/recordings?roomId=${meetingId}`;
        const response = await fetch(url, options);
        const data = await response.json();
        console.log('data', data);
        if ('data' in data) {
            if (data.data.length > 0) {
                const fileUrl = data.data[0].file.fileUrl
                const request = await putData('api/dates/' + call, {
                    callUrl: fileUrl
                })

                if (request.status) {
                    message.success("Llamada guardada correctamente!")
                }
            }
        }
    }

    function onRecordingStateChanged(data: any) {
        const { status } = data;

        if (status === Constants.recordingEvents.RECORDING_STARTING) {
            console.log("Meeting recording is starting");
        } else if (status === Constants.recordingEvents.RECORDING_STARTED) {
            console.log("Meeting recording is started");
        } else if (status === Constants.recordingEvents.RECORDING_STOPPING) {
            console.log("Meeting recording is stopping");
        } else if (status === Constants.recordingEvents.RECORDING_STOPPED) {
            console.log("Meeting recording is stopped");
            getRecordings()
        }



    }


    const [isActiveMic, setIsActiveMic] = useState(true)
    const [isActiveCam, setIsActiveCam] = useState(true)
    const [isSharing, setIsSharing] = useState(true)

    const { leave, toggleMic, toggleWebcam, toggleScreenShare, startRecording, isRecording, stopRecording, meetingId } = useMeeting({
        onRecordingStateChanged
    });

    const handleRecord = () => {

        const config: any = {
            layout: {
                type: "SPOTLIGHT",
                priority: "PIN",
                gridSize: 9,
            },
            theme: "DEFAULT",
        };

        startRecording(undefined, undefined, config);
    }

    const handleMic = () => {
        toggleMic()
        setIsActiveMic((prevState) => !prevState)
    }

    const handleCam = () => {
        toggleWebcam()
        setIsActiveCam((prevState) => !prevState)
    }

    const handleShare = () => {
        toggleScreenShare()
        setIsSharing((prevState) => !prevState)
    }

    const handleLeave = () => {
        leave()
        window.location.href = ""
    }

    return (
        <div style={{ marginTop: 12 }}>
            <Button style={{ width: '20%' }} type={!isActiveMic ? "primary" : undefined} onClick={() => handleMic()} icon={!isActiveMic ? <CiMicrophoneOff size={20} /> : <CiMicrophoneOn size={20} />} />
            <Button style={{ width: '20%' }} type={!isActiveCam ? "primary" : undefined} onClick={() => handleCam()} icon={!isActiveCam ? <BiCameraOff size={20} /> : <BiCamera size={20} />} />
            <Button style={{ width: '20%' }} type="primary" onClick={() => handleLeave()} icon={<RxExit size={20} />} />
            <Button style={{ width: '20%' }} type={!isSharing ? "primary" : undefined} onClick={() => handleShare()} icon={<MdOutlineScreenShare size={20} />} />
            {!isRecording ? <Button style={{ width: '20%' }} type="primary" onClick={handleRecord} icon={<PiRecordFill size={20} />} /> : (
                <Button style={{ width: '20%' }} type={undefined} onClick={() => stopRecording()} icon={<PiStopCircleBold size={20} />} />
            )}
        </div>
    );
}


function MeetingView({
    onMeetingLeave,
    meetingId,
}: {
    onMeetingLeave: () => void,
    meetingId: string,
}) {
    const [joined, setJoined] = useState<any>(null);
    //Get the method which will be used to join the meeting.
    //We will also get the participants list to display all participants
    const { join, participants } = useMeeting({
        //callback for when meeting is joined successfully
        onMeetingJoined: () => {
            setJoined("JOINED");
        },
        //callback for when meeting is left
        onMeetingLeft: () => {
            onMeetingLeave();
        },
    });
    const joinMeeting = () => {
        setJoined("JOINING");
        join();
    };


    return (
        <div style={{ height: '100%' }}>
            {joined && joined !== "JOINED" && (
                <div style={{ height: 400 }}>
                    <h3>Todo listo para unirse!</h3>
                </div>
            )}
            {joined && joined === "JOINED" ? (
                <div style={{ height: '100%' }}>
                    <Row>
                        {[...participants.keys()].map((participantId: any) => (
                            <Col span={8} style={{ color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#007E85' }}>
                                <ParticipantView
                                    participantId={participantId}
                                    key={participantId}
                                />
                            </Col>

                        ))}
                    </Row>
                    {[...participants.keys()].map((participantId: any) => (
                        <ScreenView
                            participantId={participantId}
                            key={participantId}
                        />

                    ))}
                    <Controls />
                </div>
            ) : joined && joined === "JOINING" ? (
                <div style={{ height: 400 }}>
                    <p>Ingresando a la reunión</p>
                </div>
            ) : (
                <div style={{ height: 400 }}>
                    <Button type="primary" onClick={joinMeeting}>Unirse</Button>
                </div>
            )}
        </div>
    );
}

function Videocall() {
    const [meetingId, setMeetingId] = useState<any>(null);
    const { call }: any = useContext(CallContext)

    //Getting the meeting id by calling the api we just wrote
    const getMeetingAndToken = async (id?: string) => {

        console.log('getting date')

        const getDate = await getData('api/dates/' + call)

        if (getDate.status) {
            console.log('callId from DB', getDate.data.callId)
            const callIdFromDB = getDate?.data?.callId || ""
            if (callIdFromDB === "") {
                console.log('Crear sala')
                const meetingId = await createMeeting({ token: authToken })
                const saveCallId = await putData('api/dates/' + call, {
                    callId: meetingId
                })
                if (saveCallId.status) {
                    setMeetingId(meetingId);
                    return;
                }
            } else {
                console.log('Ingresar a sala')
                const meetingId = callIdFromDB;
                setMeetingId(meetingId)
                return;
            }
            return;
        }
        message.error("Ha existido un error detectando si la cita existe")
    };

    //This will set Meeting Id to null when meeting is left or ended
    const onMeetingLeave = () => {
        setMeetingId(null);
    };

    useEffect(() => {
        getMeetingAndToken()
    }, [])

    return authToken && meetingId ? (
        <MeetingProvider
            config={{
                meetingId,
                micEnabled: true,
                webcamEnabled: true,
                name: "Bypass gastrico EC",
            }}
            token={authToken}
        >
            <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
        </MeetingProvider>
    ) : (
        <Spin />
    );
}

export default Videocall;