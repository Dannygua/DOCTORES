import React, { useState } from "react";
import { Row, Col, Button, Badge, message } from "antd";
import { useReactMediaRecorder } from "react-media-recorder";

import Text from "antd/lib/typography/Text";
import { postFormData } from "../../../services/common/postData";
import { putData } from "../../../services/common/putData";


const ScreenRecording = ({
    screen,
    audio,
    video,
    downloadRecordingPath,
    downloadRecordingType,
    emailToSupport,
    dateId
}: any) => {
    const [recordingNumber, setRecordingNumber] = useState(0);
    const RecordView = () => {
        const {
            status,
            startRecording: startRecord,
            stopRecording: stopRecord,
            mediaBlobUrl
        } = useReactMediaRecorder({ screen, audio, video });

        const startRecording = () => {
            return startRecord();
        };

        const stopRecording = async () => {
            const currentTimeSatmp = new Date().getTime();
            setRecordingNumber(currentTimeSatmp);
            return stopRecord();
        };

        const viewRecording = () => {
            const newWindow = window.open(mediaBlobUrl, "_blank");
            if (newWindow) {
                newWindow.focus();
            }
        };

        const uploadVideoToCloudinary = async (videoFile: any) => {
            try {
                const cloudName = "dhmozdnjd";
                const uploadPreset = "videoPreset";

                // Crear un objeto FormData para enviar el archivo de video
                const formData = new FormData();
                formData.append("file", videoFile);
                formData.append("upload_preset", uploadPreset);

                // Realizar una solicitud POST a Cloudinary
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );


                // Obtener la respuesta en formato JSON
                const data = await response.json();

                // Verificar la respuesta de Cloudinary
                if (response.ok) {
                    console.log("El video se ha guardado correctamente en Cloudinary.");
                    console.log("URL del video en Cloudinary:", data.secure_url);

                    const request = await putData('api/dates/' + dateId, {
                        callUrl: data.secure_url
                    })

                    if (request.status) {
                        message.success("Llamada guardada correctamente!")
                    }

                } else {
                    alert("Error al guardar el video en Cloudinary");
                }
            } catch (error) {
                console.error("Error en la solicitud HTTP:", error);
            }
        };

        const downloadRecording = async () => {
            const pathName = `${downloadRecordingPath}_${recordingNumber}.${downloadRecordingType}`;
            try {
                const navigator: any = window.navigator
                if (navigator && navigator.msSaveOrOpenBlob) {
                    // for IE
                    navigator.msSaveOrOpenBlob(mediaBlobUrl, pathName);
                } else {
                    // for Chrome
                    /*const link = document.createElement("a");
                    link.href = mediaBlobUrl || '';
                    link.download = pathName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    */
                    console.log(mediaBlobUrl)
                    if (mediaBlobUrl) {

                        const blob = await fetch(mediaBlobUrl).then((response) => response.blob());
                        const file = new File([blob], "name", { type: "video/mp4", });
                        uploadVideoToCloudinary(file)
                        /*
                        const uploadImage = await postFormData('images', imageForm)

                        console.log(uploadImage)
                        if (uploadImage.status) {
                            message.success("Procesado exitosamente")
                        }

                        if (!uploadImage.status) {
                            alert('Hubo un problema al cargar los archivos, por favor intenta de nuevo')
                            return;
                        }
                        */
                    }

                }
            } catch (err) {
                console.error(err);
            }
        };


        return (
            <Row>
                <Col span="12" style={{ lineHeight: "24px" }}>
                    {status && status !== "stopped" && (
                        <Text style={{ color: 'white' }}>
                            Estado: {status && status.toUpperCase()==="IDLE" ? "En Espera" : "Grabando" }
                        </Text>
                    )}
                    {status && status === "recording" && (
                        <Badge
                            className="screen-recording-badge"
                            color="#faad14"
                            status="processing"
                            offset={[2, 0]}
                            style={{
                                marginLeft: "5px"
                            }}
                        />
                    )}
                </Col>
                <Col span="12" style={{ textAlign: "right" }}>
                    {status && status !== "recording" && (
                        <div>
                            {typeof (mediaBlobUrl) === "undefined" &&
                                (
                                    <Button
                                        onClick={startRecording}
                                        // type="primary"
                                        style={{ marginBottom: 8 }}
                                    >
                                        Grabar
                                    </Button>
                                )
                            }
                        </div>
                    )}
                    {status && status === "recording" && (
                        <div>
                            <Button
                                // type="primary"
                                onClick={stopRecording}
                                style={{ marginBottom: 8 }}
                            >
                                Detener
                            </Button>

                        </div>
                    )}
                    {downloadRecordingType &&
                        mediaBlobUrl &&
                        status &&
                        status === "stopped" && (
                            <Button
                                onClick={downloadRecording}
                                style={{ marginBottom: 8 }}
                            >
                                Guardar
                            </Button>
                        )
                    }
                </Col>
            </Row>
        );
    }; return (
        <div className="Scren-Record-Wrapper" style={{ padding: "5px 20px" }}>
            {RecordView()}
        </div>
    );
}; export default ScreenRecording;