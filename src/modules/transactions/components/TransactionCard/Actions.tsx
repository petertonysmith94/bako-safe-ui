import {
  Badge,
  Button,
  HStack,
  Icon,
  Spacer,
  Text,
  useAccordionItemState,
} from '@chakra-ui/react';
import { ITransaction } from 'bsafe';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import { ErrorIcon, SuccessIcon } from '@/components';
import { TransactionState } from '@/modules/core';
import { useScreenSize } from '@/modules/core/hooks';

import { useSignTransaction } from '../../hooks/signature';

interface ActionsIconProps {
  isOpen: boolean;
}

interface TransactionActionsProps {
  status: TransactionState;
  transaction?: ITransaction;
  isSigner: boolean;
}

const ActionsIcon = ({ isOpen }: ActionsIconProps) => (
  <Icon
    as={isOpen ? IoIosArrowUp : IoIosArrowDown}
    fontSize="md"
    color="grey.200"
    cursor="pointer"
  />
);

const Actions = ({
  transaction,
  status,
  isSigner,
}: TransactionActionsProps) => {
  const { isMobile } = useScreenSize();
  const { isOpen } = useAccordionItemState();

  const { isSigned, isDeclined, isCompleted, isReproved } = status;
  const { confirmTransaction, declineTransaction, isLoading, isSuccess } =
    useSignTransaction({ transaction: transaction! });

  const awaitingAnswer =
    !isSigned && !isDeclined && !isCompleted && !isReproved && transaction;
  const notAnswered = !isSigned && !isDeclined && (isCompleted || isReproved);

  if (isMobile) {
    return (
      <HStack w="full" justifyContent="end" spacing={1}>
        <Text fontSize="xs">View details</Text>
        <ActionsIcon isOpen={isOpen} />
      </HStack>
    );
  }

  return (
    <HStack minW={140} justifySelf="end">
      {isSigned && (
        <Badge h={6} variant="success">
          You signed
          <Icon as={SuccessIcon} />
        </Badge>
      )}

      {isDeclined && (
        <Badge h={6} variant="error">
          You declined
          <Icon as={ErrorIcon} />
        </Badge>
      )}

      {notAnswered && (
        <Badge h={6} variant="info">
          {`You didn't sign`}
        </Badge>
      )}

      {awaitingAnswer && isSigner ? (
        <HStack minW={140}>
          <Button
            h={9}
            px={3}
            variant="primary"
            size="sm"
            isLoading={isLoading}
            isDisabled={isSuccess}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              confirmTransaction();
            }}
          >
            Sign
          </Button>
          <Button
            h={9}
            px={3}
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              declineTransaction(transaction.id);
            }}
            isLoading={isLoading}
            isDisabled={isSuccess}
          >
            Decline
          </Button>
        </HStack>
      ) : (
        <Spacer />
      )}

      <ActionsIcon isOpen={isOpen} />
    </HStack>
  );
};

export { Actions };
