// src/@mock-utils/mockApi.tsx
import { http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";

// Use inline mockDb instead of importing from JSON file
const mockDb = {
  users: [
    {
      id: "XTCy4vK6qLT1PxBQQB9W",
      role: ["admin"],
      displayName: "Admin User",
      photoURL: "/assets/images/avatars/Abbott.jpg",
      email: "admin@example.com",
      password: "admin",
      settings: {},
      shortcuts: []
    }
  ]
};

function getTable(tableName) {
  if (!mockDb[tableName]) {
    mockDb[tableName] = [];
  }
  return mockDb[tableName];
}

function saveTable(tableName, items) {
  mockDb[tableName] = items;
}

const mockApi = (tableName) => ({
  async create(data) {
    const newItem = {
      ...data,
      id: data.id || uuidv4()
    };
    const table = getTable(tableName);
    table.push(newItem);
    saveTable(tableName, table);
    return newItem;
  },
  async find(idOrQuery) {
    // ... existing implementation
  },
  async update(id, data) {
    // ... existing implementation
  },
  async delete(id) {
    // ... existing implementation
  },
  async getAll() {
    return getTable(tableName);
  }
});

export const handlers = [
  // ... existing handlers
];

// Make sure to add this default export
export default mockApi;