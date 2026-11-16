// -------------------------------------------------------------
    // 2. HELPER FUNCTIONS FOR ALL DOMAINS
    // -------------------------------------------------------------
    function getCustomerById(id) {
      return state.customers.find(c => c.id === Number(id));
    }

    function getPetById(id) {
      return state.pets.find(p => p.id === Number(id));
    }

    function getDoctorById(id) {
      if (state.doctors) {
        const doc = state.doctors.find(d => d.id === Number(id));
        if (doc) return doc;
      }
      if (state.employees) {
        const emp = state.employees.find(e => e.id === Number(id));
        if (emp) {
          return {
            id: emp.id,
            name: `${emp.title || 'น.สพ.'} ${emp.firstName} ${emp.lastName}`,
            specialty: (emp.specialties && emp.specialties[0]) || 'สัตวแพทย์',
            active_room_id: emp.assignedRoomId || 1,
            is_on_duty: emp.employmentStatus === 'ACTIVE',
            phone: emp.phone || '081-000-0000'
          };
        }
      }
      return null;
    }

    function addChargeSource(charge) {
      if (!state.chargeSources) state.chargeSources = [];
      const nextId = state.chargeSources.length + 1;
      const newCharge = {
        id: nextId,
        source_domain: charge.source_domain || 'CLINICAL',
        source_record_type: charge.source_record_type || 'EMR_ENCOUNTER',
        source_record_id: charge.source_record_id || nextId,
        pet_id: Number(charge.pet_id),
        customer_id: Number(charge.customer_id),
        description: charge.description || 'ค่าบริการทางการแพทย์',
        amount: Number(charge.amount) || 0,
        status: 'UNBILLED',
        invoice_id: null,
        received_at: charge.received_at || ('2026-03-02 ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }))
      };
      state.chargeSources.push(newCharge);

      if (window.ClinicEventBus && window.CLINIC_EVENTS) {
        window.ClinicEventBus.emit(window.CLINIC_EVENTS.CHARGE_CAPTURED, { charge: newCharge });
      }

      return newCharge;
    }

    function getRoomById(id) {
      return state.rooms.find(r => r.id === Number(id));
    }

    function getPetsForCustomer(customerId) {
      const petIds = state.ownerships
        .filter(o => o.customer_id === Number(customerId))
        .map(o => o.pet_id);
      return state.pets.filter(p => petIds.includes(p.id));
    }

    function getPrimaryOwnerForPet(petId) {
      const ownership = state.ownerships.find(o => o.pet_id === Number(petId) && o.is_primary);
      if (!ownership) return null;
      return getCustomerById(ownership.customer_id);
    }

    function getOwnershipsForPet(petId) {
      return state.ownerships
        .filter(o => o.pet_id === Number(petId))
        .map(o => ({
          ...o,
          customer: getCustomerById(o.customer_id)
        }));
    }

    function checkDuplicateCustomerPhone(phone, excludeCustomerId = null) {
      if (!phone) return null;
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 9) return null;
      return state.customers.find(c => {
        if (excludeCustomerId && c.id === Number(excludeCustomerId)) return false;
        const cPhone1 = (c.phone_primary || '').replace(/\D/g, '');
        const cPhone2 = (c.phone_secondary || '').replace(/\D/g, '');
        return cPhone1 === cleanPhone || cPhone2 === cleanPhone;
      });
    }

    function checkDuplicateMicrochip(chip, excludePetId = null) {
      if (!chip) return null;
      const cleanChip = chip.trim();
      if (!cleanChip) return null;
      return state.pets.find(p => {
        if (excludePetId && p.id === Number(excludePetId)) return false;
        return (p.microchip_number || '').trim().toLowerCase() === cleanChip.toLowerCase();
      });
    }

    function calculateAge(birthDateString) {
      if (!birthDateString) return 'ไม่ทราบอายุ';
      const birthDate = new Date(birthDateString);
      const today = new Date();
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      if (months < 0) {
        years--;
        months += 12;
      }
      if (years === 0) return `${months} เดือน`;
      return `${years} ปี ${months} เดือน`;
    }

    function formatDateThai(dateIso) {
      if (!dateIso) return '';
      const [year, month, day] = dateIso.split('-');
      const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      return `${parseInt(day)} ${monthNames[parseInt(month) - 1]} ${parseInt(year)}`;
    }

    // Domain 04 Helper Functions
    function getProductById(id) {
      return state.products.find(p => p.id === Number(id));
    }

    function getLotById(id) {
      return state.inventoryLots.find(l => l.id === Number(id));
    }

    function getDispensingById(id) {
      return state.dispensings.find(d => d.id === Number(id));
    }

    function getProductAvailableLots(productId) {
      return state.inventoryLots
        .filter(l => l.product_id === Number(productId) && l.status === 'ACTIVE')
        .sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date)); // FEFO: Earliest expiry first
    }

    function getProductTotalOnHand(productId) {
      return state.stockBalances
        .filter(sb => sb.product_id === Number(productId))
        .reduce((sum, sb) => sum + sb.quantity_on_hand, 0);
    }

    function getProductTotalAvailable(productId) {
      return state.stockBalances
        .filter(sb => sb.product_id === Number(productId))
        .reduce((sum, sb) => sum + sb.quantity_available, 0);
    }

    function isExpiringSoon(expiryDateStr) {
      if (!expiryDateStr) return false;
      const exp = new Date(expiryDateStr);
      const ref = new Date('2026-03-02');
      const diffDays = Math.ceil((exp - ref) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 90;
    }

    function calculateTotalInventoryValue() {
      return state.stockBalances.reduce((total, sb) => {
        const prod = getProductById(sb.product_id);
        const lot = getLotById(sb.lot_id);
        const cost = lot ? lot.unit_cost : (prod ? prod.unit_cost : 0);
        return total + (sb.quantity_on_hand * cost);
      }, 0);
    }

    function getWarehouseById(id) {
      return (state.warehouses || []).find(w => w.id === Number(id));
    }

    function getLocationById(id) {
      return (state.warehouseLocations || []).find(loc => loc.id === Number(id));
    }

    

    // 12. TOAST UTILITY
    // -------------------------------------------------------------
    let toastTimeout = null;
    function showToast(title, desc, type = 'success') {
      const toast = document.getElementById('toast');
      const toastTitle = document.getElementById('toast-title');
      const toastDesc = document.getElementById('toast-desc');
      const toastIcon = document.getElementById('toast-icon-wrapper');

      toastTitle.innerText = title;
      toastDesc.innerText = desc;

      if (type === 'success') {
        toastIcon.className = 'w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0';
        toastIcon.innerHTML = '<i data-lucide="check-circle-2" class="w-4 h-4"></i>';
      } else if (type === 'info') {
        toastIcon.className = 'w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0';
        toastIcon.innerHTML = '<i data-lucide="info" class="w-4 h-4"></i>';
      } else if (type === 'warning') {
        toastIcon.className = 'w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0';
        toastIcon.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4"></i>';
      }

      lucide.createIcons();

      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');

      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
      }, 3500);
    }

    
