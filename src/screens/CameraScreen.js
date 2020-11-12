import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Dimensions, Image, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import StartPage from './StartPage';


//height and width of phone
const phw = Dimensions.get('window').width;
const phh = Dimensions.get('window').height;


const CameraScreen = () => {

    //take permission from phone to open camera
    const [hasPermission, setHasPermission] = useState(null);

    //set the front or back camera
    const [type, setType] = useState(Camera.Constants.Type.front);

    //set array of detected face
    const [faces, setFaces] = useState([]);

    //x-cordinate of recogonised face
    const [a, seta] = useState(0);

    //y-cordinate of recogonised face
    const [b, setb] = useState(0);

    //width of recogonised face
    const [w, setw] = useState(0);

    //height of recogonised face
    const [h, seth] = useState(0);

    //angle rotation of neck of recogonised face
    const [angle, setAngle] = useState(0 + 'deg');

    //augment option on or off
    const [augment, setAugment] = useState(false);

    //welcome screen
    const [welcome, setWelcome] = useState(true);

    //
    const [camera, setCamera] = useState(null)

    //for preview of image
    const [previewVisible, setPreviewVisible] = useState(false);

    //store captured image data
    const [capturedImage, setCapturedImage] = useState(null);

    //flash on or off
    const [flashMode, setFlashMode] = useState('off')

    //set welcome screen for 5 seconds
    setTimeout(() => {
        setWelcome(false);
    }, 5000);



    // to handle flash mode
    const __handleFlashMode = () => {
        if (flashMode === 'on') {
            setFlashMode('off')
        } else if (flashMode === 'off') {
            setFlashMode('on')
        } else {
            setFlashMode('auto')
        }

    }

    //capturing image
    const __takePicture = async () => {
        if (!camera) return
        const photo = await camera.takePictureAsync()
        // console.log(photo)
        setPreviewVisible(true)
        setCapturedImage(photo)
    }

    //preview image screen
    const CameraPreview = ({ photo }) => {
        //   console.log('sdsfds', photo.uri)
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, width: phw }}>

                    <ImageBackground
                        style={{ flex: 1, }}
                        source={{ uri: photo && photo.uri }} >
                        <Text style={{ color: 'white', fontSize: 30, margin: 15 }}>Preview</Text>
                    </ImageBackground>
                </SafeAreaView >
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#ffffe6' }}>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            height: 50,
                            margin: 10
                        }}
                        onPress={__retakePicture}>
                        <Text style={{ fontSize: 19, color: 'green', fontWeight: 'bold', margin: 10 }}>Retake</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    //handle retake picture option
    const __retakePicture = () => {
        setCapturedImage(null);
        setPreviewVisible(false);
    }



    // handle data of detected face
    const faceDetected = ({ faces }) => {
        setFaces(faces)
        //  console.log(faces[0].rollAngle);
        if (faces.length && augment) {
            seta(Math.round(faces[0].bounds.origin.x));
            setb(Math.round(faces[0].bounds.origin.y));
            seth(Math.round(faces[0].bounds.size.height));
            setw(Math.round(faces[0].bounds.size.width));
            setAngle(`${Math.round(faces[0].rollAngle)}deg`);
        } else {
            seta(0);
            setb(0);
            seth(0);
            setw(0);
            setAngle(0 + 'deg');
        }
    }

    //handle data when augment option is on or off
    const __augment = () => {
        if (augment) {
            seta(0);
            setb(0);
            seth(0);
            setw(0);
            setAngle(0 + 'deg');
            setAugment(false);
        }
        else {
            setAugment(true);
        }

    }


    //call function only once for take permission
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    if (welcome) {
        return (
            <View>
                <StartPage />
            </View>
        );
    }

    return (
        <View>
            {previewVisible && capturedImage ? (
                <CameraPreview photo={capturedImage} retakePicture={__retakePicture} />
            ) : (<View>
                <Camera style={{ flex: 1 }} type={type}
                    onFacesDetected={faceDetected}
                    faceDetectorSettings={{
                        mode: FaceDetector.Constants.Mode.fast,
                        detectLandmarks: FaceDetector.Constants.Landmarks.none,
                        runClassifications: FaceDetector.Constants.Classifications.none,
                        minDetectionInterval: 100,
                        tracking: false,
                    }}
                    flashMode={flashMode}
                    ref={(ref) => {
                        setCamera(ref)
                    }}
                >


                    <View style={{ width: phw }}>

                        <SafeAreaView>
                            <View>
                                <Image
                                    style={{ height: h, width: w, resizeMode: 'contain', marginLeft: a, marginTop: b - 20, transform: [{ rotate: angle }] }}
                                    source={
                                        require('../components/images/chasma.png')
                                    } />

                            </View>
                        </SafeAreaView >



                    </View>

                </Camera>
                <View style={{
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    backgroundColor: '#ffffe6',
                    borderTopColor: 'green',
                    borderWidth: 5,
                    borderRightColor: 'green',
                    borderLeftColor: 'green'
                }}>

                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            height: 50,
                            marginVertical: 10
                        }}
                        onPress={__augment}>
                        <Text style={{ fontSize: 35, color: 'green', fontWeight: 'bold', marginVertical: 10 }}>{augment ? '😎' : '😊'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            height: 50,
                            marginVertical: 10
                        }}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                        <Text style={{ fontSize: 45, color: 'green', fontWeight: 'bold' }}> ⇄ </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            height: 60,
                            width: 60,
                            borderColor: 'green',
                            borderWidth: 15,
                            margin: 10,
                            borderRadius: 100
                        }}
                        onPress={__takePicture} />


                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            height: 50,
                            margin: 10,
                        }}
                        onPress={__handleFlashMode}>
                        <Text style={{ fontSize: 30, color: 'green', fontWeight: 'bold', marginVertical: 10 }}>
                            {flashMode === 'off' ? '💢' : '💥'}</Text>
                    </TouchableOpacity>
                </View>
            </View>)}

        </View>

    );
}

export default CameraScreen;
