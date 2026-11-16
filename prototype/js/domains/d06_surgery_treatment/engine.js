/**
 * ============================================================================
 * DOMAIN 06: SURGERY & TREATMENT MANAGEMENT ENGINE
 * ============================================================================
 * Architectural Alignment:
 * - docs/BusinessDomain/06.Surgery_and_Treatment_Management.md
 * - 20 Business Capabilities (3.1 - 3.20)
 * - Physical Database Design (Schema surgery.* - 13 Tables)
 * - 4 Sub-Tabs Lifecycle: Schedule & OR, Requests, Intraop & Vitals, Post-op Recovery
 * ============================================================================
 */

// --- 1. ENTITY LOOKUP & DATA ACCESS HELPERS ---

function getSurgeryCatalogById(id) {
  return state.surgeryCatalogs.find(c => c.id === Number(id)) || null;
}

function getSurgeryScheduleById(id) {
  return state.surgerySchedules.find(s => s.id === Number(id)) || null;
}

function getSurgeryRequestById(id) {
  return state.surgeryRequests.find(r => r.id === Number(id)) || null;
}

function getPreOpAssessmentByScheduleId(scheduleId) {
  return state.preoperativeAssessments.find(a => a.schedule_id === Number(scheduleId)) || null;
}

function getSurgeryConsentByScheduleId(scheduleId) {
  return state.surgeryConsents.find(c => c.schedule_id === Number(scheduleId)) || null;
}

function getSurgeryRecordByScheduleId(scheduleId) {
  return state.surgeryRecords.find(r => r.schedule_id === Number(scheduleId)) || null;
}

function getAnesthesiaRecordByScheduleId(scheduleId) {
  const record = getSurgeryRecordByScheduleId(scheduleId);
  if (!record) return null;
  return state.anesthesiaRecords.find(a => a.surgery_record_id === record.id) || null;
}

function getAnesthesiaMonitoringsByAnesthesiaId(anesthId) {
  return state.anesthesiaMonitorings.filter(m => m.anesthesia_id === Number(anesthId));
}

function getPostoperativeRecordByScheduleId(scheduleId) {
  return state.postoperativeRecords.find(p => p.schedule_id === Number(scheduleId)) || null;
}

function getComplicationsBySurgeryRecordId(recordId) {
  return state.surgeryComplications.filter(c => c.surgery_record_id === Number(recordId));
}

function getSurgeryTeamMembersByRecordId(recordId) {
  return state.surgeryTeamMembers.filter(m => m.surgery_record_id === Number(recordId));
}

function getPetDisplayName(pet) {
  if (!pet) return '-';
  return pet.pet_name || pet.name || '-';
}

function getOperatingRoomById(roomId) {
  return state.operatingRooms.find(r => r.id === roomId) || null;
}

// --- 2. SUB-TAB NAVIGATION CONTROLLER ---

function switchSurgerySubTab(tabKey) {
  state.activeSurgerySubTab = tabKey;

  const tabs = ['schedule', 'requests', 'intraop', 'recovery'];
  tabs.forEach(t => {
    const btn = document.getElementById(`surgery-tab-btn-${t}`);
    if (btn) {
      if (t === tabKey) {
        btn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-rose-900 shadow-xs border border-rose-200 transition cursor-pointer flex items-center gap-1.5';
      } else {
        btn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center gap-1.5';
      }
    }
  });

  renderSurgerySubTabContent();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function setSurgerySubFilter(filter) {
  state.activeSurgerySubFilter = filter;
  const btnIds = ['all', 'in_progress', 'scheduled', 'recovery', 'completed'];
  btnIds.forEach(id => {
    const btn = document.getElementById(`btn-surgery-sub-${id}`);
    if (!btn) return;
    if (id === filter) {
      btn.className = 'text-xs font-semibold px-3 py-1.5 rounded-md bg-white text-slate-800 shadow-xs transition cursor-pointer flex items-center gap-1.5 font-bold';
    } else {
      btn.className = 'text-xs font-semibold px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center gap-1.5';
    }
  });
  renderSurgerySubTabContent();
}

function renderSurgerySubTabContent() {
  const container = document.getElementById('surgery-subtab-content');
  if (!container) return;

  const activeTab = state.activeSurgerySubTab || 'schedule';

  if (activeTab === 'schedule') {
    renderSurgeryScheduleAndRoomsView();
  } else if (activeTab === 'requests') {
    renderSurgeryRequestsView();
  } else if (activeTab === 'intraop') {
    renderIntraoperativeWorkstation();
  } else if (activeTab === 'recovery') {
    renderPostopRecoveryView();
  }
}

// ============================================================================
// 3. SUB-TAB 1: SCHEDULES & OPERATING ROOM SUITES (Capabilities 3.3, 3.4, 3.5, 3.6)
// ============================================================================

function toggleRoomStatus(roomId) {
  const room = getOperatingRoomById(roomId);
  if (!room) return;

  if (room.status === 'READY') {
    room.status = 'IN_USE';
  } else if (room.status === 'IN_USE') {
    room.status = 'CLEANING';
  } else if (room.status === 'CLEANING') {
    room.status = 'READY';
  } else {
    room.status = 'READY';
  }

  showToast('อัปเดตสถานะห้องผ่าตัด', `ห้อง ${room.name} เปลี่ยนสถานะเป็น ${room.status} เรียบร้อยแล้ว`, 'info');
  renderSurgeryScheduleAndRoomsView();
}

function renderSurgeryScheduleAndRoomsView() {
  const container = document.getElementById('surgery-subtab-content');
  if (!container) return;

  const searchQuery = (document.getElementById('top-search-input')?.value || '').toLowerCase();
  const roomFilter = document.getElementById('view-filter-surgery-room')?.value || 'all';

  let filteredSchedules = state.surgerySchedules.filter(sch => {
    const pet = getPetById(sch.pet_id);
    const owner = getCustomerById(sch.customer_id);
    const catalog = getSurgeryCatalogById(sch.surgery_catalog_id);

    const matchSearch =
      getPetDisplayName(pet).toLowerCase().includes(searchQuery) ||
      (owner?.display_name || '').toLowerCase().includes(searchQuery) ||
      (catalog?.surgery_name || '').toLowerCase().includes(searchQuery) ||
      sch.schedule_number.toLowerCase().includes(searchQuery);

    const matchRoom = roomFilter === 'all' || sch.room_id === roomFilter;

    let matchSub = true;
    if (state.activeSurgerySubFilter === 'in_progress') matchSub = sch.status === 'IN_PROGRESS';
    else if (state.activeSurgerySubFilter === 'scheduled') matchSub = sch.status === 'SCHEDULED';
    else if (state.activeSurgerySubFilter === 'recovery') matchSub = sch.status === 'RECOVERY';
    else if (state.activeSurgerySubFilter === 'completed') matchSub = sch.status === 'COMPLETED';

    return matchSearch && matchRoom && matchSub;
  });

  // Operating Rooms Status HTML
  const roomsHtml = `
    <div class="mb-5">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <i data-lucide="layout-grid" class="w-4 h-4 text-rose-600"></i>
          <span>สถานะห้องผ่าตัด & ห้องทำหัตถการเรียลไทม์ (Live OR Suites)</span>
        </h4>
        <span class="text-[11px] text-slate-400">คลิกที่การ์ดเพื่อสลับสถานะทำความสะอาด / พร้อมใช้งาน</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        ${state.operatingRooms.map(rm => {
          let statusBadge = '';
          let borderClass = 'border-slate-200';
          let bgClass = 'bg-white';

          if (rm.status === 'READY') {
            statusBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> พร้อมใช้งาน (READY)</span>';
            borderClass = 'border-emerald-200 hover:border-emerald-400';
          } else if (rm.status === 'IN_USE') {
            statusBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"><span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span> กำลังผ่าตัด (IN USE)</span>';
            borderClass = 'border-amber-300 ring-1 ring-amber-300/30';
            bgClass = 'bg-amber-50/20';
          } else if (rm.status === 'CLEANING') {
            statusBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300"><i data-lucide="sparkles" class="w-3 h-3"></i> ทำความสะอาด/ฆ่าเชื้อ</span>';
            borderClass = 'border-blue-200';
          } else {
            statusBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">ปิดปรับปรุง</span>';
          }

          return `
            <div onclick="toggleRoomStatus('${rm.id}')" class="${bgClass} rounded-xl border ${borderClass} p-3.5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-1.5">
                    <span class="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">${rm.id.replace('OR-', 'R').replace('PROC-', 'P')}</span>
                    <span class="text-xs font-bold text-slate-800">${rm.name}</span>
                  </div>
                  ${statusBadge}
                </div>
                <p class="text-[11px] text-slate-500 mb-2">${rm.cleanliness_level}</p>
                <div class="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span class="text-slate-400 font-medium">อุปกรณ์หลัก:</span>
                  <span class="text-slate-700 font-semibold block truncate">${rm.equipment.slice(0, 2).join(', ')}</span>
                </div>
              </div>
              <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span class="text-slate-500 truncate">${rm.current_case ? `เคสปัจจุบัน: <strong class="text-slate-700">${rm.current_case}</strong>` : 'ว่าง พร้อมรับเคส'}</span>
                <span class="text-rose-600 font-semibold shrink-0 hover:underline">เปลี่ยนสถานะ</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Status Filter Bar & Switcher
  const filterBarHtml = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-slate-700">กรองสถานะคิวผ่าตัด:</span>
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold overflow-x-auto">
          <button onclick="setSurgerySubFilter('all')" id="btn-surgery-sub-all" class="text-xs font-semibold px-2.5 py-1 rounded-md ${state.activeSurgerySubFilter === 'all' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'} cursor-pointer">
            ทั้งหมด (${state.surgerySchedules.length})
          </button>
          <button onclick="setSurgerySubFilter('in_progress')" id="btn-surgery-sub-in_progress" class="text-xs font-semibold px-2.5 py-1 rounded-md ${state.activeSurgerySubFilter === 'in_progress' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'} cursor-pointer flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>กำลังผ่าตัด (${state.surgerySchedules.filter(s => s.status === 'IN_PROGRESS').length})</span>
          </button>
          <button onclick="setSurgerySubFilter('scheduled')" id="btn-surgery-sub-scheduled" class="text-xs font-semibold px-2.5 py-1 rounded-md ${state.activeSurgerySubFilter === 'scheduled' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'} cursor-pointer flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>กำหนดการ (${state.surgerySchedules.filter(s => s.status === 'SCHEDULED').length})</span>
          </button>
          <button onclick="setSurgerySubFilter('recovery')" id="btn-surgery-sub-recovery" class="text-xs font-semibold px-2.5 py-1 rounded-md ${state.activeSurgerySubFilter === 'recovery' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'} cursor-pointer flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>พักฟื้น (${state.surgerySchedules.filter(s => s.status === 'RECOVERY').length})</span>
          </button>
          <button onclick="setSurgerySubFilter('completed')" id="btn-surgery-sub-completed" class="text-xs font-semibold px-2.5 py-1 rounded-md ${state.activeSurgerySubFilter === 'completed' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'} cursor-pointer flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>สำเร็จแล้ว (${state.surgerySchedules.filter(s => s.status === 'COMPLETED').length})</span>
          </button>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="openNewSurgeryScheduleSheet()" class="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          <span>ลงตารางผ่าตัดใหม่</span>
        </button>
      </div>
    </div>
  `;

  // Render Schedule Cards
  const cardsHtml = `
    <div id="surgery-card-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
      ${filteredSchedules.length === 0 ? `
        <div class="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200">
          <i data-lucide="calendar-x" class="w-10 h-10 text-slate-300 mx-auto mb-2"></i>
          <p class="text-xs font-semibold text-slate-600">ไม่พบตารางผ่าตัดในเงื่อนไขการค้นหานี้</p>
        </div>
      ` : filteredSchedules.map(sch => {
        const pet = getPetById(sch.pet_id);
        const owner = getCustomerById(sch.customer_id);
        const catalog = getSurgeryCatalogById(sch.surgery_catalog_id);
        const preOp = getPreOpAssessmentByScheduleId(sch.id);
        const consent = getSurgeryConsentByScheduleId(sch.id);
        const surgeon = getDoctorById(sch.surgeon_id);
        const anesthetist = getDoctorById(sch.anesthetist_id);

        let statusBadge = '';
        let cardBorder = 'border-slate-200';
        if (sch.status === 'IN_PROGRESS') {
          statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"><span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span> กำลังผ่าตัด (In OR)</span>';
          cardBorder = 'border-amber-400 ring-1 ring-amber-400/20';
        } else if (sch.status === 'SCHEDULED') {
          statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200"><i data-lucide="clock" class="w-3 h-3"></i> กำหนดการวันนี้</span>';
        } else if (sch.status === 'RECOVERY') {
          statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200"><i data-lucide="bed" class="w-3 h-3"></i> พักฟื้น (Post-Op)</span>';
          cardBorder = 'border-purple-200';
        } else if (sch.status === 'COMPLETED') {
          statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><i data-lucide="check-circle" class="w-3 h-3"></i> สำเร็จ / ส่งจ่ายยาแล้ว</span>';
        }

        const urgencyBadge = sch.urgency === 'URGENT' || sch.urgency === 'STAT'
          ? '<span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-300">🚨 ด่วน (Urgent)</span>'
          : '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">Routine</span>';

        let asaBadge = '<span class="text-[10px] font-medium text-slate-400">ยังไม่ประเมิน</span>';
        if (preOp) {
          if (preOp.risk_level === 'ASA I') {
            asaBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">🟢 ASA I (ปกติ)</span>';
          } else if (preOp.risk_level === 'ASA II') {
            asaBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">🟡 ASA II (เสี่ยงน้อย)</span>';
          } else {
            asaBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">🔴 ${preOp.risk_level} (เสี่ยงสูง)</span>`;
          }
        }

        const consentBadge = consent && consent.is_signed
          ? '<span class="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700"><i data-lucide="file-check" class="w-3.5 h-3.5 text-emerald-600"></i> เซ็นยินยอมแล้ว</span>'
          : '<span class="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700"><i data-lucide="file-warning" class="w-3.5 h-3.5 text-amber-600"></i> รอเซ็นยินยอม</span>';

        const fastingBadge = preOp && preOp.is_npo_cleared
          ? `<span class="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">NPO: งดอาหาร ${preOp.fasting_food_hours} ชม. / น้ำ ${preOp.fasting_water_hours} ชม.</span>`
          : '<span class="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">ยังไม่ได้ตรวจ NPO</span>';

        return `
          <div class="bg-white rounded-xl border ${cardBorder} p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-bold text-slate-700">${sch.schedule_number}</span>
                    ${urgencyBadge}
                  </div>
                  <div class="flex items-center gap-1.5 mt-1 text-xs font-semibold text-rose-700">
                    <i data-lucide="door-open" class="w-3.5 h-3.5"></i>
                    <span>${sch.room_name}</span>
                  </div>
                </div>
                <div class="text-right">
                  ${statusBadge}
                  <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1 justify-end font-medium">
                    <i data-lucide="clock-3" class="w-3 h-3"></i>
                    <span>${sch.scheduled_time} น. (~${sch.estimated_duration} นาที)</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3 py-3 border-b border-slate-100">
                <div class="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center font-bold text-sm shrink-0">
                  ${pet?.species === 'แมว' ? '🐱' : '🐶'}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <h4 class="text-sm font-bold text-slate-900 truncate">${getPetDisplayName(pet)}</h4>
                    <span class="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-medium">${pet?.breed || '-'}</span>
                  </div>
                  <p class="text-xs text-slate-500 truncate mt-0.5">
                    เจ้าของ: <span class="font-medium text-slate-700">${owner?.display_name || '-'}</span> • โทร: ${owner?.phone_primary || '-'}
                  </p>
                </div>
              </div>

              <div class="py-2.5 space-y-1.5">
                <div class="flex items-start gap-1.5">
                  <i data-lucide="stethoscope" class="w-4 h-4 text-slate-400 shrink-0 mt-0.5"></i>
                  <p class="text-xs font-bold text-slate-800 leading-tight">${catalog?.surgery_name || '-'}</p>
                </div>
                <p class="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span class="font-semibold text-slate-700">ข้อบ่งชี้ทางคลินิก:</span> ${sch.medical_indication}
                </p>
              </div>

              <div class="pt-2 pb-1 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-[11px] font-semibold text-slate-500">ประเมินความเสี่ยง:</span>
                  ${asaBadge}
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-[11px] font-semibold text-slate-500">การอดอาหาร (NPO):</span>
                  ${fastingBadge}
                </div>
                <div class="flex items-center justify-between text-xs border-t border-slate-200/60 pt-1.5">
                  <span class="text-[11px] font-semibold text-slate-500">หนังสือยินยอม:</span>
                  ${consentBadge}
                </div>
              </div>

              <div class="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                <span>ศัลยแพทย์: <strong class="text-slate-700">${surgeon?.name || 'สัตวแพทย์'}</strong></span>
                <span>วิสัญญี: <strong class="text-slate-700">${anesthetist?.name || '-'}</strong></span>
              </div>
            </div>

            <div class="pt-3.5 mt-2 border-t border-slate-100 flex items-center gap-2">
              <button onclick="openPreOpAssessmentSheet(${sch.id})" class="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer">
                <i data-lucide="clipboard-check" class="w-3.5 h-3.5"></i>
                <span>Pre-op</span>
              </button>
              ${sch.status === 'IN_PROGRESS' ? `
                <button onclick="switchSurgerySubTab('intraop')" class="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold px-2.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-xs transition cursor-pointer">
                  <i data-lucide="activity" class="w-3.5 h-3.5"></i>
                  <span>สัญญาณชีพ OR</span>
                </button>
              ` : sch.status === 'RECOVERY' ? `
                <button onclick="switchSurgerySubTab('recovery')" class="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold px-2.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-xs transition cursor-pointer">
                  <i data-lucide="bed" class="w-3.5 h-3.5"></i>
                  <span>พักฟื้น PACU</span>
                </button>
              ` : `
                <button onclick="openSurgeryRecordSheet(${sch.id})" class="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold px-2.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition cursor-pointer active:scale-95">
                  <i data-lucide="file-edit" class="w-3.5 h-3.5"></i>
                  <span>${sch.status === 'COMPLETED' ? 'บันทึกผ่าตัด' : 'เริ่มผ่าตัด'}</span>
                </button>
              `}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.innerHTML = roomsHtml + filterBarHtml + cardsHtml;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Backward-compatible renderers
function renderSurgeryCardView(schedules) {
  renderSurgeryScheduleAndRoomsView();
}
function renderSurgeryListView(schedules) {
  renderSurgeryScheduleAndRoomsView();
}

// ============================================================================
// 4. SUB-TAB 2: SURGERY REQUESTS & CLINICAL TRIAGE (Capabilities 3.1, 3.2, 3.5, 3.6)
// ============================================================================

function renderSurgeryRequestsView() {
  const container = document.getElementById('surgery-subtab-content');
  if (!container) return;

  const searchQuery = (document.getElementById('top-search-input')?.value || '').toLowerCase();

  const requests = state.surgeryRequests.filter(req => {
    const pet = getPetById(req.pet_id);
    const catalog = getSurgeryCatalogById(req.surgery_catalog_id);
    return (
      getPetDisplayName(pet).toLowerCase().includes(searchQuery) ||
      req.request_number.toLowerCase().includes(searchQuery) ||
      (catalog?.surgery_name || '').toLowerCase().includes(searchQuery) ||
      req.medical_indication.toLowerCase().includes(searchQuery)
    );
  });

  container.innerHTML = `
    <div class="space-y-4">
      <!-- Requests Header & Stats -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <i data-lucide="inbox" class="w-4 h-4 text-rose-600"></i>
            <span>คำขอส่งผ่าตัด & คัดกรองความเร่งด่วน (Surgery Requests & Triage)</span>
          </h4>
          <p class="text-xs text-slate-500">จัดการคำขอส่งผ่าตัดจากแผนกตรวจรักษา (OPD) ประเมินความเร่งด่วน และส่งต่อจัดตารางคิว OR</p>
        </div>
        <button onclick="openNewSurgeryRequestModal()" class="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer self-start sm:self-auto">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>+ ส่งคำขอผ่าตัดใหม่ (New Request)</span>
        </button>
      </div>

      <!-- Requests List Table -->
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th class="p-3">เลขที่คำขอ / วันที่</th>
                <th class="p-3">สัตว์ป่วย & เจ้าของ</th>
                <th class="p-3">รายการผ่าตัดที่ร้องขอ</th>
                <th class="p-3">ข้อบ่งชี้ทางคลินิก (Indication)</th>
                <th class="p-3 text-center">ระดับความเร่งด่วน</th>
                <th class="p-3 text-center">สถานะ</th>
                <th class="p-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              ${requests.length === 0 ? `
                <tr><td colspan="7" class="p-8 text-center text-slate-400">ไม่มีคำขอส่งผ่าตัดในขณะนี้</td></tr>
              ` : requests.map(req => {
                const pet = getPetById(req.pet_id);
                const owner = getCustomerById(req.customer_id);
                const catalog = getSurgeryCatalogById(req.surgery_catalog_id);
                const vet = getDoctorById(req.requested_by);

                let priorityBadge = '';
                if (req.priority === 'EMERGENCY' || req.priority === 'STAT') {
                  priorityBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300 animate-pulse">🚨 ฉุกเฉินวิกฤต (STAT)</span>';
                } else if (req.priority === 'URGENT') {
                  priorityBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">⚠️ เร่งด่วน (Urgent)</span>';
                } else {
                  priorityBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">Routine</span>';
                }

                let statusBadge = '';
                if (req.status === 'PENDING_ASSESSMENT') {
                  statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">รอประเมิน & จัดคิว</span>';
                } else if (req.status === 'SCHEDULED') {
                  statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">จัดตาราง OR แล้ว</span>';
                } else if (req.status === 'COMPLETED') {
                  statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">ผ่าตัดเสร็จสิ้น</span>';
                }

                return `
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="p-3">
                      <div class="font-mono font-bold text-slate-900">${req.request_number}</div>
                      <div class="text-[11px] text-slate-400">${req.requested_at}</div>
                    </td>
                    <td class="p-3">
                      <div class="font-bold text-slate-900">${getPetDisplayName(pet)}</div>
                      <div class="text-[11px] text-slate-500">${owner?.display_name || '-'} (${pet?.species}/${pet?.breed})</div>
                    </td>
                    <td class="p-3">
                      <div class="font-bold text-rose-700">${catalog?.surgery_name || '-'}</div>
                      <div class="text-[11px] text-slate-500">ประเภท: ${catalog?.surgery_type || '-'} (~${catalog?.estimated_duration_minutes} นาที)</div>
                    </td>
                    <td class="p-3 max-w-xs">
                      <p class="text-xs text-slate-700 line-clamp-2">${req.medical_indication}</p>
                      <span class="text-[10px] text-slate-400">ผู้ขอ: ${vet?.name || 'สัตวแพทย์'}</span>
                    </td>
                    <td class="p-3 text-center">${priorityBadge}</td>
                    <td class="p-3 text-center">${statusBadge}</td>
                    <td class="p-3 text-right">
                      ${req.status === 'PENDING_ASSESSMENT' ? `
                        <button onclick="quickScheduleRequest(${req.id})" class="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
                          จัดคิวห้องผ่าตัด
                        </button>
                      ` : `
                        <button onclick="switchSurgerySubTab('schedule')" class="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer">
                          ดูตารางคิว
                        </button>
                      `}
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

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function quickScheduleRequest(requestId) {
  const req = getSurgeryRequestById(requestId);
  if (!req) return;

  openNewSurgeryScheduleSheet();
  setTimeout(() => {
    const petSelect = document.getElementById('surg-pet-id');
    const catalogSelect = document.getElementById('surg-catalog-id');
    const urgencySelect = document.getElementById('surg-urgency');
    const indicationText = document.getElementById('surg-indication');

    if (petSelect) petSelect.value = req.pet_id;
    if (catalogSelect) catalogSelect.value = req.surgery_catalog_id;
    if (urgencySelect) urgencySelect.value = req.priority === 'STAT' ? 'STAT' : req.priority;
    if (indicationText) indicationText.value = req.medical_indication;
  }, 100);
}

// Modal: New Surgery Request
function openNewSurgeryRequestModal() {
  const modal = document.getElementById('modal-surgery-request');
  if (!modal) return;
  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeNewSurgeryRequestModal() {
  const modal = document.getElementById('modal-surgery-request');
  if (modal) modal.classList.add('hidden');
}

function submitNewSurgeryRequest(e) {
  e.preventDefault();
  const petId = Number(document.getElementById('surg-req-pet-id').value);
  const catalogId = Number(document.getElementById('surg-req-catalog-id').value);
  const priority = document.getElementById('surg-req-priority').value;
  const indication = document.getElementById('surg-req-indication').value;

  const pet = getPetById(petId);
  const ownerId = getPrimaryOwnerForPet(petId)?.id || 1;
  const catalog = getSurgeryCatalogById(catalogId);

  const newId = state.surgeryRequests.length + 1;
  const newReq = {
    id: newId,
    request_number: `REQ-SURG-2026-${String(newId).padStart(4, '0')}`,
    encounter_id: 1,
    pet_id: petId,
    customer_id: ownerId,
    surgery_catalog_id: catalogId,
    requested_by: 1,
    requested_at: '2026-03-02 12:00',
    medical_indication: indication,
    priority: priority,
    status: 'PENDING_ASSESSMENT'
  };

  state.surgeryRequests.unshift(newReq);
  closeNewSurgeryRequestModal();
  renderSurgeryRequestsView();
  showToast('สร้างคำขอส่งผ่าตัดสำเร็จ', `คำขอ ${newReq.request_number} สำหรับ ${getPetDisplayName(pet)} ถูกส่งเข้าคัดกรองแล้ว`, 'success');
}

// ============================================================================
// 5. SUB-TAB 3: INTRAOPERATIVE MONITOR & ANESTHESIA VITALS (Capabilities 3.7 - 3.16)
// ============================================================================

function renderIntraoperativeWorkstation(selectedScheduleId) {
  const container = document.getElementById('surgery-subtab-content');
  if (!container) return;

  // Find active surgery schedule or fallback to first schedule
  const activeCase = selectedScheduleId
    ? getSurgeryScheduleById(selectedScheduleId)
    : (state.surgerySchedules.find(s => s.status === 'IN_PROGRESS') || state.surgerySchedules[0]);

  if (!activeCase) {
    container.innerHTML = `<div class="p-8 text-center text-slate-500">ไม่มีเคสผ่าตัดให้แสดงผล</div>`;
    return;
  }

  const pet = getPetById(activeCase.pet_id);
  const owner = getCustomerById(activeCase.customer_id);
  const catalog = getSurgeryCatalogById(activeCase.surgery_catalog_id);
  const surgeon = getDoctorById(activeCase.surgeon_id);
  const anesthetist = getDoctorById(activeCase.anesthetist_id);
  const record = getSurgeryRecordByScheduleId(activeCase.id);
  const anesthesia = getAnesthesiaRecordByScheduleId(activeCase.id);
  const vitals = anesthesia ? getAnesthesiaMonitoringsByAnesthesiaId(anesthesia.id) : [];
  const complications = record ? getComplicationsBySurgeryRecordId(record.id) : [];
  const teamMembers = record ? getSurgeryTeamMembersByRecordId(record.id) : [];

  container.innerHTML = `
    <div class="space-y-4">
      <!-- Case Selection Bar & Status Banner -->
      <div class="bg-slate-900 text-white rounded-xl p-4 shadow-sm">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-inner">
              <i data-lucide="scissors" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold bg-rose-500/30 text-rose-300 px-2 py-0.5 rounded border border-rose-500/40">${activeCase.schedule_number}</span>
                <span class="text-xs font-bold text-slate-300">ห้อง: ${activeCase.room_name}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">⚡ INTRA-OPERATIVE LIVE</span>
              </div>
              <h3 class="text-base font-bold text-white mt-1">${catalog?.surgery_name || '-'}</h3>
              <p class="text-xs text-slate-400">
                สัตว์ป่วย: <strong class="text-white">${getPetDisplayName(pet)}</strong> (${pet?.species}/${pet?.breed} • ${pet?.current_weight || 5} kg) • เจ้าของ: ${owner?.display_name || '-'}
              </p>
            </div>
          </div>

          <!-- Case Switcher Dropdown -->
          <div class="flex items-center gap-2 self-start lg:self-auto">
            <label class="text-xs text-slate-400 font-semibold">เลือกเคส OR:</label>
            <select onchange="renderIntraoperativeWorkstation(this.value)" class="bg-slate-800 text-xs text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-rose-500">
              ${state.surgerySchedules.map(s => {
                const p = getPetById(s.pet_id);
                return `<option value="${s.id}" ${s.id === activeCase.id ? 'selected' : ''}>${s.schedule_number}: ${getPetDisplayName(p)} [${s.status}]</option>`;
              }).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Main Intraoperative 2-Column Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        <!-- Left Column: Anesthesia Protocol & Live Vitals Table (Cols 7) -->
        <div class="lg:col-span-7 space-y-4">
          <!-- Anesthesia Protocol Summary Card -->
          <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div class="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <i data-lucide="activity" class="w-4 h-4 text-blue-600"></i>
                <span>โปรโตคอลการระงับความรู้สึก (Anesthesia Protocol & Delivery)</span>
              </h4>
              <span class="text-[11px] font-semibold text-slate-500">วิสัญญี: <strong class="text-slate-800">${anesthetist?.name || 'สัตวแพทย์'}</strong></span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 font-semibold block">Pre-medication:</span>
                <span class="font-bold text-slate-700 truncate block">${anesthesia?.pre_medication || 'Acepromazine + Morphine IM'}</span>
              </div>
              <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 font-semibold block">Induction Agent:</span>
                <span class="font-bold text-slate-700 truncate block">${anesthesia?.induction_agent || 'Propofol 4 mg/kg IV'}</span>
              </div>
              <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 font-semibold block">Maintenance:</span>
                <span class="font-bold text-slate-700 truncate block">${anesthesia?.maintenance_agent || 'Isoflurane 1.5% in O2'}</span>
              </div>
              <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 font-semibold block">ET Tube Size:</span>
                <span class="font-bold text-slate-700 truncate block">${anesthesia?.et_tube_size || '8.0 mm (Cuffed)'}</span>
              </div>
              <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 font-semibold block">Breathing Circuit:</span>
                <span class="font-bold text-slate-700 truncate block">${anesthesia?.circuit_type || 'Rebreathing'}</span>
              </div>
              <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 font-semibold block">IV Fluid Rate:</span>
                <span class="font-bold text-slate-700 truncate block">${anesthesia?.fluid_rate || '5 ml/kg/hr'}</span>
              </div>
            </div>
          </div>

          <!-- Time-series Vitals Monitoring Grid -->
          <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div class="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i data-lucide="gauge" class="w-4 h-4 text-rose-600"></i>
                <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">บันทึกสัญญาณชีพวิสัญญีต่อเนื่อง (Intraoperative Vitals Time-series)</h4>
              </div>
              <button onclick="openAnesthesiaMonitoringModal(${activeCase.id})" class="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>+ บันทึกจุดสัญญาณชีพ (Vital Point)</span>
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead class="bg-slate-100/70 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold">
                  <tr>
                    <th class="p-2.5">เวลา (จุดตรวจ)</th>
                    <th class="p-2.5 text-center">HR (bpm)</th>
                    <th class="p-2.5 text-center">SpO2 (%)</th>
                    <th class="p-2.5 text-center">EtCO2 (mmHg)</th>
                    <th class="p-2.5 text-center">MAP (mmHg)</th>
                    <th class="p-2.5 text-center">Temp (°C)</th>
                    <th class="p-2.5 text-center">RR (/min)</th>
                    <th class="p-2.5 text-right">ผู้บันทึก</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  ${vitals.length === 0 ? `
                    <tr><td colspan="8" class="p-6 text-center text-slate-400">ยังไม่มีการบันทึกสัญญาณชีพในเคสนี้</td></tr>
                  ` : vitals.map(v => {
                    const hrAlert = (v.hr < 80 || v.hr > 160) ? 'text-rose-600 font-extrabold' : 'text-slate-800 font-bold';
                    const spo2Alert = v.spo2 < 95 ? 'text-rose-600 font-extrabold bg-rose-50 px-1 rounded' : 'text-slate-800 font-bold';
                    const mapAlert = v.map < 65 ? 'text-amber-600 font-extrabold' : 'text-slate-800 font-bold';
                    return `
                      <tr class="hover:bg-slate-50/80 transition font-mono">
                        <td class="p-2.5 font-sans font-bold text-slate-900">${v.recorded_at}</td>
                        <td class="p-2.5 text-center ${hrAlert}">${v.hr}</td>
                        <td class="p-2.5 text-center ${spo2Alert}">${v.spo2}%</td>
                        <td class="p-2.5 text-center text-slate-800 font-bold">${v.etco2}</td>
                        <td class="p-2.5 text-center ${mapAlert}">${v.map}</td>
                        <td class="p-2.5 text-center text-slate-800 font-bold">${v.temp}</td>
                        <td class="p-2.5 text-center text-slate-800 font-bold">${v.rr}</td>
                        <td class="p-2.5 text-right font-sans text-slate-500 text-[11px]">${v.recorded_by}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Complications Log Panel -->
          <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div class="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-500"></i>
                <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">บันทึกภาวะแทรกซ้อน & การแก้ไข (Surgical Complications & Incident Log)</h4>
              </div>
              <button onclick="openComplicationLogModal(${activeCase.id})" class="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>+ รายงานภาวะแทรกซ้อน</span>
              </button>
            </div>
            ${complications.length === 0 ? `
              <p class="text-xs text-slate-400 py-2">ไม่มีรายงานภาวะแทรกซ้อนในระหว่างการผ่าตัด</p>
            ` : `
              <div class="space-y-2">
                ${complications.map(c => `
                  <div class="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1">
                    <div class="flex items-center justify-between font-bold text-amber-900">
                      <span>⚠️ ${c.complication_type} [ระดับความรุนแรง: ${c.severity}]</span>
                      <span class="text-[11px] text-slate-500 font-mono">${c.occurred_at}</span>
                    </div>
                    <p class="text-slate-700">${c.description}</p>
                    <div class="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                      <span>รายงานโดย: <strong>${c.reported_by}</strong></span>
                      <span class="text-emerald-700 font-semibold">แก้ไขเรียบร้อย: ${c.resolved_at || '-'}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- Right Column: Surgical Notes, Materials & Outcome (Cols 5) -->
        <div class="lg:col-span-5 space-y-4">
          <!-- Operative Details & Team -->
          <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">รายละเอียดการผ่าตัด (Operative Notes)</h4>
              <span class="text-[11px] font-mono text-slate-400">${record?.surgery_number || 'SURG-REC-NEW'}</span>
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1">ขั้นตอนการผ่าตัด (Operation Details)</label>
              <textarea id="live-surg-details" rows="3" class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white">${record?.operation_details || 'เตรียมผิวหนังแบบปลอดเชื้อ ทำหัตถการตามมาตรฐาน'}</textarea>
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1">ข้อค้นพบระหว่างผ่าตัด (Surgical Findings)</label>
              <input type="text" id="live-surg-findings" value="${record?.findings || 'ไม่มีสิ่งผิดปกติ เลือดออกน้อย'}" class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white">
            </div>
            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">ผลการผ่าตัด (Outcome)</label>
                <select id="live-surg-outcome" class="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white">
                  <option value="SUCCESSFUL" selected>สำเร็จเรียบร้อย (Successful)</option>
                  <option value="COMPLICATED">มีภาวะแทรกซ้อน (Complicated)</option>
                  <option value="PARTIAL">ทำได้บางส่วน (Partial)</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">คะแนนปวด (Pain 1-10)</label>
                <input type="number" id="live-surg-pain" value="${record?.pain_score || 2}" min="0" max="10" class="w-full text-xs p-2 rounded-lg border border-slate-300 text-center font-bold">
              </div>
            </div>
          </div>

          <!-- Material & Supplies Used (Cross Domain with Domain 04) -->
          <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5">
            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
              <div class="flex items-center gap-1.5">
                <i data-lucide="package" class="w-4 h-4 text-teal-600"></i>
                <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">วัสดุเวชภัณฑ์ที่ใช้จริง (Material Usages)</h4>
              </div>
              <button onclick="addSurgeryMaterialRow(${activeCase.id})" class="text-[11px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>เพิ่มวัสดุ</span>
              </button>
            </div>
            <div id="surg-materials-list" class="space-y-2">
              ${(record?.materials || [
                { product_id: 7, product_name: '0.9% Normal Saline Solution 1,000ml', quantity: 1, unit: 'ขวด' },
                { product_id: 9, product_name: 'ไหมเย็บแผล Nylon 3-0 พร้อมเข็มโค้ง (Ethicon)', quantity: 1, unit: 'ซอง' }
              ]).map(mat => `
                <div class="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 material-row">
                  <select class="material-product-select text-xs p-1.5 rounded border border-slate-300 flex-1 bg-white">
                    ${state.products.map(p => `
                      <option value="${p.id}" ${p.id === mat.product_id ? 'selected' : ''}>${p.product_name}</option>
                    `).join('')}
                  </select>
                  <input type="number" value="${mat.quantity}" min="1" max="50" class="material-qty-input w-14 text-xs p-1.5 rounded border border-slate-300 text-center font-bold bg-white">
                  <span class="text-xs text-slate-500 w-8">${mat.unit}</span>
                  <button type="button" onclick="removeSurgeryMaterialRow(this)" class="text-rose-500 hover:text-rose-700 p-1 cursor-pointer">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Workstation Action Buttons -->
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <button onclick="saveSurgeryRecordDraft(${activeCase.id})" class="w-full py-2.5 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 transition cursor-pointer">
              💾 บันทึกร่างการผ่าตัด (Save Operative Draft)
            </button>
            <button onclick="completeSurgeryAndMoveToRecovery(${activeCase.id})" class="w-full py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5">
              <i data-lucide="check-circle" class="w-4 h-4"></i>
              <span>ผ่าตัดเสร็จสิ้น & ส่งต่อไปพักฟื้น (Move to Post-Op)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function completeSurgeryAndMoveToRecovery(scheduleId) {
  const sch = getSurgeryScheduleById(scheduleId);
  if (!sch) return;

  sch.status = 'RECOVERY';

  let record = getSurgeryRecordByScheduleId(scheduleId);
  if (record) {
    record.completed_at = '2026-03-02 12:15';
    record.recovery_status = 'RECOVERING';
    record.status = 'COMPLETED';
    record.operation_details = document.getElementById('live-surg-details')?.value || record.operation_details;
    record.findings = document.getElementById('live-surg-findings')?.value || record.findings;
    record.outcome = document.getElementById('live-surg-outcome')?.value || record.outcome;
    record.pain_score = Number(document.getElementById('live-surg-pain')?.value || record.pain_score);
    record.materials = collectSurgeryMaterials();
  }

  // Create or update post-op record
  let postOp = getPostoperativeRecordByScheduleId(scheduleId);
  if (!postOp) {
    postOp = {
      id: state.postoperativeRecords.length + 1,
      surgery_record_id: record?.id || 1,
      schedule_id: scheduleId,
      pet_id: sch.pet_id,
      recorded_at: '2026-03-02 12:15',
      temperature: 37.8,
      heart_rate: 112,
      respiratory_rate: 20,
      mucous_membrane: 'Pink',
      crt_seconds: '< 2s',
      pain_score: 2,
      consciousness_level: 'SEDATED_AROUSABLE',
      swallowing_reflex: true,
      extubation_time: '12:10',
      observation: 'ย้ายเข้าห้องพักฟื้น PACU ห่มผ้าอุ่น สัญญาณชีพคงที่',
      discharge_readiness: false,
      recorded_by: 'พว. กัลยา สุขใจ'
    };
    state.postoperativeRecords.unshift(postOp);
  }

  showToast('ย้ายสัตว์ป่วยไปห้องพักฟื้นแล้ว', `เคส ${sch.schedule_number} ผ่าตัดเรียบร้อยและส่งต่อไปยังห้องพักฟื้น (PACU) เรียบร้อยแล้ว`, 'success');
  switchSurgerySubTab('recovery');
}

// Modal: Anesthesia Vital Signs
function openAnesthesiaMonitoringModal(scheduleId) {
  const modal = document.getElementById('modal-anesthesia-vital');
  if (!modal) return;
  modal.setAttribute('data-schedule-id', scheduleId);
  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeAnesthesiaMonitoringModal() {
  const modal = document.getElementById('modal-anesthesia-vital');
  if (modal) modal.classList.add('hidden');
}

function submitAnesthesiaVitalEntry(e) {
  e.preventDefault();
  const modal = document.getElementById('modal-anesthesia-vital');
  const scheduleId = Number(modal.getAttribute('data-schedule-id') || 1);
  const anesthesia = getAnesthesiaRecordByScheduleId(scheduleId);

  const timeMin = document.getElementById('vital-time-min').value;
  const hr = Number(document.getElementById('vital-hr').value);
  const spo2 = Number(document.getElementById('vital-spo2').value);
  const etco2 = Number(document.getElementById('vital-etco2').value);
  const map = Number(document.getElementById('vital-map').value);
  const temp = Number(document.getElementById('vital-temp').value);
  const rr = Number(document.getElementById('vital-rr').value);
  const isoflurane = Number(document.getElementById('vital-iso').value);

  const newId = state.anesthesiaMonitorings.length + 1;
  const newVital = {
    id: newId,
    anesthesia_id: anesthesia?.id || 1,
    recorded_at: timeMin,
    hr: hr,
    spo2: spo2,
    etco2: etco2,
    map: map,
    temp: temp,
    rr: rr,
    isoflurane_pct: isoflurane,
    recorded_by: 'สพ.ญ. ศศิธร'
  };

  state.anesthesiaMonitorings.push(newVital);
  closeAnesthesiaMonitoringModal();
  renderIntraoperativeWorkstation(scheduleId);
  showToast('บันทึกสัญญาณชีพสำเร็จ', `บันทึกสัญญาณชีพที่เวลา ${timeMin} เรียบร้อยแล้ว`, 'success');
}

// Modal: Surgical Complication
function openComplicationLogModal(scheduleId) {
  const modal = document.getElementById('modal-surgery-complication');
  if (!modal) return;
  modal.setAttribute('data-schedule-id', scheduleId);
  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeComplicationLogModal() {
  const modal = document.getElementById('modal-surgery-complication');
  if (modal) modal.classList.add('hidden');
}

function submitComplicationLog(e) {
  e.preventDefault();
  const modal = document.getElementById('modal-surgery-complication');
  const scheduleId = Number(modal.getAttribute('data-schedule-id') || 1);
  const record = getSurgeryRecordByScheduleId(scheduleId);

  const compType = document.getElementById('comp-type').value;
  const severity = document.getElementById('comp-severity').value;
  const description = document.getElementById('comp-description').value;

  const newId = state.surgeryComplications.length + 1;
  const newComp = {
    id: newId,
    surgery_record_id: record?.id || 1,
    complication_type: compType,
    description: description,
    severity: severity,
    occurred_at: '2026-03-02 12:05',
    resolved_at: '2026-03-02 12:10',
    reported_by: 'สพ.ญ. ศศิธร สุขสมบูรณ์'
  };

  state.surgeryComplications.push(newComp);
  closeComplicationLogModal();
  renderIntraoperativeWorkstation(scheduleId);
  showToast('บันทึกรายงานภาวะแทรกซ้อนแล้ว', `บันทึกเหตุการณ์ ${compType} เรียบร้อย`, 'warning');
}

// ============================================================================
// 6. SUB-TAB 4: POSTOPERATIVE RECOVERY & DISCHARGE (Capabilities 3.17 - 3.20)
// ============================================================================

function renderPostopRecoveryView() {
  const container = document.getElementById('surgery-subtab-content');
  if (!container) return;

  // Filter schedules in RECOVERY or COMPLETED
  const recoveryCases = state.surgerySchedules.filter(s => s.status === 'RECOVERY' || s.status === 'COMPLETED');

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <i data-lucide="bed" class="w-4 h-4 text-purple-600"></i>
            <span>การดูแลพักฟื้นหลังผ่าตัด & เกณฑ์การจำหน่าย (Post-Op Recovery & PACU)</span>
          </h4>
          <p class="text-xs text-slate-500">ติดตามการฟื้นตัวจากการดมสลบ ควบคุมอุณหภูมิร่างกาย ประเมินความปวด และตรวจสอบความพร้อมก่อนจำหน่ายส่งต่อห้องจ่ายยา</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        ${recoveryCases.length === 0 ? `
          <div class="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400">
            ไม่มีสัตว์ป่วยในห้องพักฟื้นขณะนี้
          </div>
        ` : recoveryCases.map(sch => {
          const pet = getPetById(sch.pet_id);
          const owner = getCustomerById(sch.customer_id);
          const catalog = getSurgeryCatalogById(sch.surgery_catalog_id);
          const record = getSurgeryRecordByScheduleId(sch.id);
          const postOp = getPostoperativeRecordByScheduleId(sch.id);

          const isDischarged = sch.status === 'COMPLETED';

          return `
            <div class="bg-white rounded-xl border ${isDischarged ? 'border-emerald-200 bg-emerald-50/10' : 'border-purple-300 ring-1 ring-purple-300/30'} p-4 shadow-xs flex flex-col justify-between">
              <div>
                <!-- Header -->
                <div class="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">
                      ${pet?.species === 'แมว' ? '🐱' : '🐶'}
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-slate-900">${getPetDisplayName(pet)} (${pet?.species}/${pet?.breed})</h4>
                      <p class="text-xs text-slate-500">เจ้าของ: ${owner?.display_name || '-'} • โทร: ${owner?.phone_primary || '-'}</p>
                    </div>
                  </div>
                  <div>
                    ${isDischarged ? `
                      <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <i data-lucide="check" class="w-3.5 h-3.5"></i> จำหน่ายส่งห้องจ่ายยาแล้ว
                      </span>
                    ` : `
                      <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1 animate-pulse">
                        <span class="w-2 h-2 rounded-full bg-purple-600"></span> พักฟื้นใน PACU
                      </span>
                    `}
                  </div>
                </div>

                <!-- Procedure & Recovery Timeline -->
                <div class="py-2.5 text-xs">
                  <span class="font-bold text-slate-800">หัตถการ: ${catalog?.surgery_name}</span>
                  <div class="text-[11px] text-slate-500 mt-0.5">ถอดท่อช่วยหายใจ (Extubation): <strong class="text-slate-700">${postOp?.extubation_time || '10:50 น.'}</strong></div>
                </div>

                <!-- Recovery Vitals Dashboard -->
                <div class="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center text-xs">
                  <div>
                    <span class="text-[10px] text-slate-400 font-semibold block">อุณหภูมิ (Temp)</span>
                    <span class="font-bold text-slate-800 font-mono text-sm">${postOp?.temperature || 37.9}°C</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 font-semibold block">ชีพจร (HR)</span>
                    <span class="font-bold text-slate-800 font-mono text-sm">${postOp?.heart_rate || 110} bpm</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 font-semibold block">การหายใจ (RR)</span>
                    <span class="font-bold text-slate-800 font-mono text-sm">${postOp?.respiratory_rate || 22} /m</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 font-semibold block">คะแนนปวด (Pain)</span>
                    <span class="font-bold text-purple-700 font-mono text-sm">${postOp?.pain_score || record?.pain_score || 1}/10</span>
                  </div>
                </div>

                <!-- Recovery Indicators -->
                <div class="mt-3 space-y-1.5 text-xs">
                  <div class="flex items-center justify-between text-slate-600">
                    <span>ระดับความรู้สึกตัว (Consciousness):</span>
                    <span class="font-bold text-slate-800">${postOp?.consciousness_level === 'ALERT_RESPONSIVE' ? '🟢 ตื่นดี รู้สึกตัวเต็มที่' : '🟡 สะลึมสะลือ ปลุกตื่นได้'}</span>
                  </div>
                  <div class="flex items-center justify-between text-slate-600">
                    <span>การกลืนน้ำลาย (Swallowing Reflex):</span>
                    <span class="font-bold text-emerald-700">✓ คืนตัวแล้ว ปลอดภัย</span>
                  </div>
                  <div class="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                    <strong class="text-slate-700">ข้อสังเกตพยาบาล:</strong> ${postOp?.observation || 'สัตว์ป่วยฟื้นตัวดี ไม่มีอาการหนาวสั่นหรืออาเจียน'}
                  </div>
                </div>

                <!-- Discharge Criteria Checklist (Miller's Law / Objective Checklist) -->
                <div class="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <span class="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">เกณฑ์ความพร้อมในการจำหน่าย (Discharge Readiness Criteria):</span>
                  <label class="flex items-center gap-2 text-slate-700">
                    <input type="checkbox" checked disabled class="text-emerald-600 rounded">
                    <span>อุณหภูมิร่างกายคืนสู่ปกติ (> 37.5°C) หายใจสม่ำเสมอ</span>
                  </label>
                  <label class="flex items-center gap-2 text-slate-700">
                    <input type="checkbox" checked disabled class="text-emerald-600 rounded">
                    <span>ลุกนั่งทรงตัวในท่านอนคว่ำ (Sternal Recumbency) ได้</span>
                  </label>
                  <label class="flex items-center gap-2 text-slate-700">
                    <input type="checkbox" checked disabled class="text-emerald-600 rounded">
                    <span>ควบคุมอาการปวดได้เหมาะสม (Pain Score ≤ 2)</span>
                  </label>
                  <label class="flex items-center gap-2 text-slate-700">
                    <input type="checkbox" checked disabled class="text-emerald-600 rounded">
                    <span>แผลผ่าตัดแห้ง สะอาด ไม่มีเลือดซึมผิดปกติ</span>
                  </label>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                ${isDischarged ? `
                  <button onclick="openSurgeryRecordSheet(${sch.id})" class="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer">
                    ดูบันทึกผ่าตัด
                  </button>
                  <span class="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <i data-lucide="check-circle" class="w-4 h-4"></i> ส่งห้องจ่ายยาเรียบร้อย
                  </span>
                ` : `
                  <button onclick="openSurgeryRecordSheet(${sch.id})" class="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer">
                    บันทึกเพิ่มเติม
                  </button>
                  <button onclick="approveDischargeAndSendToPharmacy(${sch.id})" class="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5">
                    <i data-lucide="arrow-right-circle" class="w-4 h-4"></i>
                    <span>อนุมัติจำหน่าย & ส่งต่อห้องจ่ายยา (Pharmacy)</span>
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function approveDischargeAndSendToPharmacy(scheduleId) {
  const sch = getSurgeryScheduleById(scheduleId);
  if (!sch) return;

  sch.status = 'COMPLETED';

  let postOp = getPostoperativeRecordByScheduleId(scheduleId);
  if (postOp) {
    postOp.discharge_readiness = true;
    postOp.consciousness_level = 'ALERT_RESPONSIVE';
  }

  let record = getSurgeryRecordByScheduleId(scheduleId);
  if (record) {
    record.recovery_status = 'READY_FOR_DISCHARGE';
    record.status = 'COMPLETED';
  }

  // Cross Domain Queue Transition to Pharmacy
  const pet = getPetById(sch.pet_id);
  const catalog = getSurgeryCatalogById(sch.surgery_catalog_id);
  const queueItem = state.queues.find(q => q.pet_id === sch.pet_id);
  if (queueItem) {
    queueItem.stage = 'PHARMACY';
    queueItem.chief_complaint = `[ผ่าตัด ${catalog?.surgery_name} เสร็จสิ้นและฟื้นตัวสมบูรณ์] รับยาหลังผ่าตัด`;
  }

  showToast(
    'จำหน่ายออกจากห้องพักฟื้นสำเร็จ',
    `น้อง ${getPetDisplayName(pet)} ฟื้นตัวสมบูรณ์ พร้อมส่งต่อไปยังห้องจ่ายยา (Pharmacy) เรียบร้อยแล้ว`,
    'success'
  );
  renderPostopRecoveryView();
}

// ============================================================================
// 7. SLIDE-OVER SHEETS (PRE-OP, RECORD, SCHEDULE)
// ============================================================================

function openNewSurgeryScheduleSheet() {
  state.sheetMode = 'new-surgery-schedule';
  openSheetContainer();

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  badge.innerText = 'NEW SURGERY SCHEDULE';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300';
  title.innerText = 'ลงตารางนัดผ่าตัดและเตรียมห้อง OR ใหม่';
  subtitle.innerText = 'กำหนดวันเวลา เลือกห้องผ่าตัด ทีมศัลยแพทย์ และสร้างคำขอผ่าตัด';

  body.innerHTML = `
    <form id="form-new-surgery" onsubmit="submitNewSurgerySchedule(event)" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">เลือกสัตว์ป่วยและเจ้าของ <span class="text-rose-500">*</span></label>
        <select id="surg-pet-id" required class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500">
          <option value="">-- เลือกสัตว์ป่วยจากทะเบียน --</option>
          ${state.pets.map(p => {
            const owner = getPrimaryOwnerForPet(p.id);
            return `<option value="${p.id}">${getPetDisplayName(p)} (${p.species}/${p.breed}) - เจ้าของ: ${owner?.display_name || '-'}</option>`;
          }).join('')}
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">ประเภทการผ่าตัด / หัตถการ <span class="text-rose-500">*</span></label>
        <select id="surg-catalog-id" required class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500">
          <option value="">-- เลือกรายการผ่าตัดจากแค็ตตาล็อก --</option>
          ${state.surgeryCatalogs.map(c => `
            <option value="${c.id}">${c.surgery_name} [${c.surgery_type} - ประมาณ ${c.estimated_duration_minutes} นาที]</option>
          `).join('')}
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">ห้องผ่าตัด (Room) <span class="text-rose-500">*</span></label>
          <select id="surg-room-id" required class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500">
            <option value="OR-1">ห้องผ่าตัดปลอดเชื้อ 1 (Sterile OR-1)</option>
            <option value="OR-2" selected>ห้องผ่าตัด 2 (Soft Tissue OR)</option>
            <option value="PROC-1">ห้องหัตถการ & ทันตกรรม (Proc-1)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">ระดับความเร่งด่วน <span class="text-rose-500">*</span></label>
          <select id="surg-urgency" required class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500">
            <option value="ROUTINE">Routine (ตามนัดหมายทั่วไป)</option>
            <option value="URGENT">Urgent (เร่งด่วนภายในวัน)</option>
            <option value="STAT">STAT Emergency (ฉุกเฉินวิกฤตทันที)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">วันที่ผ่าตัด <span class="text-rose-500">*</span></label>
          <input type="date" id="surg-date" value="2026-03-02" required class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">เวลาเริ่มผ่าตัด <span class="text-rose-500">*</span></label>
          <input type="time" id="surg-time" value="14:00" required class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">ศัลยแพทย์ผู้ทำหัตถการ <span class="text-rose-500">*</span></label>
          <select id="surg-surgeon-id" required class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500">
            ${state.doctors.map(d => `<option value="${d.id}">${d.name} (${d.specialty})</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">สัตวแพทย์วิสัญญี / ผู้ช่วย</label>
          <select id="surg-anesthetist-id" class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500">
            <option value="2">สพ.ญ. ศศิธร สุขสมบูรณ์ (ศัลยศาสตร์และวิสัญญี)</option>
            <option value="1">น.สพ. วุฒิชัย เกียรติสกุล (อายุรศาสตร์และศัลยกรรม)</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">ข้อบ่งชี้ทางการแพทย์ (Medical Indication) <span class="text-rose-500">*</span></label>
        <textarea id="surg-indication" rows="2.5" required placeholder="ระบุเหตุผลในการผ่าตัด อาการสำคัญ หรือรอยโรคที่ต้องรักษา..." class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500"></textarea>
      </div>
    </form>
  `;

  footer.innerHTML = `
    <button type="button" onclick="closeSheet()" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg cursor-pointer">
      ยกเลิก
    </button>
    <button type="submit" form="form-new-surgery" class="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition cursor-pointer active:scale-95">
      บันทึกตารางผ่าตัด
    </button>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function submitNewSurgerySchedule(e) {
  e.preventDefault();
  const petId = Number(document.getElementById('surg-pet-id').value);
  const catalogId = Number(document.getElementById('surg-catalog-id').value);
  const roomId = document.getElementById('surg-room-id').value;
  const urgency = document.getElementById('surg-urgency').value;
  const date = document.getElementById('surg-date').value;
  const time = document.getElementById('surg-time').value;
  const surgeonId = Number(document.getElementById('surg-surgeon-id').value);
  const anesthetistId = Number(document.getElementById('surg-anesthetist-id').value);
  const indication = document.getElementById('surg-indication').value;

  const pet = getPetById(petId);
  const ownerId = getPrimaryOwnerForPet(petId)?.id || 1;
  const catalog = getSurgeryCatalogById(catalogId);

  const roomNames = {
    'OR-1': 'ห้องผ่าตัดปลอดเชื้อ 1 (Sterile OR-1)',
    'OR-2': 'ห้องผ่าตัด 2 (Soft Tissue OR)',
    'PROC-1': 'ห้องหัตถการ & ทันตกรรม (Proc-1)'
  };

  const newId = state.surgerySchedules.length + 1;
  const scheduleNumber = `SCH-20260302-${String(newId).padStart(2, '0')}`;

  const newSchedule = {
    id: newId,
    schedule_number: scheduleNumber,
    encounter_id: 1,
    pet_id: petId,
    customer_id: ownerId,
    surgery_catalog_id: catalogId,
    room_id: roomId,
    room_name: roomNames[roomId] || roomId,
    scheduled_date: date,
    scheduled_time: time,
    estimated_duration: catalog?.estimated_duration_minutes || 45,
    surgeon_id: surgeonId,
    anesthetist_id: anesthetistId,
    status: 'SCHEDULED',
    medical_indication: indication,
    urgency: urgency
  };

  state.surgerySchedules.unshift(newSchedule);

  // Pre-op assessment
  state.preoperativeAssessments.unshift({
    id: state.preoperativeAssessments.length + 1,
    schedule_id: newId,
    pet_id: petId,
    assessed_by: surgeonId,
    risk_level: 'ASA I',
    risk_description: 'ตรวจร่างกายเบื้องต้นก่อนผ่าตัด สภาพร่างกายปกติ',
    fasting_food_hours: 8,
    fasting_water_hours: 2,
    is_npo_cleared: true,
    pre_op_bloodwork: 'รอผลตรวจยืนยันก่อนเข้าห้องผ่าตัด',
    assessment_result: 'ลงตารางเรียบร้อย รอตรวจเช็กความพร้อมก่อนผ่าตัด',
    approved_for_surgery: true,
    assessed_at: '2026-03-02 11:45'
  });

  // Consent form
  const owner = getCustomerById(ownerId);
  state.surgeryConsents.unshift({
    id: state.surgeryConsents.length + 1,
    schedule_id: newId,
    customer_id: ownerId,
    pet_id: petId,
    consent_type: 'หนังสือยินยอมการผ่าตัดและการวางยาสลบ',
    signed_by_name: owner?.display_name || 'เจ้าของสัตว์เลี้ยง',
    is_signed: true,
    witness_name: 'น.ส. สุภาพร พยาบาลสัตว์',
    consented_at: '2026-03-02 11:45'
  });

  closeSheet();
  renderCurrentView();
  showToast('ลงตารางผ่าตัดสำเร็จ', `จัดคิวผ่าตัด ${catalog?.surgery_name} สำหรับน้อง ${getPetDisplayName(pet)} เรียบร้อยแล้ว`, 'success');
}

function openPreOpAssessmentSheet(scheduleId) {
  state.sheetMode = 'preop-assessment';
  openSheetContainer();

  const sch = getSurgeryScheduleById(scheduleId);
  const pet = getPetById(sch.pet_id);
  const owner = getCustomerById(sch.customer_id);
  const catalog = getSurgeryCatalogById(sch.surgery_catalog_id);
  let preOp = getPreOpAssessmentByScheduleId(scheduleId);
  let consent = getSurgeryConsentByScheduleId(scheduleId);

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  badge.innerText = 'PRE-OPERATIVE ASSESSMENT';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300';
  title.innerText = 'การประเมินความพร้อมก่อนผ่าตัด & หนังสือยินยอม';
  subtitle.innerText = `ตรวจสอบระดับความเสี่ยง ASA, การงดอาหาร NPO, และความยินยอมของ ${getPetDisplayName(pet)}`;

  body.innerHTML = `
    <form id="form-preop" onsubmit="submitPreOpAssessment(event, ${scheduleId})" class="space-y-4">
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0">
          ${pet?.species === 'แมว' ? '🐱' : '🐶'}
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="text-xs font-bold text-slate-800">${getPetDisplayName(pet)} (${pet?.species} • ${pet?.breed})</h4>
          <p class="text-[11px] text-slate-500">น้ำหนัก: <strong class="text-slate-700">${pet?.current_weight || 5} kg</strong> • เจ้าของ: ${owner?.display_name || '-'}</p>
          <p class="text-[11px] text-rose-700 font-semibold mt-0.5">การผ่าตัด: ${catalog?.surgery_name}</p>
        </div>
      </div>

      <div class="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
        <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
          <i data-lucide="shield-alert" class="w-4 h-4 text-amber-500"></i>
          <span>ระดับความเสี่ยงทางวิสัญญี (ASA Physical Status Classification)</span>
        </div>

        <div class="space-y-2">
          <label class="flex items-start gap-2.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input type="radio" name="asa-level" value="ASA I" ${preOp?.risk_level === 'ASA I' ? 'checked' : ''} class="mt-0.5 text-rose-600 focus:ring-rose-500">
            <div class="text-xs">
              <span class="font-bold text-emerald-700">ASA I: ผู้ป่วยปกติแข็งแรงดี (Normal Healthy Patient)</span>
              <p class="text-[11px] text-slate-500">ไม่มีความผิดปกติของระบบร่างกาย เช่น สัตว์แข็งแรงที่เข้ารับการทำหมัน</p>
            </div>
          </label>

          <label class="flex items-start gap-2.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input type="radio" name="asa-level" value="ASA II" ${preOp?.risk_level === 'ASA II' ? 'checked' : ''} class="mt-0.5 text-rose-600 focus:ring-rose-500">
            <div class="text-xs">
              <span class="font-bold text-amber-700">ASA II: ผู้ป่วยมีโรคระบบไม่รุนแรง (Mild Systemic Disease)</span>
              <p class="text-[11px] text-slate-500">มีความผิดปกติหรืออักเสบเฉพาะที่ เช่น แผลฉีกขาด, หินปูนสะสม หรือสัตว์อายุมาก</p>
            </div>
          </label>

          <label class="flex items-start gap-2.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input type="radio" name="asa-level" value="ASA III" ${preOp?.risk_level === 'ASA III' ? 'checked' : ''} class="mt-0.5 text-rose-600 focus:ring-rose-500">
            <div class="text-xs">
              <span class="font-bold text-orange-700">ASA III: ผู้ป่วยมีโรคระบบรุนแรง (Severe Systemic Disease)</span>
              <p class="text-[11px] text-slate-500">เช่น ภาวะโลหิตจางปานกลาง, ภาวะขาดน้ำ, โรคหัวใจหรือโรคไตระยะเริ่มต้น</p>
            </div>
          </label>

          <label class="flex items-start gap-2.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input type="radio" name="asa-level" value="ASA IV" ${preOp?.risk_level === 'ASA IV' ? 'checked' : ''} class="mt-0.5 text-rose-600 focus:ring-rose-500">
            <div class="text-xs">
              <span class="font-bold text-rose-700">ASA IV: โรคระบบรุนแรงที่เป็นอันตรายต่อชีวิต (Life-threatening)</span>
              <p class="text-[11px] text-slate-500">เช่น ภาวะช็อก, มดลูกอักเสบติดเชื้อในกระแสเลือด, กระเพาะบิดหมุน (GDV)</p>
            </div>
          </label>
        </div>
      </div>

      <div class="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
        <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
          <i data-lucide="utensils-crossed" class="w-4 h-4 text-blue-500"></i>
          <span>การอดอาหาร (NPO) และผลตรวจเลือดทางห้องปฏิบัติการ</span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">งดอาหารมาแล้ว (ชั่วโมง)</label>
            <input type="number" id="preop-food-hrs" value="${preOp?.fasting_food_hours || 8}" min="0" max="24" class="w-full text-xs p-2 rounded-lg border border-slate-300">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">งดน้ำมาแล้ว (ชั่วโมง)</label>
            <input type="number" id="preop-water-hrs" value="${preOp?.fasting_water_hours || 2}" min="0" max="12" class="w-full text-xs p-2 rounded-lg border border-slate-300">
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">สรุปผลตรวจเลือดก่อนผ่าตัด (Pre-op Blood Work)</label>
          <textarea id="preop-bloodwork" rows="2" class="w-full text-xs p-2 rounded-lg border border-slate-300">${preOp?.pre_op_bloodwork || 'ตรวจเลือดเรียบร้อย ทุกค่าอยู่ในเกณฑ์ปกติ'}</textarea>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">บันทึกข้อสรุปการประเมินความพร้อม</label>
          <textarea id="preop-assessment-result" rows="2" class="w-full text-xs p-2 rounded-lg border border-slate-300">${preOp?.assessment_result || 'สุขภาพพร้อมผ่าตัด'}</textarea>
        </div>
      </div>

      <div class="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
        <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
          <i data-lucide="file-signature" class="w-4 h-4 text-emerald-600"></i>
          <span>หนังสือยินยอมผ่าตัดและวางยาสลบ (Treatment Consent)</span>
        </div>

        <div class="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-2.5">
          <i data-lucide="check-circle" class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"></i>
          <div class="text-xs">
            <span class="font-bold text-emerald-900">เจ้าของได้ลงนามยินยอมเรียบร้อยแล้ว</span>
            <p class="text-[11px] text-emerald-700 mt-0.5">ผู้ลงนาม: <strong>${consent?.signed_by_name || owner?.display_name}</strong> • พยาน: ${consent?.witness_name || 'พยาบาลสัตว์'}</p>
            <p class="text-[10px] text-emerald-600">บันทึกเมื่อ: ${consent?.consented_at || '2026-03-02 11:15'}</p>
          </div>
        </div>
      </div>
    </form>
  `;

  footer.innerHTML = `
    <button type="button" onclick="closeSheet()" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg cursor-pointer">
      ปิด
    </button>
    <button type="submit" form="form-preop" class="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition cursor-pointer active:scale-95">
      บันทึกผลการประเมิน
    </button>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function submitPreOpAssessment(e, scheduleId) {
  e.preventDefault();
  const asaLevel = document.querySelector('input[name="asa-level"]:checked')?.value || 'ASA I';
  const foodHrs = Number(document.getElementById('preop-food-hrs').value);
  const waterHrs = Number(document.getElementById('preop-water-hrs').value);
  const bloodwork = document.getElementById('preop-bloodwork').value;
  const result = document.getElementById('preop-assessment-result').value;

  let preOp = getPreOpAssessmentByScheduleId(scheduleId);
  if (preOp) {
    preOp.risk_level = asaLevel;
    preOp.fasting_food_hours = foodHrs;
    preOp.fasting_water_hours = waterHrs;
    preOp.pre_op_bloodwork = bloodwork;
    preOp.assessment_result = result;
  }

  closeSheet();
  renderCurrentView();
  showToast('บันทึกผลประเมินสำเร็จ', `อัปเดตผลประเมินความพร้อมและระดับความเสี่ยง ${asaLevel} เรียบร้อยแล้ว`, 'success');
}

function openSurgeryRecordSheet(scheduleId) {
  state.sheetMode = 'surgery-record';
  openSheetContainer();

  const sch = getSurgeryScheduleById(scheduleId);
  const pet = getPetById(sch.pet_id);
  const catalog = getSurgeryCatalogById(sch.surgery_catalog_id);
  const surgeon = getDoctorById(sch.surgeon_id);
  const anesthetist = getDoctorById(sch.anesthetist_id);
  let record = getSurgeryRecordByScheduleId(scheduleId);

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  badge.innerText = 'SURGERY & OPERATIVE RECORD';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300';
  title.innerText = `บันทึกการผ่าตัด: ${catalog?.surgery_name}`;
  subtitle.innerText = `เคสของน้อง ${getPetDisplayName(pet)} • ${sch.room_name} • รหัสเคส ${sch.schedule_number}`;

  const opDetails = record?.operation_details || `เตรียมผิวหนังแบบปลอดเชื้อ ทำหัตถการ ${catalog?.surgery_name} ตามขั้นตอนมาตรฐาน เย็บปิดแผลเรียบร้อย`;
  const anesthSummary = record?.anesthesia_summary || `Induction: Propofol/Alfaxalone, Maintenance: Isoflurane 1.5% in 100% O2, SpO2 99%, HR ปกติ`;
  const findings = record?.findings || `การผ่าตัดเป็นไปด้วยความเรียบร้อย ไม่มีภาวะแทรกซ้อน เลือดออกน้อย`;
  const instructions = record?.postoperative_instructions || `ใส่ปลอกคอกันเลีย (E-Collar) 10 วัน, ทำแผลวันละ 1 ครั้ง, รับประทานยาต่อเนื่องตามแพทย์สั่ง`;
  const painScore = record?.pain_score || 2;

  const currentMaterials = record?.materials || [
    { product_id: 7, product_name: '0.9% Normal Saline Solution 1,000ml', quantity: 1, unit: 'ขวด' },
    { product_id: 9, product_name: 'ไหมเย็บแผล Nylon 3-0 พร้อมเข็มโค้ง (Ethicon)', quantity: 1, unit: 'ซอง' }
  ];

  body.innerHTML = `
    <div class="space-y-4">
      <div class="bg-rose-50/60 border border-rose-200/80 rounded-xl p-3.5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0">
            <i data-lucide="scissors" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-900">${catalog?.surgery_name}</h4>
            <p class="text-[11px] text-slate-500">ศัลยแพทย์: <strong class="text-slate-800">${surgeon?.name}</strong> • วิสัญญี: <strong class="text-slate-800">${anesthetist?.name}</strong></p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold font-mono text-slate-700">${sch.schedule_number}</span>
          <p class="text-[10px] text-slate-400 mt-0.5">ห้อง: ${sch.room_id}</p>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
          <i data-lucide="file-text" class="w-4 h-4 text-slate-500"></i>
          <span>บันทึกขั้นตอนและรายละเอียดการผ่าตัด (Operative Notes) <span class="text-rose-500">*</span></span>
        </label>
        <textarea id="surg-rec-details" rows="3" class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500">${opDetails}</textarea>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
          <i data-lucide="activity" class="w-4 h-4 text-blue-500"></i>
          <span>สรุปการระงับความรู้สึกและสัญญาณชีพ (Anesthesia & Vitals Summary)</span>
        </label>
        <textarea id="surg-rec-anesthesia" rows="2" class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500">${anesthSummary}</textarea>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div class="col-span-2">
          <label class="block text-xs font-bold text-slate-700 mb-1">ข้อค้นพบระหว่างผ่าตัด (Surgical Findings)</label>
          <input type="text" id="surg-rec-findings" value="${findings}" class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">ผลการผ่าตัด (Outcome)</label>
          <select id="surg-rec-outcome" class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500">
            <option value="SUCCESSFUL" selected>สำเร็จเรียบร้อย (Successful)</option>
            <option value="COMPLICATED">มีภาวะแทรกซ้อน (Complicated)</option>
            <option value="PARTIAL">ทำได้บางส่วน (Partial)</option>
          </select>
        </div>
      </div>

      <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-2.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <i data-lucide="boxes" class="w-4 h-4 text-teal-600"></i>
            <span>วัสดุและเวชภัณฑ์ที่ใช้จริงในการผ่าตัด (Material Usages)</span>
          </div>
          <button type="button" onclick="addSurgeryMaterialRow(${scheduleId})" class="text-[11px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>เพิ่มรายการวัสดุ</span>
          </button>
        </div>
        <div id="surg-materials-list" class="space-y-2">
          ${currentMaterials.map(mat => `
            <div class="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 material-row">
              <select class="material-product-select text-xs p-1.5 rounded border border-slate-300 flex-1">
                ${state.products.map(p => `
                  <option value="${p.id}" ${p.id === mat.product_id ? 'selected' : ''}>${p.product_name} (${p.category})</option>
                `).join('')}
              </select>
              <input type="number" value="${mat.quantity}" min="1" max="50" class="material-qty-input w-16 text-xs p-1.5 rounded border border-slate-300 text-center font-bold">
              <span class="text-xs text-slate-500 w-10">${mat.unit}</span>
              <button type="button" onclick="removeSurgeryMaterialRow(this)" class="text-rose-500 hover:text-rose-700 p-1 cursor-pointer" title="ลบรายการ">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="grid grid-cols-4 gap-3">
        <div class="col-span-3">
          <label class="block text-xs font-bold text-slate-700 mb-1">คำแนะนำการดูแลหลังผ่าตัด (Post-op Instructions)</label>
          <textarea id="surg-rec-instructions" rows="2" class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500">${instructions}</textarea>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">คะแนนปวด (Pain 1-10)</label>
          <input type="number" id="surg-rec-pain" value="${painScore}" min="0" max="10" class="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-bold text-center">
        </div>
      </div>
    </div>
  `;

  footer.innerHTML = `
    <button type="button" onclick="closeSheet()" class="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg cursor-pointer">
      ปิด
    </button>
    <button type="button" onclick="saveSurgeryRecordDraft(${scheduleId})" class="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-lg transition cursor-pointer">
      บันทึกร่าง (Draft)
    </button>
    <button type="button" onclick="completeSurgeryAndSendToPharmacy(${scheduleId})" class="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition cursor-pointer active:scale-95 flex items-center gap-1.5">
      <i data-lucide="check-circle" class="w-4 h-4"></i>
      <span>บันทึกผล & ส่งต่อไปห้องจ่ายยา (Pharmacy)</span>
    </button>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function addSurgeryMaterialRow(scheduleId) {
  const container = document.getElementById('surg-materials-list');
  if (!container) return;

  const newRow = document.createElement('div');
  newRow.className = 'flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 material-row';
  newRow.innerHTML = `
    <select class="material-product-select text-xs p-1.5 rounded border border-slate-300 flex-1">
      ${state.products.map(p => `
        <option value="${p.id}">${p.product_name} (${p.category})</option>
      `).join('')}
    </select>
    <input type="number" value="1" min="1" max="50" class="material-qty-input w-16 text-xs p-1.5 rounded border border-slate-300 text-center font-bold">
    <span class="text-xs text-slate-500 w-10">ชิ้น</span>
    <button type="button" onclick="removeSurgeryMaterialRow(this)" class="text-rose-500 hover:text-rose-700 p-1 cursor-pointer" title="ลบรายการ">
      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
    </button>
  `;
  container.appendChild(newRow);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function removeSurgeryMaterialRow(btn) {
  const row = btn.closest('.material-row');
  if (row) row.remove();
}

function collectSurgeryMaterials() {
  const rows = document.querySelectorAll('.material-row');
  const materials = [];
  rows.forEach(r => {
    const prodId = Number(r.querySelector('.material-product-select')?.value);
    const qty = Number(r.querySelector('.material-qty-input')?.value || 1);
    const prod = getProductById(prodId);
    if (prod) {
      materials.push({
        product_id: prod.id,
        product_name: prod.product_name,
        quantity: qty,
        unit: prod.base_unit
      });
    }
  });
  return materials;
}

function saveSurgeryRecordDraft(scheduleId) {
  const sch = getSurgeryScheduleById(scheduleId);
  if (!sch) return;

  const details = document.getElementById('surg-rec-details')?.value;
  const anesth = document.getElementById('surg-rec-anesthesia')?.value;
  const findings = document.getElementById('surg-rec-findings')?.value;
  const outcome = document.getElementById('surg-rec-outcome')?.value;
  const instructions = document.getElementById('surg-rec-instructions')?.value;
  const pain = Number(document.getElementById('surg-rec-pain')?.value || 2);
  const materials = collectSurgeryMaterials();

  let record = getSurgeryRecordByScheduleId(scheduleId);
  if (!record) {
    record = {
      id: state.surgeryRecords.length + 1,
      schedule_id: scheduleId,
      surgery_number: `SURG-REC-20260302-${String(scheduleId).padStart(2, '0')}`,
      pet_id: sch.pet_id,
      customer_id: sch.customer_id,
      surgeon_id: sch.surgeon_id,
      anesthetist_id: sch.anesthetist_id,
      started_at: '2026-03-02 11:35',
      completed_at: null,
      operation_details: details,
      anesthesia_summary: anesth,
      findings: findings,
      outcome: outcome,
      pain_score: pain,
      postoperative_instructions: instructions,
      recovery_status: 'IN_SURGERY',
      status: 'IN_PROGRESS',
      materials: materials
    };
    state.surgeryRecords.unshift(record);
  } else {
    record.operation_details = details;
    record.anesthesia_summary = anesth;
    record.findings = findings;
    record.outcome = outcome;
    record.postoperative_instructions = instructions;
    record.pain_score = pain;
    record.materials = materials;
  }

  closeSheet();
  renderCurrentView();
  showToast('บันทึกร่างสำเร็จ', 'บันทึกรายละเอียดการผ่าตัดและรายการวัสดุชั่วคราวเรียบร้อยแล้ว', 'info');
}

function completeSurgeryAndSendToPharmacy(scheduleId) {
  const sch = getSurgeryScheduleById(scheduleId);
  if (!sch) return;

  const pet = getPetById(sch.pet_id);
  const catalog = getSurgeryCatalogById(sch.surgery_catalog_id);
  const details = document.getElementById('surg-rec-details')?.value;
  const anesth = document.getElementById('surg-rec-anesthesia')?.value;
  const findings = document.getElementById('surg-rec-findings')?.value;
  const outcome = document.getElementById('surg-rec-outcome')?.value;
  const instructions = document.getElementById('surg-rec-instructions')?.value;
  const pain = Number(document.getElementById('surg-rec-pain')?.value || 2);
  const materials = collectSurgeryMaterials();

  sch.status = 'COMPLETED';

  let record = getSurgeryRecordByScheduleId(scheduleId);
  if (!record) {
    record = {
      id: state.surgeryRecords.length + 1,
      schedule_id: scheduleId,
      surgery_number: `SURG-REC-20260302-${String(scheduleId).padStart(2, '0')}`,
      pet_id: sch.pet_id,
      customer_id: sch.customer_id,
      surgeon_id: sch.surgeon_id,
      anesthetist_id: sch.anesthetist_id,
      started_at: '2026-03-02 11:35',
      completed_at: '2026-03-02 12:15',
      operation_details: details,
      anesthesia_summary: anesth,
      findings: findings,
      outcome: outcome,
      pain_score: pain,
      postoperative_instructions: instructions,
      recovery_status: 'READY_FOR_DISCHARGE',
      status: 'COMPLETED',
      materials: materials
    };
    state.surgeryRecords.unshift(record);
  } else {
    record.completed_at = '2026-03-02 12:15';
    record.operation_details = details;
    record.anesthesia_summary = anesth;
    record.findings = findings;
    record.outcome = outcome;
    record.postoperative_instructions = instructions;
    record.pain_score = pain;
    record.recovery_status = 'READY_FOR_DISCHARGE';
    record.status = 'COMPLETED';
    record.materials = materials;
  }

  // Cross-Domain Integration: Transition Queue to PHARMACY
  const queueItem = state.queues.find(q => q.pet_id === sch.pet_id);
  if (queueItem) {
    queueItem.stage = 'PHARMACY';
    queueItem.chief_complaint = `[ผ่าตัด ${catalog?.surgery_name} เสร็จสิ้น] ส่งต่อห้องจ่ายยารับยาปฏิชีวนะและยาลดอักเสบหลังผ่าตัด`;
  }

  // Central Event Bus Notification (D06 -> D04 Inventory Stock & D07 Billing)
  if (window.ClinicEventBus && window.CLINIC_EVENTS) {
    window.ClinicEventBus.emit(window.CLINIC_EVENTS.SURGERY_COMPLETED, {
      schedule: sch,
      record: record,
      materials: materials,
      petId: sch.pet_id,
      customerId: sch.customer_id
    });
  }

  closeSheet();
  renderCurrentView();

  showToast(
    'การผ่าตัดเสร็จสมบูรณ์ & ส่งต่อห้องจ่ายยาแล้ว',
    `เคสผ่าตัด ${catalog?.surgery_name} ของน้อง ${getPetDisplayName(pet)} เสร็จเรียบร้อย พร้อมปลดล็อกคิวส่งต่อไปยังห้องจ่ายยา (Pharmacy) ทันที`,
    'success'
  );
}
