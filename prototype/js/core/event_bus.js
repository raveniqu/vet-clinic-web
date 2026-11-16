/**
 * VETCARE+ ERP - Central Cross-Domain Event Bus
 * Single Source of Truth (SSOT) Reactive Integration Layer
 * 
 * Provides decoupled publish-subscribe event communication across all 10 Domains:
 * D01 Customer & Pet, D02 Appointments & Queue, D03 EMR Clinical, D04 Pharmacy & Inventory,
 * D05 Lab & Imaging, D06 Surgery, D07 Billing & Payment, D08 Marketing CRM,
 * D09 Procurement, D10 Staff & HR.
 */

// 1. Centralized Domain Event Registry
const CLINIC_EVENTS = Object.freeze({
  // Domain 01: Customer & Pet
  PET_REGISTERED: 'D01:PET_REGISTERED',
  PET_UPDATED: 'D01:PET_UPDATED',
  CUSTOMER_REGISTERED: 'D01:CUSTOMER_REGISTERED',
  CUSTOMER_UPDATED: 'D01:CUSTOMER_UPDATED',
  OWNERSHIP_TRANSFERRED: 'D01:OWNERSHIP_TRANSFERRED',

  // Domain 02: Appointment & Queue
  APPOINTMENT_CREATED: 'D02:APPOINTMENT_CREATED',
  APPOINTMENT_CHECKED_IN: 'D02:APPOINTMENT_CHECKED_IN',
  QUEUE_STAGE_CHANGED: 'D02:QUEUE_STAGE_CHANGED',

  // Domain 03: Clinical EMR
  SOAP_ENCOUNTER_SAVED: 'D03:SOAP_ENCOUNTER_SAVED',

  // Domain 04: Pharmacy & Inventory
  DISPENSE_CONFIRMED: 'D04:DISPENSE_CONFIRMED',
  MEDICATION_RETURNED: 'D04:MEDICATION_RETURNED',
  STOCK_ADJUSTED: 'D04:STOCK_ADJUSTED',

  // Domain 05: Lab & Imaging
  DIAGNOSTIC_ORDER_CREATED: 'D05:DIAGNOSTIC_ORDER_CREATED',
  LAB_RESULT_VERIFIED: 'D05:LAB_RESULT_VERIFIED',

  // Domain 06: Surgery & Treatment
  SURGERY_SCHEDULED: 'D06:SURGERY_SCHEDULED',
  SURGERY_COMPLETED: 'D06:SURGERY_COMPLETED',

  // Domain 07: Billing & Payment
  CHARGE_CAPTURED: 'D07:CHARGE_CAPTURED',
  INVOICE_CREATED: 'D07:INVOICE_CREATED',
  PAYMENT_CONFIRMED: 'D07:PAYMENT_CONFIRMED',
  INVOICE_VOIDED: 'D07:INVOICE_VOIDED',

  // Domain 08: Marketing & CRM
  LEAD_CONVERTED: 'D08:LEAD_CONVERTED',
  LOYALTY_POINTS_EARNED: 'D08:LOYALTY_POINTS_EARNED',

  // Domain 09: Procurement
  GOODS_RECEIPT_CONFIRMED: 'D09:GOODS_RECEIPT_CONFIRMED',

  // Domain 10: Staff & HR
  STAFF_REGISTERED: 'D10:STAFF_REGISTERED',
  SHIFT_ASSIGNED: 'D10:SHIFT_ASSIGNED'
});

// 2. Event Bus Implementation with Error Isolation & Audit Log
class CentralClinicEventBus {
  constructor() {
    this.handlers = new Map();
    this.maxHistory = 100;
  }

  /**
   * Subscribe to a domain event
   * @param {string} eventName 
   * @param {Function} handler 
   */
  on(eventName, handler) {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName).add(handler);
    return () => this.off(eventName, handler);
  }

  /**
   * Unsubscribe from a domain event
   * @param {string} eventName 
   * @param {Function} handler 
   */
  off(eventName, handler) {
    if (this.handlers.has(eventName)) {
      this.handlers.get(eventName).delete(handler);
    }
  }

  /**
   * Emit an event across domains with error isolation and audit recording
   * @param {string} eventName 
   * @param {Object} payload 
   */
  emit(eventName, payload = {}) {
    const timestamp = new Date().toISOString();
    
    // 1. Record event in central state audit log
    if (window.state) {
      if (!window.state.eventLog) window.state.eventLog = [];
      window.state.eventLog.unshift({
        id: window.state.eventLog.length + 1,
        event: eventName,
        payload: payload,
        timestamp: timestamp
      });
      if (window.state.eventLog.length > this.maxHistory) {
        window.state.eventLog.pop();
      }
    }

    // 2. Dispatch to all registered listeners with error boundary
    const listeners = this.handlers.get(eventName);
    if (!listeners || listeners.size === 0) {
      return;
    }

    listeners.forEach((handler) => {
      try {
        handler(payload);
      } catch (err) {
        console.error(`[EventBus Error] Exception in handler for "${eventName}":`, err, {
          payload,
          handler
        });
      }
    });
  }

  /**
   * Return recent event history
   */
  getHistory() {
    return (window.state && window.state.eventLog) ? window.state.eventLog : [];
  }
}

// 3. Global Single Instance
window.ClinicEventBus = new CentralClinicEventBus();
window.CLINIC_EVENTS = CLINIC_EVENTS;

/**
 * 4. Register All Core Cross-Domain Listeners (The Glue)
 * This binds the CRUD operations across all 10 domains.
 */
function initClinicCrossDomainListeners() {
  const bus = window.ClinicEventBus;
  if (!bus) return;

  // -------------------------------------------------------------
  // LISTENER 1: EMR SOAP Encounter Saved (D03 -> D04, D05, D07, D02, D01)
  // -------------------------------------------------------------
  bus.on(CLINIC_EVENTS.SOAP_ENCOUNTER_SAVED, (data) => {
    const { encounter, prescriptions = [], diagnosticItems = [], queueDispatchTarget } = data;
    if (!encounter) return;

    // A. Billing Link (D07): Record Consultation Charge
    if (typeof addChargeSource === 'function') {
      addChargeSource({
        source_domain: 'CLINICAL',
        source_record_type: 'EMR_ENCOUNTER',
        source_record_id: encounter.id,
        pet_id: encounter.pet_id,
        customer_id: encounter.customer_id,
        description: `ค่าตรวจวินิจฉัยและบริการวิชาชีพสัตวแพทย์ (${encounter.encounter_number})`,
        amount: 150.00
      });
    }

    // B. Lab Link (D05): Create Diagnostic Order if items exist
    if (diagnosticItems.length > 0 && window.state.diagnosticOrders) {
      const exists = window.state.diagnosticOrders.some(o => o.encounter_id === encounter.id);
      if (!exists) {
        const newDiagId = window.state.diagnosticOrders.length + 1;
        const hasLab = diagnosticItems.some((i) => i.type === "LAB");
        const hasImaging = diagnosticItems.some((i) => i.type === "IMAGING");
        const testCategory = hasLab && hasImaging ? "ALL" : hasLab ? "LAB" : "IMAGING";

        const orderObj = {
          id: newDiagId,
          order_number: `ORD-2026-000${newDiagId}`,
          encounter_id: encounter.id,
          pet_id: encounter.pet_id,
          customer_id: encounter.customer_id,
          doctor_id: encounter.doctor_id || 1,
          order_date: "2026-03-02 11:00",
          test_category: testCategory,
          items: diagnosticItems,
          clinical_indication: `${encounter.subjective?.chief_complaint || 'ตรวจรักษา'} - ${encounter.assessment?.primary_diagnosis || 'วินิจฉัย'}`,
          urgency: "ROUTINE",
          status: "PENDING_VERIFY",
          specimen_ids: [],
          verified_by: null,
          verified_at: null,
          has_critical_flag: false,
        };
        window.state.diagnosticOrders.unshift(orderObj);
      }
    }

    // C. Pharmacy Link (D04): Create Pending Dispensing Order if prescriptions exist
    if (prescriptions.length > 0 && window.state.dispensings) {
      const exists = window.state.dispensings.some(d => d.prescription_id === encounter.id);
      if (!exists) {
        const newDispensingId = window.state.dispensings.length + 1;
        const newDsp = {
          id: newDispensingId,
          dispensing_number: `DSP-2026-000${newDispensingId}`,
          prescription_id: encounter.id,
          encounter_number: encounter.encounter_number,
          queue_ticket_id: data.queueTicketId || null,
          pet_id: encounter.pet_id,
          customer_id: encounter.customer_id,
          doctor_id: encounter.doctor_id || 1,
          status: "WAITING_DISPENSE",
          created_at: "2026-03-02 " + new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
          dispensed_at: null,
          dispensed_by: null,
          diagnosis_summary: encounter.assessment?.primary_diagnosis || "ตรวจรักษาทั่วไป",
          items: prescriptions.map((rx, idx) => ({
            id: idx + 1,
            product_id: rx.med_id || 1,
            name: rx.name,
            dose: rx.dose,
            frequency: rx.freq,
            duration: rx.duration || "7 วัน",
            quantity: rx.raw_qty || 14,
            unit: (rx.name && (rx.name.includes("Dexoryl") || rx.name.includes("หยอด"))) ? "หลอด" : "เม็ด",
            instructions: `ป้อนหรือใช้ ${rx.dose} ${rx.freq}`,
            caution: rx.caution || "ทานยาต่อเนื่องตามแพทย์สั่ง",
            selected_lot_id: 1,
            status: "PENDING",
            unit_price: rx.price || 28.00
          })),
        };
        window.state.dispensings.unshift(newDsp);
      }
    }
  });

  // -------------------------------------------------------------
  // LISTENER 2: Pharmacy Dispense Confirmed (D04 -> D07 Billing & Stock Movement)
  // -------------------------------------------------------------
  bus.on(CLINIC_EVENTS.DISPENSE_CONFIRMED, (data) => {
    const { dispensing } = data;
    if (!dispensing || !dispensing.items) return;

    // Calculate total billable amount for dispensed medications
    let totalMedsAmount = 0;
    dispensing.items.forEach(item => {
      const prod = typeof getProductById === 'function' ? getProductById(item.product_id) : null;
      const unitPrice = item.unit_price || (prod ? prod.unit_price : 28.00);
      const lineTotal = (item.quantity || 1) * unitPrice;
      totalMedsAmount += lineTotal;
    });

    // Capture charge in D07 Billing
    if (typeof addChargeSource === 'function' && totalMedsAmount > 0) {
      addChargeSource({
        source_domain: 'PHARMACY',
        source_record_type: 'PRESCRIPTION_DISPENSE',
        source_record_id: dispensing.id,
        pet_id: dispensing.pet_id,
        customer_id: dispensing.customer_id,
        description: `ค่ายาและเภสัชภัณฑ์ตามใบสั่งแพทย์ (${dispensing.dispensing_number})`,
        amount: Number(totalMedsAmount.toFixed(2))
      });
    }
  });

  // -------------------------------------------------------------
  // LISTENER 3: Lab Result Verified (D05 -> D07 Billing)
  // -------------------------------------------------------------
  bus.on(CLINIC_EVENTS.LAB_RESULT_VERIFIED, (data) => {
    const { order } = data;
    if (!order) return;

    // Compute lab test charge based on items
    let labFee = 0;
    const items = order.items || [];
    items.forEach(item => {
      if (item.code === 'LAB-CBC-01') labFee += 350.00;
      else if (item.code === 'LAB-CYT-01') labFee += 250.00;
      else if (item.code === 'IMG-XR-ABD') labFee += 650.00;
      else if (item.code === 'IMG-US-ABD') labFee += 800.00;
      else labFee += 300.00; // fallback standard diagnostic fee
    });
    if (labFee === 0) labFee = 350.00;

    if (typeof addChargeSource === 'function') {
      addChargeSource({
        source_domain: 'LABORATORY',
        source_record_type: 'DIAGNOSTIC_ORDER',
        source_record_id: order.id,
        pet_id: order.pet_id,
        customer_id: order.customer_id,
        description: `ตรวจวิเคราะห์ทางห้องปฏิบัติการ & รังสีวินิจฉัย (${order.order_number})`,
        amount: Number(labFee.toFixed(2))
      });
    }
  });

  // -------------------------------------------------------------
  // LISTENER 4: Surgery Completed (D06 -> D04 Inventory Stock & D07 Billing)
  // -------------------------------------------------------------
  bus.on(CLINIC_EVENTS.SURGERY_COMPLETED, (data) => {
    const { schedule, record, materials = [] } = data;
    if (!schedule) return;

    let totalSurgeryCharge = 0;
    const catalog = typeof getSurgeryCatalogById === 'function' ? getSurgeryCatalogById(schedule.surgery_catalog_id) : null;
    const procedurePrice = catalog ? (catalog.estimated_cost || 1500) : 1500;
    totalSurgeryCharge += procedurePrice;

    // 1. Deduct Materials from Pharmacy Inventory (D04) if applicable
    if (materials && materials.length > 0 && window.state.stockBalances) {
      materials.forEach(mat => {
        const prodId = mat.product_id || 1;
        const qty = Number(mat.quantity || 1);
        const balance = window.state.stockBalances.find(sb => sb.product_id === prodId && sb.quantity_available >= qty) 
                      || window.state.stockBalances.find(sb => sb.product_id === prodId);
        if (balance) {
          balance.quantity_on_hand = Math.max(0, balance.quantity_on_hand - qty);
          balance.quantity_available = Math.max(0, balance.quantity_available - qty);

          if (window.state.stockMovements) {
            window.state.stockMovements.unshift({
              id: window.state.stockMovements.length + 1,
              movement_number: `MOV-2026-00${window.state.stockMovements.length + 1}`,
              product_id: prodId,
              lot_id: balance.lot_id,
              warehouse_name: balance.warehouse_name || 'ห้องผ่าตัด OR',
              movement_type: 'SURGERY_CONSUMPTION',
              quantity: -qty,
              unit_cost: 0,
              reference_type: 'SURGERY_RECORD',
              reference_code: record ? record.surgery_number : `SURG-${schedule.id}`,
              movement_at: '2026-03-02 12:30',
              performed_by: 'ทีมพยาบาลห้องผ่าตัด',
              notes: `เบิกใช้วัสดุในการผ่าตัด: ${mat.name || 'วัสดุผ่าตัด'}`
            });
          }
        }
        totalSurgeryCharge += (mat.unit_price || 100) * qty;
      });
    }

    // 2. Capture Surgery Procedure & Materials Charges into D07 Billing
    if (typeof addChargeSource === 'function') {
      addChargeSource({
        source_domain: 'SURGERY',
        source_record_type: 'SURGERY_SCHEDULE',
        source_record_id: schedule.id,
        pet_id: schedule.pet_id,
        customer_id: schedule.customer_id,
        description: `หัตถการศัลยกรรม: ${catalog ? catalog.surgery_name : 'ผ่าตัดรักษา'} พร้อมเวชภัณฑ์สิ้นเปลือง`,
        amount: Number(totalSurgeryCharge.toFixed(2))
      });
    }
  });

  // -------------------------------------------------------------
  // LISTENER 5: Billing Payment Confirmed (D07 -> D02 Queue & D08 CRM Points)
  // -------------------------------------------------------------
  bus.on(CLINIC_EVENTS.PAYMENT_CONFIRMED, (data) => {
    const { invoice, payment } = data;
    if (!invoice || !payment) return;

    // A. Advance Queue Stage to COMPLETED in D02
    if (invoice.status === 'PAID' && window.state.queues) {
      const q = window.state.queues.find(ticket => ticket.pet_id === invoice.pet_id && ticket.stage !== 'COMPLETED');
      if (q) {
        q.stage = 'COMPLETED';
      }
    }

    // B. Award Loyalty Points to CRM Membership in D08
    if (window.state.crmMemberships && payment.amount > 0) {
      const membership = window.state.crmMemberships.find(m => m.customer_id === invoice.customer_id);
      if (membership) {
        // Rule: 1 point for every 25 THB
        const earnedPoints = Math.floor(payment.amount / 25);
        if (earnedPoints > 0) {
          membership.points_balance = (membership.points_balance || 0) + earnedPoints;
          membership.annual_spending = (membership.annual_spending || 0) + payment.amount;

          // Record interaction
          if (window.state.customerInteractions) {
            window.state.customerInteractions.unshift({
              id: window.state.customerInteractions.length + 1,
              customer_id: invoice.customer_id,
              pet_id: invoice.pet_id,
              interaction_type: 'PAYMENT_LOYALTY',
              channel: 'CASHIER',
              interaction_detail: `ชำระเงินบิล ${invoice.invoice_number} จำนวน ฿${payment.amount.toLocaleString()} รับคะแนนสะสม +${earnedPoints} แต้ม (แต้มรวม: ${membership.points_balance})`,
              employee_id: 1,
              interacted_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
            });
          }

          bus.emit(CLINIC_EVENTS.LOYALTY_POINTS_EARNED, {
            customerId: invoice.customer_id,
            earnedPoints,
            totalPoints: membership.points_balance,
            invoiceNumber: invoice.invoice_number
          });
        }
      }
    }
  });

  // -------------------------------------------------------------
  // LISTENER 6: CRM Lead Converted (D08 -> D01 Master Sync)
  // -------------------------------------------------------------
  bus.on(CLINIC_EVENTS.LEAD_CONVERTED, (data) => {
    const { customer, pet, lead } = data;
    if (!customer || !pet) return;

    // Ensure ownership relation is created in state.ownerships
    if (window.state.ownerships) {
      const alreadyHasOwnership = window.state.ownerships.some(o => o.pet_id === pet.id && o.customer_id === customer.id);
      if (!alreadyHasOwnership) {
        window.state.ownerships.push({
          id: window.state.ownerships.length + 1,
          pet_id: pet.id,
          customer_id: customer.id,
          ownership_type: 'PRIMARY',
          is_primary: true,
          relationship_title: 'เจ้าของหลัก (จาก CRM Lead)',
          start_date: new Date().toISOString().slice(0, 10),
          end_date: null,
          can_give_consent: true,
          notes: `ลงทะเบียนจากการแปลง Lead ${lead ? lead.lead_number : ''}`
        });
      }
    }
  });

  // -------------------------------------------------------------
  // LISTENER 7: Staff Registered (D10 -> D02 Doctor Sync)
  // -------------------------------------------------------------
  bus.on(CLINIC_EVENTS.STAFF_REGISTERED, (data) => {
    const { employee } = data;
    if (!employee) return;

    // If new staff is a veterinarian, ensure they exist in state.doctors for full backward compatibility
    const isVet = (employee.positionId === 1) || (employee.title && employee.title.includes('สพ')) || (employee.specialties && employee.specialties.length > 0);
    if (isVet && window.state.doctors) {
      const docExists = window.state.doctors.some(d => d.id === employee.id || d.name.includes(employee.firstName));
      if (!docExists) {
        window.state.doctors.push({
          id: employee.id,
          name: `${employee.title || 'น.สพ.'} ${employee.firstName} ${employee.lastName}`,
          specialty: (employee.specialties && employee.specialties[0]) || 'สัตวแพทย์ทั่วไป',
          active_room_id: employee.assignedRoomId || 1,
          is_on_duty: true,
          phone: employee.phone || '081-000-0000'
        });
      }
    }
  });
}

// Auto-initialize when document loads
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClinicCrossDomainListeners);
  } else {
    initClinicCrossDomainListeners();
  }
}

