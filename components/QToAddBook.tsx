import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';
import CircleButton from '@/components/CircleButton';
import Note from '@/components/Note';

type Props = {
    statut: string;
    handleAjouter: () => void;
    handleNePasAjouter: () => void;
};

export default function QToAddBook({ statut, handleAjouter, handleNePasAjouter }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Tu veux l'ajouter dans ta liste des livres {statut === 'Lu ' ? 'lus' : statut === 'Wish' ? 'à lire' : ''} ?</Text>
            <View style={styles.buttonContainerQuestion}>
                <CircleButton iconName="check" onPress={handleAjouter} position={'Left'} />
                <CircleButton iconName="cancel" onPress={handleNePasAjouter} position={'Right'} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    buttonContainerQuestion: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        alignItems: 'center'
    }
});
