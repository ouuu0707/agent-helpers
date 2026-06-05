export async function onRequest(context) {
  return Response.json({
    hasAI: !!context.env.AI
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    if (!env || !env.AI) {
      return Response.json(
        { error: 'Workers AI 未绑定。请在 Cloudflare Pages 项目设置中绑定 AI。' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const provider = String(body?.provider || '').trim();
    if (provider !== 'cloudflare_workers_ai') {
      return Response.json(
        { error: '不支持的提供商' },
        { status: 400 }
      );
    }

    const model = String(body?.model || '@cf/meta/llama-3.1-8b-instruct').trim();
    const messages = Array.isArray(body?.messages) ? body.messages : null;
    if (!messages?.length) {
      return Response.json(
        { error: 'messages 不能为空' },
        { status: 400 }
      );
    }

    const temperature = Number.isFinite(Number(body?.temperature)) ? Number(body.temperature) : 0.7;
    const maxTokens = Number.isFinite(Number(body?.max_tokens)) ? Number(body.max_tokens) : 2048;

    const result = await env.AI.run(model, {
      messages,
      temperature,
      max_tokens: maxTokens
    });

    // 兼容多种返回格式
    const content =
      result?.response ||
      result?.result?.response ||
      result?.choices?.[0]?.message?.content ||
      result?.content ||
      '';

    if (!content) {
      return Response.json(
        {
          error: '无法解析AI返回',
          rawResult: result
        },
        { status: 502 }
      );
    }

    return Response.json({ content: String(content) });

  } catch (err) {
    return Response.json(
      { error: String(err?.message || err || '请求失败') },
      { status: 500 }
    );
  }
}
