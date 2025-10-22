import connectDB from '@/lib/mongodb';
import User, { UserRole } from '@/models/User';

async function createAdminUser() {
  try {
    await connectDB();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@library.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@library.com',
      password: 'admin123', // This will be hashed by the pre-save middleware
      role: UserRole.ADMIN,
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@library.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Create a test student user as well
async function createStudentUser() {
  try {
    await connectDB();
    
    // Check if student user already exists
    const existingStudent = await User.findOne({ email: 'student@library.com' });
    if (existingStudent) {
      console.log('Student user already exists');
      return;
    }

    // Create student user
    const studentUser = new User({
      name: 'Student User',
      email: 'student@library.com',
      password: 'student123', // This will be hashed by the pre-save middleware
      role: UserRole.STUDENT,
    });

    await studentUser.save();
    console.log('Student user created successfully');
    console.log('Email: student@library.com');
    console.log('Password: student123');
  } catch (error) {
    console.error('Error creating student user:', error);
  }
}

// Run the functions
async function main() {
  await createAdminUser();
  await createStudentUser();
  process.exit(0);
}

main();
