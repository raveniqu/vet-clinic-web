Object.assign(state, {
  activeStaffSubTab: 'rosters', // 'rosters' | 'employees' | 'attendance' | 'payroll'
  activeStaffDepartmentFilter: 'ALL',
  activePayslipEmployeeId: 1,
  activeSwapRosterId: null,

  // --- 11.1 DEPARTMENTS & POSITIONS (ORGANIZATION STRUCTURE) ---
  departments: [
    { id: 1, code: 'VET', name: 'ฝ่ายสัตวแพทย์และคลินิกปฏิบัติการ', managerId: 1, icon: 'stethoscope' },
    { id: 2, code: 'NURSE', name: 'ฝ่ายการพยาบาลสัตว์และผู้ช่วยแพทย์', managerId: 6, icon: 'heart-pulse' },
    { id: 3, code: 'PHARM', name: 'ฝ่ายเภสัชกรรมและคลังเวชภัณฑ์', managerId: 5, icon: 'pill' },
    { id: 4, code: 'LAB', name: 'ฝ่ายห้องปฏิบัติการและรังสีวินิจฉัย', managerId: 7, icon: 'flask-conical' },
    { id: 5, code: 'FRONT', name: 'ฝ่ายต้อนรับและบริการลูกค้าสัมพันธ์', managerId: 8, icon: 'smile' }
  ],

  positions: [
    { id: 1, code: 'VET-SR', name: 'สัตวแพทย์อาวุโส / หัวหน้าฝ่ายการแพทย์', deptId: 1, baseSalary: 65000 },
    { id: 2, code: 'VET-SP', name: 'สัตวแพทย์เฉพาะทาง (โรคแมวและผิวหนัง)', deptId: 1, baseSalary: 55000 },
    { id: 3, code: 'VET-GP', name: 'สัตวแพทย์ทั่วไปและทันตกรรม', deptId: 1, baseSalary: 45000 },
    { id: 4, code: 'VET-EX', name: 'สัตวแพทย์สัตว์พิเศษและฉุกเฉิน', deptId: 1, baseSalary: 48000 },
    { id: 5, code: 'PHARM-SR', name: 'หัวหน้าเภสัชกรคลินิก', deptId: 3, baseSalary: 38000 },
    { id: 6, code: 'NURSE-HD', name: 'หัวหน้าพยาบาลและผู้ช่วยสัตวแพทย์', deptId: 2, baseSalary: 28000 },
    { id: 7, code: 'LAB-TECH', name: 'นักเทคนิคการแพทย์และรังสี', deptId: 4, baseSalary: 26000 },
    { id: 8, code: 'FRONT-SUP', name: 'เจ้าหน้าที่ต้อนรับอาวุโส', deptId: 5, baseSalary: 24000 }
  ],

  // --- 11.2 EMPLOYEES & LEAVE QUOTAS ---
  employees: [
    {
      id: 1,
      employeeCode: 'EMP-VET-001',
      firstName: 'วุฒิชัย',
      lastName: 'เจริญสุข',
      nickname: 'หมอวุฒิ',
      title: 'น.สพ.',
      positionId: 1,
      departmentId: 1,
      phone: '081-456-7890',
      email: 'wuttichai.c@vetcare.com',
      hireDate: '2021-06-01',
      employmentStatus: 'ACTIVE',
      employmentType: 'FULL_TIME',
      baseSalary: 65000,
      licenseNumber: 'วพ. 10425',
      licenseExpiry: '2028-12-31',
      licenseStatus: 'ACTIVE',
      specialties: ['ศัลยกรรมเนื้อเยื่ออ่อน (Soft Tissue Surgery)', 'ศัลยกรรมกระดูกและข้อ (Orthopedics)'],
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      assignedRoomId: 1,
      leaveQuotas: {
        vacation: { total: 10, used: 2 },
        sick: { total: 30, used: 0 },
        business: { total: 3, used: 0 }
      }
    },
    {
      id: 2,
      employeeCode: 'EMP-VET-002',
      firstName: 'ศศิธร',
      lastName: 'สุวรรณมาลี',
      nickname: 'หมอน้ำ',
      title: 'สพ.ญ.',
      positionId: 2,
      departmentId: 1,
      phone: '082-567-8901',
      email: 'sasithorn.s@vetcare.com',
      hireDate: '2022-03-15',
      employmentStatus: 'ACTIVE',
      employmentType: 'FULL_TIME',
      baseSalary: 55000,
      licenseNumber: 'วพ. 12890',
      licenseExpiry: '2026-04-15',
      licenseStatus: 'EXPIRING_SOON',
      specialties: ['เวชศาสตร์โรคแมว (Feline Medicine)', 'โรคผิวหนังและภูมิแพ้ (Dermatology)', 'อัลตราซาวด์'],
      avatar: 'https://images.unsplash.com/photo-1594824813639-4404d02613d9?w=150&auto=format&fit=crop&q=80',
      assignedRoomId: 2,
      leaveQuotas: {
        vacation: { total: 10, used: 3 },
        sick: { total: 30, used: 1 },
        business: { total: 3, used: 1 }
      }
    },
    {
      id: 3,
      employeeCode: 'EMP-VET-003',
      firstName: 'ธีรภัทร',
      lastName: 'เอกอนันต์',
      nickname: 'หมอภัทร',
      title: 'น.สพ.',
      positionId: 3,
      departmentId: 1,
      phone: '083-678-9012',
      email: 'theerapat.e@vetcare.com',
      hireDate: '2023-01-10',
      employmentStatus: 'ACTIVE',
      employmentType: 'FULL_TIME',
      baseSalary: 45000,
      licenseNumber: 'วพ. 14512',
      licenseExpiry: '2027-08-31',
      licenseStatus: 'ACTIVE',
      specialties: ['ทันตกรรมและขูดหินปูน (Veterinary Dentistry)', 'อายุรกรรมทั่วไป'],
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
      assignedRoomId: 3,
      leaveQuotas: {
        vacation: { total: 10, used: 4 },
        sick: { total: 30, used: 0 },
        business: { total: 3, used: 0 }
      }
    },
    {
      id: 4,
      employeeCode: 'EMP-VET-004',
      firstName: 'ชนัญชิดา',
      lastName: 'รัตนโชติ',
      nickname: 'หมอชิดา',
      title: 'สพ.ญ.',
      positionId: 4,
      departmentId: 1,
      phone: '084-789-0123',
      email: 'chananchida.r@vetcare.com',
      hireDate: '2024-05-01',
      employmentStatus: 'ACTIVE',
      employmentType: 'FULL_TIME',
      baseSalary: 48000,
      licenseNumber: 'วพ. 16200',
      licenseExpiry: '2029-01-31',
      licenseStatus: 'ACTIVE',
      specialties: ['สัตว์เลี้ยงพิเศษ (Exotic Pets)', 'เวชบำบัดฉุกเฉินและสัตว์ป่วยวิกฤต (Critical Care)'],
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      assignedRoomId: 1,
      leaveQuotas: {
        vacation: { total: 10, used: 1 },
        sick: { total: 30, used: 0 },
        business: { total: 3, used: 1 }
      }
    },
    {
      id: 5,
      employeeCode: 'EMP-PHM-001',
      firstName: 'อานนท์',
      lastName: 'เวชสิทธิ์',
      nickname: 'เภสัชอานนท์',
      title: 'ภก.',
      positionId: 5,
      departmentId: 3,
      phone: '085-890-1234',
      email: 'arnon.v@vetcare.com',
      hireDate: '2022-08-01',
      employmentStatus: 'ACTIVE',
      employmentType: 'FULL_TIME',
      baseSalary: 38000,
      licenseNumber: 'ภก. 24890',
      licenseExpiry: '2028-05-30',
      licenseStatus: 'ACTIVE',
      specialties: ['การบริหารยาปฏิชีวนะ', 'ควบคุมคลังเวชภัณฑ์และวัคซีน'],
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      assignedRoomId: null,
      leaveQuotas: {
        vacation: { total: 10, used: 2 },
        sick: { total: 30, used: 1 },
        business: { total: 3, used: 0 }
      }
    },
    {
      id: 6,
      employeeCode: 'EMP-NRS-001',
      firstName: 'วรรณวิสา',
      lastName: 'ช่างทอง',
      nickname: 'วิสา',
      title: 'น.ส.',
      positionId: 6,
      departmentId: 2,
      phone: '086-901-2345',
      email: 'wanwisa.c@vetcare.com',
      hireDate: '2022-11-15',
      employmentStatus: 'ACTIVE',
      employmentType: 'FULL_TIME',
      baseSalary: 28000,
      licenseNumber: 'พย. 8812',
      licenseExpiry: '2027-11-30',
      licenseStatus: 'ACTIVE',
      specialties: ['การช่วยชีวิตและการดมยาสลบ', 'การพยาบาลสัตว์หลังผ่าตัด'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      assignedRoomId: null,
      leaveQuotas: {
        vacation: { total: 10, used: 3 },
        sick: { total: 30, used: 2 },
        business: { total: 3, used: 0 }
      }
    },
    {
      id: 7,
      employeeCode: 'EMP-LAB-001',
      firstName: 'ภาคิน',
      lastName: 'จันทรวิสูตร',
      nickname: 'คิน',
      title: 'นาย',
      positionId: 7,
      departmentId: 4,
      phone: '087-012-3456',
      email: 'phakin.j@vetcare.com',
      hireDate: '2023-04-01',
      employmentStatus: 'ACTIVE',
      employmentType: 'FULL_TIME',
      baseSalary: 26000,
      licenseNumber: 'ทน. 5431',
      licenseExpiry: '2027-09-30',
      licenseStatus: 'ACTIVE',
      specialties: ['การตรวจวิเคราะห์โลหิตวิทยา', 'เทคนิคถ่ายภาพทางรังสีดิจิทัล (DR)'],
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      assignedRoomId: null,
      leaveQuotas: {
        vacation: { total: 10, used: 2 },
        sick: { total: 30, used: 1 },
        business: { total: 3, used: 0 }
      }
    },
    {
      id: 8,
      employeeCode: 'EMP-REC-001',
      firstName: 'ณิชชา',
      lastName: 'ศรีสวัสดิ์',
      nickname: 'ณิชา',
      title: 'น.ส.',
      positionId: 8,
      departmentId: 5,
      phone: '088-123-4567',
      email: 'nitcha.s@vetcare.com',
      hireDate: '2023-09-01',
      employmentStatus: 'ACTIVE',
      employmentType: 'FULL_TIME',
      baseSalary: 24000,
      licenseNumber: '-',
      licenseExpiry: '-',
      licenseStatus: 'NOT_REQUIRED',
      specialties: ['การต้อนรับและบริหารคิวตรวจ', 'การจัดการประกันภัยสัตว์เลี้ยง'],
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      assignedRoomId: null,
      leaveQuotas: {
        vacation: { total: 10, used: 1 },
        sick: { total: 30, used: 0 },
        business: { total: 3, used: 1 }
      }
    }
  ],

  // --- 11.3 EMPLOYMENTS CONTRACT HISTORY ---
  employments: [
    { id: 1, employeeId: 1, positionId: 1, branchId: 1, startDate: '2021-06-01', endDate: null, baseSalary: 65000, employmentType: 'FULL_TIME', status: 'ACTIVE' },
    { id: 2, employeeId: 2, positionId: 2, branchId: 1, startDate: '2022-03-15', endDate: null, baseSalary: 55000, employmentType: 'FULL_TIME', status: 'ACTIVE' },
    { id: 3, employeeId: 3, positionId: 3, branchId: 1, startDate: '2023-01-10', endDate: null, baseSalary: 45000, employmentType: 'FULL_TIME', status: 'ACTIVE' },
    { id: 4, employeeId: 4, positionId: 4, branchId: 1, startDate: '2024-05-01', endDate: null, baseSalary: 48000, employmentType: 'FULL_TIME', status: 'ACTIVE' },
    { id: 5, employeeId: 5, positionId: 5, branchId: 1, startDate: '2022-08-01', endDate: null, baseSalary: 38000, employmentType: 'FULL_TIME', status: 'ACTIVE' },
    { id: 6, employeeId: 6, positionId: 6, branchId: 1, startDate: '2022-11-15', endDate: null, baseSalary: 28000, employmentType: 'FULL_TIME', status: 'ACTIVE' },
    { id: 7, employeeId: 7, positionId: 7, branchId: 1, startDate: '2023-04-01', endDate: null, baseSalary: 26000, employmentType: 'FULL_TIME', status: 'ACTIVE' },
    { id: 8, employeeId: 8, positionId: 8, branchId: 1, startDate: '2023-09-01', endDate: null, baseSalary: 24000, employmentType: 'FULL_TIME', status: 'ACTIVE' }
  ],

  // --- 11.4 QUALIFICATIONS & EDUCATIONAL CREDENTIALS ---
  employeeQualifications: [
    { id: 1, employeeId: 1, qualificationName: 'สัตวแพทยศาสตรบัณฑิต (เกียรตินิยมอันดับ 1)', institution: 'จุฬาลงกรณ์มหาวิทยาลัย', issuedDate: '2016-04-30', documentReference: 'CERT-CU-VET-2016.pdf' },
    { id: 2, employeeId: 1, qualificationName: 'วุฒิบัตรแสดงความรู้ความชำนาญการศัลยศาสตร์สัตว์เลี้ยง', institution: 'วิทยาลัยสัตวแพทย์ผู้เชี่ยวชาญ', issuedDate: '2020-11-15', documentReference: 'CERT-SURG-SPEC-2020.pdf' },
    { id: 3, employeeId: 2, qualificationName: 'สัตวแพทยศาสตรบัณฑิต', institution: 'มหาวิทยาลัยเกษตรศาสตร์', issuedDate: '2018-05-15', documentReference: 'CERT-KU-VET-2018.pdf' },
    { id: 4, employeeId: 2, qualificationName: 'Certificate of Advanced Feline Clinical Studies (ISFM)', institution: 'International Society of Feline Medicine', issuedDate: '2021-08-20', documentReference: 'CERT-ISFM-FELINE-2021.pdf' },
    { id: 5, employeeId: 3, qualificationName: 'สัตวแพทยศาสตรบัณฑิต', institution: 'มหาวิทยาลัยเชียงใหม่', issuedDate: '2020-04-20', documentReference: 'CERT-CMU-VET-2020.pdf' },
    { id: 6, employeeId: 4, qualificationName: 'สัตวแพทยศาสตรบัณฑิต', institution: 'มหาวิทยาลัยมหิดล', issuedDate: '2022-05-10', documentReference: 'CERT-MU-VET-2022.pdf' },
    { id: 7, employeeId: 5, qualificationName: 'เภสัชศาสตรบัณฑิต (สาขาเภสัชกรรมคลินิก)', institution: 'จุฬาลงกรณ์มหาวิทยาลัย', issuedDate: '2019-04-15', documentReference: 'CERT-CU-PHARM-2019.pdf' },
    { id: 8, employeeId: 6, qualificationName: 'วิทยาศาสตรบัณฑิต (เทคนิคการสัตวแพทย์และการพยาบาล)', institution: 'มหาวิทยาลัยเกษตรศาสตร์', issuedDate: '2021-05-20', documentReference: 'CERT-KU-VNURSE-2021.pdf' }
  ],

  // --- 11.5 PROFESSIONAL LICENSES ---
  employeeLicenses: [
    { id: 1, employeeId: 1, licenseNumber: 'วพ. 10425', licenseType: 'สัตวแพทย์ชั้นหนึ่ง', issuedDate: '2016-06-01', expiryDate: '2028-12-31', status: 'ACTIVE' },
    { id: 2, employeeId: 2, licenseNumber: 'วพ. 12890', licenseType: 'สัตวแพทย์ชั้นหนึ่ง', issuedDate: '2018-06-01', expiryDate: '2026-04-15', status: 'EXPIRING_SOON' },
    { id: 3, employeeId: 3, licenseNumber: 'วพ. 14512', licenseType: 'สัตวแพทย์ชั้นหนึ่ง', issuedDate: '2020-06-01', expiryDate: '2027-08-31', status: 'ACTIVE' },
    { id: 4, employeeId: 4, licenseNumber: 'วพ. 16200', licenseType: 'สัตวแพทย์ชั้นหนึ่ง', issuedDate: '2022-06-01', expiryDate: '2029-01-31', status: 'ACTIVE' },
    { id: 5, employeeId: 5, licenseNumber: 'ภก. 24890', licenseType: 'ผู้ประกอบวิชาชีพเภสัชกรรม', issuedDate: '2019-06-01', expiryDate: '2028-05-30', status: 'ACTIVE' },
    { id: 6, employeeId: 6, licenseNumber: 'พย. 8812', licenseType: 'ผู้ช่วยสัตวแพทย์และพยาบาลสัตว์รับรอง', issuedDate: '2021-06-01', expiryDate: '2027-11-30', status: 'ACTIVE' },
    { id: 7, employeeId: 7, licenseNumber: 'ทน. 5431', licenseType: 'ผู้ประกอบวิชาชีพเทคนิคการแพทย์', issuedDate: '2021-07-01', expiryDate: '2027-09-30', status: 'ACTIVE' }
  ],

  // --- 11.6 CLINICAL SKILLS MATRIX & COMPETENCY VERIFICATIONS ---
  employeeSkills: [
    { id: 1, employeeId: 1, skillName: 'การผ่าตัดกระดูกและข้อ (Orthopedic Surgery)', skillLevel: 'EXPERT', verifiedBy: 1, verifiedAt: '2023-01-15' },
    { id: 2, employeeId: 1, skillName: 'ศัลยกรรมเนื้อเยื่ออ่อนขั้นสูง (Soft Tissue Surgery)', skillLevel: 'EXPERT', verifiedBy: 1, verifiedAt: '2023-01-15' },
    { id: 3, employeeId: 2, skillName: 'อัลตราซาวด์ช่องท้อง (Abdominal Ultrasonography)', skillLevel: 'EXPERT', verifiedBy: 1, verifiedAt: '2023-03-20' },
    { id: 4, employeeId: 2, skillName: 'การตรวจวินิจฉัยโรคผิวหนังและไซโทโลยี (Derm Cytology)', skillLevel: 'EXPERT', verifiedBy: 1, verifiedAt: '2023-03-20' },
    { id: 5, employeeId: 3, skillName: 'ทันตกรรมสุนัขและแมว (Dental Prophylaxis & Extraction)', skillLevel: 'PROFICIENT', verifiedBy: 1, verifiedAt: '2023-05-10' },
    { id: 6, employeeId: 4, skillName: 'การดูแลรักษาสัตว์เลื้อยคลานและนก (Exotics Care)', skillLevel: 'EXPERT', verifiedBy: 1, verifiedAt: '2024-06-01' },
    { id: 7, employeeId: 6, skillName: 'การเฝ้าระวังและการดมยาสลบ (Anesthesia Monitoring)', skillLevel: 'PROFICIENT', verifiedBy: 1, verifiedAt: '2023-08-15' },
    { id: 8, employeeId: 7, skillName: 'เทคนิคการย้อมสีและตรวจสเมียร์เลือด (Blood Smear Examination)', skillLevel: 'EXPERT', verifiedBy: 1, verifiedAt: '2023-09-10' }
  ],

  // --- 11.7 SHIFTS & ATTENDANCE ---
  shifts: [
    { id: 1, code: 'M', name: 'กะเช้า (Morning)', startTime: '08:00', endTime: '17:00', color: 'emerald' },
    { id: 2, code: 'E', name: 'กะบ่าย/เย็น (Evening)', startTime: '12:00', endTime: '21:00', color: 'blue' },
    { id: 3, code: 'N', name: 'กะดึก/ฉุกเฉิน (Night/On-Call)', startTime: '20:00', endTime: '08:00', color: 'purple' },
    { id: 4, code: 'OFF', name: 'วันหยุดประจำสัปดาห์ (Day Off)', startTime: '-', endTime: '-', color: 'slate' }
  ],

  dutyRosters: [
    { id: 1, employeeId: 1, dayOfWeek: 'MON', shiftCode: 'M', roomId: 1, role: 'ตรวจอายุรกรรม & ศัลยกรรม' },
    { id: 2, employeeId: 2, dayOfWeek: 'MON', shiftCode: 'M', roomId: 2, role: 'ตรวจโรคแมว & ผิวหนัง' },
    { id: 3, employeeId: 3, dayOfWeek: 'MON', shiftCode: 'E', roomId: 3, role: 'ทันตกรรม & เวชกรรมทั่วไป' },
    { id: 4, employeeId: 4, dayOfWeek: 'MON', shiftCode: 'N', roomId: 1, role: 'เวรฉุกเฉินนอกเวลา' },
    { id: 5, employeeId: 5, dayOfWeek: 'MON', shiftCode: 'M', roomId: null, role: 'จ่ายยาและควบคุมคลัง' },
    { id: 6, employeeId: 6, dayOfWeek: 'MON', shiftCode: 'M', roomId: null, role: 'ช่วยผ่าตัดและดูแลสัตว์ป่วยใน' },
    { id: 7, employeeId: 7, dayOfWeek: 'MON', shiftCode: 'M', roomId: null, role: 'ตรวจวิเคราะห์เลือดและเอกซเรย์' },
    { id: 8, employeeId: 8, dayOfWeek: 'MON', shiftCode: 'M', roomId: null, role: 'ต้อนรับ ลงทะเบียน คัดกรอง' },

    { id: 9, employeeId: 1, dayOfWeek: 'TUE', shiftCode: 'M', roomId: 1, role: 'ตรวจอายุรกรรม & ศัลยกรรม' },
    { id: 10, employeeId: 2, dayOfWeek: 'TUE', shiftCode: 'M', roomId: 2, role: 'ตรวจโรคแมว & ผิวหนัง' },
    { id: 11, employeeId: 3, dayOfWeek: 'TUE', shiftCode: 'OFF', roomId: null, role: 'วันหยุดประจำสัปดาห์' },
    { id: 12, employeeId: 4, dayOfWeek: 'TUE', shiftCode: 'E', roomId: 3, role: 'สัตว์พิเศษและฉุกเฉิน' },
    { id: 13, employeeId: 5, dayOfWeek: 'TUE', shiftCode: 'M', roomId: null, role: 'จ่ายยาและควบคุมคลัง' },
    { id: 14, employeeId: 6, dayOfWeek: 'TUE', shiftCode: 'M', roomId: null, role: 'พยาบาลสัตว์และช่วยตรวจ' },
    { id: 15, employeeId: 7, dayOfWeek: 'TUE', shiftCode: 'M', roomId: null, role: 'ห้องปฏิบัติการเทคนิค' },
    { id: 16, employeeId: 8, dayOfWeek: 'TUE', shiftCode: 'M', roomId: null, role: 'ต้อนรับลูกค้าและคิว' },

    { id: 17, employeeId: 1, dayOfWeek: 'WED', shiftCode: 'OFF', roomId: null, role: 'วันหยุดประจำสัปดาห์' },
    { id: 18, employeeId: 2, dayOfWeek: 'WED', shiftCode: 'M', roomId: 2, role: 'ตรวจโรคแมว & ผิวหนัง' },
    { id: 19, employeeId: 3, dayOfWeek: 'WED', shiftCode: 'M', roomId: 1, role: 'อายุรกรรมและทันตกรรม' },
    { id: 20, employeeId: 4, dayOfWeek: 'WED', shiftCode: 'E', roomId: 3, role: 'ตรวจสัตว์พิเศษ' },
    { id: 21, employeeId: 5, dayOfWeek: 'WED', shiftCode: 'M', roomId: null, role: 'จ่ายยาและควบคุมคลัง' },
    { id: 22, employeeId: 6, dayOfWeek: 'WED', shiftCode: 'M', roomId: null, role: 'พยาบาลสัตว์และช่วยตรวจ' },
    { id: 23, employeeId: 7, dayOfWeek: 'WED', shiftCode: 'M', roomId: null, role: 'ห้องปฏิบัติการเทคนิค' },
    { id: 24, employeeId: 8, dayOfWeek: 'WED', shiftCode: 'M', roomId: null, role: 'ต้อนรับลูกค้าและคิว' },

    { id: 25, employeeId: 1, dayOfWeek: 'THU', shiftCode: 'M', roomId: 1, role: 'ตรวจอายุรกรรม & ผ่าตัด' },
    { id: 26, employeeId: 2, dayOfWeek: 'THU', shiftCode: 'OFF', roomId: null, role: 'วันหยุดประจำสัปดาห์' },
    { id: 27, employeeId: 3, dayOfWeek: 'THU', shiftCode: 'M', roomId: 2, role: 'ตรวจโรคทั่วไป' },
    { id: 28, employeeId: 4, dayOfWeek: 'THU', shiftCode: 'E', roomId: 3, role: 'สัตว์พิเศษและฉุกเฉิน' },
    { id: 29, employeeId: 5, dayOfWeek: 'THU', shiftCode: 'M', roomId: null, role: 'จ่ายยาและควบคุมคลัง' },
    { id: 30, employeeId: 6, dayOfWeek: 'THU', shiftCode: 'M', roomId: null, role: 'พยาบาลสัตว์และช่วยตรวจ' },
    { id: 31, employeeId: 7, dayOfWeek: 'THU', shiftCode: 'M', roomId: null, role: 'ห้องปฏิบัติการเทคนิค' },
    { id: 32, employeeId: 8, dayOfWeek: 'THU', shiftCode: 'M', roomId: null, role: 'ต้อนรับลูกค้าและคิว' },

    { id: 33, employeeId: 1, dayOfWeek: 'FRI', shiftCode: 'M', roomId: 1, role: 'ตรวจอายุรกรรม & ผ่าตัด' },
    { id: 34, employeeId: 2, dayOfWeek: 'FRI', shiftCode: 'M', roomId: 2, role: 'ตรวจโรคแมว & ผิวหนัง' },
    { id: 35, employeeId: 3, dayOfWeek: 'FRI', shiftCode: 'E', roomId: 3, role: 'ทันตกรรม & เวชกรรมทั่วไป' },
    { id: 36, employeeId: 4, dayOfWeek: 'FRI', shiftCode: 'OFF', roomId: null, role: 'วันหยุดประจำสัปดาห์' },
    { id: 37, employeeId: 5, dayOfWeek: 'FRI', shiftCode: 'M', roomId: null, role: 'จ่ายยาและควบคุมคลัง' },
    { id: 38, employeeId: 6, dayOfWeek: 'FRI', shiftCode: 'M', roomId: null, role: 'พยาบาลสัตว์และช่วยตรวจ' },
    { id: 39, employeeId: 7, dayOfWeek: 'FRI', shiftCode: 'M', roomId: null, role: 'ห้องปฏิบัติการเทคนิค' },
    { id: 40, employeeId: 8, dayOfWeek: 'FRI', shiftCode: 'M', roomId: null, role: 'ต้อนรับลูกค้าและคิว' },

    { id: 41, employeeId: 1, dayOfWeek: 'SAT', shiftCode: 'M', roomId: 1, role: 'ตรวจอายุรกรรมเสาร์อาทิตย์' },
    { id: 42, employeeId: 2, dayOfWeek: 'SAT', shiftCode: 'M', roomId: 2, role: 'คลินิกแมวเฉพาะทาง' },
    { id: 43, employeeId: 3, dayOfWeek: 'SAT', shiftCode: 'M', roomId: 3, role: 'คลินิกทันตกรรม' },
    { id: 44, employeeId: 4, dayOfWeek: 'SAT', shiftCode: 'E', roomId: 1, role: 'เวรฉุกเฉินและสัตว์พิเศษ' },
    { id: 45, employeeId: 5, dayOfWeek: 'SAT', shiftCode: 'M', roomId: null, role: 'จ่ายยาและควบคุมคลัง' },
    { id: 46, employeeId: 6, dayOfWeek: 'SAT', shiftCode: 'M', roomId: null, role: 'พยาบาลสัตว์และผู้ช่วย' },
    { id: 47, employeeId: 7, dayOfWeek: 'SAT', shiftCode: 'M', roomId: null, role: 'ห้องปฏิบัติการเทคนิค' },
    { id: 48, employeeId: 8, dayOfWeek: 'SAT', shiftCode: 'M', roomId: null, role: 'ต้อนรับลูกค้าและคิว' },

    { id: 49, employeeId: 1, dayOfWeek: 'SUN', shiftCode: 'E', roomId: 1, role: 'เวรบ่ายและศัลยกรรมฉุกเฉิน' },
    { id: 50, employeeId: 2, dayOfWeek: 'SUN', shiftCode: 'OFF', roomId: null, role: 'วันหยุดประจำสัปดาห์' },
    { id: 51, employeeId: 3, dayOfWeek: 'SUN', shiftCode: 'M', roomId: 3, role: 'คลินิกทันตกรรม' },
    { id: 52, employeeId: 4, dayOfWeek: 'SUN', shiftCode: 'M', roomId: 2, role: 'คลินิกสัตว์พิเศษ' },
    { id: 53, employeeId: 5, dayOfWeek: 'SUN', shiftCode: 'M', roomId: null, role: 'จ่ายยาและควบคุมคลัง' },
    { id: 54, employeeId: 6, dayOfWeek: 'SUN', shiftCode: 'M', roomId: null, role: 'พยาบาลสัตว์และผู้ช่วย' },
    { id: 55, employeeId: 7, dayOfWeek: 'SUN', shiftCode: 'M', roomId: null, role: 'ห้องปฏิบัติการเทคนิค' },
    { id: 56, employeeId: 8, dayOfWeek: 'SUN', shiftCode: 'M', roomId: null, role: 'ต้อนรับลูกค้าและคิว' }
  ],

  attendanceRecords: [
    { id: 1, employeeId: 1, workDate: '2026-03-02', shiftCode: 'M', checkIn: '2026-03-02 07:52', checkOut: null, status: 'ON_TIME', otHours: 0, remarks: 'ตรงเวลา' },
    { id: 2, employeeId: 2, workDate: '2026-03-02', shiftCode: 'M', checkIn: '2026-03-02 08:08', checkOut: null, status: 'LATE', otHours: 0, remarks: 'สาย 8 นาที (การจราจรติดขัด)' },
    { id: 3, employeeId: 5, workDate: '2026-03-02', shiftCode: 'M', checkIn: '2026-03-02 07:45', checkOut: null, status: 'ON_TIME', otHours: 0, remarks: 'ตรงเวลา' },
    { id: 4, employeeId: 6, workDate: '2026-03-02', shiftCode: 'M', checkIn: '2026-03-02 07:58', checkOut: null, status: 'ON_TIME', otHours: 0, remarks: 'ตรงเวลา' },
    { id: 5, employeeId: 7, workDate: '2026-03-02', shiftCode: 'M', checkIn: '2026-03-02 07:50', checkOut: null, status: 'ON_TIME', otHours: 0, remarks: 'ตรงเวลา' },
    { id: 6, employeeId: 8, workDate: '2026-03-02', shiftCode: 'M', checkIn: '2026-03-02 07:40', checkOut: null, status: 'ON_TIME', otHours: 0, remarks: 'ตรงเวลา' }
  ],

  // --- 11.8 OVERTIME PRE-APPROVAL REQUESTS ---
  overtimeRequests: [
    {
      id: 1,
      employeeId: 1,
      workDate: '2026-03-02',
      startAt: '17:00',
      endAt: '20:00',
      hours: 3.0,
      hourlyRate: 500.0,
      totalEstimatedOt: 1500.0,
      reason: 'ผ่าตัดเคสฉุกเฉินสุนัขกระดูกเชิงกรานหัก (Emergency Fracture Surgery)',
      approvedBy: 1,
      status: 'APPROVED',
      appliedAt: '2026-03-02 11:30'
    },
    {
      id: 2,
      employeeId: 6,
      workDate: '2026-03-02',
      startAt: '17:00',
      endAt: '19:30',
      hours: 2.5,
      hourlyRate: 200.0,
      totalEstimatedOt: 500.0,
      reason: 'ช่วยเตรียมห้องผ่าตัดและดูแลสัตว์ป่วยวิกฤตหลังผ่าตัดใน Ward ICU',
      approvedBy: 1,
      status: 'APPROVED',
      appliedAt: '2026-03-02 11:35'
    },
    {
      id: 3,
      employeeId: 7,
      workDate: '2026-03-03',
      startAt: '17:00',
      endAt: '19:00',
      hours: 2.0,
      hourlyRate: 180.0,
      totalEstimatedOt: 360.0,
      reason: 'เตรียมแล็บตรวจเลือดและปั่นแยกซีรัมสำหรับเคสนัดผ่าตัดวันพรุ่งนี้',
      approvedBy: null,
      status: 'PENDING',
      appliedAt: '2026-03-02 14:00'
    }
  ],

  // --- 11.9 LEAVE REQUESTS ---
  leaveRequests: [
    { id: 1, employeeId: 3, leaveType: 'VACATION', startDate: '2026-03-05', endDate: '2026-03-06', days: 2, reason: 'ลาพักผ่อนประจำปี', status: 'APPROVED', approvedBy: 1, appliedAt: '2026-02-28 14:30' },
    { id: 2, employeeId: 7, leaveType: 'SICK', startDate: '2026-03-03', endDate: '2026-03-03', days: 1, reason: 'มีไข้และพักฟื้น', status: 'PENDING', approvedBy: null, appliedAt: '2026-03-02 09:15' },
    { id: 3, employeeId: 4, leaveType: 'BUSINESS', startDate: '2026-03-12', endDate: '2026-03-12', days: 1, reason: 'สัมมนาวิชาการสัตว์พิเศษ', status: 'PENDING', approvedBy: null, appliedAt: '2026-03-01 16:00' }
  ],

  // --- 11.10 PAYROLL RUNS & CYCLE ITEMS ---
  payrollRuns: [
    {
      id: 1,
      periodName: 'รอบประจำเดือน กุมภาพันธ์ 2026',
      periodStart: '2026-02-01',
      periodEnd: '2026-02-28',
      paymentDate: '2026-02-28',
      totalGross: 349000.00,
      totalDeductions: 17450.00,
      totalNet: 331550.00,
      status: 'PAID',
      employeeCount: 8
    },
    {
      id: 2,
      periodName: 'รอบประจำเดือน มีนาคม 2026 (รอบปัจจุบัน)',
      periodStart: '2026-03-01',
      periodEnd: '2026-03-31',
      paymentDate: '2026-03-31',
      totalGross: 356000.00,
      totalDeductions: 18100.00,
      totalNet: 337900.00,
      status: 'DRAFT',
      employeeCount: 8
    }
  ],

  payrollItems: [
    {
      id: 1,
      payrollRunId: 1,
      employeeId: 1,
      baseSalary: 65000.00,
      dutyAllowance: 5000.00,
      licenseAllowance: 3000.00,
      overtimePay: 4500.00,
      grossEarnings: 77500.00,
      socialSecurity: 750.00,
      withholdingTax: 2500.00,
      totalDeductions: 3250.00,
      netPayable: 74250.00
    },
    {
      id: 2,
      payrollRunId: 1,
      employeeId: 2,
      baseSalary: 55000.00,
      dutyAllowance: 4000.00,
      licenseAllowance: 3000.00,
      overtimePay: 2800.00,
      grossEarnings: 64800.00,
      socialSecurity: 750.00,
      withholdingTax: 1800.00,
      totalDeductions: 2550.00,
      netPayable: 62250.00
    },
    {
      id: 3,
      payrollRunId: 1,
      employeeId: 3,
      baseSalary: 45000.00,
      dutyAllowance: 3500.00,
      licenseAllowance: 3000.00,
      overtimePay: 1500.00,
      grossEarnings: 53000.00,
      socialSecurity: 750.00,
      withholdingTax: 1200.00,
      totalDeductions: 1950.00,
      netPayable: 51050.00
    },
    {
      id: 4,
      payrollRunId: 1,
      employeeId: 4,
      baseSalary: 48000.00,
      dutyAllowance: 3500.00,
      licenseAllowance: 3000.00,
      overtimePay: 3200.00,
      grossEarnings: 57700.00,
      socialSecurity: 750.00,
      withholdingTax: 1450.00,
      totalDeductions: 2200.00,
      netPayable: 55500.00
    },
    {
      id: 5,
      payrollRunId: 1,
      employeeId: 5,
      baseSalary: 38000.00,
      dutyAllowance: 2000.00,
      licenseAllowance: 2000.00,
      overtimePay: 1200.00,
      grossEarnings: 43200.00,
      socialSecurity: 750.00,
      withholdingTax: 850.00,
      totalDeductions: 1600.00,
      netPayable: 41600.00
    },
    {
      id: 6,
      payrollRunId: 1,
      employeeId: 6,
      baseSalary: 28000.00,
      dutyAllowance: 1500.00,
      licenseAllowance: 1000.00,
      overtimePay: 2400.00,
      grossEarnings: 32900.00,
      socialSecurity: 750.00,
      withholdingTax: 450.00,
      totalDeductions: 1200.00,
      netPayable: 31700.00
    },
    {
      id: 7,
      payrollRunId: 1,
      employeeId: 7,
      baseSalary: 26000.00,
      dutyAllowance: 1000.00,
      licenseAllowance: 1000.00,
      overtimePay: 1800.00,
      grossEarnings: 29800.00,
      socialSecurity: 750.00,
      withholdingTax: 350.00,
      totalDeductions: 1100.00,
      netPayable: 28700.00
    },
    {
      id: 8,
      payrollRunId: 1,
      employeeId: 8,
      baseSalary: 24000.00,
      dutyAllowance: 1000.00,
      licenseAllowance: 0.00,
      overtimePay: 1500.00,
      grossEarnings: 26500.00,
      socialSecurity: 750.00,
      withholdingTax: 250.00,
      totalDeductions: 1000.00,
      netPayable: 25500.00
    }
  ]
});
