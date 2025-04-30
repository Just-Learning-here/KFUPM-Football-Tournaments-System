FROM node:22-alpine

#working directory

WORKDIR /app

# download packages 

COPY package*.json .


#dependecies 
RUN  npm install 



# copy the rest of the application
COPY . .


#Expose the port used 

EXPOSE 6969 


# define the command to run the application
CMD [ "node", "./src/server.js" ] 
