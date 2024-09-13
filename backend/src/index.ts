import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './router/userRouter';
import update from './router/update';
import NewResrouter from './router/newRest';
import path from 'path';
import OwnerAddTable from './router/OwnerAddTable';
import AddImagerouter from './router/imageRouter';
import bodyParser from 'body-parser';
import Cookies  from 'universal-cookie-express';
import OwnerLoginRouter from './router/OwnerLoginRouter';
import restaurantRouter from './router/restaurantRouter';


// Load environment variables
dotenv.config();


const app = express();

app.use(Cookies());
app.use(express.json());
app.use(bodyParser.json());

app.use(express.json());
/*app.use(cors({
  origin: 'https://bookahead-sand.vercel.app',
  optionsSuccessStatus: 200 
}));

*/

app.use(cors({
  origin: 'http://localhost:3000' // Adjust this to match your frontend URL
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads')); // Serve the uploads directory



app.get('/', (req, res) => {
  res.send('Hello, Render!');
});

// MongoDB-Verbindung
mongoose.connect('mongodb://localhost:27017/Restaurant')
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Error connecting to the database:', err));


// Use routers
app.use("/api/users", userRouter);
app.use('/login', OwnerLoginRouter);
app.use('/update', update);
app.use('/restaurants', NewResrouter);
app.use('/tables', OwnerAddTable);
app.use('/addGrundriss', AddImagerouter);
app.use('/', restaurantRouter);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`App listening at port ${PORT}`));

export default mongoose;