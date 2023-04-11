import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getForecast } from '@libs/getForecast';

import { IForecast } from '../../interfaces/IForecast';
import schema from './schema';

const getWeatherByCityName: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const location = String(event.body).split('location=')[1]

  if (!location) {
    return formatJSONResponse({
      error: 'Please, provide any location'
    }, 400);
  }

  try {
    const weather: IForecast = await getForecast(location);

    return formatJSONResponse({
      location: weather.request.query,
      weather: weather.current.weather_descriptions.join('. '),
      image: weather.current.weather_icons[0],
    })
  } catch {
    return formatJSONResponse({
      error: `Sorry, I don't understand where ${location} is`
    }, 400);
  }
};

export const main = middyfy(getWeatherByCityName);
