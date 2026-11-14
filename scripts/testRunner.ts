/* eslint-disable */
import {
  normalizeIndianPhone,
  validateCustomerRegistration,
  createCustomer,
  findCustomerByPhone,
  updateCustomer,
} from '../src/lib/customerStore.ts';
import {
  sendCustomerOtp,
  verifyCustomerOtp,
  getTestOtpForPhone,
} from '../src/lib/otpService.ts';
import {
  createSessionToken,
  verifySessionToken,
} from '../src/lib/auth.ts';
import {
  authenticateAdmin,
  OFFICIAL_ADMIN_EMAIL,
  getAdminByEmail,
} from '../src/lib/adminStore.ts';

async function runTestSuite() {
  console.log('====================================================');
  console.log('ROYAL KORUTLA - AUTHENTICATION & SERVICES TEST SUITE');
  console.log('====================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName} - ${detail || 'Assertion failed'}`);
      failedTests++;
    }
  }

  // --- Test 8: Invalid mobile number normalization & validation ---
  console.log('--- Test Suite 8: Indian Mobile Number Normalization & Validation ---');
  const validNum1 = normalizeIndianPhone('9876543210');
  assert(validNum1.isValid && validNum1.normalized === '+919876543210', 'Normalize 10-digit number (9876543210)');

  const validNum2 = normalizeIndianPhone('+91 94401 23456');
  assert(validNum2.isValid && validNum2.normalized === '+919440123456', 'Normalize +91 prefixed with spaces');

  const validNum3 = normalizeIndianPhone('09123456789');
  assert(validNum3.isValid && validNum3.normalized === '+919123456789', 'Normalize 11-digit leading 0 number');

  const invalidNumShort = normalizeIndianPhone('98765');
  assert(!invalidNumShort.isValid, 'Reject short number (< 10 digits)');

  const invalidNumBadPrefix = normalizeIndianPhone('2345678901');
  assert(!invalidNumBadPrefix.isValid, 'Reject number starting with non-mobile digit (2)');

  const invalidNumLetters = normalizeIndianPhone('98480abcde');
  assert(!invalidNumLetters.isValid, 'Reject number with letters');

  // --- Test 9: Ward selection for Korutla residents ---
  console.log('\n--- Test Suite 9: Ward Selection for Korutla Users ---');
  const validWardRes = validateCustomerRegistration({
    name: 'Suresh Kumar',
    phone: '9848011223',
    userType: 'KORUTLA_RESIDENT',
    wardNumber: 15,
  });
  assert(validWardRes.isValid && validWardRes.cleanedData?.wardNumber === 15, 'Valid Korutla Ward 15 accepted');

  const invalidWardZero = validateCustomerRegistration({
    name: 'Suresh Kumar',
    phone: '9848011223',
    userType: 'KORUTLA_RESIDENT',
    wardNumber: 0,
  });
  assert(!invalidWardZero.isValid && !!invalidWardZero.errors.wardNumber, 'Reject Ward 0 (valid range is 1-33)');

  const invalidWardHigh = validateCustomerRegistration({
    name: 'Suresh Kumar',
    phone: '9848011223',
    userType: 'KORUTLA_RESIDENT',
    wardNumber: 34,
  });
  assert(!invalidWardHigh.isValid && !!invalidWardHigh.errors.wardNumber, 'Reject Ward 34 (> 33 wards in Korutla)');

  // --- Test 10: Village field for non-local users ---
  console.log('\n--- Test Suite 10: Village Field for Non-Local Users ---');
  const validVillageRes = validateCustomerRegistration({
    name: 'Ravi Teja',
    phone: '9848011224',
    userType: 'NON_LOCAL',
    villageName: 'Medipally',
  });
  assert(validVillageRes.isValid && validVillageRes.cleanedData?.villageName === 'Medipally', 'Valid non-local village accepted');

  const invalidVillageEmpty = validateCustomerRegistration({
    name: 'Ravi Teja',
    phone: '9848011224',
    userType: 'NON_LOCAL',
    villageName: '',
  });
  assert(!invalidVillageEmpty.isValid && !!invalidVillageEmpty.errors.villageName, 'Reject empty village name for non-local');

  // --- Test 1 & 2: New user registration & Correct OTP verification ---
  console.log('\n--- Test Suite 1 & 2: New User Registration & Correct OTP Verification ---');
  const testPhone = '+919988776655';
  const sendRes = await sendCustomerOtp({
    phone: testPhone,
    purpose: 'register',
    registrationData: {
      name: 'Naveen Chary',
      userType: 'KORUTLA_RESIDENT',
      wardNumber: 7,
      villageName: null,
    },
  });
  assert(sendRes.success, 'OTP dispatched for new registration');

  const generatedOtp = getTestOtpForPhone(testPhone);
  assert(typeof generatedOtp === 'string' && generatedOtp.length === 6, 'Valid 6-digit OTP generated on server');

  const verifySuccess = verifyCustomerOtp({
    phone: testPhone,
    otp: generatedOtp || '123456',
    purpose: 'register',
  });
  assert(verifySuccess.success && verifySuccess.pendingRegistrationData?.name === 'Naveen Chary', 'Correct OTP verified successfully');

  const newCustomer = createCustomer({
    name: verifySuccess.pendingRegistrationData!.name,
    phone: testPhone,
    userType: verifySuccess.pendingRegistrationData!.userType,
    wardNumber: verifySuccess.pendingRegistrationData!.wardNumber,
    villageName: verifySuccess.pendingRegistrationData!.villageName,
  });
  assert(newCustomer.id.startsWith('cust-') && newCustomer.phone === testPhone, 'New customer created in store');

  // --- Test 3: Wrong and expired OTP ---
  console.log('\n--- Test Suite 3: Wrong & Expired OTP Enforcement ---');
  const testPhoneWrong = '+919988776644';
  await sendCustomerOtp({ phone: testPhoneWrong, purpose: 'login' });
  const wrongAttempt1 = verifyCustomerOtp({ phone: testPhoneWrong, otp: '000000', purpose: 'login' });
  assert(!wrongAttempt1.success && wrongAttempt1.attemptsLeft === 2, 'Wrong OTP decrements attempt count (2 left)');

  const wrongAttempt2 = verifyCustomerOtp({ phone: testPhoneWrong, otp: '000000', purpose: 'login' });
  assert(!wrongAttempt2.success && wrongAttempt2.attemptsLeft === 1, 'Second wrong OTP decrements attempt count (1 left)');

  const wrongAttempt3 = verifyCustomerOtp({ phone: testPhoneWrong, otp: '000000', purpose: 'login' });
  assert(!wrongAttempt3.success && wrongAttempt3.error === 'MAX_ATTEMPTS_EXCEEDED', 'Max attempts exceeded invalidates OTP');

  // Verify non-existent / expired OTP
  const nonExistent = verifyCustomerOtp({ phone: testPhoneWrong, otp: '123456', purpose: 'login' });
  assert(!nonExistent.success && (nonExistent.error === 'OTP_NOT_FOUND' || nonExistent.error === 'MAX_ATTEMPTS_EXCEEDED'), 'No active OTP after invalidation');

  // --- Test 4: Duplicate registration prevention ---
  console.log('\n--- Test Suite 4: Duplicate Registration Prevention ---');
  let duplicateThrew = false;
  try {
    createCustomer({
      name: 'Duplicate Naveen',
      phone: testPhone, // already registered above
      userType: 'KORUTLA_RESIDENT',
      wardNumber: 7,
    });
  } catch (err: unknown) {
    duplicateThrew = true;
  }
  assert(duplicateThrew, 'Prevent duplicate account creation for already verified phone number');

  // --- Test 5: Existing user with valid session ---
  console.log('\n--- Test Suite 5: Returning User with Valid Session Token ---');
  const sessionToken = createSessionToken({
    id: newCustomer.id,
    name: newCustomer.name,
    email: '',
    role: 'CUSTOMER',
    phone: newCustomer.phone,
    userType: newCustomer.userType,
    wardNumber: newCustomer.wardNumber,
    createdAt: newCustomer.createdAt,
  });
  assert(typeof sessionToken === 'string' && sessionToken.split('.').length === 3, 'Create valid signed JWT session token');

  const decodedSession = verifySessionToken(sessionToken);
  assert(decodedSession !== null && decodedSession.phone === testPhone && decodedSession.role === 'CUSTOMER', 'Decode session token without re-prompting OTP');

  // --- Test 6: Existing user on a new device ---
  console.log('\n--- Test Suite 6: Existing User on a New Device ---');
  // New device has no cookie. User inputs verified phone, requests OTP, and signs in.
  const existingCust = findCustomerByPhone(testPhone);
  assert(existingCust !== null, 'Recognize existing user by verified mobile number');

  await sendCustomerOtp({ phone: testPhone, purpose: 'login' });
  const loginOtp = getTestOtpForPhone(testPhone);
  assert(typeof loginOtp === 'string', 'Dispatch OTP for existing user on new device');

  const loginVerify = verifyCustomerOtp({ phone: testPhone, otp: loginOtp || '', purpose: 'login' });
  assert(loginVerify.success, 'Verify OTP for existing user on new device grants access');

  // --- Test 7: Logout and session expiry ---
  console.log('\n--- Test Suite 7: Logout and Session Expiry ---');
  // Expired token test
  const expiredToken = sessionToken.replace(/\.[^.]*$/, '') + '.invalidsig';
  // Let's test with forged or malformed signature
  const forged = verifySessionToken(expiredToken);
  assert(forged === null || (forged && forged.id !== newCustomer.id), 'Reject forged/tampered session token');

  const nullTokenCheck = verifySessionToken(null);
  assert(nullTokenCheck === null, 'Verify null token (logged out state) returns null');

  // --- Test 11: OTP resend and rate limiting ---
  console.log('\n--- Test Suite 11: Resend Cooldown and Rate Limiting ---');
  const ratePhone = '+919440998877';
  const firstSend = await sendCustomerOtp({ phone: ratePhone, purpose: 'login' });
  assert(firstSend.success, 'Initial OTP dispatch succeeds');

  const immediateResend = await sendCustomerOtp({ phone: ratePhone, purpose: 'login' });
  assert(!immediateResend.success && immediateResend.error === 'COOLDOWN_ACTIVE', 'Immediate resend blocked by 60s cooldown');

  // --- Test 4 (Phase 4): Profile update & mobile change protection ---
  console.log('\n--- Test Suite Phase 4: User Profile Updates & Mobile Change ---');
  const updatedCust = updateCustomer(newCustomer.id, {
    name: 'Naveen Chary (Updated)',
    wardNumber: 18,
  });
  assert(updatedCust !== null && updatedCust.name === 'Naveen Chary (Updated)' && updatedCust.wardNumber === 18, 'Update customer profile name and ward');

  // Verify another customer cannot take this phone
  let changePhoneDuplicateThrew = false;
  try {
    const cust2 = createCustomer({
      name: 'Customer Two',
      phone: '+919111222333',
      userType: 'KORUTLA_RESIDENT',
      wardNumber: 3,
    });
    updateCustomer(cust2.id, { phone: testPhone }); // attempting to steal testPhone
  } catch {
    changePhoneDuplicateThrew = true;
  }
  assert(changePhoneDuplicateThrew, 'Prevent changing phone to already registered mobile number');

  // --- Test Suite: Official Admin Authentication ---
  console.log('\n--- Test Suite: Official Admin Authentication ---');
  const adminAuth = authenticateAdmin('royalkorutla.in@gmail.com', 'RoyalKorutla');
  assert(adminAuth.success && adminAuth.user?.email === 'royalkorutla.in@gmail.com' && adminAuth.user?.role === 'SUPER_ADMIN', 'Authenticate official admin email (royalkorutla.in@gmail.com)');

  const adminCaseInsensitive = authenticateAdmin('ROYALKORUTLA.IN@GMAIL.COM', 'RoyalKorutla');
  assert(adminCaseInsensitive.success, 'Authenticate admin with uppercase email');

  const adminWrongPass = authenticateAdmin('royalkorutla.in@gmail.com', 'WrongPassword123');
  assert(!adminWrongPass.success && adminWrongPass.error === 'INVALID_CREDENTIALS', 'Reject admin login with wrong password');

  const nonAdminLogin = authenticateAdmin('unauthorized.user@example.com', 'RoyalKorutla');
  assert(!nonAdminLogin.success && nonAdminLogin.error === 'INVALID_CREDENTIALS', 'Reject non-admin email from admin login');

  if (adminAuth.user) {
    const adminSessionToken = createSessionToken({
      id: adminAuth.user.id,
      name: adminAuth.user.name,
      email: adminAuth.user.email,
      role: adminAuth.user.role,
      createdAt: adminAuth.user.created_at,
    });
    const verifiedAdmin = verifySessionToken(adminSessionToken);
    assert(verifiedAdmin !== null && verifiedAdmin.email === 'royalkorutla.in@gmail.com' && verifiedAdmin.role === 'SUPER_ADMIN', 'Create and verify valid signed JWT token for admin');
  }

  console.log('\n====================================================');
  console.log(`TEST SUITE RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test Suite Fatal Error:', err);
  process.exit(1);
});
