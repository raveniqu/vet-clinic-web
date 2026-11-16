/**
 * ============================================================================
 * DOMAIN 06: SURGERY & TREATMENT MANAGEMENT - DATA ENGINE
 * ============================================================================
 * Architectural Alignment:
 * - docs/BusinessDomain/06.Surgery_and_Treatment_Management.md
 * - 20 Business Capabilities (3.1 - 3.20)
 * - Physical Database Design (Schema surgery.* - 13 Tables)
 * ============================================================================
 */

Object.assign(state, {
  // Navigation & Sub-Tab State
  activeSurgerySubTab: 'schedule', // 'schedule' | 'requests' | 'intraop' | 'recovery'
  activeSurgerySubFilter: 'all',   // 'all' | 'in_progress' | 'scheduled' | 'recovery' | 'completed'

  // --- 1. OPERATING ROOMS (Table: appointment.rooms / facility.operating_rooms) ---
  operatingRooms: [
    {
      id: 'OR-1',
      name: 'ห้องผ่าตัดปลอดเชื้อ 1 (Sterile OR-1)',
      type: 'MAJOR_STERILE',
      status: 'READY', // 'READY' | 'IN_USE' | 'CLEANING' | 'MAINTENANCE'
      cleanliness_level: 'ISO Class 5 Laminar Flow',
      equipment: ['Mindray Anesthesia Workstation WATO EX-35', 'Surgical Diathermy Bovie', 'LED Surgical Light Duo'],
      current_case: null
    },
    {
      id: 'OR-2',
      name: 'ห้องผ่าตัด 2 (Soft Tissue & General OR-2)',
      type: 'GENERAL_SURGERY',
      status: 'IN_USE',
      cleanliness_level: 'HEPA Positive Pressure',
      equipment: ['Isoflurane Vaporizer Suite', 'Vital Signs Multiparameter Monitor', 'Electrocautery Unit'],
      current_case: 'SCH-20260302-01 (น้องบราวนี่ - เย็บซ่อมแซมแผลฉีกขาด)'
    },
    {
      id: 'PROC-1',
      name: 'ห้องหัตถการ & ทันตกรรม (Procedure & Dental Suite)',
      type: 'PROCEDURE_DENTAL',
      status: 'READY',
      cleanliness_level: 'Standard Clinical Clean',
      equipment: ['iM3 Dental Workstation', 'Ultrasonic Scaler', 'Dental Suction & LED Light'],
      current_case: null
    }
  ],

  // --- 2. SURGERY CATALOGS (Table: surgery.surgery_catalogs) ---
  surgeryCatalogs: [
    {
      id: 1,
      surgery_code: 'SURG-OVH-01',
      surgery_name: 'ผ่าตัดทำหมันแมวเพศเมีย (Feline Ovariohysterectomy)',
      surgery_type: 'Soft Tissue',
      estimated_duration_minutes: 45,
      anesthesia_type: 'General Inhalation Anesthesia (Isoflurane)',
      description: 'ผ่าตัดนำรังไข่และมดลูกออกทั้งหมดเพื่อคุมกำเนิด ป้องกันภาวะมดลูกอักเสบและเนื้องอกเต้านม',
      status: 'ACTIVE'
    },
    {
      id: 2,
      surgery_code: 'SURG-WND-02',
      surgery_name: 'เย็บซ่อมแซมแผลฉีกขาด (Wound Debridement & Primary Suture)',
      surgery_type: 'Minor Procedure',
      estimated_duration_minutes: 30,
      anesthesia_type: 'General / Injectable & Local Infiltration',
      description: 'ตัดแต่งเนื้อตาย ชะล้างแผลติดเชื้อ และเย็บปิดแผลแบบ Primary Closure',
      status: 'ACTIVE'
    },
    {
      id: 3,
      surgery_code: 'SURG-MSS-03',
      surgery_name: 'ผ่าตัดก้อนเนื้องอกผิวหนัง (Mass Excision & Biopsy)',
      surgery_type: 'Soft Tissue / Oncologic',
      estimated_duration_minutes: 50,
      anesthesia_type: 'General Inhalation Anesthesia',
      description: 'ตัดก้อนเนื้องอกผิวหนังพร้อมขอบเนื้อเยื่อปกติ ส่งตรวจทางพยาธิวิทยา (Histopathology)',
      status: 'ACTIVE'
    },
    {
      id: 4,
      surgery_code: 'SURG-DEN-04',
      surgery_name: 'ขูดหินปูนและขัดฟัน (Dental Scaling & Polishing)',
      surgery_type: 'Dental',
      estimated_duration_minutes: 40,
      anesthesia_type: 'General Inhalation Anesthesia (Cuffed Endotracheal Tube)',
      description: 'กำจัดคราบหินปูนด้วย Ultrasonic Scaler เกลารากฟันและขัดเคลือบฟันด้วยฟลูออไรด์',
      status: 'ACTIVE'
    },
    {
      id: 5,
      surgery_code: 'SURG-LAP-05',
      surgery_name: 'ผ่าตัดสำรวจช่องท้อง (Exploratory Laparotomy & Foreign Body Removal)',
      surgery_type: 'Abdominal / Emergency',
      estimated_duration_minutes: 75,
      anesthesia_type: 'Balanced Inhalation Anesthesia (Isoflurane + Fentanyl CRI)',
      description: 'ผ่าเปิดช่องท้องเพื่อสำรวจสิ่งแปลกปลอมอุดตันในกระเพาะหรือลำไส้ และประเมินอวัยวะภายใน',
      status: 'ACTIVE'
    },
    {
      id: 6,
      surgery_code: 'SURG-CS-06',
      surgery_name: 'ผ่าคลอดฉุกเฉิน (Emergency Caesarean Section)',
      surgery_type: 'Obstetric / Emergency',
      estimated_duration_minutes: 60,
      anesthesia_type: 'Rapid Sequence Induction (Alfaxalone + Isoflurane Minimal)',
      description: 'ผ่าคลอดฉุกเฉินกรณีคลอดยากเชิงกรานแคบหรือลูกสุนัข/แมวมีภาวะ Fetal Distress',
      status: 'ACTIVE'
    }
  ],

  // --- 3. ANESTHESIA CATALOGS (Table: surgery.anesthesia_catalogs) ---
  anesthesiaCatalogs: [
    {
      id: 1,
      anesthesia_code: 'ANES-ISO-01',
      anesthesia_name: 'General Inhalation Anesthesia (Isoflurane + O2)',
      description: 'ดมยาสลบด้วยก๊าซ Isoflurane ผ่านท่อช่วยหายใจ cuffed ET tube ควบคุมระดับการสลบได้แม่นยำ',
      status: 'ACTIVE'
    },
    {
      id: 2,
      anesthesia_code: 'ANES-SEVO-02',
      anesthesia_name: 'General Inhalation Anesthesia (Sevoflurane + O2)',
      description: 'ก๊าซดมสลบ Sevoflurane นำสลบและฟื้นตัวได้รวดเร็ว เหมาะกับสัตว์ป่วยวิกฤติหรือโรคตับ/ไต',
      status: 'ACTIVE'
    },
    {
      id: 3,
      anesthesia_code: 'ANES-TIVA-03',
      anesthesia_name: 'Total Intravenous Anesthesia (TIVA - Propofol/Alfaxalone CRI)',
      description: 'ให้ยาสลบทางหลอดเลือดดำต่อเนื่อง เหมาะกับหัตถการสั้นหรือหัตถการระบบทางเดินหายใจ',
      status: 'ACTIVE'
    },
    {
      id: 4,
      anesthesia_code: 'ANES-LOC-04',
      anesthesia_name: 'Sedation & Regional/Local Anesthesia (Lidocaine/Bupivacaine)',
      description: 'ให้ยาสงบประสาทร่วมกับการบล็อกชาเฉพาะที่หรือ Epidural Block ระงับปวดได้มีประสิทธิภาพ',
      status: 'ACTIVE'
    }
  ],

  // --- 4. SURGERY REQUESTS (Table: surgery.surgery_requests) ---
  surgeryRequests: [
    {
      id: 1,
      request_number: 'REQ-SURG-2026-0001',
      encounter_id: 1,
      pet_id: 1, // บราวนี่
      customer_id: 1,
      surgery_catalog_id: 2, // เย็บซ่อมแซมแผลฉีกขาด
      requested_by: 1, // น.สพ. วุฒิชัย
      requested_at: '2026-03-02 10:30',
      medical_indication: 'แผลฉีกขาดลึกบริเวณไหล่ขวาจากการต่อสู้กับสุนัขอื่น จำเป็นต้องล้าง Debridement และเย็บปิดแผล',
      priority: 'URGENT', // 'ROUTINE' | 'URGENT' | 'EMERGENCY'
      status: 'SCHEDULED' // 'PENDING_ASSESSMENT' | 'SCHEDULED' | 'IN_SURGERY' | 'COMPLETED' | 'CANCELLED'
    },
    {
      id: 2,
      request_number: 'REQ-SURG-2026-0002',
      encounter_id: 2,
      pet_id: 2, // โมจิ
      customer_id: 2,
      surgery_catalog_id: 1, // ทำหมันแมวเพศเมีย
      requested_by: 2, // สพ.ญ. ศศิธร
      requested_at: '2026-03-02 09:15',
      medical_indication: 'ผ่าตัดทำหมันคุมกำเนิดตามนัดหมาย ป้องกันโรคทางระบบสืบพันธุ์',
      priority: 'ROUTINE',
      status: 'SCHEDULED'
    },
    {
      id: 3,
      request_number: 'REQ-SURG-2026-0003',
      encounter_id: 3,
      pet_id: 3, // ลักกี้
      customer_id: 3,
      surgery_catalog_id: 4, // ขูดหินปูน
      requested_by: 1,
      requested_at: '2026-03-02 08:45',
      medical_indication: 'ภาวะเหงือกอักเสบและมีคราบหินปูนสะสมหนาแน่นระยะที่ 2 ต้องทำหัตถการทันตกรรมภายใต้การดมยาสลบ',
      priority: 'ROUTINE',
      status: 'COMPLETED'
    },
    {
      id: 4,
      request_number: 'REQ-SURG-2026-0004',
      encounter_id: 4,
      pet_id: 4, // ชีสเค้ก
      customer_id: 1,
      surgery_catalog_id: 3, // ผ่าตัดก้อนเนื้องอกผิวหนัง
      requested_by: 1,
      requested_at: '2026-03-02 11:15',
      medical_indication: 'พบก้อนเนื้อขนาด 2.5 ซม. บริเวณข้างลำตัวซ้าย โตเร็วใน 1 เดือน จำเป็นต้องผ่าตัดพร้อมขอบเนื้อเยื่อปกติ',
      priority: 'ROUTINE',
      status: 'PENDING_ASSESSMENT'
    }
  ],

  // --- 5. PREOPERATIVE ASSESSMENTS (Table: surgery.preoperative_assessments) ---
  preoperativeAssessments: [
    {
      id: 1,
      surgery_request_id: 1,
      schedule_id: 1,
      pet_id: 1,
      assessed_by: 1, // น.สพ. วุฒิชัย
      risk_level: 'ASA II', // 'ASA I' | 'ASA II' | 'ASA III' | 'ASA IV' | 'ASA V'
      risk_description: 'ผู้ป่วยมีภาวะอักเสบเฉพาะที่และแผลฉีกขาด ไม่มีโรคประจำตัวรุนแรงตามระบบ',
      fasting_food_hours: 6,
      fasting_water_hours: 2,
      is_npo_cleared: true,
      pre_op_bloodwork: 'WBC 21.8 (สูงจากการอักเสบ), HCT 44.5%, PLT 168k, BUN 18, Creat 1.1 (ผ่านเกณฑ์ดมยา)',
      baseline_vitals: { hr: 115, rr: 24, temp: 38.6, crt: '< 2s', mm: 'Pink' },
      assessment_result: 'พร้อมเข้ารับการระงับความรู้สึกและผ่าตัดได้ โดยติดตามระดับความดันโลหิตและสัญญาณชีพใกล้ชิด',
      approved_for_surgery: true,
      assessed_at: '2026-03-02 11:10'
    },
    {
      id: 2,
      surgery_request_id: 2,
      schedule_id: 2,
      pet_id: 2,
      assessed_by: 2, // สพ.ญ. ศศิธร
      risk_level: 'ASA I',
      risk_description: 'ผู้ป่วยสุขภาพแข็งแรงสมบูรณ์ ตรวจเลือดก่อนผ่าตัดทุกค่าอยู่ในเกณฑ์ปกติ',
      fasting_food_hours: 8,
      fasting_water_hours: 2,
      is_npo_cleared: true,
      pre_op_bloodwork: 'CBC & Chem Profile Normal ทุกพารามิเตอร์',
      baseline_vitals: { hr: 130, rr: 28, temp: 38.4, crt: '< 2s', mm: 'Pink' },
      assessment_result: 'สุขภาพพร้อมสมบูรณ์สำหรับการผ่าตัดทำหมันตามนัดหมาย',
      approved_for_surgery: true,
      assessed_at: '2026-03-02 10:30'
    },
    {
      id: 3,
      surgery_request_id: 3,
      schedule_id: 3,
      pet_id: 3,
      assessed_by: 1,
      risk_level: 'ASA I',
      risk_description: 'สุขภาพแข็งแรง ฟังปอดและหัวใจปกติ ไม่มีประวัติแพ้ยา',
      fasting_food_hours: 8,
      fasting_water_hours: 3,
      is_npo_cleared: true,
      pre_op_bloodwork: 'CBC/Chemistry Cleared ปกติ',
      baseline_vitals: { hr: 110, rr: 22, temp: 38.2, crt: '< 2s', mm: 'Pink' },
      assessment_result: 'พร้อมรับการวางยาสลบเพื่อทำหัตถการทันตกรรม',
      approved_for_surgery: true,
      assessed_at: '2026-03-02 09:30'
    }
  ],

  // --- 6. SURGERY CONSENTS (Table: surgery.surgery_consents) ---
  surgeryConsents: [
    {
      id: 1,
      surgery_request_id: 1,
      schedule_id: 1,
      customer_id: 1,
      pet_id: 1,
      consent_type: 'หนังสือยินยอมการผ่าตัดและการระงับความรู้สึก (Surgical & Anesthetic Consent)',
      signed_by_name: 'คุณวิภาดา (แพท)',
      is_signed: true,
      witness_name: 'พว. กัลยา สุขใจ',
      consented_at: '2026-03-02 11:15',
      consent_document_reference: 'DOC-CONSENT-2026-0001.pdf'
    },
    {
      id: 2,
      surgery_request_id: 2,
      schedule_id: 2,
      customer_id: 2,
      pet_id: 2,
      consent_type: 'หนังสือยินยอมการผ่าตัดทำหมันและวางยาสลบ',
      signed_by_name: 'คุณชนาธิป (บอล)',
      is_signed: true,
      witness_name: 'พว. สุภาพร นวมินทร์',
      consented_at: '2026-03-02 10:45',
      consent_document_reference: 'DOC-CONSENT-2026-0002.pdf'
    },
    {
      id: 3,
      surgery_request_id: 3,
      schedule_id: 3,
      customer_id: 3,
      pet_id: 3,
      consent_type: 'หนังสือยินยอมการวางยาสลบและทำหัตถการทันตกรรม',
      signed_by_name: 'คุณกมลชนก (แนท)',
      is_signed: true,
      witness_name: 'พว. กัลยา สุขใจ',
      consented_at: '2026-03-02 09:40',
      consent_document_reference: 'DOC-CONSENT-2026-0003.pdf'
    }
  ],

  // --- 7. SURGERY SCHEDULES (Table: surgery.surgery_schedules) ---
  surgerySchedules: [
    {
      id: 1,
      surgery_request_id: 1,
      schedule_number: 'SCH-20260302-01',
      encounter_id: 1,
      pet_id: 1, // บราวนี่
      customer_id: 1,
      surgery_catalog_id: 2, // เย็บซ่อมแซมแผลฉีกขาด
      room_id: 'OR-2',
      room_name: 'ห้องผ่าตัด 2 (Soft Tissue OR-2)',
      scheduled_date: '2026-03-02',
      scheduled_time: '11:30',
      estimated_duration: 30,
      surgeon_id: 1, // น.สพ. วุฒิชัย
      anesthetist_id: 2, // สพ.ญ. ศศิธร
      status: 'IN_PROGRESS', // 'SCHEDULED' | 'IN_PROGRESS' | 'RECOVERY' | 'COMPLETED' | 'CANCELLED'
      medical_indication: 'แผลฉีกขาดลึกบริเวณไหล่ขวา ล้างแผลและเย็บซ่อมแซม',
      urgency: 'URGENT'
    },
    {
      id: 2,
      surgery_request_id: 2,
      schedule_number: 'SCH-20260302-02',
      encounter_id: 2,
      pet_id: 2, // โมจิ
      customer_id: 2,
      surgery_catalog_id: 1, // ทำหมันแมวเพศเมีย
      room_id: 'OR-1',
      room_name: 'ห้องผ่าตัดปลอดเชื้อ 1 (Sterile OR-1)',
      scheduled_date: '2026-03-02',
      scheduled_time: '13:30',
      estimated_duration: 45,
      surgeon_id: 2, // สพ.ญ. ศศิธร
      anesthetist_id: 1, // น.สพ. วุฒิชัย
      status: 'SCHEDULED',
      medical_indication: 'ผ่าตัดทำหมันตามนัดหมาย ตรวจเลือดและประเมิน ASA I พร้อมวางยาสลบ',
      urgency: 'ROUTINE'
    },
    {
      id: 3,
      surgery_request_id: 3,
      schedule_number: 'SCH-20260302-03',
      encounter_id: 3,
      pet_id: 3, // ลักกี้
      customer_id: 3,
      surgery_catalog_id: 4, // ขูดหินปูน
      room_id: 'PROC-1',
      room_name: 'ห้องหัตถการ & ทันตกรรม (Proc-1)',
      scheduled_date: '2026-03-02',
      scheduled_time: '10:00',
      estimated_duration: 40,
      surgeon_id: 1,
      anesthetist_id: 2,
      status: 'RECOVERY',
      medical_indication: 'คราบหินปูนสะสมและเหงือกอักเสบ ทำหัตถการเรียบร้อยแล้ว อยู่ระหว่างพักฟื้น',
      urgency: 'ROUTINE'
    }
  ],

  // --- 8. SURGERY TEAM MEMBERS (Table: surgery.surgery_team_members) ---
  surgeryTeamMembers: [
    { id: 1, surgery_record_id: 1, employee_id: 1, name: 'น.สพ. วุฒิชัย เกียรติสกุล', responsibility: 'LEAD_SURGEON' },
    { id: 2, surgery_record_id: 1, employee_id: 2, name: 'สพ.ญ. ศศิธร สุขสมบูรณ์', responsibility: 'ANESTHETIST' },
    { id: 3, surgery_record_id: 1, employee_id: 3, name: 'พว. กัลยา สุขใจ', responsibility: 'SCRUB_NURSE' },
    { id: 4, surgery_record_id: 1, employee_id: 4, name: 'พว. สุภาพร นวมินทร์', responsibility: 'CIRCULATING_NURSE' },

    { id: 5, surgery_record_id: 2, employee_id: 1, name: 'น.สพ. วุฒิชัย เกียรติสกุล', responsibility: 'LEAD_SURGEON' },
    { id: 6, surgery_record_id: 2, employee_id: 2, name: 'สพ.ญ. ศศิธร สุขสมบูรณ์', responsibility: 'ANESTHETIST' },
    { id: 7, surgery_record_id: 2, employee_id: 3, name: 'พว. กัลยา สุขใจ', responsibility: 'SCRUB_NURSE' }
  ],

  // --- 9. ANESTHESIA RECORDS & MONITORINGS (Table: surgery.anesthesia_records & monitorings) ---
  anesthesiaRecords: [
    {
      id: 1,
      surgery_record_id: 1,
      anesthesia_catalog_id: 1,
      anesthetist_id: 2,
      pre_medication: 'Acepromazine 0.02 mg/kg + Morphine 0.3 mg/kg IM',
      induction_agent: 'Propofol 4.0 mg/kg IV via 22G catheter',
      maintenance_agent: 'Isoflurane 1.5% in 100% Medical Oxygen',
      et_tube_size: '8.0 mm ID (Cuffed)',
      circuit_type: 'Rebreathing (Circle System)',
      fluid_rate: '0.9% NaCl @ 5 ml/kg/hr',
      started_at: '2026-03-02 11:30',
      ended_at: null,
      notes: 'ใส่ท่อช่วยหายใจราบรื่น Cuff seal สมบูรณ์ ควบคุมระดับความลึกในการสลบได้ดี'
    },
    {
      id: 2,
      surgery_record_id: 2,
      anesthesia_catalog_id: 1,
      anesthetist_id: 2,
      pre_medication: 'Butorphanol 0.2 mg/kg + Midazolam 0.2 mg/kg IM',
      induction_agent: 'Alfaxalone 3.0 mg/kg IV',
      maintenance_agent: 'Isoflurane 1.2% in 100% Medical Oxygen',
      et_tube_size: '6.5 mm ID (Cuffed)',
      circuit_type: 'Non-Rebreathing (Bain Circuit)',
      fluid_rate: 'LRS @ 3 ml/kg/hr',
      started_at: '2026-03-02 10:00',
      ended_at: '2026-03-02 10:45',
      notes: 'ฟื้นจากการดมสลบเรียบร้อย ถอดท่อช่วยหายใจเมื่อกลืนน้ำลายได้ 3 ครั้ง'
    }
  ],

  anesthesiaMonitorings: [
    // Case 1: Brownie (In Surgery)
    { id: 1, anesthesia_id: 1, recorded_at: '11:35 (0 min)', hr: 122, spo2: 99, etco2: 38, map: 82, temp: 38.3, rr: 18, isoflurane_pct: 1.5, recorded_by: 'สพ.ญ. ศศิธร' },
    { id: 2, anesthesia_id: 1, recorded_at: '11:45 (10 min)', hr: 118, spo2: 99, etco2: 39, map: 78, temp: 38.1, rr: 16, isoflurane_pct: 1.5, recorded_by: 'สพ.ญ. ศศิธร' },
    { id: 3, anesthesia_id: 1, recorded_at: '11:55 (20 min)', hr: 115, spo2: 98, etco2: 40, map: 76, temp: 37.9, rr: 16, isoflurane_pct: 1.2, recorded_by: 'สพ.ญ. ศศิธร' },

    // Case 2: Lucky (Dental - Completed)
    { id: 4, anesthesia_id: 2, recorded_at: '10:05 (0 min)', hr: 135, spo2: 99, etco2: 36, map: 85, temp: 38.2, rr: 20, isoflurane_pct: 1.5, recorded_by: 'สพ.ญ. ศศิธร' },
    { id: 5, anesthesia_id: 2, recorded_at: '10:20 (15 min)', hr: 130, spo2: 99, etco2: 37, map: 80, temp: 38.0, rr: 18, isoflurane_pct: 1.2, recorded_by: 'สพ.ญ. ศศิธร' },
    { id: 6, anesthesia_id: 2, recorded_at: '10:35 (30 min)', hr: 128, spo2: 98, etco2: 38, map: 79, temp: 37.8, rr: 18, isoflurane_pct: 1.0, recorded_by: 'สพ.ญ. ศศิธร' }
  ],

  // --- 10. SURGERY RECORDS & MATERIAL USAGES (Table: surgery.surgery_records & material_usages) ---
  surgeryRecords: [
    {
      id: 1,
      schedule_id: 1,
      surgery_number: 'SURG-REC-20260302-01',
      pet_id: 1,
      customer_id: 1,
      surgeon_id: 1,
      anesthetist_id: 2,
      started_at: '2026-03-02 11:35',
      completed_at: null,
      operation_details: 'เตรียมผิวหนังบริเวณไหล่ขวาด้วย Chlorhexidine Scrub ล้างแผลด้วย Normal Saline ตัดแต่งขอบเนื้อเยื่อที่บอบช้ำ (Debridement) เย็บชั้นใต้ผิวหนังด้วย Monofilament 3-0 และเย็บปิดชั้นผิวหนังด้วย Nylon 3-0 แบบ Simple Interrupted รวม 5 เข็ม',
      anesthesia_summary: 'Induction: Propofol 4 mg/kg IV, Maintenance: Isoflurane 1.5% in 100% O2, SpO2 99%, HR 118 bpm, NIBP MAP 78 mmHg ราบรื่นดี',
      findings: 'แผลฉีกขาดลึกถึงชั้น Superficial Fascia ไม่มีสิ่งแปลกปลอมตกค้าง ไม่พบการฉีกขาดของเส้นประสาทหรือหลอดเลือดสำคัญ',
      outcome: 'SUCCESSFUL',
      pain_score: 3,
      postoperative_instructions: 'ใส่ปลอกคอกันเลีย (E-Collar) ต่อเนื่อง 10 วัน, ทำแผลวันละ 1 ครั้ง, ให้ยาฆ่าเชื้อ Amoxiclav และยาลดอักเสบ Meloxicam, นัดตัดไหม 10-14 วัน',
      recovery_status: 'IN_SURGERY',
      status: 'IN_PROGRESS',
      materials: [
        { product_id: 7, product_name: '0.9% Normal Saline Solution 1,000ml', quantity: 1, unit: 'ขวด' },
        { product_id: 9, product_name: 'ไหมเย็บแผล Nylon 3-0 พร้อมเข็มโค้ง (Ethicon)', quantity: 1, unit: 'ซอง' },
        { product_id: 10, product_name: 'IV Catheter 22G เข็มให้น้ำเกลือทางหลอดเลือด (Nipro)', quantity: 1, unit: 'ชิ้น' }
      ]
    },
    {
      id: 2,
      schedule_id: 3,
      surgery_number: 'SURG-REC-20260302-02',
      pet_id: 3,
      customer_id: 3,
      surgeon_id: 1,
      anesthetist_id: 2,
      started_at: '2026-03-02 10:05',
      completed_at: '2026-03-02 10:45',
      operation_details: 'ใส่ท่อช่วยหายใจชนิดมี Cuffed ขูดคราบหินปูนด้วย Ultrasonic Scaler ทั้งฟันหน้าและฟันกราม เกลารากฟัน (Subgingival curettage) ขัดเคลือบฟันด้วย Fluoride Prophylaxis Paste',
      anesthesia_summary: 'Induction: Alfaxalone 3 mg/kg IV, Maintenance: Isoflurane 1.2%, SpO2 99%, HR 135 bpm, หายใจสม่ำเสมอ ฟื้นตัวดี',
      findings: 'พบเหงือกอักเสบระยะที่ 2 ไม่มีฟันโยกคลอน ไม่ต้องทำการถอนฟัน',
      outcome: 'SUCCESSFUL',
      pain_score: 1,
      postoperative_instructions: 'งดอาหารเม็ดแข็ง 1-2 วัน ให้รับประทานอาหารเปียกหรืออาหารเหลว พ่นสเปรย์ลดการสะสมแบคทีเรียในช่องปาก',
      recovery_status: 'RECOVERING',
      status: 'COMPLETED',
      materials: [
        { product_id: 7, product_name: '0.9% Normal Saline Solution 1,000ml', quantity: 1, unit: 'ขวด' }
      ]
    }
  ],

  // --- 11. POSTOPERATIVE RECORDS (Table: surgery.postoperative_records) ---
  postoperativeRecords: [
    {
      id: 1,
      surgery_record_id: 2, // Case Lucky
      schedule_id: 3,
      pet_id: 3,
      recorded_at: '2026-03-02 10:55',
      temperature: 37.9,
      heart_rate: 110,
      respiratory_rate: 22,
      mucous_membrane: 'Pink',
      crt_seconds: '< 2s',
      pain_score: 1,
      consciousness_level: 'ALERT_RESPONSIVE', // 'DEEP_SLEEP' | 'SEDATED_AROUSABLE' | 'ALERT_RESPONSIVE'
      swallowing_reflex: true,
      extubation_time: '10:50',
      observation: 'สัตว์ป่วยฟื้นตัวจากการดมสลบเรียบร้อย รู้สึกตัวดี ลุกนั่งได้ ไม่มีอาการสั่นหรืออาเจียน',
      discharge_readiness: true,
      recorded_by: 'พว. กัลยา สุขใจ'
    }
  ],

  // --- 12. SURGERY COMPLICATIONS (Table: surgery.surgery_complications) ---
  surgeryComplications: [
    {
      id: 1,
      surgery_record_id: 1,
      complication_type: 'MILD_HYPOTENSION',
      description: 'ความดันเฉลี่ย (MAP) ลดลงสู่ 62 mmHg ชั่วคราว แก้ไขโดยลดระดับก๊าซ Isoflurane เหลือ 1.2% และให้ IV Bolus Fluid 10 ml/kg MAP กลับสู่ 76 mmHg ปกติ',
      severity: 'MILD',
      occurred_at: '2026-03-02 11:50',
      resolved_at: '2026-03-02 11:55',
      reported_by: 'สพ.ญ. ศศิธร สุขสมบูรณ์'
    }
  ]
});
