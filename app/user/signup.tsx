import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, {useState} from "react";
import { router } from "expo-router";
import axios from "axios";

const signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    } else {
      const response = await axios.post(
        "https://user-api-sangeethjays-projects.vercel.app/api/addUser",
        {
          name: name,
          email: email,
          password: password,
        }
      );
      console.log(response.data);
      Alert.alert("Success", "User created successfully");
      router.push("/user/login");
    }
  };

  return (
    <>
      <View className="flex-1 justify-center items-center bg-orange-500">
        <View className="w-11/12 h-4/6 bg-white rounded-2xl justify-center items-center p-6 shadow-lg">
            <Image
              source={require("../../assets/images/burger.png")}
              className="w-24 h-24"
            />
          <Text className="text-3xl font-bold my-2 text-slate-500">Sign Up</Text>
          <TextInput
            placeholder="Enter Your Name"
            placeholderTextColor={"gray"}
            className="mb-4 w-full bg-neutral-100 border border-orange-100 active:border-orange-500 focus:border-orange-500 rounded-md h-12 px-4 text-neutral-950"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            placeholder="Enter Your Email"
            placeholderTextColor={"gray"}
            className="mb-4 w-full bg-neutral-100 border border-orange-100 active:border-orange-500 focus:border-orange-500 rounded-md h-12 px-4 text-neutral-950"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            placeholder="Enter Password"
            placeholderTextColor={"gray"}
            className="mb-4 w-full bg-neutral-100 border border-orange-100 active:border-orange-500 focus:border-orange-500 rounded-md h-12 px-4 text-neutral-950"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <View className="w-full mb-4">
            <TouchableOpacity
              onPress={handleSignUp}
              className="bg-orange-500 w-full h-12 rounded-md justify-center items-center"
            >
              <Text className="text-white text-xl font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-1">
            <Text>Have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/user/login")}>
              <Text className="text-orange-500">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default signup;
