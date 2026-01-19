import { ReactNode } from 'react'

export interface IBrandIconProps {
  children?: ReactNode
}

export const BrandIcon = ({
  children = (
    <div
      className={`bg-gray-100 shadow w-8 h-12 md:w-4 md:h-6 animate-park-car `}
    />
  ),
}: IBrandIconProps) => {
  return (
    <div className="inline-block overflow-hidden">
      <div
        className={`flex items-center justify-center border-2 border-primary w-8 h-12 md:w-6 md:h-8`}
      >
        {children}
      </div>
    </div>
  )
}
