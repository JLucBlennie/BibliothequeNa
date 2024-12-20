import { StyleSheet, View, Dimensions } from 'react-native';
import { BarcodeScanningResult, CameraView } from 'expo-camera';
import CircleButton from './CircleButton';
const { width } = Dimensions.get('window');


type Props = {
    scanned: false;
    scannedCode: (scanningResult: BarcodeScanningResult) => void;
    handleCancelCamera: () => void;
};

export default function BookISBNCamera({ scanned, scannedCode, handleCancelCamera }: Props) {
    return (
        <View style={styles.cameraContainer}>
            <CameraView style={{ width: width, height: '100%' }} facing='back' barcodeScannerSettings={{
                barcodeTypes: ["ean13"],
            }} onBarcodeScanned={scanned ? undefined : scannedCode}>
                <View style={styles.buttonCameraContainer}>
                    <CircleButton iconName="cancel" onPress={handleCancelCamera} />
                </View>
            </CameraView>
        </View>);
}

const styles = StyleSheet.create({
    buttonCameraContainer: {
        position: 'absolute',
        backgroundColor: 'transparent',
        bottom: 20,
        left: 150
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        resizeMode: 'cover',
        justifyContent: 'center',
        width: '100%'
    },
    camera: {
        flex: 1,
    }
});
