# Enable Execution Policy (Run as Admin if needed)
Set-ExecutionPolicy Unrestricted -Scope Process -Force

Write-Host "Setting up Supabase for NestJS Backend..."

# Install Required Dependencies
Write-Host "Installing dependencies..."
npm install @supabase/supabase-js @nestjs/config @nestjs/typeorm pg dotenv passport passport-jwt --save

# Create Required Folders
Write-Host "Creating necessary folders..."
New-Item -Path "src/database" -ItemType Directory -Force
New-Item -Path "src/auth" -ItemType Directory -Force

# Create .env File with Supabase Connection String
Write-Host "Setting up .env file..."
$envPath = ".\.env"
if (!(Test-Path $envPath)) {
    @"
SUPABASE_URL=https://upblvroxlblovjmpitzn.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwYmx2cm94bGJsb3ZqbXBpdHpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDkwNzkxMywiZXhwIjoyMDU2NDgzOTEzfQ.k6AR595HA32Enel4wSB2nctLEJjWoFYgOMCqVDaaLdE
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.upblvroxlblovjmpitzn.supabase.co:5432/postgres
DB_HOST=db.upblvroxlblovjmpitzn.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASS=Otobale@1996Marathon
DB_NAME=postgres
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwYmx2cm94bGJsb3ZqbXBpdHpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDkwNzkxMywiZXhwIjoyMDU2NDgzOTEzfQ.k6AR595HA32Enel4wSB2nctLEJjWoFYgOMCqVDaaLdE
"@ | Set-Content -Path $envPath
    Write-Host ".env file created with Supabase connection string."
} else {
    Write-Host ".env file already exists. Skipping..."
}

# Create Supabase Client File
Write-Host "Creating Supabase client file..."
$supabaseClientPath = "src/database/supabaseClient.ts"
@"
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

// Initialize Supabase client
export const supabase = createClient(
  configService.get<string>('SUPABASE_URL'),
  configService.get<string>('SUPABASE_KEY')
);
"@ | Set-Content -Path $supabaseClientPath

Write-Host "Supabase client file created."

# Create Test Database Connection in main.ts
Write-Host "Modifying src/main.ts for connection test..."
$mainTsPath = "src/main.ts"
@"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { supabase } from './database/supabaseClient';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  // Test Supabase Connection
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) console.error('Supabase Connection Error:', error);
  else console.log('Supabase Connected:", data);
}

bootstrap();
"@ | Set-Content -Path $mainTsPath

Write-Host "Database connection test added."

# Start NestJS
Write-Host "Starting NestJS application..."
npm run start:dev
