import {
  Box,
  CircularProgress,
  ComponentWithAs,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  IconProps,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ChangeEvent, ReactNode, useState } from 'react';
import { InViewHookResponse } from 'react-intersection-observer';

import { AddressUtils } from '@/modules';

interface RightAction {
  icon?: ComponentWithAs<'svg', IconProps>;
  handler?: () => void;
}

interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutoCompleteProps {
  isLoading: boolean;
  isInvalid: boolean;
  options: AutocompleteOption[];
  // selected?: string[];
  value?: string;
  label: string;
  isDisabled: boolean;
  errorMessage?: string;
  rightAction?: RightAction;
  bottomAction?: ReactNode;
  index?: number;
  inView: InViewHookResponse;
  onChange: (value: string) => void;
  onInputChange?: (event: ChangeEvent<HTMLInputElement> | string) => void;
}

function AutoComplete({
  isLoading,
  isInvalid,
  isDisabled,
  options,
  value,
  label,
  errorMessage,
  rightAction,
  bottomAction,
  index,
  inView,
  onChange,
  onInputChange,
}: AutoCompleteProps) {
  const [inputValue, setInputValue] = useState(value ?? '');
  const [currentIndex, setCurrentIndex] = useState<number>();

  const isContact = (value: string) =>
    value.includes('-') || value.includes('...');

  const showOptionsList =
    currentIndex === index && !isLoading && options.length > 0;

  const showBottomAction =
    bottomAction &&
    !isContact(inputValue) &&
    !isInvalid &&
    !isLoading &&
    !showOptionsList &&
    inputValue.length > 0 &&
    AddressUtils.isValid(inputValue);

  return (
    <FormControl isInvalid={isInvalid}>
      <InputGroup>
        <Input
          value={inputValue}
          placeholder=" "
          disabled={isDisabled || false}
          autoComplete="off"
          onBlur={() => {
            setCurrentIndex(undefined);
          }}
          onFocus={() => {
            if (!inputValue) onInputChange?.('');
            setCurrentIndex(typeof index === 'number' ? index : 0);
          }}
          onChange={(e) => {
            onChange(e.target.value);
            onInputChange?.(e);
            setInputValue(e.target.value);
          }}
        />
        <FormLabel color="grey.500">{label}</FormLabel>

        {
          <InputRightElement
            px={3}
            top="1px"
            right="1px"
            borderRadius={10}
            bgColor="dark.200"
            h="calc(100% - 2px)"
          >
            {isLoading && currentIndex === index ? (
              <CircularProgress
                trackColor="dark.100"
                size={18}
                isIndeterminate
                color="brand.500"
              />
            ) : (
              !!rightAction?.handler && (
                <Icon
                  as={rightAction.icon}
                  fontSize="md"
                  cursor="pointer"
                  onClick={rightAction.handler}
                />
              )
            )}
          </InputRightElement>
        }
      </InputGroup>

      {isInvalid && !showOptionsList && (
        <FormHelperText color="error.500">{errorMessage}</FormHelperText>
      )}

      {/* ACTION THAT CAN DYNAMICALLY APPEARS BELOW THE INPUT */}
      {showBottomAction && bottomAction}

      {showOptionsList && (
        <Box
          bg="dark.200"
          color="grey.200"
          fontSize="md"
          borderColor="dark.100"
          borderWidth={1}
          borderRadius={10}
          padding={2}
          position="absolute"
          zIndex={200}
          w="full"
          mt={2}
          pb={0}
        >
          <Flex display="flex" justifyContent="center" alignItems="center">
            <VStack
              w="full"
              maxH={194}
              overflowY="scroll"
              css={{
                '&::-webkit-scrollbar': { width: '0' },
                scrollbarWidth: 'none',
              }}
            >
              {options.map(({ value, label }) => (
                <Box
                  key={value}
                  w="full"
                  p={2}
                  borderRadius={10}
                  cursor="pointer"
                  _hover={{ background: 'dark.150' }}
                  onMouseDown={() => {
                    setInputValue(label);
                    onChange(value);
                  }}
                >
                  <Text
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    w="full"
                  >
                    {label}
                  </Text>
                </Box>
              ))}
              <Box ref={inView.ref} />
            </VStack>
          </Flex>
        </Box>
      )}
    </FormControl>
  );
}

export { AutoComplete };
