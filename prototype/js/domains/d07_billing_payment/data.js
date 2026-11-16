/**
 * ============================================================================
 * DOMAIN 07: BILLING & PAYMENT MANAGEMENT - DATA ENGINE
 * ============================================================================
 * Architectural Alignment:
 * - docs/BusinessDomain/07.Billing_and_Payment_Management.md
 * - 22 Business Capabilities (3.1 - 3.22)
 * - Physical Database Design (Schema billing.* - 12 Tables/Entities)
 * - 4 Sub-Tabs Lifecycle: Cashier POS, Invoices & AR, Deposits & Refunds, Shift Closing
 * ============================================================================
 */

Object.assign(state, {
  // Navigation & Sub-Tab State
  activeBillingSubTab: 'cashier', // 'cashier' | 'invoices' | 'deposits_refunds' | 'shift_closing'
  activeBillingSubFilter: 'all',  // 'all' | 'unpaid' | 'paid' | 'partial' | 'unbilled_queue'
  activeCheckoutInvoiceId: null,
  activePaymentMethod: 'CASH',    // 'CASH' | 'PROMPTPAY' | 'CREDIT_CARD' | 'SPLIT' | 'DEPOSIT'
  checkoutDiscount: 0,
  checkoutDepositApplied: false,
  checkoutSelectedCouponId: null,

  // --- 1. SERVICE CATALOGS (Table: core.service_catalogs / billing.service_charges) ---
  serviceCatalogs: [
    { id: 1, service_code: 'SRV-DOC-01', service_name: 'ค่าตรวจวินิจฉัยและบริการวิชาชีพสัตวแพทย์ (Doctor Examination Fee)', category: 'CLINICAL', unit_price: 150.00, status: 'ACTIVE' },
    { id: 2, service_code: 'SRV-NRS-01', service_name: 'ค่าบริการพยาบาลและหัตถการผู้ป่วยนอก (Nursing Care Fee)', category: 'NURSING', unit_price: 80.00, status: 'ACTIVE' },
    { id: 3, service_code: 'SRV-EMG-01', service_name: 'ค่าบริการตรวจนอกเวลา / ฉุกเฉิน (Emergency Care Surcharge)', category: 'EMERGENCY', unit_price: 300.00, status: 'ACTIVE' },
    { id: 4, service_code: 'SRV-ADM-01', service_name: 'ค่าขึ้นทะเบียนผู้ป่วยใหม่และออกบัตรประจำตัว (Registration Fee)', category: 'ADMIN', unit_price: 50.00, status: 'ACTIVE' },
    { id: 5, service_code: 'SRV-HSP-01', service_name: 'ค่าบริการฝากดูแลสังเกตอาการรายวัน (Day Care / Observation)', category: 'HOSPITALIZATION', unit_price: 450.00, status: 'ACTIVE' },
    { id: 6, service_code: 'SRV-WND-01', service_name: 'ค่าล้างแผลและทำแผลปลอดเชื้อ (Wound Dressing & Cleaning)', category: 'CLINICAL', unit_price: 200.00, status: 'ACTIVE' },
    { id: 7, service_code: 'SRV-RTL-01', service_name: 'อาหารประกอบการรักษา Royal Canin Recovery 195g', category: 'RETAIL', unit_price: 180.00, status: 'ACTIVE' },
    { id: 8, service_code: 'SRV-RTL-02', service_name: 'แชมพูยา Malaseb ลดเชื้อราและแบคทีเรีย 250ml', category: 'RETAIL', unit_price: 520.00, status: 'ACTIVE' },
    { id: 9, service_code: 'SRV-RTL-03', service_name: 'ปลอกคอกันเลีย Elizabeth Collar เบอร์ 15cm', category: 'RETAIL', unit_price: 120.00, status: 'ACTIVE' }
  ],

  // --- 2. CHARGE SOURCES AUDIT TRAIL (Table: billing.charge_sources) ---
  chargeSources: [
    { id: 1, source_domain: 'CLINICAL', source_record_type: 'EMR_ENCOUNTER', source_record_id: 1, pet_id: 1, customer_id: 1, description: 'ค่าตรวจวินิจฉัยและบริการวิชาชีพสัตวแพทย์', amount: 150.00, status: 'BILLED', invoice_id: 1, received_at: '2026-03-02 11:30' },
    { id: 2, source_domain: 'SURGERY', source_record_type: 'SURGERY_SCHEDULE', source_record_id: 1, pet_id: 1, customer_id: 1, description: 'หัตถการ: เย็บซ่อมแซมแผลฉีกขาด', amount: 800.00, status: 'BILLED', invoice_id: 1, received_at: '2026-03-02 12:00' },
    { id: 3, source_domain: 'SURGERY', source_record_type: 'SURGERY_SUPPLY', source_record_id: 1, pet_id: 1, customer_id: 1, description: 'วัสดุผ่าตัด: ไหมเย็บแผล Nylon 3-0 พร้อมเข็มโค้ง', amount: 180.00, status: 'BILLED', invoice_id: 1, received_at: '2026-03-02 12:00' },
    { id: 4, source_domain: 'SURGERY', source_record_type: 'SURGERY_SUPPLY', source_record_id: 1, pet_id: 1, customer_id: 1, description: 'เวชภัณฑ์: 0.9% Normal Saline Solution 1,000ml', amount: 85.00, status: 'BILLED', invoice_id: 1, received_at: '2026-03-02 12:00' },
    { id: 5, source_domain: 'LABORATORY', source_record_type: 'DIAGNOSTIC_ORDER', source_record_id: 1, pet_id: 1, customer_id: 1, description: 'ตรวจวิเคราะห์เลือด: Complete Blood Count (CBC)', amount: 350.00, status: 'BILLED', invoice_id: 1, received_at: '2026-03-02 11:45' },
    { id: 6, source_domain: 'PHARMACY', source_record_type: 'PRESCRIPTION_DISPENSE', source_record_id: 1, pet_id: 1, customer_id: 1, description: 'ยาปฏิชีวนะ: Amoxicillin + Clavulanate (Clavamox) 250mg', amount: 392.00, status: 'BILLED', invoice_id: 1, received_at: '2026-03-02 12:15' },
    { id: 7, source_domain: 'PHARMACY', source_record_type: 'PRESCRIPTION_DISPENSE', source_record_id: 1, pet_id: 1, customer_id: 1, description: 'ยาลดอักเสบแก้ปวด: Meloxicam Oral Suspension 1.5mg/ml', amount: 320.00, status: 'BILLED', invoice_id: 1, received_at: '2026-03-02 12:15' },

    // Unbilled charges ready to aggregate
    { id: 8, source_domain: 'LABORATORY', source_record_type: 'DIAGNOSTIC_ORDER', source_record_id: 2, pet_id: 2, customer_id: 2, description: 'ตรวจเลือดก่อนผ่าตัด: Pre-anesthetic Bloodwork', amount: 700.00, status: 'BILLED', invoice_id: 2, received_at: '2026-03-02 10:45' },
    { id: 9, source_domain: 'CLINICAL', source_record_type: 'EMR_ENCOUNTER', source_record_id: 4, pet_id: 4, customer_id: 1, description: 'ค่าตรวจวินิจฉัยผิวหนังและก้อนเนื้อ', amount: 150.00, status: 'UNBILLED', invoice_id: null, received_at: '2026-03-02 11:20' },
    { id: 10, source_domain: 'PHARMACY', source_record_type: 'PRESCRIPTION_DISPENSE', source_record_id: 4, pet_id: 4, customer_id: 1, description: 'ยาทาแผลและลดคัน Dermotic 15ml', amount: 280.00, status: 'UNBILLED', invoice_id: null, received_at: '2026-03-02 11:35' }
  ],

  // --- 3. INVOICES (Table: billing.invoices) ---
  invoices: [
    {
      id: 1,
      invoice_number: 'INV-20260302-001',
      customer_id: 1, // คุณวิภาดา (แพท)
      pet_id: 1, // บราวนี่
      encounter_id: 1,
      surgery_schedule_id: 1,
      dispense_id: 1,
      diagnostic_order_id: 1,
      invoice_date: '2026-03-02 12:00',
      due_date: '2026-03-02',
      payment_terms: 'DUE_ON_RECEIPT', // 'DUE_ON_RECEIPT' | 'NET_15' | 'NET_30'
      subtotal: 2277.00,
      discount_total: 0.00,
      tax_rate: 0.07,
      tax_total: 148.97,
      grand_total: 2277.00,
      paid_amount: 0.00,
      outstanding_amount: 2277.00,
      status: 'UNPAID', // 'UNPAID' | 'PARTIAL' | 'PAID' | 'VOID'
      created_by: 'น.ส. สุภาพร (แคชเชียร์)',
      items: [
        { id: 1, source_domain: 'CLINICAL', source_record_id: 1, service_code: 'SRV-DOC-01', description_snapshot: 'ค่าตรวจวินิจฉัยและบริการวิชาชีพสัตวแพทย์', quantity: 1, unit: 'ครั้ง', unit_price_snapshot: 150.00, line_total: 150.00 },
        { id: 2, source_domain: 'SURGERY', source_record_id: 1, service_code: 'SURG-WND-02', description_snapshot: 'หัตถการ: เย็บซ่อมแซมแผลฉีกขาด (Wound Debridement & Primary Suture)', quantity: 1, unit: 'หัตถการ', unit_price_snapshot: 800.00, line_total: 800.00 },
        { id: 3, source_domain: 'SURGERY', source_record_id: 1, service_code: 'MED-NYL-030', description_snapshot: 'วัสดุผ่าตัด: ไหมเย็บแผล Nylon 3-0 พร้อมเข็มโค้ง (Ethicon)', quantity: 1, unit: 'ซอง', unit_price_snapshot: 180.00, line_total: 180.00 },
        { id: 4, source_domain: 'SURGERY', source_record_id: 1, service_code: 'MED-NSS-1000', description_snapshot: 'เวชภัณฑ์: 0.9% Normal Saline Solution 1,000ml', quantity: 1, unit: 'ขวด', unit_price_snapshot: 85.00, line_total: 85.00 },
        { id: 5, source_domain: 'LABORATORY', source_record_id: 1, service_code: 'LAB-CBC-01', description_snapshot: 'ตรวจวิเคราะห์เลือด: Complete Blood Count (CBC)', quantity: 1, unit: 'ชุด', unit_price_snapshot: 350.00, line_total: 350.00 },
        { id: 6, source_domain: 'PHARMACY', source_record_id: 1, service_code: 'MED-CLV-250', description_snapshot: 'ยาปฏิชีวนะ: Amoxicillin + Clavulanate (Clavamox) 250mg', quantity: 14, unit: 'เม็ด', unit_price_snapshot: 28.00, line_total: 392.00 },
        { id: 7, source_domain: 'PHARMACY', source_record_id: 1, service_code: 'MED-MLX-015', description_snapshot: 'ยาลดอักเสบแก้ปวด: Meloxicam Oral Suspension 1.5mg/ml (15ml)', quantity: 1, unit: 'ขวด', unit_price_snapshot: 320.00, line_total: 320.00 }
      ]
    },
    {
      id: 2,
      invoice_number: 'INV-20260302-002',
      customer_id: 2, // คุณชนาธิป (บอล)
      pet_id: 2, // โมจิ
      encounter_id: 2,
      surgery_schedule_id: 2,
      dispense_id: null,
      diagnostic_order_id: null,
      invoice_date: '2026-03-02 11:00',
      due_date: '2026-03-02',
      payment_terms: 'DUE_ON_RECEIPT',
      subtotal: 850.00,
      discount_total: 0.00,
      tax_rate: 0.07,
      tax_total: 55.61,
      grand_total: 850.00,
      paid_amount: 0.00,
      outstanding_amount: 850.00,
      status: 'UNPAID',
      created_by: 'น.ส. สุภาพร (แคชเชียร์)',
      items: [
        { id: 1, source_domain: 'CLINICAL', source_record_id: 2, service_code: 'SRV-DOC-01', description_snapshot: 'ค่าตรวจวินิจฉัยสุขภาพก่อนผ่าตัด (Pre-op Exam Fee)', quantity: 1, unit: 'ครั้ง', unit_price_snapshot: 150.00, line_total: 150.00 },
        { id: 2, source_domain: 'LABORATORY', source_record_id: 2, service_code: 'LAB-CBC-01', description_snapshot: 'ตรวจเลือดก่อนผ่าตัด: Pre-anesthetic Bloodwork', quantity: 1, unit: 'ชุด', unit_price_snapshot: 700.00, line_total: 700.00 }
      ]
    },
    {
      id: 3,
      invoice_number: 'INV-20260302-003',
      customer_id: 3, // คุณกมลชนก (แนท)
      pet_id: 3, // ลักกี้
      encounter_id: 3,
      surgery_schedule_id: 3,
      dispense_id: 3,
      diagnostic_order_id: null,
      invoice_date: '2026-03-02 10:55',
      due_date: '2026-03-02',
      payment_terms: 'DUE_ON_RECEIPT',
      subtotal: 1450.00,
      discount_total: 100.00,
      tax_rate: 0.07,
      tax_total: 88.32,
      grand_total: 1350.00,
      paid_amount: 1350.00,
      outstanding_amount: 0.00,
      status: 'PAID',
      created_by: 'น.ส. สุภาพร (แคชเชียร์)',
      items: [
        { id: 1, source_domain: 'CLINICAL', source_record_id: 3, service_code: 'SRV-DOC-01', description_snapshot: 'ค่าบริการทันตกรรมสัตวแพทย์และตรวจช่องปาก', quantity: 1, unit: 'ครั้ง', unit_price_snapshot: 150.00, line_total: 150.00 },
        { id: 2, source_domain: 'SURGERY', source_record_id: 3, service_code: 'SURG-DEN-04', description_snapshot: 'หัตถการ: ขูดหินปูนและขัดฟัน (Dental Scaling & Polishing)', quantity: 1, unit: 'หัตถการ', unit_price_snapshot: 1200.00, line_total: 1200.00 },
        { id: 3, source_domain: 'SURGERY', source_record_id: 3, service_code: 'MED-NSS-1000', description_snapshot: '0.9% Normal Saline Solution 1,000ml', quantity: 1, unit: 'ขวด', unit_price_snapshot: 100.00, line_total: 100.00 }
      ]
    },
    {
      id: 4,
      invoice_number: 'INV-20260215-004',
      customer_id: 5, // มูลนิธิเพื่อนสัตว์ไทย
      pet_id: 5, // สิงโต
      encounter_id: 5,
      surgery_schedule_id: null,
      dispense_id: 5,
      diagnostic_order_id: null,
      invoice_date: '2026-02-15 14:20',
      due_date: '2026-03-01', // Overdue
      payment_terms: 'NET_15',
      subtotal: 1850.00,
      discount_total: 200.00,
      tax_rate: 0.07,
      tax_total: 107.94,
      grand_total: 1650.00,
      paid_amount: 650.00,
      outstanding_amount: 1000.00,
      status: 'PARTIAL',
      created_by: 'น.ส. สุภาพร (แคชเชียร์)',
      items: [
        { id: 1, source_domain: 'CLINICAL', source_record_id: 5, service_code: 'SRV-DOC-01', description_snapshot: 'ตรวจรักษาโรคผิวหนังเรื้อรัง', quantity: 1, unit: 'ครั้ง', unit_price_snapshot: 150.00, line_total: 150.00 },
        { id: 2, source_domain: 'PHARMACY', source_record_id: 5, service_code: 'MED-SHP-001', description_snapshot: 'แชมพูยา Malaseb 250ml', quantity: 2, unit: 'ขวด', unit_price_snapshot: 520.00, line_total: 1040.00 },
        { id: 3, source_domain: 'PHARMACY', source_record_id: 5, service_code: 'MED-ITR-100', description_snapshot: 'ยาต้านเชื้อรา Itraconazole 100mg', quantity: 22, unit: 'แคปซูล', unit_price_snapshot: 30.00, line_total: 660.00 }
      ]
    }
  ],

  // --- 3.1 INVOICE ITEMS (Table: billing.invoice_items) ---
  invoiceItems: [
    { id: 1, invoice_id: 1, source_domain: 'CLINICAL', source_record_id: 1, service_code: 'SRV-DOC-01', description_snapshot: 'ค่าตรวจวินิจฉัยและบริการวิชาชีพสัตวแพทย์', quantity: 1, unit: 'ครั้ง', unit_price_snapshot: 150.00, line_total: 150.00 },
    { id: 2, invoice_id: 1, source_domain: 'SURGERY', source_record_id: 1, service_code: 'SURG-WND-02', description_snapshot: 'หัตถการ: เย็บซ่อมแซมแผลฉีกขาด (Wound Debridement & Primary Suture)', quantity: 1, unit: 'หัตถการ', unit_price_snapshot: 800.00, line_total: 800.00 },
    { id: 3, invoice_id: 1, source_domain: 'SURGERY', source_record_id: 1, service_code: 'MED-NYL-030', description_snapshot: 'วัสดุผ่าตัด: ไหมเย็บแผล Nylon 3-0 พร้อมเข็มโค้ง (Ethicon)', quantity: 1, unit: 'ซอง', unit_price_snapshot: 180.00, line_total: 180.00 },
    { id: 4, invoice_id: 1, source_domain: 'SURGERY', source_record_id: 1, service_code: 'MED-NSS-1000', description_snapshot: 'เวชภัณฑ์: 0.9% Normal Saline Solution 1,000ml', quantity: 1, unit: 'ขวด', unit_price_snapshot: 85.00, line_total: 85.00 },
    { id: 5, invoice_id: 1, source_domain: 'LABORATORY', source_record_id: 1, service_code: 'LAB-CBC-01', description_snapshot: 'ตรวจวิเคราะห์เลือด: Complete Blood Count (CBC)', quantity: 1, unit: 'ชุด', unit_price_snapshot: 350.00, line_total: 350.00 },
    { id: 6, invoice_id: 1, source_domain: 'PHARMACY', source_record_id: 1, service_code: 'MED-CLV-250', description_snapshot: 'ยาปฏิชีวนะ: Amoxicillin + Clavulanate (Clavamox) 250mg', quantity: 14, unit: 'เม็ด', unit_price_snapshot: 28.00, line_total: 392.00 },
    { id: 7, invoice_id: 1, source_domain: 'PHARMACY', source_record_id: 1, service_code: 'MED-MLX-015', description_snapshot: 'ยาลดอักเสบแก้ปวด: Meloxicam Oral Suspension 1.5mg/ml (15ml)', quantity: 1, unit: 'ขวด', unit_price_snapshot: 320.00, line_total: 320.00 },
    { id: 8, invoice_id: 2, source_domain: 'CLINICAL', source_record_id: 2, service_code: 'SRV-DOC-01', description_snapshot: 'ค่าตรวจรักษาและวินิจฉัยสัตวแพทย์', quantity: 1, unit: 'ครั้ง', unit_price_snapshot: 150.00, line_total: 150.00 },
    { id: 9, invoice_id: 2, source_domain: 'SURGERY', source_record_id: 2, service_code: 'SURG-AB-01', description_snapshot: 'หัตถการ: เจาะระบายหนองฝีและสวนล้าง (Abscess Drainage)', quantity: 1, unit: 'หัตถการ', unit_price_snapshot: 700.00, line_total: 700.00 },
    { id: 10, invoice_id: 3, source_domain: 'CLINICAL', source_record_id: 3, service_code: 'SRV-DOC-01', description_snapshot: 'ค่าบริการทันตกรรมสัตวแพทย์และตรวจช่องปาก', quantity: 1, unit: 'ครั้ง', unit_price_snapshot: 150.00, line_total: 150.00 },
    { id: 11, invoice_id: 3, source_domain: 'SURGERY', source_record_id: 3, service_code: 'SURG-DEN-04', description_snapshot: 'หัตถการ: ขูดหินปูนและขัดฟัน (Dental Scaling & Polishing)', quantity: 1, unit: 'หัตถการ', unit_price_snapshot: 1200.00, line_total: 1200.00 },
    { id: 12, invoice_id: 3, source_domain: 'SURGERY', source_record_id: 3, service_code: 'MED-NSS-1000', description_snapshot: '0.9% Normal Saline Solution 1,000ml', quantity: 1, unit: 'ขวด', unit_price_snapshot: 100.00, line_total: 100.00 },
    { id: 13, invoice_id: 4, source_domain: 'CLINICAL', source_record_id: 5, service_code: 'SRV-DOC-01', description_snapshot: 'ตรวจรักษาโรคผิวหนังเรื้อรัง', quantity: 1, unit: 'ครั้ง', unit_price_snapshot: 150.00, line_total: 150.00 },
    { id: 14, invoice_id: 4, source_domain: 'PHARMACY', source_record_id: 5, service_code: 'MED-SHP-001', description_snapshot: 'แชมพูยา Malaseb 250ml', quantity: 2, unit: 'ขวด', unit_price_snapshot: 520.00, line_total: 1040.00 },
    { id: 15, invoice_id: 4, source_domain: 'PHARMACY', source_record_id: 5, service_code: 'MED-ITR-100', description_snapshot: 'ยาต้านเชื้อรา Itraconazole 100mg', quantity: 22, unit: 'แคปซูล', unit_price_snapshot: 30.00, line_total: 660.00 }
  ],
  payments: [
    {
      id: 1,
      payment_number: 'PAY-20260302-001',
      invoice_id: 3,
      customer_id: 3,
      amount: 1350.00,
      payment_method: 'PROMPTPAY',
      tendered_amount: 1350.00,
      change_amount: 0.00,
      transaction_ref: 'TXN-PP-9823412',
      deposit_deducted: 0.00,
      paid_at: '2026-03-02 11:05',
      received_by: 'น.ส. สุภาพร (แคชเชียร์)',
      status: 'SUCCESS'
    },
    {
      id: 2,
      payment_number: 'PAY-20260215-002',
      invoice_id: 4,
      customer_id: 5,
      amount: 650.00,
      payment_method: 'CASH',
      tendered_amount: 1000.00,
      change_amount: 350.00,
      transaction_ref: 'TXN-CASH-77123',
      deposit_deducted: 0.00,
      paid_at: '2026-02-15 14:30',
      received_by: 'น.ส. สุภาพร (แคชเชียร์)',
      status: 'SUCCESS'
    }
  ],

  paymentAllocations: [
    { id: 1, payment_id: 1, invoice_id: 3, allocated_amount: 1350.00, allocated_at: '2026-03-02 11:05' },
    { id: 2, payment_id: 2, invoice_id: 4, allocated_amount: 650.00, allocated_at: '2026-02-15 14:30' }
  ],

  // --- 5. RECEIPTS (Table: billing.receipts) ---
  receipts: [
    {
      id: 1,
      receipt_number: 'REC-20260302-001',
      invoice_id: 3,
      payment_id: 1,
      customer_id: 3,
      pet_id: 3,
      receipt_date: '2026-03-02 11:05',
      total_amount: 1350.00,
      tax_amount: 88.32,
      issued_by: 'น.ส. สุภาพร (แคชเชียร์)',
      status: 'ACTIVE'
    },
    {
      id: 2,
      receipt_number: 'REC-20260215-002',
      invoice_id: 4,
      payment_id: 2,
      customer_id: 5,
      pet_id: 5,
      receipt_date: '2026-02-15 14:30',
      total_amount: 650.00,
      tax_amount: 42.52,
      issued_by: 'น.ส. สุภาพร (แคชเชียร์)',
      status: 'ACTIVE'
    }
  ],

  // --- 6. TAX INVOICES (Table: billing.tax_invoices) ---
  taxInvoices: [
    {
      id: 1,
      tax_invoice_number: 'TAX-20260302-001',
      receipt_id: 1,
      invoice_id: 3,
      customer_name: 'คุณกมลชนก (แนท)',
      tax_id: '1100400234567',
      customer_address: '88/12 ซอยอารีย์สัมพันธ์ แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400',
      branch_name: 'สำนักงานใหญ่',
      issued_at: '2026-03-02 11:05',
      tax_amount: 88.32,
      issued_by: 'น.ส. สุภาพร (แคชเชียร์)'
    }
  ],

  // --- 7. CUSTOMER DEPOSITS & ALLOCATIONS (Table: billing.customer_deposits & deposit_allocations) ---
  customerDeposits: [
    {
      id: 1,
      deposit_number: 'DEP-20260302-01',
      customer_id: 1, // คุณวิภาดา (แพท)
      pet_id: 1, // บราวนี่
      original_amount: 1000.00,
      used_amount: 0.00,
      remaining_amount: 1000.00,
      payment_method: 'PROMPTPAY',
      received_at: '2026-03-02 09:30',
      received_by: 'น.ส. สุภาพร (แคชเชียร์)',
      notes: 'เงินมัดจำค่าผ่าตัดฉุกเฉินและตรวจแล็บล่วงหน้า',
      status: 'ACTIVE'
    },
    {
      id: 2,
      deposit_number: 'DEP-20260301-02',
      customer_id: 2, // คุณชนาธิป (บอล)
      pet_id: 2, // โมจิ
      original_amount: 500.00,
      used_amount: 0.00,
      remaining_amount: 500.00,
      payment_method: 'CASH',
      received_at: '2026-03-01 16:00',
      received_by: 'น.ส. สุภาพร (แคชเชียร์)',
      notes: 'เงินมัดจำจองคิวผ่าตัดทำหมันแมว',
      status: 'ACTIVE'
    }
  ],

  depositAllocations: [
    // Historical deposit allocations if any
  ],

  // --- 8. REFUNDS (Table: billing.refunds) ---
  refunds: [
    {
      id: 1,
      refund_number: 'REF-20260301-001',
      payment_id: 1,
      invoice_id: 3,
      customer_id: 3,
      refund_amount: 180.00,
      refund_method: 'PROMPTPAY',
      refund_reason: 'คืนสินค้าอาหารสัตว์บรรจุภัณฑ์ชำรุดก่อนเปิดใช้ (Return Undamaged Product)',
      refunded_at: '2026-03-01 16:45',
      approved_by: 1, // น.สพ. วุฒิชัย (ผู้จัดการคลินิก)
      status: 'COMPLETED'
    }
  ],

  // --- 9. DAILY CASH CLOSINGS & CASH DRAWER SESSIONS (Table: billing.daily_cash_closings) ---
  dailyCashClosings: [
    {
      id: 1,
      closing_number: 'CLS-20260301-01',
      shift_date: '2026-03-01',
      shift_name: 'กะบ่าย (Afternoon Shift 08:00 - 20:00)',
      cashier_id: 3,
      cashier_name: 'น.ส. สุภาพร (แคชเชียร์)',
      opening_float: 3000.00,
      system_cash_sales: 6500.00,
      expected_cash: 9500.00,
      actual_cash_counted: 9500.00,
      variance_amount: 0.00, // 0 = Balanced, negative = Short, positive = Over
      promptpay_total: 12450.00,
      credit_card_total: 8900.00,
      total_shift_revenue: 27850.00,
      notes: 'ปิดกะเรียบร้อย ยอดเงินสดตรงกับยอดในระบบทุกประการ ส่งมอบเงินเข้าตู้นิรภัย',
      status: 'CLOSED', // 'OPEN' | 'CLOSED' | 'VERIFIED'
      closed_at: '2026-03-01 20:15'
    }
  ],

  // Active Open Cash Drawer Shift
  activeCashDrawer: {
    isOpen: true,
    shift_name: 'กะเช้า-บ่าย (Morning-Day Shift 08:00 - 17:00)',
    opened_at: '2026-03-02 08:00',
    cashier_name: 'น.ส. สุภาพร (แคชเชียร์)',
    opening_float: 3000.00
  },

  // --- 10. DISCOUNTS & COUPONS (Table: billing.discounts) ---
  discounts: [
    { id: 1, code: 'VET-WELCOME-10', name: 'ส่วนลดลูกค้าใหม่ 10%', discount_type: 'PERCENTAGE', discount_value: 10, max_discount: 300, min_purchase: 500, status: 'ACTIVE' },
    { id: 2, code: 'SENIOR-PET-100', name: 'คูปองตรวจสุขภาพสัตว์สูงวัย ฿100', discount_type: 'FIXED', discount_value: 100, max_discount: 100, min_purchase: 800, status: 'ACTIVE' },
    { id: 3, code: 'VACCINE-FREE-50', name: 'ส่วนลดค่ายาหลังฉีดวัคซีน ฿50', discount_type: 'FIXED', discount_value: 50, max_discount: 50, min_purchase: 300, status: 'ACTIVE' }
  ]
});
