# webMap

Definitely a tool in it's beta (and being completely transparent will probably stay that way). The concept is to map out a domain with a network visualization graph. I was looking for a 
consistent way of taking notes while testing web applications, and also trying to find a idea for a programming project
that wouldn't be cliche or a copy of anything. Eventually I could add some features (specifically in mind a easy fix is to look for '?' parameters so file inclusion parameters don't break the intended purpose), but this was mainly just a project 
to prove to myself that I could write something if I put my mind to it. It's got some bugs that would take 
some fun debugging and rewriting to get through, but the core concept is functional.

In this case, making a simple document in vim and start testing so you make note of odd behaviors, filters to hopefully bypass, or eventually, vulnerabilities, might be the most elegant solution. Still a collaborative platform that works cloud based for a offensive team and maps out a domain with it's endpoints to take live notes might be cool. Might help with the data organization and just general clarity of a operation.

### Prerequisites

Runs with 2 core installs and they're pretty easy to set up

```
- node.js : sudo apt-get install nodejs
- npm     : sudo apt-get install npm
```

### Installing


```
Direct Download or -- git clone https://github.com/RyanLongVA/webMap.git
```

Then install the packages via the packages.json file

```
npm install
```

Then finally add your urls to the list.txt file and 

```
node init
```
Any problems? Feel free to reach out.


Terminal typical output:
```
I need coffee, probably not on http://127.0.0.2:3000, but check anyways...
https:// removed
--Domain Found in the provided list--
--Domain provided is in the data.json
found a length of 1
--changes.json was saved--
```
 
Here's some typical visual output:

![](https://static.wixstatic.com/media/b4cbd1_2650e1853b4748e497f71639b82e9088~mv2.png/v1/fill/w_484,h_272,al_c,usm_0.66_1.00_0.01/b4cbd1_2650e1853b4748e497f71639b82e9088~mv2.png)


## Built With

* [jQuery 3.2.1](https://jquery.com/) - Typical Javascript Library
* [Node.js 4.2.6](https://nodejs.org/) - Server-Side/JavaScript Runtime
* [Express 4.15.3](https://expressjs.com/) - Node.js Dependency : Helpful for routing
* [Vis.js 4.20.0](http://visjs.org/) - JavaScript Library : Dynamic Visual (What the graph revolves around)
* [Ejs 2.5.6](https://www.npmjs.com/package/ejs) - Node.js Dependency - Template Engine 
* [Socket.io 2.0.3](https://socket.io/) - Node.js Dependency : Real-time Engine for communication between client-server

