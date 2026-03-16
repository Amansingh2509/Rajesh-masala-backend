const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/items.controller");
const authmiddleware = require("../middleware/auth.middleware");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
});
//protected  router by using middleware
router.post(
  "/",
  authmiddleware.authitemownerMiddleware,
  upload.single("image"),
  itemsController.createitems,
);
router.get("/getitems", itemsController.getitems);

router.get(
  "/owneritems",
  authmiddleware.authitemownerMiddleware,
  itemsController.getOwnerItems,
);

// Owner CRUD
router.put(
  "/:id",
  authmiddleware.authitemownerMiddleware,
  upload.single("image"),
  itemsController.updateItem,
);

router.delete(
  "/:id",
  authmiddleware.authitemownerMiddleware,
  itemsController.deleteItem,
);

module.exports = router;
