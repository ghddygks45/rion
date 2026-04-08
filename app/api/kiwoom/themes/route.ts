import { NextResponse } from 'next/server'
import { kiwoomFetch } from '@/server/kiwoom/kiwoomFetcher'
import { Ka90001Response } from '@/server/kiwoom/types'

export async function GET() {
  const data = await kiwoomFetch<Ka90001Response>('/api/dostk/thme', 'ka90001', {
    qry_tp: '0',
    date_tp: '1',
    flu_pl_amt_tp: '3',
    stex_tp: '1',
  })

  return NextResponse.json(data)
}
