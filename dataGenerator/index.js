const mongoose = require("mongoose");                           //to connect database
const Gym = require("../models/gym");
const cities = require("./cities");
const { names, descriptors, types } = require("./namemaker")

mongoose.connect("mongodb://localhost:27017/gym-tester")
const db = mongoose.connection;
db.on("error", console.error.bind(console, "database connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Gym.deleteMany({});
    for (let i = 0; i < 30; i++) {
        const random25 = Math.floor(Math.random() * 25);
        const random6 = Math.floor(Math.random() * 6);
        const price = Math.floor(Math.random() * 100) + 10;
        const gym = new Gym({
            creator: "617daf0a2f860b349543baa1",
            location: `${cities[random25].country}, ${cities[random25].city}`,
            name: `${sample(descriptors)} ${sample(names)}`,
            type: `${sample(types)}`,
            geometry: {
                type: "Point",
                coordinates: [-73.951455, 40.665434]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/ddrfaqyhr/image/upload/v1635934258/gymtester/uxvpzo7g3rfs9phnkc0t.jpg',
                    filename: 'gymtester/uxvpzo7g3rfs9phnkc0t',
                },
                {
                    url: 'https://res.cloudinary.com/ddrfaqyhr/image/upload/v1635934258/gymtester/rqlzbbvl05tmrk9uhtzs.jpg',
                    filename: 'gymtester/rqlzbbvl05tmrk9uhtzs',
                }
            ]
            ,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet libero, voluptatibus nostrum ex, enim nihil, quae unde magnam eaque amet officia sint et dignissimos placeat! Repudiandae fugit molestiae nemo recusandae.",
            price
        })
        await gym.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})