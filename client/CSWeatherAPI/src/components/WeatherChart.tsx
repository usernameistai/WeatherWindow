import React, { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { motion, AnimatePresence } from "framer-motion";
import type { LocationData, WeatherDataItem } from '../utils/weather';
import { useThemeStore } from '@/stores/store';

const chartConfig = {
  temp: {
    label: "Temperature",
    color: "#22D3EE"
  },
  temp_min: {
    label: "Min Temp.",
    color: "#14B8A6"
  },
  temp_max: {
    label: "Max Temp.",
    color: "#7E8F9"
  },
} satisfies ChartConfig

const WeatherChart = ({ data, location }: { data : WeatherDataItem[] | null, location: LocationData[] | null | undefined }) => {
  const theme = useThemeStore(state => state.theme);
  const tickColour = theme === 'light' ? 'rgba(63, 63, 70, 0.8)' : 'rgba(212, 212, 216, 0.8)';

  const graphWeather = useMemo(() => {
    if (!data) return undefined;

    const dailyTemps: Record<string, number[]> = {};

    data.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      
      if (!dailyTemps[date]) {
        dailyTemps[date] = [];
      }
      dailyTemps[date].push(item.main.temp)
    });

    return data?.map(item => {
      const date = item.dt_txt.split(" ")[0];
      const temps = dailyTemps[date];

      return {
        dt: new Date(item.dt * 1000).toISOString(),
        temp: item.main.temp,
        temp_min: Math.min(...temps),
        temp_max: Math.max(...temps),
      };
    });
  }, [data]);

  return (
    <>
      <div className='pt-0 mx-auto items-center max-w-6xl p-5'>
        <div className='flex justify-between items-center mb-2 font-semibold text-zinc-700/80 dark:text-[#06b6d4] text-[10px] sm:text-[12px] font-mono tracking-[2px]'>
          <span className='uppercase'>// SECTOR: {location?.[0]?.name}-WEATHER-CHART</span>
          <span>STATUS: 3HOUR_CHECK</span>
        </div>
        <Card className='bg-neutral-100/50 dark:bg-black/15 shadow-[0_0_30px_rgba(6,182,212,0.15)]'>
          <CardHeader className="flex items-center gap-2 space-y-0 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-xs md:text-lg text-zinc-700/80 dark:text-white font-bold tracking-wider">{location?.[0]?.name} Temperature 5 Day Fluctuations</CardTitle>
              <CardDescription className="text-[10px] md:text-sm text-zinc-700/60 dark:text-white/80">
                Min and Max values are calculated for the whole day
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode='wait'>
              <motion.div
                role="img"
                aria-label="Graph for five day forecast"
                initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <ChartContainer config={chartConfig} className='h-80 w-full'>
                  <AreaChart
                    className=''
                    accessibilityLayer
                    data={graphWeather ?? undefined}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <defs>
                      <linearGradient id="weatherGraph" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#34D399"
                          stopOpacity={0.5}
                        />
                        <stop
                          offset="95%"
                          stopColor="#34D399"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} horizontal={false} />
                    <ChartTooltip
                      cursor={false}
                      // className='relative left-25'
                      content={
                        <ChartTooltipContent 
                          indicator="line"
                          labelClassName='text-zinc-800/80 dark:text-neutral-100/80 font-semibold text-base px-2 py-1'
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleString("en-GB", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          }}
                          formatter={(value, name) => [
                            <div key={`${name}-${value}`} className='px-3 py-1.5 text-zinc-800/80 dark:text-neutral-100/80 font-bold'>
                              <span className={`px-1.25 rounded-xs mr-1 
                                ${name === 'temp' ? 'bg-emerald-500' 
                                  : name === 'temp_min' ? 'bg-blue-600'
                                    : name === 'temp_max' ? 'bg-red-600' : ''}`}
                              >{' '}</span>
                              <span className="text-zinc-700/80 dark:text-neutral-200/80 mr-1">{name}:</span>
                              <span className="">{Number(value).toFixed(2)}°C</span>
                            </div>
                          ]}
                        />
                      }
                    />
                    <XAxis 
                      dataKey="dt" 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tick={{ fontSize: 10, fill: tickColour }}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-UK", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                    />
                    <YAxis 
                      dataKey="temp"
                      domain={[
                        (dataMin: number) => Math.floor(dataMin - 5),
                        (dataMax: number) => Math.floor(dataMax + 2),
                      ]}
                      scale="auto"
                      allowDataOverflow={true}
                      tick={{ fontSize: 10, fill: tickColour }}
                      axisLine={false}                         
                      tickLine={false}                        
                      tickFormatter={(value) => `${value.toLocaleString()}°C`}
                      width={20}
                      // hide
                    />

                    <Area
                      type="monotone"
                      dataKey="temp"
                      stroke="#34D399"
                      activeDot={{ stroke: '#34D399' }}
                      fillOpacity={1}
                      fill="url(#weatherGraph)"
                      animationBegin={200}
                      animationDuration={1300}
                      strokeWidth={5}
                    />
                    <Area
                      type="monotone"
                      dataKey="temp_min"
                      stroke="blue"
                      activeDot={{ stroke: 'blue' }}
                      fillOpacity={0.1}
                      fill="url(#weatherGraph)"
                      animationBegin={200}
                      animationDuration={1300}
                      strokeWidth={0.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="temp_max"
                      stroke="red"
                      activeDot={{ stroke: 'red' }}
                      fillOpacity={0.1}
                      fill="url(#weatherGraph)"
                      animationBegin={200}
                      animationDuration={1300}
                      strokeWidth={0.5}
                    />
                    <ChartLegend content={<ChartLegendContent className="text-emerald-300 font-bold" />} />
                  </AreaChart>
                </ChartContainer>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
          
      </div>
    </>
  )
};

export default React.memo(WeatherChart);