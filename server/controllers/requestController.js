const connection = require("../config/db");

// ================= CREATE REQUEST =================

const createRequest = (req, res) => {
  const {
    user_id,
    equipment_id,
    quantity,
    request_date,
    return_date
  } = req.body;

  // Check all fields
  if (
    !user_id ||
    !equipment_id ||
    !quantity ||
    !request_date ||
    !return_date
  ) {
    return res.status(400).json({
      message: "Please provide all fields"
    });
  }

  const query = `
    INSERT INTO requests
    (user_id, equipment_id, quantity, request_date, return_date, status)
    VALUES (?, ?, ?, ?, ?, 'Pending')
  `;

  connection.query(
    query,
    [
      user_id,
      equipment_id,
      quantity,
      request_date,
      return_date
    ],
    (error, result) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          message: "Failed to create request"
        });
      }

      res.status(201).json({
        message: "Equipment request submitted successfully",
        requestId: result.insertId
      });
    }
  );
};


// ================= GET ALL REQUESTS =================

const getRequests = (req, res) => {
  const query = `
    SELECT
      requests.id,
      equipment.name AS equipment_name,
      requests.quantity,
      requests.request_date,
      requests.return_date,
      requests.status,
      requests.returned
    FROM requests
    JOIN equipment
      ON requests.equipment_id = equipment.id
    ORDER BY requests.id DESC
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.log(error);

      return res.status(500).json({
        message: "Database error"
      });
    }

    res.status(200).json(results);
  });
};


// ================= UPDATE REQUEST STATUS =================

const updateRequestStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Check valid status
  if (status !== "Approved" && status !== "Rejected") {
    return res.status(400).json({
      message: "Invalid status"
    });
  }

  // ================= REJECT REQUEST =================

  if (status === "Rejected") {
    const rejectQuery = `
      UPDATE requests
      SET status = 'Rejected'
      WHERE id = ?
    `;

    connection.query(
      rejectQuery,
      [id],
      (error, result) => {
        if (error) {
          console.log(error);

          return res.status(500).json({
            message: "Failed to reject request"
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Request not found"
          });
        }

        return res.status(200).json({
          message: "Request Rejected successfully"
        });
      }
    );

    return;
  }


  // ================= APPROVE REQUEST =================

  // Get request details
  const requestQuery = `
    SELECT equipment_id, quantity, status
    FROM requests
    WHERE id = ?
  `;

  connection.query(
    requestQuery,
    [id],
    (error, results) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          message: "Database error"
        });
      }

      // Check request exists
      if (results.length === 0) {
        return res.status(404).json({
          message: "Request not found"
        });
      }

      const request = results[0];

      // Prevent approving twice
      if (request.status !== "Pending") {
        return res.status(400).json({
          message: "This request has already been processed"
        });
      }

      // Get available equipment quantity
      const equipmentQuery = `
        SELECT available_quantity
        FROM equipment
        WHERE id = ?
      `;

      connection.query(
        equipmentQuery,
        [request.equipment_id],
        (error, equipmentResults) => {
          if (error) {
            console.log(error);

            return res.status(500).json({
              message: "Database error"
            });
          }

          // Check equipment exists
          if (equipmentResults.length === 0) {
            return res.status(404).json({
              message: "Equipment not found"
            });
          }

          const availableQuantity =
            equipmentResults[0].available_quantity;

          // Check enough equipment is available
          if (availableQuantity < request.quantity) {
            return res.status(400).json({
              message: "Not enough equipment available"
            });
          }

          // Reduce equipment quantity
          const updateEquipmentQuery = `
            UPDATE equipment
            SET available_quantity =
              available_quantity - ?
            WHERE id = ?
          `;

          connection.query(
            updateEquipmentQuery,
            [
              request.quantity,
              request.equipment_id
            ],
            (error) => {
              if (error) {
                console.log(error);

                return res.status(500).json({
                  message:
                    "Failed to update equipment quantity"
                });
              }

              // Change request status to Approved
              const approveQuery = `
                UPDATE requests
                SET status = 'Approved'
                WHERE id = ?
              `;

              connection.query(
                approveQuery,
                [id],
                (error) => {
                  if (error) {
                    console.log(error);

                    return res.status(500).json({
                      message:
                        "Failed to approve request"
                    });
                  }

                  return res.status(200).json({
                    message:
                      "Request Approved and equipment quantity updated successfully"
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

// ================= RETURN EQUIPMENT =================

const returnEquipment = (req, res) => {
  const { id } = req.params;

  // Get request details
  const requestQuery = `
    SELECT equipment_id, quantity, status, returned
    FROM requests
    WHERE id = ?
  `;

  connection.query(requestQuery, [id], (error, results) => {
    if (error) {
      console.log(error);

      return res.status(500).json({
        message: "Database error"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    const request = results[0];

    // Only approved equipment can be returned
    if (request.status !== "Approved") {
      return res.status(400).json({
        message: "Only approved equipment can be returned"
      });
    }

    // Prevent returning twice
    if (request.returned === 1) {
      return res.status(400).json({
        message: "Equipment has already been returned"
      });
    }

    // Increase available quantity
    const updateEquipmentQuery = `
      UPDATE equipment
      SET available_quantity = available_quantity + ?
      WHERE id = ?
    `;

    connection.query(
      updateEquipmentQuery,
      [request.quantity, request.equipment_id],
      (error) => {
        if (error) {
          console.log(error);

          return res.status(500).json({
            message: "Failed to update equipment quantity"
          });
        }

        // Mark as returned
        const returnQuery = `
          UPDATE requests
          SET returned = 1
          WHERE id = ?
        `;

        connection.query(returnQuery, [id], (error) => {
          if (error) {
            console.log(error);

            return res.status(500).json({
              message: "Failed to return equipment"
            });
          }

          return res.status(200).json({
            message: "Equipment returned successfully"
          });
        });
      }
    );
  });
};
// ================= GET USER REQUESTS =================

const getUserRequests = (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT
      requests.id,
      equipment.name AS equipment_name,
      requests.quantity,
      requests.request_date,
      requests.return_date,
      requests.status,
      requests.returned
    FROM requests
    JOIN equipment
      ON requests.equipment_id = equipment.id
    WHERE requests.user_id = ?
    ORDER BY requests.id DESC
  `;

  connection.query(
    query,
    [userId],
    (error, results) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          message: "Database error"
        });
      }

      res.status(200).json(results);
    }
  );
};
// ================= EXPORT FUNCTIONS =================

module.exports = {
  createRequest,
  getRequests,
  getUserRequests,
  updateRequestStatus,
  returnEquipment
};