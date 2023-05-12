// Initialize Express app
const express = require('express')
const app = express()
const router = require('./router')

// Serve all static files from the dist folder
app.use(express.static(path.join(__dirname, '../../build/')))

// Set up express router to serve all api routes (more on this below)
app.use('/api', router)

// Serve any other file as the distribution index.html
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '../../build/index.html'))
})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`listening on port:${PORT}`))