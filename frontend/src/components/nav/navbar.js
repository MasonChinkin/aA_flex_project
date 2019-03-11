import React from 'react';
import {Link} from 'react-router-dom';


class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  logoutUser(e) {
      e.preventDefault();
      this.props.logout();
  }

  renderButtons(){ 
    if(this.props.loggedIn){
      return(
        <button className="button" onClick={this.logoutUser}>Log Out</button>
      )
    } else {
      return(
        <Link className="button" 
              to={{pathname: "/", 
                  state: {form: "login"}
        }}>Log In</Link>    
      )
    }
  }

  render() {
      return (
        <div id="navbar">
            <img src="./myphotojourney_logo_for_light_background.png" alt="MyPhotoJourney Logo" height="100" />
            {this.renderButtons()}
        </div>
      );
  }
}

export default NavBar;