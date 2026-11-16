/**
 * ============================================================================
 * DOMAIN 07: BILLING & PAYMENT MANAGEMENT ENGINE
 * ============================================================================
 * Architectural Alignment:
 * - docs/BusinessDomain/07.Billing_and_Payment_Management.md
 * - 22 Business Capabilities (3.1 - 3.22)
 * - Physical Database Design (Schema billing.* - 12 Tables/Entities)
 * - 4 Sub-Tabs Lifecycle: Cashier POS, Invoices & AR, Deposits & Refunds, Shift Closing
 * ============================================================================
 */

// --- 1. ENTITY LOOKUPS & UTILITY HELPERS ---

function getInvoiceById(id) {
  return state.invoices.find(i => i.id === Number(id)) || null;
}

function getDepositByCustomerId(customerId) {
  return state.customerDeposits.find(d => d.customer_id === Number(customerId) && d.status === 'ACTIVE' && d.remaining_amount > 0) || null;
}

function getPaymentByInvoiceId(invoiceId) {
  return state.payments.find(p => p.invoice_id === Number(invoiceId)) || null;
}

function getReceiptByInvoiceId(invoiceId) {
  return state.receipts.find(r => r.invoice_id === Number(invoiceId)) || null;
}

function getTaxInvoiceByReceiptId(receiptId) {
  return state.taxInvoices.find(t => t.receipt_id === Number(receiptId)) || null;
}

function getServiceCatalogById(id) {
  return state.serviceCatalogs.find(s => s.id === Number(id)) || null;
}

function getPetDisplayName(pet) {
  if (!pet) return '-';
  return pet.pet_name || pet.name || '-';
}

function getDiscountByCode(code) {
  return state.discounts.find(d => d.code === code && d.status === 'ACTIVE') || null;
}

function calculateInvoiceAging(invoice) {
  if (invoice.status === 'PAID' || invoice.status === 'VOID') {
    return { days: 0, status: 'PAID', badge: '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">ชำระแล้ว</span>' };
  }

  const dueDate = new Date(invoice.due_date || invoice.invoice_date);
  const now = new Date('2026-03-02');
  const diffTime = now.getTime() - dueDate.getTime();
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  if (diffDays === 0) {
    return { days: 0, status: 'CURRENT', badge: '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">ยังไม่ถึงกำหนด (Current)</span>' };
  } else if (diffDays <= 30) {
    return { days: diffDays, status: 'OVERDUE_1_30', badge: `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">ค้าง ${diffDays} วัน (1-30d)</span>` };
  } else if (diffDays <= 60) {
    return { days: diffDays, status: 'OVERDUE_31_60', badge: `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">ค้าง ${diffDays} วัน (31-60d)</span>` };
  } else {
    return { days: diffDays, status: 'OVERDUE_60_PLUS', badge: `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">ค้าง ${diffDays} วัน (>60d)</span>` };
  }
}

// --- 2. SUB-TAB NAVIGATION CONTROLLER ---

function switchBillingSubTab(tabKey) {
  state.activeBillingSubTab = tabKey;

  const tabs = ['cashier', 'invoices', 'deposits_refunds', 'shift_closing'];
  tabs.forEach(t => {
    const btn = document.getElementById(`billing-tab-btn-${t}`);
    if (btn) {
      if (t === tabKey) {
        btn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-amber-900 shadow-xs border border-amber-200 transition cursor-pointer flex items-center gap-1.5';
      } else {
        btn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center gap-1.5';
      }
    }
  });

  renderBillingSubTabContent();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function setBillingSubFilter(filter) {
  state.activeBillingSubFilter = filter;
  renderBillingSubTabContent();
}

function renderBillingSubTabContent() {
  const container = document.getElementById('billing-subtab-content');
  if (!container) return;

  const activeTab = state.activeBillingSubTab || 'cashier';

  if (activeTab === 'cashier') {
    renderCashierCounterView();
  } else if (activeTab === 'invoices') {
    renderInvoicesAndAccountsReceivableView();
  } else if (activeTab === 'deposits_refunds') {
    renderDepositsAndRefundsView();
  } else if (activeTab === 'shift_closing') {
    renderShiftClosingAndReportsView();
  }
}

// ============================================================================
// 3. SUB-TAB 1: CASHIER COUNTER & POS (Capabilities 3.1 - 3.5, 3.8 - 3.11)
// ============================================================================

function renderCashierCounterView() {
  const container = document.getElementById('billing-subtab-content');
  if (!container) return;

  const searchQuery = (document.getElementById('top-search-input')?.value || '').toLowerCase();

  // 1. Unbilled Live Queues (Queues not completed)
  const activeQueues = state.queues.filter(q => q.stage !== 'COMPLETED');

  // 2. Pending Unpaid & Partial Invoices
  const unpaidInvoices = state.invoices.filter(inv => {
    const pet = getPetById(inv.pet_id);
    const owner = getCustomerById(inv.customer_id);
    const matchSearch =
      inv.invoice_number.toLowerCase().includes(searchQuery) ||
      getPetDisplayName(pet).toLowerCase().includes(searchQuery) ||
      (owner?.display_name || '').toLowerCase().includes(searchQuery);

    return matchSearch && (inv.status === 'UNPAID' || inv.status === 'PARTIAL');
  });

  // HTML: Unbilled Live Queue Section
  const unbilledHtml = `
    <div class="mb-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">คิวรอรวมบิลคิดเงินสดจากห้องตรวจ & ห้องยา (Live Unbilled Queues)</h4>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">${activeQueues.length} คิว</span>
        </div>
        <span class="text-[11px] text-slate-400">ระบบรวบรวมค่าตรวจ ค่ายา ค่าแล็บ และค่าผ่าตัดอัตโนมัติ</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        ${activeQueues.length === 0 ? `
          <div class="col-span-full py-4 text-center text-xs text-slate-400">ไม่มีคิวตรวจรอคิดเงินในขณะนี้</div>
        ` : activeQueues.map(q => {
          const pet = getPetById(q.pet_id);
          const owner = getCustomerById(q.customer_id);
          const existingInv = state.invoices.find(i => i.pet_id === q.pet_id && (i.status === 'UNPAID' || i.status === 'PARTIAL'));

          return `
            <div class="p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200 transition flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between gap-1 mb-2">
                  <span class="text-xs font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">#${q.ticket_number}</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">${q.stage}</span>
                </div>
                <div class="flex items-center gap-2.5 mb-2">
                  <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                    ${pet?.species === 'แมว' ? '🐱' : '🐶'}
                  </div>
                  <div class="min-w-0 flex-1">
                    <h5 class="text-xs font-bold text-slate-900 truncate">${getPetDisplayName(pet)}</h5>
                    <p class="text-[11px] text-slate-500 truncate">${owner?.display_name || '-'} • โทร: ${owner?.phone_primary || '-'}</p>
                  </div>
                </div>
                <p class="text-[11px] text-slate-600 line-clamp-1 bg-white p-1.5 rounded border border-slate-100">${q.chief_complaint}</p>
              </div>

              <div class="pt-2.5 mt-2 border-t border-slate-200 flex items-center justify-between">
                ${existingInv ? `
                  <span class="text-[11px] font-bold text-amber-700 font-mono">${existingInv.invoice_number}</span>
                  <button onclick="openCheckoutSheet(${existingInv.id})" class="px-3 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
                    ชำระเงิน POS
                  </button>
                ` : `
                  <span class="text-[11px] text-slate-400">ยังไม่ออกบิล</span>
                  <button onclick="createInvoiceFromQueue(${q.id})" class="px-3 py-1.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1">
                    <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
                    <span>ออกใบแจ้งหนี้</span>
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // HTML: Unpaid Invoices Cards Grid
  const invoicesHtml = `
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-4">
        <div>
          <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <i data-lucide="clock" class="w-4 h-4 text-amber-600"></i>
            <span>ใบแจ้งหนี้รอชำระเงิน & ชำระบางส่วน (Unpaid Invoices & Ready to Checkout)</span>
          </h4>
          <p class="text-xs text-slate-500">เลือกบิลเพื่อรับชำระเงิน รองรับเงินสด, PromptPay QR, บัตรเครดิต, แบ่งชำระ และหักมัดจำ</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="openNewInvoiceSheet()" class="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>+ สร้างบิลใหม่ / ขายหน้าร้าน POS</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        ${unpaidInvoices.length === 0 ? `
          <div class="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200">
            <i data-lucide="check-circle-2" class="w-10 h-10 text-emerald-500 mx-auto mb-2"></i>
            <p class="text-xs font-bold text-slate-700">ไม่มีบิลค้างชำระในขณะนี้!</p>
            <p class="text-[11px] text-slate-400 mt-0.5">ทุกรายการได้รับการชำระเงินเรียบร้อยแล้ว</p>
          </div>
        ` : unpaidInvoices.map(inv => {
          const pet = getPetById(inv.pet_id);
          const owner = getCustomerById(inv.customer_id);
          const deposit = getDepositByCustomerId(inv.customer_id);
          const isPartial = inv.status === 'PARTIAL';

          const categoryPills = [];
          if (inv.items.some(i => i.source_domain === 'CLINICAL' || i.source_type === 'CLINICAL')) categoryPills.push('<span class="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-200">🩺 ตรวจรักษา</span>');
          if (inv.items.some(i => i.source_domain === 'SURGERY' || i.source_type === 'SURGERY' || i.source_type === 'SURGERY_SUPPLY')) categoryPills.push('<span class="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">✂️ ผ่าตัด/วัสดุ</span>');
          if (inv.items.some(i => i.source_domain === 'LABORATORY' || i.source_type === 'LABORATORY')) categoryPills.push('<span class="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200">🧪 แล็บ/X-Ray</span>');
          if (inv.items.some(i => i.source_domain === 'PHARMACY' || i.source_type === 'PHARMACY')) categoryPills.push('<span class="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">💊 ค่ายา</span>');
          if (inv.items.some(i => i.source_domain === 'RETAIL' || i.source_type === 'RETAIL')) categoryPills.push('<span class="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">🛒 สินค้า</span>');

          return `
            <div class="bg-white rounded-xl border ${isPartial ? 'border-purple-300 ring-2 ring-purple-500/10' : 'border-amber-300 ring-2 ring-amber-500/10'} p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">${inv.invoice_number}</span>
                    <span class="text-[11px] text-slate-400 font-medium">${inv.invoice_date.split(' ')[1] || ''} น.</span>
                  </div>
                  ${isPartial ? `
                    <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 flex items-center gap-1 animate-pulse">
                      <span class="w-1.5 h-1.5 rounded-full bg-purple-600"></span><span>ชำระแล้วบางส่วน</span>
                    </span>
                  ` : `
                    <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1 animate-pulse">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>รอชำระเงิน</span>
                    </span>
                  `}
                </div>

                <div class="flex items-center gap-3 my-3">
                  <div class="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                    ${pet?.species === 'แมว' ? '🐱' : '🐶'}
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5">
                      <h4 class="font-bold text-sm text-slate-900 truncate">${getPetDisplayName(pet)}</h4>
                      <span class="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">${pet?.species || ''}</span>
                    </div>
                    <p class="text-xs text-slate-500 truncate mt-0.5">เจ้าของ: <span class="font-medium text-slate-800">${owner?.display_name || '-'}</span> (${owner?.phone_primary || '-'})</p>
                  </div>
                </div>

                <div class="flex flex-wrap gap-1 mb-2.5">
                  ${categoryPills.join('')}
                  <span class="text-[10px] text-slate-400 self-center ml-auto">${inv.items.length} รายการ</span>
                </div>

                <!-- Items Preview -->
                <div class="bg-slate-50 rounded-lg p-2.5 space-y-1 border border-slate-100 text-xs">
                  ${inv.items.slice(0, 3).map(item => `
                    <div class="flex items-center justify-between text-slate-600">
                      <span class="truncate pr-2">${item.description_snapshot}</span>
                      <span class="font-semibold text-slate-800 shrink-0">฿${Number(item.line_total).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
                    </div>
                  `).join('')}
                  ${inv.items.length > 3 ? `<p class="text-[10px] text-slate-400 italic text-center pt-0.5">...และรายการอื่นอีก ${inv.items.length - 3} รายการ</p>` : ''}
                </div>

                ${deposit && deposit.remaining_amount > 0 ? `
                  <div class="mt-2 text-[11px] bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-200 flex items-center justify-between">
                    <span>มีเงินมัดจำคงเหลือ:</span>
                    <strong class="font-mono">฿${deposit.remaining_amount.toLocaleString('th-TH', {minimumFractionDigits: 2})}</strong>
                  </div>
                ` : ''}
              </div>

              <!-- Price & Actions -->
              <div class="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-semibold block">${isPartial ? 'ยอดค้างชำระคงเหลือ' : 'ยอดสุทธิที่ต้องชำระ'}</span>
                  <div class="text-base font-extrabold ${isPartial ? 'text-purple-700' : 'text-slate-900'} font-mono">
                    ฿${Number(inv.outstanding_amount).toLocaleString('th-TH', {minimumFractionDigits: 2})}
                  </div>
                </div>
                <div class="flex items-center gap-1.5">
                  <button onclick="openCheckoutSheet(${inv.id})" class="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5">
                    <i data-lucide="credit-card" class="w-3.5 h-3.5"></i>
                    <span>รับชำระเงิน</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.innerHTML = unbilledHtml + invoicesHtml;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Backward-compatible renderers for existing calls
function renderBillingCardView(invoices) {
  renderCashierCounterView();
}
function renderBillingListView(invoices) {
  renderInvoicesAndAccountsReceivableView();
}

// ============================================================================
// 4. SUB-TAB 2: INVOICES & ACCOUNTS RECEIVABLE (Capabilities 3.8, 3.9, 3.13, 3.18, 3.19)
// ============================================================================

function renderInvoicesAndAccountsReceivableView() {
  const container = document.getElementById('billing-subtab-content');
  if (!container) return;

  const searchQuery = (document.getElementById('top-search-input')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('view-filter-invoice-status')?.value || 'all';

  // Calculate AR Aging
  let totalAR = 0;
  let currentAR = 0;
  let overdue1to30 = 0;
  let overdue31to60 = 0;
  let overdue60plus = 0;

  state.invoices.forEach(inv => {
    if (inv.status === 'UNPAID' || inv.status === 'PARTIAL') {
      const amount = Number(inv.outstanding_amount || 0);
      totalAR += amount;
      const aging = calculateInvoiceAging(inv);
      if (aging.status === 'CURRENT') currentAR += amount;
      else if (aging.status === 'OVERDUE_1_30') overdue1to30 += amount;
      else if (aging.status === 'OVERDUE_31_60') overdue31to60 += amount;
      else if (aging.status === 'OVERDUE_60_PLUS') overdue60plus += amount;
    }
  });

  // Filter invoices
  const filtered = state.invoices.filter(inv => {
    const pet = getPetById(inv.pet_id);
    const owner = getCustomerById(inv.customer_id);

    const matchSearch =
      inv.invoice_number.toLowerCase().includes(searchQuery) ||
      getPetDisplayName(pet).toLowerCase().includes(searchQuery) ||
      (owner?.display_name || '').toLowerCase().includes(searchQuery);

    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;

    return matchSearch && matchStatus;
  });

  container.innerHTML = `
    <div class="space-y-4">
      <!-- Accounts Receivable (AR) Aging Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ลูกหนี้รวม (Total AR)</span>
          <h4 class="text-lg font-extrabold text-slate-900 font-mono mt-0.5">฿${totalAR.toLocaleString('th-TH', {minimumFractionDigits: 2})}</h4>
          <span class="text-[10px] text-slate-500 font-medium">${state.invoices.filter(i => i.status === 'UNPAID' || i.status === 'PARTIAL').length} บิลค้างชำระ</span>
        </div>

        <div class="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 shadow-xs">
          <span class="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">ไม่เกินกำหนด (Current)</span>
          <h4 class="text-lg font-extrabold text-blue-900 font-mono mt-0.5">฿${currentAR.toLocaleString('th-TH', {minimumFractionDigits: 2})}</h4>
          <span class="text-[10px] text-blue-600 font-medium">รอเรียกเก็บในรอบ</span>
        </div>

        <div class="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 shadow-xs">
          <span class="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">เกินกำหนด 1-30 วัน</span>
          <h4 class="text-lg font-extrabold text-amber-900 font-mono mt-0.5">฿${overdue1to30.toLocaleString('th-TH', {minimumFractionDigits: 2})}</h4>
          <span class="text-[10px] text-amber-600 font-medium">เตือนชำระรอบที่ 1</span>
        </div>

        <div class="bg-orange-50/70 p-3.5 rounded-xl border border-orange-200 shadow-xs">
          <span class="text-[10px] text-orange-700 font-bold uppercase tracking-wider block">เกินกำหนด 31-60 วัน</span>
          <h4 class="text-lg font-extrabold text-orange-900 font-mono mt-0.5">฿${overdue31to60.toLocaleString('th-TH', {minimumFractionDigits: 2})}</h4>
          <span class="text-[10px] text-orange-600 font-medium">ติดตามทวงถาม</span>
        </div>

        <div class="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200 shadow-xs col-span-2 lg:col-span-1">
          <span class="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">เกิน 60 วัน (Critical)</span>
          <h4 class="text-lg font-extrabold text-rose-900 font-mono mt-0.5">฿${overdue60plus.toLocaleString('th-TH', {minimumFractionDigits: 2})}</h4>
          <span class="text-[10px] text-rose-600 font-medium">ระงับเครดิต</span>
        </div>
      </div>

      <!-- Invoices Ledger Controls -->
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div class="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <i data-lucide="file-spreadsheet" class="w-4 h-4 text-slate-700"></i>
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">ทะเบียนใบแจ้งหนี้ทั้งหมด (Invoices & Billing Ledger)</h4>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">${filtered.length} บิล</span>
          </div>

          <div class="flex items-center gap-2">
            <select id="view-filter-invoice-status" onchange="renderInvoicesAndAccountsReceivableView()" class="bg-white text-xs text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-300">
              <option value="all">สถานะทั้งหมด (All)</option>
              <option value="UNPAID">รอชำระเงิน (Unpaid)</option>
              <option value="PARTIAL">ชำระบางส่วน (Partial)</option>
              <option value="PAID">ชำระครบแล้ว (Paid)</option>
              <option value="VOID">ยกเลิกบิล (Void)</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-100/70 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold">
              <tr>
                <th class="p-3">เลขที่บิล / วันที่</th>
                <th class="p-3">สัตว์ป่วย & เจ้าของ</th>
                <th class="p-3 text-right">ยอดรวม (Grand Total)</th>
                <th class="p-3 text-right">ชำระแล้ว</th>
                <th class="p-3 text-right">ยอดค้างชำระ</th>
                <th class="p-3 text-center">อายุหนี้ (Aging)</th>
                <th class="p-3 text-center">สถานะ</th>
                <th class="p-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              ${filtered.length === 0 ? `
                <tr><td colspan="8" class="p-8 text-center text-slate-400">ไม่พบบิลตามเงื่อนไขที่เลือก</td></tr>
              ` : filtered.map(inv => {
                const pet = getPetById(inv.pet_id);
                const owner = getCustomerById(inv.customer_id);
                const aging = calculateInvoiceAging(inv);

                let statusBadge = '';
                if (inv.status === 'PAID') statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">ชำระแล้ว</span>';
                else if (inv.status === 'PARTIAL') statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">จ่ายบางส่วน</span>';
                else if (inv.status === 'UNPAID') statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">รอชำระ</span>';
                else if (inv.status === 'VOID') statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 line-through">ยกเลิกแล้ว</span>';

                return `
                  <tr class="hover:bg-slate-50/80 transition ${inv.status === 'VOID' ? 'opacity-60 bg-slate-50/40' : ''}">
                    <td class="p-3">
                      <div class="font-mono font-bold text-slate-900">${inv.invoice_number}</div>
                      <div class="text-[11px] text-slate-400">${inv.invoice_date}</div>
                    </td>
                    <td class="p-3">
                      <div class="font-bold text-slate-900">${getPetDisplayName(pet)}</div>
                      <div class="text-[11px] text-slate-500">${owner?.display_name || '-'} (${owner?.phone_primary || '-'})</div>
                    </td>
                    <td class="p-3 text-right font-mono font-bold text-slate-900">
                      ฿${Number(inv.grand_total).toLocaleString('th-TH', {minimumFractionDigits: 2})}
                    </td>
                    <td class="p-3 text-right font-mono text-emerald-700 font-semibold">
                      ฿${Number(inv.paid_amount || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}
                    </td>
                    <td class="p-3 text-right font-mono font-bold ${inv.outstanding_amount > 0 ? 'text-rose-600' : 'text-slate-400'}">
                      ฿${Number(inv.outstanding_amount || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}
                    </td>
                    <td class="p-3 text-center">${aging.badge}</td>
                    <td class="p-3 text-center">${statusBadge}</td>
                    <td class="p-3 text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        ${inv.status === 'PAID' ? `
                          <button onclick="openReceiptModal(${inv.id}, 'slip')" class="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer" title="พิมพ์สลิปใบเสร็จ">
                            <i data-lucide="receipt" class="w-4 h-4"></i>
                          </button>
                          <button onclick="openReceiptModal(${inv.id}, 'tax')" class="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer" title="ออกใบกำกับภาษี A4">
                            <i data-lucide="file-text" class="w-4 h-4"></i>
                          </button>
                        ` : inv.status !== 'VOID' ? `
                          <button onclick="openCheckoutSheet(${inv.id})" class="px-2.5 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-xs cursor-pointer">
                            รับชำระ
                          </button>
                          <button onclick="openVoidInvoiceModal(${inv.id})" class="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer" title="ยกเลิกบิล (Void)">
                            <i data-lucide="ban" class="w-4 h-4"></i>
                          </button>
                        ` : `
                          <span class="text-[10px] text-slate-400">Voided</span>
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
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ============================================================================
// 5. SUB-TAB 3: CUSTOMER DEPOSITS & REFUNDS (Capabilities 3.14, 3.17)
// ============================================================================

function renderDepositsAndRefundsView() {
  const container = document.getElementById('billing-subtab-content');
  if (!container) return;

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Left Column: Customer Advance Deposits -->
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div class="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="wallet" class="w-4 h-4 text-emerald-600"></i>
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">เงินมัดจำล่วงหน้า (Customer Deposits)</h4>
          </div>
          <button onclick="openCustomerDepositModal()" class="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>+ รับเงินมัดจำใหม่</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-100/70 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold">
              <tr>
                <th class="p-2.5">รหัสมัดจำ</th>
                <th class="p-2.5">ลูกค้า & สัตว์ป่วย</th>
                <th class="p-2.5 text-right">ยอดรับมัดจำ</th>
                <th class="p-2.5 text-right">ยอดคงเหลือ</th>
                <th class="p-2.5 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              ${state.customerDeposits.length === 0 ? `
                <tr><td colspan="5" class="p-6 text-center text-slate-400">ไม่มีรายการเงินมัดจำ</td></tr>
              ` : state.customerDeposits.map(d => {
                const owner = getCustomerById(d.customer_id);
                const pet = getPetById(d.pet_id);
                return `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="p-2.5 font-mono font-bold text-slate-800">${d.deposit_number}</td>
                    <td class="p-2.5">
                      <div class="font-bold text-slate-900">${owner?.display_name || '-'}</div>
                      <div class="text-[11px] text-slate-500">${getPetDisplayName(pet)}</div>
                    </td>
                    <td class="p-2.5 text-right font-mono">฿${Number(d.original_amount).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                    <td class="p-2.5 text-right font-mono font-bold text-emerald-700">฿${Number(d.remaining_amount).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                    <td class="p-2.5 text-center">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${d.remaining_amount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                        ${d.remaining_amount > 0 ? 'ใช้งานได้' : 'ใช้หมดแล้ว'}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Refunds & Credit Notes -->
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div class="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="rotate-ccw" class="w-4 h-4 text-rose-600"></i>
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">ประวัติการคืนเงิน (Refund Transactions)</h4>
          </div>
          <button onclick="openRefundModal()" class="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>+ ทำเรื่องคืนเงิน</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-100/70 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold">
              <tr>
                <th class="p-2.5">รหัสคืนเงิน</th>
                <th class="p-2.5">ลูกค้า</th>
                <th class="p-2.5">เหตุผลการคืนเงิน</th>
                <th class="p-2.5 text-right">ยอดคืนเงิน</th>
                <th class="p-2.5 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              ${state.refunds.length === 0 ? `
                <tr><td colspan="5" class="p-6 text-center text-slate-400">ไม่มีประวัติการคืนเงิน</td></tr>
              ` : state.refunds.map(r => {
                const owner = getCustomerById(r.customer_id);
                return `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="p-2.5 font-mono font-bold text-slate-800">${r.refund_number}</td>
                    <td class="p-2.5 font-bold text-slate-900">${owner?.display_name || '-'}</td>
                    <td class="p-2.5 text-[11px] text-slate-600 max-w-xs truncate" title="${r.refund_reason}">${r.refund_reason}</td>
                    <td class="p-2.5 text-right font-mono font-bold text-rose-600">฿${Number(r.refund_amount).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                    <td class="p-2.5 text-center">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">${r.status}</span>
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

// ============================================================================
// 6. SUB-TAB 4: SHIFT CLOSING & FINANCIAL REPORTS (Capabilities 3.21, 3.22)
// ============================================================================

function renderShiftClosingAndReportsView() {
  const container = document.getElementById('billing-subtab-content');
  if (!container) return;

  const drawer = state.activeCashDrawer;

  // Calculate live shift revenue from payments
  let cashSales = 0;
  let promptpaySales = 0;
  let creditCardSales = 0;

  state.payments.forEach(p => {
    if (p.payment_method === 'CASH') cashSales += Number(p.amount);
    else if (p.payment_method === 'PROMPTPAY') promptpaySales += Number(p.amount);
    else if (p.payment_method === 'CREDIT_CARD') creditCardSales += Number(p.amount);
  });

  const expectedCashInDrawer = drawer.opening_float + cashSales;
  const totalShiftSales = cashSales + promptpaySales + creditCardSales;

  // Department Revenue Breakdown
  let clinicalRev = 0;
  let surgeryRev = 0;
  let pharmacyRev = 0;
  let labRev = 0;
  let retailRev = 0;

  state.invoices.forEach(inv => {
    if (inv.status === 'PAID') {
      inv.items.forEach(item => {
        const line = Number(item.line_total || 0);
        if (item.source_domain === 'CLINICAL' || item.source_type === 'CLINICAL') clinicalRev += line;
        else if (item.source_domain === 'SURGERY' || item.source_type === 'SURGERY' || item.source_type === 'SURGERY_SUPPLY') surgeryRev += line;
        else if (item.source_domain === 'PHARMACY' || item.source_type === 'PHARMACY') pharmacyRev += line;
        else if (item.source_domain === 'LABORATORY' || item.source_type === 'LABORATORY') labRev += line;
        else if (item.source_domain === 'RETAIL' || item.source_type === 'RETAIL') retailRev += line;
      });
    }
  });

  const totalRev = Math.max(1, clinicalRev + surgeryRev + pharmacyRev + labRev + retailRev);

  container.innerHTML = `
    <div class="space-y-4">
      <!-- Active Drawer Status Card -->
      <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-4 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-inner">
              <i data-lucide="lock" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">🟢 กะเปิดใช้งาน (Active Session)</span>
                <span class="text-xs text-slate-300">${drawer.shift_name}</span>
              </div>
              <h3 class="text-base font-bold text-white mt-1">แคชเชียร์ประจำกะ: ${drawer.cashier_name}</h3>
              <p class="text-xs text-slate-400">เปิดกะเวลา: ${drawer.opened_at} น. • เงินทอนเริ่มต้น: <strong>฿${drawer.opening_float.toLocaleString('th-TH', {minimumFractionDigits: 2})}</strong></p>
            </div>
          </div>

          <div class="flex items-center gap-2 self-start sm:self-auto">
            <button onclick="openShiftCloseModal()" class="px-4 py-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5">
              <i data-lucide="calculator" class="w-4 h-4"></i>
              <span>ปิดกะลิ้นชัก & นับเงินสด</span>
            </button>
          </div>
        </div>

        <!-- Shift Live Money Counters -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-700/80 text-xs">
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-semibold block">เงินสดในลิ้นชักที่ต้องมี</span>
            <span class="text-lg font-extrabold text-amber-400 font-mono">฿${expectedCashInDrawer.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-semibold block">ยอดโอน PromptPay</span>
            <span class="text-lg font-extrabold text-white font-mono">฿${promptpaySales.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-semibold block">ยอดบัตรเครดิต</span>
            <span class="text-lg font-extrabold text-white font-mono">฿${creditCardSales.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-semibold block">ยอดขายรวมทุกช่องทาง</span>
            <span class="text-lg font-extrabold text-emerald-400 font-mono">฿${totalShiftSales.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
          </div>
        </div>
      </div>

      <!-- Department Revenue Breakdown (Capability 3.22) -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <i data-lucide="pie-chart" class="w-4 h-4 text-purple-600"></i>
          <span>สัดส่วนรายได้แยกตามแผนกบริการ (Revenue by Department Breakdown)</span>
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div class="p-3 bg-teal-50 rounded-xl border border-teal-200">
            <span class="text-[10px] font-bold text-teal-800 uppercase">ตรวจรักษา OPD</span>
            <h5 class="text-base font-bold text-teal-900 font-mono mt-0.5">฿${clinicalRev.toLocaleString('th-TH', {minimumFractionDigits: 2})}</h5>
            <div class="w-full bg-teal-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div class="bg-teal-600 h-full" style="width: ${(clinicalRev / totalRev * 100).toFixed(0)}%"></div>
            </div>
            <span class="text-[10px] text-teal-700 font-semibold block mt-1">${(clinicalRev / totalRev * 100).toFixed(1)}%</span>
          </div>

          <div class="p-3 bg-rose-50 rounded-xl border border-rose-200">
            <span class="text-[10px] font-bold text-rose-800 uppercase">ผ่าตัด & วัสดุ OR</span>
            <h5 class="text-base font-bold text-rose-900 font-mono mt-0.5">฿${surgeryRev.toLocaleString('th-TH', {minimumFractionDigits: 2})}</h5>
            <div class="w-full bg-rose-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div class="bg-rose-600 h-full" style="width: ${(surgeryRev / totalRev * 100).toFixed(0)}%"></div>
            </div>
            <span class="text-[10px] text-rose-700 font-semibold block mt-1">${(surgeryRev / totalRev * 100).toFixed(1)}%</span>
          </div>

          <div class="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span class="text-[10px] font-bold text-amber-800 uppercase">ค่ายา & เวชภัณฑ์</span>
            <h5 class="text-base font-bold text-amber-900 font-mono mt-0.5">฿${pharmacyRev.toLocaleString('th-TH', {minimumFractionDigits: 2})}</h5>
            <div class="w-full bg-amber-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div class="bg-amber-600 h-full" style="width: ${(pharmacyRev / totalRev * 100).toFixed(0)}%"></div>
            </div>
            <span class="text-[10px] text-amber-700 font-semibold block mt-1">${(pharmacyRev / totalRev * 100).toFixed(1)}%</span>
          </div>

          <div class="p-3 bg-purple-50 rounded-xl border border-purple-200">
            <span class="text-[10px] font-bold text-purple-800 uppercase">ห้องปฏิบัติการ & X-Ray</span>
            <h5 class="text-base font-bold text-purple-900 font-mono mt-0.5">฿${labRev.toLocaleString('th-TH', {minimumFractionDigits: 2})}</h5>
            <div class="w-full bg-purple-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div class="bg-purple-600 h-full" style="width: ${(labRev / totalRev * 100).toFixed(0)}%"></div>
            </div>
            <span class="text-[10px] text-purple-700 font-semibold block mt-1">${(labRev / totalRev * 100).toFixed(1)}%</span>
          </div>

          <div class="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <span class="text-[10px] font-bold text-blue-800 uppercase">สินค้าหน้าร้าน POS</span>
            <h5 class="text-base font-bold text-blue-900 font-mono mt-0.5">฿${retailRev.toLocaleString('th-TH', {minimumFractionDigits: 2})}</h5>
            <div class="w-full bg-blue-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div class="bg-blue-600 h-full" style="width: ${(retailRev / totalRev * 100).toFixed(0)}%"></div>
            </div>
            <span class="text-[10px] text-blue-700 font-semibold block mt-1">${(retailRev / totalRev * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <!-- Historical Shift Closings Table -->
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div class="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">ประวัติการปิดกะลิ้นชักการเงิน (Historical Drawer Closings)</h4>
          <span class="text-[11px] text-slate-500">${state.dailyCashClosings.length} รายการ</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-100/70 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold">
              <tr>
                <th class="p-2.5">รหัสการปิดกะ</th>
                <th class="p-2.5">วันที่ / กะ</th>
                <th class="p-2.5">แคชเชียร์</th>
                <th class="p-2.5 text-right">เงินทอนตั้งต้น</th>
                <th class="p-2.5 text-right">เงินสดที่ต้องมี</th>
                <th class="p-2.5 text-right">เงินสดนับได้จริง</th>
                <th class="p-2.5 text-center">ผลต่าง (Variance)</th>
                <th class="p-2.5 text-right">รายได้รวมกะ</th>
                <th class="p-2.5 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              ${state.dailyCashClosings.map(c => `
                <tr class="hover:bg-slate-50 transition">
                  <td class="p-2.5 font-mono font-bold text-slate-800">${c.closing_number}</td>
                  <td class="p-2.5">
                    <div class="font-bold text-slate-900">${c.shift_date}</div>
                    <div class="text-[11px] text-slate-500">${c.shift_name}</div>
                  </td>
                  <td class="p-2.5 font-medium text-slate-800">${c.cashier_name}</td>
                  <td class="p-2.5 text-right font-mono">฿${Number(c.opening_float).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                  <td class="p-2.5 text-right font-mono font-bold">฿${Number(c.expected_cash).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                  <td class="p-2.5 text-right font-mono font-bold text-emerald-700">฿${Number(c.actual_cash_counted).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                  <td class="p-2.5 text-center">
                    ${c.variance_amount === 0 ? `
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">✓ ยอดตรง</span>
                    ` : c.variance_amount < 0 ? `
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">ขาด ฿${Math.abs(c.variance_amount)}</span>
                    ` : `
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">เกิน ฿${c.variance_amount}</span>
                    `}
                  </td>
                  <td class="p-2.5 text-right font-mono font-bold text-slate-900">฿${Number(c.total_shift_revenue).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                  <td class="p-2.5 text-center">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">${c.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ============================================================================
// 7. CHECKOUT SHEET SLIDE-OVER ENGINE (Capabilities 3.10 - 3.12, 3.14)
// ============================================================================

function openCheckoutSheet(invoiceId) {
  const inv = getInvoiceById(invoiceId);
  if (!inv) return;

  state.sheetMode = 'billing-checkout';
  state.activeItemId = invoiceId;
  state.activeCheckoutInvoiceId = invoiceId;
  state.checkoutDiscount = inv.discount_total || 0;
  state.checkoutDepositApplied = false;
  state.activePaymentMethod = 'CASH';

  openSheetContainer();

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const footer = document.getElementById('sheet-footer');

  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300';
  badge.innerText = 'CHECKOUT & POS';
  title.innerText = `รับชำระเงิน (${inv.invoice_number})`;
  subtitle.innerText = 'ตรวจสอบรายการค่ารักษา รวบรวมค่ายา/แล็บ/ผ่าตัด หักมัดจำ และบันทึกการรับเงิน';

  renderCheckoutSheetBody(inv);

  footer.innerHTML = `
    <button onclick="closeSheet()" class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/80 transition cursor-pointer">
      ยกเลิก
    </button>
    <button id="btn-confirm-payment" onclick="confirmPayment(${inv.id})" class="px-5 py-2.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
      <i data-lucide="check-circle" class="w-4 h-4"></i>
      <span>ยืนยันการรับชำระเงิน & ออกใบเสร็จ</span>
    </button>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderCheckoutSheetBody(inv) {
  const body = document.getElementById('sheet-body');
  if (!body) return;

  const pet = getPetById(inv.pet_id);
  const owner = getCustomerById(inv.customer_id);
  const deposit = getDepositByCustomerId(inv.customer_id);

  // Calculations
  const subtotal = inv.items.reduce((sum, item) => sum + Number(item.line_total), 0);
  inv.subtotal = subtotal;

  const discount = Number(state.checkoutDiscount || 0);
  inv.discount_total = discount;

  const depositAmount = (state.checkoutDepositApplied && deposit) ? Math.min(deposit.remaining_amount, Math.max(0, subtotal - discount)) : 0;

  const netPayable = Math.max(0, subtotal - discount - depositAmount);
  inv.grand_total = Math.max(0, subtotal - discount);
  inv.outstanding_amount = netPayable;

  body.innerHTML = `
    <div class="space-y-4">
      <!-- Patient & Client Banner -->
      <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
            ${pet?.species === 'แมว' ? '🐱' : '🐶'}
          </div>
          <div>
            <h4 class="font-bold text-xs text-slate-900">${getPetDisplayName(pet)} (${pet?.species || ''} • ${pet?.breed || ''})</h4>
            <p class="text-[11px] text-slate-500">เจ้าของ: <strong class="text-slate-800">${owner?.display_name || '-'}</strong> (${owner?.phone_primary || '-'})</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-mono font-bold text-slate-700">${inv.invoice_number}</span>
          <p class="text-[10px] text-slate-400 mt-0.5">${inv.invoice_date}</p>
        </div>
      </div>

      <!-- Itemized Charges Table -->
      <div class="border border-slate-200 rounded-xl overflow-hidden">
        <div class="bg-slate-100/80 px-3 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
          <span>รายการค่ารักษา / สินค้า (${inv.items.length} รายการ)</span>
          <span>จำนวนเงิน</span>
        </div>
        <div class="divide-y divide-slate-100 max-h-56 overflow-y-auto text-xs">
          ${inv.items.map(item => `
            <div class="p-2.5 flex items-center justify-between hover:bg-slate-50 transition">
              <div class="min-w-0 pr-3">
                <p class="font-semibold text-slate-800 truncate">${item.description_snapshot}</p>
                <span class="text-[11px] text-slate-400">${item.quantity} ${item.unit || 'หน่วย'} × ฿${Number(item.unit_price_snapshot).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <span class="font-bold font-mono text-slate-900 shrink-0">฿${Number(item.line_total).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Discounts & Promotion Coupons Section -->
      <div class="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-2 text-xs">
        <div class="flex items-center justify-between">
          <span class="font-bold text-amber-900 flex items-center gap-1">
            <i data-lucide="tag" class="w-3.5 h-3.5 text-amber-600"></i>
            <span>ส่วนลดและคูปองโปรโมชั่น (Discounts)</span>
          </span>
          <select id="checkout-coupon-select" onchange="applyCheckoutCoupon(this.value, ${inv.id})" class="bg-white text-xs p-1 rounded border border-amber-300">
            <option value="">-- เลือกคูปองส่วนลด --</option>
            ${state.discounts.map(d => `
              <option value="${d.code}">${d.name} (${d.code})</option>
            `).join('')}
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-[11px] text-slate-600">ระบุส่วนลดเพิ่มเติม (บาท):</label>
          <input type="number" id="input-checkout-discount" value="${discount}" min="0" max="${subtotal}" oninput="updateCheckoutDiscount(this.value, ${inv.id})" class="w-24 text-xs p-1.5 rounded border border-slate-300 font-bold font-mono text-right bg-white">
        </div>
      </div>

      <!-- Customer Deposit Option -->
      ${deposit && deposit.remaining_amount > 0 ? `
        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
          <div>
            <span class="font-bold text-emerald-900 flex items-center gap-1">
              <i data-lucide="wallet" class="w-3.5 h-3.5 text-emerald-600"></i>
              <span>พบเงินมัดจำคงเหลือ: ฿${deposit.remaining_amount.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
            </span>
            <p class="text-[11px] text-emerald-700 mt-0.5">ต้องการหักเงินมัดจำชำระบิลนี้หรือไม่?</p>
          </div>
          <label class="flex items-center gap-1.5 cursor-pointer font-semibold text-emerald-900">
            <input type="checkbox" id="chk-apply-deposit" onchange="toggleDepositDeduction(this.checked, ${inv.id})" ${state.checkoutDepositApplied ? 'checked' : ''} class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500">
            <span>หักมัดจำ</span>
          </label>
        </div>
      ` : ''}

      <!-- Payment Method Selector -->
      <div class="space-y-2">
        <label class="block text-xs font-bold text-slate-800">เลือกช่องทางการชำระเงิน <span class="text-rose-500">*</span></label>
        <div class="grid grid-cols-4 gap-2 text-xs">
          <button type="button" onclick="switchPaymentMethodTab('CASH', ${inv.id})" class="p-2.5 rounded-lg border text-center font-bold transition cursor-pointer ${state.activePaymentMethod === 'CASH' ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}">
            💵 เงินสด
          </button>
          <button type="button" onclick="switchPaymentMethodTab('PROMPTPAY', ${inv.id})" class="p-2.5 rounded-lg border text-center font-bold transition cursor-pointer ${state.activePaymentMethod === 'PROMPTPAY' ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}">
            📱 PromptPay
          </button>
          <button type="button" onclick="switchPaymentMethodTab('CREDIT_CARD', ${inv.id})" class="p-2.5 rounded-lg border text-center font-bold transition cursor-pointer ${state.activePaymentMethod === 'CREDIT_CARD' ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}">
            💳 บัตรเครดิต
          </button>
          <button type="button" onclick="switchPaymentMethodTab('SPLIT', ${inv.id})" class="p-2.5 rounded-lg border text-center font-bold transition cursor-pointer ${state.activePaymentMethod === 'SPLIT' ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}">
            ⚡ แบ่งจ่าย
          </button>
        </div>

        <!-- Dynamic Payment Method Inputs -->
        <div id="checkout-method-inputs" class="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2">
          ${renderPaymentMethodSpecificUI(netPayable)}
        </div>
      </div>

      <!-- Financial Calculation Summary Panel -->
      <div class="p-3.5 bg-slate-900 text-white rounded-xl space-y-1.5 text-xs">
        <div class="flex justify-between text-slate-400">
          <span>ยอดรวมรายการ (Subtotal):</span>
          <span class="font-mono">฿${subtotal.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
        </div>
        ${discount > 0 ? `
          <div class="flex justify-between text-amber-400 font-semibold">
            <span>ส่วนลดรวม (Discount):</span>
            <span class="font-mono">-฿${discount.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
          </div>
        ` : ''}
        ${depositAmount > 0 ? `
          <div class="flex justify-between text-emerald-400 font-semibold">
            <span>หักเงินมัดจำล่วงหน้า (Deposit Deducted):</span>
            <span class="font-mono">-฿${depositAmount.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
          </div>
        ` : ''}
        <div class="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800">
          <span>ภาษีมูลค่าเพิ่ม (VAT 7% รวมในยอด):</span>
          <span class="font-mono">฿${Number((netPayable * 7 / 107).toFixed(2)).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
        </div>
        <div class="flex justify-between items-baseline pt-2 border-t border-slate-700 text-sm font-bold">
          <span class="text-amber-400">ยอดสุทธิที่ต้องชำระ (Net Payable):</span>
          <span class="text-xl font-extrabold text-white font-mono">฿${netPayable.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
        </div>
      </div>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderPaymentMethodSpecificUI(netPayable) {
  if (state.activePaymentMethod === 'CASH') {
    return `
      <div class="space-y-2 text-xs">
        <div class="flex items-center justify-between">
          <label class="font-semibold text-slate-700">รับเงินสดมา (Tendered Amount):</label>
          <input type="number" id="input-tendered-cash" value="${netPayable}" oninput="calculateCashChange(${netPayable})" class="w-32 p-1.5 text-right font-mono font-bold rounded border border-slate-300 bg-white">
        </div>
        <div class="flex items-center justify-between pt-1 border-t border-slate-200">
          <span class="font-bold text-slate-700">เงินทอน (Change Due):</span>
          <span id="cash-change-display" class="font-mono font-extrabold text-emerald-700 text-sm">฿0.00</span>
        </div>
        <div class="flex gap-1.5 pt-1">
          <button type="button" onclick="setTenderedAmount(${netPayable}, ${netPayable})" class="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold hover:bg-slate-100">พอดี</button>
          <button type="button" onclick="setTenderedAmount(500, ${netPayable})" class="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold hover:bg-slate-100">฿500</button>
          <button type="button" onclick="setTenderedAmount(1000, ${netPayable})" class="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold hover:bg-slate-100">฿1,000</button>
          <button type="button" onclick="setTenderedAmount(2000, ${netPayable})" class="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold hover:bg-slate-100">฿2,000</button>
        </div>
      </div>
    `;
  } else if (state.activePaymentMethod === 'PROMPTPAY') {
    return `
      <div class="text-xs space-y-2">
        <div class="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
          <p class="font-bold text-slate-800">สแกน PromptPay QR เพื่อชำระ ฿${netPayable.toLocaleString('th-TH', {minimumFractionDigits: 2})}</p>
          <p class="text-[11px] text-slate-500 mt-0.5">บจก. คลินิกสัตว์แพทย์เรเวนิค (0105561001234)</p>
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">รหัสอ้างอิงสลิปโอน (Bank Slip Reference):</label>
          <input type="text" id="input-ref-promptpay" placeholder="เช่น TXN-PP-123456" class="w-full p-2 rounded border border-slate-300 bg-white font-mono">
        </div>
      </div>
    `;
  } else if (state.activePaymentMethod === 'CREDIT_CARD') {
    return `
      <div class="text-xs space-y-2">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">รหัสอนุมัติบัตร EDC (Approval Code):</label>
          <input type="text" id="input-card-approval" placeholder="เช่น 987654 (Visa / Master)" class="w-full p-2 rounded border border-slate-300 bg-white font-mono">
        </div>
      </div>
    `;
  } else if (state.activePaymentMethod === 'SPLIT') {
    return `
      <div class="text-xs space-y-2">
        <p class="font-bold text-slate-800">แบ่งจ่าย 2 ช่องทาง หรือชำระบางส่วน (Partial Payment)</p>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-0.5">ชำระเงินสด (บาท):</label>
            <input type="number" id="split-cash-amount" value="${Math.min(500, netPayable)}" class="w-full p-1.5 rounded border border-slate-300 bg-white font-mono font-bold">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-0.5">โอนเงิน / PromptPay (บาท):</label>
            <input type="number" id="split-promptpay-amount" value="${Math.max(0, netPayable - Math.min(500, netPayable))}" class="w-full p-1.5 rounded border border-slate-300 bg-white font-mono font-bold">
          </div>
        </div>
        <p class="text-[11px] text-slate-500">หากยอดที่ระบุรวมกันน้อยกว่า ฿${netPayable.toLocaleString('th-TH')} บิลจะถูกบันทึกเป็น "ชำระแล้วบางส่วน (PARTIAL)"</p>
      </div>
    `;
  }
  return '';
}

function switchPaymentMethodTab(method, invoiceId) {
  state.activePaymentMethod = method;
  const inv = getInvoiceById(invoiceId);
  if (inv) renderCheckoutSheetBody(inv);
}

function setTenderedAmount(amount, netPayable) {
  const input = document.getElementById('input-tendered-cash');
  if (input) {
    input.value = amount;
    calculateCashChange(netPayable);
  }
}

function calculateCashChange(netPayable) {
  const input = document.getElementById('input-tendered-cash');
  const display = document.getElementById('cash-change-display');
  if (!input || !display) return;

  const tendered = Number(input.value) || 0;
  const change = Math.max(0, tendered - netPayable);
  display.innerText = `฿${change.toLocaleString('th-TH', {minimumFractionDigits: 2})}`;
}

function updateCheckoutDiscount(value, invoiceId) {
  state.checkoutDiscount = Math.max(0, Number(value));
  const inv = getInvoiceById(invoiceId);
  if (inv) renderCheckoutSheetBody(inv);
}

function applyCheckoutCoupon(code, invoiceId) {
  if (!code) {
    state.checkoutDiscount = 0;
  } else {
    const coupon = getDiscountByCode(code);
    if (coupon) {
      state.checkoutDiscount = coupon.discount_value;
      showToast('ใช้คูปองส่วนลดสำเร็จ', `ใช้สิทธิ ${coupon.name} ลด ฿${coupon.discount_value}`, 'success');
    }
  }
  const inv = getInvoiceById(invoiceId);
  if (inv) renderCheckoutSheetBody(inv);
}

function toggleDepositDeduction(checked, invoiceId) {
  state.checkoutDepositApplied = checked;
  const inv = getInvoiceById(invoiceId);
  if (inv) renderCheckoutSheetBody(inv);
}

// ============================================================================
// 8. CONFIRM PAYMENT & CROSS-DOMAIN INTEGRATION (Capabilities 3.10 - 3.12, 3.20)
// ============================================================================

function confirmPayment(invoiceId) {
  const inv = getInvoiceById(invoiceId);
  if (!inv) return;

  const pet = getPetById(inv.pet_id);
  const deposit = getDepositByCustomerId(inv.customer_id);

  // Recalculate
  const subtotal = inv.items.reduce((sum, item) => sum + Number(item.line_total), 0);
  const discount = Number(state.checkoutDiscount || 0);
  const depositDeducted = (state.checkoutDepositApplied && deposit) ? Math.min(deposit.remaining_amount, Math.max(0, subtotal - discount)) : 0;
  const netPayable = Math.max(0, subtotal - discount - depositDeducted);

  let paidThisTime = netPayable;
  let tendered = netPayable;
  let change = 0;
  let refNumber = `TXN-PM-${Math.floor(100000 + Math.random() * 900000)}`;

  if (state.activePaymentMethod === 'CASH') {
    const input = document.getElementById('input-tendered-cash');
    tendered = Number(input?.value) || netPayable;
    change = Math.max(0, tendered - netPayable);
  } else if (state.activePaymentMethod === 'PROMPTPAY') {
    refNumber = document.getElementById('input-ref-promptpay')?.value || refNumber;
  } else if (state.activePaymentMethod === 'CREDIT_CARD') {
    refNumber = document.getElementById('input-card-approval')?.value || refNumber;
  } else if (state.activePaymentMethod === 'SPLIT') {
    const cashSplit = Number(document.getElementById('split-cash-amount')?.value || 0);
    const ppSplit = Number(document.getElementById('split-promptpay-amount')?.value || 0);
    paidThisTime = cashSplit + ppSplit;
    tendered = paidThisTime;
  }

  // Handle deposit deduction
  if (depositDeducted > 0 && deposit) {
    deposit.used_amount += depositDeducted;
    deposit.remaining_amount -= depositDeducted;
    state.depositAllocations.push({
      id: state.depositAllocations.length + 1,
      deposit_id: deposit.id,
      invoice_id: inv.id,
      allocated_amount: depositDeducted,
      allocated_at: '2026-03-02 12:45'
    });
  }

  // Update Invoice status
  inv.subtotal = subtotal;
  inv.discount_total = discount;
  inv.grand_total = Math.max(0, subtotal - discount);

  const prevPaid = Number(inv.paid_amount || 0);
  const newTotalPaid = prevPaid + paidThisTime + depositDeducted;
  inv.paid_amount = newTotalPaid;
  inv.outstanding_amount = Math.max(0, inv.grand_total - newTotalPaid);

  if (inv.outstanding_amount === 0) {
    inv.status = 'PAID';
  } else {
    inv.status = 'PARTIAL';
  }

  // Create Payment Record
  const newPayId = state.payments.length + 1;
  const payment = {
    id: newPayId,
    payment_number: `PAY-20260302-${String(newPayId).padStart(3, '0')}`,
    invoice_id: inv.id,
    customer_id: inv.customer_id,
    amount: paidThisTime,
    payment_method: state.activePaymentMethod,
    tendered_amount: tendered,
    change_amount: change,
    transaction_ref: refNumber,
    deposit_deducted: depositDeducted,
    paid_at: '2026-03-02 12:45',
    received_by: 'น.ส. สุภาพร (แคชเชียร์)',
    status: 'SUCCESS'
  };
  state.payments.unshift(payment);

  // Create Payment Allocation
  state.paymentAllocations.push({
    id: state.paymentAllocations.length + 1,
    payment_id: payment.id,
    invoice_id: inv.id,
    allocated_amount: paidThisTime,
    allocated_at: '2026-03-02 12:45'
  });

  // Create Receipt Record
  const newRecId = state.receipts.length + 1;
  const receipt = {
    id: newRecId,
    receipt_number: `REC-20260302-${String(newRecId).padStart(3, '0')}`,
    invoice_id: inv.id,
    payment_id: payment.id,
    customer_id: inv.customer_id,
    pet_id: inv.pet_id,
    receipt_date: '2026-03-02 12:45',
    total_amount: paidThisTime + depositDeducted,
    tax_amount: Number(((paidThisTime + depositDeducted) * 7 / 107).toFixed(2)),
    issued_by: 'น.ส. สุภาพร (แคชเชียร์)',
    status: 'ACTIVE'
  };
  state.receipts.unshift(receipt);

  // Create Tax Invoice Record
  const owner = getCustomerById(inv.customer_id);
  const newTaxId = state.taxInvoices.length + 1;
  const taxInv = {
    id: newTaxId,
    tax_invoice_number: `TAX-20260302-${String(newTaxId).padStart(3, '0')}`,
    receipt_id: receipt.id,
    invoice_id: inv.id,
    customer_name: owner?.display_name || 'ลูกค้าทั่วไป',
    tax_id: '1100400' + Math.floor(100000 + Math.random() * 900000),
    customer_address: owner?.address || 'กรุงเทพมหานคร',
    branch_name: 'สำนักงานใหญ่',
    issued_at: '2026-03-02 12:45',
    tax_amount: receipt.tax_amount,
    issued_by: 'น.ส. สุภาพร (แคชเชียร์)'
  };
  state.taxInvoices.unshift(taxInv);

  // Cross-domain: Advance Queue Stage to COMPLETED if paid in full
  if (inv.status === 'PAID') {
    const queueTicket = state.queues.find(q => q.pet_id === inv.pet_id);
    if (queueTicket) {
      queueTicket.stage = 'COMPLETED';
    }
  }

  // Central Event Bus Notification (D07 -> D02 Queue & D08 CRM Points)
  if (window.ClinicEventBus && window.CLINIC_EVENTS) {
    window.ClinicEventBus.emit(window.CLINIC_EVENTS.PAYMENT_CONFIRMED, {
      invoice: inv,
      payment: payment,
      petId: inv.pet_id,
      customerId: inv.customer_id
    });
  }

  closeSheet();
  renderCurrentView();

  showToast(
    inv.status === 'PAID' ? 'รับชำระเงินสำเร็จครบถ้วน!' : 'รับชำระเงินบางส่วนเรียบร้อย',
    `บันทึกการรับเงิน ฿${paidThisTime.toLocaleString('th-TH', {minimumFractionDigits: 2})} สำหรับ ${getPetDisplayName(pet)} เรียบร้อย พร้อมออกใบเสร็จ`,
    'success'
  );

  openReceiptModal(inv.id, 'slip');
}

// ============================================================================
// 9. MODALS: VOID INVOICE, DEPOSIT, REFUND, SHIFT CLOSE
// ============================================================================

// 9.1 Void Invoice Modal
function openVoidInvoiceModal(invoiceId) {
  const modal = document.getElementById('modal-void-invoice');
  if (!modal) return;
  modal.setAttribute('data-invoice-id', invoiceId);
  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeVoidInvoiceModal() {
  const modal = document.getElementById('modal-void-invoice');
  if (modal) modal.classList.add('hidden');
}

function submitVoidInvoice(e) {
  e.preventDefault();
  const modal = document.getElementById('modal-void-invoice');
  const invoiceId = Number(modal.getAttribute('data-invoice-id') || 0);
  const inv = getInvoiceById(invoiceId);
  if (!inv) return;

  const reason = document.getElementById('void-reason')?.value || 'ยกเลิกเนื่องจากคิดเงินซ้ำหรือข้อมูลผิดพลาด';

  inv.status = 'VOID';
  inv.outstanding_amount = 0;

  closeVoidInvoiceModal();
  renderInvoicesAndAccountsReceivableView();
  showToast('ยกเลิกบิลสำเร็จ (Voided)', `ยกเลิกใบแจ้งหนี้ ${inv.invoice_number} เรียบร้อยแล้ว (เหตุผล: ${reason})`, 'warning');
}

// 9.2 Customer Deposit Modal
function openCustomerDepositModal() {
  const modal = document.getElementById('modal-customer-deposit');
  if (!modal) return;
  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeCustomerDepositModal() {
  const modal = document.getElementById('modal-customer-deposit');
  if (modal) modal.classList.add('hidden');
}

function submitCustomerDeposit(e) {
  e.preventDefault();
  const customerId = Number(document.getElementById('deposit-customer-id').value);
  const petId = Number(document.getElementById('deposit-pet-id').value);
  const amount = Number(document.getElementById('deposit-amount').value);
  const method = document.getElementById('deposit-method').value;
  const notes = document.getElementById('deposit-notes').value;

  const newId = state.customerDeposits.length + 1;
  const newDeposit = {
    id: newId,
    deposit_number: `DEP-20260302-${String(newId).padStart(2, '0')}`,
    customer_id: customerId,
    pet_id: petId,
    original_amount: amount,
    used_amount: 0.00,
    remaining_amount: amount,
    payment_method: method,
    received_at: '2026-03-02 12:50',
    received_by: 'น.ส. สุภาพร (แคชเชียร์)',
    notes: notes,
    status: 'ACTIVE'
  };

  state.customerDeposits.unshift(newDeposit);
  closeCustomerDepositModal();
  renderDepositsAndRefundsView();
  showToast('รับเงินมัดจำสำเร็จ', `บันทึกเงินมัดจำ ฿${amount.toLocaleString()} เรียบร้อยแล้ว`, 'success');
}

// 9.3 Refund Order Modal
function openRefundModal(invoiceId) {
  const modal = document.getElementById('modal-refund-order');
  if (!modal) return;
  if (invoiceId) modal.setAttribute('data-invoice-id', invoiceId);
  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeRefundModal() {
  const modal = document.getElementById('modal-refund-order');
  if (modal) modal.classList.add('hidden');
}

function submitRefundOrder(e) {
  e.preventDefault();
  const invoiceId = Number(document.getElementById('refund-invoice-select').value);
  const amount = Number(document.getElementById('refund-amount').value);
  const method = document.getElementById('refund-method').value;
  const reason = document.getElementById('refund-reason').value;

  const inv = getInvoiceById(invoiceId);
  const newId = state.refunds.length + 1;
  const newRefund = {
    id: newId,
    refund_number: `REF-20260302-${String(newId).padStart(3, '0')}`,
    payment_id: 1,
    invoice_id: invoiceId,
    customer_id: inv?.customer_id || 1,
    refund_amount: amount,
    refund_method: method,
    refund_reason: reason,
    refunded_at: '2026-03-02 12:55',
    approved_by: 1,
    status: 'COMPLETED'
  };

  state.refunds.unshift(newRefund);
  closeRefundModal();
  renderDepositsAndRefundsView();
  showToast('ดำเนินการคืนเงินสำเร็จ', `คืนเงิน ฿${amount.toLocaleString()} เรียบร้อยแล้ว`, 'success');
}

// 9.4 Cash Drawer Shift Close Modal
function openShiftCloseModal() {
  const modal = document.getElementById('modal-shift-close');
  if (!modal) return;
  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeShiftCloseModal() {
  const modal = document.getElementById('modal-shift-close');
  if (modal) modal.classList.add('hidden');
}

function calculateShiftVariance() {
  const counted = Number(document.getElementById('actual-cash-counted')?.value || 0);
  const expected = Number(document.getElementById('expected-cash-val')?.value || 0);
  const variance = counted - expected;
  const display = document.getElementById('shift-variance-display');
  if (display) {
    if (variance === 0) {
      display.className = 'text-xs font-bold font-mono text-emerald-600';
      display.innerText = '✓ ยอดเงินสดตรงกับระบบทุกประการ (Balanced)';
    } else if (variance < 0) {
      display.className = 'text-xs font-bold font-mono text-rose-600';
      display.innerText = `⚠️ เงินสดขาด ฿${Math.abs(variance).toLocaleString('th-TH', {minimumFractionDigits: 2})} (Shortage)`;
    } else {
      display.className = 'text-xs font-bold font-mono text-blue-600';
      display.innerText = `ℹ️ เงินสดเกิน ฿${variance.toLocaleString('th-TH', {minimumFractionDigits: 2})} (Overage)`;
    }
  }
}

function submitShiftClose(e) {
  e.preventDefault();
  const counted = Number(document.getElementById('actual-cash-counted').value);
  const expected = Number(document.getElementById('expected-cash-val').value);
  const notes = document.getElementById('shift-close-notes').value;
  const variance = counted - expected;

  const newId = state.dailyCashClosings.length + 1;
  const newClosing = {
    id: newId,
    closing_number: `CLS-20260302-${String(newId).padStart(2, '0')}`,
    shift_date: '2026-03-02',
    shift_name: state.activeCashDrawer.shift_name,
    cashier_id: 3,
    cashier_name: state.activeCashDrawer.cashier_name,
    opening_float: state.activeCashDrawer.opening_float,
    system_cash_sales: expected - state.activeCashDrawer.opening_float,
    expected_cash: expected,
    actual_cash_counted: counted,
    variance_amount: variance,
    promptpay_total: 1350.00,
    credit_card_total: 0.00,
    total_shift_revenue: (expected - state.activeCashDrawer.opening_float) + 1350.00,
    notes: notes,
    status: 'CLOSED',
    closed_at: '2026-03-02 13:00'
  };

  state.dailyCashClosings.unshift(newClosing);
  closeShiftCloseModal();
  renderShiftClosingAndReportsView();
  showToast('ปิดกะการเงินสำเร็จ', `ปิดกะ ${newClosing.closing_number} ส่งมอบเงินสด ฿${counted.toLocaleString()} เข้าตู้นิรภัยเรียบร้อย`, 'success');
}

// ============================================================================
// 10. REALISTIC MEDICAL RECEIPT & TAX INVOICE MODAL
// ============================================================================

function openReceiptModal(invoiceId, docType = 'slip') {
  const modal = document.getElementById('modal-receipt-viewer');
  if (!modal) return;

  state.activeReceiptInvoiceId = invoiceId;
  state.activeReceiptDocType = docType;

  modal.classList.remove('hidden');
  renderReceiptDocumentContent(invoiceId, docType);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeReceiptModal() {
  const modal = document.getElementById('modal-receipt-viewer');
  if (modal) modal.classList.add('hidden');
}

function switchReceiptDocType(type) {
  state.activeReceiptDocType = type;
  const btnSlip = document.getElementById('btn-receipt-view-slip');
  const btnTax = document.getElementById('btn-receipt-view-tax');

  if (type === 'slip') {
    btnSlip.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-800 shadow-xs border border-slate-200 transition';
    btnTax.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition';
  } else {
    btnSlip.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition';
    btnTax.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-800 shadow-xs border border-slate-200 transition';
  }

  if (state.activeReceiptInvoiceId) {
    renderReceiptDocumentContent(state.activeReceiptInvoiceId, type);
  }
}

function renderReceiptDocumentContent(invoiceId, docType) {
  const container = document.getElementById('receipt-document-viewport');
  if (!container) return;

  const inv = getInvoiceById(invoiceId);
  if (!inv) return;

  const pet = getPetById(inv.pet_id);
  const owner = getCustomerById(inv.customer_id);
  const payment = getPaymentByInvoiceId(inv.id);
  const receipt = getReceiptByInvoiceId(inv.id);
  const taxInv = receipt ? getTaxInvoiceByReceiptId(receipt.id) : null;

  if (docType === 'slip') {
    // 80mm Thermal Slip
    container.innerHTML = `
      <div class="max-w-[340px] mx-auto bg-white p-4 font-mono text-[11px] leading-relaxed border border-slate-200 rounded-lg shadow-inner">
        <div class="text-center pb-2 border-b border-dashed border-slate-300">
          <h3 class="font-bold text-xs uppercase text-slate-900">RAVENIQUE VET CLINIC</h3>
          <p class="text-[10px] text-slate-500">บจก. คลินิกสัตว์แพทย์เรเวนิค</p>
          <p class="text-[10px] text-slate-500">เลขประจำตัวผู้เสียภาษี 0105561001234</p>
          <p class="text-[10px] text-slate-500">โทร. 02-987-6543</p>
          <p class="font-bold text-xs mt-1 text-slate-800">ใบเสร็จรับเงิน (อย่างย่อ)</p>
        </div>

        <div class="py-2 space-y-0.5 border-b border-dashed border-slate-300 text-slate-700">
          <div class="flex justify-between"><span>เลขที่:</span><span class="font-bold">${receipt?.receipt_number || 'REC-20260302-001'}</span></div>
          <div class="flex justify-between"><span>วันที่:</span><span>${receipt?.receipt_date || '02/03/2026 12:45'}</span></div>
          <div class="flex justify-between"><span>ลูกค้า:</span><span class="truncate">${owner?.display_name || '-'}</span></div>
          <div class="flex justify-between"><span>สัตว์เลี้ยง:</span><span>${getPetDisplayName(pet)}</span></div>
        </div>

        <div class="py-2 space-y-1 border-b border-dashed border-slate-300">
          ${inv.items.map(it => `
            <div class="flex justify-between">
              <span class="truncate pr-2">${it.description_snapshot}</span>
              <span class="shrink-0 font-bold">฿${Number(it.line_total).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>

        <div class="py-2 space-y-1 border-b border-dashed border-slate-300">
          <div class="flex justify-between"><span>ยอดรวม (Subtotal):</span><span>฿${inv.subtotal.toFixed(2)}</span></div>
          ${inv.discount_total > 0 ? `<div class="flex justify-between text-amber-700"><span>ส่วนลด:</span><span>-฿${inv.discount_total.toFixed(2)}</span></div>` : ''}
          <div class="flex justify-between font-bold text-xs pt-1 text-slate-900">
            <span>ยอดชำระสุทธิ:</span>
            <span>฿${inv.grand_total.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-[10px] text-slate-400">
            <span>(รวมภาษีมูลค่าเพิ่ม 7%: ฿${Number((inv.grand_total * 7 / 107).toFixed(2))})</span>
          </div>
        </div>

        <div class="pt-2 text-center text-[10px] text-slate-400">
          <p>ขอบคุณที่ไว้วางใจให้เราดูแลสัตว์เลี้ยงของท่าน</p>
          <p>Thank you for choosing Ravenique</p>
        </div>
      </div>
    `;
  } else {
    // A4 Full Tax Invoice
    container.innerHTML = `
      <div class="bg-white p-6 rounded-xl border border-slate-300 text-xs text-slate-700 space-y-4 shadow-sm max-w-xl mx-auto">
        <div class="flex justify-between items-start pb-4 border-b border-slate-200">
          <div>
            <h2 class="text-sm font-bold text-slate-900 uppercase">บริษัท คลินิกสัตว์แพทย์เรเวนิค จำกัด (สำนักงานใหญ่)</h2>
            <p class="text-[11px] text-slate-500 mt-0.5">888 ถนนสุขุมวิท 55 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110</p>
            <p class="text-[11px] text-slate-500">เลขประจำตัวผู้เสียภาษีอากร: 0105561001234</p>
          </div>
          <div class="text-right">
            <span class="text-xs font-bold text-slate-900 border border-slate-400 px-2.5 py-1 rounded">ใบเสร็จรับเงิน / ใบกำกับภาษี</span>
            <p class="text-xs font-mono font-bold text-slate-800 mt-2">${taxInv?.tax_invoice_number || 'TAX-20260302-001'}</p>
            <p class="text-[11px] text-slate-400">${taxInv?.issued_at || '02 มีนาคม 2569'}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-bold block">ชื่อและที่อยู่ลูกค้า (Customer Info):</span>
            <p class="font-bold text-slate-900 mt-0.5">${taxInv?.customer_name || owner?.display_name || '-'}</p>
            <p class="text-slate-600 text-[11px]">${taxInv?.customer_address || owner?.address || 'กรุงเทพมหานคร'}</p>
            <p class="text-slate-600 text-[11px]">เลขประจำตัวผู้เสียภาษี: ${taxInv?.tax_id || '-'}</p>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-bold block">ข้อมูลสัตว์ป่วยและแพทย์ (Patient & Vet):</span>
            <p class="text-slate-800 mt-0.5">สัตว์ป่วย: <strong class="text-slate-900">${getPetDisplayName(pet)}</strong> (${pet?.species || ''}/${pet?.breed || ''})</p>
            <p class="text-slate-600 text-[11px]">เลขที่ใบแจ้งหนี้อ้างอิง: ${inv.invoice_number}</p>
          </div>
        </div>

        <table class="w-full text-left text-xs border-collapse">
          <thead class="bg-slate-100 border-y border-slate-200 font-bold text-[10px] text-slate-600 uppercase">
            <tr>
              <th class="p-2">ลำดับ</th>
              <th class="p-2">รายการ</th>
              <th class="p-2 text-center">จำนวน</th>
              <th class="p-2 text-right">ราคา/หน่วย</th>
              <th class="p-2 text-right">จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${inv.items.map((it, idx) => `
              <tr>
                <td class="p-2 text-slate-400">${idx + 1}</td>
                <td class="p-2 font-medium text-slate-800">${it.description_snapshot}</td>
                <td class="p-2 text-center">${it.quantity}</td>
                <td class="p-2 text-right font-mono">฿${Number(it.unit_price_snapshot).toFixed(2)}</td>
                <td class="p-2 text-right font-mono font-bold">฿${Number(it.line_total).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="flex justify-end pt-2 border-t border-slate-200 text-xs">
          <div class="w-64 space-y-1">
            <div class="flex justify-between text-slate-600"><span>รวมเป็นเงิน:</span><span class="font-mono">฿${inv.subtotal.toFixed(2)}</span></div>
            ${inv.discount_total > 0 ? `<div class="flex justify-between text-amber-700"><span>หักส่วนลด:</span><span class="font-mono">-฿${inv.discount_total.toFixed(2)}</span></div>` : ''}
            <div class="flex justify-between text-slate-600"><span>ภาษีมูลค่าเพิ่ม (7%):</span><span class="font-mono">฿${Number((inv.grand_total * 7 / 107).toFixed(2))}</span></div>
            <div class="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-300">
              <span>จำนวนเงินรวมทั้งสิ้น:</span>
              <span class="font-mono">฿${inv.grand_total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

function printReceiptDocument() {
  window.print();
}

function dischargePatientFromReceipt() {
  closeReceiptModal();
  showToast('จำหน่ายสัตว์ป่วยสำเร็จ', 'สัตว์ป่วยได้รับการจำหน่ายออกจากระบบเรียบร้อยแล้ว', 'success');
}

// ============================================================================
// 11. POS RETAIL & NEW INVOICE SLIDE-OVER ENGINE (CAPABILITIES 3.1, 3.2, 3.8)
// ============================================================================

function openNewInvoiceSheet() {
  state.sheetMode = 'billing-new-adhoc';
  state.newInvoiceCart = [];
  state.newInvoiceDiscount = 0;

  openSheetContainer();

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  badge.innerText = 'NEW INVOICE / POS';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300';
  title.innerText = 'เปิดบิลใหม่ & ขายสินค้าหน้าร้าน (POS)';
  subtitle.innerText = 'เลือกสัตว์ป่วย/ลูกค้า เพิ่มรายการบริการ ค่ายา หรือสินค้าหน้าร้าน และออกใบแจ้งหนี้';

  body.innerHTML = `
    <div class="space-y-4 text-xs">
      <!-- 1. Customer & Pet Selection -->
      <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div class="flex items-center justify-between">
          <label class="font-bold text-slate-800 flex items-center gap-1.5">
            <i data-lucide="user-check" class="w-4 h-4 text-teal-600"></i>
            <span>1. เลือกลูกค้าและสัตว์ป่วย (Customer & Patient) <span class="text-rose-500">*</span></span>
          </label>
          <span class="text-[10px] text-slate-400">ผูกกับเวชระเบียน</span>
        </div>
        <select id="new-invoice-pet-select" onchange="updateNewInvoiceClientBadge()" class="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500">
          <option value="0">-- ลูกค้าทั่วไป / Walk-in Retail (ไม่ระบุสัตว์เลี้ยง) --</option>
          ${state.pets.map(p => {
            const owner = getPrimaryOwnerForPet(p.id);
            const phone = owner?.phone_primary || owner?.phone || '-';
            return `<option value="${p.id}" ${p.id === 1 ? 'selected' : ''}>น้อง${p.pet_name} (${p.species} - ${p.breed}) • เจ้าของ: ${owner?.display_name || '-'} (${phone})</option>`;
          }).join('')}
        </select>
        <div id="new-invoice-client-badge" class="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
          <!-- Injected by updateNewInvoiceClientBadge -->
        </div>
      </div>

      <!-- 2. Catalog Item Selector & Add -->
      <div class="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2.5">
        <label class="font-bold text-slate-800 flex items-center gap-1.5">
          <i data-lucide="shopping-cart" class="w-4 h-4 text-amber-600"></i>
          <span>2. เพิ่มรายการค่าบริการ / สินค้าหน้าร้าน / ยาเข้าบิล</span>
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div class="sm:col-span-8">
            <select id="new-invoice-item-select" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
              <optgroup label="📋 ค่าบริการตรวจรักษาและหัตถการ (Services)">
                ${state.serviceCatalogs.filter(s => s.category !== 'RETAIL').map(s => `
                  <option value="SRV_${s.id}">[บริการ] ${s.service_name} (฿${s.unit_price.toLocaleString('th-TH')})</option>
                `).join('')}
              </optgroup>
              <optgroup label="🛍️ สินค้าและเวชภัณฑ์หน้าร้าน (Retail)">
                ${state.serviceCatalogs.filter(s => s.category === 'RETAIL').map(s => `
                  <option value="SRV_${s.id}">[สินค้า] ${s.service_name} (฿${s.unit_price.toLocaleString('th-TH')})</option>
                `).join('')}
              </optgroup>
              <optgroup label="💊 ยาและเวชภัณฑ์คลังยา (Pharmacy Products)">
                ${(state.products || []).map(p => `
                  <option value="PRD_${p.id}">[ยา] ${p.product_name} (${p.strength || p.category}) - ฿${p.unit_price.toLocaleString('th-TH')}/${p.base_unit}</option>
                `).join('')}
              </optgroup>
            </select>
          </div>
          <div class="sm:col-span-2">
            <input id="new-invoice-item-qty" type="number" min="1" value="1" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-center text-xs font-bold text-slate-800" placeholder="จน.">
          </div>
          <div class="sm:col-span-2">
            <button type="button" onclick="addAdhocCartItem()" class="w-full h-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-lg transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>เพิ่ม</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Cart Items Table -->
      <div class="border border-slate-200 rounded-xl overflow-hidden">
        <div class="p-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between font-bold text-slate-700">
          <span>รายการในใบแจ้งหนี้ (Items in Bill)</span>
          <span id="new-invoice-cart-count" class="text-[11px] font-normal text-slate-500">0 รายการ</span>
        </div>
        <div id="new-invoice-cart-list" class="divide-y divide-slate-100 max-h-48 overflow-y-auto">
          <!-- Injected by renderNewInvoiceCart() -->
        </div>
      </div>

      <!-- 4. Financial Calculations Box -->
      <div class="p-4 bg-slate-900 text-white rounded-xl space-y-2">
        <div class="flex justify-between text-slate-300">
          <span>ยอดรวมค่าบริการและสินค้า (Subtotal)</span>
          <span id="new-invoice-subtotal-disp" class="font-mono font-bold">฿0.00</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-slate-300">ส่วนลดพิเศษ (Discount THB)</span>
          <input id="new-invoice-discount-input" type="number" min="0" value="0" oninput="updateAdhocCartTotals()" class="w-24 text-right bg-slate-800 border border-slate-700 text-rose-400 font-mono text-xs p-1 rounded">
        </div>
        <div class="border-t border-slate-700 pt-2 flex justify-between items-baseline">
          <div>
            <span class="text-sm font-bold text-white">ยอดสุทธิรวมทั้งสิ้น (Grand Total)</span>
            <span class="text-[10px] text-slate-400 block">(รวมภาษีมูลค่าเพิ่ม VAT 7% แล้ว)</span>
          </div>
          <span id="new-invoice-grandtotal-disp" class="text-2xl font-black font-mono text-emerald-400">฿0.00</span>
        </div>
      </div>

      <!-- 5. Optional Note -->
      <div>
        <label class="font-semibold text-slate-600 block mb-1">หมายเหตุการเปิดบิล (Invoice Notes)</label>
        <input id="new-invoice-notes" type="text" placeholder="เช่น ขายอาหารและยาบำรุงหน้าร้าน, ตรวจเช็กสุขภาพพิเศษ..." class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800">
      </div>
    </div>
  `;

  footer.innerHTML = `
    <button onclick="closeSheet()" class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/80 transition cursor-pointer">
      ยกเลิก
    </button>
    <button type="button" onclick="submitNewInvoice(false)" class="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
      <i data-lucide="file-text" class="w-4 h-4 text-slate-300"></i>
      <span>บันทึกเป็นบิลรอชำระ</span>
    </button>
    <button type="button" onclick="submitNewInvoice(true)" class="px-5 py-2.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
      <i data-lucide="credit-card" class="w-4 h-4"></i>
      <span>บันทึก & รับชำระเงินทันที</span>
    </button>
  `;

  updateNewInvoiceClientBadge();
  renderNewInvoiceCart();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function updateNewInvoiceClientBadge() {
  const select = document.getElementById('new-invoice-pet-select');
  const badge = document.getElementById('new-invoice-client-badge');
  if (!select || !badge) return;

  const petId = Number(select.value);
  if (petId === 0) {
    badge.innerHTML = `
      <div class="flex items-center gap-2 text-slate-600">
        <span class="w-2 h-2 rounded-full bg-slate-400"></span>
        <span>บิลขายปลีกหน้าร้านทั่วไป (Walk-in Customer)</span>
      </div>
      <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">RETAIL-POS</span>
    `;
  } else {
    const pet = getPetById(petId);
    const owner = getPrimaryOwnerForPet(petId);
    const phone = owner?.phone_primary || owner?.phone || '-';
    const deposit = owner ? getDepositByCustomerId(owner.id) : null;

    badge.innerHTML = `
      <div class="flex items-center gap-2">
        <img src="${pet?.photo || ''}" class="w-6 h-6 rounded-md object-cover border border-slate-200" onerror="this.style.display='none'">
        <span class="font-bold text-slate-800">น้อง${pet?.pet_name}</span>
        <span class="text-slate-500">(${pet?.species})</span>
        <span class="text-slate-400">•</span>
        <span class="text-slate-700">เจ้าของ: <strong>${owner?.display_name || '-'}</strong> (${phone})</span>
      </div>
      ${deposit && deposit.remaining_amount > 0 ? `
        <span class="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded border border-purple-200">
          มีมัดจำ ฿${deposit.remaining_amount.toLocaleString('th-TH')}
        </span>
      ` : `
        <span class="text-[10px] text-slate-400 font-mono">ID: PET-${String(petId).padStart(3, '0')}</span>
      `}
    `;
  }
}

function addAdhocCartItem() {
  const itemVal = document.getElementById('new-invoice-item-select')?.value;
  const qtyInput = document.getElementById('new-invoice-item-qty');
  const qty = Math.max(1, Number(qtyInput?.value || 1));
  if (!itemVal) return;

  const [type, idStr] = itemVal.split('_');
  const id = Number(idStr);
  let item = null;

  if (type === 'SRV') {
    const srv = state.serviceCatalogs.find(s => s.id === id);
    if (srv) {
      item = {
        item_code: srv.service_code,
        description: srv.service_name,
        category: srv.category,
        unit: 'รายการ',
        unit_price: srv.unit_price,
        quantity: qty,
        line_total: srv.unit_price * qty
      };
    }
  } else if (type === 'PRD') {
    const prd = (state.products || []).find(p => p.id === id);
    if (prd) {
      item = {
        item_code: prd.sku || prd.code || `MED-${prd.id}`,
        description: `${prd.product_name} (${prd.strength || prd.category})`,
        category: 'PHARMACY',
        unit: prd.base_unit || 'หน่วย',
        unit_price: prd.unit_price,
        quantity: qty,
        line_total: prd.unit_price * qty
      };
    }
  }

  if (item) {
    if (!state.newInvoiceCart) state.newInvoiceCart = [];
    const existing = state.newInvoiceCart.find(c => c.item_code === item.item_code);
    if (existing) {
      existing.quantity += item.quantity;
      existing.line_total = existing.quantity * existing.unit_price;
    } else {
      state.newInvoiceCart.push(item);
    }
    renderNewInvoiceCart();
    if (qtyInput) qtyInput.value = '1';
  }
}

function removeAdhocCartItem(idx) {
  if (state.newInvoiceCart && state.newInvoiceCart[idx]) {
    state.newInvoiceCart.splice(idx, 1);
    renderNewInvoiceCart();
  }
}

function renderNewInvoiceCart() {
  const list = document.getElementById('new-invoice-cart-list');
  const count = document.getElementById('new-invoice-cart-count');
  if (!list) return;

  const cart = state.newInvoiceCart || [];
  if (count) count.innerText = `${cart.length} รายการ`;

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="py-8 text-center text-slate-400">
        <i data-lucide="package-open" class="w-8 h-8 mx-auto mb-1 opacity-50"></i>
        <p class="text-xs font-medium">ยังไม่มีรายการในบิล</p>
        <p class="text-[11px] text-slate-400">เลือกบริการหรือสินค้าด้านบน แล้วกดปุ่ม "+ เพิ่ม" เพื่อนำเข้าบิล</p>
      </div>
    `;
  } else {
    list.innerHTML = cart.map((item, idx) => `
      <div class="p-2.5 flex items-center justify-between hover:bg-slate-50 transition">
        <div class="flex-1 pr-2">
          <div class="font-bold text-slate-800 text-xs">${item.description}</div>
          <div class="text-[11px] text-slate-500">
            ${item.quantity} ${item.unit} × ฿${item.unit_price.toLocaleString('th-TH')}
            <span class="ml-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">${item.category}</span>
          </div>
        </div>
        <div class="text-right flex items-center gap-3">
          <span class="font-mono font-bold text-slate-900 text-xs">฿${item.line_total.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
          <button type="button" onclick="removeAdhocCartItem(${idx})" class="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition cursor-pointer">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  updateAdhocCartTotals();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function updateAdhocCartTotals() {
  const subtotalDisp = document.getElementById('new-invoice-subtotal-disp');
  const discountInput = document.getElementById('new-invoice-discount-input');
  const grandtotalDisp = document.getElementById('new-invoice-grandtotal-disp');

  const cart = state.newInvoiceCart || [];
  const subtotal = cart.reduce((sum, item) => sum + item.line_total, 0);
  const discount = Math.max(0, Number(discountInput?.value || 0));
  const grandTotal = Math.max(0, subtotal - discount);

  if (subtotalDisp) subtotalDisp.innerText = `฿${subtotal.toLocaleString('th-TH', {minimumFractionDigits: 2})}`;
  if (grandtotalDisp) grandtotalDisp.innerText = `฿${grandTotal.toLocaleString('th-TH', {minimumFractionDigits: 2})}`;
}

function submitNewInvoice(proceedToCheckout = false) {
  const petSelect = document.getElementById('new-invoice-pet-select');
  const petId = Number(petSelect?.value || 0);
  const notes = document.getElementById('new-invoice-notes')?.value || '';
  const discountInput = document.getElementById('new-invoice-discount-input');
  const discount = Math.max(0, Number(discountInput?.value || 0));

  const cart = state.newInvoiceCart || [];
  if (cart.length === 0) {
    showToast('กรุณาเพิ่มรายการสินค้า', 'ไม่สามารถเปิดบิลเปล่าได้ ต้องมีอย่างน้อย 1 รายการในบิล', 'error');
    return;
  }

  let customerId = 1;
  let targetPet = null;
  if (petId > 0) {
    targetPet = getPetById(petId);
    const owner = getPrimaryOwnerForPet(petId);
    customerId = owner?.id || 1;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.line_total, 0);
  const grandTotal = Math.max(0, subtotal - discount);
  const taxTotal = Number((grandTotal * 7 / 107).toFixed(2));

  const newId = state.invoices.length + 1;
  const newInv = {
    id: newId,
    invoice_number: `INV-20260302-${String(newId).padStart(3, '0')}`,
    customer_id: customerId,
    pet_id: petId > 0 ? petId : null,
    encounter_id: null,
    surgery_schedule_id: null,
    dispense_id: null,
    diagnostic_order_id: null,
    invoice_date: '2026-03-02 12:50',
    due_date: '2026-03-02',
    payment_terms: 'DUE_ON_RECEIPT',
    subtotal: subtotal,
    discount_total: discount,
    tax_rate: 0.07,
    tax_total: taxTotal,
    grand_total: grandTotal,
    paid_amount: 0.00,
    outstanding_amount: grandTotal,
    status: 'UNPAID',
    notes: notes,
    created_by: 'น.ส. สุภาพร (แคชเชียร์)',
    items: cart.map((c, i) => ({
      id: i + 1,
      source_domain: c.category || 'RETAIL',
      source_record_id: i + 1,
      service_code: c.item_code,
      description_snapshot: c.description,
      quantity: c.quantity,
      unit: c.unit,
      unit_price_snapshot: c.unit_price,
      line_total: c.line_total
    }))
  };

  if (Array.isArray(state.invoiceItems)) {
    newInv.items.forEach(it => {
      state.invoiceItems.push({
        ...it,
        id: state.invoiceItems.length + 1,
        invoice_id: newId
      });
    });
  }

  state.invoices.unshift(newInv);
  state.newInvoiceCart = [];

  renderCurrentView();

  showToast(
    'เปิดบิลใหม่สำเร็จ!',
    `สร้างใบแจ้งหนี้ ${newInv.invoice_number} ยอดเงิน ฿${grandTotal.toLocaleString('th-TH', {minimumFractionDigits: 2})} เรียบร้อย`,
    'success'
  );

  if (proceedToCheckout) {
    openCheckoutSheet(newInv.id);
  } else {
    closeSheet();
  }
}

function createInvoiceFromQueue(ticketId) {
  const q = state.queues.find(ticket => ticket.id === Number(ticketId));
  if (!q) return;

  const pet = getPetById(q.pet_id);
  const owner = getCustomerById(q.customer_id);

  // Aggregate unbilled charges for this pet if any
  const unbilled = state.chargeSources.filter(cs => cs.pet_id === q.pet_id && cs.status === 'UNBILLED');

  const items = unbilled.length > 0 ? unbilled.map((cs, idx) => ({
    id: idx + 1,
    source_domain: cs.source_domain,
    source_record_id: cs.source_record_id,
    service_code: `SRV-AGG-${cs.id}`,
    description_snapshot: cs.description,
    quantity: 1,
    unit: 'รายการ',
    unit_price_snapshot: cs.amount,
    line_total: cs.amount
  })) : [
    {
      id: 1,
      source_domain: 'CLINICAL',
      source_record_id: 1,
      service_code: 'SRV-DOC-01',
      description_snapshot: 'ค่าตรวจวินิจฉัยและบริการวิชาชีพสัตวแพทย์ (Doctor Examination Fee)',
      quantity: 1,
      unit: 'ครั้ง',
      unit_price_snapshot: 150.00,
      line_total: 150.00
    }
  ];

  const subtotal = items.reduce((sum, it) => sum + it.line_total, 0);

  const newId = state.invoices.length + 1;
  const newInv = {
    id: newId,
    invoice_number: `INV-20260302-${String(newId).padStart(3, '0')}`,
    customer_id: q.customer_id,
    pet_id: q.pet_id,
    encounter_id: null,
    surgery_schedule_id: null,
    dispense_id: null,
    diagnostic_order_id: null,
    invoice_date: '2026-03-02 12:45',
    due_date: '2026-03-02',
    payment_terms: 'DUE_ON_RECEIPT',
    subtotal: subtotal,
    discount_total: 0.00,
    tax_rate: 0.07,
    tax_total: Number((subtotal * 7 / 107).toFixed(2)),
    grand_total: subtotal,
    paid_amount: 0.00,
    outstanding_amount: subtotal,
    status: 'UNPAID',
    created_by: 'น.ส. สุภาพร (แคชเชียร์)',
    items: items
  };

  // Mark charge sources as billed
  unbilled.forEach(cs => {
    cs.status = 'BILLED';
    cs.invoice_id = newId;
  });

  state.invoices.unshift(newInv);
  if (Array.isArray(state.invoiceItems)) {
    items.forEach(it => {
      state.invoiceItems.push({
        ...it,
        id: state.invoiceItems.length + 1,
        invoice_id: newId
      });
    });
  }
  renderCurrentView();
  showToast('รวมบิลและออกใบแจ้งหนี้สำเร็จ', `รวบรวมค่าบริการ ${newInv.invoice_number} ให้น้อง ${getPetDisplayName(pet)} เรียบร้อยแล้ว`, 'success');
  return newInv;
}

// ============================================================================
// 12. PROGRAMMATIC SERVICE APIS (FOR CROSS-DOMAIN & AUTOMATION)
// ============================================================================

function createInvoiceFromChargeSources(petId, customerId, chargeSourceIds = []) {
  const charges = state.chargeSources.filter(cs => 
    chargeSourceIds.includes(cs.id) || 
    (chargeSourceIds.length === 0 && cs.pet_id === petId && cs.status === 'UNBILLED')
  );

  const items = charges.map((cs, idx) => ({
    id: idx + 1,
    source_domain: cs.source_domain,
    source_record_id: cs.source_record_id || cs.id,
    service_code: cs.item_code || `SRV-${cs.id}`,
    description_snapshot: cs.description,
    quantity: cs.quantity || 1,
    unit: 'รายการ',
    unit_price_snapshot: cs.unit_price || cs.line_total || cs.amount || 0,
    line_total: cs.line_total || cs.amount || 0
  }));

  const subtotal = items.reduce((sum, it) => sum + it.line_total, 0);
  const taxRate = 0.07;
  const taxTotal = Number((subtotal * taxRate).toFixed(2));
  const grandTotal = subtotal + taxTotal;

  const newId = state.invoices.length + 1;
  const newInv = {
    id: newId,
    invoice_number: `INV-20260302-${String(newId).padStart(3, '0')}`,
    customer_id: customerId,
    pet_id: petId,
    encounter_id: charges[0]?.encounter_id || null,
    surgery_schedule_id: null,
    dispense_id: null,
    diagnostic_order_id: null,
    invoice_date: '2026-03-02 12:45',
    due_date: '2026-03-02',
    payment_terms: 'DUE_ON_RECEIPT',
    subtotal: subtotal,
    discount_total: 0.00,
    tax_rate: taxRate,
    tax_total: taxTotal,
    grand_total: grandTotal,
    paid_amount: 0.00,
    outstanding_amount: grandTotal,
    status: 'UNPAID',
    created_by: 'น.ส. สุภาพร (แคชเชียร์)',
    items: items
  };

  charges.forEach(cs => {
    cs.status = 'BILLED';
    cs.invoice_id = newId;
  });

  if (Array.isArray(state.invoiceItems)) {
    items.forEach(it => {
      state.invoiceItems.push({
        ...it,
        id: state.invoiceItems.length + 1,
        invoice_id: newId
      });
    });
  }

  state.invoices.unshift(newInv);
  return newInv;
}

function createAdhocInvoice({ customer_id, pet_id, items = [] }) {
  const invoiceItems = items.map((it, idx) => ({
    id: idx + 1,
    source_domain: it.source_domain || 'RETAIL',
    source_record_id: it.source_record_id || (idx + 1),
    service_code: it.item_code || `SRV-${idx + 1}`,
    description_snapshot: it.description || it.description_snapshot || 'บริการทั่วไป',
    quantity: it.quantity || 1,
    unit: it.unit || 'รายการ',
    unit_price_snapshot: it.unit_price || it.unit_price_snapshot || 0,
    line_total: (it.quantity || 1) * (it.unit_price || it.unit_price_snapshot || 0)
  }));

  const subtotal = invoiceItems.reduce((sum, it) => sum + it.line_total, 0);
  const taxRate = items[0]?.tax_rate !== undefined ? items[0].tax_rate : 0.07;
  const taxTotal = Number((subtotal * taxRate).toFixed(2));
  const grandTotal = subtotal + taxTotal;

  const newId = state.invoices.length + 1;
  const newInv = {
    id: newId,
    invoice_number: `INV-20260302-${String(newId).padStart(3, '0')}`,
    customer_id,
    pet_id,
    encounter_id: null,
    surgery_schedule_id: null,
    dispense_id: null,
    diagnostic_order_id: null,
    invoice_date: '2026-03-02 12:45',
    due_date: '2026-03-02',
    payment_terms: 'DUE_ON_RECEIPT',
    subtotal: subtotal,
    discount_total: 0.00,
    tax_rate: taxRate,
    tax_total: taxTotal,
    grand_total: grandTotal,
    paid_amount: 0.00,
    outstanding_amount: grandTotal,
    status: 'UNPAID',
    created_by: 'น.ส. สุภาพร (แคชเชียร์)',
    items: invoiceItems
  };

  if (Array.isArray(state.invoiceItems)) {
    invoiceItems.forEach(it => {
      state.invoiceItems.push({
        ...it,
        id: state.invoiceItems.length + 1,
        invoice_id: newId
      });
    });
  }

  state.invoices.unshift(newInv);
  return newInv;
}

function processInvoicePayment({ invoice_id, amount, payment_method = 'CASH', tendered_amount, split_breakdown = [], transaction_ref }) {
  const inv = state.invoices.find(i => i.id === invoice_id);
  if (!inv) return null;

  const paidAmount = Number(amount || 0);
  const tendered = tendered_amount !== undefined ? Number(tendered_amount) : paidAmount;
  let change = 0;
  if (payment_method === 'CASH') {
    change = Math.max(0, tendered - paidAmount);
  } else if (payment_method === 'SPLIT' && split_breakdown.length > 0) {
    const cashPart = split_breakdown.find(b => b.method === 'CASH');
    if (cashPart) {
      change = cashPart.change !== undefined ? cashPart.change : Math.max(0, (cashPart.tendered || cashPart.amount) - cashPart.amount);
    }
  }

  const prevPaid = Number(inv.paid_amount || 0);
  const newTotalPaid = prevPaid + paidAmount;
  inv.paid_amount = newTotalPaid;
  inv.outstanding_amount = Math.max(0, inv.grand_total - newTotalPaid);

  if (inv.outstanding_amount <= 0.001) {
    inv.outstanding_amount = 0;
    inv.status = 'PAID';
  } else {
    inv.status = 'PARTIAL';
  }

  const newPayId = state.payments.length + 1;
  const payment = {
    id: newPayId,
    payment_number: `PAY-20260302-${String(newPayId).padStart(3, '0')}`,
    invoice_id: inv.id,
    customer_id: inv.customer_id,
    amount: paidAmount,
    payment_method: payment_method,
    split_breakdown: split_breakdown,
    tendered_amount: tendered,
    change_amount: change,
    transaction_ref: transaction_ref || `TXN-REF-${Math.floor(100000 + Math.random() * 900000)}`,
    deposit_deducted: 0,
    paid_at: '2026-03-02 12:45',
    received_by: 'น.ส. สุภาพร (แคชเชียร์)',
    status: 'SUCCESS'
  };
  state.payments.unshift(payment);

  state.paymentAllocations.push({
    id: state.paymentAllocations.length + 1,
    payment_id: payment.id,
    invoice_id: inv.id,
    allocated_amount: paidAmount,
    allocated_at: '2026-03-02 12:45'
  });

  const newRecId = state.receipts.length + 1;
  const receipt = {
    id: newRecId,
    receipt_number: `REC-20260302-${String(newRecId).padStart(3, '0')}`,
    invoice_id: inv.id,
    payment_id: payment.id,
    customer_id: inv.customer_id,
    pet_id: inv.pet_id,
    receipt_date: '2026-03-02 12:45',
    total_amount: paidAmount,
    tax_amount: Number((paidAmount * 7 / 107).toFixed(2)),
    issued_by: 'น.ส. สุภาพร (แคชเชียร์)',
    status: 'ACTIVE'
  };
  state.receipts.unshift(receipt);

  if (payment_method === 'CASH' && state.activeCashDrawer) {
    state.activeCashDrawer.current_cash = (state.activeCashDrawer.current_cash || state.activeCashDrawer.opening_float) + paidAmount;
  }

  if (inv.status === 'PAID') {
    const queueTicket = state.queues.find(q => q.pet_id === inv.pet_id);
    if (queueTicket) {
      queueTicket.stage = 'COMPLETED';
    }
  }

  return { payment, receipt, invoice: inv };
}

function createCustomerDeposit({ customer_id, pet_id = null, amount, payment_method = 'PROMPTPAY', notes = '' }) {
  const newId = state.customerDeposits.length + 1;
  const depAmount = Number(amount);
  const newDeposit = {
    id: newId,
    deposit_number: `DEP-20260302-${String(newId).padStart(2, '0')}`,
    customer_id: customer_id,
    pet_id: pet_id,
    original_amount: depAmount,
    used_amount: 0.00,
    remaining_amount: depAmount,
    payment_method: payment_method,
    received_at: '2026-03-02 12:50',
    received_by: 'น.ส. สุภาพร (แคชเชียร์)',
    notes: notes,
    status: 'ACTIVE'
  };
  state.customerDeposits.unshift(newDeposit);
  return newDeposit;
}

function applyDepositToInvoice(invoiceId, depositId, amount) {
  const inv = state.invoices.find(i => i.id === invoiceId);
  const deposit = state.customerDeposits.find(d => d.id === depositId);
  if (!inv || !deposit) return null;

  const deductAmount = Math.min(Number(amount), deposit.remaining_amount, inv.outstanding_amount);
  deposit.used_amount += deductAmount;
  deposit.remaining_amount -= deductAmount;
  if (deposit.remaining_amount <= 0) {
    deposit.status = 'FULLY_USED';
  }

  inv.paid_amount = (inv.paid_amount || 0) + deductAmount;
  inv.outstanding_amount = Math.max(0, inv.grand_total - inv.paid_amount);
  if (inv.outstanding_amount <= 0.001) {
    inv.outstanding_amount = 0;
    inv.status = 'PAID';
  } else {
    inv.status = 'PARTIAL';
  }

  const newAlloc = {
    id: state.depositAllocations.length + 1,
    deposit_id: deposit.id,
    invoice_id: inv.id,
    allocated_amount: deductAmount,
    allocated_at: '2026-03-02 12:45'
  };
  state.depositAllocations.push(newAlloc);

  if (inv.status === 'PAID') {
    const queueTicket = state.queues.find(q => q.pet_id === inv.pet_id);
    if (queueTicket) {
      queueTicket.stage = 'COMPLETED';
    }
  }

  return { deposit, invoice: inv, allocation: newAlloc };
}

function processRefund({ invoice_id, refund_amount, refund_reason = '', payment_method = 'PROMPTPAY', approved_by = 'Clinic Manager' }) {
  const inv = state.invoices.find(i => i.id === invoice_id);
  const newId = state.refunds.length + 1;
  const refAmount = Number(refund_amount);
  const newRefund = {
    id: newId,
    refund_number: `REF-20260302-${String(newId).padStart(3, '0')}`,
    payment_id: 1,
    invoice_id: invoice_id,
    customer_id: inv?.customer_id || 1,
    refund_amount: refAmount,
    refund_method: payment_method,
    refund_reason: refund_reason,
    refunded_at: '2026-03-02 12:55',
    approved_by: approved_by,
    status: 'COMPLETED'
  };
  state.refunds.unshift(newRefund);
  return newRefund;
}

function closeCashDrawerShift({ drawer_id = null, actual_cash_counted, notes = '', cashier_name = '' }) {
  const counted = Number(actual_cash_counted);
  const openingFloat = state.activeCashDrawer?.opening_float || 3000.00;
  const cashPayments = state.payments
    .filter(p => (p.paid_at || '').startsWith('2026-03-02') && p.status === 'SUCCESS')
    .reduce((sum, p) => {
      if (p.payment_method === 'CASH') return sum + (p.amount || 0);
      if (p.payment_method === 'SPLIT' && Array.isArray(p.split_breakdown)) {
        const c = p.split_breakdown.find(b => b.method === 'CASH');
        return sum + (c ? Number(c.amount || 0) : 0);
      }
      return sum;
    }, 0);
  const expected = openingFloat + cashPayments;
  const variance = counted - expected;

  const newId = state.dailyCashClosings.length + 1;
  const newClosing = {
    id: newId,
    closing_number: `CLS-20260302-${String(newId).padStart(2, '0')}`,
    shift_date: '2026-03-02',
    shift_name: state.activeCashDrawer?.shift_name || 'กะบ่าย (Afternoon Shift)',
    cashier_id: 3,
    cashier_name: cashier_name || state.activeCashDrawer?.cashier_name || 'น.ส. สุภาพร (แคชเชียร์)',
    opening_float: openingFloat,
    system_cash_sales: cashPayments,
    expected_cash: expected,
    actual_cash_counted: counted,
    variance_amount: variance,
    promptpay_total: state.payments.filter(p => p.payment_method === 'PROMPTPAY').reduce((s, p) => s + p.amount, 0),
    credit_card_total: state.payments.filter(p => p.payment_method === 'CREDIT_CARD').reduce((s, p) => s + p.amount, 0),
    total_shift_revenue: cashPayments + 1350.00,
    notes: notes,
    status: Math.abs(variance) > 0 ? 'VARIANCE_FLAGGED' : 'BALANCED',
    closed_at: '2026-03-02 13:00'
  };

  state.dailyCashClosings.unshift(newClosing);
  if (state.activeCashDrawer) {
    state.activeCashDrawer.isOpen = false;
  }
  return newClosing;
}
