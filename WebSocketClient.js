const wsConnectionUrl = 'ws://192.168.1.199:81'

class WebSocketClient {
    constructor(config) {
        const { url, timeout } = config
        
        this._url = url
        this._timeout = timeout || 1000
        this._connectInterval
        this._ws
        this._connect()
    }

    _getStatusString() {
        const connectionStates = {
            0: 'CONNECTING',
            1: 'OPEN',
            2: 'CLOSING',
            3: 'CLOSED',
        }

        return connectionStates[ws.readyState] || 'websocket connection has no status'
    }

    /**
     * @function connect
     * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
     */
    _connect() {
        delete this._ws
        this._ws = new WebSocket(this._url);

        this._ws.onopen = () => {
            console.log("connected websocket main component");

            clearTimeout(this._connectInterval); // clear Interval on onopen of websocket connection
        };

        this._ws.onclose = e => {
            console.log(
                `Socket is closed. Reconnect will be attempted in ${this._timeout} seconds.`,
                e.reason
            );

            delete this._ws
            this._connectInterval = setTimeout(this._reconnect, this._timeout); //call check function after timeout
        };

        // websocket onerror event listener
        this._ws.onerror = err => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );

            this._ws.close();
        };
    };

    /**
     * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
     */
    _reconnect() {
        if (!this._ws || this._ws.readyState == WebSocket.CLOSED) this._connect(); //check if websocket instance is closed, if so call `connect` function.
    };
}

export default WebSocketClient