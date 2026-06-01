/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Employee {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ShiftType = '6:00 AM – 2:00 PM' | '8:00 AM – 5:00 PM' | '2:00 PM – 10:00 PM' | '10:00 PM – 6:00 AM';

export type StatusTagType = 'DAY OFF' | 'ABSENT' | 'TRAVEL ORDER' | 'OFFICE ORDER' | 'LEAVE' | 'HOLIDAY';

export interface ShiftAssignment {
  employeeId: string;
  date: string; // YYYY-MM-DD
  shiftType: ShiftType | null;
  statusTag: StatusTagType | null;
  notes?: string;
  updatedAt: string;
}

export interface HRRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  requestType: 'Day-off' | 'Shift change' | 'Schedule change' | 'Leave';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  details: string; // Details e.g., "From 8 AM - 5 PM shift to 6 AM - 2 PM shift for family event"
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}

export interface HRNotification {
  id: string;
  employeeId: string; // Specific employee or "ALL"
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  timestamp: string;
  isRead: boolean;
}

export interface AdminAccount {
  id: string;
  username: string;
  passwordText: string;
  role: 'root' | 'operator';
}

