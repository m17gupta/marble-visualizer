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
  const [error, setError] = useState<string | null>(null);
  const [isSecureContext, setIsSecureContext] = useState(true);
  const dispatch = useDispatch();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Check if running in secure context (HTTPS or localhost)
  useEffect(() => {
    const checkSecureContext = () => {
      const isSecure = window.isSecureContext ||
        window.location.protocol === 'https:' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';
      setIsSecureContext(isSecure);

      if (!isSecure) {
        setError('Speech recognition requires HTTPS in production');
      }
    };

    checkSecureContext();
  }, []);

  // Watch for transcript changes and dispatch immediately
  useEffect(() => {
    if (transcript && (listening || isListening)) {
      
      dispatch(addPrompt(transcript));
    }
  }, [transcript, listening, isListening, dispatch]);

  // Handle speech recognition errors and setup
  useEffect(() => {
    const handleGlobalErrors = () => {
      if (!browserSupportsSpeechRecognition) {
        setError('Speech recognition not supported in this browser');
      }
    };

    handleGlobalErrors();
  }, [browserSupportsSpeechRecognition]);

  // Check if browser supports speech recognition
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="ms-2 text-xl text-gray-400 cursor-not-allowed" title="Speech recognition not supported">
        <FaMicrophoneSlash />
      </div>
    );
  }

  // Check if not in secure context
  if (!isSecureContext) {
    return (
      <div className="ms-2 text-xl text-gray-400 cursor-not-allowed" title="Speech recognition requires HTTPS">
        <FaMicrophoneSlash />
      </div>
    );
  }

  const startListening = async () => {
    try {
      setError(null);
      setIsListening(true);

      // Check for microphone permission
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permission.state === 'denied') {
          setError('Microphone access denied');
          setIsListening(false);
          return;
        }
      }

      SpeechRecognition.startListening({
        continuous: true,
        language: 'en-US',
        interimResults: true
      });

    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Failed to start speech recognition');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    try {
      setIsListening(false);
      SpeechRecognition.stopListening();
      if (onTranscript && transcript) {
        console.log('Transcript:', transcript);
        onTranscript(transcript);
      }
    } catch (err) {
      console.error('Error stopping speech recognition:', err);
      setError('Failed to stop speech recognition');
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
        className={`ms-2 text-xl cursor-pointer transition-colors ${listening || isListening
            ? 'text-red-500 animate-pulse'
            : error
              ? 'text-red-400 hover:text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        onClick={handleMicrophoneClick}
        title={
          error
            ? error
            : listening || isListening
              ? 'Stop recording'
              : 'Start voice recording'
        }
      />
      {error && (
        <div className="absolute mt-8 p-2 bg-red-100 text-red-700 text-sm rounded shadow-lg z-10">
          {error}
        </div>
      )}
    </>
  )
}

export default VoiceRecognition
