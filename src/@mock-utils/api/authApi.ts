import FuseUtils from '@fuse/utils';
import Base64 from 'crypto-js/enc-base64';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Utf8 from 'crypto-js/enc-utf8';
import jwtDecode from 'jwt-decode';
import { PartialDeep } from 'type-fest';
import UserModel from '@auth/user/models/UserModel';
import { User } from '@auth/user';
import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

type UserAuthType = User & { password: string };

// ✅ Setup JWT Secret Key
const JWT_SECRET = 'some-secret-code-goes-here';

// ✅ Helper: Base64 URL Encoding
function base64url(source: CryptoJS.lib.WordArray) {
	let encoded = Base64.stringify(source);
	return encoded.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// ✅ Generate JWT Token
function generateJWTToken(payload: Record<string, unknown>) {
	const iat = Math.floor(Date.now() / 1000);
	const exp = iat + 7 * 24 * 60 * 60; // 7 days

	const header = base64url(Utf8.parse(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
	const body = base64url(Utf8.parse(JSON.stringify({ iat, iss: 'Fuse', exp, ...payload })));
	const signature = base64url(HmacSHA256(`${header}.${body}`, JWT_SECRET));

	return `${header}.${body}.${signature}`;
}

// ✅ Verify JWT Token
function verifyJWTToken(token: string): boolean {
	const parts = token.split('.');
	if (parts.length !== 3) return false;

	const [header, body, signature] = parts;
	const expectedSignature = base64url(HmacSHA256(`${header}.${body}`, JWT_SECRET));

	return signature === expectedSignature;
}

// ✅ Generate Access Token
async function generateAccessToken(request: Request): Promise<{ access_token: string; user: User } | null> {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

	const token = authHeader.split(' ')[1];
	if (!verifyJWTToken(token)) return null;

	const { id }: { id: string } = jwtDecode(token);
	const user = await mockApi('users').find(id) as User | undefined;

	if (user) {
		delete user.password;
		return { access_token: generateJWTToken({ id: user.id }), user };
	}

	return null;
}

// ✅ Mock Authentication API
const authApi = [
	http.post('/api/mock/auth/refresh', async ({ request }) => {
		const tokenData = await generateAccessToken(request);
		if (tokenData) {
			return HttpResponse.json(null, { status: 200, headers: { 'New-Access-Token': tokenData.access_token } });
		}
		return HttpResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
	}),

	http.get('/api/mock/auth/sign-in-with-token', async ({ request }) => {
		const tokenData = await generateAccessToken(request);
		if (tokenData) {
			return HttpResponse.json(tokenData.user, { status: 200, headers: { 'New-Access-Token': tokenData.access_token } });
		}
		return HttpResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
	}),

	http.post('/api/mock/auth/sign-in', async ({ request }) => {
		const api = mockApi('users');
		const { email, password } = await request.json() as { email: string; password: string };

		const user = await api.find({ email }) as UserAuthType | undefined;
		if (!user || user.password !== password) {
			return HttpResponse.json({ error: 'Invalid email or password' }, { status: 401 });
		}

		delete user.password;
		const access_token = generateJWTToken({ id: user.id });

		return HttpResponse.json({ user, access_token }, { status: 200 });
	}),

	http.post('/api/mock/auth/sign-up', async ({ request }) => {
		const api = mockApi('users');
		const { displayName, password, email } = await request.json() as { displayName: string; password: string; email: string };

		if (await api.find({ email })) {
			return HttpResponse.json({ error: 'Email already exists' }, { status: 400 });
		}

		const newUser = UserModel({ role: ['admin'], displayName, photoURL: '/assets/images/avatars/Abbott.jpg', email, shortcuts: [], settings: {} });
		newUser.id = FuseUtils.generateGUID();
		newUser.password = password;

		const createdUser = await api.create(newUser);
		delete createdUser.password;
		const access_token = generateJWTToken({ id: createdUser.id });

		return HttpResponse.json({ user: createdUser, access_token }, { status: 201 });
	}),

	http.get('/api/mock/auth/user/:id', async ({ params }) => {
		const user = await mockApi('users').find(params.id as string);
		return user ? HttpResponse.json(user) : HttpResponse.json({ error: 'User not found' }, { status: 404 });
	}),

	http.get('/api/mock/auth/user-by-email/:email', async ({ params }) => {
		const user = await mockApi('users').find({ email: params.email });
		return user ? HttpResponse.json(user) : HttpResponse.json({ error: 'User not found' }, { status: 404 });
	}),

	http.put('/api/mock/auth/user/:id', async ({ params, request }) => {
		const data = await request.json() as { user: PartialDeep<UserAuthType> };
		const updatedUser = await mockApi('users').update(params.id as string, data);

		if (!updatedUser) {
			return HttpResponse.json({ error: 'User update failed' }, { status: 400 });
		}

		delete (updatedUser as Partial<UserAuthType>).password;
		return HttpResponse.json(updatedUser);
	})
];

export default authApi;
