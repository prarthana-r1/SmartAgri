// Install the 'mqtt' library before using this code
// npm install mqtt

/*import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { connect } from 'mqtt';

const MQTT_BROKER = 'mqtt://test.mosquitto.org'; // Replace with your broker
const TOPIC = 'test/topic';

const MqttApp = () => {
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');

  useEffect(() => {
    // Connect to the MQTT broker
    const mqttClient = connect(MQTT_BROKER);

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      mqttClient.subscribe(TOPIC, (err) => {
        if (!err) {
          console.log(`Subscribed to topic: ${TOPIC}`);
        } else {
          console.error('Subscription error:', err);
        }
      });
    });

    mqttClient.on('message', (topic, payload) => {
      console.log(`Message received on ${topic}:`, payload.toString());
      setReceivedMessage(payload.toString());
    });

    mqttClient.on('error', (err) => {
      console.error('Connection error:', err);
    });

    mqttClient.on('close', () => {
      console.log('Connection closed');
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient) mqttClient.end();
    };
  }, []);

  const handlePublish = () => {
    if (client && message.trim() !== '') {
      client.publish(TOPIC, message);
      console.log(`Message published: ${message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>React Native MQTT Example</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter message to publish"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Publish Message" onPress={handlePublish} />
      <Text style={styles.received}>Received Message: {receivedMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  received: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default MqttApp;*/
