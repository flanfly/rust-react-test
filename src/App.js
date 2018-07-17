import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {version: -1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    //return true;
    return nextProps.value.version > this.state.version;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.value.version > prevState.version) {
      console.log(nextProps);
      return { version: nextProps.value.version };
    } else {
      return null;
    }
  }

  render() {
    console.log("render!",this.state);

    const items = this.props.value.items.map((value) =>
      <li key={value}>{value}</li>
    );

    return (<div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          This is {this.props.value.name}
        </p>
        <ul>{items}</ul>
      </div>
    );
  }
}

export default App;
