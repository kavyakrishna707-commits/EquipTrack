const connection = require("../config/db");

// ================= GET ALL EQUIPMENT =================

const getEquipment = (req, res) => {
  const query = "SELECT * FROM equipment";

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


// ================= ADD EQUIPMENT =================

const addEquipment = (req, res) => {
  const {
    name,
    category,
    description,
    total_quantity
  } = req.body;

  console.log("Received equipment data:", req.body);

  if (
    !name ||
    !category ||
    !description ||
    total_quantity === undefined ||
    total_quantity === null ||
    total_quantity === ""
  ) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if (Number(total_quantity) < 0) {
    return res.status(400).json({
      message: "Quantity cannot be negative"
    });
  }

  const query = `
    INSERT INTO equipment
    (
      name,
      category,
      description,
      total_quantity,
      available_quantity
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [
      name,
      category,
      description,
      Number(total_quantity),
      Number(total_quantity)
    ],
    (error, result) => {
      if (error) {
        console.log("Insert error:", error);

        return res.status(500).json({
          message: "Failed to add equipment"
        });
      }

      res.status(201).json({
        message: "Equipment added successfully",
        id: result.insertId
      });
    }
  );
};


// ================= UPDATE EQUIPMENT =================

const updateEquipment = (req, res) => {
  const { id } = req.params;

  const {
    name,
    category,
    description,
    total_quantity
  } = req.body;

  if (
    !name ||
    !category ||
    !description ||
    total_quantity === undefined ||
    total_quantity === null ||
    total_quantity === ""
  ) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if (Number(total_quantity) < 0) {
    return res.status(400).json({
      message: "Quantity cannot be negative"
    });
  }

  const getQuery = `
    SELECT total_quantity, available_quantity
    FROM equipment
    WHERE id = ?
  `;

  connection.query(
    getQuery,
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
          message: "Equipment not found"
        });
      }

      const oldTotal = Number(
        results[0].total_quantity
      );

      const oldAvailable = Number(
        results[0].available_quantity
      );

      const borrowed = oldTotal - oldAvailable;

      if (Number(total_quantity) < borrowed) {
        return res.status(400).json({
          message:
            "Total quantity cannot be less than currently borrowed quantity"
        });
      }

      const newAvailable =
        Number(total_quantity) - borrowed;

      const updateQuery = `
        UPDATE equipment
        SET
          name = ?,
          category = ?,
          description = ?,
          total_quantity = ?,
          available_quantity = ?
        WHERE id = ?
      `;

      connection.query(
        updateQuery,
        [
          name,
          category,
          description,
          Number(total_quantity),
          newAvailable,
          id
        ],
        (error, result) => {
          if (error) {
            console.log(error);

            return res.status(500).json({
              message: "Failed to update equipment"
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Equipment not found"
            });
          }

          res.status(200).json({
            message: "Equipment updated successfully"
          });
        }
      );
    }
  );
};


// ================= DELETE EQUIPMENT =================

const deleteEquipment = (req, res) => {
  const { id } = req.params;

  const checkQuery = `
    SELECT total_quantity, available_quantity
    FROM equipment
    WHERE id = ?
  `;

  connection.query(
    checkQuery,
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
          message: "Equipment not found"
        });
      }

      const total = Number(results[0].total_quantity);
      const available = Number(
        results[0].available_quantity
      );

      if (total !== available) {
        return res.status(400).json({
          message:
            "Cannot delete equipment while some units are borrowed"
        });
      }

      connection.query(
        "DELETE FROM equipment WHERE id = ?",
        [id],
        (error, result) => {
          if (error) {
            console.log(error);

            return res.status(500).json({
              message: "Failed to delete equipment"
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Equipment not found"
            });
          }

          res.status(200).json({
            message: "Equipment deleted successfully"
          });
        }
      );
    }
  );
};


module.exports = {
  getEquipment,
  addEquipment,
  updateEquipment,
  deleteEquipment
};