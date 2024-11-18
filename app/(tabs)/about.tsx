import { Text, View, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { AppOwnership } from 'expo-constants';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="book-open" size={38} color="#ffd33d" />
      <Text style={styles.text}>About</Text>
      <Text style={styles.text}>Bibliothèque de Na by JLuc - V1.0 </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
