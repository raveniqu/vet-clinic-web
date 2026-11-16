/**
 * ============================================================================
 * DOMAIN 05: LABORATORY & DIAGNOSTIC IMAGING MANAGEMENT - ENGINE
 * ============================================================================
 * Architectural Alignment:
 * - docs/BusinessDomain/05.Laboratory_and_Diagnostic_Imaging_Management.md
 * - 20 Business Capabilities (3.1 - 3.20)
 * - Workflows 4.1 - 4.5 (Specimen Accessioning, Rejection, QC, Retest)
 * - Design Precautions 9.1 - 9.10 (Species Reference Ranges, Panic Values)
 * - Physical Database Design (Schema laboratory.* - 13 Tables)
 * ============================================================================
 */

// --- Helper Lookups ---
function getDiagnosticOrderById(id) {
  return state.diagnosticOrders.find(o => o.id === Number(id));
}

function getSpecimenById(id) {
  return state.specimens.find(s => s.id === Number(id));
}

function getLabResultsByOrderId(orderId) {
  return state.labResults.filter(r => r.order_id === Number(orderId));
}

function getImagingStudyByOrderId(orderId) {
  return state.imagingStudies.find(s => s.order_id === Number(orderId));
}

function getEquipmentById(id) {
  return state.laboratoryEquipment.find(e => e.id === Number(id));
}

function getPetDisplayName(pet) {
  if (!pet) return '-';
  return pet.pet_name || pet.name || 'ไม่ระบุชื่อ';
}

function getPetWeightDisplay(pet) {
  if (!pet) return '-';
  return pet.current_weight || pet.weight_kg || '-';
}

function getPetAgeDisplay(pet) {
  if (!pet) return '-';
  if (pet.age_years) return pet.age_years;
  if (pet.birth_date) {
    const years = new Date().getFullYear() - new Date(pet.birth_date).getFullYear();
    return Math.max(0, years);
  }
  return '-';
}

function getPetSpeciesCode(pet) {
  if (!pet) return 'DOG';
  const sp = (pet.species || '').toUpperCase();
  if (sp.includes('สุนัข') || sp.includes('DOG') || sp.includes('CANINE')) return 'DOG';
  if (sp.includes('แมว') || sp.includes('CAT') || sp.includes('FELINE')) return 'CAT';
  return 'DOG';
}

// --- Sub-Tab Navigation Controller ---
function switchLabSubTab(tabKey) {
  state.activeLabSubTab = tabKey;

  // Update Segmented Tab Buttons
  const tabs = ['orders', 'specimens', 'imaging', 'equipment_qc', 'trends'];
  tabs.forEach(t => {
    const btn = document.getElementById(`lab-tab-btn-${t}`);
    if (btn) {
      if (t === tabKey) {
        btn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-purple-900 shadow-xs border border-purple-200 transition cursor-pointer flex items-center gap-1.5';
      } else {
        btn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center gap-1.5';
      }
    }
  });

  renderLabSubTabContent();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function setLabSubFilter(filterType) {
  state.activeLabSubFilter = filterType;
  renderCurrentView();
}

// --- Main Sub-Tab Dispatcher ---
function renderLabSubTabContent() {
  const container = document.getElementById('lab-subtab-content');
  if (!container) return;

  if (state.activeLabSubTab === 'orders') {
    renderLabOrdersContainer();
  } else if (state.activeLabSubTab === 'specimens') {
    renderSpecimenAccessionWorkstation();
  } else if (state.activeLabSubTab === 'imaging') {
    renderImagingStudiesView();
  } else if (state.activeLabSubTab === 'equipment_qc') {
    renderEquipmentAndQcWorkstation();
  } else if (state.activeLabSubTab === 'trends') {
    renderLabLongitudinalTrends();
  }
}

// ============================================================================
// 1. ORDERS VIEW: DIAGNOSTIC QUEUE & CARD / LIST RENDERING
// ============================================================================
function renderLabOrdersContainer() {
  const container = document.getElementById('lab-subtab-content');
  if (!container) return;

  const searchQuery = (document.getElementById('top-search-input')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('view-filter-lab-status')?.value || 'all';

  let filtered = state.diagnosticOrders.filter(order => {
    const pet = getPetById(order.pet_id);
    const owner = getCustomerById(order.customer_id);
    const doctor = getDoctorById(order.doctor_id);

    const matchSearch =
      (getPetDisplayName(pet)).toLowerCase().includes(searchQuery) ||
      (owner?.display_name || '').toLowerCase().includes(searchQuery) ||
      (doctor?.name || '').toLowerCase().includes(searchQuery) ||
      order.order_number.toLowerCase().includes(searchQuery) ||
      order.items.some(it => it.name.toLowerCase().includes(searchQuery));

    const matchStatus = statusFilter === 'all' || order.status === statusFilter;

    let matchSubFilter = true;
    if (state.activeLabSubFilter === 'lab') {
      matchSubFilter = order.items.some(it => it.type === 'LAB');
    } else if (state.activeLabSubFilter === 'imaging') {
      matchSubFilter = order.items.some(it => it.type === 'IMAGING');
    }

    return matchSearch && matchStatus && matchSubFilter;
  });

  const badgeCount = document.getElementById('lab-order-count-badge');
  if (badgeCount) badgeCount.innerText = `${filtered.length} รายการ`;

  container.innerHTML = `
    <!-- Sub-Filter Pills for Lab vs Imaging -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <i data-lucide="filter" class="w-4 h-4 text-slate-400"></i>
        <span class="text-xs font-semibold text-slate-600">จำแนกตามประเภท:</span>
        <div class="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
          <button onclick="setLabSubFilter('all')" class="px-2.5 py-1 rounded-md ${state.activeLabSubFilter === 'all' ? 'bg-white text-purple-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'} cursor-pointer">ทั้งหมด</button>
          <button onclick="setLabSubFilter('lab')" class="px-2.5 py-1 rounded-md ${state.activeLabSubFilter === 'lab' ? 'bg-white text-purple-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'} cursor-pointer flex items-center gap-1">🧪 ตรวจแล็บ/เลือด</button>
          <button onclick="setLabSubFilter('imaging')" class="px-2.5 py-1 rounded-md ${state.activeLabSubFilter === 'imaging' ? 'bg-white text-purple-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'} cursor-pointer flex items-center gap-1">🩻 ภาพถ่าย X-Ray/US</button>
        </div>
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-500"></span> STAT ด่วนวิกฤต</span>
        <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500"></span> รอตรวจรับรอง</span>
        <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> รับรองผลแล้ว</span>
      </div>
    </div>

    <!-- Container for Card View or List View -->
    <div id="lab-card-grid" class="${state.viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2' : 'hidden'}"></div>
    <div id="lab-list-table" class="${state.viewMode === 'list' ? 'bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs pt-0 mt-2' : 'hidden'}"></div>
  `;

  if (state.viewMode === 'card') {
    renderLabCardView(filtered);
  } else {
    renderLabListView(filtered);
  }
}

function renderLabCardView(orders) {
  const container = document.getElementById('lab-card-grid');
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
        <i data-lucide="flask-conical" class="w-10 h-10 mx-auto text-slate-300 mb-2"></i>
        <h4 class="text-sm font-bold text-slate-700">ไม่พบคำสั่งตรวจในเงื่อนไขที่เลือก</h4>
        <p class="text-xs text-slate-400 mt-1">สามารถกดปุ่ม "+ สั่งตรวจแล็บ/รังสีด่วน" ด้านบน เพื่อสร้างใบส่งตรวจใหม่</p>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  container.innerHTML = orders.map(order => {
    const pet = getPetById(order.pet_id);
    const owner = getCustomerById(order.customer_id);
    const doctor = getDoctorById(order.doctor_id);
    const isStat = order.urgency === 'STAT';
    const orderSpecimens = (order.specimen_ids || []).map(id => getSpecimenById(id)).filter(Boolean);
    const hasImaging = order.items.some(it => it.type === 'IMAGING');

    let statusBadge = '';
    if (order.status === 'VERIFIED') {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"><i data-lucide="check-check" class="w-3.5 h-3.5"></i>รับรองผลแล้ว</span>';
    } else if (order.status === 'PENDING_VERIFY') {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"><i data-lucide="clock" class="w-3.5 h-3.5"></i>รอตรวจรับรอง</span>';
    } else if (order.status === 'SPECIMEN_REJECTED') {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300"><i data-lucide="alert-octagon" class="w-3.5 h-3.5"></i>สิ่งส่งตรวจถูกปฏิเสธ</span>';
    } else {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300"><i data-lucide="flask-conical" class="w-3.5 h-3.5"></i>กำลังตรวจวิเคราะห์</span>';
    }

    return `
      <div class="bg-white rounded-2xl border ${isStat ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200'} p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between relative overflow-hidden">
        ${isStat ? '<div class="absolute top-0 right-0 w-16 h-16 pointer-events-none"><div class="bg-rose-600 text-white font-bold text-[9px] uppercase tracking-wider py-1 text-center transform rotate-45 translate-x-4 translate-y-1 shadow-sm">STAT</div></div>' : ''}

        <div>
          <!-- Header: Order Code & Urgency -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span class="font-mono text-xs font-bold text-slate-900">${order.order_number}</span>
              <div class="text-[10px] text-slate-400 mt-0.5">${order.order_date}</div>
            </div>
            ${statusBadge}
          </div>

          <!-- Patient & Owner Info -->
          <div class="mt-3.5 flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl ${getPetSpeciesCode(pet) === 'DOG' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-purple-50 border-purple-200 text-purple-700'} border flex items-center justify-center shrink-0 overflow-hidden text-2xl shadow-xs">
              ${getPetSpeciesCode(pet) === 'DOG' ? '🐶' : (getPetSpeciesCode(pet) === 'CAT' ? '🐱' : '🐾')}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <h4 class="font-bold text-sm text-slate-900 truncate">${getPetDisplayName(pet)}</h4>
                <span class="text-[10px] px-1.5 py-0.2 rounded font-bold ${getPetSpeciesCode(pet) === 'DOG' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'}">${pet ? (pet.species || getPetSpeciesCode(pet)) : ''}</span>
                <span class="text-[11px] text-slate-500 font-normal truncate">(${pet ? pet.breed : ''})</span>
              </div>
              <p class="text-xs text-slate-600 truncate mt-0.5 flex items-center gap-1">
                <i data-lucide="user" class="w-3 h-3 text-slate-400"></i>
                <span>${owner ? owner.display_name : '-'}</span>
                <span class="text-slate-300">•</span>
                <span class="text-slate-500 font-mono text-[11px]">${owner ? owner.phone_primary : ''}</span>
              </p>
              <p class="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                <i data-lucide="stethoscope" class="w-3 h-3 text-purple-500"></i>
                <span>แพทย์ผู้ส่งตรวจ: <strong>${doctor ? doctor.name : 'น.สพ. วุฒิชัย'}</strong></span>
              </p>
            </div>
          </div>

          <!-- Clinical Indication Note -->
          <div class="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">ข้อบ่งชี้ทางคลินิก (Indication)</span>
            <p class="italic text-slate-800 line-clamp-2">"${order.clinical_indication}"</p>
          </div>

          <!-- Ordered Tests Tag Pills -->
          <div class="mt-3 space-y-1.5">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">รายการส่งตรวจ (${order.items.length} รายการ)</span>
            <div class="flex flex-wrap gap-1.5">
              ${order.items.map(it => `
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${it.type === 'LAB' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}">
                  <i data-lucide="${it.type === 'LAB' ? 'flask-conical' : 'scan'}" class="w-3 h-3"></i>
                  <span>${it.name}</span>
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Specimen Tracking Timeline Pill -->
          ${orderSpecimens.length > 0 ? `
            <div class="mt-3 p-2 rounded-xl ${orderSpecimens.some(s => s.status === 'REJECTED') ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-purple-50/50 border-purple-100 text-purple-900'} border flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full ${orderSpecimens.some(s => s.status === 'REJECTED') ? 'bg-rose-600' : 'bg-purple-600 animate-ping'}"></span>
                <span class="text-[11px]">สิ่งส่งตรวจ: <strong>${orderSpecimens.map(s => s.type).join(', ')}</strong></span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded ${orderSpecimens.some(s => s.status === 'REJECTED') ? 'bg-rose-200 text-rose-900' : 'bg-purple-200 text-purple-800'}">${orderSpecimens[0].status}</span>
            </div>
          ` : ''}

          <!-- Critical Flag Notice (Rule 9.4 & 3.10) -->
          ${order.has_critical_flag && order.status !== 'VERIFIED' ? `
            <div class="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-2 text-xs text-rose-800 font-semibold shadow-xs">
              <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-600 shrink-0 mt-0.5 animate-bounce"></i>
              <div>
                <span class="font-bold text-rose-900 block">🚨 พบค่าวิกฤติต่อชีวิต (Panic Value Alert):</span>
                <span class="text-[11px] font-mono text-rose-700">${order.critical_details || 'ค่าผลตรวจออกนอกช่วงวิกฤติ'}</span>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Action Buttons -->
        <div class="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          ${hasImaging ? `
            <button onclick="openXrayViewerModal(${order.id})" class="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer">
              <i data-lucide="scan" class="w-3.5 h-3.5"></i>
              <span>🩻 ดูฟิล์ม X-Ray</span>
            </button>
          ` : ''}

          ${order.status === 'SPECIMEN_REJECTED' ? `
            <button onclick="openRetestOrderModal(${order.id})" class="flex-1 flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer">
              <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
              <span>เจาะเลือดใหม่ (Redraw)</span>
            </button>
          ` : `
            <button onclick="openLabResultSheet(${order.id})" class="flex-1 flex items-center justify-center gap-1.5 ${order.status === 'VERIFIED' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-purple-600 hover:bg-purple-700 text-white'} px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer">
              <i data-lucide="${order.status === 'VERIFIED' ? 'file-text' : 'check-circle'}" class="w-3.5 h-3.5"></i>
              <span>${order.status === 'VERIFIED' ? 'ดูผลการตรวจ' : 'ดูผล & รับรอง'}</span>
            </button>
          `}
        </div>

      </div>
    `;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderLabListView(orders) {
  const container = document.getElementById('lab-list-table');
  if (!container) return;

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-600">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
          <tr>
            <th class="px-4 py-3">รหัสคำสั่ง / วันที่</th>
            <th class="px-4 py-3">สัตว์เลี้ยง / เจ้าของ</th>
            <th class="px-4 py-3">รายการตรวจที่สั่ง</th>
            <th class="px-4 py-3">สิ่งส่งตรวจ (Specimen)</th>
            <th class="px-4 py-3">ความเร่งด่วน</th>
            <th class="px-4 py-3">สถานะ</th>
            <th class="px-4 py-3 text-right">การจัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${orders.map(order => {
            const pet = getPetById(order.pet_id);
            const owner = getCustomerById(order.customer_id);
            const isStat = order.urgency === 'STAT';
            const orderSpecimens = (order.specimen_ids || []).map(id => getSpecimenById(id)).filter(Boolean);
            const hasImaging = order.items.some(it => it.type === 'IMAGING');

            let statusPill = '';
            if (order.status === 'VERIFIED') {
              statusPill = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">รับรองผลแล้ว</span>';
            } else if (order.status === 'PENDING_VERIFY') {
              statusPill = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">รอตรวจรับรอง</span>';
            } else if (order.status === 'SPECIMEN_REJECTED') {
              statusPill = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">สิ่งส่งตรวจมีปัญหา</span>';
            } else {
              statusPill = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">กำลังตรวจ</span>';
            }

            return `
              <tr class="hover:bg-slate-50/80 transition ${order.has_critical_flag && order.status !== 'VERIFIED' ? 'bg-rose-50/40' : ''}">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="font-mono font-bold text-slate-900">${order.order_number}</div>
                  <div class="text-[11px] text-slate-400">${order.order_date}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span>${getPetDisplayName(pet)}</span>
                    <span class="text-[10px] px-1 py-0.2 rounded font-bold ${getPetSpeciesCode(pet) === 'DOG' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'}">${pet ? (pet.species || getPetSpeciesCode(pet)) : ''}</span>
                    <span class="text-[10px] font-normal text-slate-400">(${pet ? pet.breed : ''})</span>
                  </div>
                  <div class="text-[11px] text-slate-500">${owner ? owner.display_name : '-'} • ${owner ? owner.phone_primary : ''}</div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1 max-w-xs">
                    ${order.items.map(it => `
                      <span class="px-1.5 py-0.5 rounded text-[10px] font-medium ${it.type === 'LAB' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}">
                        ${it.name}
                      </span>
                    `).join('')}
                  </div>
                </td>
                <td class="px-4 py-3 text-[11px] whitespace-nowrap">
                  ${orderSpecimens.length > 0 ? `
                    <div class="font-medium text-slate-700">${orderSpecimens.map(s => s.type).join(', ')}</div>
                    <div class="text-[10px] ${orderSpecimens[0].status === 'REJECTED' ? 'text-rose-600 font-bold' : 'text-purple-600'} font-mono">${orderSpecimens[0].status}</div>
                  ` : '<span class="text-slate-400">-</span>'}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  ${isStat ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white animate-pulse">STAT</span>' : '<span class="px-2 py-0.5 rounded text-[10px] text-slate-500 bg-slate-100">Routine</span>'}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  ${statusPill}
                  ${order.has_critical_flag && order.status !== 'VERIFIED' ? '<span class="ml-1 text-[10px] font-bold text-rose-600">🔴 Panic</span>' : ''}
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap space-x-1">
                  ${hasImaging ? `
                    <button onclick="openXrayViewerModal(${order.id})" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-purple-300 hover:text-white transition cursor-pointer" title="เปิดดูฟิล์ม X-Ray">
                      🩻 X-Ray
                    </button>
                  ` : ''}
                  <button onclick="openLabResultSheet(${order.id})" class="px-3 py-1.5 rounded-lg text-xs font-bold ${order.status === 'VERIFIED' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-purple-600 text-white hover:bg-purple-700'} transition cursor-pointer">
                    ${order.status === 'VERIFIED' ? 'ดูผล' : 'บันทึก & รับรอง'}
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ============================================================================
// 2. SPECIMEN ACCESSIONING & REJECTION WORKSTATION (Capabilities 3.4 - 3.6, Workflow 4.3)
// ============================================================================
function renderSpecimenAccessionWorkstation() {
  const container = document.getElementById('lab-subtab-content');
  if (!container) return;

  const totalSpecimens = state.specimens.length;
  const receivedCount = state.specimens.filter(s => s.accession_status === 'RECEIVED').length;
  const rejectedCount = state.specimens.filter(s => s.accession_status === 'REJECTED').length;
  const processingCount = state.specimens.filter(s => s.status === 'PROCESSING').length;

  container.innerHTML = `
    <!-- Top Metric Cards for Specimen Station -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-purple-50/60 border border-purple-200 rounded-xl p-3 flex items-center justify-between">
        <div>
          <span class="text-[11px] font-semibold text-purple-800">สิ่งส่งตรวจทั้งหมด</span>
          <h4 class="text-xl font-bold text-purple-900 mt-0.5">${totalSpecimens} หลอด/สไลด์</h4>
        </div>
        <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">🧪</div>
      </div>
      <div class="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
        <div>
          <span class="text-[11px] font-semibold text-emerald-800">ตรวจรับผ่านเกณฑ์ (Accepted)</span>
          <h4 class="text-xl font-bold text-emerald-900 mt-0.5">${receivedCount} ชิ้น</h4>
        </div>
        <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold"><i data-lucide="check" class="w-4 h-4"></i></div>
      </div>
      <div class="bg-rose-50/60 border border-rose-200 rounded-xl p-3 flex items-center justify-between">
        <div>
          <span class="text-[11px] font-semibold text-rose-800">ปฏิเสธตัวอย่าง (Rejected)</span>
          <h4 class="text-xl font-bold text-rose-900 mt-0.5">${rejectedCount} ชิ้น</h4>
        </div>
        <div class="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold"><i data-lucide="x-circle" class="w-4 h-4"></i></div>
      </div>
      <div class="bg-blue-50/60 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
        <div>
          <span class="text-[11px] font-semibold text-blue-800">อยู่ระหว่างวิเคราะห์</span>
          <h4 class="text-xl font-bold text-blue-900 mt-0.5">${processingCount} ชิ้น</h4>
        </div>
        <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold"><i data-lucide="hourglass" class="w-4 h-4"></i></div>
      </div>
    </div>

    <!-- Quality Standards Guideline Banner (Rule 9.2: Clotted / Hemolysis / Lipemia) -->
    <div class="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
      <i data-lucide="shield-alert" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
      <div>
        <span class="font-bold">เกณฑ์มาตรฐานการตรวจสอบคุณภาพสิ่งส่งตรวจ (Specimen Quality Acceptance Criteria):</span>
        <p class="text-[11px] text-amber-800 mt-0.5">ปฏิเสธสิ่งส่งตรวจทันทีหากพบ: <strong>1) ลิ่มเลือด (Clotted)</strong> ในหลอด EDTA, <strong>2) เม็ดเลือดแดงแตก (Hemolysis Grade 3+-4+)</strong> รบกวนค่าเคมีคลินิก, <strong>3) ไขมันสูงขุ่น (Lipemia)</strong>, หรือ <strong>4) ปริมาตรเลือดไม่เพียงพอ (QNS < 0.5 mL)</strong></p>
      </div>
    </div>

    <!-- Specimen Accession Registry Table -->
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <div class="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i data-lucide="list-checks" class="w-4 h-4 text-purple-600"></i>
          <h4 class="font-bold text-xs text-slate-800">ทะเบียนและสถานะสิ่งส่งตรวจ (Specimen Accessioning & Chain of Custody)</h4>
        </div>
        <span class="text-[10px] text-slate-400 font-mono">Real-time Specimen Tracking</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-600">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
            <tr>
              <th class="px-4 py-3">รหัสสิ่งส่งตรวจ (Barcode)</th>
              <th class="px-4 py-3">คำสั่งตรวจ / สัตว์ป่วย</th>
              <th class="px-4 py-3">ชนิดหลอด / ปริมาตร</th>
              <th class="px-4 py-3">การตรวจสอบคุณภาพ (Quality Inspection)</th>
              <th class="px-4 py-3">ผู้เจาะ / เวลาที่เก็บ</th>
              <th class="px-4 py-3">สถานะตรวจรับ</th>
              <th class="px-4 py-3 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${state.specimens.map(sp => {
              const order = getDiagnosticOrderById(sp.order_id);
              const pet = order ? getPetById(order.pet_id) : (sp.pet_id ? getPetById(sp.pet_id) : null);

              let accessionBadge = '';
              if (sp.accession_status === 'REJECTED') {
                accessionBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">ปฏิเสธตัวอย่าง</span>';
              } else if (sp.accession_status === 'RECEIVED') {
                accessionBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">ตรวจรับแล้ว</span>';
              } else {
                accessionBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">รอตรวจรับ</span>';
              }

              return `
                <tr class="hover:bg-slate-50/80 transition ${sp.accession_status === 'REJECTED' ? 'bg-rose-50/30' : ''}">
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="font-mono font-bold text-purple-700 flex items-center gap-1">
                      <i data-lucide="barcode" class="w-3.5 h-3.5 text-purple-500"></i>
                      <span>${sp.specimen_number}</span>
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono mt-0.5">ID: ${sp.id}</div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="font-bold text-slate-800">${getPetDisplayName(pet)} <span class="text-[10px] font-normal text-slate-500">(${pet ? pet.species : ''})</span></div>
                    <div class="text-[10px] text-purple-600 font-mono">${order ? order.order_number : '-'}</div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="font-semibold text-slate-700">${sp.type}</div>
                    <div class="text-[10px] text-slate-400">ปริมาตร: ${sp.volume}</div>
                  </td>
                  <td class="px-4 py-3 text-[11px]">
                    ${sp.accession_status === 'REJECTED' ? `
                      <span class="text-rose-700 font-bold block">❌ พบความบกพร่อง</span>
                      <span class="text-[10px] text-rose-600 font-normal line-clamp-1" title="${sp.rejection_reason}">${sp.rejection_reason}</span>
                    ` : `
                      <span class="text-emerald-700 font-semibold block">✓ ผ่านเกณฑ์มาตรฐาน</span>
                      <span class="text-[10px] text-slate-400">Hemolysis: ${sp.quality_inspection?.hemolyzed_grade || '0'} | Clot: ไม่พบ</span>
                    `}
                  </td>
                  <td class="px-4 py-3 text-[11px] whitespace-nowrap">
                    <div class="text-slate-700">${sp.collector}</div>
                    <div class="text-[10px] text-slate-400">${sp.collection_time}</div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    ${accessionBadge}
                  </td>
                  <td class="px-4 py-3 text-right whitespace-nowrap space-x-1">
                    <button onclick="printSpecimenBarcode(${sp.id})" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer" title="พิมพ์บาร์โค้ดติดหลอด">
                      <i data-lucide="printer" class="w-3.5 h-3.5 inline"></i>
                    </button>
                    ${sp.accession_status !== 'REJECTED' ? `
                      <button onclick="openSpecimenRejectModal(${sp.id})" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer">
                        ปฏิเสธตัวอย่าง
                      </button>
                      ${sp.accession_status !== 'RECEIVED' ? `
                        <button onclick="acceptSpecimen(${sp.id})" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer">
                          ตรวจรับ
                        </button>
                      ` : ''}
                    ` : `
                      <button onclick="openRetestOrderModal(${sp.order_id})" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer">
                        แจ้งเจาะซ้ำ (Redraw)
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
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function acceptSpecimen(specimenId) {
  const sp = getSpecimenById(specimenId);
  if (!sp) return;

  sp.accession_status = 'RECEIVED';
  sp.status = 'PROCESSING';

  state.specimenEvents.push({
    id: state.specimenEvents.length + 1,
    specimen_id: sp.id,
    event_type: 'RECEIVED',
    event_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    performed_by: 'ทนพ. เอกชัย ภูมิใจ',
    notes: 'ตรวจรับสิ่งส่งตรวจผ่านเกณฑ์มาตรฐานเรียบร้อย พร้อมนำเข้าเครื่องวิเคราะห์'
  });

  const order = getDiagnosticOrderById(sp.order_id);
  if (order && order.status === 'SPECIMEN_REJECTED') {
    order.status = 'PROCESSING';
  }

  showToast('ตรวจรับสิ่งส่งตรวจสำเร็จ', `รหัสตัวอย่าง ${sp.specimen_number} ผ่านเกณฑ์และนำส่งเข้าเครื่องวิเคราะห์แล้ว`, 'success');
  renderLabSubTabContent();
}

function openSpecimenRejectModal(specimenId) {
  const sp = getSpecimenById(specimenId);
  if (!sp) return;

  const modal = document.getElementById('modal-specimen-accession');
  if (!modal) return;

  const order = getDiagnosticOrderById(sp.order_id);
  const pet = order ? getPetById(order.pet_id) : null;

  document.getElementById('reject-specimen-id').value = sp.id;
  document.getElementById('reject-specimen-badge').innerText = sp.specimen_number;
  document.getElementById('reject-specimen-pet').innerText = `สัตว์ป่วย: ${getPetDisplayName(pet)} (${sp.type})`;

  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeSpecimenRejectModal() {
  const modal = document.getElementById('modal-specimen-accession');
  if (modal) modal.classList.add('hidden');
}

function confirmSpecimenRejection(e) {
  e.preventDefault();

  const specimenId = Number(document.getElementById('reject-specimen-id').value);
  const reasonCode = document.getElementById('reject-reason-code').value;
  const customNotes = document.getElementById('reject-custom-notes').value.trim();
  const needRedraw = document.getElementById('reject-redraw-flag').checked;

  const sp = getSpecimenById(specimenId);
  if (!sp) return;

  const fullReason = `${reasonCode}: ${customNotes || 'สิ่งส่งตรวจไม่ผ่านมาตรฐานคุณภาพห้องปฏิบัติการ'}`;
  sp.accession_status = 'REJECTED';
  sp.status = 'REJECTED';
  sp.rejection_reason = fullReason;

  // Log Specimen Audit Event
  state.specimenEvents.push({
    id: state.specimenEvents.length + 1,
    specimen_id: sp.id,
    event_type: 'REJECTED',
    event_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    performed_by: 'ทนพ. เอกชัย ภูมิใจ',
    notes: fullReason + (needRedraw ? ' [แจ้งเจาะเก็บซ้ำด่วน]' : '')
  });

  // Update order status
  const order = getDiagnosticOrderById(sp.order_id);
  if (order) {
    order.status = 'SPECIMEN_REJECTED';
    order.critical_details = `สิ่งส่งตรวจถูกปฏิเสธ: ${reasonCode}`;
  }

  closeSpecimenRejectModal();
  showToast('ปฏิเสธสิ่งส่งตรวจ', `บันทึกการปฏิเสธ ${sp.specimen_number} เรียบร้อย ${needRedraw ? 'และส่งแจ้งเตือนเจาะเลือดซ้ำ' : ''}`, 'warning');
  renderLabSubTabContent();
  renderCurrentView();
}

function printSpecimenBarcode(specimenId) {
  const sp = getSpecimenById(specimenId);
  showToast('พิมพ์บาร์โค้ดสิ่งส่งตรวจ', `ส่งพิมพ์สติกเกอร์บาร์โค้ด ${sp ? sp.specimen_number : ''} สำหรับติดหลอดเก็บตัวอย่างเรียบร้อย`, 'success');
}

// ============================================================================
// 3. IMAGING STUDIES VIEW: PACS & RADIOGRAPHY (Capabilities 3.14 - 3.17)
// ============================================================================
function renderImagingStudiesView() {
  const container = document.getElementById('lab-subtab-content');
  if (!container) return;

  container.innerHTML = `
    <!-- Diagnostic Imaging Header Banner -->
    <div class="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl font-bold shrink-0">
          🩻
        </div>
        <div>
          <h4 class="font-bold text-sm text-white">ศูนย์รังสีวินิจฉัยและภาพถ่ายทางการแพทย์ (PACS / Diagnostic Imaging)</h4>
          <p class="text-xs text-slate-400 mt-0.5">ระบบจัดเก็บและเรียกดูภาพถ่ายรังสีดิจิทัล (DR) และคลื่นเสียงความถี่สูง (Ultrasound) พร้อมรายงานรังสีแพทย์</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-purple-900 text-purple-300 border border-purple-700">
          ${state.imagingStudies.length} การศึกษาภาพถ่ายรังสี
        </span>
      </div>
    </div>

    <!-- Imaging Studies Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${state.imagingStudies.map(study => {
        const order = getDiagnosticOrderById(study.order_id);
        const pet = getPetById(study.pet_id);
        const doctor = order ? getDoctorById(order.doctor_id) : null;

        return `
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <!-- Header -->
              <div class="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="font-mono text-xs font-bold text-purple-700">${study.study_number}</span>
                    <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">${study.modality}</span>
                  </div>
                  <h5 class="font-bold text-xs text-slate-900 mt-0.5">${study.study_type}</h5>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">VERIFIED</span>
              </div>

              <!-- Image Previews (VD & Lateral) -->
              <div class="p-3.5 space-y-3">
                <div class="grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded-xl">
                  <div class="space-y-1 text-center cursor-pointer group" onclick="openXrayViewerModal(${study.order_id})">
                    <div class="h-28 rounded-lg overflow-hidden border border-slate-800 bg-black flex items-center justify-center relative">
                      <img src="${study.views.vd.image_url}" alt="VD View" class="h-full w-full object-cover group-hover:scale-105 transition" />
                      <span class="absolute bottom-1 left-1 text-[9px] bg-black/70 text-purple-300 px-1.5 py-0.5 rounded font-mono">VD View</span>
                    </div>
                    <span class="text-[10px] text-slate-400 font-mono">${study.views.vd.exposure.split('|')[0]}</span>
                  </div>
                  <div class="space-y-1 text-center cursor-pointer group" onclick="openXrayViewerModal(${study.order_id})">
                    <div class="h-28 rounded-lg overflow-hidden border border-slate-800 bg-black flex items-center justify-center relative">
                      <img src="${study.views.lateral.image_url}" alt="Lateral View" class="h-full w-full object-cover group-hover:scale-105 transition" />
                      <span class="absolute bottom-1 left-1 text-[9px] bg-black/70 text-purple-300 px-1.5 py-0.5 rounded font-mono">Lateral View</span>
                    </div>
                    <span class="text-[10px] text-slate-400 font-mono">${study.views.lateral.exposure.split('|')[0]}</span>
                  </div>
                </div>

                <!-- Patient & Equipment Info -->
                <div class="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <div>
                    <span>สัตว์ป่วย: <strong>${getPetDisplayName(pet)}</strong> (${pet ? pet.species : ''})</span>
                    <span class="text-slate-300 mx-1">•</span>
                    <span class="text-slate-500">${study.performed_at}</span>
                  </div>
                  <span class="text-[10px] font-mono text-slate-400">${study.equipment}</span>
                </div>

                <!-- Findings Summary -->
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span class="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">ผลการอ่านฟิล์มรังสี (Radiological Impression)</span>
                  <p class="text-slate-800 italic line-clamp-2">${study.impression}</p>
                </div>
              </div>
            </div>

            <!-- Footer Action -->
            <div class="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span class="text-[11px] text-slate-500">รังสีแพทย์: <strong>${study.radiologist}</strong></span>
              <button onclick="openXrayViewerModal(${study.order_id})" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white flex items-center gap-1.5 transition shadow-xs cursor-pointer">
                <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
                <span>เปิดโปรแกรมดูฟิล์ม DICOM</span>
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ============================================================================
// 4. EQUIPMENT & QUALITY CONTROL (QC) WORKSTATION (Capabilities 3.12, 3.13)
// ============================================================================
function renderEquipmentAndQcWorkstation() {
  const container = document.getElementById('lab-subtab-content');
  if (!container) return;

  const totalEquipment = state.laboratoryEquipment.length;
  const operationalCount = state.laboratoryEquipment.filter(e => e.status === 'OPERATIONAL').length;

  container.innerHTML = `
    <!-- Equipment & QC Metrics -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
      <div>
        <h4 class="text-sm font-bold text-slate-800">การควบคุมคุณภาพเครื่องมือและผลทดสอบประจำวัน (QC & Calibration Control)</h4>
        <p class="text-xs text-slate-500">ติดตามสถานะความเที่ยงตรงของเครื่องตรวจวิเคราะห์อัตโนมัติ และประวัติผล QC ตามมาตรฐานสากล</p>
      </div>
      <button onclick="openNewQcRunModal()" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 transition shadow-xs cursor-pointer self-start sm:self-auto">
        <i data-lucide="plus-circle" class="w-4 h-4"></i>
        <span>+ บันทึกผลทดสอบ QC ประจำวัน</span>
      </button>
    </div>

    <!-- Equipment Master Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      ${state.laboratoryEquipment.map(eq => `
        <div class="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
              <span class="font-mono text-xs font-bold text-purple-700">${eq.code}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold ${eq.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800'}">${eq.status}</span>
            </div>
            <h5 class="font-bold text-xs text-slate-900 mt-2">${eq.name}</h5>
            <p class="text-[11px] text-slate-500">${eq.equipment_type}</p>
            <div class="mt-2 text-[10px] font-mono text-slate-400">S/N: ${eq.serial_number} • ${eq.manufacturer}</div>
          </div>

          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-slate-500">สถานะ QC วันนี้:</span>
              <span class="font-bold ${eq.daily_qc_status === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}">✓ ${eq.daily_qc_status} (ผ่านเกณฑ์)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">สอบเทียบล่าสุด:</span>
              <span class="text-slate-800 font-mono">${eq.last_calibrated_at}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">ครบกำหนดถัดไป:</span>
              <span class="text-purple-700 font-mono font-semibold">${eq.next_calibration_due}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Daily QC Audit Trail Log Table (Table: laboratory.quality_control_records) -->
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs mt-2">
      <div class="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i data-lucide="clipboard-check" class="w-4 h-4 text-emerald-600"></i>
          <h4 class="font-bold text-xs text-slate-800">ประวัติการบันทึกการควบคุมคุณภาพ (Quality Control Log History)</h4>
        </div>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">Levey-Jennings Compliant</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-600">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
            <tr>
              <th class="px-4 py-3">วัน-เวลาตรวจสอบ</th>
              <th class="px-4 py-3">รหัสเครื่องมือ</th>
              <th class="px-4 py-3">ชนิดของน้ำยาควบคุม (Control Type / Lot)</th>
              <th class="px-4 py-3">ค่าที่อ่านได้ (Measured Value)</th>
              <th class="px-4 py-3">ช่วงค่ามาตรฐาน (Expected Target)</th>
              <th class="px-4 py-3 text-center">สถานะ</th>
              <th class="px-4 py-3">ผู้ตรวจสอบ & หมายเหตุ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${state.qualityControlRecords.map(qc => `
              <tr class="hover:bg-slate-50/80 transition">
                <td class="px-4 py-3 font-mono text-[11px] whitespace-nowrap text-slate-800 font-semibold">${qc.checked_at}</td>
                <td class="px-4 py-3 font-mono text-[11px] whitespace-nowrap text-purple-700 font-bold">${qc.equipment_code}</td>
                <td class="px-4 py-3">
                  <div class="font-semibold text-slate-800">${qc.control_type}</div>
                  <div class="text-[10px] text-slate-400 font-mono">Lot: ${qc.lot_number}</div>
                </td>
                <td class="px-4 py-3 font-mono text-[11px] text-slate-900 font-bold">${qc.measured_value}</td>
                <td class="px-4 py-3 font-mono text-[11px] text-slate-500">${qc.expected_value}</td>
                <td class="px-4 py-3 text-center whitespace-nowrap">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${qc.result_status === 'PASS' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}">
                    ${qc.result_status}
                  </span>
                </td>
                <td class="px-4 py-3 text-[11px]">
                  <div class="text-slate-700">${qc.checked_by}</div>
                  <div class="text-[10px] text-slate-400">${qc.notes}</div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openNewQcRunModal() {
  const modal = document.getElementById('modal-qc-run');
  if (modal) modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeNewQcRunModal() {
  const modal = document.getElementById('modal-qc-run');
  if (modal) modal.classList.add('hidden');
}

function submitNewQcRun(e) {
  e.preventDefault();

  const eqId = Number(document.getElementById('qc-equipment-id').value);
  const eq = getEquipmentById(eqId);
  const controlType = document.getElementById('qc-control-type').value.trim();
  const lot = document.getElementById('qc-lot-number').value.trim();
  const measured = document.getElementById('qc-measured-val').value.trim();
  const expected = document.getElementById('qc-expected-val').value.trim();
  const status = document.getElementById('qc-status-val').value;
  const notes = document.getElementById('qc-notes-val').value.trim();

  const newQc = {
    id: state.qualityControlRecords.length + 1,
    equipment_id: eqId,
    equipment_code: eq ? eq.code : 'EQ-GEN',
    control_type: controlType,
    lot_number: lot || 'LOT-QC-MANUAL',
    measured_value: measured,
    expected_value: expected,
    result_status: status,
    checked_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    checked_by: 'ทนพ. เอกชัย ภูมิใจ (ทนพ. 4521)',
    notes: notes || 'บันทึกการตรวจสอบคุณภาพตามรอบปกติ'
  };

  state.qualityControlRecords.unshift(newQc);
  if (eq) eq.daily_qc_status = status;

  closeNewQcRunModal();
  showToast('บันทึกผล QC สำเร็จ', `บันทึกผลทดสอบการควบคุมคุณภาพสำหรับ ${eq ? eq.name : ''} เรียบร้อยแล้ว`, 'success');
  renderLabSubTabContent();
}

// ============================================================================
// 5. LONGITUDINAL LAB TRENDS (Capability 3.18: Diagnostic History Management)
// ============================================================================
function renderLabLongitudinalTrends() {
  const container = document.getElementById('lab-subtab-content');
  if (!container) return;

  const currentPetId = state.activeTrendPetId || 1;
  const pet = getPetById(currentPetId);
  const owner = getPrimaryOwnerForPet(currentPetId);
  const trendHistory = state.longitudinalLabHistory.find(h => h.pet_id === currentPetId) || state.longitudinalLabHistory[0];

  container.innerHTML = `
    <!-- Top Filter & Patient Switcher -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <i data-lucide="trending-up" class="w-4 h-4 text-purple-600"></i>
        <h4 class="text-sm font-bold text-slate-800">แนวโน้มผลตรวจวิเคราะห์ย้อนหลัง (Longitudinal Diagnostic Trend Tracker)</h4>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-slate-600">เลือกสัตว์ป่วย:</span>
        <select onchange="selectTrendPet(Number(this.value))" class="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500 font-bold text-purple-900">
          ${state.pets.map(p => `
            <option value="${p.id}" ${p.id === currentPetId ? 'selected' : ''}>${getPetDisplayName(p)} (${p.species} - ${p.breed})</option>
          `).join('')}
        </select>
      </div>
    </div>

    <!-- Patient Banner -->
    <div class="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl font-bold shrink-0">
          ${getPetSpeciesCode(pet) === 'DOG' ? '🐶' : '🐱'}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="font-bold text-sm text-slate-900">${getPetDisplayName(pet)}</h4>
            <span class="text-[10px] font-bold px-2 py-0.2 rounded bg-purple-200 text-purple-900">${pet ? pet.species : ''}</span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">เจ้าของ: ${owner ? owner.display_name : '-'} • อายุ: ${getPetAgeDisplay(pet)} ปี • น้ำหนัก: ${getPetWeightDisplay(pet)} kg</p>
        </div>
      </div>
      <div class="text-right">
        <span class="text-[11px] text-slate-400 block">จำนวนการตรวจเลือดในระบบ</span>
        <span class="text-sm font-bold text-purple-900">${trendHistory ? trendHistory.records.length : 0} ครั้งย้อนหลัง</span>
      </div>
    </div>

    <!-- Comparative Table of Key Biomarkers -->
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <div class="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h5 class="font-bold text-xs text-slate-800">เปรียบเทียบค่าโลหิตวิทยาและชีวเคมี (Hematology & Chemistry Longitudinal Grid)</h5>
        <span class="text-[10px] text-slate-400">เปรียบเทียบค่าตามช่วงเวลาเพื่อประเมินการฟื้นตัวหรือการลุกลามของโรค</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
            <tr>
              <th class="px-4 py-3">วันตรวจ / การรักษา</th>
              <th class="px-3 py-3">WBC (10^3/uL)<br/><span class="text-[9px] text-slate-400 font-normal">Normal 6-17</span></th>
              <th class="px-3 py-3">RBC (10^6/uL)<br/><span class="text-[9px] text-slate-400 font-normal">Normal 5.5-8.5</span></th>
              <th class="px-3 py-3">HCT (%)<br/><span class="text-[9px] text-slate-400 font-normal">Normal 37-55</span></th>
              <th class="px-3 py-3">PLT (10^3/uL)<br/><span class="text-[9px] text-slate-400 font-normal">Normal 175-500</span></th>
              <th class="px-3 py-3">BUN (mg/dL)<br/><span class="text-[9px] text-slate-400 font-normal">Normal 9-31</span></th>
              <th class="px-3 py-3">Creatinine (mg/dL)<br/><span class="text-[9px] text-slate-400 font-normal">Normal 0.5-1.5</span></th>
              <th class="px-3 py-3">ALT (U/L)<br/><span class="text-[9px] text-slate-400 font-normal">Normal 10-100</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${trendHistory ? trendHistory.records.map((rec, idx) => {
              const isLatest = idx === trendHistory.records.length - 1;
              const wbcHigh = rec.WBC > 17.0;
              const pltLow = rec.PLT < 175;

              return `
                <tr class="hover:bg-slate-50/80 transition ${isLatest ? 'bg-purple-50/30 font-semibold' : ''}">
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="font-bold text-slate-900">${rec.date} ${isLatest ? '<span class="text-[9px] bg-purple-600 text-white px-1.5 py-0.2 rounded ml-1">ล่าสุด</span>' : ''}</div>
                    <div class="text-[10px] text-slate-400 font-mono">${rec.encounter}</div>
                  </td>
                  <td class="px-3 py-3 font-mono ${wbcHigh ? 'text-rose-600 font-bold' : 'text-slate-800'}">
                    ${rec.WBC} ${wbcHigh ? '▲' : ''}
                  </td>
                  <td class="px-3 py-3 font-mono text-slate-800">${rec.RBC}</td>
                  <td class="px-3 py-3 font-mono text-slate-800">${rec.HCT}%</td>
                  <td class="px-3 py-3 font-mono ${pltLow ? 'text-amber-600 font-bold' : 'text-slate-800'}">
                    ${rec.PLT} ${pltLow ? '▼' : ''}
                  </td>
                  <td class="px-3 py-3 font-mono text-slate-800">${rec.BUN}</td>
                  <td class="px-3 py-3 font-mono text-slate-800">${rec.Creatinine}</td>
                  <td class="px-3 py-3 font-mono text-slate-800">${rec.ALT}</td>
                </tr>
              `;
            }).join('') : ''}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Clinical Assessment Note -->
    <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
      <i data-lucide="info" class="w-4 h-4 text-purple-600 shrink-0 mt-0.5"></i>
      <div>
        <span class="font-bold text-slate-900 block">บทวิเคราะห์แนวโน้มทางคลินิก (Clinical Trend Interpretation):</span>
        <p class="text-slate-600 mt-0.5">ค่าเม็ดเลือดขาว (WBC) ปรับตัวสูงขึ้นอย่างมีนัยสำคัญจาก 11.2 สู่ 21.8 x10^3/uL ในวันที่ 02 มี.ค. 2026 สอดคล้องกับอาการแสดงของการติดเชื้อและการอักเสบเฉียบพลันในระบบทางเดินอาหาร ขณะที่ค่าไต (BUN/Creatinine) ยังคงอยู่ในระดับควบคุมได้</p>
      </div>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function selectTrendPet(petId) {
  state.activeTrendPetId = Number(petId);
  renderLabLongitudinalTrends();
}

// ============================================================================
// 6. DETAILED LAB RESULT SHEET & SIGN-OFF (Rule 9.3, 9.4, 9.5)
// ============================================================================
function openLabResultSheet(orderId) {
  const order = getDiagnosticOrderById(orderId);
  if (!order) return;

  state.sheetMode = 'lab-result';
  state.activeItemId = orderId;
  openSheetContainer();

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  const pet = getPetById(order.pet_id);
  const owner = getCustomerById(order.customer_id);
  const doctor = getDoctorById(order.doctor_id);
  const results = getLabResultsByOrderId(orderId);
  const orderSpecimens = (order.specimen_ids || []).map(id => getSpecimenById(id)).filter(Boolean);
  const study = getImagingStudyByOrderId(orderId);

  const speciesCode = getPetSpeciesCode(pet);
  const species = pet ? (pet.species || speciesCode) : 'DOG';
  const speciesRanges = state.speciesReferenceRanges[speciesCode] || state.speciesReferenceRanges['DOG'];

  badge.innerText = 'LABORATORY & DIAGNOSTIC REPORT';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300';
  title.innerText = `รายงานผลการตรวจวิเคราะห์ทางห้องปฏิบัติการ (${order.order_number})`;
  subtitle.innerText = `สัตว์ป่วย: ${getPetDisplayName(pet)} • ชนิด: ${species} • เจ้าของ: ${owner ? owner.display_name : ''} • วันที่: ${order.order_date}`;

  body.innerHTML = `
    <div class="space-y-5">

      <!-- Patient & Specimen Summary Banner -->
      <div class="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
        <div class="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl ${species === 'DOG' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'} flex items-center justify-center font-bold text-lg">
              ${species === 'DOG' ? '🐶' : '🐱'}
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-900">${getPetDisplayName(pet)} <span class="text-xs font-normal text-slate-500">(${species} • ${pet ? pet.breed : ''})</span></h4>
              <p class="text-xs text-slate-500">อายุ: ${getPetAgeDisplay(pet)} ปี • น้ำหนัก: ${getPetWeightDisplay(pet)} kg</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-400 block">สัตวแพทย์ผู้ส่งตรวจ</span>
            <span class="text-xs font-bold text-slate-800">${doctor ? doctor.name : 'น.สพ. วุฒิชัย'}</span>
          </div>
        </div>

        <!-- Specimen Tracking Timeline (Chain of Custody) -->
        <div class="space-y-1.5">
          <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">สถานะสิ่งส่งตรวจและการวิเคราะห์ (Specimen Chain of Custody)</span>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            ${orderSpecimens.map(sp => `
              <div class="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-mono text-purple-700 font-bold">${sp.specimen_number}</span>
                  <span class="w-1.5 h-1.5 rounded-full ${sp.status === 'COMPLETED' ? 'bg-emerald-500' : (sp.status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse')}"></span>
                </div>
                <div class="font-semibold text-slate-800 text-[11px] leading-tight">${sp.type}</div>
                <div class="text-[10px] text-slate-400">ปริมาตร: ${sp.volume}</div>
                <div class="text-[9px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span>${sp.collector}</span>
                  <span class="font-bold ${sp.status === 'COMPLETED' ? 'text-emerald-600' : (sp.status === 'REJECTED' ? 'text-rose-600' : 'text-amber-600')}">${sp.status}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Clinical Indication -->
        <div class="text-xs text-slate-700 bg-purple-50/60 p-2.5 rounded-xl border border-purple-200/60">
          <span class="text-[10px] uppercase font-bold text-purple-800 block mb-0.5">ข้อบ่งชี้ทางคลินิก (Clinical Indication):</span>
          <span>${order.clinical_indication}</span>
        </div>
      </div>

      <!-- Critical Panic Alert Banner (Rule 9.4: Life Threatening Threshold) -->
      ${order.has_critical_flag && order.status !== 'VERIFIED' ? `
        <div class="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-start gap-3 text-xs text-rose-900 shadow-sm animate-pulse">
          <i data-lucide="alert-octagon" class="w-5 h-5 text-rose-600 shrink-0 mt-0.5"></i>
          <div>
            <h5 class="font-bold text-sm text-rose-900">🚨 การแจ้งเตือนค่าวิกฤติต่อชีวิต (Critical Panic Value Alert)</h5>
            <p class="text-rose-800 mt-0.5">ตรวจพบค่าผลการวิเคราะห์ออกนอกช่วงวิกฤติ: <strong>${order.critical_details || 'WBC 21.8 x10^3/uL'}</strong> สัตวแพทย์ควรประเมินภาวะ Sepsis และให้การรักษาอย่างเร่งด่วน</p>
          </div>
        </div>
      ` : ''}

      <!-- X-Ray Link Card if study exists -->
      ${study ? `
        <div class="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex items-center justify-between shadow-xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <i data-lucide="scan" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-xs text-white">${study.study_type}</h4>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-900/80 text-purple-300 border border-purple-700">${study.study_number}</span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">มีภาพถ่ายรังสี 2 มุมมอง (VD View & Lateral View) พร้อมรายงานรังสีแพทย์</p>
            </div>
          </div>
          <button onclick="openXrayViewerModal(${order.id})" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 transition shadow-xs cursor-pointer shrink-0">
            <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
            <span>เปิดโปรแกรมดูฟิล์ม</span>
          </button>
        </div>
      ` : ''}

      <!-- Detailed Parameter Results Tables (Species-Specific Range Snapshot) -->
      ${results.length === 0 ? `
        <div class="bg-amber-50 rounded-2xl border border-amber-200 p-6 text-center text-amber-800 space-y-2">
          <i data-lucide="hourglass" class="w-8 h-8 mx-auto text-amber-600"></i>
          <h5 class="font-bold text-sm">อยู่ระหว่างการตรวจวิเคราะห์สิ่งส่งตรวจ</h5>
          <p class="text-xs text-amber-700">เครื่องตรวจอัตโนมัติกำลังประมวลผลตัวอย่าง จะส่งข้อมูลผลลัพธ์เข้าสู่ระบบทันทีเมื่อเสร็จสิ้น</p>
        </div>
      ` : results.map(panel => `
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <!-- Panel Header -->
          <div class="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <i data-lucide="flask-conical" class="w-4 h-4"></i>
              </div>
              <div>
                <h5 class="font-bold text-xs text-slate-900">${panel.test_name}</h5>
                <span class="text-[10px] text-slate-500">เครื่องวิเคราะห์: ${panel.instrument} • ตรวจเมื่อ: ${panel.analyzed_at}</span>
              </div>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-mono text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">Ref Species: ${speciesCode}</span>
              <div class="text-[10px] font-mono text-slate-400 mt-0.5">${panel.technician}</div>
            </div>
          </div>

          <!-- Parameters Table with Visual Range Bar -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[9px] font-bold">
                <tr>
                  <th class="px-3.5 py-2.5">การทดสอบ (Parameter)</th>
                  <th class="px-3 py-2.5">ผลตรวจ (Result)</th>
                  <th class="px-3 py-2.5">ช่วงอ้างอิงปกติ (${speciesCode})</th>
                  <th class="px-3 py-2.5 w-44">เกจวัดระดับค่า (Visual Gauge)</th>
                  <th class="px-3 py-2.5 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${panel.parameters.map(param => {
                  let flagPill = '';
                  let markerColor = 'bg-emerald-600';
                  let pos = Math.min(Math.max(param.percent_pos || 50, 5), 95);

                  if (param.flag === 'HIGH') {
                    flagPill = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300"><span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span>HIGH</span>';
                    markerColor = 'bg-rose-600';
                  } else if (param.flag === 'LOW') {
                    flagPill = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>LOW</span>';
                    markerColor = 'bg-blue-600';
                  } else {
                    flagPill = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>NORMAL</span>';
                    markerColor = 'bg-emerald-600';
                  }

                  return `
                    <tr class="hover:bg-slate-50/60 transition ${param.flag !== 'NORMAL' ? 'bg-amber-50/20' : ''}">
                      <td class="px-3.5 py-2.5">
                        <div class="font-semibold text-slate-800 text-xs">${param.name}</div>
                        ${param.note ? `<div class="text-[10px] text-slate-400 mt-0.5">${param.note}</div>` : ''}
                      </td>
                      <td class="px-3 py-2.5 whitespace-nowrap">
                        <strong class="text-xs ${param.flag === 'HIGH' ? 'text-rose-700 font-extrabold text-sm' : (param.flag === 'LOW' ? 'text-blue-700 font-extrabold text-sm' : 'text-slate-900')}">${param.value}</strong>
                        <span class="text-[10px] text-slate-400 font-mono ml-0.5">${param.unit}</span>
                      </td>
                      <td class="px-3 py-2.5 whitespace-nowrap text-[11px] text-slate-600 font-mono">
                        ${param.ref_low} - ${param.ref_high}
                      </td>
                      <td class="px-3 py-2.5">
                        <!-- Visual Range Bar (Color Gauge) -->
                        <div class="relative w-full h-3 bg-slate-100 rounded-full border border-slate-200 overflow-hidden flex items-center">
                          <!-- Low zone (20%) -->
                          <div class="w-1/4 h-full bg-blue-50/80 border-r border-blue-200"></div>
                          <!-- Normal zone (50%) -->
                          <div class="w-2/4 h-full bg-emerald-50/90 border-r border-emerald-200"></div>
                          <!-- High zone (25%) -->
                          <div class="w-1/4 h-full bg-rose-50/80"></div>
                          <!-- Needle Marker -->
                          <div class="absolute top-0 bottom-0 w-2.5 h-2.5 my-auto rounded-full ring-2 ring-white shadow-xs ${markerColor} transition-all duration-300" style="left: calc(${pos}% - 5px);"></div>
                        </div>
                      </td>
                      <td class="px-3 py-2.5 text-center whitespace-nowrap">
                        ${flagPill}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `).join('')}

      <!-- Verification Info Box if verified -->
      ${order.status === 'VERIFIED' ? `
        <div class="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
          <div class="flex items-center gap-2">
            <i data-lucide="shield-check" class="w-5 h-5 text-emerald-600"></i>
            <div>
              <span class="font-bold block">ผลการตรวจวิเคราะห์ได้รับการรับรองแล้ว (Verified & Signed-off)</span>
              <span class="text-[11px] text-emerald-700">รับรองโดย: <strong>${order.verified_by}</strong> (${order.verified_at})</span>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-lg bg-emerald-200 text-emerald-900 font-bold text-[11px]">VERIFIED</span>
        </div>
      ` : ''}

    </div>
  `;

  footer.innerHTML = `
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center gap-2">
        <button onclick="printLabReport(${order.id})" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition cursor-pointer">
          <i data-lucide="printer" class="w-4 h-4"></i>
          <span>พิมพ์ผลแล็บ</span>
        </button>
        <button onclick="openRetestOrderModal(${order.id})" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5 transition cursor-pointer">
          <i data-lucide="repeat" class="w-4 h-4"></i>
          <span>สั่งตรวจซ้ำ (Retest)</span>
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="closeSheet()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer">
          ปิดหน้าต่าง
        </button>
        ${order.status !== 'VERIFIED' ? `
          <button onclick="verifyAndSignOffLabResult(${order.id})" class="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer">
            <i data-lucide="check-check" class="w-4 h-4"></i>
            <span>รับรองผลตรวจ & ส่งกลับพบแพทย์</span>
          </button>
        ` : `
          <button onclick="closeSheet()" class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition cursor-pointer">
            <i data-lucide="check" class="w-4 h-4"></i>
            <span>เรียบร้อย</span>
          </button>
        `}
      </div>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function verifyAndSignOffLabResult(orderId) {
  const order = getDiagnosticOrderById(orderId);
  if (!order) return;

  order.status = 'VERIFIED';
  order.verified_by = 'น.สพ. วุฒิชัย เกียรติสกุล (สพ.บ. 8841)';
  order.verified_at = '02 มี.ค. 2026 ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';

  // Cross-domain Queue integration: unlock patient waiting for lab results
  const q = state.queues.find(q => q.pet_id === order.pet_id && q.stage !== 'COMPLETED');
  if (q) {
    if (q.stage === 'HOLD') {
      q.stage = 'IN_SERVICE'; // move back into doctor examination room
    }
    q.notes = (q.notes ? q.notes + ' • ' : '') + 'ผลแล็บออกครบแล้ว (พร้อมสรุปแผนการรักษา)';
  }

  // Cross-domain EMR integration: append note to active encounter if exists
  const enc = state.encounters.find(e => e.pet_id === order.pet_id && e.id === order.encounter_id);
  if (enc) {
    if (!enc.plan.diagnostic_orders) enc.plan.diagnostic_orders = [];
    enc.assessment.primary_diagnosis += ' [ยืนยันด้วยผลตรวจทางห้องปฏิบัติการ]';
  }

  // Central Event Bus Notification (D05 -> D07 Billing)
  if (window.ClinicEventBus && window.CLINIC_EVENTS) {
    window.ClinicEventBus.emit(window.CLINIC_EVENTS.LAB_RESULT_VERIFIED, {
      order: order,
      petId: order.pet_id,
      customerId: order.customer_id
    });
  }

  closeSheet();
  showToast('รับรองผลตรวจสำเร็จ', `ผลแล็บคำสั่ง ${order.order_number} ได้รับการรับรองและส่งกลับห้องตรวจแพทย์เรียบร้อยแล้ว`, 'success');
  renderCurrentView();
}

// ============================================================================
// 7. RETEST & REPEAT TESTING WORKFLOW (Capability 3.11 & Workflow 4.5)
// ============================================================================
function openRetestOrderModal(orderId) {
  const order = getDiagnosticOrderById(orderId);
  if (!order) return;

  const modal = document.getElementById('modal-lab-retest');
  if (!modal) return;

  const pet = getPetById(order.pet_id);
  document.getElementById('retest-order-id').value = order.id;
  document.getElementById('retest-order-badge').innerText = order.order_number;
  document.getElementById('retest-order-pet').innerText = `สัตว์ป่วย: ${getPetDisplayName(pet)} (${order.items.map(i => i.name).join(', ')})`;

  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeRetestOrderModal() {
  const modal = document.getElementById('modal-lab-retest');
  if (modal) modal.classList.add('hidden');
}

function confirmRetest(e) {
  e.preventDefault();

  const orderId = Number(document.getElementById('retest-order-id').value);
  const retestReason = document.getElementById('retest-reason-type').value;
  const retestNotes = document.getElementById('retest-notes').value.trim();

  const order = getDiagnosticOrderById(orderId);
  if (!order) return;

  // Set order to processing again for repeat analysis
  order.status = 'PROCESSING';
  order.critical_details = `สั่งตรวจซ้ำ: ${retestReason} (${retestNotes || 'ยืนยันผล'})`;

  closeRetestOrderModal();
  showToast('ส่งคำสั่งตรวจซ้ำสำเร็จ', `คำสั่งตรวจซ้ำสำหรับ ${order.order_number} เข้าสู่คิววิเคราะห์ซ้ำโดยไม่มีค่าบริการเพิ่ม`, 'success');
  renderLabSubTabContent();
  renderCurrentView();
}

// ============================================================================
// 8. MEDICAL DICOM / X-RAY VIEWER MODAL ENGINE (Capabilities 3.15, 3.16)
// ============================================================================
function openXrayViewerModal(orderId) {
  const study = getImagingStudyByOrderId(orderId) || state.imagingStudies[0];
  if (!study) {
    showToast('ไม่พบภาพถ่ายรังสี', 'คำสั่งตรวจนี้ไม่มีภาพถ่ายรังสีในระบบ', 'warning');
    return;
  }

  state.activeXrayStudyId = study.id;
  state.activeXrayView = 'vd';
  state.isXrayInverted = false;
  state.isXrayZoomed = false;

  const modal = document.getElementById('modal-xray-viewer');
  if (!modal) return;

  const order = getDiagnosticOrderById(study.order_id);
  const pet = getPetById(study.pet_id);
  const doctor = order ? getDoctorById(order.doctor_id) : null;

  document.getElementById('xray-modal-title').innerText = `${study.study_type} (${study.modality})`;
  document.getElementById('xray-modal-badge').innerText = study.study_number;
  document.getElementById('xray-modal-subtitle').innerText = `น้อง${getPetDisplayName(pet)} • ${pet ? pet.species + ' ' + pet.breed : ''} • ตรวจเมื่อ: ${study.performed_at}`;

  document.getElementById('xray-report-region').innerText = study.study_type;
  document.getElementById('xray-report-doctor').innerText = doctor ? doctor.name : 'น.สพ. วุฒิชัย';
  document.getElementById('xray-report-findings').innerText = study.findings;
  document.getElementById('xray-report-conclusion').innerText = study.impression;

  // Set initial image
  const imgDisplay = document.getElementById('xray-image-display');
  if (imgDisplay) {
    imgDisplay.src = study.views.vd.image_url;
    imgDisplay.className = 'max-h-full max-w-full object-contain filter contrast-125 transition-all duration-300';
  }

  // Update switcher buttons
  const btnVd = document.getElementById('btn-xray-view-vd');
  const btnLat = document.getElementById('btn-xray-view-lateral');
  if (btnVd && btnLat) {
    btnVd.className = 'px-2.5 py-1 rounded bg-purple-600 text-white transition cursor-pointer font-bold';
    btnLat.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-white transition cursor-pointer';
  }

  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeXrayViewerModal() {
  const modal = document.getElementById('modal-xray-viewer');
  if (modal) modal.classList.add('hidden');
}

function switchXrayView(viewType) {
  const study = state.imagingStudies.find(s => s.id === state.activeXrayStudyId) || state.imagingStudies[0];
  if (!study) return;

  state.activeXrayView = viewType;
  const imgDisplay = document.getElementById('xray-image-display');
  const btnVd = document.getElementById('btn-xray-view-vd');
  const btnLat = document.getElementById('btn-xray-view-lateral');

  if (viewType === 'vd') {
    if (imgDisplay) imgDisplay.src = study.views.vd.image_url;
    if (btnVd) btnVd.className = 'px-2.5 py-1 rounded bg-purple-600 text-white transition cursor-pointer font-bold';
    if (btnLat) btnLat.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-white transition cursor-pointer';
    showToast('สลับมุมมองภาพ', 'แสดงภาพมุมมอง Ventrodorsal (VD View)', 'info');
  } else {
    if (imgDisplay) imgDisplay.src = study.views.lateral.image_url;
    if (btnLat) btnLat.className = 'px-2.5 py-1 rounded bg-purple-600 text-white transition cursor-pointer font-bold';
    if (btnVd) btnVd.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-white transition cursor-pointer';
    showToast('สลับมุมมองภาพ', 'แสดงภาพมุมมอง Right Lateral View', 'info');
  }
}

function toggleXrayInvert() {
  state.isXrayInverted = !state.isXrayInverted;
  const imgDisplay = document.getElementById('xray-image-display');
  if (imgDisplay) {
    if (state.isXrayInverted) {
      imgDisplay.classList.add('invert');
      showToast('ปรับแต่งภาพ', 'เปิดโหมด Invert Contrast (กลับสีขาว-ดำเพื่อดูขอบกระดูก)', 'info');
    } else {
      imgDisplay.classList.remove('invert');
      showToast('ปรับแต่งภาพ', 'ปิดโหมด Invert Contrast กลับสู่ภาพปกติ', 'info');
    }
  }
}

function toggleXrayZoom() {
  state.isXrayZoomed = !state.isXrayZoomed;
  const imgDisplay = document.getElementById('xray-image-display');
  if (imgDisplay) {
    if (state.isXrayZoomed) {
      imgDisplay.classList.add('scale-125');
      showToast('ขยายภาพ', 'ขยายภาพฟิล์ม 125% เพื่อดูรายละเอียดอวัยวะ', 'info');
    } else {
      imgDisplay.classList.remove('scale-125');
      showToast('ย่อภาพ', 'ปรับขนาดภาพกลับสู่ขนาดมาตรฐาน', 'info');
    }
  }
}

function printXrayReport() {
  showToast('สั่งพิมพ์ฟิล์มและรายงาน', 'ส่งไฟล์ภาพทางการแพทย์ DICOM และรายงานสรุปเข้าคิวเครื่องพิมพ์เรียบร้อย', 'success');
}

function printLabReport(orderId) {
  const order = getDiagnosticOrderById(orderId);
  showToast('สั่งพิมพ์รายงานแล็บ', `ส่งพิมพ์รายงานผลการตรวจวิเคราะห์ ${order ? order.order_number : ''} เรียบร้อย`, 'success');
}

// ============================================================================
// 9. NEW QUICK LAB / IMAGING ORDER SHEET (Capabilities 3.2, 3.3)
// ============================================================================
function openNewLabOrderSheet() {
  state.sheetMode = 'new-lab-order';
  openSheetContainer();

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  badge.innerText = 'NEW DIAGNOSTIC ORDER';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300';
  title.innerText = 'ส่งตรวจทางห้องปฏิบัติการและรังสีวินิจฉัยใหม่';
  subtitle.innerText = 'เลือกสัตว์ป่วย รายการตรวจวิเคราะห์ และสร้างบาร์โค้ดสิ่งส่งตรวจ';

  body.innerHTML = `
    <form id="form-new-lab-order" onsubmit="submitNewLabOrder(event)" class="space-y-4">
      
      <!-- Patient Selector -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">เลือกสัตว์ป่วยที่ส่งตรวจ <span class="text-rose-500">*</span></label>
        <select id="new-lab-pet-id" required class="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500">
          ${state.pets.map(p => {
            const owner = getPrimaryOwnerForPet(p.id);
            return `<option value="${p.id}">${getPetDisplayName(p)} (${p.species} - ${p.breed}) • เจ้าของ: ${owner ? owner.display_name : '-'}</option>`;
          }).join('')}
        </select>
      </div>

      <!-- Urgency & Doctor -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">ระดับความเร่งด่วน <span class="text-rose-500">*</span></label>
          <select id="new-lab-urgency" class="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500">
            <option value="ROUTINE">Routine (ตรวจตามลำดับปกติ)</option>
            <option value="STAT">🚨 STAT (ด่วนวิกฤต - ผลภายใน 20 นาที)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">สัตวแพทย์ผู้ส่งตรวจ</label>
          <select id="new-lab-doctor-id" class="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500">
            ${state.doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Tests Catalog Checklist -->
      <div class="space-y-2">
        <label class="block text-xs font-semibold text-slate-700">เลือกรายการตรวจวิเคราะห์ (Select Tests) <span class="text-rose-500">*</span></label>
        <div class="space-y-2 max-h-56 overflow-y-auto p-1">
          ${state.diagnosticCatalogs.map(cat => `
            <label class="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 transition cursor-pointer">
              <input type="checkbox" name="lab-catalog-item" value="${cat.code}" class="rounded text-purple-600 focus:ring-purple-500 mt-0.5">
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-800">${cat.name}</span>
                  <span class="text-xs font-bold text-purple-700">฿${cat.price.toLocaleString()}</span>
                </div>
                <div class="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                  <span class="px-1.5 py-0.2 rounded bg-slate-100 font-mono">${cat.code}</span>
                  <span>•</span>
                  <span>${cat.specimen_type}</span>
                  <span>•</span>
                  <span>${cat.turnaround_time}</span>
                </div>
              </div>
            </label>
          `).join('')}
        </div>
      </div>

      <!-- Clinical Indication -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">อาการสำคัญ / ข้อบ่งชี้ทางคลินิก (Clinical Indication) <span class="text-rose-500">*</span></label>
        <textarea id="new-lab-indication" required rows="2" class="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-purple-500" placeholder="เช่น สุนัขอ่อนแรง มีไข้ สงสัยพยาธิในเม็ดเลือด หรือถ่ายเหลว..."></textarea>
      </div>

      <!-- Specimen Collection Note -->
      <div class="p-3 bg-purple-50 rounded-xl border border-purple-200/80 flex items-center gap-2.5 text-xs text-purple-900">
        <i data-lucide="info" class="w-4 h-4 text-purple-600 shrink-0"></i>
        <span>ระบบจะสร้างรหัสหลอดตัวอย่าง (Specimen Barcode) สำหรับติดหลอดเลือด/สไลด์อัตโนมัติเมื่อกดบันทึก</span>
      </div>

    </form>
  `;

  footer.innerHTML = `
    <div class="flex items-center justify-end gap-2 w-full">
      <button onclick="closeSheet()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer">
        ยกเลิก
      </button>
      <button onclick="document.getElementById('form-new-lab-order').requestSubmit()" class="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer">
        <i data-lucide="send" class="w-4 h-4"></i>
        <span>สร้างคำสั่งตรวจ & พิมพ์บาร์โค้ด</span>
      </button>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function submitNewLabOrder(e) {
  e.preventDefault();

  const petId = Number(document.getElementById('new-lab-pet-id').value);
  const urgency = document.getElementById('new-lab-urgency').value;
  const doctorId = Number(document.getElementById('new-lab-doctor-id').value);
  const indication = document.getElementById('new-lab-indication').value.trim();

  const checkedCodes = Array.from(document.querySelectorAll('input[name="lab-catalog-item"]:checked')).map(cb => cb.value);
  if (checkedCodes.length === 0) {
    showToast('กรุณาเลือกรายการตรวจ', 'ต้องเลือกรายการตรวจทางแล็บหรือรังสีอย่างน้อย 1 รายการ', 'warning');
    return;
  }

  const selectedItems = checkedCodes.map(code => {
    const cat = state.diagnosticCatalogs.find(c => c.code === code);
    return { code: cat.code, name: cat.name, type: cat.category };
  });

  const pet = getPetById(petId);
  const owner = getPrimaryOwnerForPet(petId);
  const newOrderId = state.diagnosticOrders.length + 1;
  const orderNumber = `ORD-2026-${String(newOrderId).padStart(4, '0')}`;

  // Generate specimen
  const newSpecimenId = state.specimens.length + 1;
  const newSpecimen = {
    id: newSpecimenId,
    specimen_number: `SPEC-2026-${String(newOrderId).padStart(4, '0')}-A`,
    order_id: newOrderId,
    pet_id: petId,
    type: selectedItems.some(i => i.type === 'LAB') ? 'หลอด EDTA / Clot Blood' : 'Imaging Procedure',
    volume: '2.0 mL',
    collection_time: '02 มี.ค. 2026 ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    collector: 'พว. กัลยา สุขใจ',
    accession_status: 'RECEIVED',
    quality_inspection: { clotted: false, hemolyzed_grade: '0', lipemic_grade: '0' },
    rejection_reason: null,
    status: 'RECEIVED'
  };
  state.specimens.push(newSpecimen);

  // Add Specimen Event
  state.specimenEvents.push({
    id: state.specimenEvents.length + 1,
    specimen_id: newSpecimenId,
    event_type: 'COLLECTED',
    event_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    performed_by: 'พว. กัลยา สุขใจ',
    notes: 'สร้างคำสั่งและเตรียมเจาะสิ่งส่งตรวจ'
  });

  const newOrder = {
    id: newOrderId,
    order_number: orderNumber,
    encounter_id: 1,
    pet_id: petId,
    customer_id: owner ? owner.id : 1,
    doctor_id: doctorId,
    order_date: '02 มี.ค. 2026 ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    test_category: selectedItems.some(i => i.type === 'LAB') && selectedItems.some(i => i.type === 'IMAGING') ? 'ALL' : (selectedItems[0].type),
    items: selectedItems,
    clinical_indication: indication,
    urgency: urgency,
    status: 'PROCESSING',
    specimen_ids: [newSpecimenId],
    verified_by: null,
    verified_at: null,
    has_critical_flag: false,
    critical_details: null
  };

  state.diagnosticOrders.unshift(newOrder);

  closeSheet();
  showToast('สร้างคำสั่งตรวจสำเร็จ', `คำสั่งตรวจ ${orderNumber} ส่งเข้าสู่ระบบห้องปฏิบัติการเรียบร้อยแล้ว`, 'success');
  renderCurrentView();
}
