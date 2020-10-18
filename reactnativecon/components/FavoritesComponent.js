import React, { Component } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux'
import { baseUrl } from "../shared/baseUrl";
import { Loading } from './LoadingComponent';
import { NavigationHelpersContext } from '@react-navigation/native';
import Swipeout from 'react-native-swipeout';
import { deleteFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        favorites: state.favorites
    }
};

const mapDispatchToProps = dispatch => ({
    deleteFavorite: (dishId) => dispatch(deleteFavorite(dishId))
});

class Favorites extends Component {

    
    render() {
        // one of the props received is navigate
        const { navigate } = this.props.navigation;

        const  renderMenuItem = ({item, index}) => {

            //swipe options. coded here as needed for each item.
            const rightButton = [
                {
                    text: 'Delete',
                    type: 'delete',
                    onPress: () => {
                        //show alert msg before user can delete. Options - title, text, and array of buttons
                        Alert.alert(
                            'Delete Favorite?',
                            'Are you sure you wish to delete the favorite dish '+ item.name +' ?',
                            [
                                { 
                                    text: 'Cancel', 
                                    onPress: () => console.log(item.name + ' Not Deleted'),
                                    style: 'cancel'
                                },
                                {
                                    text: 'OK',
                                    onPress: () => this.props.deleteFavorite(item.id)
                                }
                            ],
                            { cancelable: false} //so user can't dismiss the dialog
                        );
                    }
                }
            ];

            return (
                <Swipeout right={rightButton} autoClose={true}>
                    <Animatable.View useNativeDriver={true} animation="fadeInRightBig" duration={2000}>
                        <ListItem
                            key={index}
                            title={item.name}
                            subtitle={item.description}
                            onPress={() => navigate('Dishdetail', {dishId: item.id})}
                            leftAvatar={{source: {uri: baseUrl + item.image }}}
                            />
                    </Animatable.View>
                </Swipeout>
            );
        }

        if (this.props.dishes.isLoading) {
            return (
                <Loading />
            );
        }

        else if (this.props.dishes.errMess) {
            return (
                <View>
                    <Text>{this.props.dishes.errMess}</Text>
                </View>
            );
        }

        else {
            return (
                <FlatList 
                    data={this.props.dishes.dishes.filter(dish => this.props.favorites.some(el => el === dish.id))}
                    renderItem={renderMenuItem}
                    keyExtractor={item => item.id.toString()}
                    />
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
