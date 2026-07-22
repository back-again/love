import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/components/LoginScreen';

export default function App() {
  const [user, setUser] = useState<any>(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {!user ? (
        <LoginScreen onLoginSuccess={(userData) => setUser(userData)} />
      ) : (
        <SafeAreaView style={styles.loggedInContainer}>
          <View style={styles.content}>
            {/* User Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarGlow} />
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatar}
              />
            </View>

            {/* Welcome Text */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>
                반가워요, <Text style={styles.userName}>{user.displayName}</Text>님!
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoEmoji}>🎉</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>로그인에 성공했습니다</Text>
                <Text style={styles.infoSubtitle}>연애오답 메인화면 준비 중입니다.</Text>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Text style={styles.logoutButtonText}>다른 계정으로 로그인하기 (로그아웃)</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loggedInContainer: {
    flex: 1,
    paddingHorizontal: 28,
    paddingVertical: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 24,
  },
  avatarContainer: {
    position: 'relative',
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGlow: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#FF8E7A',
    opacity: 0.15,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#ffebe6',
  },
  welcomeContainer: {
    alignItems: 'center',
    gap: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  userName: {
    color: '#FF8E7A',
  },
  userEmail: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoEmoji: {
    fontSize: 28,
  },
  infoTextContainer: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
  },
  infoSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  logoutButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#f1f5f9',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
