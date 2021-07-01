/**
 * Created by Dima Portenko on 30.06.2021
 */
import React from 'react';
import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  useWindowDimensions,
  NativeModules,
} from 'react-native';
import {DemoButton, DemoResponse} from './src/components';
import * as ImagePicker from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import { recognizeText } from "./src/mlkit";

export const App = () => {
  const {width} = useWindowDimensions();
  const [response, setResponse] = React.useState<ImagePickerResponse | null>(
    null,
  );

  const onButtonPress = React.useCallback((type, options) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, setResponse);
    } else {
      ImagePicker.launchImageLibrary(options, setResponse);
    }
  }, []);

  const proccessImage = async (uri: string) => {
    const response = await recognizeText(uri);
    console.warn('response ', response);
  };

  React.useEffect(() => {
    if (response) {
      proccessImage(response?.assets?.[0]?.uri!!);
    }
  }, [response]);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, flexDirection: 'column-reverse'}}>
        <View style={{flexDirection: 'row', paddingVertical: 16}}>
          <DemoButton
            key="Take Image"
            onPress={() =>
              onButtonPress('capture', {
                saveToPhotos: true,
                mediaType: 'photo',
                includeBase64: false,
              })
            }>
            {'Take Image'}
          </DemoButton>
          <DemoButton
            key="Select Image"
            onPress={() =>
              onButtonPress('library', {
                // maxHeight: 200,
                // maxWidth: 200,
                selectionLimit: 0,
                mediaType: 'photo',
                includeBase64: false,
              })
            }>
            {'Select Image'}
          </DemoButton>
        </View>
        <View style={{paddingHorizontal: 8}}>
          <DemoResponse>{response}</DemoResponse>
        </View>
        {response?.assets &&
          response?.assets.map(({uri}) => (
            <View key={uri} style={styles.image}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={{width, height: width}}
                source={{uri: uri}}
              />
            </View>
          ))}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    marginVertical: 24,
    alignItems: 'center',
  },
});
