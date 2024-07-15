import { FC, useEffect, useState } from 'react';
import { parsePrometheusDuration } from '../../../../Overview/Metrics/utils/prometheus';
import { getMaxSamplesForSpan, valueFormatter } from '../../utils/format';
import { useFetchCpuUsageMetrics } from '../../hooks/useFetchCpuUsageMetrics';
import { useTranslation } from '../../../../../../../i18n/i18n';
import { CardQueryBrowser } from '../CardQueryBrowser/CardQueryBrowser';

export type CardBrokerCPUUsageMetricsContainerProps = {
  name: string;
  namespace: string;
  defaultSamples?: number;
  timespan?: number;
  fixedEndTime?: number;
  size: number;
  pollTime?: string;
};

type AxisDomain = [number, number];

export const CardBrokerCPUUsageMetricsContainer: FC<
  CardBrokerCPUUsageMetricsContainerProps
> = ({
  name,
  namespace,
  defaultSamples = 300,
  timespan: span,
  size,
  pollTime,
}) => {
  const { t } = useTranslation();

  const fetchCpuUsageMetrics = useFetchCpuUsageMetrics(size);
  //states
  const [xDomain] = useState<AxisDomain>();
  // If we have both `timespan` and `defaultTimespan`, `timespan` takes precedence
  // Limit the number of samples so that the step size doesn't fall below minStep
  const maxSamplesForSpan = defaultSamples || getMaxSamplesForSpan(span);
  const [samples, setSamples] = useState(maxSamplesForSpan);

  // Define this once for all queries so that they have exactly the same time range and X values
  const endTime = xDomain?.[1];

  // If provided, `timespan` overrides any existing span setting
  useEffect(() => {
    if (span) {
      setSamples(defaultSamples || getMaxSamplesForSpan(span));
    }
  }, [defaultSamples, span]);

  const [result, loaded] = fetchCpuUsageMetrics({
    name,
    namespace,
    span,
    samples,
    endTime,
    delay: parsePrometheusDuration(pollTime),
  });

  // const data: GraphSeries[] = [];
  const yTickFormat = valueFormatter('');

  return (
    <CardQueryBrowser
      isInitialLoading={false}
      backendUnavailable={false}
      allMetricsSeries={result}
      span={span}
      isLoading={!loaded}
      fixedXDomain={xDomain}
      samples={samples}
      formatSeriesTitle={(labels) => labels.pod}
      title={t('cpu_usage')}
      helperText={t('cpu_usage_help_text')}
      dataTestId={'metrics-broker-cpu-usage'}
      yTickFormat={yTickFormat}
      ariaTitle={t('cpu_usage')}
      // data={data}
    />
  );
};
