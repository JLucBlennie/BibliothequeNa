import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { useState } from 'react';
import CircleButton from '@/components/CircleButton';
import ModalSelector from 'react-native-modal-selector';
import Note from '@/components/Note';
import BookCamera from './BookCamera';
import * as ImagePicker from 'expo-image-picker';

type Props = {
    bookTitle: string;
    authorName: string;
    imagePath: string;
    note: number;
    statut: string;
    handleOk: () => void;
    handleCancel: () => void;
    setTitreLivre: (str: string) => void;
    setNomAuteur: (str: string) => void;
    setImagePath: (str: string) => void;
    setStatut: (str: string) => void;
    setNote: (num: number) => void;
};

export default function AddBook({ bookTitle, authorName, imagePath, note, statut, handleOk, handleCancel, setTitreLivre, setNomAuteur, setImagePath, setStatut, setNote }: Props) {
    const [scanned, setScanned] = useState(true);
    const [imageTmp, setImageTmp] = useState({ uri: imagePath });
    const [selectedStatut, setSelectedStatut] = useState<string>(statut === '' ? 'Sélectionnez une option' : (statut === 'Wish' ? 'A Lire' : 'Lu'));

    console.log("AddBook Statut : " + statut);
    const data = [
        { key: 1, label: 'Lu' },
        { key: 2, label: 'A Lire' }
    ];

    function handleCancelCamera() {
        setScanned(true);
    }

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
          console.log(result);
          console.log("Prise de la photo ==> " + result.assets[0].uri);
                setImagePath(result.assets[0].uri);
                setImageTmp(result.assets[0]);
                setScanned(true);
        } else {
          alert('You did not select any image.');
        }
      };

    function onChangeStatut(value: string) {
        setSelectedStatut(value);
        if (value === 'Lu') {
            setStatut('Lu');
        } else {
            setStatut('Wish');
        }
    }
    function handleImageDone(imgPath: string) {
        console.log("HandleImageDone chemin ==> " + imgPath);
        setImageTmp({ uri: imgPath });
        console.log("HandleImagedone Photo ==> " + imageTmp.uri);
    }

    return (
        <View style={stylesAddBook.container}>
            {scanned &&
                <View style={{ flex: 5 }}>
                    <Text style={stylesAddBook.textAdd}>Information à remplir :</Text>
                    <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <TextInput
                            style={stylesAddBook.textinput}
                            placeholder="Entre le titre du livre..."
                            onChangeText={newText => setTitreLivre(newText)}
                            defaultValue={bookTitle}
                        />
                    </View>
                    <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <TextInput
                            style={stylesAddBook.textinput}
                            placeholder="Entre le nom de l'auteur.trice..."
                            onChangeText={newText => setNomAuteur(newText)}
                            defaultValue={authorName}
                        />
                    </View>
                    <View style={{ flex: 2, flexDirection: 'row', paddingTop: 5, paddingBottom: 5, alignItems: 'center' }}>
                        <ModalSelector
                            data={data}
                            initValue="Sélectionnez une option"
                            onChange={(option) => onChangeStatut(option.label)}
                            style={stylesAddBook.modalSelector}
                            initValueTextStyle={stylesAddBook.initValueText}
                            optionTextStyle={stylesAddBook.optionText}
                            cancelText="Annuler"
                        >
                            {/* Input qui simule le bouton pour ouvrir le modal */}
                            <TextInput
                                style={stylesAddBook.input}
                                editable={false}
                                placeholder="Sélectionnez une option"
                                value={selectedStatut}
                            />
                        </ModalSelector>
                        <Note note={note} taille={24} handleNote={(note) => { setNote(note); }} />
                    </View>
                    <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <Image source={imageTmp.uri} style={stylesAddBook.image} />
                    </View>
                </View>
            }
            {
                !scanned &&
                <BookCamera handleImageDone={handleImageDone} handleCancelCamera={handleCancelCamera} setImagePath={setImagePath} setScanned={setScanned} />
            }
            {
                (scanned && imageTmp.uri.length === 0) &&
                <View style={stylesAddBook.buttonContainer}>
                    <CircleButton iconName="image" onPress={pickImageAsync} position={'Left'} />
                    <CircleButton iconName="camera" onPress={() => setScanned(false)} position={'Right'} />
                </View>
            }
            {
                scanned &&
                <View style={stylesAddBook.buttonContainerAdd}>
                    <CircleButton iconName="check" onPress={handleOk} position={'Left'} />
                    <CircleButton iconName="cancel" onPress={handleCancel} position={'Right'} />
                </View>
            }
        </View >
    );
}

const stylesAddBook = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    modalSelector: {
        width: '50%',
        marginBottom: 5,
        marginRight: 5
    },
    initValueText: {
        color: '#555',
        fontSize: 16,
    },
    optionText: {
        fontSize: 18,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        fontSize: 16,
        width: '100%',
    },
    image: {
        height: 200,
        borderRadius: 5
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
    buttonbottomplaced: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
        margin: 5,
    },
    buttonContainerAdd: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingBottom: 10
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingBottom: 10
    },
    buttonCameraContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 5,
    },
    textAdd: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    textinput: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        backgroundColor: 'white',
        borderRadius: 5
    }
});
