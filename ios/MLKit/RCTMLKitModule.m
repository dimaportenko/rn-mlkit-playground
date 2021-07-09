//
//  RCTMLKit.m
//  TextRecognitionFirebaseML
//
//  Created by Dmytro on 08.07.2021.
//

#import "RCTMLKitModule.h"
#import <React/RCTLog.h>

@import MLKit;

@implementation RCTMLKitModule

RCT_EXPORT_MODULE(MLKitModule)

- (NSMutableDictionary *)getRectDictionairyFromFrame:(CGRect) frame {
  NSMutableDictionary *blockRectDict = [NSMutableDictionary dictionary];
  [blockRectDict setValue:[NSNumber numberWithFloat:frame.origin.x] forKey:@"left"];
  [blockRectDict setValue:[NSNumber numberWithFloat:frame.origin.y] forKey:@"top"];
  [blockRectDict setValue:[NSNumber numberWithFloat:frame.size.width] forKey:@"width"];
  [blockRectDict setValue:[NSNumber numberWithFloat:frame.size.height] forKey:@"height"];
  
  return blockRectDict;
}

RCT_EXPORT_METHOD(recognizeText: (NSString *)uri
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"Here is our uri %@", uri);
  
  NSURL *url = [NSURL URLWithString:uri];
  NSData *imageData = [NSData dataWithContentsOfURL:url];
  
  UIImage *image = [UIImage imageWithData:imageData];
  
  MLKVisionImage *visionImage = [[MLKVisionImage alloc] initWithImage:image];
  visionImage.orientation = image.imageOrientation;
  
  MLKTextRecognizer *textRecognizer = [MLKTextRecognizer textRecognizer];
  
  [textRecognizer processImage:visionImage
                    completion:^(MLKText *_Nullable result,
                                 NSError *_Nullable error) {
    if (error != nil || result == nil) {
      // Error handling
      reject(@"recognize_fail", @"Image text recognition is failed", nil);

      return;
    }
    // Recognized text
//    NSString *resultText = result.text;
    NSMutableDictionary *response = [NSMutableDictionary dictionary];
    [response setValue:[NSNumber numberWithFloat:image.size.width] forKey:@"width"];
    [response setValue:[NSNumber numberWithFloat:image.size.height] forKey:@"height"];
    
    NSMutableArray *blocks = [NSMutableArray array];
    
    for (MLKTextBlock *block in result.blocks) {
      NSMutableDictionary *blockDict = [NSMutableDictionary dictionary];
      [block setValue:block.text forKey:@"text"];
      [blockDict setValue:[self getRectDictionairyFromFrame:(CGRect)block.frame] forKey:@"rect"];
      
      NSMutableArray *lines = [NSMutableArray array];

      for (MLKTextLine *line in block.lines) {
        NSMutableDictionary *lineDict = [NSMutableDictionary dictionary];
        [lineDict setValue:line.text forKey:@"text"];
        [lineDict setValue:[self getRectDictionairyFromFrame:line.frame] forKey:@"rect"];
        
        [lines addObject:lineDict];
      }
      
      [blockDict setValue:lines forKey:@"lines"];
      [blocks addObject:blockDict];
    }

    [response setValue:blocks forKey:@"blocks"];
    resolve(response);
  }];
  
  RCTLogInfo(@"Image %@", image);
  
}


@end
