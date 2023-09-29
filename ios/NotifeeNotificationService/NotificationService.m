//
//  NotificationService.m
//  NotifeeNotificationService
//
//  Created by GoGiants1 on 2023/09/29.
//

#import "NotificationService.h"

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];

    // Modify the notification content here...
    NSMutableDictionary *userInfoDict = [self.bestAttemptContent.userInfo mutableCopy];
    userInfoDict[@"notifee_options"] = [NSMutableDictionary dictionary];
  
    self.bestAttemptContent.userInfo = userInfoDict;
    [NotifeeExtensionHelper populateNotificationContent:request
                                withContent: self.bestAttemptContent
                                withContentHandler:contentHandler];
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    self.contentHandler(self.bestAttemptContent);
}

@end
