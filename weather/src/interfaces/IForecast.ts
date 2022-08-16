export interface IForecast {
  request: {
    type: string,
    query: string,
    language: string,
    unit: string
  },
  location: {
    name: string,
    country: string,
    region: string,
    [key: string]: string,
  },
  current: {
    weather_icons: string[],
    weather_descriptions: string[],
    [key: string]: string | number,
  }
}
