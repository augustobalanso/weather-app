import { NextApiRequest, NextApiResponse } from "next"

export default function handler (req: NextApiRequest, res: NextApiResponse) {
    
    const { latitude, longitude, localeCode } = req.query
    const API_URL = `${process.env.URL_WEATHER}/current.json?key=${process.env.API_KEY_WEATHER}&q=${latitude},${longitude}&lang=${localeCode ? localeCode : 'en'}`

    fetch(API_URL)
        .then(res => {
            if(res.ok){
                return res.json()
            }
            throw new Error('Couldn\'t fetch weather API')
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({ 
                name: err.name,
                message: err.message,
                stack: err.stack
            })
        })
  }