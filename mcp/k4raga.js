import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

const BASE_URL = 'http://95.81.98.195'

async function getToday() {
  const res = await fetch(`${BASE_URL}/api/date`)
  const d = await res.json()
  return d.date
}

async function getStatus(date) {
  const res = await fetch(`${BASE_URL}/api/training/${date}`)
  return res.json()
}

async function saveTraining(date, payload) {
  const res = await fetch(`${BASE_URL}/api/training/${date}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return res.json()
}

const server = new Server(
  { name: 'k4raga', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'record_training',
      description: 'Записать результат тренировки на сайт k4raga. Используй когда пользователь говорит что прошёл CS тренировку, тренировку голоса, или обе.',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['cs', 'voice', 'both'],
            description: 'Тип тренировки: cs — Counter-Strike, voice — голос, both — обе'
          },
          date: {
            type: 'string',
            description: 'Дата в формате YYYY-MM-DD. Если не указана — используется сегодня.',
            pattern: '^\\d{4}-\\d{2}-\\d{2}$'
          },
          done: {
            type: 'boolean',
            description: 'true — выполнено, false — сброс/не выполнено. По умолчанию true.',
            default: true
          }
        },
        required: ['type']
      }
    },
    {
      name: 'get_training_status',
      description: 'Получить статус тренировок на конкретную дату с сайта k4raga.',
      inputSchema: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'Дата в формате YYYY-MM-DD. Если не указана — используется сегодня.',
            pattern: '^\\d{4}-\\d{2}-\\d{2}$'
          }
        }
      }
    }
  ]
}))

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params

  try {
    if (name === 'record_training') {
      const date = args.date || await getToday()
      const done = args.done !== false
      const payload = {}

      if (args.type === 'cs' || args.type === 'both') payload.cs = done
      if (args.type === 'voice' || args.type === 'both') payload.voice = done

      await saveTraining(date, payload)
      const status = await getStatus(date)

      const typeLabel = args.type === 'both' ? 'CS + Голос' : args.type === 'cs' ? 'CS тренировка' : 'Голос'
      const statusLabel = done ? 'выполнено ✓' : 'сброшено'

      return {
        content: [{
          type: 'text',
          text: `${typeLabel} за ${date} — ${statusLabel}.\nТекущий статус: CS ${status.cs ? '✓' : '✗'} | Голос ${status.voice ? '✓' : '✗'}`
        }]
      }
    }

    if (name === 'get_training_status') {
      const date = args.date || await getToday()
      const status = await getStatus(date)
      const tasks = status.cs_tasks || []
      const doneTasks = tasks.filter(Boolean).length

      return {
        content: [{
          type: 'text',
          text: [
            `Статус тренировок за ${date}:`,
            `CS тренировка: ${status.cs ? '✓ выполнено' : '✗ не выполнено'}${tasks.length ? ` (задачи: ${doneTasks}/${tasks.length})` : ''}`,
            `Голос: ${status.voice ? '✓ выполнено' : '✗ не выполнено'}`
          ].join('\n')
        }]
      }
    }

    throw new Error(`Неизвестный инструмент: ${name}`)
  } catch (err) {
    return {
      content: [{ type: 'text', text: `Ошибка: ${err.message}` }],
      isError: true
    }
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
