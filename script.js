const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const PORT = process.env.PORT || 3000;
const fs = require('fs')


const app = express();

// source depends on you
const source = "https://www.theguardian.com/international"
const fDir = source.split("/")[2]


let saveHTML = fs.createWriteStream(__dirname + `/${fDir}.html`);
let saveArticles = fs.createWriteStream(__dirname + `/${fDir}.txt`);


axios(source)
    .then(response => {
        const html = response.data;
        saveHTML.write(response.data);
        const $ = cheerio.load(html);

        const articles = []

        //item title depends on what you want to get from website
        //if you want to get specific things from website you should check class names with inspect
        $(`.fc-item__title`,html).each(function (){
            const title = $(this).text();
            const url = $(this).find('a').attr('href');
            articles.push(`title: ${title}\n url: ${url}\n`);
        })
        articles.forEach(item => saveArticles.write(item))
        console.log(articles)
    }).catch(err => console.log(err));

app.listen(PORT,() => {
    console.log(`Server is up on PORT ${PORT}`);
});