import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  TextInput,
  SafeAreaView
} from 'react-native';

interface Interval {
  label: string;
  value: string;
}

const intervals: Interval[] = [
  { label: '10 sec', value: '10s' },
  { label: '1 minute', value: '1min' },
  { label: '2 minutes', value: '2min' },
  { label: '1 Hour', value: '1h' },
  { label: '2 Hours', value: '2h' },
  { label: 'Daily', value: '1d' },
  { label: 'Weekly', value: '1w' },
  { label: 'Monthly', value: '1m' },
];

const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedInterval, setSelectedInterval] = useState<Interval>(intervals[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sensorType, setSensorType] = useState<string>('');
  const [threshold, setThreshold] = useState<number | undefined>(undefined);
  const [configuredSensors, setConfiguredSensors] = useState<any[]>([]);
  const [showConfiguredSensors, setShowConfiguredSensors] = useState(false);

  const handleIntervalSelect = (interval: Interval) => {
    setSelectedInterval(interval);
    setModalVisible(false);
  };

  const handleSensorConfigSubmit = () => {
    if (sensorType && threshold !== undefined) {
      setConfiguredSensors(prev => [...prev, { type: sensorType, threshold }]);
      setSensorType('');
      setThreshold(undefined);
    }
  };

  

  const renderModalItem = ({ item }: { item: Interval }) => (
    <TouchableOpacity 
      style={styles.modalItem} 
      onPress={() => handleIntervalSelect(item)}
    >
      <Text style={styles.modalItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderSensorItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.sensorItem}>
      <View style={styles.sensorItemContent}>
        <Text style={styles.sensorText}>{`Type: ${item.type}, Threshold: ${item.threshold}`}</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => {
            const newSensors = [...configuredSensors];
            newSensors.splice(index, 1);
            setConfiguredSensors(newSensors);
          }}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.sensorConfigSection}>
          <Text style={styles.subtitle}>Configure Sensor</Text>
          <TextInput
            style={styles.input}
            placeholder="Sensor Type (e.g., Soil Moisture)"
            value={sensorType}
            onChangeText={setSensorType}
          />
          <TextInput
            style={styles.input}
            placeholder="Threshold (e.g., 30)"
            keyboardType="numeric"
            value={threshold?.toString()}
            onChangeText={(text) => setThreshold(Number(text))}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={handleSensorConfigSubmit}>
            <Text style={styles.buttonText}>Configure Sensor</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.configSection}>
          <Text style={styles.subtitle}>Configure Sensor Interval</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
            <Text style={styles.dropdownText}>{selectedInterval.label}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => console.log('Interval set')}>
            <Text style={styles.buttonText}>Set Interval</Text>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <FlatList
                data={intervals}
                keyExtractor={(item) => item.value}
                renderItem={renderModalItem}
              />
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>

        <TouchableOpacity 
          style={styles.tertiaryButton} 
          onPress={() => setShowConfiguredSensors(prev => !prev)}
        >
          <Text style={styles.buttonText}>
            {showConfiguredSensors ? "Hide" : "Display"} Configured Sensors
          </Text>
        </TouchableOpacity>

        {showConfiguredSensors && (
          <FlatList
            data={configuredSensors}
            keyExtractor={(item, index) => `${index}`}
            renderItem={renderSensorItem}
            ListEmptyComponent={
              <Text style={styles.noSensorsText}>No sensors configured yet.</Text>
            }
          />
        )}

        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => {
            navigation.navigate('SoilMonitoring', { interval: selectedInterval.value, threshold: threshold});
          }}
        >
          <Text style={styles.navButtonText}>Go to Soil Monitoring</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  container: {
    padding: 20,
    backgroundColor: '#F0F8FF',
  },
  sensorConfigSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  configSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 15,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  dropdown: {
    height: 50,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  tertiaryButton: {
    backgroundColor: '#6C757D',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    justifyContent: 'center',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#D0D0D0',
  },
  modalItemText: {
    fontSize: 18,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#6C757D',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sensorItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  sensorItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sensorText: {
    fontSize: 16,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
  noSensorsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});

export default DashboardScreen;