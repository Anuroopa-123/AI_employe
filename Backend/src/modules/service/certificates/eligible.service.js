import pool from "../../../config/db.js";

export const getEligibleEmployeesService =
async () => {

  const [rows] = await pool.query(`

    SELECT

      u.id as employeeId,

      u.name,

      ROUND(
        COALESCE(pm.final_score, 0),
        0
      ) as finalScore,

      COALESCE(
        ROUND(AVG(r.rating)),
        0
      ) as rating,

      CASE

        WHEN COALESCE(pm.final_score,0) >= 80
        THEN 1

        ELSE 0

      END as eligible

    FROM users u

    LEFT JOIN performance_metrics pm
    ON pm.employee_id = u.id

    LEFT JOIN reviews r
    ON r.employee_id = u.id

    GROUP BY u.id

    HAVING finalScore > 0

    ORDER BY finalScore DESC

  `);

  return rows;

};