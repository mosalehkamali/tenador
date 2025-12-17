// اسکریپت بررسی وضعیت MongoDB
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkMongoDB() {
  console.log('🔍 بررسی وضعیت MongoDB...\n');

  // بررسی 1: آیا MongoDB نصب است؟
  console.log('1️⃣  بررسی نصب MongoDB...');
  try {
    const { stdout } = await execAsync('mongod --version');
    console.log('✅ MongoDB نصب است:');
    console.log(stdout.split('\n').slice(0, 2).join('\n'));
  } catch (error) {
    console.log('❌ MongoDB نصب نیست یا در PATH نیست');
    console.log('   💡 لطفاً MongoDB را نصب کنید:');
    console.log('      Windows: https://www.mongodb.com/try/download/community');
    console.log('      macOS: brew install mongodb-community');
    console.log('      Linux: sudo apt-get install mongodb');
    return;
  }

  // بررسی 2: آیا MongoDB در حال اجرا است؟
  console.log('\n2️⃣  بررسی اجرای MongoDB...');
  try {
    const { stdout } = await execAsync('mongosh --eval "db.version()" --quiet');
    if (stdout.includes('MongoServerError') || stdout.includes('ECONNREFUSED')) {
      console.log('❌ MongoDB در حال اجرا نیست');
      console.log('   💡 برای اجرای MongoDB:');
      console.log('      Windows: MongoDB را از Services اجرا کنید');
      console.log('      یا: mongod --dbpath "C:\\data\\db"');
      console.log('      macOS: brew services start mongodb-community');
      console.log('      Linux: sudo systemctl start mongodb');
    } else {
      console.log('✅ MongoDB در حال اجرا است');
      console.log(`   Version: ${stdout.trim()}`);
    }
  } catch (error) {
    console.log('❌ نمی‌توان به MongoDB متصل شد');
    console.log('   💡 لطفاً MongoDB را اجرا کنید');
  }

  // بررسی 3: بررسی پورت
  console.log('\n3️⃣  بررسی پورت 27017...');
  try {
    const { stdout } = await execAsync('netstat -an | findstr :27017');
    if (stdout.includes('LISTENING') || stdout.includes('LISTEN')) {
      console.log('✅ پورت 27017 باز است');
    } else {
      console.log('⚠️  پورت 27017 در حال گوش دادن نیست');
    }
  } catch (error) {
    // در macOS/Linux از دستور دیگری استفاده می‌شود
    try {
      const { stdout } = await execAsync('lsof -i :27017');
      if (stdout) {
        console.log('✅ پورت 27017 باز است');
      }
    } catch (e) {
      console.log('⚠️  نتوانستیم وضعیت پورت را بررسی کنیم');
    }
  }

  console.log('\n📝 نکات:');
  console.log('   - اگر MongoDB نصب نیست، آن را نصب کنید');
  console.log('   - اگر نصب است اما اجرا نیست، آن را اجرا کنید');
  console.log('   - برای تست اتصال: npm run test:db');
}

checkMongoDB().catch(console.error);




