import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { connect } from 'react-redux';
import auth from '@react-native-firebase/auth';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import UserAction from '../actions/UserAction';
import SettingAction from '../actions/SettingAction';

class LoginScreen extends Component {
    onFacebookButtonPress = async () => {
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }

        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            throw 'Something went wrong obtaining access token';
        }

        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

        return auth().signInWithCredential(facebookCredential);
    }

    onGoogleButtonPress = async () => {
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
    }

    render() {
        const { saveProfile, navigation, enableLoading } = this.props
        return (
            <View
                style={{ flex: 1 }}>
                <Pressable
                    onPress={async () => {
                        try {
                            enableLoading(true)
                            const loginResponse = await this.onFacebookButtonPress()
                            enableLoading(false)
                            if (loginResponse) {
                                saveProfile(loginResponse)
                                navigation.navigate("home")
                            }
                        } catch (error) {
                            enableLoading(false)
                        }
                    }}
                    style={styles.loginFB}>
                    <Text
                        style={{
                            color: "black"
                        }}>Login Facebook</Text>
                </Pressable>
                <Pressable
                    onPress={async () => {
                        try {
                            try {
                                enableLoading(true)
                                const loginResponse = await this.onGoogleButtonPress()
                                enableLoading(false)
                                if (loginResponse) {
                                    saveProfile(loginResponse)
                                    navigation.navigate("home")
                                }
                            } catch (error) {
                                enableLoading(false)
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    }}
                    style={styles.loginGoogle}>
                    <Text
                        style={{
                            color: "black"
                        }}>Login Google</Text>
                </Pressable>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.UserReducer,
    };
};

const mapDispatchToProps = (dispatch, getState) => {
    return {
        saveProfile: (data) => dispatch(UserAction.saveProfile(data)),
        enableLoading: (enable) => dispatch(SettingAction.enableLoading(enable)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
    loginGoogle: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "orange"
    },
    loginFB: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "blue"
    },
})