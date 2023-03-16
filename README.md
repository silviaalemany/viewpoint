# ViewPoint
ViewPoint is an innovative application that leverages the power of computer vision and natural language processing to suggest improvements to city planners based on user-uploaded street view photos. By using advanced machine learning algorithms, ViewPoint can augment street view photos to showcase potential urban design enhancements. How it works: Users upload street view photos of their city to ViewPoint, providing some basic information about the location and their suggestions for improvement. ViewPoint then uses DALL-E, a powerful neural network designed by OpenAI, to generate images that show what the city could look like with suggested improvements implemented. These augmented images are then displayed back to the user, who can review them and provide feedback on what they like and dislike. Finally, ViewPoint aggregates the feedback from all users to generate a comprehensive report that can be shared with city planners, providing them with valuable insights into what their constituents want and need from their city. With ViewPoint, city planners can tap into the collective wisdom of their citizens to make data-driven decisions about how to improve their city. By leveraging the power of DALL-E, ViewPoint can generate realistic images that help people visualize the potential impact of proposed changes, making it easier to build consensus around urban design decisions. Whether you're a concerned citizen who wants to make a difference in your community or a city planner looking for innovative ways to engage with your constituents, ViewPoint is the perfect tool for creating a more livable, sustainable, and beautiful city.

# Instructions
In root of repo, run:

`` npm install express --save ``

`` npm install body-parser ``

`` npm install mongoose --save ``

Navigate to directory in which mongodb is installed and run

`` ./bin/mongod --dbpath db_directory ``

Open a new window in terminal. Navigate to main, and run

`` node index.js ``

Open a(nother) new terminal window. Navigate to frontend/mapbox-app and run

`` npm install ``

`` npm start ``



PS: if you get an error about envelope-ssl, try this: `export NODE_OPTIONS=--openssl-legacy-provider`

