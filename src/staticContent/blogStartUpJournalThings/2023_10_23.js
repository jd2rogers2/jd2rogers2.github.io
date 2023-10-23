
const blog = {
    date: '2023_10_23',
    title: 'hands_on_with_sdk_and_pause.md',
    content: `
        Lately I have been (finally) getting my hands dirty with using some of AWS's SDKs to build out my "startup's" platform. I started my event RSVPing site by creating a repo with a docker-compose environment with just 2 services; the API and a web_frontend. I have typically used 3 services (an additional DB) in the past but when I tried out sequelize and saw that it could connect to any DB with a connection string similar to what I was familiar with postgres, I hooked up directly up to a dev env RDS DB - an AWS RDBMS service. This was much easier than I expected with sequelize's migrations being very helpful. Now sequelize's provided ORM classes gave me access directly to my RDS tables! I quickly built out the frontend and backend for creating events just to get the reps in and make sure my full pipeline was operational.

        My next step was to integrate cognito. As this was my first journy into using AWS's SDKs, this took a little time to get familiar. There's lot of documentation out there: old versions featured prominently on google, pages that are language agnostic, systems level descriptions, and finally some documentation that makes sense once you have a working connection and know the conventions.

        Generally you have to instantiate a client with the region, API key, and secret. Then create "commands" that you \`client.send(command)\`. I send just the email and hashed password to the cognito service and make additional RDS calls to get other user data. The cognito response gives me the refresh key, which I store in a jwt in a cookie.

        To show event and user images, I needed to first learn about sending uploaded files via file input and FormData, which I then parse on the express side with the multer library. Then I can finally send along the binary in a similar 1. client instantiate 2. command send pattern for S3; but with a little bucket and key defining thrown in there as well. Additionally, on digest of the S3 object you'll also need to get the signed version of the URL in order for a user to access the public object.

        Following all this auth, image viewing, and data creation functionality, I finished off with the RSVPing action of creating a event_user table row to wrap up my core features. My webapp is in a good enough place where my next steps will be to deploy the FE and BE (amplify and beanstalk are the plan as of now) but hopefully adding a CodeDeploy and CodePipeline integration as well.

        Those will however have to wait as I am meeting my Panamanian in-laws for a month in dec/jan and need to dive head first into learning spanish. I have 10 years of grade school spanish and there is a lot of spanglish in the household. So my goal is to really step it up to the fluent-or-just-below-that level by the end of december.
        
        And with that I'll be taking a little break with the AWS studies until around the new year. See y'all then and happy holidays
    `,
};

export default blog;
