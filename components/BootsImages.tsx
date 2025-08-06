import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';



const BootsImages = ({
    photos 
}:{
    photos: string; 
    }) => (
        <SafeAreaView style={styles.container }>
            
            <View style={styles.box}>
                {/* <Image style={styles.previewContainer}
                    source={{uri: 'data:image/jpg;base64,'+ photo.base64}}>

                </Image> */}
                <Text  >
                    {photos}
                </Text>
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
            flex: 1,
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
export default BootsImages