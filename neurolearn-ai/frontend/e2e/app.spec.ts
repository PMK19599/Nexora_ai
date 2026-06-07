import { test, expect } from '@playwright/test';

test('shows landing page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=NeuroLearn AI')).toBeVisible();
  await expect(page.locator('text=Learn Smarter')).toBeVisible();
});

test('navigates to login', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Log In');
  await expect(page).toHaveURL('/login');
});

test('navigates to register', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Get Started');
  await expect(page).toHaveURL('/register');
});

test('login has form elements', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('#email')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
});

test('accessibility mode visible on landing', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Accessibility-First Mode')).toBeVisible();
});
