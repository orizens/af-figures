import { test, expect } from '@playwright/test'

test.describe('Reviews page', () => {
  test('default load — shows All Reviews and grouped sections', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('status', { name: 'All Reviews' })).toBeVisible()
    await expect(page.getByRole('feed')).toBeVisible()
    // At least one date-grouped section is rendered
    await expect(page.locator('section[aria-labelledby]').first()).toBeVisible()
  })

  test('search keyword — URL updates and list refreshes', async ({ page }) => {
    await page.goto('/')

    const searchInput = page.getByRole('searchbox', { name: 'Search reviews' })
    await searchInput.fill('love')

    // Wait for debounce (400ms) + network
    await expect(page).toHaveURL(/q=love/, { timeout: 5000 })
    await expect(page.getByRole('feed')).toBeVisible()
  })

  test('filter by rating — URL updates immediately and list refreshes', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('checkbox', { name: '5 stars' }).click()

    await expect(page).toHaveURL(/rating=5/)
    await expect(page.getByRole('feed')).toBeVisible()
  })

  test('combined filters — URL reflects both q and rating', async ({ page }) => {
    await page.goto('/')

    const searchInput = page.getByRole('searchbox', { name: 'Search reviews' })
    await searchInput.fill('crash')

    await page.getByRole('checkbox', { name: '1 star' }).click()

    await expect(page).toHaveURL(/q=crash/, { timeout: 5000 })
    await expect(page).toHaveURL(/rating=1/)
    await expect(page.getByRole('feed')).toBeVisible()
  })

  test('deep link — filters pre-populate and data loads', async ({ page }) => {
    await page.goto('/?q=love&rating=4,5')

    const searchInput = page.getByRole('searchbox', { name: 'Search reviews' })
    await expect(searchInput).toHaveValue('love')

    await expect(page.getByRole('checkbox', { name: '4 stars' })).toBeChecked()
    await expect(page.getByRole('checkbox', { name: '5 stars' })).toBeChecked()

    await expect(page.getByRole('feed')).toBeVisible({ timeout: 10000 })
  })

  test('invalid params — app loads with defaults, no error thrown', async ({ page }) => {
    await page.goto('/?rating=99&page=abc')

    await expect(page.getByRole('status', { name: 'All Reviews' })).toBeVisible()
    await expect(page.getByRole('feed')).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('alert')).not.toBeVisible()
  })

  test('load more — appends results and URL updates to page=2', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('feed').waitFor()
    const initialArticles = await page.getByRole('article').count()

    await page.getByRole('button', { name: 'Load more reviews' }).click()

    await expect(page).toHaveURL(/page=2/, { timeout: 5000 })
    await expect(page.getByRole('article')).toHaveCount(initialArticles + 25, { timeout: 5000 })
  })

  test('refresh with page=2 — same results visible after reload', async ({ page }) => {
    await page.goto('/?page=2')

    await page.getByRole('feed').waitFor()
    const articleCount = await page.getByRole('article').count()

    await page.reload()
    await page.getByRole('feed').waitFor()

    await expect(page.getByRole('article')).toHaveCount(articleCount)
  })

  test('error state — error shown in list area, header still visible', async ({ page }) => {
    await page.route('**/careers/api/reviews**', (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' }),
    )

    await page.goto('/')

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('no results — empty state message shown', async ({ page }) => {
    await page.goto('/?q=zzz_no_match_expected_xxxxxxxxxxx')

    await expect(page).toHaveURL(/q=zzz_no_match_expected_xxxxxxxxxxx/, { timeout: 5000 })
    await expect(page.getByText(/no reviews found/i)).toBeVisible({ timeout: 5000 })
  })

  test('summary with no filter — shows All Reviews', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('status', { name: 'All Reviews' })).toBeVisible()
  })

  test('summary with filter — shows Showing X reviews', async ({ page }) => {
    await page.goto('/?rating=5')

    await expect(page.getByRole('status', { name: /Showing \d+ reviews/ })).toBeVisible({
      timeout: 5000,
    })
  })

  test('should reflect typed characters immediately before debounce fires', async ({ page }) => {
    await page.goto('/')

    const searchInput = page.getByRole('searchbox', { name: 'Search reviews' })

    // Type char-by-char to expose the controlled-input bug:
    // each keystroke should be visible in the input without waiting for debounce
    await searchInput.pressSequentially('lo', { delay: 50 })

    await expect(searchInput).toHaveValue('lo')
  })
})
