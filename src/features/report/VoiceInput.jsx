import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, AlertCircle, Volume2, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VoiceInput({ onTranscript, language = 'am-ET' }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimText, setInterimText] = useState('');
  const [finalText, setFinalText] = useState('');
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const timerRef = useRef(null);
  
  const languages = [
    { code: 'am-ET', name: 'አማርኛ', flag: '🇪🇹', fullName: 'Amharic' },
    { code: 'en-GB', name: 'English', flag: '', fullName: 'English' }
  ];
  
  useEffect(() => {
    const isSpeechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(isSpeechSupported);
    
    if (!isSpeechSupported) {
      setError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Recording duration timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingDuration(0);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Show success animation
  useEffect(() => {
    if (showSuccess) {
      const timeout = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [showSuccess]);
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const startRecording = () => {
    if (!isSupported) {
      toast.error('Speech recognition not supported');
      return;
    }
    
    setError(null);
    setInterimText('');
    setShowSuccess(false);
    finalTranscriptRef.current = '';
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.maxAlternatives = 3;
      
      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        toast.success(`🎤 Listening in ${languages.find(l => l.code === selectedLanguage)?.fullName}...`);
      };
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const confidence = result[0].confidence;
          
          if (result.isFinal) {
            finalTranscriptRef.current += transcript + ' ';
            setFinalText(finalTranscriptRef.current);
            
            if (confidence < 0.5) {
              console.warn('Low confidence transcript:', transcript, confidence);
            }
          } else {
            interimTranscript += transcript;
          }
        }
        
        setInterimText(interimTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        const errorMessages = {
          'no-speech': 'No speech detected. Please try again.',
          'audio-capture': 'No microphone found. Please check your microphone.',
          'not-allowed': 'Microphone permission denied. Please allow microphone access.',
          'network': 'Network error. Please check your connection.',
          'aborted': 'Recording was aborted.',
          'language-not-supported': `Language not supported. Try English.`
        };
        
        const message = errorMessages[event.error] || `Speech recognition error: ${event.error}`;
        setError(message);
        toast.error(message);
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsProcessing(true);
        
        if (finalTranscriptRef.current) {
          onTranscript(finalTranscriptRef.current.trim());
          setShowSuccess(true);
          toast.success('✅ Voice captured successfully!');
        } else {
          toast.warning('No speech was captured');
        }
        
        setTimeout(() => setIsProcessing(false), 500);
      };
      
      recognitionRef.current.start();
      
      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (recognitionRef.current && isRecording) {
          stopRecording();
          toast.info('Recording auto-stopped after 60 seconds');
        }
      }, 60000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      setError('Failed to start recording. Please try again.');
      toast.error('Failed to start recording');
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const clearText = () => {
    setFinalText('');
    setInterimText('');
    finalTranscriptRef.current = '';
    onTranscript('');
    toast.success('Transcript cleared');
  };
  
  if (!isSupported) {
    return (
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-900">Browser Not Supported</h3>
            <p className="text-sm text-red-700 mt-1">
              Speech recognition is not supported in your browser. 
              Please use Chrome, Edge, or Safari.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-5">
      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}
      
      {/* Language Selector - Modern Pills */}
      <div className="flex justify-center">
        <div className="flex justify-center">
  <div className="inline-flex bg-stone-100 dark:bg-[#1a1a1a] rounded-2xl p-1.5 gap-1 border border-orange-200 dark:border-orange-500/40">
    {languages.map(lang => (
      <button
        key={lang.code}
        type="button"
        onClick={() => !isRecording && setSelectedLanguage(lang.code)}
        disabled={isRecording}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
          
          ${
            selectedLanguage === lang.code
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 ring-1 ring-orange-300 dark:ring-orange-400"
              : "text-stone-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10"
          }

          ${isRecording ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span className="text-base">{lang.flag}</span>
        <span>{lang.name}</span>

        {selectedLanguage === lang.code && (
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
        )}
      </button>
    ))}
  </div>
</div>
      </div>
      
      {/* Recording Button - Enhanced Design */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Outer pulse ring */}
          {isRecording && (
            <div className="absolute inset-0 rounded-full animate-ping bg-red-400/20 scale-150" />
          )}
          
          {/* Secondary pulse */}
          {isRecording && (
            <div className="absolute inset-0 rounded-full animate-pulse bg-red-500/10 scale-125" />
          )}
          
          {/* Main button */}
          <button
            type="button"
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`
              relative w-28 h-28 rounded-full flex items-center justify-center
              transition-all duration-300 transform hover:scale-105 active:scale-95
              focus:outline-none focus:ring-4 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isRecording 
                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl shadow-red-500/30 focus:ring-red-300' 
                : 'bg-gradient-to-br from-terracotta to-amber-600 text-white shadow-xl shadow-terracotta/20 hover:shadow-2xl hover:shadow-terracotta/30 focus:ring-terracotta/30'
              }
            `}
          >
            {isProcessing ? (
              <Loader2 className="w-12 h-12 animate-spin opacity-70" />
            ) : isRecording ? (
              <div className="flex flex-col items-center gap-0.5">
                <Square className="w-7 h-7" />
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  STOP
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-0.5">
                <Mic className="w-7 h-7" />
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  START
                </span>
              </div>
            )}
          </button>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-3">
          {isRecording ? (
            <>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="text-sm font-semibold text-red-600">
                  Recording {formatDuration(recordingDuration)}
                </span>
              </div>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500">Click to stop</span>
            </>
          ) : isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Processing...</span>
            </div>
          ) : showSuccess ? (
            <div className="flex items-center gap-2 animate-in slide-in-from-bottom-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600">Captured!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-stone-400" />
              <span className="text-sm text-stone-500">Tap to start speaking</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Live Transcript - Enhanced Card */}
      {(interimText || finalText) && (
        <div className="relative rounded-2xl border-2 border-stone-200 bg-white overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 bg-stone-50 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
              <h4 className="text-sm font-semibold text-stone-700">
                {isRecording ? 'Live Transcript' : 'Transcript'}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {finalText && (
                <span className="text-xs text-stone-400">
                  {finalText.split(' ').length} words
                </span>
              )}
              <button
                type="button"
                onClick={clearText}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-5">
            <div className="min-h-[60px] text-stone-800 leading-relaxed">
              {finalText && (
                <span className="text-stone-900">{finalText}</span>
              )}
              {interimText && (
                <span className="text-stone-400 italic">{interimText}</span>
              )}
            </div>
            
            {finalText && !isRecording && (
              <div className="mt-4 pt-4 border-t border-stone-100">
                <div className="flex items-center gap-2 text-xs text-terracotta">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ready for AI extraction</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Progress Bar Animation */}
          {isRecording && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-terracotta animate-pulse" />
          )}
        </div>
      )}
      
      {/* Tips Card - Modern Design */}
      <div className="rounded-2xl border-2 bg-amber-100 border-orange-500/40 dark:bg-[#1a1a1a] p-5">
  <div className="flex items-center gap-2 mb-3">
    <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
      <Sparkles className="w-4 h-4 text-amber-700 dark:text-orange-400" />
    </div>
    <h4 className="text-sm font-semibold text-amber-900 dark:text-orange-300">
      Voice Tips
    </h4>
  </div>

  <div className="grid grid-cols-2 gap-2">
    <div className="flex items-start gap-2">
      <span className="text-amber-400 dark:text-orange-400 mt-0.5 font-bold">•</span>
      <p className="text-xs text-amber-800 dark:text-orange-300">
        Speak clearly & naturally
      </p>
    </div>

    <div className="flex items-start gap-2">
      <span className="text-amber-400 dark:text-orange-400 mt-0.5 font-bold">•</span>
      <p className="text-xs text-amber-800 dark:text-orange-300">
        Minimize background noise
      </p>
    </div>

    <div className="flex items-start gap-2">
      <span className="text-amber-400 dark:text-orange-400 mt-0.5 font-bold">•</span>
      <p className="text-xs text-amber-800 dark:text-orange-300">
        Describe in detail
      </p>
    </div>

    <div className="flex items-start gap-2">
      <span className="text-amber-400 dark:text-orange-400 mt-0.5 font-bold">•</span>
      <p className="text-xs text-amber-800 dark:text-orange-300">
        Both languages supported
      </p>
    </div>
  </div>
</div>
    </div>
  );
}
