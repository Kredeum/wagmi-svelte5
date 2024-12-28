import { expect, test } from "@playwright/test";

test.describe("Notification Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the notification page before each test
    await page.goto("/notification");
  });

  test("should display notification when clicking the button", async ({ page }) => {
    // Find and click the notification button
    const notifButton = page.getByRole("button", { name: "Notif" });
    await expect(notifButton).toBeVisible();
    await notifButton.click();

    // Wait for and verify the notification appears
    const notification = page.getByText("Notification!");
    await expect(notification).toBeVisible();

    // Verify the notification has the correct styles (info type)
    const notificationContainer = page.locator('[role="status"].notification-info');
    await expect(notificationContainer).toBeVisible();
    await expect(notificationContainer).toHaveClass(/top-0/);

    // Wait for notification to disappear (default timeout is 3000ms)
    await expect(notification).toBeHidden({ timeout: 5000 });
  });

  test("notification should have correct position", async ({ page }) => {
    // Click the notification button
    await page.getByRole("button", { name: "Notif" }).click();

    // Get the notification container
    const notificationContainer = page.locator('[role="status"].notification-info');

    // Verify it appears at the top-center (default position)
    await expect(notificationContainer).toHaveClass(/top-0/);
  });

  test("should handle multiple notifications", async ({ page }) => {
    // Click the button multiple times
    const button = page.getByRole("button", { name: "Notif" });
    await button.click();
    await button.click();
    await button.click();

    // Verify multiple notifications are visible
    const notifications = page.locator('[role="status"].notification-info');
    await expect(notifications).toHaveCount(3);

    // Wait for all notifications to disappear
    await expect(notifications).toHaveCount(0, { timeout: 5000 });
  });
});
