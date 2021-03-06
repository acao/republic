import React from 'react';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';

function dispatchActions(store, renderProps) {
  const flattenActions = (flattened, { actions } = { actions: [] }) => flattened.concat(actions);
  const actions = renderProps.components.reduce(flattenActions, []);
  actions.map(action => store.dispatch(action(renderProps.props)));
}

function appHtml(store, renderProps) {
  dispatchActions(store, renderProps);

  return renderToString(
    <Provider store={store}>
      <RouterContext { ...renderProps } />
    </Provider>
  );
}

function initialStateScript(initialState) {
  const __html = `window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}`;
  return <script dangerouslySetInnerHTML={{ __html }} key="initialStateScript"></script>;
}

function clientScript() {
  return <script src="/assets/javascripts/client.dist.js" key="clientScript"></script>;
}

export default function ({ appTree, store, renderProps }) {
  const Layout = appTree.app.views.layouts.server.default;
  const __html = appHtml(store, renderProps);

  return (
    <Layout>
      <div id="republic-app"
           dangerouslySetInnerHTML={{ __html }} />
      {initialStateScript(store.getState())}
      {clientScript()}
    </Layout>
  );
}
