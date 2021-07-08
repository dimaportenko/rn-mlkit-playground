//
//  RCTMLKit.m
//  TextRecognitionFirebaseML
//
//  Created by Dmytro on 08.07.2021.
//

#import "RCTMLKitModule.h"
#import <React/RCTLog.h>

@implementation RCTMLKitModule

RCT_EXPORT_MODULE(MLKitModule)

RCT_EXPORT_METHOD(recognizeText: (NSString *)uri) {
  RCTLogInfo(@"Here is our uri %@", uri);
}


@end
