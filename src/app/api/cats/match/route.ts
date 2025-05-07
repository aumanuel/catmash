import { NextRequest, NextResponse } from 'next/server';
import { getCatMatch, getAllCats, getPendingMatch, setPendingMatch } from '@/services/server/cats';
import { serializeCatArray } from '@/utils/serialize';
import { signActionToken, verifyActionToken } from '@/utils/actionToken';
import { getVisitorIdFromCookie } from '@/utils/cookies';

export async function GET(req: NextRequest) {
  try {
    const visitorId = getVisitorIdFromCookie(req) || 'anonymous';

    const pending = await getPendingMatch(visitorId);
    if (pending) {
      const allCats = await getAllCats();
      const cat1 = allCats.find(c => c.id === pending.cat1Id);
      const cat2 = allCats.find(c => c.id === pending.cat2Id);
      if (cat1 && cat2) {
        let token = pending.token;
        let tokenValid = true;
        try {
          await verifyActionToken(token);
        } catch (err) {
          tokenValid = false;
        }
        if (!tokenValid) {
          token = await signActionToken({
            action: 'choose',
            visitorId,
            params: { cat1Id: cat1.id, cat2Id: cat2.id },
          });
          await setPendingMatch(visitorId, cat1.id, cat2.id, token);
        }
        return NextResponse.json({
          cats: serializeCatArray([cat1, cat2]),
          token,
        });
      }
    }

    const [cat1, cat2] = await getCatMatch();
    const token = await signActionToken({
      action: 'choose',
      visitorId,
      params: { cat1Id: cat1.id, cat2Id: cat2.id },
    });
    await setPendingMatch(visitorId, cat1.id, cat2.id, token);

    return NextResponse.json({
      cats: serializeCatArray([cat1, cat2]),
      token,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 