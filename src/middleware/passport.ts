import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import db from "../database/models";

const User = db.user;

// Define a User type based on your database model
interface UserInstance {
  id: number;
  email: string;
  password: string;

}

passport.use(
  new LocalStrategy(
    { usernameField: "email" },


    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const userInstance = user as unknown as UserInstance;
        const isMatch = await bcrypt.compare(password, userInstance.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// session store
// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: number, done) => {
//   const user = await User.findByPk(id);
//   done(null, user);
// });
passport.serializeUser((user: Express.User, done) => {
  done(null, (user as UserInstance).id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
