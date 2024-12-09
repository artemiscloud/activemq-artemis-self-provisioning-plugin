import { FC } from 'react';
import {
  Title,
  PageSection,
  //PageSectionVariants,
  Alert,
  Nav,
  NavItem,
  NavList,
} from '@patternfly/react-core';
import { useTranslation } from '@app/i18n/i18n';
import { ClientsContainer } from './components/Clients/Clients.container';
import { BrokerDetailsBreadcrumb } from './components/BrokerDetailsBreadcrumb/BrokerDetailsBreadcrumb';
// import {
//   JolokiaAcceptorDetails,
//   JolokiaAddressDetails,
//   JolokiaBrokerDetails,
//   JolokiaQueueDetails,
//   JolokiaTestPanel,
// } from './components/JolokiaDevComponents';
import { OverviewContainer } from './components/Overview/Overview.container';
import { PodsContainer } from '@app/brokers/broker-details/components/broker-pods/PodsList.container';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom-v5-compat';
import { JolokiaAuthentication } from '@app/jolokia/components/JolokiaAuthentication';
import { useGetBrokerCR } from '@app/k8s/customHooks';
import { YamlContainer } from './components/yaml/Yaml.container';
//import { AuthContext } from '@app/jolokia/context';
import { BrokerCR } from '@app/k8s/types';
//import {
//GreenCheckCircleIcon,
//RedExclamationCircleIcon,
//} from '@openshift-console/dynamic-plugin-sdk';

type AuthenticatedPageContentPropType = {
  brokerCr: BrokerCR;
  name: string;
  namespace: string;
  loading: boolean;
  error: string;
};
// const AuthenticatedPageContent: FC<AuthenticatedPageContentPropType> = ({
//    brokerCr,
//    name,
//    namespace,
//    loading: loadingBrokerCr,
//    error: errorBrokerCr,
// }) => {
//   const { t } = useTranslation();
//  // const { tab } = useParams<{ tab?: string }>();
//  // const activeTabKey = tab || 'overview';
//  //   const navigate = useNavigate();
//   // const handleTabSelect = (_event: any, eventKey: string | number) => {
//   //   navigate(`/k8s/ns/${namespace}/brokers/${name}/${eventKey}`);
//   // };

//   // const {
//   //   isSuccess: isSuccessToken,
//   //   isLoading: isLoadingToken,
//   //   isError: isErrorToken,
//   // } = useContext(AuthContext);

//   const [activeItem, setActiveItem] = useState(0);

//   const onSelect = (_event: React.FormEvent<HTMLInputElement>, result: { itemId: number | string }) => {
//     setActiveItem(result.itemId as number);
//    // navigate(`/k8s/ns/${namespace}/brokers/${name}/${id}`);
//   };

//   return (
//     <PageSection
//       variant={PageSectionVariants.light}
//       padding={{ default: 'noPadding' }}
//       className="pf-c-page__main-tabs"
//     >
//       <div className="pf-u-mt-md pf-u-mb-md">
//         <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
//         <Title headingLevel="h2" className="pf-u-ml-md">
//           {t('Broker')} {name}
//         </Title>
//       </div>
//       {errorBrokerCr && <Alert variant="danger" title={errorBrokerCr} />}
//       <Nav onSelect={onSelect} variant="horizontal" aria-label="Horizontal nav local" >
//         <NavList>
//          <NavItem preventDefault id='overview' to={`/k8s/ns/${namespace}/brokers/${name}/yaml`} itemId={0} isActive={activeItem === 0}>
//           <OverviewContainer
//             name={name}
//             namespace={namespace}
//             cr={brokerCr}
//             loading={loadingBrokerCr}
//           />
//           </NavItem>
//           <NavItem id='yaml' to={`/k8s/ns/${namespace}/brokers/${name}/yaml`} itemId={0} isActive={activeItem === 0}>
//           {loadingBrokerCr ? (
//             <Spinner size="md" />
//           ) : (
//             <YamlContainer brokerCr={brokerCr} />
//           )}
//           </NavItem>
//         </NavList>
//         {/* <Tab
//           eventKey={'overview'}
//           title={<TabTitleText>{t('Overview')}</TabTitleText>}
//         >
//           <OverviewContainer
//             name={name}
//             namespace={namespace}
//             cr={brokerCr}
//             loading={loadingBrokerCr}
//           />
//         </Tab>
//         <Tab
//           eventKey={'clients'}
//           title={<TabTitleText>{t('Clients')}</TabTitleText>}
//         >
//           <ClientsContainer />
//         </Tab>
//         <Tab eventKey={'pods'} title={<TabTitleText>{t('Pods')}</TabTitleText>}>
//           <PodsContainer />
//         </Tab>
//         <Tab eventKey={'yaml'} title={<TabTitleText>{t('YAML')}</TabTitleText>}>
//           {loadingBrokerCr ? (
//             <Spinner size="md" />
//           ) : (
//             <YamlContainer brokerCr={brokerCr} />
//           )}
//         </Tab>
//         {process.env.NODE_ENV === 'development' && (
//           <Tab
//             eventKey={'jolokiaTestPanel'}
//             title={
//               <TabTitleText>
//                 {t('check-jolokia ')}
//                 {isLoadingToken && (
//                   <Spinner size="sm" aria-label={t('connecting to jolokia')} />
//                 )}
//                 {isSuccessToken && (
//                   <GreenCheckCircleIcon title={t('Jolokia connected')} />
//                 )}
//                 {isErrorToken && (
//                   <RedExclamationCircleIcon
//                     title={t('Jolokia connection failed')}
//                   />
//                 )}
//               </TabTitleText>
//             }
//           >
//             <JolokiaTestPanel />
//             <br />
//           </Tab>
//         )}
//         {process.env.NODE_ENV === 'development' && (
//           <Tab
//             eventKey={'jolokia-details'}
//             title={
//               <TabTitleText>
//                 {t('jolokia-details')}
//                 {isLoadingToken && (
//                   <Spinner size="sm" aria-label={t('connecting to jolokia')} />
//                 )}
//                 {isSuccessToken && (
//                   <GreenCheckCircleIcon title={t('Jolokia connected')} />
//                 )}
//                 {isErrorToken && (
//                   <RedExclamationCircleIcon
//                     title={t('Jolokia connection failed')}
//                   />
//                 )}
//               </TabTitleText>
//             }
//           >
//             <Tabs defaultActiveKey={0}>
//               <Tab
//                 eventKey={0}
//                 title={<TabTitleText>{t('broker')}</TabTitleText>}
//               >
//                 <JolokiaBrokerDetails />
//               </Tab>
//               <Tab
//                 eventKey={1}
//                 title={<TabTitleText>{t('addresses')}</TabTitleText>}
//               >
//                 <JolokiaAddressDetails />
//               </Tab>
//               <Tab
//                 eventKey={2}
//                 title={<TabTitleText>{t('acceptors')}</TabTitleText>}
//               >
//                 <JolokiaAcceptorDetails />
//               </Tab>
//               <Tab
//                 eventKey={3}
//                 title={<TabTitleText>{t('queues')}</TabTitleText>}
//               >
//                 <JolokiaQueueDetails />
//               </Tab>
//             </Tabs>
//           </Tab>
//         )} */}
//       </Nav>
//     </PageSection>
//   );
// };

// export const BrokerDetailsPage: FC = () => {
//   const { ns: namespace, name } = useParams<{ ns?: string; name?: string }>();

//   const { brokerCr, isLoading, error } = useGetBrokerCR(name, namespace);
//   return (
//     <>
//       <JolokiaAuthentication brokerCR={brokerCr} podOrdinal={0}>
//         <AuthenticatedPageContent
//           brokerCr={brokerCr}
//           name={name}
//           namespace={namespace}
//           loading={isLoading}
//           error={error}
//         />
//       </JolokiaAuthentication>
//     </>
//   );
// };

// export const App: FC = () => {
//   return <BrokerDetailsPage />;
// };

const AuthenticatedPageContent: FC<AuthenticatedPageContentPropType> = ({
  brokerCr,
  name,
  namespace,
  loading,
  error,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'overview';

  const handleNavClick = (tab: string) => {
    searchParams.set('tab', tab);
    navigate({ search: searchParams.toString() });
  };

  return (
    <PageSection
      //variant={PageSectionVariants.light}
      isFilled
      // padding={{ default: 'noPadding' }}
      // className="pf-c-page__main-tabs"
    >
      <div className="pf-u-mt-md pf-u-mb-md">
        <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
        <Title headingLevel="h2" className="pf-u-ml-md">
          {t('Broker')} {name}
        </Title>
      </div>
      {error && <Alert variant="danger" title={error} />}
      <Nav variant="horizontal" aria-label="Broker details navigation">
        <NavList>
          <NavItem
            isActive={activeTab === 'overview'}
            onClick={() => handleNavClick('overview')}
          >
            {t('Overview')}
          </NavItem>
          <NavItem
            isActive={activeTab === 'clients'}
            onClick={() => handleNavClick('clients')}
          >
            {t('Clients')}
          </NavItem>
          <NavItem
            isActive={activeTab === 'pods'}
            onClick={() => handleNavClick('pods')}
          >
            {t('Pods')}
          </NavItem>
          <NavItem
            isActive={activeTab === 'yaml'}
            onClick={() => handleNavClick('yaml')}
          >
            {t('YAML')}
          </NavItem>
        </NavList>
      </Nav>
      <PageSection isFilled>
        {activeTab === 'overview' && (
          <OverviewContainer
            name={name}
            namespace={namespace}
            cr={brokerCr}
            loading={loading}
          />
        )}
        {activeTab === 'clients' && <ClientsContainer />}
        {activeTab === 'pods' && <PodsContainer />}
        {activeTab === 'yaml' && <YamlContainer brokerCr={brokerCr} />}
      </PageSection>
    </PageSection>
  );
};

export const BrokerDetailsPage: FC = () => {
  const { ns: namespace, name } = useParams<{ ns?: string; name?: string }>();
  const { brokerCr, isLoading, error } = useGetBrokerCR(name, namespace);

  return (
    <JolokiaAuthentication brokerCR={brokerCr} podOrdinal={0}>
      <AuthenticatedPageContent
        brokerCr={brokerCr}
        name={name}
        namespace={namespace}
        loading={isLoading}
        error={error}
      />
    </JolokiaAuthentication>
  );
};

export const App: FC = () => {
  return <BrokerDetailsPage />;
};
