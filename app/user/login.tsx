import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [message, setMessage] = useState(""); 

  // Fetch user data using email
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `https://user-api-sangeethjays-projects.vercel.app/api/getuser/${email}`
      );
      return response.data; 
    } catch (error) {
      console.error("Error fetching user:", error);
      return null; 
    }
  };

  // Handle form submission 
  const handleSubmit = async () => {
    if (!email || !password) {
      setMessage("Please fill in all fields");
      Alert.alert("Error", "Please fill in all fields"); 
      return;
    }

    const user = await fetchUser(); 

    if (user) {
      // Check if the password matches the user's password
      if (user.password === password) {
        setMessage("Login successful!");
        Alert.alert("Success", "Login successful!");
        router.push({
          pathname: `/home`,
          params: { uName: user.name },
        });
      } else {
        setMessage("Incorrect password.");
        Alert.alert("Error", "Incorrect password.");
      }
    } else {
      setMessage("User not found.");
      Alert.alert("Error", "User not found.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-orange-500">
      <View className="w-11/12 h-2/3 bg-white rounded-2xl justify-center items-center p-6 shadow-lg">
        <Image
          source={require("../../assets/images/burger.png")}
          className="w-24 h-24"
        />
        <Text className="text-3xl font-bold my-2 text-slate-500">Login</Text>

        <TextInput
          placeholder="Enter Email"
          placeholderTextColor={"gray"}
          className="mb-4 w-full bg-neutral-100 border border-orange-100 active:border-orange-500 focus:border-orange-500 rounded-md h-12 px-4 text-neutral-950"
          onChangeText={(text) => setEmail(text)} 
          value={email} 
        />

        <TextInput
          placeholder="Enter Password"
          placeholderTextColor={"gray"}
          className="mb-4 w-full bg-neutral-100 border border-orange-100 active:border-orange-500 focus:border-orange-500 rounded-md h-12 px-4 text-neutral-950"
          secureTextEntry 
          onChangeText={(text) => setPassword(text)} 
          value={password} 
        />

        <TouchableOpacity
          onPress={handleSubmit} 
          className="bg-orange-500 w-full h-12 rounded-md justify-center items-center"
        >
          <Text className="text-white text-xl font-bold">Login</Text>
        </TouchableOpacity>

        <View className="flex-row gap-1 mt-4">
          <Text>Need an account?</Text>
          <TouchableOpacity onPress={() => router.push("/user/signup")}>
            <Text className="text-orange-500">Create New</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
