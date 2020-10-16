import React, { Component } from 'react';
import {  View,  StyleSheet, Text ,ScrollView,Image } from 'react-native';
import { Icon, Input, CheckBox, Button } from 'react-native-elements';
import * as  SecureStore  from 'expo-secure-store'; //use expo to use native device api
import * as Permissions from 'expo-permissions';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { baseUrl } from "../shared/baseUrl";
import { NavigationContainer } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Asset } from 'expo-asset';

const tabNavigator = createBottomTabNavigator();

// Bottom tabbed navigator
// 'independent={true}' prop while configuring it, this separates the stack and the tabbed navigation thus essentially 
//creating hierarchy 'Drawer > Stack > Tabbed'
function Login() {
    return (
        <NavigationContainer independent={true}>
            <tabNavigator.Navigator
            initialRouteName='Login' 
            tabBarOptions={{
                activeBackgroundColor: '#9575CD',
                inactiveBackgroundColor: '#D1C4E9',
                activeTintColor: '#ffffff',
                activeTintColor: 'gray'
            }}
            >
                <tabNavigator.Screen
                    name='Login'
                    component={LoginTab}
                    options={{
                        title: 'Login',
                        tabBarIcon: ({tintColor}) => (
                            <Icon 
                                name='sign-in'
                                type='font-awesome'
                                size={24}
                                iconStyle={{color: tintColor}} 
                            />
                        )
                    }}
                    />
                <tabNavigator.Screen
                    name='Register'
                    component={RegisterTab}
                    options={{
                        title: 'Register',
                        tabBarIcon: ({tintColor}) => (
                            <Icon 
                                name='user-plus'
                                type='font-awesome'
                                size={24}
                                iconStyle={{color: tintColor}} 
                            />
                        )
                    }}
                    />
                    
            </tabNavigator.Navigator>
        </NavigationContainer>
    );
}

class LoginTab extends Component {

    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }

    componentDidMount() {
        SecureStore.getItemAsync('userinfo') //returns a promise
            .then((userdata) => {
                let userinfo = JSON.parse(userdata);
                if (userinfo) {
                    this.setState({username: userinfo.username});
                    this.setState({password: userinfo.password});
                    this.setState({remember: true}); //putting remember as true because userinfo will be saved only if user has selected remember checkbox
                }
            })
    };

    handleLogin() {
        console.log(JSON.stringify(this.state));
        if (this.state.remember) {
            //key should be the same i.e. 'userinfo'
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({username: this.state.username, password: this.state.password})
            )
            .catch((error) => console.log('Could not save user info', error));
        }
        else {
            SecureStore.deleteItemAsync('userinfo')
            .catch((error) => console.log('Could not delete user info', error))
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <Input 
                    placeholder="Username"
                    leftIcon={{type:'font-awesome', name: 'user-o'}}
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                    inputContainerStyle ={styles.formInput}
                />
                <Input 
                    placeholder="Password"
                    leftIcon={{type:'font-awesome', name: 'key'}}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    inputContainerStyle ={styles.formInput}
                />
                <CheckBox 
                    title="Remember Me"
                    center
                    checked={this.state.remember}
                    onPress={() => this.setState({remember: !this.state.remember})}
                    inputContainerStyle ={styles.formCheckbox}
                />
                <View style={styles.formButton}>
                    <Button 
                            onPress={() => this.handleLogin()}
                            title="Login"
                            icon={<Icon name='sign-in' type='font-awesome' color='white' size={24} />}
                            buttonStyle={{backgroundColor:'#512DA8'}} 
                            />
                </View>
                <View style={styles.formButton}>
                    <Button 
                            onPress={() => this.props.navigation.navigate('Register')}
                            title="Register"
                            clear
                            icon={<Icon name='user-plus' type='font-awesome' color='blue' size={24} />}
                            titleStyle={{color:'blue'}} 
                            />
                </View>                
            </View>
        );
    }

}

//Register tab
class RegisterTab extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            imageUrl: baseUrl +'images/logo.png'
        }
    };

    getImageFromCamera = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        // open the camera and capture picture
        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
            //get image which returns URI
            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4,3]
            });

            //if user didn't cancel the camera option
            if (!capturedImage.cancelled) {
                // this.setState({ imageUrl: capturedImage.uri}) //image will be loaded in the location in the form where we select image
                this.processImage(capturedImage.uri);
            }
        }
    };

    //func takes URI, actions (as array of JS objects) ,and output format (e.g. png)
    processImage = async (imageUri) => {
        let processedImage = await ImageManipulator.manipulateAsync(
            imageUri, 
            [
                { resize: { width: 400 } }
            ],
            { format: 'png' }
        );
        this.setState({ imageUrl: processedImage.uri}) 
        //after this image should be uploaded to imager server and then retrived from server to show on pange
    };

    handleRegister() {
        console.log(JSON.stringify(this.state));
        if (this.state.remember) {
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({username: this.state.username, password: this.state.password})
            )
            .catch((error) => console.log('Could not save user info', error));
        }
    };

    render() {
        return(
            <ScrollView>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: this.state.imageUrl }}
                        loadingIndicatorSource= { require('./images/logo.png') }
                        style={styles.image}
                    />
                    <Button 
                        title='Camera'
                        onPress={this.getImageFromCamera}
                    />
                </View>
                <Input 
                    placeholder="Username"
                    leftIcon={{type:'font-awesome', name: 'user-o'}}
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                    inputContainerStyle ={styles.formInput}
                />
                <Input 
                    placeholder="Password"
                    leftIcon={{type:'font-awesome', name: 'key'}}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    inputContainerStyle ={styles.formInput}
                />
                <Input 
                    placeholder="First Name"
                    leftIcon={{type:'font-awesome', name: 'user-o'}}
                    onChangeText={(firstname) => this.setState({firstname})}
                    value={this.state.firstname}
                    inputContainerStyle ={styles.formInput}
                />
                <Input 
                    placeholder="Last Name"
                    leftIcon={{type:'font-awesome', name: 'user-o'}}
                    onChangeText={(lastname) => this.setState({lastname})}
                    value={this.state.lastname}
                    inputContainerStyle ={styles.formInput}
                />
                <Input 
                    placeholder="Email"
                    leftIcon={{type:'font-awesome', name: 'envelope-o'}}
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    inputContainerStyle ={styles.formInput}
                />                                                     
                <CheckBox 
                    title="Remember Me"
                    center
                    checked={this.state.remember}
                    onPress={() => this.setState({remember: !this.state.remember})}
                    inputContainerStyle ={styles.formCheckbox}
                />
                <View style={styles.formButton}>
                    <Button 
                        onPress={() => this.handleRegister()}
                        title="Register"
                        icon={<Icon name='user-plus' type='font-awesome' color='white' size={24} />}
                        buttonStyle={{backgroundColor:'#512DA8'}} 
                        />
                </View>
            </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 20
    },
    formInput: {
        margin:20,
    },
    formCheckbox: {
        margin: 20,
        backgroundColor: null
    },
    formButton: {
        margin: 60
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    image: {
        margin: 10,
        width: 80,
        height: 60
    },
});

export default Login;