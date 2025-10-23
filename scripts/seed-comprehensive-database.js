const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  console.log('Please set MONGODB_URI in your .env.local file');
  process.exit(1);
}

// Define schemas directly
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'STUDENT'], default: 'STUDENT' },
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  description: { type: String, required: true },
  coverImageURL: { type: String },
  availabilityStatus: { 
    type: String, 
    enum: ['AVAILABLE', 'BORROWED', 'RESERVED', 'MAINTENANCE'], 
    default: 'AVAILABLE' 
  },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const TableSchema = new mongoose.Schema({
  label: { type: String, required: true },
  seats: [{ type: Number, required: true }]
}, { timestamps: true });

const ReservationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  seatNumber: { type: Number, required: true },
  reservedDate: { type: Date, required: true },
  timeSlot: {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'DENIED', 'WAITLISTED'], 
    default: 'PENDING' 
  }
}, { timestamps: true });

const BorrowRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  requestedFromDate: { type: Date, required: true },
  requestedToDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'DENIED'], 
    default: 'PENDING' 
  }
}, { timestamps: true });

// Create models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);
const Table = mongoose.models.Table || mongoose.model('Table', TableSchema);
const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);
const BorrowRequest = mongoose.models.BorrowRequest || mongoose.model('BorrowRequest', BorrowRequestSchema);

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

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
  
  // Create admin users
  const admins = [
    {
      name: 'Admin User',
      email: 'admin@library.com',
      password: 'admin123',
      role: 'ADMIN'
    },
    {
      name: 'Library Manager',
      email: 'manager@library.com',
      password: 'manager123',
      role: 'ADMIN'
    }
  ];

  const createdAdmins = [];
  for (const adminData of admins) {
    const admin = new User(adminData);
    await admin.save();
    createdAdmins.push(admin);
  }
  console.log(`✅ Created ${admins.length} admin users`);

  // Create student users
  const students = [
    {
      name: 'John Smith',
      email: 'john.smith@student.com',
      password: 'student123',
      role: 'STUDENT'
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@student.com',
      password: 'student123',
      role: 'STUDENT'
    },
    {
      name: 'Mike Wilson',
      email: 'mike.wilson@student.com',
      password: 'student123',
      role: 'STUDENT'
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@student.com',
      password: 'student123',
      role: 'STUDENT'
    },
    {
      name: 'David Brown',
      email: 'david.brown@student.com',
      password: 'student123',
      role: 'STUDENT'
    },
    {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@student.com',
      password: 'student123',
      role: 'STUDENT'
    },
    {
      name: 'Robert Taylor',
      email: 'robert.taylor@student.com',
      password: 'student123',
      role: 'STUDENT'
    },
    {
      name: 'Amanda Clark',
      email: 'amanda.clark@student.com',
      password: 'student123',
      role: 'STUDENT'
    },
    {
      name: 'Kevin Lee',
      email: 'kevin.lee@student.com',
      password: 'student123',
      role: 'STUDENT'
    },
    {
      name: 'Rachel Green',
      email: 'rachel.green@student.com',
      password: 'student123',
      role: 'STUDENT'
    }
  ];

  const createdStudents = [];
  for (const studentData of students) {
    const student = new User(studentData);
    await student.save();
    createdStudents.push(student);
  }
  
  console.log(`✅ Created ${students.length} student users`);
  return { admins: createdAdmins, students: createdStudents };
}

async function createBooks(adminId) {
  console.log('📚 Creating books...');
  
  const books = [
    // Computer Science
    {
      title: 'Introduction to Computer Science',
      author: 'John Doe',
      genre: 'Computer Science',
      description: 'A comprehensive introduction to computer science concepts, algorithms, and programming fundamentals. This book covers everything from basic programming to advanced data structures.',
      coverImageURL: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    {
      title: 'Data Structures and Algorithms',
      author: 'Jane Smith',
      genre: 'Computer Science',
      description: 'Learn about fundamental data structures and algorithms used in software development. Includes practical examples and coding exercises.',
      coverImageURL: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    {
      title: 'Computer Networks',
      author: 'Michael Chen',
      genre: 'Computer Science',
      description: 'Comprehensive guide to computer networking concepts, protocols, and implementation. Perfect for understanding how the internet works.',
      coverImageURL: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300',
      availabilityStatus: 'BORROWED',
      addedBy: adminId
    },
    {
      title: 'Operating Systems',
      author: 'Sarah Wilson',
      genre: 'Computer Science',
      description: 'Deep dive into operating system concepts including process management, memory management, and file systems.',
      coverImageURL: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    {
      title: 'Database Systems',
      author: 'David Brown',
      genre: 'Computer Science',
      description: 'Learn the fundamentals of database design, normalization, and SQL optimization. Includes practical examples with real-world scenarios.',
      coverImageURL: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=300',
      availabilityStatus: 'RESERVED',
      addedBy: adminId
    },

    // Web Development
    {
      title: 'Web Development with React',
      author: 'Mike Johnson',
      genre: 'Web Development',
      description: 'Master modern web development using React, including hooks, state management, and best practices. Perfect for building modern web applications.',
      coverImageURL: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300',
      availabilityStatus: 'BORROWED',
      addedBy: adminId
    },
    {
      title: 'Full Stack JavaScript',
      author: 'Lisa Anderson',
      genre: 'Web Development',
      description: 'Complete guide to building full-stack applications with JavaScript, Node.js, and modern frameworks.',
      coverImageURL: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    {
      title: 'HTML5 and CSS3 Mastery',
      author: 'Robert Taylor',
      genre: 'Web Development',
      description: 'Learn the latest HTML5 and CSS3 features for creating responsive and interactive web pages.',
      coverImageURL: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },

    // Machine Learning
    {
      title: 'Machine Learning Fundamentals',
      author: 'David Brown',
      genre: 'Machine Learning',
      description: 'Introduction to machine learning concepts, algorithms, and practical applications. Includes hands-on projects and real-world examples.',
      coverImageURL: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300',
      availabilityStatus: 'RESERVED',
      addedBy: adminId
    },
    {
      title: 'Deep Learning with Python',
      author: 'Amanda Clark',
      genre: 'Machine Learning',
      description: 'Comprehensive guide to deep learning using Python and TensorFlow. Perfect for understanding neural networks and AI.',
      coverImageURL: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    {
      title: 'Data Science Handbook',
      author: 'Kevin Lee',
      genre: 'Machine Learning',
      description: 'Complete guide to data science including data analysis, visualization, and machine learning techniques.',
      coverImageURL: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300',
      availabilityStatus: 'MAINTENANCE',
      addedBy: adminId
    },

    // Programming Languages
    {
      title: 'Python Programming Guide',
      author: 'Robert Taylor',
      genre: 'Programming',
      description: 'Complete guide to Python programming from basics to advanced concepts. Includes practical exercises and projects.',
      coverImageURL: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    {
      title: 'Java: The Complete Reference',
      author: 'Rachel Green',
      genre: 'Programming',
      description: 'Comprehensive Java programming guide covering all aspects of the language from basic syntax to advanced features.',
      coverImageURL: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300',
      availabilityStatus: 'BORROWED',
      addedBy: adminId
    },
    {
      title: 'C++ Programming',
      author: 'John Smith',
      genre: 'Programming',
      description: 'Learn C++ programming from fundamentals to advanced topics including object-oriented programming and STL.',
      coverImageURL: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },

    // Software Engineering
    {
      title: 'Software Engineering Best Practices',
      author: 'Lisa Anderson',
      genre: 'Software Engineering',
      description: 'Learn about software development methodologies, testing, and project management. Essential for professional software development.',
      coverImageURL: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    {
      title: 'Clean Code',
      author: 'Robert Martin',
      genre: 'Software Engineering',
      description: 'A handbook of agile software craftsmanship. Learn how to write clean, maintainable, and efficient code.',
      coverImageURL: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300',
      availabilityStatus: 'BORROWED',
      addedBy: adminId
    },
    {
      title: 'Design Patterns',
      author: 'Gang of Four',
      genre: 'Software Engineering',
      description: 'Classic book on software design patterns. Learn how to solve common programming problems with proven solutions.',
      coverImageURL: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },

    // Cybersecurity
    {
      title: 'Cybersecurity Essentials',
      author: 'Amanda Clark',
      genre: 'Cybersecurity',
      description: 'Learn about cybersecurity threats, prevention strategies, and security best practices. Essential for protecting digital assets.',
      coverImageURL: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300',
      availabilityStatus: 'MAINTENANCE',
      addedBy: adminId
    },
    {
      title: 'Ethical Hacking',
      author: 'Kevin Lee',
      genre: 'Cybersecurity',
      description: 'Learn ethical hacking techniques and penetration testing. Understand how to secure systems by thinking like an attacker.',
      coverImageURL: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },

    // Cloud Computing
    {
      title: 'Cloud Computing Architecture',
      author: 'Kevin Lee',
      genre: 'Cloud Computing',
      description: 'Understanding cloud computing models, services, and deployment strategies. Learn AWS, Azure, and Google Cloud.',
      coverImageURL: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    {
      title: 'AWS Certified Solutions Architect',
      author: 'David Brown',
      genre: 'Cloud Computing',
      description: 'Complete guide to AWS services and architecture patterns. Prepare for the AWS Solutions Architect certification.',
      coverImageURL: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=300',
      availabilityStatus: 'RESERVED',
      addedBy: adminId
    },

    // Mobile Development
    {
      title: 'Mobile App Development',
      author: 'Rachel Green',
      genre: 'Mobile Development',
      description: 'Learn to build mobile applications for iOS and Android platforms. Covers React Native, Flutter, and native development.',
      coverImageURL: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    {
      title: 'iOS Development with Swift',
      author: 'Mike Johnson',
      genre: 'Mobile Development',
      description: 'Complete guide to iOS app development using Swift. Learn UIKit, SwiftUI, and iOS app architecture patterns.',
      coverImageURL: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300',
      availabilityStatus: 'BORROWED',
      addedBy: adminId
    },

    // Mathematics
    {
      title: 'Discrete Mathematics',
      author: 'Sarah Wilson',
      genre: 'Mathematics',
      description: 'Essential mathematics for computer science including logic, set theory, combinatorics, and graph theory.',
      coverImageURL: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    {
      title: 'Linear Algebra for Computer Science',
      author: 'David Brown',
      genre: 'Mathematics',
      description: 'Linear algebra concepts essential for computer science including vectors, matrices, and transformations.',
      coverImageURL: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },

    // Additional Computer Science
    {
      title: 'Computer Graphics',
      author: 'Emily Davis',
      genre: 'Computer Science',
      description: 'Learn computer graphics concepts including 2D and 3D transformations, rendering, and animation techniques.',
      coverImageURL: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    {
      title: 'Artificial Intelligence',
      author: 'John Doe',
      genre: 'Computer Science',
      description: 'Comprehensive introduction to AI concepts including search algorithms, knowledge representation, and machine learning.',
      coverImageURL: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300',
      availabilityStatus: 'BORROWED',
      addedBy: adminId
    },
    {
      title: 'Compiler Design',
      author: 'Jane Smith',
      genre: 'Computer Science',
      description: 'Learn how compilers work including lexical analysis, parsing, semantic analysis, and code generation.',
      coverImageURL: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300',
      availabilityStatus: 'MAINTENANCE',
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
    { label: 'Table A1', seats: [1, 2, 3, 4] },
    { label: 'Table A2', seats: [1, 2, 3, 4] },
    { label: 'Table A3', seats: [1, 2, 3, 4] },
    { label: 'Table B1', seats: [1, 2, 3, 4, 5, 6] },
    { label: 'Table B2', seats: [1, 2, 3, 4, 5, 6] },
    { label: 'Table B3', seats: [1, 2, 3, 4, 5, 6] },
    { label: 'Table C1', seats: [1, 2] },
    { label: 'Table C2', seats: [1, 2] },
    { label: 'Table D1', seats: [1, 2, 3, 4, 5, 6, 7, 8] },
    { label: 'Table D2', seats: [1, 2, 3, 4, 5, 6, 7, 8] },
    { label: 'Quiet Study A', seats: [1, 2, 3, 4, 5, 6] },
    { label: 'Quiet Study B', seats: [1, 2, 3, 4, 5, 6] },
    { label: 'Group Study 1', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { label: 'Group Study 2', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { label: 'Computer Lab A', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { label: 'Computer Lab B', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }
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
      bookId: books[4]._id, // Database Systems
      tableId: tables[0]._id,
      seatNumber: 1,
      reservedDate: new Date('2024-01-15'),
      timeSlot: { startTime: '09:00', endTime: '11:00' },
      status: 'APPROVED'
    },
    {
      studentId: students[1]._id,
      bookId: books[5]._id, // Web Development with React
      tableId: tables[1]._id,
      seatNumber: 2,
      reservedDate: new Date('2024-01-16'),
      timeSlot: { startTime: '14:00', endTime: '16:00' },
      status: 'PENDING'
    },
    {
      studentId: students[2]._id,
      bookId: books[0]._id, // Introduction to Computer Science
      tableId: tables[2]._id,
      seatNumber: 3,
      reservedDate: new Date('2024-01-17'),
      timeSlot: { startTime: '10:00', endTime: '12:00' },
      status: 'APPROVED'
    },
    {
      studentId: students[3]._id,
      bookId: books[8]._id, // Machine Learning Fundamentals
      tableId: tables[3]._id,
      seatNumber: 4,
      reservedDate: new Date('2024-01-18'),
      timeSlot: { startTime: '13:00', endTime: '15:00' },
      status: 'APPROVED'
    },
    {
      studentId: students[4]._id,
      bookId: books[1]._id, // Data Structures and Algorithms
      tableId: tables[4]._id,
      seatNumber: 5,
      reservedDate: new Date('2024-01-19'),
      timeSlot: { startTime: '11:00', endTime: '13:00' },
      status: 'PENDING'
    },
    {
      studentId: students[5]._id,
      bookId: books[6]._id, // Full Stack JavaScript
      tableId: tables[5]._id,
      seatNumber: 6,
      reservedDate: new Date('2024-01-20'),
      timeSlot: { startTime: '15:00', endTime: '17:00' },
      status: 'DENIED'
    },
    {
      studentId: students[6]._id,
      bookId: books[12]._id, // Python Programming Guide
      tableId: tables[6]._id,
      seatNumber: 1,
      reservedDate: new Date('2024-01-21'),
      timeSlot: { startTime: '08:00', endTime: '10:00' },
      status: 'APPROVED'
    },
    {
      studentId: students[7]._id,
      bookId: books[13]._id, // Java: The Complete Reference
      tableId: tables[7]._id,
      seatNumber: 2,
      reservedDate: new Date('2024-01-22'),
      timeSlot: { startTime: '16:00', endTime: '18:00' },
      status: 'WAITLISTED'
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
      bookId: books[1]._id, // Data Structures and Algorithms
      requestedFromDate: new Date('2024-01-20'),
      requestedToDate: new Date('2024-02-03'),
      status: 'PENDING'
    },
    {
      studentId: students[1]._id,
      bookId: books[14]._id, // Software Engineering Best Practices
      requestedFromDate: new Date('2024-01-18'),
      requestedToDate: new Date('2024-02-01'),
      status: 'APPROVED'
    },
    {
      studentId: students[2]._id,
      bookId: books[12]._id, // Python Programming Guide
      requestedFromDate: new Date('2024-01-22'),
      requestedToDate: new Date('2024-02-05'),
      status: 'DENIED'
    },
    {
      studentId: students[3]._id,
      bookId: books[2]._id, // Computer Networks
      requestedFromDate: new Date('2024-01-23'),
      requestedToDate: new Date('2024-02-06'),
      status: 'PENDING'
    },
    {
      studentId: students[4]._id,
      bookId: books[3]._id, // Operating Systems
      requestedFromDate: new Date('2024-01-24'),
      requestedToDate: new Date('2024-02-07'),
      status: 'APPROVED'
    },
    {
      studentId: students[5]._id,
      bookId: books[7]._id, // HTML5 and CSS3 Mastery
      requestedFromDate: new Date('2024-01-25'),
      requestedToDate: new Date('2024-02-08'),
      status: 'PENDING'
    },
    {
      studentId: students[6]._id,
      bookId: books[9]._id, // Deep Learning with Python
      requestedFromDate: new Date('2024-01-26'),
      requestedToDate: new Date('2024-02-09'),
      status: 'APPROVED'
    },
    {
      studentId: students[7]._id,
      bookId: books[15]._id, // Clean Code
      requestedFromDate: new Date('2024-01-27'),
      requestedToDate: new Date('2024-02-10'),
      status: 'DENIED'
    },
    {
      studentId: students[8]._id,
      bookId: books[16]._id, // Design Patterns
      requestedFromDate: new Date('2024-01-28'),
      requestedToDate: new Date('2024-02-11'),
      status: 'PENDING'
    },
    {
      studentId: students[9]._id,
      bookId: books[18]._id, // Cloud Computing Architecture
      requestedFromDate: new Date('2024-01-29'),
      requestedToDate: new Date('2024-02-12'),
      status: 'APPROVED'
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
    
    const { admins, students } = await createUsers();
    const books = await createBooks(admins[0]._id);
    const tables = await createTables();
    const reservations = await createReservations(students, books, tables);
    const borrowRequests = await createBorrowRequests(students, books);
    
    console.log('\n🎉 Comprehensive database seeding completed successfully!');
    console.log('\n📋 Complete Data Summary:');
    console.log(`👥 Users: ${admins.length} admins + ${students.length} students`);
    console.log(`📚 Books: ${books.length} books across multiple genres`);
    console.log(`🪑 Tables: ${tables.length} study tables (various sizes)`);
    console.log(`📅 Reservations: ${reservations.length} study reservations`);
    console.log(`📖 Borrow Requests: ${borrowRequests.length} book requests`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Admins: admin@library.com / admin123');
    console.log('        manager@library.com / manager123');
    console.log('Students: john.smith@student.com / student123');
    console.log('          sarah.johnson@student.com / student123');
    console.log('          mike.wilson@student.com / student123');
    console.log('          emily.davis@student.com / student123');
    console.log('          david.brown@student.com / student123');
    console.log('          lisa.anderson@student.com / student123');
    console.log('          robert.taylor@student.com / student123');
    console.log('          amanda.clark@student.com / student123');
    console.log('          kevin.lee@student.com / student123');
    console.log('          rachel.green@student.com / student123');
    
    console.log('\n📊 Book Genres Available:');
    const genres = [...new Set(books.map(book => book.genre))];
    genres.forEach(genre => console.log(`  - ${genre}`));
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
}

seedDatabase();
