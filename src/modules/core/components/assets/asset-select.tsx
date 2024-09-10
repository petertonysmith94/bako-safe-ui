import { FormControl } from '@chakra-ui/react';
import React from 'react';

import { Select, SelectProps } from '@/components';
import {
  Asset,
  assetsList,
  useGetTokenInfosArray,
  useSortTokenInfosArray,
} from '@/modules/core';

interface Props extends SelectProps {
  assets?: Asset[];
  helperText?: React.ReactNode;
}

/*
 *
 * Example implement:
 *
 * <AssetSelect
 *     id="asset"
 *     name="asset"
 *     register={register} // Use form method
 * />
 *
 * */

function AssetSelect(props: Props) {
  //todo: remove coment with fix bug send n diferent amounts
  const formattedAssets = useGetTokenInfosArray(props.assets ?? assetsList);
  const sortedAssets = useSortTokenInfosArray(formattedAssets);

  return (
    <FormControl>
      <Select
        variant="dark"
        label="Asset"
        value={props.value}
        isInvalid={props.isInvalid}
        onChange={props.onChange}
        options={sortedAssets.map((asset) => ({
          label: `${asset.slug} - ${asset.name}`,
          value: asset.assetId,
        }))}
        maxOptionsHeight={120}
      />
      {props.helperText}
    </FormControl>
  );
}

export { AssetSelect };
