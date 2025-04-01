import { test, expect } from '@playwright/test';

test.describe('User Journey', () => {
  test('complete ordering flow', async ({ page }) => {
    // Start from homepage
    await page.goto('/');
    
    // Navigate to demo
    await page.getByText(/try bff demo/i).click();
    
    // Wait for chat interface
    await expect(page.getByText(/ai food assistant/i)).toBeVisible();
    
    // Start conversation
    const input = page.getByPlaceholder(/ask about our menu/i);
    await input.fill('Show me your menu');
    await page.getByRole('button').click();
    
    // Verify menu response
    await expect(page.getByText(/here are our popular dishes/i)).toBeVisible();
    
    // Select a dish
    await input.fill('I want a steak');
    await page.getByRole('button').click();
    
    // Verify dish details
    await expect(page.getByText(/ribeye/i)).toBeVisible();
    
    // Add customization
    await input.fill('Make it medium rare');
    await page.getByRole('button').click();
    
    // Complete order
    await expect(page.getByText(/would you like to confirm your order/i)).toBeVisible();
    await input.fill('Yes, confirm my order');
    await page.getByRole('button').click();
    
    // Verify order confirmation
    await expect(page.getByText(/order confirmed/i)).toBeVisible();
  });
});