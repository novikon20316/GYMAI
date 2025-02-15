import React, {useEffect} from "react";
import {View, TouchableWithoutFeedback, Text, Pressable, ViewStyle, StyleProp} from "react-native";
import Animated, {
    useSharedValue,
    withSpring,
    useAnimatedStyle,
    interpolate, withRepeat, withTiming,
} from "react-native-reanimated";
import tailwind from "twrnc";
import { useRouter } from "expo-router";
import { Link } from "expo-router";



export default function HomePage() {
    const isMenuOpen = useSharedValue(false);
    const router = useRouter();
    const toggleAnim = useSharedValue(0);
    const menuAnim = useSharedValue(0);
    const rotateValue = useSharedValue(0);
    const squatValue = useSharedValue(0);
    const squatDumbbellValue = useSharedValue(0);
    const historySectionHeight = useSharedValue(0);
    // Calculate today's and next day's date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const todayTimestamp = today.getTime();  // Get timestamp in milliseconds
    const tomorrowTimestamp = tomorrow.getTime();
    const todayDate = today.getDate();
    const tomorrowDate = tomorrow.getDate();
    const dateSharedValue = useSharedValue(todayDate);
    // Animate rotation to simulate waving motion
    rotateValue.value = withRepeat(
        withSpring(20, { stiffness: 100, damping: 10 }),
        -1,
        true
    );
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotateValue.value}deg` }],
    })as ViewStyle);
    // Animate the squat motion (up and down)
    squatValue.value = withRepeat(
        withSpring(10, { stiffness: 100, damping: 10 }),
        -1,
        true
    );
    const animatedSquatStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: squatValue.value }],
    })as ViewStyle);
    squatDumbbellValue.value = withRepeat(
        withSpring(5, { stiffness: 100, damping: 10 }), // Adjust as needed
        -1,
        true
    );
    const animatedDumbbellStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: squatDumbbellValue.value }],
    }) as ViewStyle);
    useEffect(() => {
        if (isMenuOpen.value) {
            squatValue.value = withRepeat(
                withSpring(10, { stiffness: 100, damping: 10 }), // Move up by 10
                -1, // Infinite loop
                true // Reverse the movement after each iteration
            );
            historySectionHeight.value = withRepeat(
                withSpring(100, { stiffness: 100, damping: 10 }), // Change the value for desired height
                -1, // Infinite loop
                true // Reverse the movement after each iteration (expand and collapse)
            );
            dateSharedValue.value = withRepeat(
                withTiming(tomorrowDate, {duration: 1000}),
                -1, // Infinite cycle
                true // Reverse the animation back to today's date
            );
        } else {
            squatValue.value = 0; // Reset to initial position when the menu is closed
            historySectionHeight.value = 0;
            dateSharedValue.value = todayDate;
        }
    }, [isMenuOpen.value]);

    const animatedHistoryStyle = useAnimatedStyle(() => ({
        // Apply translation and opacity animation to the history emoji
        transform: [{ translateY: interpolate(historySectionHeight.value, [0, 100], [0, 10]) }],
        opacity: interpolate(historySectionHeight.value, [0, 100], [0, 1]),
    }) as ViewStyle);
    const springConfig = {
        mass: 1,
        velocity: 0,
        stiffness: 250,
        damping: 45,
    };

    const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value;
    };

    const topLineTransform = useAnimatedStyle(() => ({
        transform: [
            { translateX: -10 },
            { rotate: `${interpolate(toggleAnim.value, [0, 1], [0, 45])}deg` },
            { translateX: interpolate(toggleAnim.value, [0, 1], [10, 12]) },
        ],
    })as ViewStyle);

    const centerLineTransform = useAnimatedStyle(() => ({
        transform: [{ rotate: `${interpolate(toggleAnim.value, [0, 1], [0, -45])}deg` }],
    })as ViewStyle);

    const bottomLineTransform = useAnimatedStyle(() => ({
        transform: [
            { translateX: 10 },
            { rotate: `${interpolate(toggleAnim.value, [0, 1], [0, 45])}deg` },
            { translateX: interpolate(toggleAnim.value, [0, 1], [-10, -12]) },
        ],
    }) as ViewStyle);

    const menuStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: interpolate(menuAnim.value, [0, 1], [-250, 0]) }],
    })as ViewStyle);

    const handlePress = () => {
        toggleAnim.value = toggleAnim.value ? withSpring(0, springConfig) : withSpring(1, springConfig);
        menuAnim.value = menuAnim.value ? withSpring(0, springConfig) : withSpring(1, springConfig);
        toggleMenu()
    };



    return (
        <View style={tailwind.style("flex-1") as ViewStyle}>
            {/* Animated Side Menu */}
            <Animated.View
                style={[
                    tailwind.style("absolute top-0 left-0 h-full w-48 bg-gray-800 pt-24 px-5 rounded-r-lg"),
                    menuStyle,
                ]}>
                <Text style={tailwind.style("text-white text-lg font-bold mb-5") as StyleProp<any>}>Menu</Text>
                <View style={tailwind.style("flex flex-row items-center mb-5") as ViewStyle}>
                    {/* Animated hand emoji */}
                    <Animated.Text
                        style={[
                            tailwind.style("text-white text-3xl"),
                            animatedHistoryStyle // Apply animated style here
                        ]}
                    >
                        📜
                    </Animated.Text>
                    {/* Static text */}
                    <Link href="/HistoryWorkout">
                        <Text style={tailwind.style("text-white text-base ml-2")as StyleProp<any>}>    History</Text>
                    </Link>
                </View>
                <View style={tailwind.style("flex flex-row items-center mb-5") as ViewStyle}>
                    {/* Animated hand emoji */}
                    <Animated.Text
                        style={[
                            tailwind.style("text-white text-3xl"),
                            animatedSquatStyle,animatedDumbbellStyle // Apply animated squat style here
                        ]}
                    >
                        🏋‍♂
                    </Animated.Text>
                    {/* Static text */}
                    <Link href="/StartWorkout">
                        <Text style={tailwind.style("text-white text-base ml-2")as StyleProp<any>}>    Start Workout</Text>
                    </Link>
                </View>
                <View style={tailwind.style("flex flex-row items-center mb-5") as ViewStyle}>
                    <Link href="/PlanWorkout">
                        <Text style={tailwind.style("text-white text-base ml-2") as StyleProp<any>}>  📅      Plan Workout </Text>
                    </Link>
                </View>
                <View style={tailwind.style("flex flex-row items-center mb-5") as ViewStyle}>
                    {/* Animated hand emoji */}
                    <Animated.Text style={[tailwind.style("text-white text-3xl"), animatedStyle]}>
                        👋
                    </Animated.Text>
                    {/* Static text */}
                    <Link href="/">
                        <Text style={tailwind.style("text-white text-base ml-2")as StyleProp<any>}>    Log Out</Text>
                    </Link>
                </View>
            </Animated.View>

            {/* Smaller Animated Hamburger Button */}
            <TouchableWithoutFeedback onPress={handlePress}>
                <View
                    style={tailwind.style(
                        "absolute top-10 left-5 w-12 h-12 bg-white rounded-lg flex justify-center items-center z-50"
                    ) as ViewStyle}
                >
                    <View style={tailwind.style("flex flex-col") as ViewStyle}>
                        <Animated.View style={[tailwind.style("flex flex-row justify-start"), topLineTransform]}>
                            <View style={tailwind.style("h-1 w-4 rounded-md bg-blue-700 mb-1") as ViewStyle} />
                        </Animated.View>

                        <Animated.View
                            style={[tailwind.style("h-1 w-8 rounded-md bg-blue-700"), centerLineTransform]}
                        />

                        <Animated.View
                            style={[tailwind.style("flex flex-row justify-end"), bottomLineTransform]}
                        >
                            <View style={tailwind.style("h-1 w-4 rounded-md bg-blue-700 mt-1") as ViewStyle} />
                        </Animated.View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}