import React from 'react';
import { CirclesWithBar } from 'react-loader-spinner';

export default function GlobalLoader({ visible = true, size = 'medium' }) {
  // Using button color (#5B10BA) for consistency
  const primaryColor = '#5B10BA';

  // Size configurations
  const sizes = {
    small: { height: '60', width: '60' },
    medium: { height: '100', width: '100' },
    large: { height: '150', width: '150' },
  };

  const selectedSize = sizes[size] || sizes.medium;

  return (
    <div
      style={{
        display: visible ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px',
      }}
    >
      <CirclesWithBar
        height={selectedSize.height}
        width={selectedSize.width}
        color={primaryColor}
        outerCircleColor={primaryColor}
        innerCircleColor={primaryColor}
        barColor={primaryColor}
        ariaLabel="circles-with-bar-loading"
        visible={visible}
      />
    </div>
  );
}
