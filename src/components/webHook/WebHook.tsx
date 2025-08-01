import { RootState } from "@/redux/store";
import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const WebhookListener = () => {
  const {task_id} = useSelector((state: RootState) => state.genAi);
  const [webhookData, setWebhookData] = useState<any>(null);

  useEffect(() => {
      if(!task_id && task_id!=null) return;
      
      // const ws =  getWebhookData();
  }, [task_id]);


  const getWebhookData = () => {
const ws = new WebSocket("wss://nexus.dzinly.org/ws");


    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📦 Webhook received in React:", data);
      setWebhookData(data);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    return () => ws.close();
  }
  return (
    null
  );
};

export default WebhookListener;
