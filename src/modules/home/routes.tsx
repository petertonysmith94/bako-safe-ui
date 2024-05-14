import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';
import { HomePage } from '@/modules/home/pages';
import { UserVaultsPage } from '@/modules/vault/pages';

import { UserTransactionsPage } from '../transactions/pages/user-transactions';

const homeRoutes = (
  <Route
    Component={() => {
      return <DashboardLayoutRouter />;
    }}
  >
    <Route
      path={Pages.home()}
      element={
        <AuthRoute>
          <HomePage />
        </AuthRoute>
      }
    />

    <Route
      path={Pages.userVaults()}
      element={
        <AuthRoute>
          <UserVaultsPage />
        </AuthRoute>
      }
    />
    <Route
      path={Pages.userTransactions()}
      element={
        <AuthRoute>
          <UserTransactionsPage />
        </AuthRoute>
      }
    />
  </Route>
);

export { homeRoutes };
