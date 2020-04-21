
// Setting this as Container component
import React, { Component } from 'react';
import Menu from './MenuComponent';
import DishDetail from './DishdetailComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import { Switch, Route, Redirect, withRouter} from 'react-router-dom'
import Contact from './ContactComponent';
import About from './AboutComponent';
import { connect } from 'react-redux';
import { addComment, fetchDishes, fetchComments, fetchPromos } from '../redux/ActionCreators' //get action creator and then dispatch
import { actions } from 'react-redux-form';


//To make avlbl to main components as props by connecting to redux store using connect func at the end
const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

//it will receive dispatch from the connect func
const mapDispatchToProps = (dispatch) => ({
  addComment: (dishId, rating, author, comment) => dispatch(addComment(dishId, rating, author, comment)),
  fetchDishes: () => {dispatch(fetchDishes())},
  resetFeedbackForm: () => {dispatch(actions.reset('feedback'))},
  fetchComments: () => {dispatch(fetchComments())},
  fetchPromos: () => {dispatch(fetchPromos())},

});

class Main extends Component {
  
  constructor(props) {
    super(props);

  }
  
  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
  }

  render() {
    
    const HomePage = () => {
      return (
        <Home dish={this.props.dishes.dishes.filter((dish)=> dish.featured)[0]}
        dishesLoading = {this.props.dishes.isLoading}
        dishesErrMess = {this.props.dishes.errMess} 
        promotion={this.props.promotions.promotions.filter((promo)=> promo.featured)[0]}
        promosLoading = {this.props.promotions.isLoading}
        promosErrMess = {this.props.promotions.errMess} 
        leader={this.props.leaders.filter((leader)=> leader.featured)[0]}
        />
      )
    }

    const DishWithId = ({match}) => {
      return (
        <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
          isLoading = {this.props.dishes.isLoading}
          errMess = {this.props.dishes.errMess} 
          comments= {this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))} 
          commentsErrMess = {this.props.comments.errMess}
          addComment= {this.props.addComment} />
      );
    }

    return (
      <div>
        <Header/>
        <Switch>
          <Route path="/home" component={HomePage} />
          <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes} />} />
          <Route path="/menu/:dishId" component={DishWithId} />
          <Route exact path="/contactus" component= {()=> <Contact resetFeedbackForm = {this.props.resetFeedbackForm} />} />
          <Route path="/aboutus" component= {() => <About leaders = {this.props.leaders} />} />
          <Redirect to="/home" />
        </Switch>
        {/* <Menu dishes={this.state.dishes} onClick = {(dishID)=>this.onDishSelect(dishID)}/>
        <DishDetails selectedDish ={this.state.dishes.filter((dish)=> dish.id === this.state.selectedDish)[0]} /> */}
        <Footer />
      </div>
    );
  }
}

//use connect to make available the redux store to main
//withRouter neeeded if using react router
export default withRouter((connect(mapStateToProps, mapDispatchToProps)(Main)));