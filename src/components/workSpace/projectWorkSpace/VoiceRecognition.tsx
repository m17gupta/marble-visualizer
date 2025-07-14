
import { addPrompt } from '@/redux/slices/visualizerSlice/genAiSlice';
import React, { useEffect, useState } from 'react'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

interface VoiceRecognitionProps {
  onTranscript?: (transcript: string) => void;
}

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
   const dispatch = useDispatch();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Watch for transcript changes and dispatch immediately
  useEffect(() => {
    if (transcript && (listening || isListening)) {
      dispatch(addPrompt(transcript));
    }
  }, [transcript, listening, isListening, dispatch]);

  // Check if browser supports speech recognition
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="ms-2 text-xl text-gray-400 cursor-not-allowed" title="Speech recognition not supported">
        <FaMicrophoneSlash />
      </div>
    );
  }

  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
    if (onTranscript && transcript) {
        console.log('Transcript:', transcript);
      onTranscript(transcript);
    }
  };

  const handleMicrophoneClick = () => {
    if (listening || isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };
   


  return (
    <>
      <FaMicrophone 
        className={`ms-2 text-xl cursor-pointer transition-colors ${
          listening || isListening 
            ? 'text-red-500 animate-pulse' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={handleMicrophoneClick}
        title={listening || isListening ? 'Stop recording' : 'Start voice recording'}
      />
      {transcript && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-white border rounded shadow-lg max-w-xs z-10">
          <p className="text-sm text-gray-700">{transcript}</p>
        </div>
      )}
    </>
  )
}

export default VoiceRecognition
