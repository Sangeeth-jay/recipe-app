import axios from "axios";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// Sample categories data
import category from "../assets/data/categories.json";
import { Link, router, useLocalSearchParams } from "expo-router";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Store the selected category
  const [meals, setMeals] = useState<any[]>([]); // Store fetched meals
  const [randomMeal, setRandomMeal] = useState<any>(null); // Store a random meal
  const [loading, setLoading] = useState<boolean>(false); // Loading indicator
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query input
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message if search fails

  const params = useLocalSearchParams();

  // Function to fetch meals by category
  const fetchMealsByCategory = async (categoryName: string) => {
    setLoading(true);
    setErrorMessage(null); // Clear any previous errors
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
      );
      setMeals(response.data.meals || []); // Store the meals in the state
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to search meals by name
  const searchMealsByName = async () => {
    if (!searchQuery.trim()) return; // Avoid empty searches
    setLoading(true);
    setErrorMessage(null); // Clear any previous errors
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
      );
      const mealsData = response.data.meals;

      if (mealsData) {
        setMeals(mealsData);
      } else {
        setMeals([]);
        setErrorMessage("No meals found. Try another search.");
      }
    } catch (error) {
      console.error("Error searching meals:", error);
      setErrorMessage("Error fetching search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch random meal on component mount
    const fetchRandomMeal = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/random.php`
        );
        const mealsData = response.data.meals;
        if (mealsData) {
          setRandomMeal(mealsData[0]); // Set the first meal from the random meal array
        } else {
          setRandomMeal(null);
          setErrorMessage("No meals found. Try another search.");
        }
      } catch (error) {
        console.error("Error fetching random meal:", error);
        setErrorMessage("Error fetching random meal. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRandomMeal(); // Call the function to fetch random meal
  }, []);

  // Handle category selection
  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName); // Set the selected category
    fetchMealsByCategory(categoryName); // Fetch meals for the selected category
  };

  // Render the header with categories and search bar
  const renderHeader = () => (
    <>
      <View className="p-5 flex-row justify-between">
        <MaterialIcons name="account-circle" size={42} color="orange" />
        <MaterialIcons name="circle-notifications" size={42} color="orange" />
      </View>
      <View className="p-5 pt-0">
        <Text className="font-semibold text-lg">Hello, {params.uName}!</Text>
        <Text className="font-bold text-3xl">
          Make your own delicious food,{" "}
          <Text className="text-orange-500">right now!</Text>
        </Text>
      </View>

      {/* Search Bar */}
      <View className="bg-gray-100 p-3 mb-2 rounded-full mx-5 flex-row justify-around items-center">
        <TextInput
          placeholder="Search recipe"
          placeholderTextColor={"gray"}
          className="flex-1 text-lg font-semibold text-gray-600 px-2"
          value={searchQuery}
          onChangeText={setSearchQuery} // Capture input from user
        />
        <TouchableOpacity onPress={searchMealsByName}>
          <View className="p-2 bg-white rounded-full">
            <FontAwesome name="search" size={24} color="gray" />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderCategory = () => (
    <>
      {/* Horizontal FlatList for categories */}
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 10,
          marginTop: 10,
          marginBottom: 10,
          gap: 15,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={category}
        keyExtractor={(item) => item.idCategory}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCategoryPress(item.strCategory)} // Handle category selection
            style={{
              backgroundColor:
                selectedCategory === item.strCategory ? "orange" : "white",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <View className="items-center">
              <Image
                source={{ uri: item.strCategoryThumb }}
                className="w-16 h-16 rounded-full"
              />
              <Text className="font-semibold text-gray-500">
                {item.strCategory}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </>
  );

  const handleMealPress = (mealId: string) => {
    router.push({
      pathname: `/[meal]`,
      params: { meal: mealId },
    });
  };

  // Render meal item
  const renderMealItem = ({ item }: { item: any }) => (
    <View className="flex-1 p-4">
      <TouchableOpacity onPress={() => handleMealPress(item.idMeal)}>
        <Image
          source={{ uri: item.strMealThumb }}
          className="h-28 w-42 rounded-sm"
        />
        <Text className="text-center font-semibold text-gray-500 mt-2">
          {item.strMeal}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render random meal item
  const renderRandomMeal = () => (
    randomMeal ? (
      <View className="mt-8">
        <TouchableOpacity onPress={() => handleMealPress(randomMeal.idMeal)}>
          <Image
            source={{ uri: randomMeal.strMealThumb }}
            className="h-full w-42 rounded-sm"
          />
          <Text className="text-center font-semibold text-gray-500 mt-2">
            {randomMeal.strMeal}
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <Text>No random meal available.</Text>
    )
  );

  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      <FlatList
        ListHeaderComponent={renderCategory()}
        data={meals} // Display filtered meals
        keyExtractor={(item) => item.idMeal}
        numColumns={2} // Display meals in two columns
        renderItem={renderMealItem}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="orange" />
          ) : errorMessage ? (
            <Text className="text-center p-5">{errorMessage}</Text>
          ) : (
            <View>{renderRandomMeal()}</View>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;
