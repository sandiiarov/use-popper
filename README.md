# Use Popper

![npm](https://img.shields.io/npm/dt/use-popper.svg)
![npm](https://img.shields.io/npm/v/use-popper.svg)
![NpmLicense](https://img.shields.io/npm/l/use-popper.svg)

## Installation

> Note: React 16.8+ is required for Hooks.

### With npm

```sh
npm i use-popper
```

### Or with yarn

```sh
yarn add use-popper
```

[![Edit usePopper](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ww293zr265?fontsize=14)

```js
import React from 'react';
import usePopper from 'use-popper';
import { useHover } from 'use-events';

function Tooltip(props) {
  const { reference, popper, arrow } = usePopper({ placement: 'bottom' });
  const [active, bind] = useHover();

  return (
    <div>
      <button ref={reference.ref} {...bind}>
        hover me
      </button>
      {active && (
        <div
          ref={popper.ref}
          style={popper.styles}
          data-placement={popper.placement}
        >
          <div>Hello!</div>
          <div ref={arrow.ref} style={arrow.styles} />
        </div>
      )}
    </div>
  );
}

export default Tooltip;
```
