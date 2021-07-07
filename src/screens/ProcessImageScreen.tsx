/**
 * Created by Dima Portenko on 05.07.2021
 */
import React, {useEffect, useState} from 'react';
import {Image, useWindowDimensions, ScrollView} from 'react-native';
import {
  ProcessImageNavigationProps,
  ProcessImageRouteProps,
} from '../navigation/Navigator';
import {recognizeText, RecognizeTextResponse} from '../mlkit';
import {ResponseRenderer} from '../components/ResponseRenderer';

interface ProcessImageScreenProps {
  navigation: ProcessImageNavigationProps;
  route: ProcessImageRouteProps;
}

export const ProcessImageScreen = ({route}: ProcessImageScreenProps) => {
  const {width: windowWidth} = useWindowDimensions();
  const [aspectRatio, setAspectRation] = useState(1);
  const [response, setResponse] = useState<RecognizeTextResponse | undefined>(
    undefined,
  );
  const uri = route.params.uri;

  useEffect(() => {
    if (uri) {
      proccessImage(uri);
    }
  }, [uri]);

  const proccessImage = async (url: string) => {
    const response = await recognizeText(url);
    if (response?.blocks) {
      setResponse(response);
      setAspectRation(response.height / response.width);
    }
  };

  return (
    <ScrollView style={{flex: 1}}>
      <Image
        source={{uri}}
        style={{width: windowWidth, height: windowWidth * aspectRatio}}
        resizeMode="cover"
      />
      <ResponseRenderer
        response={response}
        scale={windowWidth / (response?.width || 1)}
      />
    </ScrollView>
  );
};
