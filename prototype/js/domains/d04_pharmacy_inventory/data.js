Object.assign(state, {
  activeInventorySubTab: 'master', // 'master' | 'ledger' | 'transfers' | 'batches'
  activeDispenseFilter: 'all',

  // 1. pharmacy.warehouses (Warehouse Master)
  warehouses: [
    {
      id: 1,
      warehouse_code: 'WH-MAIN',
      warehouse_name: 'คลังยาหลักห้องตรวจ',
      warehouse_type: 'MAIN_PHARMACY',
      temperature_desc: 'อุณหภูมิห้องปกติ (15-25°C)',
      status: 'ACTIVE'
    },
    {
      id: 2,
      warehouse_code: 'WH-COLD',
      warehouse_name: 'ตู้เย็นเก็บวัคซีนและชีววัตถุ (Cold Chain)',
      warehouse_type: 'COLD_CHAIN',
      temperature_desc: 'ควบคุมอุณหภูมิ 2-8°C',
      status: 'ACTIVE'
    },
    {
      id: 3,
      warehouse_code: 'WH-OR',
      warehouse_name: 'ตู้ยาและเวชภัณฑ์ห้องผ่าตัด (OR Storeroom)',
      warehouse_type: 'SURGERY',
      temperature_desc: 'ห้องปลอดเชื้อ อุณหภูมิ 20-22°C',
      status: 'ACTIVE'
    },
    {
      id: 4,
      warehouse_code: 'WH-WARD',
      warehouse_name: 'ตู้ยาประจำวอร์ดสัตว์ป่วยใน (IPD Ward)',
      warehouse_type: 'WARD',
      temperature_desc: 'อุณหภูมิห้องปกติ',
      status: 'ACTIVE'
    }
  ],

  // 2. pharmacy.warehouse_locations (Location / Shelf / Bin Master)
  warehouseLocations: [
    { id: 1, warehouse_id: 1, location_code: 'SHELF-A1', location_name: 'ชั้นวางยาปฏิชีวนะ A1' },
    { id: 2, warehouse_id: 1, location_code: 'SHELF-B2', location_name: 'ชั้นวางยาลดอักเสบ B2' },
    { id: 3, warehouse_id: 2, location_code: 'FRIDGE-V1', location_name: 'ตู้เย็นวัคซีน ชั้นบน (2-8°C)' },
    { id: 4, warehouse_id: 2, location_code: 'FRIDGE-V2', location_name: 'ตู้เย็นเซรุ่ม ชั้นล่าง (2-8°C)' },
    { id: 5, warehouse_id: 3, location_code: 'OR-CABINET-S1', location_name: 'ตู้เวชภัณฑ์ผ่าตัด S1' },
    { id: 6, warehouse_id: 4, location_code: 'WARD-BOX-W1', location_name: 'กล่องยาฉุกเฉินวอร์ด W1' }
  ],

  // 3. pharmacy.products (Medication & Inventory Item Master)
  products: [
    {
      id: 1,
      product_code: 'MED-CLV-250',
      product_name: 'Amoxicillin + Clavulanate (Clavamox)',
      generic_name: 'Amoxicillin / Clavulanic Acid',
      brand_name: 'Clavamox (Zoetis)',
      product_type: 'MEDICATION',
      category: 'ยาสัตว์เลี้ยง',
      dosage_form: 'ยาเม็ด (Tablet)',
      strength: '250mg',
      base_unit: 'เม็ด',
      packaging: 'กล่องละ 10 แผง (แผงละ 10 เม็ด)',
      unit_conversion: { purchase_unit: 'กล่อง', factor: 100, dispense_unit: 'เม็ด' },
      minimum_stock: 50,
      reorder_point: 80,
      unit_price: 28.00,
      unit_cost: 14.50,
      status: 'ACTIVE',
      requires_prescription: true,
      storage_condition: 'อุณหภูมิห้อง ไม่เกิน 25°C',
      is_cold_chain: false,
      is_lot_tracked: true,
      is_expiry_tracked: true,
      default_supplier_id: 1 // Zoetis
    },
    {
      id: 2,
      product_code: 'MED-ENR-050',
      product_name: 'Enrofloxacin 50mg (Baytril)',
      generic_name: 'Enrofloxacin',
      brand_name: 'Baytril (Bayer)',
      product_type: 'MEDICATION',
      category: 'ยาสัตว์เลี้ยง',
      dosage_form: 'ยาเม็ด (Tablet)',
      strength: '50mg',
      base_unit: 'เม็ด',
      packaging: 'กล่องละ 10 แผง (แผงละ 10 เม็ด)',
      unit_conversion: { purchase_unit: 'กล่อง', factor: 100, dispense_unit: 'เม็ด' },
      minimum_stock: 40,
      reorder_point: 60,
      unit_price: 32.00,
      unit_cost: 16.00,
      status: 'ACTIVE',
      requires_prescription: true,
      storage_condition: 'อุณหภูมิห้อง พ้นแสงแดด',
      is_cold_chain: false,
      is_lot_tracked: true,
      is_expiry_tracked: true,
      default_supplier_id: 2 // Elanco
    },
    {
      id: 3,
      product_code: 'MED-MLX-015',
      product_name: 'Meloxicam Oral Suspension 1.5mg/ml',
      generic_name: 'Meloxicam',
      brand_name: 'Metacam (Boehringer)',
      product_type: 'MEDICATION',
      category: 'ยาสัตว์เลี้ยง',
      dosage_form: 'ยาน้ำแขวนตะกอน (Oral Suspension)',
      strength: '1.5mg/ml 15ml',
      base_unit: 'ขวด',
      packaging: '1 ขวดพร้อมกระบอกฉีดยาตวงน้ำหนัก',
      unit_conversion: { purchase_unit: 'ขวด', factor: 1, dispense_unit: 'ขวด' },
      minimum_stock: 15,
      reorder_point: 20,
      unit_price: 450.00,
      unit_cost: 260.00,
      status: 'ACTIVE',
      requires_prescription: true,
      storage_condition: 'อุณหภูมิห้อง',
      is_cold_chain: false,
      is_lot_tracked: true,
      is_expiry_tracked: true,
      default_supplier_id: 3 // Boehringer
    },
    {
      id: 4,
      product_code: 'MED-DEX-010',
      product_name: 'Dexoryl Ear Drops 10g',
      generic_name: 'Gentamicin + Dexamethasone',
      brand_name: 'Dexoryl (Virbac)',
      product_type: 'MEDICATION',
      category: 'ยาสัตว์เลี้ยง',
      dosage_form: 'ยาหยอดหู (Ear Drops)',
      strength: '10g',
      base_unit: 'หลอด',
      packaging: '1 หลอดในกล่อง',
      unit_conversion: { purchase_unit: 'หลอด', factor: 1, dispense_unit: 'หลอด' },
      minimum_stock: 20,
      reorder_point: 30,
      unit_price: 380.00,
      unit_cost: 210.00,
      status: 'ACTIVE',
      requires_prescription: true,
      storage_condition: 'อุณหภูมิห้อง ไม่เกิน 25°C',
      is_cold_chain: false,
      is_lot_tracked: true,
      is_expiry_tracked: true,
      default_supplier_id: 1 // Zoetis
    },
    {
      id: 5,
      product_code: 'MED-BRV-020',
      product_name: 'Bravecto Chewable Dog 10-20kg',
      generic_name: 'Fluralaner',
      brand_name: 'Bravecto (MSD)',
      product_type: 'MEDICATION',
      category: 'ยาสัตว์เลี้ยง',
      dosage_form: 'ยาเคี้ยว (Chewable Tablet)',
      strength: '500mg',
      base_unit: 'กล่อง',
      packaging: '1 กล่องบรรจุ 1 เม็ดเคี้ยว',
      unit_conversion: { purchase_unit: 'กล่อง', factor: 1, dispense_unit: 'กล่อง' },
      minimum_stock: 10,
      reorder_point: 15,
      unit_price: 850.00,
      unit_cost: 580.00,
      status: 'ACTIVE',
      requires_prescription: false,
      storage_condition: 'อุณหภูมิห้อง',
      is_cold_chain: false,
      is_lot_tracked: true,
      is_expiry_tracked: true,
      default_supplier_id: 3 // Boehringer
    },
    {
      id: 6,
      product_code: 'VAC-DHP-001',
      product_name: 'DHPPi + L Canine Vaccine (5-in-1)',
      generic_name: 'Core Canine Vaccine',
      brand_name: 'Nobivac DHPPi+L',
      product_type: 'VACCINE',
      category: 'วัคซีน',
      dosage_form: 'ยาฉีดชีววัตถุ (Injectable Lyophilized)',
      strength: '1 Dose / Vial',
      base_unit: 'โดส',
      packaging: 'กล่องละ 10 โดส (10 Vials + 10 Diluents)',
      unit_conversion: { purchase_unit: 'กล่อง', factor: 10, dispense_unit: 'โดส' },
      minimum_stock: 25,
      reorder_point: 40,
      unit_price: 350.00,
      unit_cost: 180.00,
      status: 'ACTIVE',
      requires_prescription: true,
      storage_condition: 'ตู้เย็น 2°C - 8°C (Cold Chain ห้ามแช่แข็ง)',
      is_cold_chain: true,
      cold_chain_min_c: 2.0,
      cold_chain_max_c: 8.0,
      is_lot_tracked: true,
      is_expiry_tracked: true,
      default_supplier_id: 1 // Zoetis
    },
    {
      id: 7,
      product_code: 'MED-NSS-1000',
      product_name: '0.9% Normal Saline Solution 1,000ml',
      generic_name: 'Sodium Chloride 0.9%',
      brand_name: 'A-NSS (Thai Otsuka)',
      product_type: 'SUPPLY',
      category: 'เวชภัณฑ์',
      dosage_form: 'สารน้ำทางหลอดเลือด (IV Infusion)',
      strength: '1,000ml',
      base_unit: 'ขวด',
      packaging: 'ลังละ 12 ขวด',
      unit_conversion: { purchase_unit: 'ลัง', factor: 12, dispense_unit: 'ขวด' },
      minimum_stock: 30,
      reorder_point: 50,
      unit_price: 90.00,
      unit_cost: 42.00,
      status: 'ACTIVE',
      requires_prescription: true,
      storage_condition: 'อุณหภูมิห้อง ไม่เกิน 30°C',
      is_cold_chain: false,
      is_lot_tracked: true,
      is_expiry_tracked: true,
      default_supplier_id: 2 // Elanco
    },
    {
      id: 8,
      product_code: 'MED-PVD-450',
      product_name: 'Povidone Iodine 10% Solution 450ml',
      generic_name: 'Povidone Iodine',
      brand_name: 'Betadine Antiseptic',
      product_type: 'SUPPLY',
      category: 'เวชภัณฑ์',
      dosage_form: 'น้ำยาฆ่าเชื้อภายนอก (Topical Antiseptic)',
      strength: '10% 450ml',
      base_unit: 'ขวด',
      packaging: '1 ขวด',
      unit_conversion: { purchase_unit: 'ขวด', factor: 1, dispense_unit: 'ขวด' },
      minimum_stock: 10,
      reorder_point: 15,
      unit_price: 180.00,
      unit_cost: 95.00,
      status: 'ACTIVE',
      requires_prescription: false,
      storage_condition: 'อุณหภูมิห้อง พ้นแสงแดด',
      is_cold_chain: false,
      is_lot_tracked: true,
      is_expiry_tracked: true,
      default_supplier_id: 2
    },
    {
      id: 9,
      product_code: 'MED-PRO-020',
      product_name: 'Propofol 1% 20ml (Lipuro)',
      generic_name: 'Propofol',
      brand_name: 'Fresofol (B.Braun)',
      product_type: 'MEDICATION',
      category: 'ยาสัตว์เลี้ยง',
      dosage_form: 'ยาฉีดสลบ (Injectable Emulsion)',
      strength: '10mg/ml 20ml',
      base_unit: 'แอมพูล',
      packaging: 'กล่องละ 5 แอมพูล',
      unit_conversion: { purchase_unit: 'กล่อง', factor: 5, dispense_unit: 'แอมพูล' },
      minimum_stock: 12,
      reorder_point: 20,
      unit_price: 320.00,
      unit_cost: 165.00,
      status: 'ACTIVE',
      requires_prescription: true,
      storage_condition: 'อุณหภูมิห้อง 15-25°C ห้ามแช่แข็ง',
      is_cold_chain: false,
      is_lot_tracked: true,
      is_expiry_tracked: true,
      default_supplier_id: 3
    },
    {
      id: 10,
      product_code: 'SUR-BLD-015',
      product_name: 'Surgical Blade No. 15 (Sterile)',
      generic_name: 'Carbon Steel Surgical Scalpel Blade',
      brand_name: 'Swann-Morton',
      product_type: 'SUPPLY',
      category: 'เวชภัณฑ์',
      dosage_form: 'ใบมีดผ่าตัดปลอดเชื้อ (Sterile Blade)',
      strength: 'No. 15',
      base_unit: 'ชิ้น',
      packaging: 'กล่องละ 100 ชิ้น บรรจุซองฟอยล์เดี่ยว',
      unit_conversion: { purchase_unit: 'กล่อง', factor: 100, dispense_unit: 'ชิ้น' },
      minimum_stock: 50,
      reorder_point: 80,
      unit_price: 15.00,
      unit_cost: 7.50,
      status: 'ACTIVE',
      requires_prescription: false,
      storage_condition: 'แห้งสนิท หลีกเลี่ยงความชื้น',
      is_cold_chain: false,
      is_lot_tracked: true,
      is_expiry_tracked: true,
      default_supplier_id: 2
    }
  ],

  // 4. pharmacy.inventory_lots (Batch & Expiry Date Management)
  inventoryLots: [
    {
      id: 1,
      product_id: 1,
      lot_number: 'LOT-AMX-2026A',
      manufactured_date: '2025-06-15',
      expiry_date: '2026-06-30', // Near expiry (< 4 months)
      received_date: '2025-07-01',
      unit_cost: 14.50,
      quantity_initial: 200,
      status: 'ACTIVE', // 'ACTIVE' | 'QUARANTINED' | 'RECALLED' | 'EXPIRED'
      quarantine_reason: null
    },
    {
      id: 2,
      product_id: 1,
      lot_number: 'LOT-AMX-2027B',
      manufactured_date: '2025-11-20',
      expiry_date: '2027-11-30',
      received_date: '2025-12-05',
      unit_cost: 15.00,
      quantity_initial: 300,
      status: 'ACTIVE',
      quarantine_reason: null
    },
    {
      id: 3,
      product_id: 2,
      lot_number: 'LOT-ENR-2026E',
      manufactured_date: '2025-04-10',
      expiry_date: '2026-05-15', // Near expiry
      received_date: '2025-05-02',
      unit_cost: 16.00,
      quantity_initial: 150,
      status: 'ACTIVE',
      quarantine_reason: null
    },
    {
      id: 4,
      product_id: 3,
      lot_number: 'LOT-MLX-2027A',
      manufactured_date: '2025-10-01',
      expiry_date: '2027-10-15',
      received_date: '2025-10-20',
      unit_cost: 260.00,
      quantity_initial: 30,
      status: 'ACTIVE',
      quarantine_reason: null
    },
    {
      id: 5,
      product_id: 4,
      lot_number: 'LOT-DEX-2027C',
      manufactured_date: '2025-08-15',
      expiry_date: '2027-08-20',
      received_date: '2025-09-01',
      unit_cost: 210.00,
      quantity_initial: 40,
      status: 'ACTIVE',
      quarantine_reason: null
    },
    {
      id: 6,
      product_id: 5,
      lot_number: 'LOT-BRV-2027D',
      manufactured_date: '2025-09-10',
      expiry_date: '2027-09-30',
      received_date: '2025-10-05',
      unit_cost: 580.00,
      quantity_initial: 25,
      status: 'ACTIVE',
      quarantine_reason: null
    },
    {
      id: 7,
      product_id: 6,
      lot_number: 'LOT-VAC-2026X',
      manufactured_date: '2025-05-20',
      expiry_date: '2026-05-31', // Near expiry vaccine
      received_date: '2025-06-01',
      unit_cost: 180.00,
      quantity_initial: 60,
      status: 'ACTIVE',
      quarantine_reason: null
    },
    {
      id: 8,
      product_id: 6,
      lot_number: 'LOT-VAC-2027Y',
      manufactured_date: '2025-12-01',
      expiry_date: '2027-12-15',
      received_date: '2025-12-10',
      unit_cost: 185.00,
      quantity_initial: 100,
      status: 'ACTIVE',
      quarantine_reason: null
    },
    {
      id: 9,
      product_id: 7,
      lot_number: 'LOT-NSS-2026Q',
      manufactured_date: '2025-03-01',
      expiry_date: '2026-04-15', // Near expiry
      received_date: '2025-03-15',
      unit_cost: 42.00,
      quantity_initial: 120,
      status: 'QUARANTINED', // Sample quarantined batch
      quarantine_reason: 'พบตะกอนผิดปกติในบรรจุภัณฑ์ อยู่ระหว่างรอตรวจสอบผลแล็บ'
    }
  ],

  // 5. pharmacy.stock_balances (Inventory Balances per Product, Lot, and Warehouse)
  stockBalances: [
    {
      id: 1,
      product_id: 1,
      lot_id: 1,
      warehouse_id: 1,
      warehouse_name: 'คลังยาหลักห้องตรวจ',
      location_id: 1,
      location_code: 'SHELF-A1',
      quantity_on_hand: 25,
      quantity_reserved: 0,
      quantity_available: 25
    },
    {
      id: 2,
      product_id: 1,
      lot_id: 2,
      warehouse_id: 1,
      warehouse_name: 'คลังยาหลักห้องตรวจ',
      location_id: 1,
      location_code: 'SHELF-A1',
      quantity_on_hand: 120,
      quantity_reserved: 10,
      quantity_available: 110
    },
    {
      id: 3,
      product_id: 2,
      lot_id: 3,
      warehouse_id: 1,
      warehouse_name: 'คลังยาหลักห้องตรวจ',
      location_id: 1,
      location_code: 'SHELF-A1',
      quantity_on_hand: 18, // Below min stock (40) => Low stock!
      quantity_reserved: 0,
      quantity_available: 18
    },
    {
      id: 4,
      product_id: 3,
      lot_id: 4,
      warehouse_id: 1,
      warehouse_name: 'คลังยาหลักห้องตรวจ',
      location_id: 2,
      location_code: 'SHELF-B2',
      quantity_on_hand: 22,
      quantity_reserved: 2,
      quantity_available: 20
    },
    {
      id: 5,
      product_id: 4,
      lot_id: 5,
      warehouse_id: 1,
      warehouse_name: 'คลังยาหลักห้องตรวจ',
      location_id: 2,
      location_code: 'SHELF-B2',
      quantity_on_hand: 28,
      quantity_reserved: 0,
      quantity_available: 28
    },
    {
      id: 6,
      product_id: 5,
      lot_id: 6,
      warehouse_id: 1,
      warehouse_name: 'คลังยาหลักห้องตรวจ',
      location_id: 2,
      location_code: 'SHELF-B2',
      quantity_on_hand: 14,
      quantity_reserved: 0,
      quantity_available: 14
    },
    {
      id: 7,
      product_id: 6,
      lot_id: 7,
      warehouse_id: 2,
      warehouse_name: 'ตู้เย็นเก็บวัคซีนและชีววัตถุ (Cold Chain)',
      location_id: 3,
      location_code: 'FRIDGE-V1',
      quantity_on_hand: 12, // Below min stock (25) => Low stock!
      quantity_reserved: 0,
      quantity_available: 12
    },
    {
      id: 8,
      product_id: 6,
      lot_id: 8,
      warehouse_id: 2,
      warehouse_name: 'ตู้เย็นเก็บวัคซีนและชีววัตถุ (Cold Chain)',
      location_id: 3,
      location_code: 'FRIDGE-V1',
      quantity_on_hand: 40,
      quantity_reserved: 5,
      quantity_available: 35
    },
    {
      id: 9,
      product_id: 7,
      lot_id: 9,
      warehouse_id: 1,
      warehouse_name: 'คลังยาหลักห้องตรวจ',
      location_id: 2,
      location_code: 'SHELF-B2',
      quantity_on_hand: 10,
      quantity_reserved: 0,
      quantity_available: 0 // Quarantined lot, 0 available!
    }
  ],

  // 6. pharmacy.stock_movements (Stock Ledger & Audit Trail)
  stockMovements: [
    {
      id: 1,
      movement_number: 'MOV-2026-0001',
      product_id: 5,
      lot_id: 6,
      warehouse_name: 'คลังยาหลักห้องตรวจ',
      movement_type: 'DISPENSE',
      quantity: -1,
      unit_cost: 580.00,
      reference_type: 'DISPENSING',
      reference_code: 'DSP-2026-0003',
      movement_at: '2026-03-02 09:25',
      performed_by: 'ภก. พรรณพร เวชชวิศิษฏ์',
      notes: 'จ่ายยาป้องกันเห็บหมัดให้ น้องลัคกี้ (Golden Retriever)'
    },
    {
      id: 2,
      movement_number: 'MOV-2026-0002',
      product_id: 1,
      lot_id: 1,
      warehouse_name: 'คลังยาหลักห้องตรวจ',
      movement_type: 'RECEIVE',
      quantity: 200,
      unit_cost: 14.50,
      reference_type: 'GOODS_RECEIPT',
      reference_code: 'GR-202603-001',
      movement_at: '2026-03-02 11:30',
      performed_by: 'ภก. อานนท์ เวชสิทธิ์',
      notes: 'ตรวจรับสินค้าเข้าคลังจากใบสั่งซื้อ PO-202603-001 (Zoetis)'
    },
    {
      id: 3,
      movement_number: 'MOV-2026-0003',
      product_id: 7,
      lot_id: 9,
      warehouse_name: 'คลังยาหลักห้องตรวจ',
      movement_type: 'TRANSFER_OUT',
      quantity: -5,
      unit_cost: 42.00,
      reference_type: 'STOCK_TRANSFER',
      reference_code: 'TR-2026-001',
      movement_at: '2026-03-02 08:30',
      performed_by: 'ภก. อานนท์ เวชสิทธิ์',
      notes: 'โอนย้ายสารน้ำ NSS เข้าตู้เวชภัณฑ์ห้องผ่าตัด OR'
    },
    {
      id: 4,
      movement_number: 'MOV-2026-0004',
      product_id: 7,
      lot_id: 9,
      warehouse_name: 'ตู้ยาและเวชภัณฑ์ห้องผ่าตัด (OR Storeroom)',
      movement_type: 'TRANSFER_IN',
      quantity: 5,
      unit_cost: 42.00,
      reference_type: 'STOCK_TRANSFER',
      reference_code: 'TR-2026-001',
      movement_at: '2026-03-02 08:35',
      performed_by: 'น.สพ. วรภัทร ชัยมงคล',
      notes: 'รับโอนสารน้ำ NSS จากคลังยาหลักเรียบร้อย'
    },
    {
      id: 5,
      movement_number: 'MOV-2026-0005',
      product_id: 8,
      lot_id: 5,
      warehouse_name: 'ตู้ยาและเวชภัณฑ์ห้องผ่าตัด (OR Storeroom)',
      movement_type: 'INTERNAL_ISSUE',
      quantity: -2,
      unit_cost: 95.00,
      reference_type: 'STOCK_ISSUE',
      reference_code: 'ISS-2026-001',
      movement_at: '2026-03-02 10:15',
      performed_by: 'น.สพ. วรภัทร ชัยมงคล',
      notes: 'เบิกใช้น้ำยา Betadine สำหรับเคสผ่าตัดกระเพาะปัสสาวะสุนัข'
    },
    {
      id: 6,
      movement_number: 'MOV-2026-0006',
      product_id: 2,
      lot_id: 3,
      warehouse_name: 'คลังยาหลักห้องตรวจ',
      movement_type: 'ADJUST_DEDUCT',
      quantity: -2,
      unit_cost: 16.00,
      reference_type: 'CYCLE_COUNT',
      reference_code: 'ADJ-2026-001',
      movement_at: '2026-03-01 17:00',
      performed_by: 'ภก. อานนท์ เวชสิทธิ์',
      notes: 'ตัดยอดแผงยาชำรุดเสียหายจากกล่องฉีกขาด'
    }
  ],

  // 7. pharmacy.stock_transfers (Inter-Warehouse Transfers)
  stockTransfers: [
    {
      id: 1,
      transfer_number: 'TR-2026-001',
      source_warehouse_id: 1,
      source_warehouse_name: 'คลังยาหลักห้องตรวจ',
      destination_warehouse_id: 3,
      destination_warehouse_name: 'ตู้ยาและเวชภัณฑ์ห้องผ่าตัด (OR Storeroom)',
      requested_by: 'น.สพ. วรภัทร ชัยมงคล (ศัลยแพทย์)',
      approved_by: 'ภก. อานนท์ เวชสิทธิ์ (หัวหน้าห้องยา)',
      transferred_at: '2026-03-02 08:35',
      status: 'COMPLETED',
      notes: 'โอนสารน้ำ NSS เตรียมพร้อมสำหรับเคสผ่าตัดศัลยกรรมช่วงเช้า',
      items: [
        {
          product_id: 7,
          product_name: '0.9% Normal Saline Solution 1,000ml',
          lot_id: 9,
          lot_number: 'LOT-NSS-2026Q',
          quantity: 5,
          unit: 'ขวด'
        }
      ]
    }
  ],

  // 8. pharmacy.stock_issues (Internal Clinical Stock Requisitions)
  internalStockIssues: [
    {
      id: 1,
      issue_number: 'ISS-2026-001',
      department: 'SURGERY (ห้องผ่าตัดใหญ่)',
      requested_by: 'น.สพ. วรภัทร ชัยมงคล (ศัลยแพทย์)',
      issued_by: 'ภก. อานนท์ เวชสิทธิ์',
      issued_at: '2026-03-02 10:15',
      purpose: 'เบิกใช้สำหรับหัตถการผ่าตัดกระเพาะปัสสาวะสุนัข (Cystotomy)',
      status: 'COMPLETED',
      items: [
        {
          product_id: 8,
          product_name: 'Povidone Iodine 10% Solution 450ml',
          lot_id: 5,
          quantity: 2,
          unit: 'ขวด'
        },
        {
          product_id: 10,
          product_name: 'Surgical Blade No. 15 (Sterile)',
          lot_id: 6,
          quantity: 5,
          unit: 'ชิ้น'
        }
      ]
    }
  ],

  // 9. pharmacy.dispensings (Pharmacy Dispensing Orders)
  dispensings: [
    {
      id: 1,
      dispensing_number: 'DSP-2026-0001',
      prescription_id: 1,
      encounter_number: 'ENC-2026-0001',
      queue_ticket_id: 1,
      pet_id: 1, // Brownie (บราวนี่) - Golden Retriever (แพ้ยา Enrofloxacin!)
      customer_id: 1,
      doctor_id: 1,
      status: 'WAITING_DISPENSE', // 'WAITING_DISPENSE' | 'DISPENSED' | 'RETURNED'
      created_at: '2026-03-02 10:25',
      dispensed_at: null,
      dispensed_by: null,
      diagnosis_summary: 'โรคหูชั้นนอกอักเสบจากเชื้อยีสต์ (Otitis Externa) และผิวหนังผื่นคัน',
      items: [
        {
          id: 1,
          product_id: 4, // Dexoryl Ear Drops
          dose: 'หยอดหูข้างละ 3-4 หยด',
          frequency: 'วันละ 2 ครั้ง',
          duration: 'ติดต่อกัน 14 วัน',
          quantity: 1,
          unit: 'หลอด',
          instructions: 'ทำความสะอาดช่องหูก่อนหยอดยา คลึงโคนหูเบาๆ 1 นาที เช้า-เย็น ห้ามใช้สำลีปั่นลึก',
          caution: '⚠️ เก็บในที่ร่ม อุณหภูมิไม่เกิน 25°C ห้ามโดนแสงแดดโดยตรง',
          selected_lot_id: 5,
          status: 'PENDING'
        },
        {
          id: 2,
          product_id: 1, // Clavamox 250mg
          dose: '1 เม็ดครึ่ง (375mg)',
          frequency: 'วันละ 2 ครั้ง',
          duration: '10 วัน',
          quantity: 20,
          unit: 'เม็ด',
          instructions: 'ป้อนหลังอาหารทันที เช้า-เย็น (ห่างกัน 12 ชม.) ทานยาให้ครบตามกำหนด',
          caution: '⚠️ ทานยาติดต่อกันจนหมด แม้อาการคันจะทุเลาลง เพื่อป้องกันเชื้อดื้อยา',
          selected_lot_id: 1, // FEFO recommends LOT-AMX-2026A
          status: 'PENDING'
        }
      ]
    },
    {
      id: 2,
      dispensing_number: 'DSP-2026-0002',
      prescription_id: 2,
      encounter_number: 'ENC-2026-0002',
      queue_ticket_id: 2,
      pet_id: 2, // Milo (ไมโล)
      customer_id: 2,
      doctor_id: 1,
      status: 'WAITING_DISPENSE',
      created_at: '2026-03-02 10:50',
      dispensed_at: null,
      dispensed_by: null,
      diagnosis_summary: 'ลำไส้อักเสบจากแบคทีเรียและภาวะขาดน้ำปานกลาง (Bacterial Enteritis)',
      items: [
        {
          id: 1,
          product_id: 1, // Clavamox
          dose: '1 เม็ด (250mg)',
          frequency: 'วันละ 2 ครั้ง',
          duration: '7 วัน',
          quantity: 14,
          unit: 'เม็ด',
          instructions: 'ป้อนครั้งละ 1 เม็ด หลังอาหารทันที เช้าและเย็น ทานยาให้ครบ 7 วัน',
          caution: '⚠️ ทานยาติดต่อกันจนหมดตามคำสั่งแพทย์ แม้อาการจะดีขึ้นแล้ว ห้ามหยุดยาเอง',
          selected_lot_id: 1, // FEFO recommends LOT-AMX-2026A
          status: 'PENDING'
        }
      ]
    },
    {
      id: 3,
      dispensing_number: 'DSP-2026-0003',
      prescription_id: null,
      encounter_number: 'ENC-2026-0000',
      queue_ticket_id: null,
      pet_id: 3, // Lucky (ลัคกี้)
      customer_id: 3,
      doctor_id: 2,
      status: 'DISPENSED',
      created_at: '2026-03-02 09:00',
      dispensed_at: '2026-03-02 09:25',
      dispensed_by: 'ภก. พรรณพร เวชชวิศิษฏ์ (เภสัชกรประจำคลินิก)',
      diagnosis_summary: 'ป้องกันเห็บหมัดและพยาธิหนอนหัวใจประจำไตรมาส',
      items: [
        {
          id: 3,
          product_id: 5, // Bravecto
          dose: '1 กล่อง (เคี้ยว)',
          frequency: 'ทุก 3 เดือน',
          duration: '1 ครั้ง',
          quantity: 1,
          unit: 'กล่อง',
          instructions: 'ให้สุนัขเคี้ยวกินพร้อมอาหาร หรือหลังอาหารทันที',
          caution: 'ป้องกันเห็บหมัดได้นาน 12 สัปดาห์',
          selected_lot_id: 6,
          status: 'DISPENSED'
        }
      ]
    }
  ]
});
