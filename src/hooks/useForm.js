import { useCallback, useState } from 'react'
import emailjs from '@emailjs/browser'

/*
 * EmailJS setup (free tier — 200 emails/month, no backend required):
 * 1. Create a free account at https://www.emailjs.com/
 * 2. Email Services -> Add New Service -> connect a Gmail account -> copy the "Service ID"
 * 3. Email Templates -> Create New Template -> reference {{name}}, {{email}}, {{subject}}
 *    and {{message}} as variables in the template body -> copy the "Template ID"
 * 4. Account -> General -> copy the "Public Key"
 * 5. Put all three values into the .env file at the project root:
 *    VITE_EMAILJS_SERVICE_ID=...
 *    VITE_EMAILJS_TEMPLATE_ID=...
 *    VITE_EMAILJS_PUBLIC_KEY=...
 *    then restart the dev server so Vite picks up the new env vars.
 */
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const INITIAL_VALUES = { name: '', email: '', subject: '', message: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}
  if (!values.name.trim())    errors.name    = 'Name is required.'
  if (!values.email.trim())   errors.email   = 'Email is required.'
  else if (!EMAIL_RE.test(values.email)) errors.email = 'Enter a valid email address.'
  if (!values.subject.trim()) errors.subject = 'Subject is required.'
  if (!values.message.trim()) errors.message = 'Message is required.'
  return errors
}

export function useForm() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues(v => ({ ...v, [name]: value }))
    setErrors(errs => (errs[name] ? { ...errs, [name]: undefined } : errs))
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    const validationErrors = validate(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setStatus('loading')
    emailjs.send(SERVICE_ID, TEMPLATE_ID, values, PUBLIC_KEY)
      .then(() => {
        setStatus('success')
        setValues(INITIAL_VALUES)
      })
      .catch(() => setStatus('error'))
  }, [values])

  return { values, errors, status, handleChange, handleSubmit }
}
