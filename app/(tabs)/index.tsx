import { client, COMPLETIONS_COLLECTION_ID, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealtimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit, HabitCompletion } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";

export default function Index() {
  const { signOut, user } = useAuth();

  const [habits, setHabits] = useState<Habit[]>();
  const [completedHabits, setCompletedHabits] = useState<string[]>();

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});


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
            fetchTodayCompletions(); // Fetch completions again to update the list
          }
        }
      );
      fetchHabits();
      fetchTodayCompletions();
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


  const fetchTodayCompletions = async () => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const response = await databases.listDocuments(DATABASE_ID, COMPLETIONS_COLLECTION_ID, [

        Query.equal("user_id", user?.$id || ""),
        Query.greaterThanEqual("completed_at", today.toISOString()),

      ]);

      const completions = response.documents as HabitCompletion[];
      setCompletedHabits(completions.map(c => c.habit_id));


    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  }


  const isHabitCompleted = (habitId: string) => {
    return completedHabits?.includes(habitId);
  }


  const handleDeleteHabit = async (id: string) => {

    try {
      await databases.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, id);
      console.log("Habit deleted:", id);

    } catch (error) {
      console.error("Error deleting habit:", error);
    }

  }

  const handleCompleteHabit = async (id: string) => {
    if (!user || completedHabits?.includes(id)) return;



    try {
      const currentDate = new Date().toISOString();
      await databases.createDocument(DATABASE_ID, COMPLETIONS_COLLECTION_ID, ID.unique(), {
        habit_id: id,
        user_id: user.$id,
        completed_at: currentDate,

      });
      const habit = habits?.find((h) => h.$id === id);
      if (!habit) return;
      await databases.updateDocument(DATABASE_ID, HABITS_COLLECTION_ID, id, {
        streak_count: habit.streak_count + 1,
        last_completed: currentDate,
      });
      console.log("Habit completed:", id);

    } catch (error) {
      console.error("Error completing habit:", error);
    }

  }


  const renderRightActions = (habitId: string) => (
    <View style={styles.swipeActionRight}>
      {isHabitCompleted(habitId) ?
        <Text style={{color:"#fff"}}>Completed!</Text>:
        <MaterialCommunityIcons name="check-circle-outline" size={32} color={"#fff"} />
      }
    </View>
  )
  const renderLeftActions = () => (
    <View style={styles.swipeActionLeft}>
      <MaterialCommunityIcons name="trash-can-outline" size={32} color={"#fff"} />
    </View>
  )


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Todays Habits</Text>
        <Button mode="text" onPress={signOut} icon={"logout"}>Sign Out</Button>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {habits?.length === 0 ? (

          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No habits yet.Add your first Habit!</Text>
          </View>

        ) : (
          <Surface style={styles.card} elevation={0}>
            {habits?.map((habit, key) => (
              <Swipeable ref={(ref) => {
                swipeableRefs.current[habit.$id] = ref;
              }} key={key} overshootLeft={false} overshootRight={false}
                renderLeftActions={renderLeftActions}
                renderRightActions={() => renderRightActions(habit.$id)}

                onSwipeableOpen={(direction) => {
                  if (direction === "left") {
                    handleDeleteHabit(habit.$id);
                  } else if (direction === "right") {
                    handleCompleteHabit(habit.$id);
                  }
                  swipeableRefs.current[habit.$id]?.close();

                }}>

                <View style={[styles.cardContent, isHabitCompleted(habit.$id) && styles.cardCompletedStyle]}>
                  <Text style={styles.cardTitle}>{habit.title}</Text>
                  <Text style={styles.cardDescription}>{habit.description}</Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.streakBadge}>
                      <MaterialCommunityIcons name="fire" size={18} color={"#ff9800"} />
                      <Text style={styles.streakText}>{habit.streak_count} day streak</Text>
                    </View>
                    <View style={styles.frequencyBadge}>
                      <Text style={styles.frequencyText}>{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</Text>
                    </View>
                  </View>
                </View>
              </Swipeable>
            ))}
          </Surface>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({


  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    elevation: 4

  },
  cardContent: {
    padding: 20,
  },
  cardCompletedStyle: {
    backgroundColor: "#e8f5e9",
    opacity: 0.8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#22223b"
  },
  cardDescription: {
    fontSize: 16,

    marginBottom: 16,
    color: "#6c6c80"
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyBadge: {

    backgroundColor: "#ede7f6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  frequencyText: {

    color: "#7c4dff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    color: "#666666",
    textAlign: "center",
  },
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },
  swipeActionLeft: {

    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,

  },




});