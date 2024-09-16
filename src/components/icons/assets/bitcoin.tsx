import { createIcon } from '@chakra-ui/react';

const BitcoinIcon = createIcon({
  displayName: 'BitcoinIcon',
  path: (
    <svg viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="url(#pattern0_16475_9448)" />
      <defs>
        <pattern
          id="pattern0_16475_9448"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_16475_9448" transform="scale(0.00833333)" />
        </pattern>
        <image
          id="image0_16475_9448"
          width="120"
          height="120"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  ),
});

export { BitcoinIcon };
