const http = require('http');

function request(path, method, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8500,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function testAuth() {
    try {
        console.log('1. Registering user...');
        const registerRes = await request('/api/auth/register', 'POST', {
            name: 'Test Auth User',
            email: 'auth_test_' + Date.now() + '@example.com',
            password: 'password123',
        });
        console.log('Register:', registerRes.statusCode, registerRes.body);
        const email = registerRes.body.email;

        console.log('\n2. Logging in...');
        const loginRes = await request('/api/auth/login', 'POST', {
            email: email,
            password: 'password123',
        });
        console.log('Login:', loginRes.statusCode, loginRes.body.token ? 'Token received' : 'No token');

        console.log('\n3. Forgot Password...');
        const forgotRes = await request('/api/auth/forgot-password', 'POST', {
            email: email,
        });
        console.log('Forgot Password:', forgotRes.statusCode, forgotRes.body);

        const resetToken = forgotRes.body.resetToken;

        if (resetToken) {
            console.log('\n4. Reset Password...');
            const resetRes = await request('/api/auth/reset-password', 'POST', {
                token: resetToken,
                newPassword: 'newpassword456',
            });
            console.log('Reset Password:', resetRes.statusCode, resetRes.body);

            console.log('\n5. Login with new password...');
            const newLoginRes = await request('/api/auth/login', 'POST', {
                email: email,
                password: 'newpassword456',
            });
            console.log('New Login:', newLoginRes.statusCode, newLoginRes.body);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testAuth();
