import {Text, TextInput, View, Button, TouchableOpacity,Alert} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {useEffect, useState} from "react";
import { useRouter } from "expo-router";
import api from "@/server/API";



export default function Index() {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = () => {
        if (email && password) {
            if(isValidEmail(email) && isValidPassword(password)) {
                api.UserLogin(email,password).then(()=>{
                    setEmail('');
                    setPassword('');
                    router.push("/HomePage")
                }).catch((err)=>{Alert.alert("error Sign In",err)});
            }else{
                Alert.alert("Email or password are not valid!!", "We dont recognize this email or password.. please check if the email is valid", [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]);
            }
        }else{
            Alert.alert("Ohh No!!", "email or Password are empty.. Please fill the empty slots", [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]);
        }
    }
    useEffect(()=>{
        setEmail("")
        setPassword("")
    },[])
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const isValidPassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
        return passwordRegex.test(password);
    };
    const handRegister = () => {
        router.push("/Register")
    }
    return (
        <View
            style={{
                flex: 0.5,
                justifyContent: "center",
                alignItems: "center",
            }}>

            <ThemedText type="title">Log In!</ThemedText>
            <TextInput
                style={{height: 40, padding: 5, fontSize:20}}
                placeholder="Enter Email"
                onChangeText={newText => setEmail(newText)}
                keyboardType="email-address"
                autoCapitalize="none" // Prevents automatic capitalization
                value={email}
            />
            <TextInput
                style={{height: 40, padding: 5, fontSize:20}}
                placeholder="Enter password"
                onChangeText={newText => setPassword(newText)}
                secureTextEntry={true}
                value={password}
            />


            <Button title="Log In" onPress={handleLogin} />
            <Text style={{fontSize:20}}>
                Not Registered? Click{' '}
                <TouchableOpacity onPress={handRegister}>
                    <Text style={{ color: 'blue', fontSize:20 }}>
                        Register
                    </Text>
                </TouchableOpacity>
            </Text>

        </View>
    );
}