const router = require("express").Router();

module.exports = (db) => {
  // BROWSE GET /orders/:user_id  "Show all user Orders"
  router.get("/orders/:id", (req, res) => {
    const queryParams = [req.params.id];
    db.query(
      `SELECT order_id, price, name, image, menu_item_id, total_price FROM orders JOIN order_items ON (orders.id = order_items.order_id) JOIN menu_items ON (order_items.menu_item_id=menu_items.id) WHERE user_id=$1 ORDER BY order_id DESC;`,

      queryParams
    )
      .then((result) => {
        result.rows.length
          ? res.json(result.rows)
          : res.json({
              message: `no order found with id: ${req.params.id}`,
            });
      })
      .catch((err) => res.status(401).json({ error: err.message }));
  });

  // READ GET /order/:order_id  "Show a Specific Order"
  router.get("/order/:id", (req, res) => {
    const queryParams = [req.params.id];
    db.query(
      `SELECT orders.id, time_created, total_price, completed, user_id, order_items.id as order_items_id, menu_item_id FROM orders JOIN order_items ON orders.id = order_items.order_id WHERE orders.id = $1;`,
      queryParams
    )
      .then((result) => {
        result.rows.length
          ? res.json(result.rows)
          : res.json({
              message: `no order found with id: ${req.params.id}`,
            });
      })
      .catch((err) => res.status(401).json({ error: err.message }));
  });

  // ADD POST /order/  "Add New Order"
  router.post("/order", (req, res) => {
    // Getting order values as a JSON file
    // order_items is an array of objects [{menu_id: #}, ...]
    const {
      time_created,
      total_price,
      completed,
      user_id,
      store_id,
      order_items,
    } = req.body;
    queryParamsOrder = [
      time_created,
      total_price,
      completed,
      store_id,
      user_id,
    ];

    db.query(
      `INSERT INTO orders (time_created, total_price, completed, store_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
      queryParamsOrder
    )
      .then((result) => {
        const orderId = result.rows[0].id;
        const queryParamsItems = [];
        let queryString = `INSERT INTO order_items (order_id, menu_item_id) VALUES `;
        let counter = 1;
        order_items.forEach((e, i) => {
          queryParamsItems.push(orderId, e.menu_item_id);
          let value = `($${counter++}, $${counter++})`;
          queryString +=
            i === 0
              ? `${value}`
              : i !== order_items.length - 1
              ? `,${value}`
              : `,${value};`;
        });
        db.query(queryString, queryParamsItems)
          .then(() => res.json({ message: "order added!" }))
          .catch((err) => res.status(401).json({ error: err.message }));
      })
      .catch((err) => res.status(401).json({ error: err.message }));
  });

  //EDIT PUT /order  "Update Order Status"
  router.put("/order", (req, res) => {
    const queryParams = [
      req.body.order_id,
      req.body.store_id,
      `%${req.body.username}%`,
    ];
    db.query(
      `UPDATE orders SET completed = true WHERE id = $1 AND store_id = $2 AND user_id = (SELECT id FROM users WHERE username iLike $3);`,
      queryParams
    )
      .then(() => res.json({ message: "order updated!" }))
      .catch();
  });

  return router;
};
