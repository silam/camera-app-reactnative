import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DataService from '../../services/DataService';


export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  
  
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading]           = useState(true);

  const cameraRef = useRef<CameraView | null>(null);
  

  const fetchPhotos = async () => {
    if ( photo != null && photo !== undefined)
    {
          try{
            console.log("photo = " + photo);
            console.log("Base64 =  " + (photo.base64).split(',')[1]);
            console.log(base64ToUint8Array((photo.base64).split(',')[1]));

            const response = await fetch('https://aibootfinderapi20250807073013.azurewebsites.net/api/Prediction', {
            method: 'POST',
            headers : {
              'Content-Type': 'application/octet-stream',
            },
            
            body: base64ToUint8Array((photo.base64).split(',')[1]) // or binary (Uint8Array)
          });
          const data = await response.json();
          console.log(data)
          setPhotos(data);
          DataService.setSharedData(data);
        }
        catch(error) {
          console.error('Error fetching photos:', error);
        }
        finally{
          setLoading(false);
        }
    }
    
  } 

  // if (loading)
  // {
  //   return <View style={styles.center}>
  //     <ActivityIndicator size='large'>

  //     </ActivityIndicator>
  //     <Text>Loading...</Text>
  //   </View>
  // }
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function base64ToBlob(base64 : string, contentType = 'image/jpeg') {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  function base64ToUint8Array(base64 : string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  }

  function toggleCameraFacing() 
  {

      setFacing(current => (current === 'back'?'front':'back'));
  }

  const handleTakePhoto = async ()=> {
     if (cameraRef.current) {
        const options = {
            quality: 1,
            base64: true,
            exif: false
        };

        const takedPhoto = await cameraRef.current.takePictureAsync(options);

        setPhoto(takedPhoto);

        
    }
  };

  const handleRetakePhoto = ()=> {
    setPhoto(null);
  }
  

  const searchRWSBoots = ()=> {
    // here callng API to return list of boots
    DataService.setSharedData('Hello from Service');
    fetchPhotos();
    // setPhotos('Hello');
  }


  if ( photo) return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto}
                        searchRWSBoots={searchRWSBoots}></PhotoPreviewSection>

  //if (photos) return <BootsImages photos={photos}></BootsImages>
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>

          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name='retweet' size={44} color='black'></AntDesign>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <AntDesign name='camera' size={44} color='black'></AntDesign>
          </TouchableOpacity>


        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'gray',
    borderRadius: 10
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
