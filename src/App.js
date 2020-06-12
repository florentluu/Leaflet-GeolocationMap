import React from 'react';
import './App.css';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
// import leafOrange from './assets/leaf-orange.png';
import leafShadow from './assets/leaf-shadow.png';
import { geolocated } from "react-geolocated";
import logo from './assets/logo.png';
import * as emailjs from 'emailjs-com';
class App extends React.Component {
  constructor(props){
  super(props)
  this.state = {
    name:'',
    checkIn:'',
    checkOut: '',
    message:'',
    ipPosition: null,
    ipUser: '',
    orangeIcon:  this.props.coords,
    zoom: 13
  }

  }
  // componentDidUpdate(){ console.log('COORD', this.props.coords)
  //   if(this.state.orangeIcon === '' || null) {
  //   this.setState({orangeIcon: this.props.coords})
  //   }
  // }
  
  componentDidUpdate() {
    fetch('https://api.ipify.org?format=json?callback=?', {
      method: 'GET',
      headers: {},
    })
    .then(res => {
      return res.text()
    }).then(ip => { this.setState({ipUser: ip})
      console.log('ip', ip)
    });
  }

  componentDidMount() {
    fetch(`https://ip-api.com/json/${this.state.ipUser}?fields=lat,lon`, {
      method: 'GET',
      headers: {},
    })
    .then(res => {
      return res.text()
    }).then(posIp => { this.setState({ipPosition: posIp})
      console.log('ipPosition', this.state.ipPosition)
    });
  }

  

  handleSubmit = e => {
    e.preventDefault();
    const { name, ipPosition, checkOut, message, ipUser, checkIn } = this.state;
    let templateParams = {
      from_name: name,
      checkIn: checkIn,
      checkOut: checkOut,
      message_html: message,
      ipUser: ipUser,
      ipPosition: ipPosition
    };
    emailjs.send('gmail', 'template_bE4AcHZl', templateParams, 'user_uyZjVEA8foEnFj9bPAgnH');
    this.resetForm();
  };

  resetForm() {
    this.setState({
      name:'',
      checkIn:'',
      checkOut: '',
      message:'',
      ipPosition: null,
      ipUser: '',
    });
  }
  handleChange = (param, e) => {
    this.setState({ [param]: e.target.value });
  };

  orangeIcon = L.icon({
    iconUrl: logo,
    shadowUrl: leafShadow,
    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -86]
  });

  
  render(){
    return (
      <div>
        {
        !this.props.isGeolocationAvailable ? (
            <div>Your browser does not support Geolocation</div>
        ) : !this.props.isGeolocationEnabled ? (
            <div>Geolocation is not enabled</div>
        ) : this.props.coords ? ( 
          
        <div>  
          <Map className="map" center={{lat: this.props.coords.latitude, lng: this.props.coords.longitude}} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={{lat: this.props.coords.latitude, lng: this.props.coords.longitude}} fillColor="blue" radius={400} />
        <Marker position={{lat: this.props.coords.latitude, lng: this.props.coords.longitude}} icon={this.orangeIcon} >
          <Popup>
            I am here
          </Popup>
        </Marker>
      </Map>
          <form className="container-form" onSubmit={this.handleSubmit.bind(this)}>
            <div className='logodiv'>
              VILLA BALI MANAGEMENT
              <br/>
              <img src={logo} alt="Logo" className='logo'/>
            </div>
            <div className="contactform">
                
                <div className="form1">
                  <input
                    type="text"
                    name="name"
                    value={this.state.name}
                    className="text-primary"
                    onChange={this.handleChange.bind(this, 'name')}
                    placeholder="Lastname"
                  />
                  <input
                  type="text"
                  name="ipUser"
                  value={this.state.ipUser}
                  className="text-primary"
                  onChange={this.handleChange.bind(this, 'ipUser')}
                  placeholder="ip"
                />
                </div>
                <div className="form2">
                  <input
                    type="text"
                    name="checkIn"
                    value={this.state.checkIn}
                    className="text-primary"
                    onChange={this.handleChange.bind(this, 'checkIn')}
                    placeholder="Check-in"
                  />
                  <input
                    type="text"
                    placeholder="Check-out"
                    name="checkOut"
                    className="text-primary"
                    value={this.state.checkOut}
                    onChange={this.handleChange.bind(this, 'checkOut')}
                  />
                </div>
                <div className="form3">
                  <input
                    type="text"
                    placeholder="Latitude"
                    name="latitude"
                    className="text-primary"
                    value={this.props.coords.latitude}
                    onChange={this.handleChange.bind(this, 'latitude')}
                  />
                  <input
                    type="text"
                    name="longitude"
                    value={this.props.coords.longitude}
                    className="text-primary"
                    onChange={this.handleChange.bind(this, 'longitude')}
                    placeholder="Longitude"
                  />
                </div>
              </div>
                <div className="text-button">
                  <textarea
                    className="text-primary"
                    type="text"
                    name="message"
                    value={this.state.message}
                    onChange={this.handleChange.bind(this, 'message')}
                    placeholder="Your message..."
                  />
                  <div className="buttons-container">
                    <button
                      className="button-send"
                      type="submit"
                      onClick={() => this.handleSubmit.bind(this) }
                    >
                      Valider
                    </button>
                  </div>
            </div>
          </form> 
        </div>
        
        ) : (
        <div>Getting the location data&hellip; </div>)}
      </div>
    );
  }
}

export default geolocated({
  positionOptions: {
      enableHighAccuracy: false,
      timeout: Infinity,
      maximumAge: Infinity
  },
  userDecisionTimeout: Infinity,
  geolocationProvider: navigator.geolocation,
  watchPosition: true
})(App);
