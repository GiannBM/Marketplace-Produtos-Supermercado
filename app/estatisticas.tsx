import { Text, View, StyleSheet, Button, TouchableOpacity,Modal, ActivityIndicator } from "react-native";
import { Link } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { BarChart, CurveType, LineChart } from "react-native-gifted-charts";
import React from "react";
import { Tabs, useRouter} from 'expo-router';

import { useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';


export default function Estatisticas() {

  const router = useRouter();
  const [teste, setteste] = React.useState(0)
  const [recarregar, setrecarregar] = React.useState(0)

  const [mediaCompra, setMediaCompra] = React.useState(0)
  const [mediaSupermercado, setmediaSupermercado] = React.useState([])


  const ipaddress = ""

  const [semAtual, setsemAtual] = React.useState(0)
  const mesAtual = useRef('')

  const totalSem = useRef(0)
  const totalMes = useRef(0)

  const idusuario = useRef('')
  const semConta = useRef(0)

  const [loading, setloading] = React.useState(false);
  
  const [dadosMensal, setdadosMensal] = React.useState<dataM[]>([])


  const [dadsoGrafSemanal, setdadossem] = React.useState([

    {
        Semana: "semana 1",
        values: [
        {value: 10, label:'S', semana:1}, 
        {value: 20, label:'T', semana:1}, 
        {value: 85, label:'Q', semana:1},
        {value: 120, label:'Q', semana:1},
        {value: 10, label:'S', semana:1},
        {value: 10, label:'S', semana:2}
        ]
    },
    {
        Semana: "semana 2",
        values: [  
        {value: 100, label:'S', semana:1}, 
        {value: 100, label:'T', semana:2}, 
        {value: 100, label:'Q', semana:2},
        {value: 100, label:'Q', semana:2},
        {value: 100, label:'S', semana:2}
        ]
    },
    {
        Semana: "semana 3",
        values: [  
        {value: 200, label:'S', semana:1}, 
        {value: 200, label:'T', semana:2}, 
        {value: 200, label:'Q', semana:2},
        {value: 200, label:'Q', semana:2},
        {value: 200, label:'S', semana:2}
        ]
    },
    {
        Semana: "semana 2",
        values: [  
        {value: 300, label:'S', semana:1}, 
        {value: 300, label:'T', semana:2}, 
        {value: 300, label:'Q', semana:2},
        {value: 300, label:'Q', semana:2},
        {value: 300, label:'S', semana:2}
        ]
    }
]

)

type dataM = {

    values : [dataM2]
  }

type dataM2 ={

    value: number,
    label: string

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

    idusuario.current = resp[0].id_


}


async function getResumo(){

    setloading(true)

    const datatoken = await AsyncStorage.getItem('token')

    const resp = {iduser: idusuario}
      
    if(datatoken!=null){

      const response2 = await fetch(`http://${ipaddress}:8080/produtos/estatisticas`, {         
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-acess-token': datatoken,
        
        },

        body: JSON.stringify(resp),

            
      })

      const resp2 = await response2.json()

      for(let i=0; i<4;i++){

        for (let j =0; j<7;j++){

            var c = resp2[i].values[j].label

            if(c == 1 || c == 5 || c ==6){

              resp2[i].values[j].label = 'S'
            }

            if(c == 2){

              resp2[i].values[j].label = 'T'
            }

            if(c == 3 || c==4){

              resp2[i].values[j].label = 'Q'
            }
            if(c == 7){

              resp2[i].values[j].label = 'D'
            }

        }
        
      }

      var tot=0

      for (let i =0; i<resp2[0]?.values.length;i++){

        tot = Number(tot) + Number(resp2[0]?.values[i].value)
      }

      var aux = tot.toFixed(2)

      tot = Number(aux)
      totalSem.current = tot

      setdadossem(resp2)
      
      setloading(false)

    }
  }


  async function getEstatMensal(){

    setloading(true)

    const datatoken = await AsyncStorage.getItem('token')

    const resp = {iduser: idusuario}
      
    if(datatoken!=null){

      const response2 = await fetch(`http://${ipaddress}:8080/produtos/estaMensal`, {        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-acess-token': datatoken,
        
        },

        body: JSON.stringify(resp),

            
      })

      const resp2 = await response2.json()


      totalMes.current = resp2[0]?.values[0].value
      mesAtual.current = resp2[0]?.values[0].label


      setdadosMensal(resp2)
      
      setloading(false)

    }
  }


  async function getEstatGeral(){

    setloading(true)

    const datatoken = await AsyncStorage.getItem('token')

    const resp = {iduser: idusuario}
      
    if(datatoken!=null){

      const response2 = await fetch(`http://${ipaddress}:8080/produtos/estaGeral`, {       
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-acess-token': datatoken,
        
        },

        body: JSON.stringify(resp),

            
      })

      const resp2 = await response2.json()
            
      setMediaCompra(resp2.mediaCompra)
      setmediaSupermercado(resp2.mediaSupermercado)
      
      setloading(false)


    }
  }


function mudardir (sentido: number){


    if(semAtual==3 && sentido==1){

        setsemAtual(0)
        semConta.current = 0
    }else if(semAtual==0 && sentido==-1){

        setsemAtual(3)
        semConta.current = 3

    }

    else{
        setsemAtual(prev => prev + sentido)

        semConta.current = semConta.current + sentido
    }
 

}


function calculateTotal (stri: number){


  var teste = semConta.current

  var tot =0;

  for (let i =0; i<dadsoGrafSemanal[teste]?.values.length;i++){

    tot = Number(tot) + Number(dadsoGrafSemanal[teste]?.values[i].value)
  }

  var aux = tot.toFixed(2)

  tot = Number(aux)

  totalSem.current = tot
}


useFocusEffect(
      useCallback(() => {
  
        const esperar = async () => {
        
          await getData();

          await getResumo();

          await getEstatMensal()

          await getEstatGeral()
          semConta.current = 0

         

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
                <ScrollView>

                  <View style ={styles.cotainerestatsem}>

                    <View style ={{

                      margin:15,
                      
                    }}>

                      <Text style ={{

                          fontSize:32,
                          fontWeight:700,

                      }}> Semanal</Text>

                      <Text style ={{

                          fontSize:24,
                          marginTop:8,
                          fontWeight:700,

                      }}> R$ {totalSem.current}</Text>
                    </View>

                   <View  style={{


                      marginTop:10,
                      marginBottom:15,
                      flexDirection:'row',
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>

                      

                      <TouchableOpacity
                      
                          style ={{margin:5}}
                          onPress={()=> {mudardir(-1), calculateTotal(semAtual)}}
                      >
                          <Ionicons
                            name={"arrow-back"} size={30}
                          ></Ionicons>
                      </TouchableOpacity>

                      <Text style = { {

                        fontSize:16,
                        fontWeight:600,
                      }}>

                        {dadsoGrafSemanal[semAtual]?.Semana}
                      </Text>

                      <TouchableOpacity
                        style ={{margin:5}}
                        onPress={()=> {mudardir(1), calculateTotal(semAtual)}}
                      >
                          <Ionicons
                            name={"arrow-forward"}  size={30}
                          ></Ionicons>
                      </TouchableOpacity>
                        
                    </View>

                                    

                      <BarChart
                          data={dadsoGrafSemanal[semAtual]?.values}
                          width={270}
                          isAnimated
                          frontColor={"#39FF14"}
                          barBorderRadius={6}
                          noOfSections={5}
                          yAxisThickness={0}
                          xAxisThickness={0}
                          lineBehindBars = {false}

                          xAxisLabelTextStyle={{

                            color:'black',
                            fontWeight:600,
                            fontSize: 14,
                      
                          }}

                          yAxisTextStyle={{

                            color:'black',
                            fontWeight:600,
                            fontSize: 14,
                      
                          }}
                          

                      />
                    
                  </View>




                  <View style ={styles.cotainerestatsem}>

                    <View style ={{margin:15}}>

                      <Text style ={{

                          fontSize:32,
                          fontWeight:700,

                      }}>Mensal</Text>


                      <Text style ={{

                          fontSize:24,
                          marginTop:8,
                          fontWeight:700,

                      }}>{mesAtual.current}</Text>

                      <Text style ={{

                          fontSize:24,
                          marginTop:8,
                          fontWeight:700,

                      }}>R$ {totalMes.current}</Text>
                    </View>
                                  

                      <LineChart
                          data={dadosMensal[0]?.values}
                          width={270}
                          isAnimated
                          noOfSections={5}
                          color="lightblue"

                          dataPointsRadius={20}          
                          dataPointsColor="transparent" 
                           
                          onPress={(item:{value: number, label: string}) => {

                            totalMes.current = item.value
                            mesAtual.current = item.label
                            setteste(item.value)
                          }}

                          
                          yAxisThickness={0}
                          xAxisThickness={0}
                          spacing={48}
                          curved
                          curveType={CurveType.QUADRATIC}
                          areaChart
                          startFillColor="blue"
                          endFillColor="blue"
                          startOpacity={0.5}
                          endOpacity={0.1}
                                               
                        

                          xAxisLabelTextStyle={{

                            color:'black',
                            fontWeight:600,
                            fontSize: 14,
                      
                          }}

                          yAxisTextStyle={{

                            color:'black',
                            fontWeight:600,
                            fontSize: 14,
                      
                          }}
                          
                          

                      />
                    
                  </View>


                  <View style ={styles.cotainerestatsem}>

                    <View style ={{margin:15}}>

                      <Text style ={{

                          fontSize:32,
                          fontWeight:700,

                      }}>Análises</Text>


                      <View style={{backgroundColor:"#E6E9FF", padding:10, borderRadius:10, marginBottom: 12, marginTop: 30}}>

                          <View style={{flexDirection:"row", borderColor:'white', padding:5, justifyContent:"space-between"}}>

                            <Text style ={{


                            fontSize:16,
                            fontWeight:700,
                            width:180

                            }}>Média p/Compra:</Text>

                            <Text style ={{


                            fontSize:16,
                            fontWeight:700,
                            marginRight:20,

                            }}>R$ {mediaCompra} </Text>

                          </View>

                      </View>


                      


                      <View style={{backgroundColor:"#E6E9FF", padding:10, borderRadius:10}}>

                      
                        <Text style ={{

                            marginLeft:5,
                            fontSize:16,
                            marginTop:10,
                            fontWeight:700,

                        }}>Média p/Supermercado:</Text>

                        {mediaSupermercado.map((item, index)=>(


                          <View key={index} style={{flexDirection:"row", borderColor:'white',borderRadius:10, borderWidth:2, margin:10, padding:7}}>

                              <Text style={{

                                fontSize:14,
                                fontWeight:600,
                                width:180

                              }}>{item["estabelecimento"]}</Text>

                              <View style ={{justifyContent:"center"}}>

                              <Text style={{

                                alignItems:'center',
                                marginLeft: 3,
                                fontSize:14,
                                fontWeight:600,
                                }}>...R$ {item["value"]}  </Text>


                              </View>
                            

                          </View>



                        ))}

                      </View>
                    </View>
                    
                  </View>

                   
                    
                </ScrollView>
            )}
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
    color: 'black',
    textAlign: 'center'
  },
  button: {
    borderColor: 'black',
    backgroundColor: 'lightcyan',
    borderWidth: 2,
    padding: 10,
    borderRadius: 8,
    width: 200,
    height: 50,
    marginBottom: 30,
  },

  loadingstyles:{
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cotainerestatsem:{

    margin:15,
    padding:10,
    backgroundColor: 'white',
    width:370,
    borderRadius: 10

  }

});
