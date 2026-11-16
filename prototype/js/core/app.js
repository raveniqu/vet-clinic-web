// -------------------------------------------------------------
// 3. MAIN NAVIGATION & ROUTING
// -------------------------------------------------------------
function switchMainView(viewName) {
  state.currentView = viewName;

  // Update Navigation menu styles
  const navIds = [
    "nav-owners",
    "nav-pets",
    "nav-queue",
    "nav-appointments",
    "nav-emr",
    "nav-pharmacy",
    "nav-inventory",
    "nav-lab",
    "nav-surgery",
    "nav-billing",
    "nav-crm",
    "nav-procurement",
    "nav-staff",
  ];
  navIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.className =
      "nav-item group flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition";
  });

  const activeNav = document.getElementById(`nav-${viewName}`);
  if (activeNav) {
    activeNav.className =
      "nav-item group flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg bg-teal-600/15 text-teal-300 border-l-2 border-teal-500 transition";
  }

  // Hide all view containers
  document.getElementById("owners-view-container")?.classList.add("hidden");
  document.getElementById("pets-view-container")?.classList.add("hidden");
  document.getElementById("queue-view-container")?.classList.add("hidden");
  document
    .getElementById("appointments-view-container")
    ?.classList.add("hidden");
  document.getElementById("emr-view-container")?.classList.add("hidden");
  document.getElementById("pharmacy-view-container")?.classList.add("hidden");
  document.getElementById("inventory-view-container")?.classList.add("hidden");
  document.getElementById("lab-view-container")?.classList.add("hidden");
  document.getElementById("surgery-view-container")?.classList.add("hidden");
  document.getElementById("billing-view-container")?.classList.add("hidden");
  document.getElementById("crm-view-container")?.classList.add("hidden");
  document
    .getElementById("procurement-view-container")
    ?.classList.add("hidden");
  document.getElementById("staff-view-container")?.classList.add("hidden");
  document.getElementById("empty-state")?.classList.add("hidden");

  // Update Top Header Titles & Breadcrumbs
  const breadcrumb = document.getElementById("breadcrumb-current-view");
  const pageTitle = document.getElementById("page-heading-title");
  const cardTabLabel = document.getElementById("tab-label-card");

  if (viewName === "owners") {
    breadcrumb.innerText = "ทะเบียนเจ้าของสัตว์ (Clients & Owners)";
    pageTitle.innerHTML = `<span>ทะเบียนเจ้าของสัตว์เลี้ยง</span> <span class="text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">Domain 01 Master Data</span>`;
    cardTabLabel.innerText = "Card View";
  } else if (viewName === "pets") {
    breadcrumb.innerText = "ทะเบียนสัตว์เลี้ยง (Patients & Pets)";
    pageTitle.innerHTML = `<span>ทะเบียนสัตว์ป่วยและประวัติสัตว์</span> <span class="text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">Domain 01 Master Data</span>`;
    cardTabLabel.innerText = "Card View";
  } else if (viewName === "queue") {
    breadcrumb.innerText = "คิวรับบริการ & Triage (Queue Board)";
    pageTitle.innerHTML = `<span>กระดานควบคุมคิวตรวจสด (Live Queue Board)</span> <span class="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">Domain 02 Operations</span>`;
    cardTabLabel.innerText = "Kanban Board";
  } else if (viewName === "appointments") {
    breadcrumb.innerText = "ปฏิทิน & ตารางนัดหมาย (Appointments)";
    pageTitle.innerHTML = `<span>ตารางนัดหมายและจัดสรรทรัพยากร</span> <span class="text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full">Domain 02 Scheduling</span>`;
    cardTabLabel.innerText = "Schedule View";
  } else if (viewName === "emr") {
    breadcrumb.innerText = "ห้องตรวจสัตวแพทย์ & เวชระเบียน SOAP (EMR)";
    pageTitle.innerHTML = `<span>ห้องตรวจ & เวชระเบียน EMR (SOAP)</span> <span class="text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full">Domain 03 Clinical</span>`;
    cardTabLabel.innerText = "SOAP Cards";
  } else if (viewName === "pharmacy") {
    breadcrumb.innerText = "ห้องจ่ายยาและเภสัชกรรม (Pharmacy Dispensing)";
    pageTitle.innerHTML = `<span>ห้องจ่ายยา & คิวจัดยาผู้ป่วย</span> <span class="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">Domain 04 Pharmacy</span>`;
    cardTabLabel.innerText = "Rx Cards";
  } else if (viewName === "inventory") {
    breadcrumb.innerText =
      "คลังยา เวชภัณฑ์ และสต็อก (Inventory & Stock Control)";
    pageTitle.innerHTML = `<span>คลังยาและควบคุมสต็อกเวชภัณฑ์</span> <span class="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">Domain 04 Inventory</span>`;
    cardTabLabel.innerText = "Stock Cards";
  } else if (viewName === "lab") {
    breadcrumb.innerText =
      "ห้องปฏิบัติการ & รังสีวินิจฉัย (Laboratory & Diagnostics)";
    pageTitle.innerHTML = `<span>ห้องปฏิบัติการและรังสีวินิจฉัย</span> <span class="text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">Domain 05 Diagnostic</span>`;
    cardTabLabel.innerText = "Lab Cards";
  } else if (viewName === "surgery") {
    breadcrumb.innerText =
      "ห้องผ่าตัด & หัตถการรักษา (Surgical & Operating Room Care)";
    pageTitle.innerHTML = `<span>ห้องผ่าตัด & หัตถการรักษา (Surgery & OR)</span> <span class="text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">Domain 06 Surgery</span>`;
    cardTabLabel.innerText = "OR Cards";
  } else if (viewName === "billing") {
    breadcrumb.innerText = "จุดชำระเงิน & การเงิน (Billing & Cashier)";
    pageTitle.innerHTML = `<span>จุดชำระเงินและออกใบเสร็จ (Cashier & Billing)</span> <span class="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">Domain 07 Billing</span>`;
    cardTabLabel.innerText = "Bill Cards";
  } else if (viewName === "crm") {
    breadcrumb.innerText = "การตลาด & ลูกค้าสัมพันธ์ (Marketing & CRM)";
    pageTitle.innerHTML = `<span>เตือนวัคซีน & บริหารสัมพันธ์ลูกค้า (Care & CRM)</span> <span class="text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">Domain 08 CRM</span>`;
    cardTabLabel.innerText = "CRM Cards";
  } else if (viewName === "procurement") {
    breadcrumb.innerText =
      "จัดซื้อ & ผู้จำหน่ายเวชภัณฑ์ (Procurement & Supplier Management)";
    pageTitle.innerHTML = `<span>จัดซื้อ & ผู้จำหน่ายเวชภัณฑ์ (Procurement)</span> <span class="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">Domain 09 Procurement</span>`;
    cardTabLabel.innerText = "Procure View";
  } else if (viewName === "staff") {
    breadcrumb.innerText =
      "บุคลากร & ตารางเวรปฏิบัติงาน (Human Resources & Workforce Management)";
    pageTitle.innerHTML = `<span>บุคลากร & ตารางเวรสัตวแพทย์ (Staff & HR)</span> <span class="text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">Domain 10 Workforce</span>`;
    cardTabLabel.innerText = "Staff View";
  }

  renderCurrentView();
}

function setViewMode(mode) {
  state.viewMode = mode;
  const tabBtnCard = document.getElementById("tab-btn-card");
  const tabBtnList = document.getElementById("tab-btn-list");

  if (mode === "card") {
    tabBtnCard.className =
      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-900 shadow-xs transition cursor-pointer";
    tabBtnList.className =
      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition cursor-pointer";
  } else {
    tabBtnList.className =
      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-900 shadow-xs transition cursor-pointer";
    tabBtnCard.className =
      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition cursor-pointer";
  }

  renderCurrentView();
}

function resetFilters() {
  document.getElementById("view-filter-search").value = "";
  const speciesFilter = document.getElementById("view-filter-species");
  if (speciesFilter) speciesFilter.value = "all";
  const statusFilter = document.getElementById("view-filter-status");
  if (statusFilter) statusFilter.value = "all";
  renderCurrentView();
}

// -------------------------------------------------------------
// 4. TOP SUB-HEADER & DYNAMIC METRICS BUILDER
// -------------------------------------------------------------
function updateDynamicHeadersAndKPIs() {
  const actionContainer = document.getElementById("dynamic-action-buttons");
  const metricContainer = document.getElementById("dynamic-metric-cards");
  const filterDropdowns = document.getElementById("dynamic-filter-dropdowns");

  const waitingCount = state.queues.filter((q) => q.stage === "WAITING").length;
  const inServiceCount = state.queues.filter(
    (q) => q.stage === "IN_SERVICE",
  ).length;
  const activeTotalQueue = waitingCount + inServiceCount;
  document.getElementById("badge-queue-count").innerText = activeTotalQueue;
  document.getElementById("badge-sidebar-queue").innerText = activeTotalQueue;
  document.getElementById("badge-owners-count").innerText =
    state.customers.length;
  document.getElementById("badge-pets-count").innerText = state.pets.length;

  const todayAppointments = state.appointments.filter(
    (a) => a.scheduled_date === "2026-03-02",
  ).length;
  document.getElementById("badge-sidebar-appointments").innerText =
    todayAppointments;

  const pendingDispense = state.dispensings.filter(
    (d) => d.status === "WAITING_DISPENSE",
  ).length;
  const sidebarPharmacyBadge = document.getElementById(
    "badge-sidebar-pharmacy",
  );
  if (sidebarPharmacyBadge)
    sidebarPharmacyBadge.innerText = `${pendingDispense} รอจ่าย`;
  const sidebarInventoryBadge = document.getElementById(
    "badge-sidebar-inventory",
  );
  if (sidebarInventoryBadge)
    sidebarInventoryBadge.innerText = `${state.products.length}`;

  const pendingLabTotal = state.diagnosticOrders.filter(
    (o) => o.status !== "VERIFIED",
  ).length;
  const sidebarLabBadge = document.getElementById("badge-sidebar-lab");
  if (sidebarLabBadge) sidebarLabBadge.innerText = `${pendingLabTotal} รอผล`;

  const activeSurgeryCount = state.surgerySchedules.filter(
    (s) => s.status === "IN_PROGRESS",
  ).length;
  const todaySurgeryTotal = state.surgerySchedules.filter(
    (s) => s.status !== "CANCELLED",
  ).length;
  const sidebarSurgeryBadge = document.getElementById("badge-sidebar-surgery");
  if (sidebarSurgeryBadge) {
    sidebarSurgeryBadge.innerText =
      activeSurgeryCount > 0
        ? `${activeSurgeryCount} กำลังผ่า`
        : `${todaySurgeryTotal} ผ่าตัด`;
  }

  const pendingInvoices = state.invoices.filter((i) => i.status === "UNPAID" || i.status === "PARTIAL");
  const sidebarBillingBadge = document.getElementById("badge-sidebar-billing");
  if (sidebarBillingBadge) {
    sidebarBillingBadge.innerText = `${pendingInvoices.length} รอชำระ`;
  }

  const pendingReminders = (state.crmReminders || []).filter(
    (r) => r.status !== "SENT",
  );
  const sidebarCrmBadge = document.getElementById("badge-sidebar-crm");
  if (sidebarCrmBadge) {
    sidebarCrmBadge.innerText = `${pendingReminders.length} เตือนนัด`;
  }

  const pendingPoList = (state.purchaseOrders || []).filter(
    (p) => p.status === "APPROVED" || p.status === "SENT" || p.status === "PARTIAL_RECEIVED"
  );
  const sidebarProcureBadge = document.getElementById("badge-sidebar-procurement");
  if (sidebarProcureBadge) {
    sidebarProcureBadge.innerText = `${pendingPoList.length} ใบสั่ง`;
  }

  if (state.currentView === "owners") {
    actionContainer.innerHTML = `
          <button onclick="openFormSheet('owner')" class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="user-plus" class="w-4 h-4"></i><span>+ ลงทะเบียนเจ้าของใหม่</span>
          </button>
        `;
    metricContainer.innerHTML = `
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-medium text-slate-500">เจ้าของสัตว์ทั้งหมด</p><h3 class="text-xl font-bold text-slate-900 mt-0.5">${state.customers.length}</h3></div>
            <div class="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center"><i data-lucide="users" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-medium text-slate-500">สัตว์เลี้ยงในทะเบียน</p><h3 class="text-xl font-bold text-slate-900 mt-0.5">${state.pets.length}</h3></div>
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><i data-lucide="paw-print" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-medium text-slate-500">เคสเตือนแพ้ยา/โรคเรื้อรัง</p><h3 class="text-xl font-bold text-rose-600 mt-0.5">${state.pets.filter((p) => p.allergies?.length > 0 || p.chronic_conditions?.length > 0).length}</h3></div>
            <div class="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center"><i data-lucide="alert-triangle" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-medium text-slate-500">ยินยอม PDPA ครบถ้วน</p><h3 class="text-xl font-bold text-indigo-600 mt-0.5">100%</h3></div>
            <div class="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center"><i data-lucide="shield-check" class="w-5 h-5"></i></div>
          </div>
        `;
    filterDropdowns.innerHTML = `
          <select id="view-filter-status" onchange="renderCurrentView()" class="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500">
            <option value="all">สถานะทั้งหมด</option><option value="ACTIVE">ปกติ (Active)</option><option value="INACTIVE">ปิดใช้งาน</option>
          </select>
        `;
  } else if (state.currentView === "pets") {
    actionContainer.innerHTML = `
          <button onclick="openFormSheet('pet')" class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="plus-circle" class="w-4 h-4"></i><span>+ เพิ่มสัตว์เลี้ยงใหม่</span>
          </button>
        `;
    metricContainer.innerHTML = `
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-medium text-slate-500">สัตว์เลี้ยงทั้งหมด</p><h3 class="text-xl font-bold text-slate-900 mt-0.5">${state.pets.length}</h3></div>
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><i data-lucide="paw-print" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-medium text-slate-500">สุนัข (Canine)</p><h3 class="text-xl font-bold text-amber-700 mt-0.5">${state.pets.filter((p) => p.species === "สุนัข").length}</h3></div>
            <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><i data-lucide="dog" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-medium text-slate-500">แมว (Feline)</p><h3 class="text-xl font-bold text-teal-700 mt-0.5">${state.pets.filter((p) => p.species === "แมว").length}</h3></div>
            <div class="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center"><i data-lucide="cat" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-medium text-slate-500">เฝ้าระวังแพ้ยา / โรคเรื้อรัง</p><h3 class="text-xl font-bold text-rose-600 mt-0.5">${state.pets.filter((p) => p.allergies?.length > 0 || p.chronic_conditions?.length > 0).length}</h3></div>
            <div class="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center"><i data-lucide="alert-octagon" class="w-5 h-5"></i></div>
          </div>
        `;
    filterDropdowns.innerHTML = `
          <select id="view-filter-species" onchange="renderCurrentView()" class="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500">
            <option value="all">ชนิดสัตว์ทั้งหมด</option><option value="สุนัข">สุนัข</option><option value="แมว">แมว</option><option value="กระต่าย">กระต่าย</option>
          </select>
        `;
  } else if (state.currentView === "queue") {
    const holdCount = state.queues.filter((q) => q.stage === "HOLD").length;
    const compCount = state.queues.filter(
      (q) => q.stage === "COMPLETED",
    ).length;
    const avgWait = Math.round(
      state.queues.reduce((acc, q) => acc + (q.wait_minutes || 0), 0) /
        (state.queues.length || 1),
    );

    actionContainer.innerHTML = `
          <button onclick="openFormSheet('walk-in')" class="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="user-plus" class="w-4 h-4"></i><span>+ รับเคส Walk-in ด่วน</span>
          </button>
          <button onclick="callNextQueue()" class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="volume-2" class="w-4 h-4"></i><span>เรียกคิวถัดไป</span>
          </button>
          <button onclick="openQueuePublicDisplay()" class="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs font-semibold px-3.5 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer border border-slate-700">
            <i data-lucide="tv" class="w-4 h-4 text-teal-400"></i><span>📺 จอเรียกคิว TV</span>
          </button>
        `;
    metricContainer.innerHTML = `
          <div class="bg-amber-50/60 border border-amber-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-amber-800">1. รอเรียกตรวจ (Waiting)</p><h3 class="text-xl font-bold text-amber-900 mt-0.5">${waitingCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><i data-lucide="clock" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-blue-50/60 border border-blue-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-blue-800">2. กำลังตรวจ (Consulting)</p><h3 class="text-xl font-bold text-blue-900 mt-0.5">${inServiceCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center"><i data-lucide="stethoscope" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-purple-50/60 border border-purple-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-purple-800">3. พักรอผลแล็บ/ยา (Holding)</p><h3 class="text-xl font-bold text-purple-900 mt-0.5">${holdCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center"><i data-lucide="flask-conical" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-emerald-50/60 border border-emerald-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-emerald-800">4. เวลารอเฉลี่ย / เสร็จสิ้น</p><h3 class="text-xl font-bold text-emerald-900 mt-0.5">${avgWait} นาที (${compCount} เคส)</h3></div>
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><i data-lucide="hourglass" class="w-5 h-5"></i></div>
          </div>
        `;
    filterDropdowns.innerHTML = `
          <select id="view-filter-triage" onchange="renderCurrentView()" class="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500">
            <option value="all">ระดับความเร่งด่วนทั้งหมด</option>
            <option value="CRITICAL">🟣 วิกฤตชีพ (Critical)</option>
            <option value="EMERGENCY">🔴 ฉุกเฉิน (Emergency)</option>
            <option value="URGENT">🟡 เร่งด่วน (Urgent)</option>
            <option value="NORMAL">🟢 ปกติ (Normal)</option>
          </select>
        `;
  } else if (state.currentView === "appointments") {
    const todayCount = state.appointments.filter(
      (a) => a.scheduled_date === "2026-03-02",
    ).length;
    const confirmedCount = state.appointments.filter(
      (a) => a.confirmation_status === "CONFIRMED",
    ).length;
    const checkedInCount = state.appointments.filter(
      (a) => a.status === "CHECKED_IN",
    ).length;
    const noShowCount = state.appointments.filter(
      (a) => a.status === "NO_SHOW",
    ).length;
    const waitlistCount = (state.appointment_waitlists || []).filter(
      (w) => w.status === "WAITING",
    ).length;

    actionContainer.innerHTML = `
          <button onclick="openFormSheet('appointment')" class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="calendar-plus" class="w-4 h-4"></i><span>+ จองนัดหมายใหม่</span>
          </button>
          <button onclick="openWaitlistSheet()" class="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3.5 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="list-ordered" class="w-4 h-4 text-indigo-600"></i><span>📋 รายชื่อรอคิว (Waitlist: ${waitlistCount})</span>
          </button>
        `;
    metricContainer.innerHTML = `
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-medium text-slate-500">นัดหมายวันนี้</p><h3 class="text-xl font-bold text-slate-900 mt-0.5">${todayCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center"><i data-lucide="calendar" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-medium text-slate-500">ยืนยันการมาแล้ว</p><h3 class="text-xl font-bold text-emerald-700 mt-0.5">${confirmedCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><i data-lucide="check-check" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-medium text-slate-500">Check-in เข้าคิวแล้ว</p><h3 class="text-xl font-bold text-blue-700 mt-0.5">${checkedInCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center"><i data-lucide="clipboard-check" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-medium text-slate-500">ไม่มาตามนัด (No-show)</p><h3 class="text-xl font-bold text-rose-700 mt-0.5">${noShowCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center"><i data-lucide="user-x" class="w-5 h-5"></i></div>
          </div>
        `;
    filterDropdowns.innerHTML = `
          <select id="view-filter-doctor" onchange="renderCurrentView()" class="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500">
            <option value="all">สัตวแพทย์ทั้งหมด</option>
            ${state.doctors.map((d) => `<option value="${d.id}">${d.name}</option>`).join("")}
          </select>
        `;
  } else if (state.currentView === "emr") {
    const totalEncounters = state.encounters.length;
    const pendingLab = state.queues.filter((q) => q.stage === "HOLD").length;

    actionContainer.innerHTML = `
          <button onclick="openSOAPFormSheet()" class="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="stethoscope" class="w-4 h-4"></i><span>+ บันทึกตรวจรักษา SOAP</span>
          </button>
        `;
    metricContainer.innerHTML = `
          <div class="bg-teal-50/70 border border-teal-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-teal-800">เวชระเบียนที่บันทึกแล้ว</p><h3 class="text-xl font-bold text-teal-900 mt-0.5">${totalEncounters} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center"><i data-lucide="file-text" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-purple-50/70 border border-purple-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-purple-800">รอผลตรวจแล็บ / X-Ray</p><h3 class="text-xl font-bold text-purple-900 mt-0.5">${pendingLab} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center"><i data-lucide="flask-conical" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-blue-50/70 border border-blue-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-blue-800">คำสั่งยาที่ออกวันนี้</p><h3 class="text-xl font-bold text-blue-900 mt-0.5">5 รายการ</h3></div>
            <div class="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center"><i data-lucide="pill" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-rose-50/70 border border-rose-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-rose-800">เฝ้าระวังแพ้ยาในห้องตรวจ</p><h3 class="text-xl font-bold text-rose-700 mt-0.5">1 เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center"><i data-lucide="alert-octagon" class="w-5 h-5"></i></div>
          </div>
        `;
    filterDropdowns.innerHTML = `
          <select id="view-filter-vet" onchange="renderCurrentView()" class="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500">
            <option value="all">สัตวแพทย์ผู้ตรวจทั้งหมด</option><option value="1">น.สพ. วุฒิชัย</option><option value="2">สพ.ญ. ศศิธร</option>
          </select>
        `;
  } else if (state.currentView === "pharmacy") {
    const pendingCount = state.dispensings.filter(
      (d) => d.status === "WAITING_DISPENSE",
    ).length;
    const dispensedCount = state.dispensings.filter(
      (d) => d.status === "DISPENSED",
    ).length;
    const allergyCount = state.dispensings.filter((d) => {
      const pet = getPetById(d.pet_id);
      return pet && pet.allergies && pet.allergies.length > 0;
    }).length;

    actionContainer.innerHTML = `
          <button onclick="showToast('เชื่อมโยงอัตโนมัติ', 'คำสั่งยาจะส่งตรงจากห้องตรวจ EMR อัตโนมัติเมื่อแพทย์บันทึก SOAP', 'info')" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i><span>รีเฟรชคิวจ่ายยา</span>
          </button>
        `;
    metricContainer.innerHTML = `
          <div class="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-amber-800">รอตรวจสอบ & จ่ายยา</p><h3 class="text-xl font-bold text-amber-900 mt-0.5">${pendingCount} รายการ</h3></div>
            <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><i data-lucide="clock" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-emerald-800">จ่ายยาสำเร็จวันนี้</p><h3 class="text-xl font-bold text-emerald-900 mt-0.5">${dispensedCount} รายการ</h3></div>
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><i data-lucide="check-circle" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-rose-50/70 border border-rose-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-rose-800">เฝ้าระวังแพ้ยาในคิว</p><h3 class="text-xl font-bold text-rose-700 mt-0.5">${allergyCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center"><i data-lucide="alert-octagon" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-blue-50/70 border border-blue-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-blue-800">ล็อตยาพร้อมจ่าย (FEFO)</p><h3 class="text-xl font-bold text-blue-900 mt-0.5">${state.inventoryLots.filter((l) => l.status === "ACTIVE").length} ล็อต</h3></div>
            <div class="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center"><i data-lucide="layers" class="w-5 h-5"></i></div>
          </div>
        `;
    filterDropdowns.innerHTML = `
          <select id="view-filter-dispense-status" onchange="renderCurrentView()" class="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500">
            <option value="all">สถานะคำสั่งยาทั้งหมด</option>
            <option value="WAITING_DISPENSE">🟡 รอตรวจสอบ & จ่ายยา</option>
            <option value="DISPENSED">🟢 จ่ายยาสำเร็จแล้ว</option>
            <option value="RETURNED">↩️ รับคืน / ยกเลิกแล้ว</option>
          </select>
        `;
  } else if (state.currentView === "inventory") {
    const totalProducts = state.products.length;
    const lowStockCount = state.products.filter(
      (p) => getProductTotalOnHand(p.id) < p.minimum_stock,
    ).length;
    const expiringSoonCount = state.inventoryLots.filter((l) =>
      isExpiringSoon(l.expiry_date),
    ).length;
    const totalValue = calculateTotalInventoryValue();

    actionContainer.innerHTML = `
          <button onclick="openStockManageSheet('receive')" class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="plus-circle" class="w-4 h-4"></i><span>+ ตรวจรับยาเข้าคลังใหม่</span>
          </button>
          <button onclick="openStockManageSheet('adjust')" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="sliders-horizontal" class="w-4 h-4"></i><span>ปรับยอดสต็อก</span>
          </button>
        `;
    metricContainer.innerHTML = `
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-medium text-slate-500">รายการสินค้าในคลัง</p><h3 class="text-xl font-bold text-slate-900 mt-0.5">${totalProducts} รายการ</h3></div>
            <div class="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center"><i data-lucide="boxes" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-rose-50/70 border border-rose-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-rose-800">สต็อกต่ำกว่าเกณฑ์ (Low)</p><h3 class="text-xl font-bold text-rose-700 mt-0.5">${lowStockCount} รายการ</h3></div>
            <div class="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center"><i data-lucide="alert-triangle" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-amber-800">ล็อตใกล้หมดอายุ (&lt;90 วัน)</p><h3 class="text-xl font-bold text-amber-700 mt-0.5">${expiringSoonCount} ล็อต</h3></div>
            <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><i data-lucide="clock" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-indigo-50/70 border border-indigo-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-indigo-800">มูลค่าสต็อกโดยประมาณ</p><h3 class="text-xl font-bold text-indigo-900 mt-0.5">฿${totalValue.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h3></div>
            <div class="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center"><i data-lucide="banknote" class="w-5 h-5"></i></div>
          </div>
        `;
    filterDropdowns.innerHTML = `
          <select id="view-filter-category" onchange="renderCurrentView()" class="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500">
            <option value="all">หมวดหมู่สินค้าทั้งหมด</option>
            <option value="ยาสัตว์เลี้ยง">ยาสัตว์เลี้ยง</option>
            <option value="วัคซีน">วัคซีน</option>
            <option value="เวชภัณฑ์และวัสดุสิ้นเปลือง">เวชภัณฑ์และวัสดุสิ้นเปลือง</option>
            <option value="สินค้าจำหน่าย">สินค้าจำหน่าย</option>
          </select>
        `;
  } else if (state.currentView === "lab") {
    const pendingLabCount = state.diagnosticOrders.filter(
      (o) => o.status !== "VERIFIED",
    ).length;
    const verifiedLabCount = state.diagnosticOrders.filter(
      (o) => o.status === "VERIFIED",
    ).length;
    const criticalCount = state.diagnosticOrders.filter(
      (o) => o.has_critical_flag,
    ).length;
    const imagingCount = state.imagingStudies.length;
    const specimenRejectedCount = state.specimens.filter(
      (s) => s.accession_status === "REJECTED",
    ).length;

    actionContainer.innerHTML = `
          <button onclick="openNewLabOrderSheet()" class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="plus-circle" class="w-4 h-4"></i><span>+ สั่งตรวจแล็บ/รังสีด่วน</span>
          </button>
          <button onclick="openNewQcRunModal()" class="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="clipboard-check" class="w-4 h-4 text-emerald-400"></i><span>+ บันทึกผล QC</span>
          </button>
          <button onclick="renderCurrentView(); showToast('ซิงก์เครื่องตรวจอัตโนมัติ', 'ดึงข้อมูลผลวิเคราะห์จากเครื่องตรวจอัตโนมัติเรียบร้อย', 'info')" class="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-lg transition active:scale-95 cursor-pointer">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i><span>ซิงก์ผลวิเคราะห์</span>
          </button>
        `;

    metricContainer.innerHTML = `
          <div class="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-amber-800">รอวิเคราะห์ & รับรองผล</p><h3 class="text-xl font-bold text-amber-900 mt-0.5">${pendingLabCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><i data-lucide="clock" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-rose-50/70 border border-rose-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-rose-800">ค่าวิกฤต/ผิดปกติ (Critical)</p><h3 class="text-xl font-bold text-rose-700 mt-0.5">${criticalCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center"><i data-lucide="alert-triangle" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-purple-50/70 border border-purple-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-purple-800">ภาพรังสี & อัลตราซาวด์</p><h3 class="text-xl font-bold text-purple-900 mt-0.5">${imagingCount} การศึกษา</h3></div>
            <div class="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center"><i data-lucide="scan" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-emerald-800">รับรองผลตรวจแล้ว</p><h3 class="text-xl font-bold text-emerald-900 mt-0.5">${verifiedLabCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><i data-lucide="check-circle" class="w-5 h-5"></i></div>
          </div>
        `;

    filterDropdowns.innerHTML = `
          <select id="view-filter-lab-status" onchange="renderCurrentView()" class="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500 font-semibold">
            <option value="all">สถานะคำสั่งตรวจทั้งหมด</option>
            <option value="PENDING_VERIFY">🟡 รอตรวจรับรอง (Pending Verify)</option>
            <option value="PROCESSING">🔵 กำลังตรวจวิเคราะห์ (Processing)</option>
            <option value="VERIFIED">🟢 รับรองผลแล้ว (Verified)</option>
            <option value="SPECIMEN_REJECTED">🔴 สิ่งส่งตรวจมีปัญหา (Specimen Rejected)</option>
          </select>
        `;
  } else if (state.currentView === "surgery") {
    const inProgressCount = state.surgerySchedules.filter(
      (s) => s.status === "IN_PROGRESS",
    ).length;
    const scheduledCount = state.surgerySchedules.filter(
      (s) => s.status === "SCHEDULED",
    ).length;
    const recoveryCount = state.surgerySchedules.filter(
      (s) => s.status === "RECOVERY",
    ).length;
    const completedCount = state.surgerySchedules.filter(
      (s) => s.status === "COMPLETED",
    ).length;

    actionContainer.innerHTML = `
          <button onclick="openNewSurgeryRequestModal()" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="inbox" class="w-4 h-4"></i><span>+ ส่งคำขอผ่าตัด</span>
          </button>
          <button onclick="openNewSurgeryScheduleSheet()" class="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="plus-circle" class="w-4 h-4"></i><span>+ ลงตารางผ่าตัดใหม่</span>
          </button>
          <button onclick="renderCurrentView(); showToast('อัปเดตตารางผ่าตัด', 'รีเฟรชข้อมูลตารางห้องผ่าตัดและห้องพักฟื้นเรียบร้อย', 'info')" class="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-200 shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i><span>รีเฟรช</span>
          </button>
        `;

    metricContainer.innerHTML = `
          <div class="bg-blue-50/70 border border-blue-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-blue-800">ตารางผ่าตัดวันนี้</p><h3 class="text-xl font-bold text-blue-900 mt-0.5">${scheduledCount + inProgressCount + recoveryCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center"><i data-lucide="calendar" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-amber-800">กำลังผ่าตัด (In OR)</p><h3 class="text-xl font-bold text-amber-900 mt-0.5">${inProgressCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><i data-lucide="activity" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-purple-50/70 border border-purple-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-purple-800">ห้องพักฟื้น (Post-Op)</p><h3 class="text-xl font-bold text-purple-900 mt-0.5">${recoveryCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center"><i data-lucide="bed" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-emerald-800">ผ่าตัดสำเร็จ & ส่งจ่ายยา</p><h3 class="text-xl font-bold text-emerald-900 mt-0.5">${completedCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><i data-lucide="check-circle-2" class="w-5 h-5"></i></div>
          </div>
        `;

    filterDropdowns.innerHTML = `
          <select id="view-filter-surgery-room" onchange="renderCurrentView()" class="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500">
            <option value="all">ห้องผ่าตัดทั้งหมด (All Rooms)</option>
            <option value="OR-1">ห้องผ่าตัดปลอดเชื้อ 1 (Sterile OR-1)</option>
            <option value="OR-2">ห้องผ่าตัด 2 (Soft Tissue OR)</option>
            <option value="PROC-1">ห้องหัตถการ & ทันตกรรม (Proc-1)</option>
          </select>
        `;
  } else if (state.currentView === "billing") {
    const totalInvoiced = state.invoices.reduce(
      (sum, inv) => sum + (inv.grand_total || 0),
      0,
    );
    const unpaidBills = state.invoices.filter((i) => i.status === "UNPAID" || i.status === "PARTIAL");
    const unpaidTotal = unpaidBills.reduce(
      (sum, inv) => sum + (inv.outstanding_amount !== undefined ? inv.outstanding_amount : inv.grand_total),
      0,
    );
    const collectedToday = (state.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
    const activeDeposits = (state.customerDeposits || []).reduce(
      (sum, d) => sum + (d.remaining_amount || 0),
      0,
    );

    actionContainer.innerHTML = `
          <button onclick="openNewInvoiceSheet()" class="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="plus-circle" class="w-4 h-4"></i><span>+ เปิดบิลใหม่ / POS</span>
          </button>
          <button onclick="openCustomerDepositModal()" class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="wallet" class="w-4 h-4"></i><span>+ รับเงินมัดจำ</span>
          </button>
          <button onclick="openShiftCloseModal()" class="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="lock" class="w-4 h-4"></i><span>ปิดกะการเงิน</span>
          </button>
          <button onclick="renderCurrentView(); showToast('รีเฟรชข้อมูลการเงิน', 'ปรับปรุงยอดบิลและสถานะการชำระเงินเรียบร้อย', 'info')" class="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-lg transition active:scale-95 cursor-pointer">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
          </button>
        `;

    metricContainer.innerHTML = `
          <div class="bg-blue-50/70 border border-blue-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-blue-800">ยอดเรียกเก็บทั้งหมดวันนี้</p><h3 class="text-xl font-bold text-blue-900 mt-0.5">฿${totalInvoiced.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3></div>
            <div class="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center"><i data-lucide="file-text" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-amber-800">รอรับชำระ / ค้างชำระ (AR)</p><h3 class="text-xl font-bold text-amber-900 mt-0.5">${unpaidBills.length} บิล (฿${unpaidTotal.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</h3></div>
            <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><i data-lucide="clock" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-emerald-800">รับชำระแล้ว (Collected)</p><h3 class="text-xl font-bold text-emerald-900 mt-0.5">฿${collectedToday.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3></div>
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><i data-lucide="check-circle-2" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-purple-50/70 border border-purple-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-purple-800">เงินมัดจำคงเหลือ (Deposits)</p><h3 class="text-xl font-bold text-purple-900 mt-0.5">฿${activeDeposits.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3></div>
            <div class="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center"><i data-lucide="wallet" class="w-5 h-5"></i></div>
          </div>
        `;

    filterDropdowns.innerHTML = `
          <select id="view-filter-billing-drawer" onchange="renderCurrentView()" class="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500">
            <option value="ACTIVE">🟢 กะเปิดใช้งาน (Drawer Open)</option>
            <option value="ALL">ประวัติกะทั้งหมด</option>
          </select>
        `;
  } else if (state.currentView === "crm") {
    const dueRemindersCount = (state.crmReminders || []).filter(
      (r) => r.status !== "SENT",
    ).length;
    const totalMembers = (state.crmMemberships || []).length;
    const activeCouponsCount = (state.customerCoupons || []).filter(
      (c) => c.status === "ACTIVE",
    ).length;
    const leadsCount = (state.crmLeads || []).filter(
      (l) => l.status !== "CONVERTED" && l.status !== "LOST",
    ).length;
    const feedbacks = state.customerFeedback || [];
    const csatAvg = feedbacks.length > 0 
      ? (feedbacks.reduce((sum, f) => sum + (Number(f.rating) || 5), 0) / feedbacks.length).toFixed(1) 
      : '5.0';

    const activeSub = state.activeCrmSubFilter || 'reminders';
    let subActionBtn = '';
    if (activeSub === 'leads') {
      subActionBtn = `
        <button onclick="openNewLeadModal()" class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
          <i data-lucide="user-plus" class="w-4 h-4"></i><span>+ บันทึกผู้มุ่งหวังใหม่</span>
        </button>
      `;
    } else if (activeSub === 'campaigns') {
      subActionBtn = `
        <button onclick="openNewCampaignModal()" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
          <i data-lucide="plus-circle" class="w-4 h-4"></i><span>+ สร้างแคมเปญใหม่</span>
        </button>
      `;
    } else if (activeSub === 'feedback') {
      subActionBtn = `
        <button onclick="openNewFeedbackModal()" class="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
          <i data-lucide="star" class="w-4 h-4"></i><span>+ บันทึกฟีดแบ็กใหม่</span>
        </button>
      `;
    } else {
      subActionBtn = `
        <button onclick="simulateSendAllPendingReminders()" class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
          <i data-lucide="send" class="w-4 h-4"></i><span>ส่งเตือน LINE ถึงกำหนด</span>
        </button>
      `;
    }

    actionContainer.innerHTML = `
          ${subActionBtn}
          <button onclick="renderCurrentView(); showToast('รีเฟรชข้อมูล CRM', 'อัปเดตกำหนดการแจ้งเตือนและแต้มสะสมเรียบร้อย', 'info')" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i><span>รีเฟรช</span>
          </button>
        `;

    metricContainer.innerHTML = `
          <div class="bg-purple-50/70 border border-purple-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-purple-800">นัดเตือนถึงกำหนด (Due)</p><h3 class="text-xl font-bold text-purple-900 mt-0.5">${dueRemindersCount} เคส</h3></div>
            <div class="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center"><i data-lucide="bell-ring" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-indigo-50/70 border border-indigo-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-indigo-800">ผู้มุ่งหวังกำลังติดตาม (Leads)</p><h3 class="text-xl font-bold text-indigo-900 mt-0.5">${leadsCount} ราย</h3></div>
            <div class="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center"><i data-lucide="users" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-amber-800">สมาชิกคลินิก (Members)</p><h3 class="text-xl font-bold text-amber-900 mt-0.5">${totalMembers} ราย</h3></div>
            <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><i data-lucide="crown" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-emerald-800">ความพึงพอใจ (CSAT)</p><h3 class="text-xl font-bold text-emerald-900 mt-0.5">${csatAvg} / 5.0 ⭐</h3></div>
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><i data-lucide="star" class="w-5 h-5"></i></div>
          </div>
        `;

    filterDropdowns.innerHTML = `
          <select id="view-filter-crm-status" onchange="renderCurrentView()" class="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500">
            <option value="all">ระดับความสำคัญ / สถานะทั้งหมด</option>
            <option value="HIGH">🔴 ความสำคัญสูง (High)</option>
            <option value="MEDIUM">🟡 ปานกลาง (Medium)</option>
            <option value="NORMAL">🟢 ปกติ (Normal)</option>
            <option value="NEW">✨ ผู้มุ่งหวังใหม่ (New)</option>
            <option value="CONTACTED">💬 กำลังติดต่อ (Contacted)</option>
            <option value="QUALIFIED">🎯 คัดกรองแล้ว (Qualified)</option>
          </select>
        `;
  } else if (state.currentView === "procurement") {
    const pendingPoCount = (state.purchaseOrders || []).filter(
      (p) =>
        p.status === "APPROVED" ||
        p.status === "SENT" ||
        p.status === "PARTIAL_RECEIVED",
    ).length;
    const pendingPrCount = (state.purchaseRequisitions || []).filter(
      (r) => r.status === "PENDING_APPROVAL",
    ).length;
    const totalSpend = (state.purchaseOrders || []).reduce(
      (sum, p) => sum + (p.grandTotal || 0),
      0,
    );
    const matchCount = (state.threeWayMatchings || []).filter(
      (m) => m.status === "MATCHED_100",
    ).length;
    const matchTotal = (state.threeWayMatchings || []).length;
    const matchRate =
      matchTotal > 0 ? Math.round((matchCount / matchTotal) * 100) : 100;

    const badgeProcure = document.getElementById("badge-sidebar-procurement");
    if (badgeProcure) badgeProcure.innerText = `${pendingPoCount} ใบสั่ง`;

    actionContainer.innerHTML = `
          <button onclick="autoGeneratePrFromLowStock()" class="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold px-3.5 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="zap" class="w-4 h-4 text-slate-900"></i><span>⚡ Auto-PR สต็อกต่ำ</span>
          </button>
          <button onclick="openNewPurchaseOrderSheet()" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="plus-circle" class="w-4 h-4"></i><span>+ เปิดใบสั่งซื้อใหม่ (PO)</span>
          </button>
          <button onclick="renderCurrentView(); showToast('รีเฟรชข้อมูลจัดซื้อ', 'อัปเดตสถานะใบสั่งซื้อและตรวจรับสินค้าเรียบร้อย', 'info')" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i><span>รีเฟรช</span>
          </button>
        `;

    metricContainer.innerHTML = `
          <div class="bg-blue-50/70 border border-blue-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-blue-800">ยอดสั่งซื้อรวม (Total PO)</p><h3 class="text-xl font-bold text-blue-900 mt-0.5">฿${totalSpend.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3></div>
            <div class="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center"><i data-lucide="receipt" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-amber-800">คำขอซื้อรออนุมัติ (PR Pending)</p><h3 class="text-xl font-bold text-amber-900 mt-0.5">${pendingPrCount} คำขอ</h3></div>
            <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><i data-lucide="file-question" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-indigo-50/70 border border-indigo-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-indigo-800">ใบสั่งซื้อรอดำเนินการ (Active POs)</p><h3 class="text-xl font-bold text-indigo-900 mt-0.5">${pendingPoCount} ใบ</h3></div>
            <div class="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center"><i data-lucide="truck" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-emerald-800">ตรวจเทียบเอกสาร (3-Way Match)</p><h3 class="text-xl font-bold text-emerald-900 mt-0.5">${matchRate}% สมบูรณ์</h3></div>
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><i data-lucide="shield-check" class="w-5 h-5"></i></div>
          </div>
        `;

    filterDropdowns.innerHTML = `
          <select id="view-filter-procure-supplier" onchange="renderCurrentView()" class="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500">
            <option value="all">ผู้จำหน่ายทั้งหมด (All Suppliers)</option>
            ${(state.suppliers || []).map((s) => `<option value="${s.id}">${s.code} - ${s.name.split(" (")[0]}</option>`).join("")}
          </select>
        `;
  } else if (state.currentView === "staff") {
    const activeStaffCount = (state.employees || []).filter(
      (e) => e.employmentStatus === "ACTIVE",
    ).length;
    const expiringLicenses = (state.employees || []).filter(
      (e) =>
        e.licenseStatus === "EXPIRING_SOON" || e.licenseStatus === "EXPIRED",
    ).length;
    const pendingLeaves = (state.leaveRequests || []).filter(
      (l) => l.status === "PENDING",
    ).length;
    const totalClockInToday = (state.attendanceRecords || []).filter(
      (a) => a.workDate === "2026-03-02",
    ).length;
    const onTimeCount = (state.attendanceRecords || []).filter(
      (a) => a.workDate === "2026-03-02" && a.status === "ON_TIME",
    ).length;
    const onTimeRate =
      totalClockInToday > 0
        ? Math.round((onTimeCount / totalClockInToday) * 100)
        : 100;

    const badgeStaff = document.getElementById("badge-sidebar-staff");
    if (badgeStaff) badgeStaff.innerText = `${totalClockInToday} ประจำการ`;

    actionContainer.innerHTML = `
          <button onclick="simulateClockIn()" class="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold px-3.5 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="zap" class="w-4 h-4 text-slate-900"></i><span>⚡ ลงเวลาปฏิบัติงาน (Clock-In)</span>
          </button>
          <button onclick="openFormSheet('staff-new')" class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="user-plus" class="w-4 h-4"></i><span>+ เพิ่มบุคลากรใหม่</span>
          </button>
          <button onclick="renderCurrentView(); showToast('รีเฟรชข้อมูลบุคลากร', 'อัปเดตตารางเวรและการลงเวลาทำงานล่าสุด', 'info')" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i><span>รีเฟรช</span>
          </button>
        `;

    metricContainer.innerHTML = `
          <div class="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-emerald-800">บุคลากรประจำการวันนี้</p><h3 class="text-xl font-bold text-emerald-900 mt-0.5">${totalClockInToday} / ${activeStaffCount} คน</h3></div>
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><i data-lucide="stethoscope" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-amber-800">เตือนใบอนุญาตใกล้หมดอายุ</p><h3 class="text-xl font-bold text-amber-900 mt-0.5">${expiringLicenses} รายการ</h3></div>
            <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><i data-lucide="alert-triangle" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-blue-50/70 border border-blue-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-blue-800">เข้างานตรงเวลา (On-Time)</p><h3 class="text-xl font-bold text-blue-900 mt-0.5">${onTimeRate}%</h3></div>
            <div class="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center"><i data-lucide="check-check" class="w-5 h-5"></i></div>
          </div>
          <div class="bg-purple-50/70 border border-purple-200/90 rounded-xl p-3.5 flex items-center justify-between">
            <div><p class="text-xs font-semibold text-purple-800">คำขอลา / OT รออนุมัติ</p><h3 class="text-xl font-bold text-purple-900 mt-0.5">${pendingLeaves} รายการ</h3></div>
            <div class="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center"><i data-lucide="calendar-x" class="w-5 h-5"></i></div>
          </div>
        `;

    filterDropdowns.innerHTML = `
          <select id="view-filter-staff-dept" onchange="state.activeStaffDepartmentFilter = this.value; renderCurrentView();" class="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500">
            <option value="ALL" ${state.activeStaffDepartmentFilter === "ALL" ? "selected" : ""}>แผนกทั้งหมด (All Departments)</option>
            ${(state.departments || []).map((d) => `<option value="${d.id}" ${state.activeStaffDepartmentFilter == d.id ? "selected" : ""}>${d.code} - ${d.name}</option>`).join("")}
          </select>
        `;
  }

  lucide.createIcons();
}

// -------------------------------------------------------------
// 5. VIEW RENDER DISPATCHER
// -------------------------------------------------------------
function renderCurrentView() {
  updateDynamicHeadersAndKPIs();
  const searchQuery = (
    document.getElementById("view-filter-search")?.value || ""
  )
    .toLowerCase()
    .trim();
  const emptyState = document.getElementById("empty-state");

  if (state.currentView === "owners") {
    const container = document.getElementById("owners-view-container");
    container.classList.remove("hidden");
    const statusFilter =
      document.getElementById("view-filter-status")?.value || "all";
    const filtered = state.customers.filter((c) => {
      const matchSearch =
        c.display_name.toLowerCase().includes(searchQuery) ||
        c.customer_code.toLowerCase().includes(searchQuery) ||
        c.first_name.toLowerCase().includes(searchQuery) ||
        (c.last_name && c.last_name.toLowerCase().includes(searchQuery)) ||
        (c.tax_id && c.tax_id.includes(searchQuery)) ||
        c.phone_primary.includes(searchQuery) ||
        (c.phone_secondary && c.phone_secondary.includes(searchQuery)) ||
        (c.line_id && c.line_id.toLowerCase().includes(searchQuery));
      return (
        matchSearch && (statusFilter === "all" || c.status === statusFilter)
      );
    });

    if (filtered.length === 0) {
      container.classList.add("hidden");
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");
      if (state.viewMode === "card") {
        document.getElementById("owners-card-grid").classList.remove("hidden");
        document.getElementById("owners-list-table").classList.add("hidden");
        renderOwnersCardView(filtered);
      } else {
        document.getElementById("owners-card-grid").classList.add("hidden");
        document.getElementById("owners-list-table").classList.remove("hidden");
        renderOwnersListView(filtered);
      }
    }
  } else if (state.currentView === "pets") {
    const container = document.getElementById("pets-view-container");
    container.classList.remove("hidden");
    const speciesFilter =
      document.getElementById("view-filter-species")?.value || "all";
    const filtered = state.pets.filter((p) => {
      const owner = getPrimaryOwnerForPet(p.id);
      const ownerName = owner ? owner.display_name.toLowerCase() : "";
      const matchSearch =
        p.pet_name.toLowerCase().includes(searchQuery) ||
        p.pet_code.toLowerCase().includes(searchQuery) ||
        p.breed.toLowerCase().includes(searchQuery) ||
        (p.microchip_number && p.microchip_number.includes(searchQuery)) ||
        ownerName.includes(searchQuery);
      return (
        matchSearch && (speciesFilter === "all" || p.species === speciesFilter)
      );
    });

    if (filtered.length === 0) {
      container.classList.add("hidden");
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");
      if (state.viewMode === "card") {
        document.getElementById("pets-card-grid").classList.remove("hidden");
        document.getElementById("pets-list-table").classList.add("hidden");
        renderPetsCardView(filtered);
      } else {
        document.getElementById("pets-card-grid").classList.add("hidden");
        document.getElementById("pets-list-table").classList.remove("hidden");
        renderPetsListView(filtered);
      }
    }
  } else if (state.currentView === "queue") {
    const container = document.getElementById("queue-view-container");
    container.classList.remove("hidden");
    const triageFilter =
      document.getElementById("view-filter-triage")?.value || "all";
    const filtered = state.queues.filter((q) => {
      const pet = getPetById(q.pet_id);
      const owner = getCustomerById(q.customer_id);
      const matchSearch =
        q.ticket_number.toLowerCase().includes(searchQuery) ||
        (pet && pet.pet_name.toLowerCase().includes(searchQuery)) ||
        (owner && owner.display_name.toLowerCase().includes(searchQuery)) ||
        q.chief_complaint.toLowerCase().includes(searchQuery);
      return (
        matchSearch &&
        (triageFilter === "all" || q.triage_level === triageFilter)
      );
    });

    if (state.viewMode === "card") {
      document.getElementById("queue-kanban-board").classList.remove("hidden");
      document.getElementById("queue-list-table").classList.add("hidden");
      renderQueueKanbanBoard(filtered);
    } else {
      document.getElementById("queue-kanban-board").classList.add("hidden");
      document.getElementById("queue-list-table").classList.remove("hidden");
      renderQueueListView(filtered);
    }
  } else if (state.currentView === "appointments") {
    const container = document.getElementById("appointments-view-container");
    container.classList.remove("hidden");
    renderAppointmentsCalendar();
  } else if (state.currentView === "emr") {
    const container = document.getElementById("emr-view-container");
    container.classList.remove("hidden");
    renderEMRConsultationView(searchQuery);
  } else if (state.currentView === "pharmacy") {
    const container = document.getElementById("pharmacy-view-container");
    container.classList.remove("hidden");
    const statusFilter =
      document.getElementById("view-filter-dispense-status")?.value || "all";
    const filtered = state.dispensings.filter((d) => {
      const pet = getPetById(d.pet_id);
      const owner = getCustomerById(d.customer_id);
      const petName = pet ? pet.pet_name.toLowerCase() : "";
      const ownerName = owner ? owner.display_name.toLowerCase() : "";
      const matchSearch =
        d.dispensing_number.toLowerCase().includes(searchQuery) ||
        petName.includes(searchQuery) ||
        ownerName.includes(searchQuery) ||
        (d.diagnosis_summary &&
          d.diagnosis_summary.toLowerCase().includes(searchQuery));
      return (
        matchSearch && (statusFilter === "all" || d.status === statusFilter)
      );
    });

    if (filtered.length === 0) {
      container.classList.add("hidden");
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");
      if (state.viewMode === "card") {
        document
          .getElementById("pharmacy-card-grid")
          .classList.remove("hidden");
        document.getElementById("pharmacy-list-table").classList.add("hidden");
        renderPharmacyCardView(filtered);
      } else {
        document.getElementById("pharmacy-card-grid").classList.add("hidden");
        document
          .getElementById("pharmacy-list-table")
          .classList.remove("hidden");
        renderPharmacyListView(filtered);
      }
    }
  } else if (state.currentView === "inventory") {
    const container = document.getElementById("inventory-view-container");
    container.classList.remove("hidden");
    emptyState.classList.add("hidden");
    const badge = document.getElementById("inventory-item-count-badge");
    if (badge) badge.innerText = `${state.products.length} รายการ`;
    if (typeof renderInventorySubTabContent === "function") {
      renderInventorySubTabContent();
    }
  } else if (state.currentView === "lab") {
    const container = document.getElementById("lab-view-container");
    container.classList.remove("hidden");
    emptyState.classList.add("hidden");
    renderLabSubTabContent();
  } else if (state.currentView === "surgery") {
    const container = document.getElementById("surgery-view-container");
    container.classList.remove("hidden");
    emptyState.classList.add("hidden");
    const activeBadge = document.getElementById("surgery-active-count-badge");
    if (activeBadge) {
      activeBadge.innerText = `${state.surgerySchedules.length} เคสในระบบ`;
    }
    if (typeof renderSurgerySubTabContent === "function") {
      renderSurgerySubTabContent();
    }
  } else if (state.currentView === "billing") {
    const container = document.getElementById("billing-view-container");
    container.classList.remove("hidden");
    emptyState.classList.add("hidden");

    const unpaidCount = state.invoices.filter(
      (i) => i.status === "UNPAID" || i.status === "PARTIAL",
    ).length;
    const unpaidBadge = document.getElementById("billing-unpaid-count-badge");
    if (unpaidBadge) {
      unpaidBadge.innerText = `${unpaidCount} บิลรอชำระ`;
    }

    if (typeof renderBillingSubTabContent === "function") {
      renderBillingSubTabContent();
    }
  } else if (state.currentView === "crm") {
    const container = document.getElementById("crm-view-container");
    container.classList.remove("hidden");
    emptyState.classList.add("hidden");

    // Update Sub-tab buttons styling
    const subTabs = ["reminders", "membership", "campaigns", "feedback", "leads"];
    subTabs.forEach((tab) => {
      const btn = document.getElementById(`btn-crm-sub-${tab}`);
      if (!btn) return;
      if (tab === state.activeCrmSubFilter) {
        btn.className =
          "text-xs font-semibold px-3 py-1.5 rounded-md bg-white text-slate-800 shadow-xs transition cursor-pointer flex items-center gap-1.5 font-bold";
      } else {
        btn.className =
          "text-xs font-semibold px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center gap-1.5";
      }
    });

    renderCrmActiveSubTab();
  } else if (state.currentView === "procurement") {
    const container = document.getElementById("procurement-view-container");
    if (container) container.classList.remove("hidden");
    emptyState.classList.add("hidden");

    // Update Sub-tab buttons styling
    const subTabs = ["orders", "requisitions", "receipts", "suppliers"];
    subTabs.forEach((tab) => {
      const btn = document.getElementById(`btn-procure-sub-${tab}`);
      if (!btn) return;
      if (tab === state.activeProcurementSubTab) {
        btn.className =
          "text-xs font-semibold px-3 py-1.5 rounded-md bg-white text-slate-800 shadow-xs transition cursor-pointer flex items-center gap-1.5 font-bold";
      } else {
        btn.className =
          "text-xs font-semibold px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center gap-1.5";
      }
    });

    renderProcurementActiveSubTab();
  } else if (state.currentView === "staff") {
    const container = document.getElementById("staff-view-container");
    if (container) container.classList.remove("hidden");
    emptyState.classList.add("hidden");

    // Update Sub-tab buttons styling
    const subTabs = ["rosters", "employees", "attendance", "payroll"];
    subTabs.forEach((tab) => {
      const btn = document.getElementById(`btn-staff-sub-${tab}`);
      if (!btn) return;
      if (tab === state.activeStaffSubTab) {
        btn.className =
          "text-xs font-semibold px-3 py-1.5 rounded-md bg-white text-slate-800 shadow-xs transition cursor-pointer flex items-center gap-1.5 font-bold";
      } else {
        btn.className =
          "text-xs font-semibold px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center gap-1.5";
      }
    });

    renderStaffActiveSubTab();
  }

  lucide.createIcons();
}

// -------------------------------------------------------------
// 10. SHADCN SLIDE-OVER SHEET CONTROLLER & FORMS
// -------------------------------------------------------------
function openSheetContainer() {
  const backdrop = document.getElementById("sheet-backdrop");
  const panel = document.getElementById("sheet-panel");
  backdrop.classList.remove("hidden");
  panel.classList.remove("hidden");
  void panel.offsetWidth;
  backdrop.classList.remove("opacity-0");
  backdrop.classList.add("opacity-100");
  panel.classList.remove("sheet-enter");
  panel.classList.add("sheet-enter-active");
}

function closeSheet() {
  const backdrop = document.getElementById("sheet-backdrop");
  const panel = document.getElementById("sheet-panel");
  backdrop.classList.remove("opacity-100");
  backdrop.classList.add("opacity-0");
  panel.classList.remove("sheet-enter-active");
  panel.classList.add("sheet-exit-active");
  setTimeout(() => {
    backdrop.classList.add("hidden");
    panel.classList.add("hidden");
    panel.classList.remove("sheet-exit-active");
    panel.classList.add("sheet-enter");
    state.sheetMode = null;
    state.activeItemId = null;
  }, 250);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSheet();
});

function openQuickActionSheet() {
  if (state.currentView === "emr") openSOAPFormSheet();
  else if (state.currentView === "queue") openFormSheet("walk-in");
  else if (state.currentView === "appointments") openFormSheet("appointment");
  else if (state.currentView === "pharmacy") {
    const pending = state.dispensings.find(
      (d) => d.status === "WAITING_DISPENSE",
    );
    if (pending) openDispenseSheet(pending.id);
    else
      showToast(
        "ไม่มีคิวค้างจ่าย",
        "ขณะนี้ไม่มีคำสั่งยาที่รอจ่ายในระบบ",
        "info",
      );
  } else if (state.currentView === "inventory") openStockManageSheet("receive");
  else if (state.currentView === "lab") {
    const pending = state.diagnosticOrders.find((o) => o.status !== "VERIFIED");
    if (pending) openLabResultSheet(pending.id);
    else openNewLabOrderSheet();
  } else if (state.currentView === "surgery") {
    openNewSurgeryScheduleSheet();
  } else if (state.currentView === "billing") {
    const pending = state.invoices.find((i) => i.status === "UNPAID");
    if (pending) openCheckoutSheet(pending.id);
    else
      showToast("ไม่มีบิลค้างชำระ", "ไม่มีใบแจ้งหนี้ที่รอชำระในขณะนี้", "info");
  } else if (state.currentView === "crm") {
    openNewFeedbackModal();
  } else if (state.currentView === "procurement") {
    openNewPurchaseOrderSheet();
  } else if (state.currentView === "staff") {
    simulateClockIn();
  } else openFormSheet("owner");
}

function openFormSheet(mode, itemId = null, extraParam = null) {
  if (mode === "billing-new-adhoc") {
    openNewInvoiceSheet();
    return;
  }
  if (mode === "procurement-new-po") {
    openNewPurchaseOrderSheet(itemId);
    return;
  }
  if (mode === "staff-new") {
    openNewStaffSheet();
    return;
  }

  state.sheetMode = mode;
  state.activeItemId = itemId;
  openSheetContainer();

  const badge = document.getElementById("sheet-badge");
  const title = document.getElementById("sheet-title");
  const subtitle = document.getElementById("sheet-subtitle");
  const body = document.getElementById("sheet-body");
  const footer = document.getElementById("sheet-footer");

  badge.innerText = "FORM SHEET";
  badge.className =
    "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200";
  footer.classList.remove("hidden");

  if (mode === "walk-in") {
    badge.innerText = "WALK-IN & TRIAGE";
    title.innerText = "รับเคส Walk-in & ประเมิน Triage ฉุกเฉิน";
    subtitle.innerText =
      "ประเมินระดับความเร่งด่วน สัญญาณชีพ และออกบัตรคิวเข้าสู่กระดานคิวสด";

    body.innerHTML = `
          <form id="walkin-form" class="space-y-4">
            <div class="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 space-y-3">
              <label class="block text-amber-900 font-bold">เลือกสัตว์เลี้ยง *</label>
              <select id="form-walkin-pet-id" class="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs">
                ${state.pets.map((p) => `<option value="${p.id}">${p.pet_name} (${p.species} - ${p.breed}) - เจ้าของ: ${getPrimaryOwnerForPet(p.id)?.display_name}</option>`).join("")}
              </select>
            </div>

            <div class="bg-rose-50/80 p-3.5 rounded-xl border border-rose-200 space-y-2">
              <label class="block text-rose-900 font-bold">ระดับความเร่งด่วน (Emergency Triage Level) *</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <label class="p-2 bg-white rounded-lg border border-rose-200 flex flex-col items-center text-center cursor-pointer hover:border-emerald-500">
                  <input type="radio" name="walkin-triage" value="NORMAL" checked class="text-teal-600 mb-1">
                  <span class="text-[11px] font-bold text-emerald-700">🟢 ปกติ</span>
                  <span class="text-[9px] text-slate-400">รอตามลำดับ</span>
                </label>
                <label class="p-2 bg-white rounded-lg border border-rose-200 flex flex-col items-center text-center cursor-pointer hover:border-amber-500">
                  <input type="radio" name="walkin-triage" value="URGENT" class="text-teal-600 mb-1">
                  <span class="text-[11px] font-bold text-amber-700">🟡 เร่งด่วน</span>
                  <span class="text-[9px] text-slate-400">ปวด/ไข้สูง</span>
                </label>
                <label class="p-2 bg-white rounded-lg border border-rose-300 flex flex-col items-center text-center cursor-pointer hover:border-rose-500">
                  <input type="radio" name="walkin-triage" value="EMERGENCY" class="text-rose-600 mb-1">
                  <span class="text-[11px] font-bold text-rose-700">🔴 ฉุกเฉิน</span>
                  <span class="text-[9px] text-slate-400">หอบ/เลือดออก</span>
                </label>
                <label class="p-2 bg-white rounded-lg border border-purple-300 flex flex-col items-center text-center cursor-pointer hover:border-purple-600">
                  <input type="radio" name="walkin-triage" value="CRITICAL" class="text-purple-600 mb-1">
                  <span class="text-[11px] font-bold text-purple-900">🟣 วิกฤตชีพ</span>
                  <span class="text-[9px] text-slate-400">หมดสติ/ชัก</span>
                </label>
              </div>
            </div>

            <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <label class="block text-slate-800 font-bold">บันทึกสัญญาณชีพคัดกรอง (Triage Vitals - Optional)</label>
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-[10px] text-slate-500 font-semibold mb-0.5">อุณหภูมิ (°C)</label>
                  <input type="number" step="0.1" id="form-walkin-temp" value="38.6" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800">
                </div>
                <div>
                  <label class="block text-[10px] text-slate-500 font-semibold mb-0.5">อัตราหัวใจ (BPM)</label>
                  <input type="number" id="form-walkin-hr" value="120" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800">
                </div>
                <div>
                  <label class="block text-[10px] text-slate-500 font-semibold mb-0.5">อัตราหายใจ (/min)</label>
                  <input type="number" id="form-walkin-rr" value="28" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label class="block text-[10px] text-slate-500 font-semibold mb-0.5">สีเยื่อเมือก (MM)</label>
                  <select id="form-walkin-mm" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800">
                    <option value="ชมพูสุขภาพดี (Pink)">ชมพูสุขภาพดี (Pink)</option>
                    <option value="ซีด (Pale)">ซีด (Pale)</option>
                    <option value="ม่วงคล้ำขาดออกซิเจน (Cyanotic)">ม่วงคล้ำขาดออกซิเจน (Cyanotic)</option>
                    <option value="เหลืองดีซ่าน (Icteric)">เหลืองดีซ่าน (Icteric)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] text-slate-500 font-semibold mb-0.5">CRT (วินาที)</label>
                  <select id="form-walkin-crt" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800">
                    <option value="< 2.0 วินาที (< 2s Normal)">&lt; 2.0 วินาที (ปกติ)</option>
                    <option value="> 2.5 วินาที (> 2.5s Prolonged)">&gt; 2.5 วินาที (ช้ากว่าปกติ)</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-700 font-semibold mb-1">ห้องตรวจเป้าหมาย</label>
                <select id="form-walkin-room" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
                  ${state.rooms.map((r) => `<option value="${r.id}">${r.name.split(" ")[0]} - ${r.name}</option>`).join("")}
                </select>
              </div>
              <div>
                <label class="block text-slate-700 font-semibold mb-1">แพทย์ประจำห้อง</label>
                <select id="form-walkin-doctor" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
                  ${state.doctors.map((d) => `<option value="${d.id}">${d.name}</option>`).join("")}
                </select>
              </div>
            </div>

            <div>
              <label class="block text-slate-700 font-semibold mb-1">อาการสำคัญ (Chief Complaint) *</label>
              <textarea id="form-walkin-complaint" rows="2" required placeholder="เช่น ซึม มีไข้ เบื่ออาหาร หรือได้รับอุบัติเหตุ..." class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"></textarea>
            </div>
          </form>
        `;
  } else if (mode === "appointment") {
    badge.innerText = "APPOINTMENT";
    title.innerText = "จองนัดหมายการรักษาใหม่";
    subtitle.innerText =
      "บันทึกวัน-เวลา จัดสรรสัตวแพทย์ และตรวจสอบการจองซ้ำอัตโนมัติ";

    body.innerHTML = `
          <form id="appointment-form" class="space-y-4">
            <div id="apt-conflict-alert" class="hidden p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold"></div>

            <div>
              <label class="block text-slate-700 font-bold mb-1">เลือกสัตว์เลี้ยง *</label>
              <select id="form-apt-pet" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
                ${state.pets.map((p) => `<option value="${p.id}">${p.pet_name} (${p.species}) - ${getPrimaryOwnerForPet(p.id)?.display_name}</option>`).join("")}
              </select>
            </div>

            <div>
              <label class="block text-slate-700 font-semibold mb-1">ประเภทบริการ (Service Catalog) *</label>
              <select id="form-apt-type" onchange="onServiceTypeChange(this.value)" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
                ${(state.service_types || []).map((s) => `<option value="${s.name}" data-room="${s.default_room_id}">${s.name} (${s.duration_minutes} นาที)</option>`).join("")}
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-700 font-semibold mb-1">วันที่นัดหมาย *</label>
                <input type="date" id="form-apt-date" value="${state.selectedDate}" onchange="checkLiveBookingConflict()" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
              </div>
              <div>
                <label class="block text-slate-700 font-semibold mb-1">ช่วงเวลา *</label>
                <select id="form-apt-time" onchange="checkLiveBookingConflict()" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
                  <option value="09:00 - 09:30">09:00 - 09:30</option>
                  <option value="09:30 - 10:00">09:30 - 10:00</option>
                  <option value="10:00 - 10:30">10:00 - 10:30</option>
                  <option value="10:30 - 11:00">10:30 - 11:00</option>
                  <option value="11:00 - 11:30">11:00 - 11:30</option>
                  <option value="13:30 - 14:00">13:30 - 14:00</option>
                  <option value="14:00 - 14:30">14:00 - 14:30</option>
                  <option value="14:30 - 15:00">14:30 - 15:00</option>
                  <option value="15:00 - 15:30">15:00 - 15:30</option>
                  <option value="15:30 - 16:00">15:30 - 16:00</option>
                  <option value="16:00 - 16:30">16:00 - 16:30</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-700 font-semibold mb-1">สัตวแพทย์ผู้ตรวจ *</label>
                <select id="form-apt-doctor" onchange="checkLiveBookingConflict()" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
                  ${state.doctors.map((d) => `<option value="${d.id}">${d.name}</option>`).join("")}
                </select>
              </div>
              <div>
                <label class="block text-slate-700 font-semibold mb-1">ห้องตรวจ *</label>
                <select id="form-apt-room" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
                  ${state.rooms.map((r) => `<option value="${r.id}">${r.name.split(" ")[0]} - ${r.name}</option>`).join("")}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-700 font-semibold mb-1">ช่องทางการจอง *</label>
                <select id="form-apt-channel" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
                  <option value="โทรศัพท์">โทรศัพท์</option>
                  <option value="LINE OA">LINE OA</option>
                  <option value="แอปคลินิก">แอปคลินิก</option>
                  <option value="หน้าเคาน์เตอร์ (Walk-in)">หน้าเคาน์เตอร์ (Walk-in)</option>
                </select>
              </div>
              <div>
                <label class="block text-slate-700 font-semibold mb-1">สถานะยืนยันเบื้องต้น</label>
                <select id="form-apt-confirmation" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs">
                  <option value="CONFIRMED">ยืนยันการมาแล้ว (Confirmed)</option>
                  <option value="PENDING">รอยืนยันอีกครั้ง (Pending)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-slate-700 font-semibold mb-1">เหตุผลและบันทึกอาการเบื้องต้น</label>
              <textarea id="form-apt-reason" rows="2" placeholder="ระบุเหตุผลในการนัด หรือประวัติอาการสำคัญ..." class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"></textarea>
            </div>
          </form>
        `;
  } else if (mode === "owner") {
    badge.innerText = "CUSTOMER REGISTRATION";
    title.innerText = "ลงทะเบียนเจ้าของใหม่ (Customer Registration)";
    subtitle.innerText =
      "บันทึกข้อมูลเจ้าของสัตว์เลี้ยง จัดการช่องทางติดต่อ และความยินยอม PDPA";
    renderNewOwnerForm();
  } else if (mode === "owner-edit") {
    badge.innerText = "EDIT PROFILE";
    renderOwnerEditForm(itemId);
  } else if (mode === "pet") {
    badge.innerText = "PET REGISTRATION";
    title.innerText = "ลงทะเบียนสัตว์เลี้ยงใหม่ (Pet Registration)";
    subtitle.innerText =
      "เพิ่มประวัติสัตว์เลี้ยงใหม่และเลือกผูกกับเจ้าของในระบบ";
    renderNewPetForm(extraParam || itemId);
  } else if (mode === "pet-edit") {
    badge.innerText = "EDIT PET";
    renderPetEditForm(itemId);
  }

  lucide.createIcons();
}

function openDetailSheet(type, id) {
  state.sheetMode = type === "owner" ? "owner-detail" : "pet-detail";
  state.activeItemId = id;
  openSheetContainer();

  const badge = document.getElementById("sheet-badge");
  badge.innerText = "360° PROFILE";

  if (type === "owner") {
    renderOwnerDetailSheet(id);
  } else {
    renderPetDetailSheet(id);
  }
}

// -------------------------------------------------------------
// 11. SUBMIT FORM HANDLER (DOMAINS 01, 02 & 03)
// -------------------------------------------------------------
function submitSheetForm() {
  if (state.sheetMode === "soap-encounter") {
    const activePet =
      getPetById(state.activeConsultationPetId) || state.pets[0];
    const chiefComplaint =
      document.getElementById("soap-chief-complaint")?.value.trim() ||
      "ตรวจสุขภาพ";
    const diagCatalogId = Number(
      document.getElementById("soap-diagnosis-catalog")?.value || 1,
    );
    const selectedDiag = (state.diagnosisCatalog || []).find(
      (d) => d.id === diagCatalogId,
    );

    // Multi-Item Prescriptions vs Single-Item Prescribing Fallback
    let prescriptionsToSave = [];
    if (state.soapPrescriptions && state.soapPrescriptions.length > 0) {
      prescriptionsToSave = state.soapPrescriptions.map((rx) => ({
        med_id: rx.med_id,
        name: rx.name,
        dose: rx.dose,
        route: rx.route || "Oral",
        freq: rx.freq,
        duration: rx.duration || "7 วัน",
        qty: typeof rx.qty === "number" ? `${rx.qty} หน่วย` : rx.qty,
        raw_qty: typeof rx.qty === "number" ? rx.qty : (parseInt(rx.qty) || 14),
        price: rx.price || 0,
        caution: rx.caution || "ทานยาต่อเนื่องตามแพทย์สั่ง",
      }));
    } else {
      const medSelectId = Number(
        document.getElementById("soap-med-select")?.value || 4,
      );
      const selectedMed = (state.medicationCatalog || []).find(
        (m) => m.id === medSelectId,
      );
      const medDose =
        document.getElementById("soap-med-dose")?.value.trim() || "ตามแพทย์สั่ง";
      const medFreq =
        document.getElementById("soap-med-freq")?.value.trim() || "วันละ 2 ครั้ง";
      if (selectedMed) {
        prescriptionsToSave.push({
          med_id: selectedMed.id,
          name: selectedMed.name,
          dose: medDose,
          route: selectedMed.default_route || "ตามที่ระบุ",
          freq: medFreq,
          duration: "7 วัน",
          qty: selectedMed.id === 4 ? "1 หลอด" : "14 เม็ด",
          raw_qty: selectedMed.id === 4 ? 1 : 14,
          price: selectedMed.price || 150,
          caution: selectedMed.caution || "ทานยาต่อเนื่องตามแพทย์สั่ง",
        });
      }
    }

    // Diagnostic Orders (Cross-Domain 05 integration)
    const diagnosticItems = [];
    if (document.getElementById("order-ear-swab")?.checked) {
      diagnosticItems.push({ code: "LAB-CYT-01", name: "Ear Swab Cytology", type: "LAB" });
    }
    if (document.getElementById("order-cbc")?.checked) {
      diagnosticItems.push({ code: "LAB-CBC-01", name: "Complete Blood Count (CBC)", type: "LAB" });
    }
    if (document.getElementById("order-xray")?.checked) {
      diagnosticItems.push({ code: "IMG-XR-ABD", name: "Digital X-Ray Abdomen (2 Views)", type: "IMAGING" });
    }
    if (document.getElementById("order-ultrasound")?.checked) {
      diagnosticItems.push({ code: "IMG-US-ABD", name: "Abdominal Ultrasound Screening", type: "IMAGING" });
    }

    const dispatchRadio = document.querySelector(
      'input[name="soap-queue-dispatch"]:checked',
    );
    const queueDispatchTarget = dispatchRadio
      ? dispatchRadio.value
      : "COMPLETED";

    const encNum = `ENC-2026-000${state.encounters.length + 1}`;
    const newEncounter = {
      id: state.encounters.length + 1,
      encounter_number: encNum,
      pet_id: activePet.id,
      customer_id: getPrimaryOwnerForPet(activePet.id)?.id || 1,
      encounter_date: "2026-03-02",
      doctor_id: 1,
      room_id: 1,
      status: "COMPLETED",
      subjective: {
        chief_complaint: chiefComplaint,
        duration: document.getElementById("soap-duration")?.value || "2 วัน",
        appetite: document.getElementById("soap-appetite")?.value || "ปกติ",
        notes: "",
      },
      objective: {
        vitals: {
          temp: parseFloat(document.getElementById("soap-temp")?.value) || 38.6,
          heart_rate:
            parseInt(document.getElementById("soap-hr")?.value) || 110,
          resp_rate: parseInt(document.getElementById("soap-rr")?.value) || 24,
          weight:
            parseFloat(document.getElementById("soap-weight")?.value) ||
            activePet.current_weight,
          crt: document.getElementById("soap-crt")?.value || "< 2s",
          bcs: document.getElementById("soap-bcs")?.value || "5/9",
        },
        findings:
          document.getElementById("soap-findings")?.value ||
          "ตรวจร่างกายเรียบร้อย",
      },
      assessment: {
        primary_diagnosis: selectedDiag
          ? selectedDiag.name
          : "ตรวจสุขภาพทั่วไป",
        diagnosis_code: selectedDiag ? selectedDiag.code : "DG-005",
        differential: "-",
      },
      plan: {
        summary:
          document.getElementById("soap-homecare")?.value || "ให้ยาตามสั่ง",
        prescriptions: prescriptionsToSave,
        diagnostic_orders: diagnosticItems.map((d) => d.name),
        follow_up:
          document.getElementById("soap-followup-date")?.value ||
          "นัดตรวจซ้ำ 7 วัน",
      },
      sign_off: {
        doctor_name: "น.สพ. วุฒิชัย เจริญสุข",
        license_number: "วพ. 8824/2558",
        signed_at: "2026-03-02 " + new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      },
    };

    state.encounters.unshift(newEncounter);

    // Record Clinical Sign-Off
    if (state.clinical_sign_offs) {
      state.clinical_sign_offs.push({
        encounter_id: newEncounter.id,
        doctor_name: newEncounter.sign_off.doctor_name,
        license_number: newEncounter.sign_off.license_number,
        signed_at: newEncounter.sign_off.signed_at,
        digital_signature_hash: `SIG-${Date.now().toString(16).toUpperCase()}`,
      });
    }

    // Record Follow-Up
    if (state.clinical_follow_ups && newEncounter.plan.follow_up) {
      state.clinical_follow_ups.push({
        id: state.clinical_follow_ups.length + 1,
        pet_id: activePet.id,
        encounter_id: newEncounter.id,
        scheduled_date: newEncounter.plan.follow_up,
        reason: `นัดตรวจติดตามอาการ: ${newEncounter.assessment.primary_diagnosis}`,
        status: "SCHEDULED",
        created_at: newEncounter.encounter_date,
      });
    }

    // Update Pet Weight if changed in examination
    if (newEncounter.objective.vitals.weight) {
      activePet.current_weight = newEncounter.objective.vitals.weight;
      activePet.weights_history = activePet.weights_history || [];
      activePet.weights_history.push({
        date: newEncounter.encounter_date || "2026-03-02",
        weight: newEncounter.objective.vitals.weight,
        measured_by: "น.สพ. วุฒิชัย เจริญสุข (EMR)",
      });
    }

    // Domain 02 Cross-Connection: Update Queue Ticket State
    const activeQueueTicket = state.queues.find(
      (q) => q.pet_id === activePet.id && q.stage !== "COMPLETED",
    );
    if (activeQueueTicket) {
      activeQueueTicket.stage = queueDispatchTarget;
    }

    // Domain 05 Cross-Connection: Automatically create Diagnostic Order if lab/imaging requested
    if (diagnosticItems.length > 0 && state.diagnosticOrders) {
      const newDiagId = state.diagnosticOrders.length + 1;
      const hasLab = diagnosticItems.some((i) => i.type === "LAB");
      const hasImaging = diagnosticItems.some((i) => i.type === "IMAGING");
      const testCategory = hasLab && hasImaging ? "ALL" : hasLab ? "LAB" : "IMAGING";

      state.diagnosticOrders.unshift({
        id: newDiagId,
        order_number: `ORD-2026-000${newDiagId}`,
        encounter_id: newEncounter.id,
        pet_id: activePet.id,
        customer_id: getPrimaryOwnerForPet(activePet.id)?.id || 1,
        doctor_id: 1,
        order_date: "2026-03-02 11:00",
        test_category: testCategory,
        items: diagnosticItems,
        clinical_indication: `${chiefComplaint} - ${newEncounter.assessment.primary_diagnosis}`,
        urgency: "ROUTINE",
        status: "PENDING_VERIFY",
        specimen_ids: [],
        verified_by: null,
        verified_at: null,
        has_critical_flag: false,
      });
    }

    // Domain 04 Cross-Connection: Automatically create Pending Dispensing Order with all medications
    if (prescriptionsToSave.length > 0 && state.dispensings) {
      const newDispensingId = state.dispensings.length + 1;
      const newDsp = {
        id: newDispensingId,
        dispensing_number: `DSP-2026-000${newDispensingId}`,
        prescription_id: newEncounter.id,
        encounter_number: encNum,
        queue_ticket_id: activeQueueTicket ? activeQueueTicket.id : null,
        pet_id: activePet.id,
        customer_id: getPrimaryOwnerForPet(activePet.id)?.id || 1,
        doctor_id: 1,
        status: "WAITING_DISPENSE",
        created_at:
          "2026-03-02 " +
          new Date().toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        dispensed_at: null,
        dispensed_by: null,
        diagnosis_summary: selectedDiag ? selectedDiag.name : "ตรวจรักษาทั่วไป",
        items: prescriptionsToSave.map((rx, idx) => ({
          id: idx + 1,
          product_id: rx.med_id || 1,
          name: rx.name,
          dose: rx.dose,
          frequency: rx.freq,
          duration: rx.duration || "7 วัน",
          quantity: rx.raw_qty || 14,
          unit: rx.name.includes("Dexoryl") || rx.name.includes("หยอด") ? "หลอด" : "เม็ด",
          instructions: `ป้อนหรือใช้ ${rx.dose} ${rx.freq}`,
          caution: rx.caution || "ทานยาต่อเนื่องตามแพทย์สั่ง",
          selected_lot_id: 1,
          status: "PENDING",
        })),
      };
      state.dispensings.unshift(newDsp);
    }

    // Reset temporary prescriptions state
    state.soapPrescriptions = [];

    // Central Event Bus Notification (D03 -> D04, D05, D07, D02)
    if (window.ClinicEventBus && window.CLINIC_EVENTS) {
      window.ClinicEventBus.emit(window.CLINIC_EVENTS.SOAP_ENCOUNTER_SAVED, {
        encounter: newEncounter,
        prescriptions: prescriptionsToSave,
        diagnosticItems: diagnosticItems,
        queueDispatchTarget: queueDispatchTarget,
        queueTicketId: activeQueueTicket ? activeQueueTicket.id : null,
        activePet: activePet
      });
    }

    showToast(
      "บันทึกเวชระเบียน SOAP สำเร็จ!",
      `${encNum} บันทึกเรียบร้อย (${prescriptionsToSave.length} รายการยา, ${diagnosticItems.length} รายการตรวจ) และส่งคิวไปที่: ${getStageNameTh(queueDispatchTarget)}`,
      "success",
    );
    closeSheet();
    renderCurrentView();
  } else if (state.sheetMode === "walk-in") {
    const petId = Number(document.getElementById("form-walkin-pet-id").value);
    const complaint = document
      .getElementById("form-walkin-complaint")
      .value.trim();
    const triageRadio = document.querySelector(
      'input[name="walkin-triage"]:checked',
    );
    const triageLevel = triageRadio ? triageRadio.value : "NORMAL";
    const roomId = Number(document.getElementById("form-walkin-room")?.value || 1);
    const doctorId = Number(document.getElementById("form-walkin-doctor")?.value || 1);

    const tempVal = parseFloat(document.getElementById("form-walkin-temp")?.value || 38.5);
    const hrVal = parseInt(document.getElementById("form-walkin-hr")?.value || 110);
    const rrVal = parseInt(document.getElementById("form-walkin-rr")?.value || 24);
    const mmVal = document.getElementById("form-walkin-mm")?.value || "ชมพูสุขภาพดี (Pink)";
    const crtVal = document.getElementById("form-walkin-crt")?.value || "< 2.0 วินาที (< 2s Normal)";

    if (!complaint) {
      alert("กรุณาระบุอาการเบื้องต้น");
      return;
    }

    const pet = getPetById(petId);
    const owner = getPrimaryOwnerForPet(petId);
    const prefix =
      triageLevel === "CRITICAL"
        ? "C"
        : triageLevel === "EMERGENCY"
        ? "E"
        : triageLevel === "URGENT"
        ? "U"
        : "W";
    const ticketNum = `${prefix}0${state.queues.length + 1}`;
    const priority =
      triageLevel === "CRITICAL"
        ? 3
        : triageLevel === "EMERGENCY"
        ? 2
        : triageLevel === "URGENT"
        ? 1
        : 0;

    const newQueueItem = {
      id: state.queues.length + 1,
      ticket_number: ticketNum,
      appointment_id: null,
      customer_id: owner ? owner.id : 1,
      pet_id: pet ? pet.id : 1,
      registration_type: "WALK_IN",
      chief_complaint: complaint,
      triage_level: triageLevel,
      priority: priority,
      stage: "WAITING",
      room_id: roomId,
      doctor_id: doctorId,
      entered_at: new Date().toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      wait_minutes: 0,
      call_count: 0,
      vitals: {
        temp: tempVal,
        heart_rate: hrVal,
        respiratory_rate: rrVal,
        mucous_membrane: mmVal,
        crt: crtVal,
      },
    };

    state.queues.unshift(newQueueItem);

    // Record in triage_assessments and observations
    if (!state.triage_assessments) state.triage_assessments = [];
    const triageId = state.triage_assessments.length + 1;
    state.triage_assessments.push({
      id: triageId,
      queue_ticket_id: newQueueItem.id,
      pet_id: pet ? pet.id : 1,
      urgency_level: triageLevel,
      chief_complaint: complaint,
      assessed_by: "พยาบาลสัตว์คัดกรอง",
      assessed_at: new Date().toISOString(),
    });

    if (!state.triage_observations) state.triage_observations = [];
    state.triage_observations.push({
      id: state.triage_observations.length + 1,
      triage_id: triageId,
      observation_type: "VITAL_SIGNS",
      temp: tempVal,
      heart_rate: hrVal,
      respiratory_rate: rrVal,
      mucous_membrane: mmVal,
      crt: crtVal,
      recorded_at: new Date().toISOString(),
    });

    // Record audit history
    if (!state.queue_status_histories) state.queue_status_histories = [];
    state.queue_status_histories.push({
      id: state.queue_status_histories.length + 1,
      queue_ticket_id: newQueueItem.id,
      old_stage: "REGISTRATION",
      new_stage: "WAITING",
      changed_at: new Date().toISOString(),
      changed_by: "เจ้าหน้าที่เวชระเบียน",
      reason: `ลงทะเบียน Walk-in (${triageLevel})`,
    });

    if (triageLevel === "CRITICAL" || triageLevel === "EMERGENCY") {
      playChimeTone();
    }

    showToast(
      "รับเคส Walk-in สำเร็จ!",
      `ออกบัตรคิว #${ticketNum} (${triageLevel}) ให้ ${pet ? pet.pet_name : "สัตว์ป่วย"} แล้ว`,
      triageLevel === "CRITICAL" || triageLevel === "EMERGENCY"
        ? "warning"
        : "success",
    );
    closeSheet();
    switchMainView("queue");
  } else if (state.sheetMode === "appointment") {
    const petId = Number(document.getElementById("form-apt-pet").value);
    const aptType = document.getElementById("form-apt-type").value;
    const aptDate = document.getElementById("form-apt-date").value;
    const aptTime = document.getElementById("form-apt-time").value;
    const doctorId = Number(document.getElementById("form-apt-doctor")?.value || 1);
    const roomId = Number(document.getElementById("form-apt-room")?.value || 1);
    const channel = document.getElementById("form-apt-channel")?.value || "โทรศัพท์";
    const confirmation = document.getElementById("form-apt-confirmation")?.value || "CONFIRMED";
    const reason = document.getElementById("form-apt-reason")?.value.trim() || aptType;

    const pet = getPetById(petId);
    const owner = getPrimaryOwnerForPet(petId);

    // Double-booking check
    const conflictCheck = checkAppointmentConflict(doctorId, roomId, aptDate, aptTime);
    if (conflictCheck.conflict) {
      const waitlistConfirm = confirm(
        `⚠️ พบการนัดหมายซ้อน!\nสัตวแพทย์มีนัดหมายช่วงเวลาดังกล่าวแล้ว (${conflictCheck.existingApt.appointment_number})\n\nคุณต้องการบันทึกสัตว์เลี้ยงนี้ลงใน "รายชื่อรอคิว (Waitlist)" แทนหรือไม่?`,
      );

      if (waitlistConfirm) {
        if (!state.appointment_waitlists) state.appointment_waitlists = [];
        state.appointment_waitlists.push({
          id: state.appointment_waitlists.length + 1,
          customer_id: owner ? owner.id : 1,
          pet_id: pet ? pet.id : 1,
          preferred_date: aptDate,
          preferred_time: aptTime,
          preferred_doctor_id: doctorId,
          reason: `รอคิวเนื่องจากสล็อตเต็ม: ${aptType}`,
          status: "WAITING",
          created_at: new Date().toISOString(),
          notes: reason,
        });

        showToast(
          "เพิ่มลงใน Waitlist แล้ว",
          `บันทึก ${pet ? pet.pet_name : "สัตว์เลี้ยง"} ลงรายชื่อรอคิวเรียบร้อยแล้ว`,
          "info",
        );
        closeSheet();
        renderAppointmentsCalendar();
      }
      return;
    }

    const aptNum = `APT-2026-000${state.appointments.length + 1}`;

    state.appointments.push({
      id: state.appointments.length + 1,
      appointment_number: aptNum,
      customer_id: owner ? owner.id : 1,
      pet_id: pet ? pet.id : 1,
      appointment_type: aptType,
      appointment_reason: reason,
      scheduled_date: aptDate,
      scheduled_time: aptTime,
      doctor_id: doctorId,
      room_id: roomId,
      status: "SCHEDULED",
      source_channel: channel,
      confirmation_status: confirmation,
      created_at: new Date().toISOString(),
    });

    showToast(
      "จองนัดหมายสำเร็จ!",
      `บันทึกนัดหมาย ${aptNum} ให้ ${pet ? pet.pet_name : "สัตว์เลี้ยง"} เรียบร้อยแล้ว`,
      "success",
    );
    closeSheet();
    switchMainView("appointments");
  } else if (state.sheetMode === "owner") {
    const ownerTypeRadio = document.querySelector(
      'input[name="form-owner-type"]:checked',
    );
    const ownerType = ownerTypeRadio ? ownerTypeRadio.value : "INDIVIDUAL";
    const prefix = document.getElementById("form-owner-prefix")?.value || "คุณ";
    const firstname = document
      .getElementById("form-owner-firstname")
      ?.value.trim();
    const lastname =
      document.getElementById("form-owner-lastname")?.value.trim() || "";
    const displayname = document
      .getElementById("form-owner-displayname")
      ?.value.trim();
    const taxid =
      document.getElementById("form-owner-taxid")?.value.trim() || "";
    const phone1 = document.getElementById("form-owner-phone1")?.value.trim();
    const phone2 =
      document.getElementById("form-owner-phone2")?.value.trim() || "";
    const line = document.getElementById("form-owner-line")?.value.trim() || "";
    const email =
      document.getElementById("form-owner-email")?.value.trim() || "";
    const address =
      document.getElementById("form-owner-address")?.value.trim() || "";
    const district =
      document.getElementById("form-owner-district")?.value.trim() || "วัฒนา";
    const province =
      document.getElementById("form-owner-province")?.value.trim() ||
      "กรุงเทพมหานคร";
    const postal =
      document.getElementById("form-owner-postal")?.value.trim() || "10110";
    const referral =
      document.getElementById("form-owner-referral")?.value ||
      "Walk-in หน้าร้าน";
    const birthdate =
      document.getElementById("form-owner-birthdate")?.value || "";
    const gender =
      document.getElementById("form-owner-gender")?.value ||
      (ownerType === "JURISTIC" ? "นิติบุคคล" : "ไม่ระบุ");
    const prefChannel =
      document.getElementById("form-owner-pref-channel")?.value || "LINE";
    const prefTime =
      document.getElementById("form-owner-pref-time")?.value || "13:00 - 17:00";
    const prefLang =
      document.getElementById("form-owner-pref-lang")?.value || "TH";

    if (!firstname || !displayname || !phone1) {
      alert("กรุณากรอกข้อมูลที่จำเป็น: ชื่อ, ชื่อแสดงผล, และเบอร์โทรศัพท์หลัก");
      return;
    }

    // Live duplicate validation check
    const dupPhone = checkDuplicateCustomerPhone(phone1);
    if (dupPhone) {
      if (
        !confirm(
          `คำเตือน: เบอร์โทรศัพท์นี้ตรงกับลูกค้าในระบบแล้ว (${dupPhone.display_name} - ${dupPhone.customer_code})\n\nคุณต้องการบันทึกเป็นลูกค้าใหม่ต่อไปหรือไม่?`,
        )
      ) {
        return;
      }
    }

    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    const consentReminders =
      document.getElementById("pdpa-consent-reminders")?.checked || false;
    const consentMarketing =
      document.getElementById("pdpa-consent-marketing")?.checked || false;
    const consentMedia =
      document.getElementById("pdpa-consent-media")?.checked || false;

    const newId = state.customers.length + 1;
    const newCustomerCode = `CUS-2026-000${newId}`;

    state.customers.unshift({
      id: newId,
      customer_code: newCustomerCode,
      customer_type: ownerType,
      prefix: prefix,
      first_name: firstname,
      last_name: lastname,
      display_name: displayname,
      tax_id: taxid,
      date_of_birth: birthdate,
      gender: gender,
      preferences: {
        preferred_channel: prefChannel,
        preferred_time: prefTime,
        language: prefLang,
      },
      documents: [],
      phone_primary: phone1,
      phone_secondary: phone2,
      email: email,
      line_id: line,
      address_line: address,
      subdistrict: "",
      district: district,
      province: province,
      postal_code: postal,
      branch_id: 1,
      referral_source: referral,
      status: "ACTIVE",
      registered_at: new Date().toISOString().slice(0, 10),
      consents: {
        privacy_policy: { granted: true, updated_at: now, version: "v1.2" },
        service_reminders: {
          granted: consentReminders,
          updated_at: now,
          version: "v1.2",
        },
        marketing_promo: {
          granted: consentMarketing,
          updated_at: now,
          version: "v1.2",
        },
        media_pr: { granted: consentMedia, updated_at: now, version: "v1.2" },
        insurance_sharing: { granted: true, updated_at: now, version: "v1.2" },
      },
      consent_history: [
        {
          purpose: "privacy_policy",
          action: "GRANTED",
          timestamp: now,
          channel: "REGISTRATION",
        },
        {
          purpose: "service_reminders",
          action: consentReminders ? "GRANTED" : "OPT_OUT",
          timestamp: now,
          channel: "REGISTRATION",
        },
      ],
    });

    showToast(
      "ลงทะเบียนเจ้าของสำเร็จ!",
      `เพิ่มลูกค้า ${displayname} (${newCustomerCode}) เรียบร้อยแล้ว`,
      "success",
    );
    closeSheet();
    renderCurrentView();
  } else if (state.sheetMode === "pet") {
    const ownerId = Number(
      document.getElementById("form-pet-owner-id")?.value || 1,
    );
    const petName = document.getElementById("form-pet-name")?.value.trim();
    const speciesId = Number(
      document.getElementById("form-pet-species-id")?.value || 1,
    );
    const speciesObj = state.speciesCatalog.find((s) => s.id === speciesId) || {
      name: "สุนัข",
    };
    const breed =
      document.getElementById("form-pet-breed-id")?.value || "พันธุ์ผสม";
    const color =
      document.getElementById("form-pet-color")?.value.trim() || "ไม่ระบุ";
    const sex = document.getElementById("form-pet-sex")?.value || "ผู้ (Male)";
    const neutered =
      document.getElementById("form-pet-neutered")?.value || "ยังไม่ทำหมัน";
    const weight =
      parseFloat(document.getElementById("form-pet-weight")?.value) || 5.0;
    const birthdate =
      document.getElementById("form-pet-birthdate")?.value || "2024-01-01";
    const birthEstimated =
      document.getElementById("form-pet-birth-estimated")?.checked || false;
    const microchip =
      document.getElementById("form-pet-microchip")?.value.trim() || "";
    const photo =
      document.getElementById("form-pet-photo")?.value.trim() ||
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300";
    const initialAllergy = document
      .getElementById("form-pet-initial-allergy")
      ?.value.trim();

    if (!petName) return alert("กรุณาระบุชื่อสัตว์เลี้ยง");

    // Check duplicate microchip
    if (microchip) {
      const dupChip = checkDuplicateMicrochip(microchip);
      if (dupChip) {
        if (
          !confirm(
            `คำเตือน: เลขไมโครชิป ${microchip} ซ้ำกับ ${dupChip.pet_name} (${dupChip.pet_code})\n\nคุณต้องการบันทึกต่อไปหรือไม่?`,
          )
        ) {
          return;
        }
      }
    }

    const newPetId = state.pets.length + 1;
    const newPetCode = `PET-2026-000${newPetId}`;
    const today = new Date().toISOString().slice(0, 10);

    const allergiesList = initialAllergy ? [initialAllergy] : [];
    const allergiesDetail = initialAllergy
      ? [
          {
            id: 1,
            allergen: initialAllergy,
            category: "DRUG",
            severity: "MODERATE",
            onset_date: today,
            status: "CONFIRMED",
            diagnosed_by: "บันทึกแรกรับ",
            notes: "แจ้งประวัติแรกรับ",
          },
        ]
      : [];

    state.pets.unshift({
      id: newPetId,
      pet_code: newPetCode,
      pet_name: petName,
      species_id: speciesId,
      species: speciesObj.name,
      breed_id: 1,
      breed: breed,
      sex: sex,
      reproductive_status: neutered,
      birth_date: birthdate,
      birth_date_is_estimated: birthEstimated,
      color: color,
      microchip_number: microchip,
      current_weight: weight,
      weights_history: [
        { date: today, weight: weight, measured_by: "แรกรับลงทะเบียน" },
      ],
      allergies: allergiesList,
      allergies_detail: allergiesDetail,
      chronic_conditions: [],
      chronic_conditions_detail: [],
      vaccinations: [],
      photo: photo,
      status: "ACTIVE",
    });

    // Link with selected owner (Solves the hardcoded ID 1 bug)
    state.ownerships.push({
      id: state.ownerships.length + 1,
      pet_id: newPetId,
      customer_id: ownerId,
      ownership_type: "PRIMARY",
      is_primary: true,
      relationship_title: "เจ้าของหลัก",
      start_date: today,
      end_date: null,
      can_give_consent: true,
      notes: "ลงทะเบียนแรกรับ",
    });

    const selectedOwner = getCustomerById(ownerId);
    showToast(
      "ลงทะเบียนสัตว์เลี้ยงสำเร็จ!",
      `เพิ่ม ${petName} (${newPetCode}) ให้เจ้าของ: ${selectedOwner?.display_name || "ลูกค้า"} แล้ว`,
      "success",
    );
    closeSheet();
    renderCurrentView();
  } else if (state.sheetMode === "stock-manage") {
    if (state.activeStockManageTab === "receive") {
      const prodId = Number(
        document.getElementById("form-stock-product")?.value || 1,
      );
      const lotNum =
        document.getElementById("form-stock-lot")?.value.trim() ||
        `LOT-RCV-${Date.now().toString().slice(-4)}`;
      const expDate =
        document.getElementById("form-stock-expiry")?.value || "2027-12-31";
      const mfgDate =
        document.getElementById("form-stock-mfg")?.value || "2026-01-01";
      const qty =
        parseFloat(document.getElementById("form-stock-qty")?.value) || 50;
      const cost =
        parseFloat(document.getElementById("form-stock-cost")?.value) || 20;
      const warehouse =
        document.getElementById("form-stock-warehouse")?.value ||
        "คลังยาหลักห้องตรวจ";
      const loc =
        document.getElementById("form-stock-location")?.value.trim() ||
        "A-01-01";

      const newLotId = state.inventoryLots.length + 1;
      const newLot = {
        id: newLotId,
        product_id: prodId,
        lot_number: lotNum,
        manufactured_date: mfgDate,
        expiry_date: expDate,
        received_date: "2026-03-02",
        unit_cost: cost,
        quantity_initial: qty,
        status: "ACTIVE",
      };
      state.inventoryLots.unshift(newLot);

      // Add / update stock balance
      state.stockBalances.push({
        id: state.stockBalances.length + 1,
        product_id: prodId,
        lot_id: newLotId,
        warehouse_name: warehouse,
        location_code: loc,
        quantity_on_hand: qty,
        quantity_reserved: 0,
        quantity_available: qty,
      });

      // Record movement
      state.stockMovements.unshift({
        id: state.stockMovements.length + 1,
        movement_number: `MOV-2026-00${state.stockMovements.length + 1}`,
        product_id: prodId,
        lot_id: newLotId,
        movement_type: "RECEIVE",
        quantity: qty,
        unit_cost: cost,
        reference_type: "GOODS_RECEIPT",
        reference_code: `GR-${lotNum}`,
        movement_at: "2026-03-02 11:30",
        performed_by: "เจ้าหน้าที่คลังยา",
        notes: "ตรวจรับยาเข้าคลังใหม่",
      });

      const prod = getProductById(prodId);
      showToast(
        "ตรวจรับยาเข้าคลังสำเร็จ!",
        `รับ ${prod ? prod.product_name : ""} ล็อต ${lotNum} จำนวน ${qty} หน่วยเข้าคลังเรียบร้อย`,
        "success",
      );
      closeSheet();
      renderCurrentView();
    } else if (state.activeStockManageTab === "adjust") {
      const prodId = Number(
        document.getElementById("form-adjust-product")?.value || 1,
      );
      const adjType =
        document.getElementById("form-adjust-type")?.value || "ADD";
      const adjQty =
        parseFloat(document.getElementById("form-adjust-qty")?.value) || 5;
      const reason =
        document.getElementById("form-adjust-reason")?.value ||
        "ตรวจนับยอดประจำรอบ";

      const balance = state.stockBalances.find(
        (sb) => sb.product_id === prodId,
      );
      if (balance) {
        const actualDelta = adjType === "ADD" ? adjQty : -adjQty;
        balance.quantity_on_hand = Math.max(
          0,
          balance.quantity_on_hand + actualDelta,
        );
        balance.quantity_available = Math.max(
          0,
          balance.quantity_available + actualDelta,
        );

        state.stockMovements.unshift({
          id: state.stockMovements.length + 1,
          movement_number: `MOV-2026-00${state.stockMovements.length + 1}`,
          product_id: prodId,
          lot_id: balance.lot_id,
          movement_type: "ADJUST",
          quantity: actualDelta,
          unit_cost: 0,
          reference_type: "STOCK_ADJUSTMENT",
          reference_code: `ADJ-${Date.now().toString().slice(-4)}`,
          movement_at: "2026-03-02 11:35",
          performed_by: "ผู้จัดการคลัง",
          notes: reason,
        });

        const prod = getProductById(prodId);
        showToast(
          "ปรับปรุงยอดสต็อกสำเร็จ!",
          `ปรับยอด ${prod ? prod.product_name : ""} (${adjType === "ADD" ? "+" : "-"}${adjQty}) เหตุผล: ${reason}`,
          "success",
        );
      }
      closeSheet();
      renderCurrentView();
    }
  } else if (state.sheetMode === "internal-issue") {
    confirmInternalIssue();
  } else if (state.sheetMode === "stock-transfer") {
    confirmStockTransfer();
  }
}

// -------------------------------------------------------------
// 13. INITIALIZATION
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderCurrentView();

  const btnToggle = document.getElementById("btn-toggle-sidebar");
  const sidebar = document.getElementById("main-sidebar");
  if (btnToggle && sidebar) {
    btnToggle.addEventListener("click", () => {
      sidebar.classList.toggle("hidden");
    });
  }

  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      document.getElementById("global-search-input")?.focus();
    }
  });
});
