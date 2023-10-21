// _____     _____ _ _      ____  _   _      _   ____
// |_   _|_ _|  ___(_) | ___|___ \| | | |_ __| | / ___|  ___ _ ____   _____ _ __
//   | |/ _` | |_  | | |/ _ \ __) | | | | '__| | \___ \ / _ \ '__\ \ / / _ \ '__|
//   | | (_| |  _| | | |  __// __/| |_| | |  | |  ___) |  __/ |   \ V /  __/ |
//   |_|\__, |_|   |_|_|\___|_____|\___/|_|  |_| |____/ \___|_|    \_/ \___|_|
//      |___/
//
// Version 1.5 | By BLxcwg666 <https://github.com/BLxcwg666/TgFile2Url> | @xcnya / @xcnyacn
// Lastest Update at 2023/10/21 18:05
//「 生死听天命，你也由天定！」

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
