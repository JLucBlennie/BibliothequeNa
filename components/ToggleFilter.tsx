import { StyleSheet, View, Button } from 'react-native';
import SwitchSelector from "react-native-switch-selector";

type Props = {
    filtre: string;
    toggleFilter: () => void;
};

export default function ToggleFilter({ filtre, toggleFilter }: Props) {
    return (
        <SwitchSelector
            initial={filtre === 'Lu' ? 0 : 1}
            onPress={toggleFilter}
            textColor={'#25292e'} //'#7a44cf'
            selectedColor={'#fff'}
            buttonColor={'#25292e'}
            borderColor={'#ccc'}
            fontSize={18}
            bold
            hasPadding
            options={[
                { label: "Mes Livres Lus...", value: "Lu" },
                { label: "Mes Livres à Lire...", value: "Wish" }
            ]}

            style={{
                marginTop: 5,
                marginLeft: 4,
                marginRight: 4
            }}
        />
    );

    if (filtre === 'Lu') {
        return (
            <View style={styles.buttonContainerQuestion}>
                <Button title="Lus..." onPress={toggleFilter} disabled />
                <Button title="A lire..." onPress={toggleFilter} />
            </View>
        );
    } else {
        return (
            <View style={styles.buttonContainerQuestion}>
                <Button title="Lus..." onPress={toggleFilter} />
                <Button title="A lire..." onPress={toggleFilter} disabled />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainerQuestion: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        alignItems: 'center'
    }
});
