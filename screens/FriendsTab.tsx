import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../styles/theme';
import { useFriends } from '../context/FriendsContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { Friend, FriendRequest } from '../utils/types';

export const FriendsTab = () => {
  const { friends, friendRequests, acceptFriendRequest, declineFriendRequest, removeFriend } = useFriends();
  const { user } = useUser();
  const { showToast } = useToast();
  const [permission, requestPermission] = useCameraPermissions();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [username, setUsername] = useState('');

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddByUsername = async () => {
    if (username.trim()) {
      // Mock friend request
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast(`Friend request sent to ${username}`, 'success');
      setUsername('');
      setShowAddModal(false);
    }
  };

  const handleScanQR = async () => {
    if (!permission) {
      // Still loading permissions
      return;
    }

    if (!permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Permission Required', 'Camera permission is required to scan QR codes.');
        return;
      }
    }

    setShowScannerModal(true);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShowScannerModal(false);
    showToast(`Scanned: ${data}`, 'success');
    // In real app, would send friend request based on scanned data
  };

  const handleAcceptRequest = (requestId: string) => {
    acceptFriendRequest(requestId);
    showToast('Friend request accepted!', 'success');
  };

  const handleDeclineRequest = (requestId: string) => {
    declineFriendRequest(requestId);
    showToast('Friend request declined', 'info');
  };

  const handleUnfriend = (friendId: string, friendName: string) => {
    Alert.alert(
      'Unfriend',
      `Are you sure you want to remove ${friendName} from your friends?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unfriend',
          style: 'destructive',
          onPress: () => {
            removeFriend(friendId);
            showToast(`Removed ${friendName} from friends`, 'info');
          },
        },
      ]
    );
  };

  const renderFriendRequest = ({ item }: { item: FriendRequest }) => (
    <Card style={styles.requestCard}>
      <View style={styles.requestRow}>
        <Avatar size="small" name={item.name} imageUri={item.avatarUri} />
        <View style={styles.requestInfo}>
          <Text style={styles.requestName}>{item.name}</Text>
          <Text style={styles.requestUsername}>@{item.username}</Text>
        </View>
        <View style={styles.requestActions}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptRequest(item.id)}
          >
            <Ionicons name="checkmark" size={20} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={() => handleDeclineRequest(item.id)}
          >
            <Ionicons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  const renderFriend = ({ item }: { item: Friend }) => (
    <Card style={styles.friendCard}>
      <View style={styles.friendRow}>
        <Avatar
          size="medium"
          name={item.name}
          imageUri={item.avatarUri}
          status={item.isOnline ? 'online' : 'offline'}
        />
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={styles.friendUsername}>@{item.username}</Text>
          <Text style={styles.friendLocation}>
            {item.location.city}, {item.location.country}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => handleUnfriend(item.id, item.name)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by username"
          icon={<Ionicons name="search" size={20} color={Colors.textSecondary} />}
        />
      </View>

      {/* Add Friend Buttons */}
      <View style={styles.addButtons}>
        <Button
          title="Add by Username"
          variant="secondary"
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        />
        <Button
          title="Scan QR Code"
          onPress={handleScanQR}
          style={styles.addButton}
        />
        <Button
          title="My QR Code"
          variant="text"
          onPress={() => setShowQRModal(true)}
        />
      </View>

      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Pending Requests ({friendRequests.length})
          </Text>
          <FlatList
            data={friendRequests}
            renderItem={renderFriendRequest}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Friends List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Your Friends ({filteredFriends.length})
        </Text>
        <FlatList
          data={filteredFriends}
          renderItem={renderFriend}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Add by Username Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Friend by Username</Text>
            <Input
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              autoCapitalize="none"
              style={styles.modalInput}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={() => setShowAddModal(false)}
                style={styles.modalButton}
              />
              <Button
                title="Send Request"
                onPress={handleAddByUsername}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>My QR Code</Text>
            <View style={styles.qrContainer}>
              <QRCode
                value={user?.username || 'user_qr_code'}
                size={200}
                color={Colors.textPrimary}
                backgroundColor={Colors.white}
              />
            </View>
            <Text style={styles.qrUsername}>@{user?.username}</Text>
            <Button
              title="Close"
              onPress={() => setShowQRModal(false)}
              style={styles.qrButton}
            />
          </View>
        </View>
      </Modal>

      {/* QR Scanner Modal */}
      <Modal
        visible={showScannerModal}
        animationType="slide"
        onRequestClose={() => setShowScannerModal(false)}
      >
        <View style={styles.scannerContainer}>
          {permission?.granted && (
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              onBarcodeScanned={handleBarCodeScanned}
            />
          )}
          <TouchableOpacity
            style={styles.closeScannerButton}
            onPress={() => setShowScannerModal(false)}
          >
            <Ionicons name="close" size={32} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paleBlue,
    padding: Spacing.lg,
  },
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  addButtons: {
    marginBottom: Spacing.xl,
  },
  addButton: {
    marginBottom: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  requestCard: {
    marginBottom: Spacing.md,
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  requestName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  requestUsername: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  requestActions: {
    flexDirection: 'row',
  },
  acceptButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  declineButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendCard: {
    marginBottom: Spacing.md,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  friendName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  friendUsername: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  friendLocation: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  menuButton: {
    padding: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  qrContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  qrUsername: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  qrButton: {
    marginTop: Spacing.md,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: Colors.textPrimary,
  },
  closeScannerButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: Spacing.md,
  },
});
