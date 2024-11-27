const mongoose = require("../src/app/lib/mongoConnection")

const ObjectVersionSchema = new mongoose.Schema(
	{
		timestamp: { type: Date, default: Date.now },
		objects: [{ type: mongoose.Schema.Types.Mixed }],
		description: String,
	},
	{ _id: false }
);

const SlideSchema = new mongoose.Schema(
	{
	  position: { type: Number, required: true },
	  elements: [{ type: mongoose.Schema.Types.Mixed }],
	},
	{ timestamps: true }
  );

const PresentationSchema = new mongoose.Schema({
	creatorNickname: String,
	name: String,
	creationDate: { type: Date, default: Date.now },
	versions: [ObjectVersionSchema],
	slides: [SlideSchema],
	creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	editors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

PresentationSchema.virtual("currentObjects").get(function () {
	if (this.versions.length > 0) {
		return this.versions[this.versions.length - 1].objects
	}
	return []
})

module.exports = mongoose.models.Presentation || mongoose.model("Presentation", PresentationSchema)
