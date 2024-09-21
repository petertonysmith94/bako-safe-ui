import { Box, Divider, Text, VStack } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  CustomSkeleton,
  Dialog,
  LineCloseIcon,
  TransactionExpire,
} from '@/components';
import { Dapp } from '@/layouts/dapp';
import { useQueryParams } from '@/modules/auth/hooks';
import { VaultItemBox } from '@/modules/vault/components/modal/box';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { UseTransactionSocket, useVerifyBrowserType } from '../../hooks';
import { DappError } from '../connection';
import { DappTransaction } from '.';

interface DappTransactionWrapperProps {
  title: string;
  actionLoading: boolean;
  validAt: UseTransactionSocket['validAt'];
  vault?: UseTransactionSocket['vault'];
  pendingSignerTransactions: UseTransactionSocket['pendingSignerTransactions'];
  summary: UseTransactionSocket['summary'];
  cancelTransaction: UseTransactionSocket['cancelTransaction'];
  actionButton: ReactNode;
}

const DappTransactionWrapper = (props: DappTransactionWrapperProps) => {
  const {
    title,
    validAt,
    actionLoading,
    vault,
    pendingSignerTransactions,
    summary: { transactionSummary, isPending: isLoadingTransactionSummary },
    cancelTransaction,
    actionButton,
  } = props;

  const [closePopover, setClosePopover] = useState(false);

  const {
    workspaceInfos: {
      handlers: { goHome },
    },
  } = useWorkspaceContext();

  const { isSafariBrowser } = useVerifyBrowserType();
  const inView = useInView();
  const { sessionId, request_id, name, origin } = useQueryParams();

  if (!sessionId || !request_id) {
    window.close();
    goHome();
  }

  useEffect(() => {
    setClosePopover(inView.inView);
  }, [inView.inView]);

  return (
    <>
      <Box position="fixed" top={0} w="full" zIndex={100} left={0}>
        <TransactionExpire validAt={validAt} callBack={cancelTransaction} />
      </Box>
      <Dapp.Content maxW={404} bg="dark.950">
        <Dapp.Section mb={-7}>
          <Dapp.Header
            title={title}
            description="Send single or batch payments with multi assets. You can send multiple types of assets to different addresses."
            titleFontSize="16px"
            descriptionFontSize="12px"
          />

          {isSafariBrowser && (
            <LineCloseIcon
              onClick={cancelTransaction}
              fontSize="24px"
              style={{
                position: 'absolute',
                top: 50,
                right: 20,
                cursor: 'pointer',
              }}
            />
          )}
        </Dapp.Section>

        <CustomSkeleton
          isLoaded={!isLoadingTransactionSummary && !!transactionSummary}
        >
          <Divider borderColor="dark.100" my={6} />
          {/* Essa box é usada como "parâmetro" para fechar o popover do max fee. */}
          <Box ref={inView?.ref} />
          {pendingSignerTransactions && (
            <Dapp.Section maxW={356}>
              <DappError />
            </Dapp.Section>
          )}
          {/* Vault */}
          <Dapp.Section>
            <DappTransaction.RequestingFrom
              mb={7}
              name={name}
              origin={origin}
            />

            {vault && (
              <>
                <Text mb={2} fontSize={12} fontWeight={700}>
                  Vault:
                </Text>
                <VaultItemBox
                  name={vault?.name}
                  address={vault?.address}
                  isSingleWorkspace
                  isInDapp
                  px={4}
                />
              </>
            )}
          </Dapp.Section>
          <Text mb={2} fontWeight={700} fontSize={12}>
            Details:
          </Text>
          <VStack spacing={1} mb={-4}>
            {(isLoadingTransactionSummary || !transactionSummary) && (
              <DappTransaction.OperationSkeleton />
            )}
            {transactionSummary?.operations?.map((operation, index) => (
              <DappTransaction.Operation
                key={`${index}operation`}
                vault={{
                  name: vault?.name || '',
                  predicateAddress: vault?.address || '',
                }}
                operation={operation}
              />
            ))}
          </VStack>
          <DappTransaction.Fee
            closePopover={closePopover}
            fee={transactionSummary?.fee}
          />
          {/* Actions */}
          <Divider borderColor="grey.950" w="full" my={6} />
          <Dialog.Actions
            hideDivider
            hidden={isLoadingTransactionSummary || !transactionSummary}
            w="full"
          >
            {!pendingSignerTransactions ? (
              <>
                <Dialog.SecondaryAction
                  size="md"
                  onClick={cancelTransaction}
                  isDisabled={actionLoading}
                  borderColor="grey.75"
                  fontSize={14}
                >
                  Cancel
                </Dialog.SecondaryAction>
                {actionButton}
              </>
            ) : (
              <>
                <Dialog.SecondaryAction
                  size="lg"
                  width="full"
                  onClick={cancelTransaction}
                  fontSize={14}
                  isDisabled={actionLoading}
                >
                  Back
                </Dialog.SecondaryAction>
              </>
            )}
          </Dialog.Actions>
        </CustomSkeleton>
      </Dapp.Content>
    </>
  );
};

export { DappTransactionWrapper };
