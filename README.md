# Note board client-server application

## Task

User experience:  
User opens client by url and sees input prompt (modal popup) where he should input his name  
After a name has been filled user sees a white board (with other users notes if any).  
Each user can click anywhere on the board and random color note will appear in point of click (size of note is fixed).  
User can move his own notes by dragging them.  
User can input text to a note.  
User sees other users notes and is able to monitor their states (username, placement and text) in real time (but can't move/edit them)  
User sees his own notes marked somehow (by border for example)  
User should be able to reload a page without losing current authority (should keep his name and notes ownership)

Terms  
Note  
just color rectangle with text and author name  
White board - page with plain background, with notes on it

Client requirements:  
Typescript  
React framework  
Any additional libs are allowed

Server requirements:  
NodeJs  
Typescript  
Any framework is welcome  
Rest api for user registration (username input)  
Websocket for clients synchronization

## Info

There are two projects (backend and frontend). Backend project is Node.js server based on NestJS framework (note-board-backend). Frontend project is React-client project (note-board-frontend). Follow to Readme files in this projects.
