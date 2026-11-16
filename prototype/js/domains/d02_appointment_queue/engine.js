// -------------------------------------------------------------
// DOMAIN 02: APPOINTMENT & QUEUE MANAGEMENT ENGINE
// -------------------------------------------------------------

// ==========================================
// 1. AUDIO & VOICE ANNOUNCEMENT ENGINE
// ==========================================
function playChimeTone() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc2.frequency.setValueAtTime(880.00, now + 0.15); // A5

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.15);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.6);
  } catch (err) {
    console.warn('Web Audio Chime failed:', err);
  }
}

function announceQueueVoice(ticketNumber, roomName) {
  playChimeTone();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const msgText = `ขอเชิญหมายเลขคิว ${ticketNumber} ที่ ${roomName} ค่ะ`;
      const utterance = new SpeechSynthesisUtterance(msgText);
      utterance.lang = 'th-TH';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const thaiVoice = voices.find(v => v.lang.startsWith('th'));
      if (thaiVoice) utterance.voice = thaiVoice;

      window.speechSynthesis.speak(utterance);
    }, 250);
  }
}

// ==========================================
// 2. QUEUE KANBAN & STAGE MANAGEMENT
// ==========================================
function handleDragStart(e, queueId) {
  state.draggedQueueId = queueId;
  e.dataTransfer.setData('text/plain', queueId);
  e.currentTarget.classList.add('dragging-card');
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over-zone');
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over-zone');
}

function handleDrop(e, targetStage) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over-zone');
  const queueId = Number(state.draggedQueueId || e.dataTransfer.getData('text/plain'));
  if (!queueId) return;

  const queueItem = state.queues.find(q => q.id === queueId);
  if (!queueItem) return;

  if (queueItem.stage !== targetStage) {
    moveQueueStage(queueId, targetStage, 'ย้ายสเตจผ่าน Drag-and-Drop');
  }
}

function getStageNameTh(stage) {
  switch (stage) {
    case 'WAITING': return 'รอเรียกตรวจ';
    case 'IN_SERVICE': return 'กำลังตรวจในห้องแพทย์';
    case 'HOLD': return 'พักรอผลแล็บ/ยา';
    case 'COMPLETED': return 'ตรวจเสร็จ / ส่งคิดเงิน';
    case 'SKIPPED': return 'ข้ามคิว / รอเรียกซ้ำ';
    default: return stage;
  }
}

function moveQueueStage(queueId, nextStage, reason = 'เปลี่ยนสถานะคิว') {
  const q = state.queues.find(item => item.id === queueId);
  if (!q) return;

  const oldStage = q.stage;
  q.stage = nextStage;

  // Record audit history (appointment.queue_status_histories)
  if (!state.queue_status_histories) state.queue_status_histories = [];
  state.queue_status_histories.push({
    id: state.queue_status_histories.length + 1,
    queue_ticket_id: q.id,
    old_stage: oldStage,
    new_stage: nextStage,
    changed_at: new Date().toISOString(),
    changed_by: 'เจ้าหน้าที่ผู้ปฏิบัติงาน',
    reason: reason
  });

  // If moved to IN_SERVICE, ensure room is marked
  if (nextStage === 'IN_SERVICE') {
    const room = state.rooms.find(r => r.id === q.room_id);
    if (room) room.status = 'OCCUPIED';
  } else if (oldStage === 'IN_SERVICE') {
    const room = state.rooms.find(r => r.id === q.room_id);
    if (room) room.status = 'AVAILABLE';
  }

  showToast(
    'อัปเดตสเตจคิวสำเร็จ',
    `บัตรคิว #${q.ticket_number} ย้ายไปที่ "${getStageNameTh(nextStage)}"`,
    'success'
  );

  renderCurrentView();
}

function callNextQueue() {
  const waitingList = state.queues
    .filter(q => q.stage === 'WAITING')
    .sort((a, b) => b.priority - a.priority || a.id - b.id);

  if (waitingList.length === 0) {
    showToast('ไม่มีคิวรอเรียก', 'ขณะนี้ไม่มีสัตว์ป่วยที่รอเรียกตรวจในห้องพักรอ', 'info');
    return;
  }

  const nextQ = waitingList[0];
  callQueueTicket(nextQ.id);
}

function callQueueTicket(queueId) {
  const q = state.queues.find(item => item.id === queueId);
  if (!q) return;

  const pet = getPetById(q.pet_id);
  const room = state.rooms.find(r => r.id === q.room_id) || state.rooms[0];
  const doctor = state.doctors.find(d => d.id === q.doctor_id) || state.doctors[0];

  q.call_count = (q.call_count || 0) + 1;
  const oldStage = q.stage;
  q.stage = 'IN_SERVICE';

  // Record queue call (appointment.queue_calls)
  if (!state.queue_calls) state.queue_calls = [];
  state.queue_calls.push({
    id: state.queue_calls.length + 1,
    queue_ticket_id: q.id,
    ticket_number: q.ticket_number,
    room_id: room.id,
    doctor_id: doctor.id,
    call_number: q.call_count,
    called_at: new Date().toISOString(),
    called_by: doctor.name,
    status: 'ACKNOWLEDGED'
  });

  // Record audit history
  if (oldStage !== 'IN_SERVICE') {
    if (!state.queue_status_histories) state.queue_status_histories = [];
    state.queue_status_histories.push({
      id: state.queue_status_histories.length + 1,
      queue_ticket_id: q.id,
      old_stage: oldStage,
      new_stage: 'IN_SERVICE',
      changed_at: new Date().toISOString(),
      changed_by: doctor.name,
      reason: `เรียกคิวครั้งที่ ${q.call_count} เข้าห้องตรวจ`
    });
  }

  // Voice Announcement
  announceQueueVoice(q.ticket_number, room.name);

  state.activeConsultationPetId = pet ? pet.id : null;

  showToast(
    `📢 เรียกคิว #${q.ticket_number}!`,
    `เชิญ ${pet ? pet.pet_name : 'สัตว์ป่วย'} เข้า ${room.name} (เรียกครั้งที่ ${q.call_count})`,
    'success'
  );

  renderCurrentView();
}

function recallQueueTicket(queueId) {
  const q = state.queues.find(item => item.id === queueId);
  if (!q) return;

  const pet = getPetById(q.pet_id);
  const room = state.rooms.find(r => r.id === q.room_id) || state.rooms[0];
  q.call_count = (q.call_count || 0) + 1;

  // Record queue call
  if (!state.queue_calls) state.queue_calls = [];
  state.queue_calls.push({
    id: state.queue_calls.length + 1,
    queue_ticket_id: q.id,
    ticket_number: q.ticket_number,
    room_id: room.id,
    doctor_id: q.doctor_id || 1,
    call_number: q.call_count,
    called_at: new Date().toISOString(),
    called_by: 'เจ้าหน้าที่คลินิก',
    status: 'RECALLED'
  });

  announceQueueVoice(q.ticket_number, room.name);

  showToast(
    `📢 เรียกซ้ำคิว #${q.ticket_number}!`,
    `ส่งเสียงเรียก ${pet ? pet.pet_name : 'สัตว์ป่วย'} เข้า ${room.name} อีกครั้ง (ครั้งที่ ${q.call_count})`,
    'info'
  );

  renderCurrentView();
}

function skipQueueTicket(queueId) {
  const q = state.queues.find(item => item.id === queueId);
  if (!q) return;

  moveQueueStage(queueId, 'HOLD', 'เจ้าของสัตว์ยังไม่มาตามเสียงเรียก (ข้ามคิวพักไว้)');
  showToast(
    `ข้ามคิว #${q.ticket_number}`,
    `ย้ายคิวไปสเตจ "พักรอ" เรียบร้อยแล้ว สามารถกดเรียกใหม่ได้ตลอดเวลา`,
    'warning'
  );
}

function startConsultationDirectly(petId) {
  state.activeConsultationPetId = Number(petId);
  switchMainView('emr');
  showToast(
    'เปิดห้องตรวจ EMR',
    `พร้อมบันทึกเวชระเบียนสำหรับ ${getPetById(petId)?.pet_name}`,
    'info'
  );
}

// ==========================================
// 3. RENDER QUEUE KANBAN BOARD
// ==========================================
function renderQueueKanbanBoard(queues) {
  const stages = ['WAITING', 'IN_SERVICE', 'HOLD', 'COMPLETED'];

  stages.forEach(stage => {
    const stageQueues = queues
      .filter(q => q.stage === stage)
      .sort((a, b) => b.priority - a.priority || a.id - b.id);

    const stageKey = stage.toLowerCase();
    const countEl =
      document.getElementById(`count-stage-${stageKey}`) ||
      document.getElementById(`count-stage-${stageKey.replace('_', '')}`);
    if (countEl) countEl.innerText = stageQueues.length;

    const zone =
      document.getElementById(`dropzone-${stageKey}`) ||
      document.getElementById(`dropzone-${stageKey.replace('_', '')}`);
    if (!zone) return;

    zone.innerHTML = stageQueues
      .map(q => {
        const pet = getPetById(q.pet_id);
        const owner = getCustomerById(q.customer_id);
        const doctor = state.doctors.find(d => d.id === q.doctor_id);
        const room = state.rooms.find(r => r.id === q.room_id);
        const isCritical = q.triage_level === 'CRITICAL';
        const isEmergency = q.triage_level === 'EMERGENCY';
        const isUrgent = q.triage_level === 'URGENT';

        const borderClass = isCritical
          ? 'border-purple-600 ring-2 ring-purple-600/30'
          : isEmergency
          ? 'border-rose-400 ring-2 ring-rose-500/20'
          : isUrgent
          ? 'border-amber-300'
          : 'border-slate-200';

        const badgeClass = isCritical
          ? 'bg-purple-100 text-purple-900 border border-purple-200 animate-pulse font-black'
          : isEmergency
          ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
          : isUrgent
          ? 'bg-amber-100 text-amber-800 border border-amber-200'
          : 'bg-emerald-100 text-emerald-800 border border-emerald-200';

        const triageLabel = isCritical
          ? '🟣 วิกฤตชีพ (Critical)'
          : isEmergency
          ? '🔴 ฉุกเฉิน (Emergency)'
          : isUrgent
          ? '🟡 เร่งด่วน (Urgent)'
          : '🟢 ทั่วไป (Normal)';

        return `
          <div draggable="true" ondragstart="handleDragStart(event, ${q.id})" class="bg-white rounded-xl p-3.5 border ${borderClass} shadow-2xs hover:shadow-md transition cursor-grab active:cursor-grabbing">
            <!-- Header bar with ticket and triage -->
            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-mono font-black ${isCritical ? 'bg-purple-900 text-white' : isEmergency ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'} px-2 py-0.5 rounded-md">${q.ticket_number}</span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeClass}">
                  ${triageLabel}
                </span>
              </div>
              <div class="flex items-center gap-1">
                ${q.call_count > 0 ? `<span class="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded font-bold">เรียก x${q.call_count}</span>` : ''}
                <span class="text-[10px] text-slate-400 font-mono">${q.entered_at}</span>
              </div>
            </div>

            <!-- Pet & Owner Profile -->
            <div class="flex items-start gap-2.5 mt-2.5">
              <img src="${pet ? pet.photo : ''}" class="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0">
              <div class="min-w-0 flex-1">
                <h4 class="font-bold text-slate-900 text-xs truncate">${pet ? pet.pet_name : 'สัตว์ไม่ระบุ'}</h4>
                <p class="text-[11px] text-slate-500 truncate">${pet ? pet.breed : ''} • เจ้าของ: <span class="text-slate-700 font-medium">${owner ? owner.display_name : ''}</span></p>
                <p class="text-[10px] text-teal-700 font-medium mt-0.5 truncate">
                  <i data-lucide="map-pin" class="w-2.5 h-2.5 inline mr-0.5"></i>${room ? room.name.split(' ')[0] : 'ห้อง 1'} • ${doctor ? doctor.name.split(' ')[1] : 'แพทย์เวร'}
                </p>
              </div>
            </div>

            <!-- Chief complaint -->
            <div class="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100/80">
              <strong class="text-slate-800 block text-[10px] uppercase font-bold">อาการ:</strong>
              <p class="truncate">${q.chief_complaint}</p>
            </div>

            <!-- Vitals strip (if recorded) -->
            ${q.vitals ? `
              <div class="mt-1.5 grid grid-cols-3 gap-1 text-[9px] text-slate-500 bg-slate-100/60 p-1.5 rounded-lg border border-slate-200/60">
                <div title="อุณหภูมิ"><span class="font-bold text-slate-700">T:</span> ${q.vitals.temp}°C</div>
                <div title="อัตราหัวใจ"><span class="font-bold text-slate-700">HR:</span> ${q.vitals.heart_rate}</div>
                <div title="อัตราหายใจ"><span class="font-bold text-slate-700">RR:</span> ${q.vitals.respiratory_rate}</div>
              </div>
            ` : ''}

            <!-- Action buttons per stage -->
            <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 text-[11px]">
              ${q.stage === 'WAITING' ? `
                <button onclick="callQueueTicket(${q.id})" class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-1.5 rounded-lg text-center transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs">
                  <i data-lucide="volume-2" class="w-3 h-3"></i><span>เรียกตรวจ</span>
                </button>
                <button onclick="skipQueueTicket(${q.id})" title="ข้ามคิวชั่วคราว" class="p-1.5 bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 border border-slate-200 rounded-lg transition cursor-pointer">
                  <i data-lucide="fast-forward" class="w-3.5 h-3.5"></i>
                </button>
              ` : q.stage === 'IN_SERVICE' ? `
                <button onclick="recallQueueTicket(${q.id})" title="ส่งเสียงเรียกซ้ำ" class="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg transition cursor-pointer">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="startConsultationDirectly(${q.pet_id})" class="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-semibold py-1 rounded text-center transition cursor-pointer">
                  ตรวจต่อ (SOAP)
                </button>
                <button onclick="moveQueueStage(${q.id}, 'COMPLETED')" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 rounded text-center transition cursor-pointer">
                  เสร็จสิ้น
                </button>
              ` : q.stage === 'HOLD' ? `
                <button onclick="callQueueTicket(${q.id})" class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-1 rounded font-semibold cursor-pointer flex items-center justify-center gap-1">
                  <i data-lucide="arrow-left" class="w-3 h-3"></i><span>กลับเข้าห้อง</span>
                </button>
                <button onclick="moveQueueStage(${q.id}, 'COMPLETED')" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1 rounded font-semibold cursor-pointer">
                  ส่งคิดเงิน
                </button>
              ` : `
                <div class="w-full flex items-center justify-between text-emerald-700 font-bold text-[10px] py-0.5">
                  <span class="flex items-center gap-1"><i data-lucide="check" class="w-3 h-3"></i> ตรวจเสร็จแล้ว</span>
                  <button onclick="switchMainView('billing')" class="underline hover:text-emerald-900 cursor-pointer">ไปหน้าคิดเงิน &rarr;</button>
                </div>
              `}
            </div>
          </div>
        `;
      })
      .join('');
  });

  lucide.createIcons();
}

function renderQueueListView(queues) {
  const container = document.getElementById('queue-list-table');
  if (!container) return;

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-600">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
          <tr>
            <th class="px-4 py-3.5">คิว #</th>
            <th class="px-4 py-3.5">สัตว์ป่วย & เจ้าของ</th>
            <th class="px-4 py-3.5">ประเภท & อาการ</th>
            <th class="px-4 py-3.5">ระดับ Triage</th>
            <th class="px-4 py-3.5">ห้องตรวจ / แพทย์</th>
            <th class="px-4 py-3.5">สเตจปัจจุบัน</th>
            <th class="px-4 py-3.5 text-right">การกระทำ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${queues.map(q => {
            const pet = getPetById(q.pet_id);
            const owner = getCustomerById(q.customer_id);
            const room = state.rooms.find(r => r.id === q.room_id);
            const doctor = state.doctors.find(d => d.id === q.doctor_id);
            return `
              <tr class="hover:bg-slate-50/80 transition">
                <td class="px-4 py-3 font-mono font-black text-slate-900">
                  <div class="flex items-center gap-1.5">
                    <span>${q.ticket_number}</span>
                    ${q.call_count > 0 ? `<span class="text-[9px] bg-indigo-50 text-indigo-700 px-1 py-0.2 rounded">x${q.call_count}</span>` : ''}
                  </div>
                </td>
                <td class="px-4 py-3 font-bold text-slate-900 cursor-pointer" onclick="startConsultationDirectly(${q.pet_id})">
                  <div>${pet ? pet.pet_name : '-'}</div>
                  <div class="text-[10px] text-slate-400 font-normal">${owner ? owner.display_name : '-'}</div>
                </td>
                <td class="px-4 py-3 max-w-xs truncate">${q.chief_complaint}</td>
                <td class="px-4 py-3 font-bold ${q.triage_level === 'CRITICAL' ? 'text-purple-700' : q.triage_level === 'EMERGENCY' ? 'text-rose-600' : q.triage_level === 'URGENT' ? 'text-amber-600' : 'text-emerald-700'}">${q.triage_level}</td>
                <td class="px-4 py-3 text-slate-600">${room ? room.name.split(' ')[0] : 'ห้อง 1'} (${doctor ? doctor.name.split(' ')[1] : '-'})</td>
                <td class="px-4 py-3 font-semibold">${getStageNameTh(q.stage)}</td>
                <td class="px-4 py-3 text-right space-x-1">
                  ${q.stage === 'WAITING' ? `
                    <button onclick="callQueueTicket(${q.id})" class="text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 px-2.5 py-1 rounded shadow-2xs cursor-pointer">เรียกคิว</button>
                  ` : `
                    <button onclick="startConsultationDirectly(${q.pet_id})" class="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded border border-teal-200 cursor-pointer">ห้องตรวจ EMR</button>
                  `}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ==========================================
// 4. APPOINTMENT CALENDAR & SCHEDULE ENGINE
// ==========================================
function changeCalendarMonth(delta) {
  state.calendarMonth += delta;
  if (state.calendarMonth < 0) {
    state.calendarMonth = 11;
    state.calendarYear--;
  } else if (state.calendarMonth > 11) {
    state.calendarMonth = 0;
    state.calendarYear++;
  }
  renderAppointmentsCalendar();
}

function selectToday() {
  state.selectedDate = '2026-03-02';
  state.calendarMonth = 2;
  state.calendarYear = 2026;
  renderAppointmentsCalendar();
}

function selectDate(dateString) {
  state.selectedDate = dateString;
  renderAppointmentsCalendar();
}

function renderAppointmentsCalendar() {
  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const monthLabelEl = document.getElementById('calendar-month-year-label');
  if (monthLabelEl) {
    monthLabelEl.innerText = `${monthNames[state.calendarMonth]} ${state.calendarYear}`;
  }

  const firstDay = new Date(state.calendarYear, state.calendarMonth, 1).getDay();
  const daysInMonth = new Date(state.calendarYear, state.calendarMonth + 1, 0).getDate();
  const grid = document.getElementById('calendar-days-grid');
  if (!grid) return;

  let html = '';
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="py-2 text-slate-300"></div>';
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(state.calendarMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateIso = `${state.calendarYear}-${monthStr}-${dayStr}`;
    const isSelected = dateIso === state.selectedDate;
    const hasApts = state.appointments.some(
      a => a.scheduled_date === dateIso && a.status !== 'CANCELLED'
    );

    html += `
      <button onclick="selectDate('${dateIso}')" class="py-2 rounded-xl text-center relative font-semibold transition cursor-pointer ${isSelected ? 'bg-teal-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'}">
        <span>${day}</span>
        ${hasApts ? `<span class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-teal-500'}"></span>` : ''}
      </button>
    `;
  }
  grid.innerHTML = html;

  const selectedApts = state.appointments.filter(a => a.scheduled_date === state.selectedDate);
  const activeCount = selectedApts.filter(a => a.status !== 'CANCELLED').length;

  const titleEl = document.getElementById('daily-schedule-title');
  const countEl = document.getElementById('daily-schedule-count');
  if (titleEl) titleEl.innerText = `ตารางนัดหมายประจำวันที่ ${formatDateThai(state.selectedDate)}`;
  if (countEl) countEl.innerText = `มีนัดหมายทั้งหมด ${selectedApts.length} รายการ (ปกติ/ยืนยัน ${activeCount} เคส)`;

  const cardList = document.getElementById('appointments-card-list');
  const listTable = document.getElementById('appointments-list-table');

  if (state.viewMode === 'card') {
    if (cardList) cardList.classList.remove('hidden');
    if (listTable) listTable.classList.add('hidden');

    if (cardList) {
      if (selectedApts.length === 0) {
        cardList.innerHTML = `
          <div class="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <i data-lucide="calendar-x" class="w-10 h-10 text-slate-300 mx-auto mb-2"></i>
            <h4 class="font-bold text-slate-700 text-sm">ไม่มีนัดหมายในวันที่เลือก</h4>
            <p class="text-xs text-slate-500 mt-1">คลิกปุ่ม "+ จองนัดหมายใหม่" เพื่อสร้างนัดหมายหรือเลือกวันอื่นในปฏิทิน</p>
          </div>
        `;
      } else {
        cardList.innerHTML = selectedApts.map(apt => {
          const pet = getPetById(apt.pet_id);
          const owner = getCustomerById(apt.customer_id);
          const doctor = state.doctors.find(d => d.id === apt.doctor_id);
          const room = state.rooms.find(r => r.id === apt.room_id);
          const isCheckedIn = apt.status === 'CHECKED_IN';
          const isNoShow = apt.status === 'NO_SHOW';
          const isCancelled = apt.status === 'CANCELLED';

          const statusBadge = isCheckedIn
            ? `<span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">Check-in แล้ว</span>`
            : isNoShow
            ? `<span class="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200">❌ ไม่มาตามนัด (No-Show)</span>`
            : isCancelled
            ? `<span class="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">🚫 ยกเลิกแล้ว</span>`
            : apt.confirmation_status === 'CONFIRMED'
            ? `<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">✓ ยืนยันนัดแล้ว</span>`
            : `<span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">⏳ รอยืนยัน</span>`;

          return `
            <div class="bg-white rounded-xl border ${isCancelled ? 'border-slate-200 opacity-60 bg-slate-50/50' : 'border-slate-200'} p-4 shadow-xs hover:shadow-md transition">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-start gap-3.5">
                  <div class="w-13 h-13 rounded-xl bg-teal-50 border border-teal-200 flex flex-col items-center justify-center shrink-0">
                    <span class="text-[9px] text-teal-600 font-bold uppercase">เวลา</span>
                    <span class="text-xs font-black text-teal-900">${apt.scheduled_time.split(' - ')[0]}</span>
                    <span class="text-[9px] text-slate-400 font-mono">${apt.scheduled_time.split(' - ')[1]}</span>
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h4 class="font-bold text-slate-900 text-sm hover:text-teal-700 cursor-pointer" onclick="openAppointmentDetailSheet(${apt.id})">${pet ? pet.pet_name : 'สัตว์ไม่ระบุ'}</h4>
                      <span class="text-xs text-slate-500 font-normal">(${apt.appointment_type})</span>
                      ${statusBadge}
                    </div>
                    <p class="text-[11px] text-slate-500 mt-1">
                      เจ้าของ: <strong class="text-slate-700">${owner ? owner.display_name : '-'}</strong> (${owner ? owner.phone : '-'}) • นัด: <span class="font-mono text-slate-600">${apt.appointment_number}</span>
                    </p>
                    <p class="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span><i data-lucide="user-check" class="w-3 h-3 inline text-teal-600 mr-0.5"></i>${doctor ? doctor.name : '-'}</span>
                      <span><i data-lucide="door-closed" class="w-3 h-3 inline text-slate-400 mr-0.5"></i>${room ? room.name.split(' ')[0] : '-'}</span>
                      <span class="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">${apt.source_channel || 'โทรศัพท์'}</span>
                    </p>
                  </div>
                </div>

                <!-- Action Toolbar -->
                <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button onclick="openAppointmentDetailSheet(${apt.id})" class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1">
                    <i data-lucide="eye" class="w-3.5 h-3.5"></i><span>จัดการ</span>
                  </button>

                  ${!isCheckedIn && !isCancelled && !isNoShow ? `
                    <button onclick="checkInAppointment(${apt.id})" class="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs">
                      <i data-lucide="user-check" class="w-3.5 h-3.5"></i><span>Check-in</span>
                    </button>
                  ` : isCheckedIn ? `
                    <button onclick="switchMainView('queue')" class="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1">
                      <i data-lucide="list-ordered" class="w-3.5 h-3.5"></i><span>ดูในคิว</span>
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  } else {
    if (cardList) cardList.classList.add('hidden');
    if (listTable) {
      listTable.classList.remove('hidden');
      listTable.innerHTML = `
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th class="px-4 py-3">เวลานัด</th>
                <th class="px-4 py-3">รหัสนัด</th>
                <th class="px-4 py-3">สัตว์เลี้ยง & เจ้าของ</th>
                <th class="px-4 py-3">ประเภทบริการ</th>
                <th class="px-4 py-3">แพทย์ / ห้อง</th>
                <th class="px-4 py-3">ยืนยัน</th>
                <th class="px-4 py-3">สถานะ</th>
                <th class="px-4 py-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${selectedApts.map(apt => {
                const pet = getPetById(apt.pet_id);
                const owner = getCustomerById(apt.customer_id);
                const doctor = state.doctors.find(d => d.id === apt.doctor_id);
                const room = state.rooms.find(r => r.id === apt.room_id);
                return `
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="px-4 py-3 font-bold text-teal-800 font-mono">${apt.scheduled_time}</td>
                    <td class="px-4 py-3 font-mono text-slate-500">${apt.appointment_number}</td>
                    <td class="px-4 py-3">
                      <div class="font-bold text-slate-900 cursor-pointer hover:underline" onclick="openAppointmentDetailSheet(${apt.id})">${pet ? pet.pet_name : '-'}</div>
                      <div class="text-[10px] text-slate-400">${owner ? owner.display_name : '-'}</div>
                    </td>
                    <td class="px-4 py-3">${apt.appointment_type}</td>
                    <td class="px-4 py-3 text-slate-600">${doctor ? doctor.name.split(' ')[1] : '-'} (${room ? room.name.split(' ')[0] : '-'})</td>
                    <td class="px-4 py-3 font-bold ${apt.confirmation_status === 'CONFIRMED' ? 'text-emerald-700' : 'text-amber-600'}">${apt.confirmation_status}</td>
                    <td class="px-4 py-3 font-semibold">${apt.status}</td>
                    <td class="px-4 py-3 text-right space-x-1">
                      <button onclick="openAppointmentDetailSheet(${apt.id})" class="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded cursor-pointer">จัดการ</button>
                      ${apt.status !== 'CHECKED_IN' && apt.status !== 'CANCELLED' ? `
                        <button onclick="checkInAppointment(${apt.id})" class="text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 px-2 py-1 rounded cursor-pointer">Check-in</button>
                      ` : ''}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  }

  lucide.createIcons();
}

// ==========================================
// 5. APPOINTMENT 360° DRAWER & ACTIONS
// ==========================================
function openAppointmentDetailSheet(aptId) {
  const apt = state.appointments.find(a => a.id === aptId);
  if (!apt) return;

  state.activeAppointmentId = aptId;
  state.sheetMode = 'appointment-detail';
  openSheetContainer();

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  badge.innerText = 'APPOINTMENT 360°';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200';
  title.innerText = `นัดหมาย #${apt.appointment_number}`;
  subtitle.innerText = `${formatDateThai(apt.scheduled_date)} เวลา ${apt.scheduled_time}`;
  footer.classList.add('hidden'); // We use custom action bar inside body

  const pet = getPetById(apt.pet_id);
  const owner = getCustomerById(apt.customer_id);
  const doctor = state.doctors.find(d => d.id === apt.doctor_id);
  const room = state.rooms.find(r => r.id === apt.room_id);

  const modifications = (state.appointment_modifications || []).filter(m => m.appointment_id === apt.id);
  const cancellation = (state.appointment_cancellations || []).find(c => c.appointment_id === apt.id);

  body.innerHTML = `
    <div class="space-y-5">
      <!-- Top Status Banner -->
      <div class="p-4 rounded-xl border ${apt.status === 'CHECKED_IN' ? 'bg-blue-50 border-blue-200 text-blue-900' : apt.status === 'NO_SHOW' ? 'bg-rose-50 border-rose-200 text-rose-900' : apt.status === 'CANCELLED' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-emerald-50 border-emerald-200 text-emerald-900'} flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold tracking-wider block">สถานะนัดหมายปัจจุบัน</span>
          <h4 class="text-base font-bold">${apt.status}</h4>
          <p class="text-xs opacity-80 mt-0.5">การยืนยัน: <strong class="uppercase">${apt.confirmation_status}</strong> (${apt.source_channel || 'โทรศัพท์'})</p>
        </div>
        <div class="flex items-center gap-1.5">
          ${apt.status !== 'CHECKED_IN' && apt.status !== 'CANCELLED' ? `
            <button onclick="toggleAppointmentConfirmation(${apt.id}, '${apt.confirmation_status === 'CONFIRMED' ? 'DECLINED' : 'CONFIRMED'}')" class="bg-white/90 hover:bg-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition cursor-pointer">
              ${apt.confirmation_status === 'CONFIRMED' ? 'ปฏิเสธนัด' : 'ยืนยันนัด'}
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="flex border-b border-slate-200">
        <button onclick="switchAptTab('details')" id="tab-apt-details" class="py-2.5 px-4 text-xs font-bold border-b-2 border-teal-600 text-teal-800 transition cursor-pointer">
          ข้อมูลนัดหมาย
        </button>
        <button onclick="switchAptTab('history')" id="tab-apt-history" class="py-2.5 px-4 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer">
          ประวัติการแก้ไข / ยกเลิก (${modifications.length + (cancellation ? 1 : 0)})
        </button>
      </div>

      <!-- TAB 1: DETAILS -->
      <div id="content-apt-details" class="space-y-4">
        <!-- Patient & Owner Card -->
        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="${pet ? pet.photo : ''}" class="w-12 h-12 rounded-xl object-cover border border-slate-200">
            <div>
              <h4 class="font-bold text-slate-900 text-sm">${pet ? pet.pet_name : '-'} (${pet ? pet.species : '-'})</h4>
              <p class="text-xs text-slate-600">เจ้าของ: <span class="font-semibold text-slate-800">${owner ? owner.display_name : '-'}</span></p>
              <p class="text-[11px] text-slate-500">โทร: ${owner ? owner.phone : '-'}</p>
            </div>
          </div>
          <button onclick="openDetailSheet('pet', ${pet ? pet.id : 1})" class="text-xs font-semibold text-teal-700 hover:underline">
            ดูโปรไฟล์สัตว์ &rarr;
          </button>
        </div>

        <!-- Scheduling Info Grid -->
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="bg-white p-3 rounded-xl border border-slate-200">
            <span class="text-slate-400 text-[10px] block uppercase font-bold">วันที่นัดหมาย</span>
            <p class="font-bold text-slate-800 mt-0.5">${formatDateThai(apt.scheduled_date)}</p>
          </div>
          <div class="bg-white p-3 rounded-xl border border-slate-200">
            <span class="text-slate-400 text-[10px] block uppercase font-bold">ช่วงเวลา</span>
            <p class="font-bold text-teal-800 mt-0.5">${apt.scheduled_time}</p>
          </div>
          <div class="bg-white p-3 rounded-xl border border-slate-200">
            <span class="text-slate-400 text-[10px] block uppercase font-bold">สัตวแพทย์ผู้ตรวจ</span>
            <p class="font-bold text-slate-800 mt-0.5">${doctor ? doctor.name : '-'}</p>
            <p class="text-[10px] text-slate-400">${doctor ? doctor.specialty : ''}</p>
          </div>
          <div class="bg-white p-3 rounded-xl border border-slate-200">
            <span class="text-slate-400 text-[10px] block uppercase font-bold">ห้องตรวจ</span>
            <p class="font-bold text-slate-800 mt-0.5">${room ? room.name : '-'}</p>
            <p class="text-[10px] text-slate-400">สถานะ: ${room ? room.status : '-'}</p>
          </div>
        </div>

        <!-- Appointment Reason & Notes -->
        <div class="bg-white p-3.5 rounded-xl border border-slate-200">
          <span class="text-slate-400 text-[10px] block uppercase font-bold mb-1">เหตุผลและบริการที่นัดหมาย</span>
          <p class="text-xs font-semibold text-slate-800">${apt.appointment_type}</p>
          <p class="text-xs text-slate-600 mt-1">${apt.appointment_reason || 'ไม่มีบันทึกเพิ่มเติม'}</p>
          ${apt.no_show_notes ? `
            <div class="mt-2 p-2 bg-rose-50 text-rose-800 rounded-lg text-xs border border-rose-200">
              <strong>บันทึก No-show:</strong> ${apt.no_show_notes}
            </div>
          ` : ''}
        </div>

        <!-- PRIMARY ACTION BAR -->
        <div class="pt-2 border-t border-slate-200 flex flex-col gap-2">
          ${apt.status !== 'CHECKED_IN' && apt.status !== 'CANCELLED' && apt.status !== 'NO_SHOW' ? `
            <button onclick="checkInAppointment(${apt.id}); closeSheet();" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer">
              <i data-lucide="check-circle" class="w-4 h-4"></i><span>Check-in เข้ารับบริการและออกบัตรคิว</span>
            </button>
            <div class="grid grid-cols-3 gap-2">
              <button onclick="openRescheduleModal(${apt.id})" class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1">
                <i data-lucide="calendar" class="w-3.5 h-3.5"></i><span>เลื่อนนัด</span>
              </button>
              <button onclick="markAppointmentNoShow(${apt.id})" class="bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold py-2 rounded-lg text-xs border border-rose-200 transition cursor-pointer flex items-center justify-center gap-1">
                <i data-lucide="user-x" class="w-3.5 h-3.5"></i><span>No-Show</span>
              </button>
              <button onclick="openCancelAppointmentModal(${apt.id})" class="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold py-2 rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i><span>ยกเลิกนัด</span>
              </button>
            </div>
          ` : apt.status === 'CHECKED_IN' ? `
            <div class="p-3 bg-blue-50 text-blue-800 rounded-xl text-center text-xs font-semibold flex items-center justify-between">
              <span>นัดหมายนี้ Check-in แล้ว (บัตรคิวอยู่ในกระดาน)</span>
              <button onclick="switchMainView('queue'); closeSheet();" class="bg-blue-600 text-white px-3 py-1 rounded-lg">ดูกระดานคิว</button>
            </div>
          ` : `
            <div class="p-3 bg-slate-100 text-slate-600 rounded-xl text-center text-xs">
              นัดหมายนี้สิ้นสุดกระบวนการแล้ว (${apt.status})
            </div>
          `}
        </div>
      </div>

      <!-- TAB 2: AUDIT HISTORY -->
      <div id="content-apt-history" class="hidden space-y-3 text-xs">
        ${cancellation ? `
          <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <div class="flex items-center justify-between text-rose-900 font-bold mb-1">
              <span>🚫 ประวัติการยกเลิกนัดหมาย</span>
              <span class="text-[10px] text-rose-600 font-normal">${new Date(cancellation.cancelled_at).toLocaleString('th-TH')}</span>
            </div>
            <p class="text-rose-800"><strong>เหตุผล:</strong> ${cancellation.cancellation_reason}</p>
            <p class="text-[11px] text-rose-600 mt-1">ผู้ยกเลิก: ${cancellation.cancelled_by}</p>
          </div>
        ` : ''}

        ${modifications.length > 0 ? modifications.map(m => `
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div class="flex items-center justify-between text-slate-800 font-bold">
              <span>✏️ เลื่อนนัดหมาย</span>
              <span class="text-[10px] text-slate-400 font-normal">${new Date(m.modified_at).toLocaleString('th-TH')}</span>
            </div>
            <p class="text-slate-600">เดิม: <span class="line-through">${m.old_date} (${m.old_time})</span></p>
            <p class="text-teal-800 font-semibold">ใหม่: ${m.new_date} (${m.new_time})</p>
            <p class="text-slate-700"><strong>เหตุผล:</strong> ${m.reason}</p>
            <p class="text-[10px] text-slate-400">แก้ไขโดย: ${m.modified_by}</p>
          </div>
        `).join('') : !cancellation ? `
          <div class="p-8 text-center text-slate-400">
            <i data-lucide="history" class="w-8 h-8 mx-auto mb-1 opacity-50"></i>
            <p>ยังไม่มีประวัติการแก้ไขหรือเลื่อนเวลานัดหมาย</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  lucide.createIcons();
}

function switchAptTab(tabName) {
  const tabDetails = document.getElementById('tab-apt-details');
  const tabHistory = document.getElementById('tab-apt-history');
  const contentDetails = document.getElementById('content-apt-details');
  const contentHistory = document.getElementById('content-apt-history');

  if (tabName === 'details') {
    tabDetails.className = 'py-2.5 px-4 text-xs font-bold border-b-2 border-teal-600 text-teal-800 transition cursor-pointer';
    tabHistory.className = 'py-2.5 px-4 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer';
    contentDetails.classList.remove('hidden');
    contentHistory.classList.add('hidden');
  } else {
    tabHistory.className = 'py-2.5 px-4 text-xs font-bold border-b-2 border-teal-600 text-teal-800 transition cursor-pointer';
    tabDetails.className = 'py-2.5 px-4 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer';
    contentHistory.classList.remove('hidden');
    contentDetails.classList.add('hidden');
  }
}

// ==========================================
// 6. APPOINTMENT RESCHEDULE & CANCELLATION
// ==========================================
function openRescheduleModal(aptId) {
  const apt = state.appointments.find(a => a.id === aptId);
  if (!apt) return;

  state.activeRescheduleAptId = aptId;
  const modal = document.getElementById('modal-reschedule-appointment');
  if (!modal) return;

  document.getElementById('reschedule-apt-title').innerText = `เลื่อนเวลานัดหมาย #${apt.appointment_number}`;
  document.getElementById('reschedule-new-date').value = apt.scheduled_date;
  document.getElementById('reschedule-new-time').value = apt.scheduled_time;
  document.getElementById('reschedule-new-doctor').innerHTML = state.doctors.map(d =>
    `<option value="${d.id}" ${d.id === apt.doctor_id ? 'selected' : ''}>${d.name} (${d.specialty})</option>`
  ).join('');

  document.getElementById('reschedule-reason').value = '';
  document.getElementById('reschedule-conflict-warning').classList.add('hidden');

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeRescheduleModal() {
  const modal = document.getElementById('modal-reschedule-appointment');
  if (modal) modal.classList.add('hidden');
}

function checkAppointmentConflict(doctorId, roomId, date, timeSlot, excludeAptId = null) {
  const existing = state.appointments.find(a =>
    a.id !== excludeAptId &&
    a.scheduled_date === date &&
    a.scheduled_time === timeSlot &&
    a.status !== 'CANCELLED' &&
    a.status !== 'NO_SHOW' &&
    (a.doctor_id === Number(doctorId) || (roomId && a.room_id === Number(roomId)))
  );

  return {
    conflict: !!existing,
    existingApt: existing
  };
}

function submitRescheduleAppointment() {
  const aptId = state.activeRescheduleAptId;
  const apt = state.appointments.find(a => a.id === aptId);
  if (!apt) return;

  const newDate = document.getElementById('reschedule-new-date').value;
  const newTime = document.getElementById('reschedule-new-time').value;
  const newDoctorId = Number(document.getElementById('reschedule-new-doctor').value);
  const reason = document.getElementById('reschedule-reason').value.trim();

  if (!reason) {
    alert('กรุณาระบุเหตุผลในการเลื่อนเวลานัดหมาย');
    return;
  }

  // Check double-booking conflict
  const conflictCheck = checkAppointmentConflict(newDoctorId, apt.room_id, newDate, newTime, apt.id);
  if (conflictCheck.conflict) {
    const warningEl = document.getElementById('reschedule-conflict-warning');
    warningEl.innerHTML = `⚠️ พบการนัดหมายซ้อน! แพทย์ท่านนี้มีนัดหมายซ้อนในช่วงเวลาดังกล่าว (${conflictCheck.existingApt.appointment_number})`;
    warningEl.classList.remove('hidden');
    return;
  }

  // Record modification history (appointment.appointment_modifications)
  if (!state.appointment_modifications) state.appointment_modifications = [];
  state.appointment_modifications.push({
    id: state.appointment_modifications.length + 1,
    appointment_id: apt.id,
    old_date: apt.scheduled_date,
    old_time: apt.scheduled_time,
    new_date: newDate,
    new_time: newTime,
    reason: reason,
    modified_by: 'เจ้าหน้าที่ต้อนรับ',
    modified_at: new Date().toISOString()
  });

  apt.scheduled_date = newDate;
  apt.scheduled_time = newTime;
  apt.doctor_id = newDoctorId;
  apt.confirmation_status = 'PENDING'; // Need reconfirmation after change

  closeRescheduleModal();
  openAppointmentDetailSheet(apt.id);
  renderAppointmentsCalendar();

  showToast(
    'เลื่อนนัดหมายสำเร็จ!',
    `นัดหมาย #${apt.appointment_number} ย้ายไปวันที่ ${formatDateThai(newDate)} (${newTime}) แล้ว`,
    'success'
  );
}

function openCancelAppointmentModal(aptId) {
  const apt = state.appointments.find(a => a.id === aptId);
  if (!apt) return;

  state.activeCancelAptId = aptId;
  const modal = document.getElementById('modal-cancel-appointment');
  if (!modal) return;

  document.getElementById('cancel-apt-title').innerText = `ยกเลิกนัดหมาย #${apt.appointment_number}`;
  document.getElementById('cancel-reason-select').value = 'เจ้าของติดธุระด่วน';
  document.getElementById('cancel-notes').value = '';

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeCancelAppointmentModal() {
  const modal = document.getElementById('modal-cancel-appointment');
  if (modal) modal.classList.add('hidden');
}

function submitCancelAppointment() {
  const aptId = state.activeCancelAptId;
  const apt = state.appointments.find(a => a.id === aptId);
  if (!apt) return;

  const reasonSelect = document.getElementById('cancel-reason-select').value;
  const notes = document.getElementById('cancel-notes').value.trim();
  const fullReason = notes ? `${reasonSelect}: ${notes}` : reasonSelect;

  apt.status = 'CANCELLED';
  apt.confirmation_status = 'DECLINED';

  // Record cancellation history (appointment.appointment_cancellations)
  if (!state.appointment_cancellations) state.appointment_cancellations = [];
  state.appointment_cancellations.push({
    id: state.appointment_cancellations.length + 1,
    appointment_id: apt.id,
    cancellation_reason: fullReason,
    cancelled_by: 'เจ้าหน้าที่คลินิก / แจ้งขอยกเลิก',
    cancelled_at: new Date().toISOString()
  });

  closeCancelAppointmentModal();
  closeSheet();
  renderAppointmentsCalendar();

  // Check if any client is in waitlist for this released slot!
  const waitlistMatch = (state.appointment_waitlists || []).find(w =>
    w.status === 'WAITING' &&
    w.preferred_date === apt.scheduled_date &&
    (!w.preferred_doctor_id || w.preferred_doctor_id === apt.doctor_id)
  );

  if (waitlistMatch) {
    const waitlistPet = getPetById(waitlistMatch.pet_id);
    showToast(
      'ยกเลิกนัดและตรวจพบ Waitlist!',
      `ปล่อยสล็อตว่างเรียบร้อย และมี ${waitlistPet ? waitlistPet.pet_name : 'ลูกค้า'} รอคิวใน Waitlist สำหรับช่วงนี้`,
      'info'
    );
  } else {
    showToast('ยกเลิกนัดหมายสำเร็จ', `นัดหมาย #${apt.appointment_number} ถูกยกเลิกและปล่อยสล็อตคืนระบบแล้ว`, 'warning');
  }
}

function toggleAppointmentConfirmation(aptId, newStatus) {
  const apt = state.appointments.find(a => a.id === aptId);
  if (!apt) return;

  apt.confirmation_status = newStatus;
  openAppointmentDetailSheet(apt.id);
  renderAppointmentsCalendar();
  showToast('เปลี่ยนสถานะยืนยัน', `นัดหมาย #${apt.appointment_number} อัปเดตสถานะเป็น "${newStatus}"`, 'info');
}

function markAppointmentNoShow(aptId) {
  const apt = state.appointments.find(a => a.id === aptId);
  if (!apt) return;

  const reason = prompt('บันทึกรายละเอียดการติดต่อกรณีลูกค้าไม่มาตามนัด (No-show):', 'โทรติดต่อเจ้าของไม่รับสาย 2 ครั้ง');
  if (reason === null) return;

  apt.status = 'NO_SHOW';
  apt.no_show_notes = reason;

  openAppointmentDetailSheet(apt.id);
  renderAppointmentsCalendar();

  showToast('บันทึก No-show เรียบร้อย', `ทำเครื่องหมายนัดหมาย #${apt.appointment_number} เป็น No-Show`, 'warning');
}

// ==========================================
// 7. CHECK-IN TO ACTIVE QUEUE
// ==========================================
function checkInAppointment(aptId) {
  const apt = state.appointments.find(a => a.id === aptId);
  if (!apt) return;

  apt.status = 'CHECKED_IN';
  const pet = getPetById(apt.pet_id);
  const ticketNum = 'A0' + (state.queues.length + 1);

  const newQueueItem = {
    id: state.queues.length + 1,
    ticket_number: ticketNum,
    appointment_id: apt.id,
    customer_id: apt.customer_id,
    pet_id: apt.pet_id,
    registration_type: 'APPOINTMENT',
    chief_complaint: `${apt.appointment_type} (ตามเวลานัดหมาย ${apt.scheduled_time})`,
    triage_level: 'NORMAL',
    priority: 0,
    stage: 'WAITING',
    room_id: apt.room_id || 1,
    doctor_id: apt.doctor_id || 1,
    entered_at: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    wait_minutes: 0,
    call_count: 0,
    vitals: {
      temp: 38.5,
      heart_rate: 110,
      respiratory_rate: 24,
      mucous_membrane: 'ชมพู (Pink)',
      crt: '< 2.0 วินาที'
    }
  };

  state.queues.push(newQueueItem);

  // Record queue status history
  if (!state.queue_status_histories) state.queue_status_histories = [];
  state.queue_status_histories.push({
    id: state.queue_status_histories.length + 1,
    queue_ticket_id: newQueueItem.id,
    old_stage: 'CHECK_IN',
    new_stage: 'WAITING',
    changed_at: new Date().toISOString(),
    changed_by: 'เจ้าหน้าที่เวชระเบียน / เคาน์เตอร์ Check-in',
    reason: `Check-in จากนัดหมาย #${apt.appointment_number}`
  });

  // Central Event Bus Notification
  if (window.ClinicEventBus && window.CLINIC_EVENTS) {
    window.ClinicEventBus.emit(window.CLINIC_EVENTS.APPOINTMENT_CHECKED_IN, {
      appointment: apt,
      queueTicket: newQueueItem,
      pet: pet
    });
  }

  showToast(
    'Check-in สำเร็จ!',
    `ออกบัตรคิวตรวจ #${ticketNum} ให้ ${pet ? pet.pet_name : 'สัตว์ป่วย'} เรียบร้อยแล้ว`,
    'success'
  );

  renderCurrentView();
}

// ==========================================
// 8. PUBLIC QUEUE TV DISPLAY BOARD
// ==========================================
function openQueuePublicDisplay() {
  const modal = document.getElementById('modal-queue-tv-display');
  if (!modal) return;

  modal.classList.remove('hidden');
  renderQueuePublicDisplay();
  startTvClock();
}

function closeQueuePublicDisplay() {
  const modal = document.getElementById('modal-queue-tv-display');
  if (modal) modal.classList.add('hidden');
  if (window.tvClockInterval) clearInterval(window.tvClockInterval);
}

function startTvClock() {
  if (window.tvClockInterval) clearInterval(window.tvClockInterval);
  const clockEl = document.getElementById('tv-display-clock');
  const update = () => {
    if (clockEl) {
      const now = new Date();
      clockEl.innerText = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  };
  update();
  window.tvClockInterval = setInterval(update, 1000);
}

function renderQueuePublicDisplay() {
  const activeRoomsContainer = document.getElementById('tv-active-rooms-list');
  const waitingQueuesContainer = document.getElementById('tv-waiting-queues-list');
  if (!activeRoomsContainer || !waitingQueuesContainer) return;

  // Active rooms with currently in-service queue
  activeRoomsContainer.innerHTML = state.rooms.map(room => {
    const currentTicket = state.queues.find(q => q.room_id === room.id && q.stage === 'IN_SERVICE');
    const doctor = state.doctors.find(d => d.id === room.doctor_id);
    const pet = currentTicket ? getPetById(currentTicket.pet_id) : null;

    return `
      <div class="bg-slate-900 border-2 ${currentTicket ? 'border-teal-500 shadow-lg shadow-teal-500/10' : 'border-slate-800'} rounded-2xl p-5 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">${room.code}</span>
          <span class="text-[11px] font-bold px-2 py-0.5 rounded-full ${currentTicket ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'}">
            ${currentTicket ? '● กำลังตรวจ' : 'ว่างพร้อมให้บริการ'}
          </span>
        </div>
        <h3 class="text-base font-bold text-white mt-1">${room.name}</h3>
        <p class="text-xs text-slate-400 mt-0.5">${doctor ? doctor.name : 'แพทย์ประจำห้อง'}</p>

        <div class="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-400">หมายเลขคิวตรวจ</span>
            <div class="text-3xl font-black font-mono ${currentTicket ? 'text-teal-300' : 'text-slate-600'}">
              ${currentTicket ? currentTicket.ticket_number : '---'}
            </div>
          </div>
          <div class="text-right">
            <span class="text-[10px] uppercase font-bold text-slate-400">ชื่อสัตว์ป่วย</span>
            <div class="text-sm font-bold text-white truncate max-w-[130px]">
              ${pet ? pet.pet_name : '---'}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Next in line waiting queues
  const waitingList = state.queues
    .filter(q => q.stage === 'WAITING')
    .sort((a, b) => b.priority - a.priority || a.id - b.id);

  if (waitingList.length === 0) {
    waitingQueuesContainer.innerHTML = `
      <div class="py-12 text-center text-slate-500">
        <i data-lucide="check-circle" class="w-10 h-10 mx-auto mb-2 opacity-30"></i>
        <p class="text-sm">ไม่มีคิวที่รอตรวจในขณะนี้</p>
      </div>
    `;
  } else {
    waitingQueuesContainer.innerHTML = waitingList.map((q, idx) => {
      const pet = getPetById(q.pet_id);
      const isCritical = q.triage_level === 'CRITICAL';
      const isEmergency = q.triage_level === 'EMERGENCY';
      return `
        <div class="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition">
          <div class="flex items-center gap-3">
            <span class="text-xs font-mono font-bold text-slate-500 w-5">#${idx + 1}</span>
            <span class="text-lg font-mono font-black px-2.5 py-0.5 rounded-lg ${isCritical ? 'bg-purple-900 text-purple-200' : isEmergency ? 'bg-rose-900 text-rose-200' : 'bg-slate-800 text-teal-400'}">
              ${q.ticket_number}
            </span>
            <div>
              <h5 class="text-xs font-bold text-white">${pet ? pet.pet_name : 'สัตว์ไม่ระบุ'}</h5>
              <p class="text-[10px] text-slate-400 truncate max-w-[150px]">${q.chief_complaint}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded ${isCritical ? 'bg-purple-500/20 text-purple-300' : isEmergency ? 'bg-rose-500/20 text-rose-300' : 'bg-teal-500/20 text-teal-300'}">
              ${isCritical ? 'วิกฤต' : isEmergency ? 'ฉุกเฉิน' : 'คิวทั่วไป'}
            </span>
            <p class="text-[10px] text-slate-500 font-mono mt-0.5">${q.entered_at}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  lucide.createIcons();
}

// ==========================================
// 9. WAITLIST MANAGEMENT
// ==========================================
function openWaitlistSheet() {
  state.sheetMode = 'waitlist-list';
  openSheetContainer();

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  badge.innerText = 'WAITING LIST';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200';
  title.innerText = 'รายชื่อรอคิวการนัดหมาย (Waitlist)';
  subtitle.innerText = 'เคสที่รอสล็อตเวลาว่างหรือรอคิวแพทย์ผู้เชี่ยวชาญ';
  footer.classList.add('hidden');

  const waitlists = state.appointment_waitlists || [];

  body.innerHTML = `
    <div class="space-y-4">
      <div class="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-indigo-900">มีผู้รอคิวทั้งหมด ${waitlists.length} ราย</span>
          <p class="text-[11px] text-indigo-700 mt-0.5">ระบบจะแจ้งเตือนทันทีเมื่อมีนัดหมายถูกยกเลิก</p>
        </div>
        <button onclick="openNewWaitlistForm()" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer">
          + เพิ่มลง Waitlist
        </button>
      </div>

      <div class="space-y-3">
        ${waitlists.map(w => {
          const pet = getPetById(w.pet_id);
          const owner = getCustomerById(w.customer_id);
          const doctor = state.doctors.find(d => d.id === w.preferred_doctor_id);
          return `
            <div class="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-900">${pet ? pet.pet_name : '-'}</span>
                  <span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">เจ้าของ: ${owner ? owner.display_name : '-'}</span>
                </div>
                <span class="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">${w.status}</span>
              </div>
              <p class="text-xs text-slate-600"><strong>วันที่ต้องการ:</strong> ${formatDateThai(w.preferred_date)} (${w.preferred_time})</p>
              <p class="text-xs text-slate-600"><strong>แพทย์ที่ระบุ:</strong> ${doctor ? doctor.name : 'แพทย์ท่านใดก็ได้'}</p>
              <p class="text-xs text-slate-500 italic">"${w.notes || w.reason}"</p>
              <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[10px] text-slate-400">ลงชื่อเมื่อ: ${formatDateThai(w.created_at.split('T')[0])}</span>
                <button onclick="fillSlotFromWaitlist(${w.id})" class="text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 px-2.5 py-1 rounded transition cursor-pointer">
                  บรรจุเข้านัดหมายทันที
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  lucide.createIcons();
}

function fillSlotFromWaitlist(waitlistId) {
  const w = (state.appointment_waitlists || []).find(item => item.id === waitlistId);
  if (!w) return;

  const aptNum = `APT-2026-000${state.appointments.length + 1}`;
  state.appointments.push({
    id: state.appointments.length + 1,
    appointment_number: aptNum,
    customer_id: w.customer_id,
    pet_id: w.pet_id,
    appointment_type: 'นัดหมายจาก Waitlist: ' + w.reason,
    appointment_reason: w.reason,
    scheduled_date: w.preferred_date,
    scheduled_time: w.preferred_time,
    doctor_id: w.preferred_doctor_id || 1,
    room_id: 1,
    status: 'SCHEDULED',
    source_channel: 'Waitlist Fill',
    confirmation_status: 'CONFIRMED',
    created_at: new Date().toISOString()
  });

  // Update waitlist status
  w.status = 'FILLED';

  closeSheet();
  renderAppointmentsCalendar();

  showToast('บรรจุนัดหมายสำเร็จ!', `ดึงคิวของ ${getPetById(w.pet_id)?.pet_name} จาก Waitlist เข้านัดหมาย #${aptNum} เรียบร้อยแล้ว`, 'success');
}

function checkLiveBookingConflict() {
  const dateEl = document.getElementById('form-apt-date');
  const timeEl = document.getElementById('form-apt-time');
  const docEl = document.getElementById('form-apt-doctor');
  const alertEl = document.getElementById('apt-conflict-alert');
  if (!dateEl || !timeEl || !docEl || !alertEl) return;

  const conflict = checkAppointmentConflict(docEl.value, null, dateEl.value, timeEl.value);
  if (conflict.conflict) {
    alertEl.innerHTML = `⚠️ แพทย์มีนัดหมายซ้อนในช่วงเวลานี้ (${conflict.existingApt.appointment_number} - ${conflict.existingApt.appointment_type})`;
    alertEl.classList.remove('hidden');
  } else {
    alertEl.classList.add('hidden');
  }
}

function onServiceTypeChange(serviceName) {
  const service = (state.service_types || []).find(s => s.name === serviceName);
  if (service && service.default_room_id) {
    const roomEl = document.getElementById('form-apt-room');
    if (roomEl) roomEl.value = service.default_room_id;
  }
}

function openNewWaitlistForm() {
  const pet = state.pets[0];
  const petName = prompt('ระบุรหัสสัตว์เลี้ยง (Pet ID) ที่ต้องการลง Waitlist:', pet ? pet.id : '1');
  if (!petName) return;

  const targetPet = getPetById(Number(petName)) || state.pets[0];
  const owner = getPrimaryOwnerForPet(targetPet.id);
  const reason = prompt('ระบุเหตุผลหรือแพทย์ที่ต้องการ:', 'ต้องการตรวจโรคผิวหนังกับ สพ.ญ. ศศิธร (คิวเต็ม)');
  if (!reason) return;

  if (!state.appointment_waitlists) state.appointment_waitlists = [];
  state.appointment_waitlists.push({
    id: state.appointment_waitlists.length + 1,
    customer_id: owner ? owner.id : 1,
    pet_id: targetPet.id,
    preferred_date: state.selectedDate || '2026-03-02',
    preferred_time: '11:00 - 11:30',
    preferred_doctor_id: 2,
    reason: reason,
    status: 'WAITING',
    created_at: new Date().toISOString(),
    notes: 'บันทึกผ่านปุ่มลงชื่อ Waitlist ด่วน'
  });

  openWaitlistSheet();
  showToast('ลงชื่อใน Waitlist แล้ว', `เพิ่ม ${targetPet.pet_name} ในรายชื่อรอคิวเรียบร้อยแล้ว`, 'success');
}

