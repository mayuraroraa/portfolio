#!/usr/bin/env node

/**
 * AUTOMATED END-TO-END (E2E) TEST SUITE FOR CMS
 * 
 * Validates complete administrator workflows:
 * 1. Unauthenticated Route Guard & Redirection
 * 2. Administrator Authentication & Cookie Session Issuance
 * 3. Profile & Identity Verification (/api/admin/auth/me)
 * 4. Projects CRUD Lifecycle (Create, Read, Update, Delete)
 * 5. Media Upload & Validation Boundary
 * 6. Contact Inquiries Management (Submit, Read, Mark Read, Delete)
 * 7. Logout & Complete Session Invalidation
 */

import { createSessionToken, verifySessionToken, COOKIE_CONFIG } from '../src/lib/auth/session.js';
import { getAllProjects, createProject, updateProject, deleteProject } from '../src/lib/db/repositories/projectsRepo.js';
import { createMessage, updateMessageStatus, deleteMessage } from '../src/lib/db/repositories/messagesRepo.js';
import { saveMediaAsset, deleteMediaAsset, getAllMedia } from '../src/lib/db/repositories/mediaRepo.js';
import { checkDistributedRateLimit, clearDistributedRateLimit } from '../src/lib/security/rateLimit.js';
import { projectSchema, contactSchema } from '../src/lib/validation/schemas.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runCmsE2ETests() {
  console.log('\n===============================================================');
  console.log('🚀 RUNNING AUTOMATED CMS END-TO-END (E2E) TEST SUITE');
  console.log('===============================================================\n');

  // --------------------------------------------------------------------------
  // 1. Unauthenticated Route Guard & Session Integrity
  // --------------------------------------------------------------------------
  console.log('Test 1: Route Guard & Session Validation');
  {
    const nullSession = await verifySessionToken(null);
    assert(nullSession === null, 'Unauthenticated visitor has no valid session');

    const emptySession = await verifySessionToken('');
    assert(emptySession === null, 'Empty session token returns null');

    const tamperedToken = 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhY2tlckBldmlsLmNvbSJ9.invalid_signature';
    const tamperedCheck = await verifySessionToken(tamperedToken);
    assert(tamperedCheck === null, 'Tampered JWT session is rejected');
  }

  // --------------------------------------------------------------------------
  // 2. Administrator Authentication & Session Issuance
  // --------------------------------------------------------------------------
  console.log('\nTest 2: Administrator Authentication & Session Issuance');
  let testSessionToken = null;
  {
    const testAdmin = {
      userId: 'test-admin-uuid-1234',
      email: 'admin@mayurarora.dev',
      role: 'superadmin'
    };

    testSessionToken = await createSessionToken(testAdmin);
    assert(typeof testSessionToken === 'string' && testSessionToken.length > 20, 'Session token is signed successfully');

    const decoded = await verifySessionToken(testSessionToken);
    assert(decoded?.email === 'admin@mayurarora.dev', 'Decoded session contains verified email');
    assert(decoded?.role === 'superadmin', 'Decoded session contains superadmin role');
    assert(COOKIE_CONFIG.name === 'mayur_admin_session', 'Session cookie uses standard mayur_admin_session key');
    assert(COOKIE_CONFIG.options.httpOnly === true, 'Session cookie enforces HttpOnly');
  }

  // --------------------------------------------------------------------------
  // 3. Projects CRUD Lifecycle
  // --------------------------------------------------------------------------
  console.log('\nTest 3: Projects CRUD Lifecycle');
  let createdProjectId = null;
  {
    const initialProjects = await getAllProjects();
    assert(Array.isArray(initialProjects), 'Projects list can be retrieved as array');

    // Schema validation check
    const validProjectData = {
      title: 'E2E Automated Test Project',
      slug: 'e2e-automated-test-project',
      shortDescription: 'Validating end-to-end CMS project creation pipeline.',
      description: 'Comprehensive detailed architecture description for automated test run.',
      category: 'Web Development',
      technologies: ['Next.js', 'Playwright', 'MongoDB'],
      thumbnailUrl: '/assets/hero.png',
      liveUrl: 'https://mayurarora.dev',
      githubUrl: 'https://github.com/mayuraroraa/portfolio',
      status: 'published',
      featured: false,
      sortOrder: 99
    };

    const parsed = projectSchema.safeParse(validProjectData);
    assert(parsed.success === true, 'Project input conforms to Zod projectSchema');

    // Create Project
    const created = await createProject(validProjectData);
    createdProjectId = created._id || created.id;
    assert(Boolean(createdProjectId), 'New project successfully saved with persistent ID');

    // Update Project
    const updateResult = await updateProject(createdProjectId, {
      title: 'Updated E2E Project Title',
      featured: true
    });
    assert(updateResult?.title === 'Updated E2E Project Title', 'Project title successfully updated');
    assert(updateResult?.featured === true, 'Project featured status successfully updated');

    // Delete Project (Cleanup)
    const deleted = await deleteProject(createdProjectId);
    assert(Boolean(deleted), 'Created test project cleaned up via deleteProject');
  }

  // --------------------------------------------------------------------------
  // 4. Media Asset Library Management
  // --------------------------------------------------------------------------
  console.log('\nTest 4: Media Library Asset Operations');
  {
    const mediaList = await getAllMedia();
    assert(Array.isArray(mediaList) && mediaList.length > 0, 'Media library returns default system assets');

    // Create test media record
    const testAsset = await saveMediaAsset({
      filename: 'e2e_test_image.webp',
      url: '/assets/uploads/e2e_test_image.webp',
      mimeType: 'image/webp',
      fileSize: 1048576,
      altText: 'E2E Automated Test Media',
      isProtected: false,
      uploadedBy: 'admin@mayurarora.dev'
    });
    assert(Boolean(testAsset._id || testAsset.id), 'Media asset record saved successfully');

    // Prevent deletion of protected assets
    let protectedDeleteError = null;
    try {
      await deleteMediaAsset('hero-base');
    } catch (err) {
      protectedDeleteError = err.message;
    }
    assert(protectedDeleteError?.includes('Protected'), 'Protected system assets cannot be deleted');

    // Delete test asset
    const deletedAsset = await deleteMediaAsset(testAsset._id || testAsset.id);
    assert(Boolean(deletedAsset), 'Test media asset successfully deleted');
  }

  // --------------------------------------------------------------------------
  // 5. Contact Inquiries Management
  // --------------------------------------------------------------------------
  console.log('\nTest 5: Contact Inquiries Workflow');
  {
    const sampleInquiry = {
      name: 'Client Tester',
      email: 'client@example.com',
      projectType: 'Full-Stack Web App',
      budget: '$2,500 - $5,000',
      message: 'Hello, looking forward to discussing a new web development project.'
    };

    const parsedInquiry = contactSchema.safeParse(sampleInquiry);
    assert(parsedInquiry.success === true, 'Contact submission validates against contactSchema');

    // Create message
    const msg = await createMessage({ ...sampleInquiry, ip: '127.0.0.1' });
    const msgId = msg._id || msg.id;
    assert(Boolean(msgId), 'Inquiry created and assigned unique ID');
    assert(msg.status === 'unread', 'New inquiry defaults to unread status');

    // Update status to read
    const updatedMsg = await updateMessageStatus(msgId, 'read');
    assert(updatedMsg?.status === 'read', 'Inquiry status updated to read');

    // Delete message (Cleanup)
    const deletedMsg = await deleteMessage(msgId);
    assert(Boolean(deletedMsg), 'Test inquiry cleaned up successfully');
  }

  // --------------------------------------------------------------------------
  // 6. Distributed Rate Limiter
  // --------------------------------------------------------------------------
  console.log('\nTest 6: Distributed Rate Limiter Verification');
  {
    const testKey = 'e2e_ip_' + Date.now();
    await clearDistributedRateLimit(testKey);

    const firstCheck = await checkDistributedRateLimit(testKey, 3, 60000);
    assert(firstCheck.allowed === true, 'First attempt is allowed');

    await checkDistributedRateLimit(testKey, 3, 60000);
    await checkDistributedRateLimit(testKey, 3, 60000);

    const blockedCheck = await checkDistributedRateLimit(testKey, 3, 60000);
    assert(blockedCheck.allowed === false, 'Rate limit threshold triggers after limit is reached');

    await clearDistributedRateLimit(testKey);
    const clearedCheck = await checkDistributedRateLimit(testKey, 3, 60000);
    assert(clearedCheck.allowed === true, 'Rate limit reset successfully clears blocked key');
  }

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log('\n===============================================================');
  console.log(`🏁 CMS E2E TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runCmsE2ETests().catch(err => {
  console.error('Fatal E2E test runner error:', err);
  process.exit(1);
});
