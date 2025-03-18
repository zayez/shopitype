import passport from 'koa-passport'

const authenticate = passport.authenticate('jwt', {
  session: false,
})

const authenticateLocal = passport.authenticate('local', {
  session: false,
})

const authenticateOptional = passport.authenticate(['jwt', 'anonymous'], {
  session: false,
})

export { authenticate, authenticateLocal, authenticateOptional }
