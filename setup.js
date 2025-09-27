const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   AquaSutra - Water Hazard Monitoring System Setup        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

// Check if Node.js and npm are installed
try {
  const nodeVersion = execSync('node -v').toString().trim();
  const npmVersion = execSync('npm -v').toString().trim();
  console.log(`${colors.green}✓ Node.js ${nodeVersion} detected${colors.reset}`);
  console.log(`${colors.green}✓ npm ${npmVersion} detected${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}✗ Node.js or npm not found. Please install Node.js and npm before continuing.${colors.reset}`);
  process.exit(1);
}

// Check if Python is installed
let pythonCommand = 'python';
try {
  execSync('python --version');
} catch (error) {
  try {
    execSync('python3 --version');
    pythonCommand = 'python3';
  } catch (error) {
    console.error(`${colors.red}✗ Python not found. Please install Python 3.7+ before continuing.${colors.reset}`);
    process.exit(1);
  }
}
console.log(`${colors.green}✓ Python detected${colors.reset}`);

// Main setup function
async function setup() {
  try {
    // Create necessary directories if they don't exist
    const directories = ['database', 'docs', 'backend/mock-data'];
    directories.forEach(dir => {
      const dirPath = path.join(__dirname, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`${colors.green}✓ Created directory: ${dir}${colors.reset}`);
      }
    });

    // Install backend dependencies
    console.log(`\n${colors.yellow}Installing backend dependencies...${colors.reset}`);
    execSync('cd backend && npm install', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Backend dependencies installed${colors.reset}`);

    // Install frontend dependencies
    console.log(`\n${colors.yellow}Installing frontend dependencies...${colors.reset}`);
    execSync('cd frontend && npm install', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Frontend dependencies installed${colors.reset}`);

    // Install Python dependencies
    console.log(`\n${colors.yellow}Installing Python dependencies...${colors.reset}`);
    execSync(`${pythonCommand} -m pip install nltk pandas psycopg2-binary`, { stdio: 'inherit' });
    console.log(`${colors.green}✓ Python dependencies installed${colors.reset}`);

    // Generate mock data
    console.log(`\n${colors.yellow}Generating mock data...${colors.reset}`);
    execSync('cd backend && node scripts/generate_mock_data.js', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Mock data generated${colors.reset}`);

    // Create .env files if they don't exist
    createEnvFiles();

    console.log(`\n${colors.bright}${colors.green}Setup completed successfully!${colors.reset}`);
    console.log(`\n${colors.cyan}To start the application:${colors.reset}`);
    console.log(`1. Start the backend: ${colors.yellow}cd backend && npm run dev${colors.reset}`);
    console.log(`2. Start the frontend: ${colors.yellow}cd frontend && npm start${colors.reset}`);
    console.log(`\n${colors.cyan}The application will be available at:${colors.reset} http://localhost:3000`);

    rl.close();
  } catch (error) {
    console.error(`${colors.red}Error during setup: ${error.message}${colors.reset}`);
    rl.close();
    process.exit(1);
  }
}

// Create .env files with default values
function createEnvFiles() {
  // Backend .env
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  if (!fs.existsSync(backendEnvPath)) {
    const backendEnvContent = `PORT=5000
DB_HOST=localhost
DB_NAME=aquasutra
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=aquasutra_secret_key_change_in_production
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=aquasutra-media
`;
    fs.writeFileSync(backendEnvPath, backendEnvContent);
    console.log(`${colors.green}✓ Created backend .env file${colors.reset}`);
  }

  // Frontend .env
  const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
  if (!fs.existsSync(frontendEnvPath)) {
    const frontendEnvContent = `REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
`;
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log(`${colors.green}✓ Created frontend .env file${colors.reset}`);
  }
}

// Run setup
setup();