import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PushNotifications, Token, PermissionStatus, PushNotificationSchema } from '@capacitor/push-notifications';
import { BehaviorSubject, Observable } from 'rxjs';

export class NotificationService {
    private deviceTokenSubject = new BehaviorSubject<string | null>(null);
    public deviceToken$: Observable<string | null> = this.deviceTokenSubject.asObservable();

    constructor(private http: HttpClient) { }

    /**
     * Main function to initialize and register push notifications.
     */
    public async registerForPush() {
        try {
            let permStatus: PermissionStatus = await PushNotifications.checkPermissions();
            if (permStatus.receive !== 'granted') {
                permStatus = await PushNotifications.requestPermissions();
                if (permStatus.receive !== 'granted') {
                    console.error('User did not grant push notification permissions.');
                    return;
                }
            }

            await PushNotifications.register();
            console.log('Device registered for push.');

            // Set up the listener for the registration token
            PushNotifications.addListener('registration', (token: Token) => {
                console.log('Registration token received:', token.value);
                this.sendTokenToBackend(token.value);
            });

            // Listen for errors
            PushNotifications.addListener('registrationError', (error) => {
                console.error('Registration error:', error);
            });

            // Listen for received notifications
            PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
                console.log('Push received:', notification);
                // Implement logic to show a toast/modal if the app is foregrounded
            });
        } catch (e) {
            console.error('Error during push registration:', e);
        }
    }

    private sendTokenToBackend(token: string) {
    const payload = {
        deviceToken: token,
        platform: 'mobile'
    };
    
    // API endpoint: POST /api/register-token
    this.http.post(`${environment.apiUrl}/register-token`, payload).subscribe({
        next: () => console.log('Token successfully sent to backend.'),
        error: (err) => console.error('Failed to send token to backend:', err)
    });
  }
}