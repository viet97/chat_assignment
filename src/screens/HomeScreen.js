import React, { Component } from 'react'
import { StyleSheet, View, Pressable, TextInput, Text, } from 'react-native'
import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/auth';
import { trim } from 'lodash';
import { connect } from 'react-redux';
import SettingAction from '../actions/SettingAction';

class HomeScreen extends Component {

    state = {
        input: ""
    }

    createRoom = () => {
        const { enableLoading } = this.props
        const newReference = database().ref('/').push();
        enableLoading(true)
        newReference
            .set({
                member: {
                    hostId: firebase.auth().currentUser.uid
                },
                messages: [{
                    from: "",
                    msg: "",
                    timestamp: Date.now()
                }]
            })
            .then(() => {
                this.props.navigation.navigate("chat", {
                    chatId: newReference.key,
                    isHost: true
                })
            }).finally(() => enableLoading(false));
    }

    onChangeText = (input) => {
        this.setState({ input })
    }

    join = async () => {
        const { enableLoading } = this.props
        try {
            const { navigation } = this.props
            const { input } = this.state
            const trimId = trim(input)
            if (!trimId) {
                alert("Room id can't be blank")
                return
            }
            this.setState({ input: "" })
            enableLoading(true)
            const snapshot = await database()
                .ref(trimId)
                .once('value')
            enableLoading(false)
            if (!snapshot.val()) {
                alert("Room not exist")
                return
            }
            const { member } = snapshot.val()
            if (!member) return
            const { hostId, guestId } = member

            if (hostId === firebase.auth().currentUser.uid || guestId === firebase.auth().currentUser.uid) {
                navigation.navigate("chat", {
                    chatId: trimId
                })
                return
            }

            if (!guestId) {
                await database()
                    .ref(`/${trimId}/member`)
                    .update({
                        hostId,
                        guestId: firebase.auth().currentUser.uid
                    })
                navigation.navigate("chat", {
                    chatId: trimId
                })
                return
            }
            alert("A room support only 2 persons")
        } catch (error) {
            enableLoading(false)
        }
    }

    render() {
        const { input } = this.state
        return (
            <View
                style={{ flex: 1 }}
            >
                <Pressable
                    onPress={this.createRoom}
                    style={styles.createRoom}>
                    <Text>
                        Create a room
                    </Text>
                </Pressable>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                    <TextInput
                        style={styles.input}
                        value={input}
                        placeholder={"type id to join room"}
                        placeholderTextColor="gray"
                        onChangeText={this.onChangeText}
                    />
                    <Pressable
                        onPress={this.join}
                    >
                        <Text
                            style={{
                                color: 'black',
                                padding: 16
                            }}>
                            Join
                        </Text>
                    </Pressable>
                </View>
            </View>
        )
    }
}

const mapDispatchToProps = (dispatch, getState) => {
    return {
        enableLoading: (enable) => dispatch(SettingAction.enableLoading(enable)),
    };
};

export default connect(null, mapDispatchToProps)(HomeScreen)

const styles = StyleSheet.create({
    createRoom: {
        padding: 16,
        backgroundColor: 'orange',
        borderRadius: 16
    },
    input: {
        padding: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "gray",
        color: 'black',
        flex: 1,
    },
})