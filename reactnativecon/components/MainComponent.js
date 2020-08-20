import React, { Component } from 'react';
import { View, Platform } from "react-native";
import { NavigationContainer  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';

const MenuNavigator = createStackNavigator(); 

function MenuNavigatorScreen({ navigation }) {
    return (
        <MenuNavigator.Navigator
            initialRouteName="Menu"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"
                }
            }}>
            <MenuNavigator.Screen 
                name="Menu"
                component={Menu} />
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
        screenOptions={{
            headerStyle: {
                backgroundColor: "#512DA8"
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                color: "#fff"            
            }
        }}
    >
        <HomeNavigator.Screen
            name="Home"
            component={Home}
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
        screenOptions={{
            headerStyle: {
                backgroundColor: "#512DA8"
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                color: "#fff"            
            }
        }}
    >
        <ContactNavigator.Screen
            name="Contact"
            component={Contact}
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
        screenOptions={{
            headerStyle: {
                backgroundColor: "#512DA8"
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                color: "#fff"            
            }
        }}
    >
        <AboutNavigator.Screen
            name="About Us"
            component={About}
        />         
    </AboutNavigator.Navigator>
    );
}

//Drawer based Navigation
const Drawer = createDrawerNavigator();

function MainNavigator({ navigation }) {
    return(
        <Drawer.Navigator 
            initialRouteName="Home"
            drawerStyle ={{backgroundColor: '#D1C4E9'}}>
            <Drawer.Screen name="Home" component={HomeNavigatorScreen} />
            <Drawer.Screen name="Menu" component={MenuNavigatorScreen} />
            <Drawer.Screen name="Contact" component={ContactNavigatorScreen} />
            <Drawer.Screen name="About" component={AboutNavigatorScreen} />
        </Drawer.Navigator>
    );
}



class Main extends Component {

    render() {
        return (
            <NavigationContainer>
                <MainNavigator />
            </NavigationContainer>
        );
    }
}

export default Main;