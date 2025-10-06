import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Login, Register, History, PasswordReset, Logout,Home, Profile, EditProfile, ConfirmationReplace, Calendar  } from "./src/screens";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="PasswordReset" component={PasswordReset} />
          <Stack.Screen name="Logout" component={Logout} options={{ headerShown: false }}/>
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="ConfirmationReplace" component={ConfirmationReplace} />
          <Stack.Screen name="Calendar" component={Calendar} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

