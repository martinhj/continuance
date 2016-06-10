# Continuance
Continuance is an easy-to-use and low cost library that adds
functionality to newspaper’s and blogg’s pages to let their users track where
they are and what they have been reading.First it aims to solve for the user how
to get back to the location of the content where he or she has been and wants to
get back to. Second it will aid the user back to the position at this page.
Third it helps the user with getting a summary of sentences the user have read
to help them assosiate back into the content they read before.

The library’s functionality is meant to be accessible for all, but is designed
with the background of how to create a better reading environment for people
with attention deficits.  The site’s developer only need to add it with: 
	```<script src=”martinhj.net/continuum.js”></script>```

And when the content has loaded do a call to the function
	```continuance.add(documentContainerElement);```
where ‘documentContainerElement’ is the HTML element that the actual content is
within.

![Alt text](continuance.jpg "Continuance")