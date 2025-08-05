import React from 'react';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CameraCapturedPicture } from 'expo-camera';

const PhotoPreviewSection = ({
    photo , 
    handleRetakePhoto
}:{
    photo: CameraCapturedPicture; 
    handleRetakePhoto: ()=>void;}) => (
        <SafeAreaView style={styles.container }>
            <View style={styles.box}>
                <Image style={styles.previewContainer}
                    source={{uri: 'data/image/jpg:base64,'+ photo.base64}}
                >

                </Image>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity>
                    <FontAwesome name="trash-o" size={24} color="black" />         

                </TouchableOpacity>
            </View>
        </SafeAreaView>
);

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center'
        },
        box: {
            borderRadius: 15,
            padding: 1,
            width: '95%',
            backgroundColor: 'darkgray',
            alignItems: 'center',
            justifyContent : 'center'
        },
        previewContainer: {
            width: '85%',
            height: '85%',
            borderRadius: 15
        },
        buttonContainer: {
            marginTop: '4%',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%'
        },
        button: {
            backgroundColor: 'gray',
            borderRadius: 25,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center'
        }
    }

)
export default PhotoPreviewSection