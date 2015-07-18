import React from 'react';
import {Link} from 'react-router';
import mui from 'material-ui';
let RaisedButton = mui.RaisedButton;

class Home extends React.Component {
  render() {
    return ( <div>< h2 className="text-center">Welcome to GopheringDj</h2>

    <Link to="play" params={{date: 'current'}}> <h3> Play Current </h3> </Link>

    </div>);
  }

  handleClick(){
    var router = this.context.router;
    router.transitionTo('play', {date: 'current'});
  }

  static contextTypes ={
    router: React.PropTypes.func.isRequired
  }
}

export default Home;
