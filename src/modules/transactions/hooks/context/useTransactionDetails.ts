import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '@/modules/auth';
import { useGetParams } from '@/modules/core';
import { useHomeTransactions } from '@/modules/home/hooks/useHomeTransactions';
import {
  StatusFilter,
  useVaultTransactionsList,
} from '@/modules/vault/hooks/list/useVaultTransactionsList';

import { useTransactionList, useTransactionsSignaturePending } from '../list';
import { usePendingTransactionsList } from '../list/useGetPendingTransactionsList';
import { useSignTransaction } from '../signature';

export type IuseTransactionDetails = ReturnType<typeof useTransactionDetails>;

const useTransactionDetails = () => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  const {
    userInfos: { workspace },
  } = useAuth();

  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

  const homeTransactions = useHomeTransactions(workspace?.id);
  const pendingSignerTransactions = useTransactionsSignaturePending([vaultId!]);
  const vaultTransactions = useVaultTransactionsList({
    vaultId: vaultId!,
  });
  const transactionsPageList = useTransactionList({
    workspaceId: workspace?.id,
  });

  const pendingTransactions = usePendingTransactionsList(
    homeTransactions.transactions!,
    transactionsPageList.lists.transactions!,
    vaultTransactions.lists.transactions,
  );

  const signTransaction = useSignTransaction({
    transactionList: transactionsPageList,
    pendingSignerTransactionsRefetch: pendingSignerTransactions.refetch,
    homeTransactionsRefetch: homeTransactions.request.refetch,
    pendingTransactions: pendingTransactions,
  });

  const resetAllTransactionsTypeFilters = () => {
    transactionsPageList.handlers.listTransactionTypeFilter(undefined);
    transactionsPageList.filter.set(StatusFilter.ALL);
    vaultTransactions.handlers.listTransactionTypeFilter(undefined);
    vaultTransactions.filter.set(StatusFilter.ALL);
  };

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currentPath = location.pathname;
    const hasSelectedTransaction =
      !!vaultTransactions.handlers.selectedTransaction?.id;

    return () => {
      const isNavigatingAway = currentPath !== prevPath;
      const isLeavingVault = !currentPath.includes('vault');

      if (isNavigatingAway || isLeavingVault) {
        hasSelectedTransaction &&
          vaultTransactions.handlers.setSelectedTransaction({
            id: '',
            name: '',
          });

        resetAllTransactionsTypeFilters();
      }

      prevPathRef.current = currentPath;
    };
  }, [location.pathname, vaultTransactions.handlers.selectedTransaction?.id]);

  return {
    homeTransactions,
    vaultTransactions,
    transactionsPageList,
    signTransaction,
    pendingSignerTransactions,
    isPendingSigner:
      pendingSignerTransactions.data?.transactionsBlocked ?? false,
    pendingSignerTransactionsLength:
      pendingSignerTransactions.data?.ofUser || 0,
    resetAllTransactionsTypeFilters,
  };
};

export { useTransactionDetails };
