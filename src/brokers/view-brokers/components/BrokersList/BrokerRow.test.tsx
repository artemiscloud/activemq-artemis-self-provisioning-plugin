import {render,screen,waitForI18n} from "../../../../test-utils"
import { BrokerRow } from "./BrokerRow";

const obj = {
    metadata: {
      name: 'test-1',
      creationTimestamp: '2023-07-24T12:34:56Z',
      namespace: 'test-namespace',
    },
    spec: {
      deploymentPlan: {
        size: 2,
      },
    },
    status: {
      conditions: [
        {
          type: 'Ready',
          status: 'True',
        },
      ],
    },
  };
  const activeColumnIDs = new Set(['column1', 'column2', 'column3', 'column4', 'column5', 'column6']);
  const columns = [
    { title: 'Name', id: 'column1', label: 'Name' },
    { title: 'Ready', id: 'column2', label: 'Ready' },
    { title: 'Status', id: 'column3', label: 'Status' },
    { title: 'Size', id: 'column4', label: 'Size' },
    { title: 'Creation Timestamp', id: 'column5', label: 'Creation Timestamp' },
    { title: 'Actions', id: 'column6', label: 'Actions' },
  ];
  const onEditBroker = jest.fn();
  const onOpenModal = jest.fn();

describe ('BrokerRow',() => {

    it('should render the componet currectly',async() =>{
        const comp = render(
            <BrokerRow
            obj={obj}
            activeColumnIDs={activeColumnIDs}
            columns={columns}
            onEditBroker={onEditBroker}
            onOpenModal={onOpenModal} rowData={undefined}            />
          );
       
        await waitForI18n(comp);
        expect(screen.getByText('test1')).toBeInTheDocument();
        expect(screen.getByText('Ready')).toBeInTheDocument();
    })
})