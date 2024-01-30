import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'

class CommonRules {
  public static commonSchema() {
    return {
      name: schema.string({ trim: true }, [rules.alpha({ allow: ['space'] })]),
      email: schema.string({ trim: true }, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string({ trim: true }, [rules.confirmed()]),
      mobile_number: schema.string({ trim: true }, [rules.mobile()]), //, rules.unique({ table: 'users', column: 'mobile_number' })]),

      country_code: schema.string.optional([rules.trim()]),
      image_url: schema.string.optional({ trim: true }),
    }
  }

  public static schemaSignup() {
    return this.commonSchema()
  }

  public static schemaUpdate(id) {
    return {
      ...this.commonSchema(),
      name: schema.string.optional({ trim: true }, [rules.alpha({ allow: ['space'] })]),
      email: schema.string.optional({ trim: true }, [rules.email(), rules.unique({ table: 'users', column: 'email', whereNot: { id } })]),
      password: schema.string.optional({ trim: true }, [rules.confirmed()]),
      old_password: schema.string.optional([rules.requiredIfExists('password')]),
      mobile_number: schema.string.optional({ trim: true }, [
        rules.mobile(),
        rules.unique({ table: 'users', column: 'mobile_number', whereNot: { id } }),
      ]),
    }
  }

  public static commonMessages() {
    return {
      'email.unique': 'email already exist',
      'mobile_number.unique': 'mobile number already exist',
    }
  }

  public static messagesStore() {
    return this.commonMessages()
  }

  public static messagesUpdate() {
    return this.commonMessages()
  }
}

class Signup {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create(CommonRules.schemaSignup())

  public reporter = validator.reporters.api

  public messages = CommonRules.messagesStore()
}

class Update {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.auth.user?.id,
  })

  public schema = schema.create(CommonRules.schemaUpdate(this.refs.id))

  public reporter = validator.reporters.api

  public messages = CommonRules.messagesUpdate()
}

export default { CommonRules, Signup, Update }
