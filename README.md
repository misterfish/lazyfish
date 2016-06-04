# lazyfish
Functionally oriented lazy lists for ES6.

@gkz's LiveScript (https://github.com/gkz/livescript) recommended but not required.

The API is largely modelled on @gkz's prelude-ls (https://github.com/gkz/prelude-ls), with some deviations.

The basic idea is a lazy list, like this:

```livescript
# --- nothing is evaluated yet.
positive-integers = lazy-range 1 # => 1, 2, 3, ...
# --- still not:
squares = lazy-map (-> it * it), positive-integers # => 1, 4, 9, ... 
# --- and still not yet:
odd-squares = lazy-filter odd, squares # => 1, 9, 25, ...
# --- now it's finally evaluated:
result = lazy-take 5 odd-squares # => [1, 9, 25, 49, 81]
```

Here are some more examples, using `expect` syntax. See the `test` dir for many more.

```livescript
# --- positive integers:
expect do
    # --- lazy (1, 2, 3, ...)
    lazy-range 1
    # --- now eager.
    |> lazy-take 10
.to-equal do
    [1 to 10]

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
    |> lazy-map (x) -> x if even x
    |> lazy-compact
    |> lazy-take 5
.to-equal do
    [2 4 6 8 10]

# --- fibonacci:
expect do
    [1 1]
    |> lazy-list (+)
    |> lazy-at 33
.to-equal do
    5_702_887

# --- scan:
expect do
    lazy-range 5
    |> lazy-scan (+), 3
    |> lazy-take 6
.to-equal do
    [3 8 14 21 29 38]

# --- fold:
expect do
    lazy-range 1
    |> lazy-truncate 6
    |> lazy-fold (+), 10
.to-equal do
    10 + 1 + 2 + 3 + 4 + 5 + 6
```
Here are the same examples, written in JavaScript. They miss the shine of the Haskell/F#/LiveScript pipelines. If you want to work in JavaScript you might consider using another library with a more familiar native/`lodash`-style syntax: ```collection.map(xxx).filter(yyy) ... ```.

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
var result = lazyTake(5, oddSquares); // => [1, 9, 25, 49, 81]

expect(
    lazyTake(10, lazyRange(1)
).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

expect(
    lazyTake(10, lazyMap(square, lazyRange(5)))
).toEqual(25 36 49 64 81 100 121 144 169 196]);

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
