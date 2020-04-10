
// Setting this as Container component
import React, { Component } from 'react';
import Menu from './MenuComponent';
import DishDetails from './DishdetailComponent'
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import { Switch, Route, Redirect} from 'react-router-dom'
import { Container } from 'reactstrap';
import Contact from './ContactComponent';
import { DISHES} from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { LEADERS } from '../shared/leaders';
import { PROMOTIONS} from '../shared/promotions';

class Main extends Component {
  
  constructor(props) {
    super(props);
    this.state= {
      dishes: DISHES,
      promotions: PROMOTIONS,
      leaders: LEADERS,
      comments: COMMENTS,
    };
  }

  render() {
    
    const HomePage = () => {
      return (
        <Home dish={this.state.dishes.filter((dish)=> dish.featured)[0]} 
        promotion={this.state.promotions.filter((promo)=> promo.featured)[0]}
        leader={this.state.leaders.filter((leader)=> leader.featured)[0]}
        />
      )
    }

    const DishWithId = ({match}) => {
      console.log("Entered dishwithid func")
      console.log(this.state.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0])
      return (
        <DishDetails selectedDish={this.state.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
          comments= {this.state.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))} />
      );

    }

    return (
      <div>
        <Header/>
        <Switch>
          <Route path="/home" component={HomePage} />
          <Route exact path="/menu" component={() => <Menu dishes={this.state.dishes} />} />
          <Route path="/menu/:dishId" component={DishWithId} />
          <Route exact path="/contactus" component= {Contact} />
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