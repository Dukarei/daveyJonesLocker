import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'

export function initializePassport(passport, getUserByEmail, getUserById){
    const authenticateUser  = async (email, password, done) =>{
        const user = await getUserByEmail(email)
        if (user == null){
            return done(null, false, {message: 'No user with that email'})
        }
        try {
            if(await bcrypt.compare(password, user.pass)){
            return done(null, user)
            }else {
                return done(null, false, {message: 'Password incorrect'})
            }

        } catch (e){
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, 
    authenticateUser))
    passport.serializeUser((user,done) => done(null,user.email))
    /*
    passport.deserializeUser((email,done) => {
        return done(null, getUserByEmail(email))
    })*/
    passport.deserializeUser((email, done) => {
        getUserByEmail(email).then((user) => {
          done(null, user);
        }).catch((error) => {
          done(error);
        });
      });
}
