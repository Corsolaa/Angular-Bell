import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-notification-register',
    templateUrl: './notification-register.component.html',
    styleUrls: ['./notification-register.component.scss']
})
export class NotificationRegisterComponent implements OnInit {

    // Data to send to API for testing
    userId: string = 'user-abc-123';
    pushTitle: string = 'Test Notification';
    pushBody: string = 'Your message from the Angular UI.';

    constructor(private notificationService: NotificationService) {
        this.deviceToken$ = this.notificationService.deviceToken$;
    }

    ngOnInit(): void {
        // We don't auto-register; let the user click the button.
    }

    onSubscribeClick(): void {
        this.notificationService.registerForPush();
    }

    onSendTestNotification(): void {
    // API endpoint: POST /api/send-notification
    // In a real app, this would likely be an admin-only endpoint
    const payload = {
        targetUserId: this.userId,
        title: this.pushTitle,
        body: this.pushBody
    };
    
    // TODO: Implement the HTTP POST request to your API to trigger the push
    console.log('Attempting to send test push with payload:', payload);
    // this.http.post(`${environment.apiUrl}/send-notification`, payload).subscribe(...)
  }

}