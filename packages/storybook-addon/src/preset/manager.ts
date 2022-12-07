import { addons, types } from '@storybook/addons';
import { ADDON_ID, PARAM_KEY } from '../constants';
import { Panel } from '../components/Panel';

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    type: types.PANEL,
    title: 'Apollo Operations',
    paramKey: PARAM_KEY,
    render: Panel,
  });
});
