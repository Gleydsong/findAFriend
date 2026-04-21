import { useId, useState, type InputHTMLAttributes } from 'react'
import { FormField, TextInput } from './FormField'

export function PasswordField({
  label,
  eyeIconSrc,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  eyeIconSrc: string
}) {
  const id = useId()
  const [show, setShow] = useState(false)

  return (
    <FormField label={label} id={id}>
      <div className="relative">
        <TextInput
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={props.name === 'password' ? 'current-password' : 'new-password'}
          className="pr-12"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5"
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        >
          <img src={eyeIconSrc} alt="" width={24} height={24} />
        </button>
      </div>
    </FormField>
  )
}
