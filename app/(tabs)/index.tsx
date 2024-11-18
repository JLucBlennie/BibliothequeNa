import { ImageBackground, StyleSheet, View, Text, TextInput, Alert, FlatList } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system';
import CircleButton from '@/components/CircleButton';
import Button from '@/components/Button';
import bddJSONFirst from '@/assets/data/bibna.json';
import * as SecureStore from 'expo-secure-store';

const PlaceholderImage = { uri: Asset.fromModule(require('@/assets/images/background.png')).uri };

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(true);
  const [takePicture, setTakePicture] = useState(false);
  const [alreadyRead, setAlreadyRead] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);
  const [toAdd, setToAdd] = useState(false);
  const [titreLivre, setTitreLivre] = useState('');
  const [nomAuteur, setNomAuteur] = useState('');
  const [isbn, setISBN] = useState('');
  const [bddJSON, setBdd] = useState(bddJSONFirst);

  if (firstLaunch) {
    SecureStore.getItemAsync("bdd").then((value: string | null) => {
      console.log("Valeur stockée = " + value);
      if (value !== null)
        setBdd(JSON.parse(value));
    }
    );
    setFirstLaunch(false);
  }
  console.log("ReadBDD ==> ");
  console.log(bddJSON);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} theme="primary" label="grant permission" />
      </View>
    );
  }

  function saveBDD() {
    SecureStore.setItemAsync("bdd", JSON.stringify(bddJSON)).then(() => {
      console.log("Fichier rempli");
    }).catch(err => {
      console.log("Pb : " + err);
    });
  }

  const scannedCode = (scanningResult: BarcodeScanningResult) => {
    setScanned(true);
    console.log("Code barre = " + scanningResult.data);
    console.log("Recherche dans Open Libray...");
    fetch("https://openlibrary.org/search.json?isbn=" + scanningResult.data + "&sort=new&fields=key,title,author").then((result) => {
      console.log("==> Resultat");
      return result.json();
    }).then((resultJson) => {
      resultJson.docs.map((item: { title: any; author_name: any; }) => {
        console.log(item.title + " --> From OpenLibrary...");
        if (item.title !== undefined)
          setTitreLivre(item.title);
        console.log(item.author_name);
        if (item.author_name !== undefined)
          setNomAuteur(item.author_name);
      });
    }).catch((err) => {
      console.log("Pas de connexion à Open Libray..." + err);
    });
    let livreTrouve = false;
    bddJSON.map((item) => {
      console.log("ISBN de BDD = " + item.isbn + " vs ISBN Scanned = " + scanningResult.data);
      if (item.isbn === scanningResult.data || item.name === titreLivre) {
        livreTrouve = true;
      }
    });
    if (livreTrouve) {
      Alert.alert("Tu l'as déjà lu !!!");
      setAlreadyRead(true);
    } else {
      setAlreadyRead(false);
      console.log("Le livre n'a pas été lu encore... ==> " + scanningResult.data);
      setISBN(scanningResult.data);
    }
  }

  function handleNePasAjouter() {
    setAlreadyRead(true);
    setToAdd(false);
  }

  function handleCancel() {
    setAlreadyRead(true);
    setToAdd(false);
    setTitreLivre('');
    setNomAuteur('');
  }

  function handleAjouter() {
    setToAdd(true);
  }

  function handleOk() {
    console.log("ajouter le livre : " + titreLivre + " de " + nomAuteur);
    let idNewBook: number;
    idNewBook = bddJSON.length + 1;
    bddJSON.push({
      "id": idNewBook, "isbn": isbn, "name": titreLivre, "author": nomAuteur, "image": "", "note": "4", "statut": "Lu"
    });
    console.log(bddJSON);
    SecureStore.setItemAsync("bdd", JSON.stringify(bddJSON)).then(() => {
      console.log("Fichier rempli");
    }).catch(err => {
      console.log("Pb : " + err);
    });
    setAlreadyRead(true);
    setToAdd(false);
    setTitreLivre('');
    setNomAuteur('');
  }

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.imageContainer} source={PlaceholderImage}>
        <View style={styles.listcontainer}>
          {scanned && alreadyRead && <View style={styles.listcontainer}>
            <Text style={styles.listTitle}>
              Mes Livres :
            </Text>
            <FlatList
              style={styles.flatlist}
              data={bddJSON}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) =>
                <View >
                  <Text style={styles.text}>{item.name}</Text>
                </View>
              }
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          }
          {!scanned && <CameraView facing='back' barcodeScannerSettings={{
            barcodeTypes: ["ean13"],
          }} onBarcodeScanned={scanned ? undefined : scannedCode}>
            <View style={styles.cameraContainer}>
            </View>
          </CameraView>}
          {
            scanned && alreadyRead && <View style={styles.buttonContainer}><CircleButton iconName="camera" onPress={() => setScanned(false)} /></View>
          }
          {
            scanned && !alreadyRead && !toAdd && <View style={styles.container}>
              <Text style={styles.text}>Tu veux l'ajouter dans ta liste des livres lus ?</Text>
              <View style={styles.buttonContainer}>
                <CircleButton iconName="check" onPress={handleAjouter} />
                <CircleButton iconName="cancel" onPress={handleNePasAjouter} />
              </View>
            </View>
          }
          {
            scanned && !alreadyRead && toAdd && <View style={styles.container}>
              <Text style={styles.text}>Information à remplir :</Text>
              <TextInput
                style={styles.textinput}
                placeholder="Entre le titre du livre..."
                onChangeText={newText => setTitreLivre(newText)}
                defaultValue={titreLivre}
              />
              <TextInput
                style={styles.textinput}
                placeholder="Entre le nom de l'auteur.trice..."
                onChangeText={newText => setNomAuteur(newText)}
                defaultValue={nomAuteur}
              />
              <View style={styles.buttonContainer}>
                <CircleButton iconName="camera" onPress={() => setScanned(false)} />
              </View>
              <View style={styles.buttonContainer}>
                <CircleButton iconName="check" onPress={handleOk} />
                <CircleButton iconName="cancel" onPress={handleCancel} />
              </View>
            </View>
          }
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  imageContainer: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: 400
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: 400
  },
  camera: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  textinput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: 'white'
  },
  listTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transprent'
  },
  flatlist: {
    flex: 1,
    backgroundColor: 'transprent'
  },
  listcontainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center'
  }
});
