import mongoose from "mongoose";
import bcrypt from 'bcrypt';

// an interface that describes the properties that are required to create a new user.
interface UserAttr {
    email: string;
    password: string;
}

// an interface that describes the properties that the user model is going to have.
interface UserModal extends mongoose.Model<UserDoc> {
    build(attrs: UserAttr): UserDoc;
    comparePassword(candidatePassword: string, storedPassword: string): Promise<boolean>;
}

// an interface that describes the properties that the user document is going to return.
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
},
{
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
        },
    },
});

userSchema.pre('save', async function (this: UserDoc, done) {
    if (this.isModified('password')) {
        const password = this.get('password');
        const hashed = await bcrypt.hash(password, 10);
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttr) => {
    return new User(attrs);
};

userSchema.statics.comparePassword = async function (candidatePassword: string, storedPassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, storedPassword);
};

const User = mongoose.model<UserDoc, UserModal>("User", userSchema);

export { User };
