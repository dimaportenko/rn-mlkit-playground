/**
 * Created by Dima Portenko on 05.07.2021
 */
import React, {useEffect, useState} from 'react';
import {View, Image} from 'react-native';
import {
  ProcessImageNavigationProps,
  ProcessImageRouteProps,
} from '../navigation/Navigator';
import {recognizeText, RecognizeTextResponse} from '../mlkit';
import {ResponseRenderer, Size} from '../components/ResponseRenderer';

interface ProcessImageScreenProps {
  navigation: ProcessImageNavigationProps;
  route: ProcessImageRouteProps;
}

export const ProcessImageScreen = ({route}: ProcessImageScreenProps) => {
  const [response, setResponse] = useState<RecognizeTextResponse | undefined>(
    undefined,
  );
  const [size, setSize] = useState<Size>({width: 0, height: 0});
  const uri = route.params.uri;

  useEffect(() => {
    if (uri) {
      proccessImage(uri);
      Image.getSize(uri, (width, height) => {
        setSize({
          width,
          height,
        });
      });
    }
  }, [uri]);

  const proccessImage = async (url: string) => {
    const response = await recognizeText(url);
    if (response?.blocks) {
      setResponse(response);
    }
    console.warn('response ', response);
  };

  return (
    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
      <Image source={{uri}} style={{width: '100%', height: '100%'}} />
      <ResponseRenderer response={response} imageSize={size} />
    </View>
  );
};
