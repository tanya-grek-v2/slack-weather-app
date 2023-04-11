import axios from 'axios';
import { getForecast } from './getForecast';
// import { IForecast } from '../interfaces/IForecast';

jest.mock('axios');

describe('getForecast', () => {
  const address = 'New York';
  const weatherData = {
    location: {
      name: 'New York',
      region: 'New York',
      country: 'United States',
    },
    current: {
      weather_descriptions: ['Cloudy'],
      weather_icons: ['icon-url'],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return forecast data when valid address is provided', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: weatherData });

    const forecast = await getForecast(address);

    expect(axios.get).toBeCalledWith(
      `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_ACCESS_KEY}&query=${address}&units=f`
    );
    expect(forecast).toEqual(weatherData);
  });

  it('should throw an error when API call fails', async () => {
    const errorMessage = 'Failed to fetch weather data';

    (axios.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(getForecast(address)).rejects.toThrow(errorMessage);
    expect(axios.get).toBeCalledWith(
      `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_ACCESS_KEY}&query=${address}&units=f`
    );
  });
});
