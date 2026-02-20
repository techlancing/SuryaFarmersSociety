import type { Transaction } from './services/transaction'

/** Convert YYYY-MM-DD (input type="date") to DD-MM-YYYY for API */
export function toApiDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}-${m}-${y}`
}

/** Parse DD-MM-YYYY to Date for sorting/grouping */
function parseApiDate(s: string): Date {
  const [d, m, y] = (s || '').split('-').map(Number)
  if (!y || !m || !d) return new Date(0)
  return new Date(y, m - 1, d)
}

/** Month label from DD-MM-YYYY */
export function monthLabelFromApiDate(sDate: string): string {
  const date = parseApiDate(sDate)
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

/** Group transactions by date; sum credit/debit; running balance (balance = debit - credit for display) */
export function aggregateByDate(txns: Transaction[]): Array<{ sDate: string; nCreditAmount: number; nDebitAmount: number; nBalanceAmount: number }> {
  const byDate: Record<string, { credit: number; debit: number }> = {}
  for (const t of txns) {
    const d = t.sDate ?? ''
    if (!byDate[d]) byDate[d] = { credit: 0, debit: 0 }
    byDate[d].credit += Number(t.nCreditAmount) || 0
    byDate[d].debit += Number(t.nDebitAmount) || 0
  }
  const dates = Object.keys(byDate).sort((a, b) => parseApiDate(a).getTime() - parseApiDate(b).getTime())
  let running = 0
  return dates.map((d) => {
    const { credit, debit } = byDate[d]
    running = running + debit - credit
    return { sDate: d, nCreditAmount: credit, nDebitAmount: debit, nBalanceAmount: running }
  })
}

/** Group transactions by month (from sDate DD-MM-YYYY) */
export function aggregateByMonth(txns: Transaction[]): Array<{ month: string; nCreditAmount: number; nDebitAmount: number; nBalanceAmount: number }> {
  const byMonth: Record<string, { credit: number; debit: number }> = {}
  for (const t of txns) {
    const label = monthLabelFromApiDate(t.sDate ?? '')
    if (!byMonth[label]) byMonth[label] = { credit: 0, debit: 0 }
    byMonth[label].credit += Number(t.nCreditAmount) || 0
    byMonth[label].debit += Number(t.nDebitAmount) || 0
  }
  const entries = Object.entries(byMonth).map(([month, { credit, debit }]) => ({
    month,
    nCreditAmount: credit,
    nDebitAmount: debit,
    nBalanceAmount: debit - credit,
  }))
  entries.sort((a, b) => {
    const dA = new Date(a.month)
    const dB = new Date(b.month)
    return dA.getTime() - dB.getTime()
  })
  return entries
}

/** Group transactions by category (sAccountType) */
export function aggregateByCategory(txns: Transaction[]): Array<{ category: string; nCreditAmount: number; nDebitAmount: number; nBalanceAmount: number }> {
  const byCat: Record<string, { credit: number; debit: number }> = {}
  for (const t of txns) {
    const cat = t.sAccountType ?? 'Other'
    if (!byCat[cat]) byCat[cat] = { credit: 0, debit: 0 }
    byCat[cat].credit += Number(t.nCreditAmount) || 0
    byCat[cat].debit += Number(t.nDebitAmount) || 0
  }
  return Object.entries(byCat).map(([category, { credit, debit }]) => ({
    category,
    nCreditAmount: credit,
    nDebitAmount: debit,
    nBalanceAmount: debit - credit,
  }))
}

/** Group by branch (first 4 chars of account no) and category */
export function aggregateByBranchAndCategory(txns: Transaction[]): Array<{ branch: string; category: string; nCreditAmount: number; nDebitAmount: number; nBalanceAmount: number }> {
  const byKey: Record<string, { credit: number; debit: number }> = {}
  for (const t of txns) {
    const branch = (t.sAccountNo ?? '').slice(0, 4) || 'N/A'
    const cat = t.sAccountType ?? 'Other'
    const key = `${branch}|${cat}`
    if (!byKey[key]) byKey[key] = { credit: 0, debit: 0 }
    byKey[key].credit += Number(t.nCreditAmount) || 0
    byKey[key].debit += Number(t.nDebitAmount) || 0
  }
  return Object.entries(byKey).map(([key, { credit, debit }]) => {
    const [branch, category] = key.split('|')
    return { branch, category, nCreditAmount: credit, nDebitAmount: debit, nBalanceAmount: debit - credit }
  })
}
