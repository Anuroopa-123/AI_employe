import { calculatePerformanceScore }
from "../../service/performance/performance.service.js";

export const generatePerformance = async (req, res) => {

  try {

    const { employeeId } = req.params;

    const result =
      await calculatePerformanceScore(employeeId);

    res.json({
      success: true,
      metrics: result
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};