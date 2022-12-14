#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ubuntu/Dogtorsoftware/BackendInventories
#navigate into our working directory where we have all our github files
cd /home/ubuntu/Dogtorsoftware/BackendInventories

#install node modules
npm install

#start our node app in the backgroun
pm2 restart inventories
