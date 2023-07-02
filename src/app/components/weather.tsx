'use client'
import React, { useEffect , useState } from 'react'
import bgbox from '../../..//public/background.jpg'
import type { WeatherAPI } from '@/types/weather/weatherAPI'
import type { GeolocationState } from '@/types/states/geolocState'
import type { LanguageObject } from '@/types/translations/languages'
import translationData from '@/json/locale.json'
import Image from 'next/image'
import { Blocks } from 'react-loader-spinner'


export default function Weather() {
    const [weather, setWeather] = useState<WeatherAPI | null>(null)
    const [geolocation, setGeolocation] = useState<GeolocationState | null>(null)
    const [weatherError, setWeatherError] = useState<any> (null)
    const [locale, setLocale] = useState<LanguageObject | null | undefined>(null)


    // LOCALIZATION LOGIC
    
    useEffect(() => {
        if(!translationData){
            return
        }
        const localeData = translationData.translations.find((translation) => translation.code === navigator.language.split('-')[0])
        setLocale(localeData)
    }, [])

    // GEOLOCATION LOGIC

    useEffect(() => { 
        navigator.geolocation.getCurrentPosition(function(position) {

            const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }

            fetch(`https://geocode.maps.co/reverse?lat=${coords.latitude}&lon=${coords.longitude}`)
            .then(res => res.json())
            .then(data => {
                const formattedGeoData = {
                    lat: coords.latitude,
                    long: coords.longitude,
                    city: data.address.town
                }

                setGeolocation(formattedGeoData)
            })

        })
    }, [])

    // WEATHER API LOGIC

    useEffect(() => {
        if(!geolocation){
            return
        }

        // IF LOCALE DOESN'T EXIST, DEFAULTS TO ENGLISH
        const API_URL = `http://localhost:3000/api/weather?latitude=${geolocation.lat}&longitude=${geolocation.long}&localeCode=${locale?.code ? locale.code : 'en'}`

        fetch(API_URL)
        .then(res => { 
            if(res.ok){
                return res.json()
            }
            throw new Error('Couldn\'t fetch weather API')
        })
        .then(data => {
            setWeather(data)
        })
        .catch(err => {
            setWeatherError({
                name: err.name,
                message: err.message,
                stack: err.stack
            })
        })

    }, [geolocation, locale])

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col bg-cover bg-center bg-no-repeat rounded-xl" style={{backgroundImage: `url(${bgbox.src})`, width: '600px', height: '400px', }}>
                
                <div className="grid grid-cols-3 justify-between items-center p-2 text-xs">
                    <div className=" text-left">
                        {weather ? weather.location.localtime.split(' ')[1] : '--' }
                    </div>
                    <div className="text-center">
                        { weather ? `${geolocation?.city}, ${ weather.location.name } ` : '--' }
                    </div>
                    <div className="text-right">
                        {`Actualizado: ${ weather ? weather.current.last_updated.split(' ')[1] : '--' }`}
                    </div>
                </div>

                <div className="flex flex-row justify-center items-center gap-5 pt-4">
                    {/* CHECKS LOCALE, THEN RENDERS CORRECT SCALE */}
                    { 
                        weather 
                        ? 
                        <Image src={`https:${weather.current.condition.icon.replace(/\d{2}x\d{2}/, "128x128")}`} width={150} height={150} alt='weatherAPI logo'/> 
                        : 
                        <Blocks visible={true} height="120" width="120" ariaLabel="blocks-loading" wrapperStyle={{}} wrapperClass="blocks-wrapper" /> 
                    }

                    <div className="flex flex-col justify-center items-center">
                        <p className="text-7xl font-bold">{ locale?.code === 'en' ? `${weather ? weather.current.temp_f : '--' }F°` : `${weather ? weather.current.temp_c : '--' } C°` }</p>
                        <p className="text-m">{ locale?.code === 'en' ? `Feel ${weather ? weather.current.feelslike_f : '--' }F°` :  `Sens. Term. ${weather ? weather.current.feelslike_c : '--' } C°` }</p>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center mb-10">
                    <p className="text-2xl font-bold drop-shadow-md ">{weather ? weather.current.condition.text : '--'}</p>
                </div>
                <div className="grid grid-flow-row grid-cols-3 justify-center items-center rounded-xl bg-black/20 mx-20 h-16">
                    <div className="flex flex-col justify-center items-center gap-1">
                        <p className="text-xs">{ locale ? `${locale?.translations.wind.charAt(0).toLocaleUpperCase()}${locale?.translations.wind.slice(1)}` : 'Wind'}</p>
                            {   
                                weather 
                                ?
                                <Image src="/svg/arrow.svg" width={20} height={20} style={{ transform: `rotate(${90 + weather.current.wind_degree} :}deg)` }} alt="wind icon"/>
                                :
                                <Blocks visible={true} height="20" width="20" ariaLabel="blocks-loading" wrapperStyle={{}} wrapperClass="blocks-wrapper" />
                            }
                        <p className="text-xs">{weather ? weather.current.wind_kph : '--'} km/h</p>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-1">
                        <p className="text-xs">{ locale ? `${locale?.translations.cloud.charAt(0).toLocaleUpperCase()}${locale?.translations.cloud.slice(1)}` : 'Clouds'}</p>
                        <Image src="/svg/cloud.svg" width={20} height={20} alt="cloud icon"/>
                        <p className="text-xs">{weather ? weather.current.cloud : '--' }%</p>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-1">
                        <p className="text-xs">{ locale ? `${locale?.translations.humidity.charAt(0).toLocaleUpperCase()}${locale?.translations.humidity.slice(1)}` : 'Humidity'}</p>
                        <Image src="/svg/humidity.svg" width={20} height={20} alt="humidity icon"/>
                        <p className="text-xs">{weather ? weather.current.humidity : '--' }%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
