/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';

import {
  Alert,
  Button,
  KeyboardAvoidingView,
  KeyboardAvoidingViewBase,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  Touchable,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


// For multiple pages
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

// For Storage SQLite
import AsyncStorage from '@react-native-async-storage/async-storage';

// For search icon
import { Icon } from 'react-native-elements'


// For MQTT Protocol
import MQTT from 'sp-react-native-mqtt';

let d_client;
var idofusers = new Set()


const connect_automatically = () => {

}

const connect_to_dimq = (address, port) => {
  var full_address = 'mqtt://' + address + ":" + port
  MQTT.createClient({
    uri: full_address,
    clientId: 'from_android'
  }).then(function(client) {
    console.log(client)
    d_client = client
    // setMyclient(client)
    client.on('closed', function () {
      console.log('mqtt.event.closed');
    });
  
    client.on('error', function(msg) {
      console.log('mqtt.event.error', msg);
      connect_automatically()
    });
  
    client.on('message', function(msg) {
      d_on_message(msg)
    });
  
    client.on('connect', function() {
      ToastAndroid.show("DimQ Connected!", ToastAndroid.SHORT)
      console.log('connected');
      // client.subscribe('ahsefati_1/#', 0);
      client.subscribe('brokers/#', 0);
      // client.publish('/data', "test", 0, false);
    });
  
      
    client.connect();
      
  }).catch(function(err){
      console.log(err);
  
  });
}

connect_to_dimq("192.168.0.79", "1883")
// connect_to_dimq("koochap.com","1883")

const d_subscribe_general = (client) => {
  AsyncStorage.getItem("idofme").then(
    value => {
      if (value!=null){
        client.subscribe(value+"/#", 0)
        client.publish("users/" + value, value, 0, true)
      }
    }
  )
}

const d_subscribe = (client, topic) => {
  client.subscribe(topic, 0)
}

const d_publish = (client, topic, msg, retain) => {
  client.publish(topic, msg, 0, retain)
}

const d_on_message = (msg) => {
  if ("users/" === msg["topic"].substring(0,6)){
      idofusers.add(msg["data"])
  } else {

    var idofuser = msg.topic.split("/")[1]
    AsyncStorage.getItem(idofuser).then(
      value => {
        if (value!=null){
          var newValue = value + msg.data + "/!!/"
          AsyncStorage.setItem(idofuser,newValue)
          console.log(newValue)
        }else{
          var newValue = msg.data + "/!!/"
          AsyncStorage.setItem(idofuser,newValue)
        }
      }
    )

    console.log(msg.data)
    
  }

}



// const d_publish = (idofme, idtopublish, msgtopublish)=> {
//   d_client.publish(idtopublish+ "/" + idofme, msgtopublish, 0, false)
//   console.log("SENT!")
// }


const CartOfMsg = ({navigation,title, lastmsg}) => {
  return (
    <SafeAreaView style={{flexDirection: 'row', backgroundColor:'white', padding:10, margin:5, borderRadius:10, borderColor:'black', borderWidth:1}}>
      <Icon style={{marginLeft:10}} size={50} type='font-awesome' name="user-o"/>
      <View>
        <Text onPress={() => navigation.navigate('Private',)} style={{marginLeft:20, fontSize:20, color:'black', fontWeight:'bold'}}>{title}</Text>
        <Text style={{marginLeft:20, fontSize:15}}>{lastmsg}</Text>
      </View>
      
    </SafeAreaView>
  );
};

const CartOfAddFriend = ({navigation, title}) => {

  const navigateToSpecialPrivatePage = ()=>{
    console.log(title)
    navigation.navigate('Private', {title:title})
  }


  return (
    <SafeAreaView style={{flexDirection: 'row', backgroundColor:'white', padding:10, margin:5, borderRadius:10, borderColor:'black', borderWidth:1}}>
      <Icon style={{marginLeft:10}} size={50} type='font-awesome' name="telegram"/>
      <View>
        <Text onPress={() => navigateToSpecialPrivatePage()} style={{marginLeft:20, marginTop:'7%', fontSize:20, color:'black', fontWeight:'bold'}}>{title}</Text>
      </View>
      
      
    </SafeAreaView>
  );
};


const SignupScreen = ({ navigation }) => {
  const [idofme, setidofme] = React.useState("Amirhossein Sefati")

  const setIdOfMe = async ()=>{
    await AsyncStorage.setItem('idofme', idofme)
    // navigation.navigate('DimQ Messenger', { name: idofme })
    navigation.replace("DimQ Messenger");
    navigation.dispatch()
  }

  React.useEffect(()=>{
    fetchIdOfMe()
  },[])

  const fetchIdOfMe = () =>{
    try{
      AsyncStorage.getItem("idofme").then(
        value => {
          if (value!=null){
            ToastAndroid.show("Already Loginned!", ToastAndroid.SHORT)
            // navigation.navigate('DimQ Messenger', {name:idofme})
            navigation.replace("DimQ Messenger");
            navigation.dispatch()
          }
        }
      )
    }catch{

    }
  }

  return (
    <SafeAreaView>
      <Text style={styles.disclaimer}>Disclaimer: This is for test. Don't use it as a trusted messenger!</Text>
      <Text style={{color:'black', fontSize:15, fontWeight:'bold', alignSelf:'center'}}>Pick your username: {idofme} </Text>
      <TextInput style={styles.inputIDOfMe} value={idofme} onChangeText={(newValue)=>{setidofme(newValue)}}/>
      <View style={{margin:10}}>
        <Button
          title="Set ID"
          onPress={setIdOfMe}
        />
      </View>

    </SafeAreaView>
  );
};

const PrivateScreen = ({navigation, route}) => {
  
  const [ userMsg, setuserMsg] = React.useState("")
  const [user_messages,setuser_messages] = React.useState([])
  const [idofme, setidofme] = React.useState("")

  const msgsviewref = React.useRef(null)
  
  const sendMsgToUser = ()=>{
    AsyncStorage.getItem("idofme").then(
      value => {
        if (value!=null){
          setidofme(value)
          d_publish(d_client, route.params.title+"/"+idofme , userMsg , false)
          d_publish(d_client, idofme+"/"+route.params.title , userMsg , false)
          AsyncStorage.getItem(route.params.title).then(
            value => {
              if (value!=null){
                value = value + "*::*" + userMsg + "/!!/"
                AsyncStorage.setItem(route.params.title,value)          
      
              }else{
                value = "*::*" + userMsg + "/!!/"
                AsyncStorage.setItem(route.params.title,value) 
              }
            }
          )

        }
      }
    )
  }


  React.useEffect(()=>{

    // msgsviewref.current.scrollToEnd()

    AsyncStorage.getItem(route.params.title).then(
      value => {
        if (value!=null){
          // console.log(value)
          value = value.split("/!!/")
          value.pop()
          // console.log(user_messages
          setuser_messages(value)

        }
      }
    )

  },[user_messages])
  
  const textsOfUser = (user_messages.length) ? user_messages.map((item, key)=>{
    return(
      <Text style={(item.includes("*::*"))?styles.meassenderchatview:styles.measrecieverchatview}>{(item.includes("*::*"))? item.substring(4,item.length):item}</Text>
    )
  }
  ): <Text>No Data is available</Text>
  
  navigation.setOptions({ title: route.params.title })
  return(
    <SafeAreaView style={{backgroundColor:'gray'}}>
      <KeyboardAvoidingView behavior="position">
        <ScrollView ref={msgsviewref} style={{height:'88%', margin:3, marginBottom:0, width:'98%'}}>
          
          {/* <Text style={styles.meassenderchatview}>Hello Amirhossein, how you doin?</Text>
          <Text style={styles.measrecieverchatview}>Hey, fine. Are you ready? I'll be there 10 mins later bro!</Text>
          <Text style={styles.measrecieverchatview}>Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG</Text>
          <Text style={styles.measrecieverchatview}>I'm really good at this, no? I can fix this after I chartreg kjs ksd nnjksdfklml lwhfjkhwjk lwkefjk hsmfkwnek;f wl</Text>
          <Text style={styles.meassenderchatview}>Yes you are using your past experience very well! that's great! you can bro! sjkdfsd kjhsdf hgfdjh jhkh sdjfhkknjsdfk jksd</Text>
          <Text style={styles.measrecieverchatview}>Hey, fine. Are you ready? I'll be there 10 mins later bro!</Text>
          <Text style={styles.measrecieverchatview}>Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG</Text>
          <Text style={styles.measrecieverchatview}>Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG</Text>
          <Text style={styles.meassenderchatview}>Yes you are using your past experience very well! that's great! you can bro! sjkdfsd kjhsdf hgfdjh jhkh sdjfhkknjsdfk jksd</Text>
          <Text style={styles.meassenderchatview}>Yes you are using your past experience very well! that's great! you can bro! sjkdfsd kjhsdf hgfdjh jhkh sdjfhkknjsdfk jksd</Text>
          <Text></Text> */}

          
          {textsOfUser}

          <Text></Text>
          


        </ScrollView>

        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10, height:'12%'}}>
          <View style={styles.inputChat}>
            <TextInput style={{fontSize:16, fontWeight:'bold'}} placeholder="Your message..." value={userMsg} onChangeText={newvalue => setuserMsg(newvalue)} multiline={true}/>
          </View>
          <Icon style={{marginLeft: '88%',}} size={40} onPress={()=>sendMsgToUser(userMsg)} type='font-awesome' name="telegram"/>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

const HomeScreen = ({ navigation, route }) => {
  const [idofme, setidofme] = React.useState("")

  d_subscribe_general(d_client)

  React.useEffect(()=>{
    fetchIdOfMe()
  },[])

  const fetchIdOfMe = () =>{
    try{
      AsyncStorage.getItem("idofme").then(
        value => {
          setidofme(value)
        }
      )
    }catch{

    }
  }

  

  const [idtosearch, setidtosearch] = React.useState("Search here..")



  return(
    <SafeAreaView>
      <ScrollView>
      <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
        <TextInput value={idtosearch} onChangeText={newvalue=>setidtosearch(newvalue)} style={styles.input}/>
        <Icon size={35} margin={10} name="search"/>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
        <Text style={styles.HelloHeader}>Messages</Text>
        <Icon raised name='plus' type='font-awesome' color='black' onPress={() => navigation.navigate('Find Friends', ) } />
      </View>

      <View>
        <CartOfMsg navigation={navigation} title="Amirhossein" lastmsg="Hey How you doing today?"/>
        
      </View>
      
      </ScrollView>
    </SafeAreaView>
  );
};

const FindFriendsScreen = ({navigation, route}) => {
  const [idoffriend, setidoffriend] = React.useState("")
  // const [usersData, setUsersData] = React.useState([])
  
  
  const idofusersArray1 = Array.from(idofusers)
  d_subscribe(d_client, "users/#");
  
  const [idofusersArray, setidofusersArray] = React.useState([])
  

  useEffect(()=>{
    setidofusersArray(idofusersArray1)

  },idofusersArray)
  
  
  const usersData = (
    (idofusersArray.length) ? idofusersArray.map((item, key)=>
    
      {
      return(   <CartOfAddFriend navigation={navigation} key={key} title={ item }/> )
      }  
      
    ) 
      : <Text style={{color:'black', textAlign:'center', fontWeight:'bold'}}>No Data</Text>
  ) 
  
  
  

  return(
    <SafeAreaView>
      <Text style={{margin:10, marginBottom:0, fontSize:25, fontWeight:'bold',color:'black' }}>Your Friend ID:</Text>
      <TextInput placeholder="Put ID Here" style={styles.input} value={idoffriend} onChangeText={newvalue => setidoffriend(newvalue)}/>

      <ScrollView>
        {/* <CartOfAddFriend navigation={navigation} title="Amirhossein"/>
        <CartOfAddFriend navigation={navigation} title="Amirmahdi"/> */}
        { usersData }
      </ScrollView>

    </SafeAreaView>
    
  )
}

const SettingScreen = ({navigation, route}) => {

  const [manualbrokerip, setmanualbrokerip] = React.useState("")
  const [manualbrokerport, setmanualbrokerport] = React.useState("")
  

  const [idofme, setidofme] = React.useState("")

  const connectManualToDimQ = () => {
    ToastAndroid.show("Connecting...", ToastAndroid.SHORT)
    connect_to_dimq(manualbrokerip, manualbrokerport)
  }


  React.useEffect(()=>{
    fetchIdOfMe()
  },[])

  const fetchIdOfMe = () =>{
    try{
      AsyncStorage.getItem("idofme").then(
        value => {
          setidofme(value)
        }
      )
    }catch{

    }
  }

  return(
    <SafeAreaView>
      <Text style={{margin:'20%', marginBottom:0, fontSize:15,color:'black' }}>Broker IP:</Text>
      <TextInput style={styles.brokersettinginput} maxLength={15} keyboardType="numeric" value={manualbrokerip} onChangeText={newvalue=>{setmanualbrokerip(newvalue)}}/>
      <Text style={{margin:'2%', marginLeft:'20%', marginBottom:0, fontSize:15,color:'black' }}>Broker Port:</Text>
      <TextInput style={styles.brokersettinginput} maxLength={5} keyboardType="numeric" value={manualbrokerport} onChangeText={newvalue=>{setmanualbrokerport(newvalue)}} />
      <View style={{width:'60%', alignSelf:'center', marginTop:30}}>
        <Button onPress={() => connectManualToDimQ()} title="Connect Manually"/>
      </View>
      <View style={{width:'60%', alignSelf:'center', marginTop:10,}}>
        <Button color="#841584" title="Instead: Connect Auto"/>
      </View>
      <View>
        <Text style={{color:'black', fontWeight:'bold', textAlign:'center', marginTop:'5%'}}>Your ID in DimQ: @{idofme}</Text>
        <Text style={{color:'red', fontWeight:'bold', textAlign:'center'}}>You can't change this.</Text>
      </View>
    </SafeAreaView>
  )

}


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: 'Welcome to DimQ Messenger' }}
        />
        <Stack.Screen name="DimQ Messenger" component={HomeScreen} options={({navigation, route}) => ({
                                                                                                      title:'  DimQ Messenger',
                                                                                                      headerLeft:()=>(
                                                                                                        <Icon type="font-awesome" size={30} name="th"/>),
                                                                                                      headerRight:()=>(
                                                                                                        <Icon  type="font-awesome" size={30} name="cog" onPress={()=>navigation.navigate('Settings')} />),
                                                                                                      headerStyle:{backgroundColor:'white'},

                                                                                                    })} />
        <Stack.Screen name="Find Friends" component={FindFriendsScreen} />
        <Stack.Screen name="Private" component={PrivateScreen} options={{title:'Amirhossein', animation:"slide_from_right"}} />
        <Stack.Screen name="Settings" component={SettingScreen} options={{title:'DimQ Setting', animation:"slide_from_left"}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  disclaimer: {
    marginTop:'30%',
    fontSize: 20,
    color: 'white',
    margin: 10,
    backgroundColor:'red',
    padding:3,
    borderRadius:8
  },
  input: {
    height: 40,
    margin: 12,
    marginRight:0,
    borderWidth: 1,
    padding: 10,
    width: '83%',
    color:'black',
    fontWeight:'bold'
  },
  inputIDOfMe: {
    height: 40,
    margin: 12,
    marginRight:0,
    borderWidth: 1,
    padding: 10,
    width: '83%',
    alignSelf: 'center'
  },
  HelloHeader: {
    fontSize: 30,
    marginLeft:5,
    color: 'black',
    alignSelf: 'center',
  },
  searchButton: {
    width:'20%',
    backgroundColor:'green'
  },
  meassenderchatview:{
    alignSelf:'flex-end',
    fontSize:20,
    margin:10,
    marginRight:5,
    color:'black',
    backgroundColor:'lightseagreen',
    paddingLeft: 5,
    paddingRight: 10,
    borderRadius:5,
    borderTopRightRadius:20
  },
  measrecieverchatview:{
    alignSelf:'flex-start',
    fontSize:20,
    margin:10,
    marginLeft:5,
    color:'black',
    backgroundColor:'deepskyblue',
    paddingLeft: 10,
    paddingRight: 5,
    borderRadius:5,
    borderTopLeftRadius:20
  },
  brokersettinginput: {
    alignSelf:'center',
    fontSize:16,
    color:'black',
    fontWeight:'bold',
    width:'60%',
    borderColor:'black',
    borderWidth:1
  },
  inputChat: {
    marginLeft:10,
    marginRight:0,
    borderRadius: 10,
    maxHeight:200,
    minHeight:70, 
    width: '83%',
    position: "absolute",
    bottom: '55%',
    backgroundColor: 'darkgray',
  }, 
});

export default App;
