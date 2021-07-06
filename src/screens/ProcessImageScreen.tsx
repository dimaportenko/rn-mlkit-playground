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
import {ResponseRenderer, Size} from '../components/ResponseRenderer';

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
  const [size, setSize] = useState<Size>({width: 0, height: 0});
  const uri = route.params.uri;

  console.warn('scale', size.width / (windowWidth || 1));

  useEffect(() => {
    if (uri) {
      proccessImage(uri);
      Image.getSize(uri, (width, height) => {
        setSize({
          width,
          height,
        });
        setAspectRation(height / width);
      });
    }
  }, [uri]);

  const proccessImage = async (url: string) => {
    const response = await recognizeText(url);
    if (response?.blocks) {
      setResponse(response);
    }
    // console.warn('response ', response);
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
        // scale={windowWidth / (size.width || 1)}
        scale={windowWidth / (size.width || 1)}
      />
    </ScrollView>
  );
};
