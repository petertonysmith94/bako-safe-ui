import {
  AvatarGroup,
  BoxProps,
  Flex,
  HStack,
  Icon,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { ITransferAsset } from 'bakosafe';
import { bn } from 'fuels';

import { CustomSkeleton, UnknownIcon } from '@/components';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { assetsMap } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetAssetsByOperations } from '../../hooks';
import { TransactionWithVault } from '../../services';
interface TransactionCardAmountProps extends BoxProps {
  transaction: TransactionWithVault;
  isDeposit: boolean;
  isInDetailsDialog?: boolean;
  isContract: boolean;
}

const Amount = ({
  transaction,
  isDeposit,
  isInDetailsDialog,
  isContract,
  ...rest
}: TransactionCardAmountProps) => {
  const { operationAssets, hasNoDefaultAssets } =
    useGetAssetsByOperations(transaction);

  const [showOnlyOneAsset] = useMediaQuery('(max-width: 400px)');
  const {
    tokensUSD,
    screenSizes: { isMobile, isExtraSmall },
  } = useWorkspaceContext();

  const totalAmoutSent = transaction.assets
    .reduce((total, asset) => total.add(bn.parseUnits(asset.amount)), bn(0))
    .format();

  const oneAssetOfEach = transaction.assets.reduce((uniqueAssets, current) => {
    if (!uniqueAssets.find((asset) => asset.assetId === current.assetId)) {
      uniqueAssets.push(current);
    }

    return uniqueAssets;
  }, [] as ITransferAsset[]);

  const isMultiToken = oneAssetOfEach.length >= 2;

  const txUSDAmount = useTxAmountToUSD(
    hasNoDefaultAssets && isDeposit ? [operationAssets] : transaction.assets,
    tokensUSD?.isLoading,
    tokensUSD?.data,
  );

  return (
    <HStack
      alignItems="center"
      justifyContent="flex-start"
      w={isExtraSmall ? 150 : 200}
      {...rest}
    >
      {isContract ? null : (
        <>
          <AvatarGroup
            max={showOnlyOneAsset ? 1 : 3}
            w={isMobile ? 'unset' : 56}
            justifyContent={isMobile ? 'start' : 'end'}
            position="relative"
          >
            {hasNoDefaultAssets && (
              <Icon
                key={assetsMap[operationAssets.assetId]?.assetId}
                w={6}
                h={6}
                as={assetsMap[operationAssets.assetId]?.icon ?? UnknownIcon}
              />
            )}

            {oneAssetOfEach.map((asset) => (
              <Icon
                key={asset.assetId}
                w={6}
                h={6}
                as={assetsMap[asset.assetId]?.icon ?? UnknownIcon}
              />
            ))}
          </AvatarGroup>
          <Flex
            flexDir={isMultiToken ? 'column-reverse' : 'column'}
            w="full"
            mt={0.5}
            textAlign="center"
          >
            {isMultiToken ? (
              <Text color="grey.425" fontSize="xs">
                Multi-token
              </Text>
            ) : (
              <Text color="grey.75" fontSize="sm">
                {hasNoDefaultAssets ? operationAssets.amount : totalAmoutSent}
              </Text>
            )}
            <Text
              variant="description"
              fontSize={isMultiToken ? 'sm' : 'xs'}
              color={isMultiToken ? ' grey.75' : 'grey.425'}
            >
              <CustomSkeleton isLoaded={!tokensUSD?.isLoading}>
                ${txUSDAmount ?? 0}
              </CustomSkeleton>
            </Text>
          </Flex>
        </>
      )}
    </HStack>
  );
};

export { Amount };
