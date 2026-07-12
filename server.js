const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcrypt");

const { sql, pool, poolConnect } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});

app.post("/upload", upload.single("file"), async (req, res) => {

    let transaction;

    try {

        await poolConnect;

        const userId = req.body.userId;

        if (!userId) {

            return res.status(400).json({
                success: false,
                message: "UserId is required"
            });

        }

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "No file selected"
            });

        }

        transaction = new sql.Transaction(pool);

        await transaction.begin();

        // Get Folder Path of Logged-in User
        const configResult = await new sql.Request(transaction)
            .input("userId", sql.NVarChar(50), userId)
            .query(`
                SELECT FolderPath
                FROM FolderConfiguration
                WHERE UserId = @userId
            `);

        if (configResult.recordset.length === 0) {

            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Folder configuration not found for this user."
            });

        }

        const folderPath = configResult.recordset[0].FolderPath;

        // Get Next Sequence Number for this User
        const sequenceResult = await new sql.Request(transaction)
            .input("userId", sql.NVarChar(50), userId)
            .query(`
                SELECT ISNULL(MAX(SequenceNo),0) AS LastSequence
                FROM UploadedFiles
                WHERE UserId = @userId
            `);

        const sequenceNo =
            sequenceResult.recordset[0].LastSequence + 1;

        const prefix = "FILE";

        const extension = path.extname(req.file.originalname);

        const originalWithoutExt =
            path.basename(req.file.originalname, extension);

        const generatedFileName =
            `${prefix}_${String(sequenceNo).padStart(2, "0")}_${originalWithoutExt}${extension}`;

        await fs.ensureDir(folderPath);

        const fullPath =
            path.join(folderPath, generatedFileName);

        await fs.writeFile(fullPath, req.file.buffer);

        // Save Upload History
        await new sql.Request(transaction)
            .input("userId", sql.NVarChar(50), userId)
            .input("sequence", sql.Int, sequenceNo)
            .input("original", sql.NVarChar(255), req.file.originalname)
            .input("saved", sql.NVarChar(255), generatedFileName)
            .input("filepath", sql.NVarChar(500), fullPath)
            .query(`
                INSERT INTO UploadedFiles
                (
                    UserId,
                    SequenceNo,
                    OriginalFileName,
                    SavedFileName,
                    FilePath
                )
                VALUES
                (
                    @userId,
                    @sequence,
                    @original,
                    @saved,
                    @filepath
                )
            `);

        await transaction.commit();

        res.json({

            success: true,

            message: "Uploaded Successfully",

            userId,

            sequenceNo,

            originalFile: req.file.originalname,

            savedFile: generatedFileName,

            folder: folderPath,

            fullPath

        });

    }
    catch (err) {

        console.error(err);

        if (transaction) {

            try {

                await transaction.rollback();

            }
            catch (e) {

                console.error(e);

            }

        }

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

app.post("/login", async (req, res) => {

    try {

        await poolConnect;
        console.log(req.body)

        const { staffNo, password } = req.body;

        const result = await pool.request()
            .input("staffNo", sql.NVarChar, staffNo)
            .query(`
                SELECT *
                FROM LoginUsers
                WHERE StaffNo=@staffNo
            `);

        console.log(result)
        if (result.recordset.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid Staff Number"
            });

        }

        const user = result.recordset[0];

        const ok = await bcrypt.compare(
            password,
            user.PasswordHash
        );

        if (!ok) {

            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });

        }

        res.json({

            success: true,

            userId: user.StaffNo,

            userName: user.UserName

        });

    }
    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});