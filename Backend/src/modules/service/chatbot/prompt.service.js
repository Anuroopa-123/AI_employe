export const buildPerformancePrompt = (employeeData) => {

  return `
You are an AI HR performance analyst.

Analyze this employee carefully.

EMPLOYEE PROFILE:
Name: ${employeeData.name}
Department: ${employeeData.department}
Designation: ${employeeData.designation}
Skills: ${employeeData.skills}

PERFORMANCE METRICS:
Productivity Score: ${employeeData.productivityScore}
Consistency Score: ${employeeData.consistencyScore}
Deadline Score: ${employeeData.deadlineScore}
Manager Rating: ${employeeData.managerRatingAvg}
Final Score: ${employeeData.finalScore}

TASKS:
${employeeData.tasks}

WORK LOGS:
${employeeData.worklogs}

MANAGER REVIEWS:
${employeeData.reviews}

Generate:

1. Strengths
2. Weaknesses
3. Key Insights
4. Growth Plan

Keep response professional and structured.
`;
};