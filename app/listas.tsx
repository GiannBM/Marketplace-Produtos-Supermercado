import { Text, View, StyleSheet, Button, TouchableOpacity, TextInputComponent, Modal, ActivityIndicator, Linking } from "react-native";
import { Link } from 'expo-router';
import { useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { useRouter} from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';

import { FlatList, TextInput} from "react-native-gesture-handler";
import MapView, { Marker } from 'react-native-maps';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';


export default function listaspage() {

    const router = useRouter();
    const [id, setId] = React.useState<number>();
    const [listas, setListas] = React.useState([]);
    const [loading, setloading] = React.useState(false);
    const [modalVisible, ismodalVisible] = React.useState(false);
    const [nomeLista, setnomeLista] = React.useState('');

    const [recarregar, setRecarregar] = React.useState(0);
    

    const ipaddress = ""



  async function getUserData(){

    const datatoken = await AsyncStorage.getItem('token')
    let datatoken2 = ''

    if(datatoken!=null){

      datatoken2 = datatoken
    }

    const response = await fetch(`http://${ipaddress}:8080/user/home/perfil`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-acess-token': datatoken2,
        
      },
    })

    const resp = await response.json()
    
      
    setId(resp[0].id_)
    queryListas(resp[0].id_, 0)
    
  }


    async function queryListas(id: number, val: number){


        setloading(true)


        console.log(id)

        const datatoken = await AsyncStorage.getItem('token')

        const novoproduct = [{
            iduser: id
        }]


        
        if(datatoken!=null){

          const response = await fetch(`http://${ipaddress}:8080/listas/${id}`, {
              method: 'GET',
              headers: {
              'Content-Type': 'application/json',
              'x-acess-token': datatoken,
              
              },

          })

          const resp = await response.json()


          console.log(resp)
          if(response.status ==200 ){

              setListas(resp)
              setloading(false) 

              if(val ==1){
                setRecarregar(prev => prev +1)
              }

          }

          
        }
    }


    async function deleteList(id: number, nome: string){

        const datatoken = await AsyncStorage.getItem('token')

        const novoproduct = {
            id: id,
            nome: nome
        }

        if(datatoken!=null){

          const response = await fetch(`http://${ipaddress}:8080/listas/del`, {
              method: 'DELETE',
              headers: {
              'Content-Type': 'application/json',
              'x-acess-token': datatoken,
              
              },

              body: JSON.stringify(novoproduct),    

          })

          const resp = await response.json()

          queryListas(id, 1)

        }
    }

     async function postList(id_: number){

        const datatoken = await AsyncStorage.getItem('token')

        const date = new Date().toLocaleDateString('pt-br')

        console.log(date)

        const novoproduct = {
            iduser: id,
            nome: nomeLista,
            datas: date,
        }

        if(datatoken!=null){

          const response = await fetch(`http://${ipaddress}:8080/listas/post`, {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              'x-acess-token': datatoken,
              
              },

              body: JSON.stringify(novoproduct),    

          })

          const resp = await response.json()


        }
                  
        
        queryListas(id_, 1)

    }

    async function navegItens(id: string){

          
      id = id.toString()
      await AsyncStorage.setItem('idlista', id);

      //console.log(id)
      router.push('./itens_lista')

  }
    

  useFocusEffect(
    useCallback(() => {

      getUserData()

  }, [recarregar]) 
);


  return (



    <LinearGradient

      colors={['#b19dc9ff', '#7c68e0ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        alignItems: "center",
        padding: 6,
      }}       
      >

        <View style={styles.rowmodal}>

            <Text style={styles.textoMinhasListas}>
                Minhas 
                Listas
            </Text>

            <TouchableOpacity onPress={() => {ismodalVisible(true)}}>
              <MaterialIcons style={{marginRight: 20}} name="add" size={24} color="black" />
            </TouchableOpacity>
        </View>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {ismodalVisible(false)}}
        >
        
          <View style ={styles.containermodal}>
          
            <View style ={styles.modalstyle}>


              <Text style={{fontSize:24,fontWeight: '700', margin: 10, color:"#2e2e3a"}}>Criar Lista</Text>

              <TextInput 
              
                style={styles.input}
                onChangeText={setnomeLista}
                value={nomeLista}
                placeholder="Nome"
                keyboardType="default"
              
              />


              <View style ={styles.buttonsmodal}>
                <TouchableOpacity 
                  style = {styles.buttonIsolate}
                  onPress={() => {
                    ismodalVisible(false)

                    if(id !== undefined){
                      postList(id)
                    }

                  }}
                >        
                  <Text style={{color: "white", textAlign: 'center',  fontSize:15,  fontWeight:600}}>
                    Adicionar
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>

        </Modal>

        <View>

            {loading ? (
                <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
            ) : (
            <FlatList
                data={listas}
                keyExtractor={(item, index) => index.toString()} 

                renderItem={({ item }) => {
              
                  if(typeof item["datas"] !== "string"){
                    return null                                             /// Tratando a Date(), pode pular a renderização caso seja null
                  }
                  let dataAtt = (item["datas"] as string).split('T')[0]      /// Filtrando o Horário

                  return (
                    <TouchableOpacity style={styles.botaolista} onPress={() => {navegItens(item["id_"])}}>

                      <Text style={styles.textolista}>{item["nome"]}</Text>

                      <Text style={styles.textolista}>{dataAtt}</Text>

                      <TouchableOpacity onPress={() => {deleteList(item["id_"], item["nome"])}}>
                        <MaterialIcons style={{marginRight: 10}} name="delete" size={24} color="black" />
                      </TouchableOpacity>

                    </TouchableOpacity>
                  )
 
                }}
            />)}
        </View>
        
    </LinearGradient>
  );
}




const styles = StyleSheet.create({

  textoMinhasListas: {
    
    fontSize:36,
    fontWeight: '700',
    color:"white"
  },


   input: {
    borderColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderBottomWidth:1,
    width: 200,
    height: 50,
    margin:10,
    fontSize:20,
    fontWeight:600,
    color:"#2e2e3a"
  },

  modalstyle:{

    backgroundColor: '#ddd8f3ff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: '80%',
    padding: 10,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex:2,
    borderRadius:6
  },

  containermodal:{

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
 


  rowmodal:{

    marginTop: 10,
    marginBottom: 30,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',

  },



   botaolista: {

    backgroundColor: '#ae9ff7ff',
    width:350,
    padding:17,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent:"space-between",
    gap:10,
  },

  textolista: {
    color: '#fff',                
    fontSize: 16,
    fontWeight: '500',
  },

  buttonsmodal:{

    marginTop:10,
    flexDirection: 'row',
    gap: 10,

  },

  buttonIsolate: {

    backgroundColor: '#ae9ff7ff',
    width:100,
    padding:15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
});
