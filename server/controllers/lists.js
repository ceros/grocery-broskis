const mysql = require('mysql');
const query = require('../helpers/query');

class ListController {
    constructor(database) {
        this.database = database;
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
                    address=?
                `, [req.params.user, req.body.budget || null, req.body.address],
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

	async showList(req, resp, next) {

		const result = await query.promisy(this.database, `SELECT
							u.name,
							l.user_id,
							l.address,
							l.created_date,
							i.list_id,
							i.id,
							i.description
							from lists as l
							RIGHT JOIN items as i ON l.id = i.list_id
							RIGHT JOIN users as u ON u.id = l.user_id where l.id = ?`, [req.params.id]);

		if ( ! result ) {
			resp.status(401);
			return;
		}

		let list = { };
	
		result.forEach(item => {

			if ( ! list.id ) {
				list = {
					id: item.list_id,
					user: { id: item.user_id, name: item.name },
					created_date: item.created_date,
					address: item.address,
					items: []
				}
			}

			list.items.push({ id: item.id, description: item.description });
		});

		resp.json(list);

	}
}

ListController.LIST_STATUS = {
    UNCLAIMED: 'unclaimed'
}

module.exports = ListController;
