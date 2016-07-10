# lazyfish
Functionally oriented lazy lists and transducers for JavaScript. A runtime which supports generators is required, e.g. ES6.

LiveScript (https://github.com/gkz/livescript) recommended but not required. The examples are given first in super hip LiveScript and then in JavaScript. 

The API is largely modelled on prelude-ls (https://github.com/gkz/prelude-ls), with some deviations.

The basic idea is a lazy list, like this (assume `square` to be a function which squares its input and `odd` to be a function which returns true if its input is an odd integer.)

```livescript
# --- nothing is evaluated yet:
positive-integers = lazy-range 1 # => 1, 2, 3, ...
# --- still not:
squares = lazy-map square, positive-integers # => 1, 4, 9, ... 
# --- and still not yet:
odd-squares = lazy-filter odd, squares # => 1, 9, 25, ...
# --- now it's finally evaluated:
five-odd-squares = lazy-take 5 odd-squares # => [1, 9, 25, 49, 81]
```

Using pipelines and inline functions:

```livescript
five-odd-squares = lazy-range 1
|> lazy-map (x) -> x * x
|> lazy-filter (x) -> true if x % 2
|> lazy-take 5 # => [1, 9, 25, 49, 81]
```

Add an `expect do` and a `.to-equal do` and you have declarative tests.

See the examples directory to understand all the available functions.

Here are some more examples:

```livescript

{ lazy-take, lazy-range, lazy-compact, lazy-map, lazy-filter, 
lazy-at, lazy-list, lazy-scan, lazy-fold, lazy-truncate, } = require 'lazyfish'
{ odd, even, } = require 'prelude-ls'

# --- positive integers:
expect do
    # --- lazy (1, 2, 3, ...)
    lazy-range 1
    # --- now eager.
    |> lazy-take 10
.to-equal do
    [1 to 10]

# --- 'it' is the implicit argument.
square = -> it * it

expect do
    # --- lazy (5, 6, 7, ...)
    lazy-range 5
    # --- lazy (25, 36, 49, ...)
    |> lazy-map square
    # --- now eager.
    |> lazy-take 10
.to-equal do
    [25 36 49 64 81 100 121 144 169 196]

expect do
    lazy-range 1
    # --- undefined, 2, undefined, 4, ...
    |> lazy-map (x) -> x if even x
    # --- filter out undefined.
    |> lazy-compact
    # --- now eager.
    |> lazy-take 5
.to-equal do
    [2 4 6 8 10]

# --- fibonacci:
expect do
    [1 1]
    # --- recursively create infinite list using the two seed values and a function.
    |> lazy-list (+)
    # --- take the value at index 33.
    |> lazy-at 33
.to-equal do
    5_702_887

# --- scan:
expect do
    lazy-range 5
    # --- recursively create an infinite list using an existing one, a function, and a seed value.
    |> lazy-scan (+), 3
    # --- take the value.
    |> lazy-take 6
.to-equal do
    [3 8 14 21 29 38]

# --- fold:
expect do
    lazy-range 1
    # --- still a lazy list, but will end at 6.
    |> lazy-truncate 6
    # --- now eager: fold (reduce) it using the function and the seed value.
    |> lazy-fold (+), 10
.to-equal do
    10 + 1 + 2 + 3 + 4 + 5 + 6 # i.e. 31
```

Here are the same examples, written in JavaScript. The order of the arguments probably won't make much sense from a straight JavaScript point of view; if you want to work this way you might consider using another library with a more familiar native-style syntax.

```javascript

const preludeLs = require('prelude-ls');
const lazyfish = require('lazyfish');

const lazyTake = lazyfish.lazyTake;
const lazyRange = lazyfish.lazyRange;
const lazyCompact = lazyfish.lazyCompact;
const lazyMap = lazyfish.lazyMap;
const lazyFilter = lazyfish.lazyFilter;
const lazyAt = lazyfish.lazyAt;
const lazyList = lazyfish.lazyList;
const lazyScan = lazyfish.lazyScan;
const lazyFold = lazyfish.lazyFold;
const lazyTruncate = lazyfish.lazyTruncate;
const odd = preludeLs.odd;
const even = preludeLs.even;

function square(x) { return x * x; }
function binaryAdd(x, y) { return x + y; }

// --- nothing is evaluated yet.
var positiveIntegers = lazyRange(1); // => 1, 2, 3, ...
// --- still not:
var squares = lazyMap(square, positiveIntegers); // => 1, 4, 9, ... 
// --- and still not yet:
var oddSquares = lazyFilter(odd, squares); // => 1, 9, 25, ...
// --- now it's finally evaluated:
var fiveOddSquares = lazyTake(5, oddSquares); // => [1, 9, 25, 49, 81]

expect(
    lazyTake(10, lazyRange(1)
).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

expect(
    lazyTake(10, lazyMap(square, lazyRange(5)))
).toEqual([25, 36, 49, 64, 81, 100, 121, 144, 169, 196]);

expect(
    lazyTake(5, lazyCompact(lazyMap(function (x) {
        if (even(x)) return x;
    }, lazyRange(1))))
).toEqual([2, 4, 6, 8, 10]);

// --- fibonacci:
expect(
    lazyAt(33, lazyList(binaryAdd, [1, 1]))
).toEqual(5702887);

// --- scan:
expect(
    lazyTake(6, lazyScan(binaryAdd, 3, lazyRange(5)))
).toEqual([3, 8, 14, 21, 29, 38]);

// --- fold:
expect(
    lazyFold(binaryAdd, 10, lazyTruncate(6, lazyRange(1)))
).toEqual(10 + 1 + 2 + 3 + 4 + 5 + 6);

```

© 2016 Allen Haim allen@netherrealm.net
