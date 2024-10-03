import { FC } from 'react';
import { Tr, Td } from '@patternfly/react-table';
import { ComponentAttribute } from '@app/openapi/jolokia/requests';

type AddressDetailsRowProps = {
  attribute: ComponentAttribute;
};

export const AddressDetailsRow: FC<AddressDetailsRowProps> = ({
  attribute,
}) => {
  return (
    <Tr>
      <Td dataLabel="Attribute">{attribute.request.attribute}</Td>
      <Td dataLabel="Value">{JSON.stringify(attribute.value)}</Td>
    </Tr>
  );
};
