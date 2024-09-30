import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { router, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

const Index = () => {
  const [loaded, error] = useFonts({
    Lobster: require("../assets/fonts/Lobster-Regular.ttf"),
  });

  const bounceValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.spring(bounceValue, {
          toValue: 1.1,
          friction: 2,
          useNativeDriver: true,
        }),
        Animated.spring(bounceValue, {
          toValue: 1,
          friction: 2,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timeout = setTimeout(() => {
      router.push("/user/login");
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  // Apply font family if loaded
  const textStyle = {
    fontFamily: loaded ? "Lobster" : undefined, // Use Lobster font if loaded
  };

  return (
    <View className="bg-orange-500 flex-1 justify-center items-center">
      <Animated.Image
        source={require("../assets/images/burger.png")}
        className="w-44 h-44"
        style={{
          transform: [{ scale: bounceValue }],
        }}
      />
      <Text
        className="text-6xl font-semibold text-white mt-4"
        style={textStyle}
      >
        Tasty
      </Text>
      <Text className="text-md font-bold text-white">
        Every food has a secrete recipe!
      </Text>
    </View>
  );
};

export default Index;
