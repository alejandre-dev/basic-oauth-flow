#Shopify OAuth flow 101
Simple express app that shows how Shopify's OAuth flow process works 
##Setup Local Development
1. Clone this repo
2. Create a Shopify App inside the Partner Dashboard and use the Shopify API Key and API secret key for local development.
3. Rename `.env.example` to `.env` and fill in values
4. Run `npm install` and then `nodemon index.js`
5. [Expose your dev environment](https://ngrok.com/docs#getting-started-expose) with ngrok (it runs on port 3030 by default).
```
ngrok http 3030

ngrok by @inconshreveable                                                                                                                                                    (Ctrl+C to quit)
                                                                                                                                                                                             
Session Status                online                                                                                                                                                         
Account                       a********@gmail.com (Plan: Free)                                                                                                                               
Version                       3.0.6                                                                                                                                                         
Region                        United States (us) (eu)                                                                                                                                                    
Web Interface                 http://127.0.0.1:4040                                                                                                                                          
Forwarding                    http://yourNgrokTunnel.ngrok.io -> http://localhost:3000                                                                                                 
Forwarding                    https://yourNgrokTunnel.ngrok.io -> http://localhost:3000                                                                                                 
```
6. Update your Dev Apps settings in the Partner Dashboard with the following URLs:
   - For the App URL, use `https://yourNgrokTunnel.ngrok.io/`
   - For the Redirection URLs, use `https://yourNgrokTunnel.ngrok.io/auth/callback`
7. [Install your app on a development store](https://shopify.dev/tutorials/build-a-shopify-app-with-node-and-react/embed-your-app-in-shopify#authenticate-and-test) 