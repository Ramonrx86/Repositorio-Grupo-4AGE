import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'; 


import MapaScreen from './screens/MapaScreen';
import CalendarioScreen from './screens/CalendarioScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let nombreicon;

            if (route.name === 'Mapa') {
              nombreicon = focused ? 'map-marker' : 'map-marker';
            } else if (route.name === 'Calendario') {
              nombreicon = focused ? 'calendar' : 'calendar';
            }

            return <FontAwesome name={nombreicon} size={30} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { paddingBottom: 20, height: 70 },
        })}
      >
        <Tab.Screen 
          name="Mapa" 
          component={MapaScreen} 
          options={{ headerShown: false, tabBarLabel: () => null }} 
        />
        <Tab.Screen 
          name="Calendario" 
          component={CalendarioScreen} 
          options={{ headerShown: false, tabBarLabel: () => null }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
