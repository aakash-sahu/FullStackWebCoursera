import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Switch, Button, Modal, Alert,Picker, TouchableOpacity, Platform } from 'react-native';
// import { Picker } from "@react-native-community/picker";
import { Icon } from "react-native-elements";
// import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker'
import Moment from 'moment';
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import * as Calendar from 'expo-calendar';

class Reservation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date:new Date(),
            showModal: false,
            mode: 'date',
            show: false
        };
    }

    handleReservation() {
        console.log(JSON.stringify(this.state));
        // this.toggleModal();
        Alert.alert(
            'Your Reservation OK?',
            `Number of Guests: ${this.state.guests} 
            \nSmoking? ${this.state.smoking} 
            \nDate and Time: ${this.state.date}`,
            [
                {
                    'text': 'Cancel',
                    onPress: () => this.resetForm(),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => {
                        this.presentLocalNotification(this.state.date);
                        this.addReservationToCalendar(this.state.date);
                        this.resetForm();
                    }
                }
            ],
            {cancelable: false}
        )
    }
    
    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date:new Date(),
            mode: 'date',
            show: false
        });
    };

    //obtain permission to show notification
    async obtainNotificationPermission() {
        //as for permission from device
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            //ask again for permission
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications!')
            }
        }
        return permission;
    }

    //
    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound:true
            },
            android: {
                channelId: 'reservation',
                color: '#512DA8'
            }
        });

        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('reservation', {
                name: 'Confusion',
                sound: true,
                // or true for vibrate
                vibrate: [0, 250, 250, 250],
                priority: 'max'
            });
        }
    }

    // Obtain the calendar permission
    async obtainCalendarPermission() {
        let calendarPermission = await Permissions.getAsync(Permissions.CALENDAR);

        if (calendarPermission.status !== 'granted') {
            calendarPermission = await Permissions.askAsync(Permissions.CALENDAR);
            if (calendarPermission.status !== 'granted') {
            Alert.alert('Permission not granted to for calendar!');
            }
        }
        return calendarPermission;
    };

    // Needed for IOS
    async getDefaultCalendarSource() {
        const calendars = await Calendar.getCalendarsAsync();
        const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
        return defaultCalendars[0].source;
    }

    // Function to add reservation detail to calendar
   async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();
        
        const defaultCalendarSource = Platform.OS === 'ios' 
        ? await this.getDefaultCalendarSource() 
        : { isLocalAccount: true, name: 'Expo Calendar' };

        // get calendar ID
        const newCalendarId = await Calendar.createCalendarAsync({
            title: 'Expo Calendar',
            name: 'internalCalendarName',
            color: 'blue',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER
        })

        // Create new calendar event, with adding 2 hours to the start time
        Calendar.createEventAsync(
            newCalendarId,
            {
                title: 'Con Fusion Table Reservation',
                startDate: new Date(Date.parse(date)),
                endDate: new Date(Date.parse(date) + 2*60*60*1000),
                timeZone: 'Asia/Hong_Kong',
                location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
            }
        )
    };

    render () {
        return (
            <Animatable.View useNativeDriver={true} animation="zoomIn" duration={2000} delay={500}>
                <View style={styles.formRow} >
                    <Text style={styles.formLabel}>Number of Guests</Text>
                    <Picker 
                        style = {styles.formItem}
                        selectedValue={this.state.guests}
                        onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}
                    >
                        <Picker.Item label='1' value='1' />
                        <Picker.Item label='2' value='2' />
                        <Picker.Item label='3' value='3' />
                        <Picker.Item label='4' value='4' />
                        <Picker.Item label='5' value='5' />
                        <Picker.Item label='6' value='6' />
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Smoking/Non-Smoking</Text>
                    <Switch style={styles.formItem}
                        value={this.state.smoking}
                        trackColor='#512DA8'
                        onValueChange={(value) => this.setState({smoking:value})}
                        >
                    </Switch>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date and Time</Text>
                    <TouchableOpacity style={styles.formItem}
                        style ={{
                            padding:7,
                            borderColor: '#512DA8',
                            borderWidth: 2,
                            flexDirection: 'row'
                        }}
                        onPress={() => this.setState({show: true, mode: 'date'})}
                        >
                            <Icon type='font-awesome' name='calendar' color='#512DA8' />
                    <Text>{' '+ Moment(this.state.date).format('DD-MMM-YYYY h:mm A')}</Text>
                        </TouchableOpacity>
                    {this.state.show && (<DateTimePicker
                                            value={this.state.date}
                                            mode={this.state.mode}
                                            minimumDate={new Date()}
                                            minuteInterval={30}
                                            onChange={(event, date) => {
                                                if (date===undefined){
                                                    this.setState({show:false});
                                                }
                                                else {
                                                    this.setState({
                                                        show: this.state.mode === 'time'?false:true,
                                                        mode:'time',
                                                        date:new Date(date)
                                                    })
                                                }
                                            }}
                                        />
                        )}
                </View>
                <View style={styles.formRow}>
                    <Button 
                        title='Reserve'
                        color='#512DA8'
                        onPress={() => this.handleReservation()}
                        accessibilityLabel='Learn more about this purple button'
                    />
                </View>
                {/* <Modal 
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => {this.toggleModal(); this.resetForm()}}
                    onRequestClose={() => {this.toggleModal(); this.resetForm()}}
                    >
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Your Reservation</Text>
                        <Text style={styles.modalText}>Number of Guests: {this.state.guests}</Text>
                        <Text style={styles.modalText}>Smoking? : {this.state.smoking ? 'Yes' : 'No'}</Text>
                        <Text style={styles.modalText}>Date and TIme : {this.state.date}</Text>
                        <Button 
                            onPress={() => {this.toggleModal(); this.resetForm()}}
                            color='#512DA8'
                            title='Close'
                            />
                    </View>
                </Modal> */}
            </Animatable.View>
        );
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

export default Reservation;