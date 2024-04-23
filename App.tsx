import { useState } from 'react';
import { Button, StyleSheet, Text, View, Pressable } from 'react-native';

export default function App() {
  const [borderColor, setBorderColor] = useState<'lightgrey' | 'lightgreen'>(
    'lightgrey'
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Talk GPT</Text>
      <Text style={styles.description}>
        Press and hold this button to record your voice. Release the button to
        send the recording and you'll hear a response.
      </Text>
      <Text style={{ marginVertical: 10, fontSize: 17 }}>Your message:</Text>
      <Pressable
        onPress={() => {
          setBorderColor('lightgreen');
        }}
        onPressOut={() => {
          setBorderColor('lightgrey');
        }}
        style={[styles.button, { borderColor: borderColor }]}
      >
        <Text>Hold to Speak</Text>
      </Pressable>
      <Button title='Reply last message' onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  description: {
    textAlign: 'center',
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 5,
  },
  button: {
    width: '90%',
    padding: 30,
    gap: 10,
    borderWidth: 3,
    alignItems: 'center',
    borderRadius: 10,
  },
});
