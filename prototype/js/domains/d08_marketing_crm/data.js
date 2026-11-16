Object.assign(state, {
  activeCrmSubFilter: "reminders", // 'reminders' | 'membership' | 'campaigns' | 'feedback' | 'leads'
  activeLineReminderId: 1,
  activeLeadId: null,
  activeComplaintId: null,

  // --- 1. Leads Management (crm.leads) ---
  crmLeads: [
    {
      id: 1,
      lead_number: "LEAD-2026-001",
      customer_id: null,
      lead_name: "คุณศิริพร อัศวเวทิน",
      phone: "089-112-3344",
      email: "siriporn.a@gmail.com",
      lead_source: "Facebook",
      contact_channel: "Facebook Messenger",
      service_interest: "วัคซีนลูกสุนัขแรกเกิด (Golden Retriever)",
      pet_info: "ลูกสุนัข โกลเด้น อายุ 2 เดือน",
      assigned_to: 8, // เจ้าหน้าที่ต้อนรับอาวุโส
      status: "NEW",
      notes:
        "สอบถามแพ็กเกจวัคซีนลูกสุนัขแรกเกิด 4 เข็ม สนใจพาน้องเข้ามาช่วงสุดสัปดาห์นี้",
      created_at: "2026-03-02 09:30",
    },
    {
      id: 2,
      lead_number: "LEAD-2026-002",
      customer_id: null,
      lead_name: "คุณธีระยุทธ มั่นคง",
      phone: "086-778-9900",
      email: "theerayuth.m@outlook.com",
      lead_source: "LINE OA",
      contact_channel: "LINE",
      service_interest: "ตรวจสุขภาพประจำปีและเอกซเรย์สุนัขสูงวัย",
      pet_info: "สุนัขพันธุ์ทาง เพศผู้ อายุ 9 ปี",
      assigned_to: 8,
      status: "CONTACTED",
      notes:
        "เจ้าหน้าที่ส่งรายละเอียดแพ็กเกจ Golden Age Senior Wellness ให้แล้ว กำลังเช็กคิววันว่าง",
      created_at: "2026-03-01 14:15",
    },
    {
      id: 3,
      lead_number: "LEAD-2026-003",
      customer_id: null,
      lead_name: "คุณปรีชา รัตนวงศ์",
      phone: "081-334-5566",
      email: "preecha.r@gmail.com",
      lead_source: "Website",
      contact_channel: "Phone",
      service_interest: "ปรึกษาผ่าตัดทำหมันแมวเพศเมีย",
      pet_info: "แมวเปอร์เซีย เพศเมีย อายุ 8 เดือน",
      assigned_to: 6, // หัวหน้าพยาบาล
      status: "QUALIFIED",
      notes:
        "ประเมินเบื้องต้นแข็งแรงดี แนะนำให้ตรวจเลือด CBC ก่อนนัดวันผ่าตัด แจ้งค่าใช้จ่ายประมาณ ฿2,200",
      created_at: "2026-02-28 11:20",
    },
    {
      id: 4,
      lead_number: "LEAD-2026-004",
      customer_id: 1, // คุณวิภาดา (แพท)
      lead_name: "คุณวิภาดา รัตนเมธากุล",
      phone: "081-888-9999",
      email: "vipada.p@vetcare-sample.com",
      lead_source: "Walk-in",
      contact_channel: "Walk-in",
      service_interest: "ศัลยกรรมรักษาแผลสุนัข",
      pet_info: "สุนัข บราวนี่",
      assigned_to: 8,
      status: "CONVERTED",
      notes:
        "เข้ามาสอบถามที่คลินิก ตัดสินใจเปิดประวัติและพาน้องบราวนี่เข้ารับการผ่าตัดทันที",
      created_at: "2026-01-15 09:00",
    },
  ],

  // --- 2. Marketing Channels (crm.marketing_channels) ---
  marketingChannels: [
    {
      id: 1,
      channel_code: "CH-LINE",
      channel_name: "LINE Official Account",
      channel_type: "ONLINE",
      cost_monthly: 2500,
      leads_generated: 85,
      conversions: 42,
      roi_percent: 280,
      status: "ACTIVE",
    },
    {
      id: 2,
      channel_code: "CH-FB",
      channel_name: "Facebook Page & Ads",
      channel_type: "ONLINE",
      cost_monthly: 6000,
      leads_generated: 120,
      conversions: 54,
      roi_percent: 210,
      status: "ACTIVE",
    },
    {
      id: 3,
      channel_code: "CH-GOOGLE",
      channel_name: "Google Business & Maps",
      channel_type: "ONLINE",
      cost_monthly: 0,
      leads_generated: 45,
      conversions: 28,
      roi_percent: 450,
      status: "ACTIVE",
    },
    {
      id: 4,
      channel_code: "CH-WALKIN",
      channel_name: "Walk-in & หน้าร้าน",
      channel_type: "OFFLINE",
      cost_monthly: 0,
      leads_generated: 60,
      conversions: 50,
      roi_percent: 500,
      status: "ACTIVE",
    },
    {
      id: 5,
      channel_code: "CH-TIKTOK",
      channel_name: "TikTok Clip & Shorts",
      channel_type: "ONLINE",
      cost_monthly: 3000,
      leads_generated: 40,
      conversions: 12,
      roi_percent: 130,
      status: "ACTIVE",
    },
    {
      id: 6,
      channel_code: "CH-REFERRAL",
      channel_name: "ลูกค้าแนะนำเพื่อน (Referral)",
      channel_type: "OFFLINE",
      cost_monthly: 500,
      leads_generated: 35,
      conversions: 30,
      roi_percent: 420,
      status: "ACTIVE",
    },
  ],

  // --- 3. Marketing Campaigns (crm.campaigns) ---
  crmCampaigns: [
    {
      id: 1,
      campaign_code: "CAMP-DENT-2026",
      campaign_name: "แคมเปญรอยยิ้มฟันสวย (Bright Smile Dental Month)",
      campaign_type: "DENTAL",
      start_date: "2026-03-01",
      end_date: "2026-03-31",
      budget: 15000,
      promotion_id: 1,
      status: "ACTIVE",
      discount_info: "ส่วนลดขูดหินปูน 15% พร้อมแถมฟรีสเปรย์ดับกลิ่นปาก",
      target_segment: "สุนัขและแมวอายุเกิน 2 ปีที่มีหินปูนสะสม",
      target_count: 50,
      reached_count: 28,
      converted_count: 9,
    },
    {
      id: 2,
      campaign_code: "CAMP-VACC-2026",
      campaign_name: "แคมเปญวัคซีนป้องกันโรคครบวงจร (Puppy & Kitten Shield)",
      campaign_type: "VACCINE",
      start_date: "2026-02-15",
      end_date: "2026-04-15",
      budget: 20000,
      promotion_id: 2,
      status: "ACTIVE",
      discount_info: "แพ็กเกจวัคซีนลูกสัตว์ 4 เข็ม ลดทันที 20%",
      target_segment: "ลูกสุนัขและลูกแมวแรกเกิดอายุ 2-6 เดือน",
      target_count: 80,
      reached_count: 65,
      converted_count: 24,
    },
    {
      id: 3,
      campaign_code: "CAMP-SENIOR-2026",
      campaign_name: "แคมเปญใส่ใจสัตว์สูงวัย (Golden Age Senior Wellness)",
      campaign_type: "WELLNESS",
      start_date: "2026-03-01",
      end_date: "2026-05-31",
      budget: 30000,
      promotion_id: 3,
      status: "ACTIVE",
      discount_info:
        "ตรวจสุขภาพคัดกรองเบาหวาน ไต และหัวใจสัตว์เลี้ยงอายุ 7 ปีขึ้นไป ลด 500 บาท",
      target_segment: "สัตว์เลี้ยงสูงวัยอายุ 7 ปีขึ้นไป",
      target_count: 40,
      reached_count: 18,
      converted_count: 5,
    },
  ],

  // --- 4. Campaign Customers (crm.campaign_customers) ---
  crmCampaignCustomers: [
    {
      id: 1,
      campaign_id: 1,
      customer_id: 3,
      participation_status: "CONVERTED",
      joined_at: "2026-03-02 11:00",
    },
    {
      id: 2,
      campaign_id: 1,
      customer_id: 1,
      participation_status: "ENGAGED",
      joined_at: "2026-03-01 10:20",
    },
    {
      id: 3,
      campaign_id: 2,
      customer_id: 2,
      participation_status: "TARGETED",
      joined_at: "2026-02-20 09:00",
    },
    {
      id: 4,
      campaign_id: 3,
      customer_id: 1,
      participation_status: "ENGAGED",
      joined_at: "2026-03-01 15:30",
    },
  ],

  // --- 5. Promotions Master (crm.promotions) ---
  crmPromotions: [
    {
      id: 1,
      campaign_id: 1,
      promotion_code: "PROMO-DENT-15",
      promotion_name: "ส่วนลดบริการขูดหินปูน 15%",
      promotion_type: "PERCENT",
      discount_value: 15,
      start_at: "2026-03-01",
      end_at: "2026-03-31",
      status: "ACTIVE",
    },
    {
      id: 2,
      campaign_id: 2,
      promotion_code: "PROMO-VACC-20",
      promotion_name: "ส่วนลดแพ็กเกจวัคซีนลูกสัตว์ 20%",
      promotion_type: "PERCENT",
      discount_value: 20,
      start_at: "2026-02-15",
      end_at: "2026-04-15",
      status: "ACTIVE",
    },
    {
      id: 3,
      campaign_id: 3,
      promotion_code: "PROMO-SENIOR-500",
      promotion_name: "ส่วนลดตรวจสุขภาพสัตว์สูงวัย ฿500",
      promotion_type: "FIXED",
      discount_value: 500,
      start_at: "2026-03-01",
      end_at: "2026-05-31",
      status: "ACTIVE",
    },
    {
      id: 4,
      campaign_id: null,
      promotion_code: "PROMO-GOLD-10",
      promotion_name: "สิทธิพิเศษสมาชิกระดับ Gold ลดค่ายา 10%",
      promotion_type: "PERCENT",
      discount_value: 10,
      start_at: "2026-01-01",
      end_at: "2026-12-31",
      status: "ACTIVE",
    },
  ],

  // --- 6. Coupons Master (crm.coupons) ---
  crmCoupons: [
    {
      id: 1,
      promotion_id: 4,
      coupon_code: "DISC-GOLD-10",
      coupon_name: "คูปองส่วนลดสมาชิก Gold 10%",
      discount_type: "PERCENT",
      discount_value: 10,
      usage_limit: 100,
      status: "ACTIVE",
    },
    {
      id: 2,
      promotion_id: null,
      coupon_code: "VET-WELCOME-50",
      coupon_name: "คูปองส่วนลดต้อนรับสมาชิกใหม่ ฿50",
      discount_type: "FIXED",
      discount_value: 50,
      usage_limit: 200,
      status: "ACTIVE",
    },
    {
      id: 3,
      promotion_id: null,
      coupon_code: "FREE-NAIL-TRIM",
      coupon_name: "คูปองบริการตัดเล็บและเช็ดหูฟรี",
      discount_type: "SERVICE",
      discount_value: 120,
      usage_limit: 50,
      status: "ACTIVE",
    },
    {
      id: 4,
      promotion_id: 1,
      coupon_code: "DENT-15-OFF",
      coupon_name: "คูปองแคมเปญทันตกรรม ลด 15%",
      discount_type: "PERCENT",
      discount_value: 15,
      usage_limit: 30,
      status: "ACTIVE",
    },
  ],

  // --- 7. Customer Issued Coupons (crm.customer_coupons) ---
  customerCoupons: [
    {
      id: 1,
      customer_id: 1,
      coupon_id: 1,
      coupon_code: "DISC-GOLD-10",
      issued_at: "2026-01-15",
      used_at: null,
      invoice_id: null,
      status: "ACTIVE",
    },
    {
      id: 2,
      customer_id: 1,
      coupon_id: 3,
      coupon_code: "FREE-NAIL-TRIM",
      issued_at: "2026-02-01",
      used_at: null,
      invoice_id: null,
      status: "ACTIVE",
    },
    {
      id: 3,
      customer_id: 2,
      coupon_id: 2,
      coupon_code: "VET-WELCOME-50",
      issued_at: "2026-02-01",
      used_at: null,
      invoice_id: null,
      status: "ACTIVE",
    },
    {
      id: 4,
      customer_id: 3,
      coupon_id: 4,
      coupon_code: "DENT-15-OFF",
      issued_at: "2026-03-01",
      used_at: "2026-03-02 11:05",
      invoice_id: "INV-20260302-003",
      status: "USED",
    },
  ],

  // --- 8. Memberships (crm.memberships) ---
  crmMemberships: [
    {
      id: 1,
      customer_id: 1, // คุณวิภาดา (แพท)
      membership_number: "MEM-GOLD-001",
      membership_level: "GOLD",
      points_balance: 1450,
      enrolled_at: "2026-01-15",
      tier_benefits: "ส่วนลดค่ายา 10% + บริการตัดเล็บและเช็ดหูฟรี",
      annual_spending: 12500,
      status: "ACTIVE",
    },
    {
      id: 2,
      customer_id: 2, // คุณชนาธิป (บอล)
      membership_number: "MEM-SLV-002",
      membership_level: "SILVER",
      points_balance: 620,
      enrolled_at: "2026-02-01",
      tier_benefits: "ส่วนลดค่ายา 5%",
      annual_spending: 5800,
      status: "ACTIVE",
    },
    {
      id: 3,
      customer_id: 3, // คุณกมลชนก (แนท)
      membership_number: "MEM-PLT-003",
      membership_level: "PLATINUM",
      points_balance: 3800,
      enrolled_at: "2025-11-10",
      tier_benefits: "ส่วนลดค่ายา 15% + ตรวจเลือดประจำปีฟรี + ช่องทางด่วน",
      annual_spending: 34200,
      status: "ACTIVE",
    },
    {
      id: 4,
      customer_id: 4, // มูลนิธิเพื่อนสัตว์ไทย
      membership_number: "MEM-STD-004",
      membership_level: "MEMBER",
      points_balance: 150,
      enrolled_at: "2026-03-02",
      tier_benefits: "สะสมแต้มแลกส่วนลด",
      annual_spending: 1800,
      status: "ACTIVE",
    },
  ],

  // --- 9. Loyalty Points Transactions Ledger (crm.loyalty_transactions) ---
  loyaltyTransactions: [
    {
      id: 1,
      membership_id: 1,
      transaction_type: "EARN",
      points: 91,
      reference_number: "INV-20260302-001",
      transaction_at: "2026-03-02 12:45",
      description: "รับแต้มจากการชำระบิลค่ารักษาผ่าตัดน้องบราวนี่",
    },
    {
      id: 2,
      membership_id: 3,
      transaction_type: "EARN",
      points: 54,
      reference_number: "INV-20260302-003",
      transaction_at: "2026-03-02 11:05",
      description: "รับแต้มจากการชำระค่าบริการทันตกรรมน้องลักกี้",
    },
    {
      id: 3,
      membership_id: 3,
      transaction_type: "REDEEM",
      points: -200,
      reference_number: "CPN-DISC-100",
      transaction_at: "2026-02-20 15:30",
      description: "แลกคูปองส่วนลด 100 บาท",
    },
    {
      id: 4,
      membership_id: 1,
      transaction_type: "EARN",
      points: 200,
      reference_number: "WELCOME-BONUS",
      transaction_at: "2026-01-15 10:00",
      description: "โบนัสต้อนรับสมัครสมาชิกระดับ Gold",
    },
  ],

  // --- 10. Customer Interactions Timeline (crm.customer_interactions) ---
  customerInteractions: [
    {
      id: 1,
      customer_id: 1,
      pet_id: 1,
      interaction_type: "CALL",
      channel: "PHONE",
      interaction_detail:
        "โทรติดตามอาการหลังผ่าตัดเย็บแผลไหล่ขวาน้องบราวนี่ เจ้าของแจ้งว่าแผลแห้งดี สวมคอลลาร์ตลอดเวลา ทานข้าวได้ปกติ",
      employee_id: 6, // หัวหน้าพยาบาล
      interacted_at: "2026-03-02 12:50",
    },
    {
      id: 2,
      customer_id: 3,
      pet_id: 3,
      interaction_type: "LINE_CHAT",
      channel: "LINE",
      interaction_detail:
        "ลูกค้าสอบถามเรื่องอาหารหลังขูดหินปูน เจ้าหน้าที่ส่งคำแนะนำให้ทานอาหารเปียก 3-5 วันแรก",
      employee_id: 8,
      interacted_at: "2026-03-02 11:45",
    },
    {
      id: 3,
      customer_id: 2,
      pet_id: 2,
      interaction_type: "VISIT",
      channel: "IN_CLINIC",
      interaction_detail:
        "เจ้าหน้าที่หน้าเคาน์เตอร์ให้คำแนะนำเรื่องการเตรียมตัวงดน้ำงดอาหาร 8 ชม. ก่อนพาทำหมัน",
      employee_id: 8,
      interacted_at: "2026-03-01 16:30",
    },
    {
      id: 4,
      customer_id: 4,
      pet_id: 4,
      interaction_type: "CALL",
      channel: "PHONE",
      interaction_detail:
        "โทรให้คำแนะนำวิธีการใช้ไซริงค์ป้อนยาน้ำแมว และนัดตรวจเลือดติดตามค่าไต",
      employee_id: 6,
      interacted_at: "2026-03-02 12:30",
    },
  ],

  // --- 11. Customer Communications Delivery Log (crm.customer_communications) ---
  customerCommunications: [
    {
      id: 1,
      customer_id: 1,
      campaign_id: null,
      channel: "LINE",
      message_content:
        "สวัสดีค่ะคุณวิภาดา เตือนนัดตรวจค่าไตประจำเดือนของน้องแต้ม วันพรุ่งนี้ 3 มี.ค. สามารถพาน้องเข้ามาได้เลยค่ะ",
      sent_at: "2026-03-02 09:00",
      delivery_status: "DELIVERED",
      provider_reference: "LINE-MSG-88491",
    },
    {
      id: 2,
      customer_id: 3,
      campaign_id: 1,
      channel: "LINE",
      message_content:
        "แคมเปญ Bright Smile รอยยิ้มฟันสวย ลดค่าบริการขูดหินปูน 15% พร้อมตรวจสุขภาพช่องปากฟรี",
      sent_at: "2026-03-01 10:00",
      delivery_status: "READ",
      provider_reference: "LINE-MSG-88210",
    },
  ],

  // --- 12. Care & Vaccine Reminders (crm.reminders) ---
  crmReminders: [
    {
      id: 1,
      customer_id: 1,
      pet_id: 1, // บราวนี่
      reminder_type: "POST_OP",
      title: "ตรวจแผลผ่าตัดและตัดไหม 7 วัน",
      due_date: "2026-03-09",
      channel: "LINE",
      status: "PENDING",
      doctor_id: 1,
      priority: "HIGH",
      notes:
        "ติดตามอาการหลังผ่าตัดเย็บแผลไหล่ขวา แผลต้องแห้งสนิท สวมคอลลาร์ต่อเนื่อง",
      message_preview:
        "สวัสดีค่ะคุณวิภาดา VetCare ขอเตือนนัดตรวจแผลและตัดไหมของน้องบราวนี่ในวันที่ 9 มี.ค. 2026 เวลา 10:00 น. กรุณาสวมปลอกคอกันเลียตลอดเวลานะคะ",
    },
    {
      id: 2,
      customer_id: 2,
      pet_id: 2, // โมจิ
      reminder_type: "VACCINE",
      title: "ฉีดวัคซีนรวมแมวประจำปี (FVRCP Booster)",
      due_date: "2026-03-05",
      channel: "LINE",
      status: "PENDING",
      doctor_id: 2,
      priority: "MEDIUM",
      notes:
        "ครบกำหนดฉีดวัคซีนกระตุ้นภูมิคุ้มกันประจำปี และตรวจสุขภาพก่อนทำหมัน",
      message_preview:
        "สวัสดีค่ะคุณชนาธิป ครบรอบกำหนดฉีดวัคซีนรวมป้องกันไข้หัด-หวัดแมวของน้องโมจิแล้วค่ะ นัดหมายเข้ามาสร้างภูมิคุ้มกันให้น้องได้เลยนะคะ",
    },
    {
      id: 3,
      customer_id: 3,
      pet_id: 3, // ลักกี้
      reminder_type: "DENTAL",
      title: "ตรวจติดตามสุขภาพช่องปากหลังขูดหินปูน 14 วัน",
      due_date: "2026-03-16",
      channel: "SMS",
      status: "PENDING",
      doctor_id: 1,
      priority: "NORMAL",
      notes: "เช็กเหงือกอักเสบและกลิ่นปาก แนะนำอาหารเปียกช่วงสัปดาห์แรก",
      message_preview:
        "VetCare Clinic: แจ้งเตือนนัดตรวจติดตามสุขภาพช่องปากและเหงือกของน้องลักกี้ในวันที่ 16 มี.ค. โทรจองคิว 02-999-8888",
    },
    {
      id: 4,
      customer_id: 1,
      pet_id: 4, // แต้ม
      reminder_type: "CHECKUP",
      title: "ตรวจเลือดติดตามค่าไตประจำเดือน (Renal Panel)",
      due_date: "2026-03-03",
      channel: "LINE",
      status: "SENT",
      doctor_id: 2,
      priority: "HIGH",
      notes: "สุนัขโรคไตเรื้อรัง ต้องตรวจ BUN/Creatinine ทุกเดือน",
      message_preview:
        "สวัสดีค่ะคุณวิภาดา เตือนนัดตรวจค่าไตประจำเดือนของน้องแต้ม วันพรุ่งนี้ 3 มี.ค. สามารถพาน้องเข้ามาได้เลยค่ะ",
    },
  ],

  // --- 13. Customer Feedback & CSAT (crm.customer_feedback) ---
  customerFeedback: [
    {
      id: 1,
      customer_id: 3,
      pet_id: 3,
      encounter_id: 3,
      rating: 5,
      feedback_text:
        "คุณหมอธีรภัทรและผู้ช่วยมือเบามาก น้องลักกี้ขูดหินปูนกลับมาไม่มีอาการซึมเลย ฟันขาวสะอาด ปากไม่เหม็นแล้ว ประทับใจมากค่ะ",
      submitted_at: "2026-03-02 11:30",
      department: "ศัลยกรรม & ทันตกรรม",
    },
    {
      id: 2,
      customer_id: 1,
      pet_id: 1,
      encounter_id: 1,
      rating: 5,
      feedback_text:
        "คุณหมอวุฒิชัยตรวจละเอียดมาก อธิบายผลเลือดและภาพ X-Ray ชัดเจน พยาบาลช่วยจับน้องบราวนี่อย่างอ่อนโยน คลินิกสะอาดมาก",
      submitted_at: "2026-03-02 12:30",
      department: "ห้องตรวจ EMR",
    },
    {
      id: 3,
      customer_id: 2,
      pet_id: 2,
      encounter_id: 2,
      rating: 4,
      feedback_text:
        "คุณหมอศศิธรให้คำแนะนำเรื่องการเตรียมตัวทำหมันน้องโมจิดีมาก มีการตรวจเช็กความพร้อมละเอียด แต่ขอหัก 1 ดาวเรื่องที่จอดรถช่วงสายค่อนข้างแน่นค่ะ",
      submitted_at: "2026-03-01 16:45",
      department: "ตรวจสุขภาพ & วัคซีน",
    },
  ],

  // --- 14. Customer Complaints (crm.customer_complaints) ---
  customerComplaints: [
    {
      id: 1,
      complaint_number: "CMP-2026-001",
      customer_id: 2,
      complaint_type: "ที่จอดรถ & รอคิวนาน",
      complaint_detail:
        "ลูกค้าแจ้งว่าที่จอดรถหน้าร้านเต็มช่วงเวลา 10:00-11:30 น. และรอคิวรับยาประมาณ 20 นาที",
      severity: "MEDIUM", // 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      reported_at: "2026-03-01 17:00",
      status: "RESOLVED", // 'OPEN' | 'INVESTIGATING' | 'RESOLVED'
      resolution_notes:
        "เจ้าหน้าที่โทรขออภัยพร้อมประสานงาน รปภ. อำนวยความสะดวกที่จอดรถพิเศษ และมอบคูปองส่วนลด ฿50 สำหรับการมาครั้งถัดไป ลูกค้าพึงพอใจ",
      resolved_at: "2026-03-02 09:15",
    },
    {
      id: 2,
      complaint_number: "CMP-2026-002",
      customer_id: 4,
      complaint_type: "การป้อนยาแมว",
      complaint_detail:
        "สอบถามวิธีการป้อนยาน้ำแมว เนื่องจากน้องแต้มไม่ยอมทานยาผสมอาหาร ต้องการคำแนะนำด่วน",
      severity: "LOW",
      reported_at: "2026-03-02 12:10",
      status: "OPEN",
      resolution_notes: "",
      resolved_at: null,
    },
  ],

  // --- 15. Complaint Actions Log (crm.complaint_actions) ---
  complaintActions: [
    {
      id: 1,
      complaint_id: 1,
      assigned_to: 8, // เจ้าหน้าที่ต้อนรับอาวุโส
      action_detail:
        "โทรติดต่อคุณชนาธิปเพื่อกล่าวขออภัยและชี้แจง พร้อมประสานงาน รปภ. สำรองช่องจอดรถพิเศษสำหรับการนัดหมายครั้งหน้า",
      action_at: "2026-03-02 09:00",
      status: "CUSTOMER_CONTACTED",
    },
    {
      id: 2,
      complaint_id: 1,
      assigned_to: 8,
      action_detail:
        "ออกคูปองส่วนลดต้อนรับ ฿50 เข้าสู่กระเป๋าลูกค้าเพื่อชดเชยเวลาที่ต้องรอคิวรับยา ลูกค้าตอบรับด้วยความพึงพอใจ",
      action_at: "2026-03-02 09:15",
      status: "RESOLVED",
    },
  ],

  activeReceiptDocType: "slip", // 'slip' | 'tax_invoice'
  activeReceiptInvoiceId: 1,
  checkoutDiscount: 0,
  checkoutDepositApplied: false,
  activePaymentMethod: "CASH", // 'CASH' | 'PROMPTPAY' | 'CREDIT_CARD' | 'SPLIT'
});
