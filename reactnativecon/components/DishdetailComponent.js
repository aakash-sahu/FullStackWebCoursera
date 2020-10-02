import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal , Button, StyleSheet} from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux'
import { baseUrl } from "../shared/baseUrl";
import { postFavorite, postComment } from "../redux/ActionCreators";
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    // only map that part of store requird in this page
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites,
    }
};

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

function RenderDish(props) {
    const dish = props.dish;

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card 
                featuredTitle={dish.name}
                image={{ uri: baseUrl+dish.image}}>
                    <Text style = {{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
                        <Icon 
                            raised
                            reverse
                            name={props.favorite ? 'heart':'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={()=>props.favorite?console.log('Already favorite'): props.onPress()}
                            />
                        <Icon 
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#f50'
                            onPress={()=>props.toggleModal()}
                            />
                    </View>
                </Card>
            </Animatable.View>
        )
    }
    else {
        return (<View></View>)
    }
};

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({item, index}) => {
        return (
            <View key={index} style={{margin:10}}>
                <Text style={{fontSize:14}}>{item.comment}</Text>
                <Text style={{fontSize:12}}>{item.rating}</Text>
                <Text style={{fontSize:12}}>{'--' + item.author +',' + item.date}</Text>
            </View>
        )
    };

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comments'>
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    )
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            rating:null,
            author: null,
            comments: null
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    resetForm() {
        this.setState({
            rating:null,
            author: null,
            comment: null
        });
    }

    handleComment(dishId) {
        console.log("Comments:", this.state);
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
        this.resetForm();
    }

    render () {
        const dishId = this.props.route.params.dishId; // route is one of the params passed via props
        return( 
            <ScrollView>
                {/* + converts the string into a number */}
                <RenderDish dish={this.props.dishes.dishes[+dishId]} favorite={this.props.favorites.some(el => el===dishId)} 
                onPress={() => this.markFavorite(dishId)} toggleModal = {() => this.toggleModal()}/> 
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId===dishId)} />
                <Modal 
                animationType={'slide'}
                transparent={false}
                visible={this.state.showModal}
                onDismiss = {()=> {this.toggleModal(); this.resetForm()}}
                onRequestClose={() => {this.toggleModal(); this.resetForm()}}
                >
                <View style={styles.modal}>
                    <View>
                        <Rating
                            type='star' 
                            ratingCount={5}
                            startingValue={0}
                            imageSize={40}
                            showRating
                            style={{marginBottom: 20}}
                            onFinishRating={rating => this.setState({rating: rating})} />
                    </View>
                    <View>
                        <Input 
                            placeholder='Author'
                            leftIcon={{
                                type:'font-awesome',
                                name: 'user-o'
                            }} 
                            onChangeText={value => this.setState({author:value})}
                        />
                    </View>
                    <View>
                    <Input 
                        placeholder='Comment'
                        leftIcon={{
                            type:'font-awesome',
                            name: 'comment-o'
                        }} 
                        onChangeText={value => this.setState({comment:value})}
                    />
                    </View>
                    <View style={styles.formRow}>
                        <Button 
                            onPress={() => {this.toggleModal();this.handleComment(dishId)}}
                            color='#512DA8'
                            title='Submit' />
                    </View>
                    <View style={styles.formRow}>
                        <Button 
                            onPress={() => {this.toggleModal();this.resetForm()}}
                            color='grey'
                            title='Cancel' />  
                    </View>     
                </View>
            </Modal>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    formRow:{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: "row",
        margin: 20
    },

    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1 
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);