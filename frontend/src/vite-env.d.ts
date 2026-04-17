/// <reference types="vite/client" />

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export { };
