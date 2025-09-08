const env = require("dotenv").config();
const { MongoClient } = require('mongodb');


//database connection
async function main() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // insert multiple documents
        // await createMultipleListings(client, [
        //     {
        //         name: "Infinite Views",
        //         summary: "Stunning views of the mountains",
        //         bedrooms: 3,
        //         bathrooms: 2
        //     },
        //     {
        //         name: "Cozy Cottage",
        //         summary: "A quaint cottage in the woods",
        //         bedrooms: 2,
        //         bathrooms: 1
        //     }
        // ]);

        // find one document
        // await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, { 
        //     minimumNumberOfBedrooms: 4, 
        //     minimumNumberOfBathrooms: 2, 
        //     maximumNumberOfResults: 5 
        // });

        // update one document
        // await updateListingByName(client, "Infinite Views", { bedrooms: 6, beds: 8 });

        // upsert one document
        // await upsertListingByName(client, "Cozy Cottage", { name: "Cozy Cottage", bedrooms: 2, beds: 2 });

        //update all documents
        // await updateAllListingsToHavePropertyType(client);

        // delete one document
        // await deleteListingByName(client, "Cozy Cottage");

        // delete multiple documents
        // await deleteAllListingsScrapedBeforeDate(client, new Date("2019-02-15"));

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function deleteAllListingsScrapedBeforeDate(client, date) {
   const result = await client.db("sample_airbnb").collection("listingsAndReviews")
       .deleteMany({ last_scraped: { $lt: date } });
   console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

//delete one document function
async function deleteListingByName(client, nameOfListing) {
   const result = await client.db("sample_airbnb").collection("listingsAndReviews")
       .deleteOne({ name: nameOfListing });
   console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

//update all documents function
async function updateAllListingsToHavePropertyType(client) {
   const result = await client.db("sample_airbnb").collection("listingsAndReviews")
       .updateMany({ property_type: { $exists: false } }, { $set: { property_type: "Unknown" } });
   console.log(`${result.matchedCount} document(s) matched the query criteria.`);
   console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

//upsert one document function
async function upsertListingByName(client, nameOfListing, updatedListing, upsert = true) {
   const result = await client.db("sample_airbnb").collection("listingsAndReviews")
       .updateOne({ name: nameOfListing }, { $set: updatedListing }, { upsert: upsert });
   console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId._id}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
};

//update one document function
async function updateListingByName(client, nameOfListing, updatedListing) {
   const result = await client.db("sample_airbnb").collection("listingsAndReviews")
       .updateOne({ name: nameOfListing }, { $set: updatedListing });
   console.log(`${result.matchedCount} document(s) matched the query criteria.`);
   console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

//find multiple documents with rules function
async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, { minimumNumberOfBedrooms = 0, minimumNumberOfBathrooms = 0, maximumNumberOfResults = Number.MAX_SAFE_INTEGER } = {}) {
   const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({
       bedrooms: { $gte: minimumNumberOfBedrooms },
       bathrooms: { $gte: minimumNumberOfBathrooms }
   }).sort({ last_review: -1 }).limit(maximumNumberOfResults);
    const results = await cursor.toArray();
    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            date = new Date(result.last_review).toDateString();
            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${new Date(result.last_review).toDateString()}`);
        });
    }
}

//find one document function
async function findOneListingByName(client, nameOfListing) {
   const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing });
    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listing found with the name '${nameOfListing}'`);
    }
};

//find multiple documents function
async function findManyListingByName(client, nameOfListing) {
   const result = await client.db("CSE341").collection("contacts").find({ name: nameOfListing }).toArray();
    if (result.length > 0) {
        console.log(`Found ${result.length} listing(s) in the collection with the name '${nameOfListing}':`);
        result.forEach((listing, i) => {
            console.log(`${i + 1}:`);
            console.log(listing);
        });
    } else {
        console.log(`No listing found with the name '${nameOfListing}'`);
    }
};


//create multiple documents function
async function createMultipleListings(client, newListings) {
   const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);
   console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
   console.log(result.insertedIds);
}

/// Insert a document function
async function insertListing(client, newListing) {
   const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
   console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function listDatabases(client) {
   const databasesList = await client.db().admin().listDatabases();

   console.log("Databases:");
   databasesList.databases.forEach(db => {
       console.log(` - ${db.name}`);
   });
}

