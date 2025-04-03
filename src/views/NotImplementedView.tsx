import { FunctionComponent } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props {
  name?: string;
}

/**
 * Boilerplate for non-implemented Views
 */
const NotImplementedView: FunctionComponent<Props> = ({ name }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { id: paramId } = useParams();
  const componentName = name || 'View';

  return (
    <div>
      <h1>
        {componentName} {t('notFoundView.isUnderConstruction')}
      </h1>
      <p>
        {t('notFoundView.thisViewisnotImplemented')} <Link to="/">{t('notFoundView.gotoHomePage')}</Link>
      </p>
      <p>
        {t('notFoundView.youcalledthe')} <b>{location?.pathname}</b> {t('notFoundView.url')}
        {paramId && (
          <span>
            {t('notFoundView.where')} <b>{paramId}</b> {t('notFoundView.isaparameter')}
          </span>
        )}
      </p>
    </div>
  );
};

export default NotImplementedView;
