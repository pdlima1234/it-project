import ForgotPassword from './src/screens/ForgotPassword';
import Login from './src/screens/Login';
import Survey from './src/screens/Survey';
import UserDetails from './src/screens/UserDetails';
import Welcome from './src/screens/Welcome';
import Complete from './src/screens/Complete';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type stackScreens = {
    Login: undefined;
    Welcome: { user: string; id: string; toDo: string[] };
    Survey: { user: string; id: string; survey: string; iteration: number };
    UserDetails: { user: string; id: string };
    ForgotPassword: undefined;
    Complete: { user: string; id: string };
};

export default function App() {
    const Stack = createNativeStackNavigator<stackScreens>();

    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ animation: 'none' }}
                />
                <Stack.Screen
                    name="Welcome"
                    component={Welcome}
                    options={{ animation: 'none' }}
                />
                <Stack.Screen
                    name="Survey"
                    component={Survey}
                    options={{ animation: 'none' }}
                />
                <Stack.Screen
                    name="UserDetails"
                    component={UserDetails}
                    options={{ animation: 'none' }}
                />
                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                    options={{ animation: 'none' }}
                />
                <Stack.Screen
                    name="Complete"
                    component={Complete}
                    options={{ animation: 'none' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
