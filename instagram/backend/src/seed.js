// ─────────────────────────────────────────────────────────────
// seed.js — Migrate db/db.json data into MongoDB
//
// Usage:   node src/seed.js
// or:      npm run seed
//
// This script:
//   1. Connects to MongoDB using the existing .env config
//   2. Reads the existing db/db.json file
//   3. Clears existing collections (safe re-run / duplicate protection)
//   4. Inserts all users, posts, notifications, messages, stories
//   5. Maps old json-server IDs → new MongoDB IDs across all references
//   6. Prints a summary and exits
// ─────────────────────────────────────────────────────────────

const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Post = require('./models/Post');
const Notification = require('./models/Notification');
const Message = require('./models/Message');
const Story = require('./models/Story');

async function seed() {
  // ── 1. Connect to MongoDB ──
  await connectDB();
  console.log('\n========== SEED SCRIPT STARTED ==========\n');

  // ── 2. Read db.json ──
  const dbPath = path.join(__dirname, '..', '..', 'db', 'db.json');
  console.log(`Reading: ${dbPath}`);

  if (!fs.existsSync(dbPath)) {
    console.error('ERROR: db/db.json not found!');
    process.exit(1);
  }

  const raw = fs.readFileSync(dbPath, 'utf-8');
  const data = JSON.parse(raw);

  console.log(`\nFound in db.json:`);
  console.log(`  Users:         ${data.users?.length || 0}`);
  console.log(`  Posts:          ${data.posts?.length || 0}`);
  console.log(`  Notifications:  ${data.notifications?.length || 0}`);
  console.log(`  Messages:       ${data.messages?.length || 0}`);
  console.log(`  Stories:        ${data.stories?.length || 0}`);

  // ── 3. Clear existing data (duplicate protection) ──
  console.log('\nClearing existing collections...');
  await User.deleteMany({});
  await Post.deleteMany({});
  await Notification.deleteMany({});
  await Message.deleteMany({});
  await Story.deleteMany({});
  console.log('  Done — all collections cleared.');

  // ── 4. Seed Users ──
  //    Insert users and build a map:  oldId → newMongoId (as string)
  console.log('\nSeeding users...');
  const userIdMap = {};   // e.g. { "1": "6ab...", "2": "6ab..." }

  for (const u of data.users || []) {
    const created = await User.create({
      email:          u.email,
      fullName:       u.fullName,
      username:       u.username,
      password:       u.password,          // kept as-is (plaintext, matching current login)
      profilePicture: u.profilePicture || '',
      bio:            u.bio || ''
    });
    userIdMap[u.id] = created._id.toString();
    console.log(`  User "${u.username}" : ${u.id} → ${created._id}`);
  }

  // ── 5. Seed Posts (including reels) ──
  console.log('\nSeeding posts...');
  const postIdMap = {};   // e.g. { "1": "6ab...", "OBY9Nbc84o0": "6ab..." }

  for (const p of data.posts || []) {
    const postData = {
      user: {
        id:          userIdMap[p.user.id] || p.user.id,
        username:    p.user.username,
        profile_pic: p.user.profile_pic || ''
      },
      image:     p.image || undefined,
      caption:   p.caption || '',
      likes:     p.likes || 0,
      likedBy:   (p.likedBy || []).map((uid) => userIdMap[uid] || uid),
      comments:  (p.comments || []).map((c) => ({
        id:       c.id,                                     // keep original comment id
        userId:   userIdMap[c.userId] || c.userId,
        username: c.username,
        text:     c.text
      })),
      timestamp: p.timestamp || new Date().toISOString(),
      savedBy:   (p.savedBy || []).map((uid) => userIdMap[uid] || uid),
      type:      p.type || 'post',
      videoUrl:  p.videoUrl || undefined
    };

    const created = await Post.create(postData);
    postIdMap[p.id] = created._id.toString();
    const label = p.type === 'reel' ? 'Reel' : 'Post';
    console.log(`  ${label} "${p.caption?.slice(0, 25)}..." : ${p.id} → ${created._id}`);
  }

  // ── 6. Seed Notifications ──
  console.log('\nSeeding notifications...');

  for (const n of data.notifications || []) {
    await Notification.create({
      type:         n.type,
      fromUserId:   userIdMap[n.fromUserId] || n.fromUserId,
      fromUsername:  n.fromUsername,
      toUserId:     userIdMap[n.toUserId] || n.toUserId,
      postId:       postIdMap[n.postId] || n.postId,
      message:      n.message,
      timestamp:    n.timestamp,
      read:         n.read || false
    });
  }
  console.log(`  ${data.notifications?.length || 0} notifications inserted.`);

  // ── 7. Seed Messages ──
  console.log('\nSeeding messages...');

  for (const m of data.messages || []) {
    await Message.create({
      type:       m.type || 'chat',
      senderId:   userIdMap[m.senderId] || m.senderId,
      receiverId: userIdMap[m.receiverId] || m.receiverId,
      text:       m.text,
      timestamp:  m.timestamp
    });
  }
  console.log(`  ${data.messages?.length || 0} messages inserted.`);

  // ── 8. Seed Stories ──
  console.log('\nSeeding stories...');

  for (const s of data.stories || []) {
    await Story.create({
      username:   s.username,
      userImage:  s.userImage,
      storyImage: s.storyImage,
      timestamp:  s.timestamp
    });
  }
  console.log(`  ${data.stories?.length || 0} stories inserted.`);

  // ── 9. Final verification ──
  console.log('\n========== VERIFICATION ==========\n');
  const counts = {
    Users:         await User.countDocuments(),
    Posts:          await Post.countDocuments(),
    Notifications: await Notification.countDocuments(),
    Messages:      await Message.countDocuments(),
    Stories:       await Story.countDocuments()
  };

  for (const [name, count] of Object.entries(counts)) {
    const expected = data[name.toLowerCase()]?.length || 0;
    const status = count === expected ? '✓' : '✗ MISMATCH';
    console.log(`  ${name}: ${count} (expected ${expected}) ${status}`);
  }

  // ── 10. Print ID mapping for reference ──
  console.log('\n========== ID MAPPING ==========\n');
  console.log('User IDs (old → new):');
  for (const [old, newId] of Object.entries(userIdMap)) {
    console.log(`  "${old}" → "${newId}"`);
  }
  console.log('\nPost IDs (old → new):');
  for (const [old, newId] of Object.entries(postIdMap)) {
    console.log(`  "${old}" → "${newId}"`);
  }

  console.log('\n========== SEED COMPLETE ==========\n');

  // ── 11. Disconnect and exit ──
  const mongoose = require('mongoose');
  await mongoose.disconnect();
  console.log('MongoDB disconnected. Exiting.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
