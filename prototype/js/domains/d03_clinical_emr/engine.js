// -------------------------------------------------------------
// DOMAIN 03: CLINICAL & MEDICAL MANAGEMENT ENGINE (EMR / SOAP)
// -------------------------------------------------------------

// Global temporary state for multi-item prescribing in active SOAP session
state.soapPrescriptions = [];

function setActiveConsultationPet(petId) {
  state.activeConsultationPetId = Number(petId);
  renderEMRConsultationView();
}

// ==========================================
// 1. ACTIVE PATIENT & CONSULTATION VIEW
// ==========================================
function renderEMRConsultationView(searchQuery = "") {
  const activePet = getPetById(state.activeConsultationPetId) || state.pets[0];
  const activeOwner = getPrimaryOwnerForPet(activePet.id);
  const banner = document.getElementById("emr-active-patient-banner");
  if (!banner) return;

  const hasAllergy = activePet.allergies && activePet.allergies.length > 0;
  const hasChronic =
    activePet.chronic_conditions && activePet.chronic_conditions.length > 0;

  // Fetch pet's active problem list items
  const petProblems = (state.clinical_problem_lists || []).filter(
    (p) => p.pet_id === activePet.id,
  );
  const activeProblems = petProblems.filter((p) => p.status === "ACTIVE");
  const controlledProblems = petProblems.filter(
    (p) => p.status === "CONTROLLED",
  );

  // Check latest encounter vitals for CDS warnings
  const lastEnc = (state.encounters || []).find(
    (e) => e.pet_id === activePet.id,
  );
  const latestVitals = lastEnc ? lastEnc.objective.vitals : null;
  const isHighFever = latestVitals && latestVitals.temp >= 39.5;
  const isTachycardia = latestVitals && latestVitals.heart_rate >= 160;

  // Active Patient Banner (with Von Restorff Medical Alert & Problem List Widget)
  banner.innerHTML = `
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      
      <!-- Left: Identity & Photo -->
      <div class="flex items-start gap-4">
        <div class="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
          <img src="${activePet.photo}" class="w-full h-full object-cover">
          <span class="absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-white">${activePet.species}</span>
        </div>

        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-xl font-black text-slate-900 tracking-tight">${activePet.pet_name}</h2>
            <span class="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">${activePet.pet_code}</span>
            <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>กำลังตรวจในห้องแพทย์</span>
            </span>
            ${isHighFever ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">🔥 ไข้สูง (${latestVitals.temp}°C)</span>` : ""}
            ${isTachycardia ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">⚠️ หัวใจเต้นเร็ว (${latestVitals.heart_rate} bpm)</span>` : ""}
          </div>

          <p class="text-xs text-slate-600 font-medium mt-1">
            ${activePet.breed} • เพศ ${activePet.sex} (${activePet.reproductive_status?.includes("ทำหมันแล้ว") ? "ทำหมันแล้ว" : "ยังไม่ทำหมัน"})
          </p>

          <div class="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
            <span>อายุ: <strong class="text-slate-800">${calculateAge(activePet.birth_date)}</strong></span>
            <span>•</span>
            <span>น้ำหนักล่าสุด: <strong class="text-teal-700">${activePet.current_weight} กก.</strong></span>
            <span>•</span>
            <span>เจ้าของ: <strong class="text-slate-800 cursor-pointer hover:underline" onclick="openDetailSheet('owner', ${activeOwner ? activeOwner.id : 1})">${activeOwner ? activeOwner.display_name : ""}</strong> (${activeOwner ? activeOwner.phone : "-"})</span>
          </div>
        </div>
      </div>

      <!-- Right: Patient Switcher & Room Info -->
      <div class="flex flex-col sm:flex-row lg:flex-col items-end gap-2.5 shrink-0">
        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-500 font-semibold">สลับสัตว์ป่วยในห้องตรวจ:</label>
          <select onchange="setActiveConsultationPet(this.value)" class="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-teal-500 cursor-pointer">
            ${state.pets
              .map(
                (p) => `
              <option value="${p.id}" ${p.id === activePet.id ? "selected" : ""}>
                ${p.pet_name} (${p.species} - ${p.breed})
              </option>
            `,
              )
              .join("")}
          </select>
        </div>

        <div class="flex items-center gap-2 text-xs text-slate-500">
          <span class="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 font-semibold flex items-center gap-1.5">
            <i data-lucide="door-open" class="w-3.5 h-3.5"></i>
            <span>ห้องตรวจ 1 (น.สพ. วุฒิชัย เจริญสุข - วพ.9824)</span>
          </span>
        </div>
      </div>

    </div>

    <!-- High-Contrast Medical Alert Box (Von Restorff Effect) -->
    ${
      hasAllergy || hasChronic
        ? `
      <div class="mt-4 pt-3.5 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-3">
        ${
          hasAllergy
            ? `
          <div class="bg-rose-50 border-2 border-rose-400/80 rounded-xl p-3 flex items-start gap-2.5 shadow-2xs">
            <i data-lucide="alert-octagon" class="w-5 h-5 text-rose-600 shrink-0 mt-0.5"></i>
            <div>
              <h4 class="text-xs font-black text-rose-900 uppercase tracking-wide">⚠️ ข้อควรระวัง: ประวัติแพ้ยา (Drug Allergy Alert!)</h4>
              <p class="text-xs font-bold text-rose-700 mt-0.5">${activePet.allergies.join(", ")}</p>
              <p class="text-[10px] text-rose-600 mt-0.5">* ห้ามสั่งใช้ยาหรือสารประกอบในกลุ่มนี้เด็ดขาด ระบบจะบล็อกคำสั่งยาอัตโนมัติ</p>
            </div>
          </div>
        `
            : ""
        }

        ${
          hasChronic
            ? `
          <div class="bg-amber-50 border-2 border-amber-400/80 rounded-xl p-3 flex items-start gap-2.5 shadow-2xs">
            <i data-lucide="shield-alert" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"></i>
            <div>
              <h4 class="text-xs font-black text-amber-900 uppercase tracking-wide">🩺 โรคประจำตัว / ภาวะเฝ้าระวัง (Chronic Condition)</h4>
              <p class="text-xs font-bold text-amber-800 mt-0.5">${activePet.chronic_conditions.join(", ")}</p>
              <p class="text-[10px] text-amber-700 mt-0.5">* คำนึงถึงการทำงานของอวัยวะ (ตับ/ไต) ในการเลือกยาและปรับขนาดยา</p>
            </div>
          </div>
        `
            : ""
        }
      </div>
    `
        : `
      <div class="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700">
        <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
        <span>ไม่มีประวัติแพ้ยาหรือโรคประจำตัวร้ายแรงที่บันทึกไว้ในระบบ</span>
      </div>
    `
    }

    <!-- Clinical Problem List Manager Widget (Domain 03) -->
    <div class="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="font-bold text-slate-700 flex items-center gap-1">
          <i data-lucide="list-checks" class="w-3.5 h-3.5 text-teal-600"></i>
          <span>ปัญหาสุขภาพระยะยาว (Problem List):</span>
        </span>
        ${
          petProblems.length > 0
            ? petProblems
                .map(
                  (p) => `
          <button onclick="toggleProblemStatus(${p.id})" title="คลิกเพื่อสลับสถานะ (Active / Controlled / Resolved)" class="px-2 py-0.5 rounded-lg font-semibold text-[11px] border transition cursor-pointer flex items-center gap-1 ${
            p.status === "ACTIVE"
              ? "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100"
              : p.status === "CONTROLLED"
                ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                : "bg-slate-100 text-slate-600 border-slate-300 line-through opacity-70"
          }">
            <span class="w-1.5 h-1.5 rounded-full ${p.status === "ACTIVE" ? "bg-rose-600" : p.status === "CONTROLLED" ? "bg-amber-500" : "bg-slate-400"}"></span>
            <span>${p.problem_name}</span>
            <span class="text-[9px] font-mono opacity-70">(${p.status})</span>
          </button>
        `,
                )
                .join("")
            : '<span class="text-slate-400 italic">ไม่มีรายการปัญหาสุขภาพค้างอยู่</span>'
        }
      </div>

      <button onclick="openNewProblemModal(${activePet.id})" class="text-[11px] font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1">
        <i data-lucide="plus" class="w-3 h-3"></i><span>+ เพิ่มปัญหาใหม่</span>
      </button>
    </div>
  `;

  // Filter encounters for this pet
  const petEncounters = (state.encounters || []).filter(
    (e) => e.pet_id === activePet.id,
  );
  const countBadge = document.getElementById("emr-encounter-count-badge");
  if (countBadge) countBadge.innerText = `${petEncounters.length} รายการ`;

  const cardGrid = document.getElementById("emr-encounters-card-grid");
  const listTable = document.getElementById("emr-encounters-list-table");

  if (state.viewMode === "card") {
    if (cardGrid) cardGrid.classList.remove("hidden");
    if (listTable) listTable.classList.add("hidden");

    if (cardGrid) {
      if (petEncounters.length === 0) {
        cardGrid.innerHTML = `
          <div class="col-span-2 bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
            <i data-lucide="clipboard" class="w-10 h-10 mx-auto text-slate-300 mb-2"></i>
            <p class="text-xs font-medium">ยังไม่มีประวัติการตรวจรักษาของสัตว์เลี้ยงตัวนี้</p>
            <button onclick="openSOAPFormSheet()" class="mt-3 text-xs font-bold text-teal-600 hover:underline cursor-pointer">+ บันทึกตรวจรักษาเคสนี้เป็นครั้งแรก</button>
          </div>
        `;
      } else {
        cardGrid.innerHTML = petEncounters
          .map((enc) => {
            const doc = state.doctors.find((d) => d.id === enc.doctor_id);
            const v = enc.objective.vitals;
            const signOff = enc.sign_off || {
              doctor_name: doc ? doc.name : "น.สพ. วุฒิชัย เจริญสุข",
              license_number: "วพ.9824",
            };

            return `
            <div class="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 shadow-xs hover:shadow-md transition duration-200 p-5 space-y-3.5 flex flex-col justify-between">
              <div>
                <!-- Card Header -->
                <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">${enc.encounter_number}</span>
                    <span class="text-xs text-slate-500 font-semibold">${formatDateThai(enc.encounter_date)}</span>
                    <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200">${enc.encounter_type || "GENERAL"}</span>
                  </div>
                  <div class="flex items-center gap-1.5 text-xs text-teal-700 font-medium">
                    <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
                    <span>${signOff.doctor_name} (${signOff.license_number})</span>
                  </div>
                </div>

                <!-- S: Subjective -->
                <div class="space-y-1 mt-3">
                  <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>S (Subjective) - อาการและประวัติ:</span>
                  </div>
                  <p class="text-xs text-slate-800 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "${enc.subjective.chief_complaint}"
                    ${enc.subjective.notes ? `<span class="block text-[11px] text-slate-500 mt-1 font-normal">${enc.subjective.notes}</span>` : ""}
                  </p>
                </div>

                <!-- O: Objective Vitals -->
                <div class="space-y-1.5 mt-2.5">
                  <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>O (Objective) - สัญญาณชีพ & ผลตรวจร่างกาย:</span>
                  </div>
                  <div class="grid grid-cols-4 gap-1.5 text-center text-xs">
                    <div class="bg-blue-50/60 border border-blue-200/80 p-1.5 rounded-lg"><span class="text-[9px] text-blue-600 block font-bold">TEMP</span><strong class="text-slate-800 text-[11px]">${v.temp} °C</strong></div>
                    <div class="bg-blue-50/60 border border-blue-200/80 p-1.5 rounded-lg"><span class="text-[9px] text-blue-600 block font-bold">HR</span><strong class="text-slate-800 text-[11px]">${v.heart_rate} bpm</strong></div>
                    <div class="bg-blue-50/60 border border-blue-200/80 p-1.5 rounded-lg"><span class="text-[9px] text-blue-600 block font-bold">RR</span><strong class="text-slate-800 text-[11px]">${v.resp_rate} /min</strong></div>
                    <div class="bg-blue-50/60 border border-blue-200/80 p-1.5 rounded-lg"><span class="text-[9px] text-blue-600 block font-bold">WT</span><strong class="text-teal-700 text-[11px]">${v.weight} kg</strong></div>
                  </div>
                  <p class="text-[11px] text-slate-600">${enc.objective.findings}</p>
                </div>

                <!-- A: Assessment & Diagnosis -->
                <div class="space-y-1 mt-2.5">
                  <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    <span>A (Assessment) - ข้อวินิจฉัยทางการแพทย์:</span>
                  </div>
                  <div class="bg-purple-50/70 border border-purple-200 p-2.5 rounded-xl">
                    <span class="font-bold text-purple-900 text-xs">${enc.assessment.primary_diagnosis}</span>
                    <span class="text-[10px] font-mono text-purple-600 block mt-0.5">Code: ${enc.assessment.diagnosis_code}</span>
                  </div>
                </div>

                <!-- P: Plan & Prescriptions -->
                <div class="space-y-1.5 pt-2 border-t border-slate-100 mt-2.5">
                  <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span class="flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>P (Plan) - ยาและการรักษา (${enc.plan.prescriptions.length} รายการ):</span>
                    </span>
                  </div>
                  <div class="space-y-1">
                    ${enc.plan.prescriptions
                      .map(
                        (rx) => `
                      <div class="flex items-center justify-between text-xs bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <span class="font-semibold text-slate-800">💊 ${rx.name}</span>
                        <span class="text-[11px] text-slate-500 font-mono">${rx.dose} (${rx.qty})</span>
                      </div>
                    `,
                      )
                      .join("")}
                  </div>
                  ${
                    enc.plan.diagnostic_orders?.length > 0
                      ? `
                    <div class="text-[11px] text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200 flex items-center gap-1 mt-1">
                      <i data-lucide="flask-conical" class="w-3.5 h-3.5"></i>
                      <span>คำสั่งตรวจแล็บ: ${enc.plan.diagnostic_orders.join(", ")}</span>
                    </div>
                  `
                      : ""
                  }
                </div>
              </div>

              <!-- Action Bar on Card -->
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button onclick="openEncounterDetailSheet(${enc.id})" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1">
                  <i data-lucide="eye" class="w-3.5 h-3.5"></i><span>ดูประวัติเต็ม 360°</span>
                </button>
                <button onclick="openMedicalCertificateModal(${enc.id})" class="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-1.5 rounded-lg transition shadow-2xs cursor-pointer flex items-center justify-center gap-1">
                  <i data-lucide="file-text" class="w-3.5 h-3.5"></i><span>🖨️ ออกใบรับรองแพทย์</span>
                </button>
              </div>

            </div>
          `;
          })
          .join("");
      }
    }
  } else {
    if (cardGrid) cardGrid.classList.add("hidden");
    if (listTable) {
      listTable.classList.remove("hidden");
      listTable.innerHTML = `
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th class="px-4 py-3">รหัสตรวจ</th>
                <th class="px-4 py-3">วันที่</th>
                <th class="px-4 py-3">อาการสำคัญ (S)</th>
                <th class="px-4 py-3">สัญญาณชีพ (O)</th>
                <th class="px-4 py-3">ข้อวินิจฉัย (A)</th>
                <th class="px-4 py-3">รายการยา (P)</th>
                <th class="px-4 py-3">สัตวแพทย์ผู้ตรวจ</th>
                <th class="px-4 py-3 text-right">การกระทำ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${petEncounters
                .map(
                  (enc) => `
                <tr class="hover:bg-slate-50/80 transition">
                  <td class="px-4 py-3 font-mono font-bold text-slate-900">${enc.encounter_number}</td>
                  <td class="px-4 py-3">${formatDateThai(enc.encounter_date)}</td>
                  <td class="px-4 py-3 max-w-xs truncate">${enc.subjective.chief_complaint}</td>
                  <td class="px-4 py-3 font-mono text-[11px]">T:${enc.objective.vitals.temp}°C / W:${enc.objective.vitals.weight}kg</td>
                  <td class="px-4 py-3 font-semibold text-purple-900">${enc.assessment.primary_diagnosis}</td>
                  <td class="px-4 py-3">${enc.plan.prescriptions.length} รายการ</td>
                  <td class="px-4 py-3 font-medium text-teal-700">${enc.sign_off?.doctor_name || "น.สพ. วุฒิชัย"}</td>
                  <td class="px-4 py-3 text-right space-x-1">
                    <button onclick="openEncounterDetailSheet(${enc.id})" class="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded cursor-pointer">ดูบันทึก</button>
                    <button onclick="openMedicalCertificateModal(${enc.id})" class="text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-2.5 py-1 rounded shadow-2xs cursor-pointer">ใบรับรอง</button>
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    }
  }

  lucide.createIcons();
}

// ==========================================
// 2. TABBED SOAP ENCOUNTER FORM ENGINE
// ==========================================
function openSOAPFormSheet() {
  state.sheetMode = "soap-encounter";
  state.activeSoapTab = "so";
  state.soapPrescriptions = []; // Reset active prescribing list
  openSheetContainer();

  const badge = document.getElementById("sheet-badge");
  const title = document.getElementById("sheet-title");
  const subtitle = document.getElementById("sheet-subtitle");
  const footer = document.getElementById("sheet-footer");

  badge.innerText = "CLINICAL ENCOUNTER";
  badge.className =
    "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200";
  title.innerText = "บันทึกการตรวจรักษา SOAP (Clinical Encounter)";
  subtitle.innerText =
    "บันทึกประวัติ อาการ สัญญาณชีพ วินิจฉัย สั่งยาหลายรายการ และส่งต่อคิวการรักษา";
  footer.classList.remove("hidden");

  renderSOAPFormBody();
  lucide.createIcons();
}

function switchSOAPTab(tabKey) {
  state.activeSoapTab = tabKey;
  renderSOAPFormBody();
  lucide.createIcons();
}

function applySOAPTemplate(templateId) {
  const tpl = (state.clinical_templates || []).find((t) => t.id === templateId);
  if (!tpl) return;

  const activePet = getPetById(state.activeConsultationPetId) || state.pets[0];

  // Subjective
  const sComplaint = document.getElementById("soap-chief-complaint");
  const sDuration = document.getElementById("soap-duration");
  const sAppetite = document.getElementById("soap-appetite");
  if (sComplaint) sComplaint.value = tpl.subjective.chief_complaint;
  if (sDuration) sDuration.value = tpl.subjective.duration;
  if (sAppetite) sAppetite.value = tpl.subjective.appetite;

  // Objective
  const oTemp = document.getElementById("soap-temp");
  const oHr = document.getElementById("soap-hr");
  const oRr = document.getElementById("soap-rr");
  const oBcs = document.getElementById("soap-bcs");
  const oFindings = document.getElementById("soap-findings");
  if (oTemp) oTemp.value = tpl.objective.temp;
  if (oHr) oHr.value = tpl.objective.heart_rate;
  if (oRr) oRr.value = tpl.objective.resp_rate;
  if (oBcs) oBcs.value = tpl.objective.bcs;
  if (oFindings) oFindings.value = tpl.objective.findings;

  // Assessment
  const aDiag = document.getElementById("soap-diagnosis-catalog");
  const aEvidence = document.getElementById("soap-evidence");
  if (aDiag && tpl.assessment.diagnosis_id)
    aDiag.value = tpl.assessment.diagnosis_id;
  if (aEvidence)
    aEvidence.value = `แม่แบบตรวจ: ${tpl.name} - ข้อสังเกตสอดคล้องกับพยาธิสภาพ`;

  // Plan - Prescriptions
  state.soapPrescriptions = [];
  tpl.plan.med_ids.forEach((medId) => {
    const med = state.medicationCatalog.find((m) => m.id === medId);
    if (med) {
      const calculatedDose =
        med.dose_mg_per_kg > 0
          ? `${Math.round(med.dose_mg_per_kg * activePet.current_weight)} mg (${med.default_route})`
          : med.form;

      const calcQty =
        med.default_duration_days > 1
          ? `${med.default_duration_days * 2} เม็ด/ชิ้น`
          : "1 รายการ";

      state.soapPrescriptions.push({
        id: state.soapPrescriptions.length + 1,
        med_id: med.id,
        name: med.name,
        dose: calculatedDose,
        route: med.default_route,
        freq: med.default_freq,
        duration: `${med.default_duration_days} วัน`,
        qty: calcQty,
        price: med.price,
        caution: med.caution,
      });
    }
  });

  // Homecare & Follow-up
  const pHomecare = document.getElementById("soap-homecare");
  const pFollowup = document.getElementById("soap-followup-date");
  if (pHomecare) pHomecare.value = tpl.plan.homecare;
  if (pFollowup) {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    pFollowup.value = d.toISOString().split("T")[0];
  }

  // Diagnostic Orders checkboxes
  const cbEar = document.getElementById("order-ear-swab");
  const cbCbc = document.getElementById("order-cbc");
  const cbXray = document.getElementById("order-xray");
  const cbUs = document.getElementById("order-ultrasound");
  if (cbEar)
    cbEar.checked = tpl.plan.diagnostic_orders.includes("Ear Swab Cytology");
  if (cbCbc)
    cbCbc.checked =
      tpl.plan.diagnostic_orders.includes("CBC & Blood Chemistry") ||
      tpl.plan.diagnostic_orders.includes(
        "Blood Chemistry (BUN, Creatinine, SDMA)",
      );
  if (cbXray)
    cbXray.checked = tpl.plan.diagnostic_orders.includes("Abdominal X-Ray");
  if (cbUs) cbUs.checked = tpl.plan.diagnostic_orders.includes("Ultrasound");

  renderSOAPFormBody();
  showToast(
    "โหลดแม่แบบสำเร็จ!",
    `โหลดข้อมูลชุดตรวจ "${tpl.name}" เรียบร้อยแล้ว`,
    "info",
  );
}

function renderSOAPFormBody() {
  const activePet = getPetById(state.activeConsultationPetId) || state.pets[0];
  const activeOwner = getPrimaryOwnerForPet(activePet.id);
  const body = document.getElementById("sheet-body");
  if (!body) return;

  const isSO = state.activeSoapTab === "so";
  const isAssess = state.activeSoapTab === "assessment";
  const isPlan = state.activeSoapTab === "plan";
  const isDischarge = state.activeSoapTab === "discharge";

  body.innerHTML = `
    <!-- Patient Mini Bar in Sheet Header -->
    <div class="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <img src="${activePet.photo}" class="w-10 h-10 rounded-lg object-cover border border-teal-200">
        <div>
          <div class="font-bold text-slate-900 text-xs">${activePet.pet_name} (${activePet.species} - ${activePet.breed})</div>
          <div class="text-[11px] text-slate-500">เจ้าของ: ${activeOwner ? activeOwner.display_name : ""} • น้ำหนัก: ${activePet.current_weight} kg</div>
        </div>
      </div>
      ${
        activePet.allergies?.length > 0
          ? `
        <span class="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-1 rounded-md">
          ⚠️ แพ้ยา: ${activePet.allergies[0].split(" ")[0]}
        </span>
      `
          : ""
      }
    </div>

    <!-- Quick SOAP Templates Bar (1-Click Presets) -->
    <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
      <div class="text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex items-center justify-between">
        <span>⚡ แม่แบบตรวจรักษาด่วน (1-Click Clinical Templates):</span>
      </div>
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
        ${(state.clinical_templates || [])
          .map(
            (t) => `
          <button type="button" onclick="applySOAPTemplate('${t.id}')" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-teal-50 hover:text-teal-800 border border-slate-200 hover:border-teal-300 shadow-2xs transition whitespace-nowrap cursor-pointer">
            ${t.name}
          </button>
        `,
          )
          .join("")}
      </div>
    </div>

    <!-- 4 Step Tabs Navigation (Miller's Law Chunking) -->
    <div class="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-center text-[11px] font-bold">
      <button type="button" onclick="switchSOAPTab('so')" class="py-2 rounded-lg transition cursor-pointer ${isSO ? "bg-white text-teal-700 shadow-xs" : "text-slate-500 hover:text-slate-900"}">
        1. อาการ & ไวทัล (S-O)
      </button>
      <button type="button" onclick="switchSOAPTab('assessment')" class="py-2 rounded-lg transition cursor-pointer ${isAssess ? "bg-white text-teal-700 shadow-xs" : "text-slate-500 hover:text-slate-900"}">
        2. วินิจฉัย (A)
      </button>
      <button type="button" onclick="switchSOAPTab('plan')" class="py-2 rounded-lg transition cursor-pointer ${isPlan ? "bg-white text-teal-700 shadow-xs" : "text-slate-500 hover:text-slate-900"}">
        3. สั่งยา (${state.soapPrescriptions.length}) & แผน (P)
      </button>
      <button type="button" onclick="switchSOAPTab('discharge')" class="py-2 rounded-lg transition cursor-pointer ${isDischarge ? "bg-white text-teal-700 shadow-xs" : "text-slate-500 hover:text-slate-900"}">
        4. ส่งต่อคิว & ปิดเคส
      </button>
    </div>

    <!-- Form Tab 1: Subjective & Objective -->
    <div class="${isSO ? "space-y-4" : "hidden"}">
      <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
        <h4 class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>S - ข้อมูลอาการที่เจ้าของแจ้ง (Subjective)</span>
        </h4>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">อาการสำคัญ (Chief Complaint) *</label>
          <input type="text" id="soap-chief-complaint" required placeholder="เช่น มีอาการคันหู สะบัดหัว เกาบ่อย..." class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-teal-500">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-600 font-medium mb-1">ระยะเวลาที่เริ่มมีอาการ</label>
            <input type="text" id="soap-duration" placeholder="เช่น 2-3 วันที่ผ่านมา" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
          </div>
          <div>
            <label class="block text-slate-600 font-medium mb-1">ความอยากอาหารและการดื่มน้ำ</label>
            <select id="soap-appetite" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
              <option value="ปกติ">ปกติ (Normal)</option>
              <option value="ลดลงเล็กน้อย">ลดลงเล็กน้อย (Mild decrease)</option>
              <option value="ไม่กินอาหาร">ไม่กินอาหาร (Anorexia)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
        <h4 class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>O - ผลการตรวจร่างกายและสัญญาณชีพ (Objective Vitals)</span>
        </h4>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="block text-slate-600 font-medium mb-1">อุณหภูมิ (°C)</label>
            <input type="number" step="0.1" id="soap-temp" value="38.6" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800">
          </div>
          <div>
            <label class="block text-slate-600 font-medium mb-1">หัวใจ (HR - bpm)</label>
            <input type="number" id="soap-hr" value="110" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800">
          </div>
          <div>
            <label class="block text-slate-600 font-medium mb-1">หายใจ (RR - /min)</label>
            <input type="number" id="soap-rr" value="24" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800">
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="block text-slate-600 font-medium mb-1">น้ำหนักชั่งวันนี้ (kg)</label>
            <input type="number" step="0.1" id="soap-weight" value="${activePet.current_weight}" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-teal-700">
          </div>
          <div>
            <label class="block text-slate-600 font-medium mb-1">CRT</label>
            <input type="text" id="soap-crt" value="< 2s" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
          </div>
          <div>
            <label class="block text-slate-600 font-medium mb-1">Body Score (BCS)</label>
            <select id="soap-bcs" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium">
              <option value="5/9 (สมส่วน)">5/9 (สมส่วน)</option>
              <option value="4/9 (ค่อนข้างผอม)">4/9 (ผอมเล็กน้อย)</option>
              <option value="6/9 (เริ่มท้วม)">6/9 (เริ่มท้วม)</option>
              <option value="7/9 (น้ำหนักเกิน)">7/9 (น้ำหนักเกิน)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-slate-600 font-medium mb-1">ข้อค้นพบตรวจร่างกาย (Physical Exam Findings)</label>
          <textarea id="soap-findings" rows="2" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">ตรวจช่องหูพบขี้หูสีน้ำตาลและเยื่อบุแดงเล็กน้อย เสียงหัวใจและปอดปกติ</textarea>
        </div>
      </div>

      <div class="text-right">
        <button type="button" onclick="switchSOAPTab('assessment')" class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer">
          ถัดไป: ข้อวินิจฉัย (A) →
        </button>
      </div>
    </div>

    <!-- Form Tab 2: Assessment & Diagnosis -->
    <div class="${isAssess ? "space-y-4" : "hidden"}">
      <div class="bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 space-y-3">
        <h4 class="font-bold text-purple-900 text-xs flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-purple-600"></span>
          <span>A - การวินิจฉัยโรค (Assessment & Diagnosis)</span>
        </h4>

        <div>
          <label class="block text-purple-950 font-bold mb-1">เลือกโรคจากทะเบียนโรคคลินิก (Diagnosis Catalog) *</label>
          <select id="soap-diagnosis-catalog" class="w-full bg-white border border-purple-300 rounded-lg p-2 text-xs font-semibold text-purple-950">
            ${state.diagnosisCatalog
              .map(
                (d) => `
              <option value="${d.id}">${d.code}: ${d.name} (${d.category})</option>
            `,
              )
              .join("")}
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-600 font-medium mb-1">ประเภทการวินิจฉัย</label>
            <select id="soap-diagnosis-type" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
              <option value="PRIMARY">การวินิจฉัยหลัก (Primary Diagnosis)</option>
              <option value="DIFFERENTIAL">วินิจฉัยแยกโรค (Differential)</option>
              <option value="PROVISIONAL">วินิจฉัยเบื้องต้น (Provisional)</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-600 font-medium mb-1">ระดับความมั่นใจทางคลินิก</label>
            <select id="soap-confidence" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
              <option value="CONFIRMED">ยืนยันผลแล้ว (Confirmed)</option>
              <option value="SUSPECTED">สงสัย (Suspected)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-slate-600 font-medium mb-1">หลักฐานหรือข้อสังเกตประกอบการวินิจฉัย</label>
          <textarea id="soap-evidence" rows="2" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">ส่องกล้อง Otoscope พบคราบขี้หูสะสม เยื่อแก้วหูยังสมบูรณ์ดี</textarea>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <button type="button" onclick="switchSOAPTab('so')" class="text-xs text-slate-500 font-semibold hover:underline cursor-pointer">← ย้อนกลับ</button>
        <button type="button" onclick="switchSOAPTab('plan')" class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer">ถัดไป: สั่งยา & แผนการรักษา (P) →</button>
      </div>
    </div>

    <!-- Form Tab 3: Plan & Prescriptions (Multi-Item Prescriptions with Dose Calculator) -->
    <div class="${isPlan ? "space-y-4" : "hidden"}">
      
      <!-- Multi-Item Prescriptions Box -->
      <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>P - รายการยาที่สั่งจ่าย (Prescriptions: ${state.soapPrescriptions.length} รายการ)</span>
          </h4>
          <span class="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-semibold border border-teal-200">ตรวจสอบการแพ้ยาอัตโนมัติ</span>
        </div>

        <!-- Prescribed Items Table -->
        <div class="space-y-2">
          ${
            state.soapPrescriptions.length > 0
              ? state.soapPrescriptions
                  .map(
                    (item, idx) => `
            <div class="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 text-xs">
              <div>
                <div class="font-bold text-slate-900">${item.name}</div>
                <div class="text-[11px] text-slate-500 font-mono mt-0.5">ขนาดยา: ${item.dose} • ${item.freq} (${item.duration})</div>
                <div class="text-[10px] text-teal-700 font-semibold">จำนวนสั่งจ่าย: ${item.qty}</div>
              </div>
              <button type="button" onclick="removeSOAPPrescription(${idx})" class="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          `,
                  )
                  .join("")
              : `
            <div class="p-4 bg-white rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
              ยังไม่มีรายการยาที่สั่งจ่าย กรุณาเลือกยาและกด "+ เพิ่มยาเข้าใบสั่ง" ด้านล่าง
            </div>
          `
          }
        </div>

        <!-- Add Medication Section -->
        <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2.5 mt-3">
          <div class="text-[11px] font-bold text-slate-700 flex items-center justify-between">
            <span>+ สั่งจ่ายยาเพิ่ม (Add Medication)</span>
          </div>

          <!-- Dynamic Allergy Alert Banner for Selected Drug -->
          <div id="soap-drug-allergy-alert" class="hidden bg-rose-50 border-2 border-rose-500 rounded-xl p-3 text-xs text-rose-900 space-y-1">
            <div class="flex items-center gap-1.5 font-black text-rose-700">
              <i data-lucide="alert-octagon" class="w-4 h-4 text-rose-600"></i>
              <span>คำเตือน: สัตว์ป่วยมีประวัติแพ้ยาชนิดนี้! (DRUG ALLERGY DETECTED)</span>
            </div>
            <p class="text-[11px] text-rose-800" id="soap-drug-allergy-text"></p>
          </div>

          <div>
            <label class="block text-slate-600 font-medium mb-1">เลือกรายการยาจากคลัง *</label>
            <select id="soap-add-med-select" onchange="onMedicationSelectionChanged(this.value)" class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900">
              ${state.medicationCatalog
                .map(
                  (m) => `
                <option value="${m.id}">${m.name} - ${m.form} (฿${m.price})</option>
              `,
                )
                .join("")}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="block text-slate-600 font-medium mb-1">ขนาดยาคำนวณ (Dose)</label>
              <input type="text" id="soap-add-med-dose" value="1 เม็ด" class="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs">
            </div>
            <div>
              <label class="block text-slate-600 font-medium mb-1">ความถี่ (Frequency)</label>
              <input type="text" id="soap-add-med-freq" value="วันละ 2 ครั้ง หลังอาหาร" class="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="block text-slate-600 font-medium mb-1">ระยะเวลา (วัน)</label>
              <input type="number" id="soap-add-med-days" value="7" onchange="autoCalculateMedQty()" class="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs font-bold">
            </div>
            <div>
              <label class="block text-slate-600 font-medium mb-1">จำนวนที่สั่งจ่าย (Qty)</label>
              <input type="text" id="soap-add-med-qty" value="14 เม็ด" class="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-teal-800">
            </div>
          </div>

          <button type="button" onclick="addSOAPPrescriptionItem()" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs">
            <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
            <span>+ บันทึกยาเข้าใบสั่งนี้</span>
          </button>
        </div>
      </div>

      <!-- Diagnostic Orders (Auto-sync to Domain 05) -->
      <div class="bg-purple-50/60 p-3.5 rounded-xl border border-purple-200 space-y-2">
        <h4 class="font-bold text-purple-900 text-xs flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <i data-lucide="flask-conical" class="w-4 h-4 text-purple-600"></i>
            <span>สั่งตรวจทางห้องปฏิบัติการ / รังสีวินิจฉัย (Lab & Imaging Orders)</span>
          </span>
          <span class="text-[10px] text-purple-700 font-normal">เชื่อมโยงไปยัง Domain 05 อัตโนมัติ</span>
        </h4>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <label class="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-200 cursor-pointer hover:border-purple-400">
            <input type="checkbox" id="order-ear-swab" checked class="rounded text-teal-600">
            <span>Ear Swab Cytology</span>
          </label>
          <label class="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-200 cursor-pointer hover:border-purple-400">
            <input type="checkbox" id="order-cbc" class="rounded text-teal-600">
            <span>ตรวจความสมบูรณ์เม็ดเลือด (CBC)</span>
          </label>
          <label class="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-200 cursor-pointer hover:border-purple-400">
            <input type="checkbox" id="order-xray" class="rounded text-teal-600">
            <span>เอกซเรย์ช่องอก/ช่องท้อง (X-Ray)</span>
          </label>
          <label class="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-200 cursor-pointer hover:border-purple-400">
            <input type="checkbox" id="order-ultrasound" class="rounded text-teal-600">
            <span>อัลตราซาวนด์ช่องท้อง (Ultrasound)</span>
          </label>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <button type="button" onclick="switchSOAPTab('assessment')" class="text-xs text-slate-500 font-semibold hover:underline cursor-pointer">← ย้อนกลับ</button>
        <button type="button" onclick="switchSOAPTab('discharge')" class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer">ถัดไป: ส่งต่อคิว & ปิดเคส →</button>
      </div>
    </div>

    <!-- Form Tab 4: Discharge & Flexible Queue Dispatcher -->
    <div class="${isDischarge ? "space-y-4" : "hidden"}">
      
      <!-- Home care Advice -->
      <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
        <h4 class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
          <i data-lucide="home" class="w-4 h-4 text-teal-600"></i>
          <span>คำแนะนำการดูแลที่บ้าน & นัดติดตามผล (Discharge Instructions)</span>
        </h4>
        <div>
          <label class="block text-slate-600 font-medium mb-1">คำแนะนำสำหรับเจ้าของสัตว์เลี้ยง</label>
          <textarea id="soap-homecare" rows="2" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">ระวังไม่ให้น้ำเข้าหูเวลาอาบน้ำ และหยอดยาให้ครบ 7 วันตามกำหนด</textarea>
        </div>
        <div>
          <label class="block text-slate-600 font-medium mb-1">กำหนดวันนัดตรวจซ้ำ (Follow-up Date)</label>
          <input type="date" id="soap-followup-date" value="2026-03-09" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs">
        </div>
      </div>

      <!-- Attending Veterinarian Sign-off Section -->
      <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
        <h4 class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
          <i data-lucide="pen-tool" class="w-4 h-4 text-teal-600"></i>
          <span>สัตวแพทย์ผู้รับผิดชอบการตรวจและลงนาม (Sign-Off)</span>
        </h4>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-600 font-medium mb-1">สัตวแพทย์ผู้ตรวจ *</label>
            <select id="soap-doctor-select" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900">
              ${state.doctors
                .map(
                  (d) => `
                <option value="${d.id}">${d.name} (${d.specialty})</option>
              `,
                )
                .join("")}
            </select>
          </div>
          <div>
            <label class="block text-slate-600 font-medium mb-1">เลขที่ใบอนุญาตประกอบวิชาชีพ (วพ.)</label>
            <input type="text" id="soap-doctor-license" readonly value="วพ.9824" class="w-full bg-slate-100 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-700">
          </div>
        </div>
      </div>

      <!-- Flexible Queue Dispatcher (Domain 02 Integration) -->
      <div class="bg-emerald-50/80 border-2 border-emerald-300 p-4 rounded-xl space-y-3">
        <div class="text-xs font-bold text-emerald-950 flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <i data-lucide="git-pull-request" class="w-4 h-4 text-emerald-700"></i>
            <span>ปลายทางสถานะคิวตรวจ (Flexible Queue Dispatcher) *</span>
          </span>
          <span class="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">Auto-Sync</span>
        </div>

        <div class="space-y-2 text-xs">
          <label class="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-emerald-200 hover:border-emerald-500 cursor-pointer transition">
            <input type="radio" name="soap-queue-dispatch" value="COMPLETED" checked class="text-teal-600">
            <div>
              <strong class="text-slate-900 block">ตรวจเสร็จสิ้น -> ส่งต่อไปยังจุดคิดเงิน/แคชเชียร์</strong>
              <span class="text-[11px] text-slate-500">ย้ายคิวไปสเตจ 4 (Completed) บนกระดานคิวสด เพื่อรอรับยาและชำระเงิน</span>
            </div>
          </label>

          <label class="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-emerald-200 hover:border-emerald-500 cursor-pointer transition">
            <input type="radio" name="soap-queue-dispatch" value="HOLD" class="text-teal-600">
            <div>
              <strong class="text-slate-900 block">ส่งตรวจแล็บ/X-Ray -> พักรอผลตรวจในคลินิก</strong>
              <span class="text-[11px] text-slate-500">ย้ายคิวไปสเตจ 3 (Holding) สัตว์เลี้ยงจะไปตรวจแล็บก่อนกลับมาพบแพทย์อีกครั้ง</span>
            </div>
          </label>

          <label class="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-emerald-200 hover:border-emerald-500 cursor-pointer transition">
            <input type="radio" name="soap-queue-dispatch" value="IN_SERVICE" class="text-teal-600">
            <div>
              <strong class="text-slate-900 block">ยังตรวจรักษาอยู่ในห้องต่อ</strong>
              <span class="text-[11px] text-slate-500">คงไว้ที่สเตจ 2 (In Consultation) กำลังทำหัตถการต่อในห้องตรวจ</span>
            </div>
          </label>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1">
        <button type="button" onclick="switchSOAPTab('plan')" class="text-xs text-slate-500 font-semibold hover:underline cursor-pointer">← ย้อนกลับ</button>
        <span class="text-xs text-slate-500 font-semibold">พร้อมบันทึกเวชระเบียนที่ปุ่ม "บันทึกข้อมูล" ด้านล่าง</span>
      </div>
    </div>
  `;

  // Prepopulate first drug in add-med section if not initialized
  onMedicationSelectionChanged(
    document.getElementById("soap-add-med-select")?.value || 1,
  );
}

function onMedicationSelectionChanged(medId) {
  const med = state.medicationCatalog.find((m) => m.id === Number(medId));
  if (!med) return;

  const activePet = getPetById(state.activeConsultationPetId) || state.pets[0];
  const alertBox = document.getElementById("soap-drug-allergy-alert");
  const alertText = document.getElementById("soap-drug-allergy-text");

  // Check allergy history against drug family
  const isAllergic = activePet.allergies?.some(
    (a) =>
      a.toLowerCase().includes(med.name.toLowerCase().split(" ")[0]) ||
      (med.allergen_family &&
        a.toLowerCase().includes(med.allergen_family.toLowerCase())),
  );

  if (isAllergic && alertBox && alertText) {
    alertText.innerText = `น้อง ${activePet.pet_name} มีประวัติแพ้ยาในกลุ่ม ${med.allergen_family || med.name} (${activePet.allergies.join(", ")})! ห้ามใช้เด็ดขาด`;
    alertBox.classList.remove("hidden");
    playChimeTone();
    showToast(
      "⚠️ คำเตือนแพ้ยา!",
      `${activePet.pet_name} มีประวัติแพ้ยากลุ่ม ${med.name}!`,
      "warning",
    );
  } else if (alertBox) {
    alertBox.classList.add("hidden");
  }

  // Auto-calculate dose by weight if formula exists
  const doseInput = document.getElementById("soap-add-med-dose");
  const freqInput = document.getElementById("soap-add-med-freq");
  if (doseInput) {
    if (med.dose_mg_per_kg > 0) {
      const calcMg = Math.round(med.dose_mg_per_kg * activePet.current_weight);
      doseInput.value = `${calcMg} mg (${med.default_route})`;
    } else {
      doseInput.value = med.form;
    }
  }
  if (freqInput) freqInput.value = med.default_freq;

  autoCalculateMedQty();
}

function autoCalculateMedQty() {
  const medId = document.getElementById("soap-add-med-select")?.value;
  const med = state.medicationCatalog.find((m) => m.id === Number(medId));
  const days =
    parseInt(document.getElementById("soap-add-med-days")?.value) || 7;
  const qtyInput = document.getElementById("soap-add-med-qty");
  if (!qtyInput || !med) return;

  if (med.default_duration_days === 1) {
    qtyInput.value = "1 เข็ม / รายการ";
  } else if (
    med.form.includes("หยอด") ||
    med.form.includes("ขวด") ||
    med.form.includes("หลอด") ||
    med.form.includes("แชมพู")
  ) {
    qtyInput.value = "1 ขวด/หลอด";
  } else {
    // Standard oral pills: 2 pills per day
    qtyInput.value = `${days * 2} เม็ด`;
  }
}

function addSOAPPrescriptionItem() {
  const medId = Number(document.getElementById("soap-add-med-select")?.value);
  const med = state.medicationCatalog.find((m) => m.id === medId);
  if (!med) return;

  const dose =
    document.getElementById("soap-add-med-dose")?.value.trim() || med.form;
  const freq =
    document.getElementById("soap-add-med-freq")?.value.trim() ||
    med.default_freq;
  const days =
    document.getElementById("soap-add-med-days")?.value.trim() || "7";
  const qty =
    document.getElementById("soap-add-med-qty")?.value.trim() || "1 รายการ";

  state.soapPrescriptions.push({
    id: state.soapPrescriptions.length + 1,
    med_id: med.id,
    name: med.name,
    dose: dose,
    route: med.default_route,
    freq: freq,
    duration: `${days} วัน`,
    qty: qty,
    price: med.price,
    caution: med.caution,
  });

  renderSOAPFormBody();
  showToast(
    "เพิ่มรายการยาแล้ว",
    `เพิ่ม ${med.name} เข้าใบสั่งยาเรียบร้อยแล้ว`,
    "success",
  );
}

function removeSOAPPrescription(index) {
  state.soapPrescriptions.splice(index, 1);
  renderSOAPFormBody();
}

// ==========================================
// 3. ENCOUNTER 360° DETAILS SHEET
// ==========================================
function openEncounterDetailSheet(encId) {
  const enc = (state.encounters || []).find((e) => e.id === encId);
  if (!enc) return;

  state.sheetMode = "encounter-detail";
  openSheetContainer();

  const badge = document.getElementById("sheet-badge");
  const title = document.getElementById("sheet-title");
  const subtitle = document.getElementById("sheet-subtitle");
  const body = document.getElementById("sheet-body");
  const footer = document.getElementById("sheet-footer");

  badge.innerText = "ENCOUNTER 360°";
  badge.className =
    "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200";
  title.innerText = `เวชระเบียน #${enc.encounter_number}`;
  subtitle.innerText = `${formatDateThai(enc.encounter_date)} • ${enc.sign_off?.doctor_name || "สัตวแพทย์ผู้ตรวจ"}`;
  footer.classList.add("hidden");

  const pet = getPetById(enc.pet_id);
  const owner = getCustomerById(enc.customer_id);
  const v = enc.objective.vitals;

  body.innerHTML = `
    <div class="space-y-4">
      <!-- Pet & Sign-off Header Card -->
      <div class="p-4 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="${pet ? pet.photo : ""}" class="w-12 h-12 rounded-xl object-cover border border-teal-200">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">${pet ? pet.pet_name : "-"} (${pet ? pet.breed : "-"})</h4>
            <p class="text-xs text-slate-600">เจ้าของ: <span class="font-semibold text-slate-800">${owner ? owner.display_name : "-"}</span> (${owner ? owner.phone : "-"})</p>
            <p class="text-[10px] text-teal-800 font-mono mt-0.5">รับรองโดย: ${enc.sign_off?.doctor_name || "น.สพ. วุฒิชัย"} (${enc.sign_off?.license_number || "วพ.9824"})</p>
          </div>
        </div>
        <button onclick="openMedicalCertificateModal(${enc.id})" class="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="printer" class="w-4 h-4"></i>
          <span>พิมพ์ใบรับรองแพทย์</span>
        </button>
      </div>

      <!-- S: Subjective Details -->
      <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
        <span class="text-[10px] uppercase font-bold text-amber-700 block">S (Subjective) - อาการและประวัติ</span>
        <p class="text-xs font-semibold text-slate-900">"${enc.subjective.chief_complaint}"</p>
        <p class="text-[11px] text-slate-500">ระยะเวลา: ${enc.subjective.duration || "-"} • ความอยากอาหาร: ${enc.subjective.appetite || "ปกติ"}</p>
        ${enc.subjective.notes ? `<p class="text-[11px] text-slate-600 italic">บันทึกเพิ่มเติม: ${enc.subjective.notes}</p>` : ""}
      </div>

      <!-- O: Objective Vitals & Exam -->
      <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
        <span class="text-[10px] uppercase font-bold text-blue-700 block">O (Objective) - สัญญาณชีพและผลตรวจร่างกาย</span>
        <div class="grid grid-cols-4 gap-2 text-center text-xs">
          <div class="bg-white p-2 rounded-lg border border-slate-200"><span class="text-[9px] text-slate-400 block font-bold">TEMP</span><strong class="text-slate-800">${v.temp} °C</strong></div>
          <div class="bg-white p-2 rounded-lg border border-slate-200"><span class="text-[9px] text-slate-400 block font-bold">HR</span><strong class="text-slate-800">${v.heart_rate} bpm</strong></div>
          <div class="bg-white p-2 rounded-lg border border-slate-200"><span class="text-[9px] text-slate-400 block font-bold">RR</span><strong class="text-slate-800">${v.resp_rate} /min</strong></div>
          <div class="bg-white p-2 rounded-lg border border-slate-200"><span class="text-[9px] text-slate-400 block font-bold">WEIGHT</span><strong class="text-teal-700">${v.weight} kg</strong></div>
        </div>
        <p class="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
          <strong>ผลตรวจร่างกาย:</strong> ${enc.objective.findings}
        </p>
      </div>

      <!-- A: Assessment & Diagnosis -->
      <div class="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 space-y-1">
        <span class="text-[10px] uppercase font-bold text-purple-800 block">A (Assessment) - ข้อวินิจฉัยทางการแพทย์</span>
        <h4 class="text-sm font-bold text-purple-950">${enc.assessment.primary_diagnosis}</h4>
        <p class="text-[10px] text-purple-700 font-mono">รหัสโรค ICD-Vet: ${enc.assessment.diagnosis_code} • ${enc.assessment.differential !== "-" ? `Differential: ${enc.assessment.differential}` : "ไม่มีภาวะแทรกซ้อน"}</p>
      </div>

      <!-- P: Prescriptions & Diagnostic Orders -->
      <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
        <span class="text-[10px] uppercase font-bold text-emerald-700 block">P (Plan) - รายการยาและการรักษา</span>
        <div class="space-y-1.5">
          ${enc.plan.prescriptions
            .map(
              (p) => `
            <div class="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span class="font-bold text-slate-900">💊 ${p.name}</span>
                <span class="text-[11px] text-slate-500 block">${p.dose} • ${p.freq}</span>
              </div>
              <span class="font-mono text-slate-700">${p.qty}</span>
            </div>
          `,
            )
            .join("")}
        </div>

        ${
          enc.plan.diagnostic_orders?.length > 0
            ? `
          <div class="p-2 bg-purple-50 text-purple-800 rounded-lg text-xs border border-purple-200 mt-2">
            <strong>คำสั่งตรวจเพิ่มเติม:</strong> ${enc.plan.diagnostic_orders.join(", ")}
          </div>
        `
            : ""
        }

        <div class="p-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 mt-2">
          <strong>คำแนะนำการดูแลที่บ้าน:</strong> ${enc.plan.homecare || enc.plan.summary}
          <div class="text-[11px] text-teal-700 font-semibold mt-1">กำหนดนัดตรวจซ้ำ: ${enc.plan.follow_up}</div>
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();
}

// ==========================================
// 4. PRINTABLE MEDICAL CERTIFICATE MODAL
// ==========================================
function openMedicalCertificateModal(encId) {
  const enc = (state.encounters || []).find((e) => e.id === encId);
  if (!enc) return;

  state.activeCertificateEncId = encId;
  const modal = document.getElementById("modal-medical-certificate");
  if (!modal) return;

  const pet = getPetById(enc.pet_id);
  const owner = getCustomerById(enc.customer_id);
  const doc = state.doctors.find((d) => d.id === enc.doctor_id);
  const v = enc.objective.vitals;
  const signOff = enc.sign_off || {
    doctor_name: doc ? doc.name : "น.สพ. วุฒิชัย เจริญสุข",
    license_number: "วพ.9824",
  };

  const certContent = document.getElementById("printable-certificate-content");
  if (certContent) {
    certContent.innerHTML = `
      <!-- Clinic Header with Official Emblem -->
      <div class="flex items-start justify-between pb-4 border-b-2 border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xl tracking-tighter">
            VET
          </div>
          <div>
            <h2 class="text-base font-black text-slate-900 tracking-wide uppercase">โรงพยาบาลและคลินิกเวชกรรมสัตว์ (VET CLINIC)</h2>
            <p class="text-[11px] text-slate-500">123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110 • โทร. 02-123-4567</p>
            <p class="text-[10px] text-slate-400">ใบอนุญาตสถานพยาบาลสัตว์เลขที่: 101030012/2560</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-300">
            MC-${enc.encounter_number.replace("ENC-", "")}
          </span>
          <p class="text-[10px] text-slate-400 mt-1">วันที่ออกเอกสาร: ${formatDateThai(enc.encounter_date)}</p>
        </div>
      </div>

      <!-- Document Title -->
      <div class="text-center py-2">
        <h3 class="text-base font-black text-slate-900 uppercase tracking-wide">
          ใบรับรองสุขภาพสัตว์และสรุปผลการตรวจรักษา
        </h3>
        <p class="text-xs text-slate-500 font-sans">VETERINARY MEDICAL CERTIFICATE & CLINICAL SUMMARY</p>
      </div>

      <!-- Pet & Owner Information Grid -->
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
        <div>
          <span class="text-slate-400 text-[10px] font-bold uppercase block mb-1">ข้อมูลสัตว์ป่วย (Patient Information)</span>
          <p class="text-slate-800"><strong>ชื่อสัตว์:</strong> ${pet ? pet.pet_name : "-"}</p>
          <p class="text-slate-800"><strong>ชนิด / สายพันธุ์:</strong> ${pet ? pet.species : "-"} (${pet ? pet.breed : "-"})</p>
          <p class="text-slate-800"><strong>เพศ / อายุ:</strong> ${pet ? pet.sex : "-"} • ${calculateAge(pet ? pet.birth_date : "")}</p>
          <p class="text-slate-800"><strong>รหัสไมโครชิป:</strong> <span class="font-mono text-teal-800">${pet?.microchip_number || "ไม่ได้ฝังไมโครชิป"}</span></p>
        </div>
        <div>
          <span class="text-slate-400 text-[10px] font-bold uppercase block mb-1">ข้อมูลเจ้าของสัตว์ (Owner Information)</span>
          <p class="text-slate-800"><strong>ชื่อเจ้าของ:</strong> ${owner ? owner.display_name : "-"}</p>
          <p class="text-slate-800"><strong>เบอร์โทรศัพท์:</strong> ${owner ? owner.phone : "-"}</p>
          <p class="text-slate-800"><strong>ที่อยู่:</strong> ${owner?.address || "กรุงเทพมหานคร"}</p>
        </div>
      </div>

      <!-- Clinical Findings & Vitals -->
      <div class="space-y-1 text-xs">
        <h4 class="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1">1. ผลการตรวจร่างกายและสัญญาณชีพ (Clinical Findings & Vital Signs)</h4>
        <div class="grid grid-cols-4 gap-2 text-center text-xs py-1">
          <div class="bg-slate-50 p-1.5 rounded border border-slate-200"><span class="text-[9px] text-slate-500 block">อุณหภูมิ</span><strong>${v.temp} °C</strong></div>
          <div class="bg-slate-50 p-1.5 rounded border border-slate-200"><span class="text-[9px] text-slate-500 block">อัตราการเต้นหัวใจ</span><strong>${v.heart_rate} bpm</strong></div>
          <div class="bg-slate-50 p-1.5 rounded border border-slate-200"><span class="text-[9px] text-slate-500 block">อัตราการหายใจ</span><strong>${v.resp_rate} /min</strong></div>
          <div class="bg-slate-50 p-1.5 rounded border border-slate-200"><span class="text-[9px] text-slate-500 block">น้ำหนักตัว</span><strong class="text-teal-800">${v.weight} kg</strong></div>
        </div>
        <p class="text-slate-700 bg-slate-50/70 p-2 rounded-lg border border-slate-200/80 mt-1">
          <strong>อาการสำคัญ & ข้อค้นพบ:</strong> ${enc.subjective.chief_complaint} • ${enc.objective.findings}
        </p>
      </div>

      <!-- Diagnosis Section -->
      <div class="space-y-1 text-xs">
        <h4 class="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1">2. ข้อวินิจฉัยทางการแพทย์ (Medical Diagnosis)</h4>
        <div class="p-3 bg-teal-50/50 border border-teal-200 rounded-xl">
          <div class="font-bold text-teal-950 text-sm">${enc.assessment.primary_diagnosis}</div>
          <div class="text-[10px] text-teal-700 font-mono mt-0.5">ICD-Vet Code: ${enc.assessment.diagnosis_code}</div>
        </div>
      </div>

      <!-- Treatments & Medications Given -->
      <div class="space-y-1 text-xs">
        <h4 class="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1">3. รายการยาและการรักษาที่ได้รับ (Treatments & Prescriptions)</h4>
        <div class="space-y-1">
          ${enc.plan.prescriptions
            .map(
              (rx, i) => `
            <div class="flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-200 text-xs">
              <span>${i + 1}. <strong>${rx.name}</strong> (${rx.dose})</span>
              <span class="font-mono text-slate-600">${rx.qty}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>

      <!-- Homecare Instructions -->
      <div class="space-y-1 text-xs">
        <h4 class="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1">4. คำแนะนำการดูแลและการนัดหมาย (Advice & Follow-Up)</h4>
        <p class="text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200">
          ${enc.plan.homecare || enc.plan.summary}
          <span class="block text-teal-800 font-bold mt-1">กำหนดนัดตรวจซ้ำ: ${enc.plan.follow_up}</span>
        </p>
      </div>

      <!-- Official Certification & Signature Line -->
      <div class="pt-6 mt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
        <div class="space-y-1 text-slate-500">
          <p class="font-semibold text-slate-700">หมายเหตุทางการแพทย์:</p>
          <p class="text-[10px]">เอกสารนี้ออกให้เพื่อใช้เป็นหลักฐานประกอบการตรวจรักษาและการดูแลสัตว์เลี้ยงเท่านั้น</p>
          <div class="w-20 h-20 rounded-full border border-dashed border-teal-400/80 flex items-center justify-center text-[10px] text-teal-700 font-bold uppercase tracking-wider text-center rotate-[-12deg] mt-2">
            VET CLINIC<br>OFFICIAL SEAL
          </div>
        </div>

        <div class="text-center space-y-1 self-end">
          <div class="font-serif italic text-lg text-slate-800 border-b border-slate-400 pb-1 max-w-[200px] mx-auto">
            ${signOff.doctor_name.split(" ")[1]} ${signOff.doctor_name.split(" ")[2] || ""}
          </div>
          <p class="font-bold text-slate-800 mt-1">(${signOff.doctor_name})</p>
          <p class="text-slate-600 font-mono text-[11px]">สัตวแพทย์ผู้ตรวจรักษา (เลขที่ ${signOff.license_number})</p>
        </div>
      </div>
    `;
  }

  modal.classList.remove("hidden");
  lucide.createIcons();
}

function closeMedicalCertificateModal() {
  const modal = document.getElementById("modal-medical-certificate");
  if (modal) modal.classList.add("hidden");
}

function printMedicalCertificate() {
  window.print();
}

// ==========================================
// 5. PROBLEM LIST MANAGEMENT
// ==========================================
function openNewProblemModal(petId) {
  const pet = getPetById(petId);
  const problemName = prompt(
    `เพิ่มปัญหาสุขภาพ / ภาวะเฝ้าระวังใหม่สำหรับ ${pet ? pet.pet_name : "สัตว์เลี้ยง"}:`,
    "ภาวะอ้วนน้ำหนักเกิน (Obesity)",
  );
  if (!problemName) return;

  if (!state.clinical_problem_lists) state.clinical_problem_lists = [];
  state.clinical_problem_lists.push({
    id: state.clinical_problem_lists.length + 1,
    pet_id: petId,
    problem_name: problemName,
    status: "ACTIVE",
    severity: "MODERATE",
    onset_date: new Date().toISOString().split("T")[0],
    resolved_date: null,
    notes: "บันทึกผ่านหน้าห้องตรวจ EMR",
    managed_by: "น.สพ. วุฒิชัย เจริญสุข",
  });

  renderEMRConsultationView();
  showToast(
    "เพิ่มปัญหาสุขภาพแล้ว",
    `บันทึก "${problemName}" ในรายการเฝ้าระวังเรียบร้อยแล้ว`,
    "success",
  );
}

function toggleProblemStatus(problemId) {
  const p = (state.clinical_problem_lists || []).find(
    (item) => item.id === problemId,
  );
  if (!p) return;

  if (p.status === "ACTIVE") {
    p.status = "CONTROLLED";
    showToast(
      "ปรับสถานะปัญหา",
      `เปลี่ยน "${p.problem_name}" เป็น "ควบคุมได้ (Controlled)"`,
      "info",
    );
  } else if (p.status === "CONTROLLED") {
    p.status = "RESOLVED";
    p.resolved_date = new Date().toISOString().split("T")[0];
    showToast(
      "ปิดปัญหาสุขภาพ",
      `ทำเครื่องหมาย "${p.problem_name}" เป็น "หายแล้ว (Resolved)"`,
      "success",
    );
  } else {
    p.status = "ACTIVE";
    p.resolved_date = null;
    showToast(
      "เปิดปัญหาสุขภาพใหม่",
      `เปลี่ยน "${p.problem_name}" กลับเป็น "กำลังดำเนินอยู่ (Active)"`,
      "warning",
    );
  }

  renderEMRConsultationView();
}
