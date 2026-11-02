import { test, expect } from '@playwright/test';

test.describe('Admin CMS Access & Route Protection', () => {
  test('unauthenticated visitor accessing /admin is redirected to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator('h1, h2, form')).toBeVisible();
  });

  test('unauthenticated visitor accessing /admin/dashboard is redirected to login', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('login page displays clean form and no leaked default credentials', async ({ page }) => {
    await page.goto('/admin/login');
    const pageContent = await page.content();
    expect(pageContent).not.toContain('AdminPassword123!');

    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('submitting invalid credentials triggers authentication error', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"], input[name="email"]', 'wrong@admin.dev');
    await page.fill('input[type="password"], input[name="password"]', 'InvalidPassword123!');
    await page.click('button[type="submit"]');

    // Check for error banner or alert
    const errorText = page.locator('text=Invalid credentials, text=Unauthorized, .admin-alert, [role="alert"]');
    await expect(errorText.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Public Portfolio Experience', () => {
  test('home page renders hero and navigation correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.navbar, header')).toBeVisible();
    await expect(page.locator('.hero-section, #home')).toBeVisible();
  });

  test('projects section loads published projects', async ({ page }) => {
    await page.goto('/work');
    await expect(page.locator('.projects-grid, .work-container')).toBeVisible();
  });

  test('contact form is interactive and prevents empty submissions', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('form')).toBeVisible();
    await page.click('button[type="submit"]');
    // Browser HTML5 or custom validation should prevent empty dispatch
    await expect(page).toHaveURL(/\/contact/);
  });
});

