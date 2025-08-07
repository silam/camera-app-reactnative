import BootsImages from '@/components/BootsImages';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DataService from '../../services/DataService';



export default function bootimagelist() {

  const [photos, setPhotos] = useState(DataService.getSharedData());

  useEffect(()=>{
    const callback = (newPhotos)=> {
      setPhotos(newPhotos);
    }

    DataService.subscribe(callback);

    return ()=>{
      DataService.unsubscribe(callback);
    };
  }, []);

  return (
    <View style={styles.container}>
      {(photos == null || photos.length === 0 || photos === undefined)? <BootsImages photos={[]} ></BootsImages> : <BootsImages photos={photos} ></BootsImages>}
    </View>
  );
}

const styles = StyleSheet.create({
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
