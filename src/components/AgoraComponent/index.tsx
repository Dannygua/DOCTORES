// App.js
import React, { useState, useEffect, useContext } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { postData } from '../../services/common/postData';
import { NewCallContext } from '../../context/NewCallContext';
import { Button, Drawer, Modal, Tooltip } from 'antd';
import { CancelOutlined, ShareOutlined } from '@mui/icons-material';
import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined, LogoutOutlined } from '@ant-design/icons';

const AgoraComponent = () => {

    const [client, setClient] = useState<any>(null);
    /*
    const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);
    const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
    
    const [localScreenTrack, setLocalScreenTrack] = useState<any>(null); // Estado para el track de pantalla compartida
    */
    const [joinSuccess, setJoinSuccess] = useState<any>(false);

    const [client2, setClient2] = useState<any>(null)



    /*
    useEffect(() => {
        const agoraAppId = 'bca03b41035d4ca78a76ba456cc67ed9';
        setClient(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
        setClient2(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));

        (async () => {
            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            const videoTrack = await AgoraRTC.createCameraVideoTrack();
            setLocalAudioTrack(audioTrack);
            setLocalVideoTrack(videoTrack);

            // Configurar los eventos en el cliente AgoraRTC
            client.on('user-published', handleUserPublished);
            client.on('user-unpublished', handleUserUnpublished);

            // ... (código anterior)
        })();

        return () => {
            // Eliminar los eventos al desmontar el componente
            client.off('user-published', handleUserPublished);
            client.off('user-unpublished', handleUserUnpublished);

            localAudioTrack && localAudioTrack.stop();
            localVideoTrack && localVideoTrack.stop();
            client && client.leave();
        };
    }, []);*/


    // Lógica para obtener el token de Agora desde el backend

    const generateAgoraToken = async (channelName: any, userId: any, role: any) => {
        try {
            const resp = await postData('api/agora', {
                channelName,
                userId,
                role,
            })
            return resp.token;
        } catch (error) {
            console.error('Error al obtener el token:', error);
            return null;
        }
    };


    const handleJoin = async () => {
        if (!client) return;

        try {
            const token = await generateAgoraToken('test', 1, 'publisher'); // Reemplaza los valores según tus necesidades
            console.log('token', token)
            await client.join('bca03b41035d4ca78a76ba456cc67ed9', 'test', token, null); // Unirte a la videollamada con el token generado


            // Verificar el estado de la conexión antes de publicar las pistas
            const connectionState = client.connectionState;
            if (connectionState === 'DISCONNECTED' || connectionState === 'CLOSED') {
                console.error('Error al unirse a la llamada: La conexión no está establecida.');
                return;
            } else {
                // Crear el div para mostrar la cámara local
                let localPlayerContainer
                if (document.getElementById('local_stream') === null) {
                    localPlayerContainer = document.createElement('div');
                    localPlayerContainer.id = 'local_stream';
                    console.log('vcontainer', document.getElementById('video_container'))

                    document.getElementById('video_container')?.appendChild(localPlayerContainer);

                } else {
                    localPlayerContainer = document.getElementById('local_stream')

                }

                // Agregar la pista de video a la interfaz
                localVideoTrack.play(`local_stream`);



                // Asignar estilos al elemento "local_stream"
                if (localPlayerContainer !== null) {

                    localPlayerContainer.style.width = '320px'; // Ancho en píxeles
                    localPlayerContainer.style.height = '240px'; // Alto en píxeles
                    localPlayerContainer.style.border = '2px solid #000'; // Borde de 2 píxeles de ancho en color negro
                }

            }


            await client.publish([localAudioTrack, localVideoTrack]);
            setJoinSuccess(true);
        } catch (error) {
            console.error('Error al unirse a la llamada:', error);
        }
    };

    const handleLeave = async () => {
        if (!client) return;

        try {
            await client.leave();
            setJoinSuccess(false);
        } catch (error) {
            console.error('Error al salir de la llamada:', error);
        }
    };


    /*
    const handleStopScreenSharing = async () => {
        if (!client || !localScreenTrack) return;

        try {
            await client.unpublish(localScreenTrack);
            localScreenTrack.stop();
            setLocalScreenTrack(null);
        } catch (error) {
            console.error('Error al detener el compartir pantalla:', error);
        }
    };
    */


    // Manejador para el evento user-published
    const handleUserPublished = async (user: any, mediaType: any) => {
        console.log("USER PUBLISHED-----")
        // Verificar si es una pista de video
        if (mediaType === 'video') {
            // Agregar la pista de video a la interfaz dentro de un div específico
            const playerContainer = document.createElement('div');
            playerContainer.id = `player-${user.uid}`;
            document.getElementById('remote_streams')?.appendChild(playerContainer);
            user.videoTrack.play(`player-${user.uid}`);
        }
    };

    // Manejador para el evento user-unpublished
    const handleUserUnpublished = async (user: any, mediaType: any) => {
        // Verificar si es una pista de video
        if (mediaType === 'video') {
            // Detener y eliminar la pista de video de la interfaz
            const playerContainer = document.getElementById(`player-${user.uid}`);
            if (playerContainer) {
                playerContainer.remove();
            }
        }
    };


    const { humanClient, leaveHuman, localAudioTrack, localVideoTrack, joinScreen, localScreenTrack, screenClient, leaveScreen, openDrawer, hideDrawer, showDrawer }: any = useContext(NewCallContext)

    const fullLeave = async () => {
        if (!humanClient) return;

        try {

            await humanClient.unpublish(localVideoTrack);
            await localVideoTrack.stop();
            await localVideoTrack.close()

            await humanClient.unpublish(localAudioTrack);
            await localAudioTrack.stop();
            await localAudioTrack.close()

            await humanClient.leave();

            leaveHuman()
        } catch (error) {
            console.error('Error al salir de la llamada:', error);
        }
    }


    const handleShareScreen = async () => {
        try {
            // Detener y despublicar la pista de video de la cámara local
            /*
            await client.unpublish(localVideoTrack);
            localVideoTrack.stop();
            */
            const screenClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
            // Compartir la pantalla
            const screenTrack: any = await AgoraRTC.createScreenVideoTrack({
                encoderConfig: "1080p_1",
            });


            joinScreen(screenClient, screenTrack)

            const token = await generateAgoraToken('test', 1, 'publisher'); // Reemplaza los valores según tus necesidades

            await screenClient.join('bca03b41035d4ca78a76ba456cc67ed9', 'test', token, null); // Unirte a la videollamada con el token generado


            // Publicar la pista de video de la pantalla compartida
            await screenClient.publish(screenTrack);

            // Crear el div para mostrar la cámara local
            let localPlayerContainer
            if (document.getElementById('local_stream_2') === null) {
                localPlayerContainer = document.createElement('div');
                localPlayerContainer.id = 'local_stream_2';
                console.log('vcontainer', document.getElementById('video_container'))

                document.getElementById('video_container')?.appendChild(localPlayerContainer);

            } else {
                localPlayerContainer = document.getElementById('local_stream_2')
            }

            // Agregar la pista de video a la interfaz
            screenTrack.play(`local_stream_2`);



            // Asignar estilos al elemento "local_stream"
            if (localPlayerContainer !== null) {
                localPlayerContainer.style.width = '100%'; // Ancho en píxeles
                localPlayerContainer.style.height = '70vh'; // Alto en píxeles
                localPlayerContainer.style.border = '2px solid #000'; // Borde de 2 píxeles de ancho en color negro
            }


        } catch (error) {
            console.error('Error al compartir pantalla:', error);
        }
    };


    const handleStopScreenSharing = async () => {
        if (!screenClient) return;

        try {

            await screenClient.unpublish(localScreenTrack);
            await localScreenTrack.stop();
            await localScreenTrack.close()
            await screenClient.leave();

            let localPlayerContainer = document.getElementById('local_stream_2')
            if (localPlayerContainer !== null) {
                localPlayerContainer.style.display = "none"
            }


            leaveScreen()
        } catch (error) {
            console.error('Error al detener el compartir pantalla:', error);
        }
    }




    return (
        <div>
            <Drawer open={openDrawer} placement="bottom">
                <div id="video_container" />
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
                    {!screenClient ? (
                        <Tooltip title="Compartir pantalla" placement="bottom">
                            <Button icon={<ShareOutlined />} type="primary" style={{ flex: 1 }} onClick={handleShareScreen} />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Dejar de compartir" placement="bottom" >
                            <Button icon={<CancelOutlined />} style={{ flex: 1 }} onClick={handleStopScreenSharing} type="primary" />
                        </Tooltip>
                    )}
                    <Tooltip title="Salir" placement="bottom" >
                        <Button onClick={fullLeave} style={{ flex: 1 }} type="primary" icon={<LogoutOutlined />} />
                    </Tooltip>
                    <Tooltip title="Ocultar" placement="bottom" >
                        <Button icon={<FullscreenExitOutlined />} style={{ flex: 1 }} onClick={() => hideDrawer()} type="primary" />
                    </Tooltip>
                </div>
            </Drawer>
        </div>
    );
};

export default AgoraComponent;
