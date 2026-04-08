export async function getKiwoomToken(): Promise<string> {
  const res = await fetch('https://api.kiwoom.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      appkey: process.env.KIWOOM_APP_KEY,
      secretkey: process.env.KIWOOM_APP_SECRET,
    }),
  })

  const data = await res.json()
  return data.token
}
