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

Some more examples:

```livescript
# --- positive integers:
expect do
    # --- lazy (1, 2, 3, ...)
    lazy-range 1
    # --- now eager.
    |> lazy-take 10
.to-equal do
    [1 to 10]

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

© 2016 Allen Haim allen@netherrealm.net
