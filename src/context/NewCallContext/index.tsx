import React, { useEffect, useReducer, useRef } from "react";
import { NEW_CALL_ACTIONS } from "./newCallActions";
import { callInitialState, callReducer } from "./newCallReducer";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";

export const NewCallContext = React.createContext({
    humanClient: null,
    screenClient: null,
    localAudioTrack: null,
    localVideoTrack: null,
    localScreenTrack: null,
    joinSuccess: false,
    joinHuman: (humanClient: any, localAudioTrack: any, localVideoTrack: any) => { },
    leaveHuman: () => { },
    joinScreen: (screenClient: any, localScreenTrack: any) => { },
    leaveScreen: () => { },
    openDrawer: false,
    hideDrawer: () => { },
    showDrawer: () => { }
});



export const NewCallProvider = ({ children }: any): any => {
    const [state, dispatch] = useReducer(callReducer, callInitialState);

    const clientRef = useRef<IAgoraRTCClient | null>(null); // Referencia para el cliente de Agora

    // Configurar Agora y suscribirse a los eventos una vez que el componente se monta
    useEffect(() => {
        // Configurar Agora con tu clave de API
        const agoraAppId = 'bca03b41035d4ca78a76ba456cc67ed9';
        const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

        // Guardar el cliente en la referencia para usarlo en otros lugares del componente
        clientRef.current = client;

        setupAgoraEvents(); // Suscribirse a los eventos de Agora después de crear el cliente

        // Función para suscribirse a los eventos de Agora
        function setupAgoraEvents() {
            console.log('setup')
            // Escuchar el evento "user-published" para detectar la presencia de nuevos usuarios en la llamada
            client.on('user-published', async (user, mediaType) => {
                console.log('user')
                if (mediaType === 'video') {
                    // Obtener el RemoteVideoTrack del usuario
                    const remoteVideoTrack = user.videoTrack;
                    if (remoteVideoTrack) {
                        try {
                            // Suscribirse al RemoteVideoTrack para poder ver al nuevo usuario
                            await client.subscribe(user, 'video');
                            // Crear un objeto MediaStream vacío
                            const remoteMediaStream = new MediaStream();
                            // Agregar el MediaStreamTrack del RemoteVideoTrack al MediaStream
                            remoteMediaStream.addTrack(remoteVideoTrack.getMediaStreamTrack());
                            // Mostrar el MediaStream en un elemento de video en la interfaz de usuario
                            const remoteVideoElement = document.createElement('video');
                            remoteVideoElement.srcObject = remoteMediaStream;
                            document.body.appendChild(remoteVideoElement);
                        } catch (err) {
                            console.error('Error al suscribirse al RemoteVideoTrack:', err);
                        }
                    }
                }
            });
        }




        // Limpieza al desmontar el componente
        return () => {
            if (clientRef.current) {
                clientRef.current.removeAllListeners(); // Eliminar todos los oyentes de eventos de Agora
            }
        };
    }, []);


    const value: any = {
        joinSuccess: state.joinSuccess,
        humanClient: state.humanClient,
        screenClient: state.screenClient,
        localAudioTrack: state.localAudioTrack,
        localVideoTrack: state.localVideoTrack,
        localScreenTrack: state.localScreenTrack,
        openDrawer: state.openDrawer,

        joinHuman: (humanClient: any, localAudioTrack: any, localVideoTrack: any) => {
            dispatch({ type: NEW_CALL_ACTIONS.JOIN_HUMAN, payload: { humanClient, localAudioTrack, localVideoTrack } });
        },

        leaveHuman: () => {
            dispatch({ type: NEW_CALL_ACTIONS.LEAVE_HUMAN });
        },

        joinScreen: (screenClient: any, localScreenTrack: any) => {
            dispatch({ type: NEW_CALL_ACTIONS.JOIN_SCREEN, payload: { screenClient, localScreenTrack } });
        },

        leaveScreen: () => {
            dispatch({ type: NEW_CALL_ACTIONS.LEAVE_SCREEN });
        },

        hideDrawer: () => {
            dispatch({ type: NEW_CALL_ACTIONS.HIDE_DRAWER })
        },

        showDrawer: () => {
            dispatch({ type: NEW_CALL_ACTIONS.SHOW_DRAWER })
        }
    };

    return <NewCallContext.Provider value={value}>{children}</NewCallContext.Provider>;
};
