import { http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import mockDb from './mockDb.json';

function getTable<T>(tableName: string): T[] {
	if (!(mockDb as Record<string, unknown>)[tableName]) {
		(mockDb as Record<string, unknown>)[tableName] = [];
	}
	return (mockDb as Record<string, T[]>)[tableName];
}

function saveTable<T>(tableName: string, items: T[]) {
	(mockDb as Record<string, unknown>)[tableName] = items;
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