import { OrderStatus } from "@satickserv/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface OrderAttrs {
    id: string
    userId: string,
    version: number,
    status: OrderStatus,
    price: number
}

interface OrderDoc extends mongoose.Document {
    userId: string,
    version: string,
    status: OrderStatus,
    price: number,
}


interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}


const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    price: {
        type: Number,
    }
},
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    });

OrderSchema.set("versionKey", "version");
OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        userId: attrs.userId,
        version: attrs.version,
        status: attrs.status,
        price: attrs.price
    });
}


const Order = mongoose.model<OrderDoc, OrderModel>('order', OrderSchema);


export { Order, OrderStatus };