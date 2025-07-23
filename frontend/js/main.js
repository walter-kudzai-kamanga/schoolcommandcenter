document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('main-content');
    const dashboardCards = document.getElementById('dashboard-cards');
    const navLinks = [
        { id: 'students', endpoint: 'students' },
        { id: 'staff', endpoint: 'staff' },
        { id: 'attendance', endpoint: 'attendance' },
        { id: 'lesson-plans', endpoint: 'lesson_plans' },
        { id: 'tests', endpoint: 'tests' },
        { id: 'homework', endpoint: 'homework' },
        { id: 'finance', endpoint: 'finance' },
        { id: 'inventory', endpoint: 'inventory' },
        { id: 'transport', endpoint: 'transport' },
        { id: 'alerts', endpoint: 'alerts' }
    ];

    // --- Dynamic Module Loader ---
    function loadModuleUI(moduleId) {
        switch (moduleId) {
            case 'students':
                renderStudentManagement();
                break;
            case 'staff':
                renderStaffManagement();
                break;
            case 'attendance':
                renderAttendanceRegister();
                break;
            case 'lesson-plans':
                renderLessonPlanning();
                break;
            case 'tests':
                renderTestCreation();
                break;
            case 'homework':
                renderHomeworkAssignment();
                break;
            case 'finance':
                renderFinanceFees();
                break;
            case 'inventory':
                renderInventoryManagement();
                break;
            case 'transport':
                renderTransportModule();
                break;
            case 'alerts':
                renderAlertsModule();
                break;
            default:
                setMainContent('<div class="text-center mt-5"><h3>Module coming soon!</h3></div>');
        }
    }

    // --- Student Management UI ---
    function renderStudentManagement() {
        setMainContent(`
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Student Management</h2>
                <button class="btn btn-primary" id="addStudentBtn"><i class="bi bi-person-plus-fill me-2"></i>Add Student</button>
            </div>
            <div class="card mb-4">
                <div class="card-body">
                    <input type="text" class="form-control table-search mb-3" placeholder="Search students..." id="studentSearchInput">
                    <div class="table-responsive animate-fade-in">
                        <table class="table table-striped align-middle" id="studentsTable">
                            <thead class="table-light">
                                <tr>
                                    <th>Reg No</th>
                                    <th>Name</th>
                                    <th>Class</th>
                                    <th>Fees</th>
                                    <th>Attendance</th>
                                    <th>Tests</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- Modal for Add/Edit Student -->
            <div class="modal fade" id="studentModal" tabindex="-1" aria-labelledby="studentModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="studentModalLabel">Add Student</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form id="studentForm">
                      <div class="mb-3">
                        <label for="studentRegNo" class="form-label">Reg No</label>
                        <input type="text" class="form-control" id="studentRegNo" readonly>
                      </div>
                      <div class="mb-3">
                        <label for="studentName" class="form-label">Name</label>
                        <input type="text" class="form-control" id="studentName" required>
                      </div>
                      <div class="mb-3">
                        <label for="studentClass" class="form-label">Class</label>
                        <input type="text" class="form-control" id="studentClass" required>
                      </div>
                      <div class="mb-3">
                        <label for="studentDocs" class="form-label">Attach Documents</label>
                        <input type="file" class="form-control" id="studentDocs" multiple>
                        <div class="form-text">Birth certificate, photo, report card, etc.</div>
                      </div>
                      <button type="submit" class="btn btn-primary w-100">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
        `);
        renderStudentsTable();
        document.getElementById('addStudentBtn').onclick = openAddStudentModal;
    }

    // --- Mock Data for Students ---
    let students = [
        { regNo: 'SCH-2024-000001', name: 'John Doe', class: 'JSS1A', fees: '₦20,000', attendance: '95%', tests: 'A' },
        { regNo: 'SCH-2024-000002', name: 'Jane Smith', class: 'JSS2B', fees: '₦18,000', attendance: '98%', tests: 'B+' },
    ];

    function renderStudentsTable() {
        const tbody = document.querySelector('#studentsTable tbody');
        tbody.innerHTML = '';
        students.forEach((student, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.regNo}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>${student.fees}</td>
                <td>${student.attendance}</td>
                <td>${student.tests}</td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="window.editStudent(${idx})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="window.deleteStudent(${idx})"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        // Search/filter
        document.getElementById('studentSearchInput').addEventListener('input', function() {
            const value = this.value.toLowerCase();
            Array.from(tbody.rows).forEach(row => {
                const rowText = Array.from(row.cells).map(cell => cell.textContent.toLowerCase()).join(' ');
                row.style.display = rowText.includes(value) ? '' : 'none';
            });
        });
    }

    // --- Add/Edit Student Modal ---
    window.editStudent = function(idx) {
        const student = students[idx];
        openStudentModal('Edit Student', student, idx);
    };
    window.deleteStudent = function(idx) {
        if (confirm('Delete this student?')) {
            students.splice(idx, 1);
            renderStudentsTable();
            showToast('Student deleted', 'success');
        }
    };
    function openAddStudentModal() {
        openStudentModal('Add Student', null, null);
    }
    function openStudentModal(title, student, idx) {
        document.getElementById('studentModalLabel').textContent = title;
        document.getElementById('studentRegNo').value = student ? student.regNo : generateRegNo();
        document.getElementById('studentName').value = student ? student.name : '';
        document.getElementById('studentClass').value = student ? student.class : '';
        document.getElementById('studentDocs').value = '';
        const modal = new bootstrap.Modal(document.getElementById('studentModal'));
        modal.show();
        document.getElementById('studentForm').onsubmit = function(e) {
            e.preventDefault();
            const newStudent = {
                regNo: document.getElementById('studentRegNo').value,
                name: document.getElementById('studentName').value,
                class: document.getElementById('studentClass').value,
                fees: '₦0',
                attendance: '0%',
                tests: '-'
            };
            if (idx !== null) {
                students[idx] = newStudent;
                showToast('Student updated', 'success');
            } else {
                students.push(newStudent);
                showToast('Student added', 'success');
            }
            modal.hide();
            renderStudentsTable();
        };
    }
    function generateRegNo() {
        const year = new Date().getFullYear();
        const next = (students.length + 1).toString().padStart(6, '0');
        return `SCH-${year}-${next}`;
    }

    // --- Mock Data for Staff ---
    let staffList = [
        { id: 1, name: 'Mr. Ayo Bello', subjects: 'Math, Physics', schedule: 'Mon-Fri', role: 'Teacher', salary: '₦80,000', payrollStatus: 'Paid', leave: 'None', attendance: 'Present', photo: '' },
        { id: 2, name: 'Mrs. Grace Udo', subjects: 'English', schedule: 'Mon-Wed', role: 'Teacher', salary: '₦75,000', payrollStatus: 'Pending', leave: 'Requested', attendance: 'Absent', photo: '' },
    ];

    // --- Staff Management UI ---
    function renderStaffManagement() {
        setMainContent(`
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Staff & HR Management</h2>
                <button class="btn btn-primary" id="addStaffBtn"><i class="bi bi-person-plus-fill me-2"></i>Add Staff</button>
            </div>
            <div class="card mb-4">
                <div class="card-body">
                    <input type="text" class="form-control table-search mb-3" placeholder="Search staff..." id="staffSearchInput">
                    <div class="table-responsive animate-fade-in">
                        <table class="table table-striped align-middle" id="staffTable">
                            <thead class="table-light">
                                <tr>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Subjects</th>
                                    <th>Schedule</th>
                                    <th>Role</th>
                                    <th>Payroll</th>
                                    <th>Leave</th>
                                    <th>Attendance</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- Modal for Add/Edit Staff -->
            <div class="modal fade" id="staffModal" tabindex="-1" aria-labelledby="staffModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="staffModalLabel">Add Staff</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <ul class="nav nav-tabs mb-3" id="staffTab" role="tablist">
                      <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab">Profile</button>
                      </li>
                      <li class="nav-item" role="presentation">
                        <button class="nav-link" id="payroll-tab" data-bs-toggle="tab" data-bs-target="#payroll" type="button" role="tab">Payroll</button>
                      </li>
                      <li class="nav-item" role="presentation">
                        <button class="nav-link" id="leave-tab" data-bs-toggle="tab" data-bs-target="#leave" type="button" role="tab">Leave</button>
                      </li>
                      <li class="nav-item" role="presentation">
                        <button class="nav-link" id="attendance-tab" data-bs-toggle="tab" data-bs-target="#attendance" type="button" role="tab">Attendance</button>
                      </li>
                    </ul>
                    <form id="staffForm">
                      <div class="tab-content">
                        <div class="tab-pane fade show active" id="profile" role="tabpanel">
                          <div class="mb-3 text-center">
                            <img id="staffPhotoPreview" src="" alt="Profile Photo" class="rounded-circle mb-2" style="width:70px;height:70px;object-fit:cover;display:none;">
                            <input type="file" class="form-control" id="staffPhoto" accept="image/*">
                            <div class="form-text">Profile photo</div>
                          </div>
                          <div class="mb-3">
                            <label for="staffName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="staffName" required>
                          </div>
                          <div class="mb-3">
                            <label for="staffSubjects" class="form-label">Subjects</label>
                            <input type="text" class="form-control" id="staffSubjects">
                          </div>
                          <div class="mb-3">
                            <label for="staffSchedule" class="form-label">Schedule</label>
                            <input type="text" class="form-control" id="staffSchedule">
                          </div>
                          <div class="mb-3">
                            <label for="staffRole" class="form-label">Role</label>
                            <input type="text" class="form-control" id="staffRole">
                          </div>
                        </div>
                        <div class="tab-pane fade" id="payroll" role="tabpanel">
                          <div class="mb-3">
                            <label for="staffSalary" class="form-label">Salary</label>
                            <input type="text" class="form-control" id="staffSalary">
                          </div>
                          <div class="mb-3">
                            <label for="staffPayrollStatus" class="form-label">Payroll Status</label>
                            <select class="form-select" id="staffPayrollStatus">
                              <option value="Paid">Paid</option>
                              <option value="Pending">Pending</option>
                            </select>
                          </div>
                        </div>
                        <div class="tab-pane fade" id="leave" role="tabpanel">
                          <div class="mb-3">
                            <label for="staffLeave" class="form-label">Leave Status</label>
                            <select class="form-select" id="staffLeave">
                              <option value="None">None</option>
                              <option value="Requested">Requested</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                        <div class="tab-pane fade" id="attendance" role="tabpanel">
                          <div class="mb-3">
                            <label for="staffAttendance" class="form-label">Attendance</label>
                            <select class="form-select" id="staffAttendance">
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                              <option value="Late">Late</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary w-100 mt-3">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
        `);
        renderStaffTable();
        document.getElementById('addStaffBtn').onclick = openAddStaffModal;
    }

    function renderStaffTable() {
        const tbody = document.querySelector('#staffTable tbody');
        tbody.innerHTML = '';
        staffList.forEach((staff, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${staff.photo ? `<img src="${staff.photo}" class="rounded-circle" style="width:40px;height:40px;object-fit:cover;">` : '<i class="bi bi-person-circle fs-3 text-secondary"></i>'}</td>
                <td>${staff.name}</td>
                <td>${staff.subjects}</td>
                <td>${staff.schedule}</td>
                <td>${staff.role}</td>
                <td>${staff.salary}<br><span class="badge ${staff.payrollStatus==='Paid'?'bg-success':'bg-warning text-dark'}">${staff.payrollStatus}</span></td>
                <td><span class="badge ${staff.leave==='None'?'bg-secondary':staff.leave==='Requested'?'bg-warning text-dark':staff.leave==='Approved'?'bg-success':'bg-danger'}">${staff.leave}</span></td>
                <td><span class="badge ${staff.attendance==='Present'?'bg-success':staff.attendance==='Late'?'bg-warning text-dark':'bg-danger'}">${staff.attendance}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="window.editStaff(${idx})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="window.deleteStaff(${idx})"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        // Search/filter
        document.getElementById('staffSearchInput').addEventListener('input', function() {
            const value = this.value.toLowerCase();
            Array.from(tbody.rows).forEach(row => {
                const rowText = Array.from(row.cells).map(cell => cell.textContent.toLowerCase()).join(' ');
                row.style.display = rowText.includes(value) ? '' : 'none';
            });
        });
    }

    // --- Add/Edit Staff Modal ---
    window.editStaff = function(idx) {
        const staff = staffList[idx];
        openStaffModal('Edit Staff', staff, idx);
    };
    window.deleteStaff = function(idx) {
        if (confirm('Delete this staff member?')) {
            staffList.splice(idx, 1);
            renderStaffTable();
            showToast('Staff deleted', 'success');
        }
    };
    function openAddStaffModal() {
        openStaffModal('Add Staff', null, null);
    }
    function openStaffModal(title, staff, idx) {
        document.getElementById('staffModalLabel').textContent = title;
        document.getElementById('staffName').value = staff ? staff.name : '';
        document.getElementById('staffSubjects').value = staff ? staff.subjects : '';
        document.getElementById('staffSchedule').value = staff ? staff.schedule : '';
        document.getElementById('staffRole').value = staff ? staff.role : '';
        document.getElementById('staffSalary').value = staff ? staff.salary : '';
        document.getElementById('staffPayrollStatus').value = staff ? staff.payrollStatus : 'Paid';
        document.getElementById('staffLeave').value = staff ? staff.leave : 'None';
        document.getElementById('staffAttendance').value = staff ? staff.attendance : 'Present';
        document.getElementById('staffPhoto').value = '';
        const photoPreview = document.getElementById('staffPhotoPreview');
        if (staff && staff.photo) {
            photoPreview.src = staff.photo;
            photoPreview.style.display = '';
        } else {
            photoPreview.style.display = 'none';
        }
        document.getElementById('staffPhoto').onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    photoPreview.src = ev.target.result;
                    photoPreview.style.display = '';
                };
                reader.readAsDataURL(file);
            }
        };
        const modal = new bootstrap.Modal(document.getElementById('staffModal'));
        modal.show();
        document.getElementById('staffForm').onsubmit = function(e) {
            e.preventDefault();
            const newStaff = {
                id: staff ? staff.id : Date.now(),
                name: document.getElementById('staffName').value,
                subjects: document.getElementById('staffSubjects').value,
                schedule: document.getElementById('staffSchedule').value,
                role: document.getElementById('staffRole').value,
                salary: document.getElementById('staffSalary').value,
                payrollStatus: document.getElementById('staffPayrollStatus').value,
                leave: document.getElementById('staffLeave').value,
                attendance: document.getElementById('staffAttendance').value,
                photo: photoPreview.src && photoPreview.style.display !== 'none' ? photoPreview.src : ''
            };
            if (idx !== null) {
                staffList[idx] = newStaff;
                showToast('Staff updated', 'success');
            } else {
                staffList.push(newStaff);
                showToast('Staff added', 'success');
            }
            modal.hide();
            renderStaffTable();
        };
    }

    // --- Mock Data for Attendance ---
    const attendanceClasses = ['JSS1A', 'JSS1B', 'JSS2A', 'JSS2B'];
    const attendanceStudents = [
        { id: 1, name: 'John Doe', regNo: 'SCH-2024-000001', absences: 2, status: 'Present' },
        { id: 2, name: 'Jane Smith', regNo: 'SCH-2024-000002', absences: 3, status: 'Absent' },
        { id: 3, name: 'Samuel Okoro', regNo: 'SCH-2024-000003', absences: 1, status: 'Late' },
        { id: 4, name: 'Mary Ann', regNo: 'SCH-2024-000004', absences: 0, status: 'Present' },
    ];
    let attendanceHistory = [
        { date: '2024-06-01', class: 'JSS1A', ampm: 'AM', regNo: 'SCH-2024-000001', name: 'John Doe', status: 'Present' },
        { date: '2024-06-01', class: 'JSS1A', ampm: 'AM', regNo: 'SCH-2024-000002', name: 'Jane Smith', status: 'Absent' },
        { date: '2024-06-01', class: 'JSS1A', ampm: 'AM', regNo: 'SCH-2024-000003', name: 'Samuel Okoro', status: 'Late' },
    ];

    // --- Attendance Register UI ---
    function renderAttendanceRegister() {
        setMainContent(`
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Attendance Register</h2>
                <button class="btn btn-outline-primary" id="viewAttendanceHistory"><i class="bi bi-clock-history me-2"></i>History</button>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-3">
                    <label class="form-label">Class</label>
                    <select class="form-select" id="attendanceClassSelect">
                        ${attendanceClasses.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-control" id="attendanceDate" value="${new Date().toISOString().slice(0,10)}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Session</label>
                    <select class="form-select" id="attendanceAMPM">
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
                <div class="col-md-3 d-flex align-items-end">
                    <button class="btn btn-success me-2 w-100" id="markAllPresent"><i class="bi bi-check2-all me-1"></i>Mark All Present</button>
                    <button class="btn btn-danger w-100" id="markAllAbsent"><i class="bi bi-x-circle me-1"></i>Mark All Absent</button>
                </div>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-4">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="attendance-present-count">0</div>
                            <div>Present</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="attendance-absent-count">0</div>
                            <div>Absent</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="attendance-late-count">0</div>
                            <div>Late</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card mb-4 animate-fade-in">
                <div class="card-header"><i class="bi bi-list-check me-2"></i>Mark Register</div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped align-middle" id="attendanceTable">
                            <thead class="table-light">
                                <tr>
                                    <th>Reg No</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Consecutive Absences</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- Attendance History Modal -->
            <div class="modal fade" id="attendanceHistoryModal" tabindex="-1" aria-labelledby="attendanceHistoryModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="attendanceHistoryModalLabel">Attendance History</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <input type="text" class="form-control table-search mb-3" placeholder="Search history..." id="attendanceHistorySearch">
                    <div class="table-responsive">
                        <table class="table table-striped align-middle" id="attendanceHistoryTable">
                            <thead class="table-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Class</th>
                                    <th>Session</th>
                                    <th>Reg No</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `);
        renderAttendanceTable();
        document.getElementById('markAllPresent').onclick = () => markAllAttendance('Present');
        document.getElementById('markAllAbsent').onclick = () => markAllAttendance('Absent');
        document.getElementById('viewAttendanceHistory').onclick = showAttendanceHistoryModal;
    }

    function renderAttendanceTable() {
        const tbody = document.querySelector('#attendanceTable tbody');
        tbody.innerHTML = '';
        attendanceStudents.forEach((student, idx) => {
            const tr = document.createElement('tr');
            let alertIcon = student.absences >= 3 ? '<i class="bi bi-exclamation-triangle-fill text-danger" title="3+ consecutive absences"></i>' : '';
            tr.innerHTML = `
                <td>${student.regNo}</td>
                <td>${student.name}</td>
                <td>
                    <select class="form-select form-select-sm attendance-status-select" data-idx="${idx}">
                        <option value="Present" ${student.status==='Present'?'selected':''}>Present</option>
                        <option value="Absent" ${student.status==='Absent'?'selected':''}>Absent</option>
                        <option value="Late" ${student.status==='Late'?'selected':''}>Late</option>
                    </select>
                </td>
                <td>${student.absences} ${alertIcon}</td>
            `;
            tbody.appendChild(tr);
        });
        // Inline editing
        document.querySelectorAll('.attendance-status-select').forEach(sel => {
            sel.addEventListener('change', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                attendanceStudents[idx].status = this.value;
                showToast(attendanceStudents[idx].name + ' marked as ' + this.value, 'info');
                renderAttendanceAnalytics();
            });
        });
        renderAttendanceAnalytics();
    }

    function markAllAttendance(status) {
        attendanceStudents.forEach(s => s.status = status);
        renderAttendanceTable();
        showToast('All students marked as ' + status, 'success');
    }

    function renderAttendanceAnalytics() {
        const present = attendanceStudents.filter(s => s.status === 'Present').length;
        const absent = attendanceStudents.filter(s => s.status === 'Absent').length;
        const late = attendanceStudents.filter(s => s.status === 'Late').length;
        document.getElementById('attendance-present-count').textContent = present;
        document.getElementById('attendance-absent-count').textContent = absent;
        document.getElementById('attendance-late-count').textContent = late;
    }

    function showAttendanceHistoryModal() {
        const modal = new bootstrap.Modal(document.getElementById('attendanceHistoryModal'));
        renderAttendanceHistoryTable();
        modal.show();
    }

    function renderAttendanceHistoryTable() {
        const tbody = document.querySelector('#attendanceHistoryTable tbody');
        tbody.innerHTML = '';
        attendanceHistory.forEach((rec) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${rec.date}</td>
                <td>${rec.class}</td>
                <td>${rec.ampm}</td>
                <td>${rec.regNo}</td>
                <td>${rec.name}</td>
                <td>${rec.status}</td>
            `;
            tbody.appendChild(tr);
        });
        document.getElementById('attendanceHistorySearch').addEventListener('input', function() {
            const value = this.value.toLowerCase();
            Array.from(tbody.rows).forEach(row => {
                const rowText = Array.from(row.cells).map(cell => cell.textContent.toLowerCase()).join(' ');
                row.style.display = rowText.includes(value) ? '' : 'none';
            });
        });
    }

    // --- Mock Data for Lesson Planning ---
    const lessonSubjects = ['Math', 'English', 'Biology', 'Physics'];
    const lessonClasses = ['JSS1A', 'JSS1B', 'JSS2A', 'JSS2B'];
    let lessonPlans = [
        { id: 1, subject: 'Math', class: 'JSS1A', week: '2024-W23', title: 'Algebra Basics', objectives: 'Understand variables', topics: 'Variables, Expressions', materials: [{name:'Algebra.pdf',url:'#'}], coverage: 60, notes: 'Needs more examples', status: 'Submitted' },
        { id: 2, subject: 'English', class: 'JSS2B', week: '2024-W23', title: 'Essay Writing', objectives: 'Write essays', topics: 'Structure, Grammar', materials: [], coverage: 100, notes: '', status: 'Approved' },
    ];

    // --- Lesson Planning UI ---
    function renderLessonPlanning() {
        setMainContent(`
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Lesson Planning</h2>
                <button class="btn btn-primary" id="addLessonPlanBtn"><i class="bi bi-plus-circle me-2"></i>Add Lesson Plan</button>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-3">
                    <label class="form-label">Subject</label>
                    <select class="form-select" id="lessonSubjectSelect">
                        <option value="">All</option>
                        ${lessonSubjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Class</label>
                    <select class="form-select" id="lessonClassSelect">
                        <option value="">All</option>
                        ${lessonClasses.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Week</label>
                    <input type="week" class="form-control" id="lessonWeekSelect" value="${getCurrentWeek()}">
                </div>
                <div class="col-md-3 d-flex align-items-end">
                    <input type="text" class="form-control table-search" placeholder="Search plans..." id="lessonPlanSearch">
                </div>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-4">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="lesson-total-count">0</div>
                            <div>Total Plans</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="lesson-coverage-avg">0%</div>
                            <div>Avg. Coverage</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="lesson-pending-count">0</div>
                            <div>Pending Approvals</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card mb-4 animate-fade-in">
                <div class="card-header"><i class="bi bi-journal-bookmark-fill me-2"></i>Lesson Plans</div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped align-middle" id="lessonPlansTable">
                            <thead class="table-light">
                                <tr>
                                    <th>Subject</th>
                                    <th>Class</th>
                                    <th>Week</th>
                                    <th>Title</th>
                                    <th>Coverage</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- Modal for Add/Edit Lesson Plan -->
            <div class="modal fade" id="lessonPlanModal" tabindex="-1" aria-labelledby="lessonPlanModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="lessonPlanModalLabel">Add Lesson Plan</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form id="lessonPlanForm">
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label class="form-label">Subject</label>
                          <select class="form-select" id="lpSubject" required>
                            ${lessonSubjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Class</label>
                          <select class="form-select" id="lpClass" required>
                            ${lessonClasses.map(c => `<option value="${c}">${c}</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Week</label>
                          <input type="week" class="form-control" id="lpWeek" required>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Title</label>
                          <input type="text" class="form-control" id="lpTitle" required>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Objectives</label>
                          <textarea class="form-control" id="lpObjectives" rows="2"></textarea>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Topics</label>
                          <input type="text" class="form-control" id="lpTopics">
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Materials</label>
                          <input type="file" class="form-control" id="lpMaterials" multiple>
                          <div class="form-text">Attach PDFs, videos, etc.</div>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Coverage</label>
                          <input type="range" class="form-range" min="0" max="100" step="1" id="lpCoverage">
                          <span id="lpCoverageValue">0%</span>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Notes/Comments</label>
                          <textarea class="form-control" id="lpNotes" rows="2"></textarea>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Status</label>
                          <select class="form-select" id="lpStatus">
                            <option value="Draft">Draft</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary w-100 mt-3">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
        `);
        renderLessonPlansTable();
        document.getElementById('addLessonPlanBtn').onclick = openAddLessonPlanModal;
    }

    function getCurrentWeek() {
        const now = new Date();
        const onejan = new Date(now.getFullYear(),0,1);
        const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay()+1)/7);
        return `${now.getFullYear()}-W${week.toString().padStart(2,'0')}`;
    }

    function renderLessonPlansTable() {
        const tbody = document.querySelector('#lessonPlansTable tbody');
        tbody.innerHTML = '';
        let filtered = lessonPlans.filter(lp => {
            const subject = document.getElementById('lessonSubjectSelect').value;
            const klass = document.getElementById('lessonClassSelect').value;
            const week = document.getElementById('lessonWeekSelect').value;
            const search = document.getElementById('lessonPlanSearch').value.toLowerCase();
            return (!subject || lp.subject === subject) &&
                   (!klass || lp.class === klass) &&
                   (!week || lp.week === week) &&
                   (lp.title.toLowerCase().includes(search) || lp.objectives.toLowerCase().includes(search) || lp.topics.toLowerCase().includes(search));
        });
        filtered.forEach((lp, idx) => {
            let statusBadge = lp.status === 'Approved' ? 'bg-success' : lp.status === 'Submitted' ? 'bg-warning text-dark' : lp.status === 'Rejected' ? 'bg-danger' : 'bg-secondary';
            tbody.innerHTML += `
                <tr>
                    <td>${lp.subject}</td>
                    <td>${lp.class}</td>
                    <td>${lp.week}</td>
                    <td>${lp.title}</td>
                    <td><div class="progress" style="height: 20px;"><div class="progress-bar ${lp.coverage===100?'bg-success':'bg-info'}" role="progressbar" style="width: ${lp.coverage}%">${lp.coverage}%</div></div></td>
                    <td><span class="badge ${statusBadge}">${lp.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary me-1" onclick="window.editLessonPlan(${lp.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteLessonPlan(${lp.id})"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        // Analytics widgets
        document.getElementById('lesson-total-count').textContent = filtered.length;
        document.getElementById('lesson-coverage-avg').textContent = filtered.length ? Math.round(filtered.reduce((a,b)=>a+b.coverage,0)/filtered.length) + '%' : '0%';
        document.getElementById('lesson-pending-count').textContent = filtered.filter(lp=>lp.status==='Submitted').length;
        // Filters
        document.getElementById('lessonSubjectSelect').onchange = renderLessonPlansTable;
        document.getElementById('lessonClassSelect').onchange = renderLessonPlansTable;
        document.getElementById('lessonWeekSelect').onchange = renderLessonPlansTable;
        document.getElementById('lessonPlanSearch').oninput = renderLessonPlansTable;
    }

    // --- Add/Edit Lesson Plan Modal ---
    window.editLessonPlan = function(id) {
        const lp = lessonPlans.find(lp => lp.id === id);
        openLessonPlanModal('Edit Lesson Plan', lp, id);
    };
    window.deleteLessonPlan = function(id) {
        if (confirm('Delete this lesson plan?')) {
            lessonPlans = lessonPlans.filter(lp => lp.id !== id);
            renderLessonPlansTable();
            showToast('Lesson plan deleted', 'success');
        }
    };
    function openAddLessonPlanModal() {
        openLessonPlanModal('Add Lesson Plan', null, null);
    }
    function openLessonPlanModal(title, lp, id) {
        document.getElementById('lessonPlanModalLabel').textContent = title;
        document.getElementById('lpSubject').value = lp ? lp.subject : lessonSubjects[0];
        document.getElementById('lpClass').value = lp ? lp.class : lessonClasses[0];
        document.getElementById('lpWeek').value = lp ? lp.week : getCurrentWeek();
        document.getElementById('lpTitle').value = lp ? lp.title : '';
        document.getElementById('lpObjectives').value = lp ? lp.objectives : '';
        document.getElementById('lpTopics').value = lp ? lp.topics : '';
        document.getElementById('lpCoverage').value = lp ? lp.coverage : 0;
        document.getElementById('lpCoverageValue').textContent = (lp ? lp.coverage : 0) + '%';
        document.getElementById('lpNotes').value = lp ? lp.notes : '';
        document.getElementById('lpStatus').value = lp ? lp.status : 'Draft';
        document.getElementById('lpMaterials').value = '';
        document.getElementById('lpCoverage').oninput = function() {
            document.getElementById('lpCoverageValue').textContent = this.value + '%';
        };
        const modal = new bootstrap.Modal(document.getElementById('lessonPlanModal'));
        modal.show();
        document.getElementById('lessonPlanForm').onsubmit = function(e) {
            e.preventDefault();
            const newPlan = {
                id: id || Date.now(),
                subject: document.getElementById('lpSubject').value,
                class: document.getElementById('lpClass').value,
                week: document.getElementById('lpWeek').value,
                title: document.getElementById('lpTitle').value,
                objectives: document.getElementById('lpObjectives').value,
                topics: document.getElementById('lpTopics').value,
                materials: [], // File upload UI only
                coverage: parseInt(document.getElementById('lpCoverage').value),
                notes: document.getElementById('lpNotes').value,
                status: document.getElementById('lpStatus').value
            };
            if (id) {
                lessonPlans = lessonPlans.map(lp => lp.id === id ? newPlan : lp);
                showToast('Lesson plan updated', 'success');
            } else {
                lessonPlans.push(newPlan);
                showToast('Lesson plan added', 'success');
            }
            modal.hide();
            renderLessonPlansTable();
        };
    }

    // --- Mock Data for Test Creation ---
    const testSubjects = ['Math', 'English', 'Biology', 'Physics'];
    const testClasses = ['JSS1A', 'JSS1B', 'JSS2A', 'JSS2B'];
    let tests = [
        { id: 1, title: 'Algebra Test', subject: 'Math', class: 'JSS1A', date: '2024-06-10', duration: 40, status: 'Draft', questions: [
            { type: 'MCQ', text: 'What is 2+2?', options: ['3','4','5','6'], correct: 1, marks: 2, topic: 'Addition' },
            { type: 'Short', text: 'Define variable.', marks: 3, topic: 'Algebra' }
        ] },
        { id: 2, title: 'Essay Writing', subject: 'English', class: 'JSS2B', date: '2024-06-12', duration: 60, status: 'Submitted', questions: [
            { type: 'Long', text: 'Write an essay on your school.', marks: 10, topic: 'Essay' }
        ] }
    ];
    let questionBank = [
        { type: 'MCQ', text: 'What is the capital of France?', options: ['London','Berlin','Paris','Rome'], correct: 2, marks: 2, topic: 'Geography' },
        { type: 'Short', text: 'Explain photosynthesis.', marks: 3, topic: 'Biology' }
    ];

    // --- Test Creation UI ---
    function renderTestCreation() {
        setMainContent(`
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Test Creation & Printing</h2>
                <button class="btn btn-primary" id="addTestBtn"><i class="bi bi-plus-circle me-2"></i>Create Test</button>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-3">
                    <label class="form-label">Subject</label>
                    <select class="form-select" id="testSubjectSelect">
                        <option value="">All</option>
                        ${testSubjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Class</label>
                    <select class="form-select" id="testClassSelect">
                        <option value="">All</option>
                        ${testClasses.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Status</label>
                    <select class="form-select" id="testStatusSelect">
                        <option value="">All</option>
                        <option value="Draft">Draft</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div class="col-md-3 d-flex align-items-end">
                    <input type="text" class="form-control table-search" placeholder="Search tests..." id="testSearch">
                </div>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-3">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="test-total-count">0</div>
                            <div>Total Tests</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="test-pending-count">0</div>
                            <div>Pending Approval</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="test-mcq-count">0</div>
                            <div>Auto-markable MCQs</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="test-avg-marks">0</div>
                            <div>Avg. Marks</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card mb-4 animate-fade-in">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-clipboard2-check-fill me-2"></i>Tests</span>
                    <button class="btn btn-outline-secondary btn-sm" id="exportTestsPDF"><i class="bi bi-file-earmark-pdf me-1"></i>Export PDF</button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped align-middle" id="testsTable">
                            <thead class="table-light">
                                <tr>
                                    <th>Title</th>
                                    <th>Subject</th>
                                    <th>Class</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Questions</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- Modal for Add/Edit Test -->
            <div class="modal fade" id="testModal" tabindex="-1" aria-labelledby="testModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-xl">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="testModalLabel">Create Test</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form id="testForm">
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label class="form-label">Title</label>
                          <input type="text" class="form-control" id="testTitle" required>
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Subject</label>
                          <select class="form-select" id="testSubject" required>
                            ${testSubjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Class</label>
                          <select class="form-select" id="testClass" required>
                            ${testClasses.map(c => `<option value="${c}">${c}</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Date</label>
                          <input type="date" class="form-control" id="testDate" required>
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Duration (min)</label>
                          <input type="number" class="form-control" id="testDuration" min="1" required>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Questions</label>
                          <div id="questionsBuilder"></div>
                          <button type="button" class="btn btn-outline-primary mt-2" id="addQuestionBtn"><i class="bi bi-plus-circle"></i> Add Question</button>
                          <button type="button" class="btn btn-outline-secondary mt-2" id="importFromBankBtn"><i class="bi bi-bank"></i> Import from Question Bank</button>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Live Preview</label>
                          <div class="border rounded p-3 mb-2" id="testLivePreview" style="background:#f8f9fa;"></div>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary w-100 mt-3">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <!-- Modal for Importing from Question Bank -->
            <div class="modal fade" id="questionBankModal" tabindex="-1" aria-labelledby="questionBankModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="questionBankModalLabel">Question Bank</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="table-responsive">
                      <table class="table table-striped align-middle" id="questionBankTable">
                        <thead class="table-light">
                          <tr>
                            <th>Type</th>
                            <th>Question</th>
                            <th>Topic</th>
                            <th>Marks</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `);
        renderTestsTable();
        document.getElementById('addTestBtn').onclick = openAddTestModal;
        document.getElementById('exportTestsPDF').onclick = () => showToast('PDF export coming soon!', 'info');
    }

    function renderTestsTable() {
        const tbody = document.querySelector('#testsTable tbody');
        tbody.innerHTML = '';
        let filtered = tests.filter(t => {
            const subject = document.getElementById('testSubjectSelect').value;
            const klass = document.getElementById('testClassSelect').value;
            const status = document.getElementById('testStatusSelect').value;
            const search = document.getElementById('testSearch').value.toLowerCase();
            return (!subject || t.subject === subject) &&
                   (!klass || t.class === klass) &&
                   (!status || t.status === status) &&
                   (t.title.toLowerCase().includes(search));
        });
        filtered.forEach((t, idx) => {
            let statusBadge = t.status === 'Approved' ? 'bg-success' : t.status === 'Submitted' ? 'bg-warning text-dark' : t.status === 'Rejected' ? 'bg-danger' : 'bg-secondary';
            tbody.innerHTML += `
                <tr>
                    <td>${t.title}</td>
                    <td>${t.subject}</td>
                    <td>${t.class}</td>
                    <td>${t.date}</td>
                    <td><span class="badge ${statusBadge}">${t.status}</span></td>
                    <td>${t.questions.length}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary me-1" onclick="window.editTest(${t.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteTest(${t.id})"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        // Analytics widgets
        document.getElementById('test-total-count').textContent = filtered.length;
        document.getElementById('test-pending-count').textContent = filtered.filter(t=>t.status==='Submitted').length;
        document.getElementById('test-mcq-count').textContent = filtered.reduce((a,b)=>a+b.questions.filter(q=>q.type==='MCQ').length,0);
        document.getElementById('test-avg-marks').textContent = filtered.length ? Math.round(filtered.reduce((a,b)=>a+b.questions.reduce((x,y)=>x+y.marks,0),0)/filtered.length) : 0;
        // Filters
        document.getElementById('testSubjectSelect').onchange = renderTestsTable;
        document.getElementById('testClassSelect').onchange = renderTestsTable;
        document.getElementById('testStatusSelect').onchange = renderTestsTable;
        document.getElementById('testSearch').oninput = renderTestsTable;
    }

    // --- Add/Edit Test Modal ---
    window.editTest = function(id) {
        const t = tests.find(t => t.id === id);
        openTestModal('Edit Test', t, id);
    };
    window.deleteTest = function(id) {
        if (confirm('Delete this test?')) {
            tests = tests.filter(t => t.id !== id);
            renderTestsTable();
            showToast('Test deleted', 'success');
        }
    };
    function openAddTestModal() {
        openTestModal('Create Test', null, null);
    }
    function openTestModal(title, t, id) {
        document.getElementById('testModalLabel').textContent = title;
        document.getElementById('testTitle').value = t ? t.title : '';
        document.getElementById('testSubject').value = t ? t.subject : testSubjects[0];
        document.getElementById('testClass').value = t ? t.class : testClasses[0];
        document.getElementById('testDate').value = t ? t.date : new Date().toISOString().slice(0,10);
        document.getElementById('testDuration').value = t ? t.duration : 40;
        let questions = t ? JSON.parse(JSON.stringify(t.questions)) : [];
        renderQuestionsBuilder(questions);
        renderTestLivePreview(questions);
        document.getElementById('addQuestionBtn').onclick = () => {
            questions.push({ type: 'MCQ', text: '', options: ['', '', '', ''], correct: 0, marks: 1, topic: '' });
            renderQuestionsBuilder(questions);
            renderTestLivePreview(questions);
        };
        document.getElementById('importFromBankBtn').onclick = () => openQuestionBankModal(questions);
        document.getElementById('questionsBuilder').oninput = () => renderTestLivePreview(questions);
        const modal = new bootstrap.Modal(document.getElementById('testModal'));
        modal.show();
        document.getElementById('testForm').onsubmit = function(e) {
            e.preventDefault();
            const newTest = {
                id: id || Date.now(),
                title: document.getElementById('testTitle').value,
                subject: document.getElementById('testSubject').value,
                class: document.getElementById('testClass').value,
                date: document.getElementById('testDate').value,
                duration: parseInt(document.getElementById('testDuration').value),
                status: 'Draft',
                questions: questions
            };
            if (id) {
                tests = tests.map(t => t.id === id ? newTest : t);
                showToast('Test updated', 'success');
            } else {
                tests.push(newTest);
                showToast('Test created', 'success');
            }
            modal.hide();
            renderTestsTable();
        };
    }

    function renderQuestionsBuilder(questions) {
        const qb = document.getElementById('questionsBuilder');
        qb.innerHTML = '';
        questions.forEach((q, idx) => {
            qb.innerHTML += `<div class="card mb-2"><div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-bold">Q${idx+1} (${q.type})</span>
                    <div>
                        <button type="button" class="btn btn-sm btn-outline-secondary me-1" onclick="window.moveQuestion(${idx},-1)"><i class="bi bi-arrow-up"></i></button>
                        <button type="button" class="btn btn-sm btn-outline-secondary me-1" onclick="window.moveQuestion(${idx},1)"><i class="bi bi-arrow-down"></i></button>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="window.deleteQuestion(${idx})"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
                <div class="mb-2">
                    <label class="form-label">Type</label>
                    <select class="form-select form-select-sm question-type-select" data-idx="${idx}">
                        <option value="MCQ" ${q.type==='MCQ'?'selected':''}>MCQ</option>
                        <option value="Short" ${q.type==='Short'?'selected':''}>Short Answer</option>
                        <option value="Long" ${q.type==='Long'?'selected':''}>Long Answer</option>
                    </select>
                </div>
                <div class="mb-2">
                    <label class="form-label">Question</label>
                    <input type="text" class="form-control form-control-sm question-text-input" data-idx="${idx}" value="${q.text}">
                </div>
                <div class="mb-2">
                    <label class="form-label">Topic</label>
                    <input type="text" class="form-control form-control-sm question-topic-input" data-idx="${idx}" value="${q.topic||''}">
                </div>
                <div class="mb-2">
                    <label class="form-label">Marks</label>
                    <input type="number" class="form-control form-control-sm question-marks-input" data-idx="${idx}" value="${q.marks||1}" min="1">
                </div>
                ${q.type==='MCQ' ? `
                <div class="mb-2">
                    <label class="form-label">Options</label>
                    ${q.options.map((opt,i) => `<div class="input-group mb-1"><span class="input-group-text"><input type="radio" name="mcq-correct-${idx}" ${q.correct===i?'checked':''} data-idx="${idx}" data-opt="${i}" class="mcq-correct-radio"></span><input type="text" class="form-control form-control-sm mcq-option-input" data-idx="${idx}" data-opt="${i}" value="${opt}"></div>`).join('')}
                </div>
                <div class="mb-2">
                    <label class="form-label">Auto-marking Preview</label>
                    <div class="alert alert-info p-2 mb-0">Correct answer: <b>${q.options[q.correct]}</b></div>
                </div>
                ` : ''}
                <div class="mb-2">
                    <label class="form-label">Attach File</label>
                    <input type="file" class="form-control form-control-sm">
                </div>
            </div></div>`;
        });
        // Inline editing
        qb.querySelectorAll('.question-type-select').forEach(sel => {
            sel.addEventListener('change', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                questions[idx].type = this.value;
                if (this.value==='MCQ' && !questions[idx].options) questions[idx].options = ['', '', '', ''];
                renderQuestionsBuilder(questions);
                renderTestLivePreview(questions);
            });
        });
        qb.querySelectorAll('.question-text-input').forEach(inp => {
            inp.addEventListener('input', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                questions[idx].text = this.value;
                renderTestLivePreview(questions);
            });
        });
        qb.querySelectorAll('.question-topic-input').forEach(inp => {
            inp.addEventListener('input', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                questions[idx].topic = this.value;
            });
        });
        qb.querySelectorAll('.question-marks-input').forEach(inp => {
            inp.addEventListener('input', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                questions[idx].marks = parseInt(this.value);
                renderTestLivePreview(questions);
            });
        });
        qb.querySelectorAll('.mcq-option-input').forEach(inp => {
            inp.addEventListener('input', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                const opt = parseInt(this.getAttribute('data-opt'));
                questions[idx].options[opt] = this.value;
                renderTestLivePreview(questions);
            });
        });
        qb.querySelectorAll('.mcq-correct-radio').forEach(radio => {
            radio.addEventListener('change', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                const opt = parseInt(this.getAttribute('data-opt'));
                questions[idx].correct = opt;
                renderTestLivePreview(questions);
            });
        });
    }
    window.moveQuestion = function(idx, dir) {
        const questions = Array.from(document.querySelectorAll('.question-type-select')).map((sel, i) => {
            return {
                type: sel.value,
                text: document.querySelectorAll('.question-text-input')[i].value,
                topic: document.querySelectorAll('.question-topic-input')[i].value,
                marks: parseInt(document.querySelectorAll('.question-marks-input')[i].value),
                options: sel.value==='MCQ' ? Array.from(document.querySelectorAll('.mcq-option-input')).slice(i*4,i*4+4).map(inp=>inp.value) : undefined,
                correct: sel.value==='MCQ' ? Array.from(document.querySelectorAll(`input[name="mcq-correct-${i}"]`)).findIndex(r=>r.checked) : undefined
            };
        });
        if ((dir === -1 && idx === 0) || (dir === 1 && idx === questions.length-1)) return;
        const temp = questions[idx];
        questions[idx] = questions[idx+dir];
        questions[idx+dir] = temp;
        renderQuestionsBuilder(questions);
        renderTestLivePreview(questions);
    };
    window.deleteQuestion = function(idx) {
        const questions = Array.from(document.querySelectorAll('.question-type-select')).map((sel, i) => {
            return {
                type: sel.value,
                text: document.querySelectorAll('.question-text-input')[i].value,
                topic: document.querySelectorAll('.question-topic-input')[i].value,
                marks: parseInt(document.querySelectorAll('.question-marks-input')[i].value),
                options: sel.value==='MCQ' ? Array.from(document.querySelectorAll('.mcq-option-input')).slice(i*4,i*4+4).map(inp=>inp.value) : undefined,
                correct: sel.value==='MCQ' ? Array.from(document.querySelectorAll(`input[name="mcq-correct-${i}"]`)).findIndex(r=>r.checked) : undefined
            };
        });
        questions.splice(idx, 1);
        renderQuestionsBuilder(questions);
        renderTestLivePreview(questions);
    };
    function renderTestLivePreview(questions) {
        const preview = document.getElementById('testLivePreview');
        preview.innerHTML = questions.map((q, idx) => {
            if (q.type === 'MCQ') {
                return `<div class="mb-2"><b>Q${idx+1}:</b> ${q.text}<ul>${q.options.map((opt,i)=>`<li${q.correct===i?' class=\'text-success fw-bold\'':''}>${opt}</li>`).join('')}</ul></div>`;
            } else {
                return `<div class="mb-2"><b>Q${idx+1}:</b> ${q.text} <span class="badge bg-secondary">${q.type}</span></div>`;
            }
        }).join('');
    }
    function openQuestionBankModal(questions) {
        const modal = new bootstrap.Modal(document.getElementById('questionBankModal'));
        renderQuestionBankTable(questions, modal);
        modal.show();
    }
    function renderQuestionBankTable(questions, modal) {
        const tbody = document.getElementById('questionBankTable').querySelector('tbody');
        tbody.innerHTML = '';
        questionBank.forEach((q, idx) => {
            tbody.innerHTML += `<tr>
                <td>${q.type}</td>
                <td>${q.text}</td>
                <td>${q.topic||''}</td>
                <td>${q.marks||1}</td>
                <td><button class="btn btn-sm btn-outline-primary" onclick="window.importQuestionFromBank(${idx})"><i class="bi bi-arrow-down-circle"></i> Import</button></td>
            </tr>`;
        });
        window.importQuestionFromBank = function(qidx) {
            questions.push(JSON.parse(JSON.stringify(questionBank[qidx])));
            renderQuestionsBuilder(questions);
            renderTestLivePreview(questions);
            modal.hide();
        };
    }

    // --- Mock Data for Homework ---
    const homeworkSubjects = ['Math', 'English', 'Biology', 'Physics'];
    const homeworkClasses = ['JSS1A', 'JSS1B', 'JSS2A', 'JSS2B'];
    let homeworkList = [
        { id: 1, title: 'Algebra Homework', subject: 'Math', classes: ['JSS1A'], due: '2024-06-15', status: 'Assigned', files: [{name:'AlgebraHW.pdf',url:'#'}], instructions: 'Solve all questions.', submissions: 12, total: 15 },
        { id: 2, title: 'Essay', subject: 'English', classes: ['JSS2B'], due: '2024-06-16', status: 'Submitted', files: [], instructions: 'Write an essay on your best friend.', submissions: 10, total: 12 }
    ];
    let homeworkSubmissions = [
        { id: 1, student: 'John Doe', class: 'JSS1A', status: 'Submitted', file: {name:'John_HW.pdf',url:'#'} },
        { id: 2, student: 'Jane Smith', class: 'JSS1A', status: 'Not Submitted', file: null }
    ];

    // --- Homework Assignment UI ---
    function renderHomeworkAssignment() {
        setMainContent(`
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Homework Assignment</h2>
                <button class="btn btn-primary" id="addHomeworkBtn"><i class="bi bi-plus-circle me-2"></i>Assign Homework</button>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-3">
                    <label class="form-label">Subject</label>
                    <select class="form-select" id="homeworkSubjectSelect">
                        <option value="">All</option>
                        ${homeworkSubjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Class</label>
                    <select class="form-select" id="homeworkClassSelect">
                        <option value="">All</option>
                        ${homeworkClasses.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Status</label>
                    <select class="form-select" id="homeworkStatusSelect">
                        <option value="">All</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Graded">Graded</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
                <div class="col-md-3 d-flex align-items-end">
                    <input type="text" class="form-control table-search" placeholder="Search homework..." id="homeworkSearch">
                </div>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-3">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="homework-total-count">0</div>
                            <div>Total Assigned</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="homework-submitted-count">0</div>
                            <div>Submitted</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="homework-overdue-count">0</div>
                            <div>Overdue</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card dashboard-card animate-fade-in text-center">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="homework-graded-count">0</div>
                            <div>Graded</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card mb-4 animate-fade-in">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-book-fill me-2"></i>Homework</span>
                    <div>
                        <button class="btn btn-outline-secondary btn-sm me-2" id="bulkMarkGraded"><i class="bi bi-check2-square me-1"></i>Mark as Graded</button>
                        <button class="btn btn-outline-secondary btn-sm" id="bulkSendReminders"><i class="bi bi-bell me-1"></i>Send Reminders</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped align-middle" id="homeworkTable">
                            <thead class="table-light">
                                <tr>
                                    <th>Title</th>
                                    <th>Subject</th>
                                    <th>Class(es)</th>
                                    <th>Due</th>
                                    <th>Status</th>
                                    <th>Files</th>
                                    <th>Submissions</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- Modal for Add/Edit Homework -->
            <div class="modal fade" id="homeworkModal" tabindex="-1" aria-labelledby="homeworkModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="homeworkModalLabel">Assign Homework</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form id="homeworkForm">
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label class="form-label">Title</label>
                          <input type="text" class="form-control" id="hwTitle" required>
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Subject</label>
                          <select class="form-select" id="hwSubject" required>
                            ${homeworkSubjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Class(es)</label>
                          <select class="form-select" id="hwClasses" multiple required>
                            ${homeworkClasses.map(c => `<option value="${c}">${c}</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Due Date</label>
                          <input type="date" class="form-control" id="hwDue" required>
                        </div>
                        <div class="col-md-9">
                          <label class="form-label">Instructions</label>
                          <textarea class="form-control" id="hwInstructions" rows="2"></textarea>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Attach Files</label>
                          <input type="file" class="form-control" id="hwFiles" multiple>
                          <div id="hwFilePreview" class="mt-2"></div>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary w-100 mt-3">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <!-- Modal for Student/Parent View -->
            <div class="modal fade" id="homeworkStudentViewModal" tabindex="-1" aria-labelledby="homeworkStudentViewModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="homeworkStudentViewModalLabel">Student/Parent View</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body" id="homeworkStudentViewBody"></div>
                </div>
              </div>
            </div>
        `);
        renderHomeworkTable();
        document.getElementById('addHomeworkBtn').onclick = openAddHomeworkModal;
        document.getElementById('bulkMarkGraded').onclick = () => showToast('Bulk mark as graded coming soon!', 'info');
        document.getElementById('bulkSendReminders').onclick = () => showToast('Bulk reminders coming soon!', 'info');
    }

    function renderHomeworkTable() {
        const tbody = document.querySelector('#homeworkTable tbody');
        tbody.innerHTML = '';
        let filtered = homeworkList.filter(hw => {
            const subject = document.getElementById('homeworkSubjectSelect').value;
            const klass = document.getElementById('homeworkClassSelect').value;
            const status = document.getElementById('homeworkStatusSelect').value;
            const search = document.getElementById('homeworkSearch').value.toLowerCase();
            return (!subject || hw.subject === subject) &&
                   (!klass || hw.classes.includes(klass)) &&
                   (!status || hw.status === status) &&
                   (hw.title.toLowerCase().includes(search) || hw.instructions.toLowerCase().includes(search));
        });
        filtered.forEach((hw, idx) => {
            let statusBadge = hw.status === 'Graded' ? 'bg-success' : hw.status === 'Submitted' ? 'bg-warning text-dark' : hw.status === 'Overdue' ? 'bg-danger' : 'bg-secondary';
            tbody.innerHTML += `
                <tr>
                    <td>${hw.title}</td>
                    <td>${hw.subject}</td>
                    <td>${hw.classes.join(', ')}</td>
                    <td>${hw.due}</td>
                    <td><span class="badge ${statusBadge}">${hw.status}</span></td>
                    <td>${hw.files.map(f=>`<a href="${f.url}" target="_blank">${f.name}</a>`).join('<br>')}</td>
                    <td>${hw.submissions}/${hw.total}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary me-1" onclick="window.editHomework(${hw.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger me-1" onclick="window.deleteHomework(${hw.id})"><i class="bi bi-trash"></i></button>
                        <button class="btn btn-sm btn-outline-info" onclick="window.showHomeworkStudentView(${hw.id})"><i class="bi bi-person-lines-fill"></i></button>
                    </td>
                </tr>
            `;
        });
        // Analytics widgets
        document.getElementById('homework-total-count').textContent = filtered.length;
        document.getElementById('homework-submitted-count').textContent = filtered.filter(hw=>hw.status==='Submitted').length;
        document.getElementById('homework-overdue-count').textContent = filtered.filter(hw=>hw.status==='Overdue').length;
        document.getElementById('homework-graded-count').textContent = filtered.filter(hw=>hw.status==='Graded').length;
        // Filters
        document.getElementById('homeworkSubjectSelect').onchange = renderHomeworkTable;
        document.getElementById('homeworkClassSelect').onchange = renderHomeworkTable;
        document.getElementById('homeworkStatusSelect').onchange = renderHomeworkTable;
        document.getElementById('homeworkSearch').oninput = renderHomeworkTable;
    }

    // --- Add/Edit Homework Modal ---
    window.editHomework = function(id) {
        const hw = homeworkList.find(hw => hw.id === id);
        openHomeworkModal('Edit Homework', hw, id);
    };
    window.deleteHomework = function(id) {
        if (confirm('Delete this homework?')) {
            homeworkList = homeworkList.filter(hw => hw.id !== id);
            renderHomeworkTable();
            showToast('Homework deleted', 'success');
        }
    };
    function openAddHomeworkModal() {
        openHomeworkModal('Assign Homework', null, null);
    }
    function openHomeworkModal(title, hw, id) {
        document.getElementById('homeworkModalLabel').textContent = title;
        document.getElementById('hwTitle').value = hw ? hw.title : '';
        document.getElementById('hwSubject').value = hw ? hw.subject : homeworkSubjects[0];
        const hwClassesSelect = document.getElementById('hwClasses');
        Array.from(hwClassesSelect.options).forEach(opt => {
            opt.selected = hw && hw.classes.includes(opt.value);
        });
        document.getElementById('hwDue').value = hw ? hw.due : new Date().toISOString().slice(0,10);
        document.getElementById('hwInstructions').value = hw ? hw.instructions : '';
        document.getElementById('hwFiles').value = '';
        document.getElementById('hwFilePreview').innerHTML = hw && hw.files.length ? hw.files.map(f=>`<div><i class='bi bi-file-earmark'></i> ${f.name}</div>`).join('') : '';
        document.getElementById('hwFiles').onchange = function(e) {
            const files = Array.from(e.target.files);
            document.getElementById('hwFilePreview').innerHTML = files.map(f=>`<div><i class='bi bi-file-earmark'></i> ${f.name}</div>`).join('');
        };
        const modal = new bootstrap.Modal(document.getElementById('homeworkModal'));
        modal.show();
        document.getElementById('homeworkForm').onsubmit = function(e) {
            e.preventDefault();
            const newHW = {
                id: id || Date.now(),
                title: document.getElementById('hwTitle').value,
                subject: document.getElementById('hwSubject').value,
                classes: Array.from(document.getElementById('hwClasses').selectedOptions).map(opt=>opt.value),
                due: document.getElementById('hwDue').value,
                instructions: document.getElementById('hwInstructions').value,
                files: [], // File upload UI only
                status: 'Assigned',
                submissions: hw ? hw.submissions : 0,
                total: hw ? hw.total : 15
            };
            if (id) {
                homeworkList = homeworkList.map(hw => hw.id === id ? newHW : hw);
                showToast('Homework updated', 'success');
            } else {
                homeworkList.push(newHW);
                showToast('Homework assigned', 'success');
            }
            modal.hide();
            renderHomeworkTable();
        };
    }
    // --- Student/Parent View Modal ---
    window.showHomeworkStudentView = function(id) {
        const hw = homeworkList.find(hw => hw.id === id);
        const body = document.getElementById('homeworkStudentViewBody');
        body.innerHTML = `
            <h4>${hw.title}</h4>
            <div><b>Subject:</b> ${hw.subject}</div>
            <div><b>Class(es):</b> ${hw.classes.join(', ')}</div>
            <div><b>Due:</b> ${hw.due}</div>
            <div><b>Instructions:</b> ${hw.instructions}</div>
            <div><b>Files:</b> ${hw.files.map(f=>`<a href='${f.url}' target='_blank'>${f.name}</a>`).join('<br>')}</div>
            <div class='mt-3'><button class='btn btn-success'>Mark as Completed</button></div>
        `;
        const modal = new bootstrap.Modal(document.getElementById('homeworkStudentViewModal'));
        modal.show();
    }

    // --- Main Content Loader ---
    function setMainContent(html) {
        mainContent.classList.remove('animate-fade-in');
        void mainContent.offsetWidth;
        mainContent.innerHTML = html;
        mainContent.classList.add('animate-fade-in');
    }

    // --- Navigation ---
    document.querySelector('.navbar-brand').addEventListener('click', function(e) {
        e.preventDefault();
        showDashboard();
    });
    navLinks.forEach(module => {
        const nav = document.getElementById('nav-' + module.id);
        if (nav) {
            nav.addEventListener('click', function(e) {
                e.preventDefault();
                loadModuleUI(module.id);
            });
        }
    });
    // Quick actions
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'open-student-management') {
            loadModuleUI('students');
        }
    });

    // --- Dashboard Loader ---
    function showDashboard() {
        document.getElementById('enhanced-dashboard').style.display = '';
        document.getElementById('dashboard-cards').style.display = 'none';
    }

    // --- Toast notifications (reuse previous implementation) ---
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toastId = 'toast' + Date.now();
        const icon = type === 'success' ? 'bi-check-circle-fill' : type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill';
        const bg = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : 'bg-primary';
        const text = type === 'success' ? 'text-white' : type === 'danger' ? 'text-white' : 'text-white';
        const toast = document.createElement('div');
        toast.className = `toast align-items-center ${bg} ${text}`;
        toast.id = toastId;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.innerHTML = `<div class="d-flex"><div class="toast-body"><i class="bi ${icon} me-2"></i>${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();
        toast.addEventListener('hidden.bs.toast', () => toast.remove());
    }

    // --- Initial load: show dashboard ---
    showDashboard();

    // --- Currency Support ---
    let currency = 'both'; // 'usd', 'zig', or 'both'
    let usdToZig = 1500; // 1 USD = 1500 Zig (editable)

    // --- Mock Data for Finance & Fees ---
    let financeStudents = [
        { id: 1, name: 'Tendai Moyo', class: 'Form 1A', total: 120, paid: 80, due: 40, status: 'Partial', duesByTerm: { '1st': 60, '2nd': 60, '3rd': 0 }, history: [
            { date: '2024-06-01', amount: 40, method: 'Cash', receipt: '#' },
            { date: '2024-06-10', amount: 40, method: 'Transfer', receipt: '#' }
        ] },
        { id: 2, name: 'Rutendo Chikafu', class: 'Form 2B', total: 100, paid: 100, due: 0, status: 'Paid', duesByTerm: { '1st': 50, '2nd': 50, '3rd': 0 }, history: [
            { date: '2024-06-05', amount: 100, method: 'POS', receipt: '#' }
        ] },
        { id: 3, name: 'Takudzwa Ncube', class: 'Form 3C', total: 150, paid: 60, due: 90, status: 'Partial', duesByTerm: { '1st': 50, '2nd': 50, '3rd': 50 }, history: [
            { date: '2024-06-03', amount: 60, method: 'Cash', receipt: '#' }
        ] },
        { id: 4, name: 'Nyasha Dube', class: 'Upper 6A', total: 200, paid: 0, due: 200, status: 'Unpaid', duesByTerm: { '1st': 100, '2nd': 100, '3rd': 0 }, history: [] },
        { id: 5, name: 'Kudzai Mlambo', class: 'Form 2A', total: 110, paid: 70, due: 40, status: 'Partial', duesByTerm: { '1st': 60, '2nd': 50, '3rd': 0 }, history: [
            { date: '2024-06-07', amount: 70, method: 'Transfer', receipt: '#' }
        ] },
        { id: 6, name: 'Rufaro Chirwa', class: 'Lower 6B', total: 180, paid: 120, due: 60, status: 'Partial', duesByTerm: { '1st': 60, '2nd': 60, '3rd': 60 }, history: [
            { date: '2024-06-09', amount: 120, method: 'POS', receipt: '#' }
        ] }
    ];
    let financeFeeStructure = [
        { class: 'JSS1A', term: '1st', amount: 20 },
        { class: 'JSS2B', term: '1st', amount: 18 }
    ];
    let financeTransactions = [
        { id: 1, student: 'John Doe', class: 'JSS1A', date: '2024-06-10', amount: 5000, method: 'Transfer', status: 'Completed' },
        { id: 2, student: 'Jane Smith', class: 'JSS2B', date: '2024-06-05', amount: 18000, method: 'POS', status: 'Completed' }
    ];
    let financePayroll = [
        { id: 1, staff: 'Mr. Ayo Bello', month: '2024-06', amount: 80000, status: 'Paid' },
        { id: 2, staff: 'Mrs. Grace Udo', month: '2024-06', amount: 75000, status: 'Pending' }
    ];

    // --- Finance & Fees UI ---
    function renderFinanceFees() {
        setMainContent(`
      <div class="card shadow-lg border-0 animate-fade-in" style="background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 class="mb-0"><i class="bi bi-cash-stack me-2 text-success"></i>Finance Module</h2>
              <small class="text-muted">Manage school finances, payments, and reports</small>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-success" id="finance-add-payment"><i class="bi bi-plus-circle me-1"></i>Add Payment</button>
              <button class="btn btn-outline-primary" id="finance-generate-report"><i class="bi bi-bar-chart-line me-1"></i>Generate Report</button>
              <button class="btn btn-warning" id="finance-send-reminder"><i class="bi bi-envelope-exclamation me-1"></i>Send Reminder</button>
            </div>
          </div>
          <ul class="nav nav-tabs mb-3" id="financeTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="finance-overview-tab" data-bs-toggle="tab" data-bs-target="#finance-overview" type="button" role="tab">Overview</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="finance-transactions-tab" data-bs-toggle="tab" data-bs-target="#finance-transactions" type="button" role="tab">Transactions</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="finance-reports-tab" data-bs-toggle="tab" data-bs-target="#finance-reports" type="button" role="tab">Reports</button>
            </li>
          </ul>
          <div class="tab-content" id="financeTabContent">
            <!-- Overview Tab -->
            <div class="tab-pane fade show active" id="finance-overview" role="tabpanel">
              <div class="row g-4 mb-3">
                <div class="col-md-4">
                  <div class="p-3 bg-white rounded shadow-sm text-center">
                    <div class="fs-2 text-success"><i class="bi bi-wallet2"></i></div>
                    <div class="fw-bold fs-5">₦<span id="finance-total-balance">0</span></div>
                    <div class="text-muted">Total Balance</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-white rounded shadow-sm text-center">
                    <div class="fs-2 text-warning"><i class="bi bi-exclamation-circle"></i></div>
                    <div class="fw-bold fs-5">₦<span id="finance-pending-fees">0</span></div>
                    <div class="text-muted">Pending Fees</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-white rounded shadow-sm text-center">
                    <div class="fs-2 text-info"><i class="bi bi-credit-card-2-front"></i></div>
                    <div class="fw-bold fs-5" id="finance-payroll-status">OK</div>
                    <div class="text-muted">Payroll Status</div>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded shadow-sm p-4 mb-3">
                <h5 class="mb-3"><i class="bi bi-exclamation-triangle-fill me-2 text-warning"></i>Students with Due Fees</h5>
                <div class="table-responsive">
                  <table class="table table-sm align-middle mb-0">
                    <thead class="table-light">
                      <tr><th>Name</th><th>Class</th><th>Due Amount</th><th>Actions</th></tr>
                    </thead>
                    <tbody id="due-fees-table"></tbody>
                  </table>
                </div>
              </div>
              <div class="d-flex justify-content-end mb-3">
                <button class="btn btn-primary" id="schoolpay-btn-overview"><i class="bi bi-credit-card"></i> Pay with SchoolPay</button>
              </div>
            </div>
            <!-- Transactions Tab -->
            <div class="tab-pane fade" id="finance-transactions" role="tabpanel">
              <div class="bg-white rounded shadow-sm p-3 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h5 class="mb-0"><i class="bi bi-list-ul me-2"></i>Transaction History</h5>
                  <input type="text" class="form-control w-auto" id="finance-transaction-search" placeholder="Search..." style="max-width:200px;">
                </div>
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody id="finance-transaction-table">
                      <!-- Transactions will be dynamically inserted here -->
                    </tbody>
                  </table>
                </div>
                <div class="d-flex justify-content-end mb-3">
                  <button class="btn btn-primary" id="schoolpay-btn-transactions"><i class="bi bi-credit-card"></i> Pay with SchoolPay</button>
                </div>
              </div>
            </div>
            <!-- Reports Tab -->
            <div class="tab-pane fade" id="finance-reports" role="tabpanel">
              <div class="bg-white rounded shadow-sm p-4 mb-3">
                <h5 class="mb-3"><i class="bi bi-file-earmark-bar-graph me-2"></i>Finance Reports & Analytics</h5>
                <div class="row mb-3">
                  <div class="col-md-4">
                    <div class="p-3 bg-light rounded text-center">
                      <div class="fw-bold fs-5">₦<span id="report-total-paid">0</span></div>
                      <div class="text-muted">Total Paid</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="p-3 bg-light rounded text-center">
                      <div class="fw-bold fs-5">₦<span id="report-total-due">0</span></div>
                      <div class="text-muted">Total Due</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="p-3 bg-light rounded text-center">
                      <div class="fw-bold fs-5" id="report-total-transactions">0</div>
                      <div class="text-muted">Transactions</div>
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-bold">Total Paid by Class</span>
                    <button class="btn btn-outline-secondary btn-sm" id="downloadReportChart"><i class="bi bi-download"></i> Download Chart</button>
                  </div>
                  <canvas id="report-class-bar-chart" height="120"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

        // --- Tab switching (Bootstrap handles most, but we can add custom logic if needed) ---
        // --- Overview Tab: Populate summary and chart ---
        const totalBalance = financeStudents.reduce((a, s) => a + (s.paid || 0), 0);
        const pendingFees = financeStudents.reduce((a, s) => a + (s.due || 0), 0);
        const payrollOK = financePayroll.every(p => p.status === 'Paid');
        document.getElementById('finance-total-balance').textContent = totalBalance.toLocaleString();
        document.getElementById('finance-pending-fees').textContent = pendingFees.toLocaleString();
        document.getElementById('finance-payroll-status').textContent = payrollOK ? 'OK' : 'Pending';

        // Chart.js: Fee Collection Trend
        if (window.financeFeeChartInstance) window.financeFeeChartInstance.destroy();
        const ctxOverview = document.getElementById('finance-fee-chart').getContext('2d');
        window.financeFeeChartInstance = new Chart(ctxOverview, {
          type: 'line',
          data: {
            labels: financeStudents.map(s => s.name),
            datasets: [
              { label: 'Paid', data: financeStudents.map(s => s.paid), borderColor: '#198754', backgroundColor: 'rgba(25,135,84,0.1)', tension: 0.4 },
              { label: 'Due', data: financeStudents.map(s => s.due), borderColor: '#ffc107', backgroundColor: 'rgba(255,193,7,0.1)', tension: 0.4 }
            ]
          },
          options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }
        });

        // --- Transactions Tab: Populate table ---
        function renderFinanceTransactionsTable() {
          const tbody = document.getElementById('finance-transaction-table');
          const search = (document.getElementById('finance-transaction-search')?.value || '').toLowerCase();
          tbody.innerHTML = '';
          financeTransactions.filter(t => {
            return (
              t.student.toLowerCase().includes(search) ||
              t.class.toLowerCase().includes(search) ||
              t.method.toLowerCase().includes(search) ||
              t.status.toLowerCase().includes(search)
            );
          }).forEach(t => {
            tbody.innerHTML += `
              <tr>
                <td>${t.date}</td>
                <td>${t.method}</td>
                <td>₦${t.amount.toLocaleString()}</td>
                <td><span class="badge ${t.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'}">${t.status}</span></td>
                <td><button class="btn btn-sm btn-outline-primary" onclick="window.viewTransaction(${t.id})"><i class="bi bi-eye"></i></button></td>
              </tr>
            `;
          });
        }
        renderFinanceTransactionsTable();
        document.getElementById('finance-transaction-search').oninput = renderFinanceTransactionsTable;

        // --- Quick Actions ---
        document.getElementById('finance-add-payment').onclick = function() {
          // Show Add Payment Modal
          showAddPaymentModal();
        };
        document.getElementById('finance-generate-report').onclick = function() {
          showFinanceReportModal();
        };
        document.getElementById('finance-send-reminder').onclick = function() {
          showToast('Reminders coming soon!', 'info');
        };

        // --- Transaction View Modal (micro-interaction) ---
        window.viewTransaction = function(id) {
          const t = financeTransactions.find(x => x.id === id);
          showToast(`<b>Transaction:</b><br>Date: ${t.date}<br>Student: ${t.student}<br>Class: ${t.class}<br>Amount: ₦${t.amount.toLocaleString()}<br>Method: ${t.method}<br>Status: ${t.status}`, 'info');
        };

        // --- Reports Tab: Summary Stats ---
        document.getElementById('report-total-paid').textContent = financeStudents.reduce((a,s)=>a+(s.paid||0),0).toLocaleString();
        document.getElementById('report-total-due').textContent = financeStudents.reduce((a,s)=>a+(s.due||0),0).toLocaleString();
        document.getElementById('report-total-transactions').textContent = financeTransactions.length;
        // Bar chart: total paid by class
        const classTotals = {};
        financeStudents.forEach(s => {
          if (!classTotals[s.class]) classTotals[s.class] = 0;
          classTotals[s.class] += s.paid || 0;
        });
        const ctxReports = document.getElementById('report-class-bar-chart').getContext('2d');
        if (window.reportClassBarChartInstance) window.reportClassBarChartInstance.destroy();
        window.reportClassBarChartInstance = new Chart(ctxReports, {
          type: 'bar',
          data: {
            labels: Object.keys(classTotals),
            datasets: [{
              label: 'Total Paid',
              data: Object.values(classTotals),
              backgroundColor: '#0d6efd'
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
        document.getElementById('downloadReportChart').onclick = function() {
          const url = window.reportClassBarChartInstance.toBase64Image();
          const a = document.createElement('a');
          a.href = url;
          a.download = 'finance_report_chart.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          showToast('Chart downloaded', 'success');
        };

        // --- Due Fees Table ---
        const dueTbody = document.getElementById('due-fees-table');
        dueTbody.innerHTML = '';
        financeStudents.filter(s => s.due > 0).forEach(s => {
          dueTbody.innerHTML += `
            <tr>
              <td>${s.name}</td>
              <td>${s.class}</td>
              <td><span class="text-danger fw-bold">₦${s.due.toLocaleString()}</span></td>
              <td>
                <button class="btn btn-outline-warning btn-sm me-1" onclick="window.sendDueReminder('${s.name}')"><i class="bi bi-bell"></i> Remind</button>
                <button class="btn btn-outline-primary btn-sm" onclick="window.payWithSchoolPay(${s.id},${s.due})"><i class="bi bi-credit-card"></i> SchoolPay</button>
              </td>
            </tr>
          `;
        });
        window.sendDueReminder = function(name) {
          showToast(`Reminder sent to ${name}`, 'info');
        };
        window.payWithSchoolPay = function(id, amount) {
          showSchoolPayModal(id, amount);
        };
    }

    // --- Mock Data for Inventory ---
    let inventoryCategories = ['Books', 'Desks', 'Devices', 'Lab Equipment'];
    let inventoryItems = [
        { id: 1, name: 'Math Textbook', category: 'Books', quantity: 12, location: 'Library', status: 'In Use', lowStock: 5, files: [], maintenance: [{date:'2024-05-01',note:'Checked, OK'}] },
        { id: 2, name: 'Projector', category: 'Devices', quantity: 2, location: 'Classroom 2', status: 'Under Maintenance', lowStock: 1, files: [], maintenance: [{date:'2024-06-01',note:'Lamp replaced'}] },
        { id: 3, name: 'Lab Microscope', category: 'Lab Equipment', quantity: 1, location: 'Lab', status: 'In Use', lowStock: 1, files: [], maintenance: [] }
    ];

    // --- Inventory Management UI ---
    function renderInventoryManagement() {
        setMainContent(`
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Inventory Management</h2>
                <button class="btn btn-primary" id="addInventoryBtn"><i class="bi bi-plus-circle me-2"></i>Add Item</button>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-3">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="inventory-total-count">0</div>
                            <div>Total Items</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold text-danger" id="inventory-low-stock-count">0</div>
                            <div>Low Stock</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold text-warning" id="inventory-maintenance-count">0</div>
                            <div>Maintenance Due</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold text-info" id="inventory-category-count">0</div>
                            <div>Categories</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-6">
                    <div class="card dashboard-card animate-fade-in">
                        <div class="card-header"><i class="bi bi-bar-chart-fill me-2"></i>Stock & Usage</div>
                        <div class="card-body">
                            <canvas id="inventoryChart" height="120"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card dashboard-card animate-fade-in">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-box-seam me-2"></i>Inventory List</span>
                            <div>
                                <button class="btn btn-outline-secondary btn-sm me-2" id="bulkMarkMaintained"><i class="bi bi-tools me-1"></i>Mark Maintained</button>
                                <button class="btn btn-outline-secondary btn-sm" id="exportInventoryCSV"><i class="bi bi-file-earmark-spreadsheet me-1"></i>Export CSV</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <input type="text" class="form-control table-search mb-3" placeholder="Search inventory..." id="inventorySearch">
                            <div class="table-responsive">
                                <table class="table table-striped align-middle" id="inventoryTable">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Qty</th>
                                            <th>Location</th>
                                            <th>Status</th>
                                            <th>Files</th>
                                            <th>Maintenance</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal for Add/Edit Inventory Item -->
            <div class="modal fade" id="inventoryModal" tabindex="-1" aria-labelledby="inventoryModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="inventoryModalLabel">Add Item</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form id="inventoryForm">
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label class="form-label">Name</label>
                          <input type="text" class="form-control" id="invName" required>
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Category</label>
                          <select class="form-select" id="invCategory" required>
                            ${inventoryCategories.map(c=>`<option value="${c}">${c}</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Quantity</label>
                          <input type="number" class="form-control" id="invQuantity" min="0" required>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Location</label>
                          <input type="text" class="form-control" id="invLocation">
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Status</label>
                          <select class="form-select" id="invStatus">
                            <option value="In Use">In Use</option>
                            <option value="In Storage">In Storage</option>
                            <option value="Under Maintenance">Under Maintenance</option>
                          </select>
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Low Stock Threshold</label>
                          <input type="number" class="form-control" id="invLowStock" min="0">
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Attach Files/Photos</label>
                          <input type="file" class="form-control" id="invFiles" multiple>
                          <div id="invFilePreview" class="mt-2"></div>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Maintenance History</label>
                          <div id="invMaintenanceHistory" class="border rounded p-2 bg-light mb-2" style="min-height:40px;"></div>
                          <div class="input-group mb-2">
                            <input type="date" class="form-control" id="invMaintDate">
                            <input type="text" class="form-control" id="invMaintNote" placeholder="Note">
                            <button type="button" class="btn btn-outline-primary" id="addMaintBtn"><i class="bi bi-plus"></i></button>
                          </div>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary w-100 mt-3">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
        `);
        renderInventoryWidgets();
        renderInventoryChart();
        renderInventoryTable();
        document.getElementById('addInventoryBtn').onclick = openAddInventoryModal;
        document.getElementById('bulkMarkMaintained').onclick = () => showToast('Bulk mark as maintained coming soon!', 'info');
        document.getElementById('exportInventoryCSV').onclick = () => showToast('CSV export coming soon!', 'info');
    }

    function renderInventoryWidgets() {
        document.getElementById('inventory-total-count').textContent = inventoryItems.length;
        document.getElementById('inventory-low-stock-count').textContent = inventoryItems.filter(i=>i.quantity<=i.lowStock).length;
        document.getElementById('inventory-maintenance-count').textContent = inventoryItems.filter(i=>i.status==='Under Maintenance').length;
        document.getElementById('inventory-category-count').textContent = new Set(inventoryItems.map(i=>i.category)).size;
    }

    function renderInventoryChart() {
        const ctx = document.getElementById('inventoryChart').getContext('2d');
        if (window.inventoryChartInstance) window.inventoryChartInstance.destroy();
        window.inventoryChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: inventoryItems.map(i=>i.name),
                datasets: [
                    { label: 'Quantity', data: inventoryItems.map(i=>i.quantity), backgroundColor: '#0d6efd' },
                    { label: 'Low Stock', data: inventoryItems.map(i=>i.lowStock), backgroundColor: '#dc3545' }
                ]
            },
            options: { responsive: true, plugins: { legend: { position: 'top' } } }
        });
    }

    function renderInventoryTable() {
        const tbody = document.querySelector('#inventoryTable tbody');
        tbody.innerHTML = '';
        let filtered = inventoryItems.filter(i => {
            const search = document.getElementById('inventorySearch').value.toLowerCase();
            return i.name.toLowerCase().includes(search) || i.category.toLowerCase().includes(search) || i.location.toLowerCase().includes(search);
        });
        filtered.forEach((i, idx) => {
            let statusBadge = i.status === 'In Use' ? 'bg-success' : i.status === 'In Storage' ? 'bg-secondary' : 'bg-warning text-dark';
            let lowStockAlert = i.quantity <= i.lowStock ? '<i class="bi bi-exclamation-triangle-fill text-danger" title="Low stock!"></i>' : '';
            tbody.innerHTML += `
                <tr>
                    <td>${i.name} ${lowStockAlert}</td>
                    <td>${i.category}</td>
                    <td>${i.quantity}</td>
                    <td>${i.location}</td>
                    <td><span class="badge ${statusBadge}">${i.status}</span></td>
                    <td>${i.files.map(f=>`<a href="${f.url}" target="_blank">${f.name}</a>`).join('<br>')}</td>
                    <td>${i.maintenance.length} <button class="btn btn-sm btn-outline-info ms-1" onclick="window.showMaintenanceHistory(${i.id})"><i class="bi bi-clock-history"></i></button></td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary me-1" onclick="window.editInventory(${i.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteInventory(${i.id})"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        document.getElementById('inventorySearch').oninput = renderInventoryTable;
    }

    // --- Add/Edit Inventory Modal ---
    window.editInventory = function(id) {
        const item = inventoryItems.find(i => i.id === id);
        openInventoryModal('Edit Item', item, id);
    };
    window.deleteInventory = function(id) {
        if (confirm('Delete this item?')) {
            inventoryItems = inventoryItems.filter(i => i.id !== id);
            renderInventoryWidgets();
            renderInventoryChart();
            renderInventoryTable();
            showToast('Item deleted', 'success');
        }
    };
    function openAddInventoryModal() {
        openInventoryModal('Add Item', null, null);
    }
    function openInventoryModal(title, item, id) {
        document.getElementById('inventoryModalLabel').textContent = title;
        document.getElementById('invName').value = item ? item.name : '';
        document.getElementById('invCategory').value = item ? item.category : inventoryCategories[0];
        document.getElementById('invQuantity').value = item ? item.quantity : 1;
        document.getElementById('invLocation').value = item ? item.location : '';
        document.getElementById('invStatus').value = item ? item.status : 'In Use';
        document.getElementById('invLowStock').value = item ? item.lowStock : 1;
        document.getElementById('invFiles').value = '';
        document.getElementById('invFilePreview').innerHTML = item && item.files.length ? item.files.map(f=>`<div><i class='bi bi-file-earmark'></i> ${f.name}</div>`).join('') : '';
        // Maintenance history
        let maint = item ? [...item.maintenance] : [];
        renderMaintenanceHistory(maint);
        document.getElementById('addMaintBtn').onclick = function() {
            const date = document.getElementById('invMaintDate').value;
            const note = document.getElementById('invMaintNote').value;
            if (date && note) {
                maint.push({date, note});
                renderMaintenanceHistory(maint);
                document.getElementById('invMaintDate').value = '';
                document.getElementById('invMaintNote').value = '';
            }
        };
        document.getElementById('invFiles').onchange = function(e) {
            const files = Array.from(e.target.files);
            document.getElementById('invFilePreview').innerHTML = files.map(f=>`<div><i class='bi bi-file-earmark'></i> ${f.name}</div>`).join('');
        };
        const modal = new bootstrap.Modal(document.getElementById('inventoryModal'));
        modal.show();
        document.getElementById('inventoryForm').onsubmit = function(e) {
            e.preventDefault();
            const newItem = {
                id: id || Date.now(),
                name: document.getElementById('invName').value,
                category: document.getElementById('invCategory').value,
                quantity: parseInt(document.getElementById('invQuantity').value),
                location: document.getElementById('invLocation').value,
                status: document.getElementById('invStatus').value,
                lowStock: parseInt(document.getElementById('invLowStock').value),
                files: [], // File upload UI only
                maintenance: maint
            };
            if (id) {
                inventoryItems = inventoryItems.map(i => i.id === id ? newItem : i);
                showToast('Item updated', 'success');
            } else {
                inventoryItems.push(newItem);
                showToast('Item added', 'success');
            }
            modal.hide();
            renderInventoryWidgets();
            renderInventoryChart();
            renderInventoryTable();
        };
    }
    function renderMaintenanceHistory(maint) {
        document.getElementById('invMaintenanceHistory').innerHTML = maint.length ? maint.map(m=>`<div><b>${m.date}:</b> ${m.note}</div>`).join('') : '<span class="text-muted">No maintenance records.</span>';
    }
    // --- Maintenance History Modal ---
    window.showMaintenanceHistory = function(id) {
        const item = inventoryItems.find(i => i.id === id);
        showToast(`<b>Maintenance history for ${item.name}:</b><br>${item.maintenance.map(m=>`${m.date}: ${m.note}`).join('<br>')}`,'info');
    }

    // --- Mock Data for Transport ---
    let transportBuses = [
        { id: 1, number: 'BUS-01', plate: 'ABC-123', capacity: 30, driver: 'James Okafor', status: 'Active', students: [1,2], files: [], maintenance: [{date:'2024-06-01',note:'Oil change'}], route: 1 },
        { id: 2, number: 'BUS-02', plate: 'XYZ-456', capacity: 25, driver: 'Mary Bello', status: 'In Maintenance', students: [], files: [], maintenance: [], route: 2 }
    ];
    let transportDrivers = [
        { id: 1, name: 'James Okafor', phone: '08012345678', status: 'Active' },
        { id: 2, name: 'Mary Bello', phone: '08087654321', status: 'On Leave' }
    ];
    let transportRoutes = [
        { id: 1, name: 'Route A', stops: [
            { id: 1, name: 'Main Gate', time: '07:30', eta: '07:32', students: [1] },
            { id: 2, name: 'Market Junction', time: '07:45', eta: '07:47', students: [2] }
        ] },
        { id: 2, name: 'Route B', stops: [
            { id: 3, name: 'Church Road', time: '07:40', eta: '07:41', students: [] }
        ] }
    ];
    let transportStudents = [
        { id: 1, name: 'John Doe', class: 'JSS1A', qr: 'QR1' },
        { id: 2, name: 'Jane Smith', class: 'JSS2B', qr: 'QR2' }
    ];
    let transportIncidents = [
        { id: 1, bus: 'BUS-01', date: '2024-06-10', desc: 'Minor delay at Market Junction', reportedBy: 'James Okafor' }
    ];

    // --- Transport Module UI ---
    function renderTransportModule() {
        setMainContent(`
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Fleet & Transport</h2>
                <button class="btn btn-primary" id="addBusBtn"><i class="bi bi-plus-circle me-2"></i>Add Bus</button>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-2">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="transport-total-buses">0</div>
                            <div>Buses</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="transport-total-drivers">0</div>
                            <div>Drivers</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="transport-total-routes">0</div>
                            <div>Routes</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="transport-total-students">0</div>
                            <div>Students Assigned</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold text-danger" id="transport-maintenance-due">0</div>
                            <div>Maintenance Due</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold text-success" id="transport-on-time">98%</div>
                            <div>On-Time %</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-6">
                    <div class="card dashboard-card animate-fade-in">
                        <div class="card-header"><i class="bi bi-bar-chart-fill me-2"></i>Fleet Analytics</div>
                        <div class="card-body">
                            <canvas id="transportChart" height="120"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card dashboard-card animate-fade-in">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-bus-front-fill me-2"></i>Bus List</span>
                            <div>
                                <button class="btn btn-outline-secondary btn-sm me-2" id="smartRouteBtn"><i class="bi bi-lightning me-1"></i>Smart Route Optimizer</button>
                                <button class="btn btn-outline-secondary btn-sm" id="exportTransportCSV"><i class="bi bi-file-earmark-spreadsheet me-1"></i>Export CSV</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <input type="text" class="form-control table-search mb-3" placeholder="Search buses..." id="transportSearch">
                            <div class="table-responsive">
                                <table class="table table-striped align-middle" id="transportTable">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Bus No</th>
                                            <th>Plate</th>
                                            <th>Capacity</th>
                                            <th>Driver</th>
                                            <th>Status</th>
                                            <th>Route</th>
                                            <th>Students</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-12">
                    <div class="card dashboard-card animate-fade-in">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-signpost-2-fill me-2"></i>Bus Stops & Schedules</span>
                            <button class="btn btn-outline-secondary btn-sm" id="addRouteBtn"><i class="bi bi-plus-circle"></i> Add Route</button>
                        </div>
                        <div class="card-body" id="busStopsSchedulesBody"></div>
                    </div>
                </div>
            </div>
            <div class="row g-4 mb-4">
                <div class="col-md-12">
                    <div class="card dashboard-card animate-fade-in">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-exclamation-triangle-fill me-2"></i>Incidents & Reports</span>
                            <button class="btn btn-outline-secondary btn-sm" id="addIncidentBtn"><i class="bi bi-plus-circle"></i> Log Incident</button>
                        </div>
                        <div class="card-body" id="incidentsBody"></div>
                    </div>
                </div>
            </div>
            <!-- Modal for Add/Edit Bus -->
            <div class="modal fade" id="busModal" tabindex="-1" aria-labelledby="busModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="busModalLabel">Add Bus</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form id="busForm">
                      <div class="row g-3">
                        <div class="col-md-4">
                          <label class="form-label">Bus Number</label>
                          <input type="text" class="form-control" id="busNumber" required>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label">Plate</label>
                          <input type="text" class="form-control" id="busPlate" required>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label">Capacity</label>
                          <input type="number" class="form-control" id="busCapacity" min="1" required>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Driver</label>
                          <select class="form-select" id="busDriver">
                            ${transportDrivers.map(d=>`<option value="${d.name}">${d.name}</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Status</label>
                          <select class="form-select" id="busStatus">
                            <option value="Active">Active</option>
                            <option value="In Maintenance">In Maintenance</option>
                            <option value="Out of Service">Out of Service</option>
                          </select>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Assign Route</label>
                          <select class="form-select" id="busRoute">
                            ${transportRoutes.map(r=>`<option value="${r.id}">${r.name}</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Assign Students</label>
                          <select class="form-select" id="busStudents" multiple>
                            ${transportStudents.map(s=>`<option value="${s.id}">${s.name} (${s.class})</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Attach Files/Photos</label>
                          <input type="file" class="form-control" id="busFiles" multiple>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Maintenance History</label>
                          <div id="busMaintenanceHistory" class="border rounded p-2 bg-light mb-2" style="min-height:40px;"></div>
                          <div class="input-group mb-2">
                            <input type="date" class="form-control" id="busMaintDate">
                            <input type="text" class="form-control" id="busMaintNote" placeholder="Note">
                            <button type="button" class="btn btn-outline-primary" id="addBusMaintBtn"><i class="bi bi-plus"></i></button>
                          </div>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary w-100 mt-3">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <!-- Modal for Smart Route Optimizer (UI only) -->
            <div class="modal fade" id="smartRouteModal" tabindex="-1" aria-labelledby="smartRouteModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="smartRouteModalLabel">Smart Route Optimizer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="alert alert-info">This feature will suggest the optimal stop order based on student addresses (AI-powered, coming soon!).</div>
                    <ul class="list-group">
                      ${transportRoutes.map(r=>`<li class="list-group-item"><b>${r.name}:</b> ${r.stops.map(s=>s.name).join(' → ')}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!-- Modal for QR Code Boarding (UI only) -->
            <div class="modal fade" id="qrModal" tabindex="-1" aria-labelledby="qrModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="qrModalLabel">QR Code Boarding</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body text-center">
                    <div class="alert alert-info">Scan this QR code to board the bus (feature coming soon!).</div>
                    <div id="qrCodePreview" class="mb-2"><i class="bi bi-qr-code fs-1"></i></div>
                  </div>
                </div>
              </div>
            </div>
        `);
        renderTransportWidgets();
        renderTransportChart();
        renderTransportTable();
        renderBusStopsSchedules();
        renderIncidentsBody();
        document.getElementById('addBusBtn').onclick = openAddBusModal;
        document.getElementById('smartRouteBtn').onclick = openSmartRouteModal;
        document.getElementById('exportTransportCSV').onclick = () => showToast('CSV export coming soon!', 'info');
        document.getElementById('addRouteBtn').onclick = () => showToast('Add route feature coming soon!', 'info');
        document.getElementById('addIncidentBtn').onclick = openAddIncidentModal;
    }

    function renderTransportWidgets() {
        document.getElementById('transport-total-buses').textContent = transportBuses.length;
        document.getElementById('transport-total-drivers').textContent = transportDrivers.length;
        document.getElementById('transport-total-routes').textContent = transportRoutes.length;
        document.getElementById('transport-total-students').textContent = transportBuses.reduce((a,b)=>a+b.students.length,0);
        document.getElementById('transport-maintenance-due').textContent = transportBuses.filter(b=>b.status==='In Maintenance').length;
        document.getElementById('transport-on-time').textContent = '98%';
    }

    function renderTransportChart() {
        const ctx = document.getElementById('transportChart').getContext('2d');
        if (window.transportChartInstance) window.transportChartInstance.destroy();
        window.transportChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: transportBuses.map(b=>b.number),
                datasets: [
                    { label: 'Capacity', data: transportBuses.map(b=>b.capacity), backgroundColor: '#0d6efd' },
                    { label: 'Students', data: transportBuses.map(b=>b.students.length), backgroundColor: '#198754' }
                ]
            },
            options: { responsive: true, plugins: { legend: { position: 'top' } } }
        });
    }

    function renderTransportTable() {
        const tbody = document.querySelector('#transportTable tbody');
        tbody.innerHTML = '';
        let filtered = transportBuses.filter(b => {
            const search = document.getElementById('transportSearch').value.toLowerCase();
            return b.number.toLowerCase().includes(search) || b.driver.toLowerCase().includes(search) || (b.route && transportRoutes.find(r=>r.id===b.route).name.toLowerCase().includes(search));
        });
        filtered.forEach((b, idx) => {
            let statusBadge = b.status === 'Active' ? 'bg-success' : b.status === 'In Maintenance' ? 'bg-warning text-dark' : 'bg-danger';
            let routeName = b.route ? transportRoutes.find(r=>r.id===b.route).name : '-';
            tbody.innerHTML += `
                <tr>
                    <td>${b.number}</td>
                    <td>${b.plate}</td>
                    <td>${b.capacity}</td>
                    <td>${b.driver}</td>
                    <td><span class="badge ${statusBadge}">${b.status}</span></td>
                    <td>${routeName}</td>
                    <td>${b.students.length} <button class="btn btn-sm btn-outline-info ms-1" onclick="window.showBusStudents(${b.id})"><i class="bi bi-people"></i></button></td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary me-1" onclick="window.editBus(${b.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger me-1" onclick="window.deleteBus(${b.id})"><i class="bi bi-trash"></i></button>
                        <button class="btn btn-sm btn-outline-dark" onclick="window.showQRModal(${b.id})"><i class="bi bi-qr-code"></i></button>
                    </td>
                </tr>
            `;
        });
        document.getElementById('transportSearch').oninput = renderTransportTable;
    }

    // --- Add/Edit Bus Modal ---
    window.editBus = function(id) {
        const bus = transportBuses.find(b => b.id === id);
        openBusModal('Edit Bus', bus, id);
    };
    window.deleteBus = function(id) {
        if (confirm('Delete this bus?')) {
            transportBuses = transportBuses.filter(b => b.id !== id);
            renderTransportWidgets();
            renderTransportChart();
            renderTransportTable();
            showToast('Bus deleted', 'success');
        }
    };
    function openAddBusModal() {
        openBusModal('Add Bus', null, null);
    }
    function openBusModal(title, bus, id) {
        document.getElementById('busModalLabel').textContent = title;
        document.getElementById('busNumber').value = bus ? bus.number : '';
        document.getElementById('busPlate').value = bus ? bus.plate : '';
        document.getElementById('busCapacity').value = bus ? bus.capacity : 30;
        document.getElementById('busDriver').value = bus ? bus.driver : transportDrivers[0].name;
        document.getElementById('busStatus').value = bus ? bus.status : 'Active';
        document.getElementById('busRoute').value = bus ? bus.route : transportRoutes[0].id;
        const busStudentsSelect = document.getElementById('busStudents');
        Array.from(busStudentsSelect.options).forEach(opt => {
            opt.selected = bus && bus.students.includes(parseInt(opt.value));
        });
        document.getElementById('busFiles').value = '';
        // Maintenance history
        let maint = bus ? [...bus.maintenance] : [];
        renderBusMaintenanceHistory(maint);
        document.getElementById('addBusMaintBtn').onclick = function() {
            const date = document.getElementById('busMaintDate').value;
            const note = document.getElementById('busMaintNote').value;
            if (date && note) {
                maint.push({date, note});
                renderBusMaintenanceHistory(maint);
                document.getElementById('busMaintDate').value = '';
                document.getElementById('busMaintNote').value = '';
            }
        };
        const modal = new bootstrap.Modal(document.getElementById('busModal'));
        modal.show();
        document.getElementById('busForm').onsubmit = function(e) {
            e.preventDefault();
            const newBus = {
                id: id || Date.now(),
                number: document.getElementById('busNumber').value,
                plate: document.getElementById('busPlate').value,
                capacity: parseInt(document.getElementById('busCapacity').value),
                driver: document.getElementById('busDriver').value,
                status: document.getElementById('busStatus').value,
                route: parseInt(document.getElementById('busRoute').value),
                students: Array.from(document.getElementById('busStudents').selectedOptions).map(opt=>parseInt(opt.value)),
                files: [], // File upload UI only
                maintenance: maint
            };
            if (id) {
                transportBuses = transportBuses.map(b => b.id === id ? newBus : b);
                showToast('Bus updated', 'success');
            } else {
                transportBuses.push(newBus);
                showToast('Bus added', 'success');
            }
            modal.hide();
            renderTransportWidgets();
            renderTransportChart();
            renderTransportTable();
        };
    }
    function renderBusMaintenanceHistory(maint) {
        document.getElementById('busMaintenanceHistory').innerHTML = maint.length ? maint.map(m=>`<div><b>${m.date}:</b> ${m.note}</div>`).join('') : '<span class="text-muted">No maintenance records.</span>';
    }
    // --- Show Bus Students Modal ---
    window.showBusStudents = function(busId) {
        const bus = transportBuses.find(b=>b.id===busId);
        const students = bus.students.map(sid=>transportStudents.find(s=>s.id===sid));
        showToast(`<b>Students assigned to ${bus.number}:</b><br>${students.map(s=>s.name + ' (' + s.class + ')').join('<br>')}`,'info');
    }
    // --- QR Code Boarding Modal (UI only) ---
    window.showQRModal = function(busId) {
        const bus = transportBuses.find(b=>b.id===busId);
        showToast(`<b>QR code boarding for ${bus.number} coming soon!</b>`,'info');
        const modal = new bootstrap.Modal(document.getElementById('qrModal'));
        document.getElementById('qrCodePreview').innerHTML = '<i class="bi bi-qr-code fs-1"></i><div class="mt-2">(QR for each student will be shown here)</div>';
        modal.show();
    }
    // --- Smart Route Optimizer Modal (UI only) ---
    function openSmartRouteModal() {
        const modal = new bootstrap.Modal(document.getElementById('smartRouteModal'));
        modal.show();
    }
    // --- Bus Stops & Schedules ---
    function renderBusStopsSchedules() {
        const body = document.getElementById('busStopsSchedulesBody');
        body.innerHTML = transportRoutes.map(r=>`
            <div class="mb-3">
                <h5>${r.name}</h5>
                <ul class="list-group">
                    ${r.stops.map(s=>`<li class="list-group-item d-flex justify-content-between align-items-center">
                        <span><b>${s.name}</b> <span class="badge bg-info ms-2">${s.time}</span> <span class="badge bg-success ms-2">ETA: ${s.eta}</span></span>
                        <span>${s.students.map(sid=>transportStudents.find(st=>st.id===sid).name).join(', ')}</span>
                    </li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
    // --- Incidents & Reports ---
    function renderIncidentsBody() {
        const body = document.getElementById('incidentsBody');
        body.innerHTML = transportIncidents.length ? transportIncidents.map(i=>`
            <div class="mb-2"><b>${i.date}:</b> <span class="text-danger">${i.bus}</span> - ${i.desc} <span class="text-muted">(by ${i.reportedBy})</span></div>
        `).join('') : '<span class="text-muted">No incidents reported.</span>';
    }
    function openAddIncidentModal() {
        showToast('Incident logging UI coming soon!','info');
    }

    // --- Mock Data for Alerts & Incidents ---
    let alertTypes = ['Discipline', 'Safety', 'Maintenance', 'Other'];
    let alertStaff = ['Principal', 'Maintenance', 'Security', 'Teacher'];
    let alertsList = [
        { id: 1, type: 'Discipline', title: 'Bullying in JSS1A', desc: 'Student reported bullying.', location: 'Classroom', date: '2024-06-10', status: 'Open', urgent: true, reporter: 'Teacher', files: [], assigned: 'Principal', timeline: [
            { time: '2024-06-10 08:00', action: 'Reported by Teacher' },
            { time: '2024-06-10 08:10', action: 'Forwarded to Principal' }
        ] },
        { id: 2, type: 'Maintenance', title: 'Broken Window', desc: 'Window broken in Lab.', location: 'Lab', date: '2024-06-09', status: 'Resolved', urgent: false, reporter: 'Teacher', files: [], assigned: 'Maintenance', timeline: [
            { time: '2024-06-09 09:00', action: 'Reported by Teacher' },
            { time: '2024-06-09 10:00', action: 'Resolved by Maintenance' }
        ] }
    ];
    // --- Mock Data for Announcements ---
    let announcementTypes = ['Meeting', 'Event', 'Info', 'Urgent'];
    let announcementAudiences = ['All', 'Staff', 'Students', 'Parents'];
    let announcementsList = [
        { id: 1, type: 'Meeting', title: 'General Staff Meeting', desc: 'All staff to attend the general meeting in the hall.', date: '2024-06-15T10:00', audience: ['Staff'], status: 'Upcoming', files: [], notified: false },
        { id: 2, type: 'Event', title: 'Sports Day', desc: 'Annual sports day for all students and parents.', date: '2024-06-20T09:00', audience: ['All'], status: 'Upcoming', files: [], notified: false }
    ];

    // --- Alerts & Incident Reporting UI ---
    function renderAlertsModule() {
        setMainContent(`
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Alerts & Incident Reporting</h2>
                <button class="btn btn-primary" id="addAlertBtn"><i class="bi bi-plus-circle me-2"></i>Log Alert/Incident</button>
            </div>
            <!-- Announcements Section -->
            <div class="row g-4 mb-4">
                <div class="col-md-2">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="announcements-total">0</div>
                            <div>Total Announcements</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold text-info" id="announcements-upcoming">0</div>
                            <div>Upcoming</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold text-success" id="announcements-past">0</div>
                            <div>Past</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <canvas id="announcementsChart" height="60"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card mb-4 animate-fade-in">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-megaphone-fill me-2"></i>Announcements</span>
                    <div>
                        <button class="btn btn-outline-secondary btn-sm me-2" id="addAnnouncementBtn"><i class="bi bi-plus-circle me-1"></i>Add Announcement</button>
                        <button class="btn btn-outline-secondary btn-sm me-2" id="bulkSendAnnouncementNotifications"><i class="bi bi-bell me-1"></i>Send Notifications</button>
                        <button class="btn btn-outline-secondary btn-sm" id="exportAnnouncementsCSV"><i class="bi bi-file-earmark-spreadsheet me-1"></i>Export CSV</button>
                    </div>
                </div>
                <div class="card-body">
                    <input type="text" class="form-control table-search mb-3" placeholder="Search announcements..." id="announcementsSearch">
                    <div class="table-responsive">
                        <table class="table table-striped align-middle" id="announcementsTable">
                            <thead class="table-light">
                                <tr>
                                    <th></th>
                                    <th>Type</th>
                                    <th>Title</th>
                                    <th>Date/Time</th>
                                    <th>Audience</th>
                                    <th>Status</th>
                                    <th>Files</th>
                                    <th>Notified</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- Announcement Modal -->
            <div class="modal fade" id="announcementModal" tabindex="-1" aria-labelledby="announcementModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="announcementModalLabel">Add Announcement</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form id="announcementForm">
                      <div class="row g-3">
                        <div class="col-md-4">
                          <label class="form-label">Type</label>
                          <select class="form-select" id="announcementType" required>
                            ${announcementTypes.map(t=>`<option value="${t}">${t}</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label">Title</label>
                          <input type="text" class="form-control" id="announcementTitle" required>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label">Date/Time</label>
                          <input type="datetime-local" class="form-control" id="announcementDate" required>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Audience</label>
                          <select class="form-select" id="announcementAudience" multiple required>
                            ${announcementAudiences.map(a=>`<option value="${a}">${a}</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Status</label>
                          <select class="form-select" id="announcementStatus">
                            <option value="Upcoming">Upcoming</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Past">Past</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Description</label>
                          <textarea class="form-control" id="announcementDesc" rows="2"></textarea>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Attach Files</label>
                          <input type="file" class="form-control" id="announcementFiles" multiple>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary w-100 mt-3">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <!-- Notification Modal -->
            <div class="modal fade" id="announcementNotifyModal" tabindex="-1" aria-labelledby="announcementNotifyModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="announcementNotifyModalLabel">Send Notification</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div id="announcementNotifyPreview" class="mb-3"></div>
                    <label class="form-label">Delivery Channels</label>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="Email" id="notifyEmail" checked>
                      <label class="form-check-label" for="notifyEmail">Email</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="SMS" id="notifySMS">
                      <label class="form-check-label" for="notifySMS">SMS</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="In-app" id="notifyInApp">
                      <label class="form-check-label" for="notifyInApp">In-app</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="WhatsApp" id="notifyWhatsApp">
                      <label class="form-check-label" for="notifyWhatsApp">WhatsApp</label>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary w-100" id="sendAnnouncementNotificationBtn">Send Notification</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Existing Alerts Section -->
            <div class="row g-4 mb-4">
                <div class="col-md-2">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold" id="alerts-total">0</div>
                            <div>Total Alerts</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold text-danger" id="alerts-urgent">0</div>
                            <div>Urgent</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold text-warning" id="alerts-open">0</div>
                            <div>Open</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <div class="fs-2 fw-bold text-success" id="alerts-resolved">0</div>
                            <div>Resolved</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card dashboard-card animate-fade-in text-center bg-light">
                        <div class="card-body">
                            <canvas id="alertsChart" height="60"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card mb-4 animate-fade-in">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-bell-fill me-2"></i>Alerts & Incidents</span>
                    <div>
                        <button class="btn btn-outline-secondary btn-sm me-2" id="bulkResolveAlerts"><i class="bi bi-check2-square me-1"></i>Mark as Resolved</button>
                        <button class="btn btn-outline-secondary btn-sm" id="exportAlertsCSV"><i class="bi bi-file-earmark-spreadsheet me-1"></i>Export CSV</button>
                    </div>
                </div>
                <div class="card-body">
                    <input type="text" class="form-control table-search mb-3" placeholder="Search alerts..." id="alertsSearch">
                    <div class="table-responsive">
                        <table class="table table-striped align-middle" id="alertsTable">
                            <thead class="table-light">
                                <tr>
                                    <th>Type</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Urgent</th>
                                    <th>Date</th>
                                    <th>Location</th>
                                    <th>Assigned</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- Modal for Add/Edit Alert -->
            <div class="modal fade" id="alertModal" tabindex="-1" aria-labelledby="alertModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="alertModalLabel">Log Alert/Incident</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form id="alertForm">
                      <div class="row g-3">
                        <div class="col-md-4">
                          <label class="form-label">Type</label>
                          <select class="form-select" id="alertType" required>
                            ${alertTypes.map(t=>`<option value="${t}">${t}</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label">Title</label>
                          <input type="text" class="form-control" id="alertTitle" required>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label">Location</label>
                          <input type="text" class="form-control" id="alertLocation">
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Date/Time</label>
                          <input type="datetime-local" class="form-control" id="alertDate" required>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Assign To</label>
                          <select class="form-select" id="alertAssigned">
                            ${alertStaff.map(s=>`<option value="${s}">${s}</option>`).join('')}
                          </select>
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Description</label>
                          <textarea class="form-control" id="alertDesc" rows="2"></textarea>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Urgent</label>
                          <select class="form-select" id="alertUrgent">
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                          </select>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Attach Files/Photos</label>
                          <input type="file" class="form-control" id="alertFiles" multiple>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary w-100 mt-3">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <!-- Modal for Incident Timeline -->
            <div class="modal fade" id="timelineModal" tabindex="-1" aria-labelledby="timelineModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="timelineModalLabel">Incident Timeline</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body" id="timelineModalBody"></div>
                </div>
              </div>
            </div>
        `);
        renderAnnouncementsWidgets();
        renderAnnouncementsChart();
        renderAnnouncementsTable();
        renderAlertsWidgets();
        renderAlertsChart();
        renderAlertsTable();
        document.getElementById('addAnnouncementBtn').onclick = openAddAnnouncementModal;
        document.getElementById('exportAnnouncementsCSV').onclick = () => showToast('CSV export coming soon!', 'info');
        document.getElementById('addAlertBtn').onclick = openAddAlertModal;
        document.getElementById('bulkResolveAlerts').onclick = () => showToast('Bulk resolve coming soon!', 'info');
        document.getElementById('exportAlertsCSV').onclick = () => showToast('CSV export coming soon!', 'info');
    }

    function renderAnnouncementsWidgets() {
        document.getElementById('announcements-total').textContent = announcementsList.length;
        document.getElementById('announcements-upcoming').textContent = announcementsList.filter(a=>a.status==='Upcoming').length;
        document.getElementById('announcements-past').textContent = announcementsList.filter(a=>a.status==='Past').length;
    }

    function renderAnnouncementsChart() {
        const ctx = document.getElementById('announcementsChart').getContext('2d');
        if (window.announcementsChartInstance) window.announcementsChartInstance.destroy();
        window.announcementsChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: announcementTypes,
                datasets: [{
                    data: announcementTypes.map(t=>announcementsList.filter(a=>a.type===t).length),
                    backgroundColor: ['#0d6efd','#198754','#ffc107','#dc3545']
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'top' } } }
        });
    }

    function renderAnnouncementsTable() {
        const tbody = document.querySelector('#announcementsTable tbody');
        tbody.innerHTML = '';
        let filtered = announcementsList.filter(a => {
            const search = document.getElementById('announcementsSearch').value.toLowerCase();
            return a.title.toLowerCase().includes(search) || a.type.toLowerCase().includes(search) || a.audience.join(',').toLowerCase().includes(search);
        });
        filtered.forEach((a, idx) => {
            let statusBadge = a.status === 'Upcoming' ? 'bg-info' : a.status === 'Ongoing' ? 'bg-primary' : a.status === 'Past' ? 'bg-success' : 'bg-danger';
            let notifiedBadge = a.notified ? '<span class="badge bg-success">Notified</span>' : '<span class="badge bg-secondary">Not Notified</span>';
            tbody.innerHTML += `
                <tr>
                    <td><input type="checkbox" class="announcement-bulk-checkbox" data-id="${a.id}"></td>
                    <td>${a.type}</td>
                    <td>${a.title}</td>
                    <td>${a.date.replace('T',' ')}</td>
                    <td>${a.audience.join(', ')}</td>
                    <td><span class="badge ${statusBadge}">${a.status}</span></td>
                    <td>${a.files.map(f=>`<a href="${f.url}" target="_blank">${f.name}</a>`).join('<br>')}</td>
                    <td>${notifiedBadge}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary me-1" onclick="window.editAnnouncement(${a.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger me-1" onclick="window.deleteAnnouncement(${a.id})"><i class="bi bi-trash"></i></button>
                        <button class="btn btn-sm btn-outline-info" onclick="window.openAnnouncementNotifyModal(${a.id})"><i class="bi bi-bell"></i></button>
                    </td>
                </tr>
            `;
        });
        document.getElementById('announcementsSearch').oninput = renderAnnouncementsTable;
    }
    // --- Add/Edit Announcement Modal ---
    window.editAnnouncement = function(id) {
        const a = announcementsList.find(a => a.id === id);
        openAnnouncementModal('Edit Announcement', a, id);
    };
    window.deleteAnnouncement = function(id) {
        if (confirm('Delete this announcement?')) {
            announcementsList = announcementsList.filter(a => a.id !== id);
            renderAnnouncementsWidgets();
            renderAnnouncementsChart();
            renderAnnouncementsTable();
            showToast('Announcement deleted', 'success');
        }
    };
    function openAddAnnouncementModal() {
        openAnnouncementModal('Add Announcement', null, null);
    }
    function openAnnouncementModal(title, a, id) {
        document.getElementById('announcementModalLabel').textContent = title;
        document.getElementById('announcementType').value = a ? a.type : announcementTypes[0];
        document.getElementById('announcementTitle').value = a ? a.title : '';
        document.getElementById('announcementDate').value = a ? a.date : new Date().toISOString().slice(0,16);
        const audienceSelect = document.getElementById('announcementAudience');
        Array.from(audienceSelect.options).forEach(opt => {
            opt.selected = a && a.audience.includes(opt.value);
        });
        document.getElementById('announcementStatus').value = a ? a.status : 'Upcoming';
        document.getElementById('announcementDesc').value = a ? a.desc : '';
        document.getElementById('announcementFiles').value = '';
        const modal = new bootstrap.Modal(document.getElementById('announcementModal'));
        modal.show();
        document.getElementById('announcementForm').onsubmit = function(e) {
            e.preventDefault();
            const newAnnouncement = {
                id: id || Date.now(),
                type: document.getElementById('announcementType').value,
                title: document.getElementById('announcementTitle').value,
                desc: document.getElementById('announcementDesc').value,
                date: document.getElementById('announcementDate').value,
                audience: Array.from(document.getElementById('announcementAudience').selectedOptions).map(opt=>opt.value),
                status: document.getElementById('announcementStatus').value,
                files: [] // File upload UI only
            };
            if (id) {
                announcementsList = announcementsList.map(a => a.id === id ? newAnnouncement : a);
                showToast('Announcement updated', 'success');
            } else {
                announcementsList.push(newAnnouncement);
                showToast('Announcement added', 'success');
            }
            modal.hide();
            renderAnnouncementsWidgets();
            renderAnnouncementsChart();
            renderAnnouncementsTable();
        };
    }

    function renderAlertsWidgets() {
        document.getElementById('alerts-total').textContent = alertsList.length;
        document.getElementById('alerts-urgent').textContent = alertsList.filter(a=>a.urgent).length;
        document.getElementById('alerts-open').textContent = alertsList.filter(a=>a.status==='Open').length;
        document.getElementById('alerts-resolved').textContent = alertsList.filter(a=>a.status==='Resolved').length;
    }

    function renderAlertsChart() {
        const ctx = document.getElementById('alertsChart').getContext('2d');
        if (window.alertsChartInstance) window.alertsChartInstance.destroy();
        window.alertsChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: alertTypes,
                datasets: [{
                    data: alertTypes.map(t=>alertsList.filter(a=>a.type===t).length),
                    backgroundColor: ['#dc3545','#0d6efd','#ffc107','#6c757d']
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'top' } } }
        });
    }

    function renderAlertsTable() {
        const tbody = document.querySelector('#alertsTable tbody');
        tbody.innerHTML = '';
        let filtered = alertsList.filter(a => {
            const search = document.getElementById('alertsSearch').value.toLowerCase();
            return a.title.toLowerCase().includes(search) || a.type.toLowerCase().includes(search) || a.location.toLowerCase().includes(search);
        });
        filtered.forEach((a, idx) => {
            let statusBadge = a.status === 'Resolved' ? 'bg-success' : a.status === 'Open' ? 'bg-warning text-dark' : 'bg-secondary';
            let urgentBadge = a.urgent ? '<span class="badge bg-danger">Urgent</span>' : '';
            tbody.innerHTML += `
                <tr>
                    <td>${a.type}</td>
                    <td>${a.title}</td>
                    <td><span class="badge ${statusBadge}">${a.status}</span></td>
                    <td>${urgentBadge}</td>
                    <td>${a.date}</td>
                    <td>${a.location}</td>
                    <td>${a.assigned}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary me-1" onclick="window.editAlert(${a.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger me-1" onclick="window.deleteAlert(${a.id})"><i class="bi bi-trash"></i></button>
                        <button class="btn btn-sm btn-outline-info" onclick="window.showTimeline(${a.id})"><i class="bi bi-clock-history"></i></button>
                    </td>
                </tr>
            `;
        });
        document.getElementById('alertsSearch').oninput = renderAlertsTable;
    }

    // --- Add/Edit Alert Modal ---
    window.editAlert = function(id) {
        const a = alertsList.find(a => a.id === id);
        openAlertModal('Edit Alert/Incident', a, id);
    };
    window.deleteAlert = function(id) {
        if (confirm('Delete this alert?')) {
            alertsList = alertsList.filter(a => a.id !== id);
            renderAlertsWidgets();
            renderAlertsChart();
            renderAlertsTable();
            showToast('Alert deleted', 'success');
        }
    };
    function openAddAlertModal() {
        openAlertModal('Log Alert/Incident', null, null);
    }
    function openAlertModal(title, a, id) {
        document.getElementById('alertModalLabel').textContent = title;
        document.getElementById('alertType').value = a ? a.type : alertTypes[0];
        document.getElementById('alertTitle').value = a ? a.title : '';
        document.getElementById('alertLocation').value = a ? a.location : '';
        document.getElementById('alertDate').value = a ? a.date : new Date().toISOString().slice(0,16);
        document.getElementById('alertAssigned').value = a ? a.assigned : alertStaff[0];
        document.getElementById('alertDesc').value = a ? a.desc : '';
        document.getElementById('alertUrgent').value = a ? a.urgent : 'false';
        document.getElementById('alertFiles').value = '';
        const modal = new bootstrap.Modal(document.getElementById('alertModal'));
        modal.show();
        document.getElementById('alertForm').onsubmit = function(e) {
            e.preventDefault();
            const newAlert = {
                id: id || Date.now(),
                type: document.getElementById('alertType').value,
                title: document.getElementById('alertTitle').value,
                desc: document.getElementById('alertDesc').value,
                location: document.getElementById('alertLocation').value,
                date: document.getElementById('alertDate').value,
                status: 'Open',
                urgent: document.getElementById('alertUrgent').value === 'true',
                reporter: 'Teacher',
                files: [], // File upload UI only
                assigned: document.getElementById('alertAssigned').value,
                timeline: [
                    { time: new Date().toISOString().slice(0,16).replace('T',' '), action: 'Reported by Teacher' },
                    { time: new Date().toISOString().slice(0,16).replace('T',' '), action: 'Forwarded to ' + document.getElementById('alertAssigned').value }
                ]
            };
            if (id) {
                alertsList = alertsList.map(a => a.id === id ? newAlert : a);
                showToast('Alert updated', 'success');
            } else {
                alertsList.push(newAlert);
                showToast('Alert logged', 'success');
            }
            modal.hide();
            renderAlertsWidgets();
            renderAlertsChart();
            renderAlertsTable();
        };
    }
    // --- Incident Timeline Modal ---
    window.showTimeline = function(id) {
        const a = alertsList.find(a=>a.id===id);
        const body = document.getElementById('timelineModalBody');
        body.innerHTML = `<h5>${a.title}</h5><ul class='list-group'>${a.timeline.map(t=>`<li class='list-group-item'><b>${t.time}:</b> ${t.action}</li>`).join('')}</ul>`;
        const modal = new bootstrap.Modal(document.getElementById('timelineModal'));
        modal.show();
    }
    // --- Notification Modal Logic ---
    window.openAnnouncementNotifyModal = function(id) {
        const a = announcementsList.find(a => a.id === id);
        document.getElementById('announcementNotifyPreview').innerHTML = `
            <div><b>Title:</b> ${a.title}</div>
            <div><b>Type:</b> ${a.type}</div>
            <div><b>Date/Time:</b> ${a.date.replace('T',' ')}</div>
            <div><b>Audience:</b> ${a.audience.join(', ')}</div>
            <div class='mt-2'><b>Description:</b> ${a.desc}</div>
        `;
        const modal = new bootstrap.Modal(document.getElementById('announcementNotifyModal'));
        modal.show();
        document.getElementById('sendAnnouncementNotificationBtn').onclick = function() {
            a.notified = true;
            showToast('Notification sent via selected channels!', 'success');
            modal.hide();
            renderAnnouncementsTable();
        };
    }
    // --- Bulk Send Notifications ---
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'bulkSendAnnouncementNotifications') {
            const checked = Array.from(document.querySelectorAll('.announcement-bulk-checkbox:checked')).map(cb=>parseInt(cb.getAttribute('data-id')));
            if (checked.length === 0) {
                showToast('Select at least one announcement to notify.', 'danger');
                return;
            }
            checked.forEach(id => {
                const a = announcementsList.find(a=>a.id===id);
                if (a) a.notified = true;
            });
            showToast('Notifications sent for selected announcements!', 'success');
            renderAnnouncementsTable();
        }
    });

    // --- Custom SchoolPay Gateway Modal ---
    window.openAddPaymentModal = function(studentId) {
        const student = financeStudents.find(s=>s.id===studentId);
        let step = 1;
        let paymentData = {
            studentId: studentId,
            amount: '',
            method: 'Cash',
            date: new Date().toISOString().slice(0,10),
            receiptFile: null,
            notes: '',
            receiptNo: '',
        };
        // Build modal HTML
        const modalHtml = `
        <div class="modal fade" id="schoolPayModal" tabindex="-1" aria-labelledby="schoolPayModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content border-0 shadow-lg" style="border-radius:1.5rem;background:linear-gradient(135deg,#f8fafc 60%,#e3f0ff 100%);">
              <div class="modal-header border-0" style="border-radius:1.5rem 1.5rem 0 0;">
                <div class="d-flex align-items-center gap-2">
                  <img src="https://img.icons8.com/color/48/000000/school.png" style="width:40px;height:40px;">
                  <span class="fs-4 fw-bold">SchoolPay</span>
                  <span class="badge bg-primary ms-2">Secured</span>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                <div id="schoolPayProgressBar" class="progress mb-4" style="height: 6px;background:#e3f0ff;">
                  <div class="progress-bar bg-primary" role="progressbar" style="width: 16%"></div>
                </div>
                <div id="schoolPayStepContent"></div>
              </div>
            </div>
          </div>
        </div>`;
        // Remove any existing modal
        const oldModal = document.getElementById('schoolPayModal');
        if (oldModal) oldModal.parentNode.removeChild(oldModal);
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('schoolPayModal'));
        modal.show();
        renderStep();

        function renderStep() {
            // Progress bar
            const progress = [16, 32, 48, 64, 80, 100][step-1];
            document.querySelector('#schoolPayProgressBar .progress-bar').style.width = progress+'%';
            // Step content
            let html = '';
            if (step === 1) {
                // Student info
                html = `
                  <div class="card shadow-sm border-0 mb-4" style="border-radius:1rem;">
                    <div class="card-body d-flex align-items-center gap-3">
                      <div class="rounded-circle bg-primary d-flex align-items-center justify-content-center" style="width:60px;height:60px;color:#fff;font-size:2rem;">${student.name[0]}</div>
                      <div>
                        <div class="fw-bold fs-5">${student.name}</div>
                        <div class="text-muted">${student.class}</div>
                        <div class="small text-muted">Outstanding: <b>${formatCurrency(student.due)}</b></div>
                        <div class="small text-muted">History: ${student.history.map(h=>`${h.date}: ${formatCurrency(h.amount)}`).join(', ')}</div>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Amount</label>
                    <div class="input-group mb-2">
                      <input type="number" class="form-control" id="schoolPayAmount" value="${paymentData.amount}" min="1" max="${student.due}" required>
                      <span class="input-group-text">USD</span>
                    </div>
                    <div class="d-flex gap-2 mb-2">
                      <button class="btn btn-outline-primary btn-sm" id="quickFull">Full (${formatCurrency(student.due)})</button>
                      <button class="btn btn-outline-secondary btn-sm" id="quickHalf">Half (${formatCurrency(student.due/2)})</button>
                      <button class="btn btn-outline-secondary btn-sm" id="quickCustom">Custom</button>
                    </div>
                    <div class="text-muted">Converted: <span id="schoolPayConverted">${formatCurrency(paymentData.amount||0)}</span></div>
                  </div>
                  <div class="d-flex justify-content-end">
                    <button class="btn btn-primary px-4" id="nextStepBtn">Next</button>
                  </div>
                `;
            } else if (step === 2) {
                // Payment method
                html = `
                  <div class="mb-3">
                    <label class="form-label">Payment Method</label>
                    <div class="d-flex gap-3 flex-wrap">
                      <button class="btn btn-outline-primary payment-method-btn" data-method="Cash"><i class="bi bi-cash-coin fs-4"></i><br>Cash</button>
                      <button class="btn btn-outline-primary payment-method-btn" data-method="Transfer"><i class="bi bi-bank fs-4"></i><br>Transfer</button>
                      <button class="btn btn-outline-primary payment-method-btn" data-method="POS"><i class="bi bi-credit-card fs-4"></i><br>POS</button>
                      <button class="btn btn-outline-primary payment-method-btn" data-method="Card"><i class="bi bi-credit-card-2-front fs-4"></i><br>Card</button>
                      <button class="btn btn-outline-primary payment-method-btn" data-method="Mobile Money"><i class="bi bi-phone fs-4"></i><br>Mobile</button>
                      <button class="btn btn-outline-primary payment-method-btn" data-method="Wallet"><i class="bi bi-wallet2 fs-4"></i><br>Wallet</button>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <button class="btn btn-outline-secondary" id="prevStepBtn">Back</button>
                    <button class="btn btn-primary px-4" id="nextStepBtn">Next</button>
                  </div>
                `;
            } else if (step === 3) {
                // QR code step (UI only)
                html = `
                  <div class="mb-3 text-center">
                    <label class="form-label">Scan to Pay (SchoolPay QR)</label>
                    <div class="d-flex justify-content-center mb-2">
                      <div class="bg-white shadow rounded p-3"><i class="bi bi-qr-code fs-1"></i><div class="small mt-2">(QR for in-person scan, UI only)</div></div>
                    </div>
                    <div class="text-muted">Or continue to upload receipt if already paid.</div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <button class="btn btn-outline-secondary" id="prevStepBtn">Back</button>
                    <button class="btn btn-primary px-4" id="nextStepBtn">Next</button>
                  </div>
                `;
            } else if (step === 4) {
                // Attach receipt and notes
                html = `
                  <div class="mb-3">
                    <label class="form-label">Attach Receipt/Photo</label>
                    <input type="file" class="form-control" id="schoolPayReceipt">
                    <div id="schoolPayReceiptPreview" class="mt-2"></div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Notes/Comments</label>
                    <textarea class="form-control" id="schoolPayNotes" rows="2">${paymentData.notes||''}</textarea>
                  </div>
                  <div class="d-flex justify-content-between">
                    <button class="btn btn-outline-secondary" id="prevStepBtn">Back</button>
                    <button class="btn btn-primary px-4" id="nextStepBtn">Next</button>
                  </div>
                `;
            } else if (step === 5) {
                // Confirmation/summary with swipe to pay
                html = `
                  <div class="mb-3">
                    <h5>Review & Confirm</h5>
                    <div><b>Student:</b> ${student.name} (${student.class})</div>
                    <div><b>Amount:</b> ${formatCurrency(paymentData.amount)}</div>
                    <div><b>Method:</b> ${paymentData.method}</div>
                    <div><b>Date:</b> ${paymentData.date}</div>
                    <div><b>Notes:</b> ${paymentData.notes||'-'}</div>
                    <div><b>Receipt:</b> ${paymentData.receiptFile ? paymentData.receiptFile.name : '-'}</div>
                  </div>
                  <div class="my-4 text-center">
                    <div class="swipe-to-pay bg-primary text-white rounded-pill px-4 py-2" style="cursor:pointer;display:inline-block;user-select:none;transition:box-shadow .2s;box-shadow:0 2px 8px #0d6efd33;">
                      <i class="bi bi-arrow-right-circle me-2"></i>Swipe to Pay
                    </div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <button class="btn btn-outline-secondary" id="prevStepBtn">Back</button>
                  </div>
                `;
            } else if (step === 6) {
                // Success/receipt
                html = `
                  <div class="text-center my-4">
                    <i class="bi bi-check-circle-fill text-success fs-1 mb-2"></i>
                    <h4>Payment Successful!</h4>
                    <div class="mt-3">Receipt No: <b>${paymentData.receiptNo}</b></div>
                    <div class="mt-2">Amount Paid: <b>${formatCurrency(paymentData.amount)}</b></div>
                    <div class="mt-2">Student: <b>${student.name} (${student.class})</b></div>
                    <div class="mt-2">Date: <b>${paymentData.date}</b></div>
                    <div class="mt-3">
                      <button class="btn btn-outline-primary">Download Receipt (PDF)</button>
                      <button class="btn btn-outline-secondary ms-2" data-bs-dismiss="modal">Close</button>
                    </div>
                  </div>
                `;
            }
            document.getElementById('schoolPayStepContent').innerHTML = html;
            // Step logic
            if (step === 1) {
                document.getElementById('schoolPayAmount').oninput = function() {
                    paymentData.amount = parseFloat(this.value) || 0;
                    document.getElementById('schoolPayConverted').textContent = formatCurrency(paymentData.amount);
                };
                document.getElementById('quickFull').onclick = function() {
                    paymentData.amount = student.due;
                    document.getElementById('schoolPayAmount').value = student.due;
                    document.getElementById('schoolPayConverted').textContent = formatCurrency(student.due);
                };
                document.getElementById('quickHalf').onclick = function() {
                    paymentData.amount = Math.round(student.due/2*100)/100;
                    document.getElementById('schoolPayAmount').value = paymentData.amount;
                    document.getElementById('schoolPayConverted').textContent = formatCurrency(paymentData.amount);
                };
                document.getElementById('quickCustom').onclick = function() {
                    document.getElementById('schoolPayAmount').focus();
                };
                document.getElementById('nextStepBtn').onclick = function() {
                    if (!paymentData.amount || paymentData.amount <= 0 || paymentData.amount > student.due) {
                        showToast('Enter a valid amount.', 'danger');
                        return;
                    }
                    step = 2; renderStep();
                };
            } else if (step === 2) {
                document.querySelectorAll('.payment-method-btn').forEach(btn => {
                    if (btn.getAttribute('data-method') === paymentData.method) btn.classList.add('active');
                    btn.onclick = function() {
                        paymentData.method = this.getAttribute('data-method');
                        document.querySelectorAll('.payment-method-btn').forEach(b=>b.classList.remove('active'));
                        this.classList.add('active');
                    };
                });
                document.getElementById('prevStepBtn').onclick = function() { step = 1; renderStep(); };
                document.getElementById('nextStepBtn').onclick = function() { step = 3; renderStep(); };
            } else if (step === 3) {
                document.getElementById('prevStepBtn').onclick = function() { step = 2; renderStep(); };
                document.getElementById('nextStepBtn').onclick = function() { step = 4; renderStep(); };
            } else if (step === 4) {
                document.getElementById('schoolPayReceipt').onchange = function(e) {
                    const file = e.target.files[0];
                    paymentData.receiptFile = file;
                    document.getElementById('schoolPayReceiptPreview').innerHTML = file ? `<div><i class='bi bi-file-earmark'></i> ${file.name}</div>` : '';
                };
                document.getElementById('schoolPayNotes').oninput = function() {
                    paymentData.notes = this.value;
                };
                document.getElementById('prevStepBtn').onclick = function() { step = 3; renderStep(); };
                document.getElementById('nextStepBtn').onclick = function() { step = 5; renderStep(); };
            } else if (step === 5) {
                document.getElementById('prevStepBtn').onclick = function() { step = 4; renderStep(); };
                document.querySelector('.swipe-to-pay').onclick = function() {
                    // Save payment
                    const receiptNo = 'RCPT-' + Date.now();
                    paymentData.receiptNo = receiptNo;
                    student.paid += paymentData.amount;
                    student.due -= paymentData.amount;
                    student.status = student.due <= 0 ? 'Paid' : 'Partial';
                    student.history.push({ date: paymentData.date, amount: paymentData.amount, method: paymentData.method, receipt: receiptNo });
                    showToast('Payment recorded', 'success');
                    renderFinanceWidgets();
                    renderFinanceChart();
                    renderFinanceStudentsTable();
                    step = 6; renderStep();
                };
            }
        }
    }

    const modules = [
        'students', 'staff', 'attendance', 'lesson-plans', 'tests',
        'homework', 'finance', 'inventory', 'transport', 'alerts'
    ];

    function showModule(module) {
        // Hide dashboard and all modules
        const dashboard = document.getElementById('enhanced-dashboard');
        if (dashboard) dashboard.style.display = 'none';
        modules.forEach(m => {
            const el = document.getElementById('module-' + m);
            if (el) el.style.display = 'none';
        });
        // Show selected module
        const selected = document.getElementById('module-' + module);
        if (selected) selected.style.display = 'block';
    }

    // Add click listeners for all nav links (navbar and sidebar)
    modules.forEach(module => {
        // Navbar link
        const navLink = document.getElementById('nav-' + module);
        if (navLink) {
            navLink.addEventListener('click', function(e) {
                e.preventDefault();
                loadModuleUI(module);
                // If sidebar is open, close it
                const sidebar = document.getElementById('mobileSidebar');
                if (sidebar && sidebar.classList.contains('show')) {
                    const offcanvas = bootstrap.Offcanvas.getInstance(sidebar);
                    if (offcanvas) offcanvas.hide();
                }
            });
        }
        // Sidebar link
        const sidebarLink = document.getElementById('sidebar-nav-' + module);
        if (sidebarLink) {
            sidebarLink.addEventListener('click', function(e) {
                e.preventDefault();
                loadModuleUI(module);
                // If sidebar is open, close it
                const sidebar = document.getElementById('mobileSidebar');
                if (sidebar && sidebar.classList.contains('show')) {
                    const offcanvas = bootstrap.Offcanvas.getInstance(sidebar);
                    if (offcanvas) offcanvas.hide();
                }
            });
        }
    });

    // Dark mode toggle logic
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
    }
    const darkModeBtn = document.getElementById('darkModeToggle');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', function() {
            toggleDarkMode();
        });
    }
    const sidebarDarkModeBtn = document.getElementById('sidebar-darkModeToggle');
    if (sidebarDarkModeBtn) {
        sidebarDarkModeBtn.addEventListener('click', function() {
            toggleDarkMode();
        });
    }

    // Add after renderFinanceFees function
    function showAddPaymentModal() {
      // Create modal HTML if not present
      let modal = document.getElementById('financeAddPaymentModal');
      if (!modal) {
        const modalHtml = `
          <div class="modal fade" id="financeAddPaymentModal" tabindex="-1" aria-labelledby="financeAddPaymentModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="financeAddPaymentModalLabel">Add Payment</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form id="financeAddPaymentForm">
                    <div class="mb-3">
                      <label class="form-label">Student</label>
                      <select class="form-select" id="financeAddPaymentStudent" required>
                        ${financeStudents.map(s=>`<option value="${s.id}">${s.name} (${s.class})</option>`).join('')}
                      </select>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Amount</label>
                      <input type="number" class="form-control" id="financeAddPaymentAmount" min="1" required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Method</label>
                      <select class="form-select" id="financeAddPaymentMethod">
                        <option value="Cash">Cash</option>
                        <option value="Transfer">Transfer</option>
                        <option value="POS">POS</option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Date</label>
                      <input type="date" class="form-control" id="financeAddPaymentDate" value="${new Date().toISOString().slice(0,10)}" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Save Payment</button>
                  </form>
                </div>
              </div>
            </div>
          </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        modal = document.getElementById('financeAddPaymentModal');
      }
      // Reset form
      document.getElementById('financeAddPaymentForm').reset();
      document.getElementById('financeAddPaymentDate').value = new Date().toISOString().slice(0,10);
      // Show modal
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
      // Handle form submit
      document.getElementById('financeAddPaymentForm').onsubmit = function(e) {
        e.preventDefault();
        const studentId = parseInt(document.getElementById('financeAddPaymentStudent').value);
        const amount = parseFloat(document.getElementById('financeAddPaymentAmount').value);
        const method = document.getElementById('financeAddPaymentMethod').value;
        const date = document.getElementById('financeAddPaymentDate').value;
        const student = financeStudents.find(s=>s.id===studentId);
        if (!student) {
          showToast('Student not found', 'danger');
          return;
        }
        student.paid += amount;
        student.due -= amount;
        if (student.due < 0) student.due = 0;
        student.status = student.due <= 0 ? 'Paid' : 'Partial';
        student.history.push({ date, amount, method, receipt: '#' });
        // Add to transactions
        financeTransactions.push({
          id: financeTransactions.length ? Math.max(...financeTransactions.map(t=>t.id))+1 : 1,
          student: student.name,
          class: student.class,
          date,
          amount: amount * 1000, // Example: convert to Naira
          method,
          status: 'Completed'
        });
        showToast('Payment recorded', 'success');
        bsModal.hide();
        // Refresh UI
        renderFinanceFees();
      };
    }

    // Add after showAddPaymentModal
    function showFinanceReportModal() {
      let modal = document.getElementById('financeReportModal');
      if (!modal) {
        const modalHtml = `
          <div class="modal fade" id="financeReportModal" tabindex="-1" aria-labelledby="financeReportModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="financeReportModalLabel">Generate Finance Report</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="mb-3">
                    <button class="btn btn-outline-success w-100 mb-2" id="exportFinanceCSV"><i class="bi bi-file-earmark-spreadsheet me-1"></i>Export Transactions as CSV</button>
                    <button class="btn btn-outline-primary w-100" id="exportFinancePDF"><i class="bi bi-file-earmark-pdf me-1"></i>Export Summary as PDF</button>
                  </div>
                  <div class="alert alert-info">CSV will download all transactions. PDF is a placeholder for now.</div>
                </div>
              </div>
            </div>
          </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        modal = document.getElementById('financeReportModal');
      }
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
      document.getElementById('exportFinanceCSV').onclick = function() {
        exportFinanceTransactionsCSV();
        bsModal.hide();
      };
      document.getElementById('exportFinancePDF').onclick = function() {
        showToast('PDF export coming soon!', 'info');
        bsModal.hide();
      };
    }
    function exportFinanceTransactionsCSV() {
      const header = ['Date','Student','Class','Amount','Method','Status'];
      const rows = financeTransactions.map(t => [t.date, t.student, t.class, t.amount, t.method, t.status]);
      let csv = header.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'finance_transactions.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('CSV downloaded', 'success');
    }

    // After renderFinanceFees, add:
    function renderFinanceReportsTab() {
      // Summary stats
      document.getElementById('report-total-paid').textContent = financeStudents.reduce((a,s)=>a+(s.paid||0),0).toLocaleString();
      document.getElementById('report-total-due').textContent = financeStudents.reduce((a,s)=>a+(s.due||0),0).toLocaleString();
      document.getElementById('report-total-transactions').textContent = financeTransactions.length;
      // Bar chart: total paid by class
      const classTotals = {};
      financeStudents.forEach(s => {
        if (!classTotals[s.class]) classTotals[s.class] = 0;
        classTotals[s.class] += s.paid || 0;
      });
      const ctxReports = document.getElementById('report-class-bar-chart').getContext('2d');
      if (window.reportClassBarChartInstance) window.reportClassBarChartInstance.destroy();
      window.reportClassBarChartInstance = new Chart(ctxReports, {
        type: 'bar',
        data: {
          labels: Object.keys(classTotals),
          datasets: [{
            label: 'Total Paid',
            data: Object.values(classTotals),
            backgroundColor: '#0d6efd'
          }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
      });
      document.getElementById('downloadReportChart').onclick = function() {
        const url = window.reportClassBarChartInstance.toBase64Image();
        const a = document.createElement('a');
        a.href = url;
        a.download = 'finance_report_chart.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Chart downloaded', 'success');
      };
    }

    // After renderFinanceFees, add:
    setTimeout(() => {
      if (document.getElementById('report-class-bar-chart')) {
        renderFinanceReportsTab();
      }
    }, 100);

    // Utility: Confetti animation
    function launchConfetti() {
      const colors = ['#0d6efd','#198754','#ffc107','#dc3545','#6f42c1','#fd7e14'];
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      for (let i = 0; i < 32; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random()*100 + 'vw';
        piece.style.background = colors[Math.floor(Math.random()*colors.length)];
        piece.style.transform = `rotate(${Math.random()*360}deg)`;
        piece.style.animationDelay = (Math.random()*0.5) + 's';
        confetti.appendChild(piece);
      }
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1800);
    }

    // In renderFinanceFees, add a 'Pay with SchoolPay' button to the Overview and Transactions tabs:
    // In Overview tab, after summary cards:
    
    // After showAddPaymentModal, add:
    function showSchoolPayModal(studentId, amount) {
      let modal = document.getElementById('schoolPayModal');
      if (!modal) {
        const modalHtml = `
          <div class="modal fade" id="schoolPayModal" tabindex="-1" aria-labelledby="schoolPayModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header bg-primary text-white align-items-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="SchoolPay Logo" width="36" class="me-2 rounded-circle border border-white shadow-sm">
                  <div>
                    <h5 class="modal-title mb-0" id="schoolPayModalLabel">SchoolPay <span class="badge bg-success ms-2">SECURE</span></h5>
                    <small class="text-white-50">Never Before Payment Gateway</small>
                  </div>
                  <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="alert alert-primary d-flex align-items-center mb-3"><i class="bi bi-shield-lock-fill me-2"></i> Your payment is protected by SchoolPay Secure™</div>
                  <form id="schoolPayForm">
                    <div class="mb-3">
                      <label class="form-label">Student</label>
                      <select class="form-select" id="schoolPayStudent" required>
                        ${financeStudents.map(s=>`<option value="${s.id}">${s.name} (${s.class})</option>`).join('')}
                      </select>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Amount</label>
                      <input type="number" class="form-control" id="schoolPayAmount" min="1" required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Payment Method</label>
                      <select class="form-select" id="schoolPayMethod">
                        <option value="Card">Card</option>
                        <option value="Bank">Bank Transfer</option>
                        <option value="USSD">USSD</option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Date</label>
                      <input type="date" class="form-control" id="schoolPayDate" value="${new Date().toISOString().slice(0,10)}" required>
                    </div>
                    <div class="mb-3 p-2 bg-light rounded border">
                      <div class="fw-bold mb-1">Payment Summary</div>
                      <div id="schoolPaySummary"></div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Pay Now</button>
                  </form>
                  <div id="schoolPayProgress" class="text-center mt-4" style="display:none">
                    <div class="mb-2"><img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="SchoolPay Mascot" width="48" style="filter: drop-shadow(0 2px 8px #0d6efd33)"></div>
                    <div class="progress" style="height: 1.5rem;">
                      <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" id="schoolPayProgressBar" role="progressbar" style="width: 0%"></div>
                    </div>
                    <div class="mt-2 fw-bold" id="schoolPayStatus">Processing payment...</div>
                  </div>
                  <div id="schoolPayReceipt" class="mt-4" style="display:none"></div>
                </div>
              </div>
            </div>
          </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        modal = document.getElementById('schoolPayModal');
      }
      // Reset form and UI
      document.getElementById('schoolPayForm').style.display = '';
      document.getElementById('schoolPayProgress').style.display = 'none';
      document.getElementById('schoolPayReceipt').style.display = 'none';
      document.getElementById('schoolPayForm').reset();
      document.getElementById('schoolPayDate').value = new Date().toISOString().slice(0,10);
      // Preselect student and amount if provided
      if (studentId) document.getElementById('schoolPayStudent').value = studentId;
      if (amount) document.getElementById('schoolPayAmount').value = amount;
      // Update payment summary
      function updateSummary() {
        const sid = parseInt(document.getElementById('schoolPayStudent').value);
        const amt = parseFloat(document.getElementById('schoolPayAmount').value) || 0;
        const student = financeStudents.find(s=>s.id===sid);
        document.getElementById('schoolPaySummary').innerHTML = `
          <div><b>Student:</b> ${student ? student.name : ''} (${student ? student.class : ''})</div>
          <div><b>Amount:</b> ₦${amt.toLocaleString()}</div>
          <div><b>Method:</b> ${document.getElementById('schoolPayMethod').value}</div>
          <div><b>Date:</b> ${document.getElementById('schoolPayDate').value}</div>
        `;
      }
      updateSummary();
      document.getElementById('schoolPayStudent').onchange = updateSummary;
      document.getElementById('schoolPayAmount').oninput = updateSummary;
      document.getElementById('schoolPayMethod').onchange = updateSummary;
      document.getElementById('schoolPayDate').onchange = updateSummary;
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
      document.getElementById('schoolPayForm').onsubmit = function(e) {
        e.preventDefault();
        // Start SchoolPay processing
        document.getElementById('schoolPayForm').style.display = 'none';
        document.getElementById('schoolPayProgress').style.display = '';
        document.getElementById('schoolPayStatus').textContent = 'Processing payment...';
        let progress = 0;
        const progressBar = document.getElementById('schoolPayProgressBar');
        progressBar.style.width = '0%';
        const interval = setInterval(() => {
          progress += Math.random()*30+10;
          if (progress > 100) progress = 100;
          progressBar.style.width = progress + '%';
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              // Payment success
              document.getElementById('schoolPayProgress').style.display = 'none';
              document.getElementById('schoolPayReceipt').style.display = '';
              // Update records
              const studentId = parseInt(document.getElementById('schoolPayStudent').value);
              const amount = parseFloat(document.getElementById('schoolPayAmount').value);
              const method = document.getElementById('schoolPayMethod').value;
              const date = document.getElementById('schoolPayDate').value;
              const student = financeStudents.find(s=>s.id===studentId);
              if (student) {
                student.paid += amount;
                student.due -= amount;
                if (student.due < 0) student.due = 0;
                student.status = student.due <= 0 ? 'Paid' : 'Partial';
                student.history.push({ date, amount, method: 'SchoolPay-'+method, receipt: 'SCHOOLPAY-'+Date.now() });
                financeTransactions.push({
                  id: financeTransactions.length ? Math.max(...financeTransactions.map(t=>t.id))+1 : 1,
                  student: student.name,
                  class: student.class,
                  date,
                  amount: amount * 1000,
                  method: 'SchoolPay-'+method,
                  status: 'Completed'
                });
              }
              // Show receipt
              document.getElementById('schoolPayReceipt').innerHTML = `
                <div class="text-center">
                  <div class="mb-2"><img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="SchoolPay Mascot" width="48"></div>
                  <h4 class="text-success">Payment Successful!</h4>
                  <div class="mt-2">Receipt No: <b>SCHOOLPAY-${Date.now()}</b></div>
                  <div>Student: <b>${student ? student.name : ''}</b></div>
                  <div>Class: <b>${student ? student.class : ''}</b></div>
                  <div>Amount: <b>₦${amount.toLocaleString()}</b></div>
                  <div>Method: <b>SchoolPay-${method}</b></div>
                  <div>Date: <b>${date}</b></div>
                  <div class="mt-3"><button class="btn btn-outline-primary" data-bs-dismiss="modal">Close</button></div>
                </div>
              `;
              launchConfetti();
              renderFinanceFees();
            }, 800);
          }
        }, 400);
      };
    }

    // Add event listeners after rendering Finance module:
    document.addEventListener('click', function(e) {
      if (e.target && e.target.id === 'schoolpay-btn-overview') {
        showSchoolPayModal();
      }
      if (e.target && e.target.id === 'schoolpay-btn-transactions') {
        showSchoolPayModal();
      }
    });

    // Update all currency displays in due fees table, payment summary, and receipts:
    // Replace ₦ with Z$ and show both Z$ and $ where appropriate, using:
    function formatZigUsd(amount) {
      return `Z$${(amount*usdToZig).toLocaleString()} ($${amount.toLocaleString()})`;
    }
    // In due fees table:
    // <td><span class="text-danger fw-bold">₦${s.due.toLocaleString()}</span></td>
    // becomes:
    // <td><span class="text-danger fw-bold">${formatZigUsd(s.due)}</span></td>
    // In payment summary and receipts, use formatZigUsd for all amounts.
    // In SchoolPay modal, update all amount displays to use formatZigUsd.
}); 