import { ImageBackground, Text, TextInput, View, StyleSheet, Linking } from 'react-native';
import { Asset } from "expo-asset";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import appJson from '@/app.json';
import { useBibliothequeNAContext } from '@/hooks/BibliothequeNAContext';
import { ExternalLink } from '@/components/ExternalLink';

const PlaceholderImage = { uri: Asset.fromModule(require('@/assets/images/background.png')).uri };

export default function AboutScreen() {
  const { bdd, setBdd } = useBibliothequeNAContext();
  const handlePress = () => {
    const url = encodeURI('https://jlucblennie.atlassian.net/jira/software/form/fb30e4bc-061d-481f-8751-95292c8c5d79');

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        console.log("Ouverture de l'URL :", url);
        Linking.openURL(url);
      } else {
        console.warn("Impossible d'ouvrir l'URL :", url);
      }
    }).catch((err) => console.error("Erreur avec l'URL :", err));
  };

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
          <View style={{ paddingTop: 20 }}>
            <Text style={styles.textbug} onPress={handlePress}>Rapporter un Bug !!!</Text>
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
  textbug: {
    color: 'yellow',
    fontSize: 18,
    borderWidth: 2,
    borderColor: 'yellow'
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
