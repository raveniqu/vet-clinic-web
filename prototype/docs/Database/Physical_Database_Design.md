# Physical Database Design — Veterinary Clinic ERP

ผมจะนำ ER Diagram จากขั้นตอนก่อนหน้ามาจำแนกเป็นการออกแบบฐานข้อมูลระดับกายภาพ (Physical Database Design) ให้ครบทั้ง 10 Domains โดยมีเป้าหมายให้สามารถนำไปสร้างฐานข้อมูลและพัฒนาระบบจริงได้ ไม่ใช่เพียงรายการชื่อตารางหรือความสัมพันธ์เท่านั้น

การออกแบบจะครอบคลุมแต่ละตารางดังนี้

1. ชื่อตารางและ Domain เจ้าของข้อมูล
2. หน้าที่และขอบเขตความรับผิดชอบ
3. คอลัมน์ทั้งหมด พร้อมชนิดข้อมูลและข้อกำหนด `NULL / NOT NULL`
4. Primary Key, Foreign Key และ Unique Constraint
5. Index และ Check Constraint ที่จำเป็น
6. ความสัมพันธ์ระหว่างตารางและการอ้างอิงข้าม Domain
7. กฎการจัดเก็บข้อมูล ประวัติ และวงจรชีวิตของธุรกรรม

สมมติฐานสำหรับแบบฐานข้อมูล: ผมจะใช้ PostgreSQL เป็นฐานข้อมูลเป้าหมาย เพราะรองรับข้อกำหนดเชิงสัมพันธ์ ดัชนีแบบมีเงื่อนไข ธุรกรรม และชนิดข้อมูลที่เหมาะกับระบบ ERP ได้ดี หากภายหลังเลือกใช้ PostgreSQL อยู่แล้ว สามารถนำแบบนี้ไปต่อยอดเป็นสคริปต์สร้างฐานข้อมูลได้โดยตรง

ผมจะใช้ชื่อและขอบเขต Domain ตามเอกสารที่ให้ไว้ และจะระบุแยกให้ชัดเจนว่าตารางใดเป็นเจ้าของข้อมูล ตารางใดเป็นตารางสนับสนุน และตารางใดเป็นข้อเสนอเพิ่มเติมเพื่อให้ความสัมพันธ์สมบูรณ์ โดยไม่สร้างข้อมูลซ้ำเพียงเพราะข้อมูลนั้นถูกใช้งานในหลาย Domain

## 1. มาตรฐานกลางสำหรับ Physical Database Design

ก่อนลงรายละเอียดราย Domain ผมกำหนดมาตรฐานร่วมกันเพื่อให้ทุกตารางใช้รูปแบบเดียวกัน

### 1.1 โครงสร้างฐานข้อมูล

ผมแนะนำให้แยก PostgreSQL Schema ตามเจ้าของข้อมูล แทนการนำทุกตารางไว้ใน `public` Schema เดียว

| PostgreSQL Schema | Domain ที่รับผิดชอบ                              |
| ----------------- | ------------------------------------------------ |
| `customer`        | 01 Customer & Pet Management                     |
| `appointment`     | 02 Appointment & Queue Management                |
| `clinical`        | 03 Clinical & Medical Management                 |
| `pharmacy`        | 04 Pharmacy & Inventory Management               |
| `laboratory`      | 05 Laboratory & Diagnostic Imaging Management    |
| `surgery`         | 06 Surgery & Treatment Management                |
| `billing`         | 07 Billing & Payment Management                  |
| `crm`             | 08 Marketing & Customer Relationship Management  |
| `procurement`     | 09 Procurement & Supplier Management             |
| `hr`              | 10 Human Resources & Workforce Management        |
| `core`            | ข้อมูลอ้างอิงและข้อมูลโครงสร้างระบบที่ใช้ร่วมกัน |

ข้อดีคือสามารถกำหนดสิทธิ์การเข้าถึงและแยกความรับผิดชอบของข้อมูลได้ชัดเจน แม้ทั้งหมดจะอยู่ใน PostgreSQL Database เดียวกัน

### 1.2 มาตรฐานชนิดข้อมูล

| ประเภทข้อมูล               | PostgreSQL Data Type                  | ตัวอย่าง         |
| -------------------------- | ------------------------------------- | ---------------- |
| Primary Key                | `BIGINT GENERATED ALWAYS AS IDENTITY` | `customer_id`    |
| Foreign Key                | `BIGINT`                              | `pet_id`         |
| รหัสธุรกิจ                 | `VARCHAR(30)`                         | `customer_code`  |
| ชื่อ                       | `VARCHAR(200)`                        | `pet_name`       |
| ข้อความรายละเอียด          | `TEXT`                                | `clinical_note`  |
| จำนวนเงิน                  | `NUMERIC(14,2)`                       | `invoice_total`  |
| จำนวนสินค้า                | `NUMERIC(14,4)`                       | `stock_quantity` |
| เปอร์เซ็นต์                | `NUMERIC(7,4)`                        | `discount_rate`  |
| วัน                        | `DATE`                                | `birth_date`     |
| วันและเวลา                 | `TIMESTAMPTZ`                         | `created_at`     |
| เวลาในแต่ละวัน             | `TIME`                                | `start_time`     |
| สถานะ                      | `VARCHAR(30)`                         | `status`         |
| ข้อมูลเพิ่มเติมแบบยืดหยุ่น | `JSONB`                               | `metadata`       |
| สถานะเปิด/ปิด              | `BOOLEAN`                             | `is_active`      |

ข้อกำหนดเพิ่มเติม

- ไม่ใช้ชนิดข้อมูล `MONEY` สำหรับการเงิน ให้ใช้ `NUMERIC` เพื่อควบคุมความแม่นยำ
- ใช้ `TIMESTAMPTZ` สำหรับเวลาของธุรกรรม โดยจัดเก็บและประมวลผลเป็น UTC และแปลงตามเขตเวลาของสาขาเมื่อนำไปแสดง
- ใช้ `JSONB` เฉพาะข้อมูลเสริมที่มีโครงสร้างเปลี่ยนแปลงได้ ไม่ใช้แทนคอลัมน์ที่มีความสัมพันธ์ชัดเจน
- ไฟล์ภาพเอกซเรย์ เอกสาร และไฟล์แนบควรเก็บใน Object Storage ส่วนฐานข้อมูลเก็บ `file_reference` และ Metadata
- ทุกตารางธุรกรรมสำคัญควรมี `created_at`, `created_by`, `updated_at`, `updated_by`
- ตารางประวัติหรือธุรกรรมที่ยืนยันแล้วไม่ควรลบจริง

### 1.3 รูปแบบมาตรฐานของ Primary Key

ตัวอย่าง:

```
customer_id UUID GENERATED ALWAYS AS IDENTITY PRIMARY KEY
```

หากต้องการใช้รหัสภายนอกสำหรับ API หรือการเชื่อมต่อระบบอื่น สามารถเพิ่ม `public_id UUID` แยกจาก Primary Key ได้ โดยไม่จำเป็นต้องใช้ UUID เป็น Primary Key ของทุกตาราง

# 2. Domain 01 — Customer & Pet Management

เจ้าของข้อมูล: Domain 01

รับผิดชอบทะเบียนลูกค้า สัตว์เลี้ยง เจ้าของร่วม ผู้ดูแล ช่องทางติดต่อ และข้อมูลประจำตัวสัตว์เลี้ยง

## 2.1 กลุ่ม Customer Master

### ตาราง `customer.customers`

| Column          | Data Type    | Constraint       | รายละเอียด             |
| --------------- | ------------ | ---------------- | ---------------------- |
| `customer_id`   | BIGINT       | PK               | รหัสลูกค้า             |
| `customer_code` | VARCHAR(30)  | UNIQUE, NOT NULL | รหัสลูกค้า             |
| `customer_type` | VARCHAR(30)  | NOT NULL         | ประเภทลูกค้า           |
| `first_name`    | VARCHAR(150) | NULL             | ชื่อ                   |
| `last_name`     | VARCHAR(150) | NULL             | นามสกุล                |
| `display_name`  | VARCHAR(200) | NOT NULL         | ชื่อแสดงผล             |
| `tax_id`        | VARCHAR(20)  | NULL             | เลขประจำตัวผู้เสียภาษี |
| `date_of_birth` | DATE         | NULL             | วันเกิด                |
| `gender`        | VARCHAR(20)  | NULL             | เพศ                    |
| `status`        | VARCHAR(30)  | NOT NULL         | สถานะ                  |
| `created_at`    | TIMESTAMPTZ  | NOT NULL         | วันที่สร้าง            |
| `created_by`    | BIGINT       | NULL             | ผู้สร้าง               |
| `updated_at`    | TIMESTAMPTZ  | NULL             | วันที่แก้ไข            |
| `updated_by`    | BIGINT       | NULL             | ผู้แก้ไข               |

ข้อกำหนด:

- `customer_code` ต้องไม่ซ้ำ
- `status` ควรมีค่า เช่น `ACTIVE`, `INACTIVE`, `BLOCKED`
- หากเป็นลูกค้าบุคคลธรรมดาให้ใช้ `first_name`, `last_name`
- หากเป็นนิติบุคคลให้ใช้ `display_name` เป็นชื่อหลัก และควรเพิ่มข้อมูลประเภทนิติบุคคลตามความต้องการทางธุรกิจ
- ไม่ควรใช้ `tax_id` เป็น Primary Key

### ตาราง `customer.customer_contacts`

| Column          | Data Type    | Constraint             |
| --------------- | ------------ | ---------------------- |
| `contact_id`    | BIGINT       | PK                     |
| `customer_id`   | BIGINT       | FK → customers         |
| `contact_type`  | VARCHAR(30)  | NOT NULL               |
| `contact_value` | VARCHAR(255) | NOT NULL               |
| `is_primary`    | BOOLEAN      | NOT NULL DEFAULT FALSE |
| `is_verified`   | BOOLEAN      | NOT NULL DEFAULT FALSE |
| `verified_at`   | TIMESTAMPTZ  | NULL                   |
| `status`        | VARCHAR(30)  | NOT NULL               |
| `created_at`    | TIMESTAMPTZ  | NOT NULL               |

ตัวอย่าง `contact_type`: `PHONE`, `EMAIL`, `LINE`, `OTHER`

### ตาราง `customer.customer_addresses`

| Column          | Data Type    | Constraint             |
| --------------- | ------------ | ---------------------- |
| `address_id`    | BIGINT       | PK                     |
| `customer_id`   | BIGINT       | FK                     |
| `address_type`  | VARCHAR(30)  | NOT NULL               |
| `address_line1` | VARCHAR(255) | NOT NULL               |
| `address_line2` | VARCHAR(255) | NULL                   |
| `subdistrict`   | VARCHAR(100) | NULL                   |
| `district`      | VARCHAR(100) | NULL                   |
| `province`      | VARCHAR(100) | NULL                   |
| `postal_code`   | VARCHAR(10)  | NULL                   |
| `country_code`  | CHAR(2)      | NOT NULL               |
| `is_primary`    | BOOLEAN      | NOT NULL DEFAULT FALSE |

### ตาราง `customer.customer_preferences`

| Column             | Data Type   | Constraint |
| ------------------ | ----------- | ---------- |
| `preference_id`    | BIGINT      | PK         |
| `customer_id`      | BIGINT      | FK         |
| `preference_type`  | VARCHAR(50) | NOT NULL   |
| `preference_value` | JSONB       | NOT NULL   |
| `created_at`       | TIMESTAMPTZ | NOT NULL   |
| `updated_at`       | TIMESTAMPTZ | NULL       |

### ตาราง `customer.customer_documents`

| Column           | Data Type    | Constraint |
| ---------------- | ------------ | ---------- |
| `document_id`    | BIGINT       | PK         |
| `customer_id`    | BIGINT       | FK         |
| `document_type`  | VARCHAR(50)  | NOT NULL   |
| `file_reference` | TEXT         | NOT NULL   |
| `file_name`      | VARCHAR(255) | NOT NULL   |
| `mime_type`      | VARCHAR(100) | NULL       |
| `uploaded_at`    | TIMESTAMPTZ  | NOT NULL   |
| `uploaded_by`    | BIGINT       | NULL       |

### ตาราง `customer.customer_consents`

| Column            | Data Type   | Constraint |
| ----------------- | ----------- | ---------- |
| `consent_id`      | BIGINT      | PK         |
| `customer_id`     | BIGINT      | FK         |
| `consent_type`    | VARCHAR(50) | NOT NULL   |
| `consent_granted` | BOOLEAN     | NOT NULL   |
| `consent_version` | VARCHAR(30) | NOT NULL   |
| `consented_at`    | TIMESTAMPTZ | NOT NULL   |
| `withdrawn_at`    | TIMESTAMPTZ | NULL       |
| `source_channel`  | VARCHAR(30) | NULL       |

ตารางนี้ต้องเก็บประวัติการให้และถอนความยินยอม ไม่ควรเขียนทับค่าเดิมจนไม่สามารถตรวจสอบย้อนหลังได้

## 2.2 กลุ่ม Pet Master

### ตาราง `customer.pets`

| Column                    | Data Type    | Constraint             |
| ------------------------- | ------------ | ---------------------- |
| `pet_id`                  | BIGINT       | PK                     |
| `pet_code`                | VARCHAR(30)  | UNIQUE, NOT NULL       |
| `pet_name`                | VARCHAR(150) | NOT NULL               |
| `species_id`              | BIGINT       | FK → species           |
| `breed_id`                | BIGINT       | FK → breeds            |
| `sex`                     | VARCHAR(20)  | NOT NULL               |
| `date_of_birth`           | DATE         | NULL                   |
| `birth_date_is_estimated` | BOOLEAN      | NOT NULL DEFAULT FALSE |
| `color`                   | VARCHAR(100) | NULL                   |
| `reproductive_status`     | VARCHAR(30)  | NULL                   |
| `microchip_number`        | VARCHAR(50)  | NULL                   |
| `status`                  | VARCHAR(30)  | NOT NULL               |
| `created_at`              | TIMESTAMPTZ  | NOT NULL               |
| `updated_at`              | TIMESTAMPTZ  | NULL                   |

ผมแนะนำให้ไม่เก็บ `microchip_number` ซ้ำทั้งใน `pets` และ `pet_identifications` หากเลือกใช้ `pet_identifications` เป็นแหล่งข้อมูลหลัก ให้ตัดคอลัมน์นี้ออกจาก `pets` ในการสร้างจริง

### ตาราง `customer.species`

| Column         | Data Type    | Constraint            |
| -------------- | ------------ | --------------------- |
| `species_id`   | BIGINT       | PK                    |
| `species_code` | VARCHAR(30)  | UNIQUE                |
| `species_name` | VARCHAR(100) | UNIQUE                |
| `is_active`    | BOOLEAN      | NOT NULL DEFAULT TRUE |

### ตาราง `customer.breeds`

| Column       | Data Type    | Constraint            |
| ------------ | ------------ | --------------------- |
| `breed_id`   | BIGINT       | PK                    |
| `species_id` | BIGINT       | FK                    |
| `breed_code` | VARCHAR(30)  | NULL                  |
| `breed_name` | VARCHAR(150) | NOT NULL              |
| `is_active`  | BOOLEAN      | NOT NULL DEFAULT TRUE |

Unique: `(species_id, breed_name)`

### ตาราง `customer.pet_ownerships`

| Column           | Data Type   | Constraint             |
| ---------------- | ----------- | ---------------------- |
| `ownership_id`   | BIGINT      | PK                     |
| `pet_id`         | BIGINT      | FK                     |
| `customer_id`    | BIGINT      | FK                     |
| `ownership_type` | VARCHAR(30) | NOT NULL               |
| `is_primary`     | BOOLEAN     | NOT NULL DEFAULT FALSE |
| `start_date`     | DATE        | NOT NULL               |
| `end_date`       | DATE        | NULL                   |
| `created_at`     | TIMESTAMPTZ | NOT NULL               |

ข้อกำหนดสำคัญ:

- `end_date` ต้องไม่ก่อน `start_date`
- เจ้าของหลักที่ยังมีผลอยู่ควรมีได้เพียงหนึ่งคนต่อสัตว์หนึ่งตัว
- เก็บประวัติเจ้าของเดิม ไม่ลบหรือเขียนทับ
- ต้องพิจารณาการป้องกันช่วงเวลาความเป็นเจ้าของซ้อนกัน หากธุรกิจไม่อนุญาต

### ตาราง `customer.pet_caregivers`

| Column         | Data Type   | Constraint |
| -------------- | ----------- | ---------- |
| `caregiver_id` | BIGINT      | PK         |
| `pet_id`       | BIGINT      | FK         |
| `customer_id`  | BIGINT      | FK         |
| `relationship` | VARCHAR(50) | NOT NULL   |
| `start_date`   | DATE        | NOT NULL   |
| `end_date`     | DATE        | NULL       |

### ตาราง `customer.pet_identifications`

| Column                  | Data Type    | Constraint |
| ----------------------- | ------------ | ---------- |
| `identification_id`     | BIGINT       | PK         |
| `pet_id`                | BIGINT       | FK         |
| `identification_type`   | VARCHAR(30)  | NOT NULL   |
| `identification_number` | VARCHAR(100) | NOT NULL   |
| `issued_at`             | DATE         | NULL       |
| `status`                | VARCHAR(30)  | NOT NULL   |

Unique: `(identification_type, identification_number)`

### ตาราง `customer.pet_weights`

| Column         | Data Type    | Constraint |
| -------------- | ------------ | ---------- |
| `weight_id`    | BIGINT       | PK         |
| `pet_id`       | BIGINT       | FK         |
| `weight_value` | NUMERIC(8,3) | NOT NULL   |
| `unit`         | VARCHAR(10)  | NOT NULL   |
| `measured_at`  | TIMESTAMPTZ  | NOT NULL   |
| `measured_by`  | BIGINT       | NULL       |

### ตาราง `customer.pet_photos`

| Column           | Data Type   | Constraint             |
| ---------------- | ----------- | ---------------------- |
| `photo_id`       | BIGINT      | PK                     |
| `pet_id`         | BIGINT      | FK                     |
| `file_reference` | TEXT        | NOT NULL               |
| `is_primary`     | BOOLEAN     | NOT NULL DEFAULT FALSE |
| `uploaded_at`    | TIMESTAMPTZ | NOT NULL               |

### ตาราง `customer.pet_documents`

| Column           | Data Type   | Constraint |
| ---------------- | ----------- | ---------- |
| `document_id`    | BIGINT      | PK         |
| `pet_id`         | BIGINT      | FK         |
| `document_type`  | VARCHAR(50) | NOT NULL   |
| `file_reference` | TEXT        | NOT NULL   |
| `uploaded_at`    | TIMESTAMPTZ | NOT NULL   |

Index ที่ควรสร้าง

- `customers(customer_code)`
- `customer_contacts(customer_id, contact_type)`
- `customer_addresses(customer_id)`
- `pets(pet_code)`
- `pets(species_id, breed_id)`
- `pet_ownerships(pet_id, customer_id)`
- `pet_weights(pet_id, measured_at DESC)`
- `pet_identifications(identification_type, identification_number)`

# 3. Domain 02 — Appointment & Queue Management

เจ้าของข้อมูล: Domain 02

## 3.1 กลุ่ม Appointment

### ตาราง `appointment.appointments`

| Column               | Data Type   | Constraint              |
| -------------------- | ----------- | ----------------------- |
| `appointment_id`     | BIGINT      | PK                      |
| `appointment_number` | VARCHAR(30) | UNIQUE, NOT NULL        |
| `branch_id`          | BIGINT      | FK → core.branches      |
| `customer_id`        | BIGINT      | FK → customer.customers |
| `pet_id`             | BIGINT      | FK → customer.pets      |
| `appointment_type`   | VARCHAR(30) | NOT NULL                |
| `appointment_reason` | TEXT        | NULL                    |
| `scheduled_start`    | TIMESTAMPTZ | NOT NULL                |
| `scheduled_end`      | TIMESTAMPTZ | NOT NULL                |
| `status`             | VARCHAR(30) | NOT NULL                |
| `source_channel`     | VARCHAR(30) | NULL                    |
| `created_at`         | TIMESTAMPTZ | NOT NULL                |
| `created_by`         | BIGINT      | NULL                    |

Check: `scheduled_end > scheduled_start`

### ตาราง `appointment.appointment_confirmations`

| Column                 | Data Type    | Constraint |
| ---------------------- | ------------ | ---------- |
| `confirmation_id`      | BIGINT       | PK         |
| `appointment_id`       | BIGINT       | FK         |
| `confirmation_channel` | VARCHAR(30)  | NOT NULL   |
| `confirmation_status`  | VARCHAR(30)  | NOT NULL   |
| `confirmed_at`         | TIMESTAMPTZ  | NULL       |
| `response_reference`   | VARCHAR(100) | NULL       |

### ตาราง `appointment.appointment_modifications`

| Column            | Data Type   | Constraint |
| ----------------- | ----------- | ---------- |
| `modification_id` | BIGINT      | PK         |
| `appointment_id`  | BIGINT      | FK         |
| `old_start`       | TIMESTAMPTZ | NULL       |
| `old_end`         | TIMESTAMPTZ | NULL       |
| `new_start`       | TIMESTAMPTZ | NULL       |
| `new_end`         | TIMESTAMPTZ | NULL       |
| `reason`          | TEXT        | NULL       |
| `modified_by`     | BIGINT      | NULL       |
| `modified_at`     | TIMESTAMPTZ | NOT NULL   |

### ตาราง `appointment.appointment_cancellations`

| Column                | Data Type   | Constraint |
| --------------------- | ----------- | ---------- |
| `cancellation_id`     | BIGINT      | PK         |
| `appointment_id`      | BIGINT      | FK, UNIQUE |
| `cancellation_reason` | TEXT        | NOT NULL   |
| `cancelled_by`        | BIGINT      | NULL       |
| `cancelled_at`        | TIMESTAMPTZ | NOT NULL   |

### ตาราง `appointment.appointment_reminders`

| Column           | Data Type   | Constraint |
| ---------------- | ----------- | ---------- |
| `reminder_id`    | BIGINT      | PK         |
| `appointment_id` | BIGINT      | FK         |
| `scheduled_at`   | TIMESTAMPTZ | NOT NULL   |
| `channel`        | VARCHAR(30) | NOT NULL   |
| `sent_at`        | TIMESTAMPTZ | NULL       |
| `status`         | VARCHAR(30) | NOT NULL   |

## 3.2 กลุ่ม Scheduling

### ตาราง `appointment.rooms`

| Column      | Data Type    | Constraint |
| ----------- | ------------ | ---------- |
| `room_id`   | BIGINT       | PK         |
| `branch_id` | BIGINT       | FK         |
| `room_code` | VARCHAR(30)  | NOT NULL   |
| `room_name` | VARCHAR(150) | NOT NULL   |
| `room_type` | VARCHAR(50)  | NOT NULL   |
| `status`    | VARCHAR(30)  | NOT NULL   |

Unique: `(branch_id, room_code)`

### ตาราง `appointment.room_schedules`

| Column             | Data Type   | Constraint |
| ------------------ | ----------- | ---------- |
| `room_schedule_id` | BIGINT      | PK         |
| `room_id`          | BIGINT      | FK         |
| `start_at`         | TIMESTAMPTZ | NOT NULL   |
| `end_at`           | TIMESTAMPTZ | NOT NULL   |
| `schedule_status`  | VARCHAR(30) | NOT NULL   |

### ตาราง `appointment.resource_reservations`

| Column           | Data Type   | Constraint |
| ---------------- | ----------- | ---------- |
| `reservation_id` | BIGINT      | PK         |
| `appointment_id` | BIGINT      | FK         |
| `resource_type`  | VARCHAR(30) | NOT NULL   |
| `resource_id`    | BIGINT      | NOT NULL   |
| `start_at`       | TIMESTAMPTZ | NOT NULL   |
| `end_at`         | TIMESTAMPTZ | NOT NULL   |
| `status`         | VARCHAR(30) | NOT NULL   |

ข้อควรระวัง: `resource_id` แบบ Polymorphic Reference จะไม่สามารถกำหนด Foreign Key ไปยังตารางหลายประเภทได้โดยตรง

หากต้องการ Referential Integrity อย่างเข้มงวด ผมแนะนำให้แยกเป็น:

- `appointment_veterinarian_reservations`
- `appointment_room_reservations`
- `appointment_equipment_reservations`

หรือออกแบบ `core.resources` เป็นทะเบียนทรัพยากรกลาง แล้วให้ทุกการจองอ้างอิงตารางเดียว

## 3.3 กลุ่ม Registration & Queue

### ตาราง `appointment.service_registrations`

| Column                | Data Type   | Constraint |
| --------------------- | ----------- | ---------- |
| `registration_id`     | BIGINT      | PK         |
| `registration_number` | VARCHAR(30) | UNIQUE     |
| `appointment_id`      | BIGINT      | FK, NULL   |
| `customer_id`         | BIGINT      | FK         |
| `pet_id`              | BIGINT      | FK         |
| `branch_id`           | BIGINT      | FK         |
| `registration_type`   | VARCHAR(30) | NOT NULL   |
| `registered_at`       | TIMESTAMPTZ | NOT NULL   |
| `status`              | VARCHAR(30) | NOT NULL   |

`appointment_id` เป็น NULL ได้เพื่อรองรับ Walk-in

### ตาราง `appointment.check_ins`

| Column            | Data Type   | Constraint |
| ----------------- | ----------- | ---------- |
| `check_in_id`     | BIGINT      | PK         |
| `registration_id` | BIGINT      | FK, UNIQUE |
| `checked_in_at`   | TIMESTAMPTZ | NOT NULL   |
| `checked_in_by`   | BIGINT      | NULL       |
| `notes`           | TEXT        | NULL       |
| `status`          | VARCHAR(30) | NOT NULL   |

### ตาราง `appointment.queues`

| Column       | Data Type   | Constraint |
| ------------ | ----------- | ---------- |
| `queue_id`   | BIGINT      | PK         |
| `branch_id`  | BIGINT      | FK         |
| `queue_date` | DATE        | NOT NULL   |
| `queue_type` | VARCHAR(30) | NOT NULL   |
| `status`     | VARCHAR(30) | NOT NULL   |

Unique: `(branch_id, queue_date, queue_type)`

### ตาราง `appointment.queue_tickets`

| Column            | Data Type   | Constraint         |
| ----------------- | ----------- | ------------------ |
| `queue_ticket_id` | BIGINT      | PK                 |
| `queue_id`        | BIGINT      | FK                 |
| `registration_id` | BIGINT      | FK                 |
| `ticket_number`   | VARCHAR(30) | NOT NULL           |
| `priority`        | SMALLINT    | NOT NULL DEFAULT 0 |
| `status`          | VARCHAR(30) | NOT NULL           |
| `issued_at`       | TIMESTAMPTZ | NOT NULL           |

Unique: `(queue_id, ticket_number)`

### ตาราง `appointment.queue_calls`

| Column            | Data Type   | Constraint        |
| ----------------- | ----------- | ----------------- |
| `queue_call_id`   | BIGINT      | PK                |
| `queue_ticket_id` | BIGINT      | FK                |
| `called_by`       | BIGINT      | FK → hr.employees |
| `called_at`       | TIMESTAMPTZ | NOT NULL          |
| `call_number`     | SMALLINT    | NOT NULL          |

### ตาราง `appointment.queue_status_histories`

| Column            | Data Type   | Constraint |
| ----------------- | ----------- | ---------- |
| `history_id`      | BIGINT      | PK         |
| `queue_ticket_id` | BIGINT      | FK         |
| `old_status`      | VARCHAR(30) | NULL       |
| `new_status`      | VARCHAR(30) | NOT NULL   |
| `changed_by`      | BIGINT      | NULL       |
| `changed_at`      | TIMESTAMPTZ | NOT NULL   |
| `reason`          | TEXT        | NULL       |

### ตาราง `appointment.queue_assignments`

| Column            | Data Type   | Constraint        |
| ----------------- | ----------- | ----------------- |
| `assignment_id`   | BIGINT      | PK                |
| `queue_ticket_id` | BIGINT      | FK                |
| `employee_id`     | BIGINT      | FK → hr.employees |
| `room_id`         | BIGINT      | FK                |
| `assigned_at`     | TIMESTAMPTZ | NOT NULL          |
| `released_at`     | TIMESTAMPTZ | NULL              |
| `status`          | VARCHAR(30) | NOT NULL          |

## 3.4 กลุ่ม Triage

### ตาราง `appointment.triage_assessments`

| Column            | Data Type   | Constraint        |
| ----------------- | ----------- | ----------------- |
| `triage_id`       | BIGINT      | PK                |
| `registration_id` | BIGINT      | FK                |
| `pet_id`          | BIGINT      | FK                |
| `assessed_by`     | BIGINT      | FK → hr.employees |
| `urgency_level`   | VARCHAR(30) | NOT NULL          |
| `chief_complaint` | TEXT        | NULL              |
| `assessed_at`     | TIMESTAMPTZ | NOT NULL          |

### ตาราง `appointment.triage_observations`

| Column              | Data Type   | Constraint |
| ------------------- | ----------- | ---------- |
| `observation_id`    | BIGINT      | PK         |
| `triage_id`         | BIGINT      | FK         |
| `observation_type`  | VARCHAR(50) | NOT NULL   |
| `observation_value` | TEXT        | NOT NULL   |
| `unit`              | VARCHAR(20) | NULL       |
| `recorded_at`       | TIMESTAMPTZ | NOT NULL   |

Index สำคัญ

- `appointments(branch_id, scheduled_start)`
- `appointments(pet_id, scheduled_start DESC)`
- `queue_tickets(queue_id, status, priority)`
- `service_registrations(pet_id, registered_at DESC)`
- `triage_assessments(registration_id)`

# 4. Domain 03 — Clinical & Medical Management

เจ้าของข้อมูล: Domain 03

Domain นี้ต้องให้ความสำคัญกับความถูกต้องของเวชระเบียนและประวัติการรักษามากที่สุด

## 4.1 Clinical Encounter

### ตาราง `clinical.clinical_encounters`

| Column                    | Data Type   | Constraint                             |
| ------------------------- | ----------- | -------------------------------------- |
| `encounter_id`            | BIGINT      | PK                                     |
| `encounter_number`        | VARCHAR(30) | UNIQUE                                 |
| `pet_id`                  | BIGINT      | FK                                     |
| `registration_id`         | BIGINT      | FK → appointment.service_registrations |
| `branch_id`               | BIGINT      | FK                                     |
| `encounter_type`          | VARCHAR(30) | NOT NULL                               |
| `primary_veterinarian_id` | BIGINT      | FK → hr.employees                      |
| `started_at`              | TIMESTAMPTZ | NOT NULL                               |
| `closed_at`               | TIMESTAMPTZ | NULL                                   |
| `status`                  | VARCHAR(30) | NOT NULL                               |
| `closure_reason`          | TEXT        | NULL                                   |

`registration_id` อาจเป็น NULL ได้ในกรณีที่มีการสร้าง Encounter จากกระบวนการพิเศษที่ไม่ได้เริ่มจาก Registration ตามนโยบายของระบบ

### ตาราง `clinical.medical_records`

| Column              | Data Type   | Constraint              |
| ------------------- | ----------- | ----------------------- |
| `medical_record_id` | BIGINT      | PK                      |
| `encounter_id`      | BIGINT      | FK                      |
| `record_number`     | VARCHAR(30) | UNIQUE                  |
| `record_status`     | VARCHAR(30) | NOT NULL                |
| `created_at`        | TIMESTAMPTZ | NOT NULL                |
| `signed_at`         | TIMESTAMPTZ | NULL                    |
| `signed_by`         | BIGINT      | FK → hr.employees, NULL |

หากหนึ่ง Encounter มีเวชระเบียนหลักเพียงหนึ่งรายการ ให้กำหนด Unique ที่ `encounter_id`

### ตาราง `clinical.clinical_notes`

| Column             | Data Type   | Constraint        |
| ------------------ | ----------- | ----------------- |
| `clinical_note_id` | BIGINT      | PK                |
| `encounter_id`     | BIGINT      | FK                |
| `note_type`        | VARCHAR(30) | NOT NULL          |
| `subjective`       | TEXT        | NULL              |
| `objective`        | TEXT        | NULL              |
| `assessment`       | TEXT        | NULL              |
| `plan`             | TEXT        | NULL              |
| `note_content`     | TEXT        | NULL              |
| `created_by`       | BIGINT      | FK → hr.employees |
| `created_at`       | TIMESTAMPTZ | NOT NULL          |
| `signed_at`        | TIMESTAMPTZ | NULL              |
| `signed_by`        | BIGINT      | NULL              |

รองรับรูปแบบบันทึกทางคลินิก เช่น SOAP

### ตาราง `clinical.physical_examinations`

| Column                 | Data Type   | Constraint        |
| ---------------------- | ----------- | ----------------- |
| `examination_id`       | BIGINT      | PK                |
| `encounter_id`         | BIGINT      | FK                |
| `examination_type`     | VARCHAR(50) | NOT NULL          |
| `examination_findings` | TEXT        | NULL              |
| `examined_by`          | BIGINT      | FK → hr.employees |
| `examined_at`          | TIMESTAMPTZ | NOT NULL          |

### ตาราง `clinical.vital_signs`

| Column              | Data Type     | Constraint        |
| ------------------- | ------------- | ----------------- |
| `vital_sign_id`     | BIGINT        | PK                |
| `examination_id`    | BIGINT        | FK                |
| `measurement_type`  | VARCHAR(50)   | NOT NULL          |
| `measurement_value` | NUMERIC(12,4) | NOT NULL          |
| `unit`              | VARCHAR(20)   | NOT NULL          |
| `measured_at`       | TIMESTAMPTZ   | NOT NULL          |
| `measured_by`       | BIGINT        | FK → hr.employees |

## 4.2 Diagnosis & Problem List

### ตาราง `clinical.diagnosis_catalogs`

| Column                 | Data Type    | Constraint                  |
| ---------------------- | ------------ | --------------------------- |
| `diagnosis_catalog_id` | BIGINT       | PK                          |
| `diagnosis_code`       | VARCHAR(50)  | UNIQUE                      |
| `diagnosis_name`       | VARCHAR(200) | NOT NULL                    |
| `description`          | TEXT         | NULL                        |
| `species_id`           | BIGINT       | FK → customer.species, NULL |
| `is_active`            | BOOLEAN      | NOT NULL DEFAULT TRUE       |

### ตาราง `clinical.diagnoses`

| Column                 | Data Type   | Constraint             |
| ---------------------- | ----------- | ---------------------- |
| `diagnosis_id`         | BIGINT      | PK                     |
| `encounter_id`         | BIGINT      | FK                     |
| `diagnosis_catalog_id` | BIGINT      | FK                     |
| `diagnosis_type`       | VARCHAR(30) | NOT NULL               |
| `is_primary`           | BOOLEAN     | NOT NULL DEFAULT FALSE |
| `clinical_evidence`    | TEXT        | NULL                   |
| `diagnosed_by`         | BIGINT      | FK → hr.employees      |
| `diagnosed_at`         | TIMESTAMPTZ | NOT NULL               |

### ตาราง `clinical.clinical_problem_lists`

| Column                 | Data Type    | Constraint        |
| ---------------------- | ------------ | ----------------- |
| `problem_id`           | BIGINT       | PK                |
| `pet_id`               | BIGINT       | FK                |
| `diagnosis_catalog_id` | BIGINT       | FK                |
| `problem_name`         | VARCHAR(200) | NOT NULL          |
| `identified_at`        | DATE         | NOT NULL          |
| `resolved_at`          | DATE         | NULL              |
| `status`               | VARCHAR(30)  | NOT NULL          |
| `created_by`           | BIGINT       | FK → hr.employees |

## 4.3 Treatment Plan

### ตาราง `clinical.treatment_plans`

| Column              | Data Type    | Constraint              |
| ------------------- | ------------ | ----------------------- |
| `treatment_plan_id` | BIGINT       | PK                      |
| `encounter_id`      | BIGINT       | FK                      |
| `plan_name`         | VARCHAR(200) | NOT NULL                |
| `plan_description`  | TEXT         | NULL                    |
| `created_by`        | BIGINT       | FK → hr.employees       |
| `approved_by`       | BIGINT       | FK → hr.employees, NULL |
| `created_at`        | TIMESTAMPTZ  | NOT NULL                |
| `status`            | VARCHAR(30)  | NOT NULL                |

### ตาราง `clinical.treatment_plan_items`

| Column              | Data Type   | Constraint |
| ------------------- | ----------- | ---------- |
| `plan_item_id`      | BIGINT      | PK         |
| `treatment_plan_id` | BIGINT      | FK         |
| `item_type`         | VARCHAR(30) | NOT NULL   |
| `item_description`  | TEXT        | NOT NULL   |
| `planned_at`        | TIMESTAMPTZ | NULL       |
| `completed_at`      | TIMESTAMPTZ | NULL       |
| `status`            | VARCHAR(30) | NOT NULL   |

## 4.4 Prescription

### ตาราง `clinical.prescriptions`

| Column                | Data Type   | Constraint        |
| --------------------- | ----------- | ----------------- |
| `prescription_id`     | BIGINT      | PK                |
| `prescription_number` | VARCHAR(30) | UNIQUE            |
| `encounter_id`        | BIGINT      | FK                |
| `prescribed_by`       | BIGINT      | FK → hr.employees |
| `prescribed_at`       | TIMESTAMPTZ | NOT NULL          |
| `status`              | VARCHAR(30) | NOT NULL          |
| `notes`               | TEXT        | NULL              |

### ตาราง `clinical.prescription_items`

| Column                 | Data Type     | Constraint             |
| ---------------------- | ------------- | ---------------------- |
| `prescription_item_id` | BIGINT        | PK                     |
| `prescription_id`      | BIGINT        | FK                     |
| `product_id`           | BIGINT        | FK → pharmacy.products |
| `prescribed_quantity`  | NUMERIC(14,4) | NOT NULL               |
| `dosage`               | VARCHAR(100)  | NOT NULL               |
| `route`                | VARCHAR(50)   | NOT NULL               |
| `frequency`            | VARCHAR(100)  | NOT NULL               |
| `duration`             | VARCHAR(100)  | NULL                   |
| `instructions`         | TEXT          | NULL                   |
| `status`               | VARCHAR(30)   | NOT NULL               |

ข้อกำหนด:

- ปริมาณยาที่สั่งต้องมากกว่า 0
- การแก้ไขคำสั่งยาหลังส่งให้ Pharmacy ต้องมีประวัติ
- ห้ามแก้ไขรายการที่ถูกจ่ายไปแล้วโดยไม่มีการสร้างเหตุการณ์แก้ไขหรือยกเลิกที่ตรวจสอบได้

## 4.5 Pet Medical History

### ตาราง `clinical.pet_allergies`

| Column          | Data Type    | Constraint |
| --------------- | ------------ | ---------- |
| `allergy_id`    | BIGINT       | PK         |
| `pet_id`        | BIGINT       | FK         |
| `allergen`      | VARCHAR(200) | NOT NULL   |
| `reaction`      | TEXT         | NULL       |
| `severity`      | VARCHAR(30)  | NULL       |
| `identified_at` | DATE         | NULL       |
| `status`        | VARCHAR(30)  | NOT NULL   |

### ตาราง `clinical.pet_chronic_conditions`

| Column           | Data Type    | Constraint              |
| ---------------- | ------------ | ----------------------- |
| `condition_id`   | BIGINT       | PK                      |
| `pet_id`         | BIGINT       | FK                      |
| `condition_name` | VARCHAR(200) | NOT NULL                |
| `diagnosed_date` | DATE         | NULL                    |
| `diagnosed_by`   | BIGINT       | FK → hr.employees, NULL |
| `status`         | VARCHAR(30)  | NOT NULL                |
| `notes`          | TEXT         | NULL                    |

### ตาราง `clinical.pet_vaccinations`

| Column              | Data Type    | Constraint                         |
| ------------------- | ------------ | ---------------------------------- |
| `vaccination_id`    | BIGINT       | PK                                 |
| `pet_id`            | BIGINT       | FK                                 |
| `vaccine_name`      | VARCHAR(200) | NOT NULL                           |
| `product_id`        | BIGINT       | FK → pharmacy.products, NULL       |
| `lot_id`            | BIGINT       | FK → pharmacy.inventory_lots, NULL |
| `administered_date` | DATE         | NOT NULL                           |
| `next_due_date`     | DATE         | NULL                               |
| `administered_by`   | BIGINT       | FK → hr.employees                  |
| `notes`             | TEXT         | NULL                               |

### ตาราง `clinical.clinical_follow_ups`

| Column            | Data Type   | Constraint |
| ----------------- | ----------- | ---------- |
| `follow_up_id`    | BIGINT      | PK         |
| `encounter_id`    | BIGINT      | FK         |
| `follow_up_date`  | TIMESTAMPTZ | NOT NULL   |
| `follow_up_notes` | TEXT        | NULL       |
| `status`          | VARCHAR(30) | NOT NULL   |

### ตาราง `clinical.clinical_discharges`

| Column                   | Data Type   | Constraint        |
| ------------------------ | ----------- | ----------------- |
| `discharge_id`           | BIGINT      | PK                |
| `encounter_id`           | BIGINT      | FK, UNIQUE        |
| `discharged_at`          | TIMESTAMPTZ | NOT NULL          |
| `discharge_instructions` | TEXT        | NULL              |
| `approved_by`            | BIGINT      | FK → hr.employees |

### ตาราง `clinical.clinical_sign_offs`

| Column                | Data Type   | Constraint        |
| --------------------- | ----------- | ----------------- |
| `sign_off_id`         | BIGINT      | PK                |
| `encounter_id`        | BIGINT      | FK                |
| `signed_by`           | BIGINT      | FK → hr.employees |
| `sign_off_type`       | VARCHAR(30) | NOT NULL          |
| `signed_at`           | TIMESTAMPTZ | NOT NULL          |
| `signature_reference` | TEXT        | NULL              |

Index สำคัญ

- `clinical_encounters(pet_id, started_at DESC)`
- `clinical_encounters(branch_id, started_at)`
- `diagnoses(encounter_id)`
- `prescriptions(encounter_id, status)`
- `prescription_items(product_id)`
- `pet_allergies(pet_id, status)`
- `pet_chronic_conditions(pet_id, status)`
- `pet_vaccinations(pet_id, administered_date DESC)`

# 5. Domain 04 — Pharmacy & Inventory Management

เจ้าของข้อมูล: Domain 04

ส่วนนี้เป็นหนึ่งใน Domain ที่ต้องออกแบบอย่างระมัดระวัง เนื่องจากมีทั้งข้อมูลสินค้า สต็อก ล็อต วันหมดอายุ และธุรกรรมที่ส่งผลต่อจำนวนสินค้าจริง

## 5.1 Product Master

### ตาราง `pharmacy.products`

| Column              | Data Type     | Constraint         |
| ------------------- | ------------- | ------------------ |
| `product_id`        | BIGINT        | PK                 |
| `product_code`      | VARCHAR(50)   | UNIQUE             |
| `product_name`      | VARCHAR(200)  | NOT NULL           |
| `product_type`      | VARCHAR(30)   | NOT NULL           |
| `generic_name`      | VARCHAR(200)  | NULL               |
| `brand_name`        | VARCHAR(150)  | NULL               |
| `dosage_form`       | VARCHAR(100)  | NULL               |
| `strength`          | VARCHAR(100)  | NULL               |
| `base_unit_id`      | BIGINT        | FK → product_units |
| `is_lot_tracked`    | BOOLEAN       | NOT NULL           |
| `is_expiry_tracked` | BOOLEAN       | NOT NULL           |
| `minimum_stock`     | NUMERIC(14,4) | NOT NULL DEFAULT 0 |
| `status`            | VARCHAR(30)   | NOT NULL           |

หมายเหตุ: `base_unit_id` ต้องกำหนดความสัมพันธ์กับ `product_units` อย่างระมัดระวัง เพราะตาราง `product_units` เองก็อ้างอิง `products` ต้องสร้างตารางทั้งสองก่อนแล้วจึงเพิ่ม FK ที่เกี่ยวข้อง

### ตาราง `pharmacy.product_units`

| Column              | Data Type     | Constraint |
| ------------------- | ------------- | ---------- |
| `product_unit_id`   | BIGINT        | PK         |
| `product_id`        | BIGINT        | FK         |
| `unit_code`         | VARCHAR(30)   | NOT NULL   |
| `unit_name`         | VARCHAR(100)  | NOT NULL   |
| `conversion_factor` | NUMERIC(14,6) | NOT NULL   |
| `is_base_unit`      | BOOLEAN       | NOT NULL   |
| `status`            | VARCHAR(30)   | NOT NULL   |

Unique: `(product_id, unit_code)`

Check: `conversion_factor > 0`

## 5.2 Warehouse & Location

### ตาราง `pharmacy.warehouses`

| Column           | Data Type    | Constraint |
| ---------------- | ------------ | ---------- |
| `warehouse_id`   | BIGINT       | PK         |
| `branch_id`      | BIGINT       | FK         |
| `warehouse_code` | VARCHAR(30)  | NOT NULL   |
| `warehouse_name` | VARCHAR(150) | NOT NULL   |
| `warehouse_type` | VARCHAR(30)  | NOT NULL   |
| `status`         | VARCHAR(30)  | NOT NULL   |

### ตาราง `pharmacy.warehouse_locations`

| Column               | Data Type    | Constraint                     |
| -------------------- | ------------ | ------------------------------ |
| `location_id`        | BIGINT       | PK                             |
| `warehouse_id`       | BIGINT       | FK                             |
| `location_code`      | VARCHAR(30)  | NOT NULL                       |
| `location_name`      | VARCHAR(100) | NULL                           |
| `parent_location_id` | BIGINT       | FK → warehouse_locations, NULL |
| `status`             | VARCHAR(30)  | NOT NULL                       |

## 5.3 Inventory Lot & Stock

### ตาราง `pharmacy.inventory_lots`

| Column              | Data Type     | Constraint |
| ------------------- | ------------- | ---------- |
| `lot_id`            | BIGINT        | PK         |
| `product_id`        | BIGINT        | FK         |
| `warehouse_id`      | BIGINT        | FK         |
| `location_id`       | BIGINT        | FK         |
| `lot_number`        | VARCHAR(100)  | NOT NULL   |
| `manufactured_date` | DATE          | NULL       |
| `expiry_date`       | DATE          | NULL       |
| `received_date`     | DATE          | NOT NULL   |
| `unit_cost`         | NUMERIC(14,4) | NOT NULL   |
| `status`            | VARCHAR(30)   | NOT NULL   |

Unique: `(product_id, warehouse_id, lot_number)`

### ตาราง `pharmacy.stock_balances`

| Column               | Data Type     | Constraint         |
| -------------------- | ------------- | ------------------ |
| `stock_balance_id`   | BIGINT        | PK                 |
| `product_id`         | BIGINT        | FK                 |
| `warehouse_id`       | BIGINT        | FK                 |
| `location_id`        | BIGINT        | FK                 |
| `lot_id`             | BIGINT        | FK                 |
| `quantity_on_hand`   | NUMERIC(14,4) | NOT NULL DEFAULT 0 |
| `quantity_reserved`  | NUMERIC(14,4) | NOT NULL DEFAULT 0 |
| `quantity_available` | NUMERIC(14,4) | NOT NULL DEFAULT 0 |
| `updated_at`         | TIMESTAMPTZ   | NOT NULL           |

Unique: `(product_id, warehouse_id, location_id, lot_id)`

ข้อกำหนด:

- `quantity_on_hand >= 0` ตามนโยบายไม่อนุญาตให้สต็อกติดลบ
- `quantity_reserved >= 0`
- `quantity_available = quantity_on_hand - quantity_reserved`
- ควรคำนวณหรือปรับปรุงยอดด้วยธุรกรรมที่มีการล็อกข้อมูลเพื่อป้องกันการจ่ายสินค้าซ้ำเกินจำนวน

### ตาราง `pharmacy.stock_movements`

| Column            | Data Type     | Constraint        |
| ----------------- | ------------- | ----------------- |
| `movement_id`     | BIGINT        | PK                |
| `movement_number` | VARCHAR(30)   | UNIQUE            |
| `product_id`      | BIGINT        | FK                |
| `lot_id`          | BIGINT        | FK                |
| `warehouse_id`    | BIGINT        | FK                |
| `movement_type`   | VARCHAR(30)   | NOT NULL          |
| `quantity`        | NUMERIC(14,4) | NOT NULL          |
| `unit_cost`       | NUMERIC(14,4) | NOT NULL          |
| `reference_type`  | VARCHAR(30)   | NULL              |
| `reference_id`    | BIGINT        | NULL              |
| `movement_at`     | TIMESTAMPTZ   | NOT NULL          |
| `performed_by`    | BIGINT        | FK → hr.employees |
| `notes`           | TEXT          | NULL              |

แนะนำให้เก็บปริมาณการเคลื่อนไหวเป็นค่าบวก และใช้ `movement_type` เพื่อกำหนดทิศทางเข้า/ออกอย่างชัดเจน หรือใช้ปริมาณแบบมีเครื่องหมายลบ/บวก แต่ต้องเลือกแนวทางเดียวกันทั้งระบบ

## 5.4 Dispensing

### ตาราง `pharmacy.dispensings`

| Column              | Data Type   | Constraint                  |
| ------------------- | ----------- | --------------------------- |
| `dispensing_id`     | BIGINT      | PK                          |
| `dispensing_number` | VARCHAR(30) | UNIQUE                      |
| `prescription_id`   | BIGINT      | FK → clinical.prescriptions |
| `customer_id`       | BIGINT      | FK                          |
| `pet_id`            | BIGINT      | FK                          |
| `dispensed_by`      | BIGINT      | FK → hr.employees           |
| `dispensed_at`      | TIMESTAMPTZ | NOT NULL                    |
| `status`            | VARCHAR(30) | NOT NULL                    |

### ตาราง `pharmacy.dispensing_items`

| Column                 | Data Type     | Constraint |
| ---------------------- | ------------- | ---------- |
| `dispensing_item_id`   | BIGINT        | PK         |
| `dispensing_id`        | BIGINT        | FK         |
| `prescription_item_id` | BIGINT        | FK         |
| `product_id`           | BIGINT        | FK         |
| `lot_id`               | BIGINT        | FK         |
| `dispensed_quantity`   | NUMERIC(14,4) | NOT NULL   |
| `unit_price`           | NUMERIC(14,4) | NOT NULL   |
| `unit_cost_snapshot`   | NUMERIC(14,4) | NULL       |
| `status`               | VARCHAR(30)   | NOT NULL   |

## 5.5 Stock Transfer

### ตาราง `pharmacy.stock_transfers`

| Column                     | Data Type   | Constraint              |
| -------------------------- | ----------- | ----------------------- |
| `transfer_id`              | BIGINT      | PK                      |
| `transfer_number`          | VARCHAR(30) | UNIQUE                  |
| `source_warehouse_id`      | BIGINT      | FK                      |
| `destination_warehouse_id` | BIGINT      | FK                      |
| `requested_by`             | BIGINT      | FK → hr.employees       |
| `approved_by`              | BIGINT      | FK → hr.employees, NULL |
| `transferred_at`           | TIMESTAMPTZ | NULL                    |
| `status`                   | VARCHAR(30) | NOT NULL                |

### ตาราง `pharmacy.stock_transfer_items`

| Column             | Data Type     | Constraint |
| ------------------ | ------------- | ---------- |
| `transfer_item_id` | BIGINT        | PK         |
| `transfer_id`      | BIGINT        | FK         |
| `product_id`       | BIGINT        | FK         |
| `lot_id`           | BIGINT        | FK         |
| `quantity`         | NUMERIC(14,4) | NOT NULL   |

## 5.6 Stock Count

### ตาราง `pharmacy.stock_counts`

| Column           | Data Type   | Constraint              |
| ---------------- | ----------- | ----------------------- |
| `stock_count_id` | BIGINT      | PK                      |
| `warehouse_id`   | BIGINT      | FK                      |
| `count_number`   | VARCHAR(30) | UNIQUE                  |
| `count_date`     | DATE        | NOT NULL                |
| `counted_by`     | BIGINT      | FK → hr.employees       |
| `approved_by`    | BIGINT      | FK → hr.employees, NULL |
| `status`         | VARCHAR(30) | NOT NULL                |

### ตาราง `pharmacy.stock_count_items`

| Column                | Data Type     | Constraint |
| --------------------- | ------------- | ---------- |
| `stock_count_item_id` | BIGINT        | PK         |
| `stock_count_id`      | BIGINT        | FK         |
| `product_id`          | BIGINT        | FK         |
| `lot_id`              | BIGINT        | FK         |
| `system_quantity`     | NUMERIC(14,4) | NOT NULL   |
| `counted_quantity`    | NUMERIC(14,4) | NOT NULL   |
| `variance_quantity`   | NUMERIC(14,4) | NOT NULL   |
| `reason`              | TEXT          | NULL       |

Index สำคัญ

- `products(product_code)`
- `inventory_lots(product_id, expiry_date)`
- `stock_balances(product_id, warehouse_id)`
- `stock_movements(product_id, movement_at DESC)`
- `stock_movements(lot_id, movement_at DESC)`
- `dispensings(prescription_id, status)`
- `dispensing_items(product_id, lot_id)`

ข้อควรระวัง: `stock_balances` เป็นยอดคงเหลือที่ใช้เพื่อประสิทธิภาพ ส่วน `stock_movements` เป็นประวัติธุรกรรมที่ใช้ตรวจสอบย้อนหลัง ห้ามใช้ยอดคงเหลือแทนประวัติการเคลื่อนไหวสินค้า

เอกสาร Domain 04 ระบุว่าต้องแยกความรับผิดชอบระหว่าง Clinical ที่สั่งยา Pharmacy ที่จ่ายยา และ Procurement ที่จัดซื้ออย่างชัดเจน&#x20;

04.Pharmacy_and_Inventory_Management.md

04.Pharmacy_and_Inventory_Management.md

# 6. Domain 05 — Laboratory & Diagnostic Imaging Management

เจ้าของข้อมูล: Domain 05

## 6.1 Diagnostic Order

### ตาราง `laboratory.diagnostic_catalogs`

| Column                  | Data Type    | Constraint |
| ----------------------- | ------------ | ---------- |
| `diagnostic_catalog_id` | BIGINT       | PK         |
| `test_code`             | VARCHAR(50)  | UNIQUE     |
| `test_name`             | VARCHAR(200) | NOT NULL   |
| `test_type`             | VARCHAR(30)  | NOT NULL   |
| `specimen_type`         | VARCHAR(50)  | NULL       |
| `description`           | TEXT         | NULL       |
| `status`                | VARCHAR(30)  | NOT NULL   |

### ตาราง `laboratory.diagnostic_orders`

| Column                | Data Type   | Constraint                        |
| --------------------- | ----------- | --------------------------------- |
| `diagnostic_order_id` | BIGINT      | PK                                |
| `order_number`        | VARCHAR(30) | UNIQUE                            |
| `encounter_id`        | BIGINT      | FK → clinical.clinical_encounters |
| `ordered_by`          | BIGINT      | FK → hr.employees                 |
| `ordered_at`          | TIMESTAMPTZ | NOT NULL                          |
| `priority`            | VARCHAR(30) | NOT NULL                          |
| `clinical_indication` | TEXT        | NULL                              |
| `status`              | VARCHAR(30) | NOT NULL                          |

### ตาราง `laboratory.diagnostic_order_items`

| Column                  | Data Type   | Constraint |
| ----------------------- | ----------- | ---------- |
| `order_item_id`         | BIGINT      | PK         |
| `diagnostic_order_id`   | BIGINT      | FK         |
| `diagnostic_catalog_id` | BIGINT      | FK         |
| `status`                | VARCHAR(30) | NOT NULL   |
| `requested_at`          | TIMESTAMPTZ | NOT NULL   |

## 6.2 Specimen

### ตาราง `laboratory.specimens`

| Column                | Data Type   | Constraint              |
| --------------------- | ----------- | ----------------------- |
| `specimen_id`         | BIGINT      | PK                      |
| `specimen_code`       | VARCHAR(50) | UNIQUE                  |
| `diagnostic_order_id` | BIGINT      | FK                      |
| `specimen_type`       | VARCHAR(50) | NOT NULL                |
| `collected_at`        | TIMESTAMPTZ | NULL                    |
| `collected_by`        | BIGINT      | FK → hr.employees, NULL |
| `received_at`         | TIMESTAMPTZ | NULL                    |
| `received_by`         | BIGINT      | FK → hr.employees, NULL |
| `status`              | VARCHAR(30) | NOT NULL                |
| `rejection_reason`    | TEXT        | NULL                    |

### ตาราง `laboratory.specimen_events`

| Column              | Data Type   | Constraint        |
| ------------------- | ----------- | ----------------- |
| `specimen_event_id` | BIGINT      | PK                |
| `specimen_id`       | BIGINT      | FK                |
| `event_type`        | VARCHAR(30) | NOT NULL          |
| `event_at`          | TIMESTAMPTZ | NOT NULL          |
| `performed_by`      | BIGINT      | FK → hr.employees |
| `notes`             | TEXT        | NULL              |

## 6.3 Laboratory Work & Results

### ตาราง `laboratory.laboratory_equipment`

| Column           | Data Type    | Constraint |
| ---------------- | ------------ | ---------- |
| `equipment_id`   | BIGINT       | PK         |
| `equipment_code` | VARCHAR(30)  | UNIQUE     |
| `equipment_name` | VARCHAR(150) | NOT NULL   |
| `serial_number`  | VARCHAR(100) | NULL       |
| `equipment_type` | VARCHAR(50)  | NOT NULL   |
| `status`         | VARCHAR(30)  | NOT NULL   |

### ตาราง `laboratory.laboratory_works`

| Column               | Data Type   | Constraint        |
| -------------------- | ----------- | ----------------- |
| `laboratory_work_id` | BIGINT      | PK                |
| `specimen_id`        | BIGINT      | FK                |
| `equipment_id`       | BIGINT      | FK, NULL          |
| `performed_by`       | BIGINT      | FK → hr.employees |
| `started_at`         | TIMESTAMPTZ | NULL              |
| `completed_at`       | TIMESTAMPTZ | NULL              |
| `status`             | VARCHAR(30) | NOT NULL          |

### ตาราง `laboratory.laboratory_results`

| Column               | Data Type   | Constraint              |
| -------------------- | ----------- | ----------------------- |
| `result_id`          | BIGINT      | PK                      |
| `laboratory_work_id` | BIGINT      | FK                      |
| `result_version`     | INTEGER     | NOT NULL                |
| `result_at`          | TIMESTAMPTZ | NOT NULL                |
| `verified_by`        | BIGINT      | FK → hr.employees, NULL |
| `verified_at`        | TIMESTAMPTZ | NULL                    |
| `result_status`      | VARCHAR(30) | NOT NULL                |

Unique: `(laboratory_work_id, result_version)`

### ตาราง `laboratory.laboratory_result_values`

| Column                    | Data Type     | Constraint |
| ------------------------- | ------------- | ---------- |
| `result_value_id`         | BIGINT        | PK         |
| `result_id`               | BIGINT        | FK         |
| `parameter_code`          | VARCHAR(50)   | NOT NULL   |
| `parameter_name`          | VARCHAR(150)  | NOT NULL   |
| `numeric_value`           | NUMERIC(16,6) | NULL       |
| `text_value`              | TEXT          | NULL       |
| `unit`                    | VARCHAR(30)   | NULL       |
| `reference_low_snapshot`  | NUMERIC(16,6) | NULL       |
| `reference_high_snapshot` | NUMERIC(16,6) | NULL       |
| `reference_text_snapshot` | VARCHAR(200)  | NULL       |
| `interpretation`          | VARCHAR(100)  | NULL       |

ต้องเก็บช่วงค่าอ้างอิง ณ เวลาที่รายงานผล เพื่อป้องกันการเปลี่ยนแปลงของ Master Data ในอนาคตกระทบผลตรวจย้อนหลัง

## 6.4 Imaging

### ตาราง `laboratory.imaging_studies`

| Column                | Data Type    | Constraint        |
| --------------------- | ------------ | ----------------- |
| `imaging_study_id`    | BIGINT       | PK                |
| `diagnostic_order_id` | BIGINT       | FK                |
| `imaging_type`        | VARCHAR(30)  | NOT NULL          |
| `body_region`         | VARCHAR(100) | NOT NULL          |
| `equipment_id`        | BIGINT       | FK, NULL          |
| `performed_by`        | BIGINT       | FK → hr.employees |
| `performed_at`        | TIMESTAMPTZ  | NOT NULL          |
| `status`              | VARCHAR(30)  | NOT NULL          |

### ตาราง `laboratory.medical_images`

| Column             | Data Type   | Constraint |
| ------------------ | ----------- | ---------- |
| `medical_image_id` | BIGINT      | PK         |
| `imaging_study_id` | BIGINT      | FK         |
| `file_reference`   | TEXT        | NOT NULL   |
| `image_type`       | VARCHAR(30) | NOT NULL   |
| `captured_at`      | TIMESTAMPTZ | NOT NULL   |
| `metadata`         | JSONB       | NULL       |

### ตาราง `laboratory.imaging_reports`

| Column              | Data Type   | Constraint              |
| ------------------- | ----------- | ----------------------- |
| `imaging_report_id` | BIGINT      | PK                      |
| `imaging_study_id`  | BIGINT      | FK                      |
| `report_version`    | INTEGER     | NOT NULL                |
| `findings`          | TEXT        | NULL                    |
| `conclusion`        | TEXT        | NULL                    |
| `reported_by`       | BIGINT      | FK → hr.employees       |
| `reported_at`       | TIMESTAMPTZ | NOT NULL                |
| `verified_by`       | BIGINT      | FK → hr.employees, NULL |
| `status`            | VARCHAR(30) | NOT NULL                |

## 6.5 Quality Control

### ตาราง `laboratory.quality_control_records`

| Column               | Data Type     | Constraint        |
| -------------------- | ------------- | ----------------- |
| `quality_control_id` | BIGINT        | PK                |
| `equipment_id`       | BIGINT        | FK                |
| `control_type`       | VARCHAR(50)   | NOT NULL          |
| `measured_value`     | NUMERIC(16,6) | NULL              |
| `expected_value`     | NUMERIC(16,6) | NULL              |
| `result_status`      | VARCHAR(30)   | NOT NULL          |
| `checked_at`         | TIMESTAMPTZ   | NOT NULL          |
| `checked_by`         | BIGINT        | FK → hr.employees |

Index สำคัญ

- `diagnostic_orders(encounter_id, ordered_at DESC)`
- `diagnostic_order_items(diagnostic_order_id)`
- `specimens(specimen_code)`
- `laboratory_works(specimen_id, status)`
- `laboratory_results(laboratory_work_id, result_version)`
- `imaging_studies(diagnostic_order_id)`
- `imaging_reports(imaging_study_id, reported_at DESC)`

เอกสาร Domain 05 กำหนดให้คำสั่งตรวจ ตัวอย่าง งานตรวจ ผลตรวจ ภาพ และรายงานผลเป็นคนละข้อมูล จึงต้องแยกตารางตามแบบนี้&#x20;

05.Laboratory_and_Diagnostic_Imaging_Management.md

# 7. Domain 06 — Surgery & Treatment Management

เจ้าของข้อมูล: Domain 06

## 7.1 Surgery Master

### ตาราง `surgery.surgery_catalogs`

| Column                       | Data Type    | Constraint |
| ---------------------------- | ------------ | ---------- |
| `surgery_catalog_id`         | BIGINT       | PK         |
| `surgery_code`               | VARCHAR(50)  | UNIQUE     |
| `surgery_name`               | VARCHAR(200) | NOT NULL   |
| `surgery_type`               | VARCHAR(50)  | NOT NULL   |
| `estimated_duration_minutes` | INTEGER      | NULL       |
| `anesthesia_type`            | VARCHAR(50)  | NULL       |
| `description`                | TEXT         | NULL       |
| `status`                     | VARCHAR(30)  | NOT NULL   |

### ตาราง `surgery.anesthesia_catalogs`

| Column                  | Data Type    | Constraint |
| ----------------------- | ------------ | ---------- |
| `anesthesia_catalog_id` | BIGINT       | PK         |
| `anesthesia_code`       | VARCHAR(50)  | UNIQUE     |
| `anesthesia_name`       | VARCHAR(150) | NOT NULL   |
| `description`           | TEXT         | NULL       |
| `status`                | VARCHAR(30)  | NOT NULL   |

## 7.2 Surgery Request & Assessment

### ตาราง `surgery.surgery_requests`

| Column               | Data Type   | Constraint                        |
| -------------------- | ----------- | --------------------------------- |
| `surgery_request_id` | BIGINT      | PK                                |
| `request_number`     | VARCHAR(30) | UNIQUE                            |
| `encounter_id`       | BIGINT      | FK → clinical.clinical_encounters |
| `surgery_catalog_id` | BIGINT      | FK                                |
| `requested_by`       | BIGINT      | FK → hr.employees                 |
| `requested_at`       | TIMESTAMPTZ | NOT NULL                          |
| `medical_indication` | TEXT        | NOT NULL                          |
| `priority`           | VARCHAR(30) | NOT NULL                          |
| `status`             | VARCHAR(30) | NOT NULL                          |

### ตาราง `surgery.preoperative_assessments`

| Column                 | Data Type   | Constraint        |
| ---------------------- | ----------- | ----------------- |
| `assessment_id`        | BIGINT      | PK                |
| `surgery_request_id`   | BIGINT      | FK                |
| `assessed_by`          | BIGINT      | FK → hr.employees |
| `assessment_result`    | TEXT        | NOT NULL          |
| `risk_level`           | VARCHAR(30) | NOT NULL          |
| `assessed_at`          | TIMESTAMPTZ | NOT NULL          |
| `approved_for_surgery` | BOOLEAN     | NOT NULL          |

### ตาราง `surgery.surgery_consents`

| Column                       | Data Type   | Constraint              |
| ---------------------------- | ----------- | ----------------------- |
| `consent_id`                 | BIGINT      | PK                      |
| `surgery_request_id`         | BIGINT      | FK                      |
| `customer_id`                | BIGINT      | FK → customer.customers |
| `consent_type`               | VARCHAR(30) | NOT NULL                |
| `consented_at`               | TIMESTAMPTZ | NOT NULL                |
| `consent_document_reference` | TEXT        | NULL                    |
| `witness_employee_id`        | BIGINT      | FK → hr.employees, NULL |

## 7.3 Surgery Schedule & Execution

### ตาราง `surgery.surgery_schedules`

| Column               | Data Type   | Constraint             |
| -------------------- | ----------- | ---------------------- |
| `schedule_id`        | BIGINT      | PK                     |
| `surgery_request_id` | BIGINT      | FK                     |
| `room_id`            | BIGINT      | FK → appointment.rooms |
| `scheduled_start`    | TIMESTAMPTZ | NOT NULL               |
| `scheduled_end`      | TIMESTAMPTZ | NOT NULL               |
| `status`             | VARCHAR(30) | NOT NULL               |

### ตาราง `surgery.surgery_records`

| Column                       | Data Type   | Constraint |
| ---------------------------- | ----------- | ---------- |
| `surgery_record_id`          | BIGINT      | PK         |
| `surgery_number`             | VARCHAR(30) | UNIQUE     |
| `schedule_id`                | BIGINT      | FK         |
| `encounter_id`               | BIGINT      | FK         |
| `started_at`                 | TIMESTAMPTZ | NOT NULL   |
| `completed_at`               | TIMESTAMPTZ | NULL       |
| `operation_details`          | TEXT        | NULL       |
| `outcome`                    | TEXT        | NULL       |
| `postoperative_instructions` | TEXT        | NULL       |
| `status`                     | VARCHAR(30) | NOT NULL   |

### ตาราง `surgery.surgery_team_members`

| Column              | Data Type   | Constraint        |
| ------------------- | ----------- | ----------------- |
| `team_member_id`    | BIGINT      | PK                |
| `surgery_record_id` | BIGINT      | FK                |
| `employee_id`       | BIGINT      | FK → hr.employees |
| `responsibility`    | VARCHAR(50) | NOT NULL          |
| `joined_at`         | TIMESTAMPTZ | NULL              |
| `left_at`           | TIMESTAMPTZ | NULL              |

Unique: `(surgery_record_id, employee_id, responsibility)`

## 7.4 Anesthesia

### ตาราง `surgery.anesthesia_records`

| Column                  | Data Type   | Constraint        |
| ----------------------- | ----------- | ----------------- |
| `anesthesia_id`         | BIGINT      | PK                |
| `surgery_record_id`     | BIGINT      | FK, UNIQUE        |
| `anesthesia_catalog_id` | BIGINT      | FK                |
| `anesthetist_id`        | BIGINT      | FK → hr.employees |
| `started_at`            | TIMESTAMPTZ | NOT NULL          |
| `ended_at`              | TIMESTAMPTZ | NULL              |
| `notes`                 | TEXT        | NULL              |

### ตาราง `surgery.anesthesia_monitorings`

| Column            | Data Type     | Constraint        |
| ----------------- | ------------- | ----------------- |
| `monitoring_id`   | BIGINT        | PK                |
| `anesthesia_id`   | BIGINT        | FK                |
| `recorded_at`     | TIMESTAMPTZ   | NOT NULL          |
| `parameter_name`  | VARCHAR(50)   | NOT NULL          |
| `parameter_value` | NUMERIC(12,4) | NOT NULL          |
| `unit`            | VARCHAR(20)   | NOT NULL          |
| `recorded_by`     | BIGINT        | FK → hr.employees |

## 7.5 Postoperative

### ตาราง `surgery.postoperative_records`

| Column              | Data Type    | Constraint        |
| ------------------- | ------------ | ----------------- |
| `postoperative_id`  | BIGINT       | PK                |
| `surgery_record_id` | BIGINT       | FK                |
| `recorded_at`       | TIMESTAMPTZ  | NOT NULL          |
| `observation`       | TEXT         | NULL              |
| `pain_score`        | NUMERIC(5,2) | NULL              |
| `recorded_by`       | BIGINT       | FK → hr.employees |

### ตาราง `surgery.surgery_complications`

| Column              | Data Type    | Constraint        |
| ------------------- | ------------ | ----------------- |
| `complication_id`   | BIGINT       | PK                |
| `surgery_record_id` | BIGINT       | FK                |
| `complication_type` | VARCHAR(100) | NOT NULL          |
| `description`       | TEXT         | NOT NULL          |
| `occurred_at`       | TIMESTAMPTZ  | NOT NULL          |
| `reported_by`       | BIGINT       | FK → hr.employees |

## 7.6 Material Usage

### ตาราง `surgery.surgery_material_usages`

| Column              | Data Type     | Constraint                   |
| ------------------- | ------------- | ---------------------------- |
| `material_usage_id` | BIGINT        | PK                           |
| `surgery_record_id` | BIGINT        | FK                           |
| `product_id`        | BIGINT        | FK → pharmacy.products       |
| `lot_id`            | BIGINT        | FK → pharmacy.inventory_lots |
| `quantity_used`     | NUMERIC(14,4) | NOT NULL                     |
| `used_at`           | TIMESTAMPTZ   | NOT NULL                     |
| `recorded_by`       | BIGINT        | FK → hr.employees            |

ตารางนี้เป็นหลักฐานการใช้วัสดุจริง ส่วนการตัดสต็อกยังต้องทำผ่านธุรกรรมของ Pharmacy

Index สำคัญ

- `surgery_requests(encounter_id, status)`
- `surgery_schedules(scheduled_start, scheduled_end)`
- `surgery_records(encounter_id, started_at DESC)`
- `anesthesia_monitorings(anesthesia_id, recorded_at)`
- `surgery_material_usages(surgery_record_id, product_id)`

# 8. Domain 07 — Billing & Payment Management

เจ้าของข้อมูล: Domain 07

Domain นี้เป็นเจ้าของข้อมูลทางการเงินด้านการเรียกเก็บเงิน ไม่ใช่เจ้าของธุรกรรมต้นทางของการรักษา

## 8.1 Invoice

### ตาราง `billing.invoices`

| Column               | Data Type     | Constraint                              |
| -------------------- | ------------- | --------------------------------------- |
| `invoice_id`         | BIGINT        | PK                                      |
| `invoice_number`     | VARCHAR(30)   | UNIQUE                                  |
| `customer_id`        | BIGINT        | FK                                      |
| `encounter_id`       | BIGINT        | FK → clinical.clinical_encounters, NULL |
| `branch_id`          | BIGINT        | FK                                      |
| `invoice_date`       | TIMESTAMPTZ   | NOT NULL                                |
| `due_date`           | DATE          | NULL                                    |
| `subtotal`           | NUMERIC(14,2) | NOT NULL                                |
| `discount_total`     | NUMERIC(14,2) | NOT NULL DEFAULT 0                      |
| `tax_total`          | NUMERIC(14,2) | NOT NULL DEFAULT 0                      |
| `grand_total`        | NUMERIC(14,2) | NOT NULL                                |
| `outstanding_amount` | NUMERIC(14,2) | NOT NULL                                |
| `status`             | VARCHAR(30)   | NOT NULL                                |
| `created_by`         | BIGINT        | FK → hr.employees                       |

## 8.2 Invoice Items

### ตาราง `billing.invoice_items`

| Column                 | Data Type     | Constraint                       |
| ---------------------- | ------------- | -------------------------------- |
| `invoice_item_id`      | BIGINT        | PK                               |
| `invoice_id`           | BIGINT        | FK                               |
| `service_catalog_id`   | BIGINT        | FK → core.service_catalogs, NULL |
| `source_domain`        | VARCHAR(30)   | NOT NULL                         |
| `source_record_type`   | VARCHAR(50)   | NOT NULL                         |
| `source_record_id`     | BIGINT        | NOT NULL                         |
| `description_snapshot` | VARCHAR(255)  | NOT NULL                         |
| `quantity`             | NUMERIC(14,4) | NOT NULL                         |
| `unit_price_snapshot`  | NUMERIC(14,4) | NOT NULL                         |
| `discount_amount`      | NUMERIC(14,2) | NOT NULL DEFAULT 0               |
| `tax_rate_snapshot`    | NUMERIC(7,4)  | NOT NULL DEFAULT 0               |
| `tax_amount`           | NUMERIC(14,2) | NOT NULL DEFAULT 0               |
| `line_total`           | NUMERIC(14,2) | NOT NULL                         |

ข้อควรระวัง: ไม่ควรกำหนด Unique ที่ `(source_domain, source_record_id)` แบบตายตัว หากหนึ่งธุรกรรมต้นทางสามารถสร้างหลายรายการเรียกเก็บได้ ให้สร้างตาราง `billing.charge_sources` สำหรับควบคุมการรับรายการต้นทางและการเรียกเก็บซ้ำโดยเฉพาะ

### ตาราง `billing.charge_sources`

| Column               | Data Type   | Constraint               |
| -------------------- | ----------- | ------------------------ |
| `charge_source_id`   | BIGINT      | PK                       |
| `source_domain`      | VARCHAR(30) | NOT NULL                 |
| `source_record_type` | VARCHAR(50) | NOT NULL                 |
| `source_record_id`   | BIGINT      | NOT NULL                 |
| `invoice_item_id`    | BIGINT      | FK → invoice_items, NULL |
| `received_at`        | TIMESTAMPTZ | NOT NULL                 |
| `status`             | VARCHAR(30) | NOT NULL                 |

Unique: `(source_domain, source_record_type, source_record_id)` หากกำหนดให้ธุรกรรมต้นทางแต่ละรายการถูกส่งมาเรียกเก็บได้ครั้งเดียว

## 8.3 Payment

### ตาราง `billing.payments`

| Column                  | Data Type     | Constraint        |
| ----------------------- | ------------- | ----------------- |
| `payment_id`            | BIGINT        | PK                |
| `payment_number`        | VARCHAR(30)   | UNIQUE            |
| `customer_id`           | BIGINT        | FK                |
| `branch_id`             | BIGINT        | FK                |
| `amount`                | NUMERIC(14,2) | NOT NULL          |
| `payment_method`        | VARCHAR(30)   | NOT NULL          |
| `transaction_reference` | VARCHAR(150)  | NULL              |
| `paid_at`               | TIMESTAMPTZ   | NOT NULL          |
| `received_by`           | BIGINT        | FK → hr.employees |
| `status`                | VARCHAR(30)   | NOT NULL          |

### ตาราง `billing.payment_allocations`

| Column             | Data Type     | Constraint |
| ------------------ | ------------- | ---------- |
| `allocation_id`    | BIGINT        | PK         |
| `payment_id`       | BIGINT        | FK         |
| `invoice_id`       | BIGINT        | FK         |
| `allocated_amount` | NUMERIC(14,2) | NOT NULL   |
| `allocated_at`     | TIMESTAMPTZ   | NOT NULL   |

Unique: `(payment_id, invoice_id)` หากไม่อนุญาตให้แยกหลาย allocation รายการสำหรับคู่เดียวกัน

## 8.4 Receipt

### ตาราง `billing.receipts`

| Column           | Data Type   | Constraint        |
| ---------------- | ----------- | ----------------- |
| `receipt_id`     | BIGINT      | PK                |
| `receipt_number` | VARCHAR(30) | UNIQUE            |
| `payment_id`     | BIGINT      | FK                |
| `issued_at`      | TIMESTAMPTZ | NOT NULL          |
| `issued_by`      | BIGINT      | FK → hr.employees |
| `file_reference` | TEXT        | NULL              |
| `status`         | VARCHAR(30) | NOT NULL          |

### ตาราง `billing.tax_invoices`

| Column                     | Data Type     | Constraint |
| -------------------------- | ------------- | ---------- |
| `tax_invoice_id`           | BIGINT        | PK         |
| `invoice_id`               | BIGINT        | FK         |
| `tax_invoice_number`       | VARCHAR(50)   | UNIQUE     |
| `customer_tax_id_snapshot` | VARCHAR(20)   | NULL       |
| `customer_name_snapshot`   | VARCHAR(255)  | NOT NULL   |
| `billing_address_snapshot` | TEXT          | NULL       |
| `issued_at`                | TIMESTAMPTZ   | NOT NULL   |
| `tax_amount`               | NUMERIC(14,2) | NOT NULL   |
| `file_reference`           | TEXT          | NULL       |

## 8.5 Refund

### ตาราง `billing.refunds`

| Column          | Data Type     | Constraint        |
| --------------- | ------------- | ----------------- |
| `refund_id`     | BIGINT        | PK                |
| `refund_number` | VARCHAR(30)   | UNIQUE            |
| `payment_id`    | BIGINT        | FK                |
| `invoice_id`    | BIGINT        | FK                |
| `refund_amount` | NUMERIC(14,2) | NOT NULL          |
| `refund_reason` | TEXT          | NOT NULL          |
| `refunded_at`   | TIMESTAMPTZ   | NULL              |
| `approved_by`   | BIGINT        | FK → hr.employees |
| `status`        | VARCHAR(30)   | NOT NULL          |

## 8.6 Deposit

### ตาราง `billing.customer_deposits`

| Column             | Data Type     | Constraint          |
| ------------------ | ------------- | ------------------- |
| `deposit_id`       | BIGINT        | PK                  |
| `deposit_number`   | VARCHAR(30)   | UNIQUE              |
| `customer_id`      | BIGINT        | FK                  |
| `payment_id`       | BIGINT        | FK → payments, NULL |
| `deposit_amount`   | NUMERIC(14,2) | NOT NULL            |
| `remaining_amount` | NUMERIC(14,2) | NOT NULL            |
| `received_at`      | TIMESTAMPTZ   | NOT NULL            |
| `status`           | VARCHAR(30)   | NOT NULL            |

### ตาราง `billing.deposit_allocations`

| Column                  | Data Type     | Constraint |
| ----------------------- | ------------- | ---------- |
| `deposit_allocation_id` | BIGINT        | PK         |
| `deposit_id`            | BIGINT        | FK         |
| `invoice_id`            | BIGINT        | FK         |
| `allocated_amount`      | NUMERIC(14,2) | NOT NULL   |
| `allocated_at`          | TIMESTAMPTZ   | NOT NULL   |

Index สำคัญ

- `invoices(customer_id, invoice_date DESC)`
- `invoices(invoice_number)`
- `invoice_items(invoice_id)`
- `charge_sources(source_domain, source_record_type, source_record_id)`
- `payments(customer_id, paid_at DESC)`
- `payment_allocations(invoice_id)`
- `refunds(payment_id)`
- `customer_deposits(customer_id, status)`

เอกสาร Domain 07 กำหนดให้ Billing เป็นเจ้าของใบแจ้งหนี้ การรับชำระ เงินมัดจำ และยอดค้างชำระ พร้อมกำหนดให้เก็บ Snapshot ราคาในธุรกรรม&#x20;

07.Billing_and_Payment_Management.md

07.Billing_and_Payment_Management.md

# 9. Domain 08 — Marketing & Customer Relationship Management

เจ้าของข้อมูล: Domain 08

## 9.1 Lead & Campaign

### ตาราง `crm.leads`

| Column            | Data Type    | Constraint                    |
| ----------------- | ------------ | ----------------------------- |
| `lead_id`         | BIGINT       | PK                            |
| `lead_number`     | VARCHAR(30)  | UNIQUE                        |
| `customer_id`     | BIGINT       | FK → customer.customers, NULL |
| `lead_name`       | VARCHAR(200) | NOT NULL                      |
| `phone`           | VARCHAR(30)  | NULL                          |
| `email`           | VARCHAR(255) | NULL                          |
| `lead_source`     | VARCHAR(50)  | NOT NULL                      |
| `contact_channel` | VARCHAR(50)  | NULL                          |
| `status`          | VARCHAR(30)  | NOT NULL                      |
| `created_at`      | TIMESTAMPTZ  | NOT NULL                      |

### ตาราง `crm.campaigns`

| Column          | Data Type     | Constraint |
| --------------- | ------------- | ---------- |
| `campaign_id`   | BIGINT        | PK         |
| `campaign_code` | VARCHAR(30)   | UNIQUE     |
| `campaign_name` | VARCHAR(200)  | NOT NULL   |
| `campaign_type` | VARCHAR(50)   | NOT NULL   |
| `start_date`    | DATE          | NOT NULL   |
| `end_date`      | DATE          | NOT NULL   |
| `budget`        | NUMERIC(14,2) | NULL       |
| `status`        | VARCHAR(30)   | NOT NULL   |

### ตาราง `crm.campaign_customers`

| Column                 | Data Type   | Constraint |
| ---------------------- | ----------- | ---------- |
| `campaign_customer_id` | BIGINT      | PK         |
| `campaign_id`          | BIGINT      | FK         |
| `customer_id`          | BIGINT      | FK         |
| `participation_status` | VARCHAR(30) | NOT NULL   |
| `joined_at`            | TIMESTAMPTZ | NULL       |

Unique: `(campaign_id, customer_id)`

## 9.2 Promotion & Coupon

### ตาราง `crm.promotions`

| Column           | Data Type     | Constraint |
| ---------------- | ------------- | ---------- |
| `promotion_id`   | BIGINT        | PK         |
| `campaign_id`    | BIGINT        | FK, NULL   |
| `promotion_code` | VARCHAR(30)   | UNIQUE     |
| `promotion_name` | VARCHAR(200)  | NOT NULL   |
| `promotion_type` | VARCHAR(30)   | NOT NULL   |
| `discount_value` | NUMERIC(14,2) | NOT NULL   |
| `start_at`       | TIMESTAMPTZ   | NOT NULL   |
| `end_at`         | TIMESTAMPTZ   | NOT NULL   |
| `status`         | VARCHAR(30)   | NOT NULL   |

### ตาราง `crm.coupons`

| Column         | Data Type   | Constraint |
| -------------- | ----------- | ---------- |
| `coupon_id`    | BIGINT      | PK         |
| `promotion_id` | BIGINT      | FK         |
| `coupon_code`  | VARCHAR(50) | UNIQUE     |
| `coupon_type`  | VARCHAR(30) | NOT NULL   |
| `usage_limit`  | INTEGER     | NULL       |
| `status`       | VARCHAR(30) | NOT NULL   |

### ตาราง `crm.customer_coupons`

| Column               | Data Type   | Constraint                  |
| -------------------- | ----------- | --------------------------- |
| `customer_coupon_id` | BIGINT      | PK                          |
| `customer_id`        | BIGINT      | FK                          |
| `coupon_id`          | BIGINT      | FK                          |
| `issued_at`          | TIMESTAMPTZ | NOT NULL                    |
| `used_at`            | TIMESTAMPTZ | NULL                        |
| `invoice_id`         | BIGINT      | FK → billing.invoices, NULL |
| `status`             | VARCHAR(30) | NOT NULL                    |

## 9.3 Membership & Loyalty

### ตาราง `crm.memberships`

| Column              | Data Type   | Constraint         |
| ------------------- | ----------- | ------------------ |
| `membership_id`     | BIGINT      | PK                 |
| `customer_id`       | BIGINT      | FK, UNIQUE         |
| `membership_number` | VARCHAR(30) | UNIQUE             |
| `membership_level`  | VARCHAR(30) | NOT NULL           |
| `points_balance`    | BIGINT      | NOT NULL DEFAULT 0 |
| `enrolled_at`       | TIMESTAMPTZ | NOT NULL           |
| `status`            | VARCHAR(30) | NOT NULL           |

### ตาราง `crm.loyalty_transactions`

| Column                   | Data Type    | Constraint |
| ------------------------ | ------------ | ---------- |
| `loyalty_transaction_id` | BIGINT       | PK         |
| `membership_id`          | BIGINT       | FK         |
| `transaction_type`       | VARCHAR(30)  | NOT NULL   |
| `points`                 | BIGINT       | NOT NULL   |
| `reference_number`       | VARCHAR(100) | NULL       |
| `transaction_at`         | TIMESTAMPTZ  | NOT NULL   |
| `expiry_at`              | TIMESTAMPTZ  | NULL       |
| `description`            | TEXT         | NULL       |

แนะนำให้ `points_balance` เป็นยอดคงเหลือที่ปรับปรุงเพื่อประสิทธิภาพ ส่วน `loyalty_transactions` เป็นบัญชีรายการคะแนนที่ตรวจสอบย้อนหลังได้

## 9.4 Customer Relationship

### ตาราง `crm.customer_interactions`

| Column               | Data Type   | Constraint              |
| -------------------- | ----------- | ----------------------- |
| `interaction_id`     | BIGINT      | PK                      |
| `customer_id`        | BIGINT      | FK                      |
| `interaction_type`   | VARCHAR(50) | NOT NULL                |
| `channel`            | VARCHAR(30) | NOT NULL                |
| `interaction_detail` | TEXT        | NULL                    |
| `employee_id`        | BIGINT      | FK → hr.employees, NULL |
| `interacted_at`      | TIMESTAMPTZ | NOT NULL                |

### ตาราง `crm.customer_communications`

| Column               | Data Type    | Constraint |
| -------------------- | ------------ | ---------- |
| `communication_id`   | BIGINT       | PK         |
| `customer_id`        | BIGINT       | FK         |
| `campaign_id`        | BIGINT       | FK, NULL   |
| `channel`            | VARCHAR(30)  | NOT NULL   |
| `message_content`    | TEXT         | NULL       |
| `sent_at`            | TIMESTAMPTZ  | NULL       |
| `delivery_status`    | VARCHAR(30)  | NOT NULL   |
| `provider_reference` | VARCHAR(150) | NULL       |

### ตาราง `crm.customer_feedback`

| Column          | Data Type   | Constraint                              |
| --------------- | ----------- | --------------------------------------- |
| `feedback_id`   | BIGINT      | PK                                      |
| `customer_id`   | BIGINT      | FK                                      |
| `encounter_id`  | BIGINT      | FK → clinical.clinical_encounters, NULL |
| `rating`        | SMALLINT    | NOT NULL                                |
| `feedback_text` | TEXT        | NULL                                    |
| `submitted_at`  | TIMESTAMPTZ | NOT NULL                                |

Check: `rating BETWEEN 1 AND 5`

### ตาราง `crm.customer_complaints`

| Column             | Data Type   | Constraint |
| ------------------ | ----------- | ---------- |
| `complaint_id`     | BIGINT      | PK         |
| `customer_id`      | BIGINT      | FK         |
| `complaint_number` | VARCHAR(30) | UNIQUE     |
| `complaint_type`   | VARCHAR(50) | NOT NULL   |
| `complaint_detail` | TEXT        | NOT NULL   |
| `reported_at`      | TIMESTAMPTZ | NOT NULL   |
| `status`           | VARCHAR(30) | NOT NULL   |

### ตาราง `crm.complaint_actions`

| Column                | Data Type   | Constraint        |
| --------------------- | ----------- | ----------------- |
| `complaint_action_id` | BIGINT      | PK                |
| `complaint_id`        | BIGINT      | FK                |
| `assigned_to`         | BIGINT      | FK → hr.employees |
| `action_detail`       | TEXT        | NOT NULL          |
| `action_at`           | TIMESTAMPTZ | NOT NULL          |
| `status`              | VARCHAR(30) | NOT NULL          |

Index สำคัญ

- `leads(status, created_at DESC)`
- `campaigns(start_date, end_date, status)`
- `campaign_customers(campaign_id, customer_id)`
- `customer_coupons(customer_id, status)`
- `memberships(customer_id)`
- `loyalty_transactions(membership_id, transaction_at DESC)`
- `customer_interactions(customer_id, interacted_at DESC)`
- `customer_complaints(customer_id, status)`

ข้อกำหนดสำคัญ: ก่อนส่งข้อความการตลาด ต้องตรวจสอบความยินยอมของลูกค้าจาก `customer.customer_consents` ไม่ใช่ตรวจสอบเฉพาะสถานะใน CRM เท่านั้น

# 10. Domain 09 — Procurement & Supplier Management

เจ้าของข้อมูล: Domain 09

## 10.1 Supplier Master

### ตาราง `procurement.suppliers`

| Column          | Data Type    | Constraint |
| --------------- | ------------ | ---------- |
| `supplier_id`   | BIGINT       | PK         |
| `supplier_code` | VARCHAR(30)  | UNIQUE     |
| `supplier_name` | VARCHAR(200) | NOT NULL   |
| `tax_id`        | VARCHAR(20)  | NULL       |
| `supplier_type` | VARCHAR(50)  | NOT NULL   |
| `payment_terms` | VARCHAR(100) | NULL       |
| `status`        | VARCHAR(30)  | NOT NULL   |
| `created_at`    | TIMESTAMPTZ  | NOT NULL   |

### ตาราง `procurement.supplier_contacts`

| Column                | Data Type    | Constraint             |
| --------------------- | ------------ | ---------------------- |
| `supplier_contact_id` | BIGINT       | PK                     |
| `supplier_id`         | BIGINT       | FK                     |
| `contact_name`        | VARCHAR(150) | NOT NULL               |
| `phone`               | VARCHAR(30)  | NULL                   |
| `email`               | VARCHAR(255) | NULL                   |
| `position`            | VARCHAR(100) | NULL                   |
| `is_primary`          | BOOLEAN      | NOT NULL DEFAULT FALSE |

### ตาราง `procurement.supplier_addresses`

| Column                | Data Type    | Constraint |
| --------------------- | ------------ | ---------- |
| `supplier_address_id` | BIGINT       | PK         |
| `supplier_id`         | BIGINT       | FK         |
| `address_type`        | VARCHAR(30)  | NOT NULL   |
| `address_line`        | TEXT         | NOT NULL   |
| `province`            | VARCHAR(100) | NULL       |
| `postal_code`         | VARCHAR(10)  | NULL       |
| `country_code`        | CHAR(2)      | NOT NULL   |

### ตาราง `procurement.supplier_documents`

| Column                 | Data Type   | Constraint |
| ---------------------- | ----------- | ---------- |
| `supplier_document_id` | BIGINT      | PK         |
| `supplier_id`          | BIGINT      | FK         |
| `document_type`        | VARCHAR(50) | NOT NULL   |
| `file_reference`       | TEXT        | NOT NULL   |
| `issued_date`          | DATE        | NULL       |
| `expiry_date`          | DATE        | NULL       |

### ตาราง `procurement.supplier_products`

| Column                   | Data Type     | Constraint             |
| ------------------------ | ------------- | ---------------------- |
| `supplier_product_id`    | BIGINT        | PK                     |
| `supplier_id`            | BIGINT        | FK                     |
| `product_id`             | BIGINT        | FK → pharmacy.products |
| `supplier_product_code`  | VARCHAR(50)   | NULL                   |
| `purchase_unit`          | VARCHAR(30)   | NOT NULL               |
| `purchase_price`         | NUMERIC(14,4) | NOT NULL               |
| `minimum_order_quantity` | NUMERIC(14,4) | NULL                   |
| `lead_time_days`         | INTEGER       | NULL                   |
| `status`                 | VARCHAR(30)   | NOT NULL               |

Unique: `(supplier_id, product_id)`

## 10.2 Purchase Requisition

### ตาราง `procurement.purchase_requisitions`

| Column               | Data Type   | Constraint        |
| -------------------- | ----------- | ----------------- |
| `requisition_id`     | BIGINT      | PK                |
| `requisition_number` | VARCHAR(30) | UNIQUE            |
| `requested_by`       | BIGINT      | FK → hr.employees |
| `branch_id`          | BIGINT      | FK                |
| `requested_at`       | TIMESTAMPTZ | NOT NULL          |
| `reason`             | TEXT        | NULL              |
| `status`             | VARCHAR(30) | NOT NULL          |

### ตาราง `procurement.purchase_requisition_items`

| Column                 | Data Type     | Constraint             |
| ---------------------- | ------------- | ---------------------- |
| `requisition_item_id`  | BIGINT        | PK                     |
| `requisition_id`       | BIGINT        | FK                     |
| `product_id`           | BIGINT        | FK → pharmacy.products |
| `requested_quantity`   | NUMERIC(14,4) | NOT NULL               |
| `required_date`        | DATE          | NULL                   |
| `estimated_unit_price` | NUMERIC(14,4) | NULL                   |
| `notes`                | TEXT          | NULL                   |

## 10.3 Purchase Order

### ตาราง `procurement.purchase_orders`

| Column                   | Data Type     | Constraint |
| ------------------------ | ------------- | ---------- |
| `purchase_order_id`      | BIGINT        | PK         |
| `purchase_order_number`  | VARCHAR(30)   | UNIQUE     |
| `supplier_id`            | BIGINT        | FK         |
| `requisition_id`         | BIGINT        | FK, NULL   |
| `branch_id`              | BIGINT        | FK         |
| `ordered_at`             | TIMESTAMPTZ   | NOT NULL   |
| `expected_delivery_date` | DATE          | NULL       |
| `subtotal`               | NUMERIC(14,2) | NOT NULL   |
| `tax_total`              | NUMERIC(14,2) | NOT NULL   |
| `grand_total`            | NUMERIC(14,2) | NOT NULL   |
| `status`                 | VARCHAR(30)   | NOT NULL   |

### ตาราง `procurement.purchase_order_items`

| Column                   | Data Type     | Constraint             |
| ------------------------ | ------------- | ---------------------- |
| `purchase_order_item_id` | BIGINT        | PK                     |
| `purchase_order_id`      | BIGINT        | FK                     |
| `product_id`             | BIGINT        | FK → pharmacy.products |
| `ordered_quantity`       | NUMERIC(14,4) | NOT NULL               |
| `unit_price`             | NUMERIC(14,4) | NOT NULL               |
| `tax_rate`               | NUMERIC(7,4)  | NOT NULL DEFAULT 0     |
| `line_total`             | NUMERIC(14,2) | NOT NULL               |

## 10.4 Delivery & Goods Receipt

### ตาราง `procurement.supplier_deliveries`

| Column               | Data Type    | Constraint |
| -------------------- | ------------ | ---------- |
| `delivery_id`        | BIGINT       | PK         |
| `purchase_order_id`  | BIGINT       | FK         |
| `delivery_reference` | VARCHAR(100) | NULL       |
| `delivered_at`       | TIMESTAMPTZ  | NULL       |
| `status`             | VARCHAR(30)  | NOT NULL   |

### ตาราง `procurement.goods_receipts`

| Column             | Data Type   | Constraint               |
| ------------------ | ----------- | ------------------------ |
| `goods_receipt_id` | BIGINT      | PK                       |
| `receipt_number`   | VARCHAR(30) | UNIQUE                   |
| `delivery_id`      | BIGINT      | FK                       |
| `warehouse_id`     | BIGINT      | FK → pharmacy.warehouses |
| `received_at`      | TIMESTAMPTZ | NOT NULL                 |
| `received_by`      | BIGINT      | FK → hr.employees        |
| `status`           | VARCHAR(30) | NOT NULL                 |

### ตาราง `procurement.goods_receipt_items`

| Column                   | Data Type     | Constraint         |
| ------------------------ | ------------- | ------------------ |
| `goods_receipt_item_id`  | BIGINT        | PK                 |
| `goods_receipt_id`       | BIGINT        | FK                 |
| `purchase_order_item_id` | BIGINT        | FK                 |
| `product_id`             | BIGINT        | FK                 |
| `received_quantity`      | NUMERIC(14,4) | NOT NULL           |
| `rejected_quantity`      | NUMERIC(14,4) | NOT NULL DEFAULT 0 |
| `lot_number`             | VARCHAR(100)  | NULL               |
| `expiry_date`            | DATE          | NULL               |
| `unit_cost`              | NUMERIC(14,4) | NOT NULL           |

ข้อมูลการรับสินค้าในตารางนี้เป็นหลักฐานการตรวจรับ ส่วนการสร้าง Lot และเพิ่ม Stock ต้องส่งธุรกรรมไปยัง Pharmacy

## 10.5 Supplier Invoice & Matching

### ตาราง `procurement.supplier_invoices`

| Column                    | Data Type     | Constraint |
| ------------------------- | ------------- | ---------- |
| `supplier_invoice_id`     | BIGINT        | PK         |
| `supplier_id`             | BIGINT        | FK         |
| `supplier_invoice_number` | VARCHAR(50)   | NOT NULL   |
| `invoice_date`            | DATE          | NOT NULL   |
| `due_date`                | DATE          | NULL       |
| `total_amount`            | NUMERIC(14,2) | NOT NULL   |
| `status`                  | VARCHAR(30)   | NOT NULL   |

Unique: `(supplier_id, supplier_invoice_number)`

### ตาราง `procurement.supplier_invoice_items`

| Column                     | Data Type     | Constraint |
| -------------------------- | ------------- | ---------- |
| `supplier_invoice_item_id` | BIGINT        | PK         |
| `supplier_invoice_id`      | BIGINT        | FK         |
| `product_id`               | BIGINT        | FK         |
| `quantity`                 | NUMERIC(14,4) | NOT NULL   |
| `unit_price`               | NUMERIC(14,4) | NOT NULL   |
| `line_total`               | NUMERIC(14,2) | NOT NULL   |

### ตาราง `procurement.purchase_document_matchings`

| Column                | Data Type     | Constraint         |
| --------------------- | ------------- | ------------------ |
| `matching_id`         | BIGINT        | PK                 |
| `purchase_order_id`   | BIGINT        | FK                 |
| `goods_receipt_id`    | BIGINT        | FK                 |
| `supplier_invoice_id` | BIGINT        | FK                 |
| `matching_status`     | VARCHAR(30)   | NOT NULL           |
| `matched_at`          | TIMESTAMPTZ   | NOT NULL           |
| `matched_by`          | BIGINT        | FK → hr.employees  |
| `variance_amount`     | NUMERIC(14,2) | NOT NULL DEFAULT 0 |

Index สำคัญ

- `suppliers(supplier_code)`
- `supplier_products(supplier_id, product_id)`
- `purchase_requisitions(status, requested_at)`
- `purchase_orders(supplier_id, ordered_at DESC)`
- `purchase_orders(status, expected_delivery_date)`
- `goods_receipts(warehouse_id, received_at DESC)`
- `supplier_invoices(supplier_id, invoice_date DESC)`

เอกสาร Domain 09 กำหนดให้ Procurement เป็นเจ้าของกระบวนการตั้งแต่ Requisition, Purchase Order, Delivery, Goods Receipt และ Supplier Invoice รวมถึงการจับคู่เอกสารสามฝ่าย&#x20;

09.Procurement_and_Supplier_Management.md

09.Procurement_and_Supplier_Management.md

# 11. Domain 10 — Human Resources & Workforce Management

เจ้าของข้อมูล: Domain 10

## 11.1 Organization & Employee

### ตาราง `hr.departments`

| Column                 | Data Type    | Constraint             |
| ---------------------- | ------------ | ---------------------- |
| `department_id`        | BIGINT       | PK                     |
| `department_code`      | VARCHAR(30)  | UNIQUE                 |
| `department_name`      | VARCHAR(150) | NOT NULL               |
| `parent_department_id` | BIGINT       | FK → departments, NULL |
| `status`               | VARCHAR(30)  | NOT NULL               |

### ตาราง `hr.positions`

| Column          | Data Type    | Constraint |
| --------------- | ------------ | ---------- |
| `position_id`   | BIGINT       | PK         |
| `department_id` | BIGINT       | FK         |
| `position_code` | VARCHAR(30)  | UNIQUE     |
| `position_name` | VARCHAR(150) | NOT NULL   |
| `position_type` | VARCHAR(50)  | NOT NULL   |
| `status`        | VARCHAR(30)  | NOT NULL   |

### ตาราง `hr.employees`

| Column              | Data Type    | Constraint |
| ------------------- | ------------ | ---------- |
| `employee_id`       | BIGINT       | PK         |
| `employee_code`     | VARCHAR(30)  | UNIQUE     |
| `first_name`        | VARCHAR(150) | NOT NULL   |
| `last_name`         | VARCHAR(150) | NOT NULL   |
| `date_of_birth`     | DATE         | NULL       |
| `phone`             | VARCHAR(30)  | NULL       |
| `email`             | VARCHAR(255) | NULL       |
| `hire_date`         | DATE         | NOT NULL   |
| `employment_status` | VARCHAR(30)  | NOT NULL   |
| `created_at`        | TIMESTAMPTZ  | NOT NULL   |

ข้อมูลส่วนบุคคลที่มีความอ่อนไหวควรแยกตารางหรือควบคุมสิทธิ์เพิ่มเติมตามนโยบายของคลินิก

### ตาราง `hr.employments`

| Column            | Data Type     | Constraint |
| ----------------- | ------------- | ---------- |
| `employment_id`   | BIGINT        | PK         |
| `employee_id`     | BIGINT        | FK         |
| `position_id`     | BIGINT        | FK         |
| `branch_id`       | BIGINT        | FK         |
| `start_date`      | DATE          | NOT NULL   |
| `end_date`        | DATE          | NULL       |
| `base_salary`     | NUMERIC(14,2) | NULL       |
| `employment_type` | VARCHAR(30)   | NOT NULL   |
| `status`          | VARCHAR(30)   | NOT NULL   |

ตารางนี้เก็บประวัติการทำงานและการเปลี่ยนตำแหน่ง ไม่ควรเขียนทับตำแหน่งเดิม

## 11.2 Qualifications & Licenses

### ตาราง `hr.employee_qualifications`

| Column               | Data Type    | Constraint |
| -------------------- | ------------ | ---------- |
| `qualification_id`   | BIGINT       | PK         |
| `employee_id`        | BIGINT       | FK         |
| `qualification_name` | VARCHAR(200) | NOT NULL   |
| `institution`        | VARCHAR(200) | NULL       |
| `issued_date`        | DATE         | NULL       |
| `document_reference` | TEXT         | NULL       |

### ตาราง `hr.employee_licenses`

| Column           | Data Type    | Constraint |
| ---------------- | ------------ | ---------- |
| `license_id`     | BIGINT       | PK         |
| `employee_id`    | BIGINT       | FK         |
| `license_number` | VARCHAR(100) | NOT NULL   |
| `license_type`   | VARCHAR(100) | NOT NULL   |
| `issued_date`    | DATE         | NULL       |
| `expiry_date`    | DATE         | NULL       |
| `status`         | VARCHAR(30)  | NOT NULL   |

Unique: `(license_type, license_number)`

### ตาราง `hr.employee_skills`

| Column              | Data Type    | Constraint              |
| ------------------- | ------------ | ----------------------- |
| `employee_skill_id` | BIGINT       | PK                      |
| `employee_id`       | BIGINT       | FK                      |
| `skill_name`        | VARCHAR(150) | NOT NULL                |
| `skill_level`       | VARCHAR(30)  | NULL                    |
| `verified_by`       | BIGINT       | FK → hr.employees, NULL |
| `verified_at`       | TIMESTAMPTZ  | NULL                    |

## 11.3 Shift & Attendance

### ตาราง `hr.shifts`

| Column          | Data Type    | Constraint         |
| --------------- | ------------ | ------------------ |
| `shift_id`      | BIGINT       | PK                 |
| `shift_code`    | VARCHAR(30)  | UNIQUE             |
| `shift_name`    | VARCHAR(100) | NOT NULL           |
| `start_time`    | TIME         | NOT NULL           |
| `end_time`      | TIME         | NOT NULL           |
| `break_minutes` | INTEGER      | NOT NULL DEFAULT 0 |
| `status`        | VARCHAR(30)  | NOT NULL           |

### ตาราง `hr.employee_shifts`

| Column              | Data Type   | Constraint |
| ------------------- | ----------- | ---------- |
| `employee_shift_id` | BIGINT      | PK         |
| `employee_id`       | BIGINT      | FK         |
| `shift_id`          | BIGINT      | FK         |
| `branch_id`         | BIGINT      | FK         |
| `work_date`         | DATE        | NOT NULL   |
| `scheduled_start`   | TIMESTAMPTZ | NOT NULL   |
| `scheduled_end`     | TIMESTAMPTZ | NOT NULL   |
| `status`            | VARCHAR(30) | NOT NULL   |

### ตาราง `hr.attendance_records`

| Column              | Data Type   | Constraint              |
| ------------------- | ----------- | ----------------------- |
| `attendance_id`     | BIGINT      | PK                      |
| `employee_shift_id` | BIGINT      | FK                      |
| `check_in`          | TIMESTAMPTZ | NULL                    |
| `check_out`         | TIMESTAMPTZ | NULL                    |
| `attendance_status` | VARCHAR(30) | NOT NULL                |
| `recorded_by`       | BIGINT      | FK → hr.employees, NULL |

## 11.4 Leave & Overtime

### ตาราง `hr.leave_requests`

| Column             | Data Type   | Constraint              |
| ------------------ | ----------- | ----------------------- |
| `leave_request_id` | BIGINT      | PK                      |
| `employee_id`      | BIGINT      | FK                      |
| `leave_type`       | VARCHAR(30) | NOT NULL                |
| `start_date`       | DATE        | NOT NULL                |
| `end_date`         | DATE        | NOT NULL                |
| `reason`           | TEXT        | NULL                    |
| `approved_by`      | BIGINT      | FK → hr.employees, NULL |
| `status`           | VARCHAR(30) | NOT NULL                |

### ตาราง `hr.overtime_requests`

| Column                | Data Type    | Constraint              |
| --------------------- | ------------ | ----------------------- |
| `overtime_request_id` | BIGINT       | PK                      |
| `employee_id`         | BIGINT       | FK                      |
| `start_at`            | TIMESTAMPTZ  | NOT NULL                |
| `end_at`              | TIMESTAMPTZ  | NOT NULL                |
| `hours`               | NUMERIC(8,2) | NOT NULL                |
| `reason`              | TEXT         | NULL                    |
| `approved_by`         | BIGINT       | FK → hr.employees, NULL |
| `status`              | VARCHAR(30)  | NOT NULL                |

## 11.5 Payroll

### ตาราง `hr.payroll_runs`

| Column           | Data Type   | Constraint              |
| ---------------- | ----------- | ----------------------- |
| `payroll_run_id` | BIGINT      | PK                      |
| `period_start`   | DATE        | NOT NULL                |
| `period_end`     | DATE        | NOT NULL                |
| `processed_at`   | TIMESTAMPTZ | NULL                    |
| `processed_by`   | BIGINT      | FK → hr.employees, NULL |
| `status`         | VARCHAR(30) | NOT NULL                |

### ตาราง `hr.payroll_items`

| Column            | Data Type     | Constraint         |
| ----------------- | ------------- | ------------------ |
| `payroll_item_id` | BIGINT        | PK                 |
| `payroll_run_id`  | BIGINT        | FK                 |
| `employee_id`     | BIGINT        | FK                 |
| `base_salary`     | NUMERIC(14,2) | NOT NULL           |
| `overtime_amount` | NUMERIC(14,2) | NOT NULL DEFAULT 0 |
| `allowances`      | NUMERIC(14,2) | NOT NULL DEFAULT 0 |
| `deductions`      | NUMERIC(14,2) | NOT NULL DEFAULT 0 |
| `net_amount`      | NUMERIC(14,2) | NOT NULL           |

Unique: `(payroll_run_id, employee_id)`

Index สำคัญ

- `employees(employee_code)`
- `employments(employee_id, start_date DESC)`
- `employee_licenses(employee_id, expiry_date)`
- `employee_shifts(branch_id, work_date)`
- `attendance_records(employee_shift_id)`
- `leave_requests(employee_id, start_date, end_date)`
- `payroll_items(payroll_run_id, employee_id)`

# 12. Shared Database — ตารางกลางที่ใช้ร่วมกัน

ตารางส่วนนี้ไม่ใช่การสร้างข้อมูลซ้ำในแต่ละ Domain แต่เป็นข้อมูลอ้างอิงกลางที่หลาย Domain จำเป็นต้องใช้

ผมเสนอให้แยกไว้ใน Schema `core`

## 12.1 `core.branches`

| Column        | Data Type    | Constraint |
| ------------- | ------------ | ---------- |
| `branch_id`   | BIGINT       | PK         |
| `branch_code` | VARCHAR(30)  | UNIQUE     |
| `branch_name` | VARCHAR(150) | NOT NULL   |
| `phone`       | VARCHAR(30)  | NULL       |
| `address`     | TEXT         | NULL       |
| `timezone`    | VARCHAR(50)  | NOT NULL   |
| `status`      | VARCHAR(30)  | NOT NULL   |

## 12.2 `core.service_catalogs`

| Column               | Data Type    | Constraint |
| -------------------- | ------------ | ---------- |
| `service_catalog_id` | BIGINT       | PK         |
| `service_code`       | VARCHAR(50)  | UNIQUE     |
| `service_name`       | VARCHAR(200) | NOT NULL   |
| `service_category`   | VARCHAR(50)  | NOT NULL   |
| `description`        | TEXT         | NULL       |
| `status`             | VARCHAR(30)  | NOT NULL   |

## 12.3 `core.service_prices`

| Column               | Data Type     | Constraint |
| -------------------- | ------------- | ---------- |
| `service_price_id`   | BIGINT        | PK         |
| `service_catalog_id` | BIGINT        | FK         |
| `branch_id`          | BIGINT        | FK         |
| `price`              | NUMERIC(14,2) | NOT NULL   |
| `effective_from`     | TIMESTAMPTZ   | NOT NULL   |
| `effective_to`       | TIMESTAMPTZ   | NULL       |
| `status`             | VARCHAR(30)   | NOT NULL   |

ข้อกำหนดสำคัญคือช่วงเวลาราคาที่มีผลสำหรับบริการเดียวกันและสาขาเดียวกันไม่ควรซ้อนกัน หากมีการใช้ราคาแยกตามกลุ่มลูกค้าหรือเงื่อนไขอื่น ต้องเพิ่มมิติของราคาใน Unique และกฎตรวจสอบช่วงเวลา

## 12.4 `core.audit_logs`

| Column         | Data Type    | Constraint |
| -------------- | ------------ | ---------- |
| `audit_log_id` | BIGINT       | PK         |
| `schema_name`  | VARCHAR(100) | NOT NULL   |
| `table_name`   | VARCHAR(100) | NOT NULL   |
| `record_id`    | BIGINT       | NOT NULL   |
| `action_type`  | VARCHAR(30)  | NOT NULL   |
| `old_values`   | JSONB        | NULL       |
| `new_values`   | JSONB        | NULL       |
| `performed_by` | BIGINT       | NULL       |
| `performed_at` | TIMESTAMPTZ  | NOT NULL   |
| `ip_address`   | INET         | NULL       |
| `request_id`   | UUID         | NULL       |

ตาราง Audit ควรเป็นแบบ Append-only และจำกัดสิทธิ์ไม่ให้ผู้ใช้ทั่วไปแก้ไขหรือลบข้อมูลย้อนหลัง

# 13. Cross-Domain Foreign Key และ Data Ownership

ในกรณีที่ใช้ PostgreSQL Database เดียวกัน สามารถสร้าง Foreign Key ข้าม Schema ได้โดยตรง

ตัวอย่าง:

```
ALTER TABLE clinical.clinical_encounters
ADD CONSTRAINT fk_encounters_pet
FOREIGN KEY (pet_id)
REFERENCES customer.pets(pet_id)
ON DELETE RESTRICT;

ALTER TABLE pharmacy.dispensings
ADD CONSTRAINT fk_dispensings_prescription
FOREIGN KEY (prescription_id)
REFERENCES clinical.prescriptions(prescription_id)
ON DELETE RESTRICT;

ALTER TABLE billing.invoices
ADD CONSTRAINT fk_invoices_customer
FOREIGN KEY (customer_id)
REFERENCES customer.customers(customer_id)
ON DELETE RESTRICT;

ALTER TABLE procurement.goods_receipts
ADD CONSTRAINT fk_goods_receipts_warehouse
FOREIGN KEY (warehouse_id)
REFERENCES pharmacy.warehouses(warehouse_id)
ON DELETE RESTRICT;
```

อย่างไรก็ตาม การมี Foreign Key ไม่ได้หมายความว่า Domain ปลายทางสามารถแก้ไขข้อมูลของ Domain ต้นทางได้

ตัวอย่างการกำหนดสิทธิ์:

| Domain      | อ่านข้อมูล                                        | สร้างข้อมูล                        | แก้ไขข้อมูล         |
| ----------- | ------------------------------------------------- | ---------------------------------- | ------------------- |
| Appointment | Customer, Pet, HR                                 | Appointment, Queue                 | Appointment, Queue  |
| Clinical    | Customer, Pet, Appointment, HR                    | Encounter, Diagnosis, Prescription | Clinical Records    |
| Pharmacy    | Clinical Prescription, Customer, Pet              | Dispensing, Stock Movement         | Product, Inventory  |
| Laboratory  | Clinical Encounter, HR                            | Diagnostic Orders, Results         | Laboratory Records  |
| Surgery     | Clinical, HR, Pharmacy                            | Surgery Records                    | Surgery Records     |
| Billing     | Customer, Clinical, Pharmacy, Laboratory, Surgery | Invoice, Payment                   | Billing Records     |
| CRM         | Customer, Billing บางส่วน                         | Campaign, Promotion, Feedback      | CRM Records         |
| Procurement | Pharmacy, HR                                      | Purchase Order, Goods Receipt      | Procurement Records |
| HR          | ข้อมูลบุคลากร                                     | Employee, Shift, Payroll           | HR Records          |

# 14. Constraints ที่ต้องมีในระบบจริง

นอกจาก Primary Key และ Foreign Key แล้ว ผมแนะนำให้กำหนดข้อบังคับดังต่อไปนี้

| Domain      | Constraint                    | วัตถุประสงค์                                         |
| ----------- | ----------------------------- | ---------------------------------------------------- |
| Customer    | Unique Customer Code          | ป้องกันลูกค้าซ้ำ                                     |
| Customer    | Unique Pet Code               | ป้องกันสัตว์ซ้ำ                                      |
| Customer    | Ownership Date Validation     | ตรวจสอบช่วงเวลาเจ้าของ                               |
| Appointment | End Time > Start Time         | ป้องกันเวลานัดผิด                                    |
| Appointment | Queue Number Unique           | ป้องกันหมายเลขคิวซ้ำ                                 |
| Clinical    | Encounter Closure Validation  | ป้องกันการปิดรายการไม่ถูกต้อง                        |
| Clinical    | Signed Record Protection      | ป้องกันแก้ไขเวชระเบียนที่รับรองแล้วโดยไม่มีประวัติ   |
| Pharmacy    | Quantity > 0                  | ป้องกันจำนวนสินค้าไม่ถูกต้อง                         |
| Pharmacy    | No Negative Stock             | ป้องกันสต็อกติดลบ                                    |
| Pharmacy    | Lot Expiry Validation         | ป้องกันการจ่ายสินค้าหมดอายุ                          |
| Laboratory  | Result Version Unique         | ป้องกันผลตรวจเวอร์ชันซ้ำ                             |
| Surgery     | Consent Validation            | ตรวจสอบหลักฐานยินยอมก่อนดำเนินการตามนโยบาย           |
| Billing     | Invoice Number Unique         | ป้องกันใบแจ้งหนี้ซ้ำ                                 |
| Billing     | Payment Allocation Validation | ป้องกันการจัดสรรเงินเกินยอดชำระ                      |
| CRM         | Consent Validation            | ป้องกันส่งการตลาดโดยไม่มีความยินยอม                  |
| Procurement | PO Quantity Validation        | ป้องกันรับสินค้าเกินจำนวนที่อนุมัติโดยไม่มีการจัดการ |
| HR          | Employment Date Validation    | ป้องกันช่วงเวลาการทำงานผิดพลาด                       |

ข้อกำหนดบางอย่าง เช่น การป้องกันสต็อกติดลบ การจ่ายยาเกินจำนวนที่สั่ง และการจัดสรรเงิน ต้องตรวจสอบภายใน Transaction ด้วย ไม่ควรพึ่งพา Check Constraint เพียงอย่างเดียว

# 15. แนวทางการสร้าง Index และประสิทธิภาพ

ผมแนะนำให้ใช้ Index ตามรูปแบบการค้นหาจริง ไม่ใช่สร้าง Index ให้ทุกคอลัมน์ เพราะจะเพิ่มภาระในการเขียนข้อมูลและใช้พื้นที่มากขึ้น

### 15.1 Composite Index

ตัวอย่าง:

```
CREATE INDEX idx_appointments_branch_start
ON appointment.appointments(branch_id, scheduled_start);

CREATE INDEX idx_encounters_pet_started
ON clinical.clinical_encounters(pet_id, started_at DESC);

CREATE INDEX idx_stock_movements_product_date
ON pharmacy.stock_movements(product_id, movement_at DESC);

CREATE INDEX idx_invoices_customer_date
ON billing.invoices(customer_id, invoice_date DESC);

CREATE INDEX idx_employee_shifts_branch_date
ON hr.employee_shifts(branch_id, work_date);
```

### 15.2 Partial Index

เหมาะสำหรับตารางที่มีสถานะจำนวนมาก แต่ระบบค้นหาสถานะที่ยังทำงานอยู่เป็นหลัก

```
CREATE INDEX idx_appointments_active
ON appointment.appointments(branch_id, scheduled_start)
WHERE status IN ('BOOKED', 'CONFIRMED');
```

```
CREATE INDEX idx_inventory_lots_active_expiry
ON pharmacy.inventory_lots(product_id, expiry_date)
WHERE status = 'ACTIVE';
```

### 15.3 Index สำหรับ Full-Text Search

หากต้องค้นหาชื่อสัตว์เลี้ยง ชื่อลูกค้า หรือชื่อสินค้า สามารถพิจารณาใช้ PostgreSQL Full-Text Search หรือ Trigram Index ตามลักษณะการค้นหา โดยเฉพาะการค้นหาภาษาไทยควรทดสอบการตัดคำและรูปแบบข้อความก่อนเลือกวิธีใช้งานจริง

# 16. ข้อเสนอด้าน Transaction และ Concurrency Control

ระบบคลินิกสัตวแพทย์มีธุรกรรมที่ต้องป้องกันการทำงานพร้อมกันแล้วเกิดข้อมูลผิดพลาด เช่น การจ่ายยาจากล็อตเดียวกัน หรือการรับชำระเงินใบแจ้งหนี้เดียวกัน

ตัวอย่างการจ่ายยา:

1. ตรวจสอบคำสั่งยา
2. ตรวจสอบสถานะคำสั่ง
3. ตรวจสอบจำนวนที่สั่งและจำนวนที่จ่ายไปแล้ว
4. ตรวจสอบยอดคงเหลือของล็อต
5. ล็อกแถวสต็อกด้วย `SELECT ... FOR UPDATE`
6. สร้าง `dispensings`
7. สร้าง `dispensing_items`
8. บันทึก `stock_movements`
9. ปรับปรุง `stock_balances`
10. ยืนยัน Transaction

ตัวอย่าง SQL:

```
BEGIN;

SELECT *
FROM pharmacy.stock_balances
WHERE product_id = 1001
  AND warehouse_id = 1
  AND lot_id = 5001
FOR UPDATE;

-- ตรวจสอบยอดคงเหลือและสิทธิ์การจ่าย
-- สร้างรายการจ่ายยา
-- สร้างรายการเคลื่อนไหวสต็อก
-- ปรับปรุงยอดคงเหลือ

COMMIT;
```

สำหรับธุรกรรมการเงินและการเรียกเก็บเงิน ควรใช้หลักการเดียวกัน โดยเฉพาะการป้องกันการส่งรายการจาก Domain ต้นทางเข้ามาซ้ำ

# 17. สรุปจำนวนกลุ่มตารางตาม Domain

ตารางด้านล่างเป็นขอบเขตชุดตารางที่ออกแบบในคำตอบนี้ โดยนับตารางหลักที่ระบุไว้ ไม่รวมตารางระบบเพิ่มเติมที่อาจต้องสร้างภายหลัง เช่น ตาราง Approval, Status History และ Workflow Configuration

| Domain                    | กลุ่มข้อมูลหลัก                                                                | จำนวนตารางที่ระบุ |
| ------------------------- | ------------------------------------------------------------------------------ | ----------------- |
| 01 Customer & Pet         | ลูกค้า สัตว์เลี้ยง เจ้าของร่วม ช่องทางติดต่อ และประวัติ                        | 14                |
| 02 Appointment & Queue    | นัดหมาย ตารางทรัพยากร ลงทะเบียน คิว และ Triage                                 | 15                |
| 03 Clinical & Medical     | Encounter, Medical Record, Diagnosis, Treatment, Prescription และประวัติสุขภาพ | 14                |
| 04 Pharmacy & Inventory   | สินค้า หน่วยนับ คลัง ล็อต สต็อก จ่ายยา และตรวจนับ                              | 11                |
| 05 Laboratory & Imaging   | รายการตรวจ ตัวอย่าง งานตรวจ ผลตรวจ ภาพ และควบคุมคุณภาพ                         | 11                |
| 06 Surgery & Treatment    | คำขอ ประเมิน ผ่าตัด ระงับความรู้สึก และติดตามหลังผ่าตัด                        | 11                |
| 07 Billing & Payment      | ใบแจ้งหนี้ รายการเรียกเก็บ การรับชำระ คืนเงิน และเงินมัดจำ                     | 9                 |
| 08 Marketing & CRM        | Lead, Campaign, Promotion, Loyalty และ Customer Relationship                   | 12                |
| 09 Procurement & Supplier | Supplier, Requisition, PO, Goods Receipt และ Matching                          | 12                |
| 10 HR & Workforce         | Employee, Organization, License, Shift, Attendance และ Payroll                 | 13                |
| Core                      | Branch, Service Catalog, Service Price และ Audit                               | 4                 |
| รวม                       |                                                                                | 126               |

จำนวนนี้เป็นการนับจากตารางที่แจกแจงในแบบออกแบบฉบับนี้ โดยอาจปรับเพิ่มหรือลดได้เมื่อออกแบบรายละเอียด Workflow และ Approval ของแต่ละ Domain

# 18. ข้อเสนอแนะก่อนเริ่มพัฒนาฐานข้อมูลจริง

ผมมองว่ามี 5 เรื่องที่ควรตัดสินใจให้ชัดเจนก่อนเริ่มเขียน Migration หรือสร้าง Database จริง

1. Database Deployment Model: ใช้ PostgreSQL Database เดียวและแยก Schema ตาม Domain หรือแยก Database ต่อ Domain
2. Multi-Branch: ทุกธุรกรรมที่เกิดในสาขาต้องมี `branch_id` และมีกฎควบคุมการเข้าถึงตามสาขา
3. Data Audit: กำหนดว่าข้อมูลประเภทใดแก้ไขได้ ข้อมูลประเภทใดต้องสร้าง Amendment หรือ Reversal แทนการแก้ไขทับ
4. Domain Integration: กำหนด API หรือ Event สำหรับการส่งข้อมูลข้าม Domain โดยเฉพาะ Pharmacy → Billing, Laboratory → Clinical และ Procurement → Pharmacy
5. Security: กำหนดสิทธิ์ระดับตารางและระดับแถว โดยเฉพาะข้อมูลเวชระเบียน ประวัติการรักษา ข้อมูลส่วนบุคคล และข้อมูลเงินเดือน

ข้อสรุปของผม: แบบนี้เป็น Physical Database Design ระดับเริ่มต้นสำหรับการพัฒนาระบบจริง โดยครอบคลุม 10 Domains และกำหนดเจ้าของข้อมูลให้ชัดเจนแล้ว แต่ยังควรผ่านการตรวจสอบรายละเอียดของ Business Rules, Workflow, Approval, Data Retention และ Security ก่อนนำไปใช้เป็น Production Schema

ขั้นตอนถัดไปที่เหมาะสมที่สุดคือการสร้าง PostgreSQL DDL Migration ฉบับสมบูรณ์ จากแบบนี้ โดยจัดลำดับการสร้าง Schema, Tables, Foreign Keys, Indexes, Constraints, Triggers และ Seed Data ให้ถูกต้องตาม Dependency ของแต่ละ Domain ครับ
