import { firebase } from '@react-native-firebase/auth';
import React, { Component, createRef } from 'react';
import { Text, View, FlatList, TextInput, Pressable, StyleSheet, ToastAndroid, Clipboard, Platform } from 'react-native';
import database from '@react-native-firebase/database';
import { trim } from 'lodash';

export default class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.chatId = props.route.params.chatId;
        this.isHost = props.route.params.isHost;
        this.ownId = firebase.auth().currentUser.uid;
        this.state = {
            messages: [],
            input: '',
        };

        this.listRef = createRef();
    }

    componentDidMount() {
        database()
            .ref(`${this.chatId}/messages`)
            .on('value', snapshot => {
                this.setState({ messages: snapshot.val() });
            });
    }

    renderItem = ({ item }) => {
        const isOwnMessage = item.from === this.ownId;
        if (!item.msg || !item.from) {return;}
        return (
            <View
                style={{
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                    marginHorizontal: 16,
                    marginTop: 8,
                    flexDirection: 'row',
                }}>
                <View
                >
                    <Text
                        style={styles.userName}>{item?.userName}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                        }}>
                        <View
                            style={{
                                padding: 8,
                                borderRadius: 24,
                                backgroundColor: isOwnMessage ? 'blue' : 'gray',
                            }}>
                            <Text
                                style={{
                                    color: isOwnMessage ? 'white' : 'black',
                                }}>{item.msg}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    onChangeText = (input) => {
        this.setState({ input });
    }

    send = () => {
        const { input } = this.state;
        const trimInput = trim(input);
        if (!trimInput) {return;}
        this.setState({ input: '' });
        const newMessage = {
            from: this.ownId,
            msg: trimInput,
            timestamp: Date.now(),
            userName: firebase.auth().currentUser.displayName,
        };
        const ref = database()
            .ref(`/${this.chatId}/messages`);
        ref.transaction(messages => ([
            ...messages,
            newMessage,
        ]));
        this.setState((previousState) => ({
            ...previousState,
            messages: [...previousState?.messages, newMessage],
        }));
        setTimeout(() => {
            this.listRef?.current?.scrollToEnd();
        }, 300);
    }

    copyId = () => {
        Clipboard.setString(`${this.chatId}`);
        if (Platform.OS === 'android') {
            ToastAndroid.show('Chat id has been copied', ToastAndroid.SHORT);
        }
    }

    render() {
        const { messages, input } = this.state;
        return (
            <View
                style={{ flex: 1 }}>
                <View
                    style={{ flexDirection: 'row' }}>
                    <Pressable
                        hitSlop={16}
                        onPress={() => this.props.navigation.goBack()}>
                        <Text
                            style={{
                                color: 'black',
                            }}>
                            Leave room
                        </Text>
                    </Pressable>
                    <Text
                        style={styles.chatId}>
                        id: {this.chatId}
                    </Text>
                    <Pressable
                        onPress={this.copyId}
                        hitSlop={16}
                        style={styles.copy}>
                        <Text
                            style={{
                                color: 'white',
                            }}>
                            copy
                        </Text>
                    </Pressable>
                </View>
                <FlatList
                    ref={this.listRef}
                    style={{ flex: 1 }}
                    renderItem={this.renderItem}
                    keyExtractor={item => `${item.timestamp}`}
                    data={messages}
                    extraData={messages} />
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 16,
                    }}>
                    <TextInput
                        style={styles.input}
                        value={input}
                        placeholder={'type message...'}
                        placeholderTextColor="gray"
                        onChangeText={this.onChangeText}
                    />
                    <Pressable
                        hitSlop={16}
                        onPress={this.send}>
                        <Text
                            style={styles.send}>Send</Text>
                    </Pressable>
                </View>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    copy: {
        paddingHorizontal: 8,
        backgroundColor: 'gray',
    },
    send: {
        color: 'black',
    },
    input: {
        padding: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'gray',
        flex: 1,
        color: 'black',
    },
    chatId: {
        color: 'black',
        marginLeft: 16,
    },
    userName: {
        color: 'black',
        textAlign: 'right',
    },
});
