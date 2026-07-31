import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding ArogyaSetu database...')

  // ===== PHCs =====
  const phc1 = await prisma.pHC.upsert({
    where: { id: 'phc_001' },
    update: {},
    create: {
      id: 'phc_001',
      name: 'Devgadh Baria PHC',
      address: 'Devgadh Baria, Dahod District',
      district: 'Dahod',
      state: 'Gujarat',
      phone: '02673-234567',
      latitude: 22.6960,
      longitude: 74.0170,
      services: ['OPD', 'Emergency', 'Maternity', 'Lab', 'Vaccination'],
      timings: '8:00 AM - 5:00 PM',
      isActive: true,
    },
  })

  const phc2 = await prisma.pHC.upsert({
    where: { id: 'phc_002' },
    update: {},
    create: {
      id: 'phc_002',
      name: 'Kadana Community Health Centre',
      address: 'Kadana, Mahisagar District',
      district: 'Mahisagar',
      state: 'Gujarat',
      phone: '02676-245678',
      latitude: 23.2156,
      longitude: 73.8456,
      services: ['OPD', 'Emergency', 'Surgery', 'Maternity', 'Lab', 'Blood Bank'],
      timings: '24 Hours',
      isActive: true,
    },
  })

  // ===== VILLAGES =====
  const village1 = await prisma.village.upsert({
    where: { id: 'vil_001' },
    update: {},
    create: {
      id: 'vil_001',
      name: 'Hadgood',
      district: 'Dahod',
      state: 'Gujarat',
      population: 2450,
      latitude: 22.7100,
      longitude: 74.0300,
      phcId: phc1.id,
    },
  })

  const village2 = await prisma.village.upsert({
    where: { id: 'vil_002' },
    update: {},
    create: {
      id: 'vil_002',
      name: 'Kadana',
      district: 'Mahisagar',
      state: 'Gujarat',
      population: 1890,
      latitude: 23.2200,
      longitude: 73.8500,
      phcId: phc2.id,
    },
  })

  // ===== USERS =====
  const hashedPass = await bcrypt.hash('demo123', 12)

  // Patient
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@demo.com' },
    update: {},
    create: {
      id: 'usr_patient_001',
      name: 'Ramila Patel',
      email: 'patient@demo.com',
      phone: '+91 98765 43210',
      password: hashedPass,
      role: 'PATIENT',
      language: 'GU',
      isVerified: true,
      isActive: true,
    },
  })

  await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      age: 35,
      gender: 'female',
      bloodGroup: 'B+',
      weight: 57.0,
      height: 155.0,
      chronicConditions: ['Type 2 Diabetes', 'Mild Hypertension'],
      currentMedications: ['Metformin 500mg', 'Amlodipine 5mg'],
      allergies: ['Penicillin'],
      village: 'Hadgood',
      district: 'Dahod',
      state: 'Gujarat',
      healthScore: 74,
      emergencyName: 'Ramesh Patel',
      emergencyPhone: '+91 87654 32109',
      emergencyRelation: 'Husband',
    },
  })

  // Doctor
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@demo.com' },
    update: {},
    create: {
      id: 'usr_doctor_001',
      name: 'Dr. Priya Sharma',
      email: 'doctor@demo.com',
      phone: '+91 87654 32109',
      password: hashedPass,
      role: 'PHC_DOCTOR',
      language: 'HI',
      isVerified: true,
      isActive: true,
    },
  })

  await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      specialty: 'General Medicine',
      licenseNo: 'GUJ-2019-12345',
      phcId: phc1.id,
      experience: 5,
      languages: ['Gujarati', 'Hindi'],
      rating: 4.8,
      isAvailable: true,
    },
  })

  // ASHA Worker
  const ashaUser = await prisma.user.upsert({
    where: { email: 'asha@demo.com' },
    update: {},
    create: {
      id: 'usr_asha_001',
      name: 'Savita Bhen',
      email: 'asha@demo.com',
      phone: '+91 76543 21098',
      password: hashedPass,
      role: 'ASHA_WORKER',
      language: 'GU',
      isVerified: true,
      isActive: true,
    },
  })

  await prisma.ashaWorker.upsert({
    where: { userId: ashaUser.id },
    update: {},
    create: {
      userId: ashaUser.id,
      villageId: village2.id,
      district: 'Mahisagar',
      state: 'Gujarat',
      isActive: true,
    },
  })

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      id: 'usr_admin_001',
      name: 'District Health Officer',
      email: 'admin@demo.com',
      phone: '+91 65432 10987',
      password: hashedPass,
      role: 'ADMIN',
      language: 'EN',
      isVerified: true,
      isActive: true,
    },
  })

  // ===== MEDICINES =====
  const medicines = [
    { name: 'Paracetamol 500mg', nameGu: 'પેરાસિટામોલ', genericName: 'Paracetamol', category: 'Analgesic/Antipyretic', dosageForm: 'Tablet', strength: '500mg' },
    { name: 'ORS Powder', nameGu: 'ORS પાઉડર', genericName: 'Oral Rehydration Salts', category: 'Rehydration', dosageForm: 'Powder', strength: 'Standard' },
    { name: 'Iron Folic Acid', nameGu: 'આઇ.એફ.એ.', genericName: 'Ferrous Sulfate + Folic Acid', category: 'Nutritional', dosageForm: 'Tablet', strength: '200mg' },
    { name: 'Metformin 500mg', nameGu: 'મેટફૉર્મિન', genericName: 'Metformin HCl', category: 'Antidiabetic', dosageForm: 'Tablet', strength: '500mg' },
    { name: 'Amlodipine 5mg', nameGu: 'એમ્લૉડિપિન', genericName: 'Amlodipine Besylate', category: 'Antihypertensive', dosageForm: 'Tablet', strength: '5mg' },
    { name: 'Chloroquine 250mg', nameGu: 'ક્લૉરૉક્વિન', genericName: 'Chloroquine Phosphate', category: 'Antimalarial', dosageForm: 'Tablet', strength: '250mg' },
    { name: 'Vitamin A', nameGu: 'વિટામિન A', genericName: 'Retinol', category: 'Vitamin', dosageForm: 'Capsule', strength: '1,00,000 IU' },
    { name: 'Albendazole 400mg', nameGu: 'આલ્બેન્ડૅઝૉલ', genericName: 'Albendazole', category: 'Anthelmintic', dosageForm: 'Tablet', strength: '400mg' },
  ]

  for (const med of medicines) {
    await prisma.medicine.upsert({
      where: { barcode: `GJ-${med.name.replace(/\s+/g, '-').toUpperCase()}` },
      update: {},
      create: {
        ...med,
        nameHi: med.name,
        manufacturer: 'Generic',
        barcode: `GJ-${med.name.replace(/\s+/g, '-').toUpperCase()}`,
      },
    })
  }

  console.log('✅ Seeding completed successfully!')
  console.log('📧 Demo accounts:')
  console.log('   Patient: patient@demo.com / demo123')
  console.log('   Doctor:  doctor@demo.com / demo123')
  console.log('   ASHA:    asha@demo.com / demo123')
  console.log('   Admin:   admin@demo.com / demo123')
}

main()
  .catch((e) => { console.error('❌ Seeding failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
