import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppStack } from './router/StackNavigator';

class AppNavigator extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer
        ref={ref => (this.navigation = ref)}
        {...this.props}
      >
        <AppStack />
      </NavigationContainer>
    );
  }
}

export default AppNavigator;
