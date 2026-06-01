/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Employee, ShiftAssignment, HRRequest, HRNotification, ShiftType, StatusTagType, AdminAccount } from './types';

export const SEED_EMPLOYEES: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'GIDDEL MACALIPAY', isActive: true },
  { name: 'JAROLD LEE LUZADAS', isActive: true },
  { name: 'MARVIN RIVERO', isActive: true },
  { name: 'LEANDRO VALIDO', isActive: true },
  { name: 'GLENIEL PIONILLA', isActive: true },
  { name: 'GERSON MENDOZA', isActive: true },
  { name: 'JERONCIUS LABIAL', isActive: true },
  { name: 'JACK KIRBY UY', isActive: true },
  { name: 'JAGER MIK AGUILA', isActive: true },
  { name: 'JERSON AMBAL', isActive: true },
  { name: 'MARK ANCEL GUTIERREZ', isActive: true },
  { name: 'JONH WILFRED ZARSUELO', isActive: true },
  { name: 'KENT SIMOUNE PIÑOL', isActive: true },
  { name: 'JULIE ALVAREZ', isActive: true },
  { name: 'MARK REGIO', isActive: true },
  { name: 'KENT PIÑOL', isActive: true },
  { name: 'MARK GUTIERREZ', isActive: true },
  { name: 'JACK UY', isActive: true },
  { name: 'JERSON AMBAL', isActive: true },
  { name: 'JONH ZARSUELO', isActive: true },
  { name: 'CARL ANDRE NOCUM', isActive: true },
  { name: 'ANGELO ALBAÑO', isActive: true },
  { name: 'JOHN PAUL PORTE', isActive: true },
  { name: 'JHON JOVERICK SOGOCIO', isActive: true },
  { name: 'ANGELO MARTINEZ', isActive: true },
  { name: 'MARY GRACE DIMATULAC', isActive: true },
];

export const SHIFT_HOURS: Record<ShiftType, string> = {
  '6:00 AM – 2:00 PM': '6:00 AM – 2:00 PM',
  '8:00 AM – 5:00 PM': '8:00 AM – 5:00 PM',
  '2:00 PM – 10:00 PM': '2:00 PM – 10:00 PM',
  '10:00 PM – 6:00 AM': '10:00 PM – 6:00 AM',
};

// Procedural generator to mimic shift patterns seen in the user reference image
export function generateEmployeeShiftPattern(
  empName: string,
  dayIndex: number,
  dayOfWeek: number // 0 = Sun, 1 = Mon, ..., 6 = Sat
): { shift: ShiftType | null; status: StatusTagType | null } {
  // 1-based day index for simpler comparison with image
  const day = dayIndex;

  // Let's match the reference image exactly for key employees (Days 1 to 19, March 2026)
  if (empName === 'GIDDEL MACALIPAY' || empName === 'JAROLD LEE LUZADAS') {
    return { shift: '8:00 AM – 5:00 PM', status: null };
  }

  if (empName === 'MARVIN RIVERO' || empName === 'LEANDRO VALIDO') {
    if (day >= 1 && day <= 3) return { shift: '10:00 PM – 6:00 AM', status: null };
    if (day >= 4 && day <= 5) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day >= 6 && day <= 10) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day >= 11 && day <= 17) return { shift: '10:00 PM – 6:00 AM', status: null };
    if (day >= 18 && day <= 24) return { shift: '2:00 PM – 10:00 PM', status: null };
    return { shift: '6:00 AM – 2:00 PM', status: null };
  }

  if (empName === 'GLENIEL PIONILLA') {
    if (day === 1) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day >= 2 && day <= 3) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day >= 4 && day <= 5) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day >= 6 && day <= 7) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day >= 8 && day <= 10) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day >= 11 && day <= 17) return { shift: '10:00 PM – 6:00 AM', status: null };
    if (day >= 18 && day <= 19) return { shift: '2:00 PM – 10:00 PM', status: null };
    return { shift: '8:00 AM – 5:00 PM', status: null };
  }

  if (empName === 'GERSON MENDOZA') {
    if (day >= 1 && day <= 3) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day === 4) return { shift: null, status: 'DAY OFF' };
    if (day >= 5 && day <= 10) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day >= 11 && day <= 17) return { shift: '10:00 PM – 6:00 AM', status: null };
    if (day >= 18 && day <= 19) return { shift: '2:00 PM – 10:00 PM', status: null };
    return { shift: '8:00 AM – 5:00 PM', status: null };
  }

  if (empName === 'JERONCIUS LABIAL') {
    if (day >= 1 && day <= 2) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day === 3) return { shift: null, status: 'DAY OFF' };
    if (day >= 4 && day <= 5) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day === 6) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day === 7) return { shift: null, status: 'DAY OFF' };
    if (day >= 8 && day <= 10) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day >= 11 && day <= 17) return { shift: '10:00 PM – 6:00 AM', status: null };
    if (day >= 18 && day <= 19) return { shift: '2:00 PM – 10:00 PM', status: null };
    return { shift: '8:00 AM – 5:00 PM', status: null };
  }

  if (empName === 'JACK KIRBY UY') {
    if (day >= 1 && day <= 3) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day >= 4 && day <= 5) return { shift: '10:00 PM – 6:00 AM', status: null };
    if (day === 6) return { shift: null, status: 'DAY OFF' };
    if (day >= 7 && day <= 10) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day === 11) return { shift: null, status: 'DAY OFF' };
    if (day >= 12 && day <= 16) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day === 17) return { shift: null, status: 'DAY OFF' };
    if (day >= 18 && day <= 19) return { shift: '10:00 PM – 6:00 AM', status: null };
    return { shift: '8:00 AM – 5:00 PM', status: null };
  }

  if (empName === 'JAGER MIK AGUILA') {
    if (day === 1) return { shift: null, status: 'DAY OFF' };
    if (day >= 2 && day <= 3) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day >= 4 && day <= 5) return { shift: '10:00 PM – 6:00 AM', status: null };
    if (day === 6) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day >= 7 && day <= 9) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day === 10) return { shift: null, status: 'DAY OFF' };
    if (day >= 11 && day <= 17) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day >= 18 && day <= 19) return { shift: '10:00 PM – 6:00 AM', status: null };
    return { shift: '8:00 AM – 5:00 PM', status: null };
  }

  if (empName === 'JERSON AMBAL') {
    if (day >= 1 && day <= 3) return { shift: '10:00 PM – 6:00 AM', status: null };
    if (day >= 4 && day <= 5) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day === 6) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day === 7) return { shift: null, status: 'DAY OFF' };
    if (day >= 8 && day <= 10) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day >= 11 && day <= 13) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day === 14) return { shift: null, status: 'DAY OFF' };
    if (day >= 15 && day <= 16) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day === 17) return { shift: null, status: 'DAY OFF' };
    if (day >= 18 && day <= 19) return { shift: '10:00 PM – 6:00 AM', status: null };
    return { shift: '8:00 AM – 5:00 PM', status: null };
  }

  if (empName === 'MARK ANCEL GUTIERREZ') {
    if (day >= 1 && day <= 3) return { shift: '10:00 PM – 6:00 AM', status: null };
    if (day >= 4 && day <= 5) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day === 6) return { shift: null, status: 'DAY OFF' };
    if (day >= 7 && day <= 8) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day === 9) return { shift: null, status: 'DAY OFF' };
    if (day === 10) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day >= 11 && day <= 12) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day === 13) return { shift: null, status: 'DAY OFF' };
    if (day >= 14 && day <= 15) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day === 16) return { shift: null, status: 'DAY OFF' };
    if (day >= 17 && day <= 17) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day >= 18 && day <= 19) return { shift: '10:00 PM – 6:00 AM', status: null };
    return { shift: '8:00 AM – 5:00 PM', status: null };
  }

  if (empName === 'JONH WILFRED ZARSUELO') {
    if (day >= 1 && day <= 3) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day >= 4 && day <= 5) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day >= 6 && day <= 7) return { shift: '10:00 PM – 6:00 AM', status: null };
    if (day === 8) return { shift: null, status: 'DAY OFF' };
    if (day >= 9 && day <= 10) return { shift: '10:00 PM – 6:00 AM', status: null };
    if (day >= 11 && day <= 17) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day >= 18 && day <= 19) return { shift: '6:00 AM – 2:00 PM', status: null };
    return { shift: '8:00 AM – 5:00 PM', status: null };
  }

  if (empName === 'KENT SIMOUNE PIÑOL') {
    if (day >= 1 && day <= 3) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day === 4) return { shift: null, status: 'DAY OFF' };
    if (day === 5) return { shift: '6:00 AM – 2:00 PM', status: null };
    if (day === 6) return { shift: '10:00 PM – 6:00 AM', status: null };
    if (day === 7) return { shift: null, status: 'DAY OFF' };
    if (day >= 8 && day <= 9) return { shift: '10:00 PM – 6:00 AM', status: null };
    if (day >= 10 && day <= 17) return { shift: '2:00 PM – 10:00 PM', status: null };
    if (day >= 18 && day <= 19) return { shift: '6:00 AM – 2:00 PM', status: null };
    return { shift: '8:00 AM – 5:00 PM', status: null };
  }

  // Fallback procedural pattern for other employees/days based on day-of-week and id hash to look natural
  const hash = Math.abs(empName.charCodeAt(0) + (empName.charCodeAt(2) || 0) * 3);
  const patternType = hash % 4;

  // Let's ensure weekends have some DAY OFF or HOLIDAY indicators for variety
  if (dayOfWeek === 0) { // Sunday
    if (hash % 3 === 0) {
      return { shift: null, status: 'DAY OFF' };
    }
  }
  if (dayOfWeek === 6) { // Saturday
    if (hash % 4 === 1) {
      return { shift: null, status: 'DAY OFF' };
    }
  }

  // Random rotation based on day groups
  if (patternType === 0) {
    if (day % 7 <= 2) return { shift: '8:00 AM – 5:00 PM', status: null };
    if (day % 7 <= 5) return { shift: '6:00 AM – 2:00 PM', status: null };
    return { shift: null, status: 'DAY OFF' };
  } else if (patternType === 1) {
    if (day % 5 === 0) return { shift: null, status: 'DAY OFF' };
    if (day % 4 === 0) return { shift: null, status: 'LEAVE' };
    return { shift: '2:00 PM – 10:00 PM', status: null };
  } else if (patternType === 2) {
    if (day % 6 === 0) return { shift: null, status: 'TRAVEL ORDER' };
    return { shift: '10:00 PM – 6:00 AM', status: null };
  } else {
    if (day % 8 === 0) return { shift: null, status: 'OFFICE ORDER' };
    return { shift: '6:00 AM – 2:00 PM', status: null };
  }
}

// Generate complete schedule for a month
export function generateMonthSchedule(year: number, monthIndex: number, employees: Employee[]): ShiftAssignment[] {
  const assignments: ShiftAssignment[] = [];
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = d.toString().padStart(2, '0');
    const monthStr = (monthIndex + 1).toString().padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    const dayOfWeek = new Date(year, monthIndex, d).getDay();

    employees.forEach(emp => {
      const pattern = generateEmployeeShiftPattern(emp.name, d, dayOfWeek);
      assignments.push({
        employeeId: emp.id,
        date: dateStr,
        shiftType: pattern.shift,
        statusTag: pattern.status,
        updatedAt: new Date().toISOString()
      });
    });
  }

  return assignments;
}

// Define storage keys
const KEY_EMPLOYEES = 'hris_employees';
const KEY_SCHEDULES = 'hris_schedules';
const KEY_REQUESTS = 'hris_requests';
const KEY_NOTIFICATIONS = 'hris_notifications';
const KEY_INIT = 'hris_initialized_v2_june';

export function initializeDatabase() {
  if (localStorage.getItem(KEY_INIT) === 'true') {
    return;
  }

  // 1. Initialize Employees
  const employees: Employee[] = SEED_EMPLOYEES.map((se, idx) => ({
    id: `emp-${1000 + idx}`,
    name: se.name,
    isActive: se.isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  // 2. Initialize Schedules for March 2026 through August 2026
  const schedules: ShiftAssignment[] = [
    ...generateMonthSchedule(2026, 2, employees), // March 2026
    ...generateMonthSchedule(2026, 3, employees), // April 2026
    ...generateMonthSchedule(2026, 4, employees), // May 2026
    ...generateMonthSchedule(2026, 5, employees), // June 2026
    ...generateMonthSchedule(2026, 6, employees), // July 2026
    ...generateMonthSchedule(2026, 7, employees), // August 2026
  ];

  // 3. Initialize sample HR Requests
  const requests: HRRequest[] = [
    {
      id: 'req-1',
      employeeId: 'emp-1002', // MARVIN RIVERO
      employeeName: 'MARVIN RIVERO',
      requestType: 'Day-off',
      startDate: '2026-06-05',
      endDate: '2026-06-05',
      details: 'Personal family matter, requesting day off ahead of time.',
      status: 'Pending',
      submittedAt: '2026-05-28T09:00:00Z',
    },
    {
      id: 'req-2',
      employeeId: 'emp-1005', // GERSON MENDOZA
      employeeName: 'GERSON MENDOZA',
      requestType: 'Shift change',
      startDate: '2026-06-12',
      endDate: '2026-06-12',
      details: 'Requesting to trade 10:00 PM – 6:00 AM shift for 2:00 PM – 10:00 PM with another officer.',
      status: 'Pending',
      submittedAt: '2026-05-29T10:15:00Z',
    },
    {
      id: 'req-3',
      employeeId: 'emp-1000', // GIDDEL MACALIPAY
      employeeName: 'GIDDEL MACALIPAY',
      requestType: 'Leave',
      startDate: '2026-06-20',
      endDate: '2026-06-25',
      details: 'Annual wellness leave with family.',
      status: 'Approved',
      submittedAt: '2026-05-15T08:00:00Z',
      reviewedAt: '2026-05-16T14:30:00Z',
      adminNotes: 'Approved. Backups scheduled.'
    },
    {
      id: 'req-4',
      employeeId: 'emp-1004', // GLENIEL PIONILLA
      employeeName: 'GLENIEL PIONILLA',
      requestType: 'Schedule change',
      startDate: '2026-06-01',
      endDate: '2026-06-03',
      details: 'Due to medical checkups, requesting morning light shifts if possible.',
      status: 'Pending',
      submittedAt: '2026-05-30T07:10:00Z'
    }
  ];

  // 4. Initialize sample notifications
  const notifications: HRNotification[] = [
    {
      id: 'ntf-1',
      employeeId: 'ALL',
      title: 'June Schedule Published',
      message: 'The official June 2026 team scheduling lists are now available. Please review and submit any requests promptly.',
      type: 'info',
      timestamp: '2026-05-29T08:00:00Z',
      isRead: false
    },
    {
      id: 'ntf-2',
      employeeId: 'emp-1000',
      title: 'Leave Request Approved',
      message: 'Your leave request for June 20 - June 25, 2026 was accepted by Admin.',
      type: 'success',
      timestamp: '2026-05-16T14:30:00Z',
      isRead: true
    },
    {
      id: 'ntf-3',
      employeeId: 'emp-1002',
      title: 'Request Received',
      message: 'Your June 5 Day-off request has been submitted successfully and is awaiting review.',
      type: 'info',
      timestamp: '2026-05-28T09:00:00Z',
      isRead: false
    }
  ];

  localStorage.setItem(KEY_EMPLOYEES, JSON.stringify(employees));
  localStorage.setItem(KEY_SCHEDULES, JSON.stringify(schedules));
  localStorage.setItem(KEY_REQUESTS, JSON.stringify(requests));
  localStorage.setItem(KEY_NOTIFICATIONS, JSON.stringify(notifications));
  localStorage.setItem(KEY_INIT, 'true');
}

// Helpers for reading/writing from store
export function getStoredEmployees(): Employee[] {
  initializeDatabase();
  const raw = localStorage.getItem(KEY_EMPLOYEES);
  return raw ? JSON.parse(raw) : [];
}

export function saveStoredEmployees(emps: Employee[]) {
  localStorage.setItem(KEY_EMPLOYEES, JSON.stringify(emps));
}

export function getStoredSchedules(): ShiftAssignment[] {
  initializeDatabase();
  const raw = localStorage.getItem(KEY_SCHEDULES);
  return raw ? JSON.parse(raw) : [];
}

export function saveStoredSchedules(scheds: ShiftAssignment[]) {
  localStorage.setItem(KEY_SCHEDULES, JSON.stringify(scheds));
}

export function getStoredRequests(): HRRequest[] {
  initializeDatabase();
  const raw = localStorage.getItem(KEY_REQUESTS);
  return raw ? JSON.parse(raw) : [];
}

export function saveStoredRequests(reqs: HRRequest[]) {
  localStorage.setItem(KEY_REQUESTS, JSON.stringify(reqs));
}

export function getStoredNotifications(): HRNotification[] {
  initializeDatabase();
  const raw = localStorage.getItem(KEY_NOTIFICATIONS);
  return raw ? JSON.parse(raw) : [];
}

export function saveStoredNotifications(notifs: HRNotification[]) {
  localStorage.setItem(KEY_NOTIFICATIONS, JSON.stringify(notifs));
}

const KEY_ADMIN_ACCOUNTS = 'hris_admin_accounts';

export function getStoredAdminAccounts(): AdminAccount[] {
  const raw = localStorage.getItem(KEY_ADMIN_ACCOUNTS);
  if (!raw) {
    const defaults: AdminAccount[] = [
      { id: 'admin-lee', username: 'lee', passwordText: 'metallica', role: 'root' },
      { id: 'admin-operator', username: 'admin', passwordText: '2026pcc2026', role: 'operator' },
    ];
    localStorage.setItem(KEY_ADMIN_ACCOUNTS, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(raw);
}

export function saveStoredAdminAccounts(accounts: AdminAccount[]) {
  localStorage.setItem(KEY_ADMIN_ACCOUNTS, JSON.stringify(accounts));
}

// Expand database with up to 100 random employees dynamically
export function seedUpTo100Employees(): Employee[] {
  const current = getStoredEmployees();
  if (current.length >= 100) return current;

  const extraFirstNames = [
    'MICHAEL', 'DAVID', 'CHRISTIAN', 'RONALD', 'JOVITO', 'EUSTACE', 'KENNETH', 'ALVIN', 'RAYMUND', 
    'GIOVANNI', 'REX', 'HERMIE', 'VINCENT', 'DANN', 'PATRICK', 'ALDRIN', 'MERCY', 'ESTHER', 'ELISE'
  ];
  const extraLastNames = [
    'SANTOS', 'DELACRUZ', 'GONZALES', 'RAMOS', 'REYES', 'PASCUAL', 'TORRES', 'CASTRO', 'SANTIAGO',
    'BAUTISTA', 'VILLANUEVA', 'AQUINO', 'MENDOZA', 'CORPUZ', 'VALDEZ', 'FERNANDEZ', 'SOLIMAN', 'DAGOHOY'
  ];

  const employees = [...current];
  const targetCount = 100;
  const numToAdd = targetCount - employees.length;

  for (let i = 0; i < numToAdd; i++) {
    const fn = extraFirstNames[Math.floor(Math.random() * extraFirstNames.length)];
    const ln = extraLastNames[Math.floor(Math.random() * extraLastNames.length)];
    const fullname = `${fn} ${ln}`;

    employees.push({
      id: `emp-${1000 + employees.length}`,
      name: fullname,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  saveStoredEmployees(employees);

  // Re-generate schedules for newly added employees for our standard dates
  let schedules = getStoredSchedules();
  const yearsMonths = [
    { y: 2026, m: 2 }, // March
    { y: 2026, m: 3 }, // April
    { y: 2026, m: 4 }, // May
  ];

  yearsMonths.forEach(({ y, m }) => {
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = d.toString().padStart(2, '0');
      const monthStr = (m + 1).toString().padStart(2, '0');
      const dateStr = `${y}-${monthStr}-${dayStr}`;
      const dayOfWeek = new Date(y, m, d).getDay();

      // Only add for newly created employees
      for (let idx = current.length; idx < employees.length; idx++) {
        const emp = employees[idx];
        const pattern = generateEmployeeShiftPattern(emp.name, d, dayOfWeek);
        schedules.push({
          employeeId: emp.id,
          date: dateStr,
          shiftType: pattern.shift,
          statusTag: pattern.status,
          updatedAt: new Date().toISOString()
        });
      }
    }
  });

  saveStoredSchedules(schedules);
  return employees;
}
