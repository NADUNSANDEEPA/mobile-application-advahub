import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Linking, Dimensions } from "react-native";
import ActivitiesSection from "./components/ActivitiesSection";
import RenderHTML from "react-native-render-html";
import Badge from "../../../components/Badge/AppBadge";
import { jwtDecode } from "jwt-decode";
import QRGenerator from "./components/QRGenerator";
import { BussinessPageProps } from "../../../interface/BussinessPageProps";
import BusinessDetailsCard from "../../../components/BusinessDetailsCard/BusinessDetailsCard";
import { getItemAsyncStorage } from "../../../utils/AsyncStorageService";
import { USER_TOKEN_CACHINNG_KEY } from "../../../../config";

interface BussinessPageMainProps {
  data?: BussinessPageProps;
  isAddButtonCall: () => void;
}

export default function BussinessPage({ data, isAddButtonCall }: BussinessPageMainProps) {
  const [decoded, setDecoded] = useState<any>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await getItemAsyncStorage(USER_TOKEN_CACHINNG_KEY);
        if (token) {
          const decodedToken = jwtDecode(token);
          setDecoded(decodedToken);
        }
      } catch (error) {
        console.log("Error decoding token:", error);
      }
    };
    loadToken();
  }, []);

  if (!data) {
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
        {data.coverPhoto ? (
          <Image source={{ uri: data.coverPhoto }} style={styles.coverImage} />
        ) : (
          <View style={[styles.coverImage, { backgroundColor: "#ccc" }]} />
        )}

        {/* Logo overlay */}
        <View style={styles.profileImageContainer}>
          {data.logo ? (
            <Image source={{ uri: data.logo }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: "#999" }]} />
          )}
        </View>
      </View>

      {/* Business Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{data.businessName}</Text>
        <View style={{ marginBottom: 9 }}>
          {data.category && <Badge label={data.category} />}
        </View>
        {data.description && (
          <RenderHTML
            contentWidth={Dimensions.get("window").width - 40}
            source={{ html: data.description }}
            baseStyle={styles.description}
          />
        )}
        {data.createdAt && (
          <Text style={styles.meta}>
            Joined on: {new Date(data.createdAt).toLocaleDateString()}
          </Text>
        )}
      </View>
      <View style={{ alignItems: "center" }}>
        <View style={styles.divider} />
      </View>

      {/* Contact + Details */}
      <View style={styles.section}>
        <BusinessDetailsCard
          address={data.address}
          contactNumber={data.contactNumber}
          email={data.email}
          operatingHours={data.operatingHours}
          website={data.website}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location QR</Text>
        <QRGenerator />
      </View>

      {/* Activities */}
      <View style={{marginTop:30}}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activities</Text>
          <ActivitiesSection pageId={data._id} onAddPress={isAddButtonCall} decoded={decoded}  />
        </View>
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
    marginTop: 60,
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
    marginTop: 40,
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
