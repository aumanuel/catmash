import { NextRequest, NextResponse } from 'next/server';
import { requireActionTokenFromValue } from '@/middleware/requireActionToken';
import { updateEloScores, clearPendingMatch } from '@/services/server/cats';
import { incrementTotalMatches } from '@/services/server/stats';
import { hasAlreadyVoted, recordVote } from '@/services/server/votes';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { actionToken, winnerId, loserId } = body;
    const payload = await requireActionTokenFromValue(actionToken);

    if (
      !payload.params ||
      ![payload.params.cat1Id, payload.params.cat2Id].includes(winnerId) ||
      ![payload.params.cat1Id, payload.params.cat2Id].includes(loserId) ||
      winnerId === loserId
    ) {
      return NextResponse.json({ error: 'Vote invalide' }, { status: 400 });
    }

    const { visitorId } = payload;
    const { cat1Id, cat2Id } = payload.params;
    if (await hasAlreadyVoted(visitorId, cat1Id, cat2Id)) {
      return NextResponse.json({ error: 'Vote déjà enregistré pour ce match' }, { status: 400 });
    }

    await updateEloScores(winnerId, loserId);
    await clearPendingMatch(visitorId);
    await incrementTotalMatches();
    await recordVote(visitorId, cat1Id, cat2Id, {
      visitorId,
      cat1Id,
      cat2Id,
      winnerId,
      loserId,
      votedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
} 