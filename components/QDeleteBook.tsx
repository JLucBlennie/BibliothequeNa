import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';
import CircleButton from '@/components/CircleButton';
import Note from '@/components/Note';

type Props = {
    bookTitle: string;
    authorName: string;
    imagePath: string;
    note: number;
    statut: string;
    handleOK: () => void;
    handleCancel: () => void;
};

export default function QDeleteBook({ bookTitle, authorName, imagePath, note, statut, handleOK, handleCancel }: Props) {
    const imageTmp = { uri: imagePath };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Tu veux supprimer le livre ?</Text>
            <View style={{ flex: 5, flexDirection: 'column' }}>
                <Text style={styles.text}>Livre : {bookTitle}</Text>
                <Text style={styles.text}>Auteur : {authorName}</Text>
                <View style={styles.notestatut}>
                    <Text style={styles.textstatut}>{statut}</Text>
                    <Note note={note} taille={18} />
                </View>
                <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                    <Image source={imageTmp} style={styles.image} />
                </View>
            </View>
            <View style={styles.buttonContainerQuestion}>
                <CircleButton iconName="delete" onPress={handleOK} />
                <CircleButton iconName="cancel" onPress={handleCancel} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 3,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    image: {
        height: 350,
        borderRadius: 5,
    },
    notestatut: {
        flex: 2,
        flexDirection: 'row'
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    textstatut: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 5,
        marginRight: 5
    },
    buttonContainerQuestion: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        alignItems: 'center'
    }
});
