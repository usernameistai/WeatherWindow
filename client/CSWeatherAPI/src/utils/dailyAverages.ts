import type { WeatherDataItem } from "./weather";

interface DailyAggregate {
  measurementsCount: number;
  absoluteMin: number;
  absoluteMax: number;
  averageTemp: number;
  averageHumidity: number;
  averageWindSpeed: number;
};

type DailyAggregatesMap = Record<string, DailyAggregate>;

interface DayDataGroup {
  temps: number[];
  humidities: number[];
  winds: number[];
};

function calculateDailyWeatherAverages(forecastList: WeatherDataItem[]): DailyAggregatesMap {
  const daysData: Record<string, DayDataGroup> = {};

  forecastList.forEach((item: WeatherDataItem) => {
    // data is YYYY-MM-DD 12:00:00 so below takes the date
    const date: string = item.dt_txt.split(' ')[0];

    const currentTemp: number = item.main.temp;
    const currentHumidity: number = item.main.humidity;
    const currentWindSpeed: number = item.wind.speed;

    if (!daysData[date]) {
      daysData[date] = {
        temps: [],
        humidities: [],
        winds: []
      };
    }

    daysData[date].temps.push(currentTemp);
    daysData[date].humidities.push(currentHumidity);
    daysData[date].winds.push(currentWindSpeed);
  });

  const dailyAggregates: DailyAggregatesMap = {};

  for (const date in daysData) {
    if (Object.prototype.hasOwnProperty.call(daysData, date)) {
      const { temps, humidities, winds } = daysData[date];
      // If array is empty, skip to next day / date, or / continue
      if (temps.length === 0) continue;

      const minTemp: number = Math.min(...temps);
      const maxTemp: number = Math.max(...temps);
      const avgTemp: number = temps.reduce((sum: number, val: number) => sum + val, 0) / temps.length;

      const avgHumidity: number = humidities.reduce((sum: number, val: number) => sum + val, 0) / temps.length;
      
      const avgWind: number = winds.reduce((sum: number, val: number) => sum + val, 0) / temps.length;

      dailyAggregates[date] = {
        measurementsCount: temps.length,
        absoluteMin: minTemp,
        absoluteMax: maxTemp,
        averageTemp: parseFloat(avgTemp.toFixed(2)),
        averageHumidity: parseFloat(avgHumidity.toFixed(2)),
        averageWindSpeed: parseFloat(avgWind.toFixed(2))
      };
    }
  }

  return dailyAggregates;
}

export default calculateDailyWeatherAverages;
