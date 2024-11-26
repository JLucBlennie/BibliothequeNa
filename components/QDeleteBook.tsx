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
            <View style={[styles.bookcard, styles.bookCardShadow]}>
                <Image source={imageTmp} style={styles.image} />
                <View>
                    <Text style={styles.text}>Livre : {bookTitle}</Text>
                    <Text style={styles.text}>Auteur : {authorName}</Text>
                    <View style={styles.notestatut}>
                        <Text style={styles.textstatut}>{statut}</Text>
                        <Note note={note} />
                    </View>
                    <View style={styles.buttonContainerQuestion}>
                        <CircleButton iconName="delete" onPress={handleOK} />
                        <CircleButton iconName="cancel" onPress={handleCancel} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    },
    image: {
        width: 50,
        borderRadius: 18,
    },
    notestatut: {
        flex: 2,
        flexDirection: 'row'
    },
    bookcard: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: '#25292e99',
        margin: 5,
    },
    bookCardShadow: {
        shadowColor: "white",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
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
