import { Text, View, StyleSheet, Button, TouchableOpacity, TextInputComponent, Modal, ActivityIndicator} from "react-native";
import { Link } from 'expo-router';
import { useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';

import React from 'react';
import { Tabs, useRouter} from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';








export default function userpage() {

  const router = useRouter();
  const [email, onChangeEmail] = React.useState('');
  const [latitude, setLatitude] = React.useState<number>()
  const [longitude, setLongitude] = React.useState<number>()
  const [id, onChangeId] = React.useState('');
  const [modalVisible, ismodalVisible] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [productsbycompra1, setProductsbycompra1] = React.useState<Prod[]>([]);
  const [productsbycompra2, setProductsbycompra2] = React.useState<Prod[]>([]);
  const [resumo, setResumo] = React.useState<Resu>();

  const [comprasRecentes, setComprasRecentes] = React.useState([]);
  const [endereco, setEndereco] = React.useState();
  const [loading, setloading] = React.useState(false);
  const [name, onChangeName] = React.useState('');
  const idusuario = useRef('')

  const [recarregar, setRecarregar] = React.useState(0);
  
  const ipaddress = ""


  const [data, setData] = React.useState('');
  const [vlTotal, setvalortotal] = React.useState<number>();


  type Prod = {

    id_: string,
    produto: string,
    quantidade: string,
    unidade: string,
    valorunitario: string,
    valortotal: string,
    datas: string,
    endereco: string,
    estabelecimento: string,
    cnpj: string,
    embedding: string,
    latitude: string,
    longitude: string,
    idcompra: string,
    dataformatada: string
  }

  type Resu = {


    valfinal:string,
    valorPorcentagem: string, 
    supermercado:string
  }



  async function getLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        alert('Permissão Negada');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const latitude = location["coords"]["latitude"]
      const longitude = location["coords"]["longitude"]

      setLatitude(location["coords"]["latitude"]);
      setLongitude(location["coords"]["longitude"]);

      await AsyncStorage.setItem('latitudeUser', latitude.toString());
      await AsyncStorage.setItem('longitudeUser', longitude.toString());

  }


  async function getData(){

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

    //console.log(resp)
    onChangeEmail(resp[0].email)
    onChangeId(resp[0].id_)
    onChangeName(resp[0].nome)
    idusuario.current = resp[0].id_


  }


  async function showProductsCamera(){

    const statusScanner = await AsyncStorage.getItem('camerascan')

    console.log(statusScanner)

    if(statusScanner !== null && statusScanner!== undefined){

      await AsyncStorage.removeItem('camerascan')

      const token = await AsyncStorage.getItem('token')

      const datalink = {statusScanner}

      if(token!=null){

        const response2 = await fetch(`http://${ipaddress}:8080/user/home/perfil/script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-acess-token': token,
          
        },
             
        body: JSON.stringify(datalink),

        })

        
      const resp = await response2.json()

      setEndereco(resp.produtos[0].Estabelecimento)
      setData(resp.produtos[0].Data)

      var Latitude =0
      var Longitude =0

      try{

        const geocode = await Location.geocodeAsync(resp.produtos[0].Endereco);

        Latitude= geocode[0].latitude
        Longitude= geocode[0].longitude

      }catch(err){

        Latitude =0
        Longitude =0
        console.log(`Erro no geocode ${resp.produtos[0].Endereco}:`, err);
      }

      var i=0;
      let vltotal = 0;
      for(;i<(resp.produtos).length; i++) {    
            resp.produtos[i] = { ...resp.produtos[i], Latitude, Longitude };
            vltotal= vltotal + parseFloat(resp.produtos[i].ValorTotal.replace(",", "."))
      }

      setProducts(resp.produtos)
      setvalortotal(vltotal)
      ismodalVisible(true)

      }
    }

  }


  async function inputProducts(){


    setloading(true)

    const datatoken = await AsyncStorage.getItem('token')

    if(datatoken!=null){

      const response = await fetch(`http://${ipaddress}:8080/produtoatt/post`, {
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

      inputNaoContribuirProducts()

    }
   
  }



  async function inputNaoContribuirProducts(){


    setloading(true)

    const datatoken = await AsyncStorage.getItem('token') 

    const compras = {iduser: id, estabelecimento: endereco, data_compra: data, valor_total:vlTotal}

    if(datatoken!=null){                                                                        /// Inserir uma compra

      const response = await fetch(`http://${ipaddress}:8080/compras/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-acess-token': datatoken,
        
      },

      body: JSON.stringify(compras),
    })

      const resp = await response.json()

      const inputProducts = {produtos: products, IdUser: id, IdCompra: resp[0].id_}

      if(datatoken!=null){                                                                        /// Inserir uma compra

        const response = await fetch(`http://${ipaddress}:8080/produtos/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-acess-token': datatoken,
          
          },

        body: JSON.stringify(inputProducts),
      })

        const resp = await response.json()

        console.log(resp)


        setloading(false)

        setRecarregar(prev => prev+1)


      }

    }
  }

  async function getComprasRecentes(){

    setloading(true)

    const datatoken = await AsyncStorage.getItem('token')

    console.log(idusuario.current)
    const list2 ={iduser: idusuario.current}

    let resp =''

    if(datatoken!=null){

      const response = await fetch(`http://${ipaddress}:8080/compras/user`, {         /// Obtendo as últimas 2 compras do usuário
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-acess-token': datatoken,
        
                 

      },
                
      body: JSON.stringify(list2),

    })


      resp = await response.json()

      console.log(resp)

    }


      
    if(datatoken!=null){

      const response2 = await fetch(`http://${ipaddress}:8080/produtos/bycompra`, {         /// Obtendo as últimas 2 compras do usuário, ID é importante.
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-acess-token': datatoken,
        
        },
                
        body: JSON.stringify(resp),

      })

      const resp2 = await response2.json()

      console.log(resp2["todasCompras"][0][0]["produto"])

      setProductsbycompra1(resp2["todasCompras"][0])
      setProductsbycompra2(resp2["todasCompras"][1])


      setloading(false)

    }
  }

  async function getResumo(){


    
    setloading(true)

    const datatoken = await AsyncStorage.getItem('token')

    const resp = {iduser: idusuario}

    console.log("Entrei")
      
    if(datatoken!=null){

      const response2 = await fetch(`http://${ipaddress}:8080/produtos/resumo`, {        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-acess-token': datatoken,
        
        },

        body: JSON.stringify(resp),

            
      })

      const resp2 = await response2.json()

      console.log(resp2)
      setResumo(resp2)
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

  function navigateEstatPage(){

    router.push('./estatisticas')

  }

  function searchforProducts(){

    router.push('./searchproduct')

  }

  function viewlists(){
      
    router.push('./listas')

  

  }





  useFocusEffect(
      useCallback(() => {
  
        const esperar = async () => {
        
          await getData();

          getLocation()
          showProductsCamera()
          getComprasRecentes()
          getResumo()

          
        };

    esperar();
  
    }, [recarregar]) 
  );

  return (

      

      <LinearGradient
        colors={['#b19dc9ff', '#7c68e0ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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

            <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />

            <View style ={styles.containermodal}>

              <View style ={styles.modalstyle}>

                <Text style={styles.nomeestabelecimento}>{endereco}</Text>

                <View style={styles.linha}>
                    <Text style={styles.itemnome}>Produto</Text>
                    <Text style={styles.item}>Qtd</Text>
                    <Text style={styles.item}>Valor Uni</Text>
                    <Text style={styles.item}>Valor Total</Text>
                </View>

                {products.map((product,index) => (

                  <View style={styles.linha} key={index}>
                    <Text style={styles.itemnome}>{product["Produto"]}</Text>
                    <Text style={styles.item}>{product["Quantidade"]}</Text>
                    <Text style={styles.item}>{product["ValorUnitario"]}</Text>
                    <Text style={styles.item}>{product["ValorTotal"]}</Text>
                  </View>
                ))
                
                }

                <View style ={styles.buttonsmodal}>

                  <TouchableOpacity 
                    onPress={() => {
                      ismodalVisible(false)
                      inputProducts()
                    }}
                    style = {styles.buttonIsolate}
                  >        
                    <Text style={{color: "white", textAlign: 'center',  fontSize:13 ,  fontWeight:600}}>Contribuir</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style = {styles.buttonIsolate}
                    onPress={() => {
                      ismodalVisible(false)
                      inputNaoContribuirProducts()
                    }
                    }
                  >        
                    <Text style={{color: "white", textAlign: 'center',  fontSize:13,  fontWeight:600}}>Não Contribuir</Text>
                  </TouchableOpacity>


                </View>

                <TouchableOpacity 
                    style = {styles.buttonIsolate}
                    onPress={() => ismodalVisible(false)}
                  >        
                    <Text style={{color: "white", textAlign: 'center',  fontSize:13,  fontWeight:600}}>Escanear Novamente</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </Modal>


        
        
                  
        
          <View style ={{flexDirection: 'row', position: 'absolute', top: 0, left: 0, right: 0, padding: 20, gap: 25, height:100, zIndex:10  }}>
        
            <Text style ={styles.textrow}>Bem vindo, {name}!</Text>

            <TouchableOpacity 
              style={styles.button}
              onPress={sair}
            >        
              <Ionicons name="exit" size={34} color="black" />
            </TouchableOpacity>

          </View>



        <ScrollView style = {styles.scrollviewArea}>


          
          <View style ={styles.cardResumoCompras}>

            <Text style={{margin:5, marginRight:7, fontSize:24, fontWeight:700, color:"#2e2e3a"}}>
              Resumo Compras  
            </Text>
            <View style={styles.containercompras}>

              
                <View style ={{flexDirection: 'row', marginBottom: 10}}>
                    {Number(resumo?.valfinal) >=0 && <Text  style={{fontSize:14, fontWeight:600}}>Economia:  </Text>}
                    {Number(resumo?.valfinal) <0 && <Text  style={{fontSize:14, fontWeight:600}}>Aumento de Gasto:  </Text>}

                    {Number(resumo?.valfinal) >=0 && <Text  style={{fontWeight:700, color:'green'}}>R${Number(resumo?.valfinal)*-1}</Text>}                 
                    {Number(resumo?.valfinal) <0 && <Text  style={{fontWeight:700, color:'red'}}>R${Number(resumo?.valfinal)*-1}</Text>}


                </View>


                <View style ={{flexDirection: 'row', marginBottom:10}}>
                    <Text  style={{fontSize:14, fontWeight:600}}>Comparação Mês Passado:  </Text>

                    {Number(resumo?.valorPorcentagem) >=0 && <Text  style={{fontWeight:700, color:'red'}}>{resumo?.valorPorcentagem}% </Text>}
                    {Number(resumo?.valorPorcentagem) <0 && <Text  style={{fontWeight:700,  color:'green'}}>{resumo?.valorPorcentagem}% </Text>}


                </View>


                <View style ={{flexDirection: 'row',marginBottom:10, }}>
                    <Text  style={{fontSize:14, fontWeight:600, justifyContent:"center"}}>Local mais econômico:  </Text>
                    <Text  style={{fontWeight:700,fontSize:14, width:160}}>{resumo?.supermercado}</Text>

                </View>

                <TouchableOpacity
                
                  style = {{width:200, backgroundColor: "#d6d7e9", marginLeft:5, marginTop:10, padding: 5, borderRadius:7, alignItems:"center", shadowColor:'black', shadowOpacity:0.3}}
                  onPress={()=> {navigateEstatPage()}}
                >

                      <Text style={{fontSize:15, fontWeight:600}}>
                        Estatisiticas Completas
                      </Text>
                </TouchableOpacity>
            </View>

          </View>




        <View style = {styles.cardResumoCompras}>

          <Text style={{margin:5, marginRight:7, fontSize:24, fontWeight:700, color:"#2e2e3a"}}>
            Últimas Compras  
          </Text>
          <View style={styles.containercompras}>

           
            {productsbycompra1!=undefined && <Text style={{margin:5, fontSize:16, fontWeight:600}}>{productsbycompra1[0]?.dataformatada} </Text>}
            {productsbycompra1!=undefined && <Text style={{margin:5, fontSize:16, fontWeight:600}}>{productsbycompra1[0]?.estabelecimento}</Text>}


            {productsbycompra1.length>0 && productsbycompra1 != undefined && (productsbycompra1).map((item, index) => (

              <View key={item.cnpj+index}  style ={{flexDirection: 'row', justifyContent:"space-between"}}>

                  <View style={{justifyContent:'center'}}>
                    <Ionicons style={{margin:5, alignItems: 'center'}} name="checkmark" size={16} color="black"/>
                  </View>

                  <Text style={{width:150,margin:5}}>{item.produto}</Text>

                  <View style={{justifyContent:'center'}}>
                    <Text style={{margin:5}}>.... R$ {item.valortotal}</Text>
                  </View>

              </View>

            ))}
          </View>


          <View style={styles.containercompras}>

           
            {productsbycompra2!=undefined && <Text style={{margin:5, fontSize:16, fontWeight:600}}> {productsbycompra2[0]?.dataformatada} </Text>}
            {productsbycompra2!=undefined && <Text style={{margin:5, fontSize:16, fontWeight:600}}> {productsbycompra2[0]?.estabelecimento}</Text>}


            {productsbycompra2 != null && productsbycompra2 != undefined && productsbycompra1.length>0 && (productsbycompra2).map((item, index) => (

              <View key={item.cnpj+index} style ={{flexDirection: 'row',justifyContent:"space-between"}}>

                  <View style={{justifyContent:'center'}}>
                    <Ionicons style={{margin:5, alignItems: 'center'}} name="checkmark" size={16} color="black"/>
                  </View>

                    <Text style={{width:150,margin:5}}>{item.produto}</Text>

                    <View style={{justifyContent:'center'}}>
                      <Text  style={{margin:5}}>.... R$ {item.valortotal}</Text>
                    </View>

              </View>
            ))}
          </View>

        </View>

        </ScrollView>

          <View style={styles.containerbuttons}>

            <TouchableOpacity              
              style={styles.buttoncamera}
              onPress={navegcamera}
            >
              <Ionicons name="qr-code-outline" size={26} color="black" />
              <Text style ={{fontSize: 13, color: 'black',  fontWeight: 'bold', marginTop:4}}>Scanear QrCode</Text>
            </TouchableOpacity>


            <TouchableOpacity              
              style={styles.buttonSearchProducts}
              onPress={searchforProducts}
            >
              <Ionicons name="search" size={26} color="black" />
              <Text style ={{fontSize: 13, color: 'black',  fontWeight: 'bold', marginTop:4}}>Pesquisar</Text>
            </TouchableOpacity> 

            <TouchableOpacity              
              style={styles.buttonLists}
              onPress={viewlists}
            >
                          
              <Ionicons name="list" size={26} color="black" />
              <Text style ={{fontSize: 13, color: 'black',  fontWeight: 'bold', marginTop:4}}>Minhas Listas</Text>
            </TouchableOpacity> 
          </View>


          </>
          )}

        </LinearGradient>
    
         
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
    color: 'white',  
    fontWeight: 'bold', 
    flexShrink: 1,

    
  },
  containermodal:{

    flex:1,
    justifyContent: 'center',
    alignItems: 'center',

  },

  scrollviewArea :{

    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 100,
    marginBottom: 110


  },

  cardResumoCompras:{

    backgroundColor:"#d6d7e9", 
    padding:15, 
    borderRadius:10,
    marginBottom:20

  },

  containercompras:{

    width: 325,
    padding: 15,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#e6e7f4"

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


  buttonsmodal:{

    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',

    gap: 10,

  },

  buttonIsolate: {

    fontSize: 11,
    backgroundColor: '#ae9ff7ff',
    width:120,
    padding:10,
    borderRadius: 10,
    justifyContent:'center',
    alignItems: 'center',
    marginVertical: 8,
  },

  buttoncamera: {
    padding: 5,
    alignItems: 'center',
    flexDirection: "column",  

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
    color:"#2e2e3a",
    fontSize: 15,
    fontWeight:700,

  },

  item:{

    flex: 1,
    textAlign: 'center',
    flexWrap: 'wrap',
    padding: 5,
    margin: 3,
    fontSize: 12,
    fontWeight:700,

  },

  itemnome:{

    flex: 3,
    textAlign: 'center',
    flexWrap: 'wrap',
    padding: 5,
    margin: 3,
    fontSize: 12,
    fontWeight:700,


  },

  buttonSearchProducts:{
    
    padding: 5,
    alignItems: 'center',
    flexDirection: "column", 
  },

  buttonLists:{
    
    padding: 5,
    alignItems: 'center',
    flexDirection: "column", 
  },

  loadingstyles:{

    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerbuttons:{

    flexDirection: 'row',
    height: 110,
    borderTopWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f4f2fb',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    fontSize: 10,

  }
});
