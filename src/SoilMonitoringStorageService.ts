import AsyncStorage from '@react-native-async-storage/async-storage';

// Types definition
export type SoilLog = { 
  date: string; 
  time: string; 
  moisture: number; 
  temperature: number;
  humidity: number;
};

export type SoilData = {
  currentMoisture: number;
  currentTemperature: number;
  currentHumidity: number;
  logs: SoilLog[];
  interval?: string;
};

class SoilMonitoringStorageService {
  private static STORAGE_KEY = '@SoilMonitoringData';

  // Save entire soil monitoring dataset
  static async saveData(data: SoilData): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEY, 
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Error saving soil monitoring data:', error);
    }
  }

  // Load soil monitoring data
  static async loadData(): Promise<SoilData | null> {
    try {
      const storedData = await AsyncStorage.getItem(this.STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error('Error loading soil monitoring data:', error);
      return null;
    }
  }

  // Clear all stored data
  static async clearData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing soil monitoring data:', error);
    }
  }

  // Add a new log entry
  static async addLogEntry(logEntry: SoilLog): Promise<void> {
    try {
      const currentData = await this.loadData();
      if (currentData) {
        const updatedLogs = [logEntry, ...currentData.logs].slice(0, 50);
        await this.saveData({
          ...currentData,
          logs: updatedLogs
        });
      }
    } catch (error) {
      console.error('Error adding log entry:', error);
    }
  }

  // Update current readings
  static async updateCurrentReadings(
    moisture: number, 
    temperature: number, 
    humidity: number
  ): Promise<void> {
    try {
      const currentData = await this.loadData();
      if (currentData) {
        await this.saveData({
          ...currentData,
          currentMoisture: moisture,
          currentTemperature: temperature,
          currentHumidity: humidity
        });
      }
    } catch (error) {
      console.error('Error updating current readings:', error);
    }
  }
}

export default SoilMonitoringStorageService;