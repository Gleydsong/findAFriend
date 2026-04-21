import { type InputHTMLAttributes, type ReactNode } from 'react'

export function FormField({
  label,
  id,
  children,
}: {
  label: string
  id: string
  children: ReactNode
}) {
  return (
    <div className="flex w-full max-w-[488px] flex-col gap-2">
      <label htmlFor={id} className="text-[16px] font-semibold text-[#0d3b66]">
        {label}
      </label>
      {children}
    </div>
  )
}

export function TextInput({
  id,
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return (
    <input
      id={id}
      className={`h-16 w-full rounded-[10px] border border-[#d3e2e5] bg-[#f5f8fa] px-[18px] text-[18px] font-semibold text-[#0d3b66] outline-none ring-[#0d3b66] placeholder:text-[#0d3b66]/40 focus:ring-2 ${className}`}
      {...props}
    />
  )
}
