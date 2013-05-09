UnityAI
=======

Reusable Artificial Intelligence Experiments

![Elevation Demo](https://raw.github.com/jceipek/UnityAI/master/PathfindingDemo.png "Pathfinding Editor")
![Demo Maze](https://raw.github.com/jceipek/UnityAI/master/MazeFind.png "Maze Solution")

## Current Features

- Pathfinding editor for waypoints and pathing visualization
- A* Route Planning
- Random waypoint navigation
- Waypoint to waypoint following using Pathfinder
- Navigation mesh processor in the Tools Menu (creates a NavmeshNode network with triangles and vertices from a selected mesh)
- Pathing for navigation meshes
- Funnel algorithm for navigation meshes
- Steering behavior for path following
- A basic FPS with path following spiders, ammo, and health spawned by an AI director

# Script Locations

This project includes 2 Unity projects:
- UnityPathing (a sandbox project for pathfinding experiments)
- BasicGame (the FPS demo with pathfinding and an AI director)

Planning scripts are located in `BasicGame/Assets/Pathfinding Scripts` and gameplay/director scripts are located in `BasicGame/Assets/Scripts`

##License: MIT

Copyright (c) 2013 Julian Ceipek, Alyssa Bawgus, Eric Tappan, Alex Adkins

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.