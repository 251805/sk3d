# HRIS Monthly Scheduling System Requirements

You are a senior full-stack engineer tasked with designing and developing a Human Resource Information System (HRIS) focused on employee scheduling and workforce management.

## Project Overview

Develop a modern, mobile-friendly HRIS that can manage monthly employee schedules for approximately 100 employees, with the ability to scale as the organization grows.

The system should provide separate interfaces and permissions for administrators and employees.

---

# Core Requirements

## Employee Management

* Support approximately 100 employees initially, with the ability to add more employees without major system changes.
* Maintain employee records and scheduling information.
* Allow employees to search for their name and view their assigned schedules.

---

## Schedule Management

### Administrator Features

* Create and manage monthly schedules.
* Create schedules in advance for upcoming months.
* View schedules by employee
* Edit schedules individually or in bulk.
* Manage shift assignments and schedule changes.
* Track schedule history and modifications.

### Employee Features

* View personal schedules.
* View current daily schedule.
* View monthly schedule.

---

## Employee Requests

Employees should be able to submit the following HR requests:

* Day-off requests
* Shift change requests
* Schedule change requests
* Leave requests

All requests should require administrator review and approval.

---

# Shift Schedules and Status Tags

The system must support the following shift schedules:

| Time              |
| --------------- | 
| 6:00 AM – 2:00 PM  |
| 8:00 AM – 5:00 PM  |
| 2:00 PM – 10:00 PM |
| 10:00 PM – 6:00 AM |

### Schedule Status Tags

The following tags must be available:

* DAY OFF
* ABSENT
* TRAVEL ORDER
* OFFICE ORDER
* LEAVE
* HOLIDAY

These tags should be visually distinguishable using colors, badges, or labels.

---

# Dashboard Requirements

## Main Dashboard

The primary dashboard or splash screen should display:

* Today's schedule
* Current active shift assignments
* Employee schedule summary
* Pending requests requiring attention

### Quick Actions

Provide action buttons for:

* Previous day schedule
* Next day schedule
* Current monthly schedule
* Previous monthly schedule
* Future monthly schedules

---

## Schedule View

* Monthly calendar view
* Daily schedule view
* View schedules by employee
---

# Printing and Exporting

Administrators should be able to:

* Print employee schedules
* Print team schedules
* Print monthly schedules
* Export schedules to PDF
* Download schedule reports

Employees should be able to:

* Download their personal schedules
* Print their schedules

---

# Mobile Experience

The application must be fully responsive and optimized for:

* Android devices
* iOS devices
* Tablets
* Desktop browsers

### UI/UX Requirements

* Clean and professional design
* Balanced layout for both Android and iOS
* Fast loading experience
* Easy navigation
* Touch-friendly controls
* Accessible interface
* do not use dark colors
---

# Progressive Web App (PWA)

The application must function as a Progressive Web App (PWA).

### PWA Features

* Installable on Android and iOS
* Offline support for recently viewed schedules
* App-like user experience
* Push notifications for schedule updates and request approvals
* Fast startup performance

---

# Notifications

Provide notifications for:

* Schedule changes
* Approved requests
* Rejected requests
* Leave approvals
* Shift changes
* Upcoming shifts

---

# Technical Stack

## Frontend

* Next.js
* React
* Tailwind CSS
* Progressive Web App (PWA)

## Backend

* Next.js API Routes or Server Actions
* PostgreSQL

## Database

* Neon PostgreSQL

## Hosting

* Vercel

## Version Control

* GitHub

## Development Approach

* AI-assisted development using Google AI Studio
* Rapid prototyping and iterative development workflow

---

# Scalability Considerations

The system should be designed to:

* Support growth beyond 100 employees
---

# Success Criteria

The HRIS should enable administrators to efficiently manage workforce schedules while allowing employees to easily view schedules, submit requests, and stay informed of scheduling updates through a modern, mobile-friendly, and scalable platform.


## Seed Employee Data

The system should include support for employee seeding to simplify initial setup, testing, development, and demonstration environments.

### Initial Seed Employees

| Employee Name         |
| --------------------- |
GIDDEL MACALIPAY
LEE LUZADAS
LEANDRO VALIDO
JULIE ALVAREZ
JERONCIUS LABIAL
MARK REGIO
KENT PIÑOL
MARK GUTIERREZ
JACK UY
JERSON AMBAL
JONH ZARSUELO
MARVIN RIVERO
GERSON MENDOZA
JAGER MIK AGUILA 
CARL ANDRE NOCUM
ANGELO ALBAÑO
GLENIEL PIONILLA
JHON JOVERICK SOGOCIO
JOHN PAUL PORTE
ANGELO MARTINEZ
MARY GRACE DIMATULAC

### Seed Data Requirements

For each employee, generate the following default fields:

* Full Name
* Shift Assignment
* Schedule Status
* Created Date
* Updated Date

### Default Assignment

* All seeded employees should be active by default.
* Employees can be assigned by the administrator.
* Employees should be available for schedule assignment immediately after system initialization.
* Seed data should be configurable and expandable to support future employee additions.

### Development Purpose

The seed data should allow administrators to:

* Test monthly schedule generation
* Test employee search functionality
* Test team and department schedule views
* Test leave and schedule change requests
* Test printing and PDF export features
* Validate mobile and desktop schedule displays
