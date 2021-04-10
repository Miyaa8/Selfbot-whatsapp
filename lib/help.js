const fetch = require('node-fetch')

exports.getBuffer = async(url) => {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'okhttp/4.5.0'
            },
            method: 'GET'
        })
        return res.buffer()
    } catch (e) {
        throw e
    }
}

exports.postBuffer = async(url, formdata) => {
    try {
        options = {
            method: 'POST',
            body: formdata
        }
        const res = await fetch(url, options)
        return res.buffer()
    } catch (e) {
        throw e
    }
}

exports.getJson = async(url) => {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'okhttp/4.5.0'
            },
            method: 'GET'
        })
        return res.json()
    } catch (e) {
        throw e
    }
}

exports.postJson = async(url, formdata) => {
    try {
        options = {
            method: 'POST',
            body: formdata
        }
        const res = await fetch(url, options)
        return res.json()
    } catch (e) {
        throw e
    }
}

exports.getRandomExt = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

exports.sleep = async(ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}