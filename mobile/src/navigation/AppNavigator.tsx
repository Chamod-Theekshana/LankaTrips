import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LocationsScreen from '../screens/LocationsScreen';
import PackagesScreen from '../screens/PackagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LocationDetailScreen from '../screens/LocationDetailScreen';
import PackageDetailScreen from '../screens/PackageDetailScreen';
import BookingCheckoutScreen from '../screens/BookingCheckoutScreen';
import BookingSuccessScreen from '../screens/BookingSuccessScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import MyReceiptsScreen from '../screens/MyReceiptsScreen';
import LoadingScreen from '../screens/LoadingScreen';

// Navigation Types
export type RootStackParamList = {
  MainTabs: undefined;
  LocationDetail: { locationId: string };
  PackageDetail: { packageId: string };
  BookingCheckout: { packageId: string };
  BookingSuccess: { bookingId: string };
  MyBookings: undefined;
  MyReceipts: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TabParamList = {
  Home: undefined;
  Locations: undefined;
  Packages: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Locations':
              iconName = 'place';
              break;
            case 'Packages':
              iconName = 'card-travel';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          elevation: 8,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 2,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Locations" 
        component={LocationsScreen}
        options={{ title: 'Locations' }}
      />
      <Tab.Screen 
        name="Packages" 
        component={PackagesScreen}
        options={{ title: 'Packages' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 2,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ 
          title: 'Create Account',
        }}
      />
    </AuthStack.Navigator>
  );
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 2,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="LocationDetail" 
        component={LocationDetailScreen}
        options={{ 
          title: 'Location Details',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="PackageDetail" 
        component={PackageDetailScreen}
        options={{ 
          title: 'Package Details',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="BookingCheckout" 
        component={BookingCheckoutScreen}
        options={{ 
          title: 'Checkout',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="BookingSuccess" 
        component={BookingSuccessScreen}
        options={{ 
          title: 'Booking Confirmed', 
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="MyBookings" 
        component={MyBookingsScreen}
        options={{ 
          title: 'My Bookings',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="MyReceipts" 
        component={MyReceiptsScreen}
        options={{ 
          title: 'My Receipts',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <MainStackNavigator /> : <AuthStackNavigator />;
};

export default AppNavigator;