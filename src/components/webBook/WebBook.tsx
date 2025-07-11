// WebhookEventsListener.tsx
import { RootState } from '@/redux/store';
import  { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const WebhookEventsListener = () => {
    const [events, setEvents] = useState<any[]>([]);
    const { task_id } = useSelector((state: RootState) => state.genAi);
    useEffect(() => {
        if (task_id) {

            const socket = new WebSocket(`wss:https://webhook.site/${task_id}`);

            socket.onopen = () => {
                console.log('✅ WebSocket connection established');
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📦 Webhook Event:', data);
                    setEvents((prev) => [data, ...prev]);
                } catch (err) {
                    console.error('❌ Failed to parse WebSocket message:', event.data);
                }
            };

            socket.onclose = () => {
                console.log('🔌 WebSocket disconnected');
            };

            return () => {
                socket.close();
            };
        }
    }, [task_id]);

    return (
        null
    );
};

export default WebhookEventsListener;