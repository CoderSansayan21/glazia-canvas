const Canvas = require('../models/Canvas');

// @route  POST /api/canvases
// @access Public/Private (optionalAuth — tags userId if logged in)
exports.createCanvas = async (req, res, next) => {
  try {
    const { name, elements, layerOrder } = req.body;

    const canvas = await Canvas.create({
      name: name || 'Untitled Canvas',
      elements: elements || [],
      layerOrder: layerOrder || [],
      userId: req.user ? req.user.id : undefined, // [BONUS: Auth] tag owner if logged in
    });

    res.status(201).json({ canvas });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/canvases
// @access Public/Private (optionalAuth)
// If logged in -> return only this user's canvases.
// If guest -> return only canvases with no owner (userId: null).
exports.getCanvases = async (req, res, next) => {
  try {
    const filter = req.user ? { userId: req.user.id } : { userId: null };
    const canvases = await Canvas.find(filter).sort({ updatedAt: -1 });
    res.status(200).json({ canvases });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/canvases/:id
// @access Public/Private (optionalAuth)
exports.getCanvasById = async (req, res, next) => {
  try {
    const canvas = await Canvas.findById(req.params.id);

    if (!canvas) {
      return res.status(404).json({ message: 'Canvas not found' });
    }

    // [BONUS: Auth] If canvas has an owner, only that owner can view it
    if (canvas.userId && (!req.user || String(canvas.userId) !== req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this canvas' });
    }

    res.status(200).json({ canvas });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/canvases/:id
// @access Public/Private (optionalAuth)
exports.updateCanvas = async (req, res, next) => {
  try {
    const canvas = await Canvas.findById(req.params.id);

    if (!canvas) {
      return res.status(404).json({ message: 'Canvas not found' });
    }

    // [BONUS: Auth] Ownership check before allowing update
    if (canvas.userId && (!req.user || String(canvas.userId) !== req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this canvas' });
    }

    const { name, elements, layerOrder } = req.body;
    if (name !== undefined) canvas.name = name;
    if (elements !== undefined) canvas.elements = elements;
    if (layerOrder !== undefined) canvas.layerOrder = layerOrder;

    await canvas.save();

    res.status(200).json({ canvas });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/canvases/:id
// @access Public/Private (optionalAuth)
exports.deleteCanvas = async (req, res, next) => {
  try {
    const canvas = await Canvas.findById(req.params.id);

    if (!canvas) {
      return res.status(404).json({ message: 'Canvas not found' });
    }

    // [BONUS: Auth] Ownership check before allowing delete
    if (canvas.userId && (!req.user || String(canvas.userId) !== req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to delete this canvas' });
    }

    await canvas.deleteOne();

    res.status(200).json({ message: 'Canvas deleted successfully' });
  } catch (err) {
    next(err);
  }
};