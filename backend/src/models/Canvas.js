const mongoose = require('mongoose');

// Sub-schema for individual canvas elements (rect/circle/text).
// Kept as one flexible schema instead of 3 separate discriminators — simpler
// for this assignment's scope. Type-specific field validation (e.g. rect
// must have width/height) is enforced at the request-validation layer
// (see middleware/validate.js + canvasRoutes.js), not strictly at the DB level.
const elementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true, enum: ['rect', 'circle', 'text'] },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    rotation: { type: Number, default: 0 },
    fill: { type: String, default: '#000000' },
    draggable: { type: Boolean, default: true },

    // rect-specific
    width: { type: Number },
    height: { type: Number },

    // circle-specific
    radius: { type: Number },

    // text-specific
    text: { type: String },
    fontSize: { type: Number },
  },
  { _id: false } // sub-elements use our own client-generated `id` (uuid), not Mongo's
);

const canvasSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Canvas name is required'],
      trim: true,
      default: 'Untitled Canvas',
    },
    elements: {
      type: [elementSchema],
      default: [],
    },
    layerOrder: {
      type: [String], // element ids, bottom -> top stacking order
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // [BONUS: Auth] optional — supports both guest and logged-in canvases
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Canvas', canvasSchema);