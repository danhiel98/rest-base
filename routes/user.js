const { Router } = require("express");
const {
  userGET,
  userPOST,
  userPUT,
  userPATCH,
  userDELETE,
} = require("../controllers/user");

const router = Router();

router.get("/", userGET);

router.post("/", userPOST);

router.put("/:id", userPUT);

router.patch("/", userPATCH);

router.delete("/", userDELETE);

module.exports = router;
