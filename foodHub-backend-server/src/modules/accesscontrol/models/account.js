import mongoose from "mongoose";
// import type {InferSchemaType} from "mongoose";
const Schema = mongoose.Schema;

// interface IAccount {
//   email: string;
//   password: string;
//   role: string;
//   accountVerifyToken?: string;
//   accountVerifyTokenExpiration?: Date;
//   isVerified: boolean; 
// }

// export interface IAccountDocument extends IAccount, Document<Types.ObjectId> {
//   // Overrides the default string/number _id with the Mongoose ObjectId type
//   _id: Types.ObjectId; 
//   createdAt: Date;
//   updatedAt: Date;
// }


const accountSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ROLE_USER", "ROLE_ADMIN", "ROLE_SELLER","ROLE_DELIVERY"],
      required: true,
    },
    accountVerifyToken: String,
    accountVerifyTokenExpiration: Date,
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// type accountType=InferSchemaType<typeof accountSchema>;


export default mongoose.model("Account", accountSchema);
// module.exports=mongoose.model("Account", accountSchema);

// export default mongoose.model<accountType>("Account", accountSchema);
// module.exports=mongoose.model<accountType>("Account", accountSchema);
