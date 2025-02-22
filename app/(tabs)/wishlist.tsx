import { ImageBackground, StyleSheet, View, Text, Alert, Dimensions } from 'react-native';
import { useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system';
import CircleButton from '@/components/CircleButton';
import AddBook from '@/components/AddBook';
import QDeleteBook from '@/components/QDeleteBook';
import Button from '@/components/Button';
import * as SecureStore from 'expo-secure-store';
import { useBiblothequeNAContext } from '@/hooks/BibliothequeNAContext';
import BookList from '@/components/BookList';
import BookISBNCamera from '@/components/BookISBNCamera';
import QToAddBook from '@/components/QToAddBook';
import EditBook from '@/components/EditBook';
const { width } = Dimensions.get('window');

const PlaceholderImage = { uri: Asset.fromModule(require('@/assets/images/background.png')).uri };

export default function WishList() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(true);
  const [imagePath, setImagePath] = useState('');
  const [alreadyWished, setAlreadyWished] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);
  const [toAdd, setToAdd] = useState(false);
  const [titreLivre, setTitreLivre] = useState('');
  const [nomAuteur, setNomAuteur] = useState('');
  const [noteLivre, setNoteLivre] = useState(0);
  const [statutLivre, setStatutLivre] = useState('Wish');
  const [isbn, setISBN] = useState('');
  const { bdd, setBdd } = useBiblothequeNAContext();
  const [idBookToDelete, setIdBookToDelete] = useState(-1);
  const [idBookToEdit, setIdBookToEdit] = useState(-1);
  const [editBook, setEditBook] = useState(false);
  const [delBook, setDelBook] = useState(false);

  if (firstLaunch) {
    SecureStore.getItemAsync("bdd").then((value: string | null) => {
      console.log("WishList : Valeur stockée = " + value);
      if (value !== null)
        setBdd(JSON.parse(value));
      console.log("WishList : ReadBDD ==> ");
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

  function saveBDD() {
    SecureStore.setItemAsync("bdd", JSON.stringify(bdd)).then(() => {
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
    let livreInWishList = false;
    bdd.map((item) => {
      console.log("ISBN de BDD = " + item.isbn + " vs ISBN Scanned = " + scanningResult.data);
      if (item.isbn === scanningResult.data || item.name === titreLivre) {
        livreTrouve = true;
        livreInWishList = (item.statut === "Wish");
      }
    });
    if (livreTrouve) {
      if (livreInWishList) {
        Alert.alert("Tu l'as déjà dans la Wish List !!!");
        setAlreadyWished(true);
      } else {
        Alert.alert("Tu l'as déjà Lu !!!");
      }
    } else {
      setAlreadyWished(false);
      console.log("Le livre n'a pas été lu encore... ==> " + scanningResult.data);
    }
    setISBN(scanningResult.data);
  }

  function handleNePasAjouter() {
    setAlreadyWished(true);
    setToAdd(false);
  }

  function handleCancel() {
    setAlreadyWished(true);
    setToAdd(false);
    setTitreLivre('');
    setNomAuteur('');
    setNoteLivre(0);
    setImagePath('');
    setISBN('');
    setStatutLivre('Wish');
  }

  function handleModifyCancel() {
    setAlreadyWished(true);
    setToAdd(false);
    setTitreLivre('');
    setNomAuteur('');
    setNoteLivre(0);
    setStatutLivre('Wish');
    setImagePath('');
    setISBN('');
    setIdBookToEdit(-1);
    setEditBook(false);
  }


  function handleAjouter() {
    setToAdd(true);
  }

  function handleOk() {
    console.log("ajouter le livre : " + titreLivre + " de " + nomAuteur);
    let idNewBook: number;
    idNewBook = bdd.length + 1;
    bdd.push({
      "id": idNewBook, "isbn": isbn, "name": titreLivre, "author": nomAuteur, "image": imagePath, "note": noteLivre.toString(), "statut": statutLivre
    });
    console.log(bdd);
    SecureStore.setItemAsync("bdd", JSON.stringify(bdd)).then(() => {
      console.log("Fichier rempli");
    }).catch(err => {
      console.log("Pb : " + err);
    });
    setAlreadyWished(true);
    setToAdd(false);
    setTitreLivre('');
    setNomAuteur('');
    setImagePath('');
    setISBN('');
    setNoteLivre(0);
    setStatutLivre('Wish');
  }

  function handleModifyOk() {
    console.log("modifier le livre : " + titreLivre + " de " + nomAuteur);
    var index: number = bdd.findIndex((item, i) => {
      if (item.id === idBookToEdit)
        return i;
    });
    console.log("Edit Book : " + titreLivre + " -> index : " + index);
    bdd.splice(index, 1, {
      "id": idBookToEdit, "isbn": isbn, "name": titreLivre, "author": nomAuteur, "image": imagePath, "note": noteLivre.toString(), "statut": statutLivre
    });
    SecureStore.setItemAsync("bdd", JSON.stringify(bdd)).then(() => {
      console.log("Fichier rempli");
    }).catch(err => {
      console.log("Pb : " + err);
    }).finally(() => {
      setEditBook(false);
      setTitreLivre('');
      setNomAuteur('');
      setNoteLivre(0);
      setImagePath('');
      setISBN('');
      setStatutLivre('Wish');
      setIdBookToEdit(-1);
    });
  }

  function handleCancelCamera() {
    setScanned(true);
  }

  function openBookCard(id: number) {
    console.log("ouverture de la carte : " + id);
    bdd.forEach((value: { id: number; isbn: string; name: string; author: string; image: string; note: string; statut: string; }) => {
      if (value.id === id) {
        console.log("Modification du livre : ");
        console.log(value);
        setTitreLivre(value.name);
        setNomAuteur(value.author);
        setNoteLivre(parseInt(value.note));
        setStatutLivre(value.statut);
        setImagePath(value.image);
        setIdBookToEdit(id);
        setEditBook(true);
      }
    })
  }

  function deleteBook(idBook: number) {

    console.log("suppression du livre : " + idBook);
    bdd.forEach((value: { id: number; isbn: string; name: string; author: string; image: string; note: string; statut: string; }) => {
      if (value.id === idBook) {
        console.log("suppression du livre : " + value.name);
        setIdBookToDelete(value.id);
        setTitreLivre(value.name);
        setNomAuteur(value.author);
        setNoteLivre(parseInt(value.note));
        setStatutLivre(value.statut);
        setImagePath(value.image);
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
      FileSystem.deleteAsync(imagePath).then(() => {
        console.log("Fichier supprime : " + imagePath);
      }).catch(err => {
        console.log("Pb du delete " + imagePath + " : " + err);
      });
    }).catch(err => {
      console.log("Pb : " + err);
    });
    setDelBook(false);
    setIdBookToDelete(-1);
    setTitreLivre('');
    setNomAuteur('');
    setImagePath('');
    setISBN('');
    setNoteLivre(0);
    setStatutLivre('Wish');
  }

  return (
    <View style={styles.container}>
      <ImageBackground style={[{ width: width }, styles.imageContainer]} source={PlaceholderImage}>
        <View style={styles.listcontainer}>
          {delBook &&
            <QDeleteBook bookTitle={titreLivre} authorName={nomAuteur} imagePath={imagePath} note={noteLivre} statut={statutLivre} handleOK={() => { deleteBookFromBDD() }} handleCancel={function (): void {
              setDelBook(false);
            }} />
          }
          {!delBook && !editBook && scanned && alreadyWished &&
            <BookList bdd={bdd} filtre={'Wish'} openBookCard={(id) => openBookCard(id)} deleteBook={(id) => deleteBook(id)} />
          }
          {!delBook && !scanned &&
            <BookISBNCamera scanned={scanned} scannedCode={scannedCode} handleCancelCamera={handleCancelCamera} />
          }
          {
            !delBook && !editBook && scanned && alreadyWished &&
            <View style={styles.buttonContainer}>
              <CircleButton iconName="camera" onPress={() => setScanned(false)} />
            </View>
          }
          {
            !delBook && !editBook && scanned && !alreadyWished && !toAdd &&
            <QToAddBook statut={'Wish'} handleAjouter={handleAjouter} handleNePasAjouter={handleNePasAjouter} />
          }
          {
            !delBook && !editBook && scanned && !alreadyWished && toAdd &&
            <AddBook bookTitle={titreLivre} authorName={nomAuteur} imagePath={imagePath} note={noteLivre} statut={statutLivre} handleOk={handleOk} handleCancel={handleCancel} setImagePath={setImagePath} setNomAuteur={setNomAuteur} setTitreLivre={setTitreLivre} setStatut={setStatutLivre} setNote={setNoteLivre} />
          }
          {
            editBook &&
            <EditBook bookTitle={titreLivre} authorName={nomAuteur} imagePath={imagePath} note={noteLivre} statut={statutLivre} handleOk={handleModifyOk} handleCancel={handleModifyCancel} setImagePath={setImagePath} setNomAuteur={setNomAuteur} setTitreLivre={setTitreLivre} setStatut={setStatutLivre} setNote={setNoteLivre} />
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
    backgroundColor: 'transparent',
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%'
  },
  camera: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 20,
    right: 20
  },
  buttonContainerQuestion: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  buttonCameraContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 20,
    left: 150
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
