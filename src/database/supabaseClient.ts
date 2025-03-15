import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

// Initialize Supabase client
export const supabase = createClient(
  configService.get<string>('SUPABASE_URL'),
  configService.get<string>('SUPABASE_KEY')
);
