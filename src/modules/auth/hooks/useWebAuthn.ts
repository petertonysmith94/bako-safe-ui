import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { EnumUtils, useTab } from '@/modules/core';

import { localStorageKeys, UserService } from '../services';
import { useDrawerWebAuth } from './useDrawerWebAuthn';
import { useWebAuthnForm } from './useWebAuthnForm';
import {
  useCheckNickname,
  useGetAccountsByHardwareId,
} from './useWebauthnRequests';

export enum WebAuthnState {
  LOGIN = 0,
  REGISTER = 1,
}

export type UseWebAuthn = ReturnType<typeof useWebAuthn>;

const useWebAuthn = () => {
  //drawer for webauthn
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(WebAuthnState.LOGIN);
  const [searchRequest, setSearchRequest] = useState('');
  const [search, setSearch] = useState('');
  const [searchAccount, setSearchAccount] = useState('');
  const [isValidCurrentUsername, setIsValidCurrentUsername] = useState(false);
  //button sign in disabled, this is used because handleLogin proccess annoter info before mutation to use isLoading
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInProgress, setSignInProgress] = useState(0);

  const tabs = useTab<WebAuthnState>({
    tabs: EnumUtils.toNumberArray(WebAuthnState),
    defaultTab: WebAuthnState.LOGIN,
  });
  const accountsRequest = useGetAccountsByHardwareId();

  const { memberForm, loginForm } = useWebAuthnForm(accountsRequest.data || []);
  const { createAccountMutate, signAccountMutate } = useDrawerWebAuth();

  const accountsOptions = useMemo(() => {
    const filteredAccounts = accountsRequest.data?.filter((account) =>
      account.name.toLowerCase().includes(searchAccount.toLowerCase()),
    );

    const mappedOptions = filteredAccounts?.map((account) => ({
      label: account.name,
      value: account.webauthn.id,
    }));

    return mappedOptions;
  }, [accountsRequest.data, searchAccount]);

  const nicknames = useCheckNickname(searchRequest);

  const currentUsername = loginForm.watch('name');

  const debouncedSearchAccount = useCallback(
    debounce((event: string | ChangeEvent<HTMLInputElement>) => {
      if (typeof event === 'string') {
        setSearchAccount(event);
        return;
      }

      setSearchAccount(event.target.value);
    }, 300),
    [],
  );

  const debouncedSearchHandler = useCallback(
    debounce((value: string) => {
      setSearchRequest(value);
    }, 300),
    [],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    debouncedSearchHandler(value);
  };

  const handleLogin = loginForm.handleSubmit(async ({ name }) => {
    setBtnDisabled(true);
    const acc = accountsRequest?.data?.find(
      (user) => user.webauthn.id === name,
    );

    if (acc) {
      setIsSigningIn(true);
      const { code } = await UserService.generateSignInCode(acc.address);
      setSignInProgress(50);
      await signAccountMutate.mutateAsync(
        {
          id: acc.webauthn.id,
          challenge: code,
          publicKey: acc.webauthn.publicKey,
        },
        {
          onError: () => {
            setSignInProgress(0);
            setIsSigningIn(false);
            setBtnDisabled(false);
          },
          onSuccess: () => {
            setSignInProgress(100);
            setTimeout(() => {
              setIsSigningIn(false);
              setBtnDisabled(false);
            }, 800);
          },
        },
      );
    }
  });

  useEffect(() => {
    if (accountsRequest?.data?.length === 0) {
      tabs.set(WebAuthnState.REGISTER);
    }
  }, [accountsRequest.data]);

  const handleCreate = memberForm.handleSubmit(async ({ name }) => {
    await createAccountMutate
      .mutateAsync(name, {
        onSuccess: async (data) => {
          await accountsRequest.refetch();
          await tabs.set(WebAuthnState.LOGIN);
          loginForm.setValue('name', data.id);
          memberForm.reset();
        },
      })
      .catch((error) => {
        console.error(error);
      });
  });

  const handleChangeTab = (tab: WebAuthnState) => {
    tabs.set(tab);
    setSearchAccount('');
  };

  const openWebAuthnDrawer = () => {
    setIsOpen(true);
  };

  const resetDialogForms = () => {
    handleChangeTab(WebAuthnState.LOGIN);
    loginForm.reset();
    memberForm.reset();
  };

  const closeWebAuthnDrawer = () => {
    setIsOpen(false);
    resetDialogForms();
  };

  const goToPage = (page: WebAuthnState) => {
    setPage(page);
  };

  useEffect(() => {
    isOpen && setSearchAccount('');
  }, [isOpen]);

  useEffect(() => {
    if (
      accountsRequest.data &&
      accountsRequest?.data?.length > 0 &&
      currentUsername?.length > 0
    ) {
      const defaultWebAuthnId = accountsRequest.data.find(
        (user) => user.webauthn.id === currentUsername,
      );

      defaultWebAuthnId && setIsValidCurrentUsername(true);
    }
  }, [accountsRequest.data, currentUsername]);

  const formState = {
    [WebAuthnState.REGISTER]: {
      isValid: memberForm.formState.isValid,
      primaryAction: 'Create account',
      secondaryAction: 'Cancel',
      handlePrimaryAction: handleCreate,
      handleSecondaryAction: resetDialogForms,
      isLoading: createAccountMutate.isLoading,
      isDisabled:
        !memberForm.formState.isValid ||
        memberForm.watch('name').length === 0 ||
        nicknames.data?.name,
      title: 'Create Passkey account',
      description: 'Create a new account for this device.',
    },
    [WebAuthnState.LOGIN]: {
      isValid: true,
      primaryAction: isSigningIn ? 'Signing in...' : 'Sign in',
      secondaryAction: 'Create account',
      handlePrimaryAction: handleLogin,
      handleSecondaryAction: () => handleChangeTab(WebAuthnState.REGISTER),
      isLoading: signAccountMutate.isLoading,
      isDisabled:
        !loginForm.formState.isValid ||
        (currentUsername?.length === 0 ?? false) ||
        !isValidCurrentUsername ||
        btnDisabled,
      title: 'Login with Passkey',
      description:
        'Select your username or create a new account for this device.',
    },
  };

  return {
    goToPage,
    setSearch,
    resetDialogForms,
    openWebAuthnDrawer,
    closeWebAuthnDrawer,
    accountsRequest,
    accountsOptions,
    handleChangeTab,
    hardwareId: localStorage.getItem(localStorageKeys.HARDWARE_ID),
    checkNickname: useCheckNickname(searchRequest),
    nicknamesData: nicknames.data,
    handleInputChange,
    isOpen,
    search,
    searchAccount: { value: searchAccount, handler: debouncedSearchAccount },
    page,
    form: {
      memberForm,
      loginForm,
      formState: formState[tabs.tab],
    },
    tabs,
    signInProgress,
  };
};

export { useWebAuthn };
