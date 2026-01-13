/**
 * React hook to access the API context provider.
 * Throws an error if used outside of ApiProvider, ensuring proper context usage.
 * Note: Must be used within components wrapped by ApiProvider from ApiContext.
 */
import { useContext } from 'react';
import ApiContext from 'src/contexts/ApiContext';

const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default useApi;
