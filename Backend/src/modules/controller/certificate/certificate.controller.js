import {

  generateCertificate

} from "../../service/certificates/certificate.service.js";

import {

  verifyCertificate

} from "../../service/certificates/verify.service.js";

export const createCertificate =
async (req, res) => {

  try {

    const {

      employeeId,
      awardTitle

    } = req.body;

    const result =
      await generateCertificate(

        employeeId,
        awardTitle,
        req.user.id
      );

    res.json(result);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

export const verifyCertificateController =
async (req, res) => {

  try {

    const result =
      await verifyCertificate(
        req.params.token
      );

    res.json(result);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};