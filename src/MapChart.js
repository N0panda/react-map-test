import React, { memo } from "react";
import { geoPatterson } from "d3-geo-projection"
import { scaleLinear } from "d3-scale"
import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";


const width = 800
const height = 600

const projection = geoPatterson()
  .translate([width / 2, height / 2])
  .scale(50)

const colorScale = (elem, max) => {
  if (!max) return '#F2F0EC'
  let value = 0
  if (elem > 0) elem += 30
  const test = scaleLinear()
    .domain([0, max + 30])
    .range(['#F2F0EC', '#FFC107']);
  return test(elem)
}

const MapChart = ({ setTooltipContent, fullCountryData, maxVisits }) => {
  return (
    <div data-tip="">
      <ComposableMap projection={projection}>
        <Geographies geography="/world-continents.json">
          {({ geographies }) =>
            geographies.map((geo) => {
              let countryVisit = 0
              try {
                countryVisit = fullCountryData?.country[geo?.properties?.iso_a2_eh] ?? 0
              } catch (err) { }

              return (
                <Geography
                  style={{
                    default: { outline: 'none' },
                    hover: {
                      // stroke: "#FFC107",
                      stroke: "#BBBBBB",
                      strokeWidth: 0.8,
                      outline: 'none'
                    },
                    pressed: { outline: 'none' },
                  }}
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(countryVisit ?? 0, maxVisits)}
                  stroke="#868686"
                  strokeWidth={0.12}
                  onMouseEnter={() => {
                    setTooltipContent(`<div><b>${geo.properties.name}</b></div><div><b>${countryVisit ?? 0}</b> visitors</div>`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}

export default memo(MapChart);