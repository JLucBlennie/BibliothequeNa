import { ImageBackground, Text, View, StyleSheet } from 'react-native';
import { Asset } from "expo-asset";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import appJson from '@/app.json';

const PlaceholderImage = { uri: Asset.fromModule(require('@/assets/images/background.png')).uri };

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.imageContainer} source={PlaceholderImage}>
        <View style={styles.aboutcontainer}>
          <FontAwesome5 name="book-open" size={38} color="#ffd33d" />
          <Text style={styles.text}>Version de l'application</Text>
          <Text style={styles.text}>Bibliothèque de Na ({appJson.expo.name}) by JLuc - V{appJson.expo.version} </Text>
        </View>
      </ImageBackground>
    </View >
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
  imageContainer: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: 400
  },
  aboutcontainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center'
  }
});
