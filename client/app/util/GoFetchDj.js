// import axios from 'axios';

class DjFetcher {
  constructor(host, route, dispatcher) {
    this.host = host;
    this.route = route;
    this.websocket = new WebSocket(`ws://${this.host}/${this.route}`);
    this.addWebSocketHandlers(dispatcher);
  }

  addWebSocketHandlers(dispatcher) {
    // ['onopen', 'onclose', 'onmessage'].map((i) => {
    //   this.websocket[i] = (event) => {
    //     console.log(event);
    //     dispatcher(JSON.parse(event.type));
    //   }
    // });

    this.websocket.onmessage = (event) => {
      console.log('event!', event);
      let parsed = JSON.parse(event.data);
      const x = {
        data: parsed.data,
        type: parsed.type,
      };
      dispatcher(x);
    };
  }

  // messageHandler(msg) {
  //   switch (msg.type) {
  //     case 'new_song':
  //       // console.log('A new song msg has been receibed, msg')
  //       this.messageHandlers.new_song(msg.data);
  //       break;
  //     default:
  //       console.log( 'Unknown Message', msg.type );
  //   }
  // }

  close() {
    this.websocket.close();
  }
}

export default DjFetcher;
