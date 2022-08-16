import axios  from 'axios';
import { IForecast } from '../interfaces/IForecast';

export const getForecast = async (address): Promise<IForecast> => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_ACCESS_KEY}&query=${address}&units=f`

  return await axios.get(url).then(({ data }) => data);
}
