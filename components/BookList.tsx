import { bddType } from '@/hooks/BibliothequeNAContext';
import { StyleSheet, View, Pressable, Text, FlatList } from 'react-native';
import BookCard from '@/components/BookCard';

type Props = {
    bdd: bddType;
    filtre: string;
    openBookCard: (id: number) => void;
    deleteBook: (id: number) => void;
};

export default function BookList({ bdd, filtre, openBookCard, deleteBook }: Props) {
    return (
        <View style={styles.listcontainer}>
            <Text style={styles.listTitle}>
                Mes Livres :
            </Text>
            <FlatList
                style={styles.flatlist}
                data={bdd}
                showsVerticalScrollIndicator={true}
                renderItem={({ item }) =>
                    item.statut === filtre ? <View ><Pressable onPress={() => { openBookCard(item.id) }} onLongPress={() => { deleteBook(item.id) }}><BookCard bookTitle={item.name} authorName={item.author} imagePath={item.image} note={parseInt(item.note)} statut={item.statut} /></Pressable></View> : <View />
                }
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
