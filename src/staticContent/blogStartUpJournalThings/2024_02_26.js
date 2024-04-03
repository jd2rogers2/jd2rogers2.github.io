
const blog = {
  title: '2024-02-26__ai_hackathon.md',
  content: `
      Wow, has it really been 4 months since I wrote my last entry? I have been busy planning and executing my wedding fiesta in Panama and visiting family in Boston. Working the whole time (ish), writing curriculum for the bootcamp, but it was A LOT of time away from home.

      I come home to a bank account that needs some love and so I'm on the market for a new job. It's very competitive out there right now, so my first order of business is to practice all of the tech interview focuses. However, I'm not completely disregarding the networking game that is necessary.

      As part of my search I went to an AI hackathon yesterday. I got to work some cool tech and great people. But let me just say, hackathons have turned into glorified brainstorm and pitch sessions. There is very little building actually going on, and that bums me out. What was pretty incredible was the talent on display there, here's your headline "let me tell you folks, the intelligence is definitely not all artificial". My journey into cloud infrastructure has been a great precursor to working with learning systems, it would be great to take the next steps there once I wrap on AWS.

      As I didn't stand up to the data science skills on display, I jumped on a team where my skillz could be put to use. I worked on a journaling app that wanted a add some AI analytics to each entry. It was nice to finally find the time to play around with openai's API. It was relatively straight forward, much like using ChatGPT's interface.

      The tech stack I used along with it was also pretty fun, trying new things is great. I wrote the API call in a GCP Cloud Function that was triggered when a new entry is written into the Firestore database. I also fixed a bug on the frontend, so got my hands dirty with Angular. It was a brief interaction but it wasn't so bad, I wasn't a fan of the html being in a separate file; this could have just been the author's convention but I prefer smaller components. The component architecture was very similar to React, but I didn't get in deep enough to see any data being passed between components.

      The real star of the show was Firebase's two way data binding. I can only imagine this is a pubsub pattern on the backend that is intelligently cacheing the client sessions and making publishes when there's new data available. It was pretty incredible to see, not to mention that this tech stack felt so lightweight on the server side, in some cases the frontend integrated directly with the database.

      Well, if you get a chance to go to a hackathon, take it. I always learn something new and meet some good people.
  `,
};

export default blog;
