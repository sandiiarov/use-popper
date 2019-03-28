import Popper from 'popper.js';
import React from 'react';
// @ts-ignore
import useDeepCompareEffect from 'use-deep-compare-effect';
import usePopperState from './usePopperState';

interface Options {
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

  useDeepCompareEffect(() => {
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
    popperInstance,
    arrowNode,
    referrenceNode,
    popperNode,
    placement,
    positionFixed,
    modifiers,
  ]);

  React.useEffect(() => {
    if (popperInstance.current === null) return;

    if (eventsEnabled) {
      popperInstance.current.enableEventListeners();
    } else {
      popperInstance.current.disableEventListeners();
    }
  }, [popperInstance, eventsEnabled]);

  React.useEffect(() => {
    if (popperInstance.current !== null) {
      popperInstance.current.scheduleUpdate();
    }
  }, [popperInstance]);

  return {
    referrence: {
      ref: referrenceRef,
    },
    popper: {
      ref: popperRef,
      styles: popperStyles.popperStyles as React.CSSProperties,
      placement: popperStyles.placement,
    },
    arrow: {
      ref: arrowRef,
      styles: popperStyles.arrowStyles as React.CSSProperties,
    },
  };
}

export default usePopper;
