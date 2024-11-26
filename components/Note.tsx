import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

type Props = {
    note: number;
};

export default function Note({ note }: Props) {
    switch (note) {
        case 0:
            return (
                <View style={styles.noteContainer}>
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                </View>
            );
        case 1:
            return (
                <View style={styles.noteContainer}>
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                </View>
            );
        case 2:
            return (
                <View style={styles.noteContainer}>
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                </View>
            );
        case 3:
            return (
                <View style={styles.noteContainer}>
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                </View>
            );
        case 4:
            return (
                <View style={styles.noteContainer}>
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" size={18} color="#ffd33d" />
                </View>
            );
        case 5:
            return (
                <View style={styles.noteContainer}>
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                    <FontAwesome5 name="star" solid size={18} color="#ffd33d" />
                </View>
            );
    }
}

const styles = StyleSheet.create({
    noteContainer: {
        flex: 5,
        flexDirection: 'row'
    },
});
