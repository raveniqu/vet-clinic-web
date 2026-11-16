// -------------------------------------------------------------
// DOMAIN 04: PHARMACY DISPENSING & INVENTORY MANAGEMENT ENGINE
// Fully compliant with Business Domain 04 & Physical Database Design
// -------------------------------------------------------------

// --- 8.1 Pharmacy Dispensing Views & Filters ---
function filterDispensingByStatus(status) {
  state.activeDispenseFilter = status;
  
  // Update filter pill UI active styles
  const btnIds = ['all', 'WAITING_DISPENSE', 'DISPENSED', 'RETURNED'];
  btnIds.forEach(id => {
    const el = document.getElementById(`btn-disp-filter-${id === 'WAITING_DISPENSE' ? 'waiting' : id === 'DISPENSED' ? 'dispensed' : id === 'RETURNED' ? 'returned' : 'all'}`);
    if (el) {
      if (id === status) {
        el.className = 'px-3 py-1 rounded-lg bg-white text-teal-800 shadow-xs cursor-pointer font-bold transition';
      } else {
        el.className = 'px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer transition';
      }
    }
  });

  renderCurrentView();
}

function renderPharmacyCardView(dispensings) {
  const container = document.getElementById('pharmacy-card-grid');
  if (!container) return;

  const filtered = dispensings.filter(d => {
    if (!state.activeDispenseFilter || state.activeDispenseFilter === 'all') return true;
    return d.status === state.activeDispenseFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 p-8">
        <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <i data-lucide="inbox" class="w-6 h-6"></i>
        </div>
        <h4 class="font-bold text-slate-700 text-sm">ไม่พบรายการคำสั่งยาตามตัวกรองนี้</h4>
        <p class="text-xs text-slate-400 mt-1">เลือกตัวกรอง 'ทั้งหมด' เพื่อดูรายการคำสั่งยาทั้งหมดในระบบ</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(d => {
    const pet = getPetById(d.pet_id);
    const owner = getCustomerById(d.customer_id);
    const doctor = getDoctorById(d.doctor_id);
    const isWaiting = d.status === 'WAITING_DISPENSE';
    const isReturned = d.status === 'RETURNED';
    const hasAllergy = pet && pet.allergies && pet.allergies.length > 0;

    return `
      <div class="bg-white rounded-2xl border ${isWaiting ? (hasAllergy ? 'border-rose-300 ring-2 ring-rose-500/15' : 'border-amber-300 shadow-xs') : isReturned ? 'border-purple-300 bg-purple-50/20' : 'border-slate-200'} p-5 hover:shadow-md transition duration-200 flex flex-col justify-between">
        <div class="space-y-3.5">
          <!-- Top Row: Dispense ID & Status -->
          <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold ${isWaiting ? 'bg-amber-100 text-amber-900 border border-amber-300' : isReturned ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-slate-100 text-slate-700'} px-2 py-0.5 rounded-md">
                ${d.dispensing_number}
              </span>
              <span class="text-[10px] text-slate-400 font-mono">${d.created_at}</span>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isWaiting ? 'bg-amber-100 text-amber-800 animate-pulse' : isReturned ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'}">
              ${isWaiting ? '🟡 รอตรวจสอบ & จ่ายยา' : isReturned ? '↩️ รับคืน / ยกเลิกแล้ว' : '🟢 จ่ายสำเร็จแล้ว'}
            </span>
          </div>

          <!-- Patient & Owner Info -->
          <div class="flex items-start gap-3">
            <img src="${pet ? pet.photo : ''}" class="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0">
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-slate-900 text-sm truncate">${pet ? pet.pet_name : 'สัตว์ไม่ระบุ'}</h4>
                <span class="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">${pet ? pet.current_weight : '-'} kg</span>
              </div>
              <p class="text-[11px] text-slate-500 truncate">${pet ? pet.breed : ''} • เจ้าของ: <span class="text-slate-700 font-medium">${owner ? owner.display_name : ''}</span></p>
              <p class="text-[10px] text-slate-400 truncate">แพทย์ผู้ตรวจ: ${doctor ? doctor.name : 'สัตวแพทย์เวร'}</p>
            </div>
          </div>

          <!-- Allergy Alert Box (Von Restorff Effect) -->
          ${hasAllergy ? `
            <div class="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-[11px] font-bold">
              <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-600 shrink-0"></i>
              <span>ผู้ป่วยมีประวัติแพ้ยา: ${pet.allergies.join(', ')} (กรุณาตรวจสอบก่อนจ่าย)</span>
            </div>
          ` : ''}

          <!-- Diagnosed Disease Note -->
          <div class="text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span class="text-slate-500 font-medium">ข้อวินิจฉัย:</span>
            <span class="font-bold text-slate-800 ml-1">${d.diagnosis_summary || 'ตรวจรักษาทั่วไป'}</span>
          </div>

          <!-- Prescribed Medicines Summary -->
          <div class="space-y-2">
            <div class="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>รายการยาที่สั่ง (${d.items.length} รายการ):</span>
              <span class="text-[10px] text-teal-600 font-semibold">แนะนำตัดล็อต FEFO</span>
            </div>
            <div class="space-y-1.5">
              ${d.items.map(item => {
                const prod = getProductById(item.product_id);
                const lot = getLotById(item.selected_lot_id);
                return `
                  <div class="p-2 bg-slate-50/80 rounded-lg border border-slate-200/90 text-xs flex items-center justify-between">
                    <div>
                      <strong class="text-slate-900 block font-semibold">${prod ? prod.product_name : 'ยาไม่ระบุ'}</strong>
                      <span class="text-[11px] text-slate-500">${item.dose} ${item.frequency}</span>
                    </div>
                    <div class="text-right">
                      <span class="font-bold text-teal-700 text-xs">${item.quantity} ${item.unit}</span>
                      ${lot ? `<span class="block text-[10px] text-slate-400 font-mono">Lot: ${lot.lot_number}</span>` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Card Action Footer -->
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          ${isWaiting ? `
            <button onclick="openDispenseSheet(${d.id})" class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
              <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
              <span>ตรวจสอบ & จ่ายยา</span>
            </button>
          ` : isReturned ? `
            <div class="flex-1 text-[11px] text-purple-700 font-semibold flex items-center gap-1">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
              <span>รับคืนยาเรียบร้อย (Quarantine)</span>
            </div>
          ` : `
            <div class="flex-1 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
              <span>จ่ายโดย ${d.dispensed_by || 'เภสัชกร'}</span>
            </div>
            <button onclick="openMedicationReturnModal(${d.id})" class="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold py-2 px-2.5 rounded-xl border border-rose-200 transition flex items-center gap-1 cursor-pointer" title="รับคืนยา / ยกเลิกการจ่าย">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
              <span class="hidden sm:inline">คืนยา</span>
            </button>
          `}
          <button onclick="openDrugLabelModal(${d.id})" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer" title="พิมพ์ฉลากยา">
            <i data-lucide="printer" class="w-3.5 h-3.5 text-slate-600"></i>
            <span class="hidden sm:inline">ฉลากยา</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function renderPharmacyListView(dispensings) {
  const container = document.getElementById('pharmacy-list-table');
  if (!container) return;

  const filtered = dispensings.filter(d => {
    if (!state.activeDispenseFilter || state.activeDispenseFilter === 'all') return true;
    return d.status === state.activeDispenseFilter;
  });

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-600">
        <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
          <tr>
            <th class="px-4 py-3">เลขที่ใบสั่งยา</th>
            <th class="px-4 py-3">สัตว์เลี้ยง / เจ้าของ</th>
            <th class="px-4 py-3">ข้อวินิจฉัย</th>
            <th class="px-4 py-3">สัตวแพทย์</th>
            <th class="px-4 py-3">รายการยา</th>
            <th class="px-4 py-3">สถานะ</th>
            <th class="px-4 py-3 text-right">ดำเนินการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${filtered.map(d => {
            const pet = getPetById(d.pet_id);
            const owner = getCustomerById(d.customer_id);
            const doctor = getDoctorById(d.doctor_id);
            const isWaiting = d.status === 'WAITING_DISPENSE';
            const isReturned = d.status === 'RETURNED';
            const hasAllergy = pet && pet.allergies && pet.allergies.length > 0;

            return `
              <tr class="hover:bg-slate-50/80 transition">
                <td class="px-4 py-3 font-mono font-bold text-slate-900">
                  ${d.dispensing_number}
                  <div class="text-[10px] text-slate-400 font-normal">${d.created_at}</div>
                </td>
                <td class="px-4 py-3">
                  <div class="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>${pet ? pet.pet_name : 'สัตว์ไม่ระบุ'}</span>
                    ${hasAllergy ? `<span class="text-[9px] bg-rose-100 text-rose-700 px-1 rounded font-bold">แพ้ยา</span>` : ''}
                  </div>
                  <div class="text-[11px] text-slate-400">${pet ? pet.species + ' • ' + pet.breed : ''} (เจ้าของ: ${owner ? owner.display_name : ''})</div>
                </td>
                <td class="px-4 py-3">
                  <span class="font-medium text-slate-800">${d.diagnosis_summary || 'ตรวจรักษาทั่วไป'}</span>
                </td>
                <td class="px-4 py-3 text-slate-700">${doctor ? doctor.name : 'สัตวแพทย์เวร'}</td>
                <td class="px-4 py-3">
                  <span class="font-bold text-slate-800">${d.items.length} รายการ</span>
                  <div class="text-[11px] text-slate-400 truncate max-w-xs">${d.items.map(it => getProductById(it.product_id)?.product_name || '').join(', ')}</div>
                </td>
                <td class="px-4 py-3">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isWaiting ? 'bg-amber-100 text-amber-800 animate-pulse' : isReturned ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'}">
                    ${isWaiting ? 'รอจ่ายยา' : isReturned ? 'รับคืนแล้ว' : 'จ่ายสำเร็จ'}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    ${isWaiting ? `
                      <button onclick="openDispenseSheet(${d.id})" class="text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-2.5 py-1 rounded-lg transition shadow-xs cursor-pointer">
                        จ่ายยา
                      </button>
                    ` : `
                      <button onclick="openMedicationReturnModal(${d.id})" class="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-1 rounded-lg transition cursor-pointer">
                        คืนยา
                      </button>
                    `}
                    <button onclick="openDrugLabelModal(${d.id})" class="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition cursor-pointer" title="ฉลากยา">
                      ฉลาก
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// --- 8.2 Inventory Sub-Tab Navigation & Master Content ---
function switchInventorySubTab(tabKey) {
  state.activeInventorySubTab = tabKey;

  // Update tabs style
  const tabKeys = ['master', 'ledger', 'transfers', 'batches'];
  tabKeys.forEach(key => {
    const btn = document.getElementById(`tab-inv-${key}`);
    const container = document.getElementById(`inventory-subtab-${key}`);
    if (btn) {
      if (key === tabKey) {
        btn.className = 'px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer bg-white text-teal-800 shadow-xs font-bold';
      } else {
        btn.className = 'px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900';
      }
    }
    if (container) {
      if (key === tabKey) {
        container.classList.remove('hidden');
      } else {
        container.classList.add('hidden');
      }
    }
  });

  renderInventorySubTabContent();
  lucide.createIcons();
}

function renderInventorySubTabContent() {
  const currentSubTab = state.activeInventorySubTab || 'master';

  if (currentSubTab === 'master') {
    const searchQuery = (document.getElementById('view-filter-search')?.value || '').toLowerCase().trim();
    const catFilter = document.getElementById('view-filter-category')?.value || 'all';

    const filtered = state.products.filter(p => {
      const matchSearch = p.product_code.toLowerCase().includes(searchQuery) ||
        p.product_name.toLowerCase().includes(searchQuery) ||
        (p.generic_name && p.generic_name.toLowerCase().includes(searchQuery)) ||
        (p.brand_name && p.brand_name.toLowerCase().includes(searchQuery));
      return matchSearch && (catFilter === 'all' || p.category === catFilter);
    });

    if (state.viewMode === 'card') {
      document.getElementById('inventory-card-grid')?.classList.remove('hidden');
      document.getElementById('inventory-list-table')?.classList.add('hidden');
      renderInventoryCardView(filtered);
    } else {
      document.getElementById('inventory-card-grid')?.classList.add('hidden');
      document.getElementById('inventory-list-table')?.classList.remove('hidden');
      renderInventoryListView(filtered);
    }
  } else if (currentSubTab === 'ledger') {
    renderInventoryStockLedger();
  } else if (currentSubTab === 'transfers') {
    renderInventoryTransfersAndIssues();
  } else if (currentSubTab === 'batches') {
    renderInventoryBatchControl();
  }
}

// --- 8.3 Subtab 1: Stock Master Cards & List ---
function renderInventoryCardView(products) {
  const container = document.getElementById('inventory-card-grid');
  if (!container) return;

  container.innerHTML = products.map(p => {
    const totalOnHand = getProductTotalOnHand(p.id);
    const totalAvailable = getProductTotalAvailable(p.id);
    const isLowStock = totalOnHand < p.minimum_stock;
    const availableLots = getProductAvailableLots(p.id);
    const hasExpiringLot = availableLots.some(l => isExpiringSoon(l.expiry_date));
    const stockPct = Math.min(100, Math.round((totalOnHand / (p.minimum_stock * 2.5)) * 100));

    // Check if there is an active PR in state.purchaseRequisitions
    const activePr = (state.purchaseRequisitions || []).find(pr => 
      pr.status !== 'CANCELLED' && pr.items && pr.items.some(it => it.productId === p.id || it.productCode === p.product_code)
    );

    return `
      <div class="bg-white rounded-2xl border ${isLowStock ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-slate-200'} p-5 hover:shadow-md transition duration-200 flex flex-col justify-between">
        <div class="space-y-3.5">
          <!-- Top Row: Code, Category, Cold Chain -->
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <span class="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
              ${p.product_code}
            </span>
            <div class="flex items-center gap-1.5">
              ${p.is_cold_chain ? `
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                  <i data-lucide="thermometer-snowflake" class="w-3 h-3"></i>
                  <span>2-8°C Cold Chain</span>
                </span>
              ` : ''}
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                ${p.category}
              </span>
            </div>
          </div>

          <!-- Product Main Info -->
          <div>
            <div class="flex items-start justify-between gap-2">
              <h4 class="font-bold text-slate-900 text-sm leading-snug">${p.product_name}</h4>
              <button onclick="openPharmaInfoModal(${p.id})" class="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 shrink-0 cursor-pointer" title="ดูข้อมูลทางเภสัชกรรม">
                เภสัชวิทยา ℹ️
              </button>
            </div>
            <p class="text-[11px] text-slate-500 mt-0.5">ชื่อสามัญ: <span class="text-slate-700 font-medium">${p.generic_name || '-'}</span></p>
            <div class="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <span>${p.dosage_form}</span>
              <span>•</span>
              <span>ความแรง: <strong class="text-slate-700">${p.strength || '-'}</strong></span>
            </div>
            ${p.packaging ? `<p class="text-[10px] text-slate-400 mt-0.5 font-mono">บรรจุภัณฑ์: ${p.packaging}</p>` : ''}
          </div>

          <!-- Stock Level Progress Bar & KPI -->
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/90 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-500 font-medium">คงเหลือในคลัง (On-Hand):</span>
              <div class="flex items-center gap-1.5">
                <span class="text-base font-extrabold ${isLowStock ? 'text-rose-600' : 'text-slate-900'}">${totalOnHand}</span>
                <span class="text-xs text-slate-400 font-normal">${p.base_unit}</span>
              </div>
            </div>

            <!-- Visual Bar -->
            <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-300 ${isLowStock ? 'bg-rose-500' : stockPct < 50 ? 'bg-amber-500' : 'bg-teal-500'}" style="width: ${stockPct}%"></div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span>ขั้นต่ำ (Min): <strong class="text-slate-700">${p.minimum_stock}</strong></span>
              <span>พร้อมจ่าย (Avail): <strong class="text-teal-700">${totalAvailable}</strong></span>
            </div>

            ${isLowStock ? `
              <div class="p-2 bg-rose-100/90 border border-rose-300 rounded-lg flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5 text-[11px] font-bold text-rose-800">
                  <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-rose-600 shrink-0"></i>
                  <span>สต็อกต่ำกว่าเกณฑ์ (${totalOnHand}/${p.minimum_stock})</span>
                </div>
                ${activePr ? `
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-mono">
                    ขอซื้อแล้ว ${activePr.requisitionNumber}
                  </span>
                ` : `
                  <button onclick="openPurchaseRequisitionModal(${p.id})" class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs">
                    <i data-lucide="shopping-cart" class="w-3 h-3"></i>
                    <span>ขอซื้อ (PR)</span>
                  </button>
                `}
              </div>
            ` : ''}
          </div>

          <!-- Lots & FEFO Information -->
          <div class="space-y-1.5 text-xs">
            <div class="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>ล็อตที่พร้อมจ่าย (${availableLots.length} ล็อต):</span>
              ${hasExpiringLot ? `<span class="text-amber-700 font-bold text-[10px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">⏳ ใกล้หมดอายุ</span>` : ''}
            </div>
            ${availableLots.length > 0 ? `
              <div class="space-y-1">
                ${availableLots.slice(0, 2).map((l, idx) => `
                  <div class="flex items-center justify-between text-[11px] p-1.5 rounded bg-white border border-slate-200 font-mono">
                    <span class="font-bold text-slate-800">${l.lot_number} ${idx === 0 ? '<span class="text-[9px] bg-teal-100 text-teal-800 px-1 rounded font-sans font-bold">FEFO</span>' : ''}</span>
                    <span class="${isExpiringSoon(l.expiry_date) ? 'text-rose-600 font-bold' : 'text-slate-500'}">Exp: ${formatDateThai(l.expiry_date)}</span>
                  </div>
                `).join('')}
              </div>
            ` : '<div class="text-slate-400 text-[11px] italic">ไม่มีล็อตพร้อมจ่ายในขณะนี้</div>'}
          </div>
        </div>

        <!-- Card Bottom Action -->
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button onclick="openStockManageSheet('receive', ${p.id})" class="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs py-2 px-2.5 rounded-xl border border-teal-200 transition flex items-center justify-center gap-1.5 cursor-pointer">
            <i data-lucide="package-plus" class="w-3.5 h-3.5 text-teal-600"></i>
            <span>รับเข้าคลัง</span>
          </button>
          <button onclick="openStockManageSheet('adjust', ${p.id})" class="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs py-2 px-2.5 rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer">
            <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5 text-slate-600"></i>
            <span>ปรับยอด</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function renderInventoryListView(products) {
  const container = document.getElementById('inventory-list-table');
  if (!container) return;

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-600">
        <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
          <tr>
            <th class="px-4 py-3">รหัสสินค้า</th>
            <th class="px-4 py-3">ชื่อยา / เวชภัณฑ์</th>
            <th class="px-4 py-3">หมวดหมู่</th>
            <th class="px-4 py-3 text-center">คงเหลือ (On-Hand)</th>
            <th class="px-4 py-3 text-center">ขั้นต่ำ (Min)</th>
            <th class="px-4 py-3">ราคาต้นทุน</th>
            <th class="px-4 py-3">ราคาจำหน่าย</th>
            <th class="px-4 py-3">ล็อตและวันหมดอายุ (FEFO)</th>
            <th class="px-4 py-3 text-right">ดำเนินการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${products.map(p => {
            const totalOnHand = getProductTotalOnHand(p.id);
            const isLowStock = totalOnHand < p.minimum_stock;
            const availableLots = getProductAvailableLots(p.id);
            const earliestLot = availableLots[0];

            return `
              <tr class="hover:bg-slate-50/80 transition">
                <td class="px-4 py-3 font-mono font-bold text-slate-900">${p.product_code}</td>
                <td class="px-4 py-3">
                  <div class="font-bold text-slate-900">${p.product_name}</div>
                  <div class="text-[11px] text-slate-400">${p.generic_name || '-'} • ${p.dosage_form}</div>
                </td>
                <td class="px-4 py-3">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    ${p.category}
                  </span>
                </td>
                <td class="px-4 py-3 text-center font-extrabold ${isLowStock ? 'text-rose-600 bg-rose-50 rounded-lg' : 'text-slate-900'}">
                  ${totalOnHand} ${p.base_unit}
                </td>
                <td class="px-4 py-3 text-center text-slate-500 font-mono">${p.minimum_stock}</td>
                <td class="px-4 py-3 font-mono">฿${p.unit_cost.toFixed(2)}</td>
                <td class="px-4 py-3 font-mono font-bold text-teal-700">฿${p.unit_price.toFixed(2)}</td>
                <td class="px-4 py-3">
                  ${earliestLot ? `
                    <div class="font-mono text-xs">
                      <strong class="text-slate-800">${earliestLot.lot_number}</strong>
                      <span class="text-[11px] text-slate-400">(${formatDateThai(earliestLot.expiry_date)})</span>
                    </div>
                  ` : '<span class="text-slate-400 italic">-</span>'}
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    ${isLowStock ? `
                      <button onclick="openPurchaseRequisitionModal(${p.id})" class="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg border border-rose-200 transition cursor-pointer">
                        ขอซื้อ PR
                      </button>
                    ` : ''}
                    <button onclick="openStockManageSheet('receive', ${p.id})" class="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition cursor-pointer">
                      รับเข้า
                    </button>
                    <button onclick="openStockManageSheet('adjust', ${p.id})" class="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition cursor-pointer">
                      ปรับยอด
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// --- 8.4 Subtab 2: Stock Movement Ledger (Audit Trail) ---
function renderInventoryStockLedger() {
  const container = document.getElementById('inventory-ledger-container');
  if (!container) return;

  const movements = state.stockMovements || [];

  container.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
            <i data-lucide="file-spreadsheet" class="w-4 h-4 text-teal-600"></i>
            <span>สมุดบัญชีคุมความเคลื่อนไหวสินค้า (Stock Movement Ledger)</span>
          </h4>
          <p class="text-xs text-slate-400 mt-0.5">บันทึกธุรกรรมการเข้า-ออกของยาและเวชภัณฑ์ ตรวจสอบย้อนหลังได้ทุกรายการ</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            รวม ${movements.length} ธุรกรรม
          </span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-600">
          <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
            <tr>
              <th class="px-4 py-3">เลขที่รายการ</th>
              <th class="px-4 py-3">วัน-เวลา</th>
              <th class="px-4 py-3">รายการสินค้า / ล็อต</th>
              <th class="px-4 py-3">ประเภทธุรกรรม</th>
              <th class="px-4 py-3 text-center">จำนวน</th>
              <th class="px-4 py-3 font-mono">ต้นทุน/หน่วย</th>
              <th class="px-4 py-3">เลขอ้างอิง</th>
              <th class="px-4 py-3">คลังจัดเก็บ</th>
              <th class="px-4 py-3">ผู้ทำรายการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${movements.map(m => {
              const prod = getProductById(m.product_id);
              const lot = getLotById(m.lot_id);
              const isPositive = m.quantity > 0;

              let typeBadge = '';
              if (m.movement_type === 'RECEIVE') {
                typeBadge = '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">🟢 รับเข้าคลัง (RECEIVE)</span>';
              } else if (m.movement_type === 'DISPENSE') {
                typeBadge = '<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">🟡 จ่ายยาคนไข้ (DISPENSE)</span>';
              } else if (m.movement_type === 'INTERNAL_ISSUE') {
                typeBadge = '<span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">🔵 เบิกใช้ภายใน (ISSUE)</span>';
              } else if (m.movement_type === 'TRANSFER_IN' || m.movement_type === 'TRANSFER_OUT') {
                typeBadge = '<span class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">🟣 โอนย้ายคลัง (TRANSFER)</span>';
              } else if (m.movement_type === 'DISPENSE_RETURN') {
                typeBadge = '<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">↩️ รับคืนยา (RETURN)</span>';
              } else {
                typeBadge = '<span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">⚙️ ปรับปรุงสต็อก (ADJUST)</span>';
              }

              return `
                <tr class="hover:bg-slate-50/80 transition">
                  <td class="px-4 py-3 font-mono font-bold text-slate-800">${m.movement_number}</td>
                  <td class="px-4 py-3 font-mono text-[11px] text-slate-500">${m.movement_at}</td>
                  <td class="px-4 py-3">
                    <strong class="text-slate-900 block font-semibold">${prod ? prod.product_name : 'สินค้า #' + m.product_id}</strong>
                    <span class="text-[11px] text-slate-400 font-mono">Lot: ${lot ? lot.lot_number : '-'}</span>
                  </td>
                  <td class="px-4 py-3">${typeBadge}</td>
                  <td class="px-4 py-3 text-center font-mono font-bold text-sm ${isPositive ? 'text-emerald-600' : 'text-rose-600'}">
                    ${isPositive ? '+' + m.quantity : m.quantity} ${prod ? prod.base_unit : ''}
                  </td>
                  <td class="px-4 py-3 font-mono">฿${(m.unit_cost || 0).toFixed(2)}</td>
                  <td class="px-4 py-3 font-mono text-slate-700 font-semibold">${m.reference_code || '-'}</td>
                  <td class="px-4 py-3 text-slate-600 text-[11px]">${m.warehouse_name || 'คลังยาหลัก'}</td>
                  <td class="px-4 py-3 text-slate-700">${m.performed_by || '-'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --- 8.5 Subtab 3: Internal Issues & Transfers ---
function renderInventoryTransfersAndIssues() {
  const container = document.getElementById('inventory-transfers-container');
  if (!container) return;

  const transfers = state.stockTransfers || [];
  const issues = state.internalStockIssues || [];

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Section 1: Internal Stock Requisitions (เบิกใช้ภายในแผนก) -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
              <i data-lucide="clipboard-list" class="w-4 h-4 text-blue-600"></i>
              <span>รายการเบิกใช้เวชภัณฑ์ภายในคลินิก (Internal Stock Issues)</span>
            </h4>
            <p class="text-xs text-slate-400 mt-0.5">การเบิกใช้วัสดุและยาสำหรับห้องผ่าตัด, ห้องตรวจ, หรือวอร์ดสัตว์ป่วยใน</p>
          </div>
          <button onclick="openInternalIssueSheet()" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>+ สร้างใบเบิกใช้ภายใน</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th class="px-4 py-3">เลขที่ใบเบิก</th>
                <th class="px-4 py-3">แผนกที่เบิก</th>
                <th class="px-4 py-3">ผู้ขอเบิก</th>
                <th class="px-4 py-3">วัตถุประสงค์</th>
                <th class="px-4 py-3">รายการเวชภัณฑ์</th>
                <th class="px-4 py-3">สถานะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${issues.map(iss => `
                <tr class="hover:bg-slate-50/80 transition">
                  <td class="px-4 py-3 font-mono font-bold text-slate-800">
                    ${iss.issue_number}
                    <div class="text-[10px] text-slate-400 font-normal">${iss.issued_at}</div>
                  </td>
                  <td class="px-4 py-3 font-bold text-blue-900">${iss.department}</td>
                  <td class="px-4 py-3 text-slate-700">${iss.requested_by}</td>
                  <td class="px-4 py-3 text-slate-600">${iss.purpose}</td>
                  <td class="px-4 py-3">
                    ${iss.items.map(it => `
                      <div class="text-[11px] font-semibold text-slate-800">
                        • ${it.product_name} <span class="text-teal-700 font-bold">(${it.quantity} ${it.unit})</span>
                      </div>
                    `).join('')}
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      ${iss.status === 'COMPLETED' ? 'จ่ายของแล้ว' : 'รอจ่าย'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 2: Inter-Warehouse Transfers (โอนย้ายสินค้าระหว่างคลัง) -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
              <i data-lucide="arrow-left-right" class="w-4 h-4 text-purple-600"></i>
              <span>การโอนย้ายสินค้าระหว่างคลัง (Inter-Warehouse Transfers)</span>
            </h4>
            <p class="text-xs text-slate-400 mt-0.5">โอนสินค้าระหว่างคลังยาหลัก, ตู้เย็นวัคซีน, และตู้ยาห้องผ่าตัด</p>
          </div>
          <button onclick="openStockTransferSheet()" class="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>+ โอนย้ายสินค้าระหว่างคลัง</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th class="px-4 py-3">เลขที่การโอน</th>
                <th class="px-4 py-3">คลังต้นทาง</th>
                <th class="px-4 py-3">คลังปลายทาง</th>
                <th class="px-4 py-3">ผู้ทำรายการ</th>
                <th class="px-4 py-3">รายการสินค้าที่โอน</th>
                <th class="px-4 py-3">สถานะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${transfers.map(tr => `
                <tr class="hover:bg-slate-50/80 transition">
                  <td class="px-4 py-3 font-mono font-bold text-slate-800">
                    ${tr.transfer_number}
                    <div class="text-[10px] text-slate-400 font-normal">${tr.transferred_at}</div>
                  </td>
                  <td class="px-4 py-3 text-slate-700">${tr.source_warehouse_name}</td>
                  <td class="px-4 py-3 font-bold text-purple-900">${tr.destination_warehouse_name}</td>
                  <td class="px-4 py-3 text-slate-700">${tr.requested_by}</td>
                  <td class="px-4 py-3">
                    ${tr.items.map(it => `
                      <div class="text-[11px] font-semibold text-slate-800">
                        • ${it.product_name} <span class="font-bold text-purple-700">(${it.quantity} ${it.unit})</span>
                        <span class="text-[10px] text-slate-400 font-mono">Lot: ${it.lot_number || '-'}</span>
                      </div>
                    `).join('')}
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      ${tr.status === 'COMPLETED' ? 'โอนสำเร็จ' : 'ระหว่างโอน'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// --- 8.6 Subtab 4: Batch Control & Recalls ---
function renderInventoryBatchControl() {
  const container = document.getElementById('inventory-batches-container');
  if (!container) return;

  const lots = state.inventoryLots || [];

  container.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
            <i data-lucide="shield-alert" class="w-4 h-4 text-amber-600"></i>
            <span>ระบบควบคุมล็อตและเรียกคืนยา (Batch & Recall Management)</span>
          </h4>
          <p class="text-xs text-slate-400 mt-0.5">กักกันสินค้าที่มีปัญหา (Quarantine), เรียกคืนล็อตยา (Recall), และป้องกันการจ่ายยาหมดอายุ</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-600">
          <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
            <tr>
              <th class="px-4 py-3">เลขล็อต (Lot No.)</th>
              <th class="px-4 py-3">รายการยา / เวชภัณฑ์</th>
              <th class="px-4 py-3">วันหมดอายุ (Expiry)</th>
              <th class="px-4 py-3 text-center">ยอดคงเหลือ (On-Hand)</th>
              <th class="px-4 py-3">สถานะล็อต</th>
              <th class="px-4 py-3">หมายเหตุการกักกัน</th>
              <th class="px-4 py-3 text-right">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${lots.map(l => {
              const prod = getProductById(l.product_id);
              const sb = (state.stockBalances || []).find(b => b.lot_id === l.id);
              const onHand = sb ? sb.quantity_on_hand : l.quantity_initial;
              const isNearExp = isExpiringSoon(l.expiry_date);

              let statusBadge = '';
              if (l.status === 'ACTIVE') {
                statusBadge = isNearExp 
                  ? '<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">⏳ ใกล้หมดอายุ</span>'
                  : '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">🟢 พร้อมจ่าย (Active)</span>';
              } else if (l.status === 'QUARANTINED') {
                statusBadge = '<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">🛑 กักกัน (Quarantined)</span>';
              } else if (l.status === 'RECALLED') {
                statusBadge = '<span class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">🚨 เรียกคืน (Recalled)</span>';
              }

              return `
                <tr class="hover:bg-slate-50/80 transition ${l.status === 'QUARANTINED' ? 'bg-rose-50/30' : ''}">
                  <td class="px-4 py-3 font-mono font-bold text-slate-900">${l.lot_number}</td>
                  <td class="px-4 py-3">
                    <strong class="text-slate-900 block font-semibold">${prod ? prod.product_name : 'สินค้า #' + l.product_id}</strong>
                    <span class="text-[11px] text-slate-400">${prod ? prod.dosage_form : ''}</span>
                  </td>
                  <td class="px-4 py-3 font-mono ${isNearExp ? 'text-rose-600 font-bold' : 'text-slate-700'}">
                    ${formatDateThai(l.expiry_date)}
                  </td>
                  <td class="px-4 py-3 text-center font-mono font-bold text-sm text-slate-800">
                    ${onHand} ${prod ? prod.base_unit : ''}
                  </td>
                  <td class="px-4 py-3">${statusBadge}</td>
                  <td class="px-4 py-3 text-[11px] text-slate-500 max-w-xs truncate">
                    ${l.quarantine_reason || '-'}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      ${l.status === 'ACTIVE' ? `
                        <button onclick="toggleLotQuarantine(${l.id}, 'QUARANTINED')" class="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition cursor-pointer" title="กักกันล็อตนี้">
                          กักกัน
                        </button>
                        <button onclick="toggleLotQuarantine(${l.id}, 'RECALLED')" class="text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg transition cursor-pointer" title="เรียกคืนล็อตนี้">
                          เรียกคืน
                        </button>
                      ` : `
                        <button onclick="toggleLotQuarantine(${l.id}, 'ACTIVE')" class="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition cursor-pointer" title="ปลดกักกันกลับสู่สถานะพร้อมจ่าย">
                          ปลดกักกัน
                        </button>
                      `}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function toggleLotQuarantine(lotId, targetStatus) {
  const lot = (state.inventoryLots || []).find(l => l.id === lotId);
  if (!lot) return;

  const prod = getProductById(lot.product_id);
  const sb = (state.stockBalances || []).find(b => b.lot_id === lotId);

  lot.status = targetStatus;

  if (targetStatus === 'QUARANTINED') {
    lot.quarantine_reason = 'กักกันตรวจสอบคุณภาพโดยเภสัชกรประจำคลินิก';
    if (sb) sb.quantity_available = 0; // Prevent FEFO recommendation!
    showToast('กักกันล็อตยาสำเร็จ', `ล็อต ${lot.lot_number} ถูกกักกันแล้ว และจะไม่ถูกนำไปจ่ายให้ผู้ป่วย`, 'warning');
  } else if (targetStatus === 'RECALLED') {
    lot.quarantine_reason = 'ผู้ผลิตแจ้งเรียกคืนล็อตยา (Manufacturer Recall Notice)';
    if (sb) sb.quantity_available = 0;
    showToast('เรียกคืนล็อตยาแล้ว', `ล็อต ${lot.lot_number} ถูกกำหนดสถานะเรียกคืนเรียบร้อย`, 'warning');
  } else {
    lot.quarantine_reason = null;
    if (sb) sb.quantity_available = Math.max(0, sb.quantity_on_hand - sb.quantity_reserved);
    showToast('ปลดกักกันสำเร็จ', `ล็อต ${lot.lot_number} กลับสู่สถานะพร้อมจ่ายตามปกติ`, 'success');
  }

  renderInventoryBatchControl();
  renderCurrentView();
}

// --- 8.7 Cross-Domain 1-Click PR Generator (Domain 04 -> Domain 09) ---
function openPurchaseRequisitionModal(productId) {
  const prod = getProductById(productId);
  if (!prod) return;

  const totalOnHand = getProductTotalOnHand(prod.id);
  const suggestedQty = Math.max(prod.minimum_stock * 2 - totalOnHand, prod.minimum_stock);
  const defaultSupplier = (state.suppliers || []).find(s => s.id === prod.default_supplier_id) || state.suppliers[0];

  const modal = document.getElementById('modal-pr-generator');
  const summaryCard = document.getElementById('pr-product-summary-card');
  const qtyInput = document.getElementById('pr-form-qty');
  const unitLabel = document.getElementById('pr-form-unit-label');
  const supplierSelect = document.getElementById('pr-form-supplier');
  const costLabel = document.getElementById('pr-form-estimated-cost');

  summaryCard.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h4 class="font-extrabold text-sm text-teal-950">${prod.product_name}</h4>
        <p class="text-[11px] text-teal-800/80">รหัส: <span class="font-mono font-bold">${prod.product_code}</span> • ${prod.generic_name || ''}</p>
      </div>
      <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-teal-900 border border-teal-200">
        คงเหลือ: ${totalOnHand} ${prod.base_unit}
      </span>
    </div>
    <div class="pt-1.5 border-t border-teal-200/80 flex items-center justify-between text-[11px] text-teal-900">
      <span>เกณฑ์ขั้นต่ำ (Min Stock): <strong>${prod.minimum_stock}</strong> ${prod.base_unit}</span>
      <span>จุดสั่งซื้อ (ROP): <strong>${prod.reorder_point || prod.minimum_stock}</strong> ${prod.base_unit}</span>
    </div>
  `;

  qtyInput.value = suggestedQty;
  unitLabel.innerText = prod.unit_conversion ? prod.unit_conversion.purchase_unit : prod.base_unit;

  // Supplier Options
  supplierSelect.innerHTML = (state.suppliers || []).map(s => `
    <option value="${s.id}" ${s.id === (defaultSupplier ? defaultSupplier.id : 1) ? 'selected' : ''}>
      ${s.name} (${s.type || 'ผู้จัดจำหน่ายเวชภัณฑ์'})
    </option>
  `).join('');

  const updateCost = () => {
    const qty = parseFloat(qtyInput.value) || 0;
    const estCost = qty * prod.unit_cost;
    costLabel.innerText = `฿${estCost.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
  };
  qtyInput.oninput = updateCost;
  updateCost();

  modal.classList.remove('hidden');
  state.activePrProductId = productId;
  lucide.createIcons();
}

function closePrGeneratorModal() {
  document.getElementById('modal-pr-generator')?.classList.add('hidden');
  state.activePrProductId = null;
}

function confirmSubmitPurchaseRequisition() {
  const prod = getProductById(state.activePrProductId);
  if (!prod) return;

  const qty = parseFloat(document.getElementById('pr-form-qty')?.value) || 20;
  const urgency = document.getElementById('pr-form-urgency')?.value || 'NORMAL';
  const supplierId = Number(document.getElementById('pr-form-supplier')?.value || 1);
  const supplier = (state.suppliers || []).find(s => s.id === supplierId);
  const reason = document.getElementById('pr-form-reason')?.value.trim() || 
    `สต็อกคงเหลือ (${getProductTotalOnHand(prod.id)}) ต่ำกว่าเกณฑ์ขั้นต่ำ (${prod.minimum_stock}) แนะนำเติมสต็อกด่วน`;

  const prNum = `PR-202603-00${(state.purchaseRequisitions || []).length + 1}`;
  const newPr = {
    id: (state.purchaseRequisitions || []).length + 1,
    requisitionNumber: prNum,
    department: 'Pharmacy (ห้องยาและคลังเวชภัณฑ์)',
    requestedBy: 'ภก. อานนท์ เวชสิทธิ์',
    requestedAt: '2026-03-02 11:45',
    urgency: urgency,
    reason: reason,
    status: 'SUBMITTED',
    convertedPoNumber: null,
    items: [
      {
        productId: prod.id,
        productCode: prod.product_code,
        name: prod.product_name,
        requestedQty: qty,
        unit: prod.unit_conversion ? prod.unit_conversion.purchase_unit : prod.base_unit,
        estimatedPrice: prod.unit_cost
      }
    ]
  };

  if (!state.purchaseRequisitions) state.purchaseRequisitions = [];
  state.purchaseRequisitions.unshift(newPr);

  closePrGeneratorModal();
  showToast(
    'สร้างใบขอซื้อสำเร็จ!',
    `ใบขอซื้อ ${prNum} ถูกส่งตรงเข้าสู่ระบบจัดซื้อ (Domain 09 Procurement) เรียบร้อยแล้ว`,
    'success'
  );
  renderCurrentView();
}

// --- 8.8 Safety-First Medication Return Flow (Rule 9.4) ---
function openMedicationReturnModal(dispenseId) {
  const d = getDispensingById(dispenseId);
  if (!d) return;

  const pet = getPetById(d.pet_id);
  const owner = getCustomerById(d.customer_id);
  const modal = document.getElementById('modal-medication-return');
  const infoCard = document.getElementById('return-dispense-info-card');
  const itemsContainer = document.getElementById('return-items-list-container');

  infoCard.innerHTML = `
    <div class="flex items-center justify-between">
      <strong class="text-slate-900 font-bold text-xs">${d.dispensing_number}</strong>
      <span class="text-[10px] text-slate-500 font-mono">จ่ายเมื่อ: ${d.dispensed_at || d.created_at}</span>
    </div>
    <div class="text-[11px] text-slate-600">
      ผู้ป่วย: <strong>${pet ? pet.pet_name : ''}</strong> (${pet ? pet.species : ''}) • เจ้าของ: <strong>${owner ? owner.display_name : ''}</strong>
    </div>
  `;

  itemsContainer.innerHTML = d.items.map((it, idx) => {
    const prod = getProductById(it.product_id);
    const lot = getLotById(it.selected_lot_id);
    return `
      <div class="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <input type="checkbox" id="ret-item-check-${it.id}" checked class="rounded text-rose-600 focus:ring-rose-500">
          <div>
            <label for="ret-item-check-${it.id}" class="font-bold text-slate-800 block text-xs cursor-pointer">${prod ? prod.product_name : ''}</label>
            <span class="text-[10px] text-slate-500 font-mono">Lot: ${lot ? lot.lot_number : '-'} • ที่เคยจ่าย: ${it.quantity} ${it.unit}</span>
          </div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <span class="text-[11px] text-slate-500 font-medium">จำนวนที่รับคืน:</span>
          <input type="number" id="ret-item-qty-${it.id}" value="${it.quantity}" max="${it.quantity}" min="1" class="w-16 bg-white border border-slate-300 rounded-lg p-1 text-center font-bold text-xs text-rose-700">
          <span class="text-xs text-slate-600">${it.unit}</span>
        </div>
      </div>
    `;
  }).join('');

  state.activeReturnDispenseId = dispenseId;
  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeMedicationReturnModal() {
  document.getElementById('modal-medication-return')?.classList.add('hidden');
  state.activeReturnDispenseId = null;
}

function confirmSubmitMedicationReturn() {
  const d = getDispensingById(state.activeReturnDispenseId);
  if (!d) return;

  const disposition = document.querySelector('input[name="return-disposition"]:checked')?.value || 'QUARANTINE';
  const reason = document.getElementById('return-reason-select')?.value || 'สัตว์เลี้ยงแพ้ยา';
  const notes = document.getElementById('return-pharmacist-notes')?.value.trim() || 'รับคืนยาตามคำร้องขอ';

  // Process return for checked items
  d.items.forEach(it => {
    const isChecked = document.getElementById(`ret-item-check-${it.id}`)?.checked;
    if (!isChecked) return;

    const returnQty = parseFloat(document.getElementById(`ret-item-qty-${it.id}`)?.value) || it.quantity;
    const prod = getProductById(it.product_id);
    const lot = getLotById(it.selected_lot_id);

    // Rule 9.4: Check disposition!
    if (disposition === 'RESTOCK') {
      // Safely sealed: return to active stock
      const sb = (state.stockBalances || []).find(b => b.product_id === it.product_id && b.lot_id === it.selected_lot_id);
      if (sb) {
        sb.quantity_on_hand += returnQty;
        sb.quantity_available += returnQty;
      }
    } else {
      // Quarantine: record into quarantine lot/balance without increasing available
      const sb = (state.stockBalances || []).find(b => b.product_id === it.product_id && b.lot_id === it.selected_lot_id);
      if (sb) {
        sb.quantity_on_hand += returnQty;
        // Available remains untouched!
      }
    }

    // Log to Stock Movement Ledger
    state.stockMovements.unshift({
      id: state.stockMovements.length + 1,
      movement_number: `MOV-2026-00${state.stockMovements.length + 1}`,
      product_id: it.product_id,
      lot_id: it.selected_lot_id,
      warehouse_name: disposition === 'QUARANTINE' ? 'คลังกักกันตรวจสอบ (Quarantine)' : 'คลังยาหลักห้องตรวจ',
      movement_type: 'DISPENSE_RETURN',
      quantity: returnQty,
      unit_cost: prod ? prod.unit_cost : 0,
      reference_type: 'MEDICATION_RETURN',
      reference_code: d.dispensing_number,
      movement_at: '2026-03-02 11:50',
      performed_by: 'ภก. อานนท์ เวชสิทธิ์',
      notes: `รับคืนยา: ${reason} (${disposition === 'QUARANTINE' ? 'ส่งคลังกักกันตรวจสอบ' : 'รับคืนเข้าสต็อกปกติ'}) - ${notes}`
    });
  });

  d.status = 'RETURNED';

  closeMedicationReturnModal();
  showToast(
    'บันทึกการรับคืนยาสำเร็จ!',
    `ใบจ่ายยา ${d.dispensing_number} ได้รับการคืนยาเรียบร้อย (${disposition === 'QUARANTINE' ? 'เข้าคลังกักกันตรวจสอบ' : 'คืนเข้าสต็อก'})`,
    'info'
  );
  renderCurrentView();
}

// --- 8.9 New Product Master Registration ---
function openNewProductModal() {
  const modal = document.getElementById('modal-new-product');
  if (!modal) return;

  const supplierSelect = document.getElementById('np-supplier-select');
  if (supplierSelect) {
    supplierSelect.innerHTML = (state.suppliers || []).map(s => `
      <option value="${s.id}">${s.name}</option>
    `).join('');
  }

  // Generate next code
  const codeInput = document.getElementById('np-code');
  if (codeInput) codeInput.value = `MED-NEW-0${state.products.length + 1}`;

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeNewProductModal() {
  document.getElementById('modal-new-product')?.classList.add('hidden');
}

function saveNewProductMaster() {
  const code = document.getElementById('np-code')?.value.trim();
  const name = document.getElementById('np-name')?.value.trim();
  const generic = document.getElementById('np-generic')?.value.trim();
  const category = document.getElementById('np-category')?.value || 'ยาสัตว์เลี้ยง';
  const dosageForm = document.getElementById('np-dosage-form')?.value.trim() || 'ยาเม็ด';
  const strength = document.getElementById('np-strength')?.value.trim() || '-';
  const baseUnit = document.getElementById('np-base-unit')?.value.trim() || 'เม็ด';
  const cost = parseFloat(document.getElementById('np-cost')?.value) || 10;
  const price = parseFloat(document.getElementById('np-price')?.value) || 20;
  const minStock = parseFloat(document.getElementById('np-min-stock')?.value) || 30;
  const rop = parseFloat(document.getElementById('np-rop')?.value) || 50;
  const isColdChain = document.getElementById('np-is-cold-chain')?.checked || false;
  const storageDesc = document.getElementById('np-storage-desc')?.value.trim() || (isColdChain ? 'ตู้เย็น 2°C - 8°C' : 'อุณหภูมิห้อง ไม่เกิน 25°C');
  const supplierId = Number(document.getElementById('np-supplier-select')?.value || 1);

  if (!code || !name) {
    alert('กรุณากรอกรหัสสินค้าและชื่อยา/เวชภัณฑ์');
    return;
  }

  const newProdId = state.products.length + 1;
  const newProduct = {
    id: newProdId,
    product_code: code,
    product_name: name,
    generic_name: generic,
    brand_name: name,
    product_type: category === 'วัคซีน' ? 'VACCINE' : category === 'เวชภัณฑ์' ? 'SUPPLY' : 'MEDICATION',
    category: category,
    dosage_form: dosageForm,
    strength: strength,
    base_unit: baseUnit,
    packaging: document.getElementById('np-packaging-desc')?.value.trim() || `กล่องละ 1 ${baseUnit}`,
    unit_conversion: {
      purchase_unit: document.getElementById('np-purchase-unit')?.value.trim() || 'กล่อง',
      factor: parseFloat(document.getElementById('np-conv-factor')?.value) || 1,
      dispense_unit: baseUnit
    },
    minimum_stock: minStock,
    reorder_point: rop,
    unit_price: price,
    unit_cost: cost,
    status: 'ACTIVE',
    requires_prescription: true,
    storage_condition: storageDesc,
    is_cold_chain: isColdChain,
    cold_chain_min_c: isColdChain ? 2.0 : null,
    cold_chain_max_c: isColdChain ? 8.0 : null,
    is_lot_tracked: true,
    is_expiry_tracked: true,
    default_supplier_id: supplierId
  };

  state.products.push(newProduct);

  closeNewProductModal();
  showToast(
    'ลงทะเบียนยาใหม่สำเร็จ!',
    `เพิ่ม ${name} (${code}) เข้าสู่ทะเบียนยา Master Data เรียบร้อยแล้ว`,
    'success'
  );
  renderCurrentView();
}

// --- 8.10 Pharmaceutical 360 Monograph Modal ---
function openPharmaInfoModal(productId) {
  const prod = getProductById(productId);
  if (!prod) return;

  const modal = document.getElementById('modal-pharma-info');
  const title = document.getElementById('pharma-modal-title');
  const subtitle = document.getElementById('pharma-modal-subtitle');
  const body = document.getElementById('pharma-modal-body');

  title.innerText = `${prod.product_name} (${prod.strength || ''})`;
  subtitle.innerText = `ชื่อสามัญ: ${prod.generic_name || '-'} • รหัสสินค้า: ${prod.product_code}`;

  const availableLots = getProductAvailableLots(prod.id);

  body.innerHTML = `
    <!-- Key Clinical Overview Card -->
    <div class="bg-indigo-50/80 p-4 rounded-xl border border-indigo-200/90 space-y-2">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-indigo-950">ประเภทยา / กลุ่มการรักษา:</span>
        <span class="font-bold text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-200">${prod.category}</span>
      </div>
      <div class="flex items-center justify-between text-xs">
        <span class="text-indigo-900 font-medium">รูปแบบยาและความแรง:</span>
        <span class="font-bold text-slate-900">${prod.dosage_form} (${prod.strength || '-'})</span>
      </div>
      <div class="flex items-center justify-between text-xs">
        <span class="text-indigo-900 font-medium">ต้องการใบสั่งแพทย์ (Rx):</span>
        <span class="font-bold ${prod.requires_prescription ? 'text-amber-800' : 'text-slate-600'}">
          ${prod.requires_prescription ? '🔒 ต้องมีใบสั่งแพทย์กำกับ (Prescription Required)' : 'จำหน่ายทั่วไป'}
        </span>
      </div>
    </div>

    <!-- Storage & Temperature Specifications -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
      <h5 class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
        <i data-lucide="thermometer" class="w-4 h-4 text-teal-600"></i>
        <span>เงื่อนไขการจัดเก็บและการควบคุมอุณหภูมิ (Storage Controls)</span>
      </h5>
      <p class="text-slate-700 text-xs">${prod.storage_condition}</p>
      ${prod.is_cold_chain ? `
        <div class="p-2 bg-blue-100/90 text-blue-900 border border-blue-300 rounded-lg text-[11px] font-bold flex items-center gap-2">
          <i data-lucide="shield-check" class="w-4 h-4 text-blue-700 shrink-0"></i>
          <span>ต้องจัดเก็บในตู้เย็นควบคุมความเย็น 2.0°C ถึง 8.0°C ตลอดห่วงโซ่ความเย็น (Cold Chain)</span>
        </div>
      ` : ''}
    </div>

    <!-- Packaging & Unit Conversion -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
      <h5 class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
        <i data-lucide="box" class="w-4 h-4 text-teal-600"></i>
        <span>บรรจุภัณฑ์และอัตราการแปลงหน่วย (UOM Conversion)</span>
      </h5>
      <p class="text-xs text-slate-700 font-mono">
        ${prod.packaging || 'บรรจุภัณฑ์มาตรฐาน'} • 1 ${prod.unit_conversion ? prod.unit_conversion.purchase_unit : 'หน่วยซื้อ'} = ${prod.unit_conversion ? prod.unit_conversion.factor : 1} ${prod.base_unit}
      </p>
    </div>

    <!-- Active Lots in Stock -->
    <div class="space-y-2">
      <h5 class="font-bold text-slate-800 text-xs">ล็อตที่มีอยู่ในสต็อก (${availableLots.length} ล็อต):</h5>
      <div class="space-y-1.5">
        ${availableLots.length > 0 ? availableLots.map(l => {
          const sb = (state.stockBalances || []).find(b => b.lot_id === l.id);
          return `
            <div class="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs font-mono">
              <div>
                <strong class="text-slate-900">${l.lot_number}</strong>
                <span class="text-[10px] text-slate-400 block font-sans">คลัง: ${sb ? sb.warehouse_name : 'คลังยาหลัก'}</span>
              </div>
              <div class="text-right">
                <span class="font-bold text-teal-700">${sb ? sb.quantity_on_hand : l.quantity_initial} ${prod.base_unit}</span>
                <span class="text-[10px] text-slate-500 block">Exp: ${formatDateThai(l.expiry_date)}</span>
              </div>
            </div>
          `;
        }).join('') : '<p class="text-xs text-slate-400 italic">ไม่มีล็อตสินค้าคงเหลือ</p>'}
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closePharmaInfoModal() {
  document.getElementById('modal-pharma-info')?.classList.add('hidden');
}

// --- 8.11 Internal Stock Issue & Transfer Action Sheets ---
function openInternalIssueSheet() {
  state.sheetMode = 'internal-issue';
  openSheetContainer();

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  badge.innerText = 'INTERNAL STOCK ISSUE';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300';
  title.innerText = 'สร้างใบเบิกใช้เวชภัณฑ์ภายในคลินิก (Internal Issue)';
  subtitle.innerText = 'เบิกยา, สารน้ำ, หรือเวชภัณฑ์ใช้ในห้องผ่าตัด OR หรือวอร์ด';

  body.innerHTML = `
    <div class="space-y-4 text-xs">
      <div>
        <label class="block text-slate-700 font-bold mb-1">แผนกที่ขอเบิก *</label>
        <select id="issue-form-dept" class="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900">
          <option value="SURGERY (ห้องผ่าตัดใหญ่)">SURGERY (ห้องผ่าตัดใหญ่)</option>
          <option value="INPATIENT WARD (วอร์ดสัตว์ป่วยใน)">INPATIENT WARD (วอร์ดสัตว์ป่วยใน)</option>
          <option value="EMERGENCY (หน่วยฉุกเฉิน)">EMERGENCY (หน่วยฉุกเฉิน)</option>
          <option value="DENTAL & GROOMING (ทันตกรรม/ดูแลสัตว์)">DENTAL & GROOMING (ทันตกรรม/ดูแลสัตว์)</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-700 font-bold mb-1">ผู้ขอเบิก *</label>
          <input type="text" id="issue-form-requester" value="น.สพ. วรภัทร ชัยมงคล" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
        </div>
        <div>
          <label class="block text-slate-700 font-bold mb-1">ผู้จ่ายเวชภัณฑ์ *</label>
          <input type="text" id="issue-form-issuer" value="ภก. อานนท์ เวชสิทธิ์" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
        </div>
      </div>

      <div>
        <label class="block text-slate-700 font-bold mb-1">เลือกรายการเวชภัณฑ์ที่ต้องการเบิก *</label>
        <select id="issue-form-product" class="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-semibold">
          ${state.products.map(p => `
            <option value="${p.id}">${p.product_code}: ${p.product_name} (คงเหลือ: ${getProductTotalOnHand(p.id)} ${p.base_unit})</option>
          `).join('')}
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-700 font-bold mb-1">จำนวนที่เบิก *</label>
          <input type="number" id="issue-form-qty" value="2" min="1" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-blue-800">
        </div>
        <div>
          <label class="block text-slate-700 font-bold mb-1">คลังต้นทางที่ตัดจ่าย *</label>
          <select id="issue-form-wh" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
            <option value="คลังยาหลักห้องตรวจ">คลังยาหลักห้องตรวจ</option>
            <option value="ตู้ยาและเวชภัณฑ์ห้องผ่าตัด (OR Storeroom)">ตู้ยาและเวชภัณฑ์ห้องผ่าตัด (OR Storeroom)</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-slate-700 font-bold mb-1">วัตถุประสงค์การใช้ (Purpose) *</label>
        <textarea id="issue-form-purpose" rows="2" placeholder="เช่น ใช้สำหรับการผ่าตัดทำหมันสุนัข หรือทำแผลฉุกเฉิน..." class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">ใช้สำหรับหัตถการผ่าตัดกระเพาะปัสสาวะสุนัข (Cystotomy)</textarea>
      </div>
    </div>
  `;

  footer.innerHTML = `
    <div class="w-full flex items-center justify-end gap-2">
      <button onclick="closeSheet()" class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer">
        ยกเลิก
      </button>
      <button onclick="confirmInternalIssue()" class="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="check" class="w-4 h-4"></i>
        <span>ยืนยันการเบิกใช้</span>
      </button>
    </div>
  `;

  lucide.createIcons();
}

function confirmInternalIssue() {
  const prodId = Number(document.getElementById('issue-form-product')?.value || 1);
  const qty = parseFloat(document.getElementById('issue-form-qty')?.value) || 1;
  const dept = document.getElementById('issue-form-dept')?.value || 'SURGERY';
  const requester = document.getElementById('issue-form-requester')?.value || 'สัตวแพทย์';
  const issuer = document.getElementById('issue-form-issuer')?.value || 'ภก. อานนท์';
  const purpose = document.getElementById('issue-form-purpose')?.value.trim() || 'เบิกใช้ทั่วไป';

  const prod = getProductById(prodId);
  const availableLots = getProductAvailableLots(prodId);
  const lot = availableLots[0] || state.inventoryLots[0];

  // Deduct stock
  const sb = (state.stockBalances || []).find(b => b.product_id === prodId);
  if (sb) {
    sb.quantity_on_hand = Math.max(0, sb.quantity_on_hand - qty);
    sb.quantity_available = Math.max(0, sb.quantity_available - qty);
  }

  const issueNum = `ISS-2026-00${(state.internalStockIssues || []).length + 1}`;
  state.internalStockIssues.unshift({
    id: (state.internalStockIssues || []).length + 1,
    issue_number: issueNum,
    department: dept,
    requested_by: requester,
    issued_by: issuer,
    issued_at: '2026-03-02 12:00',
    purpose: purpose,
    status: 'COMPLETED',
    items: [
      {
        product_id: prodId,
        product_name: prod ? prod.product_name : '',
        lot_id: lot ? lot.id : null,
        quantity: qty,
        unit: prod ? prod.base_unit : ''
      }
    ]
  });

  // Stock Movement log
  state.stockMovements.unshift({
    id: state.stockMovements.length + 1,
    movement_number: `MOV-2026-00${state.stockMovements.length + 1}`,
    product_id: prodId,
    lot_id: lot ? lot.id : null,
    warehouse_name: 'คลังยาหลักห้องตรวจ',
    movement_type: 'INTERNAL_ISSUE',
    quantity: -qty,
    unit_cost: prod ? prod.unit_cost : 0,
    reference_type: 'STOCK_ISSUE',
    reference_code: issueNum,
    movement_at: '2026-03-02 12:00',
    performed_by: issuer,
    notes: `เบิกใช้ภายในแผนก ${dept}: ${purpose}`
  });

  closeSheet();
  showToast(
    'เบิกใช้เวชภัณฑ์สำเร็จ!',
    `ใบเบิก ${issueNum} ตัดสต็อก ${prod ? prod.product_name : ''} จำนวน ${qty} หน่วย เรียบร้อย`,
    'success'
  );
  renderCurrentView();
}

function openStockTransferSheet() {
  state.sheetMode = 'stock-transfer';
  openSheetContainer();

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  badge.innerText = 'STOCK TRANSFER';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300';
  title.innerText = 'โอนย้ายสินค้าระหว่างคลัง (Inter-Warehouse Transfer)';
  subtitle.innerText = 'ย้ายสินค้าระหว่างคลังยาหลัก, ตู้เย็นวัคซีน, และตู้ยาผ่าตัด';

  body.innerHTML = `
    <div class="space-y-4 text-xs">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-700 font-bold mb-1">คลังต้นทาง (Source WH) *</label>
          <select id="transfer-src-wh" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
            <option value="1">คลังยาหลักห้องตรวจ (WH-MAIN)</option>
            <option value="2">ตู้เย็นเก็บวัคซีนและชีววัตถุ (WH-COLD)</option>
            <option value="3">ตู้ยาและเวชภัณฑ์ห้องผ่าตัด (WH-OR)</option>
          </select>
        </div>
        <div>
          <label class="block text-slate-700 font-bold mb-1">คลังปลายทาง (Destination WH) *</label>
          <select id="transfer-dest-wh" class="w-full bg-white border border-purple-300 rounded-lg p-2 text-xs font-bold text-purple-900">
            <option value="3">ตู้ยาและเวชภัณฑ์ห้องผ่าตัด (WH-OR)</option>
            <option value="4">ตู้ยาประจำวอร์ดสัตว์ป่วยใน (WH-WARD)</option>
            <option value="1">คลังยาหลักห้องตรวจ (WH-MAIN)</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-slate-700 font-bold mb-1">เลือกรายการยา / เวชภัณฑ์ที่ต้องการโอน *</label>
        <select id="transfer-form-product" class="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-semibold">
          ${state.products.map(p => `
            <option value="${p.id}">${p.product_code}: ${p.product_name} (คงเหลือ: ${getProductTotalOnHand(p.id)} ${p.base_unit})</option>
          `).join('')}
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-700 font-bold mb-1">จำนวนที่โอน *</label>
          <input type="number" id="transfer-form-qty" value="5" min="1" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-purple-800">
        </div>
        <div>
          <label class="block text-slate-700 font-bold mb-1">ผู้ขอโอนย้าย *</label>
          <input type="text" id="transfer-form-requester" value="น.สพ. วรภัทร ชัยมงคล" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
        </div>
      </div>

      <div>
        <label class="block text-slate-700 font-bold mb-1">หมายเหตุการโอนย้าย</label>
        <input type="text" id="transfer-form-notes" placeholder="เช่น โอนสำรองสำหรับเคสผ่าตัดรอบบ่าย..." class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
      </div>
    </div>
  `;

  footer.innerHTML = `
    <div class="w-full flex items-center justify-end gap-2">
      <button onclick="closeSheet()" class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer">
        ยกเลิก
      </button>
      <button onclick="confirmStockTransfer()" class="px-4 py-2 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
        <span>ยืนยันการโอนย้ายคลัง</span>
      </button>
    </div>
  `;

  lucide.createIcons();
}

function confirmStockTransfer() {
  const prodId = Number(document.getElementById('transfer-form-product')?.value || 1);
  const qty = parseFloat(document.getElementById('transfer-form-qty')?.value) || 5;
  const srcWhId = Number(document.getElementById('transfer-src-wh')?.value || 1);
  const destWhId = Number(document.getElementById('transfer-dest-wh')?.value || 3);
  const requester = document.getElementById('transfer-form-requester')?.value || 'สัตวแพทย์';
  const notes = document.getElementById('transfer-form-notes')?.value.trim() || 'โอนย้ายสินค้าระหว่างคลัง';

  const srcWh = getWarehouseById(srcWhId) || state.warehouses[0];
  const destWh = getWarehouseById(destWhId) || state.warehouses[2];
  const prod = getProductById(prodId);
  const lots = getProductAvailableLots(prodId);
  const lot = lots[0] || state.inventoryLots[0];

  const trNum = `TR-2026-00${(state.stockTransfers || []).length + 1}`;
  state.stockTransfers.unshift({
    id: (state.stockTransfers || []).length + 1,
    transfer_number: trNum,
    source_warehouse_id: srcWhId,
    source_warehouse_name: srcWh ? srcWh.warehouse_name : '',
    destination_warehouse_id: destWhId,
    destination_warehouse_name: destWh ? destWh.warehouse_name : '',
    requested_by: requester,
    approved_by: 'ภก. อานนท์ เวชสิทธิ์',
    transferred_at: '2026-03-02 12:15',
    status: 'COMPLETED',
    notes: notes,
    items: [
      {
        product_id: prodId,
        product_name: prod ? prod.product_name : '',
        lot_id: lot ? lot.id : null,
        lot_number: lot ? lot.lot_number : '-',
        quantity: qty,
        unit: prod ? prod.base_unit : ''
      }
    ]
  });

  // Double-entry movement in stock ledger (TRANSFER_OUT + TRANSFER_IN)
  state.stockMovements.unshift({
    id: state.stockMovements.length + 1,
    movement_number: `MOV-2026-00${state.stockMovements.length + 1}`,
    product_id: prodId,
    lot_id: lot ? lot.id : null,
    warehouse_name: srcWh ? srcWh.warehouse_name : 'คลังต้นทาง',
    movement_type: 'TRANSFER_OUT',
    quantity: -qty,
    unit_cost: prod ? prod.unit_cost : 0,
    reference_type: 'STOCK_TRANSFER',
    reference_code: trNum,
    movement_at: '2026-03-02 12:15',
    performed_by: requester,
    notes: `โอนย้ายไปยัง ${destWh ? destWh.warehouse_name : ''}`
  });

  state.stockMovements.unshift({
    id: state.stockMovements.length + 1,
    movement_number: `MOV-2026-00${state.stockMovements.length + 1}`,
    product_id: prodId,
    lot_id: lot ? lot.id : null,
    warehouse_name: destWh ? destWh.warehouse_name : 'คลังปลายทาง',
    movement_type: 'TRANSFER_IN',
    quantity: qty,
    unit_cost: prod ? prod.unit_cost : 0,
    reference_type: 'STOCK_TRANSFER',
    reference_code: trNum,
    movement_at: '2026-03-02 12:16',
    performed_by: requester,
    notes: `รับโอนจาก ${srcWh ? srcWh.warehouse_name : ''}`
  });

  closeSheet();
  showToast(
    'โอนย้ายสินค้าระหว่างคลังสำเร็จ!',
    `ใบโอน ${trNum} โอน ${prod ? prod.product_name : ''} จำนวน ${qty} หน่วย ไปยัง ${destWh.warehouse_name} เรียบร้อย`,
    'success'
  );
  renderCurrentView();
}

// --- 8.12 Dispensing Action Sheet (FEFO Lot Selection & Verification) ---
function openDispenseSheet(dispenseId) {
  const d = getDispensingById(dispenseId);
  if (!d) return;

  state.sheetMode = 'dispense-order';
  state.activeDispenseId = dispenseId;
  openSheetContainer();

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  const pet = getPetById(d.pet_id);
  const owner = getCustomerById(d.customer_id);
  const doctor = getDoctorById(d.doctor_id);
  const hasAllergy = pet && pet.allergies && pet.allergies.length > 0;

  badge.innerText = 'MEDICATION DISPENSING';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300';
  title.innerText = `ตรวจสอบและจ่ายยา (${d.dispensing_number})`;
  subtitle.innerText = `จ่ายยาให้: ${pet ? pet.pet_name : ''} (เจ้าของ: ${owner ? owner.display_name : ''})`;

  body.innerHTML = `
    <div class="space-y-4">
      <!-- Patient & Medical Info Card -->
      <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <img src="${pet ? pet.photo : ''}" class="w-10 h-10 rounded-lg object-cover border border-slate-300">
            <div>
              <h4 class="font-bold text-slate-900 text-sm">${pet ? pet.pet_name : ''} (${pet ? pet.species : ''} - ${pet ? pet.breed : ''})</h4>
              <p class="text-xs text-slate-500">น้ำหนักตัว: <strong class="text-teal-700">${pet ? pet.current_weight : ''} kg</strong> • เจ้าของ: ${owner ? owner.display_name : ''} (${owner ? owner.phone_primary : ''})</p>
            </div>
          </div>
          <span class="text-xs font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200">${d.dispensing_number}</span>
        </div>
        
        <div class="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <span>สัตวแพทย์ผู้สั่งยา: <strong class="text-slate-800">${doctor ? doctor.name : ''}</strong></span>
          <span>การวินิจฉัย: <strong class="text-slate-800">${d.diagnosis_summary}</strong></span>
        </div>
      </div>

      <!-- High-Visibility Drug Allergy Alert (Von Restorff Effect) -->
      ${hasAllergy ? `
        <div class="p-3 bg-rose-50 border-2 border-rose-400 rounded-xl flex items-start gap-2.5 text-rose-900 text-xs">
          <i data-lucide="alert-octagon" class="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse"></i>
          <div>
            <strong class="font-bold text-rose-700 block text-xs">⚠️ ตรวจพบประวัติการแพ้ยาในผู้ป่วยรายนี้!</strong>
            <p class="text-[11px] text-rose-800 mt-0.5">ประวัติแพ้ยา: <strong>${pet.allergies.join(', ')}</strong> — กรุณาตรวจสอบชื่อยาและสารเคมีทุกรายการก่อนจ่ายยาจริง</p>
          </div>
        </div>
      ` : ''}

      <!-- Prescribed Medication Items Verification & FEFO Lot Assignment -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <i data-lucide="pill" class="w-4 h-4 text-teal-600"></i>
            <span>รายการยาที่สั่งจ่าย (${d.items.length} รายการ)</span>
          </h4>
          <span class="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            ระบบแนะนำล็อต FEFO อัตโนมัติ
          </span>
        </div>

        ${d.items.map((item, idx) => {
          const prod = getProductById(item.product_id);
          const availableLots = getProductAvailableLots(item.product_id);

          return `
            <div class="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/90 space-y-3">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">${idx + 1}</span>
                    <h5 class="font-bold text-slate-900 text-sm">${prod ? prod.product_name : ''}</h5>
                  </div>
                  <p class="text-xs text-slate-500 ml-7">ชื่อสามัญ: ${prod ? prod.generic_name : ''} • รูปแบบ: ${prod ? prod.dosage_form : ''}</p>
                </div>
                <div class="text-right">
                  <span class="text-sm font-extrabold text-teal-700 font-mono">${item.quantity}</span>
                  <span class="text-xs text-slate-500 font-medium ml-1">${item.unit}</span>
                </div>
              </div>

              <!-- Dosing & Instructions -->
              <div class="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                <p><strong>ขนาด & ความถี่:</strong> ${item.dose} • ${item.frequency} (ระยะเวลา: ${item.duration || '-'})</p>
                <p><strong>วิธีใช้:</strong> ${item.instructions}</p>
                ${item.caution ? `<p class="text-amber-800 font-semibold text-[11px]">⚠️ ข้อควรระวัง: ${item.caution}</p>` : ''}
              </div>

              <!-- FEFO Lot Selection Dropdown (With Recommendation) -->
              <div>
                <label class="block text-slate-700 font-bold text-xs mb-1">
                  เลือกล็อตที่ต้องการตัดจ่าย (FEFO - แนะนำล็อตหมดอายุก่อน) *
                </label>
                <select id="dispense-lot-select-${item.id}" class="w-full bg-white border border-teal-300 rounded-lg p-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500">
                  ${availableLots.map((lot, lIdx) => {
                    const sb = (state.stockBalances || []).find(b => b.lot_id === lot.id);
                    const onHand = sb ? sb.quantity_on_hand : lot.quantity_initial;
                    const isFefoBest = lIdx === 0;
                    return `
                      <option value="${lot.id}" ${isFefoBest ? 'selected' : ''}>
                        ${isFefoBest ? '⭐ [FEFO แนะนำ] ' : ''}ล็อต: ${lot.lot_number} | หมดอายุ: ${formatDateThai(lot.expiry_date)} | คงเหลือ: ${onHand} ${prod ? prod.base_unit : ''}
                      </option>
                    `;
                  }).join('')}
                </select>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Pharmacist Notes -->
      <div>
        <label class="block text-slate-700 font-semibold text-xs mb-1">บันทึกเพิ่มเติมจากเภสัชกร (Pharmacist Notes)</label>
        <input type="text" id="dispense-pharmacist-note" placeholder="เช่น แนะนำให้แช่เย็น, เจ้าของรับทราบคำเตือนแล้ว..." class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
      </div>
    </div>
  `;

  footer.innerHTML = `
    <div class="w-full flex items-center justify-between gap-2">
      <button onclick="openDrugLabelModal(${d.id})" class="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="printer" class="w-4 h-4 text-slate-600"></i>
        <span>ดูตัวอย่างฉลากยา</span>
      </button>
      <div class="flex items-center gap-2">
        <button onclick="closeSheet()" class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer">
          ยกเลิก
        </button>
        <button onclick="confirmDispense(${d.id})" class="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="check-circle-2" class="w-4 h-4"></i>
          <span>ยืนยันการจ่ายยาและตัดสต็อก (FEFO)</span>
        </button>
      </div>
    </div>
  `;

  lucide.createIcons();
}

function confirmDispense(dispenseId) {
  const d = getDispensingById(dispenseId);
  if (!d) return;

  const pet = getPetById(d.pet_id);

  // Deduct stock for each item from chosen lots
  d.items.forEach(item => {
    const lotSelect = document.getElementById(`dispense-lot-select-${item.id}`);
    const chosenLotId = lotSelect ? Number(lotSelect.value) : item.selected_lot_id;
    item.selected_lot_id = chosenLotId;

    // Deduct stock balance
    const balance = (state.stockBalances || []).find(sb => sb.lot_id === chosenLotId && sb.product_id === item.product_id);
    if (balance) {
      balance.quantity_on_hand = Math.max(0, balance.quantity_on_hand - item.quantity);
      balance.quantity_available = Math.max(0, balance.quantity_available - item.quantity);
    }

    const prod = getProductById(item.product_id);
    const lot = getLotById(chosenLotId);

    // Record Stock Movement Audit Trail
    state.stockMovements.unshift({
      id: state.stockMovements.length + 1,
      movement_number: `MOV-2026-00${state.stockMovements.length + 1}`,
      product_id: item.product_id,
      lot_id: chosenLotId,
      warehouse_name: balance ? balance.warehouse_name : 'คลังยาหลักห้องตรวจ',
      movement_type: 'DISPENSE',
      quantity: -item.quantity,
      unit_cost: prod ? prod.unit_cost : 0,
      reference_type: 'DISPENSING',
      reference_code: d.dispensing_number,
      movement_at: '2026-03-02 12:20',
      performed_by: 'ภก. อานนท์ เวชสิทธิ์',
      notes: `จ่ายยาให้ ${pet ? pet.pet_name : ''} (ล็อต ${lot ? lot.lot_number : ''})`
    });

    item.status = 'DISPENSED';
  });

  d.status = 'DISPENSED';
  d.dispensed_at = '2026-03-02 12:20';
  d.dispensed_by = 'ภก. อานนท์ เวชสิทธิ์ (เภสัชกรประจำคลินิก)';

  // Central Event Bus Notification (D04 -> D07 Billing)
  if (window.ClinicEventBus && window.CLINIC_EVENTS) {
    window.ClinicEventBus.emit(window.CLINIC_EVENTS.DISPENSE_CONFIRMED, {
      dispensing: d,
      petId: d.pet_id,
      customerId: d.customer_id
    });
  }

  closeSheet();

  showToast(
    'จ่ายยาและตัดสต็อกสำเร็จ!',
    `ใบจ่ายยา ${d.dispensing_number} สำหรับ ${pet ? pet.pet_name : ''} ได้รับการบันทึกตัดล็อต FEFO เรียบร้อย`,
    'success'
  );

  renderCurrentView();
}

// --- 8.13 Printable Drug Label Modal Engine ---
function openDrugLabelModal(dispenseId) {
  const d = getDispensingById(dispenseId);
  if (!d) return;

  const pet = getPetById(d.pet_id);
  const owner = getCustomerById(d.customer_id);
  const doctor = getDoctorById(d.doctor_id);
  const labelContainer = document.getElementById('printable-label-content');

  labelContainer.innerHTML = `
    <!-- Clinic Branding Header -->
    <div class="border-b-2 border-slate-800 pb-2.5 flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-3.5 h-3.5 rounded-full bg-teal-600"></span>
          <h2 class="font-black text-base text-slate-900 tracking-tight">VETCARE+ ANIMAL CLINIC</h2>
        </div>
        <p class="text-[10px] text-slate-500 mt-0.5">คลินิกสัตวแพทย์เว็ทแคร์ พลัส สาขาทองหล่อ-สุขุมวิท โทร. 02-712-3456</p>
      </div>
      <div class="text-right">
        <span class="text-xs font-mono font-bold bg-slate-100 text-slate-900 px-2 py-0.5 rounded border border-slate-300">${d.dispensing_number}</span>
        <p class="text-[10px] text-slate-500 mt-0.5">วันที่: 2 มี.ค. 2026</p>
      </div>
    </div>

    <!-- Patient & Client Bar -->
    <div class="grid grid-cols-2 gap-2 text-xs py-1.5 border-b border-dashed border-slate-300">
      <div><span class="text-slate-500">ชื่อสัตว์ป่วย:</span> <strong class="text-slate-900">${pet ? pet.pet_name : ''}</strong> (${pet ? pet.species : ''} / ${pet ? pet.breed : ''})</div>
      <div><span class="text-slate-500">เจ้าของ:</span> <strong class="text-slate-900">${owner ? owner.display_name : ''}</strong> (${owner ? owner.phone_primary : ''})</div>
      <div><span class="text-slate-500">น้ำหนักตัว:</span> <strong class="text-teal-700">${pet ? pet.current_weight : ''} กก.</strong></div>
      <div><span class="text-slate-500">สัตวแพทย์:</span> <strong class="text-slate-900">${doctor ? doctor.name : 'สัตวแพทย์เวร'}</strong></div>
    </div>

    <!-- Medicine Detail Sections -->
    <div class="space-y-3 py-1">
      ${d.items.map(item => {
        const prod = getProductById(item.product_id);
        const lot = getLotById(item.selected_lot_id);
        return `
          <div class="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-2">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-extrabold text-sm text-slate-900">${prod ? prod.product_name : ''}</h4>
                <p class="text-[11px] text-slate-500">ชื่อสามัญ: ${prod ? prod.generic_name : ''} • ${prod ? prod.strength : ''}</p>
              </div>
              <span class="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">จำนวน: ${item.quantity} ${item.unit}</span>
            </div>

            <!-- Administration Instructions -->
            <div class="p-2.5 bg-white rounded-lg border border-slate-200">
              <p class="font-bold text-slate-900 text-xs">📌 วิธีใช้:</p>
              <p class="text-slate-800 text-xs font-semibold mt-0.5">${item.instructions || item.dose + ' ' + item.frequency}</p>
            </div>

            <!-- Precautions & Warnings -->
            ${item.caution ? `
              <div class="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-medium">
                ⚠️ ${item.caution}
              </div>
            ` : ''}

            <!-- Batch / Expiry Footer -->
            <div class="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200 font-mono">
              <span>Lot No: <strong class="text-slate-700">${lot ? lot.lot_number : '-'}</strong></span>
              <span>Exp Date: <strong class="text-slate-700">${lot ? formatDateThai(lot.expiry_date) : '-'}</strong></span>
              <span>เก็บรักษา: ${prod ? prod.storage_condition : 'ที่ร่ม'}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Dispenser Signature Footnote -->
    <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
      <span>เภสัชกรผู้จัดและจ่ายยา: ${d.dispensed_by || 'ภก. อานนท์ เวชสิทธิ์'}</span>
      <span>ยาใช้สำหรับสัตว์เท่านั้น (For Veterinary Use Only)</span>
    </div>
  `;

  document.getElementById('modal-drug-label').classList.remove('hidden');
  state.activeDispenseId = dispenseId;
  lucide.createIcons();
}

function closeDrugLabelModal() {
  document.getElementById('modal-drug-label')?.classList.add('hidden');
}

function printDrugLabel() {
  showToast('ส่งคำสั่งพิมพ์แล้ว', 'ส่งข้อมูลไปยังเครื่องพิมพ์ฉลากยา (Label Printer) เรียบร้อยแล้ว', 'success');
  setTimeout(() => {
    closeDrugLabelModal();
  }, 800);
}

function copyDrugLabelInstructions() {
  const activeD = getDispensingById(state.activeDispenseId);
  if (!activeD) return;
  const pet = getPetById(activeD.pet_id);
  let text = `[ฉลากยา VETCARE+ สำหรับน้อง ${pet ? pet.pet_name : ''}]\n`;
  activeD.items.forEach(i => {
    const prod = getProductById(i.product_id);
    text += `- ${prod ? prod.product_name : ''} (${i.quantity} ${i.unit})\n  วิธีใช้: ${i.instructions}\n`;
  });
  navigator.clipboard.writeText(text);
  showToast('คัดลอกวิธีใช้สำเร็จ!', 'คัดลอกข้อความคำแนะนำการใช้ยาลงใน Clipboard เรียบร้อยแล้ว', 'info');
}

// --- 8.14 Stock Management Sheet Engine (Goods Receiving & Adjustment) ---
function openStockManageSheet(mode = 'receive', preselectedProductId = null) {
  state.sheetMode = 'stock-manage';
  state.activeStockManageTab = mode;
  state.activeItemId = preselectedProductId;
  openSheetContainer();

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const footer = document.getElementById('sheet-footer');

  badge.innerText = 'INVENTORY MANAGEMENT';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200';
  title.innerText = 'จัดการสต็อกและคลังเวชภัณฑ์ (Inventory Operations)';
  subtitle.innerText = 'ตรวจรับยาเข้าคลังใหม่ กำหนดล็อต/วันหมดอายุ หรือปรับยอดตรวจนับ';
  footer.classList.remove('hidden');

  renderStockManageSheetBody();
  lucide.createIcons();
}

function switchStockManageTab(tabKey) {
  state.activeStockManageTab = tabKey;
  renderStockManageSheetBody();
  lucide.createIcons();
}

function renderStockManageSheetBody() {
  const body = document.getElementById('sheet-body');
  const isReceive = state.activeStockManageTab === 'receive';
  const isAdjust = state.activeStockManageTab === 'adjust';
  const preselectedId = state.activeItemId || (state.products[0]?.id || 1);

  body.innerHTML = `
    <div class="space-y-4">
      <!-- 2 Tab Selector Switcher -->
      <div class="flex rounded-xl bg-slate-100 p-1 border border-slate-200/90 text-xs font-bold">
        <button type="button" onclick="switchStockManageTab('receive')" class="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${isReceive ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}">
          <i data-lucide="package-plus" class="w-4 h-4"></i>
          <span>1. ตรวจรับยาเข้าคลังใหม่ (Goods Receiving)</span>
        </button>
        <button type="button" onclick="switchStockManageTab('adjust')" class="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${isAdjust ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}">
          <i data-lucide="sliders-horizontal" class="w-4 h-4"></i>
          <span>2. ปรับยอดสต็อก (Stock Adjustment)</span>
        </button>
      </div>

      <!-- Tab 1: Goods Receiving Form -->
      <div class="${isReceive ? 'space-y-4' : 'hidden'}">
        <div class="bg-teal-50/70 p-4 rounded-xl border border-teal-200 space-y-3">
          <h4 class="font-bold text-teal-900 text-xs flex items-center gap-1.5">
            <i data-lucide="box" class="w-4 h-4 text-teal-700"></i>
            <span>บันทึกตรวจรับสินค้าและออกล็อตใหม่ (Lot Tracking)</span>
          </h4>

          <div>
            <label class="block text-slate-700 font-bold text-xs mb-1">เลือกรายการยา / เวชภัณฑ์ *</label>
            <select id="form-stock-product" class="w-full bg-white border border-teal-300 rounded-lg p-2 text-xs font-semibold text-slate-800">
              ${state.products.map(p => `
                <option value="${p.id}" ${p.id === preselectedId ? 'selected' : ''}>
                  ${p.product_code}: ${p.product_name} (${p.category})
                </option>
              `).join('')}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-600 font-medium text-xs mb-1">เลขล็อตการผลิต (Lot Number) *</label>
              <input type="text" id="form-stock-lot" value="LOT-RCV-${Date.now().toString().slice(-4)}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900">
            </div>
            <div>
              <label class="block text-slate-600 font-medium text-xs mb-1">วันหมดอายุ (Expiry Date) *</label>
              <input type="date" id="form-stock-expiry" value="2027-12-31" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900">
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="block text-slate-600 font-medium text-xs mb-1">จำนวนที่รับเข้า *</label>
              <input type="number" id="form-stock-qty" value="50" min="1" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-teal-700">
            </div>
            <div>
              <label class="block text-slate-600 font-medium text-xs mb-1">ราคาทุน/หน่วย (฿) *</label>
              <input type="number" step="0.5" id="form-stock-cost" value="15.0" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold">
            </div>
            <div>
              <label class="block text-slate-600 font-medium text-xs mb-1">วันที่ผลิต (Mfg Date)</label>
              <input type="date" id="form-stock-mfg" value="2026-01-10" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-600 font-medium text-xs mb-1">คลังจัดเก็บ *</label>
              <select id="form-stock-warehouse" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
                ${(state.warehouses || []).map(w => `
                  <option value="${w.warehouse_name}">${w.warehouse_name} (${w.warehouse_code})</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-slate-600 font-medium text-xs mb-1">ตำแหน่งในคลัง (Location Code)</label>
              <input type="text" id="form-stock-location" value="SHELF-A1" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono">
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Stock Adjustment Form -->
      <div class="${isAdjust ? 'space-y-4' : 'hidden'}">
        <div class="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
          <h4 class="font-bold text-amber-900 text-xs flex items-center gap-1.5">
            <i data-lucide="sliders-horizontal" class="w-4 h-4 text-amber-700"></i>
            <span>ปรับปรุงยอดสต็อกตรวจนับ (Inventory Adjustment)</span>
          </h4>

          <div>
            <label class="block text-slate-700 font-bold text-xs mb-1">เลือกรายการยาที่จะปรับยอด *</label>
            <select id="form-adjust-product" class="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs font-semibold text-slate-800">
              ${state.products.map(p => `
                <option value="${p.id}" ${p.id === preselectedId ? 'selected' : ''}>
                  ${p.product_code}: ${p.product_name} (คงเหลือ: ${getProductTotalOnHand(p.id)} ${p.base_unit})
                </option>
              `).join('')}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-600 font-medium text-xs mb-1">ทิศทางการปรับปรุง *</label>
              <select id="form-adjust-type" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold">
                <option value="ADD">[ + ] เพิ่มสต็อก (ตรวจนับเกิน / ยอดยกมา)</option>
                <option value="DEDUCT">[ - ] ปรับลดสต็อก (ชำรุด / แตกหัก / เสื่อมสภาพ / หมดอายุ)</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-600 font-medium text-xs mb-1">จำนวนหน่วย *</label>
              <input type="number" id="form-adjust-qty" value="5" min="1" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-amber-800">
            </div>
          </div>

          <div>
            <label class="block text-slate-600 font-medium text-xs mb-1">สาเหตุการปรับยอดสต็อก *</label>
            <select id="form-adjust-reason" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
              <option value="ตรวจนับยอดสต็อกประจำรอบ (Cycle Count)">ตรวจนับยอดสต็อกประจำรอบ (Cycle Count)</option>
              <option value="บรรจุภัณฑ์ชำรุด หรือเสียหายจากการเก็บรักษา">บรรจุภัณฑ์ชำรุด หรือเสียหายจากการเก็บรักษา</option>
              <option value="ยาหมดอายุตามล็อต (Expired Batch)">ยาหมดอายุตามล็อต (Expired Batch)</option>
              <option value="ปรับปรุงยอดตามรายการเบิกใช้ภายในคลินิก">ปรับปรุงยอดตามรายการเบิกใช้ภายในคลินิก</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `;
}
