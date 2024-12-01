import { ImageBackground, StyleSheet, View, Text, TextInput, Alert, FlatList, Pressable } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState, useContext, useEffect } from 'react';
import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system';
import { File, Paths } from 'expo-file-system/next';
import CircleButton from '@/components/CircleButton';
import AddBook from '@/components/AddBook';
import QDeleteBook from '@/components/QDeleteBook';
import BookCard from '@/components/BookCard';
import Button from '@/components/Button';
import * as SecureStore from 'expo-secure-store';
import { useBiblothequeNAContext } from '@/hooks/BibliothequeNAContext';

const PlaceholderImage = { uri: Asset.fromModule(require('@/assets/images/background.png')).uri };

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(true);
  const [imagePath, setImagePath] = useState('');
  const [alreadyRead, setAlreadyRead] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);
  const [toAdd, setToAdd] = useState(false);
  const [titreLivre, setTitreLivre] = useState('');
  const [nomAuteur, setNomAuteur] = useState('');
  const [isbn, setISBN] = useState('');
  const {bdd, setBdd} = useBiblothequeNAContext();
  const [idBookToDelete, setIdBookToDelete] = useState(-1);
  const [idBookToEdit, setIdBookToEdit] = useState(-1);
  const [editBook, setEditBook] = useState(false);
  const [delBook, setDelBook] = useState(false);

  if (firstLaunch) {
    SecureStore.getItemAsync("bdd").then((value: string | null) => {
      console.log("Index : Valeur stockée = " + value);
      if (value !== null)
        setBdd(JSON.parse(value));
      console.log("Index : ReadBDD ==> ");
      console.log(bdd);
    });
    setFirstLaunch(false);
  }


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

  async function ensureDirExists(dir: string) {
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      console.log("Gif directory doesn't exist, creating…");
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  }

  function saveBDD(): string {
    console.log("SaveBDD ==> " + bdd);
    const bibNaDir = Paths.document + "BibliothequeNa/";
    console.log("SaveBDD ==> " + bibNaDir);
    ensureDirExists(bibNaDir).then(() => {
      const file = new File(bibNaDir, 'bdd.json');
      FileSystem.getInfoAsync(file.uri).then((fileInfo) => {
        console.log("SaveBDD ==> FileInfo " + fileInfo);
        if (!fileInfo.exists) {
          file.create(); // can throw an error if the file already exists or no permission to create it
        }
      });
      file.write(JSON.stringify(bdd));
      console.log("SaveBDD ==> Ecriture du fichier " + file.uri);
      console.log(file.text()); // Hello, world!
      return file.uri;
    }).catch((error) => {
      console.error(error);
      return "Pas de sauvegarde";
    });
    return "Pas de sauvegarde";
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
    let livreInWishList = false;
    bdd.map((item) => {
      console.log("ISBN de BDD = " + item.isbn + " vs ISBN Scanned = " + scanningResult.data);
      if (item.isbn === scanningResult.data || item.name === titreLivre) {
        livreTrouve = true;
        livreInWishList = (item.statut === "Wish");
      }
    });
    if (livreTrouve) {
      if (livreInWishList)
        Alert.alert("Tu l'as déjà dans la Wish List !!!");
      else
        Alert.alert("Tu l'as déjà Lu !!!");
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
    idNewBook = bdd.length + 1;
    bdd.push({
      "id": idNewBook, "isbn": isbn, "name": titreLivre, "author": nomAuteur, "image": imagePath, "note": "4", "statut": "Lu"
    });
    console.log(bdd);
    SecureStore.setItemAsync("bdd", JSON.stringify(bdd)).then(() => {
      console.log("Fichier rempli");
      const filePath = saveBDD();
      console.log("BDD sauvee... " + filePath);
    }).catch(err => {
      console.log("Pb : " + err);
    }).finally(() => {
      setAlreadyRead(true);
      setToAdd(false);
      setTitreLivre('');
      setNomAuteur('');
    });
  }

  function handleCancelCamera() {
    setScanned(true);
  }

  function openBookCard(id: number) {
    console.log("ouverture de la carte : " + id);
  }

  function deleteBook(idBook: number) {

    console.log("suppression du livre : " + idBook);
    bdd.forEach((value: { id: number; isbn: string; name: string; author: string; image: string; note: string; statut: string; }) => {
      if (value.id === idBook) {
        console.log("suppression du livre : " + value.name);
        setIdBookToDelete(value.id);
        setTitreLivre(value.name);
        setNomAuteur(value.author);
        setDelBook(true);
      }
    })
  }

  function deleteBookFromBDD() {
    console.log("Delete Book : " + titreLivre + " -> idBookToDelete : " + idBookToDelete);
    var index: number = bdd.findIndex((item, i) => {
      if (item.id === idBookToDelete)
        return i;
    });
    console.log("Delete Book : " + titreLivre + " -> index : " + index);
    bdd.splice(index, 1);
    SecureStore.setItemAsync("bdd", JSON.stringify(bdd)).then(() => {
      console.log("Fichier rempli");
    }).catch(err => {
      console.log("Pb : " + err);
    });
    setDelBook(false);
    setIdBookToDelete(-1);
    setTitreLivre('');
    setNomAuteur('');
  }

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.imageContainer} source={PlaceholderImage}>
        {delBook &&
          <QDeleteBook bookTitle={titreLivre} authorName={nomAuteur} imagePath={imagePath} note={2} statut={"Lu"} handleOK={() => { deleteBookFromBDD() }} handleCancel={function (): void {
            setDelBook(false);
          }} />
        }
        {!delBook && scanned && alreadyRead &&
          <View style={styles.listcontainer}>
            <Text style={styles.listTitle}>
              Mes Livres :
            </Text>
            <FlatList
              style={styles.flatlist}
              data={bdd}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) =>
                item.statut !== "Wish" ? <View ><Pressable onPress={() => { openBookCard(item.id) }} onLongPress={() => { deleteBook(item.id) }}><BookCard bookTitle={item.name} authorName={item.author} imagePath={item.image} note={parseInt(item.note)} statut={item.statut} /></Pressable></View> : <View />
              }
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        }
        {!delBook && !scanned &&
          <View style={styles.listcontainer}>
            <CameraView facing='back' barcodeScannerSettings={{
              barcodeTypes: ["ean13"],
            }} onBarcodeScanned={scanned ? undefined : scannedCode}>
              <View style={styles.buttonCameraContainer}>
                <CircleButton iconName="cancel" onPress={handleCancelCamera} />
              </View>
            </CameraView>
          </View>
        }
        {
          !delBook && scanned && alreadyRead &&
          <View style={styles.buttonContainer}>
            <CircleButton iconName="camera" onPress={() => setScanned(false)} />
          </View>
        }
        {
          !delBook && scanned && !alreadyRead && !toAdd &&
          <View style={styles.containerQuestion}>
            <Text style={styles.text}>Tu veux l'ajouter dans ta liste des livres lus ?</Text>
            <View style={styles.buttonContainerQuestion}>
              <CircleButton iconName="check" onPress={handleAjouter} />
              <CircleButton iconName="cancel" onPress={handleNePasAjouter} />
            </View>
          </View>
        }
        {
          !delBook && scanned && !alreadyRead && toAdd &&
          <AddBook bookTitle={titreLivre} authorName={nomAuteur} imagePath={imagePath} note={''} statut={'Lu'} handleOk={handleOk} handleCancel={handleCancel} setImagePath={setImagePath} setNomAuteur={setNomAuteur} setTitreLivre={setTitreLivre} />
        }
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
  containerQuestion: {
    flex: 1,
    backgroundColor: 'transparent',
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
    flexDirection: 'column-reverse',
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  buttonContainerQuestion: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  buttonCameraContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
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
