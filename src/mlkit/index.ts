import {NativeModules} from 'react-native';
const {MLKitModule} = NativeModules;

type Rect = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type Block = {
  text: string;
  rect: Rect;
  lines: Line[];
};

type Line = {
  text: string;
  rect: Rect;
};

type Response = {
  blocks: Block[];
};

export const recognizeText = (uri: string): Promise<Response | Error> => {
  return MLKitModule.recognizeText(uri);
};
