/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
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

var d_client;
var d_on_message;

MQTT.createClient({
  uri: 'mqtt://74.208.35.55:1883',
  clientId: 'from_android'
}).then(function(client) {
    
    client.on('closed', function() {
      console.log('mqtt.event.closed');
    });
  
    client.on('error', function(msg) {
      console.log('mqtt.event.error', msg);
    });
  
    client.on('message', function(msg) {
      d_on_message(msg)
    });
  
    client.on('connect', function() {
      console.log('connected');
      // client.subscribe('ahsefati_1/#', 0);
      client.subscribe('brokers/#', 0);

     
      // client.publish('/data', "test", 0, false);
    });


    client.connect();
    d_client = client
  }).catch(function(err){
    console.log(err);
  });

  const d_subscribe = (idofme) => {
    d_client.subscribe(idofme + "/#",0)
    Alert.alert("Success!" + idofme)
  }

  const d_publish = (idofme, idtopublish, msgtopublish)=> {
    d_client.publish(idtopublish+ "/" + idofme, msgtopublish, 0, false)
    console.log("SENT!")
  }


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
  return (
    <SafeAreaView style={{flexDirection: 'row', backgroundColor:'white', padding:10, margin:5, borderRadius:10, borderColor:'black', borderWidth:1}}>
      <Icon style={{marginLeft:10}} size={50} type='font-awesome' name="telegram"/>
      <View>
        <Text onPress={() => navigation.navigate('Private',)} style={{marginLeft:20, marginTop:'7%', fontSize:20, color:'black', fontWeight:'bold'}}>{title}</Text>
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

const PrivateScreen = ({navigation}) => {
  const msgsviewref = React.useRef(null)

  React.useEffect(()=>{

    msgsviewref.current.scrollToEnd()

  },[])

  return(
    <SafeAreaView style={{backgroundColor:'gray'}}>
      <KeyboardAvoidingView behavior="position">
        <ScrollView ref={msgsviewref} style={{height:'88%', margin:3, marginBottom:0, width:'98%'}}>
          <Text style={styles.meassenderchatview}>Hello Amirhossein, how you doin?</Text>
          <Text style={styles.measrecieverchatview}>Hey, fine. Are you ready? I'll be there 10 mins later bro!</Text>
          <Text style={styles.measrecieverchatview}>Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG</Text>
          <Text style={styles.measrecieverchatview}>I'm really good at this, no? I can fix this after I chartreg kjs ksd nnjksdfklml lwhfjkhwjk lwkefjk hsmfkwnek;f wl</Text>
          <Text style={styles.meassenderchatview}>Yes you are using your past experience very well! that's great! you can bro! sjkdfsd kjhsdf hgfdjh jhkh sdjfhkknjsdfk jksd</Text>
          <Text style={styles.measrecieverchatview}>Hey, fine. Are you ready? I'll be there 10 mins later bro!</Text>
          <Text style={styles.measrecieverchatview}>Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG</Text>
          <Text style={styles.measrecieverchatview}>Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG Looooooooooooong MSG</Text>
          <Text style={styles.meassenderchatview}>Yes you are using your past experience very well! that's great! you can bro! sjkdfsd kjhsdf hgfdjh jhkh sdjfhkknjsdfk jksd</Text>
          <Text style={styles.meassenderchatview}>Yes you are using your past experience very well! that's great! you can bro! sjkdfsd kjhsdf hgfdjh jhkh sdjfhkknjsdfk jksd</Text>
          <Text></Text>
        </ScrollView>
        
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10, height:'12%'}}>
          <View style={styles.inputChat}>
            <TextInput style={{fontSize:16, fontWeight:'bold'}} placeholder="Your message..." multiline={true}/>
          </View>
          <Icon style={{marginLeft: '88%',}} size={40} type='font-awesome' name="telegram"/>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

const HomeScreen = ({ navigation, route }) => {
  const [idofme, setidofme] = React.useState("")


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
        <Icon raised name='plus' type='font-awesome' color='black' onPress={() => navigation.navigate('Find Friends',) } />
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

  return(
    <SafeAreaView>
      <Text style={{margin:10, marginBottom:0, fontSize:25, fontWeight:'bold',color:'black' }}>Your Friend ID:</Text>
      <TextInput placeholder="Put ID Here" style={styles.input} value={idoffriend} onChangeText={newvalue => setidoffriend(newvalue)}/>

      <ScrollView>
        <CartOfAddFriend navigation={navigation} title="Amirhossein"/>
        <CartOfAddFriend navigation={navigation} title="Amirmahdi"/>
        
        
      </ScrollView>

    </SafeAreaView>
    
  )
}

const SettingScreen = ({navigation, route}) => {

  const [manualbrokerip, setmanualbrokerip] = React.useState("")
  const [manualbrokerport, setmanualbrokerport] = React.useState("")
  

  const [idofme, setidofme] = React.useState("")


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
        <Button title="Connect Manually"/>
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


const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    // <SafeAreaView style={backgroundStyle}>
    //   <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
    //   <ScrollView
    //     contentInsetAdjustmentBehavior="automatic"
    //     style={backgroundStyle}>
    //     <Header />
    //     <View
    //       style={{
    //         backgroundColor: isDarkMode ? Colors.black : Colors.white,
    //       }}>
    //       <Section title="Step One">
    //         Edit <Text style={styles.highlight}>App.js</Text> to change this
    //         screen and then come back to see your edits.
    //       </Section>
    //       <Section title="See Your Changes">
    //         <ReloadInstructions />
    //       </Section>
    //       <Section title="Debug">
    //         <DebugInstructions />
    //       </Section>
    //       <Section title="Learn More">
    //         Read the docs to discover what to do next:
    //       </Section>
    //       <LearnMoreLinks />
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
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
    fontSize:16,
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
