import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login';

const Stack = createStackNavigator();

export default function RootLayout() {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}