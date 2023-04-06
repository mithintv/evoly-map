# Getting Started
Clone the repo on a bash terminal with:
```bash
git clone https://github.com/mithintv/evoly-map.git
```
Navigate to the repo directory:
```bash
cd evoly-map
```
Install all the dependencies:
```bash
npm install
```
<br>

# Local Environment
The app will not work without creating a .env.local file in the root directory and then obtaining and adding the following environment variables:
```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
NEXT_PUBLIC_API=http://localhost:3000/
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
TABLE_NAME
```
### Mapbox
The first one is an access token that can be obtained from [Mapbox](https://www.mapbox.com/). You will have to create an account and create an access token that you can paste in for the first environment variable. Leave the second environment variable as is.

### AWS
The next four variables are all obtained from [AWS](https://console.aws.amazon.com/iam/home#/home). You will have to create a user with a 'AmazonDynamoDBFullAccess' policy permission and then create an access key id and a secret access key in the IAM Management settings. Then, create a DyanmoDB table in a specific region and add the table name and region in the .env.local file.
<br>

# Local Server
Once you have obtained all the neccesary environment variables, you are ready to run the local development server with:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
<br>

# Technology
This was built primarily with React and Typescript using Next.js. Mapbox was used as the mapping library and Dynamoose was used as the ORM to communicate with DynamoDB.

# Performance
The current implementation renders all 10,000 coordinates on a React frontend on the server during build-time. During my tests, this implementation had the fastest client-side load times. React and Mapbox GL do the heavy lifiting in regards to loading speed for the actual map itself once the coordinates are loaded. As long as the coordinates are loaded, moving through the map i.e zooming around and clicking on diferent clusters and coordinates don't seem to have a noticable effect in terms of the rendering the map. Next.js also provides incremental static regneration if the database were to have frequent updates. 
