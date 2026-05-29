import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import pool from "../../../config/db.js";

export const generateCertificate = async (

  employeeId,
  awardTitle,
  managerId

) => {

  // GET EMPLOYEE
  const [employeeRows] = await pool.query(

    `
   SELECT
  u.name,
  u.email

FROM organization_users ou

JOIN users u
ON ou.user_id = u.id

WHERE ou.id = ?
    `,

    [employeeId]
  );

  const employee = employeeRows[0];

  if (!employee) {
    throw new Error("Employee not found");
  }

  // CERTIFICATE ID
  const certificateId =
    `CERT-${Date.now()}`;

  // VERIFY TOKEN
  const verificationToken =
    uuidv4();

  // VERIFY URL
const verifyUrl =
`http://localhost:4200/verify-certificate/${verificationToken}`;

  // QR IMAGE PATH
  const qrPath =
    `uploads/qrcodes/${verificationToken}.png`;

  // GENERATE QR
  await QRCode.toFile(
    qrPath,
    verifyUrl
  );

  // PDF PATH
  const pdfPath =
    `uploads/certificates/${certificateId}.pdf`;

  // CREATE PDF
  const doc =
    new PDFDocument({
      layout: "landscape",
      size: "A4"
    });

  const stream =
    fs.createWriteStream(pdfPath);

  doc.pipe(stream);

  // BACKGROUND
  doc.rect(0, 0, doc.page.width, doc.page.height)
    .fill("#f8f9fa");

  // TITLE
  doc
    .fillColor("#000")
    .fontSize(30)
    .text(
      "Certificate of Achievement",
      0,
      80,
      {
        align: "center"
      }
    );

  // EMPLOYEE NAME
  doc
    .fontSize(26)
    .fillColor("#1a73e8")
    .text(
      employee.name,
      0,
      180,
      {
        align: "center"
      }
    );

  // AWARD
  doc
    .fontSize(20)
    .fillColor("#333")
    .text(
      `Awarded for ${awardTitle}`,
      0,
      250,
      {
        align: "center"
      }
    );

  // DATE
  doc
    .fontSize(14)
    .text(
      `Issued on ${new Date().toDateString()}`,
      0,
      320,
      {
        align: "center"
      }
    );

  // QR
  doc.image(
    qrPath,
    650,
    350,
    {
      width: 100
    }
  );

  // VERIFY ID
  doc
    .fontSize(10)
    .text(
      `Verification ID: ${verificationToken}`,
      500,
      470
    );

  // CEO SIGN
  doc
    .fontSize(14)
    .text(
      "CEO Signature",
      120,
      450
    );

  // MANAGER SIGN
  doc
    .text(
      "Manager Signature",
      300,
      450
    );

  doc.end();

  // WAIT
  await new Promise((resolve) => {
    stream.on("finish", resolve);
  });

  // SAVE DB
  await pool.query(

    `
    INSERT INTO employee_certificates
    (
      employee_id,
      certificate_id,
      award_title,
      issued_by_manager,
      verification_token,
      certificate_url,
      qr_code_url,
      status
    )

    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?)
    `,

    [
      employeeId,
      certificateId,
      awardTitle,
      managerId,
      verificationToken,
      pdfPath,
      qrPath,
      "valid"
    ]
  );

  return {

    success: true,

    certificateId,

    verificationToken,

    downloadUrl:
      `http://localhost:5000/${pdfPath}`

  };

};