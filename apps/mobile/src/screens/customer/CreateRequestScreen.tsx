import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useCreateServiceRequest, useHandymanProfile } from '@/hooks/useCustomer';
import { TextInput, Button, Card, ErrorMessage } from '@/components/UI';

interface CreateRequestScreenProps {
  navigation: any;
  route: any;
}

export const CreateRequestScreen: React.FC<CreateRequestScreenProps> = ({
  navigation,
  route,
}) => {
  const handymanId = route.params?.handymanId || '';
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  const { data: handyman } = useHandymanProfile(handymanId);
  const { mutate: createRequest, isPending, error } = useCreateServiceRequest();

  const categories = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Cleaning',
    'HVAC',
  ];

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !category || !scheduledDate) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    createRequest(
      {
        handymanId: handymanId || '',
        category: category.toLowerCase(),
        title,
        description,
        scheduledDate,
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Service request created', [
            { text: 'View Orders', onPress: () => navigation.navigate('Orders') },
          ]);
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Request Service</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {error && <ErrorMessage message={(error as Error).message} />}

        {/* Selected Handyman */}
        {handyman && (
          <Card style={styles.handymanCard}>
            <Text style={styles.label}>Selected Professional</Text>
            <View style={styles.handymanInfo}>
              <View>
                <Text style={styles.handymanName}>{handyman.fullName}</Text>
                <Text style={styles.handymanRate}>${handyman.hourlyRate}/hour</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Category Selection */}
        <Card style={styles.section}>
          <Text style={styles.label}>Service Category *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === cat && styles.categoryButtonTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card>

        {/* Service Title */}
        <Card style={styles.section}>
          <Text style={styles.label}>Service Title *</Text>
          <TextInput
            placeholder="What needs to be fixed?"
            value={title}
            onChangeText={setTitle}
            editable={!isPending}
          />
        </Card>

        {/* Description */}
        <Card style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            placeholder="Provide details about what you need done..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            editable={!isPending}
          />
        </Card>

        {/* Preferred Date */}
        <Card style={styles.section}>
          <Text style={styles.label}>Preferred Date *</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => {
              const today = new Date();
              const formatted = today.toISOString().split('T')[0];
              setScheduledDate(formatted);
            }}
          >
            <Text style={[styles.dateText, scheduledDate ? {} : { color: '#9ca3af' }]}>
              {scheduledDate || 'Select date'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.hint}>Date must be today or later</Text>
        </Card>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSubmit}
            label={isPending ? 'Submitting...' : 'Submit Request'}
            size="large"
            fullWidth
            loading={isPending}
            disabled={isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    padding: 16,
  },
  handymanCard: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
    marginBottom: 16,
  },
  handymanInfo: {
    marginTop: 8,
  },
  handymanName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  handymanRate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  categoryScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#0ea5e9',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  dateText: {
    fontSize: 14,
    color: '#1f2937',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  buttonContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
});
