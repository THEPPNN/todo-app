# Todos App
  เว็บแอพพลิเคชั่นสำหรับจัดการงานที่ต้องทำ ประกอบไปด้วย รายการงาน ปฎิทินที่แสดงให้เห็นภาพรวมของงาน

## ✨ Features
- **Todo Table** — ตารางแสดงข้อมูล แบบแบ่งหน้าและค้นหา เปลี่ยนสถานะได้ในตัว
- **Weekly Calendar** — ดูรายการงานที่ต้องส่งภายใน 7 วันข้างหน้า
- **Monthly Calendar** — ปฏิทินรายเดือน แสดงจำนวนงานที่ถูกกำหนดไว้ในแต่ละวัน และเพิ่มงานได้จากการกดที่วันที่ที่ต้องการ
- **Toast Notifications** — แจ้งเตือนทุกครั้งที่ เพิ่ม/แก้/ลบ

## 🛠️ Tech Stack
- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 3
- TanStack Query 5
- TanStack Table 8

## 🚀 Getting Started (how to run)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Why Vite?
  เป็นเครื่องมือที่ช่วยในการพัฒนาเว็บแอพที่เร็วและช่วยในการทำงานดี เวลาแก้โค้ดมันจะเปลี่ยนแค่ตัวที่เราแก้ ตัวอื่นจะยังเหมือนเดิมหากมีการกรอกข้อมูลทิ้งไว้ข้อมูลจะไม่หาย ถ้าเราbuild viteจะช่วยเอาโค้ดส่วนที่ไม่ได้ใช้ออก และช่วยจัดการไฟล์ให้มีขนาดเล็ก

### Why Context API?
  ป้องกัน props drilling ทำให้บำรุงรักษาโค้ดยาก

  **ในโปรเจกต์นี้** `TodoProvider` ครอบ component ทั้งหมดไว้ใน `App.tsx` ทำให้ทุก component สามารถเข้าถึง state กลางได้ผ่าน `useTodo()` โดยไม่ต้องส่ง props ลงมาทีละชั้น

  State ที่แชร์ผ่าน Context คือ:
  - `todos` / `upcomingTodos` — ข้อมูล todo สำหรับ Table และ Calendar
  - `loading`, `page`, `search` — สถานะการโหลดและ pagination ของ Table
  - `updatingTodo` — todo ที่กำลังแก้ไข ใช้ร่วมกันระหว่าง Table และ Form
  - `addTodo`, `updateTodo`, `deleteTodo`, `toggleTodoStatus` — CRUD operations

  ตัวอย่างที่เห็นได้ชัดคือ เมื่อกด **delete** ใน `TodoTable` → `deleteTodo` ใน Context อัปเดต `todos` → `TodoCalendar` ที่อ่าน `todos` เดียวกันก็แสดงผลใหม่ทันที โดยไม่ต้องส่ง event หรือ callback ข้าม component

### Why TypeScript?
  เนื่องจากเราต้องนิยามตัวแปรไว้ตั้งแต่แรก ทำให้พอเราดึงไปใช้งานหลายๆที่แล้วเกิดมีการแก้ไข เราสามารถแก้ที่ไฟล์ type ไฟล์เดียวได้เลย และยังช่วยตรวจสอบโครงสร้างที่ไม่ถูกต้องได้เลยทันที

  **ในโปรเจกต์นี้** TypeScript ถูกใช้ใน 3 ที่:

  **1. `Todo` interface**
  นิยามโครงสร้างของ todo ไว้ที่ `src/types/todo.tsx` ไฟล์เดียว ทุก component ที่ใช้ข้อมูล todo ไม่ว่าจะเป็น `TodoTable`, `TodoCalendar`, `TodoMonthly` หรือ `TodoForm` ใช้ type เดียวกัน หากแก้ไข interface เช่น เพิ่ม field ใหม่ TypeScript จะเห็นได้เลยทันทีว่าต้องแก้จุดไหนบ้าง

  **2. Union Type บน `status` — ป้องกัน bug จาก string ผิดพลาด**
  `status` ถูกจำกัดให้รับได้แค่ 3 ค่า หากพิมพ์ผิดหรือส่งค่าที่ไม่ถูกต้อง compiler จะ error ทันทีก่อน build ในขณะที่ `TodoTable` ใช้ค่านี้ทำ style mapping และ `TodoMonthly` ใช้กรองสี badge ก็มั่นใจได้ว่าค่าที่ได้รับจะตรงกับที่คาดไว้เสมอ

  **3. `TodoContextType` interface — กำหนด contract ของ Context**
  Context มี interface ครอบทุกค่าและฟังก์ชันที่เปิดให้ใช้ หาก component พยายาม destructure ค่าที่ไม่มีใน context หรือเรียกฟังก์ชันด้วย argument ผิด type TypeScript จะแจ้งทันที ไม่ต้อง debug ทีหลัง

## 📡 Data Source
Uses [DummyJSON API](https://dummyjson.com) 
