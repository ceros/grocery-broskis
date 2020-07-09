const mysql = require('mysql');

class ListController {
    constructor(database) {
        this.database = database;
    }

    async getListsNearCoordinates(req, res, next) {
        if (!req.body.latitude || !req.body.longitude){
            return;
        }

        const selectQuery = `SELECT * FROM lists
        WHERE status="${ListController.LIST_STATUS.UNCLAIMED}"
        AND latitude BETWEEN ${req.body.latitude - 0.5} AND ${req.body.latitude + 0.5}
        AND longitude BETWEEN ${req.body.longitude - 0.5} AND ${req.body.longitude + 0.5}
    `;

        console.log(selectQuery);

        this.database.query(
            selectQuery,
            (err, results) => {
                if (err) {
                    return tnext('Failed to select lists');
                }

                res.json(results); 
            }
        );
    }

    async createList(req, res, next) {
        if (!req.body.items || !req.body.items.length) {
            return;
        } else if (!req.body.address) {
            return next('Property "address" is required on request body');
        }

        this.database.beginTransaction((err) => {
            if (err) {
                return next(err);
            }

            this.database.query(
                `INSERT INTO lists
                 SET user_id=?,
                    created_date=now(),
                    status="${ListController.LIST_STATUS.UNCLAIMED}",
                    budget=?,
                    address=?,
                    latitude=?,
                    longitude=?
                `, [req.params.user, req.body.budget || null, req.body.address, req.body.latitude, req.body.longitude],
                (err, results) => {
                    if (err) {
                        return this.database.rollback(() => {
                            next('Failed to create new shopping list');
                        })
                    }

                    const rows = [];
                    for (const item of req.body.items) {
                        if (!item.description || !item.quantity) {
                            return this.database.rollback(() => {
                                next('All list items must have quantities and descriptions');
                            })
                        }

                        rows.push(`(${results.insertId}, ${mysql.escape(item.description)}, ${!!item.replaceable || false}, now())`);
                    }

                    this.database.query(`INSERT INTO items (list_id, description, replaceable, created_date) VALUES ${rows.join(',')}`, (err) => {
                        if (err) {
                            return this.database.rollback(() => {
                                next('Failed to create new shopping list items');
                            })
                        }

                        this.database.commit(() => {
                            res.send({
                                listId: results.insertId
                            })
                        })
                    });
                }
            );
        })
    }
}

ListController.LIST_STATUS = {
    UNCLAIMED: 'unclaimed'
}

module.exports = ListController;
