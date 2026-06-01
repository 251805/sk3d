/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Employee } from '../types';
import { Users, Search, UserPlus, Edit3, Trash2, Check, X, ChevronLeft, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';

interface EmployeeManagerProps {
  employees: Employee[];
  onCreateEmployee: (name: string) => void;
  onUpdateEmployee: (id: string, updatedFields: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
  addSuccess: boolean;
}

export default function EmployeeManager({
  employees,
  onCreateEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  addSuccess,
}: EmployeeManagerProps) {
  const [newEmpName, setNewEmpName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  // Pagination for large employee roster list
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim()) return;
    onCreateEmployee(newEmpName.trim());
    setNewEmpName('');
  };

  const handleStartEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setEditName(emp.name);
    setEditIsActive(emp.isActive);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    onUpdateEmployee(id, { name: editName.toUpperCase().trim(), isActive: editIsActive });
    setEditingId(null);
  };

  const handleDeleteConfirm = (emp: Employee) => {
    const doubleConfirm = window.confirm(
      `⚠️ WARNING: Deleting employee "${emp.name}" (ID: ${emp.id}) will permanently erase all shift schedules and requests assigned to them. This action is irreversible.\n\nAre you sure you want to proceed?`
    );
    if (doubleConfirm) {
      onDeleteEmployee(emp.id);
    }
  };

  // Filter employees
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginated chunk
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const prevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const nextPage = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden" id="employee-directory-manager">
      {/* Card Header section */}
      <div className="bg-[#00175b] px-5 py-4 border-b border-red-650 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-white">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-red-600 rounded-lg text-white">
            <Users size={16} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider">
              Personnel Roster Directory
            </h3>
            <p className="text-[11px] text-blue-200 leading-none mt-0.5">
              Add, search, edit, or delete registered staff listings
            </p>
          </div>
        </div>
        <div className="flex items-center bg-[#001248] rounded-lg border border-blue-900/60 px-2.5 py-1 text-xs">
          <ShieldCheck size={14} className="text-emerald-400 mr-1" />
          <span className="font-mono font-bold text-slate-100">{employees.length} Total Records</span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* UPPER: Quick Registration Form */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <UserPlus size={14} className="text-slate-500" />
            <span>Recruit New Staff Account</span>
          </h4>
          <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={newEmpName}
                onChange={(e) => setNewEmpName(e.target.value)}
                placeholder="PROPOSED STAFF NAME (e.g. JEROME MERCADO)"
                className="w-full text-base md:text-xs font-semibold border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 bg-white focus:outline-none focus:ring-1 focus:ring-red-650 focus:border-red-650 uppercase placeholder-slate-400"
              />
              {addSuccess && (
                <span className="absolute right-3.5 top-3 text-[10px] uppercase font-bold text-emerald-600 animate-pulse flex items-center gap-1">
                  <Check size={12} className="stroke-[3]" /> Added!
                </span>
              )}
            </div>
            <button
              type="submit"
              className="bg-red-650 hover:bg-red-750 text-white font-black text-xs py-2.5 px-5 rounded-lg uppercase tracking-wider transition active:scale-97 flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer shadow-3xs"
            >
              <UserPlus size={14} />
              <span>Recruit</span>
            </button>
          </form>
        </div>

        {/* LOWER: Search & Manage table */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 self-start">
              <span>Employee Register Index & Status</span>
            </h4>
            
            {/* Search filter input */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search size={13} />
              </span>
              <input
                type="text"
                placeholder="Search name or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // reset to page 1 on active search
                }}
                className="block w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-base md:text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-650 transitionPlaceholder transition-all placeholder-slate-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-150 rounded-xl bg-white shadow-3xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-55 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-4 py-3 font-extrabold">Employee ID</th>
                  <th className="px-4 py-3 font-extrabold">Full Name</th>
                  <th className="px-4 py-3 font-extrabold text-center">Roster Status</th>
                  <th className="px-4 py-3 font-extrabold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic font-medium">
                      No matching personnel records found.
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp) => {
                    const isEditing = editingId === emp.id;
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-slate-500 font-bold">
                          {emp.id}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-base md:text-xs font-semibold focus:ring-1 focus:ring-red-500 focus:outline-none uppercase bg-white text-slate-900"
                            />
                          ) : (
                            <span className="uppercase">{emp.name}</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center space-x-1">
                              <input
                                type="checkbox"
                                id={`edit-active-${emp.id}`}
                                checked={editIsActive}
                                onChange={(e) => setEditIsActive(e.target.checked)}
                                className="w-3.5 h-3.5 text-red-650 border-slate-300 rounded focus:ring-red-500 cursor-pointer"
                              />
                              <label htmlFor={`edit-active-${emp.id}`} className="text-[11px] font-bold text-slate-600 select-none cursor-pointer">
                                Active In Roster
                              </label>
                            </div>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                              emp.isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                              {emp.isActive ? 'Active Duty' : 'Suspended'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleSaveEdit(emp.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-1 px-2.5 rounded-lg text-[10px] uppercase flex items-center gap-1 transition cursor-pointer"
                                title="Save Profile Edits"
                              >
                                <Check size={11} className="stroke-[3]" />
                                <span>Save</span>
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold p-1 px-2.5 rounded-lg text-[10px] uppercase flex items-center gap-1 transition cursor-pointer"
                                title="Discard Edits"
                              >
                                <X size={11} className="stroke-[3]" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleStartEdit(emp)}
                                className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold p-1 px-2 py-1.5 rounded-lg text-[10px] uppercase flex items-center gap-1 transition-all cursor-pointer shadow-4xs"
                                title="Edit Employee Details"
                              >
                                <Edit3 size={11} />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteConfirm(emp)}
                                className="border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-bold p-1 px-2 py-1.5 rounded-lg text-[10px] uppercase flex items-center gap-1 transition-all cursor-pointer shadow-4xs"
                                title="Delete Employee from Roster"
                              >
                                <Trash2 size={11} />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-slate-500 text-xs">
              <span>
                Showing page <strong className="font-extrabold text-slate-800">{currentPage}</strong> of{' '}
                <strong className="font-extrabold text-slate-800">{totalPages}</strong> ({filteredEmployees.length} filtered)
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="p-1 px-2 border border-slate-250 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white rounded transition font-bold uppercase text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={12} /> Prev
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="p-1 px-2 border border-slate-250 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white rounded transition font-bold uppercase text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
