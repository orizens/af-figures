import { test, expect } from '@playwright/test'

test.describe('Browser history navigation', () => {
  test('back after search — URL reverts and list resets', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('feed').waitFor()

    const searchInput = page.getByRole('searchbox', { name: 'Search reviews' })
    await searchInput.fill('love')
    await expect(page).toHaveURL(/q=love/, { timeout: 5000 })

    await page.goBack()

    await expect(page).not.toHaveURL(/q=love/)
    await expect(page.getByRole('searchbox', { name: 'Search reviews' })).toHaveValue('')
    await expect(page.getByRole('status', { name: 'All Reviews' })).toBeVisible()
  })

  test('back after rating filter — URL reverts and list resets', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('feed').waitFor()

    await page.getByRole('checkbox', { name: /5★/ }).check()
    await expect(page).toHaveURL(/rating=5/)

    await page.goBack()

    await expect(page).not.toHaveURL(/rating=5/)
    await expect(page.getByRole('checkbox', { name: /5★/ })).not.toBeChecked()
    await expect(page.getByRole('status', { name: 'All Reviews' })).toBeVisible()
  })

  test('forward after back — re-applies filter and re-fetches', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('feed').waitFor()

    await page.getByRole('checkbox', { name: /5★/ }).check()
    await expect(page).toHaveURL(/rating=5/)

    await page.goBack()
    await expect(page).not.toHaveURL(/rating=5/)

    await page.goForward()
    await expect(page).toHaveURL(/rating=5/)
    await expect(page.getByRole('feed')).toBeVisible()
  })

  test('multi-step back — 3 history entries return to /', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('feed').waitFor()

    // Step 1: search
    const searchInput = page.getByRole('searchbox', { name: 'Search reviews' })
    await searchInput.fill('love')
    await expect(page).toHaveURL(/q=love/, { timeout: 5000 })

    // Step 2: rating filter
    await page.getByRole('checkbox', { name: /5★/ }).check()
    await expect(page).toHaveURL(/rating=5/)

    // Step 3: load more
    await page.getByRole('button', { name: 'Load more reviews' }).click()
    await expect(page).toHaveURL(/page=2/, { timeout: 5000 })

    // Go back 3 times
    await page.goBack()
    await page.goBack()
    await page.goBack()

    await expect(page).not.toHaveURL(/q=|rating=|page=/)
    await expect(page.getByRole('status', { name: 'All Reviews' })).toBeVisible()
  })
})
