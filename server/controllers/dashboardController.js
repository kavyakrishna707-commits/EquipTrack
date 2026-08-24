const connection = require("../config/db");

const getDashboardStats = (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM equipment) AS totalEquipment,

      (SELECT COUNT(*)
       FROM requests
       WHERE status = 'Pending') AS pendingRequests,

      (SELECT COUNT(*)
       FROM requests
       WHERE status = 'Approved') AS approvedRequests,

      (SELECT COUNT(*)
       FROM requests
       WHERE returned = 1) AS returnedEquipment
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.log(error);

      return res.status(500).json({
        message: "Failed to get dashboard statistics"
      });
    }

    res.status(200).json(results[0]);
  });
};

module.exports = {
  getDashboardStats
};