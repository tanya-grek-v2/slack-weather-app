import { main as getWeatherByCityName } from './getWeatherByCityName/handler';
import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { getForecast } from '@libs/getForecast';

// import { IForecast } from '../../interfaces/IForecast';
import schema from './getWeatherByCityName/schema';

jest.mock('@libs/api-gateway', () => ({
  formatJSONResponse: jest.fn(),
}));

jest.mock('@libs/getForecast', () => ({
  getForecast: jest.fn(),
}));

describe('getWeatherByCityName', () => {
  const event = {
    body: 'location=New York',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return weather information when valid location is provided', async () => {
    const weather = {
      request: {
        query: 'New York',
      },
      current: {
        weather_descriptions: ['Cloudy'],
        weather_icons: ['icon-url'],
      },
    };

    (getForecast as jest.Mock).mockResolvedValue(weather);
    (formatJSONResponse as jest.Mock).mockReturnValueOnce({});

    const response = await getWeatherByCityName(event as ValidatedEventAPIGatewayProxyEvent<typeof schema>);

    expect(getForecast).toBeCalledWith('New York');
    expect(formatJSONResponse).toBeCalledWith({
      location: 'New York',
      weather: 'Cloudy',
      image: 'icon-url',
    });
    expect(response).toEqual({});
  });

  it('should return an error response when location is not provided', async () => {
    (event.body as string) = '';

    (formatJSONResponse as jest.Mock).mockReturnValueOnce({});

    const response = await getWeatherByCityName(event as ValidatedEventAPIGatewayProxyEvent<typeof schema>);

    expect(formatJSONResponse).toBeCalledWith(
      {
        error: 'Please, provide any location',
      },
      400
    );
    expect(response).toEqual({});
  });

  xit('should return an error response when location is not found', async () => {
    const errorMessage = 'Sorry, I don\'t understand where New York is';

    (getForecast as jest.Mock).mockRejectedValue(new Error(errorMessage));
    (formatJSONResponse as jest.Mock).mockReturnValueOnce({});

    const response = await getWeatherByCityName(event as ValidatedEventAPIGatewayProxyEvent<typeof schema>);

    expect(getForecast).toBeCalledWith('New York');
    expect(formatJSONResponse).toBeCalledWith(
      {
        error: errorMessage,
      },
      400
    );
    expect(response).toEqual({});
  });
});
