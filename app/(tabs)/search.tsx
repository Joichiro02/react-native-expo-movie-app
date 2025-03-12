import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Search() {
	const [searchQuery, setSearchQuery] = useState("");
	const {
		data: movies,
		refetch: loadMovies,
		loading: moviesLoading,
		error: moviesError,
		reset,
	} = useFetch(() => fetchMovies({ query: searchQuery }), false);

	// Debounced search effect
	useEffect(() => {
		const timeoutId = setTimeout(async () => {
			if (searchQuery.trim()) {
				await loadMovies();
			} else {
				reset();
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchQuery]);

	useEffect(() => {
		// Call updateSearchCount only if there are results
		if (movies?.length! > 0 && movies?.[0]) {
			updateSearchCount(searchQuery, movies[0]);
		}
	}, [movies]);

	return (
		<View className="flex-1 bg-primary">
			<Image
				source={images.bg}
				className="flex-1 absolute w-full z-0"
				resizeMode="cover"
			/>

			<FlatList
				data={movies}
				renderItem={({ item }) => <MovieCard {...item} />}
				keyExtractor={(item) => item.id.toString()}
				numColumns={3}
				className="px-5"
				columnWrapperStyle={{
					justifyContent: "center",
					gap: 16,
					marginVertical: 16,
				}}
				contentContainerStyle={{ paddingBottom: 100 }}
				ListHeaderComponent={
					<>
						<View className="w-full flex-row items-center justify-center mt-20">
							<Image
								source={icons.logo}
								className="w-12 h-10"
								resizeMode="contain"
							/>
						</View>

						<View className="my-5">
							<SearchBar
								placeholder="Search movies..."
								value={searchQuery}
								onChangeText={(text: string) => setSearchQuery(text)}
							/>
						</View>

						{moviesLoading && (
							<ActivityIndicator size="large" color="#0000FF" />
						)}

						{moviesError && (
							<Text className="text-red-500 px-5 my-3">
								Error: {moviesError.message}
							</Text>
						)}

						{!moviesLoading &&
							!moviesError &&
							searchQuery.trim() &&
							movies?.length > 0 && (
								<Text className="text-xl text-white font-bold">
									Search Result for{" "}
									<Text className="text-accent">{searchQuery}</Text>
								</Text>
							)}
					</>
				}
				ListEmptyComponent={
					!moviesLoading && !moviesError ? (
						<View className="mt-10 px-5">
							<Text className="text-center text-gray-500 text-lg font-bold">
								{searchQuery.trim() ? (
									<>
										No movies found for{" "}
										<Text className="text-accent">{searchQuery}</Text>{" "}
									</>
								) : (
									"Search for a movies"
								)}
							</Text>
						</View>
					) : null
				}
			/>
		</View>
	);
}
