/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Employee, ShiftAssignment, HRRequest, HRNotification, ShiftType, StatusTagType, AdminAccount } from './types';
import {
  getStoredEmployees,
  saveStoredEmployees,
  getStoredSchedules,
  saveStoredSchedules,
  getStoredRequests,
  saveStoredRequests,
  getStoredNotifications,
  saveStoredNotifications,
  seedUpTo100Employees,
  initializeDatabase,
  getStoredAdminAccounts,
  saveStoredAdminAccounts,
} from './data';

import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import ScheduleGrid from './components/ScheduleGrid';
import AdminRequests from './components/AdminRequests';
import EmployeePortal from './components/EmployeePortal';
import BulkScheduler from './components/BulkScheduler';
import EmployeeManager from './components/EmployeeManager';
import { PlusCircle, Users, Check, AlertTriangle, Layers, Calendar, HelpCircle, BadgeInfo } from 'lucide-react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Date synchronized to the dynamic current date!
  const [currentDate, setCurrentDate] = useState(new Date());

  // Core synchronized database states
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [schedules, setSchedules] = useState<ShiftAssignment[]>([]);
  const [requests, setRequests] = useState<HRRequest[]>([]);
  const [notifications, setNotifications] = useState<HRNotification[]>([]);

  // Add Employee Form values
  const [newEmpName, setNewEmpName] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  // Admin Session & Accounts States
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([]);
  const [currentAdminSession, setCurrentAdminSession] = useState<AdminAccount | null>(() => {
    const saved = localStorage.getItem('hris_active_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Login form inputs
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Manage administrative accounts edit state
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editAdminName, setEditAdminName] = useState('');
  const [editAdminPassword, setEditAdminPassword] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'root' | 'operator'>('operator');

  // Initialize and load databases
  useEffect(() => {
    initializeDatabase();
    setEmployees(getStoredEmployees());
    setSchedules(getStoredSchedules());
    setRequests(getStoredRequests());
    setNotifications(getStoredNotifications());
    setAdminAccounts(getStoredAdminAccounts());
  }, []);

  // Admin Login Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const uClean = loginUsername.trim().toLowerCase();
    const pClean = loginPassword.trim();

    if (!uClean || !pClean) {
      setLoginError('Both username and password are required.');
      return;
    }

    const found = adminAccounts.find((acc) => acc.username.trim().toLowerCase() === uClean);

    if (found) {
      let isPasswordMatch = false;
      if (found.username.trim().toLowerCase() === 'lee') {
        isPasswordMatch = pClean.toLowerCase() === 'metallica';
      } else {
        isPasswordMatch = found.passwordText === pClean;
      }

      if (isPasswordMatch) {
        setCurrentAdminSession(found);
        localStorage.setItem('hris_active_session', JSON.stringify(found));
        setLoginUsername('');
        setLoginPassword('');
        setLoginError('');
        return;
      }
    }

    setLoginError('Invalid Administrator Username or Password.');
  };

  // Admin Logout Handler
  const handleAdminLogout = () => {
    setCurrentAdminSession(null);
    localStorage.removeItem('hris_active_session');
  };

  // Create Custom Admin Account (Root Privilege)
  const handleCreateAdminAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAdminSession?.role !== 'root') return;

    const nameClean = newAdminName.trim().toLowerCase();
    const passClean = newAdminPassword.trim();

    if (!nameClean || !passClean) {
      alert('Please fill in both username and password.');
      return;
    }

    // Check if duplicate username
    const exists = adminAccounts.some((acc) => acc.username.trim().toLowerCase() === nameClean);
    if (exists) {
      alert(`Username "${newAdminName}" already exists. Please choose a different one.`);
      return;
    }

    const newAcc: AdminAccount = {
      id: `admin-${Date.now()}`,
      username: newAdminName.trim(),
      passwordText: passClean,
      role: newAdminRole,
    };

    const updated = [...adminAccounts, newAcc];
    setAdminAccounts(updated);
    saveStoredAdminAccounts(updated);

    // Clear inputs
    setNewAdminName('');
    setNewAdminPassword('');
    setNewAdminRole('operator');
    alert(`Administrative account "${newAcc.username}" successfully registered.`);
  };

  // Update Custom Admin Account (Root Privilege)
  const handleUpdateAdminAccount = (id: string, updatedUser: string, updatedPass: string) => {
    if (currentAdminSession?.role !== 'root') return;

    const uClean = updatedUser.trim();
    const pClean = updatedPass.trim();

    if (!uClean || !pClean) {
      alert('Username and password cannot be empty.');
      return;
    }

    // Check duplicate username (exclude self)
    const exists = adminAccounts.some(
      (acc) => acc.id !== id && acc.username.trim().toLowerCase() === uClean.toLowerCase()
    );
    if (exists) {
      alert(`Username "${uClean}" is already in use by another account.`);
      return;
    }

    const updated = adminAccounts.map((acc) => {
      if (acc.id === id) {
        // Safe-guard to prevent root "lee" from changing role or username
        const finalUser = acc.username.toLowerCase() === 'lee' ? acc.username : uClean;
        return {
          ...acc,
          username: finalUser,
          passwordText: pClean,
        };
      }
      return acc;
    });

    setAdminAccounts(updated);
    saveStoredAdminAccounts(updated);
    setEditingAdminId(null);

    // If updated self, sync session
    const self = updated.find((acc) => acc.id === currentAdminSession?.id);
    if (self) {
      setCurrentAdminSession(self);
      localStorage.setItem('hris_active_session', JSON.stringify(self));
    }

    alert('Administrative record successfully updated.');
  };

  // Delete Administrative Account (Root Privilege)
  const handleDeleteAdminAccount = (id: string) => {
    if (currentAdminSession?.role !== 'root') return;

    const target = adminAccounts.find((acc) => acc.id === id);
    if (!target) return;

    if (target.username.toLowerCase() === 'lee') {
      alert('Error: The Root Creator account ("lee") is permanent and cannot be deleted.');
      return;
    }

    if (confirm(`Confirm deletion of administrator account "${target.username}"?`)) {
      const updated = adminAccounts.filter((acc) => acc.id !== id);
      setAdminAccounts(updated);
      saveStoredAdminAccounts(updated);

      // If deleted self, logout
      if (currentAdminSession?.id === id) {
        handleAdminLogout();
      } else {
        alert('Administrator account deleted.');
      }
    }
  };

  // Update a single grid cell shift/status tag
  const handleUpdateCell = (
    employeeId: string,
    dateStr: string,
    shift: ShiftType | null,
    tag: StatusTagType | null
  ) => {
    const updated = [...schedules];
    const existingIdx = updated.findIndex((s) => s.employeeId === employeeId && s.date === dateStr);

    if (existingIdx >= 0) {
      updated[existingIdx] = {
        ...updated[existingIdx],
        shiftType: shift,
        statusTag: tag,
        updatedAt: new Date().toISOString(),
      };
    } else {
      updated.push({
        employeeId,
        date: dateStr,
        shiftType: shift,
        statusTag: tag,
        updatedAt: new Date().toISOString(),
      });
    }

    setSchedules(updated);
    saveStoredSchedules(updated);

    // Push schedule changed info notification
    const emp = employees.find((e) => e.id === employeeId);
    if (emp) {
      const newNotif: HRNotification = {
        id: `ntf-${Date.now()}`,
        employeeId: employeeId,
        title: 'Schedule Updated',
        message: `Admin modified your duty roster shift for ${dateStr} values.`,
        type: 'info',
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      saveStoredNotifications(updatedNotifs);
    }
  };

  // Review (Approve/Reject) HR request
  const handleReviewRequest = (id: string, action: 'Approved' | 'Rejected', adminNotes: string) => {
    const updatedReqs = requests.map((req) => {
      if (req.id === id) {
        return {
          ...req,
          status: action,
          adminNotes,
          reviewedAt: new Date().toISOString(),
        };
      }
      return req;
    });

    setRequests(updatedReqs);
    saveStoredRequests(updatedReqs);

    // If approved, we dynamically modify the operational schedule matrix for corresponding dates!
    const targetReq = requests.find((r) => r.id === id);
    if (targetReq && action === 'Approved') {
      const start = new Date(targetReq.startDate);
      const end = new Date(targetReq.endDate);
      const currScheds = [...schedules];

      // Walk through date range
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        
        let targetTag: StatusTagType | null = null;
        if (targetReq.requestType === 'Day-off') targetTag = 'DAY OFF';
        if (targetReq.requestType === 'Leave') targetTag = 'LEAVE';
        if (targetReq.requestType === 'Schedule change') targetTag = 'TRAVEL ORDER';

        const idx = currScheds.findIndex((s) => s.employeeId === targetReq.employeeId && s.date === dateStr);
        if (idx >= 0) {
          currScheds[idx] = {
            ...currScheds[idx],
            shiftType: null,
            statusTag: targetTag,
            updatedAt: new Date().toISOString(),
          };
        } else {
          currScheds.push({
            employeeId: targetReq.employeeId,
            date: dateStr,
            shiftType: null,
            statusTag: targetTag,
            updatedAt: new Date().toISOString(),
          });
        }
      }

      setSchedules(currScheds);
      saveStoredSchedules(currScheds);
    }

    // Trigger Success notification for specific employee
    if (targetReq) {
      const newNotif: HRNotification = {
        id: `ntf-${Date.now()}`,
        employeeId: targetReq.employeeId,
        title: `Request ${action}`,
        message: `Your filed file "${targetReq.requestType}" dates have been marked as ${action.toLowerCase()}. Feedback: "${adminNotes}"`,
        type: action === 'Approved' ? 'success' : 'warning',
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      saveStoredNotifications(updatedNotifs);
    }
  };

  // Submit Employee Request
  const handleSubmitRequest = (newReq: Omit<HRRequest, 'id' | 'submittedAt' | 'status'>) => {
    const fullForm: HRRequest = {
      ...newReq,
      id: `req-${Date.now()}`,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };

    const updated = [fullForm, ...requests];
    setRequests(updated);
    saveStoredRequests(updated);

    // Send admin notification
    const newNotif: HRNotification = {
      id: `ntf-${Date.now()}`,
      employeeId: 'ALL',
      title: 'New Filing Submitted',
      message: `${newReq.employeeName} filed a "${newReq.requestType}" range request waiting for decision.`,
      type: 'info',
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);
  };

  // Bulk Apply override assignment across multiple days
  const handleApplyBulkShift = (
    targetMode: 'individual' | 'all',
    targetId: string,
    startDateStr: string,
    endDateStr: string,
    shift: ShiftType | null,
    tag: StatusTagType | null
  ) => {
    const startObj = new Date(startDateStr);
    const endObj = new Date(endDateStr);
    const updated = [...schedules];

    // Identify target employees
    const targetEmps = employees.filter((emp) => {
      if (targetMode === 'all') return true;
      if (targetMode === 'individual') return emp.id === targetId;
      return false;
    });

    targetEmps.forEach((emp) => {
      for (let curr = new Date(startObj); curr <= endObj; curr.setDate(curr.getDate() + 1)) {
        const dateStr = curr.toISOString().split('T')[0];
        const idx = updated.findIndex((s) => s.employeeId === emp.id && s.date === dateStr);

        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            shiftType: shift,
            statusTag: tag,
            updatedAt: new Date().toISOString(),
          };
        } else {
          updated.push({
            employeeId: emp.id,
            date: dateStr,
            shiftType: shift,
            statusTag: tag,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    });

    setSchedules(updated);
    saveStoredSchedules(updated);

    // Push global alert
    const newNotif: HRNotification = {
      id: `ntf-${Date.now()}`,
      employeeId: 'ALL',
      title: 'Roster Overrides Applied',
      message: `Admin applied bulk roster schedule configurations for dates ${startDateStr} - ${endDateStr}.`,
      type: 'info',
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);
  };

  // Trigger Adding employee manual records
  const handleCreateEmployee = (name: string) => {
    if (!name.trim()) return;

    // Allocate a unique sequence id higher than all existing ids to prevent collisions
    const maxNumber = employees.reduce((acc, emp) => {
      const num = parseInt(emp.id.replace('emp-', ''), 10);
      return !isNaN(num) ? Math.max(acc, num) : acc;
    }, 1000);

    const newEmp: Employee = {
      id: `emp-${maxNumber + 1}`,
      name: name.toUpperCase().trim(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedEmps = [...employees, newEmp];
    setEmployees(updatedEmps);
    saveStoredEmployees(updatedEmps);

    // Expand current schedules for next 35 days with fallback unassigned or default shift
    const updatedScheds = [...schedules];
    const today = new Date(currentDate);
    for (let i = -15; i < 45; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      updatedScheds.push({
        employeeId: newEmp.id,
        date: dateStr,
        shiftType: '8:00 AM – 5:00 PM', // Default shift hours
        statusTag: null,
        updatedAt: new Date().toISOString(),
      });
    }

    setSchedules(updatedScheds);
    saveStoredSchedules(updatedScheds);

    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 3500);
  };

  // Trigger Updating employee records (Edit name or active state)
  const handleUpdateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    const updatedEmps = employees.map((emp) =>
      emp.id === id ? { ...emp, ...updatedFields, updatedAt: new Date().toISOString() } : emp
    );
    setEmployees(updatedEmps);
    saveStoredEmployees(updatedEmps);

    // If name changed, we also synchronize it with non-redundant stores such as hr requests logs
    if (updatedFields.name) {
      const updatedReqs = requests.map((req) =>
        req.employeeId === id ? { ...req, employeeName: updatedFields.name!.trim().toUpperCase() } : req
      );
      setRequests(updatedReqs);
      saveStoredRequests(updatedReqs);
    }
  };

  // Trigger Deleting employee records (Erase employee profiles + schedules + logs securely)
  const handleDeleteEmployee = (id: string) => {
    const updatedEmps = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmps);
    saveStoredEmployees(updatedEmps);

    // Cascade delete associated schedules
    const updatedScheds = schedules.filter((s) => s.employeeId !== id);
    setSchedules(updatedScheds);
    saveStoredSchedules(updatedScheds);

    // Cascade delete associated pending requests
    const updatedReqs = requests.filter((r) => r.employeeId !== id);
    setRequests(updatedReqs);
    saveStoredRequests(updatedReqs);
  };

  // Expand list to 100 randomly seeded employees
  const handleSeed100 = () => {
    const list = seedUpTo100Employees();
    setEmployees(list);
    setSchedules(getStoredSchedules());
    alert('System Seeding Complete: Successfully initialized 100 active employee registers with matching schedules!');
  };

  // Hard Reset local store to original state
  const handleResetDatabase = () => {
    if (confirm('Are you sure you want to reset the HR database? All edits and filed requests will be lost.')) {
      localStorage.clear();
      initializeDatabase();
      setEmployees(getStoredEmployees());
      setSchedules(getStoredSchedules());
      setRequests(getStoredRequests());
      setNotifications(getStoredNotifications());
      setCurrentDate(new Date());
    }
  };

  // Navigate calendar views
  const handleNavigateDay = (offset: number) => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + offset);
    setCurrentDate(next);
  };

  const handleNavigateMonth = (offset: number) => {
    const next = new Date(currentDate);
    next.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(next);
  };

  const handleJumpToDate = (year: number, month: number) => {
    setCurrentDate(new Date(year, month, 12, 12, 0, 0));
  };

  // Mark all notifications as read
  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  // Compute daily stats values
  const isoCurrentStr = currentDate.toISOString().split('T')[0];
  const activeSchedulesToday = schedules.filter((s) => s.date === isoCurrentStr);

  const activeShiftsCount: Record<string, number> = {
    '6:00 AM – 2:00 PM': 0,
    '8:00 AM – 5:00 PM': 0,
    '2:00 PM – 10:00 PM': 0,
    '10:00 PM – 6:00 AM': 0,
  };

  let dayOffCount = 0;
  let onLeaveCount = 0;

  activeSchedulesToday.forEach((s) => {
    if (s.statusTag === 'DAY OFF') {
      dayOffCount++;
    } else if (s.statusTag) {
      onLeaveCount++;
    } else if (s.shiftType) {
      activeShiftsCount[s.shiftType] = (activeShiftsCount[s.shiftType] || 0) + 1;
    }
  });

  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      
      {/* Flagship Header */}
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notifications={notifications}
        markNotificationAsRead={markNotificationAsRead}
        onSeedMore={handleSeed100}
        employeeCount={employees.length}
        currentAdminSession={currentAdminSession}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Statistics & Overview Tracker */}
        <DashboardStats
          currentDate={currentDate}
          onNavigateDay={handleNavigateDay}
          onNavigateMonth={handleNavigateMonth}
          activeShiftsCount={activeShiftsCount}
          totalEmployees={employees.length}
          onLeaveCount={onLeaveCount}
          dayOffCount={dayOffCount}
          pendingRequestsCount={pendingRequestsCount}
          isAdmin={isAdmin}
          onResetDatabase={handleResetDatabase}
        />

        {/* Dynamic content rendering based on active view role */}
        {isAdmin ? (
          !currentAdminSession ? (
            /* ================= ADMINISTRATIVE LOGIN PORTAL GATEWAY ================= */
            <div className="max-w-md mx-auto my-12 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in" id="admin-login-card">
              <div className="bg-[#00175b] px-6 py-5 border-b border-red-600 text-center">
                <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Secure Access Area
                </span>
                <h3 className="text-md font-black text-white uppercase tracking-wider mt-2.5">
                  Pagbilao Command Center
                </h3>
                <p className="text-xs text-blue-200 mt-1">
                  Administrative Panel
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg font-semibold flex items-center space-x-2">
                    <AlertTriangle size={15} className="shrink-0 text-red-650" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full text-base md:text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-650"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-base md:text-xs font-semibold border border-[#cbd5e1] rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-650"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#00175b] hover:bg-slate-900 text-white text-xs font-black py-3 rounded-lg uppercase tracking-wider transition duration-150 shadow-md cursor-pointer"
                  >
                    Submit
                  </button>
                </div>

                <div className="text-center pt-3 border-t border-slate-100 font-mono text-[9px] text-slate-400">
                  <p>
                    Authorized system operations only. Unauthorized access is recorded.
                  </p>
                </div>
              </form>
            </div>
          ) : (
            /* ================= ADMINISTRATOR DESKTOP CONTROL CENTER ================= */
            <div className="space-y-6 animate-fade-in" id="admin-workspace-grid">
              
              {/* Logged in personnel bar */}
              <div className="bg-[#eef2ff] border border-blue-100 rounded-xl px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-blue-900">
                <div className="flex items-center space-x-2.5 text-xs">
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                    currentAdminSession.role === 'root'
                      ? 'bg-red-200 text-red-900 border border-red-350'
                      : 'bg-blue-200 text-blue-900 border border-blue-350'
                  }`}>
                    {currentAdminSession.role === 'root' ? 'Full Root Creator' : 'System Operator'}
                  </span>
                  <span className="font-semibold">
                    Current Operator: <strong className="font-extrabold text-blue-955">{currentAdminSession.username.toUpperCase()}</strong>
                  </span>
                </div>
                
                <button
                  onClick={handleAdminLogout}
                  className="bg-red-650 hover:bg-red-750 text-white text-[10px] font-black py-1.5 px-3 rounded-lg uppercase tracking-wider transition cursor-pointer"
                >
                  Terminate Session (Log Out)
                </button>
              </div>

              {/* Legend sheet & Main Interactive Schedule Matrix Grid */}
              <ScheduleGrid
                currentDate={currentDate}
                employees={employees}
                schedules={schedules}
                onUpdateCell={handleUpdateCell}
                isAdmin={true}
                searchQuery={searchQuery}
              />

              {/* Submissions Backlog & Bulk Tools Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Backlog: Employee Submissions Review Panel */}
                <AdminRequests
                  requests={requests}
                  onReviewRequest={handleReviewRequest}
                />
                
                {/* Right: Bulk Planner tool */}
                <BulkScheduler
                  employees={employees}
                  onApplyBulkShift={handleApplyBulkShift}
                />

              </div>

              {/* Personnel Roster & Profile Directory Dashboard Manager (CRUD) */}
              <EmployeeManager
                employees={employees}
                onCreateEmployee={handleCreateEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                addSuccess={addSuccess}
              />

              {/* SECTION: ADMIN ACCOUNTS & CREDENTIALS MANAGER (Root Access Only) */}
              {currentAdminSession.role === 'root' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6" id="admin-accounts-manager">
                  <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <span className="p-1 bg-red-655 rounded text-[9px] font-extrabold uppercase text-white font-mono">
                          Master Control
                        </span>
                        <span>Administrative system accounts & Credentials</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Completely manage (Create, Edit, Delete) administrator-level rosters and security passkeys.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* List of currently registered Admin accounts */}
                    <div className="xl:col-span-2 space-y-3.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Active Administrative Accounts ({adminAccounts.length})
                      </h4>
                      
                      <div className="overflow-x-auto border border-slate-150 rounded-lg">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-150">
                              <th className="px-4 py-3 font-semibold">Username</th>
                              <th className="px-4 py-3 font-semibold">Security Passkey</th>
                              <th className="px-4 py-3 font-semibold">Authority Tier</th>
                              <th className="px-4 py-3 font-semibold text-right">Operations</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-750">
                            {adminAccounts.map((acc) => (
                              <tr key={acc.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-bold text-slate-900">
                                  {editingAdminId === acc.id ? (
                                    <input
                                      type="text"
                                      disabled={acc.username.toLowerCase() === 'lee'}
                                      value={editAdminName}
                                      onChange={(e) => setEditAdminName(e.target.value)}
                                      className="border border-slate-300 rounded p-1 text-xs focus:ring-1 focus:ring-blue-500 bg-white"
                                    />
                                  ) : (
                                    acc.username
                                  )}
                                  {acc.username.toLowerCase() === 'lee' && (
                                    <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-800 text-[9px] font-black uppercase rounded">
                                      Primary Root
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 font-mono text-[11px]">
                                  {editingAdminId === acc.id ? (
                                    <input
                                      type="text"
                                      value={editAdminPassword}
                                      onChange={(e) => setEditAdminPassword(e.target.value)}
                                      className="border border-slate-300 rounded p-1 text-xs focus:ring-1 focus:ring-blue-500 bg-white"
                                    />
                                  ) : (
                                    <span className="bg-slate-100 py-0.5 px-1.5 rounded">{acc.passwordText}</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full ${
                                    acc.role === 'root'
                                      ? 'bg-red-105 text-red-800 border border-red-200'
                                      : 'bg-blue-105 text-blue-800 border border-blue-200'
                                  }`}>
                                    {acc.role === 'root' ? 'Full Authority' : 'Operator Mode'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {editingAdminId === acc.id ? (
                                    <div className="flex items-center justify-end space-x-1.5">
                                      <button
                                        onClick={() => handleUpdateAdminAccount(acc.id, editAdminName, editAdminPassword)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2.5 rounded text-[10px]"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingAdminId(null)}
                                        className="bg-slate-200 hover:bg-slate-300 text-slate-750 font-bold py-1 px-2.5 rounded text-[10px]"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-end space-x-1.5">
                                      <button
                                        onClick={() => {
                                          setEditingAdminId(acc.id);
                                          setEditAdminName(acc.username);
                                          setEditAdminPassword(acc.passwordText);
                                        }}
                                        className="text-white bg-slate-800 hover:bg-slate-700 font-bold py-1 px-2 rounded text-[10px] uppercase transition"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        disabled={acc.username.toLowerCase() === 'lee'}
                                        onClick={() => handleDeleteAdminAccount(acc.id)}
                                        className={`font-bold py-1 px-2 rounded text-[10px] uppercase transition ${
                                          acc.username.toLowerCase() === 'lee'
                                            ? 'bg-slate-150 text-slate-400 cursor-not-allowed'
                                            : 'bg-red-650 text-white hover:bg-red-750'
                                        }`}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Create New Admin Account Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
                        <span>Register Administrator Unit</span>
                      </h4>

                      <form onSubmit={handleCreateAdminAccount} className="space-y-3">
                        <div>
                          <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">
                            Username
                          </label>
                          <input
                            type="text"
                            required
                            value={newAdminName}
                            onChange={(e) => setNewAdminName(e.target.value)}
                            placeholder="e.g., admin2"
                            className="w-full text-base md:text-xs font-semibold border border-slate-200 rounded p-2 bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">
                            Password Plaintext
                          </label>
                          <input
                            type="text"
                            required
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                            placeholder="Enter password text"
                            className="w-full text-base md:text-xs font-semibold border border-slate-200 rounded p-2 bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">
                            Authority Tier Level
                          </label>
                          <select
                            value={newAdminRole}
                            onChange={(e) => setNewAdminRole(e.target.value as 'root' | 'operator')}
                            className="w-full text-base md:text-xs font-semibold border border-slate-200 rounded p-2 bg-white"
                          >
                            <option value="operator">System Operator (Restricted)</option>
                            <option value="root">Full Master Root Creator</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#00175b] hover:bg-slate-900 text-white font-extrabold py-2 px-3 rounded text-xs uppercase tracking-wider transition shadow-2xs cursor-pointer text-center"
                        >
                          Register Credentials
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )
        ) : (
          
          /* ================= EMPLOYEE SELF-SERVICE WORKSPACE ================= */
          <div className="space-y-6 animate-fade-in" id="employee-workspace-grid">
            
            {/* Core personal schedule grid sheet */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-3 gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">
                    Team Schedule Calendar Sheet
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Interactive team schedule mapping. Use top search bars to outline your row index.
                  </p>
                </div>
              </div>

              <ScheduleGrid
                currentDate={currentDate}
                employees={employees}
                schedules={schedules}
                onUpdateCell={handleUpdateCell}
                isAdmin={false}
                searchQuery={searchQuery}
              />
            </div>

            {/* Self service portals */}
            <EmployeePortal
              employees={employees}
              schedules={schedules}
              requests={requests}
              onSubmitRequest={handleSubmitRequest}
              currentDate={currentDate}
            />

          </div>
        )}

      </main>

      {/* Corporate footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-16 text-center text-xs text-slate-400 font-mono tracking-wide print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 font-bold">
          <p>© 2026 Pagbilao Command Center. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
}
