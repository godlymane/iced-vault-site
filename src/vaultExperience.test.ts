import { describe, expect, it } from 'vitest'
import {
  buildConciergePrompt,
  getCertificateCode,
  getDropCountdown,
} from './vaultExperience'

describe('vault experience helpers', () => {
  it('formats a product certificate code', () => {
    expect(
      getCertificateCode({
        id: 'ghost-tennis-chain',
        certificateId: 'GRA-IV-001',
      }),
    ).toBe('GRA-IV-001')
  })

  it('falls back to a stable certificate code when legacy product data is missing one', () => {
    expect(getCertificateCode({ id: 'ghost-tennis-chain' })).toBe('GRA-IV-GHOST-TENNIS-CHAIN')
  })

  it('returns a clamped countdown to the next VIP drop', () => {
    expect(
      getDropCountdown(
        new Date('2026-05-25T12:00:00.000Z'),
        new Date('2026-05-27T15:30:00.000Z'),
      ),
    ).toEqual({
      days: 2,
      hours: 3,
      minutes: 30,
      totalMs: 185400000,
    })
  })

  it('creates a concierge prompt with product context when present', () => {
    expect(buildConciergePrompt('Vault Solitaire Ring')).toBe(
      'I want to reserve or ask sizing for Vault Solitaire Ring.',
    )
    expect(buildConciergePrompt()).toBe('I want VIP access to the next Iced Vault drop.')
  })
})
