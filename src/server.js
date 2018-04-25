const express = require('express')
const app = express()

app.get('/:projectId/:screenId', (req, res) => {
    const { projectId, screenId } = req.params
    res.send(projectId + '/' +  screenId)
})

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'))
