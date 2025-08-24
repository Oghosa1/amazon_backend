const mongoose = require("mongoose");
const { productSchema } = require("./productmodels");
const emailRegx =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      required: true,
      type: String,
      trim: true,
      validate: {
        validator: (value) => {
          return value.match(emailRegx);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      required: true,
      type: String,
      validate: {
        validator: (value) => {
          return value.length > 6;
        },
        message: "Please enter your password greater than 6 characters",
      },
    },
    address: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "user",
    },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);


const Usermodels = mongoose.model("Usermodels", userSchema);
module.exports = {Usermodels, userSchema} //check back


// const Usermodels = mongoose.model("Usermodels", userSchema);
// module.exports = Usermodels;

// if any issue, refer to the tutorial @8:07:00

// const mongoose = require("mongoose");
// const { productSchema } = require("./productmodels");
// const emailRegx =
//   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

// const userSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       required: true,
//       type: String,
//       trim: true,
//       validate: {
//         validator: (value) => {
//           return value.match(emailRegx);
//         },
//         message: "Please enter a valid email address",
//       },
//     },
//     password: {
//       required: true,
//       type: String,
//       validate: {
//         validator: (value) => {
//           return value.length > 6;
//         },
//         message: "Please enter your password greater than 6 characters",
//       },
//     },
//     address: {
//       type: String,
//       default: "",
//     },
//     type: {
//       type: String,
//       default: "user",
//     },
//     cart: {
//       cart: [
//         {
//           product: productSchema,
//           quatity: {
//             type: Number,
//             required: true,
//           },
//         },
//       ],
//     },
//   },
//   { timestamps: true }
// );

// const Usermodels = mongoose.model("Usermodels", userSchema);
// module.exports = Usermodels;

// // if any issue, refer to the tutorial @8:07:00

// // const mongoose = require("mongoose");
// // const { productSchema } = require("./productmodels");
// // const emailRegx =
// //   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

// // const userSchema = mongoose.Schema(
// //   {
// //     name: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     email: {
// //       required: true,
// //       type: String,
// //       trim: true,
// //       validate: {
// //         validator: (value) => {
// //           return value.match(emailRegx);
// //         },
// //         message: "Please enter a valid email address",
// //       },
// //     },
// //     password: {
// //       required: true,
// //       type: String,
// //       validate: {
// //         validator: (value) => {
// //           return value.length > 6;
// //         },
// //         message: "Please enter your password greater than 6 characters",
// //       },
// //     },
// //     address: {
// //       type: String,
// //       default: "",
// //     },
// //     type: {
// //       type: String,
// //       default: "user",
// //     },
// //     cart: {
// //       cart: [
// //         {
// //           product: productSchema,
// //           quatity: {
// //             type: Number,
// //             required: true,
// //           },
// //         },
// //       ],
// //     },
// //   },
// //   { timestamps: true }
// // );

// // const Usermodels = mongoose.model("Usermodels", userSchema);
// // module.exports = Usermodels;

// // // if any issue, refer to the tutorial @8:07:00
