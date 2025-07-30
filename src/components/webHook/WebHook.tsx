import  { useEffect, useState } from 'react';
import axios from 'axios';

interface WebhookData {
  id: string;
  message: string;
  timestamp: string;
}

function WebhookUpdates() {
   const [data, setData] = useState<WebhookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    // Replace with your actual ngrok URL
    const webhookUrl = 'https://https://nexus.dzinly.org.ngrok.io/webhook';

    axios.get<WebhookData[]>(webhookUrl)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError('Failed to fetch webhook data');
        setLoading(false);
      });
  }, []);

  return (
   null
  );
}

export default WebhookUpdates;