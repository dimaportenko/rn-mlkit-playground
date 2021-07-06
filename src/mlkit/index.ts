import {NativeModules} from 'react-native';
const {MLKitModule} = NativeModules;

type Rect = {
  left: number;
  top: number;
  height: number;
  width: number;
};

export type Block = {
  text: string;
  rect: Rect;
  lines: Line[];
};

export type Line = {
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
