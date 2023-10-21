const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

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

app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
});
