import { Text, View, StyleSheet, Button, TouchableOpacity, TextInputComponent } from "react-native";
import { Link } from 'expo-router';
import { useEffect, useRef } from "react";
import React from 'react';
import { useRouter} from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { TextInput, NativeViewGestureHandler, Pressable } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";


export default function userpage() {

  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [haspermission, sethaspermission] = React.useState(false);
  const scanned = useRef(false)

  async function requestpermission() {

    if (!permission || !permission.granted){

        const stats = await requestPermission()

        sethaspermission(stats.granted)
    }

    else{

        sethaspermission(true)
    }

    
  }

  async function hasscanned(data: string){

    if(!scanned.current){

      scanned.current = true
      await AsyncStorage.setItem('camerascan', data);
      router.replace("/userpage")

    }


  }

  useEffect(()=>{

    requestpermission();
    
  },[]);


  return (
      
    <SafeAreaView style={styles.container}>         

        {haspermission && !scanned.current && (

            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing={'back'}
              onBarcodeScanned={ scanned.current ? undefined : ({ data }) =>{ hasscanned(data)}}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],

              }}
            />
        )}
       
    </SafeAreaView>  
  );
}




const styles = StyleSheet.create({
 
 container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    color: 'black',
    textAlign: 'center'
  },
  input: {
    borderColor: 'black',
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 2,
    width: 200,
    height: 50,
    marginBottom: 30,
  },

  button: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 2,
    width: 200,
    height: 50,
    marginBottom: 30,
  },
});
