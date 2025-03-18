import { icons } from "@/constants/icons";
import React from "react";
import { Image, SafeAreaView, Text, View } from "react-native";

export default function Profile() {
	return (
		<SafeAreaView className="bg-primary flex-1 px-10">
			<View className="flex justify-center items-center flex-1 flex-col gap-5">
				<Image source={icons.person} className="size-10" tintColor="#fff" />
				<Text className="text-gray-500 text-base">Profile</Text>
			</View>
		</SafeAreaView>
	);
}
