import PhotoPreviewImageURLSection from '@/components/PhotoPreviewImageURLSection';
import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DataService from '../../services/DataService';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  
  
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [imageUri, setImageUri] = useState('');


  const cameraRef = useRef<CameraView | null>(null);
  

  const fetchPhotos = async () => {

    
    let submitPhoto = null;
    if ( photo != null && photo !== undefined)
      submitPhoto = photo.base64;


    if ( imageUri != null && imageUri !== undefined){
      console.log("imageUri = " + imageUri?.substring(0,100));
      submitPhoto = (imageUri?.includes(',') === true)?imageUri.split(',')[1]: imageUri;

    }
    console.log("submitPhoto = " + submitPhoto?.substring(0,100));


    if ( submitPhoto != null && submitPhoto !== undefined)
    {
          console.log("Call POST  = " + submitPhoto?.substring(0,100));

          try{
            
            // android: photo = /9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABh

            console.log("submitPhoto = " + (submitPhoto).substring(0,100));
            //console.log("Base64 =  " + (photo.base64).split(',')[1]);
            //console.log("Bytes = " + Uint8Array.fromBase64(photo.base64));
            //const binaryData = atob(photo.base64); // Decode Base64 to binary
            //const byteArray = new Uint8Array(binaryData.length); // Create binary array
            // Calculate in bytes
            let sizeInBytes = (submitPhoto.length * 3) / 4 
                              - (submitPhoto.endsWith('==') ? 2 : submitPhoto.endsWith('=') ? 1 : 0);

            console.log("Size : " + sizeInBytes / (1024*1024));

            const response = await fetch('https://aibootfinderapi20250807073013.azurewebsites.net/api/Prediction', {
              method: 'POST',
              headers : {
                'Content-Type': 'application/octet-stream',
              },
              
              body: base64ToUint8Array(submitPhoto)
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

  const handleUploadPhoto = async ()=> {
      // ask for permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false){
        alert('Permission to access media library is required');
        return;
      }

      // pick image

      const result = await ImagePicker.launchImageLibraryAsync(
        {
          mediaTypes: ['images'],
          quality: 0.80
        }
      )
      // android: uri: file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fcam-app-29afd78f-ae6b-42a6-a5e7-5781d541355a/ImagePicker/1bc0ffec-3be6-4c80-b163-da4abcf158a4.jpeg
      // computer: uri: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHB

      if (!result.canceled){

        console.log('result = ' + result.assets[0].uri);

        const response = (await fetch(result.assets[0].uri));
        // // Here is the significant part 
        // // reading the stream as a blob instead of json
        //return response.blob();


        let reader = new FileReader();
        let blob = await response.blob();
        await reader.readAsDataURL(blob); 
        reader.onloadend = function() {
          let base64data = reader.result;                
          console.log('base64 = ' + base64data?.substring(0,50));

          setImageUri(base64data); 
          setPhoto(null)
        }

        
        
        // setPhoto(result.assets[0].uri);


        


      }
  }

  const handleTakePhoto = async ()=> {
     if (cameraRef.current) {
        const options = {
            quality: 0.80,
            
            base64: true,
            exif: false
        };

        const takedPhoto = await cameraRef.current.takePictureAsync(options);

        setPhoto(takedPhoto);

        setImageUri(null);
    }
  };

  const handleRetakePhoto = ()=> {
    setPhoto(null);
    setImageUri(null);
  }
  

  const searchRWSBoots = ()=> {
    // here callng API to return list of boots
    console.log("Call searchRWSBoots");
    DataService.setSharedData('Hello from Service');
    fetchPhotos();
    // setPhotos('Hello');
  }


  if ( photo) return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto}
                        searchRWSBoots={searchRWSBoots}></PhotoPreviewSection>

  if ( imageUri) return <PhotoPreviewImageURLSection imageUri={imageUri} handleRetakePhoto={handleRetakePhoto}
    searchRWSBoots={searchRWSBoots}></PhotoPreviewImageURLSection>
  

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

          <TouchableOpacity style={styles.button} onPress={handleUploadPhoto}>
            <AntDesign name='picture' size={44} color='black'></AntDesign>
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
