import React from 'react';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const PhotoPreviewImageURLSection = ({
    imageUri , 
    handleRetakePhoto,
    searchRWSBoots,
}:{
    imageUri: string; 
    handleRetakePhoto: ()=> void;
    searchRWSBoots: ()=> void;}) => (
        <SafeAreaView style={styles.container }>
            <View style={styles.box}>
                {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.previewContainer} />
      )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}> 
                    <FontAwesome name="trash-o" size={24} color="black" />         

                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={searchRWSBoots} > 
                    <MaterialCommunityIcons name="shoe-cleat" size={24} color="black" />     
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
            justifyContent: 'center',
            marginRight: 5
        }
    }

)
export default PhotoPreviewImageURLSection