const mysql = require('mysql');
const util = require('util');

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

        const beginTransaction = util.promisify(this.database.beginTransaction.bind(this.database));
        const rollback = util.promisify(this.database.rollback.bind(this.database));
        const commit = util.promisify(this.database.commit.bind(this.database));
        const query = util.promisify(this.database.query.bind(this.database));

        try {
            await beginTransaction();
            const results = await query(
                `INSERT INTO lists
                 SET user_id=?,
                    created_date=now(),
                    status="${ListController.LIST_STATUS.UNCLAIMED}",
                    budget=?,
                    address=?
                `, [req.params.user, req.body.budget || null, req.body.address]
            );

            const rows = [];
            for (const item of req.body.items) {
                if (!item.description || !item.quantity) {
                    throw new Error('All list items must have quantities and descriptions');
                }

                rows.push(`(${results.insertId}, ${mysql.escape(item.description)}, ${!!item.replaceable || false}, now())`);
            }

            await query(`INSERT INTO items (list_id, description, replaceable, created_date) VALUES ${rows.join(',')}`);
            await this.assignPreferredStores(results.insertId, req.body.preferredStores);
            await commit();

            res.send({
                listId: results.insertId
            })
        } catch (e) {
            await rollback().then(() => next(e)).catch(next);
        }
    }

    assignPreferredStores(listId, preferredStores = []) {
        if (!preferredStores || !preferredStores.length) {
            return;
        }

        const sql =
            `INSERT INTO list_stores (list_id, store_place_id)
            VALUES ${preferredStores.map(() => '(' + listId + ',?)').join(',')}`;

        return util.promisify(this.database.query.bind(this.database))(sql, preferredStores);
    }

	async showList(req, resp, next) {
        
		const query = util.promisify(this.database.query.bind(this.database));

		const result = await query(`SELECT
							u.name,
							l.user_id,
							l.budget,
							l.address,
							l.created_date,
							i.list_id,
							i.id,
							i.description,
							i.status
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
					budget: item.budget,
					created_date: item.created_date,
					address: item.address,
					items: []
				}
			}

			list.items.push({ id: item.id, description: item.description, status: item.status });
		});

		resp.json(list);

	}

	async updateItemStatus(req, res, next) {
		if (!req.body.item) {
			res.status(400).json({ message: 'no item'});
            return;
        }

		try {
			const { item } = req.body;
			const query = util.promisify(this.database.query.bind(this.database));

			const result = await query(`UPDATE items as i
				 INNER JOIN lists as l ON i.list_id = l.id
				 INNER JOIN users as u on u.id = l.shopper_id
                 	SET
						i.status=?,
                    	i.update_date=now()
					WHERE i.id = ? and u.id = ?
                `, [item.status, item.id, req.user.id ]);

			res.status(204).end();

		} catch (err) {
			console.log(err);
			next('Failed to update list item');
		}
	}
}

ListController.LIST_STATUS = {
    UNCLAIMED: 'unclaimed'
};

module.exports = ListController;
