const mongoose = require('mongoose')
const app = require('./app')

const {DB_USER, DB_PASS, DB_HOST, API_VERSION, IP_SERVER} = require('./constants')

const PORT = process.env.PORT || 3977

mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/`, (error) =>{
        if (error) console.log(error)

        app.listen(PORT, () => {
            console.log('############');
            console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
        })
    }
)