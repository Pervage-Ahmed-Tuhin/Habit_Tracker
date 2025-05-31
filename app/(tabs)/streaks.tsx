import { client, COMPLETIONS_COLLECTION_ID, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealtimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit, HabitCompletion } from "@/types/database.type";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Card, Text } from "react-native-paper";


export default function StreaksScreen() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>([]);
    const { user } = useAuth();

    useEffect(() => {



        if (user) {

            const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`

            const habitsSubscription = client.subscribe(habitsChannel,
                (response: RealtimeResponse) => {

                    if (response.events.includes("databases.*.collections.*.documents.*.create")) {
                        console.log("New habit created:", response.payload);
                        fetchHabits(); // Fetch habits again to update the list
                    } else if (response.events.includes("databases.*.collections.*.documents.*.update")) {
                        console.log("Habit updated:", response.payload);
                        fetchHabits(); // Fetch habits again to update the list
                    } else if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
                        console.log("Habit deleted:", response.payload);
                        fetchHabits(); // Fetch habits again to update the list
                    } else {
                        console.log("Unhandled event:", response.events, response.payload);
                    }
                }
            );




            const CompletionsChannel = `databases.${DATABASE_ID}.collections.${COMPLETIONS_COLLECTION_ID}.documents`

            const CompletionsSubscription = client.subscribe(CompletionsChannel,
                (response: RealtimeResponse) => {

                    if (response.events.includes("databases.*.collections.*.documents.*.create")) {
                        console.log("New habit created:", response.payload);
                        fetchCompletions(); // Fetch completions again to update the list
                    }
                }
            );









            // new code above

            fetchHabits();
            fetchCompletions();


            return () => {
                habitsSubscription();
                CompletionsSubscription();
            }



        }

    }, [user]);

    const fetchHabits = async () => {
        try {
            const response = await databases.listDocuments(DATABASE_ID, HABITS_COLLECTION_ID, [

                Query.equal("user_id", user?.$id || ""),

            ]);
            console.log("Habits fetched:", response.documents);
            setHabits(response.documents as Habit[]);

        } catch (error) {
            console.error("Error fetching habits:", error);
        }
    }


    const fetchCompletions = async () => {


        try {
            const response = await databases.listDocuments(DATABASE_ID, COMPLETIONS_COLLECTION_ID, [

                Query.equal("user_id", user?.$id || ""),


            ]);

            const completions = response.documents as HabitCompletion[];
            setCompletedHabits(completions);


        } catch (error) {
            console.error("Error fetching habits:", error);
        }
    }


    interface StreakData {
        streak: number;
        bestStreak: number;
        total: number;
    }


    const getStreakData = (habitId: string): StreakData => {

        const habitCompletions = completedHabits?.filter((c) => c.habit_id === habitId).sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime());

        if (habitCompletions?.length === 0) {
            return {
                streak: 0,
                bestStreak: 0,
                total: 0
            }

        }
        //build the steak data
        let streak = 0;
        let bestStreak = 0;
        let total = habitCompletions.length;
        let lastDate: Date | null = null;
        let currentStreak = 0;
        habitCompletions?.forEach((c) => {
            const date = new Date(c.completed_at);
            if (lastDate) {
                const diff = (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
                if (diff <= 1.5) {
                    currentStreak += 1;
                } else {
                    currentStreak = 1;
                }
            } else {
                currentStreak = 1;

            }
            if (currentStreak > bestStreak) {
                bestStreak = currentStreak;
            }
            streak = currentStreak;
            lastDate = date;
        })

        return { streak, bestStreak, total };

    };


    const habitStreaks = habits.map((habit) => {
        const { streak, bestStreak, total } = getStreakData(habit.$id);
        return { habit, streak, bestStreak, total };
    });


    const rankHabits = habitStreaks.sort((a, b) => b.bestStreak - a.bestStreak);
    console.log("Ranked Habits:", rankHabits);


    const badgeStyles = [styles.badge1, styles.badge2, styles.badge3];

    return (
        <View style={styles.container}>

            <Text style={styles.title} variant="headlineSmall">Habit Streaks</Text>

            {rankHabits.length > 0 && (
                <View style={styles.rankingContainer}>
                    <Text style={styles.rankingTitle}>🥇 Top Streaks</Text>
                    {rankHabits.slice(0, 3).map((item, key) => (
                        <View key={key} style={styles.rankingRow}>
                            <View style={[styles.rankingBadge, badgeStyles[key]]}>
                                <Text style={styles.rankingBadgeText}>{key + 1}</Text>
                            </View>
                            <Text style={styles.rankingHabit}>{item.habit.title}</Text>
                            <Text style={styles.rankingStreak}>{item.bestStreak}</Text>

                        </View>
                    ))}
                </View>
            )}

            {habits.length === 0 ? (
                <View>
                    <Text>No habits yet.Add your first Habit</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {rankHabits.map(({ habit, streak, bestStreak, total }, key) => (
                        <Card key={key} style={[styles.card, key === 0 && styles.firstCard]}>
                            <Card.Content>
                                <Text variant="titleLarge" style={styles.habitTitle}>{habit.title}</Text>
                                <Text variant="bodyMedium" style={styles.habitDescription}>habit.description</Text>
                                <View style={styles.statsRow}>
                                    <View style={styles.statBadge}>
                                        <Text style={styles.statBadgeText}>🔥{streak}</Text>
                                        <Text style={styles.statBadgeLable}>Current</Text>
                                    </View>
                                    <View style={styles.statBadgeGold}>
                                        <Text style={styles.statBadgeText}>🏆{bestStreak}</Text>
                                        <Text style={styles.statBadgeLable}>Best</Text>
                                    </View>
                                    <View style={styles.statBadgeGreen}>
                                        <Text style={styles.statBadgeText}>✔{total}</Text>
                                        <Text style={styles.statBadgeLable}>Total</Text>
                                    </View>
                                </View>
                            </Card.Content>

                        </Card>
                    ))}
                </ScrollView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
    },
    title: {
        fontWeight: "bold",
        fontSize: 27,
        marginBottom: 16,



    },
    card: {
        marginBottom: 18,
        borderRadius: 18,
        backgroundColor: "#fff",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: "#f0f0f0",
    },
    firstCard: {
        borderWidth: 2,
        borderColor: "#7c4dff",

    },
    habitTitle: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 2,
    },
    habitDescription: {

        color: "#6c6c80",
        marginBottom: 8,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
        marginBottom: 12,
    },
    statBadge: {
        backgroundColor: "#fff3e0",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        alignItems: "center",
        minWidth: 60

    },
    statBadgeGold: {
        backgroundColor: "#fffde7",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        alignItems: "center",
        minWidth: 60

    },
    statBadgeGreen: {
        backgroundColor: "#e8f5e9",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        alignItems: "center",
        minWidth: 60

    },
    statBadgeText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#22223b",
    },
    statBadgeLable: {
        fontSize: 12,
        color: "#6c6c80",
    },
    rankingContainer: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,



    },
    rankingTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#7c4dff",
        letterSpacing: 0.5
    },
    rankingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        paddingBottom: 8,
    },
    rankingBadge: {
        width: 30,
        height: 30,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        backgroundColor: "#e0e0e0"
    },
    badge1: {
        backgroundColor: "#ffd700"
    },
    badge2: {
        backgroundColor: "#c0c0c0"
    },
    badge3: {
        backgroundColor: "#cd7f32"
    },
    rankingBadgeText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    rankingHabit: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        fontWeight: "600",
    },
    rankingStreak: {
        fontSize: 16,
        color: "#7c4dff",
        fontWeight: "bold",
        marginLeft: 8,
    }

})