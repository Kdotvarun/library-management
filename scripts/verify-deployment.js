#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * This script verifies that the application is ready for Vercel deployment
 * by checking all critical components and configurations.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Library Management System for Vercel Deployment...\n');

let allChecksPassed = true;

// Check 1: Package.json exists and has required scripts
console.log('📦 Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredScripts = ['dev', 'build', 'start', 'lint'];
  const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
  
  if (missingScripts.length > 0) {
    console.log(`❌ Missing scripts: ${missingScripts.join(', ')}`);
    allChecksPassed = false;
  } else {
    console.log('✅ All required scripts present');
  }
  
  // Check for required dependencies
  const requiredDeps = ['next', 'react', 'react-dom', 'mongoose', 'next-auth', 'bcryptjs'];
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
  
  if (missingDeps.length > 0) {
    console.log(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
    allChecksPassed = false;
  } else {
    console.log('✅ All required dependencies present');
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
  allChecksPassed = false;
}

// Check 2: Next.js configuration
console.log('\n⚙️ Checking Next.js configuration...');
try {
  if (fs.existsSync('next.config.js')) {
    console.log('✅ next.config.js exists');
  } else {
    console.log('❌ next.config.js missing');
    allChecksPassed = false;
  }
  
  if (fs.existsSync('tsconfig.json')) {
    console.log('✅ tsconfig.json exists');
  } else {
    console.log('❌ tsconfig.json missing');
    allChecksPassed = false;
  }
} catch (error) {
  console.log('❌ Error checking Next.js config:', error.message);
  allChecksPassed = false;
}

// Check 3: Vercel configuration
console.log('\n🚀 Checking Vercel configuration...');
try {
  if (fs.existsSync('vercel.json')) {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    console.log('✅ vercel.json exists');
    
    if (vercelConfig.functions && vercelConfig.functions['app/api/**/*.ts']) {
      console.log('✅ API function configuration present');
    } else {
      console.log('⚠️ API function configuration missing (optional)');
    }
  } else {
    console.log('❌ vercel.json missing');
    allChecksPassed = false;
  }
} catch (error) {
  console.log('❌ Error checking Vercel config:', error.message);
  allChecksPassed = false;
}

// Check 4: Environment variables template
console.log('\n🔐 Checking environment configuration...');
try {
  if (fs.existsSync('env.example')) {
    console.log('✅ env.example exists');
  } else {
    console.log('❌ env.example missing');
    allChecksPassed = false;
  }
} catch (error) {
  console.log('❌ Error checking env.example:', error.message);
  allChecksPassed = false;
}

// Check 5: Critical application files
console.log('\n📁 Checking critical application files...');
const criticalFiles = [
  'app/layout.tsx',
  'app/page.tsx',
  'app/signin/page.tsx',
  'lib/mongodb.ts',
  'lib/auth.ts',
  'models/User.ts',
  'models/Book.ts',
  'components/Providers.tsx',
  'components/Navigation.tsx'
];

let missingFiles = [];
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} missing`);
    missingFiles.push(file);
    allChecksPassed = false;
  }
});

// Check 6: API routes
console.log('\n🔌 Checking API routes...');
const apiRoutes = [
  'app/api/auth/[...nextauth]/route.ts',
  'app/api/books/route.ts',
  'app/api/admin/books/route.ts',
  'app/api/student/reservations/route.ts'
];

let missingApiRoutes = [];
apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✅ ${route}`);
  } else {
    console.log(`❌ ${route} missing`);
    missingApiRoutes.push(route);
    allChecksPassed = false;
  }
});

// Check 7: Database seeding scripts
console.log('\n🌱 Checking database seeding scripts...');
const seedingScripts = [
  'scripts/seed-comprehensive-database.js',
  'scripts/seed-test-data.js'
];

seedingScripts.forEach(script => {
  if (fs.existsSync(script)) {
    console.log(`✅ ${script}`);
  } else {
    console.log(`❌ ${script} missing`);
    allChecksPassed = false;
  }
});

// Check 8: TypeScript configuration
console.log('\n📝 Checking TypeScript configuration...');
try {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.strict) {
    console.log('✅ TypeScript strict mode enabled');
  } else {
    console.log('⚠️ TypeScript strict mode not enabled (recommended)');
  }
  
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
    console.log('✅ Path aliases configured');
  } else {
    console.log('⚠️ Path aliases not configured (optional)');
  }
} catch (error) {
  console.log('❌ Error checking TypeScript config:', error.message);
  allChecksPassed = false;
}

// Check 9: Build test
console.log('\n🔨 Testing build process...');
try {
  const { execSync } = require('child_process');
  console.log('Running npm run build...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build successful');
} catch (error) {
  console.log('❌ Build failed:', error.message);
  allChecksPassed = false;
}

// Final summary
console.log('\n' + '='.repeat(50));
if (allChecksPassed) {
  console.log('🎉 ALL CHECKS PASSED!');
  console.log('✅ Your Library Management System is ready for Vercel deployment!');
  console.log('\n📋 Next Steps:');
  console.log('1. Set up MongoDB Atlas database');
  console.log('2. Configure environment variables in Vercel');
  console.log('3. Deploy to Vercel');
  console.log('4. Run database seeding script');
  console.log('5. Test the application');
} else {
  console.log('❌ SOME CHECKS FAILED!');
  console.log('Please fix the issues above before deploying.');
  
  if (missingFiles.length > 0) {
    console.log(`\nMissing files: ${missingFiles.join(', ')}`);
  }
  if (missingApiRoutes.length > 0) {
    console.log(`\nMissing API routes: ${missingApiRoutes.join(', ')}`);
  }
}

console.log('\n📚 For detailed deployment instructions, see DEPLOYMENT_GUIDE.md');
console.log('='.repeat(50));
