import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import { Button, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";


const FREQUENCIES = ["daily", "weekly", "monthly"];

type Frequency = (typeof FREQUENCIES)[number];



export default function AddHabitScreen() {

    const router = useRouter();

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [frequency, setFrequency] = useState<Frequency>("daily");
    const { user } = useAuth();
    const [error, setError] = useState<string>("");
    const theme = useTheme();

    const handleSubmit = async () => {

        if (!user) {
            console.error("User not authenticated");
            return;
        }

        try {
            await databases.createDocument(DATABASE_ID, HABITS_COLLECTION_ID, ID.unique(), {
                user_id: user.$id,
                title,
                description,
                frequency,
                streak_count: 0,
                last_completed: new Date().toISOString(),
                created_at: new Date().toISOString(),
            });
            router.back();

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                return;
            }
            setError("An unexpected error occurred while adding the habit.");
        }




    }


    return (
        <View style={styleSheet.container}>

            <TextInput label="Title" mode="outlined" style={styleSheet.input} onChangeText={setTitle} />
            <TextInput label="Description" mode="outlined" style={styleSheet.input} onChangeText={setDescription} />


            <View style={styleSheet.frequencyContainer}>
                <SegmentedButtons
                    value={frequency}
                    onValueChange={(value) => setFrequency(value as Frequency)}
                    buttons={FREQUENCIES.map((freq) => ({
                        value: freq,
                        label: freq.charAt(0).toUpperCase() + freq.slice(1),
                    }))} />
            </View>

            <Button mode="contained" disabled={!title || !description} onPress={handleSubmit}>Add Habit </Button>

            {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}


        </View>
    )
}

const styleSheet = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",

    },
    input: {
        marginBottom: 15

    },
    frequencyContainer: {
        marginBottom: 24,

    },

})