export {};

declare global {
  interface Window {
    simulateIntent?: (intent: string) => void;
    resetDemo?: () => void;
  }
}