const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const Admin = require("../../admin/model/Admin");
const keys = process.env.ADMIN_JWT_SECRET_STRING;

const jwtOpts = {};
jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOpts.secretOrKey = keys;

const adminJWTLoginStrategy = new JwtStrategy(jwtOpts, async (payload, done) => {
    const adminEmail = payload.email;

    try {
        if (adminEmail) {
            const admin = await Admin.findOne({ email: adminEmail }).select("-password");

            if (!admin) {
                return done(null, false);
            } else {
                return done(null, admin);
            }
        }
    } catch (e) {
        return done(e, false)
    }
});

module.exports = adminJWTLoginStrategy;