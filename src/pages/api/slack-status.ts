import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const runtime = locals.runtime as { env: Record<string, string> } | undefined;
  const SLACK_TOKEN = runtime?.env?.SLACK_TOKEN || import.meta.env.SLACK_TOKEN;
  const SLACK_USER_ID = runtime?.env?.SLACK_USER_ID || import.meta.env.SLACK_USER_ID;

  if (!SLACK_TOKEN || !SLACK_USER_ID) {
    return new Response(JSON.stringify({ online: false }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const res = await fetch(
      `https://slack.com/api/users.getPresence?user=${SLACK_USER_ID}`,
      { headers: { Authorization: `Bearer ${SLACK_TOKEN}` } }
    );

    const data = await res.json();

    return new Response(JSON.stringify({ online: data.presence === 'active' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ online: false }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
