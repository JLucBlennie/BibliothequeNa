import { ImageBackground, StyleSheet, View, Text, Alert, Dimensions } from 'react-native';
import { useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system';
import { File, Paths } from 'expo-file-system/next';
import * as SecureStore from 'expo-secure-store';
import CircleButton from '@/components/CircleButton';
import AddBook from '@/components/AddBook';
import QDeleteBook from '@/components/QDeleteBook';
import Button from '@/components/Button';
import { useBibliothequeNAContext } from '@/hooks/BibliothequeNAContext';
import EditBook from '@/components/EditBook';
import BookList from '@/components/BookList';
import BookISBNCamera from '@/components/BookISBNCamera';
import QToAddBook from '@/components/QToAddBook';
import ToggleFilter from '@/components/ToggleFilter';
const { width } = Dimensions.get('window');

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
  const [noteLivre, setNoteLivre] = useState(0);
  const [statutLivre, setStatutLivre] = useState('Lu');
  const [isbn, setISBN] = useState('');
  const { bdd, setBdd } = useBibliothequeNAContext();
  const [idBookToDelete, setIdBookToDelete] = useState(-1);
  const [idBookToEdit, setIdBookToEdit] = useState(-1);
  const [editBook, setEditBook] = useState(false);
  const [delBook, setDelBook] = useState(false);
  const [filtreListe, setFiltreListe] = useState('Lu');

  if (firstLaunch) {
    SecureStore.getItemAsync("bdd").then((value: string | null) => {
      console.log("Index : Valeur stockée = " + value);
      if (value !== null)
        // setBdd(JSON.parse(value));
        console.log("Index : ReadBDD ==> ");
      console.log(bdd);
    });
    console.log("==> connexion au server ...");
    fetch("http://51.83.78.37:9090/bibna", {
      method: "GET",
      //   headers: {
      //     "Content-Type": "application/json; charset=utf-8",
      //     Accept: "*/*",
      //     "Cache-Control": "no-cache",
      //   }
    }).then((response) => {
      console.log("La réponse : ");
      console.log(response);
      console.log("Le contenu de la réponse : ");
      response.json().then((json) => {
        console.log(JSON.stringify(json));
        setBdd(json);
        console.log("Index : ReadBDD ==> ");
        console.log(bdd);
      });
    }).catch((err) => {
      console.error(err);
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
    const bibNaDir = Paths.document.uri + "/BibliothequeNa/";
    console.log("SaveBDD ==> " + bibNaDir);
    ensureDirExists(bibNaDir).then(() => {
      const file = new File(bibNaDir, 'bdd.json');
      console.log("Le chemin : " + file);
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
      result.json().then((resultJson) => {
        resultJson.docs.map((item: { title: any; author_name: any; }) => {
          console.log(item.title + " --> From OpenLibrary...");
          if (item.title !== undefined)
            setTitreLivre(item.title);
          console.log(item.author_name);
          if (item.author_name !== undefined)
            setNomAuteur(item.author_name);
        })
      }).catch((err) => {
        console.log("Pas de connexion à Open Libray..." + err);
      });
    }).catch((err) => {
      console.log("Pas de connexion à Open Libray..." + err);
    });
    let livreTrouve = false;
    let livreInWishList = false;
    console.log("BDD = ");
    console.log(bdd);
    bdd.map((item) => {
      console.log("BDD Item : ");
      console.log(item);
      console.log("ISBN de BDD = " + item.isbn + " vs ISBN Scanned = " + scanningResult.data);
      if (item.isbn === scanningResult.data || item.name === titreLivre) {
        livreTrouve = true;
        livreInWishList = (item.statut === "Wish");
      }
    });
    if (livreTrouve) {
      if (livreInWishList) {
        Alert.alert("Tu l'as déjà dans la Wish List !!!");
      } else {
        Alert.alert("Tu l'as déjà Lu !!!");
        setAlreadyRead(true);
      }
    } else {
      setAlreadyRead(false);
      console.log("Le livre n'a pas été lu encore... ==> " + scanningResult.data);
    }
    setISBN(scanningResult.data);
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
    setImagePath('');
    setISBN('');
    setNoteLivre(0);
    setStatutLivre('Lu');
  }

  function handleModifyCancel() {
    setAlreadyRead(true);
    setToAdd(false);
    setTitreLivre('');
    setNomAuteur('');
    setNoteLivre(0);
    setStatutLivre('Lu');
    setImagePath('');
    setISBN('');
    setIdBookToEdit(-1);
    setEditBook(false);
  }

  function handleAjouter() {
    setToAdd(true);
  }

  function handleOk() {
    console.log("ajouter le livre : " + titreLivre + " de " + nomAuteur + " ISBN " + isbn);
    let idNewBook: number;
    idNewBook = bdd.length + 1;
    bdd.push({
      "id": idNewBook, "isbn": isbn, "name": titreLivre, "author": nomAuteur, "image": imagePath, "note": noteLivre.toString(), "statut": statutLivre, "comment": ""
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
      setNoteLivre(0);
      setImagePath('');
      setISBN('');
      setStatutLivre('Lu');
    });
  }
  function handleModifyOk() {
    console.log("modifier le livre : " + titreLivre + " de " + nomAuteur + " id " + idBookToEdit);
    var index: number = bdd.findIndex((item, i) => {
      if (item.id === idBookToEdit){
        console.log("Livre trouvé : " + idBookToEdit)
        return true;
      }
    });
    console.log("Edit Book : " + titreLivre + " -> index : " + index);
    bdd.splice(index, 1, {
      "id": idBookToEdit, "isbn": isbn, "name": titreLivre, "author": nomAuteur, "image": imagePath, "note": noteLivre.toString(), "statut": statutLivre, "comment": ""
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
      setStatutLivre('Lu');
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
        console.log("Modification du livre : " + value.name);
        setTitreLivre(value.name);
        setNomAuteur(value.author);
        setNoteLivre(parseInt(value.note));
        setStatutLivre(value.statut);
        setImagePath(value.image);
        setIdBookToEdit(id);
        setEditBook(true);
        setISBN(value.isbn);
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
    setStatutLivre('Lu');
    setImagePath('');
  }

  function toggleFilter(){
    if (filtreListe === 'Lu'){
      setFiltreListe('Wish');
    } else {
      setFiltreListe('Lu');
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground style={[{ width: width }, styles.imageContainer]} source={PlaceholderImage}>
        {delBook && !editBook &&
          <QDeleteBook bookTitle={titreLivre} authorName={nomAuteur} imagePath={imagePath} note={noteLivre} statut={statutLivre} handleOK={() => { deleteBookFromBDD() }} handleCancel={function (): void {
            setDelBook(false);
          }} />
        }
        {!delBook && !editBook && scanned && alreadyRead &&
          <View style={styles.container}>
            <ToggleFilter filtre={filtreListe} toggleFilter={() => toggleFilter()} />
            <BookList bdd={bdd} filtre={filtreListe} openBookCard={(id) => openBookCard(id)} deleteBook={(id) => deleteBook(id)} />
          </View>
        }
        {!delBook && !editBook && !scanned &&
          <BookISBNCamera scanned={scanned} scannedCode={scannedCode} handleCancelCamera={handleCancelCamera} />
        }
        {
          !delBook && !editBook && scanned && alreadyRead &&
          <View style={styles.buttonContainer}>
            <CircleButton iconName="camera" onPress={() => setScanned(false)} />
          </View>
        }
        {
          !delBook && !editBook && scanned && !alreadyRead && !toAdd &&
          <QToAddBook statut={'Wish'} handleAjouter={handleAjouter} handleNePasAjouter={handleNePasAjouter} />
        }
        {
          !delBook && !editBook && scanned && !alreadyRead && toAdd &&
          <AddBook bookTitle={titreLivre} authorName={nomAuteur} imagePath={imagePath} note={noteLivre} statut={statutLivre} handleOk={handleOk} handleCancel={handleCancel} setImagePath={setImagePath} setNomAuteur={setNomAuteur} setTitreLivre={setTitreLivre} setStatut={setStatutLivre} setNote={setNoteLivre} />
        }
        {
          editBook &&
          <EditBook bookTitle={titreLivre} authorName={nomAuteur} imagePath={imagePath} note={noteLivre} statut={statutLivre} handleOk={handleModifyOk} handleCancel={handleModifyCancel} setImagePath={setImagePath} setNomAuteur={setNomAuteur} setTitreLivre={setTitreLivre} setStatut={setStatutLivre} setNote={setNoteLivre} />
        }
      </ImageBackground>
    </View >
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
