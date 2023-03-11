import type { NextApiRequest, NextApiResponse } from 'next'

type Data = any;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    res.send(process.env.FIREBASE_CLOUD_URL)
}