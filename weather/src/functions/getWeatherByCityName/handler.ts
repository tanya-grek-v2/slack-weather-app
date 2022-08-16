import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getForecast } from '@libs/getForecast';

import { IForecast } from '../../interfaces/IForecast';
import schema from './schema';

const getWeatherByCityName: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { text } = new Proxy(new URLSearchParams(event.body), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  if (!text) {
    return formatJSONResponse({
      'blocks': [
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': 'Please, provide any location'
          }
        }
      ]
    }, 400);
  }

  try {
    const weather: IForecast = await getForecast(text);

    return formatJSONResponse({
      'blocks': [
        {
          'type': 'header',
          'text': {
            'type': 'plain_text',
            'text': `${weather.request.query}`,
            'emoji': true
          }
        },
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': `${weather.current.weather_descriptions.join('. ')}`
          },
          'accessory': {
            'type': 'image',
            'image_url': `${weather.current.weather_icons[0]}`,
            'alt_text': 'weather icon'
          }
        }
      ]
    })
  } catch {
    return formatJSONResponse({
      'blocks': [
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': `Sorry, I don't understand where ${text} is`
          }
        }
      ]
    }, 400);
  }
};

export const main = middyfy(getWeatherByCityName);
