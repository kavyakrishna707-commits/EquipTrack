const connection = require("../config/db");

// =========================================================
// CREATE REQUEST
// =========================================================

const createRequest = (req, res) => {
  const {
    user_id,
    equipment_id,
    quantity,
    request_date,
    return_date
  } = req.body;

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
    (
      user_id,
      equipment_id,
      quantity,
      request_date,
      return_date,
      status,
      returned,
      return_status
    )
    VALUES (?, ?, ?, ?, ?, 'Pending', 0, 'Not Requested')
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
        console.log("Create request error:", error);

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


// =========================================================
// GET ALL REQUESTS - ADMIN
// =========================================================

const getRequests = (req, res) => {

  const query = `
    SELECT
      requests.id,
      requests.user_id,
      requests.equipment_id,
      equipment.name AS equipment_name,
      requests.quantity,
      requests.request_date,
      requests.return_date,
      requests.status,
      requests.returned,
      requests.return_status
    FROM requests
    JOIN equipment
      ON requests.equipment_id = equipment.id
    ORDER BY requests.id DESC
  `;

  connection.query(
    query,
    (error, results) => {

      if (error) {
        console.log("Get requests error:", error);

        return res.status(500).json({
          message: "Database error"
        });
      }

      res.status(200).json(results);
    }
  );
};


// =========================================================
// GET USER REQUESTS
// =========================================================

const getUserRequests = (req, res) => {

  const { userId } = req.params;

  const query = `
    SELECT
      requests.id,
      requests.equipment_id,
      equipment.name AS equipment_name,
      requests.quantity,
      requests.request_date,
      requests.return_date,
      requests.status,
      requests.returned,
      requests.return_status
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
        console.log("Get user requests error:", error);

        return res.status(500).json({
          message: "Database error"
        });
      }

      res.status(200).json(results);
    }
  );
};


// =========================================================
// APPROVE / REJECT REQUEST
// =========================================================

const updateRequestStatus = (req, res) => {

  const { id } = req.params;
  const { status } = req.body;

  if (
    status !== "Approved" &&
    status !== "Rejected"
  ) {
    return res.status(400).json({
      message: "Invalid status"
    });
  }


  // =======================================================
  // REJECT
  // =======================================================

  if (status === "Rejected") {

    const rejectQuery = `
      UPDATE requests
      SET status = 'Rejected'
      WHERE id = ?
        AND status = 'Pending'
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
            message:
              "Request not found or already processed"
          });
        }

        return res.status(200).json({
          message: "Request Rejected successfully"
        });
      }
    );

    return;
  }


  // =======================================================
  // APPROVE
  // =======================================================

  const requestQuery = `
    SELECT
      equipment_id,
      quantity,
      status
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

      if (results.length === 0) {
        return res.status(404).json({
          message: "Request not found"
        });
      }

      const request = results[0];

      if (request.status !== "Pending") {
        return res.status(400).json({
          message:
            "This request has already been processed"
        });
      }


      // Get available quantity

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

          if (equipmentResults.length === 0) {
            return res.status(404).json({
              message: "Equipment not found"
            });
          }

          const availableQuantity =
            Number(
              equipmentResults[0].available_quantity
            );

          const requestedQuantity =
            Number(request.quantity);


          if (
            availableQuantity <
            requestedQuantity
          ) {
            return res.status(400).json({
              message:
                "Not enough equipment available"
            });
          }


          // Reduce available equipment

          const updateEquipmentQuery = `
            UPDATE equipment
            SET available_quantity =
              available_quantity - ?
            WHERE id = ?
          `;

          connection.query(
            updateEquipmentQuery,
            [
              requestedQuantity,
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


              // Approve request

              const approveQuery = `
                UPDATE requests
                SET
                  status = 'Approved',
                  returned = 0,
                  return_status = 'Not Requested'
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


// =========================================================
// USER REQUESTS RETURN
// =========================================================

const requestReturn = (req, res) => {

  const { id } = req.params;

  const query = `
    SELECT
      status,
      returned,
      return_status
    FROM requests
    WHERE id = ?
  `;

  connection.query(
    query,
    [id],
    (error, results) => {

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


      // Only approved equipment

      if (request.status !== "Approved") {
        return res.status(400).json({
          message:
            "Only approved equipment can be returned"
        });
      }


      // Already returned

      if (Number(request.returned) === 1) {
        return res.status(400).json({
          message:
            "Equipment already returned"
        });
      }


      // Return already requested

      if (request.return_status === "Pending") {
        return res.status(400).json({
          message:
            "Return request already submitted"
        });
      }


      const updateQuery = `
        UPDATE requests
        SET return_status = 'Pending'
        WHERE id = ?
      `;

      connection.query(
        updateQuery,
        [id],
        (error) => {

          if (error) {
            console.log(error);

            return res.status(500).json({
              message:
                "Failed to request return"
            });
          }

          res.status(200).json({
            message:
              "Return request sent to admin"
          });

        }
      );
    }
  );
};


// =========================================================
// ADMIN CONFIRMS RETURN
// =========================================================

const confirmReturn = (req, res) => {

  const { id } = req.params;

  const requestQuery = `
    SELECT
      equipment_id,
      quantity,
      status,
      returned,
      return_status
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

      if (results.length === 0) {
        return res.status(404).json({
          message: "Request not found"
        });
      }

      const request = results[0];


      // Request must be approved

      if (request.status !== "Approved") {
        return res.status(400).json({
          message:
            "Only approved equipment can be returned"
        });
      }


      // Return must be pending

      if (request.return_status !== "Pending") {
        return res.status(400).json({
          message:
            "No pending return request"
        });
      }


      // Prevent double return

      if (Number(request.returned) === 1) {
        return res.status(400).json({
          message:
            "Equipment already returned"
        });
      }


      // Add equipment back

      const equipmentQuery = `
        UPDATE equipment
        SET available_quantity =
          available_quantity + ?
        WHERE id = ?
      `;

      connection.query(
        equipmentQuery,
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


          // Mark return as completed

          const returnQuery = `
            UPDATE requests
            SET
              returned = 1,
              return_status = 'Returned'
            WHERE id = ?
          `;

          connection.query(
            returnQuery,
            [id],
            (error) => {

              if (error) {
                console.log(error);

                return res.status(500).json({
                  message:
                    "Failed to confirm return"
                });
              }

              res.status(200).json({
                message:
                  "Equipment return verified successfully"
              });

            }
          );
        }
      );
    }
  );
};


// =========================================================
// EXPORT
// =========================================================

module.exports = {
  createRequest,
  getRequests,
  getUserRequests,
  updateRequestStatus,
  requestReturn,
  confirmReturn
};