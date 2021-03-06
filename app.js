const express = require('express')
const puppeteer = require('puppeteer')
const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')
const PORT = 3000

const app = express()


app.get('/map', (req, res) => {
    // res.sendFile('map.html')
    res.sendFile(path.join(__dirname + '/public/map.html'))
})

// GET /pdf?course_id=eV5GFL6FN3Qo&prnds=91987,91888
app.get('/pdf', async (req, res) => {
    try {
        const { course_id, prnds } = req.query
        console.log({ course_id, prnds })

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('http://localhost:3000/map')
        await page.waitForSelector('.loaded')
        const mapDataUrl = await page.evaluate(() => {
            return map.getCanvas().toDataURL()
        })

        // uncomment for debugging
        // console.log('mapDataUrl', mapDataUrl)
        // await page.screenshot({path: 'example.png'})

        const doc = new PDFDocument
        doc.pipe(fs.createWriteStream('map.pdf'))
        doc.image(mapDataUrl)
        doc.end()

        await browser.close()
        return res.sendStatus(201)
    } catch(err) {
        console.log(err)
        return res.sendStatus(500)
    }
})

app.get('*', (req, res) => {
    res.send(':)')
})

app.listen(PORT, () => {
    console.log(`pdf-server running on port: ${PORT}`)
})
