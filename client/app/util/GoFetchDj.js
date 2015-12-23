import axios from 'axios';

class DjFetcher {
  constructor(host, route, msgHdlrs) {
    this.host = host;
    this.route = route;
    this.ws = {};
    this.messageHandlers = msgHdlrs;
  }

  connect() {
    this.ws = new WebSocket(`ws://${this.host}/${this.route}`);
    return this;
  }

  addHandlers() {
    this.ws.onopen = () => {
      // console.log( 'WebSocket Open', e );
    };
    this.ws.onclose = () => {
      // console.log( 'WebSocket Close', e );
    };
    this.ws.onmessage = (e) => {
      // console.log( 'WebSocket message', e );
      const m = JSON.parse(e.data);
      this.messageHandler(m);
    };
  }

  getCurrent() {
    return axios({
      url: `http://${this.host}/current`,
      withCredentials: false,
    });
  }

  messageHandler(msg) {
    switch (msg.type) {
    case 'new_song':
      // console.log('A new song msg has been receibed, msg')
      this.messageHandlers.new_song(msg.data);
      break;
    default:
      // console.log( 'Unknown Message', msg.type );
    }
  }

  close() {
    this.ws.close();
  }
}

export default DjFetcher;
