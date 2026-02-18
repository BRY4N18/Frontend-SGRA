/**
 * Student Preferences Models
 * DTOs for notification preferences endpoints
 */

export interface NotificationChannel {
  channelId: number;
  channelName: string;
}

export interface StudentPreference {
  preferenceId: number;
  userId: number;
  channelId: number;
  channelName: string;
  reminderAnticipation: number;
}

export interface SavePreferencePayload {
  notificationChannelId: number;
  anticipationMinutes: number;
}

export interface SavePreferenceResponse {
  message: string;
}

