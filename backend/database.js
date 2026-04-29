const mongoose = require("mongoose")

mongoose.connect('mongodb+srv://smartfabricroll_db_user:Smartfabricroll4@smartfabricroll.ijcf0sv.mongodb.net/smartfabricroll')
  .then(() => console.log('Connected!'));