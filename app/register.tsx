import { Text, View, StyleSheet,Image, Button, TouchableOpacity, TextInputComponent } from "react-native";
import React from 'react';
import { useRouter } from 'expo-router';
import { TextInput} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';

 

export default function register() {

  const router = useRouter();
  const [email, onChangeEmail] = React.useState('');
  const [nome, onChangenome] = React.useState('');
  const [senha, onChangeSenha] = React.useState('');

  const image = require("../assets/images/LogoFoundIt.png")


  const ipaddress = ""


  const funcregister = async() => {

    const data = {email,nome,senha}

    

    const response = await fetch(`http://${ipaddress}:8080/user/cadastro`, {
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
    
        <LinearGradient
            colors={['#b19dc9ff', '#7c68e0ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >

        <Image source={image} style ={styles.image}/>

      
        <TextInput 
                
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="Email"
          keyboardType="default"
        />

        <TextInput 

          style={styles.input}
          onChangeText={onChangenome}
          value={nome}
          placeholder="Nome"
          keyboardType="default"

        />

        <TextInput 

        style={styles.input}
        onChangeText={onChangeSenha}
        secureTextEntry={true}
        value={senha}
        placeholder="Senha"
        keyboardType="default"

        />

        

        <TouchableOpacity
        
          style={styles.button}
          onPress={funcregister}
        >
          <Text style={styles.text}>Register</Text>
        </TouchableOpacity>
      
            
    </LinearGradient>
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
    color: 'white',
    textAlign: 'center',
    fontSize:26,
    fontWeight:600
  },
  input: {
    borderColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderBottomWidth:1,
    width: 230,
    height: 50,
    margin:10,
    fontSize:20,
    fontWeight:600,
    color:'white'
  },

  button: {
    backgroundColor: '#ae9ff7ff',
    width:230,
    padding:17,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  image:{

    marginTop:-150,
    marginBottom:-50,
    width: 350,
    height: 350,
    resizeMode: 'contain',

  },


});

