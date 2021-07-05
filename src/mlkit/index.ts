import {NativeModules} from 'react-native';
const {MLKitModule} = NativeModules;

type Rect = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type Block = {
  text: string;
  rect: Rect;
  lines: Line[];
};

type Line = {
  text: string;
  rect: Rect;
};

export type RecognizeTextResponse = {
  blocks: Block[];
};

export const recognizeText = (
  uri: string,
): Promise<RecognizeTextResponse> => {
  return MLKitModule.recognizeText(uri);
};
