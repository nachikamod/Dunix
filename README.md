There was a time when I really enjoyed competing in coding contests. Particularly on platforms such as codechef, techgig, and others.\
Well, I've always been curious about how these online compilers work. I was aware that they employ containerized compilers that are assigned to individual user sessio or 
probably group of sessions.\
Even though I was still aware of this single theory, I found it to be unsatisfactory. So I decided to give it a shot yesterday, and today, that is in one day, here I am 
writing my README tale.

This entire procedure is broken down into three steps. Take code from the user and send it to the server, then create a Docker container for the user and send the code 
to the container, compile and run the code in the Docker, and return the result.\

That's four, I suppose; logically, it's more than four, but never mind! I was never very good at explaining things. 

So, please don't try to decipher my code and make sense of it! In fact, I'm not sure what I wrote, but it works, and that's all that matters (atleast for 2-3 days).

I am aware that the code is way unoptimized, well what can I expect in one day of work.\

Anyway, lets give you guys an short brief of how this works (Thanks for reading my nonsense)\

The entry point of this project starts from creating an docker image for compilers and redis. Redis is used for session management and storing container ids.\
The compiler-node that is compiler container needs an socket client which listens for events (tasks) from the API and sends back the result to the API.\
Now for compilation and output we are using `node-pty` library to spawn a terminal, and thats it, thats the only magic behind this.\

Now coming to the api `server.py` which is essentially written in python flask acts as a mediator between client and container. It creates user session and creates container for each
connecting user from the image we have created. And essentially destroys them (Well it does not, hopefully I will develop this feature soon and rewrite my logic).\

When a user submits the code to the web interface the api forwards this code to the assigned docker container listens for the result event a session key is made common to all these
three entitites to map their relation.

Well, this documentation needs a damn revision I know. But I am too much tired for now. Lets see may be in future ?
