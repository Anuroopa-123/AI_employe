import express from "express";

import {

  createCertificate,
  verifyCertificateController

} from "../../controller/certificate/certificate.controller.js";

import {

  authMiddleware

} from "../../../middleware/auth.middleware.js";

const router =
  express.Router();

router.post(

  "/generate",

  authMiddleware,

  createCertificate
);

router.get(

  "/verify/:token",

  verifyCertificateController
);

export default router;