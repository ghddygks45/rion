import { getKiwoomToken } from './auth'

export async function kiwoomFetch<T>(
  url: string,
  apiId: string,
  body: Record<string, string>
): Promise<T> {
  const token = await getKiwoomToken()

  const res = await fetch(`https://api.kiwoom.com${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'authorization': `Bearer ${token}`,
      'api-id': apiId,
    },
    body: JSON.stringify(body),
  })

  return res.json() as Promise<T>
}
