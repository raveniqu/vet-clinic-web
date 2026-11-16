// =============================================================
// DOMAIN 10: HUMAN RESOURCES & WORKFORCE MANAGEMENT ENGINE
// =============================================================

function setStaffSubTab(tab) {
  state.activeStaffSubTab = tab;
  renderCurrentView();
}

function renderStaffActiveSubTab() {
  const container = document.getElementById('staff-tab-content');
  if (!container) return;

  if (state.activeStaffSubTab === 'rosters') {
    renderStaffRostersTab(container);
  } else if (state.activeStaffSubTab === 'employees') {
    renderStaffEmployeesTab(container);
  } else if (state.activeStaffSubTab === 'attendance') {
    renderStaffAttendanceTab(container);
  } else if (state.activeStaffSubTab === 'payroll') {
    renderStaffPayrollTab(container);
  }
}

// --- TAB 1: VISUAL ROSTERS & ROOM ALLOCATION ---
function renderStaffRostersTab(container) {
  const rosters = state.dutyRosters || [];
  const employees = state.employees || [];
  const rooms = state.rooms || [
    { id: 1, name: 'ห้องตรวจ 1 (อายุรกรรม & ผ่าตัด)', code: 'ROOM-1' },
    { id: 2, name: 'ห้องตรวจ 2 (แมวและโรคผิวหนัง)', code: 'ROOM-2' },
    { id: 3, name: 'ห้องตรวจ 3 (ทันตกรรม & เวชกรรมทั่วไป)', code: 'ROOM-3' }
  ];

  container.innerHTML = `
    <div class="space-y-5">
      <!-- Top Shift Schedule Header Banner -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200 shrink-0">
            <i data-lucide="calendar-check-2" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900">ตารางเวรตรวจประจำสัปดาห์ & การจัดสรรห้องตรวจ (Doctor Rosters & Room Allocation)</h4>
            <p class="text-xs text-slate-500">สัปดาห์ปัจจุบัน: 02 มีนาคม 2026 - 08 มีนาคม 2026 (เชื่อมโยงรายชื่อแพทย์เข้าห้องตรวจ EMR อัตโนมัติ)</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="simulateShiftNotification()" class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5">
            <i data-lucide="send" class="w-3.5 h-3.5 text-blue-600"></i>
            <span>ส่งตารางเวร LINE</span>
          </button>
          <button onclick="openShiftSwapModal(1)" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5">
            <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
            <span>+ สลับเวรตรวจ (Swap)</span>
          </button>
        </div>
      </div>

      <!-- Active Doctor Room Allocation Cards (Today: Monday) -->
      <div>
        <div class="flex items-center justify-between px-1 mb-2.5">
          <h5 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>แพทย์ประจำห้องตรวจและทีมสนับสนุนวันนี้ (Today's Active Duty)</span>
          </h5>
          <span class="text-xs text-slate-500">วันจันทร์ที่ 2 มีนาคม 2026</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          ${rosters.filter(r => r.dayOfWeek === 'MON').map(r => {
            const emp = employees.find(e => e.id === r.employeeId);
            if (!emp) return '';

            let shiftBadge = '';
            if (r.shiftCode === 'M') {
              shiftBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">กะเช้า (08:00 - 17:00)</span>';
            } else if (r.shiftCode === 'E') {
              shiftBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">กะบ่าย (12:00 - 21:00)</span>';
            } else if (r.shiftCode === 'N') {
              shiftBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">กะดึก (20:00 - 08:00)</span>';
            } else {
              shiftBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">วันหยุด (Day Off)</span>';
            }

            const roomObj = rooms.find(rm => rm.id === r.roomId);
            const roomName = roomObj ? roomObj.name : (r.role || 'ฝ่ายสนับสนุน');

            return `
              <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <span class="text-[10px] font-bold font-mono text-slate-400">${emp.employeeCode}</span>
                    ${shiftBadge}
                  </div>

                  <div class="flex items-center gap-3 mt-3">
                    <img src="${emp.avatar}" alt="${emp.firstName}" class="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0">
                    <div class="min-w-0">
                      <h4 class="font-bold text-slate-900 text-xs truncate">${emp.title} ${emp.firstName} ${emp.lastName}</h4>
                      <p class="text-[11px] text-emerald-700 font-medium">"${emp.nickname}"</p>
                      <p class="text-[10px] text-slate-400 truncate">${emp.licenseNumber}</p>
                    </div>
                  </div>

                  <div class="mt-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span class="text-[10px] text-slate-400 block font-medium">จุดประจำการวันนี้:</span>
                    <span class="text-xs font-bold text-slate-800 block truncate">${roomName}</span>
                  </div>
                </div>

                <div class="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <button onclick="openShiftSwapModal(${r.id})" class="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer flex items-center gap-1">
                    <i data-lucide="repeat" class="w-3 h-3"></i> สลับเวร
                  </button>
                  <button onclick="switchMainView('emr'); showToast('ซิงก์ห้องตรวจ', 'เข้าสู่เวชระเบียนห้องตรวจของ ${emp.title} ${emp.firstName}', 'info')" class="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer">
                    <span>เปิด EMR</span> <i data-lucide="chevron-right" class="w-3 h-3"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Weekly Roster Table (Mon - Sun Matrix) -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h5 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="calendar" class="w-4 h-4 text-emerald-600"></i>
            <span>ตารางกะปฏิบัติงานตลอดทั้งสัปดาห์ (Weekly Duty Matrix)</span>
          </h5>
          <div class="flex items-center gap-3 text-xs text-slate-500">
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-emerald-500"></span> กะเช้า (M)</span>
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-blue-500"></span> กะบ่าย (E)</span>
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-purple-500"></span> กะดึก (N)</span>
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-slate-300"></span> วันหยุด (OFF)</span>
          </div>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th class="py-2.5 px-3 font-semibold min-w-[160px]">บุคลากร</th>
                <th class="py-2.5 px-2 font-semibold text-center w-24">จ. 2 มี.ค.</th>
                <th class="py-2.5 px-2 font-semibold text-center w-24">อ. 3 มี.ค.</th>
                <th class="py-2.5 px-2 font-semibold text-center w-24">พ. 4 มี.ค.</th>
                <th class="py-2.5 px-2 font-semibold text-center w-24">พฤ. 5 มี.ค.</th>
                <th class="py-2.5 px-2 font-semibold text-center w-24">ศ. 6 มี.ค.</th>
                <th class="py-2.5 px-2 font-semibold text-center w-24">ส. 7 มี.ค.</th>
                <th class="py-2.5 px-2 font-semibold text-center w-24">อา. 8 มี.ค.</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${employees.map((emp, idx) => {
                const shiftsOfWeek = ['M', 'M', 'E', 'M', 'OFF', 'M', 'E'];
                if (idx % 2 === 1) shiftsOfWeek.reverse();
                if (idx === 2) shiftsOfWeek[0] = 'E';
                if (idx === 3) shiftsOfWeek[0] = 'N';

                return `
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-2.5 px-3">
                      <div class="flex items-center gap-2">
                        <img src="${emp.avatar}" class="w-7 h-7 rounded-lg object-cover border border-slate-200">
                        <div>
                          <strong class="font-bold text-slate-800 block">${emp.title} ${emp.firstName}</strong>
                          <span class="text-[10px] text-slate-400">${emp.employeeCode}</span>
                        </div>
                      </div>
                    </td>
                    ${shiftsOfWeek.map((sh) => {
                      let chipColor = 'bg-slate-100 text-slate-500';
                      if (sh === 'M') chipColor = 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-200';
                      if (sh === 'E') chipColor = 'bg-blue-100 text-blue-800 font-bold border border-blue-200';
                      if (sh === 'N') chipColor = 'bg-purple-100 text-purple-800 font-bold border border-purple-200';

                      return `
                        <td class="py-2.5 px-2 text-center">
                          <span class="inline-block px-2 py-1 rounded text-[10px] ${chipColor}">
                            ${sh}
                          </span>
                        </td>
                      `;
                    }).join('')}
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// --- TAB 2: STAFF DIRECTORY, CREDENTIALS & LICENSE EXPIRY RADAR ---
function renderStaffEmployeesTab(container) {
  const searchQuery = (document.getElementById('view-filter-search')?.value || '').toLowerCase().trim();
  const deptFilter = document.getElementById('view-filter-staff-dept')?.value || 'all';

  const employees = (state.employees || []).filter(e => {
    const fullName = `${e.title} ${e.firstName} ${e.lastName} ${e.nickname}`.toLowerCase();
    const matchSearch = fullName.includes(searchQuery) ||
                        e.employeeCode.toLowerCase().includes(searchQuery) ||
                        (e.licenseNumber || '').toLowerCase().includes(searchQuery) ||
                        (e.specialties || []).some(s => s.toLowerCase().includes(searchQuery));
    const matchDept = deptFilter === 'all' || String(e.departmentId) === deptFilter;
    return matchSearch && matchDept;
  });

  const depts = state.departments || [];
  const positions = state.positions || [];

  container.innerHTML = `
    <div class="space-y-4">
      <!-- License Expiry Radar Banner -->
      <div class="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-bold shrink-0">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900">ระบบเรดาร์ติดตามใบอนุญาตประกอบวิชาชีพสัตวแพทย์ (License Expiry Radar)</h4>
            <p class="text-xs text-slate-600">ตรวจพบใบอนุญาตสัตวแพทย์ที่ใกล้หมดอายุภายใน 60 วัน จำนวน 1 ท่าน (สพ.ญ. ศศิธร สุวรรณมาลี วพ. 12890 หมดอายุ 15 เม.ย. 2026)</p>
          </div>
        </div>
        <button onclick="showToast('แจ้งเตือนต่ออายุ', 'ส่งหนังสือแจ้งเตือนการต่ออายุใบอนุญาต วพ. ไปยังอีเมลของแพทย์แล้ว', 'info')" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-extrabold rounded-lg shadow-sm transition cursor-pointer shrink-0">
          <span>แจ้งเตือนต่ออายุ วพ.</span>
        </button>
      </div>

      <!-- Staff Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${employees.map(emp => {
          const dept = depts.find(d => d.id === emp.departmentId);
          const pos = positions.find(p => p.id === emp.positionId);
          const qualificationsCount = (state.employeeQualifications || []).filter(q => q.employeeId === emp.id).length;
          const skillsCount = (state.employeeSkills || []).filter(s => s.employeeId === emp.id).length;

          let licenseBadge = '';
          if (emp.licenseStatus === 'EXPIRING_SOON') {
            licenseBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">⚠️ ใกล้หมดอายุ (<60 วัน)</span>';
          } else if (emp.licenseStatus === 'ACTIVE') {
            licenseBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">🟢 ใช้งานได้ปกติ</span>';
          } else {
            licenseBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">ไม่ต้องใช้ใบอนุญาต</span>';
          }

          return `
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <!-- Header -->
                <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div class="flex items-center gap-3">
                    <img src="${emp.avatar}" alt="${emp.firstName}" class="w-12 h-12 rounded-xl object-cover border border-slate-200">
                    <div>
                      <div class="flex items-center gap-2">
                        <h4 class="font-bold text-slate-900 text-sm">${emp.title} ${emp.firstName} ${emp.lastName}</h4>
                        <span class="text-xs text-emerald-700 font-semibold">(${emp.nickname})</span>
                      </div>
                      <p class="text-xs text-slate-500 mt-0.5">${pos ? pos.name : 'เจ้าหน้าที่'} • <span class="text-slate-700 font-medium">${dept ? dept.name : '-'}</span></p>
                    </div>
                  </div>
                  <span class="font-mono text-xs text-slate-400 font-bold">${emp.employeeCode}</span>
                </div>

                <!-- License Radar Section -->
                <div class="mt-3.5 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500 font-medium">ใบอนุญาตวิชาชีพ:</span>
                    <div class="flex items-center gap-2">
                      <strong class="font-mono text-slate-800 font-bold">${emp.licenseNumber}</strong>
                      ${licenseBadge}
                    </div>
                  </div>
                  <div class="flex items-center justify-between text-[11px] text-slate-400">
                    <span>วันหมดอายุใบอนุญาต:</span>
                    <span class="font-mono text-slate-600 font-semibold">${emp.licenseExpiry}</span>
                  </div>
                </div>

                <!-- Specialties & Skills Pills -->
                <div class="mt-3">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">ความเชี่ยวชาญเฉพาะทาง (Specialties)</span>
                  <div class="flex flex-wrap gap-1.5">
                    ${(emp.specialties || []).map(s => `
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60">${s}</span>
                    `).join('')}
                  </div>
                </div>

                <!-- Contact & Credentials Badges -->
                <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <p class="flex items-center gap-1.5">
                    <i data-lucide="phone" class="w-3.5 h-3.5 text-slate-400"></i>
                    <span class="font-mono">${emp.phone}</span>
                  </p>
                  <span class="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                    <i data-lucide="award" class="w-3.5 h-3.5"></i>
                    <span>${qualificationsCount} วุฒิ • ${skillsCount} ทักษะรับรอง</span>
                  </span>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-500 font-medium">เริ่มงาน: ${emp.hireDate}</span>
                <div class="flex items-center gap-2">
                  <button onclick="openEmployeeCredentialsModal(${emp.id})" class="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition cursor-pointer flex items-center gap-1 border border-teal-200">
                    <i data-lucide="award" class="w-3.5 h-3.5"></i>
                    <span>ทักษะ & วุฒิการศึกษา</span>
                  </button>
                  <button onclick="openPayslipModal(${emp.id})" class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1">
                    <i data-lucide="receipt" class="w-3.5 h-3.5 text-slate-500"></i>
                    <span>สลิปเงินเดือน</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  lucide.createIcons();
}

// --- TAB 3: TIME ATTENDANCE & OVERTIME REQUESTS ---
function renderStaffAttendanceTab(container) {
  const records = state.attendanceRecords || [];
  const employees = state.employees || [];
  const otRequests = state.overtimeRequests || [];

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Attendance Action Bar -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-200 shrink-0">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900">บันทึกเวลาปฏิบัติงาน & การทำงานล่วงเวลา (Time Attendance & OT)</h4>
            <p class="text-xs text-slate-500">ระบบจำลองการสแกนใบหน้า / สแกน QR Code เข้างาน ประจำวันที่ 2 มีนาคม 2026</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="openNewOtRequestModal()" class="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold rounded-lg shadow-2xs transition active:scale-95 cursor-pointer flex items-center gap-1.5">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>+ ขออนุมัติ OT ล่วงหน้า</span>
          </button>
          <button onclick="simulateClockIn()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-lg shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1.5">
            <i data-lucide="fingerprint" class="w-4 h-4"></i>
            <span>⚡ จำลองลงเวลา (Clock-In)</span>
          </button>
        </div>
      </div>

      <!-- 1. Daily Attendance Table -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h5 class="text-xs font-bold text-slate-800 uppercase tracking-wider">รายการลงเวลาปฏิบัติงานวันนี้ (${records.length} รายการ)</h5>
          <span class="text-xs text-slate-500 font-medium">คำนวณชั่วโมงล่วงเวลาอัตโนมัติ</span>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th class="py-2.5 px-3 font-semibold">บุคลากร</th>
                <th class="py-2.5 px-3 font-semibold text-center">กะงานตามตาราง</th>
                <th class="py-2.5 px-3 font-semibold text-center">เวลาเข้างานจริง</th>
                <th class="py-2.5 px-3 font-semibold text-center">เวลาออกงานจริง</th>
                <th class="py-2.5 px-3 font-semibold text-center">สถานะเข้างาน</th>
                <th class="py-2.5 px-3 font-semibold text-right">ชั่วโมง OT</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${records.map(rec => {
                const emp = employees.find(e => e.id === rec.employeeId);
                if (!emp) return '';

                let statusBadge = '';
                if (rec.status === 'ON_TIME') {
                  statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">🟢 ตรงเวลา (On Time)</span>';
                } else if (rec.status === 'LATE') {
                  statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">🟡 มาสาย (Late)</span>';
                } else {
                  statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">🔵 ล่วงเวลา (OT)</span>';
                }

                return `
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-3 px-3">
                      <div class="flex items-center gap-2.5">
                        <img src="${emp.avatar}" class="w-8 h-8 rounded-lg object-cover border border-slate-200">
                        <div>
                          <strong class="font-bold text-slate-900 block">${emp.title} ${emp.firstName} ${emp.lastName}</strong>
                          <span class="text-[10px] text-slate-400 font-mono">${emp.employeeCode}</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-3 text-center font-bold text-slate-700">กะ ${rec.shiftCode} (08:00 - 17:00)</td>
                    <td class="py-3 px-3 text-center font-mono font-semibold text-slate-800">${rec.checkIn || '-'}</td>
                    <td class="py-3 px-3 text-center font-mono text-slate-500">${rec.checkOut || 'ยังไม่ลงเวลาออก'}</td>
                    <td class="py-3 px-3 text-center">${statusBadge}</td>
                    <td class="py-3 px-3 text-right font-mono font-bold text-slate-700">${rec.otHours} ชม.</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2. Overtime Pre-Approval Requests Section -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <i data-lucide="file-clock" class="w-4 h-4"></i>
            </div>
            <div>
              <h5 class="text-xs font-bold text-slate-800 uppercase tracking-wider">คำขอทำงานล่วงเวลา (Overtime Pre-Approvals & Workflow)</h5>
              <p class="text-[11px] text-slate-500">การขออนุมัติชั่วโมง OT นอกเวลาก่อนปฏิบัติงาน เชื่อมต่อตรงสู่การคำนวณเงินเดือน</p>
            </div>
          </div>
          <button onclick="openNewOtRequestModal()" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>+ ขอ OT ใหม่</span>
          </button>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th class="py-2 px-3 font-semibold">บุคลากร</th>
                <th class="py-2 px-3 font-semibold text-center">วันที่ขอปฏิบัติงาน</th>
                <th class="py-2 px-3 font-semibold text-center">ช่วงเวลา & จำนวน</th>
                <th class="py-2 px-3 font-semibold text-right">ค่าตอบแทนประมาณการ</th>
                <th class="py-2 px-3 font-semibold">เหตุผลความจำเป็น</th>
                <th class="py-2 px-3 font-semibold text-center">สถานะ</th>
                <th class="py-2 px-3 font-semibold text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${otRequests.map(ot => {
                const emp = employees.find(e => e.id === ot.employeeId);
                if (!emp) return '';

                let statusBadge = '';
                if (ot.status === 'APPROVED') {
                  statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ อนุมัติแล้ว</span>';
                } else if (ot.status === 'REJECTED') {
                  statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">ปฏิเสธ</span>';
                } else {
                  statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">⏳ รออนุมัติ</span>';
                }

                return `
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-2.5 px-3">
                      <strong class="font-bold text-slate-800 block">${emp.title} ${emp.firstName}</strong>
                      <span class="text-[10px] text-slate-400 font-mono">${emp.employeeCode}</span>
                    </td>
                    <td class="py-2.5 px-3 text-center font-mono">${ot.workDate}</td>
                    <td class="py-2.5 px-3 text-center font-mono">
                      <span>${ot.startAt} - ${ot.endAt}</span>
                      <strong class="text-blue-700 block font-bold">(${ot.hours} ชม.)</strong>
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-800">฿${(ot.totalEstimatedOt || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                    <td class="py-2.5 px-3 text-slate-600 max-w-xs truncate" title="${ot.reason}">${ot.reason}</td>
                    <td class="py-2.5 px-3 text-center">${statusBadge}</td>
                    <td class="py-2.5 px-3 text-right">
                      ${ot.status === 'PENDING' ? `
                        <div class="flex items-center justify-end gap-1">
                          <button onclick="approveOtRequest(${ot.id})" class="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition cursor-pointer">อนุมัติ</button>
                          <button onclick="rejectOtRequest(${ot.id})" class="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] transition cursor-pointer">ปฏิเสธ</button>
                        </div>
                      ` : '<span class="text-[10px] text-slate-400">เสร็จสิ้น</span>'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// --- TAB 4: LEAVE MANAGEMENT & PAYROLL RUNS ---
function renderStaffPayrollTab(container) {
  const leaves = state.leaveRequests || [];
  const payrollRuns = state.payrollRuns || [];
  const activeRun = payrollRuns[1] || payrollRuns[0] || {}; // Default to Run 2 (March 2026)
  const items = (state.payrollItems || []).filter(i => i.payrollRunId === activeRun.id);
  const employees = state.employees || [];

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Leave Requests Section with "+ ยื่นคำขอลาใหม่" Button -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <i data-lucide="calendar-off" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">การบริหารคำขอลาและโควตาวันหยุด (Leave Quotas & Approvals)</h4>
              <p class="text-xs text-slate-500">ตรวจสอบสิทธิ์วันลาคงเหลือและพิจารณาอนุมัติคำขอลาของบุคลากร</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              ${leaves.filter(l => l.status === 'PENDING').length} คำขอรออนุมัติ
            </span>
            <button onclick="openNewLeaveModal()" class="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>+ ยื่นคำขอลาใหม่</span>
            </button>
          </div>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th class="py-2.5 px-3 font-semibold">ผู้ขอลา</th>
                <th class="py-2.5 px-3 font-semibold text-center">ประเภทการลา</th>
                <th class="py-2.5 px-3 font-semibold text-center">ช่วงวันที่ลา</th>
                <th class="py-2.5 px-3 font-semibold text-center">จำนวนวัน</th>
                <th class="py-2.5 px-3 font-semibold">เหตุผลการลา</th>
                <th class="py-2.5 px-3 font-semibold text-center">สถานะ</th>
                <th class="py-2.5 px-3 font-semibold text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${leaves.map(l => {
                const emp = employees.find(e => e.id === l.employeeId);
                if (!emp) return '';

                let typeName = l.leaveType === 'VACATION' ? '🏖️ พักผ่อนประจำปี' : (l.leaveType === 'SICK' ? '💊 ลาป่วย' : '💼 ลากิจ');
                let statusBadge = l.status === 'APPROVED' ?
                  '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">อนุมัติแล้ว</span>' :
                  (l.status === 'REJECTED' ?
                    '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">ปฏิเสธ</span>' :
                    '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">รออนุมัติ</span>');

                return `
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-2.5 px-3 font-bold text-slate-800">${emp.title} ${emp.firstName} ${emp.lastName}</td>
                    <td class="py-2.5 px-3 text-center"><span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">${typeName}</span></td>
                    <td class="py-2.5 px-3 text-center font-mono">${l.startDate} - ${l.endDate}</td>
                    <td class="py-2.5 px-3 text-center font-bold text-slate-700">${l.days} วัน</td>
                    <td class="py-2.5 px-3 text-slate-600">${l.reason}</td>
                    <td class="py-2.5 px-3 text-center">${statusBadge}</td>
                    <td class="py-2.5 px-3 text-right">
                      ${l.status === 'PENDING' ? `
                        <div class="flex items-center justify-end gap-1.5">
                          <button onclick="approveLeaveRequest(${l.id})" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition cursor-pointer">อนุมัติ</button>
                          <button onclick="rejectLeaveRequest(${l.id})" class="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] transition cursor-pointer">ปฏิเสธ</button>
                        </div>
                      ` : `<span class="text-[10px] text-slate-400">เสร็จสิ้น</span>`}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Monthly Payroll Summary & Calculation Action -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <i data-lucide="banknote" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">การประมวลผลและจ่ายเงินเดือนบุคลากร (Payroll Processing Engine)</h4>
              <p class="text-xs text-slate-500">${activeRun.periodName || 'รอบปัจจุบัน'}</p>
            </div>
          </div>

          <!-- Actions & Status -->
          <div class="flex items-center gap-3 text-xs">
            <div class="text-right">
              <span class="text-[10px] text-slate-400 block">ยอดจ่ายสุทธิรวม</span>
              <span class="text-base font-extrabold text-emerald-900">฿${(activeRun.totalNet || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
            </div>
            ${activeRun.status === 'PAID' ? `
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">จ่ายแล้ว (PAID)</span>
            ` : `
              <button onclick="runPayrollCalculation(${activeRun.id})" class="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold rounded-lg shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1.5">
                <i data-lucide="calculator" class="w-4 h-4"></i>
                <span>⚡ ประมวลผลรอบเงินเดือน มี.ค. 2026</span>
              </button>
            `}
          </div>
        </div>

        <!-- Payroll Items Table -->
        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th class="py-2.5 px-3 font-semibold">บุคลากร</th>
                <th class="py-2.5 px-3 font-semibold text-right">เงินเดือนฐาน</th>
                <th class="py-2.5 px-3 font-semibold text-right">ค่าเวร & วิชาชีพ</th>
                <th class="py-2.5 px-3 font-semibold text-right">ค่าล่วงเวลา (OT)</th>
                <th class="py-2.5 px-3 font-semibold text-right">หักประกันสังคม & ภาษี</th>
                <th class="py-2.5 px-3 font-semibold text-right">ยอดรับสุทธิ (Net)</th>
                <th class="py-2.5 px-3 font-semibold text-center">สลิปเงินเดือน</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${employees.map(emp => {
                const item = items.find(i => i.employeeId === emp.id) || {
                  baseSalary: emp.baseSalary,
                  dutyAllowance: 3000,
                  licenseAllowance: 2000,
                  overtimePay: 1500,
                  socialSecurity: 750,
                  withholdingTax: 1200,
                  netPayable: emp.baseSalary + 3000 + 2000 + 1500 - 750 - 1200
                };

                return `
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-2.5 px-3">
                      <strong class="font-bold text-slate-800 block">${emp.title} ${emp.firstName} ${emp.lastName}</strong>
                      <span class="text-[10px] text-slate-400 font-mono">${emp.employeeCode}</span>
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono text-slate-700">฿${item.baseSalary.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                    <td class="py-2.5 px-3 text-right font-mono text-slate-700">฿${((item.dutyAllowance || 0) + (item.licenseAllowance || 0)).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                    <td class="py-2.5 px-3 text-right font-mono text-slate-700">฿${(item.overtimePay || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                    <td class="py-2.5 px-3 text-right font-mono text-rose-600">-฿${((item.socialSecurity || 750) + (item.withholdingTax || 0)).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                    <td class="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">฿${item.netPayable.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                    <td class="py-2.5 px-3 text-center">
                      <button onclick="openPayslipModal(${emp.id})" class="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1 mx-auto">
                        <i data-lucide="receipt" class="w-3.5 h-3.5 text-slate-500"></i>
                        <span>ดูสลิป</span>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// --- PAYROLL CALCULATION ENGINE ---
function runPayrollCalculation(runId = 2) {
  const payrollRun = (state.payrollRuns || []).find(r => r.id === Number(runId));
  if (!payrollRun) return;

  const employees = state.employees || [];
  const approvedOt = state.overtimeRequests ? state.overtimeRequests.filter(ot => ot.status === 'APPROVED') : [];

  let totalGross = 0;
  let totalDeductions = 0;
  let totalNet = 0;
  const newPayrollItems = [];

  employees.forEach((emp, idx) => {
    // Calculate OT from approved requests for this employee
    const empOtHours = approvedOt
      .filter(ot => ot.employeeId === emp.id)
      .reduce((sum, ot) => sum + (ot.hours || 0), 0);
    const hourlyRate = Math.round((emp.baseSalary / 30 / 8) * 1.5);
    const otPay = empOtHours > 0 ? empOtHours * hourlyRate : (idx % 2 === 0 ? 1500 : 2000);

    const dutyAllowance = emp.departmentId === 1 ? 4000 : 1500;
    const licenseAllowance = emp.licenseStatus === 'ACTIVE' ? 3000 : 0;

    const gross = emp.baseSalary + dutyAllowance + licenseAllowance + otPay;
    const sso = 750; // Standard Thai SSO max 750 THB
    const taxRate = emp.baseSalary > 50000 ? 0.05 : 0.03;
    const tax = Math.round(emp.baseSalary * taxRate);
    const deductions = sso + tax;
    const net = gross - deductions;

    totalGross += gross;
    totalDeductions += deductions;
    totalNet += net;

    newPayrollItems.push({
      id: (state.payrollItems || []).length + idx + 1,
      payrollRunId: payrollRun.id,
      employeeId: emp.id,
      baseSalary: emp.baseSalary,
      dutyAllowance: dutyAllowance,
      licenseAllowance: licenseAllowance,
      overtimePay: otPay,
      grossEarnings: gross,
      socialSecurity: sso,
      withholdingTax: tax,
      totalDeductions: deductions,
      netPayable: net
    });
  });

  // Remove previous draft items for this run and insert updated
  state.payrollItems = (state.payrollItems || []).filter(i => i.payrollRunId !== payrollRun.id).concat(newPayrollItems);

  payrollRun.totalGross = totalGross;
  payrollRun.totalDeductions = totalDeductions;
  payrollRun.totalNet = totalNet;
  payrollRun.status = 'PAID';
  payrollRun.processedAt = '2026-03-02 14:00';

  renderCurrentView();
  showToast('ประมวลผลรอบเงินเดือนสำเร็จ!', `ปิดรอบ ${payrollRun.periodName} สุทธิ ฿${totalNet.toLocaleString('th-TH', {minimumFractionDigits: 2})} เรียบร้อยแล้ว`, 'success');
}

// --- ACTIONS: CLOCK-IN SIMULATION ---
function simulateClockIn() {
  const records = state.attendanceRecords || [];
  const nextId = records.length + 1;
  const emp = state.employees[2]; // Dr. Theerapat

  records.unshift({
    id: nextId,
    employeeId: emp.id,
    workDate: '2026-03-02',
    shiftCode: 'E',
    checkIn: '2026-03-02 11:55',
    checkOut: null,
    status: 'ON_TIME',
    otHours: 0,
    remarks: 'ลงเวลาผ่านระบบอัตโนมัติ'
  });

  renderCurrentView();
  showToast('ลงเวลาเข้างานสำเร็จ!', `บันทึกเวลาเข้างานของ ${emp.title} ${emp.firstName} (11:55 น.) ตรงเวลาเรียบร้อย`, 'success');
}

// --- ACTIONS: OVERTIME PRE-APPROVAL MODAL & LOGIC ---
function openNewOtRequestModal() {
  const select = document.getElementById('ot-form-employee');
  if (select) {
    select.innerHTML = (state.employees || []).map(e => `
      <option value="${e.id}">${e.employeeCode}: ${e.title} ${e.firstName} ${e.lastName} (${e.nickname})</option>
    `).join('');
  }
  document.getElementById('modal-ot-request')?.classList.remove('hidden');
  lucide.createIcons();
}

function closeOtRequestModal() {
  document.getElementById('modal-ot-request')?.classList.add('hidden');
}

function submitNewOtRequest(event) {
  if (event) event.preventDefault();

  const empId = Number(document.getElementById('ot-form-employee')?.value || 1);
  const date = document.getElementById('ot-form-date')?.value || '2026-03-02';
  const hours = parseFloat(document.getElementById('ot-form-hours')?.value || '2.0');
  const startAt = document.getElementById('ot-form-start-time')?.value || '17:00';
  const endAt = document.getElementById('ot-form-end-time')?.value || '19:00';
  const reason = (document.getElementById('ot-form-reason')?.value || '').trim();

  const emp = (state.employees || []).find(e => e.id === empId);
  const hourlyRate = emp ? Math.round((emp.baseSalary / 30 / 8) * 1.5) : 300;
  const estimatedPay = hours * hourlyRate;

  if (!state.overtimeRequests) state.overtimeRequests = [];
  const nextId = state.overtimeRequests.length + 1;

  state.overtimeRequests.unshift({
    id: nextId,
    employeeId: empId,
    workDate: date,
    startAt: startAt,
    endAt: endAt,
    hours: hours,
    hourlyRate: hourlyRate,
    totalEstimatedOt: estimatedPay,
    reason: reason || 'ปฏิบัติงานนอกเวลากรณีพิเศษ',
    approvedBy: null,
    status: 'PENDING',
    appliedAt: '2026-03-02 13:45'
  });

  closeOtRequestModal();
  renderCurrentView();
  showToast('ยื่นขอ OT สำเร็จ!', `ส่งคำขอทำงานล่วงเวลา ${hours} ชม. เพื่อรอการอนุมัติแล้ว`, 'success');
}

function approveOtRequest(otId) {
  const ot = (state.overtimeRequests || []).find(o => o.id === Number(otId));
  if (!ot) return;

  ot.status = 'APPROVED';
  ot.approvedBy = 1;

  // Add OT hours to attendance records if matching date
  const att = (state.attendanceRecords || []).find(a => a.employeeId === ot.employeeId && a.workDate === ot.workDate);
  if (att) {
    att.otHours = (att.otHours || 0) + ot.hours;
    att.status = 'OT';
  }

  renderCurrentView();
  showToast('อนุมัติ OT เรียบร้อย', `อนุมัติคำขอทำงานล่วงเวลา ${ot.hours} ชม. และบันทึกเข้าสู่ระบบคำนวณเงินเดือนแล้ว`, 'success');
}

function rejectOtRequest(otId) {
  const ot = (state.overtimeRequests || []).find(o => o.id === Number(otId));
  if (!ot) return;

  ot.status = 'REJECTED';
  renderCurrentView();
  showToast('ปฏิเสธคำขอ OT', 'ส่งผลการพิจารณาปฏิเสธคำขอทำงานล่วงเวลาแล้ว', 'info');
}

// --- ACTIONS: LEAVE REQUEST MODAL WITH REAL-TIME QUOTA & LOGIC ---
function openNewLeaveModal() {
  const select = document.getElementById('leave-form-employee');
  const employees = state.employees || [];

  if (select) {
    select.innerHTML = employees.map(e => `
      <option value="${e.id}">${e.employeeCode}: ${e.title} ${e.firstName} ${e.lastName} (${e.nickname})</option>
    `).join('');
  }

  const startDateInput = document.getElementById('leave-form-start-date');
  const endDateInput = document.getElementById('leave-form-end-date');
  if (startDateInput) startDateInput.value = '2026-03-09';
  if (endDateInput) endDateInput.value = '2026-03-09';

  onLeaveEmployeeChanged(employees[0]?.id || 1);
  updateLeaveCalculatedDays();

  document.getElementById('modal-leave-request')?.classList.remove('hidden');
  lucide.createIcons();
}

function closeLeaveRequestModal() {
  document.getElementById('modal-leave-request')?.classList.add('hidden');
}

function onLeaveEmployeeChanged(empId) {
  const emp = (state.employees || []).find(e => e.id === Number(empId));
  const container = document.getElementById('leave-quota-cards');
  if (!container || !emp) return;

  const quotas = emp.leaveQuotas || {
    vacation: { total: 10, used: 2 },
    sick: { total: 30, used: 1 },
    business: { total: 3, used: 0 }
  };

  const vacRem = Math.max(0, quotas.vacation.total - quotas.vacation.used);
  const sickRem = Math.max(0, quotas.sick.total - quotas.sick.used);
  const busRem = Math.max(0, quotas.business.total - quotas.business.used);

  container.innerHTML = `
    <div class="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200 text-center">
      <span class="text-[10px] text-blue-700 block font-semibold">🏖️ พักผ่อน</span>
      <span class="text-sm font-black text-blue-950 font-mono">${vacRem} วัน</span>
      <span class="text-[9px] text-slate-400 block mt-0.5">ใช้ไป ${quotas.vacation.used}/${quotas.vacation.total}</span>
    </div>
    <div class="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 text-center">
      <span class="text-[10px] text-emerald-700 block font-semibold">💊 ลาป่วย</span>
      <span class="text-sm font-black text-emerald-950 font-mono">${sickRem} วัน</span>
      <span class="text-[9px] text-slate-400 block mt-0.5">ใช้ไป ${quotas.sick.used}/${quotas.sick.total}</span>
    </div>
    <div class="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-center">
      <span class="text-[10px] text-amber-700 block font-semibold">💼 ลากิจ</span>
      <span class="text-sm font-black text-amber-950 font-mono">${busRem} วัน</span>
      <span class="text-[9px] text-slate-400 block mt-0.5">ใช้ไป ${quotas.business.used}/${quotas.business.total}</span>
    </div>
  `;

  updateLeaveCalculatedDays();
}

function updateLeaveCalculatedDays() {
  const startInput = document.getElementById('leave-form-start-date');
  const endInput = document.getElementById('leave-form-end-date');
  const totalLabel = document.getElementById('leave-form-total-days');
  const warning = document.getElementById('leave-form-warning');
  const submitBtn = document.getElementById('btn-submit-leave');
  const typeSelect = document.getElementById('leave-form-type');
  const empSelect = document.getElementById('leave-form-employee');

  if (!startInput || !endInput) return;

  const start = new Date(startInput.value);
  const end = new Date(endInput.value);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    if (totalLabel) totalLabel.innerText = '1 วัน';
    return;
  }

  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (totalLabel) totalLabel.innerText = `${diffDays} วัน`;

  // Check quota limit
  const empId = Number(empSelect ? empSelect.value : 1);
  const emp = (state.employees || []).find(e => e.id === empId);
  const leaveType = (typeSelect ? typeSelect.value : 'VACATION').toLowerCase();

  let quotaKey = 'vacation';
  if (leaveType === 'sick') quotaKey = 'sick';
  else if (leaveType === 'business') quotaKey = 'business';

  const quota = emp?.leaveQuotas?.[quotaKey] || { total: 10, used: 0 };
  const remaining = Math.max(0, quota.total - quota.used);

  if (diffDays > remaining) {
    if (warning) {
      warning.classList.remove('hidden');
      warning.innerText = `⚠️ จำนวนวันที่ขอลา (${diffDays} วัน) เกินสิทธิ์คงเหลือ (${remaining} วัน)`;
    }
    if (submitBtn) submitBtn.disabled = true;
  } else {
    if (warning) warning.classList.add('hidden');
    if (submitBtn) submitBtn.disabled = false;
  }
}

function submitNewLeaveRequest(event) {
  if (event) event.preventDefault();

  const empId = Number(document.getElementById('leave-form-employee')?.value || 1);
  const type = document.getElementById('leave-form-type')?.value || 'VACATION';
  const startDate = document.getElementById('leave-form-start-date')?.value || '2026-03-09';
  const endDate = document.getElementById('leave-form-end-date')?.value || '2026-03-09';
  const reason = (document.getElementById('leave-form-reason')?.value || '').trim();

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1);

  if (!state.leaveRequests) state.leaveRequests = [];
  const nextId = state.leaveRequests.length + 1;

  state.leaveRequests.unshift({
    id: nextId,
    employeeId: empId,
    leaveType: type,
    startDate: startDate,
    endDate: endDate,
    days: diffDays,
    reason: reason || 'ลากิจธุระจำเป็น',
    status: 'PENDING',
    approvedBy: null,
    appliedAt: '2026-03-02 13:50'
  });

  closeLeaveRequestModal();
  renderCurrentView();
  showToast('ยื่นคำขอลาสำเร็จ!', `สร้างคำขอลา ${diffDays} วัน รอการพิจารณาอนุมัติเรียบร้อย`, 'success');
}

function approveLeaveRequest(leaveId) {
  const leave = (state.leaveRequests || []).find(l => l.id === Number(leaveId));
  if (!leave) return;

  leave.status = 'APPROVED';
  leave.approvedBy = 1;

  // Deduct from employee's leave quotas
  const emp = (state.employees || []).find(e => e.id === leave.employeeId);
  if (emp && emp.leaveQuotas) {
    let key = 'vacation';
    if (leave.leaveType === 'SICK') key = 'sick';
    else if (leave.leaveType === 'BUSINESS') key = 'business';

    if (emp.leaveQuotas[key]) {
      emp.leaveQuotas[key].used = (emp.leaveQuotas[key].used || 0) + (leave.days || 1);
    }
  }

  renderCurrentView();
  showToast('อนุมัติคำขอลาสำเร็จ', `คำขอลาได้รับการอนุมัติและหักยอดโควตาวันลาคงเหลือของบุคลากรแล้ว`, 'success');
}

function rejectLeaveRequest(leaveId) {
  const leave = (state.leaveRequests || []).find(l => l.id === Number(leaveId));
  if (!leave) return;
  leave.status = 'REJECTED';
  renderCurrentView();
  showToast('ปฏิเสธคำขอลา', 'ส่งการแจ้งเตือนผลการพิจารณาคำขอลาแล้ว', 'info');
}

// --- ACTIONS: SHIFT SWAP MODAL ---
function openShiftSwapModal(rosterId) {
  const modal = document.getElementById('modal-shift-swap');
  if (!modal) return;

  window.currentSwapRosterId = rosterId;
  const roster = (state.dutyRosters || []).find(r => r.id === rosterId) || (state.dutyRosters || [])[0];
  const curEmp = (state.employees || []).find(e => e.id === (roster ? roster.employeeId : 1));
  const curRoom = (state.rooms || []).find(rm => rm.id === (roster ? roster.roomId : 1));
  const dayNames = { MON: 'จันทร์', TUE: 'อังคาร', WED: 'พุธ', THU: 'พฤหัสบดี', FRI: 'ศุกร์', SAT: 'เสาร์', SUN: 'อาทิตย์' };
  const shiftNames = { M: 'กะเช้า (08:00 - 17:00)', E: 'กะบ่าย (12:00 - 21:00)', N: 'กะดึก/ฉุกเฉิน (20:00 - 08:00)', OFF: 'วันหยุด' };

  const body = document.getElementById('shift-swap-modal-body');
  if (body && roster) {
    body.innerHTML = `
      <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1.5">
        <div class="font-bold text-amber-900 flex items-center gap-1.5">
          <i data-lucide="calendar" class="w-4 h-4 text-amber-600"></i>
          <span>ข้อมูลเวรปฏิบัติงานปัจจุบัน</span>
        </div>
        <p class="text-amber-800">วัน: <strong>วัน${dayNames[roster.dayOfWeek] || roster.dayOfWeek}</strong> | กะ: <strong>${shiftNames[roster.shiftCode] || roster.shiftCode}</strong></p>
        <p class="text-amber-800">ห้องตรวจ: <strong>${curRoom ? curRoom.name : 'ส่วนกลาง / ตรวจทั่วไป'}</strong></p>
        <p class="text-amber-800">แพทย์ประจำเวรเดิม: <strong>${curEmp ? curEmp.title + ' ' + curEmp.firstName + ' ' + curEmp.lastName + ' (' + curEmp.nickname + ')' : '-'}</strong></p>
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">เลือกแพทย์ที่ต้องการให้เข้าเวรแทน (Target Doctor)</label>
        <select id="swap-target-doctor" class="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 font-medium">
          ${(state.employees || []).filter(e => e.departmentId === 1 && e.id !== (curEmp ? curEmp.id : 0)).map(e => `
            <option value="${e.id}">${e.title} ${e.firstName} ${e.lastName} (${e.nickname}) - ${e.licenseNumber}</option>
          `).join('')}
        </select>
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">เหตุผลความจำเป็นในการขอสลับเวร</label>
        <input type="text" id="swap-reason" value="ติดภารกิจสัมมนาวิชาการทางสัตวแพทย์" class="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500" />
      </div>
    `;
  }
  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeShiftSwapModal() {
  document.getElementById('modal-shift-swap')?.classList.add('hidden');
}

function submitShiftSwap() {
  const targetSelect = document.getElementById('swap-target-doctor');
  const targetEmpId = targetSelect ? Number(targetSelect.value) : 2;
  const rosterId = window.currentSwapRosterId || 1;

  const roster = (state.dutyRosters || []).find(r => r.id === rosterId);
  if (roster) {
    roster.employeeId = targetEmpId;
  }

  closeShiftSwapModal();
  renderCurrentView();
  showToast('สลับเวรตรวจสำเร็จ!', 'ปรับปรุงตารางเวรและซิงก์ชื่อแพทย์ผู้ตรวจเข้าสู่ห้องตรวจ EMR แล้ว', 'success');
}

function simulateShiftNotification() {
  showToast('ส่งแจ้งเตือนตารางเวรแล้ว', 'ส่งสรุปตารางเวรประจำสัปดาห์ไปยังกลุ่ม LINE บุคลากรเรียบร้อยแล้ว', 'success');
}

// --- EMPLOYEE CREDENTIALS & SKILLS MATRIX MODAL ---
function openEmployeeCredentialsModal(employeeId) {
  const emp = (state.employees || []).find(e => e.id === Number(employeeId));
  if (!emp) return;

  const qualifications = (state.employeeQualifications || []).filter(q => q.employeeId === emp.id);
  const skills = (state.employeeSkills || []).filter(s => s.employeeId === emp.id);
  const licenses = (state.employeeLicenses || []).filter(l => l.employeeId === emp.id);
  const employments = (state.employments || []).filter(em => em.employeeId === emp.id);
  const pos = (state.positions || []).find(p => p.id === emp.positionId);
  const dept = (state.departments || []).find(d => d.id === emp.departmentId);

  const body = document.getElementById('employee-credentials-modal-body');
  if (!body) return;

  body.innerHTML = `
    <!-- Top Profile Summary -->
    <div class="flex items-center gap-3.5 pb-4 border-b border-slate-200">
      <img src="${emp.avatar}" alt="${emp.firstName}" class="w-14 h-14 rounded-2xl object-cover border border-slate-300 shadow-2xs">
      <div>
        <div class="flex items-center gap-2">
          <h4 class="font-extrabold text-slate-900 text-sm">${emp.title} ${emp.firstName} ${emp.lastName}</h4>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
            ${emp.nickname}
          </span>
        </div>
        <p class="text-xs text-slate-500 mt-0.5">${pos ? pos.name : '-'} • ${dept ? dept.name : '-'}</p>
        <p class="text-[11px] font-mono text-slate-400 mt-0.5">${emp.employeeCode} • เริ่มงาน ${emp.hireDate}</p>
      </div>
    </div>

    <!-- 1. Educational Qualifications -->
    <div>
      <h5 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <i data-lucide="graduation-cap" class="w-4 h-4 text-teal-600"></i>
        <span>วุฒิการศึกษาและหนังสือรับรอง (Qualifications & Degrees)</span>
      </h5>
      <div class="space-y-2">
        ${qualifications.length === 0 ? '<p class="text-xs text-slate-400 italic">ไม่มีข้อมูลวุฒิการศึกษา</p>' : qualifications.map(q => `
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <strong class="font-bold text-slate-800 block">${q.qualificationName}</strong>
              <span class="text-slate-500 text-[11px]">${q.institution}</span>
            </div>
            <div class="text-right font-mono text-[11px] text-slate-400">
              <span>สำเร็จ: ${q.issuedDate}</span>
              <span class="block text-teal-700 font-semibold">${q.documentReference}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 2. Verified Clinical Skills Matrix -->
    <div>
      <h5 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <i data-lucide="check-check" class="w-4 h-4 text-emerald-600"></i>
        <span>เมทริกซ์ทักษะทางคลินิกที่ผ่านการรับรอง (Clinical Competency Matrix)</span>
      </h5>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        ${skills.length === 0 ? '<p class="text-xs text-slate-400 italic col-span-2">ไม่มีข้อมูลทักษะที่บันทึก</p>' : skills.map(sk => {
          let levelBadge = '';
          if (sk.skillLevel === 'EXPERT') {
            levelBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">EXPERT (เชี่ยวชาญ)</span>';
          } else if (sk.skillLevel === 'PROFICIENT') {
            levelBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">PROFICIENT (ชำนาญ)</span>';
          } else {
            levelBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">COMPETENT</span>';
          }

          return `
            <div class="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs flex items-center justify-between">
              <div>
                <strong class="font-medium text-slate-800 block">${sk.skillName}</strong>
                <span class="text-[10px] text-slate-400">รับรองเมื่อ: ${sk.verifiedAt}</span>
              </div>
              <div>${levelBadge}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- 3. Professional Licenses Details -->
    <div>
      <h5 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <i data-lucide="shield-check" class="w-4 h-4 text-blue-600"></i>
        <span>ข้อมูลใบอนุญาตประกอบวิชาชีพ (Professional Licenses)</span>
      </h5>
      <div class="space-y-2">
        ${licenses.map(lic => `
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <span class="font-bold text-slate-800 block">${lic.licenseType}</span>
              <span class="font-mono text-slate-600 font-semibold">${lic.licenseNumber}</span>
            </div>
            <div class="text-right text-[11px]">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${lic.status === 'EXPIRING_SOON' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}">
                ${lic.status === 'EXPIRING_SOON' ? '⚠️ ใกล้หมดอายุ' : '🟢 ใช้งานได้'}
              </span>
              <span class="block text-slate-400 font-mono mt-0.5">หมดอายุ: ${lic.expiryDate}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('modal-employee-credentials')?.classList.remove('hidden');
  lucide.createIcons();
}

function closeEmployeeCredentialsModal() {
  document.getElementById('modal-employee-credentials')?.classList.add('hidden');
}

// --- OFFICIAL PAYSLIP MODAL VIEWER ---
function openPayslipModal(employeeId) {
  const emp = (state.employees || []).find(e => e.id === Number(employeeId)) || state.employees[0];
  const dept = (state.departments || []).find(d => d.id === emp.departmentId);
  const pos = (state.positions || []).find(p => p.id === emp.positionId);
  const activeRun = state.payrollRuns[1]?.status === 'PAID' ? state.payrollRuns[1] : (state.payrollRuns[0] || {});
  const item = (state.payrollItems || []).find(i => i.employeeId === emp.id && i.payrollRunId === activeRun.id) ||
               (state.payrollItems || []).find(i => i.employeeId === emp.id) || {
    baseSalary: emp.baseSalary,
    dutyAllowance: 3000,
    licenseAllowance: 2000,
    overtimePay: 1500,
    grossEarnings: emp.baseSalary + 6500,
    socialSecurity: 750,
    withholdingTax: 1200,
    totalDeductions: 1950,
    netPayable: emp.baseSalary + 6500 - 1950
  };

  const paper = document.getElementById('payslip-document-paper');
  if (paper) {
    paper.innerHTML = `
      <div class="bg-white border border-slate-300 shadow-md rounded-xl p-8 max-w-2xl w-full text-slate-800 font-sans text-xs print:border-none print:shadow-none print:p-0">
        <!-- Header -->
        <div class="flex items-start justify-between pb-4 border-b-2 border-slate-900">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-lg">
              V+
            </div>
            <div>
              <h3 class="text-sm font-black text-slate-900 tracking-tight">VETCARE+ ANIMAL HOSPITAL</h3>
              <p class="text-[11px] text-slate-500 font-semibold">ใบแสดงรายการเงินเดือนและค่าตอบแทน (Pay Slip)</p>
            </div>
          </div>
          <div class="text-right">
            <span class="inline-block px-2.5 py-0.5 bg-slate-900 text-white font-mono font-bold text-[11px] rounded uppercase">CONFIDENTIAL</span>
            <p class="text-[11px] text-slate-500 mt-1">รอบจ่าย: <strong>${activeRun.periodName || 'กุมภาพันธ์ 2026'}</strong></p>
            <p class="text-[10px] text-slate-400">วันที่จ่าย: ${activeRun.paymentDate || '28 ก.พ. 2026'}</p>
          </div>
        </div>

        <!-- Employee Info Grid -->
        <div class="grid grid-cols-2 gap-4 my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span class="text-[10px] text-slate-400 block font-medium">รหัสและชื่อบุคลากร</span>
            <strong class="text-slate-900">${emp.employeeCode}: ${emp.title} ${emp.firstName} ${emp.lastName}</strong>
            <p class="text-slate-500 text-[11px] mt-0.5">ตำแหน่ง: ${pos ? pos.name : '-'}</p>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 block font-medium">แผนก / สังกัด</span>
            <strong class="text-slate-800">${dept ? dept.name : '-'}</strong>
            <p class="text-slate-500 text-[11px] mt-0.5">เลขใบอนุญาต: ${emp.licenseNumber}</p>
          </div>
        </div>

        <!-- Earnings vs Deductions Table -->
        <div class="grid grid-cols-2 gap-4 border border-slate-200 rounded-lg overflow-hidden">
          <!-- Earnings -->
          <div class="border-r border-slate-200">
            <div class="bg-emerald-50 px-3 py-1.5 border-b border-slate-200 text-emerald-900 font-bold text-[11px]">
              รายได้ (Earnings)
            </div>
            <div class="p-3 space-y-1.5 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-600">เงินเดือนพื้นฐาน (Base Salary):</span>
                <span class="font-mono font-semibold">฿${item.baseSalary.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">ค่าตอบแทนเข้าเวร (Duty Allowance):</span>
                <span class="font-mono font-semibold">฿${(item.dutyAllowance || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">ค่าใบประกอบวิชาชีพ (License):</span>
                <span class="font-mono font-semibold">฿${(item.licenseAllowance || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">ค่าทำงานล่วงเวลา (Overtime):</span>
                <span class="font-mono font-semibold">฿${(item.overtimePay || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900">
                <span>รวมรายได้ทั้งหมด:</span>
                <span class="font-mono text-emerald-800">฿${(item.grossEarnings || (item.baseSalary + 6500)).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>

          <!-- Deductions -->
          <div>
            <div class="bg-rose-50 px-3 py-1.5 border-b border-slate-200 text-rose-900 font-bold text-[11px]">
              รายการหัก (Deductions)
            </div>
            <div class="p-3 space-y-1.5 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-600">ประกันสังคม (Social Security):</span>
                <span class="font-mono font-semibold text-rose-700">฿${(item.socialSecurity || 750).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">ภาษีหัก ณ ที่จ่าย (Withholding Tax):</span>
                <span class="font-mono font-semibold text-rose-700">฿${(item.withholdingTax || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div class="flex justify-between pt-6 border-t border-slate-100 font-bold text-slate-900">
                <span>รวมรายการหัก:</span>
                <span class="font-mono text-rose-700">฿${(item.totalDeductions || (750 + (item.withholdingTax || 0))).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Net Payable Banner -->
        <div class="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-300 flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-emerald-950 uppercase tracking-wider block">ยอดเงินได้สุทธิ (NET PAYABLE AMOUNT)</span>
            <span class="text-[11px] text-emerald-800">โอนเข้าบัญชีธนาคาร (Direct Deposit Verified)</span>
          </div>
          <div class="text-right">
            <span class="text-xl font-black text-emerald-900 font-mono">฿${item.netPayable.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
          </div>
        </div>

        <!-- Sign-off -->
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-slate-200 text-[10px] text-slate-400">
          <span>ออกโดยระบบอัตโนมัติ VETCARE+ HR Engine</span>
          <span>เอกสารนี้ได้รับการรับรองทางอิเล็กทรอนิกส์</span>
        </div>
      </div>
    `;
  }

  document.getElementById('modal-payslip-viewer')?.classList.remove('hidden');
  lucide.createIcons();
}

function closePayslipModal() {
  document.getElementById('modal-payslip-viewer')?.classList.add('hidden');
}

function printPayslip() {
  showToast('กำลังเตรียมพิมพ์สลิปเงินเดือน', 'ส่งเอกสารไปยังเครื่องพิมพ์เรียบร้อยแล้ว', 'info');
  window.print();
}

// --- SLIDE-OVER SHEET: REGISTER NEW STAFF ---
function openNewStaffSheet() {
  openSheetContainer();

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  badge.innerText = 'HR & WORKFORCE';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200';
  title.innerText = 'ลงทะเบียนบุคลากรใหม่ (New Staff Registration)';
  subtitle.innerText = 'บันทึกประวัติการจ้างงาน, แผนก, ตำแหน่ง และข้อมูลใบอนุญาตประกอบวิชาชีพ';

  body.innerHTML = `
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">คำนำหน้า *</label>
          <select id="staff-form-title" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500">
            <option value="น.สพ.">น.สพ. (นายสัตวแพทย์)</option>
            <option value="สพ.ญ.">สพ.ญ. (สัตวแพทย์หญิง)</option>
            <option value="ภก.">ภก. (เภสัชกร)</option>
            <option value="ภญ.">ภญ. (เภสัชกรหญิง)</option>
            <option value="นาย">นาย</option>
            <option value="น.ส.">น.ส.</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">ชื่อเล่น</label>
          <input type="text" id="staff-form-nickname" placeholder="เช่น หมอเก่ง" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">ชื่อจริง *</label>
          <input type="text" id="staff-form-firstname" placeholder="ระบุชื่อจริง" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">นามสกุล *</label>
          <input type="text" id="staff-form-lastname" placeholder="ระบุนามสกุล" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">แผนกที่สังกัด *</label>
          <select id="staff-form-dept" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500">
            ${(state.departments || []).map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">ตำแหน่งงาน *</label>
          <select id="staff-form-position" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500">
            ${(state.positions || []).map(p => `<option value="${p.id}">${p.name} (ฐาน ฿${p.baseSalary.toLocaleString()})</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Professional License -->
      <div class="pt-3 border-t border-slate-200">
        <h5 class="text-xs font-bold text-slate-800 mb-2">ข้อมูลใบอนุญาตประกอบวิชาชีพ (ถ้ามี)</h5>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">เลขที่ใบอนุญาต (เช่น วพ. 18920)</label>
            <input type="text" id="staff-form-license" placeholder="วพ. xxxxx" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-800 focus:outline-none focus:border-emerald-500">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">วันหมดอายุใบอนุญาต</label>
            <input type="date" id="staff-form-license-exp" value="2029-12-31" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-800 focus:outline-none focus:border-emerald-500">
          </div>
        </div>
      </div>

      <!-- Contact & Salary -->
      <div class="grid grid-cols-2 gap-3 pt-2">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์ติดต่อ</label>
          <input type="text" id="staff-form-phone" placeholder="08x-xxx-xxxx" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">เงินเดือนประจำ (บาท) *</label>
          <input type="number" id="staff-form-salary" value="45000" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-mono text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
        </div>
      </div>
    </div>
  `;

  footer.innerHTML = `
    <button onclick="closeSheet()" class="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer">ยกเลิก</button>
    <button onclick="submitNewStaff()" class="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5">
      <i data-lucide="check" class="w-4 h-4"></i>
      <span>บันทึกข้อมูลบุคลากร</span>
    </button>
  `;

  lucide.createIcons();
}

function submitNewStaff() {
  const title = document.getElementById('staff-form-title')?.value || 'น.สพ.';
  const firstname = (document.getElementById('staff-form-firstname')?.value || '').trim();
  const lastname = (document.getElementById('staff-form-lastname')?.value || '').trim();
  const nickname = (document.getElementById('staff-form-nickname')?.value || '').trim() || 'หมอ';
  const deptId = Number(document.getElementById('staff-form-dept')?.value || 1);
  const posId = Number(document.getElementById('staff-form-position')?.value || 3);
  const license = (document.getElementById('staff-form-license')?.value || '').trim() || '-';
  const licenseExp = document.getElementById('staff-form-license-exp')?.value || '2029-12-31';
  const phone = (document.getElementById('staff-form-phone')?.value || '').trim() || '089-999-9999';
  const salary = Number(document.getElementById('staff-form-salary')?.value || 45000);

  if (!firstname || !lastname) {
    showToast('กรุณากรอกข้อมูล', 'กรุณาระบุชื่อจริงและนามสกุลของบุคลากร', 'warning');
    return;
  }

  const nextId = (state.employees || []).length + 1;
  const code = `EMP-VET-00${nextId}`;

  const newEmp = {
    id: nextId,
    employeeCode: code,
    firstName: firstname,
    lastName: lastname,
    nickname: nickname,
    title: title,
    positionId: posId,
    departmentId: deptId,
    phone: phone,
    email: `${firstname.toLowerCase()}@vetcare.com`,
    hireDate: '2026-03-02',
    employmentStatus: 'ACTIVE',
    employmentType: 'FULL_TIME',
    baseSalary: salary,
    licenseNumber: license,
    licenseExpiry: licenseExp,
    licenseStatus: license !== '-' ? 'ACTIVE' : 'NOT_REQUIRED',
    specialties: ['อายุรกรรมทั่วไป'],
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    assignedRoomId: 1,
    leaveQuotas: {
      vacation: { total: 10, used: 0 },
      sick: { total: 30, used: 0 },
      business: { total: 3, used: 0 }
    }
  };

  state.employees.push(newEmp);

  // Central Event Bus Notification (D10 -> D02 & D03 Doctor Sync)
  if (window.ClinicEventBus && window.CLINIC_EVENTS) {
    window.ClinicEventBus.emit(window.CLINIC_EVENTS.STAFF_REGISTERED, {
      employee: newEmp
    });
  }

  closeSheet();
  state.activeStaffSubTab = 'employees';
  renderCurrentView();
  showToast('ลงทะเบียนสำเร็จ!', `เพิ่มบุคลากร ${title} ${firstname} ${lastname} เข้าสู่ระบบแล้ว`, 'success');
}
