
// Setting this as Container component
import React, { Component } from 'react';

import { Navbar, NavbarBrand } from 'reactstrap';
import Menu from './MenuComponent';
import DishDetails from './DishdetailComponent'
import './App.css';
import { DISHES } from './shared/dishes';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state= {
      dishes: DISHES,
      selectedDish: null
    };
  }

  render() {
    return (
      <div>
        <Navbar dark color="primary">
          <div className="container">
            <NavbarBrand href="/">Ristorante Con Fusion</NavbarBrand>
          </div>
        </Navbar>
        <Menu dishes={this.state.dishes}/>
        <DishDetails />
      </div>
    );
  }
}

export default App;
