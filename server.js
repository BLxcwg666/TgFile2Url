const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv").config();

const app = express();
const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;

app.get('/:UserID/:ID/:FileName', (req, res) => {
    const { UserID, ID, FileName } = req.params;

    db.get("SELECT OriginLink FROM files WHERE ID = ? AND UserID = ? AND FileName = ?", [ID, UserID, FileName], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (row) {
            const OriginLink = row.OriginLink;
            axios.get(OriginLink, { responseType: 'stream' })
                .then(response => {
                    res.setHeader('Content-Disposition', `attachment; filename="${FileName}"`);
                    response.data.pipe(res);
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).send('Error proxying file');
                });
        } else {
            res.status(404).send('File not found');
        }
    });
});

app.listen(port, host, () => {
    console.log(`Server started on ${host} port ${port}.`);
});
