import { StyleSheet, View, Pressable } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState } from 'react';

type Props = {
    note: number;
    taille: number;
    handleNote?: (id:number) => void;
};

export default function Note({ note, taille, handleNote }: Props) {
    function setNote(id:number){
        console.log("Click sur la note " + id);
        if (handleNote) {handleNote(id);}
    }

    if(handleNote){
        return (
            <View style={styles.noteContainer}>
                <Pressable onPress={(event) =>{setNote(1);}}>{note >= 1 ? <FontAwesome5 name="star" solid size={taille} color="#ffd33d" /> : <FontAwesome5 name="star" size={taille} color="#ffd33d" />}</Pressable>
                <Pressable onPress={(event) =>{setNote(2);}}>{note >= 2 ? <FontAwesome5 name="star" solid size={taille} color="#ffd33d" /> : <FontAwesome5 name="star" size={taille} color="#ffd33d" />}</Pressable>
                <Pressable onPress={(event) =>{setNote(3);}}>{note >= 3 ? <FontAwesome5 name="star" solid size={taille} color="#ffd33d" /> : <FontAwesome5 name="star" size={taille} color="#ffd33d" />}</Pressable>
                <Pressable onPress={(event) =>{setNote(4);}}>{note >= 4 ? <FontAwesome5 name="star" solid size={taille} color="#ffd33d" /> : <FontAwesome5 name="star" size={taille} color="#ffd33d" />}</Pressable>
                <Pressable onPress={(event) =>{setNote(5);}}>{note >= 5 ? <FontAwesome5 name="star" solid size={taille} color="#ffd33d" /> : <FontAwesome5 name="star" size={taille} color="#ffd33d" />}</Pressable>
            </View>
        );
    } else {
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
}

const styles = StyleSheet.create({
    noteContainer: {
        flex: 5,
        flexDirection: 'row'
    }
});
