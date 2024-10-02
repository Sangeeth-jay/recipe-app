import axios from "axios";
import { View, Text, Image, ScrollView, Pressable, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { ActivityIndicator } from "react-native";

const Meal = () => {
  const params = useLocalSearchParams();

  const [meal, setMeal] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [measures, setMeasures] = useState<string[]>([]);

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      setErrorMessage(null); // Clear any previous errors

      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${params.meal}`
        );
        const mealData = response.data.meals;

        if (mealData && mealData.length > 0) {
          setMeal(mealData[0]);

          // Extract ingredients and measures
          const ingredientsList: string[] = [];
          const measuresList: string[] = [];

          for (let i = 1; i <= 20; i++) {
            const ingredient = mealData[0][`strIngredient${i}`];
            const measure = mealData[0][`strMeasure${i}`];

            if (ingredient) {
              ingredientsList.push(ingredient);
            }
            if (measure) {
              measuresList.push(measure);
            }
          }

          setIngredients(ingredientsList);
          setMeasures(measuresList);
        } else {
          setErrorMessage("No meal found. Try another search.");
        }
      } catch (error) {
        console.error("Error: ", error);
        setErrorMessage("An error occurred while fetching the meal.");
      } finally {
        setLoading(false);
      }
    };

    if (params.meal) {
      fetchMeal();
    }
  }, [params.meal]);

  return (
    <>
      <View className="flex-1">
        <View className="bg-orange-500 w-full h-12 p-1 flex-row justify-items-start items-center">

          <TouchableOpacity onPress={() => router.back()}>
            <View className="flex-row gap-2 justify-center items-center">
              <Entypo name="arrow-with-circle-left" size={32} color="white" />
              <Text className="text-white text-xl font-semibold"> Home</Text>
            </View>
          </TouchableOpacity>

        </View>
  
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FFA500" />
            <Text className="text-slate-400 mt-4">Loading meal...</Text>
          </View>
        ) : errorMessage ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500 text-lg">{errorMessage}</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={{ uri: meal?.strMealThumb }}
              className="w-full h-60 my-4"
            />
            <View className="px-2">
              <Text className=" text-2xl font-semibold text-slate-600 text-center">
                {meal?.strMeal}
              </Text>
              <View className="my-2">
                <View className="w-full border-b border-orange-500 mt-2" />
              </View>
  
              {/* Display ingredients and measures */}
              <View>
                <Text className="text-lg font-semibold text-slate-600 underline">
                  Ingredients
                </Text>
                <View className="flex-row justify-around my-4">
                  <View>
                    <Text className="text-md font-semibold text-slate-500 mb-1">
                      Ingredients
                    </Text>
                    {ingredients.map((ingredient, index) => (
                      <Text key={index} className="text-slate-400">
                        {ingredient}
                      </Text>
                    ))}
                  </View>
                  <View>
                    <Text className="text-md font-semibold text-slate-500 mb-1">
                      Measures
                    </Text>
                    {measures.map((measure, index) => (
                      <Text key={index} className="text-slate-400">
                        {measure}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
  
              {/* Display instructions */}
              <View>
                <Text className="text-lg font-semibold text-slate-600 underline my-4">
                  Instructions
                </Text>
                <Text className="text-slate-400 px-2">{meal?.strInstructions}</Text>
              </View>
            </View>
  
            {/* Display Done button */}
            <View className="justify-center items-center my-4">
              <TouchableOpacity
                className="bg-orange-500 w-2/3 h-14 p-4 justify-center items-center rounded-xl"
                onPress={() => router.back()}
              >
                <Text className="text-xl text-white font-bold">Done</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
};

export default Meal;
