# KML Coordinate Density Reducer

by [Ben Buckman, New Leaf Digital](http://newleafdigital.com)

## Purpose

Given a [KML](http://en.wikipedia.org/wiki/Keyhole_Markup_Language) file with more coordinates than necessary,
this node script will reduce the coordinates to a requested density.

Written to create maps of my [bike routes in Buenos Aires](http://www.stephandben.com/search/label/bicycling).

Note: This does not actually parse any XML, it simply regex's each line to find coordinates, strips out unwanted ones, 
and leaves the rest of the lines intact.
The algorithm is very "dumb": given a *reduce* parameter of 2, it keeps every other (1 out of 2) coordinates; with 5, it strips 4/5; etc.

## Usage

    node ./node-kml-reduce-density.js --in [PATH] --out [PATH] --reduce [NUM]

    Options:
      --in      source KML file                                                   [required]
      --out     write to new KML file                                             [required]
      --reduce  Preserve 1/N coordinates. 1=all, 4=25%, 10=10%. Default 2 (50%).  [required]  [default: 2]

