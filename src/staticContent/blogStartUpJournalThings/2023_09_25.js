
const blog = {
    date: '2023_09_25',
    title: 'aws_hands_on.md',
    content: `
        It has been a buuuusy month, we're visiting our family and friends back in the Boston area and have been going non-stop. Luckily, I am working west coast hours still so I've been able to make time in the mornings to work on this startup stuff.

        I decided I needed to get some hands on experience with AWS services rather than just learn the high level theory that the certifications test for. With that I thought, "Why not build an actual product?". So I've officially started building my first potential startup!

        I want it to be as life like as possible while also using as many AWS services as possible. So I'll tell you the idea first, to add some context, and then walk through the stack and design.

        Problem first thinking is something I've seen on the YC youtube a lot lately. So the need I'm filling is bootcamp grads who can code but don't know how to host their webapps on AWS infra. As a bootcamp instructor I've seen the imposter syndrome some of these students leave with. They can write a whole React app but when it comes to starting from scratch, they freeze because they disjointedly did the steps across a couple months. My idea is to provide hackathons to bootcamp grads so they can repeatedly build out small portfolio apps and deploy them, in a day or two's time.

        The product I'm building is Hackr Harvest's site and event RSVPing system. So it's a simple React, Node, and Postgres app with each service dockerized. I started by doing a day of FE design and data schema scheming. Step 1 was to create an AWS RDS database and I followed that up by creating the node app locally with the sequelize ORM for migrations. Sequelize comes with a lot of boilerplate code, which took some time to sort through, but it worked out really nicely actually.

        AWS SDK documentation is not the easiest to parse through which has been making my progress of integrating S3, for profile images, and cognito, for auth, a little slow. But I've been able to do just that, and have plans to deploy my half-finished work to amplify and beanstalk, and follow that up with a CodePipeline.

        Can't wait to report back next time!
    `,
};

export default blog;
