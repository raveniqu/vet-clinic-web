Object.assign(state, {
  doctors: [
    { id: 1, name: 'น.สพ. วุฒิชัย เจริญสุข', specialty: 'ศัลยกรรมและอายุรกรรมทั่วไป', active_room_id: 1, is_on_duty: true, phone: '081-234-5601' },
    { id: 2, name: 'สพ.ญ. ศศิธร สุวรรณมาลี', specialty: 'โรคผิวหนังและแมวเฉพาะทาง', active_room_id: 2, is_on_duty: true, phone: '081-234-5602' },
    { id: 3, name: 'น.สพ. ภาณุพงศ์ วงศ์สว่าง', specialty: 'อายุรกรรมและภาพวินิจฉัย (X-Ray/US)', active_room_id: 3, is_on_duty: true, phone: '081-234-5603' }
  ],

  rooms: [
    { id: 1, code: 'ROOM-1', name: 'ห้องตรวจ 1 (อายุรกรรมทั่วไป)', room_type: 'EXAMINATION', status: 'OCCUPIED', doctor_id: 1 },
    { id: 2, code: 'ROOM-2', name: 'ห้องตรวจ 2 (แมวและสัตว์พิเศษ)', room_type: 'FELINE_EXAM', status: 'AVAILABLE', doctor_id: 2 },
    { id: 3, code: 'ROOM-VAC', name: 'ห้องวัคซีนและหัตถการเบื้องต้น', room_type: 'PROCEDURE', status: 'AVAILABLE', doctor_id: 3 },
    { id: 4, code: 'ROOM-SURG', name: 'ห้องผ่าตัดปลอดเชื้อ (OR)', room_type: 'SURGERY', status: 'AVAILABLE', doctor_id: null }
  ],

  // Service Duration & Setup Guidelines (Minutes)
  service_types: [
    { id: 'WELLNESS', name: 'ตรวจสุขภาพและฉีดวัคซีนประจำปี', duration_minutes: 30, buffer_minutes: 5, default_room_id: 3 },
    { id: 'DERMA', name: 'ตรวจผิวหนังและช่องหู', duration_minutes: 30, buffer_minutes: 5, default_room_id: 2 },
    { id: 'INTERNAL', name: 'ตรวจค่าไต เลือด และปัสสาวะ', duration_minutes: 45, buffer_minutes: 10, default_room_id: 1 },
    { id: 'SURG_CONSULT', name: 'ปรึกษาศัลยกรรมและวางแผนผ่าตัด', duration_minutes: 45, buffer_minutes: 10, default_room_id: 1 },
    { id: 'DENTAL', name: 'ตรวจฟันและขูดหินปูน', duration_minutes: 60, buffer_minutes: 15, default_room_id: 3 },
    { id: 'FOLLOWUP', name: 'ตรวจติดตามอาการ (Follow-up)', duration_minutes: 20, buffer_minutes: 5, default_room_id: 1 }
  ],

  // appointment.appointments (Domain 02)
  appointments: [
    {
      id: 1,
      appointment_number: 'APT-2026-0001',
      customer_id: 1,
      pet_id: 1,
      appointment_type: 'ตรวจสุขภาพและฉีดวัคซีนประจำปี',
      appointment_reason: 'นัดหมายฉีดวัคซีนพิษสุนัขบ้า และตรวจสุขภาพประจำปี',
      scheduled_date: '2026-03-02',
      scheduled_time: '09:30 - 10:00',
      start_time: '09:30',
      end_time: '10:00',
      doctor_id: 1,
      room_id: 1,
      status: 'CHECKED_IN',
      source_channel: 'LINE OA',
      confirmation_status: 'CONFIRMED',
      created_at: '2026-02-25T10:30:00+07:00'
    },
    {
      id: 2,
      appointment_number: 'APT-2026-0002',
      customer_id: 2,
      pet_id: 2,
      appointment_type: 'ตรวจผิวหนังและช่องหู',
      appointment_reason: 'เกาหูบ่อย สะบัดหัว มีคราบดำในช่องหู',
      scheduled_date: '2026-03-02',
      scheduled_time: '11:00 - 11:30',
      start_time: '11:00',
      end_time: '11:30',
      doctor_id: 2,
      room_id: 2,
      status: 'SCHEDULED',
      source_channel: 'โทรศัพท์',
      confirmation_status: 'CONFIRMED',
      created_at: '2026-02-26T14:15:00+07:00'
    },
    {
      id: 3,
      appointment_number: 'APT-2026-0003',
      customer_id: 3,
      pet_id: 3,
      appointment_type: 'ตรวจติดตามอาการ (Follow-up)',
      appointment_reason: 'ติดตามผลการใช้ยารักษาภูมิแพ้ผิวหนังและดูการตอบสนองต่อยา',
      scheduled_date: '2026-03-02',
      scheduled_time: '14:00 - 14:30',
      start_time: '14:00',
      end_time: '14:30',
      doctor_id: 1,
      room_id: 1,
      status: 'SCHEDULED',
      source_channel: 'แอปคลินิก',
      confirmation_status: 'PENDING',
      created_at: '2026-02-27T09:00:00+07:00'
    },
    {
      id: 4,
      appointment_number: 'APT-2026-0004',
      customer_id: 4,
      pet_id: 5,
      appointment_type: 'ตรวจค่าไต เลือด และปัสสาวะ',
      appointment_reason: 'เจาะเลือดเช็กค่าไตประจำเดือน และรับอาหารโรคไต',
      scheduled_date: '2026-03-02',
      scheduled_time: '15:30 - 16:00',
      start_time: '15:30',
      end_time: '16:00',
      doctor_id: 2,
      room_id: 2,
      status: 'SCHEDULED',
      source_channel: 'LINE OA',
      confirmation_status: 'CONFIRMED',
      created_at: '2026-02-28T11:45:00+07:00'
    },
    {
      id: 5,
      appointment_number: 'APT-2026-0005',
      customer_id: 1,
      pet_id: 4,
      appointment_type: 'ตรวจสุขภาพและฉีดวัคซีนประจำปี',
      appointment_reason: 'นัดตรวจสุขภาพแมวสูงวัย แต่ไม่มาตามเวลานัด',
      scheduled_date: '2026-03-02',
      scheduled_time: '08:30 - 09:00',
      start_time: '08:30',
      end_time: '09:00',
      doctor_id: 1,
      room_id: 1,
      status: 'NO_SHOW',
      source_channel: 'โทรศัพท์',
      confirmation_status: 'CONFIRMED',
      created_at: '2026-02-20T16:00:00+07:00',
      no_show_notes: 'เจ้าของไม่รับสาย โทรติดตาม 2 ครั้งเมื่อเวลา 08:45 และ 09:00'
    },
    {
      id: 6,
      appointment_number: 'APT-2026-0006',
      customer_id: 2,
      pet_id: 2,
      appointment_type: 'ตรวจฟันและขูดหินปูน',
      appointment_reason: 'ขูดหินปูนสุนัข (ลูกค้ายกเลิกเนื่องจากติดธุระด่วนต่างจังหวัด)',
      scheduled_date: '2026-03-02',
      scheduled_time: '16:30 - 17:30',
      start_time: '16:30',
      end_time: '17:30',
      doctor_id: 1,
      room_id: 3,
      status: 'CANCELLED',
      source_channel: 'LINE OA',
      confirmation_status: 'DECLINED',
      created_at: '2026-02-22T13:20:00+07:00'
    }
  ],

  // appointment.appointment_modifications (Domain 02)
  appointment_modifications: [
    {
      id: 1,
      appointment_id: 3,
      old_date: '2026-03-01',
      old_time: '13:00 - 13:30',
      new_date: '2026-03-02',
      new_time: '14:00 - 14:30',
      reason: 'เจ้าของติดประชุมด่วน ขอเลื่อนนัดเป็นวันรุ่งขึ้น',
      modified_by: 'เจ้าหน้าที่ต้อนรับ (สมศรี)',
      modified_at: '2026-03-01T15:20:00+07:00'
    }
  ],

  // appointment.appointment_cancellations (Domain 02)
  appointment_cancellations: [
    {
      id: 1,
      appointment_id: 6,
      cancellation_reason: 'เจ้าของติดธุระด่วนต่างจังหวัดกะทันหัน ขอเลื่อนไม่มีกำหนด',
      cancelled_by: 'ลูกค้า (แจ้งทาง LINE OA)',
      cancelled_at: '2026-03-02T08:15:00+07:00'
    }
  ],

  // appointment.appointment_waitlists (Domain 02)
  appointment_waitlists: [
    {
      id: 1,
      customer_id: 3,
      pet_id: 3,
      preferred_date: '2026-03-02',
      preferred_time: '11:00 - 11:30',
      preferred_doctor_id: 2,
      reason: 'ต้องการตรวจผิวหนังกับ สพ.ญ. ศศิธร (คิวเต็ม)',
      status: 'WAITING',
      created_at: '2026-03-02T08:30:00+07:00',
      notes: 'พร้อมมาคลินิกทันทีหากมีคิวว่างหลุดเข้ามา'
    }
  ],

  // appointment.queues (Live Queue Tickets - Domain 02)
  queues: [
    {
      id: 1,
      ticket_number: 'E01',
      appointment_id: null,
      customer_id: 4,
      pet_id: 5,
      registration_type: 'WALK_IN',
      chief_complaint: 'หอบเหนื่อย ซึมรุนแรง อาเจียนต่อเนื่อง สงสัยกินสารพิษ',
      triage_level: 'EMERGENCY',
      priority: 2,
      stage: 'WAITING',
      room_id: 1,
      doctor_id: 1,
      entered_at: '09:15',
      wait_minutes: 12,
      call_count: 0,
      vitals: {
        temp: 39.8,
        heart_rate: 180,
        respiratory_rate: 65,
        mucous_membrane: 'ซีด (Pale)',
        crt: '> 2.5 วินาที'
      }
    },
    {
      id: 2,
      ticket_number: 'A01',
      appointment_id: 1,
      customer_id: 1,
      pet_id: 1,
      registration_type: 'APPOINTMENT',
      chief_complaint: 'ตรวจสุขภาพและฉีดวัคซีนประจำปี (ตามเวลานัดหมาย 09:30)',
      triage_level: 'NORMAL',
      priority: 0,
      stage: 'IN_SERVICE',
      room_id: 1,
      doctor_id: 1,
      entered_at: '09:30',
      wait_minutes: 5,
      call_count: 1,
      vitals: {
        temp: 38.5,
        heart_rate: 110,
        respiratory_rate: 26,
        mucous_membrane: 'ชมพูสุขภาพดี (Pink)',
        crt: '< 2.0 วินาที'
      }
    },
    {
      id: 3,
      ticket_number: 'W01',
      appointment_id: null,
      customer_id: 3,
      pet_id: 3,
      registration_type: 'WALK_IN',
      chief_complaint: 'คันหู ผิวหนังแดง มีรอยเกาเป็นแผลตกสะเก็ด',
      triage_level: 'URGENT',
      priority: 1,
      stage: 'HOLD',
      room_id: 2,
      doctor_id: 2,
      entered_at: '09:05',
      wait_minutes: 40,
      call_count: 1,
      vitals: {
        temp: 38.9,
        heart_rate: 125,
        respiratory_rate: 30,
        mucous_membrane: 'ชมพู (Pink)',
        crt: '< 2.0 วินาที'
      }
    },
    {
      id: 4,
      ticket_number: 'A02',
      appointment_id: null,
      customer_id: 1,
      pet_id: 4,
      registration_type: 'WALK_IN',
      chief_complaint: 'เบิกยาโรคไตประจำเดือน ชั่งน้ำหนัก และวัดความดัน',
      triage_level: 'NORMAL',
      priority: 0,
      stage: 'COMPLETED',
      room_id: 2,
      doctor_id: 2,
      entered_at: '08:45',
      wait_minutes: 15,
      call_count: 1,
      vitals: {
        temp: 38.2,
        heart_rate: 98,
        respiratory_rate: 22,
        mucous_membrane: 'ชมพู (Pink)',
        crt: '< 2.0 วินาที'
      }
    }
  ],

  // appointment.queue_calls (Domain 02)
  queue_calls: [
    {
      id: 1,
      queue_ticket_id: 2,
      ticket_number: 'A01',
      room_id: 1,
      doctor_id: 1,
      call_number: 1,
      called_at: '2026-03-02T09:35:00+07:00',
      called_by: 'น.สพ. วุฒิชัย เจริญสุข',
      status: 'ACKNOWLEDGED'
    }
  ],

  // appointment.queue_status_histories (Domain 02)
  queue_status_histories: [
    {
      id: 1,
      queue_ticket_id: 2,
      old_stage: 'WAITING',
      new_stage: 'IN_SERVICE',
      changed_at: '2026-03-02T09:35:00+07:00',
      changed_by: 'น.สพ. วุฒิชัย เจริญสุข',
      reason: 'เรียกคิวเข้าตรวจในห้องตรวจ 1'
    },
    {
      id: 2,
      queue_ticket_id: 4,
      old_stage: 'IN_SERVICE',
      new_stage: 'COMPLETED',
      changed_at: '2026-03-02T09:00:00+07:00',
      changed_by: 'สพ.ญ. ศศิธร สุวรรณมาลี',
      reason: 'จ่ายยาและตรวจเสร็จสิ้น ส่งต่อเคาน์เตอร์คิดเงิน'
    }
  ],

  // appointment.triage_assessments (Domain 02)
  triage_assessments: [
    {
      id: 1,
      queue_ticket_id: 1,
      pet_id: 5,
      urgency_level: 'EMERGENCY',
      chief_complaint: 'หอบเหนื่อย ซึมรุนแรง อาเจียนต่อเนื่อง สงสัยกินสารพิษ',
      assessed_by: 'พยาบาลสัตว์คัดกรอง',
      assessed_at: '2026-03-02T09:15:00+07:00'
    }
  ],

  // appointment.triage_observations (Domain 02)
  triage_observations: [
    {
      id: 1,
      triage_id: 1,
      observation_type: 'VITAL_SIGNS',
      temp: 39.8,
      heart_rate: 180,
      respiratory_rate: 65,
      mucous_membrane: 'ซีด (Pale)',
      crt: '> 2.5 วินาที',
      recorded_at: '2026-03-02T09:16:00+07:00'
    }
  ]
});
