export async function onRequest(context) {
  return new Response(
    JSON.stringify({
      ok: true,
      route: "/api/ai",
      method: context.request.method
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

// export async function onRequestPost(context) {
//   const { request, env } = context

//   try {
//     if (!env || !env.AI) {
//       return new Response(JSON.stringify({ error: '未检测到 Workers AI 绑定。请在 Cloudflare Pages 项目设置中绑定 AI（使 Functions 可访问 env.AI）。' }), {
//         status: 500,
//         headers: {
//           'Content-Type': 'application/json',
//           'Cache-Control': 'no-store'
//         }
//       })
//     }

//     const body = await request.json()
//     const provider = String(body?.provider || '').trim()
//     if (provider !== 'cloudflare_workers_ai') {
//       return new Response(JSON.stringify({ error: '不支持的提供商' }), {
//         status: 400,
//         headers: {
//           'Content-Type': 'application/json',
//           'Cache-Control': 'no-store'
//         }
//       })
//     }

//     const model = String(body?.model || '@cf/meta/llama-3.1-8b-instruct').trim()
//     const messages = Array.isArray(body?.messages) ? body.messages : null
//     if (!messages || !messages.length) {
//       return new Response(JSON.stringify({ error: 'messages 不能为空' }), {
//         status: 400,
//         headers: {
//           'Content-Type': 'application/json',
//           'Cache-Control': 'no-store'
//         }
//       })
//     }

//     const temperature = Number.isFinite(Number(body?.temperature)) ? Number(body.temperature) : 0.7
//     const maxTokens = Number.isFinite(Number(body?.max_tokens)) ? Number(body.max_tokens) : 2048

//     const result = await env.AI.run(model, {
//       messages,
//       temperature,
//       max_tokens: maxTokens
//     })

//     const content = result?.response
//     if (!content) {
//       return new Response(JSON.stringify({ error: 'Workers AI 返回为空或格式不正确' }), {
//         status: 502,
//         headers: {
//           'Content-Type': 'application/json',
//           'Cache-Control': 'no-store'
//         }
//       })
//     }

//     return new Response(JSON.stringify({ content: String(content) }), {
//       headers: {
//         'Content-Type': 'application/json',
//         'Cache-Control': 'no-store'
//       }
//     })
//   } catch (err) {
//     return new Response(JSON.stringify({ error: String(err?.message || err || '请求失败') }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//         'Cache-Control': 'no-store'
//       }
//     })
//   }
// }
