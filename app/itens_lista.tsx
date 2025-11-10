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
import { SearchBar } from "react-native-elements";
import { Callout } from "react-native-maps";
import { navigate } from "expo-router/build/global-state/routing";
import { LinearGradient } from 'expo-linear-gradient';


export default function itens_lista() {

    const router = useRouter();
    const [id, setId] = React.useState('');
    const [itens, setItens] = React.useState([]);
    const [loading, setloading] = React.useState(false);
    const [selected, setSelected] = React.useState<number[]>([]);
    const [comprado, isComprado] = React.useState([]);
    const [modalVisible, ismodalVisible] = React.useState(false);
    const [produto, setProduto] = React.useState('');
    const [quantidade, setQuantidade] = React.useState('');
    const [unidade, setUnidade] = React.useState('');


    const ipaddress = ""




    async function getItensData(){

      const datatoken = await AsyncStorage.getItem('token')

      const idlista = await AsyncStorage.getItem('idlista')

      let datatoken2 = ''

      if(datatoken!=null){

        datatoken2 = datatoken
      }

      const response = await fetch(`http://${ipaddress}:8080/itens/${idlista}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-acess-token': datatoken2,
          
        },
      })

      const resp = await response.json()

      setId(resp[0].id_)

      setItens(resp)

      const comp = resp.filter((item: { comprado: boolean }) => item.comprado).map((item: { id_: number }) => item.id_);  // Filtrando itens por 'comprado' e depois fitrando por 'id_'

      isComprado(comp)
  }

  async function updateData(){


    setloading(true)

    const datatoken = await AsyncStorage.getItem('token')
    const idlista = await AsyncStorage.getItem('idlista')

    const diamesAno = new Date().toLocaleDateString('pt-br')

    let datatoken2 = ''

    const data = {ids: selected, idlista : idlista}
    const datasUpdate = {id: idlista, datas: diamesAno}


    if(datatoken!=null){

      datatoken2 = datatoken
    }

    const response = await fetch(`http://${ipaddress}:8080/itens/updatestate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-acess-token': datatoken2,
        
      },

      body: JSON.stringify(data),    
    
    })

    const resp = await response.json()


    const responseList = await fetch(`http://${ipaddress}:8080/listas/updatedate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-acess-token': datatoken2,
        
      },

      body: JSON.stringify(datasUpdate),    
    
    })

    const respList = await responseList.json()


    getItensData();
    setloading(false)

  }


  async function postData(){

    setloading(true)

    const datatoken = await AsyncStorage.getItem('token')
    const idlista = await AsyncStorage.getItem('idlista')

    const diamesAno = new Date().toLocaleDateString('pt-br')

    let datatoken2 = ''

    const data = {idlista : idlista, produto: produto, quantidade: quantidade, unidade: unidade, comprado: 'FALSE'}
    const datasUpdate = {id: idlista, datas: diamesAno}


    if(datatoken!=null){

      datatoken2 = datatoken
    }

    const response = await fetch(`http://${ipaddress}:8080/itens/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-acess-token': datatoken2,
        
      },

      body: JSON.stringify(data),    
    
    })

    const resp = await response.json()


    const responseList = await fetch(`http://${ipaddress}:8080/listas/updatedate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-acess-token': datatoken2,
        
      },

      body: JSON.stringify(datasUpdate),    
    
    })

    const respList = await responseList.json()


    getItensData();
    setloading(false)

  }

  async function setSelecionados(id: number){

    setSelected((sel) => {

      if(sel.includes(id)){
        
        return sel.filter((iditem) => iditem !== id);  // Filtrando e retirando o Id de selecionados
      }
      else{
        return [...sel, id]   // Adicionando
      }
  
    });
  } 

    

  useEffect(()=>{
    
    getItensData();

  },[]);


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
                Itens 
                Lista
            </Text>


            <TouchableOpacity onPress={() => {ismodalVisible(true)}}>
              <MaterialIcons style={{marginRight: 20, justifyContent:"center"}} name="add" size={24} color="black" />
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


              <Text style={{fontSize:24,fontWeight: '700', margin: 10, color:"#2e2e3a"}}>Adicionar Produto</Text>

              <TextInput 
              
                style={styles.input}
                onChangeText={setProduto}
                value={produto}
                placeholder="Produto"
                keyboardType="default"
              
              />

              <TextInput 
              
                style={styles.input}
                onChangeText={setQuantidade}
                value={quantidade}
                placeholder="Quantidade"
                keyboardType="default"
              
              />

              <TextInput 
              
                style={styles.input}
                onChangeText={setUnidade}
                value={unidade}
                placeholder="Unidade (un/kg...)"
                keyboardType="default"
              
              />


              <View style ={styles.buttonsmodal}>
                <TouchableOpacity 
                  style = {styles.buttonIsolate}
                  onPress={() => {
                    ismodalVisible(false)
                    postData()
                  }}
                >        
                  <Text style={{color: "white", textAlign: 'center',  fontSize:15,  fontWeight:600}}>Adicionar</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>

        </Modal>


        
          {loading ? (
              <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
          ) : (

           
            <FlatList
              data={itens}
              keyExtractor={(item, index) => index.toString()} 

              renderItem={({ item }) => (

                <TouchableOpacity style={[
                  styles.botaoitens,
                  selected.includes(item["id_"]) && styles.itemSelecionado,
                  comprado.includes(item["id_"]) && styles.itemComprado,
                ]}
                
                  onPress={() => setSelecionados(item["id_"])}
                  disabled={item["comprado"]}
                >

                  <Text style={styles.textolista}>{item["produto"]}</Text>

                  <Text style={styles.textolista}>{item["quantidade"]}</Text>

                  <Text style={styles.textolista}>{item["unidade"]}</Text>

                   {(selected.includes(item["id_"]) || comprado.includes(item["id_"])) && (

                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color={'#28a745'}
                    />
                  )}

                </TouchableOpacity>
  
                )}
            />
            )}
        

        <View style={styles.salvarContainer}>

          <TouchableOpacity style={[
            styles.botaosalvar,
            selected.length === 0 && styles.botaoSalvarDisable
          
          ]}
            disabled={selected.length === 0}
            onPress={updateData}
          >
            <Text style={{fontSize:20, fontWeight: 700, color:'white'}}>Salvar alterações</Text>
          </TouchableOpacity>
          
        </View>
        
    </LinearGradient>
  );
}




const styles = StyleSheet.create({

  textoMinhasListas: {
    
    fontSize:36,
    fontWeight: '700',
    color:'white'
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


  rowmodal:{

    marginTop: 10,
    marginBottom:30,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    alignItems:'center'

  },

 

   botaoitens: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#ae9ff7ff',  
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dddbdbff',
    width:350,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent:"space-between",
    gap: 10,
  },
  textolista: {
    color: '#1b1b1bff',                
    fontSize: 16,
    fontWeight: '500',
    width:60,
  },

  itemSelecionado: {
    backgroundColor: '#cbc3f3c0',
    borderColor: '#dddbdbff',
  },

  itemComprado: {
    backgroundColor: '#d4edda',
    borderColor: '#dddbdbff',
    opacity: 0.7,
  },
  
  salvarContainer: {
    marginBottom: 50,
  },

  botaosalvar:{

    backgroundColor: '#ae9ff7ff',   
    padding: 12,                  
    borderRadius: 6,              
    alignItems: 'center',         
    marginVertical: 8,
    flexDirection: 'row',
    gap:10, 
  },

  botaoSalvarDisable:{

    backgroundColor: '#b8abf8ff',   
    padding: 12,                  
    borderRadius: 6,              
    alignItems: 'center',         
    marginVertical: 8,
    flexDirection: 'row',
    gap:10, 
    opacity: 0.7,

  }
});
