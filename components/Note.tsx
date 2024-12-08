import { StyleSheet, View, Pressable } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

type Props = {
    note: number;
    taille: number;
};

export default function Note({ note, taille }: Props) {
    return (
        <View style={styles.noteContainer}>
            {note >= 1 ? <FontAwesome5 name="star" solid size={taille} color="#ffd33d" /> : <FontAwesome5 name="star" size={taille} color="#ffd33d" />}
            {note >= 2 ? <FontAwesome5 name="star" solid size={taille} color="#ffd33d" /> : <FontAwesome5 name="star" size={taille} color="#ffd33d" />}
            {note >= 3 ? <FontAwesome5 name="star" solid size={taille} color="#ffd33d" /> : <FontAwesome5 name="star" size={taille} color="#ffd33d" />}
            {note >= 4 ? <FontAwesome5 name="star" solid size={taille} color="#ffd33d" /> : <FontAwesome5 name="star" size={taille} color="#ffd33d" />}
            {note >= 5 ? <FontAwesome5 name="star" solid size={taille} color="#ffd33d" /> : <FontAwesome5 name="star" size={taille} color="#ffd33d" />}
        </View>
    );
}

const styles = StyleSheet.create({
    noteContainer: {
        flex: 5,
        flexDirection: 'row'
    },
});
