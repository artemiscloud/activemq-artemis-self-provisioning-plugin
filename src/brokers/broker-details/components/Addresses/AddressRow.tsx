import { FC, useContext } from 'react';
import {
  RowProps,
  TableData,
  TableColumn,
} from '@openshift-console/dynamic-plugin-sdk';
import { Address } from '../../../../openapi/jolokia/requests';
import { useJolokiaServiceReadAddressAttributes } from '../../../../openapi/jolokia/queries';
import { AuthContext } from '../../../../jolokia/customHooks';
import { Link } from 'react-router-dom-v5-compat';

export type AddressRowProps = RowProps<Address> & {
  columns: TableColumn<Address>[];
};

export const AddressRow: FC<AddressRowProps> = ({
  obj,
  activeColumnIDs,
  columns,
}) => {
  const { name } = obj;
  const authToken = useContext(AuthContext);
  const { data: routingTypes, isSuccess } =
    useJolokiaServiceReadAddressAttributes({
      jolokiaSessionId: authToken,
      name: name,
      attrs: ['RoutingTypes'],
    });

  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        <Link to={`address/${name}`}>{name}</Link>
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {isSuccess
          ? routingTypes.map((item, index) => (
              <span key={index}>{item.value}</span>
            ))
          : 'loading'}
      </TableData>
    </>
  );
};
