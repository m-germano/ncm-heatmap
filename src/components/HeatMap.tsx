import { useState, useMemo, useEffect } from 'react';
import { parse } from 'papaparse';
import type { ParseResult } from 'papaparse';
import { scaleQuantize } from 'd3-scale';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import iso3ToId from '../assets/iso3_to_id.json';

import { Input } from './ui/input';
import { Button } from './ui/button';
import * as RadioGroup from '@radix-ui/react-radio-group';

interface HeatMapData {
  NCM: string;
  CO_PAIS: string;
  vl_fob_total: number;
  kg_liq_total: number;
  ISO3: string;
}

type MetricType = 'VL_FOB' | 'KG_LIQUIDO';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const HeatMap = () => {
  const [ncm, setNcm] = useState<string>('');
  const [metric, setMetric] = useState<MetricType>('VL_FOB');
  const [rawData, setRawData] = useState<HeatMapData[]>([]);
  const [dataById, setDataById] = useState<Record<string, HeatMapData>>({});

  useEffect(() => {
    parse<HeatMapData>('/csv/exportacao_heatmap_com_iso3.csv', {
      download: true,
      dynamicTyping: true,
      header: true,
      complete: (results: ParseResult<HeatMapData>) => {
        const parsedData = results.data
          .filter(row => row.ISO3)
          .map((row: HeatMapData) => ({
            ...row,
            NCM: String(row.NCM).padStart(8, '0'),
            ISO3: row.ISO3.toUpperCase(),
          }));
        setRawData(parsedData);
      }
    });
  }, []);

  const handleSearch = () => {
    const formattedNCM = ncm.padStart(8, '0');
    const filtered = rawData.filter(item => item.NCM === formattedNCM);

    const byId: Record<string, HeatMapData> = {};
    for (const row of filtered) {
      const idNum = iso3ToId[row.ISO3 as keyof typeof iso3ToId];
      if (idNum) {
        byId[idNum] = row;
      }
    }

    console.log('IDs encontrados para NCM:', formattedNCM, Object.keys(byId));
    setDataById(byId);
  };

  const maxValue = useMemo(() => {
    if (!Object.keys(dataById).length) return 1;
    const values = Object.values(dataById).map(d =>
      metric === 'VL_FOB' ? d.vl_fob_total : d.kg_liq_total
    );
    return Math.max(...values);
  }, [dataById, metric]);

  const colorScale = useMemo(() =>
    scaleQuantize<string>()
      .domain([0, maxValue])
      .range([
        '#ffe6e6',
        '#ffb3b3',
        '#ff8080',
        '#e64d4d',
        '#cc0000',
        '#990000',
        '#800000',
      ]),
    [maxValue]
  );

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Digite o NCM (ex: 10011100)"
          value={ncm}
          onChange={(e) => setNcm(e.target.value.replace(/\D/g, ''))}
          className="w-48"
        />

        <RadioGroup.Root
          defaultValue={metric}
          onValueChange={(value) => setMetric(value as MetricType)}
          className="flex gap-4"
        >
          <RadioGroup.Item
            value="VL_FOB"
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className={metric === 'VL_FOB' ? 'font-bold' : ''}>VL_FOB</span>
          </RadioGroup.Item>
          <RadioGroup.Item
            value="KG_LIQUIDO"
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className={metric === 'KG_LIQUIDO' ? 'font-bold' : ''}>KG_LIQUIDO</span>
          </RadioGroup.Item>
        </RadioGroup.Root>

        <Button onClick={handleSearch}>
          Pesquisar
        </Button>
      </div>

      <div className="w-full h-auto">
        <ComposableMap projection="geoMercator" width={1000}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const id = String(geo.id);
                const data = dataById[id];
                const value = data
                  ? (metric === 'VL_FOB' ? data.vl_fob_total : data.kg_liq_total)
                  : 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={value > 0 ? colorScale(value) : '#f0f0f0'}
                    stroke="#ffffff"
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {Object.keys(dataById).length > 0 && (
        <div className="mt-6 p-4 bg-muted rounded-md shadow-md">
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-semibold text-sm mr-2">
              Legenda ({metric === 'VL_FOB' ? 'R$' : 'KG'}):
            </span>
            {colorScale.range().map((color) => {
              const [min] = colorScale.invertExtent(color);
              return (
                <div
                  key={color}
                  className="text-[10px] w-[60px] h-[20px] border text-center flex items-center justify-center"
                  style={{ backgroundColor: color, borderColor: '#ccc' }}
                >
                  {Math.round(min)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatMap;
