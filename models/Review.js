const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "rating must be provided"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      required: [true, "title must be provided"],
      maxlength: [200, "title can not be longer than 200 characters"],
    },
    title: {
      type: String,
      required: [true, "title must be provided"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverateRating = async function (productId) {
  console.log(productId);
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.mode(
      "Product".findOneAndUpdate(
        { _id: productId },
        {
          averageRating: Math.ceil(result[0]?.averageRating || 0),
          numOfReviews: result[0]?.numOfReviews || 0,
        }
      )
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverateRating(this.product);
  // console.log("pipeline that is called create and patch");
});
ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverateRating(this.product);
  // console.log("pipeline when we remove it");
});

module.exports = mongoose.model("Review", ReviewSchema);
