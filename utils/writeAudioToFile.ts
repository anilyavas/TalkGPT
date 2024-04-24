import * as FileSytem from 'expo-file-system';

export const writeAudioToFile = async (audioData: string) => {
  const path = FileSytem.documentDirectory + 'temp.mp3';
  await FileSytem.writeAsStringAsync(path, audioData, {
    encoding: FileSytem.EncodingType.Base64,
  });
  return path;
};
