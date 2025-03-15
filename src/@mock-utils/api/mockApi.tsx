import { http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import mockDb from './mockDb.json';

// Define a type for our mock database
interface MockDatabase {
  [key: string]: any[];
}

function getTable<T>(tableName: string): T[] {
	// Use a proper type casting approach
	const db = mockDb as unknown as MockDatabase;
	if (!db[tableName]) {
		db[tableName] = [];
	}
	return db[tableName] as T[];
}

function saveTable<T>(tableName: string, items: T[]) {
	// Use a proper type casting approach
	const db = mockDb as unknown as MockDatabase;
	db[tableName] = items;
}

const mockApi = (tableName: string) => ({
	async create<T extends { id?: string }>(data: T) {
		const newItem = { ...data, id: data.id || uuidv4() };
		const table = getTable<T>(tableName);
		table.push(newItem);
		saveTable(tableName, table);
		return newItem;
	},
	
	async find<T>(idOrQuery: string | Record<string, any>) {
		const table = getTable<T>(tableName);
		
		if (typeof idOrQuery === 'string') {
			// Find by ID
			return table.find(item => (item as any).id === idOrQuery);
		} else {
			// Find by query parameters
			return table.find(item => {
				return Object.keys(idOrQuery).every(key => {
					return (item as any)[key] === idOrQuery[key];
				});
			});
		}
	},
	
	async update<T>(id: string, data: Partial<T>) {
		const table = getTable<T & { id: string }>(tableName);
		const index = table.findIndex(item => item.id === id);
		
		if (index !== -1) {
			const updatedItem = { ...table[index], ...data };
			table[index] = updatedItem;
			saveTable(tableName, table);
			return updatedItem;
		}
		
		throw new Error(`Item with id ${id} not found`);
	},
	
	async delete<T>(id: string) {
		const table = getTable<T & { id: string }>(tableName);
		const index = table.findIndex(item => item.id === id);
		
		if (index !== -1) {
			const deletedItem = table[index];
			table.splice(index, 1);
			saveTable(tableName, table);
			return deletedItem;
		}
		
		throw new Error(`Item with id ${id} not found`);
	},
	
	async getAll<T>() {
		return getTable<T>(tableName);
	}
});

export const handlers = [
	http.get('/api/example', () => {
		return HttpResponse.json({ message: 'Example response' });
	}),
	
	http.post('/api/login', async ({ request }) => {
		const data = await request.json() as { email: string; password: string };
		// Your login logic...
		return HttpResponse.json({ token: 'mock-token' });
	}),
  
	http.get('/api/mock/users', () => {
		const users = getTable('users');
		return HttpResponse.json(users);
	}),
	
	http.post('/api/mock/users', async ({ request }) => {
		const newUser = await request.json();
		// Add explicit type assertion to match the expected interface
		const createdUser = await mockApi('users').create(newUser as { id?: string });
		return HttpResponse.json(createdUser);
	})
];

export default mockApi;