const mysql = require('mysql');
const util = require('util');

class ListController {
    constructor(database) {
        this.database = database;
    }

    async getListsNearCoordinates(req, res, next) {
        if (!req.params.latitude || !req.params.longitude){
            return;
        }

        const selectQuery = `SELECT * FROM lists
        WHERE status="${ListController.LIST_STATUS.UNCLAIMED}"
        AND latitude BETWEEN ${Number(req.params.latitude) - 0.5} AND ${Number(req.params.latitude) + 0.5}
        AND longitude BETWEEN ${Number(req.params.longitude) - 0.5} AND ${Number(req.params.longitude) + 0.5}
    `;

        const query = util.promisify(this.database.query.bind(this.database));
        try {
            const lists = await query(selectQuery);
            for (const list of lists) {
                list.items = await query(`SELECT * FROM items WHERE list_id = ${list.id}`);
            }
            res.json(lists); 
        } catch (e) {
            console.log('Failed to select lists: ' + e);
        }
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
                    address=?,
                    latitude=?,
                    longitude=?
                `, [req.params.user, req.body.budget || null, req.body.address, req.body.latitude, req.body.longitude]
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
}

ListController.LIST_STATUS = {
    UNCLAIMED: 'unclaimed'
};

module.exports = ListController;
