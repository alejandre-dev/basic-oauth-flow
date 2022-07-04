import express from "express";
import dotenv from "dotenv";
import { Shopify } from "@shopify/shopify-api";
dotenv.config();

const host = '127.0.0.1';
const port = 3030;

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_API_SCOPES, HOST } = process.env;

// In memory db for the sake of simplicity.
// This could be a DynamoDB table where all the shops that have installed the app are stored
const shops = {};

Shopify.Context.initialize({
    API_KEY: SHOPIFY_API_KEY,
    API_SECRET_KEY: SHOPIFY_API_SECRET,
    SCOPES: SHOPIFY_API_SCOPES,
    HOST_NAME: HOST,
    IS_EMBEDDED_APP: false,
});

const app = express();

app.get('/', async (req, res) => {
    // The shop query param is sent by Shopify when a store is trying to install the app.
    // Read more here: https://shopify.dev/apps/auth/oauth/getting-started#step-3-ask-for-permission
    // We check here if that shop exists in our db, if not, we start the OAuth flow.
    if (typeof shops[req.query.shop] !== 'undefined') {
        res.send('OAuth flow completed succesfully!');
    } else {
        res.redirect(`/auth?shop=${req.query.shop}`);
    }
});

app.get('/auth', async (req, res) => {
    // With this, Shopify generates the page where it asks the merchant for permissions and gives him the install button.
    // If the merchant installs the app, it will redirect to the callback we specify ( /auth/callback )
    // with the query param authorization_code, which we can exchange with Shopify for
    // the permanent access_token of the store.
    const authRoute = await Shopify.Auth.beginAuth(
        req,
        res,
        req.query.shop,
        '/auth/callback',
        false,
    );
    res.redirect(authRoute);
});

app.get('/auth/callback', async (req, res) => {
    // Here Shopify validates our authorization_code and if it's valid, it will return
    // the session of the shop, which looks like this:
    /* 
    Session {
        id: 'offline_oauth-testing-flow.myshopify.com',
        shop: 'oauth-testing-flow.myshopify.com',
        state: '960973637992876',
        isOnline: false,
        accessToken: 'shpua_96551122ff497d6145dc3768163f4f64',
        scope: 'read_products,read_orders'
    }
    */
    const shopSession = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
    );
    console.log(shopSession);

    shops[shopSession.shop] = shopSession;

    console.log(shops);

    res.redirect(`https://${shopSession.shop}/admin/apps/oauth-testing-2`);
});

app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});