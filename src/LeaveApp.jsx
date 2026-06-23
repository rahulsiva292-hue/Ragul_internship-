import React, { useMemo, useState } from "react";
import "./App.css";

const departmentOptions = ["HR", "Sales", "Engineering", "Finance", "Operations"];
const leaveTypes = ["Casual Leave", "Sick Leave", "Earned Leave", "Emergency Leave"];

const initialLeaveRecords = [
  {
    id: 1,
    employee: "Asha Kumar",
    department: "HR",
    type: "Casual Leave",
    halfDay: false,
    emergency: false,
    startDate: "2026-06-22",
    endDate: "2026-06-24",
    reason: "Family event",
    status: "Approved",
    cancelled: false,
  },
  {
    id: 2,
    employee: "Raman Singh",
    department: "Sales",
    type: "Sick Leave",
    halfDay: true,
    emergency: false,
    startDate: "2026-06-22",
    endDate: "2026-06-22",
    reason: "Medical appointment",
    status: "Pending",
    cancelled: false,
  },
  {
    id: 3,
    employee: "Deepa Iyer",
    department: "Engineering",
    type: "Emergency Leave",
    halfDay: false,
    emergency: true,
    startDate: "2026-06-23",
    endDate: "2026-06-23",
    reason: "Urgent personal work",
    status: "Rejected",
    cancelled: false,
  },
  {
    id: 4,
    employee: "Suresh Nair",
    department: "Finance",
    type: "Earned Leave",
    halfDay: false,
    emergency: false,
    startDate: "2026-06-22",
    endDate: "2026-06-22",
    reason: "Personal time",
    status: "Approved",
    cancelled: false,
  },
];

const leaveBalances = {
  casual: 7,
  sick: 4,
  earned: 10,
};

const allEmployees = [
  "Asha Kumar",
  "Raman Singh",
  "Deepa Iyer",
  "Suresh Nair",
  "Priya Das",
  "Vikram Patel",
  "Nisha Rao",
  "Mohan Gupta",
  "Sneha Menon",
  "Amit Verma",
  "Kavita Sharma",
  "Rahul Joshi",
  "Pooja Kulkarni",
  "Anil Bhat",
];

function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [employeeName, setEmployeeName] = useState("");
  const [department, setDepartment] = useState("HR");
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [halfDay, setHalfDay] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveList, setLeaveList] = useState(initialLeaveRecords);

  const today = new Date().toISOString().slice(0, 10);

  const dashboardStats = useMemo(() => {
    const pending = leaveList.filter((leave) => leave.status === "Pending").length;
    const approved = leaveList.filter((leave) => leave.status === "Approved").length;
    const rejected = leaveList.filter((leave) => leave.status === "Rejected").length;
    const onLeaveToday = leaveList.filter(
      (leave) =>
        leave.status === "Approved" &&
        !leave.cancelled &&
        leave.startDate <= today &&
        leave.endDate >= today
    ).length;

    return { pending, approved, rejected, onLeaveToday };
  }, [leaveList, today]);

  const filteredLeaves = useMemo(
    () =>
      leaveList.filter((leave) => {
        const matchesSearch = leave.employee.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = filterDepartment ? leave.department === filterDepartment : true;
        return matchesSearch && matchesDepartment;
      }),
    [leaveList, searchTerm, filterDepartment]
  );

  const pendingLeaves = useMemo(
    () => leaveList.filter((leave) => leave.status === "Pending"),
    [leaveList]
  );

  const monthlySummary = useMemo(() => {
    const counts = leaveList.reduce((acc, leave) => {
      const month = leave.startDate.slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts)
      .sort()
      .map((month) => ({ month, count: counts[month] }));
  }, [leaveList]);

  const leaveTypeCounts = useMemo(
    () =>
      leaveList.reduce((acc, leave) => {
        acc[leave.type] = (acc[leave.type] || 0) + 1;
        return acc;
      }, {}),
    [leaveList]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!employeeName || !reason || !startDate || !endDate) {
      return;
    }

    const newLeave = {
      id: Date.now(),
      employee: employeeName,
      department,
      type: leaveType,
      halfDay,
      emergency,
      startDate,
      endDate: halfDay ? startDate : endDate,
      reason,
      status: "Pending",
      cancelled: false,
    };

    setLeaveList([newLeave, ...leaveList]);
    setEmployeeName("");
    setDepartment("HR");
    setLeaveType("Casual Leave");
    setHalfDay(false);
    setEmergency(false);
    setStartDate("");
    setEndDate("");
    setReason("");
    setActiveSection("My Leaves");
  };

  const updateLeaveStatus = (id, status) => {
    setLeaveList(
      leaveList.map((leave) =>
        leave.id === id ? { ...leave, status, cancelled: status === "Cancelled" } : leave
      )
    );
  };

  const handleCancel = (id) => updateLeaveStatus(id, "Cancelled");
  const handleApprove = (id) => updateLeaveStatus(id, "Approved");
  const handleReject = (id) => updateLeaveStatus(id, "Rejected");
  const handleExport = (format) => {
    alert(`Exporting leave report to ${format}.`);
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">Leave Manager</div>
        <nav>
          <ul>
            {["Dashboard", "Apply Leave", "My Leaves", "Leave Approval", "Reports", "Settings"].map((section) => (
              <li key={section}>
                <button
                  className={activeSection === section ? "nav-button active" : "nav-button"}
                  onClick={() => setActiveSection(section)}
                >
                  {section}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main">
        <header className="page-header">
          <div>
            <p className="eyebrow">HR Leave Management</p>
            <h1>{activeSection}</h1>
          </div>
          <div className="header-actions">
            <div className="status-chip">Employees: {allEmployees.length}</div>
            <div className="status-chip">Today: {today}</div>
          </div>
        </header>

        {activeSection === "Dashboard" && (
          <>
            <section className="summary-grid">
              <article className="stat-card">
                <p>Total Employees</p>
                <h2>{allEmployees.length}</h2>
              </article>
              <article className="stat-card">
                <p>Pending Requests</p>
                <h2>{dashboardStats.pending}</h2>
              </article>
              <article className="stat-card">
                <p>Approved Leaves</p>
                <h2>{dashboardStats.approved}</h2>
              </article>
              <article className="stat-card">
                <p>Rejected Leaves</p>
                <h2>{dashboardStats.rejected}</h2>
              </article>
              <article className="stat-card">
                <p>Employees on Leave Today</p>
                <h2>{dashboardStats.onLeaveToday}</h2>
              </article>
            </section>

            <section className="info-row">
              <div className="card balance-card">
                <h2>Leave Balances</h2>
                <div className="balance-grid">
                  <div>
                    <span>Casual Leave</span>
                    <strong>{leaveBalances.casual} days</strong>
                  </div>
                  <div>
                    <span>Sick Leave</span>
                    <strong>{leaveBalances.sick} days</strong>
                  </div>
                  <div>
                    <span>Earned Leave</span>
                    <strong>{leaveBalances.earned} days</strong>
                  </div>
                </div>
              </div>

              <div className="card calendar-card">
                <h2>Leave Calendar</h2>
                <ul className="calendar-list">
                  {leaveList
                    .filter((leave) => leave.status === "Approved")
                    .sort((a, b) => a.startDate.localeCompare(b.startDate))
                    .slice(0, 4)
                    .map((leave) => (
                      <li key={leave.id}>
                        <strong>{leave.startDate}</strong>
                        <span>{leave.employee} — {leave.type}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </section>

            <section className="card analytics-card">
              <div className="analytics-header">
                <h2>Leave Analytics</h2>
                <p>Requests by leave type</p>
              </div>
              <div className="chart-grid">
                {Object.entries(leaveTypeCounts).map(([type, count]) => {
                  const percentage = leaveList.length ? Math.round((count / leaveList.length) * 100) : 0;
                  return (
                    <div key={type} className="chart-row">
                      <span>{type}</span>
                      <div className="chart-bar-container">
                        <div className="chart-bar" style={{ width: `${percentage}%` }} />
                      </div>
                      <strong>{count}</strong>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {activeSection === "Apply Leave" && (
          <section className="card form-card">
            <h2>Apply for Leave</h2>
            <form className="leave-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Employee Name
                  <input
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="Full name"
                    required
                  />
                </label>

                <label>
                  Department
                  <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Leave Type
                  <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                    {leaveTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="inline-checkbox">
                  <input
                    type="checkbox"
                    checked={halfDay}
                    onChange={(e) => setHalfDay(e.target.checked)}
                  />
                  Half-Day Leave
                </label>

                <label className="inline-checkbox">
                  <input
                    type="checkbox"
                    checked={emergency}
                    onChange={(e) => setEmergency(e.target.checked)}
                  />
                  Emergency Request
                </label>

                <label>
                  Start Date
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </label>

                <label>
                  End Date
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={halfDay}
                    required={!halfDay}
                  />
                </label>

                <label className="full-width">
                  Reason
                  <textarea
                    rows="4"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter a short reason"
                    required
                  />
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-button">
                  Submit Leave Request
                </button>
              </div>
            </form>
          </section>
        )}

        {activeSection === "My Leaves" && (
          <section>
            <div className="filter-row">
              <input
                type="text"
                placeholder="Search employee"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
                <option value="">All Departments</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="card table-card">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>{leave.employee}</td>
                      <td>{leave.department}</td>
                      <td>
                        {leave.type}
                        {leave.halfDay ? " (Half-Day)" : ""}
                      </td>
                      <td>
                        {leave.startDate}
                        {leave.startDate !== leave.endDate ? ` – ${leave.endDate}` : ""}
                      </td>
                      <td>
                        <span className={`status-pill ${leave.status.toLowerCase()}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td>
                        {leave.status === "Approved" && !leave.cancelled ? (
                          <button className="secondary-button" onClick={() => handleCancel(leave.id)}>
                            Cancel
                          </button>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "Leave Approval" && (
          <section className="card table-card">
            <div className="section-header">
              <h2>Pending Leave Requests</h2>
              <p>Review and approve or reject requests from employees.</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.employee}</td>
                    <td>{leave.department}</td>
                    <td>{leave.type}</td>
                    <td>
                      {leave.startDate}
                      {leave.startDate !== leave.endDate ? ` – ${leave.endDate}` : ""}
                    </td>
                    <td>{leave.reason}</td>
                    <td className="action-cell">
                      <button className="approve-button" onClick={() => handleApprove(leave.id)}>
                        Approve
                      </button>
                      <button className="reject-button" onClick={() => handleReject(leave.id)}>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingLeaves.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No pending requests at the moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        {activeSection === "Reports" && (
          <section>
            <div className="report-grid">
              <div className="report-card">
                <h3>Monthly Leave Report</h3>
                <ul>
                  {monthlySummary.map((item) => (
                    <li key={item.month}>
                      <strong>{item.month}</strong> — {item.count} requests
                    </li>
                  ))}
                </ul>
              </div>
              <div className="report-card">
                <h3>Export Options</h3>
                <button className="primary-button" onClick={() => handleExport("Excel")}>Export to Excel</button>
                <button className="secondary-button" onClick={() => handleExport("PDF")}>Export to PDF</button>
              </div>
            </div>
            <section className="card analytics-card">
              <h2>Leave Policy & Reports</h2>
              <p>
                Keep your team aligned with policy details, calendar events, and a quick overview of monthly activity.
              </p>
              <div className="policy-list">
                <div>
                  <strong>Half-Day Leave</strong>
                  <span>Available for urgent appointments and partial days.</span>
                </div>
                <div>
                  <strong>Emergency Leave</strong>
                  <span>Fast-tracked with priority approval routing.</span>
                </div>
                <div>
                  <strong>Cancellation</strong>
                  <span>Employees can cancel approved leaves from their list.</span>
                </div>
              </div>
            </section>
          </section>
        )}

        {activeSection === "Settings" && (
          <section className="card settings-card">
            <h2>Leave Management Settings</h2>
            <div className="policy-list">
              <div>
                <strong>Leave Balance</strong>
                <span>Casual, Sick, Earned leave balances are displayed on the dashboard.</span>
              </div>
              <div>
                <strong>Department Filter</strong>
                <span>Filter leaves and approvals by employee department.</span>
              </div>
              <div>
                <strong>Notification Alerts</strong>
                <span>Email and notifications can be enabled for approval updates.</span>
              </div>
              <div>
                <strong>Reporting</strong>
                <span>Generate monthly leave reports and export them directly.</span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
'''
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print(path)
print('lines', content.count('\n')+1)
PY