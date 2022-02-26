import { addons, RenderOptions, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import { ADDON_ID, PARAM_KEY } from './constants';
import { ApolloClientPanel } from './panel';

addons.register(ADDON_ID, (api) => {
  addons.add(ADDON_ID, {
    type: types.PANEL,
    title: 'Apollo Operations',
    paramKey: PARAM_KEY,
    render({ active = false, key }: RenderOptions) {
      const globals = api.getGlobals();
      const operationMeta = globals[`${ADDON_ID}/operations`];
      return (
        <AddonPanel key={key} active={active}>
          {operationMeta?.length > 0 && <ApolloClientPanel operationMeta={operationMeta} />}
        </AddonPanel>
      );
    },
  });
});
