import React from 'react';
import './App.css';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import leafOrange from './assets/leaf-orange.png';
import leafShadow from './assets/leaf-shadow.png';
import { geolocated } from "react-geolocated";
import logo from './assets/logo.png';
class App extends React.Component {
  constructor(props){
  super(props)
  this.state = {
    ipPosition: null,
    position: null,
    ipUser: '',
    orangeIcon: {
      lat: '',
      lng: '',
    },
    zoom: 13
  }
  this.handleChange = this.handleChange.bind(this);
  this.handleSubmit= this.handleSubmit.bind(this)
  }
  componentWillMount() {
    fetch('http://api.ipify.org?format=json?callback=?', {
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
    fetch(`http://ip-api.com/json/${this.state.ipUser}?fields=lat,lon`, {
      method: 'GET',
      headers: {},
    })
    .then(res => {this.setState({ipPosition: res})
      console.log('ipPosition', this.state.ipPosition)
    });
  }

  // componentDidMount() {
  //   fetch(`http://ip-api.com/json/${this.state.ipUser}?fields=lat,lon`, {
  //     method: 'GET',
  //     headers: {},
  //   })
  //   .then(res => {
  //     return res.text()
  //   }).then(posIp => { this.setState({ipPosition: posIp})
  //     console.log('ipPosition', this.state.ipPosition)
  //   });
  // }

  componentDidUpdate(){ console.log('COORD', this.state.orangeIcon)
    if(this.state.orangeIcon.lat === '' || null) {
    this.setState({orangeIcon: {lat:this.props.coords.latitude, lng:this.props.coords.longitude}})
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Message envoyé: '+ this.state.value);
    event.preventDefault();
  }

  orangeIcon = L.icon({
    iconUrl: leafOrange,
    shadowUrl: leafShadow,
    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -86]
  });

  
  render(){
    const positionOrangeIcon = [this.state.orangeIcon.lat, this.state.orangeIcon.lng];
    
    return (
      <div>
        <Map className="map" center={positionOrangeIcon} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={positionOrangeIcon} icon={this.orangeIcon}>
          <Popup>
            I am an orange leaf
          </Popup>
        </Marker>
      </Map>
        {
        !this.props.isGeolocationAvailable ? (
            <div>Your browser does not support Geolocation</div>
        ) : !this.props.isGeolocationEnabled ? (
            <div>Geolocation is not enabled</div>
        ) : this.props.coords ? ( 

        <div>  
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
                    name="name"
                    value={this.state.firstname}
                    className="text-primary"
                    onChange={this.handleChange.bind(this, 'firstname')}
                    placeholder="Firstname"
                  /><input
                  type="text"
                  name="ip"
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
                    onChange={this.handleChange.bind(this, 'order')}
                  />
                  <input
                    type="text"
                    name="longitude"
                    value={this.props.coords.longitude}
                    className="text-primary"
                    onChange={this.handleChange.bind(this, 'email')}
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
                      onClick={() => this.handleSubmit.bind(this)}
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
  },
  userDecisionTimeout: 7000,
})(App);
