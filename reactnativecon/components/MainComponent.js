import React, { Component } from 'react';
import { View, Platform, ScrollView, Text, Image, StyleSheet, ToastAndroid } from "react-native";
import { NavigationContainer  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { Icon } from "react-native-elements";
import NetInfo from '@react-native-community/netinfo'; //to get internet info

import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import Reservation from './ReservationComponent';
import Favorites from './FavoritesComponent';
import Login from './LoginComponent';
 
import { connect } from 'react-redux'
import { fetchDishes, fetchComments, fetchPromos, fetchLeaders,   } from "../redux/ActionCreators";

const mapStateToProps = state => {
    // only map that part of store requird in this page
    return {

    }
};

const mapDispatchToProps = dispatch => ({
    fetchDishes: () => dispatch(fetchDishes()),
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos()),
    fetchLeaders: () => dispatch(fetchLeaders())
});


const HeaderOptions = {
    headerStyle: {
        backgroundColor: '#512DA8'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {color: '#fff'}
};

const CustomDrawerContentComponent = (props) => (
    <ScrollView>
        <View style={StyleSheet.drawerHeader}>
            <View style={{flex:1}}>
                <Image source={require('./images/logo.png')}
                style={StyleSheet.drawerImage}
                />
            </View>
            <View style={{flex:2}}>
                <Text style={StyleSheet.drawerHeaderText}>
                    Ristorante Con Fusion
                </Text>
            </View>
        </View>
        <DrawerItemList {...props} />
    </ScrollView>
)

const MenuNavigator = createStackNavigator(); 

function MenuNavigatorScreen({ navigation }) {
    return (
        <MenuNavigator.Navigator
            initialRouteName="Menu"
            screenOptions={HeaderOptions}>
            <MenuNavigator.Screen 
                name="Menu"
                component={Menu} 
                options={({navigation}) => ({
                    headerLeft: () => (
                        <Icon 
                            name='menu'
                            size={24}
                            color='white'
                            onPress={()=>navigation.toggleDrawer()}
                        />
                    )
                })}
                />
            <MenuNavigator.Screen 
                name="Dishdetail"
                component={Dishdetail}
                options={{ headerTitle: "Dish Detail" }}
            />            
            </MenuNavigator.Navigator>
    );
}

// creating a home stack navigator because stack navigator provides a status bar, title etc.
const HomeNavigator = createStackNavigator();

function HomeNavigatorScreen({ navigation }) {
    return (
        <HomeNavigator.Navigator
        initialRouteName='Home'
        screenOptions={HeaderOptions}
        >
        <HomeNavigator.Screen
            name="Home"
            component={Home}
            options={({navigation}) => ({
                headerLeft: () => (
                    <Icon 
                        name='menu'
                        size={24}
                        color='white'
                        onPress={()=>navigation.toggleDrawer()}
                    />
                )
            })}
        />         
    </HomeNavigator.Navigator>
    );
}

// Stack navigator for Contact Component
const ContactNavigator = createStackNavigator();

function ContactNavigatorScreen({ navigation }) {
    return (
        <ContactNavigator.Navigator
        initialRouteName='Contact'
        screenOptions={HeaderOptions}
    >
        <ContactNavigator.Screen
            name="Contact"
            component={Contact}
            options={({navigation}) => ({
                headerLeft: () => (
                    <Icon 
                        name='menu'
                        size={24}
                        color='white'
                        onPress={()=>navigation.toggleDrawer()}
                    />
                )
            })}
        />         
    </ContactNavigator.Navigator>
    );
}

// Stack navigator for Contact Component
const AboutNavigator = createStackNavigator();

function AboutNavigatorScreen({ navigation }) {
    return (
        <AboutNavigator.Navigator
        initialRouteName='About Us'
        screenOptions={HeaderOptions}
    >
        <AboutNavigator.Screen
            name="About Us"
            component={About}
            options={({navigation}) => ({
                headerLeft: () => (
                    <Icon 
                        name='menu'
                        size={24}
                        color='white'
                        onPress={()=>navigation.toggleDrawer()}
                    />
                )
            })}
        />         
    </AboutNavigator.Navigator>
    );
}

// Stack navigator for Reservation Component
const ReservationNavigator = createStackNavigator();

function ReservationNavigatorScreen({ navigation }) {
    return (
        <ReservationNavigator.Navigator
            initialRouteName='Reservation'
            screenOptions={HeaderOptions}
        >
        <ReservationNavigator.Screen
            name="Reserve Table"
            component={Reservation}
            options={({navigation}) => ({
                headerLeft: () => (
                    <Icon 
                        name='menu'
                        size={24}
                        color='white'
                        onPress={()=>navigation.toggleDrawer()}
                    />
                )
            })}
        />         
    </ReservationNavigator.Navigator>
    );
}

// Stack navigator for Reservation Component
const FavoritesNavigator = createStackNavigator();

function FavoritesNavigatorScreen({ navigation }) {
    return (
        <FavoritesNavigator.Navigator
            initialRouteName='Favorites'
            screenOptions={HeaderOptions}
        >
        <FavoritesNavigator.Screen
            name="My Favorites"
            component={Favorites}
            options={({navigation}) => ({
                headerLeft: () => (
                    <Icon 
                        name='menu'
                        size={24}
                        color='white'
                        onPress={()=>navigation.toggleDrawer()}
                    />
                )
            })}
        />         
    </FavoritesNavigator.Navigator>
    );
}

// Stack navigator for Login Component
const LoginNavigator = createStackNavigator();

function LoginNavigatorScreen({ navigation }) {
    return (
        <LoginNavigator.Navigator
            initialRouteName='Login'
            screenOptions={HeaderOptions}
        >
        <LoginNavigator.Screen
            name="Login"
            component={Login}
            options={({navigation}) => ({
                headerLeft: () => (
                    <Icon 
                        name='menu'
                        size={24}
                        color='white'
                        onPress={()=>navigation.toggleDrawer()}
                    />
                )
            })}
        />         
    </LoginNavigator.Navigator>
    );
}

//Drawer based Navigation
const Drawer = createDrawerNavigator();

function MainNavigator({ navigation }) {
    return(
        <Drawer.Navigator 
            initialRouteName="Home"
            drawerStyle ={{backgroundColor: '#D1C4E9'}}
            drawerContent={props => <CustomDrawerContentComponent {...props}/>}
        >
            <Drawer.Screen name="Login" component={LoginNavigatorScreen} 
                options={{
                    drawerIcon: ({tintColor}) => (
                        <Icon
                        name='sign-in'
                        type='font-awesome'
                        size={24}
                        color={tintColor} 
                        />
                    )
                }}
            />               
            <Drawer.Screen name="Home" 
                component={HomeNavigatorScreen}
                options={{
                    drawerIcon: ({tintColor}) => (
                        <Icon
                        name='home'
                        type='font-awesome'
                        size={24}
                        color={tintColor} 
                        />
                    )
                }}
             />
            <Drawer.Screen name="Menu" component={MenuNavigatorScreen} 
                            options={{
                                drawerIcon: ({tintColor}) => (
                                    <Icon
                                    name='list'
                                    type='font-awesome'
                                    size={24}
                                    color={tintColor} 
                                    />
                                )
                            }}
                    />
            <Drawer.Screen name="Contact" component={ContactNavigatorScreen} 
                            options={{
                                drawerIcon: ({tintColor}) => (
                                    <Icon
                                    name='address-card'
                                    type='font-awesome'
                                    size={22}
                                    color={tintColor} 
                                    />
                                )
                            }}
            />
            <Drawer.Screen name="About" component={AboutNavigatorScreen} 
                    options={{
                        drawerIcon: ({tintColor}) => (
                            <Icon
                            name='info-circle'
                            type='font-awesome'
                            size={22}
                            color={tintColor} 
                            />
                        )
                    }}
                />
            <Drawer.Screen name="My Favorites" component={FavoritesNavigatorScreen} 
                    options={{
                        drawerIcon: ({tintColor}) => (
                            <Icon
                            name='heart'
                            type='font-awesome'
                            size={22}
                            color={tintColor} 
                            />
                        )
                    }}
                />
                <Drawer.Screen name="Reserve Table" component={ReservationNavigatorScreen} 
                    options={{
                        drawerIcon: ({tintColor}) => (
                            <Icon
                            name='cutlery'
                            type='font-awesome'
                            size={22}
                            color={tintColor} 
                            />
                        )
                    }}
                />             
        </Drawer.Navigator>
    );
}



class Main extends Component {
    
componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();

    NetInfo.fetch()
    .then((connectionInfo) => {
        ToastAndroid.show('Initial Network Connectivity Type: ' 
           + connectionInfo.type, 
           ToastAndroid.LONG)
    });

    // NetInfo.getConnectionInfo() 
    //     .then((connectionInfo) => {
    //         ToastAndroid.show('Initial Network Connectivity Type: ' 
    //            + connectionInfo.type + ', efffectiveType: ' + connectionInfo.effectiveType, 
    //            ToastAndroid.LONG)
    //     });

    window.value = NetInfo.addEventListener((connectionChange)=> this.handleConnectivityChange(connectionChange)); //add listerner and run the function on connection change
    
    };

    componentWillUnmount() {
        // stop conenction listener when app is closed. Else it will consume battery.

        // NetInfo.removeEventListener((connectionChange)=> this.handleConnectivityChange(connectionChange))
        window.value();
    };

    handleConnectivityChange = (connectionInfo) => {
        switch (connectionInfo.type) {
            case 'none':
                ToastAndroid.show('You are now offline', ToastAndroid.LONG);
                break;
            case 'wifi':
                ToastAndroid.show('You are now on WiFi', ToastAndroid.LONG);
                break;
            case 'cellular':
                ToastAndroid.show('You are now on Cellular', ToastAndroid.LONG);
                break;
            case 'unknown':
                ToastAndroid.show('You are now on unknown connection', ToastAndroid.LONG);
                break;
            default:
        }
    }


    render() {
        return (
            <NavigationContainer>
                <MainNavigator />
            </NavigationContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    drawerHeader:  {
        backgroundColor: '#512DA8',
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row'
    },
    drawerHeaderText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    drawerImage: {
        margin: 10,
        width: 80,
        height: 60
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);