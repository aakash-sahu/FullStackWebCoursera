
// Setting this as Container component
import React, { Component } from 'react';
import Menu from './MenuComponent';
import DishDetails from './DishdetailComponent'
import { DISHES } from '../shared/dishes';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import { Switch, Route, Redirect} from 'react-router-dom'
import { Container } from 'reactstrap';

class Main extends Component {
  
  constructor(props) {
    super(props);
    this.state= {
      dishes: DISHES,
    };
  }

  render() {
    
    const HomePage = () => {
      return (
        <Home />
      )
    }

    return (
      <div>
        <Header/>
        <Switch>
          <Route path="/home" component={HomePage} />
          <Route exact path="/menu" component={() => <Menu dishes={this.state.dishes} />} />
          <Redirect to="/home" />
        </Switch>
        {/* <Menu dishes={this.state.dishes} onClick = {(dishID)=>this.onDishSelect(dishID)}/>
        <DishDetails selectedDish ={this.state.dishes.filter((dish)=> dish.id === this.state.selectedDish)[0]} /> */}
        <Footer />
      </div>
    );
  }
}

export default Main;