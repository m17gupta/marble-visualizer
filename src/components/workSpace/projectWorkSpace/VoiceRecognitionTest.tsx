import React, { useState } from 'react';
import VoiceRecognition from './VoiceRecognition';

const VoiceRecognitionTest: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');

  const handleTranscript = (text: string) => {
    setTranscript(text);
    console.log('Received transcript:', text);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Voice Recognition Test</h2>
      
      <div className="flex items-center mb-4">
        <span className="mr-2">Click to start/stop recording:</span>
        <VoiceRecognition onTranscript={handleTranscript} />
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Transcript:</h3>
        <p className="text-gray-700">{transcript || 'No transcript yet...'}</p>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p><strong>Note:</strong> Speech recognition requires:</p>
        <ul className="list-disc list-inside mt-2">
          <li>HTTPS in production (works on localhost)</li>
          <li>Microphone permissions</li>
          <li>Compatible browser (Chrome, Edge, Safari)</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceRecognitionTest;
