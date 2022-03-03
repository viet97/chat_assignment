import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

class Loading extends Component {
    render() {
        if (!this.props.loading)
            {return null;}
        return (
            <View
                style={{
                    position: 'absolute',
                    ...StyleSheet.absoluteFill,
                    backgroundColor: 'rgba(33, 33, 33, 0.6)',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <ActivityIndicator
                    color="green"
                    size={'large'} />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state?.SettingReducer?.loading,
    };
};

export default connect(mapStateToProps, null)(Loading);

