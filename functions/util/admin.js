const admin = require("firebase-admin");

const db = admin.firestore();

module.exports = {admin, db};

  