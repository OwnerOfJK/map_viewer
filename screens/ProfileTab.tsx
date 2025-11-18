import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from '../components/Avatar';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Colors, FontSizes, FontWeights, Spacing } from '../styles/theme';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { VALIDATION } from '../utils/constants';

export const ProfileTab = () => {
  const { user, updateProfile } = useUser();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleChangePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to change your photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateProfile({ avatarUri: result.assets[0].uri });
      showToast('Profile photo updated!', 'success');
    }
  };

  const handleSave = async () => {
    if (name.length < VALIDATION.MIN_NAME_LENGTH || name.length > VALIDATION.MAX_NAME_LENGTH) {
      showToast(
        `Name must be between ${VALIDATION.MIN_NAME_LENGTH} and ${VALIDATION.MAX_NAME_LENGTH} characters`,
        'error'
      );
      return;
    }

    if (bio.length > VALIDATION.MAX_BIO_LENGTH) {
      showToast(`Bio must be less than ${VALIDATION.MAX_BIO_LENGTH} characters`, 'error');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    updateProfile({ name, bio });
    showToast('Profile updated successfully!', 'success');
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <Avatar
          imageUri={user?.avatarUri}
          size="large"
          name={user?.name}
        />
        <TouchableOpacity onPress={handleChangePhoto}>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          style={styles.input}
        />

        <Text style={styles.label}>Username</Text>
        <Input
          value={user?.username || ''}
          onChangeText={() => {}}
          placeholder="Username"
          editable={false}
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <Input
          value={user?.email || ''}
          onChangeText={() => {}}
          placeholder="Email"
          editable={false}
          style={styles.input}
        />

        <Text style={styles.label}>Bio</Text>
        <Input
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about yourself..."
          multiline
          style={styles.input}
        />
        <Text style={styles.charCount}>
          {bio.length}/{VALIDATION.MAX_BIO_LENGTH}
        </Text>
      </View>

      <Button
        title="Save Changes"
        onPress={handleSave}
        loading={loading}
        style={styles.saveButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paleBlue,
  },
  content: {
    padding: Spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  changePhotoText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.secondaryBlue,
    fontWeight: FontWeights.semibold,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  input: {
    marginBottom: Spacing.lg,
  },
  charCount: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: -Spacing.md,
    marginBottom: Spacing.lg,
  },
  saveButton: {
    marginTop: Spacing.lg,
  },
});
