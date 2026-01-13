/**
 * Animated button component using Framer Motion for slide, scale, and rotate animations.
 * Supports directional animations (up/down/left/right) and hover/tap interactions.
 * Note: Uses useCycle hook for slide animations and supports custom scale values for hover/tap states.
 */
import React, { Ref } from 'react';
import { m, useCycle } from 'framer-motion';

interface ScaleProps {
  hover: number | string | undefined;
  tap: number | string | undefined;
}

interface AnimateButtonProps {
  className?: string;
  children?: React.ReactNode;
  type?: 'slide' | 'scale' | 'rotate';
  direction?: 'up' | 'down' | 'left' | 'right';
  offset?: number;
  scale?: ScaleProps;
}

const AnimateButton = React.forwardRef(
  (
    { className, children, type, direction, offset, scale }: AnimateButtonProps,
    ref: Ref<HTMLDivElement>
  ) => {
    let offset1;
    let offset2;
    switch (direction) {
      case 'up':
      case 'left':
        offset1 = offset;
        offset2 = 0;
        break;
      case 'right':
      case 'down':
      default:
        offset1 = 0;
        offset2 = offset;
        break;
    }

    const [x, cycleX] = useCycle(offset1, offset2);
    const [y, cycleY] = useCycle(offset1, offset2);

    switch (type) {
      case 'rotate':
        return (
          <m.div
            ref={ref}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 2,
              repeatDelay: 0,
            }}
            className={className}
          >
            {children}
          </m.div>
        );
      case 'slide':
        if (direction === 'up' || direction === 'down') {
          return (
            <m.div
              ref={ref}
              animate={{ y: y !== undefined ? y : '' }}
              onHoverEnd={() => cycleY()}
              onHoverStart={() => cycleY()}
              className={className}
            >
              {children}
            </m.div>
          );
        }
        return (
          <m.div
            ref={ref}
            animate={{ x: x !== undefined ? x : '' }}
            onHoverEnd={() => cycleX()}
            onHoverStart={() => cycleX()}
            className={className}
          >
            {children}
          </m.div>
        );

      case 'scale':
      default:
        if (typeof scale === 'number') {
          scale = {
            hover: scale,
            tap: scale,
          };
        }
        return (
          <m.div
            ref={ref}
            whileHover={{ scale: scale?.hover }}
            whileTap={{ scale: scale?.tap }}
            className={className}
          >
            {children}
          </m.div>
        );
    }
  }
);

AnimateButton.defaultProps = {
  type: 'scale',
  offset: 10,
  direction: 'right',
  scale: {
    hover: 1,
    tap: 0.9,
  },
};

export default AnimateButton;
