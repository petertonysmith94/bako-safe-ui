import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { LineCloseIcon } from '@/components';
import { useAuthStore } from '@/modules/auth';

import { useSettings } from '../../hooks';

interface SettingsDrawerProps extends Omit<DrawerProps, 'children'> {
  onOpen: () => void;
}

const SettingsDrawer = ({ ...props }: SettingsDrawerProps) => {
  const {
    form,
    handleSubmitSettings,
    updateSettingsRequest: { isLoading },
    onCloseDrawer,
  } = useSettings({ onOpen: props.onOpen, onClose: props.onClose });

  const auth = useAuthStore();

  // console.log('is this the connector?', test.data[0].name);
  console.log('auth:', auth);

  return (
    <Drawer
      {...props}
      size="sm"
      variant="solid-dark"
      placement="right"
      onClose={onCloseDrawer}
      isOpen={props.isOpen}
    >
      <DrawerOverlay />
      <DrawerContent maxW={456} p={9}>
        <DrawerHeader>
          <VStack alignItems="flex-start" spacing={6}>
            <HStack
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              w="full"
            >
              <Heading fontSize="xl" fontWeight="bold" color="grey.50">
                Settings
              </Heading>
              <LineCloseIcon
                fontSize="24px"
                aria-label="Close window"
                cursor="pointer"
                onClick={onCloseDrawer}
              />
            </HStack>
            <Text
              fontSize="sm"
              maxWidth={320}
              color="grey.75"
              fontWeight="light"
            >
              Personalize Your Preferences: Set Your Name, Email, and Email
              Notification Preferences.
            </Text>
          </VStack>
        </DrawerHeader>

        <Divider borderColor="#868079" my={10} />

        <DrawerBody
          css={{
            '::-webkit-scrollbar': { width: 0 },
            scrollbarWidth: 'none',
          }}
        >
          <VStack alignItems="flex-start" p={1}>
            <VStack spacing={3} w="full" mb={2}>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormControl isInvalid={fieldState.invalid}>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder=" "
                    />
                    <FormLabel>Name</FormLabel>
                    <FormHelperText color="error.500">
                      {fieldState.error?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormControl isInvalid={fieldState.invalid}>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder=" "
                    />
                    <FormLabel>Email Address</FormLabel>
                    <FormHelperText color="error.500">
                      {fieldState.error?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </VStack>

            <Text fontWeight="bold" color="grey.200" fontSize={15}>
              Do you wanna receive email notifications?
            </Text>

            <Controller
              control={form.control}
              name="notify"
              render={({ field }) => (
                <RadioGroup
                  name={field.name}
                  value={field.value ?? 'false'}
                  onChange={field.onChange}
                >
                  <VStack>
                    <Radio value="true" size="md">
                      Sounds good
                    </Radio>
                    <Radio value="false" size="md">
                      Nope, thanks
                    </Radio>
                  </VStack>
                </RadioGroup>
              )}
            />

            <Divider borderColor="dark.100" mb={5} mt={4} />

            <HStack w="full" justifyContent="center">
              <Button
                variant="secondary"
                bgColor="dark.100"
                border="none"
                onClick={onCloseDrawer}
                w="full"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                isDisabled={isLoading}
                onClick={handleSubmitSettings}
                isLoading={isLoading}
                w="full"
              >
                Update
              </Button>
            </HStack>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { SettingsDrawer };
