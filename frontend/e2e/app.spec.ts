import { test, expect } from '@playwright/test';

test('shows landing page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Nexora AI').first()).toBeVisible();
  await expect(page.locator('text=Learn Smarter').first()).toBeVisible();
});

test('navigates to login', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Log In');
  await expect(page).toHaveURL(/\/login/);
});

test('navigates to register', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Get Started Free');
  await expect(page).toHaveURL(/\/register/);
});

test('login has form elements', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test('accessibility mode visible on landing', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Accessibility Mode').first()).toBeVisible();
});
