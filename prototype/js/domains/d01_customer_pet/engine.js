// =========================================================================
// DOMAIN 01: CUSTOMER & PET MANAGEMENT ENGINE (PRODUCTION-GRADE PROTOTYPE)
// =========================================================================

// Global Tab State for Sheets
window.activeOwnerSheetTab = window.activeOwnerSheetTab || 'overview';
window.activePetSheetTab = window.activePetSheetTab || 'overview';

// -------------------------------------------------------------
// 1. CARD & LIST VIEW RENDERERS (OWNERS & PETS)
// -------------------------------------------------------------

function renderOwnersCardView(customers) {
  const container = document.getElementById('owners-card-grid');
  if (!container) return;

  if (customers.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
        <i data-lucide="user-x" class="w-10 h-10 text-slate-300 mx-auto mb-3"></i>
        <p class="text-sm font-semibold text-slate-600">ไม่พบข้อมูลเจ้าของสัตว์ตามเงื่อนไขที่ค้นหา</p>
        <p class="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือกดปุ่ม "+ ลงทะเบียนเจ้าของใหม่"</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = customers.map(c => {
    const pets = getPetsForCustomer(c.id);
    const hasAllergy = pets.some(p => (p.allergies && p.allergies.length > 0) || (p.allergies_detail && p.allergies_detail.length > 0));
    const isJuristic = c.customer_type === 'JURISTIC';

    return `
      <div class="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden group">
        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl ${isJuristic ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-teal-50 text-teal-700 border-teal-200/80'} font-bold flex items-center justify-center text-sm border shadow-xs shrink-0">
                ${isJuristic ? '<i data-lucide="building-2" class="w-5 h-5"></i>' : (c.first_name ? c.first_name.charAt(0) : 'U')}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-slate-900 text-sm hover:text-teal-600 cursor-pointer truncate" onclick="openDetailSheet('owner', ${c.id})">${c.display_name}</h3>
                  <span class="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded ${c.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}">${c.status === 'ACTIVE' ? 'ปกติ' : 'ปิดใช้งาน'}</span>
                </div>
                <div class="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                  <span>${c.customer_code}</span>
                  ${c.tax_id ? `<span class="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-sans">Tax ID: ${c.tax_id}</span>` : ''}
                </div>
              </div>
            </div>
            <button onclick="openDetailSheet('owner', ${c.id})" title="เปิดดู 360° Profile" class="text-slate-400 hover:text-teal-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer">
              <i data-lucide="external-link" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Contact Summary -->
          <div class="mt-4 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i data-lucide="phone" class="w-3.5 h-3.5 text-teal-600 shrink-0"></i>
                <span class="font-semibold text-slate-800">${c.phone_primary}</span>
              </div>
              ${c.line_id ? `<span class="text-[11px] text-emerald-600 font-medium flex items-center gap-1"><i data-lucide="message-circle" class="w-3 h-3"></i> ${c.line_id}</span>` : ''}
            </div>
            <div class="flex items-start gap-2 text-slate-500 text-[11px]">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5"></i>
              <span class="truncate">${c.address_line}${c.district ? `, ${c.district}` : ''}, ${c.province || 'กรุงเทพมหานคร'}</span>
            </div>
          </div>

          <!-- Pets List -->
          <div class="mt-4">
            <div class="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span class="flex items-center gap-1.5">
                <i data-lucide="paw-print" class="w-3.5 h-3.5 text-teal-600"></i>
                <span>สัตว์เลี้ยงในดูแล (${pets.length})</span>
              </span>
              ${hasAllergy ? '<span class="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">⚠️ มีประวัติแพ้ยา</span>' : ''}
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${pets.length > 0 ? pets.map(p => `
                <button onclick="openDetailSheet('pet', ${p.id})" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 text-slate-700 transition cursor-pointer">
                  <span class="font-medium">${p.pet_name}</span>
                  <span class="text-[10px] text-slate-400">(${p.species})</span>
                </button>
              `).join('') : '<span class="text-xs text-slate-400 italic">ยังไม่มีสัตว์เลี้ยงที่ลงทะเบียน</span>'}
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
          <div class="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-600"></i>
            <span>PDPA: ยินยอม ${c.consents?.marketing_promo?.granted ? 'ครบถ้วน' : 'พื้นฐาน'}</span>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="openFormSheet('owner-edit', ${c.id})" class="text-xs font-semibold text-slate-600 hover:text-slate-800 p-1 rounded hover:bg-slate-200 transition cursor-pointer" title="แก้ไขข้อมูล">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="openDetailSheet('owner', ${c.id})" class="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition cursor-pointer">
              360° Profile
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function renderOwnersListView(customers) {
  const container = document.getElementById('owners-list-table');
  if (!container) return;

  if (customers.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400">ไม่พบข้อมูลลูกค้า</div>`;
    return;
  }

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-600">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
          <tr>
            <th class="px-4 py-3.5">รหัสลูกค้า</th>
            <th class="px-4 py-3.5">ชื่อ-นามสกุล / นิติบุคคล</th>
            <th class="px-4 py-3.5">ประเภท</th>
            <th class="px-4 py-3.5">เบอร์โทรศัพท์หลัก</th>
            <th class="px-4 py-3.5">ที่อยู่</th>
            <th class="px-4 py-3.5">สัตว์เลี้ยง</th>
            <th class="px-4 py-3.5">PDPA Consent</th>
            <th class="px-4 py-3.5 text-right">การกระทำ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${customers.map(c => {
            const pets = getPetsForCustomer(c.id);
            const isJuristic = c.customer_type === 'JURISTIC';
            return `
              <tr class="hover:bg-slate-50/80 transition">
                <td class="px-4 py-3 font-mono font-medium text-slate-900">${c.customer_code}</td>
                <td class="px-4 py-3">
                  <span class="font-bold text-slate-900 hover:text-teal-600 cursor-pointer block" onclick="openDetailSheet('owner', ${c.id})">${c.display_name}</span>
                  <span class="text-[11px] text-slate-400">${c.first_name} ${c.last_name || ''}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${isJuristic ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}">
                    ${isJuristic ? 'นิติบุคคล' : 'บุคคลธรรมดา'}
                  </span>
                </td>
                <td class="px-4 py-3 font-medium text-slate-800">${c.phone_primary}</td>
                <td class="px-4 py-3 text-slate-500 truncate max-w-xs">${c.address_line}, ${c.province}</td>
                <td class="px-4 py-3">
                  ${pets.length > 0 ? pets.map(p => `<span class="inline-block bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px] mr-1">${p.pet_name}</span>`).join('') : '<span class="text-slate-400">-</span>'}
                </td>
                <td class="px-4 py-3">
                  <span class="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                    <i data-lucide="check" class="w-3 h-3"></i> ยินยอม
                  </span>
                </td>
                <td class="px-4 py-3 text-right space-x-1">
                  <button onclick="openFormSheet('owner-edit', ${c.id})" title="แก้ไขข้อมูล" class="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition cursor-pointer">
                    <i data-lucide="edit-3" class="w-4 h-4"></i>
                  </button>
                  <button onclick="openDetailSheet('owner', ${c.id})" title="ดู 360° Profile" class="p-1.5 text-slate-400 hover:text-teal-600 rounded hover:bg-teal-50 transition cursor-pointer">
                    <i data-lucide="eye" class="w-4 h-4"></i>
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  lucide.createIcons();
}

function renderPetsCardView(pets) {
  const container = document.getElementById('pets-card-grid');
  if (!container) return;

  if (pets.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
        <i data-lucide="dog" class="w-10 h-10 text-slate-300 mx-auto mb-3"></i>
        <p class="text-sm font-semibold text-slate-600">ไม่พบข้อมูลสัตว์เลี้ยงตามเงื่อนไข</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = pets.map(p => {
    const primaryOwner = getPrimaryOwnerForPet(p.id);
    const ownerships = getOwnershipsForPet(p.id);
    const coOwners = ownerships.filter(o => !o.is_primary);
    const hasAllergies = p.allergies?.length > 0 || p.allergies_detail?.length > 0;
    const hasChronic = p.chronic_conditions?.length > 0 || p.chronic_conditions_detail?.length > 0;

    return `
      <div class="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden group">
        <div class="p-5">
          <div class="flex items-start gap-3.5">
            <div class="w-18 h-18 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative shadow-inner">
              <img src="${p.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300'}" class="w-full h-full object-cover">
              <span class="absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-950/75 text-white backdrop-blur-xs">${p.species}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-1">
                <h3 class="font-bold text-slate-900 text-sm hover:text-teal-600 cursor-pointer truncate" onclick="openDetailSheet('pet', ${p.id})">${p.pet_name}</h3>
                <span class="text-[10px] font-mono text-slate-400">${p.pet_code}</span>
              </div>
              <p class="text-xs text-slate-500 font-medium truncate mt-0.5">${p.breed}</p>
              
              <div class="flex items-center gap-1.5 flex-wrap mt-2">
                <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">${p.sex}</span>
                <span class="text-[10px] font-medium px-2 py-0.5 rounded-md ${p.reproductive_status?.includes('ทำหมันแล้ว') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600'}">
                  ${p.reproductive_status?.includes('ทำหมันแล้ว') ? 'ทำหมันแล้ว' : 'ยังไม่ทำหมัน'}
                </span>
                ${p.microchip_number ? `<span class="text-[10px] font-mono bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded" title="Microchip: ${p.microchip_number}"><i data-lucide="cpu" class="w-2.5 h-2.5 inline"></i> ${p.microchip_number.slice(-5)}</span>` : ''}
              </div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
            <div>
              <span class="text-[10px] text-slate-400 block font-medium">อายุ</span>
              <span class="font-bold text-slate-800">${calculateAge(p.birth_date)}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block font-medium">น้ำหนักล่าสุด</span>
              <span class="font-bold text-teal-700">${p.current_weight} กก.</span>
            </div>
          </div>

          <!-- Owners Row -->
          <div class="mt-3 text-xs">
            <span class="text-[10px] text-slate-400 block">เจ้าของหลัก:</span>
            <div class="flex items-center justify-between mt-0.5">
              <span class="font-semibold text-slate-800 truncate cursor-pointer hover:text-teal-600" onclick="openDetailSheet('owner', ${primaryOwner?.id})">
                ${primaryOwner ? primaryOwner.display_name : 'ไม่ระบุเจ้าของ'}
              </span>
              ${coOwners.length > 0 ? `<span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">+${coOwners.length} เจ้าของร่วม</span>` : ''}
            </div>
          </div>

          <!-- Medical Alerts -->
          <div class="mt-3">
            ${hasAllergies ? `
              <div class="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded-xl">
                <i data-lucide="alert-octagon" class="w-3.5 h-3.5 shrink-0 text-rose-600"></i>
                <span class="truncate">${p.allergies_detail?.[0]?.allergen || p.allergies?.[0]}</span>
              </div>
            ` : hasChronic ? `
              <div class="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-xl">
                <i data-lucide="alert-circle" class="w-3.5 h-3.5 shrink-0 text-amber-600"></i>
                <span class="truncate">${p.chronic_conditions_detail?.[0]?.condition_name || p.chronic_conditions?.[0]}</span>
              </div>
            ` : '<div class="text-[11px] text-slate-400 flex items-center gap-1 py-0.5"><i data-lucide="check-circle" class="w-3 h-3 text-emerald-500"></i> ไม่มีประวัติแพ้ยา / โรคเรื้อรัง</div>'}
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
          <button onclick="startConsultationDirectly(${p.id})" class="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition cursor-pointer">
            <i data-lucide="stethoscope" class="w-3.5 h-3.5"></i>
            <span>เปิดห้องตรวจ (EMR)</span>
          </button>
          <div class="flex items-center gap-1">
            <button onclick="openFormSheet('pet-edit', ${p.id})" title="แก้ไขข้อมูลสัตว์เลี้ยง" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition cursor-pointer">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="openDetailSheet('pet', ${p.id})" class="text-xs font-semibold text-slate-700 hover:text-teal-700 px-2 py-1 rounded cursor-pointer">
              เวชระเบียน 360°
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function renderPetsListView(pets) {
  const container = document.getElementById('pets-list-table');
  if (!container) return;

  if (pets.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400">ไม่พบข้อมูลสัตว์เลี้ยง</div>`;
    return;
  }

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-600">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
          <tr>
            <th class="px-4 py-3.5">รหัสสัตว์</th>
            <th class="px-4 py-3.5">ชื่อสัตว์เลี้ยง</th>
            <th class="px-4 py-3.5">ชนิด / สายพันธุ์</th>
            <th class="px-4 py-3.5">อายุ / น้ำหนัก</th>
            <th class="px-4 py-3.5">เลขไมโครชิป</th>
            <th class="px-4 py-3.5">คำเตือนทางการแพทย์</th>
            <th class="px-4 py-3.5">เจ้าของหลัก / เจ้าของร่วม</th>
            <th class="px-4 py-3.5 text-right">การกระทำ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${pets.map(p => {
            const owner = getPrimaryOwnerForPet(p.id);
            const ownerships = getOwnershipsForPet(p.id);
            const coOwners = ownerships.filter(o => !o.is_primary);
            const hasAllergies = p.allergies?.length > 0 || p.allergies_detail?.length > 0;
            return `
              <tr class="hover:bg-slate-50/80 transition">
                <td class="px-4 py-3 font-mono font-medium">${p.pet_code}</td>
                <td class="px-4 py-3 font-bold text-slate-900 cursor-pointer hover:text-teal-600" onclick="openDetailSheet('pet', ${p.id})">${p.pet_name}</td>
                <td class="px-4 py-3">${p.species} (${p.breed})</td>
                <td class="px-4 py-3">${calculateAge(p.birth_date)} • <strong class="text-teal-700">${p.current_weight} kg</strong></td>
                <td class="px-4 py-3 font-mono text-[11px] text-slate-500">${p.microchip_number || '-'}</td>
                <td class="px-4 py-3">
                  ${hasAllergies ? `<span class="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">⚠️ แพ้ยา</span>` : '<span class="text-slate-400">-</span>'}
                </td>
                <td class="px-4 py-3">
                  <span class="font-medium text-slate-800">${owner?.display_name || '-'}</span>
                  ${coOwners.length > 0 ? `<span class="text-[10px] text-slate-400 block">+${coOwners.map(co => co.customer?.display_name).join(', ')}</span>` : ''}
                </td>
                <td class="px-4 py-3 text-right space-x-1">
                  <button onclick="startConsultationDirectly(${p.id})" class="text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded border border-teal-200 cursor-pointer">
                    ห้องตรวจ EMR
                  </button>
                  <button onclick="openDetailSheet('pet', ${p.id})" class="text-xs font-semibold text-slate-600 hover:text-slate-900 p-1.5 rounded cursor-pointer" title="ดู 360° Profile">
                    <i data-lucide="eye" class="w-4 h-4 inline"></i>
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  lucide.createIcons();
}

// -------------------------------------------------------------
// 2. NEW CUSTOMER FORM (ENTERPRISE REGISTRATION WITH PDPA)
// -------------------------------------------------------------

function renderNewOwnerForm() {
  const body = document.getElementById('sheet-body');
  body.innerHTML = `
    <form id="owner-registration-form" class="space-y-4" onsubmit="event.preventDefault(); submitSheetForm();">
      
      <!-- Duplicate Warning Alert Box -->
      <div id="phone-duplicate-alert" class="hidden p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-xs flex items-start gap-2.5 animate-pulse">
        <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
        <div id="phone-duplicate-msg"></div>
      </div>

      <!-- Customer Type Selector -->
      <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
        <label class="block text-slate-800 font-bold">ประเภทลูกค้า (Customer Type) *</label>
        <div class="grid grid-cols-2 gap-2">
          <label class="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center gap-2 cursor-pointer hover:border-teal-400">
            <input type="radio" name="form-owner-type" value="INDIVIDUAL" checked onchange="toggleCustomerTypeFields('INDIVIDUAL')" class="text-teal-600">
            <span class="font-semibold text-slate-800">บุคคลธรรมดา (Individual)</span>
          </label>
          <label class="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center gap-2 cursor-pointer hover:border-teal-400">
            <input type="radio" name="form-owner-type" value="JURISTIC" onchange="toggleCustomerTypeFields('JURISTIC')" class="text-teal-600">
            <span class="font-semibold text-slate-800">นิติบุคคล / ฟาร์ม / มูลนิธิ</span>
          </label>
        </div>
      </div>

      <!-- Identity Fields -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">คำนำหน้า</label>
          <select id="form-owner-prefix" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
            <option value="คุณ">คุณ</option>
            <option value="นาย">นาย</option>
            <option value="นาง">นาง</option>
            <option value="นางสาว">นางสาว</option>
            <option value="มูลนิธิ">มูลนิธิ</option>
            <option value="บริษัท">บริษัท</option>
          </select>
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1" id="label-owner-firstname">ชื่อจริง / นิติบุคคล *</label>
          <input type="text" id="form-owner-firstname" required placeholder="เช่น วิภาดา หรือ มูลนิธิ..." class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
        <div id="wrapper-owner-lastname">
          <label class="block text-slate-700 font-semibold mb-1">นามสกุล</label>
          <input type="text" id="form-owner-lastname" placeholder="เช่น ศรีสุวรรณ" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">ชื่อเรียก / ชื่อแสดงผลในระบบ *</label>
          <input type="text" id="form-owner-displayname" required placeholder="เช่น คุณวิภาดา (แพท)" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">เลขประจำตัวผู้เสียภาษี / บัตร ปชช.</label>
          <input type="text" id="form-owner-taxid" placeholder="13 หลัก (เพื่อออกใบเสร็จ)" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="wrapper-owner-dob-gender">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">วันเดือนปีเกิด (Date of Birth)</label>
          <input type="date" id="form-owner-birthdate" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">เพศ (Gender)</label>
          <select id="form-owner-gender" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
            <option value="ไม่ระบุ">ไม่ระบุ</option>
            <option value="หญิง">หญิง</option>
            <option value="ชาย">ชาย</option>
            <option value="LGBTQ+">LGBTQ+</option>
          </select>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="border-t border-slate-100 pt-3">
        <h4 class="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <i data-lucide="phone" class="w-4 h-4 text-teal-600"></i>
          <span>ช่องทางติดต่อหลักและสำรอง</span>
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="block text-slate-700 font-semibold mb-1">เบอร์โทรศัพท์หลัก *</label>
            <input type="tel" id="form-owner-phone1" required placeholder="08X-XXX-XXXX" oninput="handleLivePhoneCheck(this.value)" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium">
          </div>
          <div>
            <label class="block text-slate-700 font-semibold mb-1">เบอร์สำรอง / โทรศัพท์บ้าน</label>
            <input type="tel" id="form-owner-phone2" placeholder="02-XXX-XXXX" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
          </div>
          <div>
            <label class="block text-slate-700 font-semibold mb-1">LINE ID</label>
            <input type="text" id="form-owner-line" placeholder="@username" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
          </div>
        </div>
        <div class="mt-2.5">
          <label class="block text-slate-700 font-semibold mb-1">อีเมล (Email)</label>
          <input type="email" id="form-owner-email" placeholder="example@gmail.com" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
      </div>

      <!-- Address Info -->
      <div class="border-t border-slate-100 pt-3">
        <h4 class="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <i data-lucide="map-pin" class="w-4 h-4 text-teal-600"></i>
          <span>ข้อมูลที่อยู่สำหรับออกเอกสาร</span>
        </h4>
        <div class="space-y-2.5">
          <div>
            <label class="block text-slate-700 font-semibold mb-1">ที่อยู่ (เลขที่, อาคาร, ซอย, ถนน) *</label>
            <input type="text" id="form-owner-address" required placeholder="88/12 ซอยทองหล่อ 13 ถ.สุขุมวิท 55" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-slate-700 font-semibold mb-1">เขต/อำเภอ</label>
              <input type="text" id="form-owner-district" value="วัฒนา" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
            </div>
            <div>
              <label class="block text-slate-700 font-semibold mb-1">จังหวัด</label>
              <input type="text" id="form-owner-province" value="กรุงเทพมหานคร" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
            </div>
            <div>
              <label class="block text-slate-700 font-semibold mb-1">รหัสไปรษณีย์</label>
              <input type="text" id="form-owner-postal" value="10110" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
            </div>
          </div>
        </div>
      </div>

      <!-- Referral Channel -->
      <div class="border-t border-slate-100 pt-3">
        <label class="block text-slate-700 font-semibold mb-1">ช่องทางที่รู้จักคลินิก</label>
        <select id="form-owner-referral" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
          <option value="เพื่อนแนะนำ">เพื่อนหรือคนรู้จักแนะนำ</option>
          <option value="Facebook / สื่อออนไลน์">Facebook / Social Media</option>
          <option value="Walk-in หน้าร้าน">สัญจรผ่าน / Walk-in หน้าร้าน</option>
          <option value="Google Search / Maps">Google Search / Google Maps</option>
          <option value="องค์กรพันธมิตร">องค์กรพันธมิตร / ส่งต่อจากคลินิกอื่น</option>
        </select>
      </div>

      <!-- Communication Preferences -->
      <div class="border-t border-slate-100 pt-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <h4 class="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <i data-lucide="settings-2" class="w-4 h-4 text-teal-600"></i>
          <span>การตั้งค่าช่องทางติดต่อที่สะดวก (Customer Preferences)</span>
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="block text-slate-700 font-semibold mb-1">ช่องทางที่ต้องการให้ติดต่อ</label>
            <select id="form-owner-pref-channel" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
              <option value="LINE">LINE Official</option>
              <option value="PHONE">โทรศัพท์</option>
              <option value="SMS">ข้อความ SMS</option>
              <option value="EMAIL">อีเมล</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-700 font-semibold mb-1">ช่วงเวลาที่สะดวกให้ติดต่อ</label>
            <select id="form-owner-pref-time" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
              <option value="09:00 - 12:00">ช่วงเช้า (09:00 - 12:00)</option>
              <option value="13:00 - 17:00" selected>ช่วงบ่าย (13:00 - 17:00)</option>
              <option value="17:00 - 20:00">ช่วงค่ำ (17:00 - 20:00)</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-700 font-semibold mb-1">ภาษาที่ใช้สื่อสาร</label>
            <select id="form-owner-pref-lang" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
              <option value="TH" selected>ภาษาไทย (Thai)</option>
              <option value="EN">English</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Granular PDPA Consents -->
      <div class="border-t border-slate-100 pt-3 bg-teal-50/50 p-3.5 rounded-xl border border-teal-100">
        <h4 class="font-bold text-teal-900 mb-2 flex items-center gap-1.5">
          <i data-lucide="shield-check" class="w-4 h-4 text-teal-700"></i>
          <span>ความยินยอมด้านข้อมูลส่วนบุคคล (PDPA Consents)</span>
        </h4>
        <div class="space-y-2">
          <label class="flex items-start gap-2 text-slate-700 cursor-pointer">
            <input type="checkbox" id="pdpa-consent-privacy" checked disabled class="mt-0.5 text-teal-600 rounded">
            <span><strong>รับทราบประกาศความเป็นส่วนตัวและการรักษาพยาบาล</strong> (จำเป็นสำหรับการเปิดระเบียน)</span>
          </label>
          <label class="flex items-start gap-2 text-slate-700 cursor-pointer">
            <input type="checkbox" id="pdpa-consent-reminders" checked class="mt-0.5 text-teal-600 rounded">
            <span>ยินยอมรับการแจ้งเตือนเตือนนัดหมาย วัคซีน และผลตรวจทาง SMS / LINE</span>
          </label>
          <label class="flex items-start gap-2 text-slate-700 cursor-pointer">
            <input type="checkbox" id="pdpa-consent-marketing" class="mt-0.5 text-teal-600 rounded">
            <span>ยินยอมรับข้อมูลสิทธิประโยชน์ โปรโมชั่น และข่าวสารการตลาดจากคลินิก</span>
          </label>
          <label class="flex items-start gap-2 text-slate-700 cursor-pointer">
            <input type="checkbox" id="pdpa-consent-media" class="mt-0.5 text-teal-600 rounded">
            <span>ยินยอมให้บันทึกภาพถ่าย/วิดีโอสัตว์เลี้ยงเพื่อการสื่อสารของคลินิก</span>
          </label>
        </div>
      </div>
    </form>
  `;

  lucide.createIcons();
}

function toggleCustomerTypeFields(type) {
  const isJuristic = type === 'JURISTIC';
  const labelFirst = document.getElementById('label-owner-firstname');
  const wrapperLast = document.getElementById('wrapper-owner-lastname');
  if (labelFirst) labelFirst.innerText = isJuristic ? 'ชื่อนิติบุคคล / องค์กร *' : 'ชื่อจริง *';
  if (wrapperLast) {
    if (isJuristic) wrapperLast.classList.add('hidden');
    else wrapperLast.classList.remove('hidden');
  }
}

function handleLivePhoneCheck(phone) {
  const alertBox = document.getElementById('phone-duplicate-alert');
  const alertMsg = document.getElementById('phone-duplicate-msg');
  if (!alertBox || !alertMsg) return;

  const dupCustomer = checkDuplicateCustomerPhone(phone);
  if (dupCustomer) {
    alertBox.classList.remove('hidden');
    alertMsg.innerHTML = `
      <span>เบอร์โทรนี้ตรงกับลูกค้าในระบบแล้ว: <strong>${dupCustomer.display_name}</strong> (${dupCustomer.customer_code})</span>
      <button type="button" onclick="openDetailSheet('owner', ${dupCustomer.id})" class="ml-2 underline font-bold text-teal-700 hover:text-teal-900">ดูโปรไฟล์เดิม</button>
    `;
  } else {
    alertBox.classList.add('hidden');
  }
}

// -------------------------------------------------------------
// 3. NEW PET FORM (ENTERPRISE REGISTRATION WITH OWNER SELECTOR)
// -------------------------------------------------------------

function renderNewPetForm(preselectedCustomerId = null) {
  const body = document.getElementById('sheet-body');
  
  // Breeds for default Canine (1)
  const defaultBreeds = state.breedCatalog.filter(b => b.species_id === 1);

  body.innerHTML = `
    <form id="pet-registration-form" class="space-y-4" onsubmit="event.preventDefault(); submitSheetForm();">
      
      <!-- Duplicate Warning Alert Box -->
      <div id="microchip-duplicate-alert" class="hidden p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-xs flex items-start gap-2.5 animate-pulse">
        <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
        <div id="microchip-duplicate-msg"></div>
      </div>

      <!-- Owner Selection Field (Fixes hardcoded ID: 1 bug) -->
      <div class="bg-teal-50/70 p-3.5 rounded-xl border border-teal-200 space-y-2">
        <div class="flex items-center justify-between">
          <label class="block text-teal-950 font-bold flex items-center gap-1.5">
            <i data-lucide="user" class="w-4 h-4 text-teal-700"></i>
            <span>เลือกเจ้าของสัตว์เลี้ยง (Owner) *</span>
          </label>
          <button type="button" onclick="openFormSheet('owner')" class="text-[11px] font-semibold text-teal-700 hover:underline">
            + ลงทะเบียนเจ้าของใหม่
          </button>
        </div>
        <select id="form-pet-owner-id" required class="w-full bg-white border border-teal-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800">
          ${state.customers.map(c => `
            <option value="${c.id}" ${preselectedCustomerId && Number(preselectedCustomerId) === c.id ? 'selected' : ''}>
              ${c.display_name} (${c.customer_code} • ${c.phone_primary})
            </option>
          `).join('')}
        </select>
      </div>

      <!-- Pet Basic Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">ชื่อสัตว์เลี้ยง (Pet Name) *</label>
          <input type="text" id="form-pet-name" required placeholder="เช่น บราวนี่, โมจิ..." class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900">
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">ชนิดสัตว์ (Species) *</label>
          <select id="form-pet-species-id" onchange="handleSpeciesChange(this.value)" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
            ${state.speciesCatalog.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">สายพันธุ์ (Breed) *</label>
          <select id="form-pet-breed-id" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
            ${defaultBreeds.map(b => `<option value="${b.name}">${b.name}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">สีและลักษณะเด่น</label>
          <input type="text" id="form-pet-color" placeholder="เช่น น้ำตาลทอง, ขาวแต้มดำ" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">เพศ (Sex) *</label>
          <select id="form-pet-sex" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
            <option value="ผู้ (Male)">ผู้ (Male)</option>
            <option value="เมีย (Female)">เมีย (Female)</option>
            <option value="ไม่ระบุ (Unknown)">ไม่ระบุ</option>
          </select>
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">สถานะทำหมัน *</label>
          <select id="form-pet-neutered" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
            <option value="ยังไม่ทำหมัน (Intact)">ยังไม่ทำหมัน</option>
            <option value="ทำหมันแล้ว (Neutered)">ทำหมันแล้ว</option>
            <option value="ไม่ทราบ">ไม่ทราบ</option>
          </select>
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">น้ำหนักแรกรับ (kg) *</label>
          <input type="number" step="0.05" id="form-pet-weight" value="5.0" required class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-teal-700">
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">วันเกิด (Date of Birth)</label>
          <input type="date" id="form-pet-birthdate" value="2024-01-01" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
          <label class="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 cursor-pointer">
            <input type="checkbox" id="form-pet-birth-estimated" class="text-teal-600 rounded">
            <span>เป็นการประมาณอายุคร่าวๆ</span>
          </label>
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">หมายเลขไมโครชิป (Microchip No.)</label>
          <input type="text" id="form-pet-microchip" placeholder="เช่น 90021500XXXXXXX" oninput="handleLiveMicrochipCheck(this.value)" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono">
        </div>
      </div>

      <div>
        <label class="block text-slate-700 font-semibold mb-1">รูปภาพสัตว์เลี้ยง (Photo URL)</label>
        <input type="text" id="form-pet-photo" value="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
      </div>

      <!-- Medical History / Allergy Initial Notice -->
      <div class="border-t border-slate-100 pt-3">
        <label class="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
          <i data-lucide="alert-octagon" class="w-3.5 h-3.5 text-rose-500"></i>
          <span>ประวัติแพ้ยา / แพ้อาหาร (ถ้ามี)</span>
        </label>
        <input type="text" id="form-pet-initial-allergy" placeholder="เช่น แพ้ยา Enrofloxacin หรือ แพ้ไก่ (เว้นว่างได้)" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
      </div>
    </form>
  `;

  lucide.createIcons();
}

function handleSpeciesChange(speciesId) {
  const breedSelect = document.getElementById('form-pet-breed-id');
  if (!breedSelect) return;
  const breeds = state.breedCatalog.filter(b => b.species_id === Number(speciesId));
  breedSelect.innerHTML = breeds.map(b => `<option value="${b.name}">${b.name}</option>`).join('');
}

function handleLiveMicrochipCheck(chip) {
  const alertBox = document.getElementById('microchip-duplicate-alert');
  const alertMsg = document.getElementById('microchip-duplicate-msg');
  if (!alertBox || !alertMsg) return;

  const dupPet = checkDuplicateMicrochip(chip);
  if (dupPet) {
    alertBox.classList.remove('hidden');
    alertMsg.innerHTML = `
      <span>เลขไมโครชิปนี้ซ้ำกับสัตว์เลี้ยงในระบบ: <strong>${dupPet.pet_name}</strong> (${dupPet.pet_code})</span>
      <button type="button" onclick="openDetailSheet('pet', ${dupPet.id})" class="ml-2 underline font-bold text-teal-700 hover:text-teal-900">ดูโปรไฟล์</button>
    `;
  } else {
    alertBox.classList.add('hidden');
  }
}

// -------------------------------------------------------------
// 4. 360° CUSTOMER PROFILE SHEET (WITH TABS & EDIT MODE)
// -------------------------------------------------------------

function renderOwnerDetailSheet(customerId, activeTab = 'overview') {
  window.activeOwnerSheetTab = activeTab;
  const c = getCustomerById(customerId);
  if (!c) return;

  const pets = getPetsForCustomer(c.id);
  const appointments = (state.appointments || []).filter(a => a.customer_id === c.id);
  const invoices = (state.invoices || []).filter(inv => inv.customer_id === c.id);
  const membership = (state.crmMemberships || []).find(m => m.customer_id === c.id);

  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  title.innerText = c.display_name;
  subtitle.innerText = `รหัสลูกค้า: ${c.customer_code} • ${c.customer_type === 'JURISTIC' ? 'นิติบุคคล' : 'บุคคลธรรมดา'}`;

  footer.classList.remove('hidden');
  footer.innerHTML = `
    <div class="w-full flex items-center justify-between">
      <button onclick="openFormSheet('pet', null, ${c.id})" class="px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
        <span>+ เพิ่มสัตว์เลี้ยงให้ลูกค้ารายนี้</span>
      </button>
      <div class="flex items-center gap-2">
        <button onclick="openFormSheet('owner-edit', ${c.id})" class="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
          <span>แก้ไขข้อมูล</span>
        </button>
        <button onclick="closeSheet()" class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer">
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  `;

  body.innerHTML = `
    <div class="space-y-4">
      
      <!-- Profile Header Summary Banner -->
      <div class="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200/80 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-14 h-14 rounded-2xl bg-teal-600 text-white font-bold flex items-center justify-center text-xl shadow-md shrink-0">
            ${c.first_name ? c.first_name.charAt(0) : 'U'}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-slate-900 text-base">${c.display_name}</h3>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}">${c.status}</span>
            </div>
            <p class="text-xs text-slate-600 mt-0.5">${c.first_name} ${c.last_name || ''} • เบอร์: <strong>${c.phone_primary}</strong></p>
          </div>
        </div>
        ${membership ? `
          <div class="text-right shrink-0">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">${membership.membership_level} MEMBER</span>
            <div class="text-xs font-bold text-slate-800 mt-1">${membership.points_balance.toLocaleString()} แต้ม</div>
          </div>
        ` : ''}
      </div>

      <!-- Tab Navigation -->
      <div class="flex border-b border-slate-200 text-xs font-semibold space-x-1">
        <button onclick="renderOwnerDetailSheet(${c.id}, 'overview')" class="px-3.5 py-2.5 border-b-2 ${activeTab === 'overview' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'} transition cursor-pointer flex items-center gap-1.5">
          <i data-lucide="user" class="w-3.5 h-3.5"></i>
          <span>ข้อมูลทั่วไป</span>
        </button>
        <button onclick="renderOwnerDetailSheet(${c.id}, 'pets')" class="px-3.5 py-2.5 border-b-2 ${activeTab === 'pets' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'} transition cursor-pointer flex items-center gap-1.5">
          <i data-lucide="paw-print" class="w-3.5 h-3.5"></i>
          <span>สัตว์เลี้ยง (${pets.length})</span>
        </button>
        <button onclick="renderOwnerDetailSheet(${c.id}, 'history')" class="px-3.5 py-2.5 border-b-2 ${activeTab === 'history' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'} transition cursor-pointer flex items-center gap-1.5">
          <i data-lucide="clock" class="w-3.5 h-3.5"></i>
          <span>ประวัติบริการ & การเงิน</span>
        </button>
        <button onclick="renderOwnerDetailSheet(${c.id}, 'pdpa')" class="px-3.5 py-2.5 border-b-2 ${activeTab === 'pdpa' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'} transition cursor-pointer flex items-center gap-1.5">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          <span>ความยินยอม PDPA</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="mt-4">
        ${activeTab === 'overview' ? `
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div><span class="text-slate-400 block text-[11px]">รหัสลูกค้า</span><span class="font-bold text-slate-800 font-mono">${c.customer_code}</span></div>
              <div><span class="text-slate-400 block text-[11px]">ประเภท</span><span class="font-bold text-slate-800">${c.customer_type === 'JURISTIC' ? 'นิติบุคคล' : 'บุคคลธรรมดา'}</span></div>
              <div><span class="text-slate-400 block text-[11px]">เลขประจำตัวผู้เสียภาษี</span><span class="font-semibold text-slate-800">${c.tax_id || '-'}</span></div>
              <div><span class="text-slate-400 block text-[11px]">วันที่ลงทะเบียน</span><span class="font-semibold text-slate-800">${c.registered_at || '-'}</span></div>
              <div><span class="text-slate-400 block text-[11px]">ช่องทางที่รู้จัก</span><span class="font-semibold text-slate-800">${c.referral_source || '-'}</span></div>
              <div><span class="text-slate-400 block text-[11px]">LINE ID</span><span class="font-semibold text-emerald-600">${c.line_id || '-'}</span></div>
            </div>

            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <h4 class="font-bold text-slate-800 flex items-center gap-1.5">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-teal-600"></i>
                <span>ที่อยู่ตามทะเบียน / ออกเอกสาร</span>
              </h4>
              <p class="text-slate-700">${c.address_line} ${c.subdistrict ? `แขวง/ตำบล ${c.subdistrict}` : ''} เขต/อำเภอ ${c.district} จังหวัด ${c.province} ${c.postal_code}</p>
            </div>
          </div>
        ` : activeTab === 'pets' ? `
          <div class="space-y-3">
            ${pets.map(p => `
              <div class="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between hover:border-teal-400 transition">
                <div class="flex items-center gap-3">
                  <img src="${p.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300'}" class="w-12 h-12 rounded-xl object-cover border border-slate-200">
                  <div>
                    <h4 class="font-bold text-slate-900 cursor-pointer hover:text-teal-600" onclick="openDetailSheet('pet', ${p.id})">${p.pet_name}</h4>
                    <p class="text-[11px] text-slate-500">${p.species} • ${p.breed} • น้ำหนัก ${p.current_weight} kg</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button onclick="openDetailSheet('pet', ${p.id})" class="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition cursor-pointer">
                    ดูประวัติสัตว์
                  </button>
                  <button onclick="startConsultationDirectly(${p.id})" class="text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition cursor-pointer">
                    เปิดห้องตรวจ EMR
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : activeTab === 'history' ? `
          <div class="space-y-3">
            <h4 class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <i data-lucide="receipt" class="w-3.5 h-3.5 text-teal-600"></i>
              <span>ประวัติการชำระเงินและบิลค่ารักษา (${invoices.length})</span>
            </h4>
            ${invoices.length > 0 ? invoices.map(inv => `
              <div class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span class="font-mono font-bold text-slate-800 text-xs">${inv.invoice_number}</span>
                  <span class="text-[11px] text-slate-400 block">${inv.invoice_date}</span>
                </div>
                <div class="text-right">
                  <span class="font-bold text-teal-700 text-xs">฿${inv.total_amount?.toLocaleString()}</span>
                  <span class="text-[10px] block font-semibold ${inv.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}">${inv.status === 'PAID' ? 'ชำระแล้ว' : 'รอชำระ'}</span>
                </div>
              </div>
            `).join('') : '<p class="text-xs text-slate-400 italic">ไม่มีประวัติการชำระเงิน</p>'}

            <h4 class="font-bold text-slate-800 text-xs flex items-center gap-1.5 mt-4">
              <i data-lucide="calendar" class="w-3.5 h-3.5 text-teal-600"></i>
              <span>ประวัตินัดหมาย (${appointments.length})</span>
            </h4>
            ${appointments.length > 0 ? appointments.map(apt => `
              <div class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span class="font-bold text-slate-800 text-xs">${apt.appointment_type}</span>
                  <span class="text-[11px] text-slate-400 block">วันที่: ${apt.scheduled_date} (${apt.scheduled_time})</span>
                </div>
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">${apt.status}</span>
              </div>
            `).join('') : '<p class="text-xs text-slate-400 italic">ไม่มีประวัตินัดหมาย</p>'}
          </div>
        ` : activeTab === 'pdpa' ? `
          <div class="space-y-4">
            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
              <p class="font-bold">พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)</p>
              <p class="text-[11px] mt-0.5 text-emerald-700">ลูกค้าสามารถขอเปิดใช้งานหรือถอนความยินยอมได้ตลอดเวลา โดยการถอนความยินยอมจะไม่กระทบต่อการให้บริการรักษาพยาบาลสัตว์</p>
            </div>

            <div class="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
              ${[
                { key: 'privacy_policy', title: 'ประกาศความเป็นส่วนตัวและการรักษาพยาบาล', req: true, desc: 'เพื่อการเปิดเวชระเบียนและจัดเก็บประวัติการรักษา' },
                { key: 'service_reminders', title: 'แจ้งเตือนนัดหมาย วัคซีน และผลตรวจทางแล็บ', req: false, desc: 'ส่งข้อความเตือนผ่าน SMS / LINE Official' },
                { key: 'marketing_promo', title: 'ข่าวสารสิทธิประโยชน์ โปรโมชั่น และกิจกรรมพิเศษ', req: false, desc: 'ข้อเสนอพิเศษและส่วนลดบริการ' },
                { key: 'media_pr', title: 'การเผยแพร่ภาพถ่าย/วิดีโอสัตว์เลี้ยงเพื่อการสื่อสาร', req: false, desc: 'ใช้ภาพในสื่อโซเชียลมีเดียของคลินิก' },
                { key: 'insurance_sharing', title: 'การเปิดเผยข้อมูลแก่บริษัทประกันภัยสัตว์เลี้ยง', req: false, desc: 'ประสานงานเคลมค่ารักษาพยาบาล' }
              ].map(item => {
                const consent = c.consents?.[item.key];
                const isGranted = consent?.granted;
                return `
                  <div class="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition">
                    <div>
                      <div class="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                        <span>${item.title}</span>
                        ${item.req ? '<span class="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded">จำเป็น</span>' : ''}
                      </div>
                      <p class="text-[11px] text-slate-400 mt-0.5">${item.desc}</p>
                      ${consent?.updated_at ? `<span class="text-[10px] text-slate-400 block mt-1">อัปเดตล่าสุด: ${consent.updated_at}</span>` : ''}
                    </div>
                    <div>
                      <button onclick="handleToggleConsent(${c.id}, '${item.key}')" ${item.req ? 'disabled' : ''} class="px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${isGranted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}">
                        ${isGranted ? 'ยินยอมแล้ว' : 'ไม่ยินยอม'}
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Audit History Log -->
            <div>
              <h4 class="font-bold text-slate-800 text-xs mb-2">ประวัติการเปลี่ยนแปลงความยินยอม (Consent Audit Trail)</h4>
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px] text-slate-600 max-h-36 overflow-y-auto">
                ${(c.consent_history || []).map(h => `
                  <div class="flex items-center justify-between border-b border-slate-200/60 pb-1">
                    <span>${h.timestamp} - [${h.purpose}]</span>
                    <span class="font-bold ${h.action === 'GRANTED' ? 'text-emerald-600' : 'text-rose-600'}">${h.action} (${h.channel})</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  lucide.createIcons();
}

function handleToggleConsent(customerId, purposeKey) {
  const c = getCustomerById(customerId);
  if (!c || !c.consents) return;

  const current = c.consents[purposeKey]?.granted;
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
  
  c.consents[purposeKey] = {
    granted: !current,
    updated_at: now,
    version: 'v1.2'
  };

  c.consent_history = c.consent_history || [];
  c.consent_history.unshift({
    purpose: purposeKey,
    action: !current ? 'GRANTED' : 'WITHDRAWN',
    timestamp: now,
    channel: 'SYSTEM_TOGGLE'
  });

  showToast('อัปเดตสิทธิ์ PDPA สำเร็จ', `เปลี่ยนสถานะ ${purposeKey} เป็น: ${!current ? 'ยินยอม' : 'ถอนความยินยอม'}`, 'success');
  renderOwnerDetailSheet(customerId, 'pdpa');
}

// -------------------------------------------------------------
// 5. 360° PET PROFILE SHEET (WITH INTERACTIVE TABS & SVG CHART)
// -------------------------------------------------------------

function renderPetDetailSheet(petId, activeTab = 'overview') {
  window.activePetSheetTab = activeTab;
  const p = getPetById(petId);
  if (!p) return;

  const primaryOwner = getPrimaryOwnerForPet(p.id);
  const ownerships = getOwnershipsForPet(p.id);
  const weights = p.weights_history || [];
  const vaccines = p.vaccinations || [];
  const allergies = p.allergies_detail || [];
  const chronic = p.chronic_conditions_detail || [];

  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  title.innerText = p.pet_name;
  subtitle.innerText = `รหัสสัตว์: ${p.pet_code} • ${p.species} (${p.breed})`;

  footer.classList.remove('hidden');
  footer.innerHTML = `
    <div class="w-full flex items-center justify-between">
      <button onclick="startConsultationDirectly(${p.id})" class="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="stethoscope" class="w-4 h-4"></i>
        <span>เปิดห้องตรวจ EMR</span>
      </button>
      <div class="flex items-center gap-2">
        <button onclick="openFormSheet('pet-edit', ${p.id})" class="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
          <span>แก้ไขข้อมูล</span>
        </button>
        <button onclick="closeSheet()" class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer">
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  `;

  // SVG Weight Trend Generator
  let chartSvg = '';
  if (weights.length >= 2) {
    const minW = Math.min(...weights.map(w => w.weight)) - 0.5;
    const maxW = Math.max(...weights.map(w => w.weight)) + 0.5;
    const range = (maxW - minW) || 1;
    const chartW = 460;
    const chartH = 120;
    const padding = 20;

    const points = weights.map((w, idx) => {
      const x = padding + (idx / (weights.length - 1)) * (chartW - padding * 2);
      const y = chartH - padding - ((w.weight - minW) / range) * (chartH - padding * 2);
      return { x, y, weight: w.weight, date: w.date };
    });

    const polylineStr = points.map(pt => `${pt.x},${pt.y}`).join(' ');

    chartSvg = `
      <div class="bg-white p-3.5 rounded-xl border border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <i data-lucide="trending-up" class="w-3.5 h-3.5 text-teal-600"></i>
            <span>กราฟแนวโน้มน้ำหนักตัว (Weight Growth Trend)</span>
          </span>
          <span class="text-[11px] font-bold text-teal-700">ล่าสุด: ${p.current_weight} กก.</span>
        </div>
        <svg viewBox="0 0 ${chartW} ${chartH}" class="w-full h-32 overflow-visible">
          <!-- Guide lines -->
          <line x1="${padding}" y1="${chartH - padding}" x2="${chartW - padding}" y2="${chartH - padding}" stroke="#e2e8f0" stroke-dasharray="3,3" />
          <line x1="${padding}" y1="${padding}" x2="${chartW - padding}" y2="${padding}" stroke="#e2e8f0" stroke-dasharray="3,3" />
          <!-- Trend line -->
          <polyline fill="none" stroke="#0d9488" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${polylineStr}" />
          <!-- Points -->
          ${points.map(pt => `
            <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="#0d9488" stroke="#ffffff" stroke-width="2" />
            <text x="${pt.x}" y="${pt.y - 8}" font-size="10" font-weight="bold" fill="#0f766e" text-anchor="middle">${pt.weight}</text>
            <text x="${pt.x}" y="${chartH - 4}" font-size="9" fill="#94a3b8" text-anchor="middle">${pt.date.slice(5)}</text>
          `).join('')}
        </svg>
      </div>
    `;
  }

  body.innerHTML = `
    <div class="space-y-4">
      
      <!-- Top Pet Hero Banner -->
      <div class="p-4 bg-gradient-to-r from-teal-50 to-slate-50 rounded-2xl border border-teal-200/80 flex items-start gap-4">
        <img src="${p.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300'}" class="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md shrink-0">
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-slate-900 text-base truncate">${p.pet_name}</h3>
            <span class="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">${p.pet_code}</span>
          </div>
          <p class="text-xs text-slate-600 mt-0.5">${p.species} • ${p.breed} • ${p.sex}</p>
          <div class="flex items-center gap-2 mt-2 flex-wrap">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">${p.current_weight} kg</span>
            <span class="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">${calculateAge(p.birth_date)}</span>
            ${p.reproductive_status?.includes('ทำหมันแล้ว') ? '<span class="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">ทำหมันแล้ว</span>' : ''}
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="flex border-b border-slate-200 text-xs font-semibold space-x-1 overflow-x-auto">
        <button onclick="renderPetDetailSheet(${p.id}, 'overview')" class="px-3.5 py-2.5 border-b-2 ${activeTab === 'overview' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'} transition cursor-pointer flex items-center gap-1.5 shrink-0">
          <i data-lucide="info" class="w-3.5 h-3.5"></i>
          <span>ข้อมูลทั่วไป</span>
        </button>
        <button onclick="renderPetDetailSheet(${p.id}, 'weights')" class="px-3.5 py-2.5 border-b-2 ${activeTab === 'weights' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'} transition cursor-pointer flex items-center gap-1.5 shrink-0">
          <i data-lucide="scale" class="w-3.5 h-3.5"></i>
          <span>ประวัติน้ำหนัก (${weights.length})</span>
        </button>
        <button onclick="renderPetDetailSheet(${p.id}, 'vaccines')" class="px-3.5 py-2.5 border-b-2 ${activeTab === 'vaccines' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'} transition cursor-pointer flex items-center gap-1.5 shrink-0">
          <i data-lucide="syringe" class="w-3.5 h-3.5"></i>
          <span>สมุดวัคซีน (${vaccines.length})</span>
        </button>
        <button onclick="renderPetDetailSheet(${p.id}, 'alerts')" class="px-3.5 py-2.5 border-b-2 ${activeTab === 'alerts' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'} transition cursor-pointer flex items-center gap-1.5 shrink-0">
          <i data-lucide="alert-octagon" class="w-3.5 h-3.5"></i>
          <span>แพ้ยา/โรคเรื้อรัง (${allergies.length + chronic.length})</span>
        </button>
        <button onclick="renderPetDetailSheet(${p.id}, 'owners')" class="px-3.5 py-2.5 border-b-2 ${activeTab === 'owners' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'} transition cursor-pointer flex items-center gap-1.5 shrink-0">
          <i data-lucide="users" class="w-3.5 h-3.5"></i>
          <span>เจ้าของและผู้ดูแล (${ownerships.length})</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="mt-4">
        ${activeTab === 'overview' ? `
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div><span class="text-slate-400 block text-[11px]">หมายเลขไมโครชิป</span><span class="font-bold text-slate-800 font-mono">${p.microchip_number || 'ไม่มีไมโครชิป'}</span></div>
              <div><span class="text-slate-400 block text-[11px]">วันเกิด</span><span class="font-semibold text-slate-800">${p.birth_date} ${p.birth_date_is_estimated ? '(ประมาณ)' : ''}</span></div>
              <div><span class="text-slate-400 block text-[11px]">สีและลักษณะ</span><span class="font-semibold text-slate-800">${p.color || '-'}</span></div>
              <div><span class="text-slate-400 block text-[11px]">สถานะการสืบพันธุ์</span><span class="font-semibold text-slate-800">${p.reproductive_status}</span></div>
              <div><span class="text-slate-400 block text-[11px]">สถานะสัตว์</span><span class="font-bold text-emerald-700">${p.status}</span></div>
              <div><span class="text-slate-400 block text-[11px]">เจ้าของหลัก</span><span class="font-bold text-teal-700 cursor-pointer hover:underline" onclick="openDetailSheet('owner', ${primaryOwner?.id})">${primaryOwner?.display_name || '-'}</span></div>
            </div>

            ${p.allergies?.length > 0 ? `
              <div class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
                <div class="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                  <i data-lucide="alert-octagon" class="w-4 h-4 text-rose-600"></i>
                  <span>คำเตือนการแพ้ยาทางการแพทย์ (Medical Allergy Alert)</span>
                </div>
                <p class="text-xs text-rose-700 mt-1 font-medium">${p.allergies[0]}</p>
              </div>
            ` : ''}
          </div>
        ` : activeTab === 'weights' ? `
          <div class="space-y-4">
            ${chartSvg}

            <!-- Add Weight Quick Form -->
            <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <h4 class="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
                <i data-lucide="plus" class="w-3.5 h-3.5 text-teal-600"></i>
                <span>บันทึกการชั่งน้ำหนักใหม่</span>
              </h4>
              <div class="grid grid-cols-3 gap-2">
                <input type="number" step="0.05" id="new-weight-val" placeholder="น้ำหนัก (กก.)" class="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-teal-700">
                <input type="date" id="new-weight-date" value="${new Date().toISOString().slice(0, 10)}" class="bg-white border border-slate-200 rounded-lg p-2 text-xs">
                <button type="button" onclick="handleAddWeightRecord(${p.id})" class="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition cursor-pointer">
                  บันทึก
                </button>
              </div>
            </div>

            <!-- Weight Log Table -->
            <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-semibold">
                  <tr>
                    <th class="px-4 py-2.5">วันที่ชั่ง</th>
                    <th class="px-4 py-2.5">น้ำหนักตัว (kg)</th>
                    <th class="px-4 py-2.5">ผู้บันทึก</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${weights.slice().reverse().map(w => `
                    <tr>
                      <td class="px-4 py-2 text-slate-800 font-medium">${w.date}</td>
                      <td class="px-4 py-2 font-bold text-teal-700">${w.weight} kg</td>
                      <td class="px-4 py-2 text-slate-500">${w.measured_by || 'เจ้าหน้าที่คลินิก'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : activeTab === 'vaccines' ? `
          <div class="space-y-4">
            
            <!-- Quick Add Vaccine Form -->
            <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <h4 class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <i data-lucide="plus-circle" class="w-3.5 h-3.5 text-teal-600"></i>
                <span>บันทึกประวัติวัคซีน (รวมที่ฉีดจากที่อื่น)</span>
              </h4>
              <div class="grid grid-cols-2 gap-2">
                <input type="text" id="new-vac-name" placeholder="ชื่อวัคซีน (เช่น Rabies, DHPPiL)" class="bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold">
                <input type="text" id="new-vac-clinic" placeholder="สถานพยาบาล (เช่น VETCARE+)" class="bg-white border border-slate-200 rounded-lg p-2 text-xs">
              </div>
              <div class="grid grid-cols-3 gap-2">
                <input type="date" id="new-vac-date" value="${new Date().toISOString().slice(0, 10)}" title="วันที่ฉีด" class="bg-white border border-slate-200 rounded-lg p-2 text-xs">
                <input type="date" id="new-vac-nextdue" value="2027-03-02" title="นัดเข็มถัดไป" class="bg-white border border-slate-200 rounded-lg p-2 text-xs">
                <button type="button" onclick="handleAddVaccineRecord(${p.id})" class="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition cursor-pointer">
                  + บันทึกวัคซีน
                </button>
              </div>
            </div>

            <!-- Vaccine Cards -->
            <div class="space-y-3">
              ${vaccines.map(v => `
                <div class="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div class="flex items-start justify-between">
                    <div>
                      <h4 class="font-bold text-slate-900 text-xs">${v.vaccine_name}</h4>
                      <p class="text-[11px] text-slate-500 mt-0.5">วันที่ฉีด: <strong>${v.administered_date}</strong> • โดย: ${v.veterinarian || 'สัตวแพทย์'}</p>
                      <p class="text-[11px] text-slate-400 mt-0.5">${v.clinic} • Lot: <span class="font-mono">${v.batch_lot || '-'}</span></p>
                    </div>
                    ${v.next_due_date ? `
                      <span class="text-[10px] font-bold px-2 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                        นัดเข็มถัดไป: ${v.next_due_date}
                      </span>
                    ` : ''}
                  </div>
                  ${v.reaction_notes ? `<div class="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded">หมายเหตุ: ${v.reaction_notes}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : activeTab === 'alerts' ? `
          <div class="space-y-4">
            
            <!-- Quick Add Allergy Form -->
            <div class="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200 space-y-2">
              <h4 class="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                <i data-lucide="plus-circle" class="w-3.5 h-3.5 text-rose-600"></i>
                <span>เพิ่มประวัติการแพ้ยา / แพ้อาหาร</span>
              </h4>
              <div class="grid grid-cols-2 gap-2">
                <input type="text" id="new-allergy-name" placeholder="ชื่อยาหรือสารที่แพ้ (เช่น Amoxicillin)" class="bg-white border border-rose-200 rounded-lg p-2 text-xs">
                <select id="new-allergy-severity" class="bg-white border border-rose-200 rounded-lg p-2 text-xs font-semibold">
                  <option value="MILD">🟢 เล็กน้อย (Mild)</option>
                  <option value="MODERATE" selected>🟡 ปานกลาง (Moderate)</option>
                  <option value="SEVERE">🔴 รุนแรง (Severe - Anaphylaxis)</option>
                </select>
              </div>
              <div class="flex gap-2">
                <input type="text" id="new-allergy-notes" placeholder="อาการที่พบ เช่น บวม ผื่น หายใจขัด..." class="flex-1 bg-white border border-rose-200 rounded-lg p-2 text-xs">
                <button type="button" onclick="handleAddAllergyRecord(${p.id})" class="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 rounded-lg text-xs transition cursor-pointer">
                  บันทึก
                </button>
              </div>
            </div>

            <!-- Allergies List -->
            <div class="space-y-3">
              <h4 class="font-bold text-slate-800 text-xs">รายการแพ้ยาและสารเคมี (${allergies.length})</h4>
              ${allergies.length > 0 ? allergies.map(al => `
                <div class="p-3.5 bg-white rounded-xl border border-rose-200 shadow-xs">
                  <div class="flex items-center justify-between">
                    <h5 class="font-bold text-rose-800 text-xs flex items-center gap-1.5">
                      <i data-lucide="alert-octagon" class="w-3.5 h-3.5 text-rose-600"></i>
                      <span>${al.allergen}</span>
                    </h5>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded ${al.severity === 'SEVERE' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}">
                      ${al.severity}
                    </span>
                  </div>
                  <p class="text-xs text-slate-600 mt-1.5">${al.notes}</p>
                  <p class="text-[10px] text-slate-400 mt-1">วินิจฉัยโดย: ${al.diagnosed_by || 'สัตวแพทย์'} • วันที่: ${al.onset_date}</p>
                </div>
              `).join('') : '<p class="text-xs text-slate-400 italic">ไม่มีประวัติการแพ้ยา</p>'}

              <h4 class="font-bold text-slate-800 text-xs mt-4">โรคประจำตัว & ภาวะเรื้อรัง (${chronic.length})</h4>
              ${chronic.length > 0 ? chronic.map(ch => `
                <div class="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs">
                  <div class="flex items-center justify-between">
                    <h5 class="font-bold text-amber-900 text-xs">${ch.condition_name}</h5>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">${ch.status}</span>
                  </div>
                  <p class="text-xs text-slate-600 mt-1.5">${ch.notes}</p>
                </div>
              `).join('') : '<p class="text-xs text-slate-400 italic">ไม่มีบันทึกโรคประจำตัว</p>'}
            </div>
          </div>
        ` : activeTab === 'owners' ? `
          <div class="space-y-4">
            
            <!-- Primary Owner Card -->
            <div class="p-4 bg-teal-50/80 rounded-xl border border-teal-200">
              <span class="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">เจ้าของหลัก (Primary Owner)</span>
              ${primaryOwner ? `
                <div class="mt-2.5 flex items-start justify-between">
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm cursor-pointer hover:text-teal-700" onclick="openDetailSheet('owner', ${primaryOwner.id})">${primaryOwner.display_name}</h4>
                    <p class="text-xs text-slate-600 mt-0.5">เบอร์โทร: <strong>${primaryOwner.phone_primary}</strong></p>
                    <p class="text-xs text-slate-500 mt-0.5">${primaryOwner.address_line}, ${primaryOwner.province}</p>
                  </div>
                  <button onclick="openDetailSheet('owner', ${primaryOwner.id})" class="text-xs font-semibold text-teal-700 hover:underline">ดูโปรไฟล์</button>
                </div>
              ` : '<p class="text-xs text-slate-400 mt-1">ยังไม่มีเจ้าของหลัก</p>'}
            </div>

            <!-- Co-owners & Caregivers -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-slate-800 text-xs">เจ้าของร่วมและผู้ดูแล (Co-owners & Caregivers)</h4>
                <button type="button" onclick="showAddCoOwnerInline(${p.id})" class="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-1">
                  <i data-lucide="user-plus" class="w-3.5 h-3.5"></i> + เพิ่มเจ้าของร่วม
                </button>
              </div>

              <div id="inline-add-coowner-container" class="hidden p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label class="block text-slate-700 font-semibold text-[11px]">เลือกลูกค้าในระบบเพื่อเป็นเจ้าของร่วม</label>
                <select id="select-coowner-customer-id" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
                  ${state.customers.filter(c => c.id !== primaryOwner?.id).map(c => `
                    <option value="${c.id}">${c.display_name} (${c.phone_primary})</option>
                  `).join('')}
                </select>
                <input type="text" id="input-coowner-relation" placeholder="ความสัมพันธ์ เช่น สมาชิกครอบครัว, ผู้พามารักษา" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
                <div class="flex justify-end gap-2">
                  <button type="button" onclick="document.getElementById('inline-add-coowner-container').classList.add('hidden')" class="px-3 py-1 rounded text-xs text-slate-600 hover:bg-slate-200">ยกเลิก</button>
                  <button type="button" onclick="handleAddCoOwner(${p.id})" class="px-3 py-1 rounded text-xs bg-teal-600 text-white font-bold">บันทึกเจ้าของร่วม</button>
                </div>
              </div>

              ${ownerships.filter(o => !o.is_primary).map(o => `
                <div class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 class="font-bold text-slate-900 text-xs cursor-pointer hover:text-teal-600" onclick="openDetailSheet('owner', ${o.customer?.id})">${o.customer?.display_name || 'ลูกค้า'}</h5>
                    <p class="text-[11px] text-slate-500">${o.relationship_title || 'เจ้าของร่วม'} • โทร: ${o.customer?.phone_primary}</p>
                  </div>
                  <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">เจ้าของร่วม</span>
                </div>
              `).join('')}
            </div>

            <!-- Ownership Transfer Workflow -->
            <div class="border-t border-slate-100 pt-3">
              <button type="button" onclick="showTransferOwnershipInline(${p.id})" class="w-full py-2 px-3 border border-amber-300 bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer">
                <i data-lucide="arrow-right-left" class="w-3.5 h-3.5 text-amber-700"></i>
                <span>โอนย้ายความเป็นเจ้าของสัตว์เลี้ยง (Transfer Ownership)</span>
              </button>

              <div id="inline-transfer-container" class="hidden mt-3 p-3.5 bg-amber-50/90 border border-amber-300 rounded-xl space-y-2.5">
                <h5 class="font-bold text-amber-950 text-xs">แบบฟอร์มโอนย้ายสิทธิ์ความเป็นเจ้าของ</h5>
                <div>
                  <label class="block text-amber-900 font-semibold text-[11px] mb-1">โอนให้แก่ลูกค้าใหม่ (New Owner) *</label>
                  <select id="transfer-to-customer-id" class="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs">
                    ${state.customers.filter(c => c.id !== primaryOwner?.id).map(c => `
                      <option value="${c.id}">${c.display_name} (${c.phone_primary})</option>
                    `).join('')}
                  </select>
                </div>
                <div>
                  <label class="block text-amber-900 font-semibold text-[11px] mb-1">เหตุผลการโอนย้าย / เอกสารประกอบ *</label>
                  <input type="text" id="transfer-reason" placeholder="เช่น ย้ายบ้าน, เปลี่ยนผู้ดูแลหลัก หรือส่งมอบสัตว์" class="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs">
                </div>
                <div class="flex justify-end gap-2 pt-1">
                  <button type="button" onclick="document.getElementById('inline-transfer-container').classList.add('hidden')" class="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-200">ยกเลิก</button>
                  <button type="button" onclick="handleTransferOwnership(${p.id})" class="px-4 py-1.5 rounded-lg text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold">ยืนยันการโอนสิทธิ์</button>
                </div>
              </div>
            </div>

          </div>
        ` : ''}
      </div>
    </div>
  `;

  lucide.createIcons();
}

function handleAddWeightRecord(petId) {
  const p = getPetById(petId);
  const val = parseFloat(document.getElementById('new-weight-val')?.value);
  const date = document.getElementById('new-weight-date')?.value || new Date().toISOString().slice(0, 10);

  if (!val || isNaN(val)) return alert('กรุณากรอกน้ำหนักตัวให้ถูกต้อง');

  p.weights_history = p.weights_history || [];
  p.weights_history.push({
    date: date,
    weight: val,
    measured_by: 'น.สพ. วุฒิชัย'
  });
  p.current_weight = val;

  showToast('บันทึกน้ำหนักสำเร็จ', `อัปเดตน้ำหนักของ ${p.pet_name} เป็น ${val} กก.`, 'success');
  renderPetDetailSheet(petId, 'weights');
  renderCurrentView();
}

function handleAddVaccineRecord(petId) {
  const p = getPetById(petId);
  const name = document.getElementById('new-vac-name')?.value.trim();
  const clinic = document.getElementById('new-vac-clinic')?.value.trim() || 'VETCARE+';
  const date = document.getElementById('new-vac-date')?.value;
  const nextdue = document.getElementById('new-vac-nextdue')?.value;

  if (!name) return alert('กรุณาระบุชื่อวัคซีน');

  p.vaccinations = p.vaccinations || [];
  p.vaccinations.push({
    id: p.vaccinations.length + 1,
    vaccine_name: name,
    administered_date: date,
    batch_lot: `LOT-${Date.now().toString().slice(-4)}`,
    clinic: clinic,
    veterinarian: 'สัตวแพทย์',
    next_due_date: nextdue,
    reaction_notes: 'บันทึกผ่านหน้าเวชระเบียนสัตว์'
  });

  showToast('บันทึกวัคซีนสำเร็จ', `เพิ่มประวัติ ${name} เรียบร้อยแล้ว`, 'success');
  renderPetDetailSheet(petId, 'vaccines');
}

function handleAddAllergyRecord(petId) {
  const p = getPetById(petId);
  const name = document.getElementById('new-allergy-name')?.value.trim();
  const sev = document.getElementById('new-allergy-severity')?.value || 'MODERATE';
  const notes = document.getElementById('new-allergy-notes')?.value.trim();

  if (!name) return alert('กรุณาระบุชื่อสารที่แพ้');

  p.allergies_detail = p.allergies_detail || [];
  p.allergies_detail.push({
    id: p.allergies_detail.length + 1,
    allergen: name,
    category: 'DRUG',
    severity: sev,
    onset_date: new Date().toISOString().slice(0, 10),
    status: 'CONFIRMED',
    diagnosed_by: 'น.สพ. วุฒิชัย',
    notes: notes || 'บันทึกเฝ้าระวัง'
  });

  p.allergies = p.allergies || [];
  p.allergies.push(`แพ้: ${name} (${sev})`);

  showToast('บันทึกการแพ้ยาสำเร็จ', `เพิ่มคำเตือนแพ้ ${name} แล้ว`, 'success');
  renderPetDetailSheet(petId, 'alerts');
  renderCurrentView();
}

function showAddCoOwnerInline(petId) {
  const el = document.getElementById('inline-add-coowner-container');
  if (el) el.classList.toggle('hidden');
}

function handleAddCoOwner(petId) {
  const customerId = Number(document.getElementById('select-coowner-customer-id')?.value);
  const relation = document.getElementById('input-coowner-relation')?.value.trim() || 'เจ้าของร่วม';

  state.ownerships.push({
    id: state.ownerships.length + 1,
    pet_id: petId,
    customer_id: customerId,
    ownership_type: 'CO_OWNER',
    is_primary: false,
    relationship_title: relation,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: null,
    can_give_consent: true,
    notes: ''
  });

  showToast('เพิ่มเจ้าของร่วมสำเร็จ', 'บันทึกเจ้าของร่วมเรียบร้อยแล้ว', 'success');
  renderPetDetailSheet(petId, 'owners');
  renderCurrentView();
}

function showTransferOwnershipInline(petId) {
  const el = document.getElementById('inline-transfer-container');
  if (el) el.classList.toggle('hidden');
}

function handleTransferOwnership(petId) {
  const toCustomerId = Number(document.getElementById('transfer-to-customer-id')?.value);
  const reason = document.getElementById('transfer-reason')?.value.trim() || 'โอนย้ายสิทธิ์ตามคำขอ';

  const oldPrimary = state.ownerships.find(o => o.pet_id === petId && o.is_primary);
  if (oldPrimary) {
    oldPrimary.is_primary = false;
    oldPrimary.end_date = new Date().toISOString().slice(0, 10);
    oldPrimary.ownership_type = 'PREVIOUS_OWNER';
  }

  state.ownerships.push({
    id: state.ownerships.length + 1,
    pet_id: petId,
    customer_id: toCustomerId,
    ownership_type: 'PRIMARY',
    is_primary: true,
    relationship_title: 'เจ้าของหลัก (รับโอน)',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: null,
    can_give_consent: true,
    notes: `โอนจากลูกค้า ID ${oldPrimary?.customer_id || '-'}: ${reason}`
  });

  state.ownershipTransfers = state.ownershipTransfers || [];
  state.ownershipTransfers.push({
    id: state.ownershipTransfers.length + 1,
    pet_id: petId,
    from_customer_id: oldPrimary ? oldPrimary.customer_id : null,
    to_customer_id: toCustomerId,
    transfer_date: new Date().toISOString().slice(0, 10),
    reason: reason,
    authorized_by: 'น.สพ. วุฒิชัย เจริญสุข'
  });

  showToast('โอนย้ายความเป็นเจ้าของสำเร็จ!', `เปลี่ยนเจ้าของหลักให้ ${getPetById(petId)?.pet_name} แล้ว`, 'success');
  renderPetDetailSheet(petId, 'owners');
  renderCurrentView();
}

// -------------------------------------------------------------
// 6. EDIT FORMS (CUSTOMER & PET IN-SHEET EDIT MODE)
// -------------------------------------------------------------

function renderOwnerEditForm(customerId) {
  const c = getCustomerById(customerId);
  if (!c) return;

  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  title.innerText = `แก้ไขข้อมูล: ${c.display_name}`;
  subtitle.innerText = `รหัสลูกค้า: ${c.customer_code}`;

  footer.classList.remove('hidden');
  footer.innerHTML = `
    <div class="flex items-center justify-end gap-2 w-full">
      <button type="button" onclick="renderOwnerDetailSheet(${c.id})" class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200">
        ยกเลิก
      </button>
      <button type="button" onclick="handleOwnerEditSubmit(${c.id})" class="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="save" class="w-4 h-4"></i>
        <span>บันทึกการแก้ไข</span>
      </button>
    </div>
  `;

  body.innerHTML = `
    <form id="owner-edit-form" class="space-y-4">
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">คำนำหน้า</label>
          <input type="text" id="edit-owner-prefix" value="${c.prefix || 'คุณ'}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">ชื่อจริง *</label>
          <input type="text" id="edit-owner-firstname" value="${c.first_name}" required class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold">
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">นามสกุล</label>
          <input type="text" id="edit-owner-lastname" value="${c.last_name || ''}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">ชื่อเรียก / Display Name *</label>
          <input type="text" id="edit-owner-displayname" value="${c.display_name}" required class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-teal-700">
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">เลขประจำตัวผู้เสียภาษี (Tax ID)</label>
          <input type="text" id="edit-owner-taxid" value="${c.tax_id || ''}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">เบอร์โทรหลัก *</label>
          <input type="tel" id="edit-owner-phone1" value="${c.phone_primary}" required class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold">
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">เบอร์สำรอง</label>
          <input type="tel" id="edit-owner-phone2" value="${c.phone_secondary || ''}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">LINE ID</label>
          <input type="text" id="edit-owner-line" value="${c.line_id || ''}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
      </div>

      <div>
        <label class="block text-slate-700 font-semibold mb-1">อีเมล</label>
        <input type="email" id="edit-owner-email" value="${c.email || ''}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
      </div>

      <div>
        <label class="block text-slate-700 font-semibold mb-1">ที่อยู่</label>
        <input type="text" id="edit-owner-address" value="${c.address_line || ''}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">เขต/อำเภอ</label>
          <input type="text" id="edit-owner-district" value="${c.district || ''}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">จังหวัด</label>
          <input type="text" id="edit-owner-province" value="${c.province || ''}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">สถานะ</label>
          <select id="edit-owner-status" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold">
            <option value="ACTIVE" ${c.status === 'ACTIVE' ? 'selected' : ''}>ACTIVE (ปกติ)</option>
            <option value="INACTIVE" ${c.status === 'INACTIVE' ? 'selected' : ''}>INACTIVE (ปิดใช้งาน)</option>
          </select>
        </div>
      </div>
    </form>
  `;

  lucide.createIcons();
}

function handleOwnerEditSubmit(customerId) {
  const c = getCustomerById(customerId);
  if (!c) return;

  const fn = document.getElementById('edit-owner-firstname')?.value.trim();
  const dn = document.getElementById('edit-owner-displayname')?.value.trim();
  const phone = document.getElementById('edit-owner-phone1')?.value.trim();

  if (!fn || !dn || !phone) return alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');

  c.prefix = document.getElementById('edit-owner-prefix')?.value.trim() || c.prefix;
  c.first_name = fn;
  c.last_name = document.getElementById('edit-owner-lastname')?.value.trim() || '';
  c.display_name = dn;
  c.tax_id = document.getElementById('edit-owner-taxid')?.value.trim() || '';
  c.phone_primary = phone;
  c.phone_secondary = document.getElementById('edit-owner-phone2')?.value.trim() || '';
  c.line_id = document.getElementById('edit-owner-line')?.value.trim() || '';
  c.email = document.getElementById('edit-owner-email')?.value.trim() || '';
  c.address_line = document.getElementById('edit-owner-address')?.value.trim() || '';
  c.district = document.getElementById('edit-owner-district')?.value.trim() || '';
  c.province = document.getElementById('edit-owner-province')?.value.trim() || '';
  c.status = document.getElementById('edit-owner-status')?.value || c.status;

  // Central Event Bus Notification
  if (window.ClinicEventBus && window.CLINIC_EVENTS) {
    window.ClinicEventBus.emit(window.CLINIC_EVENTS.CUSTOMER_UPDATED, { customer: c });
  }

  showToast('แก้ไขข้อมูลลูกค้าสำเร็จ', `อัปเดตข้อมูล ${c.display_name} เรียบร้อยแล้ว`, 'success');
  renderOwnerDetailSheet(customerId);
  renderCurrentView();
}

function renderPetEditForm(petId) {
  const p = getPetById(petId);
  if (!p) return;

  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  title.innerText = `แก้ไขข้อมูลสัตว์: ${p.pet_name}`;
  subtitle.innerText = `รหัสสัตว์: ${p.pet_code}`;

  footer.classList.remove('hidden');
  footer.innerHTML = `
    <div class="flex items-center justify-end gap-2 w-full">
      <button type="button" onclick="renderPetDetailSheet(${p.id})" class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200">
        ยกเลิก
      </button>
      <button type="button" onclick="handlePetEditSubmit(${p.id})" class="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="save" class="w-4 h-4"></i>
        <span>บันทึกการแก้ไข</span>
      </button>
    </div>
  `;

  body.innerHTML = `
    <form id="pet-edit-form" class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">ชื่อสัตว์เลี้ยง *</label>
          <input type="text" id="edit-pet-name" value="${p.pet_name}" required class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-teal-700">
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">สายพันธุ์ *</label>
          <input type="text" id="edit-pet-breed" value="${p.breed}" required class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">เพศ</label>
          <select id="edit-pet-sex" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
            <option value="ผู้ (Male)" ${p.sex.includes('ผู้') ? 'selected' : ''}>ผู้ (Male)</option>
            <option value="เมีย (Female)" ${p.sex.includes('เมีย') ? 'selected' : ''}>เมีย (Female)</option>
            <option value="ไม่ระบุ" ${p.sex.includes('ไม่ระบุ') ? 'selected' : ''}>ไม่ระบุ</option>
          </select>
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">สถานะทำหมัน</label>
          <select id="edit-pet-neutered" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
            <option value="ยังไม่ทำหมัน (Intact)" ${p.reproductive_status.includes('ยังไม่') ? 'selected' : ''}>ยังไม่ทำหมัน</option>
            <option value="ทำหมันแล้ว (Neutered)" ${p.reproductive_status.includes('ทำหมันแล้ว') ? 'selected' : ''}>ทำหมันแล้ว</option>
          </select>
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">สถานะสัตว์</label>
          <select id="edit-pet-status" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold">
            <option value="ACTIVE" ${p.status === 'ACTIVE' ? 'selected' : ''}>ACTIVE (ปกติ)</option>
            <option value="DECEASED" ${p.status === 'DECEASED' ? 'selected' : ''}>DECEASED (เสียชีวิต)</option>
            <option value="LOST" ${p.status === 'LOST' ? 'selected' : ''}>LOST (สูญหาย)</option>
            <option value="TRANSFERRED" ${p.status === 'TRANSFERRED' ? 'selected' : ''}>TRANSFERRED (ย้าย)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">วันเกิด</label>
          <input type="date" id="edit-pet-birthdate" value="${p.birth_date}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">เลขไมโครชิป</label>
          <input type="text" id="edit-pet-microchip" value="${p.microchip_number || ''}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono">
        </div>
      </div>

      <div>
        <label class="block text-slate-700 font-semibold mb-1">สีและลักษณะ</label>
        <input type="text" id="edit-pet-color" value="${p.color || ''}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
      </div>

      <div>
        <label class="block text-slate-700 font-semibold mb-1">รูปภาพ URL</label>
        <input type="text" id="edit-pet-photo" value="${p.photo || ''}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
      </div>
    </form>
  `;

  lucide.createIcons();
}

function handlePetEditSubmit(petId) {
  const p = getPetById(petId);
  if (!p) return;

  const name = document.getElementById('edit-pet-name')?.value.trim();
  const breed = document.getElementById('edit-pet-breed')?.value.trim();

  if (!name || !breed) return alert('กรุณากรอกชื่อและสายพันธุ์สัตว์');

  p.pet_name = name;
  p.breed = breed;
  p.sex = document.getElementById('edit-pet-sex')?.value || p.sex;
  p.reproductive_status = document.getElementById('edit-pet-neutered')?.value || p.reproductive_status;
  p.status = document.getElementById('edit-pet-status')?.value || p.status;
  p.birth_date = document.getElementById('edit-pet-birthdate')?.value || p.birth_date;
  p.microchip_number = document.getElementById('edit-pet-microchip')?.value.trim() || '';
  p.color = document.getElementById('edit-pet-color')?.value.trim() || '';
  p.photo = document.getElementById('edit-pet-photo')?.value.trim() || p.photo;

  // Central Event Bus Notification
  if (window.ClinicEventBus && window.CLINIC_EVENTS) {
    window.ClinicEventBus.emit(window.CLINIC_EVENTS.PET_UPDATED, { pet: p });
  }

  showToast('แก้ไขข้อมูลสัตว์เลี้ยงสำเร็จ', `อัปเดตข้อมูล ${p.pet_name} เรียบร้อยแล้ว`, 'success');
  renderPetDetailSheet(petId);
  renderCurrentView();
}

// -------------------------------------------------------------
// 7. GLOBAL SEARCH CONTROLLER (⌘K INSTANT DROPDOWN SEARCH)
// -------------------------------------------------------------

function initGlobalSearchEngine() {
  const input = document.getElementById('global-search-input');
  const dropdown = document.getElementById('global-search-dropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (q.length < 2) {
      dropdown.classList.add('hidden');
      dropdown.innerHTML = '';
      return;
    }

    // Match Customers
    const matchedCustomers = state.customers.filter(c => 
      c.display_name.toLowerCase().includes(q) ||
      c.first_name.toLowerCase().includes(q) ||
      (c.last_name && c.last_name.toLowerCase().includes(q)) ||
      c.customer_code.toLowerCase().includes(q) ||
      c.phone_primary.includes(q) ||
      (c.tax_id && c.tax_id.includes(q))
    );

    // Match Pets
    const matchedPets = state.pets.filter(p => 
      p.pet_name.toLowerCase().includes(q) ||
      p.pet_code.toLowerCase().includes(q) ||
      p.breed.toLowerCase().includes(q) ||
      (p.microchip_number && p.microchip_number.includes(q))
    );

    if (matchedCustomers.length === 0 && matchedPets.length === 0) {
      dropdown.classList.remove('hidden');
      dropdown.innerHTML = `
        <div class="p-4 text-center text-xs text-slate-400">
          <i data-lucide="search-x" class="w-5 h-5 mx-auto mb-1 text-slate-300"></i>
          ไม่พบผลลัพธ์ที่ตรงกับ "${q}"
        </div>
      `;
      lucide.createIcons();
      return;
    }

    dropdown.classList.remove('hidden');
    dropdown.innerHTML = `
      ${matchedCustomers.length > 0 ? `
        <div class="p-2">
          <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 rounded-lg mb-1 flex items-center gap-1.5">
            <i data-lucide="users" class="w-3 h-3 text-teal-600"></i>
            <span>เจ้าของสัตว์เลี้ยง (${matchedCustomers.length})</span>
          </div>
          <div class="space-y-1">
            ${matchedCustomers.map(c => `
              <div onclick="selectGlobalSearchResult('owner', ${c.id})" class="p-2.5 rounded-xl hover:bg-teal-50/70 transition cursor-pointer flex items-center justify-between group">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                    ${c.first_name.charAt(0)}
                  </div>
                  <div>
                    <h5 class="font-bold text-xs text-slate-800 group-hover:text-teal-700">${c.display_name}</h5>
                    <p class="text-[11px] text-slate-400 font-mono">${c.customer_code} • ${c.phone_primary}</p>
                  </div>
                </div>
                <span class="text-[10px] text-teal-700 bg-white border border-teal-200 px-2 py-0.5 rounded font-semibold">ดูโปรไฟล์</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${matchedPets.length > 0 ? `
        <div class="p-2">
          <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 rounded-lg mb-1 flex items-center gap-1.5">
            <i data-lucide="paw-print" class="w-3 h-3 text-emerald-600"></i>
            <span>สัตว์เลี้ยง (${matchedPets.length})</span>
          </div>
          <div class="space-y-1">
            ${matchedPets.map(p => `
              <div onclick="selectGlobalSearchResult('pet', ${p.id})" class="p-2.5 rounded-xl hover:bg-emerald-50/70 transition cursor-pointer flex items-center justify-between group">
                <div class="flex items-center gap-2.5">
                  <img src="${p.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300'}" class="w-8 h-8 rounded-lg object-cover border border-slate-200">
                  <div>
                    <h5 class="font-bold text-xs text-slate-800 group-hover:text-emerald-700">${p.pet_name}</h5>
                    <p class="text-[11px] text-slate-400">${p.pet_code} • ${p.species} (${p.breed})</p>
                  </div>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded font-semibold">ดูเวชระเบียน</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;

    lucide.createIcons();
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

function selectGlobalSearchResult(type, id) {
  const dropdown = document.getElementById('global-search-dropdown');
  const input = document.getElementById('global-search-input');
  if (dropdown) dropdown.classList.add('hidden');
  if (input) input.value = '';

  openDetailSheet(type, id);
}

// Ensure initGlobalSearchEngine runs when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobalSearchEngine);
} else {
  initGlobalSearchEngine();
}
