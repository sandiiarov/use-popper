import PopperJS from 'popper.js';
import React from 'react';
// @ts-ignore
import { useDeepCompareEffect } from 'use-deep-compare';
import usePopperState from './usePopperState';

export interface Popper {
  placement?: PopperJS.Placement;
  positionFixed?: boolean;
  eventsEnabled?: boolean;
  modifiers?: PopperJS.Modifiers;
}

function usePopper<R = HTMLElement, P = HTMLElement, A = HTMLElement>({
  placement = 'bottom',
  positionFixed = false,
  eventsEnabled = true,
  modifiers = {},
}: Popper) {
  const popperInstance = React.useRef<PopperJS>(null);
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
    popperInstance.current = new PopperJS(referrenceNode, popperNode, {
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
      ref: (referrenceRef as unknown) as React.RefObject<R>,
    },
    popper: {
      ref: (popperRef as unknown) as React.RefObject<P>,
      styles: popperStyles.popperStyles as React.CSSProperties,
      placement: popperStyles.placement,
    },
    arrow: {
      ref: (arrowRef as unknown) as React.RefObject<A>,
      styles: popperStyles.arrowStyles as React.CSSProperties,
    },
  };
}

export default usePopper;
