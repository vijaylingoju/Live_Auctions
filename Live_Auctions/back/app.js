import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import userdb from "./models/user.js"
import { Middle } from "./middleware.js";
import AuctionItem from "./models/AuctionItem.js";
import multer from "multer";
import biddata from "./models/biddata.js";
import nodemailer from 'nodemailer'
const router = express.Router();
import bcrypt from "bcrypt";


const jwtSecret = 'Prudhvijay57';

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))


mongoose.connect('mongodb+srv://vijaylingoju111:n8LB4ClA3crySD6A@cluster0.5dnee4a.mongodb.net/test')
.then(()=>app.listen(5000))
.then(()=>console.log("DB Connect successfully & listing to localhost 5000."))
.catch((err)=>console.log(err));

app.get('/seller/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      return res.status(200).json({ name: user.name });
    }
    return res.status(404).json({ message: 'Seller not found' });
  } catch (error) {
    console.error('Error fetching seller:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
app.post('/signup', async (req, res, next) => {
  const { name, mail, password, confirmpassword, avatar } = req.body;
  
  try {
      const existingUser = await userdb.findOne({ mail });
      if (existingUser) {
          return res.status(202).json({ msg: "Username already exists" });
      }
      if (password !== confirmpassword) {
          return res.status(204).json({ msg: "Passwords don't match" });
      }

      // Hash the password before saving to database
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds); // Wait for password hashing
      console.log("Hashed value",hashedPassword)
      const user1 = new userdb({
          name,
          mail,
          password: hashedPassword, // Store hashed password
          confirmpassword: hashedPassword, // Hash the confirm password too
          avatar
      });

      await user1.save();

      return res.status(200).json({ msg: "User added successfully", result: user1 });

  } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { mail, password } = req.body;

  try {
      const found = await userdb.findOne({ mail });

      if (!found) {
          return res.status(201).json({ msg: "Invalid email or password" });
      }

      // Use bcrypt to compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, found.password);
      if (!isMatch) {
          return res.status(201).json({ msg: "Invalid email or password" });
      }

      let payload = {
          user: {
              id: found._id,
          },
      };

      jwt.sign(payload, jwtSecret, { expiresIn: '15h' }, (err, token) => {
          if (err) {
              console.error("Error signing token:", err);
              return res.status(500).json({ msg: "Internal server error" });
          }

          res.status(200).send({ token });
      });
  } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({ msg: "Internal server error" });
  }
});



  app.get('/account',Middle,async(req, res)=>{
    try{
        let exist = await userdb.findById(req.user.id);
        if(!exist){
            return res.status(400).send('User not found');
        }
        res.json(exist);
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

app.get('/profile',Middle,async(req, res)=>{
  try{
      let exist = await userdb.findById(req.user.id);
      if(!exist){
          return res.status(400).send('User not found');
      }
      res.json(exist);
  }
  catch(err){
      console.log(err);
      return res.status(500).send('Server Error')
  }
})



// Create a storage configuration for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Set the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the file name
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });
app.post('/postauctionitem', Middle, upload.single("image"), async (req, res) => {
  const { name, description, price, endDateAndTime, cat } = req.body;
  console.log(endDateAndTime)
  try {
    const token = req.header('x-token');
    const decoded = jwt.verify(token, 'Prudhvijay57');
    const Id = decoded.user.id;
    const Data = await userdb.findOne({ "_id": Id });
    const mail = Data.mail;
    const presentprice = price;
    
    // Parse the combined date and time string into a JavaScript Date object
    const endDateAndTimeAsDate = new Date(endDateAndTime);

    const image = req.file; // This will contain the uploaded image data

    const auctionItem = new AuctionItem({
      name,
      description,
      price,
      presentprice,
      posttime: new Date(),
      time: endDateAndTimeAsDate.getTime(), // Convert Date object to timestamp
      cat,
      mail,
      image: image.filename // Save the filename in your model
    });
    console.log(auctionItem)
    await auctionItem.save();
    res.status(201).json({ msg: 'Auction item posted successfully', result: auctionItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});



app.get('/auctionitems', async (req, res) => {
  try {
    const items = await AuctionItem.find();
  return res.status(200).send(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});


app.get('/userauctionitems', Middle, async (req, res) => {
  const email = req.user.mail;

  try {
    const userItems = await AuctionItem.find({ email });
    res.json(userItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// Assuming you have a middleware named Middle
app.post("/biddata", Middle, async (req, res) => {
  const { bidprice, itemId } = req.body;

  try {
    const token = req.header('x-token');
    const decoded = jwt.verify(token, 'Prudhvijay57');
    const userId = decoded.user.id;

    const user = await userdb.findOne({ "_id": userId });
    const mail = user.mail;

    // Update the present price in the AuctionItem model
    const newPresentPrice = bidprice;
    const updatedItem = await AuctionItem.findOneAndUpdate(
      { "_id": itemId },
      { $set: { presentprice: newPresentPrice } },
      { new: true }
    );

    // Create a new biddata entry
    const bidDetails = new biddata({
      itemId,
      bidprice,
      time: new Date(),
      mail,
    });

    // Save bid details to the database
    const savedBid = await bidDetails.save();

    res.status(201).json({ message: "Bid submitted successfully", bid: savedBid, updatedItem });
  } catch (error) {
    console.error("Error submitting bid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/item/:itemId', async (req, res) => {
  const { itemId } = req.params;

  try {
    const bidData = await biddata.find({ itemId: itemId }).sort({ time: -1 });
    res.json(bidData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/auctionitems', async (req, res) => {
  try {
    const items = await AuctionItem.find();
  return res.status(200).send(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

app.get('/userauctionitems', Middle, async (req, res) => {
  const email = req.user.mail;

  try {
    const userItems = await AuctionItem.find({ email });
    res.json(userItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

app.post('/updateprofile', Middle, upload.single('avatar'), async (req, res) => {
  try {
    const token = req.header('x-token');
    const decoded = jwt.verify(token, 'Prudhvijay57');
    const userId = decoded.user.id;

    const image = req.file; 


    await userdb.findByIdAndUpdate(userId, { avatar: image.filename });

    res.status(201).json({ msg: 'Profile avatar updated successfully' ,result: image.filename});
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

app.get('/myauctions', Middle, async (req, res) => {
  try {
    const token = req.header('x-token');
    const decoded = jwt.verify(token, 'Prudhvijay57');
    const userId = decoded.user.id;

    const user = await userdb.findOne({ "_id": userId });
    const userEmail = user.mail;
    console.log(userEmail)
    const UserAuctions = await AuctionItem.find({ mail: userEmail });
  

    res.status(200).json(UserAuctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});
app.get('/mybids', Middle, async (req, res) => {
  try {
    const token = req.header('x-token');
    const decoded = jwt.verify(token, 'Prudhvijay57');
    const userId = decoded.user.id;

    const user = await userdb.findOne({ "_id": userId });
    const userEmail = user.mail;
    const Item_ID=user.itemId;
    console.log(userEmail)
    //const Bideddetails = await AuctionItem.find({__id:Item_ID});
    const userBids = await biddata.find({ mail: userEmail });
  

    res.status(200).json(userBids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});