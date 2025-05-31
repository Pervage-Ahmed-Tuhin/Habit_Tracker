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
- **📊 Habit Tracking** - Mark habits as complete and view progress in real-time
- **📈 Streak Visualization** - Track your habit consistency with streak counters
- **🔄 Real-time Updates** - Changes sync instantly across devices
- **📱 Responsive Design** - Beautiful UI that works on any mobile device

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
   - Swipe to complete habits or view more actions

3. **Tracking Progress**
   - View your streaks for all habits
   - Get insights into your habit-forming journey
   - Visualize completion rates and consistency

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
The app allows users to track habits with different frequencies (daily, weekly, monthly) and maintains a streak count to gamify the experience of building good habits.

### Real-time Updates
Using Appwrite's realtime subscriptions, all habit changes synchronize instantly across devices, providing a seamless user experience.

### Secure Authentication
Complete user authentication flow with signup, login, and session management through Appwrite's secure authentication services.

## 🚧 Roadmap

- [ ] Dark mode support
- [ ] Push notifications for habit reminders
- [ ] Social sharing of achievements
- [ ] Analytics dashboard for habit insights
- [ ] Habit categories and tags

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
