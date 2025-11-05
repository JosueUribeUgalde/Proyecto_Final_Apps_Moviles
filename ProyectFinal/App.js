import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Welcome, Login, Register, History, PasswordReset, Logout,Home, Profile, EditProfile, ConfirmationReplace, Calendar, ListAdmin, ReportScreen, AddReport, Help } from "./src/screens";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom', // Esta animación es más suave tanto al avanzar como al retroceder
          }}
        >
          <Stack.Screen name="Welcome" component={Welcome} />
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
          <Stack.Screen name="ListAdmin" component={ListAdmin} />
          <Stack.Screen name="ReportScreen" component={ReportScreen} />
          <Stack.Screen name="AddReport" component={AddReport} />
          <Stack.Screen name="Help" component={Help} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

