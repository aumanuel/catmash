import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

type CardProps = {
  className?: string;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, header, footer, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
        className
      )}
      {...props}
    >
      {header && <div className="mb-4 font-semibold text-lg">{header}</div>}
      <div>{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  )
);
Card.displayName = 'Card'; 