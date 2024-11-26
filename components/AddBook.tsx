import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { useState } from 'react';
import CircleButton from '@/components/CircleButton';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';

type Props = {
    bookTitle: string;
    authorName: string;
    imagePath: string;
    note: string;
    statut: "Lu";
    handleOk: () => void;
    handleCancel: () => void;
    setTitreLivre: (str: string) => void;
    setNomAuteur: (str: string) => void;
    setImagePath: (str: string) => void;
};

export default function AddBook({ bookTitle, authorName, imagePath, note, statut, handleOk, handleCancel, setTitreLivre, setNomAuteur, setImagePath }: Props) {
    const [scanned, setScanned] = useState(true);
    let camera: CameraView;

    function handleCancelCamera() {
        setScanned(true);
    }

    const handleOkImage = async () => {
        console.log("Prise de photo...");
        if (!camera) return
        await camera.takePictureAsync().then((photo) => {
            if (photo !== undefined) {
                console.log("Prise de la photo ==> " + photo.uri);
                setImagePath(photo.uri);
                setScanned(true);
            }
        })
    }

    return (
        <View style={stylesAddBook.container}>
            <Text style={stylesAddBook.textAdd}>Information à remplir :</Text>
            <TextInput
                style={stylesAddBook.textinput}
                placeholder="Entre le titre du livre..."
                onChangeText={newText => setTitreLivre(newText)}
                defaultValue={bookTitle}
            />
            <TextInput
                style={stylesAddBook.textinput}
                placeholder="Entre le nom de l'auteur.trice..."
                onChangeText={newText => setNomAuteur(newText)}
                defaultValue={authorName}
            />
            {
                !scanned &&
                <View>
                    <CameraView facing='back' ref={(r) => {
                        if (r !== null)
                            camera = r
                    }}>
                        <View style={stylesAddBook.buttonCameraContainer}>
                            <CircleButton iconName="check" onPress={handleOkImage} />
                            <CircleButton iconName="cancel" onPress={handleCancelCamera} />
                        </View>
                    </CameraView>
                </View>
            }
            {
                scanned &&
                <View style={stylesAddBook.buttonContainer}>
                    <CircleButton iconName="camera" onPress={() => setScanned(false)} />
                </View>
            }
            {
                imagePath !== '' &&
                <View style={stylesAddBook.container}>
                    <Image source={imagePath} style={stylesAddBook.image} />
                </View>
            }
            {/* Ajouter La note et les statuts : Lu, Pas Lu, A Lire */}
            <View style={stylesAddBook.buttonContainerAdd}>
                <CircleButton iconName="check" onPress={handleOk} />
                <CircleButton iconName="cancel" onPress={handleCancel} />
            </View>
        </View>
    );
}

const stylesAddBook = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    image: {
        height: 150,
        borderRadius: 18,
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
    buttonContainerAdd: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    buttonCameraContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
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
        backgroundColor: 'white'
    }
});
