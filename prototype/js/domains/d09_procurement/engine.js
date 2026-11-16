// =============================================================
// DOMAIN 09: PROCUREMENT & SUPPLIER MANAGEMENT ENGINE
// =============================================================

function setProcurementSubTab(tab) {
  state.activeProcurementSubTab = tab;
  renderCurrentView();
}

function renderProcurementActiveSubTab() {
  const container = document.getElementById('procurement-tab-content');
  if (!container) return;

  if (state.activeProcurementSubTab === 'orders') {
    renderProcurementOrdersTab(container);
  } else if (state.activeProcurementSubTab === 'requisitions') {
    renderProcurementRequisitionsTab(container);
  } else if (state.activeProcurementSubTab === 'receipts') {
    renderProcurementReceiptsTab(container);
  } else if (state.activeProcurementSubTab === 'suppliers') {
    renderProcurementSuppliersTab(container);
  }
}

// --- TAB 1: PURCHASE ORDERS & DELIVERY TRACKING ---
function renderProcurementOrdersTab(container) {
  const searchQuery = (document.getElementById('view-filter-search')?.value || '').toLowerCase().trim();
  const supplierFilter = document.getElementById('view-filter-procure-supplier')?.value || 'all';

  let orders = (state.purchaseOrders || []).filter(po => {
    const matchSearch = po.poNumber.toLowerCase().includes(searchQuery) ||
                        po.supplierName.toLowerCase().includes(searchQuery) ||
                        (po.items || []).some(i => (i.name || '').toLowerCase().includes(searchQuery) || (i.productCode || '').toLowerCase().includes(searchQuery));
    const matchSupplier = supplierFilter === 'all' || String(po.supplierId) === supplierFilter;
    return matchSearch && matchSupplier;
  });

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
        <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <i data-lucide="file-x-2" class="w-7 h-7"></i>
        </div>
        <h4 class="text-sm font-bold text-slate-800">ไม่พบรายการใบสั่งซื้อที่ตรงกับเงื่อนไข</h4>
        <p class="text-xs text-slate-500 mt-1">ลองเปลี่ยนคำค้นหา หรือคลิกปุ่ม "+ เปิดใบสั่งซื้อใหม่" เพื่อสร้างรายการ</p>
        <button onclick="openNewPurchaseOrderSheet()" class="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>+ เปิดใบสั่งซื้อใหม่ (PO)</span>
        </button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>แสดงใบสั่งซื้อทั้งหมด ${orders.length} ฉบับ</span>
        <span class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span> ตรวจรับครบถ้วน
          <span class="inline-block w-2 h-2 rounded-full bg-purple-500"></span> รับบางส่วน
          <span class="inline-block w-2 h-2 rounded-full bg-blue-500"></span> ส่งคู่ค้าแล้ว
          <span class="inline-block w-2 h-2 rounded-full bg-amber-500"></span> รออนุมัติ/อนุมัติแล้ว
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4">
        ${orders.map(po => {
          let statusBadge = '';
          if (po.status === 'COMPLETED') {
            statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"><i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>ตรวจรับครบถ้วน (Completed)</span>';
          } else if (po.status === 'PARTIAL_RECEIVED') {
            statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1"><i data-lucide="clock" class="w-3.5 h-3.5"></i>รับสินค้าบางส่วน (Partial)</span>';
          } else if (po.status === 'SENT') {
            statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1"><i data-lucide="send" class="w-3.5 h-3.5"></i>ส่งผู้จำหน่ายแล้ว (Sent)</span>';
          } else if (po.status === 'APPROVED') {
            statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1"><i data-lucide="check" class="w-3.5 h-3.5"></i>อนุมัติแล้ว (Approved)</span>';
          } else {
            statusBadge = '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"><i data-lucide="file-edit" class="w-3.5 h-3.5"></i>ร่างคำสั่งซื้อ (Draft)</span>';
          }

          return `
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition-all">
              <!-- Top Row -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
                    PO
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-bold text-slate-900 text-sm tracking-tight">${po.poNumber}</h4>
                      ${statusBadge}
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span class="font-semibold text-slate-700">${po.supplierName}</span>
                      <span>•</span>
                      <span>สั่งเมื่อ: ${po.orderedAt}</span>
                      <span>•</span>
                      <span class="text-blue-700 font-medium">กำหนดส่ง: ${po.expectedDelivery || '-'}</span>
                    </p>
                  </div>
                </div>

                <!-- Right Financial Pill -->
                <div class="text-right sm:self-center">
                  <span class="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">ยอดรวมสุทธิ (Inc. VAT)</span>
                  <span class="text-base font-extrabold text-blue-900">฿${(po.grandTotal || 0).toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  <span class="text-[10px] text-slate-400 block">${po.paymentTerms || 'Credit 30 วัน'}</span>
                </div>
              </div>

              <!-- Itemized Table Preview -->
              <div class="mt-3.5 overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead>
                    <tr class="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                      <th class="py-2 px-3 font-semibold">รหัสสินค้า & รายการเวชภัณฑ์</th>
                      <th class="py-2 px-3 font-semibold text-center">จำนวนสั่ง</th>
                      <th class="py-2 px-3 font-semibold text-center">ตรวจรับแล้ว</th>
                      <th class="py-2 px-3 font-semibold text-right">ราคา/หน่วย</th>
                      <th class="py-2 px-3 font-semibold text-right">ยอดรวม</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    ${(po.items || []).map(item => `
                      <tr class="hover:bg-slate-50/50">
                        <td class="py-2 px-3">
                          <span class="font-mono text-[11px] text-slate-400 block">${item.productCode}</span>
                          <span class="font-medium text-slate-800">${item.name}</span>
                        </td>
                        <td class="py-2 px-3 text-center font-bold text-slate-700">${item.orderedQty} ${item.unit || 'ชิ้น'}</td>
                        <td class="py-2 px-3 text-center">
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${item.receivedQty >= item.orderedQty ? 'bg-emerald-100 text-emerald-800' : (item.receivedQty > 0 ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-500')}">
                            ${item.receivedQty || 0} / ${item.orderedQty}
                          </span>
                        </td>
                        <td class="py-2 px-3 text-right font-mono text-slate-600">฿${(item.unitPrice || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                        <td class="py-2 px-3 text-right font-mono font-semibold text-slate-900">฿${(item.lineTotal || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Footer Actions -->
              <div class="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <p class="text-xs text-slate-500 italic flex items-center gap-1.5">
                  <i data-lucide="info" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
                  <span>${po.notes || 'จัดส่ง ณ แผนกคลังเวชภัณฑ์ชั้น 1'}</span>
                </p>

                <div class="flex items-center gap-2">
                  <button onclick="openPoDocumentModal(${po.id})" class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5">
                    <i data-lucide="printer" class="w-3.5 h-3.5 text-slate-500"></i>
                    <span>พิมพ์ / พรีวิว PO</span>
                  </button>

                  ${po.status === 'DRAFT' ? `
                    <button onclick="approvePurchaseOrder(${po.id})" class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs">
                      <i data-lucide="check" class="w-3.5 h-3.5"></i>
                      <span>อนุมัติสั่งซื้อ</span>
                    </button>
                  ` : ''}

                  ${po.status === 'APPROVED' ? `
                    <button onclick="sendPurchaseOrder(${po.id})" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs">
                      <i data-lucide="send" class="w-3.5 h-3.5"></i>
                      <span>ส่งใบสั่งซื้อคู่ค้า</span>
                    </button>
                  ` : ''}

                  ${(po.status === 'SENT' || po.status === 'PARTIAL_RECEIVED') ? `
                    <button onclick="openGoodsReceiptModal(${po.id})" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs">
                      <i data-lucide="package-check" class="w-3.5 h-3.5"></i>
                      <span>ตรวจรับสินค้าเข้าคลัง</span>
                    </button>
                  ` : ''}
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

// --- TAB 2: PURCHASE REQUISITIONS (PR) & RFQ COMPARISON ---
function renderProcurementRequisitionsTab(container) {
  const requisitions = state.purchaseRequisitions || [];

  container.innerHTML = `
    <div class="space-y-4">
      <!-- Top Automation Banner: Auto-PR from Low Stock -->
      <div class="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-bold shrink-0">
            <i data-lucide="zap" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900">ตรวจจับเวชภัณฑ์สต็อกต่ำกว่าเกณฑ์ควบคุม (Auto-PR Trigger)</h4>
            <p class="text-xs text-slate-600">ระบบสแกนคลังเวชภัณฑ์ (Domain 04) เพื่อรวบรวมรายการที่เหลือน้อยกว่า Reorder Point และสร้างคำขอซื้อให้อัตโนมัติในคลิกเดียว</p>
          </div>
        </div>
        <button onclick="autoGeneratePrFromLowStock()" class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-extrabold rounded-lg shadow-sm transition active:scale-95 cursor-pointer shrink-0">
          <i data-lucide="wand-2" class="w-4 h-4"></i>
          <span>⚡ สร้าง PR อัตโนมัติทันที</span>
        </button>
      </div>

      <!-- PR List Grid -->
      <div class="grid grid-cols-1 gap-4">
        ${requisitions.map(pr => {
          const isPending = pr.status === 'PENDING_APPROVAL';
          let urgencyBadge = '';
          if (pr.urgency === 'URGENT') {
            urgencyBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">🔴 ด่วนมาก (Urgent)</span>';
          } else if (pr.urgency === 'HIGH') {
            urgencyBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">🟡 ด่วน (High)</span>';
          } else {
            urgencyBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">🟢 ปกติ</span>';
          }

          return `
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
                    PR
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-bold text-slate-900 text-sm">${pr.requisitionNumber}</h4>
                      <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">${pr.department}</span>
                      ${urgencyBadge}
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5">ผู้ขอ: <span class="font-semibold text-slate-700">${pr.requestedBy}</span> • ขอเมื่อ: ${pr.requestedAt}</p>
                  </div>
                </div>

                <div>
                  ${pr.status === 'CONVERTED_TO_PO' ? `
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                      <i data-lucide="check-check" class="w-3.5 h-3.5"></i>
                      <span>แปลงเป็น PO แล้ว: ${pr.convertedPoNumber}</span>
                    </span>
                  ` : `
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                      <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                      <span>รอพิจารณาอนุมัติ (Pending)</span>
                    </span>
                  `}
                </div>
              </div>

              <div class="mt-3">
                <p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                  <span class="font-bold text-slate-700">เหตุผลความจำเป็น:</span> ${pr.reason}
                </p>

                <!-- Items requested -->
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs">
                    <thead>
                      <tr class="text-slate-400 border-b border-slate-100">
                        <th class="py-1.5 px-2 font-semibold">รายการเวชภัณฑ์</th>
                        <th class="py-1.5 px-2 font-semibold text-center">จำนวนที่ขอ</th>
                        <th class="py-1.5 px-2 font-semibold text-right">ราคาประมาณ/หน่วย</th>
                        <th class="py-1.5 px-2 font-semibold text-right">งบประมาณโดยประมาณ</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      ${(pr.items || []).map(i => `
                        <tr>
                          <td class="py-2 px-2">
                            <span class="font-mono text-[10px] text-slate-400 block">${i.productCode}</span>
                            <span class="font-medium text-slate-800">${i.name}</span>
                          </td>
                          <td class="py-2 px-2 text-center font-bold text-slate-700">${i.requestedQty} ${i.unit || 'ชิ้น'}</td>
                          <td class="py-2 px-2 text-right font-mono text-slate-600">฿${(i.estimatedPrice || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                          <td class="py-2 px-2 text-right font-mono font-bold text-slate-800">฿${((i.requestedQty || 0) * (i.estimatedPrice || 0)).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Actions -->
              ${isPending ? `
                <div class="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                  <button onclick="openRfqComparisonModal(${pr.id})" class="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-lg shadow-2xs transition active:scale-95 cursor-pointer flex items-center gap-1.5">
                    <i data-lucide="scale" class="w-4 h-4 text-amber-700"></i>
                    <span>🔍 เปรียบเทียบใบเสนอราคา (RFQ Matrix)</span>
                  </button>
                  <button onclick="convertRequisitionToPo(${pr.id})" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5">
                    <i data-lucide="file-plus-2" class="w-4 h-4"></i>
                    <span>อนุมัติและแปลงเป็นใบสั่งซื้อ (Convert to PO)</span>
                  </button>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  lucide.createIcons();
}

// --- TAB 3: GOODS RECEIPTS, 3-WAY MATCHING, CLAIMS & INVOICES ---
function renderProcurementReceiptsTab(container) {
  const matchings = state.threeWayMatchings || [];
  const receipts = state.goodsReceipts || [];
  const claims = state.supplierClaims || [];
  const invoices = state.supplierInvoices || [];

  container.innerHTML = `
    <div class="space-y-6">
      <!-- 1. 3-Way Matching Verification Panel -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <i data-lucide="shield-check" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">การตรวจสอบความสอดคล้องเอกสาร 3 ด้าน (3-Way Document Matching)</h4>
              <p class="text-xs text-slate-500">จับคู่ตรวจสอบ: ใบสั่งซื้อ (PO) ⟷ ใบรับสินค้าเข้าคลัง (Goods Receipt) ⟷ ใบแจ้งหนี้ผู้จำหน่าย (Supplier Invoice)</p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            ระบบควบคุมความเสี่ยงการจ่ายเงิน
          </span>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th class="py-2.5 px-3 font-semibold">เลขที่เอกสารอ้างอิง</th>
                <th class="py-2.5 px-3 font-semibold">ผู้จำหน่าย (Supplier)</th>
                <th class="py-2.5 px-3 font-semibold text-right">ยอดสั่งซื้อ (PO)</th>
                <th class="py-2.5 px-3 font-semibold text-right">ยอดรับจริง (GR)</th>
                <th class="py-2.5 px-3 font-semibold text-right">ยอดเรียกเก็บ (Inv)</th>
                <th class="py-2.5 px-3 font-semibold text-center">ผลต่าง (Variance)</th>
                <th class="py-2.5 px-3 font-semibold text-center">สถานะจับคู่</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${matchings.map(m => `
                <tr class="hover:bg-slate-50/60">
                  <td class="py-3 px-3">
                    <span class="font-bold text-blue-700 block">${m.poNumber}</span>
                    <span class="text-[11px] text-slate-500 font-mono block">GR: ${m.receiptNumber}</span>
                    <span class="text-[11px] text-slate-400 font-mono block">INV: ${m.invoiceNumber}</span>
                  </td>
                  <td class="py-3 px-3">
                    <span class="font-semibold text-slate-800 block">${m.supplierName}</span>
                    <span class="text-[10px] text-slate-400">ตรวจรับ: ${m.matchedAt} โดย ${m.verifiedBy}</span>
                  </td>
                  <td class="py-3 px-3 text-right font-mono font-medium text-slate-700">฿${(m.poAmount || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                  <td class="py-3 px-3 text-right font-mono font-medium text-slate-700">฿${(m.receivedAmount || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                  <td class="py-3 px-3 text-right font-mono font-medium text-slate-700">฿${(m.invoiceAmount || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                  <td class="py-3 px-3 text-center font-mono font-bold ${m.variance === 0 ? 'text-emerald-600' : 'text-rose-600'}">
                    ฿${(m.variance || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}
                  </td>
                  <td class="py-3 px-3 text-center">
                    ${m.status === 'MATCHED_100' ? `
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <i data-lucide="check" class="w-3 h-3"></i> 100% MATCHED
                      </span>
                    ` : `
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <i data-lucide="alert-triangle" class="w-3 h-3"></i> VARIANCE
                      </span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2. Supplier Claims & Returns (ข้อร้องเรียนและเคลมคืนสินค้า) -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <i data-lucide="shield-alert" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">การบริหารข้อร้องเรียนและการเคลมคืนสินค้าผู้จำหน่าย (Supplier Claims & Returns)</h4>
              <p class="text-xs text-slate-500">จัดการสินค้าชำรุด เสียหาย หรือไม่ตรงตามข้อกำหนดจากการตรวจรับ พร้อมติดตามการชดเชย (ใบลดหนี้ / เปลี่ยนสินค้า)</p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 self-start sm:self-auto">
            ${claims.length} รายการเคลม
          </span>
        </div>

        <div class="mt-4">
          ${claims.length === 0 ? `
            <p class="text-xs text-slate-400 italic text-center py-4">ไม่มีรายการเคลมสินค้าชำรุดในระบบ</p>
          ` : `
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <th class="py-2.5 px-3 font-semibold">เลขที่ใบเคลม</th>
                    <th class="py-2.5 px-3 font-semibold">ผู้จำหน่าย & รายการสินค้า</th>
                    <th class="py-2.5 px-3 font-semibold text-center">จำนวนที่เคลม</th>
                    <th class="py-2.5 px-3 font-semibold text-right">มูลค่าเคลม</th>
                    <th class="py-2.5 px-3 font-semibold">สาเหตุการเคลม</th>
                    <th class="py-2.5 px-3 font-semibold text-center">สถานะ</th>
                    <th class="py-2.5 px-3 font-semibold text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${claims.map(c => {
                    let statusBadge = '';
                    if (c.status === 'RESOLVED_REPLACEMENT') {
                      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ เปลี่ยนสินค้าใหม่แล้ว</span>';
                    } else if (c.status === 'RESOLVED_CREDIT_NOTE') {
                      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">💳 ได้รับใบลดหนี้แล้ว</span>';
                    } else {
                      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">⏳ รอผู้จำหน่ายชดเชย</span>';
                    }

                    return `
                      <tr class="hover:bg-slate-50/60">
                        <td class="py-3 px-3">
                          <span class="font-bold text-rose-700 block">${c.claimNumber}</span>
                          <span class="text-[10px] text-slate-400 font-mono">PO: ${c.poNumber}</span>
                          <span class="text-[10px] text-slate-400 font-mono block">GR: ${c.receiptNumber}</span>
                        </td>
                        <td class="py-3 px-3">
                          <span class="font-semibold text-slate-800 block">${c.productName}</span>
                          <span class="text-[11px] text-slate-500">${c.supplierName}</span>
                        </td>
                        <td class="py-3 px-3 text-center font-bold text-rose-700">${c.rejectedQty} ${c.unit || 'ชิ้น'}</td>
                        <td class="py-3 px-3 text-right font-mono font-bold text-slate-800">฿${(c.totalClaimAmount || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                        <td class="py-3 px-3">
                          <span class="text-slate-600 block max-w-xs truncate" title="${c.defectReason}">${c.defectReason}</span>
                          <span class="text-[10px] text-slate-400">บันทึกเมื่อ: ${c.createdAt}</span>
                        </td>
                        <td class="py-3 px-3 text-center">${statusBadge}</td>
                        <td class="py-3 px-3 text-right">
                          <div class="flex items-center justify-end gap-1.5">
                            <button onclick="openSupplierClaimModal(${c.id})" class="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer" title="ดูและพิมพ์เอกสารเคลม">
                              <i data-lucide="printer" class="w-3.5 h-3.5 text-slate-500"></i>
                            </button>
                            ${c.status === 'PENDING_SUPPLIER' ? `
                              <button onclick="resolveSupplierClaim(${c.id}, 'RESOLVED_REPLACEMENT')" class="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition cursor-pointer shadow-2xs">
                                รับของเปลี่ยน
                              </button>
                              <button onclick="resolveSupplierClaim(${c.id}, 'RESOLVED_CREDIT_NOTE')" class="px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition cursor-pointer shadow-2xs">
                                ใบลดหนี้
                              </button>
                            ` : ''}
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>

      <!-- 3. Formal Supplier Invoices Ledger -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">ทะเบียนใบแจ้งหนี้ผู้จำหน่าย (Supplier Invoices Ledger)</h4>
              <p class="text-xs text-slate-500">รายการใบแจ้งหนี้เพื่อเตรียมส่งข้อมูลให้ฝ่ายบัญชีและการเงิน (Finance & AP)</p>
            </div>
          </div>
          <span class="text-xs text-slate-500">ทั้งหมด ${invoices.length} ฉบับ</span>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th class="py-2.5 px-3 font-semibold">เลขที่ใบแจ้งหนี้</th>
                <th class="py-2.5 px-3 font-semibold">ผู้จำหน่าย</th>
                <th class="py-2.5 px-3 font-semibold">เอกสารอ้างอิง</th>
                <th class="py-2.5 px-3 font-semibold">วันที่เอกสาร / ครบกำหนด</th>
                <th class="py-2.5 px-3 font-semibold text-right">ยอดก่อนภาษี</th>
                <th class="py-2.5 px-3 font-semibold text-right">ยอดสุทธิ (Inc. VAT)</th>
                <th class="py-2.5 px-3 font-semibold text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${invoices.map(inv => `
                <tr class="hover:bg-slate-50/60">
                  <td class="py-3 px-3 font-bold font-mono text-indigo-700">${inv.invoiceNumber}</td>
                  <td class="py-3 px-3 font-medium text-slate-800">${inv.supplierName}</td>
                  <td class="py-3 px-3 text-[11px] font-mono text-slate-500">
                    <span>${inv.poNumber}</span> / <span>${inv.receiptNumber}</span>
                  </td>
                  <td class="py-3 px-3 text-slate-600">
                    <span>${inv.invoiceDate}</span>
                    <span class="text-[10px] text-slate-400 block">ครบชำระ: ${inv.dueDate}</span>
                  </td>
                  <td class="py-3 px-3 text-right font-mono text-slate-700">฿${(inv.subtotal || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                  <td class="py-3 px-3 text-right font-mono font-bold text-slate-900">฿${(inv.grandTotal || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                  <td class="py-3 px-3 text-center">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ ${inv.status || 'MATCHED'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4. Goods Receipts Intake History -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <i data-lucide="boxes" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">ประวัติการตรวจรับสินค้าเข้าคลังเวชภัณฑ์ (Goods Receipts & Lots History)</h4>
              <p class="text-xs text-slate-500">บันทึกประวัติการรับเข้า พร้อมสร้างล็อตยาและปรับยอดคงเหลือไปยังคลังเวชภัณฑ์ (Domain 04) ทันที</p>
            </div>
          </div>
        </div>

        <div class="mt-4 space-y-3">
          ${receipts.map(gr => `
            <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/40 hover:bg-slate-50 transition">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/70">
                <div>
                  <span class="font-bold text-xs text-slate-900">${gr.receiptNumber}</span>
                  <span class="text-xs text-slate-500 ml-2">อ้างอิงใบสั่งซื้อ: <strong class="text-blue-700">${gr.poNumber}</strong></span>
                  <span class="text-xs text-slate-400 ml-2">• ${gr.receivedAt}</span>
                </div>
                <div class="text-xs text-slate-600">
                  ผู้ตรวจรับ: <span class="font-semibold text-slate-800">${gr.receivedBy}</span>
                </div>
              </div>

              <div class="mt-2.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                ${(gr.items || []).map(item => `
                  <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <span class="text-[10px] font-mono text-slate-400 block">${item.productCode}</span>
                    <h5 class="text-xs font-bold text-slate-800">${item.name}</h5>
                    <div class="mt-1.5 flex items-center justify-between text-[11px]">
                      <span class="text-slate-500">รับเข้า: <strong class="text-emerald-700 font-bold">${item.receivedQty} ชิ้น</strong></span>
                      <span class="text-slate-500">ชำรุด: <strong class="${item.rejectedQty > 0 ? 'text-rose-600 font-bold' : ''}">${item.rejectedQty || 0}</strong></span>
                    </div>
                    <div class="mt-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded flex items-center justify-between">
                      <span>Lot: <strong class="font-mono text-slate-700">${item.lotNumber}</strong></span>
                      <span>Exp: <strong class="text-slate-700">${item.expiryDate}</strong></span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// --- TAB 4: SUPPLIERS MASTER & CATALOG ---
function renderProcurementSuppliersTab(container) {
  const searchQuery = (document.getElementById('view-filter-search')?.value || '').toLowerCase().trim();
  const suppliers = (state.suppliers || []).filter(s => {
    return (s.name || '').toLowerCase().includes(searchQuery) ||
           (s.code || '').toLowerCase().includes(searchQuery) ||
           (s.type || '').toLowerCase().includes(searchQuery) ||
           (s.contactName || '').toLowerCase().includes(searchQuery);
  });

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <span class="text-xs text-slate-500 font-medium">คู่ค้าและผู้จำหน่ายเวชภัณฑ์ทั้งหมด ${suppliers.length} ราย</span>
        <button onclick="openNewSupplierModal()" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i> + เพิ่มคู่ค้าใหม่
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${suppliers.map(sup => {
          const docs = (state.supplierDocuments || []).filter(d => d.supplierId === sup.id);

          return `
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-indigo-300 transition-all">
              <!-- Header -->
              <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-200">
                    ${sup.code.replace('SUP-', '')}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-bold text-slate-900 text-sm">${sup.name}</h4>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5">${sup.type}</p>
                  </div>
                </div>

                <!-- Rating Badge -->
                <div class="text-right">
                  <span class="px-2.5 py-1 rounded-full text-xs font-extrabold ${sup.rating === 'A' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}">
                    Grade ${sup.rating || 'A'}
                  </span>
                  <span class="text-[10px] text-slate-500 block mt-1">คะแนนรวม ${sup.score || 95}/100</span>
                </div>
              </div>

              <!-- Info Grid -->
              <div class="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                <div class="bg-slate-50 p-2 rounded-lg">
                  <span class="text-[10px] text-slate-400 block">เลขประจำตัวผู้เสียภาษี</span>
                  <span class="font-mono text-slate-700 font-medium">${sup.taxId || '-'}</span>
                </div>
                <div class="bg-slate-50 p-2 rounded-lg">
                  <span class="text-[10px] text-slate-400 block">เงื่อนไขการชำระเงิน</span>
                  <span class="font-semibold text-slate-800">${sup.paymentTerms}</span>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="mt-3 text-xs text-slate-600 space-y-1">
                <p class="flex items-center gap-2">
                  <i data-lucide="user" class="w-3.5 h-3.5 text-slate-400"></i>
                  <span>${sup.contactName || '-'}</span>
                </p>
                <p class="flex items-center gap-2">
                  <i data-lucide="phone" class="w-3.5 h-3.5 text-slate-400"></i>
                  <span class="font-mono">${sup.phone || '-'}</span>
                  <span class="text-slate-300">|</span>
                  <i data-lucide="mail" class="w-3.5 h-3.5 text-slate-400"></i>
                  <span>${sup.email || '-'}</span>
                </p>
              </div>

              <!-- Documents & Certifications -->
              ${docs.length > 0 ? `
                <div class="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                  <span class="text-[10px] text-slate-400 font-semibold mr-1">ใบรับรอง & สัญญา:</span>
                  ${docs.map(d => `
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                      <i data-lucide="award" class="w-3 h-3"></i>
                      <span>${d.documentType.replace('_', ' ')}</span>
                    </span>
                  `).join('')}
                </div>
              ` : ''}

              <!-- Products Supplied Catalog -->
              <div class="mt-3.5 pt-3 border-t border-slate-100">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">เวชภัณฑ์ในสัญญาจัดซื้อ</span>
                <div class="flex flex-wrap gap-1.5">
                  ${(sup.productsSupplied || []).map(code => {
                    const prod = (state.products || []).find(p => p.product_code === code);
                    const name = prod ? prod.product_name.split(' (')[0] : code;
                    return `<span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">${code}: ${name}</span>`;
                  }).join('')}
                </div>
              </div>

              <!-- Bottom Action -->
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <i data-lucide="truck" class="w-3.5 h-3.5"></i>
                  <span>ส่งตรงเวลา ${sup.onTimeRate || 95}%</span>
                </span>
                <button onclick="openNewPurchaseOrderSheet(null, ${sup.id})" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs">
                  <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
                  <span>สั่งซื้อกับรายนี้</span>
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

// --- AUTOMATION: AUTO-PR FROM LOW STOCK ---
function autoGeneratePrFromLowStock() {
  const lowStockItems = [];
  (state.products || []).forEach(p => {
    let totalAvail = 0;
    if (state.stockBalances) {
      totalAvail = state.stockBalances
        .filter(b => b.product_id === p.id)
        .reduce((sum, b) => sum + (b.quantity_available || 0), 0);
    } else if (p.stock !== undefined) {
      totalAvail = p.stock;
    }

    const minStock = p.minimum_stock || 30;

    if (totalAvail <= minStock || p.product_code === 'MED-ENR-050' || p.product_code === 'MED-NSS-1000') {
      const orderQty = Math.max(minStock * 2 - totalAvail, 15);
      lowStockItems.push({
        productId: p.id,
        productCode: p.product_code,
        name: p.product_name,
        requestedQty: orderQty,
        unit: p.base_unit || 'กล่อง',
        estimatedPrice: p.unit_cost || 100
      });
    }
  });

  if (lowStockItems.length === 0) {
    lowStockItems.push(
      { productId: 2, productCode: 'MED-ENR-050', name: 'Enrofloxacin 50mg (Baytril)', requestedQty: 20, unit: 'กล่อง', estimatedPrice: 280 },
      { productId: 7, productCode: 'MED-NSS-1000', name: '0.9% Normal Saline 1,000 ml', requestedQty: 40, unit: 'ขวด', estimatedPrice: 42 }
    );
  }

  const nextNum = (state.purchaseRequisitions || []).length + 1;
  const prCode = `PR-202603-00${nextNum}`;

  const newPr = {
    id: nextNum,
    requisitionNumber: prCode,
    department: 'Pharmacy (คลังและห้องยา)',
    requestedBy: 'ระบบตรวจจับสต็อกอัตโนมัติ (Auto-Inventory Bot)',
    requestedAt: '2026-03-02 12:30',
    urgency: 'HIGH',
    reason: 'ตรวจพบยอดคงเหลือลดลงต่ำกว่าเกณฑ์ควบคุมความปลอดภัย (Reorder Point Triggered)',
    status: 'PENDING_APPROVAL',
    convertedPoNumber: null,
    items: lowStockItems.slice(0, 4)
  };

  state.purchaseRequisitions.unshift(newPr);
  state.activeProcurementSubTab = 'requisitions';
  renderCurrentView();
  showToast('สร้างคำขอซื้ออัตโนมัติสำเร็จ!', `สร้างใบคำขอ ${prCode} จากสต็อกยาต่ำกว่าเกณฑ์เรียบร้อยแล้ว`, 'success');
}

// --- CONVERT PR TO PO ---
function convertRequisitionToPo(prId) {
  const pr = (state.purchaseRequisitions || []).find(r => r.id === Number(prId));
  if (!pr) return;

  const nextPoId = (state.purchaseOrders || []).length + 1;
  const poNum = `PO-202603-00${nextPoId}`;

  // Pick suitable supplier based on products
  let supplier = state.suppliers[0];
  if (pr.items.some(i => (i.productCode || '').includes('NSS') || (i.productCode || '').includes('IVC') || (i.productCode || '').includes('NYL'))) {
    supplier = state.suppliers.find(s => s.code === 'SUP-005') || supplier;
  } else if (pr.items.some(i => (i.productCode || '').includes('ENR'))) {
    supplier = state.suppliers.find(s => s.code === 'SUP-002') || supplier;
  }

  let subtotal = 0;
  const poItems = pr.items.map(item => {
    const lineTotal = (item.requestedQty || 1) * (item.estimatedPrice || 100);
    subtotal += lineTotal;
    return {
      productId: item.productId,
      productCode: item.productCode,
      name: item.name,
      orderedQty: item.requestedQty,
      receivedQty: 0,
      unitPrice: item.estimatedPrice || 100,
      lineTotal: lineTotal,
      unit: item.unit || 'ชิ้น'
    };
  });

  const taxRate = 0.07;
  const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
  const grandTotal = subtotal + taxAmount;

  const newPo = {
    id: nextPoId,
    poNumber: poNum,
    supplierId: supplier.id,
    supplierName: supplier.name,
    orderedAt: '2026-03-02 12:45',
    expectedDelivery: '2026-03-05',
    status: 'APPROVED',
    paymentTerms: supplier.paymentTerms || 'Credit 30 วัน',
    subtotal: subtotal,
    taxRate: taxRate,
    taxAmount: taxAmount,
    grandTotal: grandTotal,
    notes: `สร้างอัตโนมัติจากคำขอซื้อ ${pr.requisitionNumber}`,
    items: poItems
  };

  pr.status = 'CONVERTED_TO_PO';
  pr.convertedPoNumber = poNum;

  state.purchaseOrders.unshift(newPo);
  state.activeProcurementSubTab = 'orders';
  renderCurrentView();
  showToast('แปลงคำขอเป็น PO สำเร็จ!', `สร้างใบสั่งซื้อ ${poNum} ให้กับ ${supplier.name} เรียบร้อยแล้ว`, 'success');
}

// --- RFQ / QUOTATION COMPARISON MODAL ---
function openRfqComparisonModal(prId) {
  const pr = (state.purchaseRequisitions || []).find(r => r.id === Number(prId));
  if (!pr) return;

  const body = document.getElementById('rfq-comparison-modal-body');
  if (!body) return;

  let quotes = (state.rfqQuotations || []).filter(q => q.requisitionId === pr.id);

  // If no predefined quotes for this PR, synthesize dynamic comparison quotes based on real suppliers
  if (quotes.length === 0) {
    const supList = (state.suppliers || []).slice(0, 2);
    quotes = supList.map((sup, idx) => {
      const priceMultiplier = idx === 0 ? 1.0 : 1.06;
      let qSubtotal = 0;
      const qItems = pr.items.map(it => {
        const uPrice = Math.round((it.estimatedPrice || 100) * priceMultiplier);
        const lTotal = (it.requestedQty || 1) * uPrice;
        qSubtotal += lTotal;
        return {
          productCode: it.productCode,
          name: it.name,
          qty: it.requestedQty,
          unitPrice: uPrice,
          lineTotal: lTotal
        };
      });
      const qVat = Math.round(qSubtotal * 0.07 * 100) / 100;
      return {
        id: (state.rfqQuotations || []).length + idx + 1,
        requisitionId: pr.id,
        prNumber: pr.requisitionNumber,
        supplierId: sup.id,
        supplierCode: sup.code,
        supplierName: sup.name,
        quotationNumber: `QT-${sup.code.replace('SUP-', '')}-2026-${Math.floor(100 + Math.random() * 900)}`,
        rating: sup.rating || 'A',
        onTimeRate: sup.onTimeRate || 95,
        paymentTerms: sup.paymentTerms || 'Credit 30 วัน',
        leadTimeDays: idx === 0 ? 2 : 4,
        isRecommended: idx === 0,
        items: qItems,
        subtotal: qSubtotal,
        vat: qVat,
        grandTotal: qSubtotal + qVat
      };
    });
  }

  body.innerHTML = `
    <!-- PR Context Banner -->
    <div class="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
      <div>
        <span class="font-bold text-amber-900">คำขอซื้ออ้างอิง: ${pr.requisitionNumber}</span>
        <span class="text-amber-700 ml-2">แผนก: ${pr.department} • ผู้ขอ: ${pr.requestedBy}</span>
      </div>
      <span class="text-slate-600 italic">เปรียบเทียบข้อเสนอจากผู้จำหน่าย ${quotes.length} ราย</span>
    </div>

    <!-- Comparison Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      ${quotes.map(q => `
        <div class="border ${q.isRecommended ? 'border-amber-400 bg-amber-50/20 ring-2 ring-amber-300/40' : 'border-slate-200 bg-white'} rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div class="flex items-center gap-2">
                  <h5 class="text-xs font-bold text-slate-900">${q.supplierName}</h5>
                  ${q.isRecommended ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-900">⭐ คุ้มค่าที่สุด</span>' : ''}
                </div>
                <p class="text-[11px] font-mono text-slate-400 mt-0.5">ใบเสนอราคา: ${q.quotationNumber}</p>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Grade ${q.rating} (${q.onTimeRate}%)
              </span>
            </div>

            <!-- Key Terms Matrix -->
            <div class="grid grid-cols-2 gap-2 my-3 text-[11px]">
              <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 block">ระยะเวลาส่งมอบ</span>
                <span class="font-bold text-slate-800">ภายใน ${q.leadTimeDays} วันทำการ</span>
              </div>
              <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 block">เครดิตเทอม</span>
                <span class="font-bold text-slate-800">${q.paymentTerms}</span>
              </div>
            </div>

            <!-- Items Table Breakdown -->
            <div class="border border-slate-100 rounded-lg overflow-hidden my-3">
              <table class="w-full text-left text-[11px]">
                <thead class="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th class="py-1 px-2 font-semibold">รายการ</th>
                    <th class="py-1 px-2 text-center">จน.</th>
                    <th class="py-1 px-2 text-right">ราคา/หน่วย</th>
                    <th class="py-1 px-2 text-right">รวม</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${(q.items || []).map(it => `
                    <tr>
                      <td class="py-1.5 px-2">
                        <span class="font-mono text-[9px] text-slate-400 block">${it.productCode}</span>
                        <span class="font-medium text-slate-800">${it.name}</span>
                      </td>
                      <td class="py-1.5 px-2 text-center text-slate-600">${it.qty}</td>
                      <td class="py-1.5 px-2 text-right font-mono text-slate-700">฿${(it.unitPrice || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                      <td class="py-1.5 px-2 text-right font-mono font-bold text-slate-900">฿${(it.lineTotal || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Total Box -->
            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
              <div class="flex justify-between text-slate-500 text-[11px]">
                <span>มูลค่าก่อนภาษี:</span>
                <span class="font-mono">฿${(q.subtotal || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div class="flex justify-between text-slate-500 text-[11px]">
                <span>ภาษีมูลค่าเพิ่ม 7%:</span>
                <span class="font-mono">฿${(q.vat || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div class="flex justify-between font-extrabold text-blue-900 text-sm pt-1 border-t border-slate-200">
                <span>ยอดสุทธิรวม:</span>
                <span class="font-mono">฿${(q.grandTotal || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Select Button -->
          <button onclick="selectRfqQuoteAndCreatePo(${q.id}, ${pr.id})" class="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5">
            <i data-lucide="check-circle-2" class="w-4 h-4"></i>
            <span>เลือกผู้จำหน่ายรายนี้และออก PO ทันที</span>
          </button>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('modal-rfq-comparison')?.classList.remove('hidden');
  lucide.createIcons();
}

function closeRfqComparisonModal() {
  document.getElementById('modal-rfq-comparison')?.classList.add('hidden');
}

function selectRfqQuoteAndCreatePo(quoteId, prId) {
  const pr = (state.purchaseRequisitions || []).find(r => r.id === Number(prId));
  if (!pr) return;

  let quote = (state.rfqQuotations || []).find(q => q.id === Number(quoteId));
  if (!quote) {
    quote = {
      supplierId: 5,
      supplierName: 'บริษัท บี. บราวน์ (ประเทศไทย) จำกัด (B. Braun)',
      grandTotal: 3905.50,
      subtotal: 3650.00,
      vat: 255.50,
      paymentTerms: 'Credit 30 วัน',
      items: pr.items.map(it => ({
        productCode: it.productCode,
        name: it.name,
        qty: it.requestedQty,
        unitPrice: it.estimatedPrice || 100,
        lineTotal: (it.requestedQty || 1) * (it.estimatedPrice || 100)
      }))
    };
  }

  const nextPoId = (state.purchaseOrders || []).length + 1;
  const poNum = `PO-202603-00${nextPoId}`;

  const poItems = (quote.items || []).map(it => {
    const orig = pr.items.find(pi => pi.productCode === it.productCode) || {};
    return {
      productId: orig.productId || 1,
      productCode: it.productCode,
      name: it.name,
      orderedQty: it.qty,
      receivedQty: 0,
      unitPrice: it.unitPrice,
      lineTotal: it.lineTotal,
      unit: orig.unit || 'ชิ้น'
    };
  });

  const newPo = {
    id: nextPoId,
    poNumber: poNum,
    supplierId: quote.supplierId,
    supplierName: quote.supplierName,
    orderedAt: '2026-03-02 12:45',
    expectedDelivery: '2026-03-05',
    status: 'APPROVED',
    paymentTerms: quote.paymentTerms || 'Credit 30 วัน',
    subtotal: quote.subtotal,
    taxRate: 0.07,
    taxAmount: quote.vat,
    grandTotal: quote.grandTotal,
    notes: `อนุมัติสั่งซื้อตามใบเสนอราคา ${quote.quotationNumber || 'RFQ-SELECT'} (อ้างอิง ${pr.requisitionNumber})`,
    items: poItems
  };

  pr.status = 'CONVERTED_TO_PO';
  pr.convertedPoNumber = poNum;

  state.purchaseOrders.unshift(newPo);
  closeRfqComparisonModal();
  state.activeProcurementSubTab = 'orders';
  renderCurrentView();
  showToast('คัดเลือกผู้จำหน่ายและออก PO สำเร็จ!', `สร้างใบสั่งซื้อ ${poNum} ให้กับ ${quote.supplierName} เรียบร้อยแล้ว`, 'success');
}

// --- APPROVE & SEND PO ACTIONS ---
function approvePurchaseOrder(poId) {
  const po = (state.purchaseOrders || []).find(p => p.id === Number(poId));
  if (!po) return;
  po.status = 'APPROVED';
  renderCurrentView();
  showToast('อนุมัติใบสั่งซื้อเรียบร้อย', `ใบสั่งซื้อ ${po.poNumber} พร้อมสำหรับการส่งมอบให้บริษัทคู่ค้า`, 'success');
}

function sendPurchaseOrder(poId) {
  const po = (state.purchaseOrders || []).find(p => p.id === Number(poId));
  if (!po) return;
  po.status = 'SENT';
  renderCurrentView();
  showToast('ส่งใบสั่งซื้อสำเร็จ', `ส่งเอกสาร ${po.poNumber} ให้แก่ผู้แทนฝ่ายขาย ${po.supplierName} ทางอีเมลแล้ว`, 'success');
}

// --- PRINTABLE PO MODAL VIEWER ---
function openPoDocumentModal(poId) {
  const po = (state.purchaseOrders || []).find(p => p.id === Number(poId)) || state.purchaseOrders[0];
  if (!po) return;
  state.activePoDocumentId = po.id;

  const supplier = (state.suppliers || []).find(s => s.id === po.supplierId) || {
    name: po.supplierName,
    taxId: '0105556012345',
    address: 'กรุงเทพมหานคร',
    phone: '02-000-0000',
    email: 'sales@partner.com'
  };

  const paper = document.getElementById('po-document-paper');
  if (paper) {
    paper.innerHTML = `
      <div class="bg-white border border-slate-300 shadow-md rounded-xl p-8 max-w-3xl w-full text-slate-800 font-sans text-xs print:border-none print:shadow-none print:p-0">
        <!-- Header Letterhead -->
        <div class="flex items-start justify-between pb-6 border-b-2 border-slate-900">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xl">
              V+
            </div>
            <div>
              <h2 class="text-base font-black text-slate-900 tracking-tight">VETCARE+ ANIMAL HOSPITAL</h2>
              <p class="text-[11px] text-slate-500 font-semibold">โรงพยาบาลและคลินิกเวชกรรมสัตว์เลี้ยงเว็ทแคร์ พลัส</p>
              <p class="text-[10px] text-slate-400 mt-0.5">71/4 ถนนสุขุมวิท 71 พระโขนงเหนือ วัฒนา กรุงเทพฯ 10110</p>
              <p class="text-[10px] text-slate-400">เลขประจำตัวผู้เสียภาษี: 0-1055-63012-34-5 (สำนักงานใหญ่)</p>
            </div>
          </div>

          <div class="text-right">
            <span class="inline-block px-3 py-1 bg-slate-900 text-white font-black text-sm tracking-widest rounded uppercase">PURCHASE ORDER</span>
            <h3 class="text-base font-mono font-bold text-blue-900 mt-1">${po.poNumber}</h3>
            <p class="text-[11px] text-slate-500">วันที่สั่งซื้อ: <strong>${po.orderedAt}</strong></p>
            <p class="text-[11px] text-slate-500">กำหนดส่งมอบ: <strong class="text-blue-700">${po.expectedDelivery || '-'}</strong></p>
          </div>
        </div>

        <!-- Supplier & Destination Info Box -->
        <div class="grid grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">ผู้จำหน่าย / คู่ค้า (VENDOR)</span>
            <h4 class="font-bold text-slate-900 text-xs">${supplier.name}</h4>
            <p class="text-slate-600 mt-0.5">${supplier.address || '-'}</p>
            <p class="text-slate-600 font-mono mt-0.5">เลขประจำตัวผู้เสียภาษี: ${supplier.taxId || '-'}</p>
            <p class="text-slate-600 mt-0.5">โทร: ${supplier.phone || '-'} | อีเมล: ${supplier.email || '-'}</p>
          </div>

          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">สถานที่จัดส่งและเงื่อนไข (DELIVERY & TERMS)</span>
            <h4 class="font-bold text-slate-900 text-xs">แผนกคลังเวชภัณฑ์กลาง (Main Warehouse ชั้น 1)</h4>
            <p class="text-slate-600 mt-0.5">คลินิกเว็ทแคร์ พลัส สาขาสุขุมวิท 71</p>
            <p class="text-slate-700 font-semibold mt-1">เงื่อนไขการชำระเงิน: <span class="text-blue-800">${po.paymentTerms || 'Credit 30 วัน'}</span></p>
            <p class="text-slate-500 text-[11px] mt-0.5">หมายเหตุ: ${po.notes || '-'}</p>
          </div>
        </div>

        <!-- Items Table -->
        <div class="overflow-hidden border border-slate-200 rounded-lg">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <th class="py-2.5 px-3 w-10 text-center">#</th>
                <th class="py-2.5 px-3">รหัสสินค้า / รายละเอียดเวชภัณฑ์</th>
                <th class="py-2.5 px-3 text-center">จำนวน</th>
                <th class="py-2.5 px-3 text-center">หน่วย</th>
                <th class="py-2.5 px-3 text-right">ราคา/หน่วย</th>
                <th class="py-2.5 px-3 text-right">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              ${(po.items || []).map((it, idx) => `
                <tr>
                  <td class="py-2.5 px-3 text-center font-mono text-slate-400">${idx + 1}</td>
                  <td class="py-2.5 px-3">
                    <span class="font-mono text-[10px] text-slate-400 block">${it.productCode}</span>
                    <strong class="text-slate-900 font-semibold">${it.name}</strong>
                  </td>
                  <td class="py-2.5 px-3 text-center font-bold text-slate-800">${it.orderedQty}</td>
                  <td class="py-2.5 px-3 text-center text-slate-600">${it.unit || 'ชิ้น'}</td>
                  <td class="py-2.5 px-3 text-right font-mono text-slate-700">฿${(it.unitPrice || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                  <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">฿${(it.lineTotal || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Financial Calculation Summary -->
        <div class="flex justify-end mt-4">
          <div class="w-64 space-y-1.5 text-xs">
            <div class="flex justify-between text-slate-600">
              <span>มูลค่ารวมก่อนภาษี (Subtotal):</span>
              <span class="font-mono font-semibold">฿${(po.subtotal || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
              <span class="font-mono font-semibold">฿${(po.taxAmount || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="flex justify-between text-base font-extrabold text-blue-900 pt-2 border-t-2 border-slate-900">
              <span>ยอดสุทธิ (Grand Total):</span>
              <span class="font-mono">฿${(po.grandTotal || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>

        <!-- Signatures Section -->
        <div class="grid grid-cols-2 gap-12 mt-12 pt-8 border-t border-slate-200 text-center">
          <div>
            <div class="h-14 border-b border-dashed border-slate-300 flex items-end justify-center pb-2">
              <span class="font-serif italic text-teal-700 font-bold text-sm">ภก. อานนท์ เวชสิทธิ์</span>
            </div>
            <p class="font-bold text-slate-800 text-xs mt-2">ผู้จัดทำคำสั่งซื้อ (Purchasing Officer)</p>
            <p class="text-[10px] text-slate-400">วันที่: 02 มีนาคม 2026</p>
          </div>

          <div>
            <div class="h-14 border-b border-dashed border-slate-300 flex items-end justify-center pb-2">
              <span class="font-serif italic text-blue-800 font-bold text-sm">น.สพ. วุฒิชัย เจริญสุข</span>
            </div>
            <p class="font-bold text-slate-800 text-xs mt-2">ผู้อนุมัติสั่งซื้อ (Authorized Director)</p>
            <p class="text-[10px] text-slate-400">วันที่: 02 มีนาคม 2026</p>
          </div>
        </div>
      </div>
    `;
  }

  document.getElementById('modal-po-viewer')?.classList.remove('hidden');
  lucide.createIcons();
}

function closePoDocumentModal() {
  document.getElementById('modal-po-viewer')?.classList.add('hidden');
}

function printPoDocument() {
  showToast('กำลังเตรียมพิมพ์เอกสาร', 'ส่งเอกสารใบสั่งซื้อไปยังเครื่องพิมพ์เรียบร้อยแล้ว', 'info');
  window.print();
}

// --- GOODS RECEIPT INTAKE MODAL ---
function openGoodsReceiptModal(poId) {
  const po = (state.purchaseOrders || []).find(p => p.id === Number(poId));
  if (!po) return;

  const body = document.getElementById('goods-receipt-modal-body');
  if (!body) return;

  body.innerHTML = `
    <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
      <div>
        <span class="font-bold text-blue-900">ตรวจรับตามใบสั่งซื้อ: ${po.poNumber}</span>
        <span class="text-blue-700 ml-2">• ผู้จำหน่าย: ${po.supplierName}</span>
      </div>
      <span class="font-semibold text-blue-800">คลังปลายทาง: คลังเวชภัณฑ์หลัก</span>
    </div>

    <div class="space-y-4 pt-2">
      ${(po.items || []).map((item, idx) => {
        const remaining = item.orderedQty - (item.receivedQty || 0);
        return `
          <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <div>
                <span class="font-mono text-[10px] text-slate-400">${item.productCode}</span>
                <h5 class="text-xs font-bold text-slate-800">${item.name}</h5>
              </div>
              <div class="text-right text-xs">
                <span class="text-slate-500">สั่งซื้อ: <strong>${item.orderedQty}</strong> | รับแล้ว: <strong>${item.receivedQty || 0}</strong></span>
                <span class="text-blue-700 font-bold block">ค้างรับ: ${remaining} ${item.unit || 'ชิ้น'}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">จำนวนที่รับเข้า *</label>
                <input type="number" id="gr-qty-${idx}" min="0" max="${remaining}" value="${remaining}" class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none focus:border-emerald-500 text-center">
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">จำนวนชำรุด/ปฏิเสธ</label>
                <input type="number" id="gr-reject-${idx}" min="0" value="0" class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-rose-500 text-center">
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">เลขล็อต (Lot No.) *</label>
                <input type="text" id="gr-lot-${idx}" value="LOT-${item.productCode}-2026C" class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-slate-800 focus:outline-none focus:border-emerald-500">
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">วันหมดอายุ (FEFO) *</label>
                <input type="date" id="gr-exp-${idx}" value="2028-03-31" class="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 font-mono text-[11px] text-slate-800 focus:outline-none focus:border-emerald-500">
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  const confirmBtn = document.getElementById('btn-confirm-goods-receipt');
  if (confirmBtn) {
    confirmBtn.onclick = () => submitGoodsReceipt(po.id);
  }

  document.getElementById('modal-goods-receipt')?.classList.remove('hidden');
  lucide.createIcons();
}

function closeGoodsReceiptModal() {
  document.getElementById('modal-goods-receipt')?.classList.add('hidden');
}

// --- SUBMIT GOODS RECEIPT, SEAMLESS DOMAIN 04 INVENTORY INTEGRATION & AUTO-CLAIM ON DEFECT ---
function submitGoodsReceipt(poId) {
  const po = (state.purchaseOrders || []).find(p => p.id === Number(poId));
  if (!po) return;

  const nextGrNum = (state.goodsReceipts || []).length + 1;
  const grCode = `GR-202603-00${nextGrNum}`;
  const receivedItemsList = [];
  let allCompleted = true;
  let totalReceivedValue = 0;
  let hasDefectClaim = false;

  (po.items || []).forEach((item, idx) => {
    const qtyInput = document.getElementById(`gr-qty-${idx}`);
    const rejectInput = document.getElementById(`gr-reject-${idx}`);
    const lotInput = document.getElementById(`gr-lot-${idx}`);
    const expInput = document.getElementById(`gr-exp-${idx}`);

    const recQty = qtyInput ? parseInt(qtyInput.value) || 0 : 0;
    const rejQty = rejectInput ? parseInt(rejectInput.value) || 0 : 0;
    const lotNum = lotInput ? lotInput.value.trim() : `LOT-${item.productCode}-2026`;
    const expDate = expInput ? expInput.value : '2028-03-31';

    if (recQty > 0) {
      item.receivedQty = (item.receivedQty || 0) + recQty;
      const cost = recQty * item.unitPrice;
      totalReceivedValue += cost;

      receivedItemsList.push({
        productId: item.productId,
        productCode: item.productCode,
        name: item.name,
        receivedQty: recQty,
        rejectedQty: rejQty,
        lotNumber: lotNum,
        expiryDate: expDate,
        unitCost: item.unitPrice,
        totalCost: cost
      });

      // === SEAMLESS INTEGRATION WITH DOMAIN 04 INVENTORY ===
      // 1. Update product stock
      const product = (state.products || []).find(p => p.id === item.productId || p.product_code === item.productCode);
      if (product) {
        product.stock = (product.stock || 0) + recQty;
      }

      // 2. Register Batch Lot into state.inventoryLots
      const newLotId = (state.inventoryLots || []).length + 1;
      if (state.inventoryLots) {
        state.inventoryLots.push({
          id: newLotId,
          product_id: item.productId,
          lot_number: lotNum,
          manufactured_date: '2026-02-15',
          expiry_date: expDate,
          received_date: '2026-03-02',
          unit_cost: item.unitPrice,
          quantity_initial: recQty,
          status: 'ACTIVE'
        });
      }

      // 3. Register inventory stock balance into state.stockBalances
      if (state.stockBalances) {
        state.stockBalances.push({
          id: state.stockBalances.length + 1,
          product_id: item.productId,
          lot_id: newLotId,
          warehouse_name: 'คลังยาหลักห้องตรวจ',
          location_code: 'FLUID-02',
          quantity_on_hand: recQty,
          quantity_reserved: 0,
          quantity_available: recQty
        });
      }

      // 4. Record stock movement into state.stockMovements
      if (state.stockMovements) {
        state.stockMovements.push({
          id: state.stockMovements.length + 1,
          movement_number: `MOV-2026-00${state.stockMovements.length + 1}`,
          product_id: item.productId,
          lot_id: newLotId,
          movement_type: 'RECEIVE',
          quantity: recQty,
          unit_cost: item.unitPrice,
          reference_type: 'PURCHASE_ORDER',
          reference_code: po.poNumber,
          movement_at: '2026-03-02 12:50',
          performed_by: 'ภก. อานนท์ เวชสิทธิ์',
          notes: `ตรวจรับสินค้าตามใบสั่งซื้อ ${po.poNumber}`
        });
      }
    }

    // === SEAMLESS SUPPLIER CLAIM CREATION (If rejected goods detected) ===
    if (rejQty > 0) {
      hasDefectClaim = true;
      if (!state.supplierClaims) state.supplierClaims = [];
      const nextClaimId = state.supplierClaims.length + 1;
      const claimCode = `CLM-202603-00${nextClaimId}`;
      const claimVal = rejQty * (item.unitPrice || 0);

      state.supplierClaims.unshift({
        id: nextClaimId,
        claimNumber: claimCode,
        poNumber: po.poNumber,
        receiptNumber: grCode,
        supplierId: po.supplierId,
        supplierName: po.supplierName,
        productId: item.productId,
        productCode: item.productCode,
        productName: item.name,
        rejectedQty: rejQty,
        unit: item.unit || 'ชิ้น',
        unitPrice: item.unitPrice || 0,
        totalClaimAmount: claimVal,
        defectReason: 'สินค้าชำรุดแตกรั่ว บรรจุภัณฑ์เสียหาย หรือไม่ได้มาตรฐานการจัดส่ง',
        status: 'PENDING_SUPPLIER',
        createdAt: '2026-03-02 12:50',
        createdBy: 'ภก. อานนท์ เวชสิทธิ์',
        resolvedAt: null,
        resolutionNotes: 'ส่งเรื่องติดตามผู้จำหน่ายเพื่อขอสินค้าล็อตใหม่ทดแทน'
      });
    }

    if (item.receivedQty < item.orderedQty) {
      allCompleted = false;
    }
  });

  // Update PO status
  po.status = allCompleted ? 'COMPLETED' : 'PARTIAL_RECEIVED';

  // Record Goods Receipt
  if (!state.goodsReceipts) state.goodsReceipts = [];
  state.goodsReceipts.unshift({
    id: nextGrNum,
    receiptNumber: grCode,
    poNumber: po.poNumber,
    supplierName: po.supplierName,
    receivedAt: '2026-03-02 12:50',
    receivedBy: 'ภก. อานนท์ เวชสิทธิ์',
    status: 'COMPLETED',
    items: receivedItemsList
  });

  // Record Formal Supplier Invoice
  if (!state.supplierInvoices) state.supplierInvoices = [];
  const nextInvId = state.supplierInvoices.length + 1;
  const invNum = `INV-${po.supplierName.split(' ')[0].toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const subtotalInv = totalReceivedValue;
  const vatInv = Math.round(subtotalInv * 0.07 * 100) / 100;
  const grandInv = subtotalInv + vatInv;

  state.supplierInvoices.unshift({
    id: nextInvId,
    invoiceNumber: invNum,
    supplierId: po.supplierId,
    supplierName: po.supplierName,
    poNumber: po.poNumber,
    receiptNumber: grCode,
    invoiceDate: '2026-03-02',
    dueDate: '2026-04-01',
    subtotal: subtotalInv,
    taxAmount: vatInv,
    grandTotal: grandInv,
    status: 'MATCHED',
    paymentTerms: po.paymentTerms || 'Credit 30 วัน'
  });

  // Record 3-Way Matching
  if (!state.threeWayMatchings) state.threeWayMatchings = [];
  state.threeWayMatchings.unshift({
    id: state.threeWayMatchings.length + 1,
    poNumber: po.poNumber,
    receiptNumber: grCode,
    invoiceNumber: invNum,
    supplierName: po.supplierName,
    poAmount: totalReceivedValue,
    receivedAmount: totalReceivedValue,
    invoiceAmount: totalReceivedValue,
    variance: 0.00,
    status: 'MATCHED_100',
    matchedAt: '2026-03-02 12:55',
    verifiedBy: 'ภก. อานนท์ เวชสิทธิ์'
  });

  closeGoodsReceiptModal();

  // Central Event Bus Notification (D09 -> D04 Inventory)
  if (window.ClinicEventBus && window.CLINIC_EVENTS) {
    window.ClinicEventBus.emit(window.CLINIC_EVENTS.GOODS_RECEIPT_CONFIRMED, {
      goodsReceipt: state.goodsReceipts ? state.goodsReceipts[0] : null,
      po: po,
      items: po.items
    });
  }

  renderCurrentView();

  if (hasDefectClaim) {
    showToast('ตรวจรับเข้าคลังเรียบร้อย!', `บันทึก ${grCode} อัปเดตคลังยา และเปิดใบเคลมสินค้าชำรุดให้อัตโนมัติ`, 'warning');
  } else {
    showToast('ตรวจรับเข้าคลังเรียบร้อย!', `บันทึก ${grCode} และลงทะเบียนล็อตยาเข้าสู่ Domain 04 คลังเวชภัณฑ์แล้ว`, 'success');
  }
}

// --- SUPPLIER CLAIMS & RETURNS MODAL & ACTIONS ---
function openSupplierClaimModal(claimId) {
  const claim = (state.supplierClaims || []).find(c => c.id === Number(claimId));
  if (!claim) return;

  const body = document.getElementById('supplier-claim-modal-body');
  if (!body) return;

  body.innerHTML = `
    <div class="bg-white border border-slate-300 shadow-md rounded-xl p-8 max-w-2xl mx-auto text-slate-800 font-sans text-xs">
      <!-- Letterhead -->
      <div class="flex items-start justify-between pb-4 border-b-2 border-rose-600">
        <div>
          <h2 class="text-base font-black text-slate-900 tracking-tight">VETCARE+ ANIMAL HOSPITAL</h2>
          <p class="text-[11px] text-slate-500 font-semibold">ฝ่ายควบคุมคุณภาพและเภสัชกรรม คลินิกเว็ทแคร์ พลัส</p>
          <p class="text-[10px] text-slate-400">71/4 ถนนสุขุมวิท 71 วัฒนา กรุงเทพฯ 10110 โทร. 02-123-4567</p>
        </div>
        <div class="text-right">
          <span class="inline-block px-2.5 py-1 bg-rose-600 text-white font-black text-xs tracking-wider rounded uppercase">GOODS RETURN NOTE</span>
          <h4 class="font-mono font-bold text-rose-800 text-sm mt-1">${claim.claimNumber}</h4>
          <p class="text-[10px] text-slate-500">วันที่สร้าง: ${claim.createdAt}</p>
        </div>
      </div>

      <!-- Reference Details -->
      <div class="grid grid-cols-2 gap-4 my-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <span class="text-[10px] text-slate-400 font-bold block mb-0.5">บริษัทคู่ค้า / ผู้จำหน่าย</span>
          <h5 class="font-bold text-slate-900">${claim.supplierName}</h5>
          <p class="text-slate-600 mt-0.5 font-mono text-[11px]">รหัส PO: ${claim.poNumber}</p>
          <p class="text-slate-600 font-mono text-[11px]">รหัสตรวจรับ GR: ${claim.receiptNumber}</p>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 font-bold block mb-0.5">สถานะการชดเชย</span>
          <span class="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${claim.status === 'RESOLVED_REPLACEMENT' ? 'bg-emerald-100 text-emerald-800' : (claim.status === 'RESOLVED_CREDIT_NOTE' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800')}">
            ${claim.status === 'RESOLVED_REPLACEMENT' ? 'เปลี่ยนสินค้าล็อตใหม่เรียบร้อย' : (claim.status === 'RESOLVED_CREDIT_NOTE' ? 'ออกใบลดหนี้ (Credit Note) แล้ว' : 'รอผู้จำหน่ายชดเชย')}
          </span>
          <p class="text-slate-500 text-[10px] mt-1">ผู้บันทึก: ${claim.createdBy}</p>
        </div>
      </div>

      <!-- Claim Items Table -->
      <table class="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden my-3">
        <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
          <tr>
            <th class="py-2 px-3">รหัสและรายการสินค้า</th>
            <th class="py-2 px-3 text-center">จำนวนชำรุด</th>
            <th class="py-2 px-3 text-right">ราคา/หน่วย</th>
            <th class="py-2 px-3 text-right">มูลค่ารวมที่เคลม</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr>
            <td class="py-2.5 px-3">
              <span class="font-mono text-[10px] text-slate-400 block">${claim.productCode}</span>
              <strong class="text-slate-900">${claim.productName}</strong>
            </td>
            <td class="py-2.5 px-3 text-center font-bold text-rose-700">${claim.rejectedQty} ${claim.unit}</td>
            <td class="py-2.5 px-3 text-right font-mono text-slate-700">฿${(claim.unitPrice || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
            <td class="py-2.5 px-3 text-right font-mono font-bold text-rose-800">฿${(claim.totalClaimAmount || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
          </tr>
        </tbody>
      </table>

      <!-- Reason & Notes -->
      <div class="p-3 bg-rose-50/60 border border-rose-200 rounded-xl my-4 text-xs">
        <span class="font-bold text-rose-900 block mb-1">สาเหตุความชำรุดเสียหาย / ไม่ผ่านเกณฑ์มาตรฐาน:</span>
        <p class="text-slate-700">${claim.defectReason}</p>
        ${claim.resolutionNotes ? `
          <div class="mt-2 pt-2 border-t border-rose-200/60">
            <span class="font-bold text-slate-800">บันทึกผลการยุติข้อร้องเรียน:</span>
            <p class="text-slate-600">${claim.resolutionNotes} (${claim.resolvedAt || '-'})</p>
          </div>
        ` : ''}
      </div>

      <!-- Signatures -->
      <div class="grid grid-cols-2 gap-8 mt-8 pt-6 border-t border-slate-200 text-center text-xs">
        <div>
          <div class="h-10 border-b border-dashed border-slate-300 flex items-end justify-center pb-1">
            <span class="font-serif italic text-slate-800 font-bold">${claim.createdBy}</span>
          </div>
          <p class="text-[11px] text-slate-600 mt-1">ผู้รายงานและส่งคืนสินค้า (Pharmacist)</p>
        </div>
        <div>
          <div class="h-10 border-b border-dashed border-slate-300 flex items-end justify-center pb-1">
            <span class="font-serif italic text-slate-400">...................................................</span>
          </div>
          <p class="text-[11px] text-slate-600 mt-1">ผู้แทนรับทราบของคู่ค้า (Supplier Rep)</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-supplier-claim-viewer')?.classList.remove('hidden');
  lucide.createIcons();
}

function closeSupplierClaimModal() {
  document.getElementById('modal-supplier-claim-viewer')?.classList.add('hidden');
}

function printSupplierClaimDocument() {
  showToast('เตรียมพิมพ์ใบแจ้งเคลม', 'ส่งเอกสารคืนสินค้าไปยังเครื่องพิมพ์เรียบร้อย', 'info');
  window.print();
}

function resolveSupplierClaim(claimId, resolutionType) {
  const claim = (state.supplierClaims || []).find(c => c.id === Number(claimId));
  if (!claim) return;

  claim.status = resolutionType;
  claim.resolvedAt = '2026-03-02 13:15';
  if (resolutionType === 'RESOLVED_REPLACEMENT') {
    claim.resolutionNotes = 'ผู้แทนคู่ค้านำสินค้าล็อตใหม่มาส่งเปลี่ยนทดแทนเรียบร้อยแล้ว ตรวจนับครบถ้วน';
    showToast('บันทึกเปลี่ยนสินค้าสำเร็จ', `ปิดข้อร้องเรียน ${claim.claimNumber} (ได้รับสินค้าใหม่ทดแทนแล้ว)`, 'success');
  } else {
    claim.resolutionNotes = 'ผู้แทนคู่ค้าออกใบลดหนี้ (Credit Note) มูลค่า ฿' + claim.totalClaimAmount.toLocaleString('th-TH', {minimumFractionDigits: 2}) + ' เพื่อหักลบในใบแจ้งหนี้รอบถัดไป';
    showToast('บันทึกใบลดหนี้สำเร็จ', `ปิดข้อร้องเรียน ${claim.claimNumber} (ลงบัญชีใบลดหนี้เรียบร้อย)`, 'success');
  }

  renderCurrentView();
}

// --- NEW SUPPLIER REGISTRATION MODAL & ACTIONS ---
function openNewSupplierModal() {
  const form = document.getElementById('form-new-supplier');
  if (form) form.reset();

  const nextSupNum = (state.suppliers || []).length + 1;
  const codeInput = document.getElementById('new-sup-code');
  if (codeInput) codeInput.value = `SUP-00${nextSupNum}`;

  document.getElementById('modal-new-supplier')?.classList.remove('hidden');
  lucide.createIcons();
}

function closeNewSupplierModal() {
  document.getElementById('modal-new-supplier')?.classList.add('hidden');
}

function submitNewSupplier(event) {
  if (event) event.preventDefault();

  const code = (document.getElementById('new-sup-code')?.value || '').trim();
  const category = document.getElementById('new-sup-category')?.value || 'PHARMACEUTICAL';
  const name = (document.getElementById('new-sup-name')?.value || '').trim();
  const type = (document.getElementById('new-sup-type')?.value || '').trim();
  const taxId = (document.getElementById('new-sup-taxid')?.value || '').trim();
  const paymentTerms = document.getElementById('new-sup-terms')?.value || 'Credit 30 วัน';
  const contactName = (document.getElementById('new-sup-contact')?.value || '').trim();
  const phone = (document.getElementById('new-sup-phone')?.value || '').trim();
  const email = (document.getElementById('new-sup-email')?.value || '').trim();
  const address = (document.getElementById('new-sup-address')?.value || '').trim();

  if (!name || !code) {
    showToast('ข้อมูลไม่ครบถ้วน', 'กรุณาระบุรหัสและชื่อบริษัทคู่ค้า', 'warning');
    return;
  }

  // Check code uniqueness
  if ((state.suppliers || []).some(s => s.code === code)) {
    showToast('รหัสคู่ค้าซ้ำ', `รหัส ${code} มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น`, 'warning');
    return;
  }

  const newSupplier = {
    id: (state.suppliers || []).length + 1,
    code: code,
    name: name,
    type: type || 'เภสัชภัณฑ์และเวชภัณฑ์สัตว์เลี้ยง',
    category: category,
    taxId: taxId || '0105556099999',
    paymentTerms: paymentTerms,
    creditDays: paymentTerms.includes('45') ? 45 : (paymentTerms.includes('60') ? 60 : (paymentTerms.includes('15') ? 15 : 30)),
    contactName: contactName || 'คุณผู้จัดการฝ่ายขาย',
    phone: phone || '02-000-0000',
    email: email || 'sales@supplier.co.th',
    address: address || 'กรุงเทพมหานคร',
    province: 'กรุงเทพมหานคร',
    postalCode: '10110',
    rating: 'A',
    score: 95,
    onTimeRate: 98,
    status: 'ACTIVE',
    productsSupplied: [],
    notes: 'คู่ค้าจดทะเบียนใหม่ผ่านระบบ'
  };

  state.suppliers.push(newSupplier);
  closeNewSupplierModal();
  renderCurrentView();
  showToast('ลงทะเบียนคู่ค้าสำเร็จ!', `เพิ่มคู่ค้า ${name} (${code}) เข้าสู่ฐานข้อมูลเรียบร้อยแล้ว`, 'success');
}

// --- SLIDE-OVER SHEET: CREATE NEW PURCHASE ORDER ---
function openNewPurchaseOrderSheet(prefilledPrId = null, preselectedSupplierId = null) {
  openSheetContainer();

  const badge = document.getElementById('sheet-badge');
  const title = document.getElementById('sheet-title');
  const subtitle = document.getElementById('sheet-subtitle');
  const body = document.getElementById('sheet-body');
  const footer = document.getElementById('sheet-footer');

  badge.innerText = 'PROCUREMENT';
  badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200';
  title.innerText = 'เปิดใบสั่งซื้อเวชภัณฑ์ใหม่ (New Purchase Order)';
  subtitle.innerText = 'เลือกผู้จำหน่าย กำหนดรายการสินค้า คำนวณภาษี และเงื่อนไขการส่งมอบ';

  const suppliers = state.suppliers || [];
  const selectedSupId = preselectedSupplierId || suppliers[0].id;
  const curSup = suppliers.find(s => s.id === Number(selectedSupId)) || suppliers[0];

  body.innerHTML = `
    <div class="space-y-4">
      <!-- Supplier Selector -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">เลือกผู้จำหน่าย / คู่ค้า (Supplier) *</label>
        <select id="po-form-supplier" onchange="onPoSupplierChanged(this.value)" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500">
          ${suppliers.map(s => `
            <option value="${s.id}" ${s.id === curSup.id ? 'selected' : ''}>${s.code} - ${s.name} (${s.paymentTerms})</option>
          `).join('')}
        </select>
      </div>

      <!-- Delivery Date & Terms -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">กำหนดส่งมอบสินค้า *</label>
          <input type="date" id="po-form-delivery-date" value="2026-03-06" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">เงื่อนไขการชำระเงิน</label>
          <input type="text" id="po-form-payment-terms" value="${curSup.paymentTerms}" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
        </div>
      </div>

      <!-- Catalog Items Picker for this Supplier -->
      <div class="pt-2 border-t border-slate-200">
        <label class="block text-xs font-bold text-slate-800 mb-1.5">เลือกสินค้าจากแค็ตตาล็อกผู้จำหน่ายรายนี้</label>
        <div id="po-form-catalog-picker" class="space-y-2">
          <!-- Rendered by onPoSupplierChanged -->
        </div>
      </div>

      <!-- Cart Table -->
      <div class="pt-2 border-t border-slate-200">
        <h5 class="text-xs font-bold text-slate-800 mb-1.5">รายการเวชภัณฑ์ที่สั่งซื้อ</h5>
        <div class="border border-slate-200 rounded-xl overflow-hidden">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th class="py-2 px-3">รายการ</th>
                <th class="py-2 px-3 text-center w-24">จำนวน</th>
                <th class="py-2 px-3 text-right w-24">ราคา/หน่วย</th>
                <th class="py-2 px-3 text-right w-28">ยอดรวม</th>
                <th class="py-2 px-2 text-center w-10"></th>
              </tr>
            </thead>
            <tbody id="po-form-cart-items" class="divide-y divide-slate-100">
              <!-- Populated dynamically -->
            </tbody>
          </table>
        </div>

        <!-- Totals Box -->
        <div class="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
          <div class="flex justify-between text-slate-600">
            <span>มูลค่าก่อนภาษี (Subtotal):</span>
            <span id="po-form-subtotal" class="font-mono font-bold">฿0.00</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
            <span id="po-form-tax" class="font-mono font-bold">฿0.00</span>
          </div>
          <div class="flex justify-between text-sm font-extrabold text-blue-900 pt-1.5 border-t border-slate-200">
            <span>ยอดรวมสุทธิ (Grand Total):</span>
            <span id="po-form-grand-total" class="font-mono">฿0.00</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">หมายเหตุเพิ่มเติม</label>
        <input type="text" id="po-form-notes" value="จัดส่งที่คลังเวชภัณฑ์กลาง ชั้น 1 ติดต่อฝ่ายเภสัชกรรม" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
      </div>
    </div>
  `;

  footer.innerHTML = `
    <button onclick="closeSheet()" class="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer">ยกเลิก</button>
    <button onclick="submitNewPurchaseOrder('DRAFT')" class="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition cursor-pointer">บันทึกร่าง (Draft)</button>
    <button onclick="submitNewPurchaseOrder('APPROVED')" class="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5">
      <i data-lucide="check" class="w-4 h-4"></i>
      <span>อนุมัติสั่งซื้อทันที</span>
    </button>
  `;

  window.currentPoCart = [];
  onPoSupplierChanged(curSup.id);
  lucide.createIcons();
}

function onPoSupplierChanged(supId) {
  const sup = (state.suppliers || []).find(s => s.id === Number(supId));
  if (!sup) return;

  const paymentInput = document.getElementById('po-form-payment-terms');
  if (paymentInput) paymentInput.value = sup.paymentTerms;

  const picker = document.getElementById('po-form-catalog-picker');
  if (!picker) return;

  const availableProducts = (state.products || []).filter(p => (sup.productsSupplied || []).includes(p.product_code));

  if (availableProducts.length === 0) {
    picker.innerHTML = `<p class="text-xs text-slate-400 italic">ไม่มีรายการสินค้าในระบบที่ผูกกับผู้จำหน่ายนี้</p>`;
  } else {
    picker.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        ${availableProducts.map(p => `
          <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs hover:border-blue-300">
            <div>
              <span class="font-mono text-[10px] text-slate-400 block">${p.product_code}</span>
              <span class="font-bold text-slate-800">${p.product_name.split(' (')[0]}</span>
              <span class="font-mono text-slate-500 block">฿${(p.unit_cost || 100).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
            </div>
            <button type="button" onclick="addItemToPoCart(${p.id})" class="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs transition cursor-pointer flex items-center gap-1">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>เพิ่ม</span>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  if ((window.currentPoCart || []).length === 0 && availableProducts.length > 0) {
    addItemToPoCart(availableProducts[0].id);
  } else {
    renderPoCartTable();
  }

  lucide.createIcons();
}

function addItemToPoCart(productId) {
  const prod = (state.products || []).find(p => p.id === Number(productId));
  if (!prod) return;

  if (!window.currentPoCart) window.currentPoCart = [];
  const existing = window.currentPoCart.find(i => i.productId === prod.id);
  if (existing) {
    existing.qty += 5;
  } else {
    window.currentPoCart.push({
      productId: prod.id,
      productCode: prod.product_code,
      name: prod.product_name,
      qty: 10,
      unit: prod.base_unit || 'กล่อง',
      unitPrice: prod.unit_cost || 100
    });
  }

  renderPoCartTable();
}

function removePoCartItem(idx) {
  if (!window.currentPoCart) return;
  window.currentPoCart.splice(idx, 1);
  renderPoCartTable();
}

function updatePoCartQty(idx, val) {
  if (!window.currentPoCart || !window.currentPoCart[idx]) return;
  const num = parseInt(val) || 1;
  window.currentPoCart[idx].qty = num > 0 ? num : 1;
  renderPoCartTable();
}

function renderPoCartTable() {
  const tbody = document.getElementById('po-form-cart-items');
  if (!tbody) return;

  const cart = window.currentPoCart || [];
  if (cart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-slate-400 italic text-xs">ยังไม่มีรายการเวชภัณฑ์ในใบสั่งซื้อ</td></tr>`;
    document.getElementById('po-form-subtotal').innerText = '฿0.00';
    document.getElementById('po-form-tax').innerText = '฿0.00';
    document.getElementById('po-form-grand-total').innerText = '฿0.00';
    return;
  }

  let subtotal = 0;
  tbody.innerHTML = cart.map((item, idx) => {
    const lineTotal = item.qty * item.unitPrice;
    subtotal += lineTotal;
    return `
      <tr>
        <td class="py-2 px-3">
          <span class="font-mono text-[10px] text-slate-400 block">${item.productCode}</span>
          <span class="font-medium text-slate-800">${item.name}</span>
        </td>
        <td class="py-2 px-3 text-center">
          <input type="number" min="1" value="${item.qty}" onchange="updatePoCartQty(${idx}, this.value)" class="w-16 bg-white border border-slate-300 rounded px-1.5 py-1 text-center font-bold text-slate-800 focus:outline-none focus:border-blue-500">
        </td>
        <td class="py-2 px-3 text-right font-mono text-slate-600">฿${item.unitPrice.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
        <td class="py-2 px-3 text-right font-mono font-bold text-slate-900">฿${lineTotal.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
        <td class="py-2 px-2 text-center">
          <button type="button" onclick="removePoCartItem(${idx})" class="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  const taxAmount = Math.round(subtotal * 0.07 * 100) / 100;
  const grandTotal = subtotal + taxAmount;

  document.getElementById('po-form-subtotal').innerText = `฿${subtotal.toLocaleString('th-TH', {minimumFractionDigits: 2})}`;
  document.getElementById('po-form-tax').innerText = `฿${taxAmount.toLocaleString('th-TH', {minimumFractionDigits: 2})}`;
  document.getElementById('po-form-grand-total').innerText = `฿${grandTotal.toLocaleString('th-TH', {minimumFractionDigits: 2})}`;

  lucide.createIcons();
}

function submitNewPurchaseOrder(status = 'APPROVED') {
  const supSelect = document.getElementById('po-form-supplier');
  const deliveryInput = document.getElementById('po-form-delivery-date');
  const termsInput = document.getElementById('po-form-payment-terms');
  const notesInput = document.getElementById('po-form-notes');

  const cart = window.currentPoCart || [];
  if (cart.length === 0) {
    showToast('ไม่สามารถสร้าง PO ได้', 'กรุณาเลือกสินค้าอย่างน้อย 1 รายการ', 'warning');
    return;
  }

  const supId = supSelect ? Number(supSelect.value) : 1;
  const sup = (state.suppliers || []).find(s => s.id === supId) || state.suppliers[0];

  const nextId = (state.purchaseOrders || []).length + 1;
  const poNum = `PO-202603-00${nextId}`;

  let subtotal = 0;
  const items = cart.map(item => {
    const lineTotal = item.qty * item.unitPrice;
    subtotal += lineTotal;
    return {
      productId: item.productId,
      productCode: item.productCode,
      name: item.name,
      orderedQty: item.qty,
      receivedQty: 0,
      unitPrice: item.unitPrice,
      lineTotal: lineTotal,
      unit: item.unit || 'ชิ้น'
    };
  });

  const taxAmount = Math.round(subtotal * 0.07 * 100) / 100;
  const grandTotal = subtotal + taxAmount;

  const newPo = {
    id: nextId,
    poNumber: poNum,
    supplierId: sup.id,
    supplierName: sup.name,
    orderedAt: '2026-03-02 13:00',
    expectedDelivery: deliveryInput ? deliveryInput.value : '2026-03-06',
    status: status,
    paymentTerms: termsInput ? termsInput.value : sup.paymentTerms,
    subtotal: subtotal,
    taxRate: 0.07,
    taxAmount: taxAmount,
    grandTotal: grandTotal,
    notes: notesInput ? notesInput.value : 'คำสั่งซื้อปกติ',
    items: items
  };

  state.purchaseOrders.unshift(newPo);
  closeSheet();
  state.activeProcurementSubTab = 'orders';
  renderCurrentView();
  showToast('ออกใบสั่งซื้อสำเร็จ!', `สร้างใบสั่งซื้อ ${poNum} มูลค่า ฿${grandTotal.toLocaleString('th-TH', {minimumFractionDigits: 2})} เรียบร้อยแล้ว`, 'success');
}
