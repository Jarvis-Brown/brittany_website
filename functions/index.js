const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const { getStorage } = require("firebase-admin/storage");

admin.initializeApp();

exports.getSignedUrl = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            // Parse body as JSON if necessary
            const { filename, contentType } =
                typeof req.body === "string" ? JSON.parse(req.body) : req.body;

            if (!filename || !contentType) {
                return res.status(400).send("Missing filename or contentType");
            }

            const bucket = getStorage().bucket();
            const file = bucket.file(`uploads/${Date.now()}-${filename}`);

            const [url] = await file.getSignedUrl({
                action: "write",
                expires: Date.now() + 10 * 60 * 1000, // 10 minutes
                contentType,
            });

            res.status(200).json({ url, path: file.name });
        } catch (err) {
            console.error("Function error:", err);
            res.status(500).send("Internal Server Error");
        }
    });
});
