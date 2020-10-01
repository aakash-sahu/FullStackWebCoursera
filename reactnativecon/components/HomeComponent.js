import React, { Component } from 'react';
import { View, Text, ScrollView, Animated, Easing } from 'react-native';
import { Card } from 'react-native-elements';

import { connect } from 'react-redux'
import { baseUrl } from "../shared/baseUrl";
import { Loading } from './LoadingComponent';

const mapStateToProps = state => {
    // only map that part of store requird in this page
    return {
        dishes: state.dishes,
        promotions: state.promotions,
        leaders: state.leaders
    }
};


function RenderItem(props) {
    const item = props.item;

    if (props.isLoading) {
        return(
            <Loading />
        );
    }

    else if (props.errMess) {
        return(
            <View>
                <Text>{props.errMess}</Text>
            </View>
        )
    }

    else {
        if (item != null) {
            return (
                <Card 
                    featuredTitle = {item.name}
                    featuredSubtitle={item.designation}
                    image={{ uri: baseUrl + item.image }} >
                    <Text style={{margin: 10}}>
                        {item.description}
                    </Text>
                    </Card>
            )
        }
        else {
            return(<View></View>)
        }
    }
}
class Home extends Component {

    //add constructor to use animation
    constructor(props) {
        super(props);
        this.animatedValue = new Animated.Value(0);
    };

    componentDidMount() {
        this.animate();
    }

    animate() {
        this.animatedValue.setValue(0);
        //implement this function to change animatedValue as function of time
        Animated.timing(
            this.animatedValue,
            {
                toValue: 8, //change from 0-8 in 8 seconds linearly
                duration: 8000,
                easing: Easing.linear
            }
        ).start(() => this.animate()) //run callback inside start after one cycle completes and call the fucntion again
    } //using this value do some interpolation

    render () {

        const xpos1 = this.animatedValue.interpolate({
            inputRange: [0, 1, 3, 5, 8], //use input value to change outptutRange
            outputRange: [1200, 600, 0, -600, -12000]
        });

        const xpos2 = this.animatedValue.interpolate({
            inputRange: [0, 2, 4, 6, 8], //use input value to change outptutRange
            outputRange: [1200, 600, 0, -600, -12000]
        });

        const xpos3 = this.animatedValue.interpolate({
            inputRange: [0, 3, 5, 7, 8], //use input value to change outptutRange
            outputRange: [1200, 600, 0, -600, -12000]
        });

        return (
            <View style={ { flex:1, flexDirection: 'row', justifyContent: 'center'  }}>
                <Animated.View style={{ width: '100%', transform: [{ translateX: xpos1 }] }}>
                    <RenderItem item={this.props.dishes.dishes.filter((dish) => dish.featured)[0]} 
                        isLoading={this.props.dishes.isLoading} errMess={this.props.dishes.errMess} />                   
                </Animated.View>

                <Animated.View style={{ width: '100%', transform: [{ translateX: xpos2 }] }}>
                    <RenderItem item={this.props.promotions.promotions.filter((promo) => promo.featured)[0]} 
                        isLoading={this.props.dishes.isLoading} errMess={this.props.dishes.errMess}/>
                </Animated.View>

                <Animated.View style={{ width: '100%', transform: [{ translateX: xpos3 }] }}>
                    <RenderItem item={this.props.leaders.leaders.filter((leader) => leader.featured)[0]} 
                        isLoading={this.props.dishes.isLoading} errMess={this.props.dishes.errMess}/>
                </Animated.View>
                
            </View>        
        );
    }
}

export default connect(mapStateToProps)(Home);