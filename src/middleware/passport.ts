import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import db from "../database/models";

import { ERRORS } from "../const/error-message";

const User = db.user;
const message = ERRORS.MESSAGES;

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
          return done(null, false, {
            message: message.NOT_FOUND("Email"),
          });
        }

        const isMatch = await bcrypt.compare(
          password,
          user.password
        );

        if (!isMatch) {
          return done(null, false, {
            message: message.INVALID("Password"),
          });
        }

        return done(null, user);

      } catch (err) {
        return done(err);
      }
    }
  )
);

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
