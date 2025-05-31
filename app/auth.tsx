import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {

    const [isSignup, setIsSignUp] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const router = useRouter();
    const { signUp, signIn } = useAuth();
    const handleAuth = async () => {
        if (!email || !password) {
            setError("Email and Password are required");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }
        setError(null);
        if (isSignup) {
            const erro = await signUp(email, password);
            if (erro) {
                setError(erro);
                return;
            } else {
                const error = await signIn(email, password);
                if (error) {
                    setError(error);
                    return;
                }
                router.replace("/");
            }
        } else {
            const error = await signIn(email, password);
            if (error) {
                setError(error);
                return;
            }
            router.replace("/");
        }
    };

    const handleSwitchMode = () => {
        setIsSignUp((prev) => !prev);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title} variant="headlineMedium">
                    {isSignup ? "Create Account" : "Welcome Back"}
                </Text>
                <TextInput
                    autoCapitalize="none"
                    label="Email"
                    keyboardType="email-address"
                    placeholder="example@gmail.com"
                    mode="outlined"
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                />

                <TextInput
                    autoCapitalize="none"
                    label="Password"
                    secureTextEntry
                    mode="outlined"
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                />
                <Button mode="contained" style={styles.button} onPress={handleAuth}>
                    {isSignup ? "Sign Up" : "Sign In"}
                </Button>

                {error && (
                    <Text style={{ color: theme.colors.error, textAlign: "center" }}>
                        {error}
                    </Text>
                )}

                <Button
                    mode="text"
                    onPress={handleSwitchMode}
                    style={styles.switchModeButton}
                >
                    {isSignup
                        ? "Already have an account? Sign In"
                        : "Don't have an account? Sign Up"}
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5"
    },
    content: {
        flex: 1,
        padding: 1,
        justifyContent: "center",

    },
    title: {
        textAlign: "center",
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,


    },
    button: {
        marginTop: 8

    },
    switchModeButton: {
        marginTop: 16,

    }
});