import {

  generateCertificate

} from "../../service/certificates/certificate.service.js";

import {

  verifyCertificate

} from "../../service/certificates/verify.service.js";
import {
  getEligibleEmployeesService
} from "../../service/certificates/eligible.service.js";

import {
  getEmployeeCertificatesService
} from "../../service/certificates/employee-certificates.service.js";


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

export const getEligibleEmployees =
async (req, res) => {

  try {

    const result =
      await getEligibleEmployeesService();

    res.json({
      employees: result
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

export const getEmployeeCertificates =
async (req, res) => {

  try {

    const result =
      await getEmployeeCertificatesService(
        req.params.employeeId
      );

    res.json({
      certificates: result
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};