const axios = require('axios')
const cheerio = require('cheerio')

async function Movie() {

  return new Promise((resolve, reject) => {

    axios.get(`https://movieofotaku.blogspot.com/search/label/Movie`)
      .then(({
        data
      }) => {
        const $ = cheerio.load(data)
        let synopsis = []
     let url = []
     let img = []
 	$('div.thumbnail > a').get().map((rest) => {
         url.push($(rest).attr('href'))
         })
         $('div.snippet-ongoing').get().map((rest) => {
        	synopsis.push($(rest).text())
         })
         $('div.thumbnail > a > img').get().map((rest) => {
        	img.push($(rest).attr('src'))
         })
     let result = []
     for (let i = 0; i < url.length; i++) {
          result.push({
               	url: url[i],
               	sinopsis: synopsis[i],
               	img: img[i]
          })
      }
      const res = {
            status: 200,
            hasil: result
          }
          resolve(res)
      })
      .catch(reject)
  })
}

async function Action() {

  return new Promise((resolve, reject) => {

    axios.get(`https://movieofotaku.blogspot.com/search/label/Action`)
      .then(({
        data
      }) => {
        const $ = cheerio.load(data)
        let synopsis = []
     let url = []
     let img = []
 	$('div.thumbnail > a').get().map((rest) => {
         url.push($(rest).attr('href'))
         })
         $('div.snippet-ongoing').get().map((rest) => {
        	synopsis.push($(rest).text())
         })
         $('div.thumbnail > a > img').get().map((rest) => {
        	img.push($(rest).attr('src'))
         })
     let result = []
     for (let i = 0; i < url.length; i++) {
          result.push({
               	sinopsis: synopsis[i],
               	link: url[i],
               	img: img[i]
          })
     }
            
        const res = {
            status: 200,
            hasil: result
          }
          resolve(res)
      })
      .catch(reject)
  })
}

async function Adventure() {

  return new Promise((resolve, reject) => {

    axios.get(`https://movieofotaku.blogspot.com/search/label/Adventure`)
      .then(({
        data
      }) => {
        const $ = cheerio.load(data)
        let synopsis = []
     let url = []
     let img = []
 	$('div.thumbnail > a').get().map((rest) => {
         url.push($(rest).attr('href'))
         })
         $('div.snippet-ongoing').get().map((rest) => {
        	synopsis.push($(rest).text())
         })
         $('div.thumbnail > a > img').get().map((rest) => {
        	img.push($(rest).attr('src'))
         })
     let result = []
     for (let i = 0; i < url.length; i++) {
          result.push({
               	sinopsis: synopsis[i],
               	link: url[i],
               	img: img[i]
          })
     }
            
        const res = {
            status: 200,
            hasil: result
          }
          resolve(res)
      })
      .catch(reject)
  })
}

async function Drama() {
  return new Promise((resolve, reject) => {
    axios.get(`https://movieofotaku.blogspot.com/search/label/Drama`)
      .then(({
        data
      }) => {
        const $ = cheerio.load(data)
        let synopsis = []
     let url = []
     let img = []
 	$('div.thumbnail > a').get().map((rest) => {
         url.push($(rest).attr('href'))
         })
         $('div.snippet-ongoing').get().map((rest) => {
        	synopsis.push($(rest).text())
         })
         $('div.thumbnail > a > img').get().map((rest) => {
        	img.push($(rest).attr('src'))
         })
     let result = []
     for (let i = 0; i < url.length; i++) {
          result.push({
               	url: url[i],
               	sinopsis: synopsis[i],
               	img: img[i]
          })
     }
            
        const res = {
            status: 200,
            hasil: result
          }
          resolve(res)
      })
      .catch(reject)
  })
}

async function SearchKartun(film) {

  return new Promise((resolve, reject) => {

    axios.get(`https://movieofotaku.blogspot.com/search?q=${film}&post_type=_top`)
      .then(({
        data
      }) => {
        const $ = cheerio.load(data)
        let synopsis = []
        let img = []
        let url = []
        let episod = []
        let jenre = []
        $('div.info-list > ul > li > a').get().map((rest) => {
            jenre.push($(rest).text())
            })
        $('div.info-list > ul > li > span').get().map((rest) => {
            episod.push($(rest).text())
            })
        $('div.snippet-ongoing').get().map((rest) => {
         synopsis.push($(rest).text())
         })
 	$('div.thumbnail > a > img').get().map((rest) => {
         img.push($(rest).attr('src'))
         })
         $('div.thumbnail > a').get().map((rest) => {
         url.push($(rest).attr('href'))
         })
     let result = []
     for (let i = 0; i < url.length; i++) {
          result.push({
            sinopsis: synopsis[i],
          	image: img[i],
          link: url[i],
          episode: episod[i],
          genre: jenre[i]
          })
     }
            
        const res = {
            status: 200,
            hasil: result
          }
          resolve(res)
      })
      .catch(reject)
  })
}

exports.Adventure = Adventure
exports.Action = Action
exports.Drama = Drama
exports.Movie = Movie
exports.SearchKartun = SearchKartun