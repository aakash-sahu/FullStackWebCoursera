import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { connect } from 'react-redux'
import { baseUrl } from "../shared/baseUrl";
import { Loading } from './LoadingComponent';

const mapStateToProps = state => {
    // only map that part of store requird in this page
    return {
        leaders: state.leaders
    }
};

function History(props) {
    return(
        <Card 
            title="Our History" >
            <Text>
                Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.
                {'\n'} {'\n'} 
                The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's best cuisines in a pan.
            </Text>
        </Card>
    );
}

function RenderLeaders({item, index}) {

    if (item != null) {
        return (
            <ListItem 
            key={index}
            title={item.name}
            subtitle={item.description}
            leftAvatar={{source: {uri: baseUrl + item.image }}}
            />
        )
    }
    else {
        return(<View></View>)
    }
}

class About extends Component {

    render() {

        if (this.props.leaders.isLoading) {
            return (
                <ScrollView>
                    <History />
                    <Card title="Corporate Leadership"> 
                        <Loading />
                    </Card>
                </ScrollView>
            );
        }
        
        else if (this.props.leaders.errMess) {
            return (
                <ScrollView>
                    <History />
                    <Card title="Corporate Leadership"> 
                        <Text>{this.props.leaders.errMess}</Text>
                    </Card>
                </ScrollView>
            );
        }

        else {
            return( 
                <ScrollView>
                    <History />
                    <Card title="Corporate Leadership">
                        <FlatList 
                            data={this.props.leaders.leaders}
                            renderItem={RenderLeaders}
                            keyExtractor={item => item.id.toString()}
                        />
                    </Card>
                </ScrollView>
            );
        }
    }
}

export default connect(mapStateToProps)(About);