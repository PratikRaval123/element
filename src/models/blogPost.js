const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    readTime: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    technologies: [{ type: String }],
    details: { type: String, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

blogPostSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

module.exports = mongoose.model("BlogPost", blogPostSchema);


