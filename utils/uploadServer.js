const { join } = require('path')

const Koa = require('koa')
const cors = require('@koa/cors')
const body = require('koa-body')
const route = require('koa-route')

const UPLOAD_DEST = join(__dirname, '../upload')

const app = new Koa()

app.use(cors())
app.use(body({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024,
    uploadDir: UPLOAD_DEST,
    keepExtensions: true
  }
}))

app.use(route.get('/', ctx => {
  ctx.body = 'Listening on port 4321.'
}))
app.use(route.post('/', ctx => {
  console.log(ctx.request.files)
}))

app.listen(4321)
console.log('Listening on port 4321, file upload destination:\n' + UPLOAD_DEST)
