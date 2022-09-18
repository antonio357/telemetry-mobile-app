const wsConnectionUrl = 'ws://192.168.1.199:81'

class WebSocketClient {
    constructor(config) {
        const { url, timeout } = config

        this._url = url
        this._timeout = timeout || 1000
        this._connectInterval
        this._ws
        this.previousMsgTime = null
        this.actualMsgTime = null
        this.intervals = []
        this.startedLogsTime = Date.now()
        this.stoped = false
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
    connect() {
        delete this._ws
        this._ws = new WebSocket(this._url);

        this._ws.onopen = () => {
            console.log("connected websocket main component");

            clearTimeout(this._connectInterval); // clear Interval on onopen of websocket connection
            this._ws.send('start logs')
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

        this._ws.onmessage = msg => {
            this.previousMsgTime = this.actualMsgTime
            this.actualMsgTime = Date.now()
            // console.log(`msg = ${msg.data}`)
            if (this.previousMsgTime && this.actualMsgTime) this.intervals.push(this.actualMsgTime - this.previousMsgTime)
            if (!this.stoped && Date.now() - this.startedLogsTime >= 30000) {
                this._ws.send('stop logs')
                this.stoped = true
                console.log(`${this.intervals.length + 1} logs received, mean time = ${this.intervals.reduce((a, b) => a + b, 0) / this.intervals.length}, min time = ${Math.min(...this.intervals)}, max time = ${Math.max(...this.intervals)}`)
                console.log(`this.intervals = ${this.intervals}`)
            }
        }
    };

    /**
     * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
     */
    _reconnect() {
        if (!this._ws || this._ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
    };
}

export default WebSocketClient