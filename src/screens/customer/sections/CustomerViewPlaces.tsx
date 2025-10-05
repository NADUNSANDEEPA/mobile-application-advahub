import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Linking, Dimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import Badge from "../../../components/Badge/AppBadge";
import { jwtDecode } from "jwt-decode";
import BusinessDetailsCard from "../../../components/BusinessDetailsCard/BusinessDetailsCard";
import FavoriteButton from "../../../components/Form/FavoriteButton";
import { favoritePageStatus } from "../../../services/action/pageService";
import { getItemAsyncStorage } from "../../../utils/AsyncStorageService";
import { USER_TOKEN_CACHINNG_KEY } from "../../../../config";
import NetInfo from "@react-native-community/netinfo";
import { createRecord, openRealm, updateRecord } from "../../../../database/realmService";
import { FavoritePageSchema } from "../../../../database/schema/FavouritePageSchema";



export default function CustomerViewPlaces({ selectedPage }: any) {
  const [userTokenDecoded, setUserTokenDecoded] = useState<any>(null);

  useEffect(() => {
    const loadUserToken = async () => {
      try {
        const userToken = await getItemAsyncStorage(USER_TOKEN_CACHINNG_KEY);
        if (userToken) {
          const decodedUserToken = jwtDecode(userToken);
          setUserTokenDecoded(decodedUserToken);
        }
      } catch (error) {
        console.log("Error decoding token:", error);
      }
    };
    loadUserToken();
  }, []);

  const saveFavoriteStatusToDb = async (pageId: string, businessName: string, isFavorite: boolean) => {
    const state = await NetInfo.fetch();

    if (state.isConnected) {
      //if online save for mogodb
      favoritePageStatus({
        visitorId: userTokenDecoded.user._id,
        visitorEmail: userTokenDecoded.user.email,
        pageId,
        pageTitle: businessName,
        isFavorite,
      })
        .then((res) => {
          console.log("Favorite status saved:", res);
        })
        .catch((err) => {
          console.error("Error saving favorite:", err);
        });
    } else {
      try {
        const realm = await openRealm([FavoritePageSchema]);
        await createRecord(realm, "FavoritePage", {
          pageId,
          pageTitle: businessName,
          isFavorite,
          visitorId: userTokenDecoded.user._id,
          visitorEmail: userTokenDecoded.user.email,
        });
        console.log("Favorite status saved locally in Realm");
        realm.close();
      } catch (error) {
        console.error("Realm error saving favorite locally:", error);
      }
    }
  };


  if (!selectedPage) {
    return (
      <View style={styles.content}>
        <Text style={styles.tabText}>No Business Page Found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        {selectedPage.coverPhoto ? (
          <Image source={{ uri: selectedPage.coverPhoto }} style={styles.coverImage} />
        ) : (
          <View style={[styles.coverImage, { backgroundColor: "#ccc" }]} />
        )}

        {/* Logo overlay */}
        <View style={styles.profileImageContainer}>
          {selectedPage.logo ? (
            <Image source={{ uri: selectedPage.logo }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: "#999" }]} />
          )}
        </View>
      </View>

      {/* Business Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{selectedPage.businessName}</Text>
        <View style={{ marginBottom: 9 }}>
          {selectedPage.category && <Badge label={selectedPage.category} />}
        </View>
        {selectedPage.description && (
          <RenderHTML
            contentWidth={Dimensions.get("window").width - 40}
            source={{ html: selectedPage.description }}
            baseStyle={styles.description}
          />
        )}
        {selectedPage.createdAt && (
          <Text style={styles.meta}>
            Joined on: {new Date(selectedPage.createdAt).toLocaleDateString()}
          </Text>
        )}
      </View>
      <View style={{ alignItems: "center" }}>
        <FavoriteButton
          isFavorite={false}
          onToggle={(newState) => saveFavoriteStatusToDb(selectedPage._id, selectedPage.businessName, newState)}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <View style={styles.divider} />
      </View>


      {/* Contact + Details */}
      <View style={styles.section}>
        <BusinessDetailsCard
          address={selectedPage.address}
          contactNumber={selectedPage.contactNumber}
          email={selectedPage.email}
          operatingHours={selectedPage.operatingHours}
          website={selectedPage.website}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 60,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  coverContainer: {
    position: "relative",
    height: 180,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  profileImageContainer: {
    position: "absolute",
    bottom: -40,
    left: 20,
    borderRadius: 80,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  infoContainer: {
    marginTop: 50,
    marginBottom: 20,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 3,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 5,
    color: "#555",
  },
  meta: {
    fontSize: 13,
    color: "#999",
  },
  section: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detail: {
    fontSize: 15,
    marginBottom: 5,
    color: "#444",
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 4,
    width: "80%"
  }
});
