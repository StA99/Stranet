// scripts/seed.js
// Run with: node scripts/seed.js
// Requires: npm install firebase-admin

const admin = require('firebase-admin')

// Initialize with your service account key
// Download from Firebase Console > Project Settings > Service Accounts
const serviceAccount = require('./serviceAccountKey.json') // place your key here

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

const demoUsers = [
  {
    id: 'demo_user_1',
    displayName: 'Marco Bianchi',
    age: 29,
    bio: 'Morning trail runner 🌄 Half marathon enthusiast. Sub-2h is the goal!',
    photo: 'https://i.pravatar.cc/150?img=11',
    lastActivity: 'https://i.pravatar.cc/600?img=11',
    stravaUrl: 'https://www.strava.com/athletes/demo1',
  },
  {
    id: 'demo_user_2',
    displayName: 'Giulia Ferrari',
    age: 26,
    bio: 'Ultra runner by heart, coffee lover by choice ☕ 50K and beyond.',
    photo: 'https://i.pravatar.cc/150?img=47',
    lastActivity: 'https://i.pravatar.cc/600?img=47',
    stravaUrl: 'https://www.strava.com/athletes/demo2',
  },
  {
    id: 'demo_user_3',
    displayName: 'Luca Romano',
    age: 33,
    bio: 'City runner. 5AM club member. Looking for a training partner for Rome Marathon!',
    photo: 'https://i.pravatar.cc/150?img=52',
    lastActivity: 'https://i.pravatar.cc/600?img=52',
    stravaUrl: 'https://www.strava.com/athletes/demo3',
  },
  {
    id: 'demo_user_4',
    displayName: 'Sofia Esposito',
    age: 31,
    bio: 'Running coach & 10K specialist. Let\'s push each other to be faster! 🏃‍♀️',
    photo: 'https://i.pravatar.cc/150?img=44',
    lastActivity: 'https://i.pravatar.cc/600?img=44',
    stravaUrl: 'https://www.strava.com/athletes/demo4',
  },
  {
    id: 'demo_user_5',
    displayName: 'Alessandro Ricci',
    age: 27,
    bio: 'Road to first marathon. Slow but consistent. Need someone to keep me motivated!',
    photo: 'https://i.pravatar.cc/150?img=57',
    lastActivity: 'https://i.pravatar.cc/600?img=57',
    stravaUrl: '',
  },
  {
    id: 'demo_user_6',
    displayName: 'Chiara Lombardi',
    age: 24,
    bio: 'Track sprinter turned road runner. Lover of tempo runs and interval training. 💨',
    photo: 'https://i.pravatar.cc/150?img=36',
    lastActivity: 'https://i.pravatar.cc/600?img=36',
    stravaUrl: 'https://www.strava.com/athletes/demo6',
  },
]

async function seed() {
  console.log('🌱 Seeding Firestore with demo users...')
  const batch = db.batch()

  for (const user of demoUsers) {
    const { id, ...data } = user
    const ref = db.collection('users').doc(id)
    batch.set(ref, {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    })
  }

  await batch.commit()
  console.log(`✅ Seeded ${demoUsers.length} demo users successfully!`)
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
