import Popper from 'popper.js';
import React from 'react';
import usePopperState from './usePopperState';

export interface Options {
  placement?: Popper.Placement;
  positionFixed?: boolean;
  eventsEnabled?: boolean;
  modifiers?: Popper.Modifiers;
}

function usePopper({
  placement = 'bottom',
  positionFixed = false,
  eventsEnabled = true,
  modifiers = {},
}: Options) {
  const popperInstance = React.useRef<Popper>(null);
  const [popperStyles, updatePopperState] = usePopperState(placement);
  const [referrenceNode, referrenceRef] = React.useState<Element | null>(null);
  const [popperNode, popperRef] = React.useState<Element | null>(null);
  const [arrowNode, arrowRef] = React.useState<Element | null>(null);

  React.useEffect(() => {
    if (popperInstance.current !== null) {
      popperInstance.current.destroy();
    }

    if (referrenceNode === null || popperNode === null) return;

    // @ts-ignore
    popperInstance.current = new Popper(referrenceNode, popperNode, {
      placement,
      positionFixed,
      modifiers: {
        ...modifiers,
        arrow: {
          ...(modifiers && modifiers.arrow),
          enabled: Boolean(arrowNode),
          element: arrowNode as Element,
        },
        applyStyle: { enabled: false },
        updateStateModifier: {
          enabled: true,
          order: 900,
          fn: updatePopperState,
        },
      },
    });

    return () => {
      if (popperInstance.current !== null) {
        popperInstance.current.destroy();
      }
    };
  }, [
    arrowNode,
    referrenceNode,
    popperNode,
    placement,
    positionFixed,
    modifiers,
  ]);

  React.useEffect(() => {
    if (!popperInstance.current) return;

    if (eventsEnabled) {
      popperInstance.current.enableEventListeners();
    } else {
      popperInstance.current.disableEventListeners();
    }
  }, [eventsEnabled, popperInstance.current]);

  React.useEffect(() => {
    if (popperInstance.current) {
      popperInstance.current.scheduleUpdate();
    }
  });

  return {
    placement: popperStyles.placement,
    referrence: {
      ref: referrenceRef,
    },
    popper: {
      ref: popperRef,
      styles: popperStyles.popperStyles as React.CSSProperties,
    },
    arrow: {
      ref: arrowRef,
      styles: popperStyles.arrowStyles as React.CSSProperties,
    },
  };
}

export default usePopper;
