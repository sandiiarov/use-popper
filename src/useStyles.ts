import React from 'react';
import isEqual from 'react-fast-compare';

function useStyles<T = CSSStyleDeclaration>(
  initialValue: T
): [T, (value: T) => void] {
  const [styles, setState] = React.useState(initialValue);

  const setStyles = React.useCallback(
    (value: T) => {
      const next: T = value instanceof Function ? value(styles) : value;
      setState(prev => (isEqual(prev, next) ? prev : next));
    },
    [styles]
  );

  return [styles, setStyles];
}

export default useStyles;
