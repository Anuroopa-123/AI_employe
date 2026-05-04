import pool from "../../../config/db.js";

export const getManagerStats = async (req, res) => {
  try {
    const managerId = req.user.orgUserId;

    const [topEmployees] = await pool.query(
      `
      SELECT 
        u.name,

        COUNT(CASE WHEN t.completion_status = 'approved' THEN 1 END) as completed,

        IFNULL(AVG(r.rating), 0) as avg_rating,

        COUNT(CASE 
          WHEN t.completed_at <= t.deadline 
          AND t.completion_status = 'approved'
          THEN 1 END
        ) as on_time,

        (
          COUNT(CASE WHEN t.completion_status = 'approved' THEN 1 END) * 0.5
          +
          IFNULL(AVG(r.rating), 0) * 0.3
          +
          COUNT(CASE 
            WHEN t.completed_at <= t.deadline 
            AND t.completion_status = 'approved'
            THEN 1 END
          ) * 0.2
        ) as score

      FROM tasks t
      JOIN organization_users ou ON t.assigned_to = ou.id
      JOIN users u ON ou.user_id = u.id
     LEFT JOIN (
  SELECT task_id, AVG(rating) as rating
  FROM reviews
  GROUP BY task_id
) r ON r.task_id = t.id

      WHERE t.created_by = ?

      GROUP BY t.assigned_to

      ORDER BY score DESC
      LIMIT 3
    `,
      [managerId],
    );

    res.json({ topEmployees });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};