import { test, expect } from '@playwright/test'

test('channel page, messages and channel creation', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.setViewportSize({ width: 1752, height: 897 })
  await page.goto('main/')
  await expect(page.getByRole('heading', { name: 'Канал «test»' })).toBeVisible()
  await page.screenshot({ path: '/tmp/flex-desktop.png', fullPage: true })
  await page.getByRole('textbox', { name: 'Сообщение', exact: true }).fill('Привет, команда!')
  await page.getByRole('button', { name: 'Отправить сообщение' }).click()
  await expect(page.getByRole('log')).toContainText('Привет, команда!')
  await page.getByRole('button', { name: 'FAQ', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Канал «FAQ»' })).toBeVisible()
  await page.getByRole('button', { name: 'Добавить текстовый канал' }).click()
  await page.getByPlaceholder('Например, design').fill('design')
  await page.getByRole('button', { name: 'Создать канал', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Канал «design»' })).toBeVisible()
  expect(errors).toEqual([])
})

test('mobile layout and navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('main/')
  await expect(page.getByRole('heading', { name: 'Канал «test»' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: '/tmp/flex-mobile.png', fullPage: true })
  await page.getByRole('button', { name: 'Открыть меню' }).click()
  await page.getByRole('button', { name: 'Random', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Канал «Random»' })).toBeVisible()
})
