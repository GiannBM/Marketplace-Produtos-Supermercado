import { Text, View, StyleSheet, Button, TouchableOpacity, TextInputComponent, Modal, ActivityIndicator} from "react-native";
import { Link } from 'expo-router';
import { useEffect, useRef } from "react";
import React from 'react';
import { useRouter} from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function userpage() {

  const router = useRouter();
  const [email, onChangeEmail] = React.useState('');
  const [id, onChangeId] = React.useState('');
  const [modalVisible, ismodalVisible] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [endereco, setEndereco] = React.useState();
  const [loading, setloading] = React.useState(false);
  const [name, onChangeName] = React.useState('');





  async function getData(){

    const datatoken = await AsyncStorage.getItem('token')
    let datatoken2 = ''

    if(datatoken!=null){

      datatoken2 = datatoken
    }

    const response = await fetch('http://xxxxxxxxxx:8080/user/home/perfil', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-acess-token': datatoken2,
        
      },
    })

    const resp = await response.json()

    console.log(resp)
    onChangeEmail(resp[0].email)
    onChangeId(resp[0].id_)
    onChangeName(resp[0].nome)



  }


  async function showProductsCamera(){

    const statusScanner = await AsyncStorage.getItem('camerascan')

    console.log(statusScanner)

    if(statusScanner !== null && statusScanner!== undefined){

      await AsyncStorage.removeItem('camerascan')

      const token = await AsyncStorage.getItem('token')

      const datalink = {statusScanner}

      if(token!=null){

        const response2 = await fetch('http://xxxxxxxxxx:8080/user/home/perfil/script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-acess-token': token,
          
        },
             
        body: JSON.stringify(datalink),

        })

        
      const resp = await response2.json()

      setEndereco(resp.produtos[0].Estabelecimento)
      setProducts(resp.produtos)
      ismodalVisible(true)

      }
    }
  }


  async function inputProducts(){


    setloading(true)

    const datatoken = await AsyncStorage.getItem('token')

    if(datatoken!=null){

      const response = await fetch('http://xxxxxxxxxx:8080/produtoatt/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-acess-token': datatoken,
        
      },

      body: JSON.stringify(products),
    })

      const resp = await response.json()

      console.log(resp)
      setloading(false)

     

    }

    
   
  }

  async function sair(){


      await AsyncStorage.removeItem('token')

      router.replace("./login")

  }

   async function teste(){

      console.log(products[0])

  }

  function navegcamera(){

    router.push('./camera')

  }

  function searchforProducts(){

      router.push('./searchproduct')

  }



  useEffect(()=>{

    getData()
    showProductsCamera()

  },[]);


  return (

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      > 

        {loading ? (

            <View style = {styles.loadingstyles}>
              <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
            </View>
        ) : (

          <>
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {ismodalVisible(false)}}
          >

            <View style ={styles.containermodal}>

              <View style ={styles.modalstyle}>

                <Text style={styles.nomeestabelecimento}>{endereco}</Text>

                <View style={styles.linha}>
                    <Text style={styles.itemnome}>Produto</Text>
                    <Text style={styles.item}>Quantidade</Text>
                    <Text style={styles.item}>Valor Unitario</Text>
                    <Text style={styles.item}>Valor  Total</Text>
                </View>

                {products.map((product,index) => (

                  <View style={styles.linha} key={index}>
                    <Text style={styles.itemnome}>{product["Produto"]}</Text>
                    <Text style={styles.item}>{product["Quantidade"]}</Text>
                    <Text style={styles.item}>{product["ValorUnitario"]}</Text>
                    <Text style={styles.item}>{product["ValorTotal"]}</Text>
                  </View>
                ))}

                <View style ={styles.buttonsmodal}>

                  <TouchableOpacity 
                    onPress={() => {
                      ismodalVisible(false)
                      inputProducts()
                    }}
                    style = {styles.buttonIsolate}
                  >        
                    <Text>Dados Corretos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style = {styles.buttonIsolate}
                    onPress={() => ismodalVisible(false)}
                  >        
                    <Text>Escanear Novamente</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </Modal>


          
          
        
          <View style ={{flexDirection: 'row', position: 'absolute', top: 0, left: 0, right: 0, padding: 20, gap: 25  }}>
        
            <Text style ={styles.textrow}>Bem vindo, {name}!</Text>

            <TouchableOpacity 
              style={styles.button}
              onPress={sair}
            >        
              <Ionicons name="exit" size={34} color="black" />
            </TouchableOpacity>

          </View>
          <TouchableOpacity              
            style={styles.buttoncamera}
            onPress={navegcamera}
          >
            <Text style ={{fontSize: 20, color: 'white',  fontWeight: 'bold', }}>Scanear QrCode</Text>
          </TouchableOpacity>


          <TouchableOpacity              
            style={styles.buttonSearchProducts}
            onPress={searchforProducts}
          >
            <Text style ={{fontSize: 20, color: 'white',  fontWeight: 'bold', }}>Pesquisar Produtos</Text>
          </TouchableOpacity> 

          </>
          )}
    </View>     
  );
}




const styles = StyleSheet.create({
 
  button: {

    position: 'absolute',
    borderRadius: 2,
    top: 20,
    right: 20,
    width: 33,
    height: 30,
    textAlign: 'center',
  },

  textrow:{
    fontSize: 30, 
    color: '#212121',  
    fontWeight: 'bold', 
    flexShrink: 1,

    
  },
  containermodal:{

    flex:1,
    justifyContent: 'center',
    alignItems: 'center',

  },

  modalstyle:{

    backgroundColor: 'white',
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
  },


  buttonsmodal:{

    marginTop:10,
    flexDirection: 'row',
    gap: 10,

  },

  buttonIsolate: {

    borderColor: 'black',
    fontSize: 11,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },

  buttoncamera: {
    margin: 10,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#4C8BF5',
    alignItems: 'center',
    gap: 10,
    
  },

  text: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
  },

  linha:{

    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
  },

  nomeestabelecimento:{

    textAlign: 'center',
    padding: 5,
    margin: 5,
    fontSize: 15,

  },

  item:{

    flex: 1,
    textAlign: 'center',
    flexWrap: 'wrap',
    padding: 5,
    margin: 3,
    fontSize: 11,
  },

  itemnome:{

    flex: 3,
    textAlign: 'center',
    flexWrap: 'wrap',
    padding: 5,
    margin: 3,
    fontSize: 11,

  },

  buttonSearchProducts:{
    
    margin: 10,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#4C8BF5',
    alignItems: 'center',
    gap: 10,
  },

  loadingstyles:{

    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  }

});
