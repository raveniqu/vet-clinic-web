Object.assign(state, {
  // Master Catalogs for Domain 01
  speciesCatalog: [
    { id: 1, code: 'CANINE', name: 'สุนัข' },
    { id: 2, code: 'FELINE', name: 'แมว' },
    { id: 3, code: 'LAGOMORPH', name: 'กระต่าย' },
    { id: 4, code: 'EXOTIC', name: 'สัตว์พิเศษ (Exotic)' }
  ],

  breedCatalog: [
    { id: 1, species_id: 1, name: 'โกลเด้น รีทรีฟเวอร์' },
    { id: 2, species_id: 1, name: 'ชิบะ อินุ' },
    { id: 3, species_id: 1, name: 'ไทยบางแก้ว' },
    { id: 4, species_id: 1, name: 'ไซบีเรียน ฮัสกี้' },
    { id: 5, species_id: 1, name: 'พุดเดิ้ล ทอย' },
    { id: 6, species_id: 1, name: 'เฟรนช์ บูลด็อก' },
    { id: 7, species_id: 1, name: 'ปอมเมอเรเนียน' },
    { id: 8, species_id: 1, name: 'พันธุ์ทาง / ผสม (Mix)' },
    { id: 9, species_id: 2, name: 'สก็อตติช โฟลด์' },
    { id: 10, species_id: 2, name: 'บริติช ชอร์ตแฮร์' },
    { id: 11, species_id: 2, name: 'เปอร์เซีย' },
    { id: 12, species_id: 2, name: 'วิเชียรมาศ (Siamese)' },
    { id: 13, species_id: 2, name: 'อเมริกัน ชอร์ตแฮร์' },
    { id: 14, species_id: 2, name: 'แมวไทย / ผสม (Domestic)' },
    { id: 15, species_id: 3, name: 'ฮอลแลนด์ ลอป' },
    { id: 16, species_id: 3, name: 'เนเธอร์แลนด์ ดวอร์ฟ' },
    { id: 17, species_id: 4, name: 'ชูการ์ไกลเดอร์' },
    { id: 18, species_id: 4, name: 'เม่นแคระ' }
  ],

  // customer.customers (Domain 01 - DB Aligned)
  customers: [
    {
      id: 1,
      customer_code: 'CUS-2026-0001',
      customer_type: 'INDIVIDUAL',
      prefix: 'คุณ',
      first_name: 'วิภาดา',
      last_name: 'ศรีสุวรรณ',
      display_name: 'คุณวิภาดา (แพท)',
      tax_id: '1100500889211',
      date_of_birth: '1992-05-18',
      gender: 'หญิง',
      phone_primary: '089-123-4567',
      phone_secondary: '02-712-3456',
      email: 'vipada.s@gmail.com',
      line_id: '@vipada_pat',
      address_line: '88/12 ซอยทองหล่อ 13 ถ.สุขุมวิท 55',
      subdistrict: 'คลองตันเหนือ',
      district: 'วัฒนา',
      province: 'กรุงเทพมหานคร',
      postal_code: '10110',
      branch_id: 1,
      referral_source: 'เพื่อนแนะนำ',
      status: 'ACTIVE',
      registered_at: '2026-01-15',
      preferences: {
        preferred_channel: 'LINE',
        preferred_time: '13:00 - 17:00 (ช่วงบ่าย)',
        language: 'TH'
      },
      documents: [
        { id: 1, document_type: 'ID_CARD', file_name: 'สำเนาบัตรประชาชน_วิภาดา.pdf', uploaded_at: '2026-01-15 09:35' }
      ],
      consents: {
        privacy_policy: { granted: true, updated_at: '2026-01-15 09:30', version: 'v1.2' },
        service_reminders: { granted: true, updated_at: '2026-01-15 09:30', version: 'v1.2' },
        marketing_promo: { granted: true, updated_at: '2026-01-15 09:30', version: 'v1.2' },
        media_pr: { granted: true, updated_at: '2026-01-15 09:30', version: 'v1.2' },
        insurance_sharing: { granted: true, updated_at: '2026-01-15 09:30', version: 'v1.2' }
      },
      consent_history: [
        { purpose: 'privacy_policy', action: 'GRANTED', timestamp: '2026-01-15 09:30', channel: 'COUNTER' },
        { purpose: 'service_reminders', action: 'GRANTED', timestamp: '2026-01-15 09:30', channel: 'COUNTER' },
        { purpose: 'marketing_promo', action: 'GRANTED', timestamp: '2026-01-15 09:30', channel: 'COUNTER' },
        { purpose: 'media_pr', action: 'GRANTED', timestamp: '2026-01-15 09:30', channel: 'COUNTER' }
      ]
    },
    {
      id: 2,
      customer_code: 'CUS-2026-0002',
      customer_type: 'INDIVIDUAL',
      prefix: 'คุณ',
      first_name: 'ชนาธิป',
      last_name: 'วัฒนประสิทธิ์',
      display_name: 'คุณชนาธิป (บอล)',
      tax_id: '3101200445678',
      date_of_birth: '1989-11-24',
      gender: 'ชาย',
      phone_primary: '081-987-6543',
      phone_secondary: '',
      email: 'chanathip.w@hotmail.com',
      line_id: 'ball_chanathip',
      address_line: '45/9 สุขุมวิท 71 แขวงพระโขนงเหนือ',
      subdistrict: 'พระโขนงเหนือ',
      district: 'วัฒนา',
      province: 'กรุงเทพมหานคร',
      postal_code: '10110',
      branch_id: 1,
      referral_source: 'Facebook / สื่อออนไลน์',
      status: 'ACTIVE',
      registered_at: '2026-02-01',
      consents: {
        privacy_policy: { granted: true, updated_at: '2026-02-01 10:15', version: 'v1.2' },
        service_reminders: { granted: true, updated_at: '2026-02-01 10:15', version: 'v1.2' },
        marketing_promo: { granted: false, updated_at: '2026-02-01 10:15', version: 'v1.2' },
        media_pr: { granted: false, updated_at: null, version: 'v1.2' },
        insurance_sharing: { granted: true, updated_at: '2026-02-01 10:15', version: 'v1.2' }
      },
      consent_history: [
        { purpose: 'privacy_policy', action: 'GRANTED', timestamp: '2026-02-01 10:15', channel: 'COUNTER' },
        { purpose: 'service_reminders', action: 'GRANTED', timestamp: '2026-02-01 10:15', channel: 'COUNTER' }
      ]
    },
    {
      id: 3,
      customer_code: 'CUS-2026-0003',
      customer_type: 'INDIVIDUAL',
      prefix: 'คุณ',
      first_name: 'กมลชนก',
      last_name: 'เดชดำรงค์',
      display_name: 'คุณกมลชนก (แนท)',
      tax_id: '1103700998124',
      date_of_birth: '1995-03-30',
      gender: 'หญิง',
      phone_primary: '095-444-8899',
      phone_secondary: '086-333-2211',
      email: 'nat.kamon@yahoo.com',
      line_id: '@nat_kamon',
      address_line: '120/4 หมู่บ้านสุขใจ ซอยปรีดี พนมยงค์ 26',
      subdistrict: 'คลองตันเหนือ',
      district: 'วัฒนา',
      province: 'กรุงเทพมหานคร',
      postal_code: '10110',
      branch_id: 1,
      referral_source: 'Walk-in หน้าร้าน',
      status: 'ACTIVE',
      registered_at: '2026-02-18',
      consents: {
        privacy_policy: { granted: true, updated_at: '2026-02-18 14:20', version: 'v1.2' },
        service_reminders: { granted: true, updated_at: '2026-02-18 14:20', version: 'v1.2' },
        marketing_promo: { granted: true, updated_at: '2026-02-18 14:20', version: 'v1.2' },
        media_pr: { granted: true, updated_at: '2026-02-18 14:20', version: 'v1.2' },
        insurance_sharing: { granted: false, updated_at: null, version: 'v1.2' }
      },
      consent_history: [
        { purpose: 'privacy_policy', action: 'GRANTED', timestamp: '2026-02-18 14:20', channel: 'COUNTER' },
        { purpose: 'service_reminders', action: 'GRANTED', timestamp: '2026-02-18 14:20', channel: 'COUNTER' },
        { purpose: 'marketing_promo', action: 'GRANTED', timestamp: '2026-02-18 14:20', channel: 'COUNTER' },
        { purpose: 'media_pr', action: 'GRANTED', timestamp: '2026-02-18 14:20', channel: 'COUNTER' }
      ]
    },
    {
      id: 4,
      customer_code: 'CUS-2026-0004',
      customer_type: 'JURISTIC',
      prefix: '',
      first_name: 'มูลนิธิเพื่อนสัตว์ไทย',
      last_name: '',
      display_name: 'มูลนิธิเพื่อนสัตว์ไทย (สำนักงานใหญ่)',
      tax_id: '0994000123987',
      date_of_birth: '',
      gender: 'นิติบุคคล',
      phone_primary: '02-391-9999',
      phone_secondary: '084-555-6677',
      email: 'contact@thaianimalfoundation.org',
      line_id: '@thaianimal_org',
      address_line: '302 ถ.เอกมัย แขวงคลองตันเหนือ',
      subdistrict: 'คลองตันเหนือ',
      district: 'วัฒนา',
      province: 'กรุงเทพมหานคร',
      postal_code: '10110',
      branch_id: 1,
      referral_source: 'องค์กรพันธมิตร',
      status: 'ACTIVE',
      registered_at: '2026-03-02',
      consents: {
        privacy_policy: { granted: true, updated_at: '2026-03-02 08:30', version: 'v1.2' },
        service_reminders: { granted: true, updated_at: '2026-03-02 08:30', version: 'v1.2' },
        marketing_promo: { granted: false, updated_at: null, version: 'v1.2' },
        media_pr: { granted: true, updated_at: '2026-03-02 08:30', version: 'v1.2' },
        insurance_sharing: { granted: true, updated_at: '2026-03-02 08:30', version: 'v1.2' }
      },
      consent_history: [
        { purpose: 'privacy_policy', action: 'GRANTED', timestamp: '2026-03-02 08:30', channel: 'COUNTER' },
        { purpose: 'service_reminders', action: 'GRANTED', timestamp: '2026-03-02 08:30', channel: 'COUNTER' },
        { purpose: 'media_pr', action: 'GRANTED', timestamp: '2026-03-02 08:30', channel: 'COUNTER' }
      ]
    }
  ],

  // customer.pets (Domain 01 - DB Aligned)
  pets: [
    {
      id: 1,
      pet_code: 'PET-2026-0001',
      pet_name: 'บราวนี่ (Brownie)',
      species_id: 1,
      species: 'สุนัข',
      breed_id: 1,
      breed: 'โกลเด้น รีทรีฟเวอร์',
      sex: 'ผู้ (Male)',
      reproductive_status: 'ทำหมันแล้ว (Neutered)',
      birth_date: '2023-05-12',
      birth_date_is_estimated: false,
      color: 'น้ำตาลทอง',
      microchip_number: '900215002938101',
      current_weight: 29.4,
      weights_history: [
        { date: '2025-11-10', weight: 28.5, measured_by: 'ผู้ช่วยอรุณ' },
        { date: '2026-01-15', weight: 29.0, measured_by: 'ผู้ช่วยอรุณ' },
        { date: '2026-03-02', weight: 29.4, measured_by: 'น.สพ. วุฒิชัย' }
      ],
      allergies: ['แพ้ยาปฏิชีวนะกลุ่ม Enrofloxacin (มีอาการผื่นลมพิษและบวม)'],
      allergies_detail: [
        {
          id: 1,
          allergen: 'Enrofloxacin (ยาปฏิชีวนะกลุ่ม Fluoroquinolone)',
          category: 'DRUG',
          severity: 'SEVERE',
          onset_date: '2024-08-10',
          status: 'CONFIRMED',
          diagnosed_by: 'น.สพ. วุฒิชัย เจริญสุข',
          notes: 'มีผื่นลมพิษ บวมรอบตาและปากเฉียบพลันหลังได้รับยา ห้ามใช้ยากลุ่ม Fluoroquinolones เด็ดขาด'
        }
      ],
      chronic_conditions: ['ข้อสะโพกเสื่อมระดับเริ่มต้น (Mild Hip Dysplasia)'],
      chronic_conditions_detail: [
        {
          id: 1,
          condition_name: 'ข้อสะโพกเสื่อมระดับเริ่มต้น (Mild Hip Dysplasia)',
          category: 'ORTHOPEDIC',
          severity: 'MILD',
          diagnosed_date: '2025-02-14',
          status: 'MONITORING',
          diagnosed_by: 'น.สพ. วุฒิชัย เจริญสุข',
          notes: 'แนะนำงดกระโดด เสริมกลูโคซามีน/คอนดรอยติน และควบคุมน้ำหนักไม่ให้เกิน 30.0 กก.'
        }
      ],
      vaccinations: [
        {
          id: 1,
          vaccine_name: 'DHPPiL (วัคซีนรวมสุนัข 5 โรค)',
          administered_date: '2025-05-15',
          batch_lot: 'VAC-DHPP-2501',
          expiry_date: '2026-11-30',
          clinic: 'VETCARE+ สาขาหลักทองหล่อ',
          veterinarian: 'น.สพ. วุฒิชัย เจริญสุข',
          next_due_date: '2026-05-15',
          reaction_notes: 'ไม่มีปฏิกิริยาแพ้ ปกติดี'
        },
        {
          id: 2,
          vaccine_name: 'Rabies (วัคซีนป้องกันโรคพิษสุนัขบ้า)',
          administered_date: '2025-05-15',
          batch_lot: 'RAB-DEF-2509',
          expiry_date: '2027-01-31',
          clinic: 'VETCARE+ สาขาหลักทองหล่อ',
          veterinarian: 'น.สพ. วุฒิชัย เจริญสุข',
          next_due_date: '2026-05-15',
          reaction_notes: 'ปกติดี'
        },
        {
          id: 3,
          vaccine_name: 'Kennel Cough (วัคซีนป้องกันหวัดและหลอดลมอักเสบติดต่อ)',
          administered_date: '2025-11-10',
          batch_lot: 'KC-BRONCH-2511',
          expiry_date: '2026-09-30',
          clinic: 'VETCARE+ สาขาหลักทองหล่อ',
          veterinarian: 'สพ.ญ. ศศิธร สุวรรณเวช',
          next_due_date: '2026-11-10',
          reaction_notes: 'มีอาการซึมเล็กน้อย 1 วัน แล้วหายปกติ'
        }
      ],
      photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    },
    {
      id: 2,
      pet_code: 'PET-2026-0002',
      pet_name: 'โมจิ (Moji)',
      species_id: 2,
      species: 'แมว',
      breed_id: 9,
      breed: 'สก็อตติช โฟลด์',
      sex: 'เมีย (Female)',
      reproductive_status: 'ยังไม่ทำหมัน (Intact)',
      birth_date: '2024-02-14',
      birth_date_is_estimated: false,
      color: 'ขาว-เทา ลายเสือ',
      microchip_number: '900215004481239',
      current_weight: 3.8,
      weights_history: [
        { date: '2025-12-05', weight: 3.5, measured_by: 'ผู้ช่วยอรุณ' },
        { date: '2026-02-01', weight: 3.8, measured_by: 'สพ.ญ. ศศิธร' }
      ],
      allergies: [],
      allergies_detail: [],
      chronic_conditions: [],
      chronic_conditions_detail: [],
      vaccinations: [
        {
          id: 4,
          vaccine_name: 'FVRCP (วัคซีนรวมไข้หัด-หวัดแมว 3 โรค)',
          administered_date: '2025-06-10',
          batch_lot: 'CAT-FVRCP-2503',
          expiry_date: '2026-12-31',
          clinic: 'VETCARE+ สาขาหลักทองหล่อ',
          veterinarian: 'สพ.ญ. ศศิธร สุวรรณเวช',
          next_due_date: '2026-06-10',
          reaction_notes: 'ปกติดี'
        },
        {
          id: 5,
          vaccine_name: 'Rabies (วัคซีนพิษสุนัขบ้าสำหรับแมว)',
          administered_date: '2025-06-10',
          batch_lot: 'RAB-CAT-2504',
          expiry_date: '2027-04-30',
          clinic: 'VETCARE+ สาขาหลักทองหล่อ',
          veterinarian: 'สพ.ญ. ศศิธร สุวรรณเวช',
          next_due_date: '2026-06-10',
          reaction_notes: 'ปกติดี'
        }
      ],
      photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    },
    {
      id: 3,
      pet_code: 'PET-2026-0003',
      pet_name: 'ลักกี้ (Lucky)',
      species_id: 1,
      species: 'สุนัข',
      breed_id: 2,
      breed: 'ชิบะ อินุ',
      sex: 'ผู้ (Male)',
      reproductive_status: 'ทำหมันแล้ว (Neutered)',
      birth_date: '2022-08-20',
      birth_date_is_estimated: false,
      color: 'แดง-ขาว (Red Sesame)',
      microchip_number: '900215008819022',
      current_weight: 10.2,
      weights_history: [
        { date: '2025-10-12', weight: 10.0, measured_by: 'ผู้ช่วยอรุณ' },
        { date: '2026-02-18', weight: 10.2, measured_by: 'น.สพ. ธีรภัทร' }
      ],
      allergies: ['แพ้อาหารที่มีโปรตีนจากไก่ (Chicken Protein)'],
      allergies_detail: [
        {
          id: 2,
          allergen: 'โปรตีนจากเนื้อไก่ (Chicken Protein & Poultry by-products)',
          category: 'FOOD',
          severity: 'MODERATE',
          onset_date: '2023-04-12',
          status: 'CONFIRMED',
          diagnosed_by: 'น.สพ. ธีรภัทร บริบาล',
          notes: 'คันผิวหนัง เกาใบหู และถ่ายเหลวเรื้อรังเมื่อได้รับอาหารไก่ แนะนำ Hypoallergenic Salmon / Lamb'
        }
      ],
      chronic_conditions: ['ภูมิแพ้ผิวหนังเรื้อรัง (Atopic Dermatitis)'],
      chronic_conditions_detail: [
        {
          id: 2,
          condition_name: 'ภูมิแพ้ผิวหนังเรื้อรัง (Atopic Dermatitis)',
          category: 'DERMATOLOGY',
          severity: 'MODERATE',
          diagnosed_date: '2023-05-20',
          status: 'ACTIVE',
          diagnosed_by: 'น.สพ. ธีรภัทร บริบาล',
          notes: 'ดูแลด้วยการอาบน้ำยาฆ่าเชื้อสัปดาห์ละครั้ง และหยดยาบำรุงไขมันชั้นผิวหนัง'
        }
      ],
      vaccinations: [
        {
          id: 6,
          vaccine_name: 'DHPPiL (วัคซีนรวมสุนัข 5 โรค)',
          administered_date: '2025-08-15',
          batch_lot: 'VAC-DHPP-2508',
          expiry_date: '2027-02-28',
          clinic: 'VETCARE+ สาขาหลักทองหล่อ',
          veterinarian: 'น.สพ. ธีรภัทร บริบาล',
          next_due_date: '2026-08-15',
          reaction_notes: 'ปกติดี'
        },
        {
          id: 7,
          vaccine_name: 'Rabies (วัคซีนพิษสุนัขบ้า)',
          administered_date: '2025-08-15',
          batch_lot: 'RAB-DEF-2509',
          expiry_date: '2027-01-31',
          clinic: 'VETCARE+ สาขาหลักทองหล่อ',
          veterinarian: 'น.สพ. ธีรภัทร บริบาล',
          next_due_date: '2026-08-15',
          reaction_notes: 'ปกติดี'
        }
      ],
      photo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    },
    {
      id: 4,
      pet_code: 'PET-2026-0004',
      pet_name: 'ชีสเค้ก (Cheesecake)',
      species_id: 2,
      species: 'แมว',
      breed_id: 10,
      breed: 'บริติช ชอร์ตแฮร์',
      sex: 'เมีย (Female)',
      reproductive_status: 'ทำหมันแล้ว (Neutered)',
      birth_date: '2021-11-05',
      birth_date_is_estimated: false,
      color: 'บลู (Solid Blue)',
      microchip_number: '900215001129938',
      current_weight: 4.6,
      weights_history: [
        { date: '2026-01-20', weight: 4.5, measured_by: 'ผู้ช่วยอรุณ' },
        { date: '2026-03-01', weight: 4.6, measured_by: 'สพ.ญ. ศศิธร' }
      ],
      allergies: [],
      allergies_detail: [],
      chronic_conditions: ['โรคไตเรื้อรังระยะ 1 (CKD Stage 1) - นัดเฝ้าระวัง'],
      chronic_conditions_detail: [
        {
          id: 3,
          condition_name: 'โรคไตเรื้อรังระยะ 1 (CKD Stage 1)',
          category: 'NEPHROLOGY',
          severity: 'MODERATE',
          diagnosed_date: '2025-12-01',
          status: 'ACTIVE',
          diagnosed_by: 'สพ.ญ. ศศิธร สุวรรณเวช',
          notes: 'เฝ้าระวังค่า Creatinine & SDMA ทุก 3 เดือน แนะนำอาหารสูตรโรคไต Renal Support'
        }
      ],
      vaccinations: [
        {
          id: 8,
          vaccine_name: 'FVRCP (วัคซีนรวมไข้หัด-หวัดแมว 3 โรค)',
          administered_date: '2025-11-15',
          batch_lot: 'CAT-FVRCP-2511',
          expiry_date: '2026-11-30',
          clinic: 'VETCARE+ สาขาหลักทองหล่อ',
          veterinarian: 'สพ.ญ. ศศิธร สุวรรณเวช',
          next_due_date: '2026-11-15',
          reaction_notes: 'ปกติดี'
        }
      ],
      photo: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    },
    {
      id: 5,
      pet_code: 'PET-2026-0005',
      pet_name: 'เจ้าแต้ม (Taem)',
      species_id: 1,
      species: 'สุนัข',
      breed_id: 3,
      breed: 'ไทยบางแก้ว',
      sex: 'ผู้ (Male)',
      reproductive_status: 'ยังไม่ทำหมัน (Intact)',
      birth_date: '2025-01-10',
      birth_date_is_estimated: true,
      color: 'ขาวแต้มน้ำตาล',
      microchip_number: '900215009931884',
      current_weight: 14.2,
      weights_history: [
        { date: '2026-03-02', weight: 14.2, measured_by: 'น.สพ. วุฒิชัย' }
      ],
      allergies: [],
      allergies_detail: [],
      chronic_conditions: [],
      chronic_conditions_detail: [],
      vaccinations: [
        {
          id: 9,
          vaccine_name: 'DHPPiL เข็มที่ 1 (วัคซีนรวมลูกสุนัข)',
          administered_date: '2026-02-10',
          batch_lot: 'VAC-PUPPY-2602',
          expiry_date: '2027-02-28',
          clinic: 'คลินิกรักษาสัตว์สงเคราะห์เดิม',
          veterinarian: 'สัตวแพทย์อาสา',
          next_due_date: '2026-03-10',
          reaction_notes: 'ฉีดจากสถานสงเคราะห์เดิม บันทึกเทียบประวัติ'
        }
      ],
      photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    }
  ],

  // customer.pet_ownerships (Domain 01 - Many-to-Many with Co-Owners & Caregivers)
  ownerships: [
    {
      id: 1,
      pet_id: 1,
      customer_id: 1,
      ownership_type: 'PRIMARY',
      is_primary: true,
      relationship_title: 'เจ้าของหลัก / ผู้รับผิดชอบค่าใช้จ่าย',
      start_date: '2023-07-01',
      end_date: null,
      can_give_consent: true,
      notes: 'ผู้จดทะเบียนหลัก'
    },
    {
      id: 2,
      pet_id: 1,
      customer_id: 2,
      ownership_type: 'CO_OWNER',
      is_primary: false,
      relationship_title: 'เจ้าของร่วม / สมาชิกครอบครัว',
      start_date: '2024-01-10',
      end_date: null,
      can_give_consent: true,
      notes: 'พาสัตว์มารับการตรวจและรับยาเป็นประจำ'
    },
    {
      id: 3,
      pet_id: 4,
      customer_id: 1,
      ownership_type: 'PRIMARY',
      is_primary: true,
      relationship_title: 'เจ้าของหลัก',
      start_date: '2022-01-15',
      end_date: null,
      can_give_consent: true,
      notes: ''
    },
    {
      id: 4,
      pet_id: 2,
      customer_id: 2,
      ownership_type: 'PRIMARY',
      is_primary: true,
      relationship_title: 'เจ้าของหลัก',
      start_date: '2024-03-01',
      end_date: null,
      can_give_consent: true,
      notes: ''
    },
    {
      id: 5,
      pet_id: 3,
      customer_id: 3,
      ownership_type: 'PRIMARY',
      is_primary: true,
      relationship_title: 'เจ้าของหลัก',
      start_date: '2022-10-15',
      end_date: null,
      can_give_consent: true,
      notes: ''
    },
    {
      id: 6,
      pet_id: 5,
      customer_id: 4,
      ownership_type: 'PRIMARY',
      is_primary: true,
      relationship_title: 'เจ้าหน้าที่ผู้ดูแลมูลนิธิ',
      start_date: '2026-03-02',
      end_date: null,
      can_give_consent: true,
      notes: 'เคสสัตว์สงเคราะห์ของมูลนิธิเพื่อนสัตว์ไทย'
    }
  ],

  // History of Ownership Transfers (Domain 01 Audit)
  ownershipTransfers: [
    {
      id: 1,
      pet_id: 5,
      from_customer_id: null,
      to_customer_id: 4,
      transfer_date: '2026-03-02',
      reason: 'รับมอบสัตว์เลี้ยงเข้าสู่ความดูแลของมูลนิธิเพื่อการรักษา',
      authorized_by: 'น.สพ. วุฒิชัย เจริญสุข'
    }
  ]
});
