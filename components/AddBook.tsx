import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { useState } from 'react';
import CircleButton from '@/components/CircleButton';

type Props = {
    bookTitle: string;
    authorName: string;
    imagePath: string;
    note: string;
    statut: "Lu";
    handleOk: () => void;
    handleCancel: () => void;
};

export default function AddBook({ bookTitle, authorName, imagePath, note, statut, handleOk, handleCancel }: Props) {
    const [titreLivre, setTitreLivre] = useState(bookTitle);
    const [nomAuteur, setNomAuteur] = useState(authorName);
    const [scanned, setScanned] = useState(true);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Information à remplir :</Text>
            <TextInput
                style={styles.textinput}
                placeholder="Entre le titre du livre..."
                onChangeText={newText => setTitreLivre(newText)}
                defaultValue={bookTitle}
            />
            <TextInput
                style={styles.textinput}
                placeholder="Entre le nom de l'auteur.trice..."
                onChangeText={newText => setNomAuteur(newText)}
                defaultValue={authorName}
            />
            <View style={styles.buttonContainer}>
                <CircleButton iconName="camera" onPress={() => setScanned(false)} />
            </View>
            <Image source={imagePath} style={styles.image} />
            <View style={styles.buttonContainer}>
                <CircleButton iconName="check" onPress={handleOk} />
                <CircleButton iconName="cancel" onPress={handleCancel} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    },
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
