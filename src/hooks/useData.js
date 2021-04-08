import { useContext } from 'react';
import { context } from '../providers/DataProvider';

export default () => {
  const data = useContext(context);
  return data;
};
