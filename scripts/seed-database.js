import connectDB from '@/lib/mongodb';
import User, { UserRole } from '@/models/User';
import Book, { AvailabilityStatus } from '@/models/Book';
import Table from '@/models/Table';
import Reservation, { ReservationStatus } from '@/models/Reservation';
import BorrowRequest, { BorrowRequestStatus } from '@/models/BorrowRequest';

async function clearDatabase() {
  console.log('🧹 Clearing existing data...');
  await User.deleteMany({});
  await Book.deleteMany({});
  await Table.deleteMany({});
  await Reservation.deleteMany({});
  await BorrowRequest.deleteMany({});
  console.log('✅ Database cleared');
}

async function createUsers() {
  console.log('👥 Creating users...');
  
  // Create admin user
  const adminUser = new User({
    name: 'Admin User',
    email: 'admin@library.com',
    password: 'admin123',
    role: UserRole.ADMIN
  });
  await adminUser.save();
  console.log('✅ Admin user created: admin@library.com / admin123');

  // Create student users
  const students = [
    {
      name: 'John Smith',
      email: 'john.smith@student.com',
      password: 'student123',
      role: UserRole.STUDENT
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@student.com',
      password: 'student123',
      role: UserRole.STUDENT
    },
    {
      name: 'Mike Wilson',
      email: 'mike.wilson@student.com',
      password: 'student123',
      role: UserRole.STUDENT
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@student.com',
      password: 'student123',
      role: UserRole.STUDENT
    }
  ];

  const createdStudents = [];
  for (const studentData of students) {
    const student = new User(studentData);
    await student.save();
    createdStudents.push(student);
  }
  
  console.log(`✅ Created ${students.length} student users`);
  return { admin: adminUser, students: createdStudents };
}

async function createBooks(adminId) {
  console.log('📚 Creating books...');
  
  const books = [
    {
      title: 'Introduction to Computer Science',
      author: 'John Doe',
      genre: 'Computer Science',
      description: 'A comprehensive introduction to computer science concepts, algorithms, and programming fundamentals.',
      coverImageURL: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300',
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      addedBy: adminId
    },
    {
      title: 'Data Structures and Algorithms',
      author: 'Jane Smith',
      genre: 'Computer Science',
      description: 'Learn about fundamental data structures and algorithms used in software development.',
      coverImageURL: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300',
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      addedBy: adminId
    },
    {
      title: 'Web Development with React',
      author: 'Mike Johnson',
      genre: 'Web Development',
      description: 'Master modern web development using React, including hooks, state management, and best practices.',
      coverImageURL: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300',
      availabilityStatus: AvailabilityStatus.BORROWED,
      addedBy: adminId
    },
    {
      title: 'Database Design Principles',
      author: 'Sarah Wilson',
      genre: 'Database',
      description: 'Learn the fundamentals of database design, normalization, and SQL optimization.',
      coverImageURL: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=300',
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      addedBy: adminId
    },
    {
      title: 'Machine Learning Fundamentals',
      author: 'David Brown',
      genre: 'Machine Learning',
      description: 'Introduction to machine learning concepts, algorithms, and practical applications.',
      coverImageURL: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300',
      availabilityStatus: AvailabilityStatus.RESERVED,
      addedBy: adminId
    },
    {
      title: 'Software Engineering Best Practices',
      author: 'Lisa Anderson',
      genre: 'Software Engineering',
      description: 'Learn about software development methodologies, testing, and project management.',
      coverImageURL: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300',
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      addedBy: adminId
    },
    {
      title: 'Python Programming Guide',
      author: 'Robert Taylor',
      genre: 'Programming',
      description: 'Complete guide to Python programming from basics to advanced concepts.',
      coverImageURL: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300',
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      addedBy: adminId
    },
    {
      title: 'Cybersecurity Essentials',
      author: 'Amanda Clark',
      genre: 'Cybersecurity',
      description: 'Learn about cybersecurity threats, prevention strategies, and security best practices.',
      coverImageURL: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300',
      availabilityStatus: AvailabilityStatus.MAINTENANCE,
      addedBy: adminId
    },
    {
      title: 'Cloud Computing Architecture',
      author: 'Kevin Lee',
      genre: 'Cloud Computing',
      description: 'Understanding cloud computing models, services, and deployment strategies.',
      coverImageURL: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300',
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      addedBy: adminId
    },
    {
      title: 'Mobile App Development',
      author: 'Rachel Green',
      genre: 'Mobile Development',
      description: 'Learn to build mobile applications for iOS and Android platforms.',
      coverImageURL: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300',
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      addedBy: adminId
    }
  ];

  const createdBooks = [];
  for (const bookData of books) {
    const book = new Book(bookData);
    await book.save();
    createdBooks.push(book);
  }
  
  console.log(`✅ Created ${books.length} books`);
  return createdBooks;
}

async function createTables() {
  console.log('🪑 Creating study tables...');
  
  const tables = [
    {
      label: 'Table A1',
      seats: [1, 2, 3, 4]
    },
    {
      label: 'Table A2',
      seats: [1, 2, 3, 4]
    },
    {
      label: 'Table B1',
      seats: [1, 2, 3, 4, 5, 6]
    },
    {
      label: 'Table B2',
      seats: [1, 2, 3, 4, 5, 6]
    },
    {
      label: 'Table C1',
      seats: [1, 2]
    },
    {
      label: 'Table C2',
      seats: [1, 2]
    }
  ];

  const createdTables = [];
  for (const tableData of tables) {
    const table = new Table(tableData);
    await table.save();
    createdTables.push(table);
  }
  
  console.log(`✅ Created ${tables.length} study tables`);
  return createdTables;
}

async function createReservations(students, books, tables) {
  console.log('📅 Creating reservations...');
  
  const reservations = [
    {
      studentId: students[0]._id,
      bookId: books[4]._id, // Machine Learning book (RESERVED)
      tableId: tables[0]._id,
      seatNumber: 1,
      reservedDate: new Date('2024-01-15'),
      timeSlot: {
        startTime: '09:00',
        endTime: '11:00'
      },
      status: ReservationStatus.APPROVED
    },
    {
      studentId: students[1]._id,
      bookId: books[2]._id, // Web Development book (BORROWED)
      tableId: tables[1]._id,
      seatNumber: 2,
      reservedDate: new Date('2024-01-16'),
      timeSlot: {
        startTime: '14:00',
        endTime: '16:00'
      },
      status: ReservationStatus.PENDING
    },
    {
      studentId: students[2]._id,
      bookId: books[0]._id, // Computer Science book
      tableId: tables[2]._id,
      seatNumber: 3,
      reservedDate: new Date('2024-01-17'),
      timeSlot: {
        startTime: '10:00',
        endTime: '12:00'
      },
      status: ReservationStatus.APPROVED
    }
  ];

  const createdReservations = [];
  for (const reservationData of reservations) {
    const reservation = new Reservation(reservationData);
    await reservation.save();
    createdReservations.push(reservation);
  }
  
  console.log(`✅ Created ${reservations.length} reservations`);
  return createdReservations;
}

async function createBorrowRequests(students, books) {
  console.log('📖 Creating borrow requests...');
  
  const borrowRequests = [
    {
      studentId: students[0]._id,
      bookId: books[1]._id, // Data Structures book
      requestedFromDate: new Date('2024-01-20'),
      requestedToDate: new Date('2024-02-03'),
      status: ReservationStatus.PENDING
    },
    {
      studentId: students[1]._id,
      bookId: books[5]._id, // Software Engineering book
      requestedFromDate: new Date('2024-01-18'),
      requestedToDate: new Date('2024-02-01'),
      status: ReservationStatus.APPROVED
    },
    {
      studentId: students[2]._id,
      bookId: books[6]._id, // Python Programming book
      requestedFromDate: new Date('2024-01-22'),
      requestedToDate: new Date('2024-02-05'),
      status: BorrowRequestStatus.DENIED
    }
  ];

  const createdBorrowRequests = [];
  for (const requestData of borrowRequests) {
    const request = new BorrowRequest(requestData);
    await request.save();
    createdBorrowRequests.push(request);
  }
  
  console.log(`✅ Created ${borrowRequests.length} borrow requests`);
  return createdBorrowRequests;
}

async function seedDatabase() {
  try {
    await connectDB();
    await clearDatabase();
    
    const { admin, students } = await createUsers();
    const books = await createBooks(admin._id);
    const tables = await createTables();
    const reservations = await createReservations(students, books, tables);
    const borrowRequests = await createBorrowRequests(students, books);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Data Summary:');
    console.log(`👥 Users: 1 admin + ${students.length} students`);
    console.log(`📚 Books: ${books.length} books with various availability statuses`);
    console.log(`🪑 Tables: ${tables.length} study tables`);
    console.log(`📅 Reservations: ${reservations.length} reservations`);
    console.log(`📖 Borrow Requests: ${borrowRequests.length} requests`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@library.com / admin123');
    console.log('Students: john.smith@student.com / student123');
    console.log('         sarah.johnson@student.com / student123');
    console.log('         mike.wilson@student.com / student123');
    console.log('         emily.davis@student.com / student123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    const mongoose = require('mongoose');
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
}

seedDatabase();
