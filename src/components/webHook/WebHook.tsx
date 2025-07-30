import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WebhookUpdates() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const response = await axios.get('http://localhost:4000/latest-update');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching update:', error);
      }
    };

    fetchUpdate();
    const interval = setInterval(fetchUpdate, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Latest Webhook Update:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default WebhookUpdates;