const express = require('express')
const getCalendarList = require('./services/notion')
const PORT = process.env.PORT || 5001

const app = express()

/**
 * 노션 캘린더 데이터 가져오기
 */
app.get('/calendars', async(req, res) => {
    const calendars = await getCalendarList()
    res.json(calendars);
})

app.listen(PORT, console.log(`Server started on port ${PORT}`))