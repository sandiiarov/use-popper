# Use Popper

![npm](https://img.shields.io/npm/dt/use-popper.svg)
![npm](https://img.shields.io/npm/v/use-popper.svg)
![NpmLicense](https://img.shields.io/npm/l/use-popper.svg)

[![Edit usePopper](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/81jr0v9qy9?fontsize=14)

```js
import React from 'react';
import usePopper from 'use-popper';
import { useHover } from 'use-events';

function useTooltip(props) {
  const { placement, referrence, popper, arrow } = usePopper({
    placement: props.placement,
  });
  const [active, bind] = useHover();

  const Tooltip = message =>
    active ? (
      <div ref={popper.ref} style={popper.styles} data-placement={placement}>
        <div>{message}</div>
        <div ref={arrow.ref} style={arrow.styles} />
      </div>
    ) : null;

  return [Tooltip, { ...referrence, ...bind }];
};

export default useTooltip;
```
