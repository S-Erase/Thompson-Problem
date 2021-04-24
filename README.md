# Thomson-Problem-Applet

## Introduction
This applet implements a naive iterative algorithm to solve the Thomson Problem for an arbitrary number of vertices from 1 to 150.

## The Thomson Problem
The five platonic solids provide nice symmetric arrangements of 4,6,8,12 and 20 vertices on a sphere that appear to cover the sphere
the most evenly. This raises the question of whether similar arrangements can be found for different numbers of vertices. The Thomson
Problem is one a formal phrasing of this question. It asks to treat the vertices as positive electic charges and find the arrangement that
minimizes the electrostatic potential energy of the system.
Another version of this problem is the Tammes problem which asks to maximize the minimum distance between all the vertices.
For both of these problems, it turns out that the platonic solid arrangements are not optimal for n = 8, 20.

## Starting arrangement
Even though it is difficult to find the solutions of the Thomson Problem, there is a way to make decent approximations.

In nature, flowers arrange their seeds according the golden ratio in order to most efficiently use the available area. The same is done
in to produce an good starting arrangement for our vertices so that they may theoretically align into an even better arrangement.
