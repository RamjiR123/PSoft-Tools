# PSoft-Tools
Interactive tools for students taking CSCI 2600 Principles of Software at RPI.

https://psoft-tools.pages.dev/
## Features
### Dafny Code Verification/Running
Provides an environment to verify and run Dafny code.
### Hoare Triple Verification
Provides an environment to verify Hoare Triples. This is accomplished by translating the given, Java-formatted code into Dafny code.
### Forward Reasoning
Provides an environment to carry out Forward Reasoning from a given precondition and block of Java-formatted code.
### Backwards Reasoning
Provides an environment to carry out Backward Reasoning from a given postcondition and block of Java-formatted code.
### Control Flow Graphs *(Under Development)*
Provides a tool that generates a control-flow graph from given Java code.
### Design Patterns *(Under Development)*
Provides examples of the same example Java class implemented using a variety of design patterns.
## Local Hosting/Development
### Setup
1. Install the latest version of npm: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
2. Change directory into directory "psoft-tools": `cd ./psoft-tools`
3. Install the dependencies: `npm install`
4. (Optional) Set up the backend server: https://github.com/aandrepingu/PSoft-Tools-Backend 
    - Though optional, this step is highly recommended; many features are unavailable without the backend
### Running
1. Run the dev server: `npm run dev`
2. (Optional) Run the backend dev server: 
    - `cd /path/to/PSoft-Tools-Backend`
    - `npm run dev`
    - Though optional, this step is highly recommended; many features are unavailable without the backend
