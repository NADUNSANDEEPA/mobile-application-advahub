import React, { JSX, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Animated,
    Image,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    NativeSyntheticEvent,
    NativeScrollEvent
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import NetInfo from "@react-native-community/netinfo";
import useCurrentCountry from "../../utils/CurrentCountry";
import { fetchNearestLocations } from "../../services/action/pageService";
import Badge from "../../components/Badge/AppBadge";
import { AdvanturePlaces } from "../../interface/AdventurePlaces";
import { getItemAsyncStorage, saveItemAsyncStorage } from "../../utils/AsyncStorageService";
import { ADVENTURE_PLACES_CACHINNG_KEY } from "../../../config";

export default function Home({ viewPlace }: { viewPlace: (placeData: any) => void }): JSX.Element {
    const { country } = useCurrentCountry();

    const [advanturePlaces, setAdvanturePlaces] = useState<AdvanturePlaces[]>([]);
    const [filteredPlaces, setFilteredPlaces] = useState<AdvanturePlaces[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const fadeAnims = useRef<Record<string, Animated.Value>>({}).current;
    const pageSize = 5;

    const loadAdventurePlaces = async (pageNumber: number) => {
        setLoading(true);
        try {
            const state = await NetInfo.fetch();
            let cachedData: AdvanturePlaces[] = [];

            if (!state.isConnected) {
                const cached = await getItemAsyncStorage(ADVENTURE_PLACES_CACHINNG_KEY);
                if (cached) cachedData = JSON.parse(cached);
                setAdvanturePlaces(cachedData);
                setFilteredPlaces(cachedData.filter(p =>
                    p.businessName.toLowerCase().includes(searchTerm.toLowerCase())
                ));
                setHasMore(false);
                return;
            }

            const response: any = await fetchNearestLocations(
                country.toLowerCase().replace(/\s+/g, ""),
                pageNumber,
                pageSize
            );

            const data: AdvanturePlaces[] = response.data || [];

            if (data.length < pageSize) setHasMore(false);

            setAdvanturePlaces(prev => {
                const ids = new Set(prev.map(a => a._id));
                const newData = data.filter(a => !ids.has(a._id));
                const updated = [...prev, ...newData];
                setFilteredPlaces(updated.filter(p =>
                    p.businessName.toLowerCase().includes(searchTerm.toLowerCase())
                ));
                return updated;
            });

            // Setup fade animations
            data.forEach(item => {
                if (!fadeAnims[item._id]) fadeAnims[item._id] = new Animated.Value(0);
                Animated.timing(fadeAnims[item._id], {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });

            if (pageNumber === 1) {
                await saveItemAsyncStorage(ADVENTURE_PLACES_CACHINNG_KEY, data);
            }
        } catch (error) {
            console.log("Error fetching activities:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadAdventurePlaces(nextPage);
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const paddingToBottom = 20;
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            loadMore();
        }
    };

    // Handle live search
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredPlaces(advanturePlaces);
        } else {
            setFilteredPlaces(
                advanturePlaces.filter(place =>
                    place.businessName.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, advanturePlaces]);

    useEffect(() => {
        setAdvanturePlaces([]);
        setPage(1);
        setHasMore(true);
        loadAdventurePlaces(1);
    }, [country]);

    const renderSkeleton = () => {
        return Array.from({ length: pageSize }).map((_, idx) => (
            <View key={idx} style={styles.skeletonCard}>
                <View style={styles.skeletonImage} />
                <View style={styles.skeletonLineShort} />
                <View style={styles.skeletonLineLong} />
                <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <View style={styles.skeletonBadge} />
                    <View style={styles.skeletonBadge} />
                </View>
            </View>
        ));
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={styles.content}
                onScroll={handleScroll}
                scrollEventThrottle={400}
            >
                <View style={styles.searchContainer}>
                    <Icon name="search-outline" size={20} color="gray" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search..."
                        value={searchTerm}
                        onChangeText={text => setSearchTerm(text)}
                    />
                </View>

                <Text style={styles.sectionTitle}>Explore Places</Text>
                <View style={{ marginBottom: 40 }}>
                    {loading && page === 1
                        ? renderSkeleton()
                        : filteredPlaces.map(item => (
                            <TouchableOpacity key={item._id} onPress={() => viewPlace(item)}>
                                <Animated.View
                                    style={{
                                        ...styles.card,
                                        opacity: fadeAnims[item._id] || new Animated.Value(0),
                                        transform: [
                                            {
                                                translateY:
                                                    (fadeAnims[item._id] || new Animated.Value(0)).interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [20, 0],
                                                    }),
                                            },
                                        ],
                                    }}
                                >
                                    <Image source={{ uri: item.coverPhoto }} style={styles.coverPhoto} />
                                    <Text style={styles.title}>{item.businessName}</Text>
                                    <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
                                    <View style={{ paddingTop: 15, paddingBottom: 6, flexDirection: "row", gap: 5 }}>
                                        <Badge label={item.category} />
                                        <Badge label={item.country} />
                                    </View>
                                </Animated.View>
                            </TouchableOpacity>
                        ))}

                    {loading && page > 1 && <ActivityIndicator size="large" color="#000" style={{ margin: 20 }} />}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(231, 231, 231, 0.4)",
        borderRadius: 25,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(204, 204, 204, 0.3)",
    },
    icon: { marginRight: 8 },
    input: { flex: 1, fontSize: 14 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 8, marginBottom: 8 },
    card: {
        backgroundColor: "rgba(219, 219, 219, 0.4)",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        padding: 8,
    },
    coverPhoto: { width: "100%", height: 150, borderRadius: 8 },
    title: { fontWeight: "bold", fontSize: 16, marginTop: 8 },
    desc: { fontSize: 14, color: "#555", marginTop: 4 },
    skeletonCard: { backgroundColor: "#ddd", borderRadius: 12, marginBottom: 16, padding: 8 },
    skeletonImage: { width: "100%", height: 150, backgroundColor: "#bbb", borderRadius: 8 },
    skeletonLineShort: { width: "40%", height: 14, backgroundColor: "#bbb", marginTop: 8, borderRadius: 4 },
    skeletonLineLong: { width: "80%", height: 14, backgroundColor: "#bbb", marginTop: 4, borderRadius: 4 },
    skeletonBadge: { width: 60, height: 20, backgroundColor: "#bbb", borderRadius: 10, marginRight: 5, marginTop: 8 },
});
