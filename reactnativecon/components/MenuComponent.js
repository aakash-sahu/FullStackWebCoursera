import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux'
import { baseUrl } from "../shared/baseUrl";

const mapStateToProps = state => {
    // only map that part of store requird in this page
    return {
        dishes: state.dishes
    }
};


class Menu extends Component {

    render() {
        const renderMenuItem = ({item, index}) => {
            return (
                <Tile 
                    key={index}
                    title={item.name}
                    caption={item.description}
                    featured
                    onPress={() => navigate('Dishdetail', { dishId: item.id })} //pass the dishid to the dish detail component
                    imageSrc={{uri: baseUrl + item.image }}
                />
            );
        }

        // one of the props received is navigate
        const { navigate } = this.props.navigation;

        return (
            <FlatList 
                data={this.props.dishes.dishes}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id.toString()}
            />
        )
    }
}

export default connect(mapStateToProps)(Menu);