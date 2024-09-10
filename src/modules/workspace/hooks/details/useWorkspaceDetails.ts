import { setupAxiosInterceptors } from '@/config';
import {
  useAddressBook,
  useGetParams,
  useGetWorkspaceRequest,
  useQueryParams,
  useScreenSize,
  useVaultAssets,
  useVaultByIdRequest,
} from '@/modules';
import { useAuth } from '@/modules/auth';
import { useTokensUSDAmountRequest } from '@/modules/home/hooks/useTokensUSDAmountRequest';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';

import { useGitLoadingRequest } from '../useGifLoadingRequest';
import { useIsWorkspaceReady } from '../useIsWorkspaceReady';
import { useWorkspace } from '../useWorkspace';

const useWorkspaceDetails = () => {
  const screenSizes = useScreenSize();
  const { sessionId } = useQueryParams();

  const authDetails = useAuth();
  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

  const {
    resetAllTransactionsTypeFilters,
    pendingSignerTransactions: { refetch: refetchPendingSingerTransactions },
  } = useTransactionsContext();

  setupAxiosInterceptors(!!sessionId, authDetails.handlers.logout);

  const {
    isLoading: isGifAnimationLoading,
    refetch: invalidateGifAnimationRequest,
  } = useGitLoadingRequest();

  const {
    handlers: { hasPermission, ...handlersData },
    requests: { workspaceBalance, latestPredicates, ...requestsData },
    ...rest
  } = useWorkspace(
    authDetails.userInfos,
    invalidateGifAnimationRequest,
    resetAllTransactionsTypeFilters,
    refetchPendingSingerTransactions,
  );

  const { workspace: currentWorkspace, ...currentWorkspaceData } =
    useGetWorkspaceRequest(authDetails.userInfos.workspace?.id);

  const tokensUSD = useTokensUSDAmountRequest();
  const addressBookInfos = useAddressBook(authDetails, hasPermission);
  const vaultRequest = useVaultByIdRequest(vaultId ?? '');
  const vaultAssets = useVaultAssets(
    authDetails.userInfos.workspace?.id,
    vaultId ?? '',
  );

  const { isWorkspaceReady, isFilteringInProgress } = useIsWorkspaceReady({
    isAddressbookInfosLoading:
      addressBookInfos.requests.listContactsRequest.isLoading,
    isGifAnimationLoading,
    isLatestsPredicatesLoading: latestPredicates.isLoading,
    isUserInfosLoading: authDetails.userInfos.isLoading,
    isVaultAssetsLoading: vaultAssets.isLoading,
    isVaultRequestLoading: vaultRequest.isLoading,
    isWorkspaceBalanceLoading: workspaceBalance.isLoading,
  });

  return {
    isWorkspaceReady,
    isFilteringInProgress,
    authDetails,
    workspaceInfos: {
      currentWorkspaceRequest: {
        currentWorkspace,
        ...currentWorkspaceData,
      },
      handlers: { hasPermission, ...handlersData },
      requests: { workspaceBalance, latestPredicates, ...requestsData },
      ...rest,
    },
    vaultDetails: {
      vaultRequest,
      assets: vaultAssets,
    },
    addressBookInfos,
    tokensUSD,
    invalidateGifAnimationRequest,
    screenSizes,
  };
};

export { useWorkspaceDetails };
