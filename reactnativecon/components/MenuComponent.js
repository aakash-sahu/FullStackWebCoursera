import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { DISHES } from '../shared/dishes';

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dishes: DISHES
        };
    }


    render() {
        const renderMenuItem = ({item, index}) => {
            return (
                <ListItem 
                    key={index}
                    title={item.name}
                    subtitle={item.description}
                    hideChevron={true}
                    onPress={() => navigate('Dishdetail', { dishId: item.id })} //pass the dishid to the dish detail component
                    leftAvatar={{source: require('./images/uthappizza.png')}}
                />
            );
        }

        // one of the props received is navigate
        const { navigate } = this.props.navigation;

        return (
            <FlatList 
                data={this.state.dishes}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id.toString()}
            />
        )
    }
}

export default Menu;