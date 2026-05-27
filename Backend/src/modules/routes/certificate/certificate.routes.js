import express from "express";

import {

  createCertificate,
  verifyCertificateController,
    getEligibleEmployees,
     getEmployeeCertificates

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
router.get(
  "/eligible-employees",
  authMiddleware,
  getEligibleEmployees
);
router.get(

  "/employee/:employeeId",

  authMiddleware,

  getEmployeeCertificates

);


export default router;