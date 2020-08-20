import React, { Component } from 'react';
import { View, Platform, ScrollView, Text, Image, StyleSheet } from "react-native";
import { NavigationContainer  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { Icon } from "react-native-elements";

import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';

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

//Drawer based Navigation
const Drawer = createDrawerNavigator();

function MainNavigator({ navigation }) {
    return(
        <Drawer.Navigator 
            initialRouteName="Home"
            drawerStyle ={{backgroundColor: '#D1C4E9'}}
            drawerContent={props => <CustomDrawerContentComponent {...props}/>}
        >
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

export default Main;