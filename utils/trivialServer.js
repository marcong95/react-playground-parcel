const Koa = require('koa')
const cors = require('@koa/cors')
const body = require('koa-body')
const route = require('koa-route')

const app = new Koa()

app.use(cors())
app.use(body())

const handleRequest = ctx => {
  console.log('  TIME:', new Date().toString())
  console.log('METHOD:', ctx.request.method)
  console.log('   URL:', ctx.request.url)
  console.log(' QUERY:', ctx.request.query)
  console.log('  TYPE:', ctx.headers['content-type'])
  console.log('  BODY:', ctx.request.body)
  console.log()
  ctx.body = { success: true }
}
app.use(route.get('*', handleRequest))
app.use(route.post('*', handleRequest))

app.listen(4321)
console.log('Listening on port 4321.')
