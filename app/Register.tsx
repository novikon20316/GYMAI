import {
    TextInput,
    View,
    Button,
    Alert,
    TouchableOpacity,
    StyleSheet,
    Text,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {useEffect, useState} from "react";
import { useRouter } from "expo-router";
import api from "@/server/API";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Searchbar } from 'react-native-paper';
import {ListItem} from "react-native-elements";

export default function Register() {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [selectedGym, setSelectedGym] = useState<string | null>(null);
    const [input, setInput] = useState('');

    const data = [
        { id: '1', label: 'Profit' },
        { id: '2', label: 'IconFitness' },
        { id: '3', label: 'HolmesPlace' },
        { id: '4', label: 'Space' },
        { id: '5', label: 'Other' },
    ];

    // Filter and sort the data based on user input
    const filteredData = data
        .filter(item => item.label.toLowerCase().startsWith(input.toLowerCase()))
        .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

    const handleSelect = (item: string) => {
        console.log(item)
        setSelectedGym(item);
    };

    const renderItem = ({ item }: { item: { id: string; label: string } }) => {
        const isSelected = selectedGym === item.label;
        return (
            <TouchableOpacity
                style={[styles.item, isSelected && styles.selectedItem]}
                onPress={() => handleSelect(item.label)}
            >
                <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>{item.label}</Text>
            </TouchableOpacity>
        );
    };

    const handleLogin = () => {
        if (email && userName && password && rePassword ) {
            if(isValidEmail(email) && isValidPassword(password)) {
                if(password === rePassword) {
                    console.log("handle login: " + email + " , " + userName + " , " + password + " , " + selectedGym)
                    api.saveClient(email,userName, password,'Other').then(() => {
                            setEmail('');
                            setUserName("");
                            setPassword('');
                            setRePassword("");
                            setInput("");
                            router.push("/");
                    }).catch((err) => {
                        Alert.alert("error Sign In", err)
                    });
                }else{
                    Alert.alert("2 different Passwords!!", "it seems you wrote 2 different Passwords.. please make them  identical", [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]);
                }
            }else{
                Alert.alert("Email or password are not valid!!", "We dont recognize this email or password.. please check if the email is valid", [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]);
            }
        }else{
            Alert.alert("Ohh No!!", "email or Username or Password or RePassword are empty.. Please fill the empty slots", [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]);
        }
    }
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const isValidPassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
        return passwordRegex.test(password);
    };
    useEffect(()=>{
        setEmail("")
        setUserName("")
        setPassword("")
        setRePassword("")
        setInput("");
    },[])
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,

        },
        text: {
            fontSize: 18,
            marginBottom: 16,
        },
        input: {
            width: '100%',
            padding: 10,
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 20,
            backgroundColor: '#fff', // Set a background color for input
            color: '#222', // Set the text color to black
            fontSize: 16, // Set a readable font size
            fontFamily: 'Arial',
        },
        item: {
            padding: 16,
            backgroundColor: '#f2f2f2',
            marginBottom: 8,
            borderRadius: 8,
        },
        selectedItem: {
            backgroundColor: '#d3d3d3',
        },
        selectedItemText: {
            fontWeight: 'bold',
        },
        itemText: {
            fontSize: 16,
        },
        selectedText: {
            marginTop: 20,
            fontSize: 18,
            color: 'green',
        },
        searchBarContainer: {
            marginBottom: 10,
            height: 70, // Increase height of the search bar
            paddingHorizontal: 10,
            width:'100%',
        },
        searchBarInput: {
            fontSize: 18, // Bigger text inside search bar
        },
        searchBarInputContainer: {
            height: 50, // Increase the height of the text input part
            borderRadius: 25, // Rounded edges
        },
    });
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                extraScrollHeight={100}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ThemedText type="title">Register</ThemedText>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Email"
                        onChangeText={setEmail}
                        value={email}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter user name"
                        onChangeText={setUserName}
                        value={userName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter password"
                        secureTextEntry
                        onChangeText={setPassword}
                        value={password}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter password again to verify"
                        secureTextEntry
                        onChangeText={setRePassword}
                        value={rePassword}
                    />
                    <Searchbar
                        placeholder="Gym you are working in"
                        onChangeText={setSelectedGym}
                        value={input}
                        round
                        lightTheme
                        containerStyle={styles.searchBarContainer}
                        inputStyle={styles.searchBarInput}
                        inputContainerStyle={styles.searchBarInputContainer}
                    />
                    {input && <FlatList
                        data={filteredData}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        keyboardShouldPersistTaps="always"
                    />}
                    {selectedGym && <Text style={styles.selectedText}>You selected: {selectedGym}</Text>}

                    <Button title="Sign Up" onPress={handleLogin} />
                </View>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>

    );
}