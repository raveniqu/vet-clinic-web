Object.assign(state, {
  activeProcurementSubTab: 'orders', // 'orders' | 'requisitions' | 'receipts' | 'suppliers'
  activePoDocumentId: 1,

  // --- 10.1 SUPPLIER MASTER & PROFILES ---
  suppliers: [
    {
      id: 1,
      code: 'SUP-001',
      name: 'บริษัท โซเอทิส (ประเทศไทย) จำกัด (Zoetis)',
      type: 'เภสัชภัณฑ์และวัคซีนสัตว์เลี้ยง',
      category: 'PHARMACEUTICAL',
      taxId: '0105556012345',
      paymentTerms: 'Credit 30 วัน',
      creditDays: 30,
      contactName: 'คุณภัทรพร ศรีสุข (ผู้จัดการฝ่ายขาย)',
      phone: '02-678-9012',
      email: 'contact@zoetis.co.th',
      address: 'เลขที่ 323 อาคารยูไนเต็ดเซ็นเตอร์ ชั้น 34 ถนนสีลม บางรัก กรุงเทพฯ 10500',
      province: 'กรุงเทพมหานคร',
      postalCode: '10500',
      rating: 'A',
      score: 96,
      onTimeRate: 98,
      status: 'ACTIVE',
      productsSupplied: ['MED-CLV-250', 'MED-DEX-010', 'VAC-RAB-001'],
      notes: 'คู่ค้าหลักด้านยาต้านจุลชีพและวัคซีนมาตรฐานสากล'
    },
    {
      id: 2,
      code: 'SUP-002',
      name: 'บริษัท อีแลนโค แอนิมอล เฮลธ์ (ประเทศไทย) จำกัด (Elanco)',
      type: 'เภสัชภัณฑ์และยาต้านเชื้อ',
      category: 'PHARMACEUTICAL',
      taxId: '0105557089123',
      paymentTerms: 'Credit 45 วัน',
      creditDays: 45,
      contactName: 'น.สพ. กิตติศักดิ์ พานิช',
      phone: '02-345-6789',
      email: 'order@elanco.co.th',
      address: 'เลขที่ 89 อาคารเอไอเอ แคปปิตอล เซ็นเตอร์ ชั้น 15 ถนนรัชดาภิเษก ดินแดง กรุงเทพฯ 10400',
      province: 'กรุงเทพมหานคร',
      postalCode: '10400',
      rating: 'A',
      score: 94,
      onTimeRate: 95,
      status: 'ACTIVE',
      productsSupplied: ['MED-ENR-050'],
      notes: 'คู่ค้าหลักด้านยาปฏิชีวนะกลุ่ม Fluoroquinolone'
    },
    {
      id: 3,
      code: 'SUP-003',
      name: 'บริษัท โบริงเกอร์ อินเกลไฮม์ แอนิมอล เฮลธ์ (Boehringer Ingelheim)',
      type: 'ยาลดปวด ยาหัวใจ และวัคซีน',
      category: 'PHARMACEUTICAL',
      taxId: '0105558045678',
      paymentTerms: 'Credit 30 วัน',
      creditDays: 30,
      contactName: 'คุณธนกฤต วิเศษศิลป์',
      phone: '02-456-7890',
      email: 'vet.sales@boehringer-ingelheim.com',
      address: 'เลขที่ 42 อาคารคอลัมน์ทาวเวอร์ ชั้น 20 ถนนสุขุมวิท 16 คลองเตย กรุงเทพฯ 10110',
      province: 'กรุงเทพมหานคร',
      postalCode: '10110',
      rating: 'B+',
      score: 89,
      onTimeRate: 91,
      status: 'ACTIVE',
      productsSupplied: ['MED-MLX-015'],
      notes: 'คู่ค้าด้านยาบรรเทาปวดและลดการอักเสบชนิด NSAIDs'
    },
    {
      id: 4,
      code: 'SUP-004',
      name: 'บริษัท เอ็มเอสดี แอนิมอล เฮลธ์ (ประเทศไทย) (MSD / Bravecto)',
      type: 'ผลิตภัณฑ์ป้องกันเห็บหมัดและวัคซีน',
      category: 'BIOLOGICAL',
      taxId: '0105559098765',
      paymentTerms: 'Credit 60 วัน',
      creditDays: 60,
      contactName: 'คุณวราภรณ์ สุวรรณเวช',
      phone: '02-567-8901',
      email: 'customer.service@msd.com',
      address: 'เลขที่ 101/1 อาคารทรู ดิจิทัล พาร์ค ชั้น 11 ถนนสุขุมวิท บางนา กรุงเทพฯ 10260',
      province: 'กรุงเทพมหานคร',
      postalCode: '10260',
      rating: 'A',
      score: 97,
      onTimeRate: 99,
      status: 'ACTIVE',
      productsSupplied: ['MED-BRV-020'],
      notes: 'คู่ค้าผลิตภัณฑ์ควบคุมและกำจัดปรสิตภายนอก'
    },
    {
      id: 5,
      code: 'SUP-005',
      name: 'บริษัท บี. บราวน์ (ประเทศไทย) จำกัด (B. Braun & Medical Devices)',
      type: 'เวชภัณฑ์ สารน้ำ และอุปกรณ์ผ่าตัด',
      category: 'MEDICAL_DEVICE',
      taxId: '0105552011223',
      paymentTerms: 'Credit 30 วัน',
      creditDays: 30,
      contactName: 'คุณเกียรติศักดิ์ มั่นคง',
      phone: '02-789-0123',
      email: 'medtech@bbraun.co.th',
      address: 'เลขที่ 999/9 อาคารดิ ออฟฟิศเศส แอท เซ็นทรัลเวิลด์ ชั้น 28 ถนนพระราม 1 ปทุมวัน กรุงเทพฯ 10330',
      province: 'กรุงเทพมหานคร',
      postalCode: '10330',
      rating: 'A',
      score: 95,
      onTimeRate: 96,
      status: 'ACTIVE',
      productsSupplied: ['MED-NSS-1000', 'MED-GAU-44', 'MED-NYL-030', 'MED-IVC-022'],
      notes: 'ผู้จำหน่ายอุปกรณ์ผ่าตัด สารน้ำทางการแพทย์ และเข็มสวนหลอดเลือด'
    }
  ],

  // --- 10.2 SUPPLIER CONTRACT PRODUCTS & CATALOG PRICING ---
  supplierProducts: [
    { id: 1, supplierId: 1, productId: 1, productCode: 'MED-CLV-250', contractPrice: 420.00, leadTimeDays: 2, minOrderQty: 5 },
    { id: 2, supplierId: 1, productId: 4, productCode: 'MED-DEX-010', contractPrice: 200.00, leadTimeDays: 3, minOrderQty: 5 },
    { id: 3, supplierId: 2, productId: 2, productCode: 'MED-ENR-050', contractPrice: 280.00, leadTimeDays: 2, minOrderQty: 5 },
    { id: 4, supplierId: 3, productId: 3, productCode: 'MED-MLX-015', contractPrice: 350.00, leadTimeDays: 3, minOrderQty: 3 },
    { id: 5, supplierId: 4, productId: 5, productCode: 'MED-BRV-020', contractPrice: 500.00, leadTimeDays: 2, minOrderQty: 10 },
    { id: 6, supplierId: 5, productId: 7, productCode: 'MED-NSS-1000', contractPrice: 42.00, leadTimeDays: 2, minOrderQty: 20 },
    { id: 7, supplierId: 5, productId: 8, productCode: 'MED-GAU-44', contractPrice: 85.00, leadTimeDays: 1, minOrderQty: 10 },
    { id: 8, supplierId: 5, productId: 9, productCode: 'MED-NYL-030', contractPrice: 110.00, leadTimeDays: 2, minOrderQty: 10 },
    { id: 9, supplierId: 5, productId: 10, productCode: 'MED-IVC-022', contractPrice: 18.00, leadTimeDays: 2, minOrderQty: 25 }
  ],

  // --- 10.3 SUPPLIER DOCUMENTS & CERTIFICATES ---
  supplierDocuments: [
    { id: 1, supplierId: 1, documentType: 'GMP_CERTIFICATE', title: 'ใบรับรองมาตรฐานการผลิตยา (GMP Certificate)', fileReference: 'DOC-ZOETIS-GMP-2025.pdf', issuedDate: '2025-01-10', expiryDate: '2028-01-09', status: 'VERIFIED' },
    { id: 2, supplierId: 1, documentType: 'COMMERCIAL_REGISTRATION', title: 'หนังสือรับรองนิติบุคคล กรมพัฒนาธุรกิจการค้า', fileReference: 'DOC-ZOETIS-DBD-2026.pdf', issuedDate: '2026-01-05', expiryDate: '2027-01-04', status: 'VERIFIED' },
    { id: 3, supplierId: 5, documentType: 'ISO_13485', title: 'ใบรับรองระบบคุณภาพเครื่องมือแพทย์ ISO 13485', fileReference: 'DOC-BBRAUN-ISO13485.pdf', issuedDate: '2024-06-15', expiryDate: '2027-06-14', status: 'VERIFIED' }
  ],

  // --- 10.4 PURCHASE REQUISITIONS (PR) ---
  purchaseRequisitions: [
    {
      id: 1,
      requisitionNumber: 'PR-202603-001',
      department: 'Pharmacy (ห้องยา)',
      requestedBy: 'ภก. อานนท์ เวชสิทธิ์',
      requestedAt: '2026-03-01 09:30',
      urgency: 'HIGH',
      reason: 'สต็อกยาต้านเชื้อ Enrofloxacin และสารน้ำ NSS ลดลงต่ำกว่าเกณฑ์ความปลอดภัย',
      status: 'CONVERTED_TO_PO',
      convertedPoNumber: 'PO-202603-002',
      items: [
        { productId: 2, productCode: 'MED-ENR-050', name: 'Enrofloxacin 50mg', requestedQty: 10, unit: 'กล่อง', estimatedPrice: 280 },
        { productId: 7, productCode: 'MED-NSS-1000', name: '0.9% Normal Saline 1,000 ml', requestedQty: 30, unit: 'ขวด', estimatedPrice: 42 }
      ]
    },
    {
      id: 2,
      requisitionNumber: 'PR-202603-002',
      department: 'Surgery & OR (ห้องผ่าตัด)',
      requestedBy: 'น.สพ. วุฒิชัย เจริญสุข',
      requestedAt: '2026-03-02 10:15',
      urgency: 'URGENT',
      reason: 'สำรองไหมเย็บแผล Nylon 3-0 และ IV Catheter 22G สำหรับคิวผ่าตัดสัปดาห์นี้',
      status: 'PENDING_APPROVAL',
      convertedPoNumber: null,
      items: [
        { productId: 9, productCode: 'MED-NYL-030', name: 'Nylon 3-0 Cutting Suture', requestedQty: 25, unit: 'ซอง', estimatedPrice: 110 },
        { productId: 10, productCode: 'MED-IVC-022', name: 'IV Catheter 22G', requestedQty: 50, unit: 'ชิ้น', estimatedPrice: 18 }
      ]
    }
  ],

  // --- 10.5 RFQ & QUOTATION COMPARISON DATASETS ---
  rfqQuotations: [
    {
      id: 1,
      requisitionId: 2,
      prNumber: 'PR-202603-002',
      supplierId: 5,
      supplierCode: 'SUP-005',
      supplierName: 'บริษัท บี. บราวน์ (ประเทศไทย) จำกัด (B. Braun)',
      quotationNumber: 'QT-BB-2026-881',
      rating: 'A',
      onTimeRate: 96,
      paymentTerms: 'Credit 30 วัน',
      leadTimeDays: 2,
      isRecommended: true,
      items: [
        { productCode: 'MED-NYL-030', name: 'Nylon 3-0 Cutting Suture', qty: 25, unitPrice: 110.00, lineTotal: 2750.00 },
        { productCode: 'MED-IVC-022', name: 'IV Catheter 22G', qty: 50, unitPrice: 18.00, lineTotal: 900.00 }
      ],
      subtotal: 3650.00,
      vat: 255.50,
      grandTotal: 3905.50
    },
    {
      id: 2,
      requisitionId: 2,
      prNumber: 'PR-202603-002',
      supplierId: 3,
      supplierCode: 'SUP-003',
      supplierName: 'บริษัท โบริงเกอร์ อินเกลไฮม์ (Boehringer Ingelheim)',
      quotationNumber: 'QT-BI-2026-402',
      rating: 'B+',
      onTimeRate: 91,
      paymentTerms: 'Credit 30 วัน',
      leadTimeDays: 4,
      isRecommended: false,
      items: [
        { productCode: 'MED-NYL-030', name: 'Nylon 3-0 Cutting Suture', qty: 25, unitPrice: 118.00, lineTotal: 2950.00 },
        { productCode: 'MED-IVC-022', name: 'IV Catheter 22G', qty: 50, unitPrice: 20.00, lineTotal: 1000.00 }
      ],
      subtotal: 3950.00,
      vat: 276.50,
      grandTotal: 4226.50
    }
  ],

  // --- 10.6 PURCHASE ORDERS (PO) ---
  purchaseOrders: [
    {
      id: 1,
      poNumber: 'PO-202603-001',
      supplierId: 1,
      supplierName: 'บริษัท โซเอทิส (ประเทศไทย) จำกัด (Zoetis)',
      orderedAt: '2026-02-28 11:00',
      expectedDelivery: '2026-03-02',
      status: 'PARTIAL_RECEIVED', // DRAFT | APPROVED | SENT | PARTIAL_RECEIVED | COMPLETED | CANCELLED
      paymentTerms: 'Credit 30 วัน',
      subtotal: 6200.00,
      taxRate: 0.07,
      taxAmount: 434.00,
      grandTotal: 6634.00,
      notes: 'ส่งมอบ ณ คลังเวชภัณฑ์ชั้น 1 สาขากรุงเทพ-สุขุมวิท 71',
      items: [
        { productId: 1, productCode: 'MED-CLV-250', name: 'Clavamox 250mg', orderedQty: 10, receivedQty: 10, unitPrice: 420.00, lineTotal: 4200.00, unit: 'กล่อง' },
        { productId: 4, productCode: 'MED-DEX-010', name: 'Dexoryl Ear Drops 10g', orderedQty: 10, receivedQty: 0, unitPrice: 200.00, lineTotal: 2000.00, unit: 'หลอด' }
      ]
    },
    {
      id: 2,
      poNumber: 'PO-202603-002',
      supplierId: 5,
      supplierName: 'บริษัท บี. บราวน์ (ประเทศไทย) จำกัด (B. Braun)',
      orderedAt: '2026-03-01 14:00',
      expectedDelivery: '2026-03-04',
      status: 'APPROVED',
      paymentTerms: 'Credit 30 วัน',
      subtotal: 1260.00,
      taxRate: 0.07,
      taxAmount: 88.20,
      grandTotal: 1348.20,
      notes: 'ส่งมอบสารน้ำ NSS 1,000ml ล็อตใหม่ล่าสุด',
      items: [
        { productId: 7, productCode: 'MED-NSS-1000', name: '0.9% Normal Saline 1,000 ml', orderedQty: 30, receivedQty: 0, unitPrice: 42.00, lineTotal: 1260.00, unit: 'ขวด' }
      ]
    },
    {
      id: 3,
      poNumber: 'PO-202603-003',
      supplierId: 4,
      supplierName: 'บริษัท เอ็มเอสดี แอนิมอล เฮลธ์ (MSD / Bravecto)',
      orderedAt: '2026-03-02 09:00',
      expectedDelivery: '2026-03-05',
      status: 'SENT',
      paymentTerms: 'Credit 60 วัน',
      subtotal: 7500.00,
      taxRate: 0.07,
      taxAmount: 525.00,
      grandTotal: 8025.00,
      notes: 'สั่งซื้อยากันเห็บหมัด Bravecto 20-40kg',
      items: [
        { productId: 5, productCode: 'MED-BRV-020', name: 'Bravecto Chewable 20-40kg', orderedQty: 15, receivedQty: 0, unitPrice: 500.00, lineTotal: 7500.00, unit: 'กล่อง' }
      ]
    }
  ],

  // --- 10.7 GOODS RECEIPTS (GR) ---
  goodsReceipts: [
    {
      id: 1,
      receiptNumber: 'GR-202603-001',
      poNumber: 'PO-202603-001',
      supplierName: 'บริษัท โซเอทิส (ประเทศไทย) จำกัด (Zoetis)',
      receivedAt: '2026-03-02 11:30',
      receivedBy: 'ภก. อานนท์ เวชสิทธิ์',
      status: 'COMPLETED',
      items: [
        { productId: 1, productCode: 'MED-CLV-250', name: 'Clavamox 250mg', receivedQty: 10, rejectedQty: 0, lotNumber: 'LOT-CLV-2026B', expiryDate: '2027-12-31', unitCost: 420.00, totalCost: 4200.00 }
      ]
    }
  ],

  // --- 10.8 SUPPLIER INVOICES (Formal Billing Ledger) ---
  supplierInvoices: [
    {
      id: 1,
      invoiceNumber: 'INV-ZOETIS-88219',
      supplierId: 1,
      supplierName: 'บริษัท โซเอทิส (ประเทศไทย) จำกัด (Zoetis)',
      poNumber: 'PO-202603-001',
      receiptNumber: 'GR-202603-001',
      invoiceDate: '2026-03-02',
      dueDate: '2026-04-01',
      subtotal: 4200.00,
      taxAmount: 294.00,
      grandTotal: 4494.00,
      status: 'MATCHED', // PENDING_MATCH | MATCHED | PAID
      paymentTerms: 'Credit 30 วัน'
    }
  ],

  supplierInvoiceItems: [
    {
      id: 1,
      supplierInvoiceId: 1,
      productId: 1,
      productCode: 'MED-CLV-250',
      quantity: 10,
      unitPrice: 420.00,
      lineTotal: 4200.00
    }
  ],

  // --- 10.9 THREE-WAY DOCUMENT MATCHINGS ---
  threeWayMatchings: [
    {
      id: 1,
      poNumber: 'PO-202603-001',
      receiptNumber: 'GR-202603-001',
      invoiceNumber: 'INV-ZOETIS-88219',
      supplierName: 'บริษัท โซเอทิส (ประเทศไทย) จำกัด (Zoetis)',
      poAmount: 4200.00,
      receivedAmount: 4200.00,
      invoiceAmount: 4200.00,
      variance: 0.00,
      status: 'MATCHED_100', // MATCHED_100 | VARIANCE_DETECTED | PENDING_INVOICE
      matchedAt: '2026-03-02 11:45',
      verifiedBy: 'น.สพ. วุฒิชัย เจริญสุข'
    }
  ],

  // --- 10.10 SUPPLIER CLAIMS & RETURNS (Damaged/Rejected Intake Tickets) ---
  supplierClaims: [
    {
      id: 1,
      claimNumber: 'CLM-202602-001',
      poNumber: 'PO-202602-015',
      receiptNumber: 'GR-202602-014',
      supplierId: 5,
      supplierName: 'บริษัท บี. บราวน์ (ประเทศไทย) จำกัด (B. Braun)',
      productId: 7,
      productCode: 'MED-NSS-1000',
      productName: '0.9% Normal Saline 1,000 ml',
      rejectedQty: 3,
      unit: 'ขวด',
      unitPrice: 42.00,
      totalClaimAmount: 126.00,
      defectReason: 'บรรจุภัณฑ์แตกรั่วระหว่างการขนส่ง (Packaging Leaked)',
      status: 'RESOLVED_REPLACEMENT', // PENDING_SUPPLIER | RESOLVED_REPLACEMENT | RESOLVED_CREDIT_NOTE
      createdAt: '2026-02-25 14:20',
      createdBy: 'ภก. อานนท์ เวชสิทธิ์',
      resolvedAt: '2026-02-27 10:00',
      resolutionNotes: 'คู่ค้านำสินค้าล็อตใหม่มาเปลี่ยนทดแทนเรียบร้อยแล้ว'
    }
  ]
});
