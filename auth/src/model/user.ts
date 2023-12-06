import mongoose from "mongoose";
import bcrypt from 'bcrypt';

//an interface that describes the properties that are required to create a new user.
interface UserAttr {
    email: string,
    password: string
}
//An interface that describes the properties that the usermodel is going to have.
interface UserModal extends mongoose.Model<userDoc> {
    build(attrs: UserAttr): userDoc;
}
//An interface that describes the properties that the user document is going to return;
interface userDoc extends mongoose.Document {
    email: string,
    password: string,
    createdAt: string,
    updatedAt: string
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

userSchema.pre('save', async function (this: userDoc, done) {
    if (this.isModified('password')) {
            let password = this.get('password');
            let hashed = await bcrypt.hash(password, 10);
            this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttr) => {
    return new User(attrs);
};


const User = mongoose.model<userDoc, UserModal>("User", userSchema);


export { User };