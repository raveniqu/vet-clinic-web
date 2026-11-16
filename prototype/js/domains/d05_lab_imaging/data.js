/**
 * ============================================================================
 * DOMAIN 05: LABORATORY & DIAGNOSTIC IMAGING MANAGEMENT - DATA ENGINE
 * ============================================================================
 * Architectural Alignment:
 * - docs/BusinessDomain/05.Laboratory_and_Diagnostic_Imaging_Management.md
 * - docs/Database/Physical_Database_Design.md (Schema laboratory.*)
 * ============================================================================
 */

Object.assign(state, {
  // Navigation & Sub-Tab State
  activeLabSubTab: 'orders', // 'orders' | 'specimens' | 'imaging' | 'equipment_qc' | 'trends'
  activeLabSubFilter: 'all', // 'all' | 'lab' | 'imaging'
  activeXrayStudyId: 1,
  activeXrayView: 'vd', // 'vd' | 'lateral'
  isXrayInverted: false,
  isXrayZoomed: false,
  activeTrendPetId: 1, // Default Brownie

  // --- 1. DIAGNOSTIC CATALOGS (Table: laboratory.diagnostic_catalogs) ---
  diagnosticCatalogs: [
    {
      id: 1,
      code: 'LAB-CBC-01',
      name: 'Complete Blood Count (CBC) with Automated Differential',
      category: 'LAB',
      specimen_type: 'Whole Blood (หลอด EDTA จุกม่วง 1.0-2.0 mL)',
      turnaround_time: '15-20 นาที',
      price: 450,
      equipment_code: 'EQ-HEM-01',
      description: 'ตรวจนับเม็ดเลือดแดง, เม็ดเลือดขาว, เกล็ดเลือด และคำนวณดัชนีเม็ดเลือด'
    },
    {
      id: 2,
      code: 'LAB-LVR-01',
      name: 'Liver Function Panel (ALT, AST, ALP, TBil)',
      category: 'LAB',
      specimen_type: 'Clot Blood (หลอดแดง Serum 1.5-2.0 mL)',
      turnaround_time: '20-30 นาที',
      price: 650,
      equipment_code: 'EQ-CHM-01',
      description: 'ตรวจเอนไซม์ตับและสารบ่งชี้ภาวะท่อน้ำดีอุดตัน'
    },
    {
      id: 3,
      code: 'LAB-KID-01',
      name: 'Renal Function Panel (BUN, Creatinine, Electrolytes)',
      category: 'LAB',
      specimen_type: 'Clot Blood (หลอดแดง Serum 1.5-2.0 mL)',
      turnaround_time: '20-30 นาที',
      price: 550,
      equipment_code: 'EQ-CHM-01',
      description: 'ตรวจการทำงานของไตและคัดกรองภาวะของเสียคั่งในเลือด (Azotemia)'
    },
    {
      id: 4,
      code: 'LAB-URI-01',
      name: 'Routine Urinalysis & Microscopic Sediment',
      category: 'LAB',
      specimen_type: 'Urine (Sterile Cup 3.0-5.0 mL)',
      turnaround_time: '15 นาที',
      price: 300,
      equipment_code: 'EQ-MIC-01',
      description: 'ตรวจความถ่วงจำเพาะ ค่าเคมีในปัสสาวะ และตะกอนปัสสาวะหาผลึกนิ่ว/เม็ดเลือด'
    },
    {
      id: 5,
      code: 'LAB-CYT-01',
      name: 'Ear Swab Cytology & Diff-Quik Staining',
      category: 'LAB',
      specimen_type: 'Ear Exudate (Glass Slide 2 แผ่น)',
      turnaround_time: '15 นาที',
      price: 350,
      equipment_code: 'EQ-MIC-01',
      description: 'ย้อมสีเซลล์ขี้หูตรวจเชื้อยีสต์ Malassezia, แบคทีเรีย Cocci/Rods'
    },
    {
      id: 6,
      code: 'LAB-SNAP-01',
      name: 'Canine / Feline Viral Antigen Rapid Test (CPV/CCV/FPV)',
      category: 'LAB',
      specimen_type: 'Fecal Swab (Sterile Swab)',
      turnaround_time: '10 นาที',
      price: 500,
      equipment_code: 'IN-HOUSE-KIT',
      description: 'ชุดตรวจแอนติเจนไวรัสลำไส้อักเสบและไข้หัดแมวแบบรวดเร็ว'
    },
    {
      id: 7,
      code: 'IMG-XR-ABD',
      name: 'Digital X-Ray Abdomen (2 Views: VD & Lateral)',
      category: 'IMAGING',
      specimen_type: 'Non-Invasive High-Frequency DR Scan',
      turnaround_time: '15-30 นาที',
      price: 900,
      equipment_code: 'EQ-XR-01',
      description: 'ถ่ายภาพรังสีช่องท้อง 2 ท่าเพื่อตรวจสิ่งแปลกปลอม ก๊าซในทางเดินอาหาร และอวัยวะภายใน'
    },
    {
      id: 8,
      code: 'IMG-US-ABD',
      name: 'Abdominal Ultrasound Screening',
      category: 'IMAGING',
      specimen_type: 'Ultrasound Curved Array Probe Scan',
      turnaround_time: '30-45 นาที',
      price: 1200,
      equipment_code: 'EQ-US-01',
      description: 'ตรวจคลื่นเสียงความถี่สูงดูโครงสร้างเนื้อเยื่อตับ ไต ม้าม และผนังกระเพาะอาหาร'
    }
  ],

  // --- 2. SPECIES-SPECIFIC REFERENCE INTERVALS (Rule 9.3: Dogs vs Cats) ---
  speciesReferenceRanges: {
    DOG: {
      WBC: { low: 6.0, high: 17.0, unit: '10^3/uL', critical_low: 2.5, critical_high: 32.0 },
      RBC: { low: 5.5, high: 8.5, unit: '10^6/uL', critical_low: 3.0, critical_high: 11.0 },
      HGB: { low: 12.0, high: 18.0, unit: 'g/dL', critical_low: 6.0, critical_high: 22.0 },
      HCT: { low: 37.0, high: 55.0, unit: '%', critical_low: 15.0, critical_high: 65.0 },
      PLT: { low: 175, high: 500, unit: '10^3/uL', critical_low: 30, critical_high: 900 },
      BUN: { low: 9.0, high: 31.0, unit: 'mg/dL', critical_low: 3.0, critical_high: 100.0 },
      Creatinine: { low: 0.5, high: 1.5, unit: 'mg/dL', critical_low: 0.2, critical_high: 5.0 },
      ALT: { low: 10, high: 100, unit: 'U/L', critical_low: 5, critical_high: 600 },
      ALP: { low: 23, high: 212, unit: 'U/L', critical_low: 10, critical_high: 1200 },
      Glucose: { low: 70, high: 143, unit: 'mg/dL', critical_low: 45, critical_high: 450 },
      Potassium: { low: 3.5, high: 5.8, unit: 'mmol/L', critical_low: 2.5, critical_high: 6.8 }
    },
    CAT: {
      WBC: { low: 5.5, high: 19.5, unit: '10^3/uL', critical_low: 2.0, critical_high: 35.0 },
      RBC: { low: 5.0, high: 10.0, unit: '10^6/uL', critical_low: 2.5, critical_high: 12.0 },
      HGB: { low: 8.0, high: 15.0, unit: 'g/dL', critical_low: 5.0, critical_high: 20.0 },
      HCT: { low: 24.0, high: 45.0, unit: '%', critical_low: 12.0, critical_high: 60.0 },
      PLT: { low: 150, high: 600, unit: '10^3/uL', critical_low: 25, critical_high: 1000 },
      BUN: { low: 16.0, high: 36.0, unit: 'mg/dL', critical_low: 5.0, critical_high: 120.0 },
      Creatinine: { low: 0.8, high: 2.4, unit: 'mg/dL', critical_low: 0.3, critical_high: 6.0 },
      ALT: { low: 12, high: 130, unit: 'U/L', critical_low: 5, critical_high: 700 },
      ALP: { low: 14, high: 111, unit: 'U/L', critical_low: 5, critical_high: 800 },
      Glucose: { low: 71, high: 159, unit: 'mg/dL', critical_low: 40, critical_high: 480 },
      Potassium: { low: 3.5, high: 5.5, unit: 'mmol/L', critical_low: 2.5, critical_high: 6.8 }
    }
  },

  // --- 3. LABORATORY EQUIPMENT (Table: laboratory.laboratory_equipment) ---
  laboratoryEquipment: [
    {
      id: 1,
      code: 'EQ-HEM-01',
      name: 'ProCyte Dx Automated Hematology Analyzer',
      serial_number: 'IDEXX-PC-98421',
      equipment_type: 'Automated Hematology (Laser Flow Cytometry & Optical Fluo)',
      status: 'OPERATIONAL', // 'OPERATIONAL' | 'MAINTENANCE' | 'CALIBRATING' | 'OUT_OF_SERVICE'
      manufacturer: 'IDEXX Laboratories',
      last_calibrated_at: '2026-03-01 08:30',
      next_calibration_due: '2026-04-01',
      daily_qc_status: 'PASS',
      location: 'ห้องปฏิบัติการกลาง (Central Lab Station 1)'
    },
    {
      id: 2,
      code: 'EQ-CHM-01',
      name: 'Catalyst One Veterinary Chemistry Analyzer',
      serial_number: 'IDEXX-CAT1-55219',
      equipment_type: 'Dry Slide Clinical Chemistry Analyzer',
      status: 'OPERATIONAL',
      manufacturer: 'IDEXX Laboratories',
      last_calibrated_at: '2026-03-01 08:45',
      next_calibration_due: '2026-04-01',
      daily_qc_status: 'PASS',
      location: 'ห้องปฏิบัติการกลาง (Central Lab Station 2)'
    },
    {
      id: 3,
      code: 'EQ-XR-01',
      name: 'DR-VET 400 Plus High-Frequency System',
      serial_number: 'DR-SYS-2025-081',
      equipment_type: 'Flat Panel Direct Digital Radiography (DR)',
      status: 'OPERATIONAL',
      manufacturer: 'Canon Medical Vet',
      last_calibrated_at: '2026-02-15 14:00',
      next_calibration_due: '2026-05-15',
      daily_qc_status: 'PASS',
      location: 'ห้องรังสีวินิจฉัย (X-Ray Suite B)'
    },
    {
      id: 4,
      code: 'EQ-US-01',
      name: 'Mindray Vetus 8 Veterinary Ultrasound System',
      serial_number: 'VETUS8-99201',
      equipment_type: 'High-Resolution Color Doppler Ultrasound',
      status: 'OPERATIONAL',
      manufacturer: 'Mindray Animal Care',
      last_calibrated_at: '2026-02-10 11:00',
      next_calibration_due: '2026-08-10',
      daily_qc_status: 'PASS',
      location: 'ห้องอัลตราซาวด์ (Ultrasound Suite)'
    },
    {
      id: 5,
      code: 'EQ-MIC-01',
      name: 'Olympus CX23 Clinical Microscope',
      serial_number: 'OLY-CX23-11029',
      equipment_type: 'Brightfield Binocular Microscope (4x, 10x, 40x, 100x Oil)',
      status: 'OPERATIONAL',
      manufacturer: 'Olympus Medical',
      last_calibrated_at: '2026-02-28 09:00',
      next_calibration_due: '2026-08-28',
      daily_qc_status: 'PASS',
      location: 'ห้องปฏิบัติการจุลทรรศน์ (Microscopy Station)'
    }
  ],

  // --- 4. QUALITY CONTROL RECORDS (Table: laboratory.quality_control_records) ---
  qualityControlRecords: [
    {
      id: 1,
      equipment_id: 1,
      equipment_code: 'EQ-HEM-01',
      control_type: 'e-CHECK (XS) Hematology Normal Level Control',
      lot_number: 'LOT-QC-HEM-202602',
      measured_value: 'WBC: 7.2 | RBC: 4.82 | PLT: 235',
      expected_value: 'WBC: 7.0±0.5 | RBC: 4.80±0.3 | PLT: 230±25',
      result_status: 'PASS', // 'PASS' | 'FAIL' | 'WARNING'
      checked_at: '02 มี.ค. 2026 08:15',
      checked_by: 'ทนพ. เอกชัย ภูมิใจ (ทนพ. 4521)',
      notes: 'ค่า QC อยู่ในช่วง ±1 SD ตามเกณฑ์มาตรฐาน Westgard Rules'
    },
    {
      id: 2,
      equipment_id: 2,
      equipment_code: 'EQ-CHM-01',
      control_type: 'Catalyst Lyphochek Assayed Chemistry Control Level 1',
      lot_number: 'LOT-QC-CHM-202601',
      measured_value: 'BUN: 19.8 | Creatinine: 1.22 | ALT: 48',
      expected_value: 'BUN: 20.0±2.0 | Creatinine: 1.20±0.15 | ALT: 50±8',
      result_status: 'PASS',
      checked_at: '02 มี.ค. 2026 08:25',
      checked_by: 'ทนพ. เอกชัย ภูมิใจ (ทนพ. 4521)',
      notes: 'การอ่านค่า Spectrophotometry ปกติ ไม่มีสัญญาณ Drift'
    },
    {
      id: 3,
      equipment_id: 1,
      equipment_code: 'EQ-HEM-01',
      control_type: 'e-CHECK (XS) Daily Background Calibration Count',
      lot_number: 'LOT-BLANK-001',
      measured_value: 'WBC: 0.0 | RBC: 0.00 | PLT: 0',
      expected_value: 'WBC < 0.1 | RBC < 0.02 | PLT < 10',
      result_status: 'PASS',
      checked_at: '01 มี.ค. 2026 08:10',
      checked_by: 'ทนพ. เอกชัย ภูมิใจ',
      notes: 'ไม่มีสัญญาณรบกวนใน Optical Chamber'
    },
    {
      id: 4,
      equipment_id: 2,
      equipment_code: 'EQ-CHM-01',
      control_type: 'Catalyst Lyphochek Assayed Chemistry Control Level 2',
      lot_number: 'LOT-QC-CHM-202601B',
      measured_value: 'BUN: 62.4 | Creatinine: 4.10 | ALT: 185',
      expected_value: 'BUN: 60.0±5.0 | Creatinine: 4.00±0.30 | ALT: 180±20',
      result_status: 'PASS',
      checked_at: '01 มี.ค. 2026 08:20',
      checked_by: 'ทนพ. เอกชัย ภูมิใจ',
      notes: 'High range calibration ผ่านเกณฑ์'
    }
  ],

  // --- 5. SPECIMENS & AUDIT EVENTS (Table: laboratory.specimens & specimen_events) ---
  specimens: [
    {
      id: 1,
      specimen_number: 'SPEC-2026-0001-A',
      order_id: 1,
      pet_id: 1,
      type: 'หลอด EDTA (จุกม่วง)',
      volume: '1.5 mL',
      collection_time: '02 มี.ค. 2026 10:15',
      collector: 'พว. กัลยา สุขใจ',
      accession_status: 'RECEIVED', // 'COLLECTED' | 'RECEIVED' | 'REJECTED'
      quality_inspection: { clotted: false, hemolyzed_grade: '0', lipemic_grade: '0' },
      rejection_reason: null,
      status: 'COMPLETED'
    },
    {
      id: 2,
      specimen_number: 'SPEC-2026-0001-B',
      order_id: 1,
      pet_id: 1,
      type: 'หลอด Clot Blood (จุกแดง)',
      volume: '2.0 mL',
      collection_time: '02 มี.ค. 2026 10:15',
      collector: 'พว. กัลยา สุขใจ',
      accession_status: 'RECEIVED',
      quality_inspection: { clotted: false, hemolyzed_grade: '1+ (Slight)', lipemic_grade: '0' },
      rejection_reason: null,
      status: 'COMPLETED'
    },
    {
      id: 3,
      specimen_number: 'SPEC-2026-0002-A',
      order_id: 2,
      pet_id: 2,
      type: 'สไลด์สเมียร์ขี้หู (Glass Slide)',
      volume: '2 แผ่น',
      collection_time: '02 มี.ค. 2026 09:30',
      collector: 'น.สพ. วุฒิชัย เกียรติสกุล',
      accession_status: 'RECEIVED',
      quality_inspection: { clotted: false, hemolyzed_grade: '0', lipemic_grade: '0' },
      rejection_reason: null,
      status: 'COMPLETED'
    },
    {
      id: 4,
      specimen_number: 'SPEC-2026-0003-A',
      order_id: 3,
      pet_id: 3,
      type: 'หลอด EDTA (จุกม่วง)',
      volume: '1.0 mL',
      collection_time: '02 มี.ค. 2026 10:50',
      collector: 'พว. สุภาพร นวมินทร์',
      accession_status: 'RECEIVED',
      quality_inspection: { clotted: false, hemolyzed_grade: '0', lipemic_grade: '0' },
      rejection_reason: null,
      status: 'PROCESSING'
    },
    {
      id: 5,
      specimen_number: 'SPEC-2026-0004-A',
      order_id: 4,
      pet_id: 2, // Taem (Cat)
      type: 'หลอด EDTA (จุกม่วง)',
      volume: '0.8 mL',
      collection_time: '02 มี.ค. 2026 11:10',
      collector: 'พว. สุภาพร นวมินทร์',
      accession_status: 'REJECTED',
      quality_inspection: { clotted: true, hemolyzed_grade: '0', lipemic_grade: '0' },
      rejection_reason: 'CLOTTED: เลือดแข็งตัวเป็นลิ่มขนาดเล็ก (Micro-clots) ในหลอด EDTA ไม่สามารถตรวจนับเม็ดเลือดได้ แจ้งเจาะซ้ำ (Redraw Required)',
      status: 'REJECTED'
    }
  ],

  specimenEvents: [
    { id: 1, specimen_id: 1, event_type: 'COLLECTED', event_at: '2026-03-02 10:15', performed_by: 'พว. กัลยา', notes: 'เจาะเลือดจากเส้น Cephalic vein สำเร็จ เรียบร้อยดี' },
    { id: 2, specimen_id: 1, event_type: 'RECEIVED', event_at: '2026-03-02 10:18', performed_by: 'ทนพ. เอกชัย', notes: 'ตรวจรับสิ่งส่งตรวจ ตัวอย่างสมบูรณ์ ไม่พบลิ่มเลือด' },
    { id: 3, specimen_id: 2, event_type: 'COLLECTED', event_at: '2026-03-02 10:15', performed_by: 'พว. กัลยา', notes: 'หลอด Clot blood ตั้งทิ้งไว้ 15 นาทีเพื่อแยกเซรั่ม' },
    { id: 4, specimen_id: 2, event_type: 'RECEIVED', event_at: '2026-03-02 10:18', performed_by: 'ทนพ. เอกชัย', notes: 'ตรวจรับสิ่งส่งตรวจ ปั่นเหวี่ยงเซรั่มใส' },
    { id: 5, specimen_id: 5, event_type: 'COLLECTED', event_at: '2026-03-02 11:10', performed_by: 'พว. สุภาพร', notes: 'เจาะเลือดแมวแต้มจาก Medial saphenous vein' },
    { id: 6, specimen_id: 5, event_type: 'REJECTED', event_at: '2026-03-02 11:15', performed_by: 'ทนพ. เอกชัย', notes: 'ปฏิเสธตัวอย่าง: พบ Micro-clot ติดปลายหลอด ทดสอบ inverted tube ไม่ผ่าน' }
  ],

  // --- 6. DIAGNOSTIC ORDERS (Table: laboratory.diagnostic_orders) ---
  diagnosticOrders: [
    {
      id: 1,
      order_number: 'ORD-2026-0001',
      encounter_id: 1,
      pet_id: 1, // Brownie (Dog)
      customer_id: 1, // Somsak
      doctor_id: 1, // Dr. Wuttichai
      order_date: '2026-03-02 10:10',
      test_category: 'ALL',
      items: [
        { code: 'LAB-CBC-01', name: 'Complete Blood Count (CBC)', type: 'LAB' },
        { code: 'LAB-KID-01', name: 'Renal Function Panel (BUN, Creatinine)', type: 'LAB' },
        { code: 'IMG-XR-ABD', name: 'Digital X-Ray Abdomen (2 Views)', type: 'IMAGING' }
      ],
      clinical_indication: 'สุนัขอาเจียนซ้ำ 2 ครั้ง ซึม มีไข้ สงสัยกระเพาะอักเสบเฉียบพลันหรือสิ่งแปลกปลอมในทางเดินอาหาร',
      urgency: 'STAT',
      status: 'PENDING_VERIFY',
      specimen_ids: [1, 2],
      verified_by: null,
      verified_at: null,
      has_critical_flag: true,
      critical_details: 'WBC 21.8 x10^3/uL (Severe Leukocytosis with Band Neutrophilia)'
    },
    {
      id: 2,
      order_number: 'ORD-2026-0002',
      encounter_id: 2,
      pet_id: 2, // Taem (Cat)
      customer_id: 2, // Maneerat
      doctor_id: 1,
      order_date: '2026-03-02 09:20',
      test_category: 'LAB',
      items: [
        { code: 'LAB-CYT-01', name: 'Ear Swab Cytology', type: 'LAB' }
      ],
      clinical_indication: 'เกาหูบ่อย สะบัดหัว มีขี้หูสีน้ำตาลเข้ม ย้อมตรวจเชื้อยีสต์และแบคทีเรีย',
      urgency: 'ROUTINE',
      status: 'VERIFIED',
      specimen_ids: [3],
      verified_by: 'น.สพ. วุฒิชัย เกียรติสกุล',
      verified_at: '02 มี.ค. 2026 09:50',
      has_critical_flag: false,
      critical_details: null
    },
    {
      id: 3,
      order_number: 'ORD-2026-0003',
      encounter_id: 3,
      pet_id: 3, // Moji (Dog)
      customer_id: 3, // Anan
      doctor_id: 2,
      order_date: '2026-03-02 10:45',
      test_category: 'LAB',
      items: [
        { code: 'LAB-CBC-01', name: 'Complete Blood Count (CBC)', type: 'LAB' },
        { code: 'LAB-LVR-01', name: 'Liver Function Panel', type: 'LAB' }
      ],
      clinical_indication: 'ตรวจสุขภาพก่อนฉีดวัคซีนประจำปี และประเมินก่อนวางยาสลบทำหมัน',
      urgency: 'ROUTINE',
      status: 'PROCESSING',
      specimen_ids: [4],
      verified_by: null,
      verified_at: null,
      has_critical_flag: false,
      critical_details: null
    },
    {
      id: 4,
      order_number: 'ORD-2026-0004',
      encounter_id: 2,
      pet_id: 2, // Taem (Cat)
      customer_id: 2,
      doctor_id: 1,
      order_date: '2026-03-02 11:05',
      test_category: 'LAB',
      items: [
        { code: 'LAB-CBC-01', name: 'Complete Blood Count (CBC)', type: 'LAB' }
      ],
      clinical_indication: 'ตรวจคัดกรองโลหิตจางก่อนวางยาทำหมัน (สิ่งส่งตรวจมีปัญหาลิ่มเลือด รอเจาะซ้ำ)',
      urgency: 'ROUTINE',
      status: 'SPECIMEN_REJECTED',
      specimen_ids: [5],
      verified_by: null,
      verified_at: null,
      has_critical_flag: false,
      critical_details: 'สิ่งส่งตรวจไม่ผ่านเกณฑ์คุณภาพ (Clotted Blood)'
    }
  ],

  // --- 7. LABORATORY RESULTS & PARAMETERS (Table: laboratory.laboratory_results & values) ---
  labResults: [
    {
      id: 1,
      order_id: 1,
      pet_id: 1,
      species: 'DOG',
      test_code: 'LAB-CBC-01',
      test_name: 'Complete Blood Count (CBC)',
      instrument: 'ProCyte Dx Automated Hematology Analyzer',
      analyzed_at: '02 มี.ค. 2026 10:35',
      technician: 'ทนพ. เอกชัย ภูมิใจ (ทนพ. 4521)',
      parameters: [
        { name: 'WBC (เม็ดเลือดขาว)', value: 21.8, unit: '10^3/uL', ref_low: 6.0, ref_high: 17.0, flag: 'HIGH', is_panic: true, percent_pos: 92, note: 'เม็ดเลือดขาวสูงมาก (Leukocytosis) สอดคล้องกับภาวะอักเสบติดเชื้อเฉียบพลัน' },
        { name: 'RBC (เม็ดเลือดแดง)', value: 6.85, unit: '10^6/uL', ref_low: 5.5, ref_high: 8.5, flag: 'NORMAL', is_panic: false, percent_pos: 45, note: 'ปกติ ไม่พบภาวะโลหิตจาง' },
        { name: 'Hgb (ฮีโมโกลบิน)', value: 15.4, unit: 'g/dL', ref_low: 12.0, ref_high: 18.0, flag: 'NORMAL', is_panic: false, percent_pos: 56, note: 'ปกติ' },
        { name: 'HCT (ฮีมาโตคริต)', value: 46.2, unit: '%', ref_low: 37.0, ref_high: 55.0, flag: 'NORMAL', is_panic: false, percent_pos: 51, note: 'ปกติ' },
        { name: 'PLT (เกล็ดเลือด)', value: 168, unit: '10^3/uL', ref_low: 175, ref_high: 500, flag: 'LOW', is_panic: false, percent_pos: 15, note: 'เกล็ดเลือดต่ำกว่าเกณฑ์เล็กน้อย ควรระวังการแข็งตัวของเลือด' },
        { name: 'Neutrophils', value: 84, unit: '%', ref_low: 60, ref_high: 77, flag: 'HIGH', is_panic: false, percent_pos: 88, note: 'Segmented Neutrophils เด่นชัด' },
        { name: 'Lymphocytes', value: 11, unit: '%', ref_low: 12, ref_high: 30, flag: 'LOW', is_panic: false, percent_pos: 12, note: 'Lymphopenia จาก Stress Response' }
      ]
    },
    {
      id: 2,
      order_id: 1,
      pet_id: 1,
      species: 'DOG',
      test_code: 'LAB-KID-01',
      test_name: 'Renal Function Panel (ค่าการทำงานของไต)',
      instrument: 'Catalyst One Veterinary Chemistry Analyzer',
      analyzed_at: '02 มี.ค. 2026 10:42',
      technician: 'ทนพ. เอกชัย ภูมิใจ (ทนพ. 4521)',
      parameters: [
        { name: 'BUN (Blood Urea Nitrogen)', value: 24.5, unit: 'mg/dL', ref_low: 9.0, ref_high: 31.0, flag: 'NORMAL', is_panic: false, percent_pos: 70, note: 'ปกติ ไตยังสามารถกำจัดของเสียได้ดี' },
        { name: 'Creatinine', value: 1.15, unit: 'mg/dL', ref_low: 0.5, ref_high: 1.5, flag: 'NORMAL', is_panic: false, percent_pos: 65, note: 'ปกติ ไม่พบภาวะไตวายเฉียบพลันหรือ Azotemia' },
        { name: 'Potassium (K+)', value: 4.6, unit: 'mmol/L', ref_low: 3.5, ref_high: 5.8, flag: 'NORMAL', is_panic: false, percent_pos: 48, note: 'เกลือแร่โพแทสเซียมในระดับปกติ' }
      ]
    },
    {
      id: 3,
      order_id: 2,
      pet_id: 2,
      species: 'CAT',
      test_code: 'LAB-CYT-01',
      test_name: 'Ear Swab Cytology (ตรวจย้อมเซลล์ในรูหู)',
      instrument: 'Brightfield Microscope 100x Oil Immersion',
      analyzed_at: '02 มี.ค. 2026 09:45',
      technician: 'น.สพ. วุฒิชัย เกียรติสกุล',
      parameters: [
        { name: 'Malassezia pachydermatis', value: '4+ (Very Heavy)', unit: 'Grade (0 to 4+)', ref_low: 'Rare', ref_high: '1+', flag: 'HIGH', is_panic: false, percent_pos: 98, note: 'พบเชื้อยีสต์รูปถั่วลิสงหนาแน่นมากทั่วทุกฟิลด์' },
        { name: 'Bacteria (Cocci)', value: '1+ (Few)', unit: 'Grade (0 to 4+)', ref_low: 'Rare', ref_high: '1+', flag: 'NORMAL', is_panic: false, percent_pos: 25, note: 'พบเชื้อแบคทีเรียรูปกลมประปราย' },
        { name: 'Degenerated Neutrophils', value: '2+ (Moderate)', unit: 'Grade (0 to 4+)', ref_low: 'None', ref_high: '1+', flag: 'HIGH', is_panic: false, percent_pos: 80, note: 'มีเซลล์อักเสบตอบสนองการติดเชื้อ' }
      ]
    }
  ],

  // --- 8. IMAGING STUDIES (Table: laboratory.imaging_studies, medical_images, imaging_reports) ---
  imagingStudies: [
    {
      id: 1,
      order_id: 1,
      study_number: 'IMG-XR-2026-0001',
      pet_id: 1,
      study_type: 'Digital X-Ray Abdomen (2 Views: VD/Lateral)',
      modality: 'DX (Digital Radiography)',
      equipment: 'DR-VET 400 Plus High-Frequency System',
      views: {
        vd: {
          title: 'Ventrodorsal (VD) View',
          image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1000&auto=format&fit=crop&q=80',
          exposure: 'kVp: 68 | mA: 150 | Exp: 0.08s | SID: 100 cm',
          technique: 'Deep inspiration, collimated from diaphragm to pelvic inlet'
        },
        lateral: {
          title: 'Right Lateral View',
          image_url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1000&auto=format&fit=crop&q=80',
          exposure: 'kVp: 66 | mA: 150 | Exp: 0.06s | SID: 100 cm',
          technique: 'Right lateral recumbency, forelimbs cranial, hindlimbs caudal'
        }
      },
      findings: '- กระเพาะอาหารขยายตัวปานกลาง มีก๊าซและของเหลวคั่งค้าง (Moderate gastric fluid & gas distension)\n- ลำไส้เล็กส่วนต้นมีก๊าซเล็กน้อย ไม่พบการอุดตันแบบ Mechanical Ileus\n- เงาตับ ม้าม และไต ทั้งสองข้างขนาดปกติ ขอบเขตเรียบ\n- ไม่พบสิ่งแปลกปลอมที่มีความทึบรังสีผิดปกติ (No radio-opaque foreign body seen)',
      impression: 'สอดคล้องกับภาวะกระเพาะและลำไส้อักเสบเฉียบพลัน (Acute Gastroenteritis) ไม่พบภาวะกระเพาะบิดหมุน (GDV) หรือสิ่งแปลกปลอมอุดตันที่ทึบรังสี',
      recommendation: 'ให้ยาลดการอักเสบและแก้อาเจียน ติดตามอาการใกล้ชิด หาก 24 ชม. ไม่ดีขึ้น แนะนำทำ Ultrasound หรือ Contrast Study เพิ่มเติม',
      radiologist: 'สพ.ญ. ศศิธร สุขสมบูรณ์ (วท.บ., สพ.บ.)',
      performed_at: '02 มี.ค. 2026 10:25',
      status: 'VERIFIED'
    }
  ],

  // --- 9. LONGITUDINAL LAB TRENDS (Capability 3.18: Diagnostic History Management) ---
  longitudinalLabHistory: [
    {
      pet_id: 1, // Brownie
      records: [
        { date: '15 ม.ค. 2026', encounter: 'ENC-2026-0001 (วัคซีนประจำปี)', WBC: 11.2, RBC: 6.90, HCT: 45.0, PLT: 280, BUN: 18.0, Creatinine: 1.05, ALT: 35 },
        { date: '10 ก.พ. 2026', encounter: 'ENC-2026-0034 (ตรวจติดตาม)', WBC: 13.5, RBC: 6.80, HCT: 44.5, PLT: 245, BUN: 20.2, Creatinine: 1.10, ALT: 42 },
        { date: '02 มี.ค. 2026', encounter: 'ENC-2026-0089 (ป่วยอาเจียน/ไข้)', WBC: 21.8, RBC: 6.85, HCT: 46.2, PLT: 168, BUN: 24.5, Creatinine: 1.15, ALT: 56 }
      ]
    },
    {
      pet_id: 2, // Taem
      records: [
        { date: '20 ธ.ค. 2025', encounter: 'ENC-2025-0912 (ตรวจสุขภาพ)', WBC: 9.8, RBC: 7.20, HCT: 32.0, PLT: 310, BUN: 22.0, Creatinine: 1.30, ALT: 45 },
        { date: '02 มี.ค. 2026', encounter: 'ENC-2026-0002 (คันหู/สเมียร์)', WBC: 10.4, RBC: 7.15, HCT: 33.2, PLT: 295, BUN: 23.5, Creatinine: 1.35, ALT: 48 }
      ]
    }
  ]
});
