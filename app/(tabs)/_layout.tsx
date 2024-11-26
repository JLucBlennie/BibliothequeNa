import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#ffd33d',
            headerStyle: {
                backgroundColor: '#25292e'
            },
            headerShadowVisible: false,
            headerTintColor: '#fff',
            tabBarStyle: {
                backgroundColor: '#25292e'
            }
        }}>
            <Tabs.Screen name="index" options={{
                title: 'Ma bibliothèque', tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'library-sharp' : 'library-outline'} color={color} size={24} />)
            }} />
            <Tabs.Screen name="wishlist" options={{
                title: 'Ma Wish List...', tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'list-sharp' : 'list-outline'} color={color} size={24} />)
            }} />
            <Tabs.Screen name="about" options={{
                title: 'About', tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
                )
            }} />
        </Tabs>
    );
}
