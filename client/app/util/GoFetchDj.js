import axios from 'axios';

class DjFetcher {
  constructor(host, route){
    this.host = host;
    this.route = route;
    this.ws;
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
      DjFetcher.messageHandler(m);
    }
  }

  getCurrent(){
    return axios({url: `http://${this.host}/current`, withCredentials: false});
  }

  static messageHandler(msg){
    switch(msg.type){
      case 'current.list.update':
      default:
        console.log('Unknown Message');
    }
  }

  close(){
    this.ws.close();
  }
}

export default DjFetcher;