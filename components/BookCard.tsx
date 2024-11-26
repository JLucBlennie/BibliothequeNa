import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { Asset } from "expo-asset";
import { useState } from 'react';
import Note from '@/components/Note';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';


type Props = {
    bookTitle: string;
    authorName: string;
    imagePath: string;
    note: number;
    statut: string;
};

export default function BookCard({ bookTitle, authorName, imagePath, note, statut }: Props) {
    const imageTmp = { uri: imagePath };
    return (
        <View style={[styles.bookcard, styles.bookCardShadow]}>
            <Image source={imageTmp} style={styles.image} />
            <View>
                <Text style={styles.text}>Livre : {bookTitle}</Text>
                <Text style={styles.text}>Auteur : {authorName}</Text>
                <View style={styles.notestatut}>
                    <Text style={styles.textstatut}>{statut}</Text>
                    <Note note={note} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    }
});
