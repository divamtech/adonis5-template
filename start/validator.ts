import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('doUpCase', (value, _, { mutate }) => {
  if (!value) return
  if (typeof value !== 'string') {
    return
  }
  mutate(value.toUpperCase())
})

validator.rule('doLowerCase', (value, _, { mutate }) => {
  if (!value) return
  if (typeof value !== 'string') {
    return
  }
  mutate(value.toLowerCase())
})

validator.rule('doNameCase', (value, _, { mutate }) => {
  if (!value) return
  if (typeof value !== 'string') {
    return
  }
  mutate(value.toNameCase())
})

validator.rule('doSqlDate', (value, _, { mutate }) => {
  if (!value) return
  if (value?.constructor?.name === 'DateTime') {
    mutate(value.toISODate())
  }
})

//only runs if nullable or nullableAndOptional
validator.rule(
  'emptyToNull',
  (value, _, { mutate }) => {
    if (value === '') {
      mutate(null)
    }
  },
  () => ({ allowUndefineds: true }),
)

declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    doUpCase(): Rule
    doNameCase(): Rule
    doLowerCase(): Rule
    doSqlDate(): Rule
    emptyToNull(): Rule
  }
}
