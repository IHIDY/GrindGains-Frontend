import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react"

const inputClass =
  "rounded-[10px] border border-border bg-cream px-4 py-3 text-[15px] text-ink outline-none focus:border-isotonic"

export function FormField({
  label,
  helperText,
  children,
}: {
  label: string
  helperText?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-medium text-muted">{label}</label>
      {children}
      {helperText && <div className="text-xs text-faint">{helperText}</div>}
    </div>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} resize-none`} />
}
