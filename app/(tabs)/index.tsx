import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../screens/LoginScreen';
import SignupScreen from '../../screens/SignupScreen';
import DashboardScreen from '../../screens/DashboardScreen';
import SoilMonitoringScreen from '../../screens/SoilMonitoringScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login' }} 
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ title: 'Signup' }} 
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ title: 'Dashboard' }} 
        />
        <Stack.Screen 
          name="SoilMonitoring" 
          component={SoilMonitoringScreen} 
          options={{ title: 'Soil Monitoring' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
