Object.assign(state, {
  // Diagnosis Catalog (ICD-Vet Compatible Master Data)
  diagnosisCatalog: [
    { id: 1, code: 'DG-001', name: 'กระเพาะและลำไส้อักเสบเฉียบพลัน (Acute Gastroenteritis)', category: 'ทางเดินอาหาร', icd_vet: 'K52.9' },
    { id: 2, code: 'DG-002', name: 'หูชั้นนอกอักเสบ (Otitis Externa)', category: 'หูและผิวหนัง', icd_vet: 'H60.9' },
    { id: 3, code: 'DG-003', name: 'ภูมิแพ้ผิวหนังเรื้อรัง (Atopic Dermatitis)', category: 'ภูมิแพ้และผิวหนัง', icd_vet: 'L20.9' },
    { id: 4, code: 'DG-004', name: 'โรคไตวายเรื้อรัง (Chronic Kidney Disease - Stage 1/2)', category: 'ทางเดินปัสสาวะและไต', icd_vet: 'N18.9' },
    { id: 5, code: 'DG-005', name: 'ตรวจสุขภาพและฉีดวัคซีนประจำปี (Wellness & Vaccination)', category: 'เวชศาสตร์ป้องกัน', icd_vet: 'Z00.0' },
    { id: 6, code: 'DG-006', name: 'ภาวะสารพิษในทางเดินอาหาร (Suspected Toxin Ingestion)', category: 'ฉุกเฉินและสารพิษ', icd_vet: 'T65.9' },
    { id: 7, code: 'DG-007', name: 'การติดเชื้อทางเดินหายใจส่วนบนในแมว (Feline URI)', category: 'ทางเดินหายใจ', icd_vet: 'J06.9' },
    { id: 8, code: 'DG-008', name: 'ข้อเสื่อมและกระดูกอักเสบเรื้อรัง (Osteoarthritis)', category: 'กระดูกและข้อ', icd_vet: 'M19.9' }
  ],

  // Medication Catalog with Clinical Dosing Guidelines & Allergen Profiles
  medicationCatalog: [
    { 
      id: 1, 
      name: 'Amoxicillin + Clavulanate (Clavamox 250mg)', 
      form: 'เม็ด 250mg', 
      dose_mg_per_kg: 12.5,
      default_route: 'กินหลังอาหาร',
      default_freq: 'วันละ 2 ครั้ง เช้า-เย็น',
      default_duration_days: 7,
      allergen_family: 'Penicillins',
      caution: 'ห้ามใช้ในสัตว์ที่มีประวัติแพ้ยากลุ่ม Penicillin',
      price: 25.0
    },
    { 
      id: 2, 
      name: 'Enrofloxacin (Baytril 50mg)', 
      form: 'เม็ด 50mg', 
      dose_mg_per_kg: 5.0,
      default_route: 'กินหลังอาหาร',
      default_freq: 'วันละ 1 ครั้ง ตอนเช้า',
      default_duration_days: 7,
      allergen_family: 'Fluoroquinolones',
      is_allergen_alert: true,
      caution: '⚠️ สัตว์ป่วยหลายสายพันธุ์มีประวัติแพ้ยา ระวังการใช้ในลูกสัตว์ที่กำลังเจริญเติบโต',
      price: 35.0
    },
    { 
      id: 3, 
      name: 'Meloxicam (Metacam Oral 1.5mg/ml)', 
      form: 'ยาน้ำ 1.5mg/ml', 
      dose_mg_per_kg: 0.1,
      default_route: 'ป้อนกินพร้อมอาหาร',
      default_freq: 'วันละ 1 ครั้ง',
      default_duration_days: 5,
      allergen_family: 'NSAIDs',
      caution: '⚠️ ห้ามใช้ในสัตว์ที่มีภาวะไตวายเรื้อรัง (CKD) ภาวะขาดน้ำ หรือมีแผลในกระเพาะ',
      price: 180.0
    },
    { 
      id: 4, 
      name: 'Dexoryl Ear Drops (10g)', 
      form: 'ยาหยอดหู 10g', 
      dose_mg_per_kg: 0,
      default_route: 'หยอดหู ซ้าย-ขวา',
      default_freq: 'วันละ 2 ครั้ง (หยอด 3-4 หยด)',
      default_duration_days: 7,
      allergen_family: 'Topical Antibiotic/Steroid',
      caution: 'ตรวจสอบเยื่อแก้วหูก่อนใช้',
      price: 240.0
    },
    { 
      id: 5, 
      name: 'Renal Diet Paste & Phosphate Binder (50g)', 
      form: 'เจลบำรุงไต 50g', 
      dose_mg_per_kg: 0,
      default_route: 'ป้อนกินพร้อมอาหาร',
      default_freq: 'วันละ 2 ครั้ง (ครั้งละ 2 cc)',
      default_duration_days: 30,
      allergen_family: 'Nutritional Supplement',
      caution: 'ให้ต่อเนื่องเพื่อช่วยชะลอการเสื่อมของไต',
      price: 450.0
    },
    { 
      id: 6, 
      name: 'Rabisin (วัคซีนป้องกันโรคพิษสุนัขบ้า)', 
      form: 'ยาฉีด 1 dose (1 ml)', 
      dose_mg_per_kg: 0,
      default_route: 'ฉีดเข้าใต้ผิวหนัง (SC)',
      default_freq: 'ปีละ 1 ครั้ง',
      default_duration_days: 1,
      allergen_family: 'Vaccines',
      caution: 'สังเกตอาการแพ้วัคซีน 15-30 นาทีหลังฉีด',
      price: 150.0
    },
    { 
      id: 7, 
      name: 'Maropitant (Cerenia 10mg/ml ยาแก้อาเจียน)', 
      form: 'ยาฉีด 10mg/ml', 
      dose_mg_per_kg: 1.0,
      default_route: 'ฉีดเข้าใต้ผิวหนัง (SC)',
      default_freq: 'วันละ 1 ครั้ง (ฉีดในคลินิก)',
      default_duration_days: 1,
      allergen_family: 'Antiemetic',
      caution: 'ฉีดช้าๆ อาจทำให้ระคายเคืองจุดฉีดชั่วคราว',
      price: 280.0
    },
    { 
      id: 8, 
      name: 'Ketoconazole/Chlorhexidine Medicated Shampoo', 
      form: 'แชมพูยา 200ml', 
      dose_mg_per_kg: 0,
      default_route: 'ฟอกอาบน้ำทิ้งไว้ 10 นาทีแล้วล้างออก',
      default_freq: 'สัปดาห์ละ 2 ครั้ง',
      default_duration_days: 14,
      allergen_family: 'Antifungal Topical',
      caution: 'ระวังอย่าให้เข้าตาและช่องหู',
      price: 320.0
    }
  ],

  // Clinical SOAP Templates (1-Click Presets for Fast Charting)
  clinical_templates: [
    {
      id: 'VACCINE_CHECKUP',
      name: '💉 ฉีดวัคซีน & ตรวจสุขภาพประจำปี',
      category: 'Preventive Care',
      subjective: {
        chief_complaint: 'มาตรวจสุขภาพประจำปีและฉีดวัคซีนป้องกันโรคตามนัดหมาย',
        duration: 'ตามกำหนดนัด',
        appetite: 'ปกติ',
        notes: 'สุขภาพทั่วไปแข็งแรง ร่าเริง ไม่มีอาการไอ จาม หรืออาเจียน ขับถ่ายปกติ'
      },
      objective: {
        temp: 38.5,
        heart_rate: 110,
        resp_rate: 24,
        crt: '< 2s',
        bcs: '5/9 (สมส่วน)',
        findings: 'เยื่อเมือกสีชมพูดี ฟันและเหงือกสะอาด ต่อมน้ำเหลืองปกติ เสียงหัวใจและปอดปกติ คลำช่องท้องไม่พบสิ่งผิดปกติ'
      },
      assessment: {
        primary_diagnosis: 'ตรวจสุขภาพประจำปีและฉีดวัคซีนป้องกันโรค (Healthy Annual Checkup)',
        diagnosis_code: 'DG-005',
        diagnosis_id: 5,
        differential: '-'
      },
      plan: {
        summary: 'ฉีดวัคซีนป้องกันโรคพิษสุนัขบ้า (Rabisin 1 dose SC บริเวณสะโพกขวา) ตรวจสุขภาพทั่วไปปกติ',
        med_ids: [6],
        diagnostic_orders: [],
        homecare: 'สังเกตอาการแพ้วัคซีน 24 ชั่วโมง งดอาบน้ำ 7 วันหลังได้รับวัคซีน',
        follow_up: 'นัดตรวจสุขภาพและฉีดวัคซีนประจำปีถัดไป (1 ปี)'
      }
    },
    {
      id: 'OTITIS',
      name: '👂 หูชั้นนอกอักเสบ (Otitis Externa)',
      category: 'Ears & Skin',
      subjective: {
        chief_complaint: 'เกาหูบ่อย สะบัดหัว มีขี้หูสีน้ำตาลเข้มและมีกลิ่นอับ',
        duration: '3 วันที่ผ่านมา',
        appetite: 'ปกติ',
        notes: 'เริ่มมีอาการหลังจากเจ้าของพาไปอาบน้ำ'
      },
      objective: {
        temp: 38.7,
        heart_rate: 115,
        resp_rate: 26,
        crt: '< 2s',
        bcs: '5/9 (สมส่วน)',
        findings: 'ส่องกล้อง Otoscope พบเยื่อบุช่องหูบวมแดง (Erythema) ขี้หูสีน้ำตาลข้น เยื่อแก้วหู intact สมบูรณ์ดี'
      },
      assessment: {
        primary_diagnosis: 'หูชั้นนอกอักเสบระดับเล็กน้อยถึงปานกลาง (Otitis Externa)',
        diagnosis_code: 'DG-002',
        diagnosis_id: 2,
        differential: 'ไรในหู (Otodectes cynotis) หรือ การติดเชื้อยีสต์แทรกซ้อน'
      },
      plan: {
        summary: 'ทำความสะอาดช่องหูล้างคราบไขมัน ส่องกล้อง และสั่งยาหยอดหูลดอักเสบฆ่าเชื้อ',
        med_ids: [4],
        diagnostic_orders: ['Ear Swab Cytology'],
        homecare: 'หยอดยา Dexoryl ครั้งละ 3-4 หยด วันละ 2 ครั้ง เช้า-เย็น ติดต่อกัน 7 วัน ระวังอย่าให้น้ำเข้าหู',
        follow_up: 'นัดตรวจซ้ำอีก 7 วัน'
      }
    },
    {
      id: 'DERMATITIS',
      name: '🐾 ภูมิแพ้ผิวหนังกำเริบ (Atopic Dermatitis)',
      category: 'Dermatology',
      subjective: {
        chief_complaint: 'คันผิวหนัง เกาพุง เลียอุ้งเท้าบ่อยจนผิวแดงมีสะเก็ด',
        duration: '1 สัปดาห์',
        appetite: 'ปกติ',
        notes: 'สัตว์เลี้ยงมีประวัติภูมิแพ้ผิวหนังตามฤดูกาล'
      },
      objective: {
        temp: 38.8,
        heart_rate: 118,
        resp_rate: 24,
        crt: '< 2s',
        bcs: '5/9 (สมส่วน)',
        findings: 'พบผื่นแดง (Erythema) บริเวณขาหนีบ ซอกรักแร้ และง่ามนิ้วเท้า มีรอยสะเก็ดแผลจากการเกา'
      },
      assessment: {
        primary_diagnosis: 'ภูมิแพ้ผิวหนังกำเริบ (Acute Flare of Atopic Dermatitis)',
        diagnosis_code: 'DG-003',
        diagnosis_id: 3,
        differential: 'การติดเชื้อแบคทีเรียหรือยีสต์แทรกซ้อน (Pyoderma / Malassezia)'
      },
      plan: {
        summary: 'ให้แชมพูยาฟอกอาบน้ำ และยาปฏิชีวนะควบคุมการติดเชื้อแทรกซ้อน',
        med_ids: [1, 8],
        diagnostic_orders: ['Skin Scraping & Tape Impression'],
        homecare: 'ฟอกแชมพูยาทิ้งไว้ 10 นาทีก่อนล้างออก สัปดาห์ละ 2 ครั้ง ทานยาปฏิชีวนะจนหมดแผง',
        follow_up: 'นัดตรวจติดตามอาการ 14 วัน'
      }
    },
    {
      id: 'GASTROENTERITIS',
      name: '🤢 กระเพาะและลำไส้อักเสบ (Gastroenteritis)',
      category: 'Gastrointestinal',
      subjective: {
        chief_complaint: 'อาเจียนเป็นฟองสีเหลือง 3 ครั้ง ซึม และไม่ยอมกินอาหาร',
        duration: '1 วัน',
        appetite: 'ไม่กินอาหาร',
        notes: 'เจ้าของสงสัยแอบกินเศษอาหารที่มีไขมันสูง'
      },
      objective: {
        temp: 39.2,
        heart_rate: 135,
        resp_rate: 32,
        crt: '< 2s',
        bcs: '5/9 (สมส่วน)',
        findings: 'คลำตรวจช่องท้องพบเจ็บเกร็งเล็กน้อย เยื่อเมือกช่องปากสีชมพู อุณหภูมิร่างกายเริ่มมีไข้ต่ำ'
      },
      assessment: {
        primary_diagnosis: 'กระเพาะอาหารและลำไส้อักเสบเฉียบพลัน (Acute Gastroenteritis)',
        diagnosis_code: 'DG-001',
        diagnosis_id: 1,
        differential: 'สิ่งแปลกปลอมในทางเดินอาหาร (Gastrointestinal Foreign Body)'
      },
      plan: {
        summary: 'ฉีดยาแก้อาเจียน ให้ยาปฏิชีวนะกิน และตรวจเลือดเช็กการอักเสบ',
        med_ids: [1, 7],
        diagnostic_orders: ['CBC & Blood Chemistry', 'Abdominal X-Ray'],
        homecare: 'งดอาหาร 6-8 ชั่วโมง จิบน้ำสะอาดทีละน้อย ทานยาแก้อักเสบหลังอาหาร',
        follow_up: 'นัดติดตามอาการใน 48 ชั่วโมง (หากอาเจียนเพิ่มให้พามาทันที)'
      }
    },
    {
      id: 'CKD',
      name: '🐱 ตรวจติดตามโรคไตวายเรื้อรัง (CKD Monitoring)',
      category: 'Renal & Urology',
      subjective: {
        chief_complaint: 'ตรวจติดตามค่าไตประจำเดือน ดื่มน้ำบ่อย ปัสสาวะบ่อย',
        duration: 'เรื้อรัง 6 เดือน',
        appetite: 'กินอาหารโรคไตได้ปานกลาง',
        notes: 'ไม่มีอาการอาเจียน อุจจาระปกติ ร่าเริงดี'
      },
      objective: {
        temp: 38.3,
        heart_rate: 155,
        resp_rate: 26,
        crt: '< 2s',
        bcs: '4/9 (ผอมเล็กน้อย)',
        findings: 'คลำไตทั้งสองข้างไม่พบบวมโต น้ำหนักตัวคงที่ เยื่อเมือกชมพู ความตึงตัวผิวหนังปกติ'
      },
      assessment: {
        primary_diagnosis: 'โรคไตวายเรื้อรังระยะควบคุมได้ (CKD Stage 1/2 - Stable)',
        diagnosis_code: 'DG-004',
        diagnosis_id: 4,
        differential: '-'
      },
      plan: {
        summary: 'เจาะเลือดตรวจค่าไต (BUN, Creatinine, SDMA) และให้สารเสริมชะลอโรคไต',
        med_ids: [5],
        diagnostic_orders: ['Blood Chemistry (BUN, Creatinine, SDMA)'],
        homecare: 'ป้อนเจลบำรุงไต 2 cc วันละ 2 ครั้ง จัดเตรียมน้ำสะอาดหลายจุด และให้อาหารโรคไตเคร่งครัด',
        follow_up: 'นัดเช็คเลือดอีก 1 เดือน'
      }
    }
  ],

  // Clinical Problem Lists (Long-term Patient Health Issues - Domain 03)
  clinical_problem_lists: [
    {
      id: 1,
      pet_id: 4, // Cheesecake
      problem_name: 'โรคไตวายเรื้อรัง (Chronic Kidney Disease Stage 1)',
      status: 'ACTIVE',
      severity: 'MODERATE',
      onset_date: '2025-11-10',
      resolved_date: null,
      notes: 'เฝ้าระวังค่า BUN และ Creatinine ให้อาหาร Renal Diet และ Phosphate Binder ต่อเนื่อง',
      managed_by: 'สพ.ญ. ศศิธร สุวรรณมาลี'
    },
    {
      id: 2,
      pet_id: 3, // Lucky
      problem_name: 'ภูมิแพ้ผิวหนังเรื้อรัง (Atopic Dermatitis)',
      status: 'ACTIVE',
      severity: 'MILD',
      onset_date: '2026-01-15',
      resolved_date: null,
      notes: 'ไวต่อโปรตีนไก่และเกสรหญ้า มีอาการคันและผิวหนังแดงตามซอกนิ้ว',
      managed_by: 'น.สพ. วุฒิชัย เจริญสุข'
    },
    {
      id: 3,
      pet_id: 1, // Brownie
      problem_name: 'หูชั้นนอกอักเสบจากน้ำเข้า (Mild Otitis Externa)',
      status: 'CONTROLLED',
      severity: 'MILD',
      onset_date: '2026-03-02',
      resolved_date: null,
      notes: 'หยอดยา Dexoryl ครบ 7 วัน คราบขี้หูลดลง อาการดีขึ้น',
      managed_by: 'น.สพ. วุฒิชัย เจริญสุข'
    },
    {
      id: 4,
      pet_id: 5, // Milo
      problem_name: 'สงสัยภาวะสารพิษเฉียบพลัน (Suspected Toxin Ingestion)',
      status: 'ACTIVE',
      severity: 'SEVERE',
      onset_date: '2026-03-02',
      resolved_date: null,
      notes: 'หอบเหนื่อย อาเจียนรุนแรง ได้รับสารล้างพิษและสารน้ำทางหลอดเลือด',
      managed_by: 'น.สพ. วุฒิชัย เจริญสุข'
    }
  ],

  // Clinical Sign-Offs (Official Legal Endorsement - Domain 03)
  clinical_sign_offs: [
    {
      id: 1,
      encounter_id: 1,
      veterinarian_name: 'น.สพ. วุฒิชัย เจริญสุข',
      license_number: 'วพ.9824',
      signed_at: '2026-03-02T10:15:00+07:00',
      status: 'SIGNED_AND_LOCKED'
    },
    {
      id: 2,
      encounter_id: 2,
      veterinarian_name: 'สพ.ญ. ศศิธร สุวรรณมาลี',
      license_number: 'วพ.10452',
      signed_at: '2026-02-15T11:45:00+07:00',
      status: 'SIGNED_AND_LOCKED'
    },
    {
      id: 3,
      encounter_id: 3,
      veterinarian_name: 'น.สพ. วุฒิชัย เจริญสุข',
      license_number: 'วพ.9824',
      signed_at: '2026-02-18T14:30:00+07:00',
      status: 'SIGNED_AND_LOCKED'
    }
  ],

  // Clinical Follow-Ups (Follow-up Tracking - Domain 03)
  clinical_follow_ups: [
    {
      id: 1,
      encounter_id: 1,
      pet_id: 1,
      follow_up_date: '2026-03-09',
      action_type: 'RETURN_VISIT',
      notes: 'นัดตรวจช่องหูซ้ำ 7 วันหากยังมีอาการเกาสะบัดหัว',
      status: 'PENDING'
    },
    {
      id: 2,
      encounter_id: 2,
      pet_id: 4,
      follow_up_date: '2026-03-15',
      action_type: 'LAB_CHECK',
      notes: 'นัดตรวจเลือดเช็กค่าไต (BUN/Creatinine)',
      status: 'PENDING'
    }
  ],

  // Clinical Encounters History (Domain 03)
  encounters: [
    {
      id: 1,
      encounter_number: 'ENC-2026-0001',
      pet_id: 1, // Brownie
      customer_id: 1,
      encounter_date: '2026-03-02',
      encounter_type: 'GENERAL',
      doctor_id: 1,
      room_id: 1,
      status: 'COMPLETED',
      started_at: '2026-03-02T09:45:00+07:00',
      closed_at: '2026-03-02T10:15:00+07:00',
      subjective: {
        chief_complaint: 'ตรวจสุขภาพประจำปี ฉีดวัคซีนพิษสุนัขบ้า และมีอาการคันหูเล็กน้อย',
        duration: '2 วันที่ผ่านมา',
        appetite: 'ปกติ (Good Appetite)',
        notes: 'เจ้าของแจ้งว่าสุนัขชอบสะบัดหัวหลังจากพาไปว่ายน้ำ'
      },
      objective: {
        vitals: { temp: 38.6, heart_rate: 110, resp_rate: 24, weight: 29.4, crt: '< 2s', bcs: '5/9' },
        system_reviews: {
          eyes_ears: 'ABNORMAL (พบคราบขี้หูสีน้ำตาลในช่องหู)',
          respiratory: 'NORMAL',
          cardiovascular: 'NORMAL',
          digestive: 'NORMAL',
          skin_hair: 'NORMAL',
          lymph_nodes: 'NORMAL'
        },
        findings: 'ตรวจช่องหูพบขี้หูสีน้ำตาลเล็กน้อย เยื่อเมือกช่องปากสีชมพูดี ฟังปอดและหัวใจปกติ ต่อมน้ำเหลืองปกติ'
      },
      assessment: {
        primary_diagnosis: 'ตรวจสุขภาพประจำปี และหูชั้นนอกอักเสบระดับเล็กน้อย (Mild Otitis Externa)',
        diagnosis_code: 'DG-002',
        differential: 'ไรในหู หรือ แพ้ละอองหญ้า'
      },
      plan: {
        summary: 'ทำความสะอาดช่องหู ฉีดวัคซีนป้องกันโรคพิษสุนัขบ้า และจ่ายยาหยอดหู',
        prescriptions: [
          { name: 'Dexoryl Ear Drops (10g)', dose: 'หยอด 3-4 หยด', route: 'หยอดหู ซ้าย-ขวา', freq: 'วันละ 2 ครั้ง เช้า-เย็น', qty: '1 ขวด', price: 240 },
          { name: 'Rabisin (วัคซีนป้องกันโรคพิษสุนัขบ้า)', dose: '1 dose (1 ml)', route: 'ฉีดใต้ผิวหนัง', freq: 'ปีละ 1 ครั้ง', qty: '1 เข็ม', price: 150 }
        ],
        diagnostic_orders: ['Ear Swab Cytology'],
        homecare: 'ระวังไม่ให้น้ำเข้าหูเวลาอาบน้ำ และหยอดยาให้ครบ 7 วันตามกำหนด',
        follow_up: 'นัดตรวจซ้ำ 7 วันหากยังคัน'
      },
      sign_off: {
        doctor_name: 'น.สพ. วุฒิชัย เจริญสุข',
        license_number: 'วพ.9824',
        signed_at: '2026-03-02 10:15'
      }
    },
    {
      id: 2,
      encounter_number: 'ENC-2026-0002',
      pet_id: 4, // Cheesecake
      customer_id: 1,
      encounter_date: '2026-02-15',
      encounter_type: 'FOLLOW_UP',
      doctor_id: 2,
      room_id: 2,
      status: 'COMPLETED',
      started_at: '2026-02-15T11:15:00+07:00',
      closed_at: '2026-02-15T11:45:00+07:00',
      subjective: {
        chief_complaint: 'นัดตรวจติดตามค่าไต (Follow-up CKD Stage 1)',
        duration: 'เรื้อรัง 4 เดือน',
        appetite: 'กินอาหารโรคไตได้ดี ดื่มน้ำบ่อยขึ้นเล็กน้อย',
        notes: 'ขับถ่ายปกติ ไม่มีอาเจียน'
      },
      objective: {
        vitals: { temp: 38.2, heart_rate: 160, resp_rate: 28, weight: 4.6, crt: '< 2s', bcs: '4/9' },
        system_reviews: {
          eyes_ears: 'NORMAL',
          respiratory: 'NORMAL',
          cardiovascular: 'NORMAL',
          digestive: 'NORMAL',
          skin_hair: 'NORMAL',
          lymph_nodes: 'NORMAL'
        },
        findings: 'คลำไตทั้งสองข้างไม่พบบวมโต น้ำหนักคงที่ เยื่อเมือกชมพู ความชุ่มชื้นปกติ'
      },
      assessment: {
        primary_diagnosis: 'โรคไตวายเรื้อรังระยะควบคุมได้ (CKD Stage 1 - Stable)',
        diagnosis_code: 'DG-004',
        differential: '-'
      },
      plan: {
        summary: 'ตรวจเลือดเช็คค่า BUN/Creatinine และให้สารเสริมชะลอโรคไต',
        prescriptions: [
          { name: 'Renal Diet Paste & Phosphate Binder (50g)', dose: 'ป้อน 2 ซีซี', route: 'ป้อนกินพร้อมอาหาร', freq: 'วันละ 2 ครั้ง', qty: '2 หลอด', price: 450 }
        ],
        diagnostic_orders: ['Blood Chemistry (BUN, Creatinine, SDMA)'],
        homecare: 'ป้อนเจลบำรุงไตสม่ำเสมอ เตรียมน้ำสะอาดให้เพียงพอ',
        follow_up: 'นัดเช็คเลือดอีก 1 เดือน'
      },
      sign_off: {
        doctor_name: 'สพ.ญ. ศศิธร สุวรรณมาลี',
        license_number: 'วพ.10452',
        signed_at: '2026-02-15 11:45'
      }
    },
    {
      id: 3,
      encounter_number: 'ENC-2026-0003',
      pet_id: 3, // Lucky
      customer_id: 3,
      encounter_date: '2026-02-18',
      encounter_type: 'GENERAL',
      doctor_id: 1,
      room_id: 1,
      status: 'COMPLETED',
      started_at: '2026-02-18T14:00:00+07:00',
      closed_at: '2026-02-18T14:30:00+07:00',
      subjective: {
        chief_complaint: 'คันผิวหนัง เกาพุงและอุ้งเท้าจนแดง',
        duration: '1 สัปดาห์',
        appetite: 'ปกติ',
        notes: 'สงสัยแอบกินอาหารของสัตว์ตัวอื่นที่มีโปรตีนไก่'
      },
      objective: {
        vitals: { temp: 38.8, heart_rate: 120, resp_rate: 26, weight: 10.2, crt: '< 2s', bcs: '5/9' },
        system_reviews: {
          eyes_ears: 'NORMAL',
          respiratory: 'NORMAL',
          cardiovascular: 'NORMAL',
          digestive: 'NORMAL',
          skin_hair: 'ABNORMAL (ผื่นแดงและสะเก็ดแผลบริเวณขาหนีบ)',
          lymph_nodes: 'NORMAL'
        },
        findings: 'พบผื่น Erythema บริเวณขาหนีบและซอกนิ้วเท้า มีรอยสะเก็ดแผลจากการเกา'
      },
      assessment: {
        primary_diagnosis: 'ภูมิแพ้ผิวหนังกำเริบ (Acute Flare of Atopic Dermatitis)',
        diagnosis_code: 'DG-003',
        differential: 'การติดเชื้อยีสต์แทรกซ้อน (Malassezia)'
      },
      plan: {
        summary: 'ให้แชมพูยาลดการติดเชื้อ และยาปฏิชีวนะคุมการติดเชื้อแบคทีเรียแทรกซ้อน',
        prescriptions: [
          { name: 'Ketoconazole/Chlorhexidine Medicated Shampoo', dose: 'ฟอกทิ้งไว้ 10 นาที', route: 'อาบน้ำ', freq: 'สัปดาห์ละ 2 ครั้ง', qty: '1 ขวด', price: 320 },
          { name: 'Amoxicillin + Clavulanate (Clavamox 250mg)', dose: '1 เม็ด', route: 'กินหลังอาหาร', freq: 'วันละ 2 ครั้ง', qty: '14 เม็ด', price: 25 }
        ],
        diagnostic_orders: ['Skin Scraping & Tape Impression'],
        homecare: 'ฟอกแชมพูยาต่อเนื่อง ระวังอย่าให้เกาจนแผลติดเชื้อเพิ่ม',
        follow_up: 'นัดตรวจซ้ำใน 2 สัปดาห์'
      },
      sign_off: {
        doctor_name: 'น.สพ. วุฒิชัย เจริญสุข',
        license_number: 'วพ.9824',
        signed_at: '2026-02-18 14:30'
      }
    }
  ]
});
