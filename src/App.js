import './App.css';

import { useState, useEffect } from 'react';
import ReactTooltip from "react-tooltip";

import MapChart from "./MapChart";


function App() {
  const [dataAPI, setData] = useState([]);
  const [countryData, setCountry] = useState([])
  const [countryHover, setCountryHover] = useState()
  const [maxVisits, setMaxVisits] = useState()
  useEffect(() => {
    analyticsData()
  }, [])

  const analyticsData = async () => {
    // const projectId = "d8ed98f8-78a1-4d62-8051-cb9dfcf7069e" // notice documentation PROD
    const url = "https://gargamel.notice.studio/visits?blockId=d8ed98f8-78a1-4d62-8051-cb9dfcf7069e&from=2022-08-11T13:18:35.331Z&secret=notice-analytics&metadata=true"
    try {
      const result = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
      setData(result)


      
      const filteredResult = await result.json()

      const reducedCountry = filteredResult.data.reduce(
        (all, curr) => {
          const {
            metadata: { country },
          } = curr;

          for (let c in country) {
            if (all.country[c] == null) all.country[c] = country[c];
            else all.country[c] += country[c];
          }

          return { country: all.country };
        },
        {
          country: {},
        }
      );
      
      setCountry(reducedCountry)

      const countMax = () => {
        if (!reducedCountry.country) return
        let count = 0
        Object.entries(reducedCountry.country).map(elem => {
          if (count < elem[1]) count = elem[1]
        })
        return count
      }
      setMaxVisits(countMax())

    } catch (err) {
      console.error()
    }
  }

  return (
    <div>
      <MapChart setTooltipContent={setCountryHover} fullCountryData={countryData} maxVisits={maxVisits} />
      <ReactTooltip html={true} backgroundColor='white' textColor='black'>{countryHover}</ReactTooltip>
    </div>
  )
}

export default App;
