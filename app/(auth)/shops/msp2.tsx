import { View, StyleSheet, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

const MSP2 = () => {
  const navigation = useNavigation();
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [shopData, setShopData] = useState([]);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const { data, error } = await supabase
          .from("shopDetails")
          .select("*")
          .in("name", ["msp2"]);
        if (error) {
          throw error;
        }
        setShopData(data);
      } catch (error) {
        console.error("Error fetching shop data:", error.message);
      }
    };

    fetchShopData();
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;
    loadFiles();
  }, [isSignedIn]);

  const loadFiles = async () => {
    try {
      const { data } = await supabase.storage.from("vprintFiles").list(userId!);
      if (data) {
        setFiles(data);
      }
    } catch (error) {
      console.error("Error loading files:", error.message);
    }
  };

  const onSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error selecting file:", error.message);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    try {
      console.log("Selected file:", selectedFile);

      const base64 = await FileSystem.readAsStringAsync(selectedFile.uri, {
        encoding: "base64",
      });
      const filePath = isSignedIn
        ? `vprintFiles/${userId}/${selectedFile.name}`
        : `vprintFiles/${selectedFile.name}`;
      const contentType = "application/pdf";

      console.log("Uploading file:", filePath);

      const { error } = await supabase.storage
        .from("vprintFiles")
        .upload(filePath, decode(base64), { contentType });

      if (error) {
        console.error("Error uploading file:", error.message);
      } else {
        console.log("File uploaded successfully");
        loadFiles();
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }

    // updating orders
    try {
      const { data: fileData } = await supabase.storage
        .from("vprintFiles")
        .getPublicUrl(`vprintFiles/${userId}/${selectedFile.name}`);
      const publicUrl = fileData.publicUrl;

      const userdata = {
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName,
        shop: "msp2",
        price: 100,
        pages: 100,
        document_url: publicUrl,
      };
      const { data: insertData, error: insertError } = await supabase
        .from("orders")
        .insert(userdata);

      if (insertError) {
        console.error("Error inserting data:", insertError.message);
      } else {
        console.log("Data inserted successfully:", insertData);
      }
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleGoBack}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <Pressable onPress={handleGoBack}>
          <Text style={styles.smtext}>Back</Text>
        </Pressable>
      </View>
      <Text style={styles.welcomeText}>
        MSP Xerox 1{"\n"}
        <Text variant="labelSmall">Upload your documents</Text>
      </Text>

      {shopData[0]?.isOpen ? (
        <>
          <Button icon="upload" mode="contained" onPress={onSelectFile}>
            Select PDF file
          </Button>
          {selectedFile && (
            <Button
              mode="outlined"
              style={{ marginTop: 10 }}
              onPress={handleUploadFile}
            >
              Done
            </Button>
          )}
          <Button
            mode="outlined"
            style={{ marginTop: 50 }}
            onPress={handleUploadFile}
            icon="cash"
          >
            Pay via RazorPay
          </Button>
        </>
      ) : (
        <Image
          source={{
            uri: "https://png.pngtree.com/png-vector/20221205/ourmid/pngtree-closed-sign-icon-in-gray-color-png-image_6486392.png",
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 20,
    width: "100%",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  smtext: {
    fontWeight: "normal",
    fontSize: 15,
    marginLeft: 10,
  },
});

export default MSP2;
