import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal , Button, StyleSheet, Alert, PanResponder} from 'react-native';
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

    //receiver ref as parameter . obtaining a reference to the particular view. variable view contains the reference to 
    //programataically add animation
    handleViewRef = ref => this.view = ref;

    //recognize right to left drag gesture
    const recognizeDrag = ({moveX, moveY, dx, dy }) => {
        //movex - screeen coordinates of recently done gestured, dx,dy - accumulated distance in each axis direction
        // -dx (negative) means right to left..measured from top right corner of screen
        //recognize right to left gesture only
        if(dx < -200)
            return true;
        else
            return false

    };

    //recognize left to right drag gesture. assignment
    const recognizeComment = ({moveX, moveY, dx, dy }) => {
        //movex - screeen coordinates of recently done gestured, dx,dy - accumulated distance in each axis direction
        // -dx (postive) means left to right..measured from top right corner of screen
        if(dx > 200)
            return true;
        else
            return false

    };

    //supply callback to panresponder
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        }, //called when user gesture begins on screen. gestureState contains information about gesture
        onPanResponderGrant: () => {
            //called when panhandler granted permission to perform action
            //then apply animatable function to the view. this recognizes all gestures not just where we are taking action.
            this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'finished' : 'cancelled')) //endState tell what happened at end of animation
        },
        onPanResponderEnd: (e, gestureState) => {
            //guess what kind of gesture user has just performed. pass gesturestate as parameter which contains properties of gesture
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
            //if gesture return alert to add dish to favorite. then all callbacks added to View
                Alert.alert(
                    'Add to Favorites?',
                    'Are you sure you wish to add '+ dish.name + ' to your favorites?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel pressed!'),
                            style: 'cancel'
                        },
                        {
                            text: 'OK',
                            onPress: ()=>props.favorite ? console.log('Already favorite'): props.onPress()
                        }
                    ],
                    { cancelable: false }
                )

            if (recognizeComment(gestureState))
                props.toggleModal();
            return true
        }
    })

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers}> 
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