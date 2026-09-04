type PlanRequest = {
  destination: string;
  duration: string;
  budget: number;
  language: 'en' | 'ja';
  interests?: string[];
};

export type SuggestedStop = { name: string; area: string; reason: string; estimatedCost: number };
export type SuggestedPlan = { title: string; summary: string; stops: SuggestedStop[] };

/** Calls our server-side AI adapter. Provider secrets must never be bundled into the mobile app. */
export async function suggestPlan(input: PlanRequest): Promise<SuggestedPlan> {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!baseUrl) throw new Error('AI planning is not configured yet.');

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/v1/trip-plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(body || `Planning request failed (${response.status}).`);
  }

  return response.json() as Promise<SuggestedPlan>;
}
