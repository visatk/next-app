export {};

declare global {
  interface Window {
    ezstandalone: {
      hasInit: boolean;
      define: (id: number) => void;
      display: () => void;
      enable: () => void; // Added missing method
    };
  }
}
