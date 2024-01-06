import { BellOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Space, Tooltip } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getData } from '../../services/common/getData';
import { AuthContext } from '../../context/AuthContext';
import { putData } from '../../services/common/putData';

function NotificationList() {

    const [notifItems, setNotifItems] = useState<any>([])
    const [unreadNotifs, setUnreadNotifs] = useState([])
    const { user }: any = useContext(AuthContext)



    const markAsRead = async (notifId: any) => {
        const request = await putData('api/notifications/' + notifId, {})
        if (request.status) {
            getNotifications()
        }
    }

    const getNotifications = async () => {
        const requestNotifications = await getData('api/notifications/byReceiver/' + user._id)
        if (requestNotifications.status) {
            if (requestNotifications.data.length > 0) {
                
                // Objeto para almacenar las notificaciones únicas con la propiedad 'repeated'
                const notificacionesUnicas: any = {};

                // Iterar sobre el arreglo de notificaciones
                requestNotifications.data.forEach((notificacion: any) => {
                    if (notificacionesUnicas[notificacion.refId]) {
                        // Si ya existe una notificación con el mismo refId, incrementar 'repeated'
                        notificacionesUnicas[notificacion.refId].repeated++;
                    } else {
                        // Si es la primera vez que encontramos este refId, agregar la notificación
                        notificacionesUnicas[notificacion.refId] = {
                            ...notificacion,
                            repeated: 1, // Inicializar la propiedad 'repeated'
                        };
                    }
                });

                // Convertir el objeto de notificaciones únicas en un arreglo
                const notificacionesFinales: any = Object.values(notificacionesUnicas);

                console.log('notif finales', notificacionesFinales)


                const unread = notificacionesFinales.filter((noti: any) => !noti.isRead)
                setUnreadNotifs(unread)


                const notificationsToComponent = unread.map((notification: any, index: any) => {
                    return {
                        key: index.toString(),
                        label: <span style={{ color: notification.isRead ? 'auto' : '#007E85', fontWeight: notification.isRead ? 'auto' : 'bolder', paddingLeft: 8 }} >{notification.title} ({notification.repeated.toString()})</span>,
                        icon: <> {notification.isRead ? null : (
                            <Tooltip title="Marcar como leída">
                                <Button onClick={() => markAsRead(notification._id)} icon={<EyeOutlined />} />
                            </Tooltip>
                        )}  </>,

                    }
                })
                setNotifItems(notificationsToComponent)
            }
        }
    }

    useEffect(() => {
        getNotifications()
    }, [])


    useEffect(() => {
        // LISTEN CHANGES FOR IN-APP NOTIF
        const client = createClient(
            'https://oqcxpijzaddmvyzlslam.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xY3hwaWp6YWRkbXZ5emxzbGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ0MDMyMDgsImV4cCI6MjAwOTk3OTIwOH0.AwrfE3NvI5pA46ThsDQ0BN7atamyPQmm_Kk8P7Usl48'
        );
        const channel = client.channel('room-1');
        channel
            .on(
                'broadcast',
                { event: 'test' },
                (payload) => {
                    console.log('PAYLOAD--', payload);
                    getNotifications();
                }
            )
            .subscribe();
        // END LISTEN CHANGES FOR IN-APP NOTIF
    }, [])


    return (
        <Dropdown
            menu={{ items: notifItems }}
        >
            <a onClick={(e) => e.preventDefault()}>
                <Space size="middle">
                    <Badge count={unreadNotifs.length}>
                        <Avatar shape="square" size="large" icon={<BellOutlined />} />
                    </Badge>
                </Space>
            </a>
        </Dropdown>
    )

}

export default NotificationList
