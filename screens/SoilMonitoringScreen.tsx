import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, ScrollView, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

type RootStackParamList = {
  SoilMonitoring: { interval: string };
};

type SoilMonitoringProps = {
  route: RouteProp<RootStackParamList, 'SoilMonitoring'>;
};

type SoilLog = { 
  date: string; 
  time: string; 
  moisture: number; 
  temperature: number;
  humidity: number;
};

const { width: screenWidth } = Dimensions.get('window');

const SoilMonitoringScreen: React.FC<SoilMonitoringProps> = ({ route }) => {
  const [threshold, setThreshold] = useState<number>(5);
  const [moistureLevel, setMoistureLevel] = useState<number>(25);
  const [temperature, setTemperature] = useState<number>(20);
  const [humidity, setHumidity] = useState<number>(45);
  const [logs, setLogs] = useState<SoilLog[]>([]);
  const [isLogsModalVisible, setLogsModalVisible] = useState<boolean>(false);
  const [isGraphModalVisible, setGraphModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const { interval } = route.params;
    let updateInterval: number;

    switch (interval) {
      case '10s':
        updateInterval = 10000;
        break;
      case '1min':
        updateInterval = 60000;
        break;
      case '2min':
        updateInterval = 120000;
        break;
      case '1h':
        updateInterval = 3600000;
        break;
      case '2h':
        updateInterval = 7200000;
        break;
      case '1d':
        updateInterval = 86400000;
        break;
      case '1w':
        updateInterval = 604800000;
        break;
      default:
        updateInterval = 10000;
    }

    const intervalId = setInterval(() => {
      const newMoisture = Math.floor(Math.random() * (60 - 10 + 1)) + 10;
      const newTemperature = Math.floor(Math.random() * (35 - 15 + 1)) + 15;
      const newHumidity = Math.floor(Math.random() * (70 - 30 + 1)) + 30;

      setMoistureLevel(newMoisture);
      setTemperature(newTemperature);
      setHumidity(newHumidity);

      const newLog: SoilLog = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        moisture: newMoisture,
        temperature: newTemperature,
        humidity: newHumidity
      };

      setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 50));
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [route.params]);

  const renderLogItem = ({ item }: { item: SoilLog }) => {
    const isBelowThreshold = item.moisture < Number(threshold);
    console.log("Moisture:", item.moisture, "Threshold:", threshold, "Below Threshold:", isBelowThreshold);
  
    return (
      <View
        style={[
          styles.logItem,
          isBelowThreshold && styles.logItemBelowThreshold,
        ]}
      >
        <View style={styles.logItemHeader}>
          <Text style={styles.logDate}>{item.date} {item.time}</Text>
        </View>
        <View style={styles.logItemDetails}>
          <Text style={styles.logItemText}>Moisture: {item.moisture}%</Text>
          <Text style={styles.logItemText}>Temperature: {item.temperature}°C</Text>
          <Text style={styles.logItemText}>Humidity: {item.humidity}%</Text>
        </View>
      </View>
    );
  };
  

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#f0f0f0',
    backgroundGradientTo: '#e0e0e0',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#333'
    }
  };
  
  const generateChartData = (key: keyof SoilLog) => ({
    labels: logs.slice(0, 5).map((log, index) => `T-${5-index}`),
    datasets: [{
      data: logs.slice(0, 5).map(log => log[key] as number).reverse()
    }]
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Soil Monitoring</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryMetric}>
          <Text style={styles.metricLabel}>Moisture</Text>
          <Text style={styles.metricValue}>{moistureLevel.toFixed(1)}%</Text>
        </View>
        <View style={styles.summaryMetric}>
          <Text style={styles.metricLabel}>Temperature</Text>
          <Text style={styles.metricValue}>{temperature}°C</Text>
        </View>
        <View style={styles.summaryMetric}>
          <Text style={styles.metricLabel}>Humidity</Text>
          <Text style={styles.metricValue}>{humidity.toFixed(1)}%</Text>
        </View>
      </View>

      <View style={styles.actionButtonContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => setLogsModalVisible(true)}
        >
          <Text style={styles.actionButtonText}>View Logs</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => setGraphModalVisible(true)}
        >
          <Text style={styles.actionButtonText}>Show Graphs</Text>
        </TouchableOpacity>
      </View>

      {/* Logs Modal */}
      <Modal 
        visible={isLogsModalVisible} 
        animationType="slide" 
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Soil Monitoring Logs</Text>
              <TouchableOpacity onPress={() => setLogsModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={logs}
              renderItem={renderLogItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.logsList}
            />
          </View>
        </View>
      </Modal>

      {/* Graphs Modal */}
      <Modal 
        visible={isGraphModalVisible} 
        animationType="slide" 
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Soil Monitoring Graphs</Text>
              <TouchableOpacity onPress={() => setGraphModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.graphsContainer}>
              <View style={styles.graphBox}>
                <Text style={styles.graphBoxTitle}>Moisture Levels</Text>
                <LineChart
                  data={generateChartData('moisture')}
                  width={screenWidth - 80}
                  height={220}
                  yAxisLabel="%"
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
              <View style={styles.graphBox}>
                <Text style={styles.graphBoxTitle}>Temperature</Text>
                <LineChart
                  data={generateChartData('temperature')}
                  width={screenWidth - 80}
                  height={220}
                  yAxisLabel="°C"
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
              <View style={styles.graphBox}>
                <Text style={styles.graphBoxTitle}>Humidity</Text>
                <LineChart
                  data={generateChartData('humidity')}
                  width={screenWidth - 80}
                  height={220}
                  yAxisLabel="%"
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  headerContainer: {
    backgroundColor: '#2c3e50',
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 20,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryMetric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 15,
  },
  actionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: screenWidth - 40,
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  logsList: {
    padding: 15,
  },
  logItem: {
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logItemHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 10,
    marginBottom: 10,
  },
  logDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  logItemDetails: {
    flexDirection: 'column',
  },
  logItemText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
  },
  logItemBelowThreshold: {
    backgroundColor: '#ffcccc', // Light red to indicate an issue
  },
  graphsContainer: {
    padding: 15,
  },
  graphBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  graphBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2c3e50',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});


export default SoilMonitoringScreen;