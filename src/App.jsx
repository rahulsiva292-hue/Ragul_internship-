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

    if (!employeeName || !reason || !startDate || (!halfDay && !endDate)) {
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
                    <span>Casual</span>
                    <strong>{leaveBalances.casual}</strong>
                  </div>
                  <div>
                    <span>Sick</span>
                    <strong>{leaveBalances.sick}</strong>
                  </div>
                  <div>
                    <span>Earned</span>
                    <strong>{leaveBalances.earned}</strong>
                  </div>
                </div>
              </div>

              <div className="card calendar-card">
                <h2>Today's Leave Calendar</h2>
                <ul>
                  {leaveList
                    .filter(
                      (leave) =>
                        leave.status === "Approved" &&
                        !leave.cancelled &&
                        leave.startDate <= today &&
                        leave.endDate >= today
                    )
                    .map((leave) => (
                      <li key={leave.id}>
                        <strong>{leave.employee}</strong>
                        <span>{leave.department}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </section>

            <section className="card analytics-card">
              <h2>Leave Analytics</h2>
              <div className="chart-grid">
                {Object.entries(leaveTypeCounts).map(([type, count]) => (
                  <div key={type} className="chart-row">
                    <span>{type}</span>
                    <div className="chart-bar-container">
                      <div className="chart-bar" style={{ width: `${Math.min((count / 10) * 100, 100)}%` }} />
                    </div>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeSection === "Apply Leave" && (
          <section className="card form-card">
            <h2>Apply Leave</h2>
            <form className="leave-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Employee Name
                  <input
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Department
                  <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                    {departmentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="form-grid">
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
                <label>
                  Start Date
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </label>
              </div>

              {!halfDay && (
                <label>
                  End Date
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </label>
              )}

              <div className="form-grid">
                <label>
                  <input type="checkbox" checked={halfDay} onChange={(e) => setHalfDay(e.target.checked)} />
                  Half-Day Leave
                </label>
                <label>
                  <input type="checkbox" checked={emergency} onChange={(e) => setEmergency(e.target.checked)} />
                  Emergency Leave
                </label>
              </div>

              <label>
                Reason
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </label>

              <button type="submit" className="primary-button">Submit Request</button>
            </form>
          </section>
        )}

        {activeSection === "My Leaves" && (
          <section className="card table-card">
            <div className="section-header">
              <h2>My Leaves</h2>
              <div className="header-actions">
                <input
                  type="text"
                  placeholder="Search employee"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
                  <option value="">All Departments</option>
                  {departmentOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Period</th>
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
                      {leave.halfDay ? " (Half)" : ""}
                      {leave.emergency ? " 🔥" : ""}
                    </td>
                    <td>{leave.startDate} → {leave.endDate}</td>
                    <td>
                      <span className={`status-pill ${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      {leave.status === "Pending" && (
                        <button type="button" className="secondary-button" onClick={() => handleCancel(leave.id)}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeSection === "Leave Approval" && (
          <section className="card table-card">
            <h2>Leave Approval</h2>
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.employee}</td>
                    <td>{leave.department}</td>
                    <td>{leave.type}</td>
                    <td>{leave.startDate} → {leave.endDate}</td>
                    <td>
                      <span className={`status-pill ${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button type="button" className="approve-button" onClick={() => handleApprove(leave.id)}>Approve</button>
                      <button type="button" className="reject-button" onClick={() => handleReject(leave.id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeSection === "Reports" && (
          <section className="card report-card">
            <h2>Monthly Leave Report</h2>
            <div className="report-grid">
              {monthlySummary.map((item) => (
                <div key={item.month}>
                  <p>{item.month}</p>
                  <strong>{item.count} leaves</strong>
                </div>
              ))}
            </div>
            <div className="header-actions" style={{ marginTop: "18px" }}>
              <button type="button" className="primary-button" onClick={() => handleExport("Excel")}>Export Excel</button>
              <button type="button" className="secondary-button" onClick={() => handleExport("PDF")}>Export PDF</button>
            </div>
          </section>
        )}

        {activeSection === "Settings" && (
          <section className="card settings-card">
            <h2>Leave Policy</h2>
            <p>Casual Leave: 12 days per year</p>
            <p>Sick Leave: 10 days per year</p>
            <p>Earned Leave: 18 days per year</p>
            <p>Emergency Leave: Granted on urgent requests with prior approval.</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
