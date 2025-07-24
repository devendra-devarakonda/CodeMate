import { Client, Databases, ID, Query, Account } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6878cf9c0018a0731c2b");

const databases = new Databases(client);
const account = new Account(client); // ✅ Create the account instance

export { client, Databases, ID, Query, account }; // ✅ Export it
