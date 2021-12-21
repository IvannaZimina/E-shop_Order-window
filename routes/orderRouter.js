const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const multer = require('multer');
const pathWayOrders = path.join(__dirname, '../ordersGet');
const upload = multer({ dest: pathWayOrders });

const Ajv = require('ajv');
const ajv = new Ajv();

const orderSchema = require('../schemas/orderSchema.json');

router.post('/', upload.none(), async (req, res) => {

    try{
        const accountData = await req.body;
        const validate = ajv.compile(orderSchema);
        const valid = validate(accountData);

        console.log(accountData)

        if (!valid) {
            res.json({
                status: 'invalid data',
                payload: {
                    error: validate.errors
                }
            })
            return
        }

        fs.writeFile('./ordersGet/orderGet.json', JSON.stringify(accountData), (err)=> {
            if (err) throw err;
        })
    
    
    } catch (error) {
        throw error;
    }
    
    res.json({status:'ok'});
})



module.exports = router;
