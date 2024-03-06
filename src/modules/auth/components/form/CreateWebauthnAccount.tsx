import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

import { UseWebAuthn } from '../../hooks';

interface CreateWebAuthnFormProps {
  form: UseWebAuthn['form']['memberForm'];
  nickname: {
    search: string;
    setSearch: (value: string) => void;
    nicknamesData: UseWebAuthn['nicknamesData'];
  };
}
export const CreateWebAuthnForm = ({
  form,
  nickname,
}: CreateWebAuthnFormProps) => {
  // const { debouncedSearchHandler } = useWebAuthn();
  const { search, setSearch, nicknamesData } = nickname;

  return (
    <Box w="full" maxW={480} mb={8}>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Box position="relative">
            <FormControl>
              <Input
                value={search}
                placeholder=""
                onChange={(e) => {
                  setSearch(e.target.value);
                  field.onChange(e.target.value);
                }}
                isInvalid={
                  fieldState.invalid ||
                  (!!nicknamesData?.name && search.length > 0)
                }
              />
              <FormLabel color="gray">Name</FormLabel>
              <FormHelperText
                color={
                  nicknamesData?.name || form.formState.errors.name?.message
                    ? 'error.500'
                    : 'grey.500'
                }
              >
                {nicknamesData?.name && search.length > 0
                  ? 'Name already exists'
                  : form.formState.errors.name?.message
                    ? form.formState.errors.name?.message
                    : search.length > 0
                      ? 'This username is available'
                      : ''}
              </FormHelperText>
            </FormControl>
            <SmallCloseIcon
              position="absolute"
              top={3.5}
              right={4}
              w={5}
              h={5}
              _hover={{
                cursor: 'pointer',
              }}
              onClick={() => setSearch('')}
            />
          </Box>
        )}
      />
    </Box>
  );
};
