import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { useState } from 'react';
import CircleButton from '@/components/CircleButton';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import ModalSelector from 'react-native-modal-selector';
import Note from '@/components/Note';

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

export default function EditBook({ bookTitle, authorName, imagePath, note, statut, handleOk, handleCancel, setTitreLivre, setNomAuteur, setImagePath, setStatut, setNote }: Props) {
    const [scanned, setScanned] = useState(true);
    const [imageTmp, setImageTmp] = useState({ uri: imagePath });
    const [selectedStatut, setSelectedStatut] = useState<string>(statut === '' ? 'Sélectionnez une option' : (statut === 'Wish' ? 'A Lire' : 'Lu'));

    console.log("EditBook Statut : " + statut);
    const data = [
        { key: 1, label: 'Lu' },
        { key: 2, label: 'A Lire' }
    ];

    let camera: CameraView;

    function handleCancelCamera() {
        setScanned(true);
    }

    function onChangeStatut(value: string) {
        setSelectedStatut(value);
        if (value === 'Lu') {
            setStatut('Lu');
        } else {
            setStatut('Wish');
        }
    }

    const handleOkImage = async () => {
        console.log("Prise de photo...");
        if (!camera) return
        await camera.takePictureAsync().then((photo) => {
            if (photo !== undefined) {
                console.log("Prise de la photo ==> " + photo.uri);
                setImagePath(photo.uri);
                setImageTmp(photo);
                setScanned(true);
            }
        })
    }

    return (
        <View style={stylesAddBook.container}>
            {scanned &&
                <View style={{ flex: 5 }}>
                    <Text style={stylesAddBook.textAdd}>Information à modifier :</Text>
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
                <View style={stylesAddBook.container}>
                    <CameraView facing='back' ref={(r) => {
                        if (r !== null)
                            camera = r
                    }}>
                        <View style={stylesAddBook.buttonbottomplaced}>
                            <View style={stylesAddBook.buttonCameraContainer}>
                                <View style={{ paddingRight: 50 }}><CircleButton iconName="check" onPress={handleOkImage} /></View>
                                <View style={{ paddingLeft: 50 }}><CircleButton iconName="cancel" onPress={handleCancelCamera} /></View>
                            </View>
                        </View>
                    </CameraView>
                </View>
            }
            {
                (scanned && imageTmp.uri.length === 0) &&
                <View style={stylesAddBook.buttonContainer}>
                    <CircleButton iconName="camera" onPress={() => setScanned(false)} />
                </View>
            }
            {
                scanned &&
                <View style={stylesAddBook.buttonContainerAdd}>
                    <View style={{ paddingRight: 50 }}><CircleButton iconName="check" onPress={handleOk} /></View>
                    <View style={{ paddingLeft: 50 }}><CircleButton iconName="cancel" onPress={handleCancel} /></View>
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
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
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
