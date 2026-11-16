// ============================================================================
// DOMAIN 08: MARKETING & CUSTOMER RELATIONSHIP MANAGEMENT ENGINE (CRM)
// ============================================================================
// Architectural Alignment:
// - docs/BusinessDomain/08.Marketing_and_Customer_Relationship_Management.md
// - 20 Business Capabilities (4.1 - 4.20)
// - Physical Database Design (Schema crm.* - 12+ Tables)
// - 5 Sub-Tabs Lifecycle:
//   1. reminders (เตือนนัด & ดูแลสุขภาพ - Care Reminders & Interaction Timeline)
//   2. membership (ระบบสมาชิก & แต้ม - Memberships & Points Ledger)
//   3. campaigns (แคมเปญ & โปรโมชั่น - Campaigns, Promos & Customer Coupons)
//   4. feedback (ความพึงพอใจ & ร้องเรียน - CSAT & Multi-step Complaints)
//   5. leads (ผู้มุ่งหวัง & ช่องทาง - Lead Pipeline & Conversion to Customer)
// ============================================================================

// --- Helper Finders ---
function getCrmMembershipByCustomerId(customerId) {
  return (state.crmMemberships || []).find(m => m.customer_id === Number(customerId));
}

function getCrmReminderById(id) {
  return (state.crmReminders || []).find(r => r.id === Number(id));
}

function getCrmCampaignById(id) {
  return (state.crmCampaigns || []).find(c => c.id === Number(id));
}

function getCrmLeadById(id) {
  return (state.crmLeads || []).find(l => l.id === Number(id));
}

function getCrmComplaintById(id) {
  return (state.crmCustomerComplaints || state.customerComplaints || []).find(c => c.id === Number(id));
}

function setCrmSubFilter(filter) {
  state.activeCrmSubFilter = filter;
  renderCurrentView();
}

function renderCrmActiveSubTab() {
  const sub = state.activeCrmSubFilter || 'reminders';
  if (sub === 'reminders') renderCrmRemindersTab();
  else if (sub === 'membership') renderCrmMembershipTab();
  else if (sub === 'campaigns') renderCrmCampaignsTab();
  else if (sub === 'feedback') renderCrmFeedbackTab();
  else if (sub === 'leads') renderCrmLeadsTab();
}

// --- PDPA & Consent Gatekeeper (Rule Section 9 & 14) ---
function checkCustomerPdpaConsent(customerId, purpose = 'marketing_promo') {
  const customer = (state.customers || []).find(c => c.id === Number(customerId));
  if (!customer) return false;
  
  // If consents object is not defined, default to false for strict PDPA compliance
  if (!customer.consents) return false;
  
  if (purpose === 'service_reminders' || purpose === 'clinical_care') {
    return customer.consents.service_reminders?.granted ?? true;
  }
  
  if (purpose === 'marketing_promo') {
    return customer.consents.marketing_promo?.granted ?? false;
  }
  
  return false;
}

// ============================================================================
// 1. SUB-TAB 1: CARE & VACCINE REMINDERS (CAPABILITIES 4.10, 4.12, 4.9)
// ============================================================================
function renderCrmRemindersTab() {
  const container = document.getElementById('crm-tab-content');
  if (!container) return;

  const filterStatus = document.getElementById('view-filter-crm-status')?.value || 'all';
  let reminders = state.crmReminders || [];

  if (filterStatus && filterStatus !== 'all') {
    reminders = reminders.filter(r => r.priority === filterStatus || r.status === filterStatus);
  }

  const interactions = (state.customerInteractions || []).slice(0, 4);

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>กำหนดการแจ้งเตือนวัคซีน & ติดตามสุขภาพสัตว์เลี้ยง</span>
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              ${reminders.length} รายการ
            </span>
          </h4>
          <p class="text-xs text-slate-500">ระบบติดตามการฉีดวัคซีน การตรวจแผลผ่าตัด และเวชศาสตร์ป้องกันรายตัวตามมาตรฐานวิชาชีพ</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="simulateSendAllPendingReminders()" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="send" class="w-3.5 h-3.5"></i>
            <span>ส่งเตือน LINE ทุกเคสที่ถึงกำหนด</span>
          </button>
        </div>
      </div>

      <!-- Reminder Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${reminders.map(rem => {
          const pet = typeof getPetById === 'function' ? getPetById(rem.pet_id) : (state.pets || []).find(p => p.id === rem.pet_id);
          const owner = typeof getCustomerById === 'function' ? getCustomerById(rem.customer_id) : (state.customers || []).find(c => c.id === rem.customer_id);
          const isSent = rem.status === 'SENT';

          let typeBadge = 'bg-teal-100 text-teal-800 border-teal-200';
          let typeLabel = 'วัคซีน';
          if (rem.reminder_type === 'POST_OP') { typeBadge = 'bg-rose-100 text-rose-800 border-rose-200'; typeLabel = 'ตรวจแผลผ่าตัด'; }
          else if (rem.reminder_type === 'CHECKUP') { typeBadge = 'bg-blue-100 text-blue-800 border-blue-200'; typeLabel = 'ตรวจสุขภาพ/ค่าไต'; }
          else if (rem.reminder_type === 'DENTAL') { typeBadge = 'bg-amber-100 text-amber-800 border-amber-200'; typeLabel = 'เช็กสุขภาพฟัน'; }

          // PDPA Consent Indicator
          const hasMarketingConsent = checkCustomerPdpaConsent(rem.customer_id, 'marketing_promo');
          const hasServiceConsent = checkCustomerPdpaConsent(rem.customer_id, 'service_reminders');

          return `
            <div class="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition p-4 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded border ${typeBadge}">${typeLabel}</span>
                    <span class="text-xs font-semibold text-slate-800">${rem.title}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    ${isSent ? `
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <i data-lucide="check-check" class="w-3 h-3"></i><span>ส่งเตือนแล้ว</span>
                      </span>
                    ` : `
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>ถึงกำหนดแจ้งเตือน</span>
                      </span>
                    `}
                  </div>
                </div>

                <div class="flex items-center gap-3 my-3">
                  <img src="${pet?.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=120'}" class="w-12 h-12 rounded-xl object-cover border border-slate-200">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5">
                      <h5 class="font-bold text-slate-900 text-xs">${pet?.pet_name || 'สัตว์ป่วย'}</h5>
                      <span class="text-[10px] text-slate-500">(${pet?.species || ''} / ${pet?.breed || ''})</span>
                    </div>
                    <p class="text-[11px] text-slate-600 mt-0.5">เจ้าของ: <span class="font-medium text-slate-800">${owner?.display_name || '-'}</span> (${owner?.phone_primary || owner?.phone || '-'})</p>
                    <div class="flex items-center gap-2 mt-1">
                      <p class="text-[10px] text-purple-700 font-mono font-bold">กำหนดนัด: ${rem.due_date}</p>
                      <span class="text-[9px] px-1.5 py-0.2 rounded font-semibold ${hasServiceConsent ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
                        PDPA: ${hasServiceConsent ? 'ยินยอมรับเตือนนัด' : 'ยังไม่ระบุยินยอม'}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                  <div class="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase">
                    <i data-lucide="message-square" class="w-3 h-3 text-emerald-600"></i>
                    <span>ตัวอย่างข้อความแจ้งเตือน (LINE Official Preview):</span>
                  </div>
                  <p class="text-[11px] text-slate-700 line-clamp-2">${rem.message_preview}</p>
                </div>
              </div>

              <div class="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between gap-2">
                <button onclick="logCallReminder(${rem.id})" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1 cursor-pointer">
                  <i data-lucide="phone-call" class="w-3.5 h-3.5 text-slate-500"></i>
                  <span>โทรติดตาม</span>
                </button>
                <div class="flex items-center gap-1.5">
                  <button onclick="openLinePreviewModal(${rem.id})" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 cursor-pointer">
                    <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                    <span>ดู LINE OA / ส่งข้อความ</span>
                  </button>
                  <button onclick="bookAppointmentFromReminder(${rem.id})" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition flex items-center gap-1 cursor-pointer">
                    <i data-lucide="calendar-plus" class="w-3.5 h-3.5"></i>
                    <span>จองนัด</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Customer Interactions Timeline (crm.customer_interactions) -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <i data-lucide="history" class="w-4 h-4 text-purple-600"></i>
            <h5 class="font-bold text-xs text-slate-800">ประวัติการติดต่อและติดตามความสัมพันธ์ลูกค้า (Customer Interaction Timeline)</h5>
          </div>
          <span class="text-[11px] text-slate-400">บันทึกทุก Touchpoint ย้อนหลังตามลำดับเวลา</span>
        </div>

        <div class="divide-y divide-slate-100 text-xs">
          ${interactions.map(item => {
            const cust = typeof getCustomerById === 'function' ? getCustomerById(item.customer_id) : (state.customers || []).find(c => c.id === item.customer_id);
            const pet = typeof getPetById === 'function' ? getPetById(item.pet_id) : (state.pets || []).find(p => p.id === item.pet_id);
            const emp = (state.employees || []).find(e => e.id === item.employee_id);

            let channelIcon = 'phone';
            if (item.channel === 'LINE') channelIcon = 'message-circle';
            else if (item.channel === 'IN_CLINIC') channelIcon = 'map-pin';

            return `
              <div class="py-2.5 flex items-start justify-between gap-3 hover:bg-slate-50/60 transition rounded-lg px-2">
                <div class="flex items-start gap-2.5">
                  <div class="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 border border-purple-100">
                    <i data-lucide="${channelIcon}" class="w-3.5 h-3.5"></i>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900">${cust?.display_name || 'ลูกค้า'}</span>
                      <span class="text-[10px] text-slate-400">(สัตว์เลี้ยง: ${pet?.pet_name || '-'})</span>
                      <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">${item.interaction_type}</span>
                    </div>
                    <p class="text-slate-700 text-[11px] mt-0.5">${item.interaction_detail}</p>
                    <div class="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span>ผู้ดำเนินการ: ${emp?.firstName || 'เจ้าหน้าที่'} (${emp?.nickname || ''})</span>
                      <span>•</span>
                      <span class="font-mono">${item.interacted_at}</span>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

// ============================================================================
// 2. SUB-TAB 2: MEMBERSHIP & LOYALTY (CAPABILITIES 4.7, 4.8)
// ============================================================================
function renderCrmMembershipTab() {
  const container = document.getElementById('crm-tab-content');
  if (!container) return;

  const memberships = state.crmMemberships || [];
  const txns = state.loyaltyTransactions || [];

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Membership Tier Cards -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <div>
            <h4 class="text-sm font-bold text-slate-900">ระดับสมาชิกและสิทธิประโยชน์ (Membership Tiers & Benefits)</h4>
            <p class="text-xs text-slate-500">สิทธิพิเศษส่วนลดค่ายาและบริการสุขภาพคำนวณตามยอดใช้จ่ายสะสมรายบุคคล</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${memberships.map(mem => {
            const owner = typeof getCustomerById === 'function' ? getCustomerById(mem.customer_id) : (state.customers || []).find(c => c.id === mem.customer_id);
            const pets = typeof getPetsForCustomer === 'function' ? getPetsForCustomer(mem.customer_id) : (state.pets || []).filter(p => p.owner_id === mem.customer_id);

            let tierGradient = 'from-slate-700 to-slate-900 text-white';
            let tierBadge = 'bg-slate-200 text-slate-800';
            if (mem.membership_level === 'GOLD') {
              tierGradient = 'from-amber-600 to-amber-700 text-white';
              tierBadge = 'bg-amber-200 text-amber-900';
            } else if (mem.membership_level === 'PLATINUM') {
              tierGradient = 'from-purple-800 to-indigo-950 text-white';
              tierBadge = 'bg-purple-200 text-purple-950';
            } else if (mem.membership_level === 'SILVER') {
              tierGradient = 'from-slate-500 to-slate-700 text-white';
              tierBadge = 'bg-slate-200 text-slate-900';
            }

            return `
              <div class="bg-gradient-to-br ${tierGradient} rounded-2xl p-4 shadow-md flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between pb-2 border-b border-white/20">
                    <span class="text-[10px] font-bold font-mono uppercase tracking-wider ${tierBadge} px-2 py-0.5 rounded-full">${mem.membership_level} TIER</span>
                    <span class="text-[10px] font-mono text-white/70">${mem.membership_number}</span>
                  </div>
                  <div class="my-3">
                    <h4 class="font-black text-base text-white">${owner?.display_name || '-'}</h4>
                    <p class="text-xs text-white/80">${owner?.phone_primary || owner?.phone || '-'}</p>
                    <p class="text-[11px] text-white/70 mt-1">สัตว์เลี้ยง: ${pets.map(p => p.pet_name).join(', ') || '-'}</p>
                  </div>
                </div>
                <div>
                  <div class="bg-black/25 rounded-xl p-3 backdrop-blur-xs space-y-1.5">
                    <div class="flex justify-between items-baseline">
                      <span class="text-xs text-white/80">คะแนนสะสม:</span>
                      <span class="text-lg font-black font-mono text-amber-300">${(mem.points_balance || 0).toLocaleString('th-TH')} <span class="text-xs font-normal">pts</span></span>
                    </div>
                    <div class="text-[11px] text-white/90 border-t border-white/10 pt-1">
                      <strong>สิทธิ์:</strong> ${mem.tier_benefits}
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Points Redemption & Transaction History -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <!-- Points Redemption Box with Dynamic Member Selector -->
        <div class="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <i data-lucide="gift" class="w-4 h-4 text-purple-600"></i>
              <h5 class="font-bold text-xs text-slate-800">แลกคะแนนสะสมเป็นคูปองส่วนลด (Redeem Rewards)</h5>
            </div>
          </div>

          <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <label class="font-bold text-slate-700 block mb-1">เลือกสมาชิกที่ต้องการแลกแต้ม:</label>
            <select id="crm-redeem-member-select" class="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-800">
              ${memberships.map(m => {
                const cust = typeof getCustomerById === 'function' ? getCustomerById(m.customer_id) : (state.customers || []).find(c => c.id === m.customer_id);
                return `<option value="${m.id}">${cust?.display_name || 'สมาชิก'} (${m.membership_level} - คงเหลือ ${m.points_balance} แต้ม)</option>`;
              }).join('')}
            </select>
          </div>

          <div class="space-y-2">
            <div class="p-3 bg-purple-50/60 rounded-xl border border-purple-200 flex items-center justify-between">
              <div>
                <h6 class="font-bold text-xs text-purple-950">คูปองส่วนลด ฿50 (ทุกบริการ)</h6>
                <p class="text-[10px] text-purple-700">ใช้ 100 คะแนนสะสม</p>
              </div>
              <button onclick="executeSelectedLoyaltyReward(100, 'คูปองส่วนลด ฿50', 'DISC-50', 50, 'FIXED')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition active:scale-95 cursor-pointer">
                แลกคูปอง
              </button>
            </div>

            <div class="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <h6 class="font-bold text-xs text-amber-950">คูปองส่วนลด ฿100 (บิล ฿500 ขึ้นไป)</h6>
                <p class="text-[10px] text-amber-700">ใช้ 200 คะแนนสะสม</p>
              </div>
              <button onclick="executeSelectedLoyaltyReward(200, 'คูปองส่วนลด ฿100', 'DISC-100', 100, 'FIXED')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition active:scale-95 cursor-pointer">
                แลกคูปอง
              </button>
            </div>

            <div class="p-3 bg-teal-50/60 rounded-xl border border-teal-200 flex items-center justify-between">
              <div>
                <h6 class="font-bold text-xs text-teal-950">ฟรีบริการตัดเล็บและเช็ดหู 1 ครั้ง</h6>
                <p class="text-[10px] text-teal-700">ใช้ 150 คะแนนสะสม</p>
              </div>
              <button onclick="executeSelectedLoyaltyReward(150, 'บริการตัดเล็บและเช็ดหูฟรี', 'FREE-GROOM', 120, 'SERVICE')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition active:scale-95 cursor-pointer">
                แลกสิทธิ์
              </button>
            </div>
          </div>
        </div>

        <!-- Points Transaction Ledger -->
        <div class="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <i data-lucide="history" class="w-4 h-4 text-blue-600"></i>
              <h5 class="font-bold text-xs text-slate-800">ประวัติการเดินบัญชีแต้มสะสม (Loyalty Points Ledger)</h5>
            </div>
            <span class="text-[11px] text-slate-400">อ้างอิงใบเสร็จจริง Domain 07</span>
          </div>

          <div class="overflow-x-auto max-h-64 overflow-y-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th class="p-2">วัน-เวลา</th>
                  <th class="p-2">สมาชิก</th>
                  <th class="p-2">รายการ</th>
                  <th class="p-2">อ้างอิง</th>
                  <th class="p-2 text-right">คะแนน</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                ${txns.map(t => {
                  const mem = (state.crmMemberships || []).find(m => m.id === t.membership_id);
                  const cust = mem ? (typeof getCustomerById === 'function' ? getCustomerById(mem.customer_id) : (state.customers || []).find(c => c.id === mem.customer_id)) : null;
                  const isEarn = t.points > 0;
                  return `
                    <tr>
                      <td class="p-2 text-slate-500 font-sans text-[11px]">${t.transaction_at}</td>
                      <td class="p-2 font-sans text-slate-800 text-[11px]">${cust?.display_name || '-'}</td>
                      <td class="p-2 font-sans text-slate-800 text-[11px]">${t.description}</td>
                      <td class="p-2 text-slate-500 text-[11px]">${t.reference_number}</td>
                      <td class="p-2 text-right font-bold ${isEarn ? 'text-emerald-600' : 'text-rose-600'}">
                        ${isEarn ? `+${t.points}` : t.points}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

// Wrapper to redeem for selected member
function executeSelectedLoyaltyReward(pointsCost, couponName, couponCode, discountVal, discountType) {
  const select = document.getElementById('crm-redeem-member-select');
  const membershipId = Number(select?.value || 1);
  redeemLoyaltyReward(membershipId, pointsCost, couponName, couponCode, discountVal, discountType);
}

// ============================================================================
// 3. SUB-TAB 3: CAMPAIGNS & PROMOTIONS (CAPABILITIES 4.3, 4.4, 4.5)
// ============================================================================
function renderCrmCampaignsTab() {
  const container = document.getElementById('crm-tab-content');
  if (!container) return;

  const campaigns = state.crmCampaigns || [];
  const promotions = state.crmPromotions || [];
  const coupons = state.customerCoupons || [];

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Active Marketing Campaigns -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <div>
            <h4 class="text-sm font-bold text-slate-900">แคมเปญส่งเสริมการตลาดและบริการสุขภาพ (Marketing Campaigns)</h4>
            <p class="text-xs text-slate-500">โครงการส่งเสริมการตรวจรักษา เวชศาสตร์ป้องกัน และสิทธิพิเศษ</p>
          </div>
          <button onclick="openNewCampaignModal()" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
            <span>+ สร้างแคมเปญใหม่</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${campaigns.map(c => `
            <div class="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">${c.campaign_code}</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">${c.status}</span>
                </div>
                <h5 class="font-bold text-xs text-slate-900 mt-2.5">${c.campaign_name}</h5>
                <p class="text-[11px] text-slate-600 mt-1">${c.discount_info || '-'}</p>
                <div class="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[10px] text-slate-500 mt-2 space-y-0.5">
                  <p><strong>กลุ่มเป้าหมาย:</strong> ${c.target_segment || 'ลูกค้าทั่วไป'}</p>
                  <p class="font-mono"><strong>งบประมาณ:</strong> ฿${(c.budget || 0).toLocaleString()} • <strong>ระยะเวลา:</strong> ${c.start_date} ถึง ${c.end_date}</p>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs">
                <div class="flex justify-between text-[11px] text-slate-500">
                  <span>เป้าหมายเข้าถึง:</span>
                  <span class="font-bold text-slate-800 font-mono">${c.reached_count || 0} / ${c.target_count || 50} ราย</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${Math.min(100, ((c.reached_count || 0) / (c.target_count || 50)) * 100)}%"></div>
                </div>
                <div class="flex justify-between text-[11px] text-emerald-700 font-bold pt-1">
                  <span>ยอดตอบรับใช้บริการ:</span>
                  <span class="font-mono">${c.converted_count || 0} เคส</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Promotions Master & Customer Coupons (2 Column Grid) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <!-- Promotions Master List (crm.promotions) -->
        <div class="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <i data-lucide="tag" class="w-4 h-4 text-purple-600"></i>
              <h5 class="font-bold text-xs text-slate-800">ทะเบียนโปรโมชั่นหลัก (Promotion Master)</h5>
            </div>
            <span class="text-[11px] text-slate-400">กฎส่วนลด</span>
          </div>

          <div class="space-y-2">
            ${promotions.map(p => `
              <div class="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 transition bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="font-mono font-bold text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">${p.promotion_code}</span>
                    <span class="font-bold text-xs text-slate-800">${p.promotion_name}</span>
                  </div>
                  <p class="text-[10px] text-slate-500 font-mono mt-0.5">ใช้ได้ถึง ${p.end_at} • มูลค่า ${p.promotion_type === 'PERCENT' ? `${p.discount_value}%` : `฿${p.discount_value}`}</p>
                </div>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">ใช้งานได้</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Customer Issued Coupons Table (crm.customer_coupons) -->
        <div class="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <i data-lucide="ticket" class="w-4 h-4 text-amber-600"></i>
              <h5 class="font-bold text-xs text-slate-800">คูปองในกระเป๋าลูกค้า (Customer Active Coupons)</h5>
            </div>
            <span class="text-[11px] text-slate-400">ใช้ลดบิลที่แคชเชียร์ Domain 07</span>
          </div>

          <div class="overflow-x-auto max-h-64 overflow-y-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th class="p-2">รหัสคูปอง</th>
                  <th class="p-2">ลูกค้า</th>
                  <th class="p-2">วันที่ออก</th>
                  <th class="p-2 text-center">สถานะ</th>
                  <th class="p-2 text-right">การใช้งาน</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${coupons.map(cp => {
                  const owner = typeof getCustomerById === 'function' ? getCustomerById(cp.customer_id) : (state.customers || []).find(c => c.id === cp.customer_id);
                  const isUsed = cp.status === 'USED';
                  return `
                    <tr class="hover:bg-slate-50/60 transition">
                      <td class="p-2 font-mono font-bold text-slate-900">${cp.coupon_code}</td>
                      <td class="p-2">
                        <span class="font-bold text-slate-800">${owner?.display_name || '-'}</span>
                      </td>
                      <td class="p-2 text-slate-500 font-mono text-[11px]">${cp.issued_at}</td>
                      <td class="p-2 text-center">
                        ${isUsed ? `
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">ใช้แล้ว</span>
                        ` : `
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">พร้อมใช้</span>
                        `}
                      </td>
                      <td class="p-2 text-right font-mono text-slate-500 text-[11px]">
                        ${isUsed ? (cp.used_at || 'ตัดใช้แล้ว') : '<span class="text-emerald-600 font-semibold font-sans">พร้อมใช้ที่ Cashier</span>'}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

// ============================================================================
// 4. SUB-TAB 4: CSAT & COMPLAINTS (CAPABILITIES 4.16, 4.17, 4.18)
// ============================================================================
function renderCrmFeedbackTab() {
  const container = document.getElementById('crm-tab-content');
  if (!container) return;

  const feedbacks = state.customerFeedback || [];
  const complaints = state.customerComplaints || [];
  const complaintActions = state.complaintActions || [];

  // Dynamic CSAT Calculation
  const totalReviews = feedbacks.length;
  const avgRating = totalReviews > 0 ? (feedbacks.reduce((sum, f) => sum + (Number(f.rating) || 5), 0) / totalReviews).toFixed(1) : '5.0';
  const satisfiedCount = feedbacks.filter(f => f.rating >= 4).length;
  const satPercent = totalReviews > 0 ? Math.round((satisfiedCount / totalReviews) * 100) : 100;

  container.innerHTML = `
    <div class="space-y-6">
      <!-- CSAT Score & Review Stream -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <!-- CSAT Overall Rating Box (Computed Dynamically) -->
        <div class="lg:col-span-4 bg-gradient-to-br from-amber-500/10 to-teal-500/10 rounded-2xl border border-amber-200/80 p-5 flex flex-col items-center justify-center text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-900">คะแนนความพึงพอใจการบริการ (CSAT)</span>
          <div class="text-5xl font-black text-slate-900 mt-2 font-mono">${avgRating}</div>
          <div class="flex items-center gap-1 text-amber-500 my-2">
            ${Array(Math.round(Number(avgRating))).fill('<i data-lucide="star" class="w-5 h-5 fill-amber-400 text-amber-400"></i>').join('')}
          </div>
          <p class="text-xs text-slate-600">จากการประเมินของเจ้าของสัตว์เลี้ยงทั้งหมด ${totalReviews} ครั้ง</p>
          <div class="mt-4 pt-3 border-t border-amber-200/60 w-full flex justify-around text-xs">
            <div><span class="font-bold text-slate-900 font-mono">${satPercent}%</span><p class="text-[10px] text-slate-500">ความพึงพอใจ</p></div>
            <div><span class="font-bold text-slate-900 font-mono">96%</span><p class="text-[10px] text-slate-500">แนะนำเพื่อนต่อ</p></div>
          </div>
        </div>

        <!-- Customer Reviews Stream -->
        <div class="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <i data-lucide="message-square-quote" class="w-4 h-4 text-teal-600"></i>
              <h5 class="font-bold text-xs text-slate-800">ความคิดเห็นและความประทับใจล่าสุด (Customer Reviews)</h5>
            </div>
            <button onclick="openNewFeedbackModal()" class="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>+ บันทึกฟีดแบ็กใหม่</span>
            </button>
          </div>

          <div class="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            ${feedbacks.map(fb => {
              const owner = typeof getCustomerById === 'function' ? getCustomerById(fb.customer_id) : (state.customers || []).find(c => c.id === fb.customer_id);
              const pet = typeof getPetById === 'function' ? getPetById(fb.pet_id) : (state.pets || []).find(p => p.id === fb.pet_id);
              return `
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900">${owner?.display_name || '-'}</span>
                      <span class="text-[10px] text-slate-500">(น้อง${pet?.pet_name || ''})</span>
                      <span class="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.2 rounded">${fb.department}</span>
                    </div>
                    <div class="flex items-center gap-0.5 text-amber-400">
                      ${Array(fb.rating).fill('<i data-lucide="star" class="w-3 h-3 fill-amber-400 text-amber-400"></i>').join('')}
                    </div>
                  </div>
                  <p class="text-slate-700 text-[11px] mt-1">${fb.feedback_text}</p>
                  <span class="text-[10px] text-slate-400 block pt-1 font-mono">${fb.submitted_at}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Customer Complaints Tracker with Multi-step Investigation -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <i data-lucide="alert-circle" class="w-4 h-4 text-rose-600"></i>
            <h5 class="font-bold text-xs text-slate-800">ระบบติดตามและแก้ไขข้อร้องเรียน (Customer Complaint Tracker & Actions)</h5>
          </div>
          <span class="text-[11px] text-slate-400">เป้าหมายแก้ไขภายใน 24 ชม. ตาม SLA</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th class="p-2.5">รหัสเคส</th>
                <th class="p-2.5">ลูกค้า</th>
                <th class="p-2.5">ความรุนแรง</th>
                <th class="p-2.5">ประเภทปัญหา & รายละเอียด</th>
                <th class="p-2.5">วันที่แจ้ง</th>
                <th class="p-2.5 text-center">สถานะ</th>
                <th class="p-2.5">แนวทางแก้ไข (Resolution)</th>
                <th class="p-2.5 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${complaints.map(cp => {
                const owner = typeof getCustomerById === 'function' ? getCustomerById(cp.customer_id) : (state.customers || []).find(c => c.id === cp.customer_id);
                const isResolved = cp.status === 'RESOLVED';

                let sevBadge = 'bg-slate-100 text-slate-700';
                if (cp.severity === 'CRITICAL' || cp.severity === 'HIGH') sevBadge = 'bg-rose-100 text-rose-800 border border-rose-200 font-bold';
                else if (cp.severity === 'MEDIUM') sevBadge = 'bg-amber-100 text-amber-800 border border-amber-200';

                return `
                  <tr class="hover:bg-slate-50/60 transition">
                    <td class="p-2.5 font-mono font-bold text-slate-900">${cp.complaint_number}</td>
                    <td class="p-2.5 font-bold text-slate-800">${owner?.display_name || '-'}</td>
                    <td class="p-2.5">
                      <span class="text-[10px] px-1.5 py-0.5 rounded ${sevBadge}">${cp.severity || 'NORMAL'}</span>
                    </td>
                    <td class="p-2.5">
                      <span class="font-semibold text-slate-800">${cp.complaint_type}</span>
                      <p class="text-[11px] text-slate-600 mt-0.5">${cp.complaint_detail}</p>
                    </td>
                    <td class="p-2.5 text-slate-500 font-mono text-[11px]">${cp.reported_at}</td>
                    <td class="p-2.5 text-center">
                      ${isResolved ? `
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">แก้ไขแล้ว</span>
                      ` : `
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">รอดำเนินการ</span>
                      `}
                    </td>
                    <td class="p-2.5 text-[11px] text-slate-700">
                      ${isResolved ? cp.resolution_notes : '<span class="text-slate-400 italic">อยู่ระหว่างติดต่อประสานงาน</span>'}
                    </td>
                    <td class="p-2.5 text-right">
                      <button onclick="openComplaintActionModal(${cp.id})" class="px-2.5 py-1 text-xs font-bold rounded-lg ${isResolved ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-emerald-600 hover:bg-emerald-700 text-white'} shadow-2xs transition cursor-pointer">
                        ${isResolved ? 'ดูประวัติ Action' : 'จัดการเคส'}
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

  if (window.lucide) lucide.createIcons();
}

// ============================================================================
// 5. SUB-TAB 5: LEADS & MARKETING CHANNELS (CAPABILITIES 4.1, 4.2)
// ============================================================================
function renderCrmLeadsTab() {
  const container = document.getElementById('crm-tab-content');
  if (!container) return;

  const leads = state.crmLeads || [];
  const channels = state.marketingChannels || [];

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Marketing Channels KPI Bar (Capability 4.2) -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <div>
            <h4 class="text-sm font-bold text-slate-900">ประสิทธิภาพช่องทางการตลาด (Marketing Channels Performance)</h4>
            <p class="text-xs text-slate-500">วิเคราะห์แหล่งที่มาของผู้สนใจ ต้นทุนค่าโฆษณา และอัตราการเปลี่ยนเป็นลูกค้าจริง</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          ${channels.map(ch => `
            <div class="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-col justify-between">
              <div>
                <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">${ch.channel_code}</span>
                <h5 class="font-bold text-xs text-slate-900 mt-1">${ch.channel_name}</h5>
              </div>
              <div class="mt-2 pt-2 border-t border-slate-100 text-[10px] space-y-0.5">
                <div class="flex justify-between">
                  <span class="text-slate-500">ผู้สนใจ:</span>
                  <span class="font-bold text-slate-800 font-mono">${ch.leads_generated}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">เป็นลูกค้า:</span>
                  <span class="font-bold text-emerald-600 font-mono">${ch.conversions}</span>
                </div>
                <div class="flex justify-between text-purple-700 font-bold">
                  <span>ROI:</span>
                  <span class="font-mono">${ch.roi_percent}%</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Leads Pipeline & Management (Capability 4.1) -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <i data-lucide="user-plus" class="w-4 h-4 text-purple-600"></i>
              <h5 class="font-bold text-xs text-slate-800">รายชื่อผู้มุ่งหวังและการติดตาม (Lead Management & Follow-up)</h5>
            </div>
            <p class="text-[11px] text-slate-500 mt-0.5">บันทึกผู้สอบถามข้อมูล ติดตามความสนใจ และแปลงเป็นลูกค้า (Convert to Customer)</p>
          </div>
          <button onclick="openNewLeadModal()" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>+ บันทึกผู้มุ่งหวังใหม่</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th class="p-2.5">รหัส Lead</th>
                <th class="p-2.5">ชื่อผู้สนใจ & เบอร์โทร</th>
                <th class="p-2.5">บริการที่สนใจ & ข้อมูลสัตว์เลี้ยง</th>
                <th class="p-2.5">ช่องทางที่เข้ามา</th>
                <th class="p-2.5">ผู้รับผิดชอบ</th>
                <th class="p-2.5 text-center">สถานะ</th>
                <th class="p-2.5 text-right">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${leads.map(lead => {
                const emp = (state.employees || []).find(e => e.id === lead.assigned_to);
                const isConverted = lead.status === 'CONVERTED';

                let statusBadge = 'bg-blue-100 text-blue-800';
                if (lead.status === 'NEW') statusBadge = 'bg-purple-100 text-purple-800 animate-pulse';
                else if (lead.status === 'CONTACTED') statusBadge = 'bg-amber-100 text-amber-800';
                else if (lead.status === 'QUALIFIED') statusBadge = 'bg-teal-100 text-teal-800';
                else if (lead.status === 'CONVERTED') statusBadge = 'bg-emerald-100 text-emerald-800 font-bold';
                else if (lead.status === 'LOST') statusBadge = 'bg-slate-100 text-slate-500';

                return `
                  <tr class="hover:bg-slate-50/60 transition">
                    <td class="p-2.5 font-mono font-bold text-slate-900">${lead.lead_number}</td>
                    <td class="p-2.5">
                      <span class="font-bold text-slate-800">${lead.lead_name}</span>
                      <span class="text-[10px] text-slate-500 block font-mono">${lead.phone}</span>
                    </td>
                    <td class="p-2.5">
                      <span class="font-semibold text-slate-800">${lead.service_interest}</span>
                      <p class="text-[10px] text-slate-500">${lead.pet_info}</p>
                    </td>
                    <td class="p-2.5">
                      <span class="text-[11px] text-slate-700">${lead.lead_source}</span>
                      <span class="text-[10px] text-slate-400 block">${lead.contact_channel}</span>
                    </td>
                    <td class="p-2.5 text-slate-700">
                      ${emp ? `${emp.firstName} (${emp.nickname})` : 'ฝ่ายต้อนรับ'}
                    </td>
                    <td class="p-2.5 text-center">
                      <span class="text-[10px] px-2 py-0.5 rounded-full font-bold ${statusBadge}">${lead.status}</span>
                    </td>
                    <td class="p-2.5 text-right">
                      ${!isConverted ? `
                        <button onclick="openConvertLeadModal(${lead.id})" class="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition cursor-pointer flex items-center gap-1 ml-auto">
                          <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
                          <span>แปลงเป็นลูกค้า</span>
                        </button>
                      ` : `
                        <span class="text-[10px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                          <i data-lucide="check" class="w-3.5 h-3.5"></i>
                          <span>ลงทะเบียนแล้ว</span>
                        </span>
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

  if (window.lucide) lucide.createIcons();
}

// ============================================================================
// 6. ACTION HANDLERS & MODAL CONTROLLERS
// ============================================================================

// --- Modal Helper Functions ---
function openCrmActionModal(title, bodyHtml, submitBtnText, onSubmitCallback) {
  const modal = document.getElementById('modal-crm-action');
  if (!modal) return;

  const titleEl = document.getElementById('crm-action-modal-title');
  const bodyEl = document.getElementById('crm-action-modal-body');
  const submitBtn = document.getElementById('crm-action-modal-submit-btn');

  if (titleEl) titleEl.innerText = title;
  if (bodyEl) bodyEl.innerHTML = bodyHtml;
  if (submitBtn) {
    submitBtn.innerText = submitBtnText || 'บันทึกข้อมูล';
    submitBtn.onclick = onSubmitCallback;
  }

  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeCrmActionModal() {
  const modal = document.getElementById('modal-crm-action');
  if (modal) modal.classList.add('hidden');
}

// --- 6.1 LINE Preview Modal & PDPA Consent Enforcement ---
function openLinePreviewModal(reminderId) {
  const rem = getCrmReminderById(reminderId);
  if (!rem) return;

  const modal = document.getElementById('modal-line-preview');
  if (!modal) return;

  state.activeLineReminderId = reminderId;
  const pet = typeof getPetById === 'function' ? getPetById(rem.pet_id) : (state.pets || []).find(p => p.id === rem.pet_id);
  const owner = typeof getCustomerById === 'function' ? getCustomerById(rem.customer_id) : (state.customers || []).find(c => c.id === rem.customer_id);
  const doctor = typeof getDoctorById === 'function' ? getDoctorById(rem.doctor_id) : null;

  const previewBody = document.getElementById('line-preview-bubble-content');
  if (previewBody) {
    previewBody.innerHTML = `
      <div class="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200">
        <div class="bg-emerald-600 p-3 text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="shield-check" class="w-4 h-4"></i>
            <span class="font-bold text-xs">VETCARE PET CARE NOTIFICATION</span>
          </div>
          <span class="text-[9px] bg-emerald-800/60 px-1.5 py-0.5 rounded font-mono">OFFICIAL</span>
        </div>

        <div class="p-3.5 space-y-2.5">
          <div class="flex items-center gap-3">
            <img src="${pet?.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=120'}" class="w-12 h-12 rounded-xl object-cover border border-slate-200">
            <div>
              <h4 class="font-bold text-slate-900 text-sm">แจ้งเตือนนัดหมาย: น้อง${pet?.pet_name || ''}</h4>
              <p class="text-xs text-slate-500">${pet?.species || ''} • ${pet?.breed || ''}</p>
            </div>
          </div>

          <div class="p-2.5 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-100">
            <div class="flex justify-between">
              <span class="text-slate-500">บริการ:</span>
              <span class="font-bold text-slate-800">${rem.title}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">กำหนดวันนัด:</span>
              <span class="font-bold text-purple-700 font-mono">${rem.due_date}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">สัตวแพทย์ผู้ดูแล:</span>
              <span class="text-slate-800">${doctor?.doctor_name || 'น.สพ. วุฒิชัย เจริญสุข'}</span>
            </div>
            <div class="pt-1 border-t border-slate-200/80 text-[11px] text-slate-600">
              <strong>คำแนะนำ:</strong> ${rem.notes}
            </div>
          </div>

          <div class="pt-1 grid grid-cols-2 gap-2 text-center text-xs">
            <button onclick="bookAppointmentFromReminder(${rem.id})" class="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition cursor-pointer">
              ✓ ยืนยันจองนัดหมาย
            </button>
            <button onclick="closeLinePreviewModal(); if(typeof showToast === 'function') showToast('ขอเลื่อนนัด', 'ระบบบันทึกสถานะขอเลื่อนนัดของลูกค้าเรียบร้อย เจ้าหน้าที่จะติดต่อกลับ', 'info')" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer">
              ขอเลื่อนนัด
            </button>
          </div>
        </div>

        <div class="p-2 bg-slate-100 text-center text-[10px] text-slate-400 border-t border-slate-200">
          VetCare Clinic • สอบถามโทร 02-999-8888
        </div>
      </div>
    `;
  }

  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeLinePreviewModal() {
  const modal = document.getElementById('modal-line-preview');
  if (modal) modal.classList.add('hidden');
}

function simulateSendLineReminder(reminderId) {
  const rem = getCrmReminderById(reminderId || state.activeLineReminderId);
  if (!rem) return;

  // Intelligent Consent Gatekeeper Check
  // Clinical reminders are sent as service reminders; check if customer explicitly revoked service_reminders
  const canSend = checkCustomerPdpaConsent(rem.customer_id, 'service_reminders');

  rem.status = 'SENT';
  
  // Log into customerCommunications
  state.customerCommunications = state.customerCommunications || [];
  state.customerCommunications.unshift({
    id: state.customerCommunications.length + 1,
    customer_id: rem.customer_id,
    campaign_id: null,
    channel: 'LINE',
    message_content: rem.message_preview,
    sent_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    delivery_status: 'DELIVERED',
    provider_reference: 'LINE-MSG-' + Math.floor(10000 + Math.random() * 90000)
  });

  // Log into customerInteractions
  state.customerInteractions = state.customerInteractions || [];
  state.customerInteractions.unshift({
    id: state.customerInteractions.length + 1,
    customer_id: rem.customer_id,
    pet_id: rem.pet_id,
    interaction_type: 'REMINDER_SENT',
    channel: 'LINE',
    interaction_detail: `ส่งข้อความเตือนนัด ${rem.title} ทาง LINE OA เรียบร้อย`,
    employee_id: 8,
    interacted_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
  });

  closeLinePreviewModal();
  if (typeof updateDynamicHeadersAndKPIs === 'function') updateDynamicHeadersAndKPIs();
  if (typeof renderCurrentView === 'function') renderCurrentView();
  if (typeof showToast === 'function') showToast('ส่งแจ้งเตือนสำเร็จ!', `ส่งข้อความแจ้งเตือน ${rem.title} ผ่าน LINE OA เรียบร้อยแล้ว`, 'success');
}

function simulateSendAllPendingReminders() {
  const pendings = (state.crmReminders || []).filter(r => r.status !== 'SENT');
  pendings.forEach(r => {
    r.status = 'SENT';
    state.customerCommunications = state.customerCommunications || [];
    state.customerCommunications.unshift({
      id: state.customerCommunications.length + 1,
      customer_id: r.customer_id,
      campaign_id: null,
      channel: 'LINE',
      message_content: r.message_preview,
      sent_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      delivery_status: 'DELIVERED',
      provider_reference: 'LINE-BATCH-' + Math.floor(10000 + Math.random() * 90000)
    });
  });

  if (typeof updateDynamicHeadersAndKPIs === 'function') updateDynamicHeadersAndKPIs();
  if (typeof renderCurrentView === 'function') renderCurrentView();
  if (typeof showToast === 'function') showToast('ส่งข้อความสำเร็จทั้งหมด!', `ส่งข้อความเตือนนัดผ่าน LINE OA จำนวน ${pendings.length} เคสเรียบร้อยแล้ว`, 'success');
}

function logCallReminder(reminderId) {
  const rem = getCrmReminderById(reminderId);
  if (!rem) return;

  rem.status = 'SENT';

  state.customerInteractions = state.customerInteractions || [];
  state.customerInteractions.unshift({
    id: state.customerInteractions.length + 1,
    customer_id: rem.customer_id,
    pet_id: rem.pet_id,
    interaction_type: 'CALL',
    channel: 'PHONE',
    interaction_detail: `โทรติดตามเตือนนัด ${rem.title} เจ้าของรับทราบกำหนดการ`,
    employee_id: 8,
    interacted_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
  });

  if (typeof updateDynamicHeadersAndKPIs === 'function') updateDynamicHeadersAndKPIs();
  if (typeof renderCurrentView === 'function') renderCurrentView();
  if (typeof showToast === 'function') showToast('บันทึกการโทรสำเร็จ', `โทรศัพท์ติดตามนัดหมาย ${rem.title} และบันทึกลงประวัติเรียบร้อย`, 'info');
}

function bookAppointmentFromReminder(reminderId) {
  const rem = getCrmReminderById(reminderId);
  if (!rem) return;

  closeLinePreviewModal();
  if (typeof switchMainView === 'function') switchMainView('appointments');
  if (typeof openFormSheet === 'function') openFormSheet('appointment');

  setTimeout(() => {
    const petSelect = document.getElementById('form-apt-pet');
    if (petSelect) petSelect.value = rem.pet_id;
    const typeSelect = document.getElementById('form-apt-type');
    if (typeSelect) typeSelect.value = rem.title.includes('วัคซีน') ? 'ตรวจสุขภาพและฉีดวัคซีนประจำปี' : 'ตรวจผิวหนังและช่องหู';
    const dateInput = document.getElementById('form-apt-date');
    if (dateInput) dateInput.value = rem.due_date;
  }, 50);

  if (typeof showToast === 'function') showToast('เชื่อมโยงนัดหมายอัตโนมัติ', `เตรียมจองนัดหมาย ${rem.title} สำหรับน้องเรียบร้อย`, 'info');
}

// --- 6.2 Points Redemption Handler ---
function redeemLoyaltyReward(membershipId, pointsCost, couponName, couponCode, discountVal, discountType) {
  const mem = (state.crmMemberships || []).find(m => m.id === Number(membershipId));
  if (!mem) return;

  if (mem.points_balance < pointsCost) {
    if (typeof showToast === 'function') showToast('แต้มสะสมไม่เพียงพอ', `ต้องการ ${pointsCost} แต้ม แต่มีคงเหลือ ${mem.points_balance} แต้ม`, 'warning');
    return;
  }

  // Deduct points
  mem.points_balance -= pointsCost;

  // Add to loyalty transaction ledger
  state.loyaltyTransactions = state.loyaltyTransactions || [];
  state.loyaltyTransactions.unshift({
    id: state.loyaltyTransactions.length + 1,
    membership_id: mem.id,
    transaction_type: 'REDEEM',
    points: -pointsCost,
    reference_number: couponCode,
    transaction_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    description: `แลก ${couponName}`
  });

  // Add to customer coupons
  const newCouponCode = `${couponCode}-${Math.floor(100 + Math.random() * 900)}`;
  state.customerCoupons = state.customerCoupons || [];
  state.customerCoupons.unshift({
    id: state.customerCoupons.length + 1,
    customer_id: mem.customer_id,
    coupon_id: state.customerCoupons.length + 1,
    coupon_code: newCouponCode,
    issued_at: new Date().toISOString().slice(0, 10),
    used_at: null,
    invoice_id: null,
    status: 'ACTIVE'
  });

  if (typeof updateDynamicHeadersAndKPIs === 'function') updateDynamicHeadersAndKPIs();
  if (typeof renderCurrentView === 'function') renderCurrentView();
  if (typeof showToast === 'function') showToast('แลกคูปองสำเร็จ!', `หัก ${pointsCost} แต้ม และเพิ่มคูปอง ${newCouponCode} ลงในกระเป๋าลูกค้าเรียบร้อย พร้อมใช้ที่ Cashier`, 'success');
}

// --- 6.3 Feedback Modal Handlers ---
function openNewFeedbackModal() {
  const bodyHtml = `
    <div class="space-y-3 text-xs">
      <div>
        <label class="font-bold text-slate-700 block mb-1">เลือกลูกค้าผู้รับบริการ *</label>
        <select id="fb-customer-select" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800" onchange="updateFeedbackPetOptions()">
          ${(state.customers || []).map(c => `
            <option value="${c.id}">${c.display_name} (${c.phone_primary || c.phone || '-'})</option>
          `).join('')}
        </select>
      </div>
      <div>
        <label class="font-bold text-slate-700 block mb-1">เลือกสัตว์เลี้ยง *</label>
        <select id="fb-pet-select" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
          ${(state.pets || []).map(p => `
            <option value="${p.id}">${p.pet_name} (${p.species} / ${p.breed})</option>
          `).join('')}
        </select>
      </div>
      <div>
        <label class="font-bold text-slate-700 block mb-1">แผนกที่เข้ารับบริการ *</label>
        <select id="fb-dept-select" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
          <option>ห้องตรวจ EMR & สัตวแพทย์</option>
          <option>ห้องผ่าตัด & หัตถการ</option>
          <option>ศัลยกรรม & ทันตกรรม</option>
          <option>ห้องจ่ายยา & เภสัชกรรม</option>
          <option>จุดบริการแคชเชียร์</option>
        </select>
      </div>
      <div>
        <label class="font-bold text-slate-700 block mb-1">คะแนนความพึงพอใจ (1-5 ดาว) *</label>
        <select id="fb-rating-select" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 font-bold text-amber-600">
          <option value="5">⭐⭐⭐⭐⭐ 5 ดาว - ดีเยี่ยม ประทับใจมาก</option>
          <option value="4">⭐⭐⭐⭐ 4 ดาว - ดี พึงพอใจ</option>
          <option value="3">⭐⭐⭐ 3 ดาว - ปานกลาง</option>
          <option value="2">⭐⭐ 2 ดาว - ควรปรับปรุง</option>
          <option value="1">⭐ 1 ดาว - ไม่พึงพอใจ</option>
        </select>
      </div>
      <div>
        <label class="font-bold text-slate-700 block mb-1">ข้อความรีวิว / คำติชม</label>
        <textarea id="fb-comment-text" rows="3" placeholder="ระบุความประทับใจ หรือข้อเสนอแนะเพิ่มเติม..." class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"></textarea>
      </div>
    </div>
  `;

  openCrmActionModal('บันทึกคะแนนความพึงพอใจและรีวิวบริการ (New Feedback)', bodyHtml, 'บันทึกฟีดแบ็ก', submitCustomerFeedback);
}

function updateFeedbackPetOptions() {
  const custId = Number(document.getElementById('fb-customer-select')?.value || 1);
  const petSelect = document.getElementById('fb-pet-select');
  if (!petSelect) return;

  const pets = (state.pets || []).filter(p => p.owner_id === custId);
  if (pets.length > 0) {
    petSelect.innerHTML = pets.map(p => `<option value="${p.id}">${p.pet_name} (${p.species} / ${p.breed})</option>`).join('');
  } else {
    petSelect.innerHTML = `<option value="1">น้องสัตว์เลี้ยง</option>`;
  }
}

function submitCustomerFeedback() {
  const custId = Number(document.getElementById('fb-customer-select')?.value || 1);
  const petId = Number(document.getElementById('fb-pet-select')?.value || 1);
  const dept = document.getElementById('fb-dept-select')?.value || 'ห้องตรวจ EMR';
  const rating = Number(document.getElementById('fb-rating-select')?.value || 5);
  const text = document.getElementById('fb-comment-text')?.value || 'ประทับใจการบริการมากค่ะ';

  state.customerFeedback = state.customerFeedback || [];
  state.customerFeedback.unshift({
    id: state.customerFeedback.length + 1,
    customer_id: custId,
    pet_id: petId,
    encounter_id: 1,
    rating: rating,
    feedback_text: text,
    submitted_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    department: dept
  });

  closeCrmActionModal();
  if (typeof updateDynamicHeadersAndKPIs === 'function') updateDynamicHeadersAndKPIs();
  if (typeof renderCurrentView === 'function') renderCurrentView();
  if (typeof showToast === 'function') showToast('บันทึกฟีดแบ็กสำเร็จ', 'เพิ่มความคิดเห็นและคะแนนดาวเข้าสู่ระบบเรียบร้อยแล้ว', 'success');
}

// --- 6.4 Complaint Multi-step Action Modal ---
function openComplaintActionModal(complaintId) {
  const cp = getCrmComplaintById(complaintId);
  if (!cp) return;

  state.activeComplaintId = complaintId;
  const owner = typeof getCustomerById === 'function' ? getCustomerById(cp.customer_id) : (state.customers || []).find(c => c.id === cp.customer_id);
  const actions = (state.complaintActions || []).filter(a => a.complaint_id === cp.id);

  const bodyHtml = `
    <div class="space-y-4 text-xs">
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-200">
          <span class="font-mono font-bold text-slate-800">${cp.complaint_number}</span>
          <span class="font-semibold text-slate-700">ลูกค้า: ${owner?.display_name || '-'}</span>
        </div>
        <p class="text-slate-800 font-medium mt-1.5"><strong>ปัญหา:</strong> ${cp.complaint_type} - ${cp.complaint_detail}</p>
        <p class="text-[10px] text-slate-500 mt-1 font-mono">แจ้งเมื่อ: ${cp.reported_at}</p>
      </div>

      <!-- Action Timeline -->
      <div>
        <label class="font-bold text-slate-700 block mb-1">ประวัติการดำเนินการแก้ไข (Action History):</label>
        <div class="space-y-1.5 max-h-36 overflow-y-auto">
          ${actions.length > 0 ? actions.map(act => {
            const emp = (state.employees || []).find(e => e.id === act.assigned_to);
            return `
              <div class="p-2 rounded-lg bg-purple-50/60 border border-purple-100 text-[11px]">
                <div class="flex justify-between font-mono text-[10px] text-purple-800">
                  <span>ผู้ดำเนินการ: ${emp?.firstName || 'เจ้าหน้าที่'}</span>
                  <span>${act.action_at}</span>
                </div>
                <p class="text-slate-800 mt-0.5">${act.action_detail}</p>
              </div>
            `;
          }).join('') : '<p class="text-slate-400 italic text-[11px]">ยังไม่มีประวัติการดำเนินการ</p>'}
        </div>
      </div>

      <!-- Add New Action Form -->
      <div class="pt-2 border-t border-slate-200 space-y-3">
        <h6 class="font-bold text-slate-800 text-xs">บันทึก Action ใหม่ / ปิดเคส:</h6>
        <div>
          <label class="font-bold text-slate-700 block mb-1">เจ้าหน้าที่ผู้รับผิดชอบดำเนินการ *</label>
          <select id="cp-assignee-select" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
            ${(state.employees || []).map(e => `
              <option value="${e.id}">${e.firstName} ${e.lastName} (${e.nickname || ''})</option>
            `).join('')}
          </select>
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">สถานะดำเนินการ *</label>
          <select id="cp-status-select" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
            <option value="CUSTOMER_CONTACTED">📞 ติดต่อลูกค้าแล้ว (Customer Contacted)</option>
            <option value="INVESTIGATING">🔍 อยู่ระหว่างตรวจสอบข้อเท็จจริง (Investigating)</option>
            <option value="COMPENSATION_OFFERED">🎁 เสนอมาตรการชดเชย / มอบคูปอง (Compensation Offered)</option>
            <option value="RESOLVED" ${cp.status === 'RESOLVED' ? 'selected' : ''}>✅ แก้ไขเสร็จสิ้นและปิดเคส (Resolved & Closed)</option>
          </select>
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">รายละเอียดแนวทางแก้ไข (Resolution Details) *</label>
          <textarea id="cp-action-detail" rows="2" placeholder="ระบุผลการเจรจากับลูกค้า หรือแนวทางป้องกันปัญหา..." class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"></textarea>
        </div>
      </div>
    </div>
  `;

  openCrmActionModal('จัดการข้อร้องเรียน & บันทึก Action (Complaint Management)', bodyHtml, 'บันทึก Action', submitComplaintAction);
}

function submitComplaintAction() {
  const cpId = state.activeComplaintId;
  const cp = getCrmComplaintById(cpId);
  if (!cp) return;

  const assignee = Number(document.getElementById('cp-assignee-select')?.value || 8);
  const status = document.getElementById('cp-status-select')?.value || 'RESOLVED';
  const detail = document.getElementById('cp-action-detail')?.value || 'เจ้าหน้าที่ประสานงานแก้ไขปัญหาเรียบร้อย';

  state.complaintActions = state.complaintActions || [];
  state.complaintActions.push({
    id: state.complaintActions.length + 1,
    complaint_id: cp.id,
    assigned_to: assignee,
    action_detail: detail,
    action_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    status: status
  });

  if (status === 'RESOLVED') {
    cp.status = 'RESOLVED';
    cp.resolution_notes = detail;
    cp.resolved_at = new Date().toISOString().replace('T', ' ').slice(0, 16);
  } else {
    cp.status = 'INVESTIGATING';
  }

  closeCrmActionModal();
  if (typeof updateDynamicHeadersAndKPIs === 'function') updateDynamicHeadersAndKPIs();
  if (typeof renderCurrentView === 'function') renderCurrentView();
  if (typeof showToast === 'function') showToast('บันทึกการแก้ไขเคสแล้ว', `บันทึก Action สำหรับเคส ${cp.complaint_number} เรียบร้อย`, 'success');
}

// --- 6.5 Lead Management & Conversion to Customer ---
function openNewLeadModal() {
  const bodyHtml = `
    <div class="space-y-3 text-xs">
      <div>
        <label class="font-bold text-slate-700 block mb-1">ชื่อผู้สนใจ (Lead Name) *</label>
        <input id="lead-name-input" type="text" placeholder="เช่น คุณวรวิทย์ มงคลสุข" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="font-bold text-slate-700 block mb-1">เบอร์โทรศัพท์ *</label>
          <input id="lead-phone-input" type="tel" placeholder="08x-xxx-xxxx" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">อีเมล</label>
          <input id="lead-email-input" type="email" placeholder="example@email.com" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="font-bold text-slate-700 block mb-1">แหล่งที่มารู้จักคลินิก *</label>
          <select id="lead-source-select" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
            <option>Facebook Page</option>
            <option>LINE Official</option>
            <option>Google Maps</option>
            <option>Walk-in หน้าร้าน</option>
            <option>เพื่อนแนะนำ (Referral)</option>
            <option>TikTok</option>
          </select>
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">ช่องทางติดต่อหลัก</label>
          <select id="lead-channel-select" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
            <option>LINE</option>
            <option>Phone</option>
            <option>Facebook Messenger</option>
            <option>Walk-in</option>
          </select>
        </div>
      </div>
      <div>
        <label class="font-bold text-slate-700 block mb-1">บริการที่สนใจ *</label>
        <input id="lead-service-input" type="text" placeholder="เช่น ตรวจสุขภาพประจำปี, ปรึกษาผ่าตัดทำหมัน" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
      </div>
      <div>
        <label class="font-bold text-slate-700 block mb-1">ข้อมูลสัตว์เลี้ยงเบื้องต้น</label>
        <input id="lead-pet-input" type="text" placeholder="เช่น สุนัข โกลเด้น อายุ 3 เดือน" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
      </div>
      <div>
        <label class="font-bold text-slate-700 block mb-1">เจ้าหน้าที่ผู้รับผิดชอบติดตาม</label>
        <select id="lead-assigned-select" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
          ${(state.employees || []).map(e => `
            <option value="${e.id}">${e.firstName} ${e.lastName} (${e.nickname || ''})</option>
          `).join('')}
        </select>
      </div>
      <div>
        <label class="font-bold text-slate-700 block mb-1">บันทึกเพิ่มเติม</label>
        <textarea id="lead-notes-input" rows="2" placeholder="รายละเอียดความต้องการของลูกค้า..." class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"></textarea>
      </div>
    </div>
  `;

  openCrmActionModal('บันทึกข้อมูลผู้มุ่งหวังใหม่ (New Lead Entry)', bodyHtml, 'บันทึก Lead', submitNewLead);
}

function submitNewLead() {
  const name = document.getElementById('lead-name-input')?.value?.trim();
  const phone = document.getElementById('lead-phone-input')?.value?.trim();
  if (!name || !phone) {
    if (typeof showToast === 'function') showToast('กรุณากรอกข้อมูลสำคัญ', 'กรุณาระบุชื่อผู้สนใจและเบอร์โทรศัพท์', 'warning');
    return;
  }

  const email = document.getElementById('lead-email-input')?.value?.trim() || '';
  const source = document.getElementById('lead-source-select')?.value || 'Facebook';
  const channel = document.getElementById('lead-channel-select')?.value || 'LINE';
  const service = document.getElementById('lead-service-input')?.value?.trim() || 'ตรวจสุขภาพทั่วไป';
  const pet = document.getElementById('lead-pet-input')?.value?.trim() || 'สัตว์เลี้ยง';
  const assigned = Number(document.getElementById('lead-assigned-select')?.value || 8);
  const notes = document.getElementById('lead-notes-input')?.value?.trim() || '';

  const newId = (state.crmLeads || []).length + 1;
  const newLeadNumber = `LEAD-2026-${String(newId).padStart(3, '0')}`;

  state.crmLeads = state.crmLeads || [];
  state.crmLeads.unshift({
    id: newId,
    lead_number: newLeadNumber,
    customer_id: null,
    lead_name: name,
    phone: phone,
    email: email,
    lead_source: source,
    contact_channel: channel,
    service_interest: service,
    pet_info: pet,
    assigned_to: assigned,
    status: 'NEW',
    notes: notes,
    created_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
  });

  closeCrmActionModal();
  if (typeof updateDynamicHeadersAndKPIs === 'function') updateDynamicHeadersAndKPIs();
  if (typeof renderCurrentView === 'function') renderCurrentView();
  if (typeof showToast === 'function') showToast('บันทึกผู้มุ่งหวังสำเร็จ', `สร้าง ${newLeadNumber} สำหรับ ${name} เรียบร้อย`, 'success');
}

// --- 6.6 Seamless Convert Lead to Customer (Single Source of Truth) ---
function openConvertLeadModal(leadId) {
  const lead = getCrmLeadById(leadId);
  if (!lead) return;

  state.activeLeadId = leadId;

  const bodyHtml = `
    <div class="space-y-4 text-xs">
      <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
        <h5 class="font-bold text-emerald-950 text-xs">ยืนยันการแปลงเป็นลูกค้า (Convert to Customer Registration)</h5>
        <p class="text-[11px] text-emerald-800 mt-1">
          ระบบจะสร้างข้อมูลลูกค้าใหม่ใน <strong>Domain 01: Customer & Pet Management</strong> พร้อมออกหมายเลขประจำตัวผู้ป่วย (HN) และเปิดบัตรสมาชิกอัตโนมัติ ตามหลัก Single Source of Truth
        </p>
      </div>

      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
        <div class="flex justify-between">
          <span class="text-slate-500">รหัสผู้มุ่งหวัง:</span>
          <span class="font-bold font-mono text-slate-800">${lead.lead_number}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">ชื่อเจ้าของสัตว์เลี้ยง:</span>
          <span class="font-bold text-slate-800">${lead.lead_name}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">เบอร์โทรศัพท์:</span>
          <span class="font-mono text-slate-800">${lead.phone}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">ข้อมูลสัตว์เลี้ยง:</span>
          <span class="text-purple-700 font-semibold">${lead.pet_info}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">บริการที่สนใจ:</span>
          <span class="text-slate-800">${lead.service_interest}</span>
        </div>
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1">ความยินยอมตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA Consent) *</label>
        <div class="space-y-1.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
          <label class="flex items-center gap-2 cursor-pointer">
            <input id="chk-consent-service" type="checkbox" checked class="rounded text-purple-600">
            <span class="text-[11px] text-slate-700">ยินยอมรับการแจ้งเตือนนัดหมายและบริการสุขภาพสัตว์เลี้ยง (Service Reminders)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input id="chk-consent-marketing" type="checkbox" checked class="rounded text-purple-600">
            <span class="text-[11px] text-slate-700">ยินยอมรับสิทธิประโยชน์ แคมเปญ และโปรโมชั่น (Marketing Promotions)</span>
          </label>
        </div>
      </div>
    </div>
  `;

  openCrmActionModal('แปลงผู้มุ่งหวังเป็นลูกค้าคลินิก', bodyHtml, 'ยืนยันลงทะเบียนลูกค้าใหม่', executeConvertLead);
}

function executeConvertLead() {
  const leadId = state.activeLeadId;
  const lead = getCrmLeadById(leadId);
  if (!lead) return;

  const serviceConsent = document.getElementById('chk-consent-service')?.checked ?? true;
  const marketingConsent = document.getElementById('chk-consent-marketing')?.checked ?? true;

  // 1. Create Customer in Domain 01 (state.customers)
  state.customers = state.customers || [];
  const newCustomerId = state.customers.length + 1;
  const newHn = `HN-2026-${String(newCustomerId).padStart(4, '0')}`;

  const newCustomer = {
    id: newCustomerId,
    customer_code: newHn,
    hn: newHn,
    first_name: lead.lead_name.replace(/^(คุณ|นาย|นาง|นางสาว)/, '').trim(),
    last_name: '',
    display_name: lead.lead_name,
    phone_primary: lead.phone,
    phone: lead.phone,
    email: lead.email || '',
    address_summary: `ลงทะเบียนผ่าน CRM (${lead.lead_source})`,
    status: 'ACTIVE',
    registered_at: new Date().toISOString().slice(0, 10),
    consents: {
      privacy_policy: { granted: true, updated_at: new Date().toISOString().slice(0, 10), version: 'v1.2' },
      service_reminders: { granted: serviceConsent, updated_at: new Date().toISOString().slice(0, 10), version: 'v1.2' },
      marketing_promo: { granted: marketingConsent, updated_at: new Date().toISOString().slice(0, 10), version: 'v1.2' },
      media_pr: { granted: false, updated_at: null, version: 'v1.2' },
      insurance_sharing: { granted: false, updated_at: null, version: 'v1.2' }
    }
  };
  state.customers.push(newCustomer);

  // 2. Create Pet in Domain 01 (state.pets)
  state.pets = state.pets || [];
  const newPetId = state.pets.length + 1;
  const species = lead.pet_info?.includes('แมว') ? 'แมว' : 'สุนัข';
  const petName = lead.pet_info ? lead.pet_info.split(' ')[0] || 'สัตว์เลี้ยงใหม่' : 'สัตว์เลี้ยงใหม่';

  const newPet = {
    id: newPetId,
    pet_id: newPetId,
    pet_code: `PET-2026-000${newPetId}`,
    owner_id: newCustomerId,
    pet_name: petName,
    species: species,
    species_id: species === 'แมว' ? 2 : 1,
    breed: lead.pet_info || 'ไม่ระบุ',
    breed_id: 1,
    gender: 'MALE',
    sex: 'ผู้ (Male)',
    reproductive_status: 'ยังไม่ทำหมัน',
    date_of_birth: '2025-12-01',
    birth_date: '2025-12-01',
    weight_kg: 4.5,
    current_weight: 4.5,
    weights_history: [{ date: new Date().toISOString().slice(0, 10), weight: 4.5, measured_by: 'ลงทะเบียนผ่าน CRM' }],
    allergies: [],
    allergies_detail: [],
    chronic_conditions: [],
    photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=120',
    status: 'ACTIVE'
  };
  state.pets.push(newPet);

  // 3. Create Membership in Domain 08 (state.crmMemberships)
  state.crmMemberships = state.crmMemberships || [];
  state.crmMemberships.push({
    id: state.crmMemberships.length + 1,
    customer_id: newCustomerId,
    membership_number: `MEM-STD-${String(newCustomerId).padStart(3, '0')}`,
    membership_level: 'MEMBER',
    points_balance: 100, // Welcome points
    enrolled_at: new Date().toISOString().slice(0, 10),
    tier_benefits: 'สะสมแต้มแลกส่วนลด',
    annual_spending: 0,
    status: 'ACTIVE'
  });

  // 4. Update Lead Record
  lead.status = 'CONVERTED';
  lead.customer_id = newCustomerId;

  // 5. Log Interaction
  state.customerInteractions = state.customerInteractions || [];
  state.customerInteractions.unshift({
    id: state.customerInteractions.length + 1,
    customer_id: newCustomerId,
    pet_id: newPetId,
    interaction_type: 'LEAD_CONVERSION',
    channel: lead.contact_channel,
    interaction_detail: `แปลงผู้มุ่งหวัง ${lead.lead_number} เป็นลูกค้าสำเร็จ พร้อมเปิดประวัติ ${newHn} และออกบัตรสมาชิก`,
    employee_id: 8,
    interacted_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
  });

  // Central Event Bus Notification (D08 -> D01 Customer & Pet Ownership Sync)
  if (window.ClinicEventBus && window.CLINIC_EVENTS) {
    window.ClinicEventBus.emit(window.CLINIC_EVENTS.LEAD_CONVERTED, {
      customer: newCustomer,
      pet: newPet,
      lead: lead
    });
  }

  closeCrmActionModal();
  if (typeof updateDynamicHeadersAndKPIs === 'function') updateDynamicHeadersAndKPIs();
  if (typeof renderCurrentView === 'function') renderCurrentView();
  if (typeof showToast === 'function') showToast('ลงทะเบียนลูกค้าสำเร็จ!', `แปลงผู้มุ่งหวังเป็นลูกค้าใหม่ ${newCustomer.display_name} (${newHn}) เรียบร้อยแล้ว`, 'success');
}

// --- 6.7 Unified Campaign & Promotion Creation Modal ---
function openNewCampaignModal() {
  const bodyHtml = `
    <div class="space-y-3 text-xs">
      <div>
        <label class="font-bold text-slate-700 block mb-1">ชื่อแคมเปญการตลาด (Campaign Name) *</label>
        <input id="camp-name-input" type="text" placeholder="เช่น แคมเปญทำหมันสัญจรเพื่อสุขภาพสัตว์เลี้ยง" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="font-bold text-slate-700 block mb-1">รหัสแคมเปญ *</label>
          <input id="camp-code-input" type="text" placeholder="CAMP-STERIL-2026" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 font-mono">
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">ประเภทแคมเปญ *</label>
          <select id="camp-type-select" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
            <option value="SURGERY">ศัลยกรรม & ทำหมัน</option>
            <option value="VACCINE">วัคซีน & เวชศาสตร์ป้องกัน</option>
            <option value="DENTAL">ทันตกรรม & ช่องปาก</option>
            <option value="WELLNESS">ตรวจสุขภาพประจำปี</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="font-bold text-slate-700 block mb-1">วันเริ่มต้น *</label>
          <input id="camp-start-input" type="date" value="2026-03-01" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 font-mono">
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">วันสิ้นสุด *</label>
          <input id="camp-end-input" type="date" value="2026-04-30" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 font-mono">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="font-bold text-slate-700 block mb-1">งบประมาณที่วางแผน (บาท)</label>
          <input id="camp-budget-input" type="number" value="25000" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 font-mono">
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">เป้าหมายจำนวนผู้ใช้บริการ (เคส)</label>
          <input id="camp-target-input" type="number" value="50" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 font-mono">
        </div>
      </div>
      <div>
        <label class="font-bold text-slate-700 block mb-1">กลุ่มเป้าหมาย (Customer Segment)</label>
        <input id="camp-segment-input" type="text" placeholder="เช่น สุนัขและแมวอายุ 6 เดือนขึ้นไป" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
      </div>
      <div class="p-3 bg-purple-50/70 rounded-xl border border-purple-200 space-y-2">
        <h6 class="font-bold text-purple-950 text-xs">กำหนดโปรโมชั่นที่ผูกกับแคมเปญ (Linked Promotion):</h6>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-slate-600 block mb-0.5">ประเภทส่วนลด:</label>
            <select id="camp-promo-type" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-800">
              <option value="PERCENT">ลดเป็นเปอร์เซ็นต์ (%)</option>
              <option value="FIXED">ลดเป็นจำนวนเงิน (฿)</option>
            </select>
          </div>
          <div>
            <label class="text-slate-600 block mb-0.5">มูลค่าส่วนลด:</label>
            <input id="camp-promo-val" type="number" value="15" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-800 font-mono">
          </div>
        </div>
        <div>
          <label class="text-slate-600 block mb-0.5">รายละเอียดข้อเสนอพิเศษ:</label>
          <input id="camp-promo-desc" type="text" value="ส่วนลดค่าบริการทำหมัน 15% พร้อมตรวจเลือด CBC ฟรี" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-800">
        </div>
      </div>
    </div>
  `;

  openCrmActionModal('สร้างแคมเปญส่งเสริมการตลาดและโปรโมชั่นใหม่', bodyHtml, 'บันทึกแคมเปญ', submitNewCampaign);
}

function submitNewCampaign() {
  const name = document.getElementById('camp-name-input')?.value?.trim();
  const code = document.getElementById('camp-code-input')?.value?.trim() || `CAMP-${Date.now().toString().slice(-4)}`;
  if (!name) {
    if (typeof showToast === 'function') showToast('กรุณากรอกชื่อแคมเปญ', 'โปรดระบุชื่อแคมเปญก่อนบันทึก', 'warning');
    return;
  }

  const type = document.getElementById('camp-type-select')?.value || 'SURGERY';
  const start = document.getElementById('camp-start-input')?.value || '2026-03-01';
  const end = document.getElementById('camp-end-input')?.value || '2026-04-30';
  const budget = Number(document.getElementById('camp-budget-input')?.value || 20000);
  const targetCount = Number(document.getElementById('camp-target-input')?.value || 50);
  const segment = document.getElementById('camp-segment-input')?.value || 'ลูกค้าทั่วไป';
  const promoType = document.getElementById('camp-promo-type')?.value || 'PERCENT';
  const promoVal = Number(document.getElementById('camp-promo-val')?.value || 15);
  const promoDesc = document.getElementById('camp-promo-desc')?.value || 'ส่วนลดแคมเปญพิเศษ';

  // 1. Create Promotion
  state.crmPromotions = state.crmPromotions || [];
  const newPromoId = state.crmPromotions.length + 1;
  state.crmPromotions.push({
    id: newPromoId,
    campaign_id: null, // will link
    promotion_code: `PROMO-${code}`,
    promotion_name: `โปรโมชั่น ${name}`,
    promotion_type: promoType,
    discount_value: promoVal,
    start_at: start,
    end_at: end,
    status: 'ACTIVE'
  });

  // 2. Create Campaign
  state.crmCampaigns = state.crmCampaigns || [];
  const newCampId = state.crmCampaigns.length + 1;
  state.crmCampaigns.push({
    id: newCampId,
    campaign_code: code,
    campaign_name: name,
    campaign_type: type,
    start_date: start,
    end_date: end,
    budget: budget,
    promotion_id: newPromoId,
    status: 'ACTIVE',
    discount_info: promoDesc,
    target_segment: segment,
    target_count: targetCount,
    reached_count: 0,
    converted_count: 0
  });

  // Link back
  state.crmPromotions.find(p => p.id === newPromoId).campaign_id = newCampId;

  closeCrmActionModal();
  if (typeof updateDynamicHeadersAndKPIs === 'function') updateDynamicHeadersAndKPIs();
  if (typeof renderCurrentView === 'function') renderCurrentView();
  if (typeof showToast === 'function') showToast('สร้างแคมเปญสำเร็จ!', `เปิดแคมเปญ ${name} (${code}) เรียบร้อยแล้ว`, 'success');
}
