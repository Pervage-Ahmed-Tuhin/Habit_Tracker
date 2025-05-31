# 📱 HabitTracker App

<div align="center">
  <img src="assets/images/icon.png" alt="HabitTracker Logo" width="200" />
  
  <p>
    <strong>Track, build, and maintain your daily habits with style</strong>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

## 🌟 Features

- **🔐 User Authentication** - Secure sign-up and login using Appwrite
- **📝 Habit Creation** - Create customized habits with title, description, and frequency
- **📊 Habit Tracking** - Mark habits as complete and monitor your progress
- **📈 Streak Counting** - Track your habit consistency with streak counters
- **🔄 Real-time Updates** - Changes sync instantly across devices
- **💅 Material Design UI** - Clean, modern interface using React Native Paper

## 🛠️ Tech Stack

- **[React Native](https://reactnative.dev/)** - Cross-platform mobile framework
- **[Expo](https://expo.dev/)** - Development platform for React Native
- **[Expo Router](https://docs.expo.dev/routing/introduction/)** - File-based routing
- **[React Native Paper](https://callstack.github.io/react-native-paper/)** - Material design components
- **[Appwrite](https://appwrite.io/)** - Backend-as-a-Service for authentication and database
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** - Native touch and gesture system

## 📱 Usage

1. **Authentication**
   - Sign up for a new account or log in with existing credentials
   - Secure authentication provided by Appwrite

2. **Managing Habits**
   - Create new habits with title, description, and frequency (daily/weekly/monthly)
   - View all your habits on the home screen
   - Swipe to interact with habits

3. **Tracking Progress**
   - View your streaks for all habits
   - Monitor streak consistency
   - See which habits you've completed today

## 📱 App Structure

```
app/
  ├─ _layout.tsx           # Root layout with authentication route guard
  ├─ auth.tsx              # Authentication screen (login/signup)
  ├─ (tabs)/               # Main app tabs
     ├─ _layout.tsx        # Tab navigation layout
     ├─ index.tsx          # Today's habits screen
     ├─ add-habit.tsx      # Add new habit screen
     ├─ streaks.tsx        # Habit streaks visualization
```

## 💡 Key Features Explained

### Habit Tracking
The app allows users to track habits with different frequencies (daily, weekly, monthly) and maintains a streak count to encourage habit formation.

### Real-time Updates
Using Appwrite's realtime subscriptions, habit changes are reflected instantly in the UI, providing a seamless user experience.

### Secure Authentication
Complete user authentication flow with signup, login, and session management through Appwrite's secure authentication services.

## 🚧 Roadmap

- [ ] Dark mode support
- [ ] Habit categories and tags
- [ ] Habit analytics and insights 
- [ ] Export habit data
- [ ] Weekly and monthly habit reports

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Expo](https://expo.dev/) for making React Native development easier
- [Appwrite](https://appwrite.io/) for providing an excellent open-source backend
- [React Native Paper](https://callstack.github.io/react-native-paper/) for beautiful UI components

---

<div align="center">
  <p>Made with ❤️ by TUHIN</p>
  <p>© 2025 HabitTracker App</p>
</div>
