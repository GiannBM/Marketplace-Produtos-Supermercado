import { Text, View, StyleSheet, Button, TouchableOpacity, TextInputComponent } from "react-native";
import { Link } from 'expo-router';
import React from 'react';
import { useRouter} from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, NativeViewGestureHandler } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";


 

export default function login() {

  const router = useRouter();
  const [email, onChangeEmail] = React.useState('');
  const [senha, onChangeSenha] = React.useState('');

  const funclogin = async() => {

    const data = {email, senha}

    const response = await fetch('http://xxxxxxxxxx:8080/user/login', { ///////////   MUDAR PARA IP DO PC
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const resp = await response.json()

    
    if(resp.message=="True"){

      AsyncStorage.setItem('token', resp.token); 

      router.replace("./userpage")
    }

    else{
      alert("Usuario ou Senha inválidos")
    }

}

  

  return (
    

      <SafeAreaView style={styles.container}>
      
        <TextInput 
                
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="Email"
          keyboardType="default"
        />

        <TextInput 

          style={styles.input}
          onChangeText={onChangeSenha}
          value={senha}
          placeholder="Senha"
          keyboardType="default"

        />

        

        <TouchableOpacity
        
          style={styles.button}
          onPress={funclogin}
        >
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
      
            
      </SafeAreaView>  

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

