var state = window.state = {
  currentView: 'emr',    // 'owners' | 'pets' | 'queue' | 'appointments' | 'emr'
      viewMode: 'card',      // 'card' | 'list'
      sheetMode: null,       // 'owner' | 'edit-owner' | 'pet' | 'edit-pet' | 'walk-in' | 'appointment' | 'soap-encounter' | 'owner-detail' | 'pet-detail'
      activeItemId: null,
      selectedDate: '2026-03-02',
      calendarMonth: 2,      // March
      calendarYear: 2026,
      draggedQueueId: null,
      activeConsultationPetId: 1, // Default active pet in doctor room (Brownie)
      activeSoapTab: 'so',        // 'so' | 'assessment' | 'plan' | 'discharge'
      activeInventoryCategory: 'all', // 'all' | 'ยาสัตว์เลี้ยง' | 'วัคซีน' | 'เวชภัณฑ์และวัสดุสิ้นเปลือง' | 'สินค้าจำหน่าย'
      activeStockManageTab: 'receive', // 'receive' | 'adjust'
      activeDispenseId: null,

      // Domain 04: Pharmacy & Inventory Master Data (DB Aligned)
};
