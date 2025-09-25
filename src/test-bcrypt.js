// Test bcrypt functionality
import bcrypt from 'bcryptjs';

async function testBcrypt() {
  console.log('🔍 Testing bcrypt functionality...');

  const testPassword = 'test123';
  const testHash = '$2b$12$123456789012345678901234567890123456789012345678901234567';

  console.log('Testing password:', testPassword);
  console.log('Testing hash:', testHash);

  try {
    const isValid = await bcrypt.compare(testPassword, testHash);
    console.log('bcrypt.compare result:', isValid);

    if (isValid) {
      console.log('✅ bcrypt is working correctly!');
    } else {
      console.log('❌ bcrypt comparison failed');
    }
  } catch (error) {
    console.error('❌ bcrypt error:', error);
  }
}

testBcrypt();
