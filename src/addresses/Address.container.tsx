import { FC, useContext } from 'react';
import { Addresses } from './Address.component';
import { AuthContext } from '../utils';
import { useJolokiaServiceGetAddresses } from '../openapi/jolokia/queries';

const AddressContainer: FC = () => {
  const authToken = useContext(AuthContext);

  const { data: addresses, isSuccess } = useJolokiaServiceGetAddresses({
    jolokiaSessionId: authToken,
  });

  if (isSuccess) {
    return (
      <Addresses
        addressData={addresses}
        isLoaded={isSuccess}
        loadError={!isSuccess}
      />
    );
  } else {
    return <></>;
  }
};

export { AddressContainer };
