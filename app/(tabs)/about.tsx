import { ImageBackground, Text, TextInput, View, StyleSheet } from 'react-native';
import { Asset } from "expo-asset";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import appJson from '@/app.json';
import { useBiblothequeNAContext } from '@/hooks/BibliothequeNAContext';

const PlaceholderImage = { uri: Asset.fromModule(require('@/assets/images/background.png')).uri };

export default function AboutScreen() {
  const { bdd, setBdd } = useBiblothequeNAContext();
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.imageContainer} source={PlaceholderImage}>
        <View style={styles.aboutcontainer}>
          <FontAwesome5 name="book-open" size={38} color="#ffd33d" />
          <Text style={styles.text}>Version de l'application</Text>
          <Text style={styles.text}>Bibliothèque de Na ({appJson.expo.name}) by JLuc - V{appJson.expo.version}</Text>
          <View style={{ padding: 20 }}>
            <Text style={styles.text}>Bibliothèque de Na -- La BDD : </Text>
            <TextInput style={styles.textinput} multiline>{JSON.stringify(bdd)}</TextInput>
          </View>
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
  textinput: {
    color: '#fff',
    padding: 5,
    width: 300,
    borderWidth: 2,
    borderColor: 'white'
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
