/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { EuiSpacer, EuiPanel, EuiFlexGroup, EuiFlexItem, EuiText, EuiProgress } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';

import { FieldTypeIcon } from '../../../../components/field_type_icon';
import { DisplayValue } from '../../../../components/display_value';
import { getMLJobTypeAriaLabel } from '../../../../util/field_types_utils';

export function FieldStatsCard({ field }) {
  let type = field.type;
  if (type === 'double' || type === 'long') {
    type = 'number';
  }

  const typeAriaLabel = getMLJobTypeAriaLabel(type);
  const cardTitleAriaLabel = [field.name];
  if (typeAriaLabel) {
    cardTitleAriaLabel.unshift(typeAriaLabel);
  }

  return (
    <EuiPanel hasShadow={false} className="mlFieldDataCard">
      <div className="ml-field-data-card" data-test-subj="mlPageFileDataVisFieldDataCard">
        <div className={`ml-field-title-bar ${type}`}>
          <FieldTypeIcon type={type} needsAria={false} />
          <div className="field-name" tabIndex="0" aria-label={`${cardTitleAriaLabel.join(', ')}`}>
            {field.name}
          </div>
        </div>

        <div className="mlFieldDataCard__content">
          {field.count > 0 && (
            <React.Fragment>
              <div className="stats">
                <div className="stat">
                  <i className="fa fa-files-o" aria-hidden="true" />
                  &nbsp;
                  <FormattedMessage
                    id="xpack.ml.fileDatavisualizer.fieldStatsCard.documentsCountDescription"
                    defaultMessage="{fieldCount, plural, zero {# document} one {# document} other {# documents}} ({fieldPercent}%)"
                    values={{
                      fieldCount: field.count,
                      fieldPercent: field.percent,
                    }}
                  />
                </div>
                <div className="stat">
                  <i className="fa fa-cubes" aria-hidden="true" />
                  &nbsp;
                  <FormattedMessage
                    id="xpack.ml.fileDatavisualizer.fieldStatsCard.distinctCountDescription"
                    defaultMessage="{fieldCardinality} distinct {fieldCardinality, plural, zero {value} one {value} other {values}}"
                    values={{
                      fieldCardinality: field.cardinality,
                    }}
                  />
                </div>

                {field.median_value && (
                  <React.Fragment>
                    <div>
                      <div className="stat min heading">
                        <FormattedMessage
                          id="xpack.ml.fileDatavisualizer.fieldStatsCard.minTitle"
                          defaultMessage="min"
                        />
                      </div>
                      <div className="stat median heading">
                        <FormattedMessage
                          id="xpack.ml.fileDatavisualizer.fieldStatsCard.medianTitle"
                          defaultMessage="median"
                        />
                      </div>
                      <div className="stat max heading">
                        <FormattedMessage
                          id="xpack.ml.fileDatavisualizer.fieldStatsCard.maxTitle"
                          defaultMessage="max"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="stat min value">
                        <DisplayValue value={field.min_value} />
                      </div>
                      <div className="stat median value">
                        <DisplayValue value={field.median_value} />
                      </div>
                      <div className="stat max value">
                        <DisplayValue value={field.max_value} />
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </div>

              {field.top_hits && (
                <React.Fragment>
                  <EuiSpacer size="s" />

                  <div className="stats">
                    <div className="stat">
                      <FormattedMessage
                        id="xpack.ml.fileDatavisualizer.fieldStatsCard.topStatsValuesDescription"
                        defaultMessage="top values"
                      />
                    </div>
                    {field.top_hits.map(({ count, value }) => {
                      const pcnt = Math.round((count / field.count) * 100 * 100) / 100;
                      return (
                        <EuiFlexGroup gutterSize="xs" alignItems="center" key={value}>
                          <EuiFlexItem
                            grow={false}
                            style={{ width: 100 }}
                            className="eui-textTruncate"
                          >
                            <EuiText size="xs" textAlign="right" color="subdued">
                              {value}&nbsp;
                            </EuiText>
                          </EuiFlexItem>
                          <EuiFlexItem>
                            <EuiProgress value={count} max={field.count} color="primary" size="m" />
                          </EuiFlexItem>
                          <EuiFlexItem
                            grow={false}
                            style={{ width: 70 }}
                            className="eui-textTruncate"
                          >
                            <EuiText size="xs" textAlign="left" color="subdued">
                              {pcnt}%
                            </EuiText>
                          </EuiFlexItem>
                        </EuiFlexGroup>
                      );
                    })}
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          {field.count === 0 && (
            <div className="stats">
              <div className="stat">
                <FormattedMessage
                  id="xpack.ml.fileDatavisualizer.fieldStatsCard.noFieldInformationAvailableDescription"
                  defaultMessage="No field information available"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </EuiPanel>
  );
}
