export type DropCountdown = {
  days: number
  hours: number
  minutes: number
  totalMs: number
}

export function getCertificateCode(product: { id: string; certificateId?: string }) {
  return product.certificateId ?? `GRA-IV-${product.id.toUpperCase().replaceAll('-', '-')}`
}

export function getDropCountdown(now: Date, target: Date): DropCountdown {
  const totalMs = Math.max(0, target.getTime() - now.getTime())
  const totalMinutes = Math.floor(totalMs / 60000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes - days * 1440) / 60)
  const minutes = totalMinutes - days * 1440 - hours * 60

  return { days, hours, minutes, totalMs }
}

export function buildConciergePrompt(productName?: string) {
  if (productName) {
    return `I want to reserve or ask sizing for ${productName}.`
  }

  return 'I want VIP access to the next Iced Vault drop.'
}
