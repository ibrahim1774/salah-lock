#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PoseDetectionModule, NSObject)

RCT_EXTERN_METHOD(analyzePose:(NSString *)imageUri resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(classifyImage:(NSString *)imageUri resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
