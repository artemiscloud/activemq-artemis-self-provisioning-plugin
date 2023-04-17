import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { useTranslation } from '../i18n';

const BrokerContainerBreadcrumb = (props: { currentName: string }) => {
  const { t } = useTranslation();
  const addBrokerName = () => {
    if (props.currentName) {
      return (
        <BreadcrumbItem to="/k8s/all-namespaces/brokers/:name" isActive>
          {props.currentName}
        </BreadcrumbItem>
      );
    }
    return;
  };

  return (
    <Breadcrumb className="pf-u-mb-md">
      <BreadcrumbItem to="/k8s/all-namespaces/brokers">
        {t('brokers')}
      </BreadcrumbItem>
      {addBrokerName()}
    </Breadcrumb>
  );
};

export { BrokerContainerBreadcrumb };
