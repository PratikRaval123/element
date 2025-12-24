const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    technologies: [{ type: String }],
    imageUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

projectSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

module.exports = mongoose.model("Project", projectSchema);


