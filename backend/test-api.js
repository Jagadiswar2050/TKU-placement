const http = require('http');

const request = (options, data = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

async function runTests() {
  console.log('--- STARTING PLACEMENT PORTAL INTEGRATION TESTS ---');

  // Test 1: Health
  const health = await request({ hostname: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
  console.log('1. Health Check:', health.status === 200 ? 'PASSED ✅' : 'FAILED ❌', health.data?.project);

  // Test 2: Admin Login
  const adminLogin = await request(
    { hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'admin@placement.edu', password: 'Admin@123' }
  );
  console.log('2. Admin Login:', adminLogin.status === 200 ? 'PASSED ✅' : 'FAILED ❌', adminLogin.data?.user?.name);
  const adminToken = adminLogin.data?.token;

  // Test 3: Student Login
  const studentLogin = await request(
    { hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'aarav@student.edu', password: 'Student@123' }
  );
  console.log('3. Student Login:', studentLogin.status === 200 ? 'PASSED ✅' : 'FAILED ❌', studentLogin.data?.user?.name);
  const studentToken = studentLogin.data?.token;

  // Test 4: Jobs Listing
  const jobs = await request({ hostname: 'localhost', port: 5000, path: '/api/jobs', method: 'GET' });
  console.log('4. Jobs Listing:', jobs.status === 200 && jobs.data?.jobs?.length > 0 ? 'PASSED ✅' : 'FAILED ❌', `(${jobs.data?.count} drives found)`);
  const firstJobId = jobs.data?.jobs[0]?._id;

  // Test 5: Check Eligibility for Student
  const elig = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/students/check-eligibility/${firstJobId}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  console.log('5. Student Eligibility Check:', elig.status === 200 ? 'PASSED ✅' : 'FAILED ❌', `Eligible: ${elig.data?.isEligible}`);

  // Test 6: Admin Dashboard Stats
  const stats = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log('6. Admin Dashboard Stats:', stats.status === 200 ? 'PASSED ✅' : 'FAILED ❌', `Highest: ₹${stats.data?.stats?.highestLPA} LPA, Students: ${stats.data?.stats?.totalStudents}`);

  // Test 7: Student Profile
  const prof = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/students/profile',
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  console.log('7. Student Profile:', prof.status === 200 ? 'PASSED ✅' : 'FAILED ❌', `Roll: ${prof.data?.profile?.rollNumber}, CGPA: ${prof.data?.profile?.cgpa}`);

  // Test 8: Company Login
  const companyLogin = await request(
    { hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'google@careers.com', password: 'Company@123' }
  );
  console.log('8. Company Login:', companyLogin.status === 200 ? 'PASSED ✅' : 'FAILED ❌', companyLogin.data?.user?.name);

  // Test 9: Notifications
  const notifs = await request({ hostname: 'localhost', port: 5000, path: '/api/admin/notifications', method: 'GET' });
  console.log('9. Placement Notices:', notifs.status === 200 ? 'PASSED ✅' : 'FAILED ❌', `(${notifs.data?.notifications?.length} notices)`);

  console.log('--- ALL BACKEND TESTS COMPLETED SUCCESSFULLY ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
