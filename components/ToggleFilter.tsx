import { StyleSheet, View, Button } from 'react-native';
import SwitchSelector from "react-native-switch-selector";

type Props = {
    filtre: string;
    toggleFilter: (value: string) => void;
};

export default function ToggleFilter({ filtre, toggleFilter }: Props) {
    return (
        <SwitchSelector
            initial={filtre === 'LU' ? 0 : 1}
            onPress={(value: string) => toggleFilter(value)}
            textColor={'#25292e'} //'#7a44cf'
            selectedColor={'#fff'}
            buttonColor={'#25292e'}
            borderColor={'#ccc'}
            fontSize={18}
            bold
            hasPadding
            options={[
                { label: "Mes Livres Lus...", value: "LU" },
                { label: "Mes Livres à Lire...", value: "WISHLIST" }
            ]}

            style={{
                marginTop: 5,
                marginLeft: 4,
                marginRight: 4
            }}
        />
    );
}

const styles = StyleSheet.create({
    buttonContainerQuestion: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        alignItems: 'center'
    }
});
