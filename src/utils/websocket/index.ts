interface ReconnectingWebsocketOptions {
    timeoutInterval: number;
    reconnectDecay: number;
    maxReconnectInterval: number;
    reconnectInterval: number;
}

export default class ReconnectingWebsocket {
    url: string;
    
    protocols: string[];

    reconnectInterval: number;

    maxReconnectInterval: number;

    reconnectDecay: number;

    timeoutInterval: number;

    readyState: number;

    ws: WebSocket | null;

    onopen: any;

    onmessage: any;

    onerror: any;

    onclose: any;

    constructor(url: string, protocols?: string[], options?: ReconnectingWebsocketOptions) {
        this.url = url;
        this.protocols = protocols || [];
        this.reconnectInterval = options?.reconnectInterval || 1000; // 1 second
        this.maxReconnectInterval = options?.maxReconnectInterval || 30000; // 30 seconds
        this.reconnectDecay = options?.reconnectDecay || 1.5;
        this.timeoutInterval = options?.timeoutInterval || 2000; // 2 seconds
        this.readyState = WebSocket.CLOSED;
        this.ws = null;
    
        this.connect();
      }
    
      connect() {
        this.ws = new WebSocket(this.url, this.protocols);
        this.readyState = WebSocket.CONNECTING;
    
        this.ws.onopen = (event) => {
          // console.log("Connected");
          this.readyState = WebSocket.OPEN;
          this.reconnectInterval = 1000; // Reset on successful connection
          if (this.onopen) this.onopen(event);
        };
    
        this.ws.onmessage = (event) => {
          if (this.onmessage) this.onmessage(event);
        };
    
        this.ws.onerror = (event) => {
          if (this.onerror) this.onerror(event);
        };
    
        this.ws.onclose = (event) => {
          // console.log(`Disconnected, reconnecting in ${this.reconnectInterval}ms`);
          this.readyState = WebSocket.CLOSED;
          if (this.onclose) this.onclose(event);
          this.reconnect();
        };
      }
    
      reconnect() {
        setTimeout(() => {
          if (this.reconnectInterval < this.maxReconnectInterval) {
            this.reconnectInterval *= this.reconnectDecay;
          }
          this.connect();
        }, this.reconnectInterval);
      }
    
      send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        if (this.readyState === WebSocket.OPEN) {
          this.ws?.send(data);
        } else {
          // console.warn("WebSocket is not open. Message not sent.");
        }
      }
    
      close() {
        this.ws?.close();
        this.readyState = WebSocket.CLOSED;
      }
}