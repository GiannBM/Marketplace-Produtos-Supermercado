import { Text, View, StyleSheet, Button, TouchableOpacity, TextInputComponent, Modal, ActivityIndicator, Linking } from "react-native";
import { Link } from 'expo-router';
import { useEffect } from "react";
import React from 'react';
import { useRouter} from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { FlatList, TextInput} from "react-native-gesture-handler";
import MapView, { Marker } from 'react-native-maps';
import Slider from '@react-native-community/slider';

import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Callout } from "react-native-maps";


export default function searchproduct() {

    const router = useRouter();
    const [email, onChangeEmail] = React.useState('');
    const [id, onChangeId] = React.useState('');
    const [query, setQuery] = React.useState('');
    const [products, setProducts] = React.useState([]);
    const [productsGeocode, setProductsGeocode] = React.useState([]);
    const [loading, setloading] = React.useState(false);
    const [distMax, setDistMax] = React.useState<number>(0);

    const ipaddress = ""

    

    async function abrirWaze(param1: string, param2: string) {

         try {
          const url = `waze://?ll=${param1},${param2}&navigate=yes`;
          const urlWeb = `https://waze.com/ul?ll=${param1},${param2}`;

          
          const checkOpenUrl = await Linking.canOpenURL(url);

          if(checkOpenUrl){
           
            await Linking.openURL(url);
          }
          else{
            
            await Linking.openURL(urlWeb);
          }

        } catch (err) {
          console.warn('Erro ao abrir Waze ', err);
        }
    }


    async function queryProducts(){


        setloading(true)

        const datatoken = await AsyncStorage.getItem('token')
        const longitudeUser = await AsyncStorage.getItem('longitudeUser')
        const latitudeUser = await AsyncStorage.getItem('latitudeUser')

        const novoproduct = [{
            Produto: query,
            DistMax: distMax,
            LongitudeUser: longitudeUser,
            LatitudeUser: latitudeUser
        }]


        
        if(datatoken!=null){

            const response = await fetch(`http://${ipaddress}:8080/produtoatt/query`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'x-acess-token': datatoken,
                
            },

                body: JSON.stringify(novoproduct),
            })

            const resp = await response.json()


            if(response.status ==200 ){

                setProducts(resp)
                setloading(false) 
            }

        }
    }


  useEffect(()=>{


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

            <TextInput
            style={styles.input2}
            placeholder="Digite sua busca"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={queryProducts}
            />

            <View style={{justifyContent:'center'}}>
              <TouchableOpacity style={styles.button2} onPress={queryProducts}>
                <Text style ={styles.botaopesq}> BUSCAR </Text>
              </TouchableOpacity>
            </View>

        </View>

        
        <Text style={{margin:30, marginBottom:20, color:'white', fontSize:18, fontWeight:800}}>Distância Máxima: {distMax}</Text>

         <View style={{ alignItems:'center', marginBottom:20 }}>


            <Slider
              style={{ width: 300, height: 40 }}
              minimumValue={0}
              maximumValue={20}
              step={0.5}
              value={distMax}
              onValueChange={setDistMax}
              minimumTrackTintColor="#cdeeffff"
              maximumTrackTintColor="#e9e5e5ff"
              thumbTintColor="#cdeeffff"
            />
          </View>                                    

        <View>

            {loading ? (
                <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
            ) : (
            <FlatList
                data={products}
                keyExtractor={(item, index) => index.toString()} 

                contentContainerStyle={{
                  paddingBottom: 220, 
                }}

                renderItem={({ item }) => (

                <View style={styles.container}>
                       
                  <Text style={styles.produto}>
                      {item["produto"]}
                  </Text>

                  <Text style={styles.valunitario}>
                      R$ {item["valorunitario"]}   
                      
                      <Text style={styles.unidade}> /  
                        {item["unidade"]}
                      </Text>
                  </Text>

                         

                  <View style ={{flexDirection: 'row'}}>

                    <Ionicons style={{marginRight:5}} name="cart" size={22} color="black"/>
                    <Text style={styles.estabelecimento}>
                        {item["estabelecimento"]}
                    </Text>
                  </View>

                  <View style ={{flexDirection: 'row'}}>

                    <Ionicons style={{marginRight:5}} name="location-sharp" size={22} color="black"/>
                    <Text style={styles.endereco}>
                      {item["endereco"]}
                    </Text>
                  </View>

                  

                  <MapView 
                  
                    style={styles.mapsize}
                    initialRegion={{
                      latitude: item["latitude"],
                      longitude: item["longitude"],
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }}
                  
                  >

                    <Marker
                      coordinate={{
                        latitude: item["latitude"],
                        longitude: item["longitude"]
                      }}
                    >            

                    <Callout>
                      <View style={styles.callout}>
                        
                        <Text style={{ flexWrap: 'wrap', fontWeight: 'bold', marginBottom: 5, fontSize: 13}}>{item["estabelecimento"]}</Text>
                        <Text style={{ flexWrap: 'wrap', fontSize: 11 }}>{item["endereco"]}</Text>
                      </View>
                    </Callout>
                     
                    
                    </Marker>

                  </MapView>

                  <TouchableOpacity style={styles.botaowaze} onPress={() => abrirWaze(item["latitude"], item["longitude"])}>
                    <Text style={styles.textowaze}>Abrir no Waze</Text>
                  </TouchableOpacity>
          
                </View>
                )}
            />)}
        </View>

    
    

        
    </LinearGradient>
  );
}




const styles = StyleSheet.create({

  input2: {    
    width: 200,
    height: 50,
    fontSize:16,
    fontWeight:800,
    color:'white'
  },

  container: {

    width: 350,
    padding: 15,
    backgroundColor:"#e1e5faff",
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    margin: 12,
    borderRadius: 9,

  },

  button2:{

    justifyContent:'center'
  },


  


  rowmodal:{

    marginTop: 10,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    borderColor:'white',
    borderWidth:1,
    padding: 8,
    paddingRight:11,
    paddingLeft:11,
    borderRadius:20,

  },


  produto: {

    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',

  },

  unidade:{

    fontSize: 14,
    color: '#666',
    fontWeight: '400',

  },

  estabelecimento:{

    fontSize: 16,
    color: '#555',
    marginBottom: 6,


  },

  endereco:{

    fontSize: 14,
    color: '#777',
    marginBottom: 6,

  },

  valunitario: {

    fontSize: 18,
    color: '#28a745',
    fontWeight: '600',
    marginBottom: 8,

  },

  mapsize: {

    marginBottom: 8,
    height: 150,
    width: '100%', 
  },

  callout:{

    maxWidth: 200,
    padding: 5,
    borderRadius: 2,
  },

  botaopesq:{

    fontSize:16,
    fontWeight:800,
    color:'white'
  },

   botaowaze: {
    backgroundColor: '#b3b6e7ff',   
    padding: 12,                  
    borderRadius: 6,              
    alignItems: 'center',         
    marginVertical: 8,
  },


  textowaze: {
    color: '#fff',                
    fontSize: 16,
    fontWeight: '500',
  },
});
