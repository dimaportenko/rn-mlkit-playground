/**
 * Created by Dima Portenko on 05.07.2021
 */
import React, {useEffect, useState} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import {Block, RecognizeTextResponse} from '../mlkit';

interface ResponseRendererProps {
  response?: RecognizeTextResponse;
  imageSize: Size;
}

export type Size = {
  width: number;
  height: number;
};

export const ResponseRenderer = ({
  response,
  imageSize,
}: ResponseRendererProps) => {
  const [size, setSize] = useState<Size>({width: 0, height: 0});
  const [scale, setScale] = useState<number>(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setSize({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  };

  useEffect(() => {
    if (imageSize.width > 0) {
      setScale(size.width / imageSize.width);
    }
  }, [imageSize, size]);

  return (
    <View
      style={{...StyleSheet.absoluteFillObject, backgroundColor: 'transparent'}}
      onLayout={onLayout}>
      {response?.blocks.map(block => {
        return <BlockComponent block={block} scale={scale} />;
      })}
    </View>
  );
};

type BlockProps = {
  block: Block;
  scale: number;
};

export const BlockComponent = ({block, scale}: BlockProps) => {
  const rect = {
    top: block.rect.top * scale,
    bottom: block.rect.bottom * scale,
    left: block.rect.left * scale,
    right: block.rect.right * scale,
  };

  console.warn('rect', rect);

  return (
    <View
      style={{
        position: 'absolute',
        ...rect,
        borderWidth: 1,
        borderColor: 'red',
      }}
    />
  );
};
