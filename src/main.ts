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
