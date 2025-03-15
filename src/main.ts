import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { supabase } from './database/supabaseClient';

async function bootstrap() {
	try {
		const app = await NestFactory.create(AppModule);
		const PORT = process.env.PORT || 3000;

		await app.listen(PORT);
		console.info(`✅ NestJS Server Running on http://localhost:${PORT}`);

		// ✅ Test Supabase Connection
		const { data, error } = await supabase.from('users').select('*').limit(1);

		if (error) {
			console.error('❌ Supabase Connection Error:', error.message);
			process.exit(1); // Exit if Supabase is not connected
		} else {
			console.info('✅ Supabase Connected:', data);
		}
	} catch (err) {
		console.error('❌ Fatal Error:', err);
		process.exit(1); // Ensures app exits on failure
	}
}

bootstrap();
