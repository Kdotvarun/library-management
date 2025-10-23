const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library-management';

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
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 This is expected if MongoDB is not running locally.');
    console.log('💡 For Vercel deployment, you can use MongoDB Atlas.');
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
      description: 'A comprehensive introduction to computer science concepts, algorithms, and programming fundamentals.',
      coverImageURL: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    {
      title: 'Data Structures and Algorithms',
      author: 'Jane Smith',
      genre: 'Computer Science',
      description: 'Learn about fundamental data structures and algorithms used in software development.',
      coverImageURL: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300',
      availabilityStatus: 'BORROWED',
      addedBy: adminId
    },
    {
      title: 'Computer Networks',
      author: 'Michael Chen',
      genre: 'Computer Science',
      description: 'Comprehensive guide to computer networking concepts and protocols.',
      coverImageURL: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    // Web Development
    {
      title: 'Web Development with React',
      author: 'Mike Johnson',
      genre: 'Web Development',
      description: 'Master modern web development using React and modern frameworks.',
      coverImageURL: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300',
      availabilityStatus: 'RESERVED',
      addedBy: adminId
    },
    {
      title: 'Full Stack JavaScript',
      author: 'Lisa Anderson',
      genre: 'Web Development',
      description: 'Complete guide to building full-stack applications with JavaScript.',
      coverImageURL: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    // Machine Learning
    {
      title: 'Machine Learning Fundamentals',
      author: 'David Brown',
      genre: 'Machine Learning',
      description: 'Introduction to machine learning concepts and practical applications.',
      coverImageURL: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300',
      availabilityStatus: 'MAINTENANCE',
      addedBy: adminId
    },
    {
      title: 'Deep Learning with Python',
      author: 'Amanda Clark',
      genre: 'Machine Learning',
      description: 'Comprehensive guide to deep learning using Python and TensorFlow.',
      coverImageURL: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    // Programming
    {
      title: 'Python Programming Guide',
      author: 'Robert Taylor',
      genre: 'Programming',
      description: 'Complete guide to Python programming from basics to advanced concepts.',
      coverImageURL: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300',
      availabilityStatus: 'BORROWED',
      addedBy: adminId
    },
    {
      title: 'Java: The Complete Reference',
      author: 'Rachel Green',
      genre: 'Programming',
      description: 'Comprehensive Java programming guide covering all aspects of the language.',
      coverImageURL: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300',
      availabilityStatus: 'AVAILABLE',
      addedBy: adminId
    },
    // Software Engineering
    {
      title: 'Clean Code',
      author: 'Robert Martin',
      genre: 'Software Engineering',
      description: 'A handbook of agile software craftsmanship and clean coding practices.',
      coverImageURL: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300',
      availabilityStatus: 'AVAILABLE',
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
    { label: 'Table B1', seats: [1, 2, 3, 4, 5, 6] },
    { label: 'Table B2', seats: [1, 2, 3, 4, 5, 6] },
    { label: 'Quiet Study A', seats: [1, 2, 3, 4, 5, 6] },
    { label: 'Group Study 1', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { label: 'Computer Lab A', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }
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
      bookId: books[0]._id,
      tableId: tables[0]._id,
      seatNumber: 1,
      reservedDate: new Date('2024-01-15'),
      timeSlot: { startTime: '09:00', endTime: '11:00' },
      status: 'APPROVED'
    },
    {
      studentId: students[1]._id,
      bookId: books[1]._id,
      tableId: tables[1]._id,
      seatNumber: 2,
      reservedDate: new Date('2024-01-16'),
      timeSlot: { startTime: '14:00', endTime: '16:00' },
      status: 'PENDING'
    },
    {
      studentId: students[2]._id,
      bookId: books[2]._id,
      tableId: tables[2]._id,
      seatNumber: 3,
      reservedDate: new Date('2024-01-17'),
      timeSlot: { startTime: '10:00', endTime: '12:00' },
      status: 'APPROVED'
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
      bookId: books[0]._id,
      requestedFromDate: new Date('2024-01-20'),
      requestedToDate: new Date('2024-02-03'),
      status: 'PENDING'
    },
    {
      studentId: students[1]._id,
      bookId: books[1]._id,
      requestedFromDate: new Date('2024-01-18'),
      requestedToDate: new Date('2024-02-01'),
      status: 'APPROVED'
    },
    {
      studentId: students[2]._id,
      bookId: books[2]._id,
      requestedFromDate: new Date('2024-01-22'),
      requestedToDate: new Date('2024-02-05'),
      status: 'DENIED'
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
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Data Summary:');
    console.log(`👥 Users: ${admins.length} admins + ${students.length} students`);
    console.log(`📚 Books: ${books.length} books across multiple genres`);
    console.log(`🪑 Tables: ${tables.length} study tables`);
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
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDatabase();
