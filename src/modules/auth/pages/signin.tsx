import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useContactToast } from '@/modules/addressBook';
import {
  ConnectorsList,
  DrawerWebAuthn,
  SigninContainer,
  SigninContainerMobile,
  SignInFooter,
} from '@/modules/auth/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useSignIn } from '../hooks/signIn/useSignIn';

const SigninPage = () => {
  const {
    connectors,
    auth,
    webauthn: { isOpen, closeWebAuthnDrawer, ...rest },
  } = useSignIn();
  const { errorToast } = useContactToast();
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const pageSections = {
    title: 'Welcome to Bako Safe',
  };

  useEffect(() => {
    auth.invalidAccount &&
      errorToast({
        title: 'Invalid Account',
        description: 'You need to use the fuel wallet to connect.',
      });
    auth.handlers.setInvalidAccount?.(false);
  }, [auth.invalidAccount]);

  const WebauthnDrawer = (
    <DrawerWebAuthn
      isOpen={isOpen} // todo: move the complete item with webauthn to component
      onClose={closeWebAuthnDrawer}
      webauthn={{
        ...rest,
        isOpen,
        closeWebAuthnDrawer,
      }}
    />
  );

  if (isMobile) {
    return (
      <SigninContainerMobile>
        {WebauthnDrawer}
        <Box
          w="full"
          minH={173}
          display="flex"
          backgroundColor="brand.500"
          bgGradient="linear(to-br, brand.500 , brand.800)"
          borderRadius="10px 10px 0px 0px"
          p={6}
          pl={{ base: '40%', sm: '30%' }}
        >
          <Box
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Heading
              fontSize={28}
              fontWeight="extrabold"
              bgClip="text"
              color="dark.300"
              textAlign="end"
            >
              {pageSections.title}
            </Heading>
          </Box>
        </Box>

        <VStack
          justifyContent="center"
          w="full"
          pt={14}
          pb={2}
          px={6}
          spacing={8}
        >
          <ConnectorsList
            connectors={connectors.items}
            onSelect={connectors.select}
            isAnyWalletConnectorOpen={connectors.isAnyWalletConnectorOpen}
          />

          <SignInFooter />
        </VStack>
      </SigninContainerMobile>
    );
  }

  return (
    <SigninContainer>
      {WebauthnDrawer}
      <VStack justifyContent="center" textAlign="center" w="full" spacing={0}>
        <Text
          fontSize={32}
          fontWeight="bold"
          bgGradient="linear(to-br, brand.500, brand.800)"
          bgClip="text"
        >
          {pageSections.title}
        </Text>
      </VStack>

      <ConnectorsList
        connectors={connectors.items}
        onSelect={connectors.select}
        isAnyWalletConnectorOpen={connectors.isAnyWalletConnectorOpen}
      />

      <SignInFooter />
    </SigninContainer>
  );
};

export { SigninPage };
