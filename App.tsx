import { useState } from 'react';
import { Button, StyleSheet, Text, View, Pressable } from 'react-native';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { writeAudioToFile } from './utils/writeAudioToFile';
import { playFromPath } from './utils/playFromPath';

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: false,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
});

export default function App() {
  const [borderColor, setBorderColor] = useState<'lightgrey' | 'lightgreen'>(
    'lightgrey'
  );
  const [urlPath, setUrlPath] = useState('');
  const { state, startRecognizing, stopRecognizing, destroyRecognizer } =
    useVoiceRecognition();
  const listFiles = async () => {
    try {
      const result = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory!
      );
      if (result.length > 0) {
        const filename = result[0];
        const path = FileSystem.documentDirectory + filename;
        setUrlPath(path);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async () => {
    if (!state.results[0]) return;
    try {
      // fetch the audio
      const audioBlob = await fetchAudio(state.results[0]);
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target && typeof e.target.result === 'string') {
          // [data:audio/mpeg;base64 , ...(actual base64 data)]
          const audioData = e.target.result.split(',')[1];

          // save data
          const path = await writeAudioToFile(audioData);

          // play audio
          setUrlPath(path);
          await playFromPath(path);
          destroyRecognizer();
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Talk GPT</Text>
      <Text style={styles.description}>
        Press and hold this button to record your voice. Release the button to
        send the recording and you'll hear a response.
      </Text>
      <Text style={{ marginVertical: 10, fontSize: 17 }}>Your message:</Text>
      <Pressable
        onPressIn={() => {
          setBorderColor('lightgreen');
          startRecognizing();
        }}
        onPressOut={() => {
          setBorderColor('lightgrey');
          stopRecognizing();
          handleSubmit();
        }}
        style={[styles.button, { borderColor: borderColor }]}
      >
        <Text>Hold to Speak</Text>
      </Pressable>
      <Text style={{ marginVertical: 10, fontSize: 17 }}>
        {JSON.stringify(state, null, 2)}
      </Text>
      <Button
        title='Reply last message'
        onPress={async () => {
          await playFromPath(urlPath);
        }}
      />
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
