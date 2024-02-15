declare global {
    namespace NodeJS {
      interface ProcessEnv {
        HTTP_PORT: number;
        WEBSOCKET_PORT: number;
      }
    }
  }

  export {}