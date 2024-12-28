import { expect, test } from "@playwright/test";

test("home page diplays 'Tests'", async ({ page }) => {
  await page.goto("/");
  const h1 = page.locator("h1");
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText("Tests");
});

test("connect button should be visible and clickable", async ({ page }) => {
  await page.goto("/");

  // Wait for the connect button to be visible
  const connectButton = page.locator("#connect-wallet");
  await expect(connectButton).toBeVisible();

  // Click the connect button
  await connectButton.click();

  // Wait for the modal to appear
  const modal = page.locator("#connect-wallet-modal");
  await expect(modal).toBeVisible();

  // Verify the modal title
  const modalTitle = page.locator("#connect-wallet-modal h3");
  await expect(modalTitle).toHaveText("Connect Wallet");

  // Verify Burner Wallet is available
  const burnerWalletButton = page.locator("#connect-burnerwallet");
  await expect(burnerWalletButton).toBeVisible();

  // Click the Burner Wallet button
  await burnerWalletButton.click();

  // Wait for the modal to close
  await expect(modal).not.toBeVisible();

  // Verify we're connected by checking for the disconnect button
  const disconnectButton = page.getByRole("button", { name: "Disconnect" });
  await expect(disconnectButton).toBeVisible();
});

test("disconnect wallet functionality", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Find and click the connect button
  const connectButton = page.locator("#connect-wallet");
  await expect(connectButton).toBeVisible();
  await connectButton.click();

  // Wait for the modal to appear
  const modal = page.locator("#connect-wallet-modal");
  await expect(modal).toBeVisible();

  // Connect with Burner Wallet
  const burnerWalletButton = page.locator("#connect-burnerwallet");
  await burnerWalletButton.click();

  // Wait for the disconnect button to be visible
  const disconnectButton = page.getByRole("button", { name: "Disconnect" });
  await expect(disconnectButton).toBeVisible();

  // Click the disconnect button
  await disconnectButton.click();

  // Verify the connect button is visible again after disconnection
  await expect(connectButton).toBeVisible();
});
