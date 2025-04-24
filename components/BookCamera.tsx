import { StyleSheet, View, Dimensions } from 'react-native';
import { CameraView } from 'expo-camera';
import CircleButton from './CircleButton';
const { width } = Dimensions.get('window');


type Props = {
    handleImageDone: (imgPath: string) => void;
    setImagePath: (str: string) => void;
    setScanned: (scanned: boolean) => void;
    handleCancelCamera: () => void;
};

export default function BookCamera({ handleImageDone, setImagePath, setScanned, handleCancelCamera }: Props) {

    let camera: CameraView;

    const handleOkImage = async () => {
        console.log("Prise de photo...");
        if (!camera) return
        await camera.takePictureAsync({ shutterSound: false }).then((photo) => {
            if (photo !== undefined) {
                console.log("Prise de la photo ==> " + photo.uri);
                setImagePath(photo.uri);
                setScanned(true);
                handleImageDone(photo.uri);
            }
        })
    }

    return (
        <View style={styles.cameraContainer}>
            <CameraView style={{ width: width, height: '100%' }} facing='back' ref={(r) => {
                if (r !== null)
                    camera = r
            }}>
                <View style={styles.buttonbottomplaced}>
                    <View style={styles.buttonCameraContainer}>
                        <CircleButton iconName="check" onPress={handleOkImage} position={'Left'} />
                        <CircleButton iconName="cancel" onPress={handleCancelCamera} position={'Right'} />
                    </View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonCameraContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        margin: 5
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
    },
    buttonbottomplaced: {
        position: 'absolute',
        backgroundColor: 'transparent',
        bottom: 20,
        left: 20
    }
});
