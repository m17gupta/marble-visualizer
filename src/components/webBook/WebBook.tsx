// WebhookEventsListener.tsx
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const WebhookEventsListener = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const { task_id } = useSelector((state: RootState) => state.genAi);
  console.log(task_id);
  useEffect(() => {
    if (task_id) {
      const socket = new WebSocket(`wss://webhook.site/${task_id}`);

      socket.onopen = () => {
        console.log("✅ WebSocket connection established");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📦 Webhook Event:", data);
          setEvents((prev) => [data, ...prev]);
        } catch {
          console.error("❌ Failed to parse WebSocket message:", event.data);
        }
      };

      socket.onclose = () => {
        console.log("🔌 WebSocket disconnected");
      };

      return () => {
        socket.close();
      };
    }
  }, [task_id]);

  return null;
};

export default WebhookEventsListener;
