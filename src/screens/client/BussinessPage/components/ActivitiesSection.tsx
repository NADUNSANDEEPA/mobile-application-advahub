import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  Alert,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { activeInactiveActivity, retrieveActivityies } from "../../../../services/action/pageService";
import { Activity } from "../../../../interface/Activity";
import { getItemAsyncStorage, saveItemAsyncStorage } from "../../../../utils/AsyncStorageService";
import { ACTIVITY_CACHINNG_KEY } from "../../../../../config";



interface Props {
  pageId: string;
  onAddPress: () => void;
  decoded?: any;
}

export default function ActivitiesSection({ pageId, onAddPress }: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const fadeAnims = useRef<{ [key: string]: Animated.Value }>({}).current;

  const cacheActivities = async (data: Activity[]) => {
    try {
      const firstFive = data.slice(0, 5);
      await saveItemAsyncStorage(ACTIVITY_CACHINNG_KEY, firstFive);
    } catch (error) {
      console.log("Error caching activities:", error);
    }
  };

  const loadCachedActivities = async () => {
    try {
      const cached = await getItemAsyncStorage(ACTIVITY_CACHINNG_KEY);
      if (cached) {
        const parsed: Activity[] = JSON.parse(cached);
        setActivities(parsed);

        parsed.forEach((item) => {
          if (!fadeAnims[item._id]) fadeAnims[item._id] = new Animated.Value(1);
        });
      }
    } catch (error) {
      console.log("Error loading cached activities:", error);
    }
  };

  const fetchActivities = async (page: number) => {
    const state = await NetInfo.fetch();

    if (!state.isConnected) {
      console.log("Offline mode → loading cached data");
      await loadCachedActivities();
      return;
    }

    try {
      const response = await retrieveActivityies(pageId, page, pageSize);
      if (response.success) {
        const data: Activity[] = response.data.activities || [];
        setActivities(data);
        setTotalPages(response.data.pagination.totalPages || 1);

        cacheActivities(data);

        data.forEach((item) => {
          if (!fadeAnims[item._id]) fadeAnims[item._id] = new Animated.Value(0);
        });

        data.forEach((item, index) => {
          Animated.timing(fadeAnims[item._id], {
            toValue: 1,
            duration: 500 + index * 100,
            useNativeDriver: true,
          }).start();
        });
      } else {
        setActivities([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.log("Error fetching activities:", error);
      await loadCachedActivities();
    }
  };

  useEffect(() => {
    fetchActivities(currentPage);
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const toggleActive = async (activity: Activity) => {
    try {
      const currentStatus = activity.status === "true";
      const res = await activeInactiveActivity(activity._id, !currentStatus);

      if (res.success) {
        setActivities((prev) =>
          prev.map((a) =>
            a._id === activity._id ? { ...a, status: !currentStatus ? "true" : "false" } : a
          )
        );
      } else {
        Alert.alert("Error", res.message || "Failed to update status");
      }
    } catch (error) {
      console.log("Toggle status error:", error);
      Alert.alert("Error", "Could not update status. Try again later.");
    }
  };

  const handleEdit = (activity: Activity) => {
    Alert.alert("Edit", `Edit activity: ${activity.title}`);
  };

  return (
    <View>
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Text style={styles.addButtonText}>+ Add Activity</Text>
      </TouchableOpacity>

      <ScrollView scrollEnabled={false}>
        {activities.length > 0 ? (
          activities.map((item) => (
            <Animated.View
              key={item._id}
              style={[
                styles.activityCard,
                {
                  opacity: fadeAnims[item._id] || new Animated.Value(0),
                  transform: [
                    {
                      translateY: (fadeAnims[item._id] || new Animated.Value(0)).interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Image
                source={{ uri: item.coverPhoto }}
                style={{ width: "100%", height: 150, borderRadius: 8, marginBottom: 10 }}
                resizeMode="cover"
              />
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityDesc}>{item.description}</Text>
              {item.specialInstruction && (
                <Text style={styles.activityDesc}>💡 {item.specialInstruction}</Text>
              )}

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.toggleButton, item.status === "true" ? styles.active : styles.inactive]}
                  onPress={() => toggleActive(item)}
                >
                  <Text style={styles.toggleText}>
                    {item.status === "true" ? "Active" : "Inactive"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))
        ) : (
          <Text style={{ color: "#999", textAlign: "center" }}>No activities yet</Text>
        )}
      </ScrollView>

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity disabled={currentPage === 1} onPress={handlePrev}>
            <Text style={[styles.pageButton, currentPage === 1 && styles.disabled]}>Prev</Text>
          </TouchableOpacity>

          <Text style={styles.pageText}>
            Page {currentPage} of {totalPages}
          </Text>

          <TouchableOpacity disabled={currentPage === totalPages} onPress={handleNext}>
            <Text style={[styles.pageButton, currentPage === totalPages && styles.disabled]}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "rgba(111, 92, 75, 0.4)",
    borderColor: "rgba(111, 92, 75, 0.4)",
    width: "100%",
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    color: "rgba(111, 92, 75, 0.9)",
    fontSize: 15,
    fontWeight: "bold",
  },
  activityCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activityDesc: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  toggleButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
  },
  active: {
    borderColor: "rgba(43, 68, 50, 0.6)",
    backgroundColor: "rgba(43, 68, 50, 0.4)",
  },
  inactive: {
    borderColor: "rgba(135, 11, 11, 0.6)",
    backgroundColor: "rgba(135, 11, 11, 0.4)",
  },
  toggleText: {
    color: "#fff",
    fontWeight: "500",
  },
  editButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "rgba(57, 87, 122, 1)",
    borderRadius: 5,
  },
  editText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  pageButton: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "bold",
  },
  pageText: {
    fontSize: 14,
    color: "#333",
  },
  disabled: {
    color: "#ccc",
  },
});
