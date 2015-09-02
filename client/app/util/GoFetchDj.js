import axios from 'axios';

class DjFetcher {
  constructor(host, route, msg_hdlrs){
    this.host = host;
    this.route = route;
    this.ws;
    this.msg_hdlrs = msg_hdlrs;
  }

  connect(){
    this.ws = new WebSocket(`ws://${this.host}/${this.route}`)
    return this;
  }

  addHandlers(){
    this.ws.onopen = e => {
      console.log('WebSocket Open', e);
    }
    this.ws.onclose= e => {
      console.log('WebSocket Close', e);
    }
    this.ws.onmessage= e => {
      console.log('WebSocket message', e);
      var m = JSON.parse(e.data);
      this.messageHandler(m);
    }
  }

  getCurrent(){
    return axios({url: `http://${this.host}/current`, withCredentials: false});
  }

  messageHandler(msg){

    switch(msg.type){
      case 'new_song':
        this.msg_hdlrs['new_song'](msg.data)
      default:
        console.log('Unknown Message', msg.type);
    }
  }

  close(){
    this.ws.close();
  }
}

export default DjFetcher;