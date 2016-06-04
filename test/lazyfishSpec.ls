``#!/usr/bin/env node``

{ even, odd, curry, take, lines, words, keys, map, each, join, compact, last, values, } = prelude-ls = require 'prelude-ls'

# array
fish-lib = require 'fish-lib'
    ..import-kind global, 'all'

{
    lazy-range
    lazy-find
    lazy-filter
    lazy-reject
    lazy-list
    lazy-list-ok
    lazy-scan
    lazy-scanl
    lazy-scan1
    lazy-scanl1
    lazy-compact
    lazy-compact-ok
    lazy-partition
    lazy-head
    lazy-tail
    lazy-take-partitioned
    lazy-list-empty
    lazy-map
    lazy-take
    lazy-drop
    lazy-wake
    lazy-wake-ok
    lazy-split-at
    lazy-take-while
    lazy-drop-while
    lazy-span
    lazy-last
    lazy-last-ok
    lazy-reverse
    lazy-unique
    lazy-unique-by
    lazy-fold
    lazy-foldl
    lazy-foldl1
    lazy-fold1
    lazy-foldr
    lazy-foldr1
    lazy-truncate
    lazy-slice
    lazy-mask
    lazy-difference
    lazy-intersect
    lazy-concat
    lazy-concat-to
    lazy-map-concat
    lazy-flatten
    lazy-count-by
    lazy-group-by
    lazy-and-list
    lazy-or-list
    lazy-any
    lazy-all
    lazy-sum
    lazy-product
    lazy-mean
    lazy-maximum
    lazy-minimum
    lazy-maximum-by
    lazy-minimum-by
    lazy-zip-two
    lazy-zip-two-with
    lazy-zip
    lazy-zip-with
    lazy-at
    lazy-pick
    lazy-pick
    lazy-elem-indices
    lazy-elem-index
    lazy-find-indices
    lazy-find-index

    } = require '../lazyfish'

test = it
xtest = xit

describe 'range' ->
    # --- test without using wake or take.

    test 'infinite range' ->
        lxs = lazy-range 5
        values = [1 to 5].map (_) ->
            { value, done, } = lxs.next()
            value
        expect values .to-equal [5 6 7 8 9]

    test 'finite range' ->
        lxs = lazy-range 2 6
        values = while true
            { value, done, } = lxs.next()
            break if done
            value
        expect values .to-equal [2 3 4 5 6]

    test 'finite range, out of bounds' ->
        lxs = lazy-range 2 6
        values = [1 to 7].map (_) ->
            { value, done, } = lxs.next()
            value
        expect values .to-equal [2 3 4 5 6 void void]

describe 'wake, take' ->
    # --- test without using range.

    test 'lazy-wake' ->
        expect do
            (->*
                yield 4
                yield 5
                yield 6
                yield 7
            )()
            |> lazy-wake
        .to-equal do
            [4 5 6 7]

    test 'lazy-take' ->
        expect do
            (->*
                yield 4
                yield 5
                yield 6
                yield 7
                yield 8
            )()
            |> lazy-take 3
        .to-equal do
            [4 5 6]

    test 'lazy-take, take too many' ->
        expect do
            (->*
                yield 4
                yield 5
                yield 6
            )()
            |> lazy-take 4
        .to-equal do
            [4 5 6]

describe 'lazy-drop' ->
    test 'lazy-drop 1' ->
        expect do
            lazy-range 5
            |> lazy-drop 2
            |> lazy-take 4
        .to-equal do
            [7 8 9 10]

    test 'lazy-drop too many' ->
        expect do
            lazy-range 5 7
            |> lazy-drop 4
            |> lazy-wake
        .to-equal do
            []

    test 'lazy-drop empty' ->
        expect do
            lazy-list-empty()
            |> lazy-drop 4
            |> lazy-wake
        .to-equal do
            []

describe 'wake-ok' ->
    test 'wake-ok' ->
        expect do
            (->*
                # [ 1 2 4 8 void ]
                yield 1
                yield 2
                yield 4
                yield 8
                yield void
            )()
            |> lazy-wake-ok
        .to-equal do
            [1 2 4 8]

describe 'lazy-split-at' ->
    test '1' ->
        expect do
            lazy-range 5
            |> lazy-split-at 3
            |> lazy-take 5
        .to-equal do
            [
                [5 6 7]
                8 9 10 11
            ]

    test 'left side empty' ->
        expect do
            lazy-range 5
            |> lazy-split-at 0
            |> lazy-take 6
        .to-equal do
            [
                []
                5 6 7 8 9
            ]

    test 'right side empty' ->
        expect do
            lazy-range 5 7
            |> lazy-split-at 3
            |> lazy-wake
        .to-equal do
            [[5 6 7]]

    test 'all empty' ->
        expect do
            lazy-list-empty()
            |> lazy-split-at 2
            |> lazy-wake
        .to-equal do
            [[]]

describe 'lazy-take-while' ->
    test 'normal' ->
        expect do
            lazy-range 4
            |> lazy-take-while (% 8)
            |> lazy-wake
        .to-equal do
            [4 5 6 7]

    test 'empty' ->
        expect do
            lazy-list-empty()
            |> lazy-take-while (% 8)
            |> lazy-wake
        .to-equal do
            []

    test 'never true' ->
        expect do
            lazy-range 4
            |> lazy-take-while -> false
            |> lazy-wake
        .to-equal do
            []

describe 'lazy-drop-while' ->
    test 'normal' ->
        expect do
            lazy-range 4
            |> lazy-drop-while (< 7)
            |> lazy-take 4
        .to-equal do
            [7 8 9 10]

    test 'empty' ->
        expect do
            lazy-list-empty()
            |> lazy-drop-while (% 8)
            |> lazy-wake
        .to-equal do
            []

    test 'never true' ->
        expect do
            lazy-range 4
            |> lazy-drop-while -> false
            |> lazy-take 4
        .to-equal do
            [4 5 6 7]

describe 'map, compact, empty' ->
    test 'map' ->
        square = -> it * it

        expect do
            lazy-range 5
            |> lazy-map square
            |> lazy-take 10
        .to-equal do
            [25 36 49 64 81 100 121 144 169 196]

    test 'compact' ->
        expect do
            lazy-range 1
            |> lazy-map (x) -> x if even x
            |> lazy-compact
            |> lazy-take 5
        .to-equal do
            [2 4 6 8 10]

    test 'empty' ->
        expect do
            lazy-list-empty()
            |> lazy-wake
        .to-equal do
            []

describe 'lazy-list' ->
    test 'one initial val' ->
        expect do
            [1]
            |> lazy-list (val, idx) ->
                val * 2
            |> lazy-take 5
        .to-equal do
            [1 2 4 8 16]

    test 'two initial vals' ->
        # --- fibonacci.
        expect do
            [1 1]
            |> lazy-list (a, b) ->
                a + b
            |> lazy-take 8
        .to-equal do
            [1 1 2 3 5 8 13 21]

    test 'two initial vals and idx' ->
        expect do
            [1 1]
            |> lazy-list (a, b, idx) ->
                a + b + idx
            |> lazy-take 8
        .to-equal do
            [1 1 4 8 16 29 51 87]

    test 'two initial vals, shorthand' ->
        # --- fibonacci.
        expect do
            [1 1]
            |> lazy-list (+)
            |> lazy-take 8
        .to-equal do
            [1 1 2 3 5 8 13 21]

describe 'wake ok + lazy list' ->
    test 'wake-ok + lazy list' ->
        expect do
            # [ 1 2 4 8 16 32 ]
            [1]
            |> lazy-list (val, idx) ->
                return if idx == 6
                val * 2
            |> lazy-wake-ok
        .to-equal do
            [1 2 4 8 16 32]

describe 'lazy-list-ok' ->
    test 'one initial val' ->
        expect do
            [9]
            |> lazy-list-ok (val) ->
                new-val if new-val = val - 1
            |> lazy-wake
        .to-equal do
            [9 8 7 6 5 4 3 2 1]

    test 'initial x 2' ->
        # --- fibonacci up to F(12).
        expect do
            [1 1]
            |> lazy-list-ok (a, b, idx) ->
                return if idx == 13
                a + b
            |> lazy-wake
        .to-equal do
            [1 1 2 3 5 8 13 21 34 55 89 144 233]

    test 'initial x 2, take too many' ->
        # --- fibonacci up to F(5).
        expect do
            [1 1]
            |> lazy-list-ok (a, b, idx) ->
                return if idx == 6
                a + b
            |> lazy-take 8
        .to-equal do
            [1 1 2 3 5 8]

describe 'lazy-scan' ->
    test 'synonym' ->
        expect lazy-scan .to-equal lazy-scanl

    test 'lazy-scan' ->
        expect do
            lazy-range 5
            |> lazy-scan (+), 3
            |> lazy-take 6
        .to-equal do
            [3 8 14 21 29 38]

    test 'lazy-scan empty substrate' ->
        expect do
            lazy-list-empty()
            |> lazy-scan (+), 3
            |> lazy-wake
        .to-equal do
            [3]

describe 'lazy-scan1' ->
    test 'synonym' ->
        expect lazy-scan1 .to-equal lazy-scanl1

    test 'lazy-scan1' ->
        expect do
            lazy-range 5
            |> lazy-scan1 (+)
            |> lazy-take 6
        .to-equal do
            [5 11 18 26 35 45]

    test 'lazy-scan1 single value substrate' ->
        expect do
            lazy-range 5 5
            |> lazy-scan1 (+)
            |> lazy-wake
        .to-equal do
            [5]

describe 'lazy-reverse' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-reverse
            |> lazy-wake
        .to-equal do
            []

    test 'range reverse' ->
        expect do
            lazy-range 1 20
            |> lazy-reverse
            |> lazy-take 3
        .to-equal do
            [20 19 18]

describe 'lazy-unique' ->
    test 'lazy-unique' ->
        expect do
            lazy-range 0 20
            |> lazy-map (% 5)
            |> lazy-unique
            |> lazy-wake
        .to-equal do
            [0 1 2 3 4]

    test 'lazy-unique-by 1' ->
        expect do
            lazy-range 0 20
            |> lazy-unique-by (% 5)
            |> lazy-wake
        .to-equal do
            [0 1 2 3 4]

    test 'lazy-unique-by 2' ->
        expect do
            lazy-range 0 20
            |> lazy-unique-by ->
                if odd it then 'blue' else 'red'
            |> lazy-wake
        .to-equal do
            [0 1]

describe 'lazy-truncate' ->
    test 'lazy-truncate' ->
        expect do
            lazy-range 0
            |> lazy-truncate 6
            |> lazy-wake
        .to-equal do
            [0 1 2 3 4 5]

describe 'lazy-slice' ->
    test 'non empty' ->
        expect do
            lazy-range 5
            |> lazy-slice 2 4
            |> lazy-wake
        .to-equal do
            [7 8]

    test 'empty' ->
        expect do
            lazy-list-empty()
            |> lazy-slice 2 4
            |> lazy-wake
        .to-equal do
            []

describe 'lazy-fold' ->
    test 'synonym' ->
        expect lazy-fold .to-be lazy-foldl

    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-fold (+), 10
        .to-equal do
            10

    test 'single element' ->
        expect do
            lazy-range 1 1
            |> lazy-fold (+), 42
        .to-equal do
            43

    test 'truncate then fold' ->
        expect do
            lazy-range 1
            |> lazy-truncate 6
            |> lazy-fold (+), 10
        .to-equal do
            10 + 1 + 2 + 3 + 4 + 5 + 6

describe 'lazy-fold1' ->
    test 'synonym' ->
        expect lazy-fold1 .to-be lazy-foldl1

    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-fold1 (+)
        .to-equal do
            void

    test 'single element' ->
        expect do
            lazy-range 42 42
            |> lazy-fold1 (+)
        .to-equal do
            42

    test 'truncate then fold' ->
        expect do
            lazy-range 1
            |> lazy-truncate 6
            |> lazy-fold1 (+)
        .to-equal do
            1 + 2 + 3 + 4 + 5 + 6

describe 'lazy-foldr' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-foldr (+), 10
        .to-equal do
            10

    test 'single element' ->
        expect do
            lazy-range 42 42
            |> lazy-foldr (+), 10
        .to-equal do
            52

    test 'truncate then fold' ->
        expect do
            lazy-range 1
            |> lazy-truncate 6
            |> lazy-foldr do
                (a, b) -> join '.' [a, b]
                10
        .to-equal do
            '10.6.5.4.3.2.1'

describe 'lazy-foldr1' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-foldr1 (+)
        .to-equal do
            void

    test 'single element' ->
        expect do
            lazy-range 42 42
            |> lazy-foldr1 (+)
        .to-equal do
            42

    test 'truncate then fold' ->
        expect do
            lazy-range 1
            |> lazy-truncate 6
            |> lazy-foldr1 do
                (a, b) -> join '.' [a, b]
        .to-equal do
            '6.5.4.3.2.1'

describe 'filter, reject, partition, take-partitioned' ->
    test 'filter' ->
        expect do
            lazy-range 1
            |> lazy-filter odd
            |> lazy-take 5
        .to-equal do
            [1 3 5 7 9]

    test 'reject' ->
        expect do
            lazy-range 1
            |> lazy-reject odd
            |> lazy-take 5
        .to-equal do
            [2 4 6 8 10]

    test 'partition' ->
        expect do
            lazy-range 1
            |> lazy-partition odd
            |> lazy-take-partitioned 7
        .to-equal do
            [[1 3 5 7] [2 4 6]]

        expect do
            lazy-range 6
            |> lazy-find -> not(it % 5)
        .to-equal do
            10

describe 'head, tail, last' ->
    test 'head' ->
        expect do
            lazy-range 6
            |> lazy-head
        .to-equal do
            6

    test 'head empty' ->
        expect do
            lazy-list-empty()
            |> lazy-head
        .to-equal do
            void

    test 'tail' ->
        expect do
            lazy-range 6
            |> lazy-tail
            |> lazy-take 5
        .to-equal do
            [7 8 9 10 11]

    test 'tail empty' ->
        expect do
            lazy-list-empty()
            |> lazy-tail
            |> lazy-wake
        .to-equal do
            []

    test 'last 1' ->
        expect do
            (->*
                # [ 1 2 4 8 void ]
                yield 1
                yield 2
                yield 4
                yield 8
                yield void
            )()
            |> lazy-last
        .to-equal do
            void

    test 'last 2' ->
        expect do
            # [ 1 2 4 8 16 32 ]
            [1]
            |> lazy-list-ok (val, idx) ->
                return if idx == 6
                val * 2
            |> lazy-last
        .to-equal do
            32

    test 'last empty' ->
        expect do
            # [ ]
            []
            |> lazy-list-ok ->
            |> lazy-last
        .to-equal do
            void

    test 'last ok 1' ->
        expect do
            (->*
                # [ 1 2 4 8 void ]
                yield 1
                yield 2
                yield 4
                yield 8
                yield void
            )()
            |> lazy-last-ok
        .to-equal do
            8

    test 'last ok 2' ->
        expect do
            # [ 1 2 4 8 16 32 ]
            [1]
            |> lazy-list (val, idx) ->
                return if idx == 6
                val * 2
            |> lazy-last-ok
        .to-equal do
            32

describe 'lazy-concat' ->
    test '3 finite' ->
        expect do
            lazy-concat array do
                lazy-range 1 4
                lazy-range 10 13
                lazy-range 15 19
            |> lazy-wake
        .to-equal do
            [1 2 3 4 10 11 12 13 15 16 17 18 19]

    test '2 finite + 1 infinite' ->
        expect do
            lazy-concat array do
                lazy-range 1 4
                lazy-range 10 13
                lazy-range 15
            |> lazy-take 13
        .to-equal do
            [1 2 3 4 10 11 12 13 15 16 17 18 19]

describe 'lazy-concat-to' ->
    test 'pipeline, 2 finite' ->
        expect do
            lazy-range 10 13
            |> lazy-concat-to lazy-range 4 6
            |> lazy-wake
        .to-equal do
            [4 5 6 10 11 12 13]

    test 'pipeline, 1 finite and 1 infinite' ->
        expect do
            lazy-range 10
            |> lazy-concat-to lazy-range 4 6
            |> lazy-take 9
        .to-equal do
            [4 5 6 10 11 12 13 14 15]

describe 'lazy-map-concat' ->
    test 'finite' ->
        expect do
            lazy-range 3 6
            |> lazy-map-concat (x) ->
                lazy-range x, 6
            |> lazy-wake
        .to-equal do
            [ 3 4 5 6
                4 5 6
                  5 6
                    6 ]

    test 'infinite' ->
        expect do
            lazy-range 3
            |> lazy-map-concat ->
                lazy-range it, 9
            |> lazy-take 28
        .to-equal do
            [ 3 4 5 6 7 8 9
                4 5 6 7 8 9
                  5 6 7 8 9
                    6 7 8 9
                      7 8 9
                        8 9
                          9 ]

describe 'lazy-flatten' ->
    test 'depth 1' ->
        expect do
            lazy-range 1 4
            |> lazy-flatten
            |> lazy-wake
        .to-equal do
            [1 2 3 4]

    test 'depth 2' ->
        expect do
            # --- think of it like a 2D array: [[1 2 3 4] [6 7 8 9]]
            (->*
                yield lazy-range 1 4
                yield lazy-range 6 9
            )()
            |> lazy-flatten
            |> lazy-wake
        .to-equal do
            [1 2 3 4
               6 7 8 9]

    test 'depth 3' ->
        expect do
            # --- think of it like a 3D array:
            # [
            #  [[1 2 3 4] [6 7 8 9]]
            #  [[2 3 4 5] [4 5 6 7 8 9]]
            # ]
            (->*
                yield (->*
                    yield lazy-range 1 4
                    yield lazy-range 6 9
                )()
                yield (->*
                    yield lazy-range 2 5
                    yield lazy-range 4 9
                )()
            )()
            |> lazy-flatten
            |> lazy-wake
        .to-equal do
            [1 2 3 4
               6 7 8 9
                 2 3 4 5
                   4 5 6 7 8 9]

describe 'lazy-mask' ->
    test 'synonym' ->
        expect lazy-mask .to-be lazy-difference

    test 'empty mask' ->
        expect do
            lazy-range 5
            |> lazy-mask []
            |> lazy-take 4
        .to-equal do
            [5 6 7 8]

    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-mask [2 3 4]
            |> lazy-wake
        .to-equal do
            []

    test 'empty list and empty mask' ->
        expect do
            lazy-list-empty()
            |> lazy-mask []
            |> lazy-wake
        .to-equal do
            []

    test 'finite, repeated, masked' ->
        expect do
            (->*
                yield 7
                yield 7
                yield 7
            )()
            |> lazy-mask [6 7 10]
            |> lazy-wake
        .to-equal do
            []

    test 'finite, repeated, not masked' ->
        expect do
            (->*
                yield 8
                yield 8
                yield 8
            )()
            |> lazy-mask [6 7 10]
            |> lazy-wake
        .to-equal do
            [8 8 8]
    test 'infinite, varied' ->
        expect do
            lazy-range 5
            |> lazy-mask [6 7 10]
            |> lazy-take 7
        .to-equal do
            [5 8 9 11 12 13 14]

describe 'lazy-intersect' ->
    test 'empty intersection' ->
        expect do
            (->*
                yield 3
                yield 2
                yield 6
                yield 8
            )()
            |> lazy-intersect []
        .to-equal do
            []

    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-intersect [2 3 8]
        .to-equal do
            []

    test 'empty intersection and list' ->
        expect do
            lazy-list-empty()
            |> lazy-intersect []
        .to-equal do
            []

    test 'finite, non-empty' ->
        expect do
            (->*
                yield 3
                yield 2
                yield 6
                yield 8
                yield 4
                yield 10
                yield 8
            )()
            |> lazy-intersect [2 3 8]
            |> lazy-wake
        .to-equal do
            [3 2 8 8]

describe 'lazy-count-by' ->
    dog     = type: 'mammal' woolly: true   loyal: true
    cat     = type: 'mammal' woolly: false  loyal: false
    sheep   = type: 'mammal' woolly: true   loyal: false

    test 'empty list' ->
        counts =
            lazy-list-empty()
            |> lazy-count-by (odd)
        expect counts.size .to-be 0

    test '1' ->
        counts =
            (->*
                yield dog
                yield cat
                yield dog
                yield sheep
            )()
            |> lazy-count-by (.woolly)
        expect counts.get true .to-equal 3
        expect counts.get false .to-equal 1

    test '2' ->
        counts =
            (->*
                yield dog
                yield cat
                yield dog
                yield sheep
            )()
            |> lazy-count-by (.type)
        expect counts.get 'mammal' .to-equal 4

describe 'lazy-group-by' ->
    dog     = type: 'mammal' woolly: true   loyal: true
    cat     = type: 'mammal' woolly: false  loyal: false
    sheep   = type: 'mammal' woolly: true   loyal: false

    test 'empty list' ->
        groups =
            lazy-list-empty()
            |> lazy-group-by (odd)
        expect groups.size .to-be 0

    test '1' ->
        groups =
            (->*
                yield dog
                yield cat
                yield dog
                yield sheep
            )()
            |> lazy-group-by (.woolly)
        expect groups.get true .to-equal [dog, dog, sheep]
        expect groups.get false .to-equal [cat]

    test '2' ->
        groups =
            (->*
                yield dog
                yield cat
                yield dog
                yield sheep
            )()
            |> lazy-group-by (.type)
        expect groups.get 'mammal' .to-equal [dog, cat, dog, sheep]

describe 'lazy-and-list' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-and-list
        .to-equal do
            true

    test '1' ->
        expect do
            (->*
                yield true
                yield true
                yield void
            )()
            |> lazy-and-list
        .to-equal do
            false

    test '2' ->
        expect do
            (->*
                yield true
                yield 0
            )()
            |> lazy-and-list
        .to-equal do
            false

    test '3' ->
        expect do
            (->*
                yield true
                yield '0'
            )()
            |> lazy-and-list
        .to-equal do
            true

describe 'lazy-or-list' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-or-list
        .to-equal do
            false

    test '1' ->
        expect do
            (->*
                yield true
                yield true
                yield void
            )()
            |> lazy-or-list
        .to-equal do
            true

    test '2' ->
        expect do
            (->*
                yield '0'
                yield 0
            )()
            |> lazy-or-list
        .to-equal do
            true

    test '3' ->
        expect do
            (->*
                yield 0
                yield null
            )()
            |> lazy-or-list
        .to-equal do
            false

describe 'lazy-any' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-any odd
        .to-equal do
            false

    test '1' ->
        expect do
            (->*
                yield 1
                yield 2
                yield 3
            )()
            |> lazy-any odd
        .to-equal do
            true

    test '2' ->
        expect do
            (->*
                yield null
                yield 0
            )()
            |> lazy-any odd
        .to-equal do
            false

    test '3' ->
        expect do
            (->*
                yield 0
                yield '0'
            )()
            |> lazy-any odd
        .to-equal do
            false

describe 'lazy-all' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-all odd
        .to-equal do
            true

    test '1' ->
        expect do
            (->*
                yield 1
                yield 2
                yield 3
            )()
            |> lazy-all odd
        .to-equal do
            false

    test '2' ->
        expect do
            (->*
                yield 1
                yield 1
                yield 11
            )()
            |> lazy-all odd
        .to-equal do
            true

    test '3' ->
        expect do
            (->*
                yield 1
                yield 11
                yield null
            )()
            |> lazy-all odd
        .to-equal do
            false

describe 'lazy-sum' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-sum
        .to-equal do
            0

    test 'with truncate' ->
        expect do
            lazy-range 5
            |> lazy-truncate 4
            |> lazy-sum
        .to-equal do
            26

describe 'lazy-product' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-product
        .to-equal do
            1

    test 'with truncate' ->
        expect do
            lazy-range 3
            |> lazy-truncate 3
            |> lazy-product
        .to-equal do
            60

describe 'lazy-mean' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-mean
        .to-equal do
            void

    test '1' ->
        expect do
            (->*
                yield 12
                yield 17
                yield 31
            )()
            |> lazy-mean
        .to-equal do
            20

describe 'lazy-maximum' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-maximum
        .to-equal do
            void

    test '1' ->
        expect do
            (->*
                yield 12
                yield 31.5
                yield 17
            )()
            |> lazy-maximum
        .to-equal do
            31.5

describe 'lazy-minimum' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-minimum
        .to-equal do
            void

    test '1' ->
        expect do
            (->*
                yield 17
                yield 12
                yield -10
                yield 31
            )()
            |> lazy-minimum
        .to-equal do
            -10

describe 'lazy-maximum-by' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-maximum-by ->
        .to-equal do
            void

    test '1' ->
        expect do
            (->*
                yield 12
                yield 31.5
                yield 17
            )()
            |> lazy-maximum-by (x) ->
                x * 2
        .to-equal do
            63

describe 'lazy-minimum-by' ->
    test 'empty list' ->
        expect do
            lazy-list-empty()
            |> lazy-minimum-by ->
        .to-equal do
            void

    test '1' ->
        expect do
            (->*
                yield 17
                yield 12
                yield -10
                yield 31
            )()
            |> lazy-minimum-by (x) ->
                x - 5
        .to-equal do
            -15

describe 'lazy-zip-two' ->
    test 'normal' ->
        expect do
            lazy-zip-two do
                lazy-range 1
                lazy-range 10
            |> lazy-take 4
        .to-equal do
            [
                [1 10]
                [2 11]
                [3 12]
                [4 13]
            ]

    test 'curried' ->
        expect do
            lazy-range 10
            |> lazy-zip-two lazy-range 1
            |> lazy-take 4
        .to-equal do
            [
                [1 10]
                [2 11]
                [3 12]
                [4 13]
            ]

    test 'left empty' ->
        expect do
            lazy-zip-two do
                lazy-list-empty()
                lazy-range 10
            |> lazy-take 4
        .to-equal do
            []

    test 'right empty' ->
        expect do
            lazy-zip-two do
                lazy-range 1
                lazy-list-empty()
            |> lazy-take 4
        .to-equal do
            []

    test 'both empty' ->
        expect do
            lazy-zip-two do
                lazy-list-empty()
                lazy-list-empty()
            |> lazy-take 4
        .to-equal do
            []

    test 'different sizes' ->
        expect do
            lazy-zip-two do
                lazy-range 1 4
                lazy-range 10
            |> lazy-wake
        .to-equal do
            [
                [1 10]
                [2 11]
                [3 12]
                [4 13]
            ]

describe 'lazy-zip-two-with' ->
    test 'normal' ->
        expect do
            lazy-zip-two-with do
                (+)
                lazy-range 1
                lazy-range 10
            |> lazy-take 4
        .to-equal do
            [11 13 15 17]

    test 'curried' ->
        expect do
            lazy-range 10
            |> lazy-zip-two-with (+), lazy-range 1
            |> lazy-take 4
        .to-equal do
            [11 13 15 17]

    test 'left empty' ->
        expect do
            lazy-zip-two-with do
                (+)
                lazy-list-empty()
                lazy-range 10
            |> lazy-take 4
        .to-equal do
            []

    test 'right empty' ->
        expect do
            lazy-zip-two-with do
                (+)
                lazy-range 1
                lazy-list-empty()
            |> lazy-take 4
        .to-equal do
            []

    test 'both empty' ->
        expect do
            lazy-zip-two-with do
                (+)
                lazy-list-empty()
                lazy-list-empty()
            |> lazy-take 4
        .to-equal do
            []

    test 'different sizes' ->
        expect do
            lazy-zip-two-with do
                (*)
                lazy-range 1 4
                lazy-range 10
            |> lazy-wake
        .to-equal do
            [10 22 36 52]

describe 'lazy-zip' ->
    test 'normal' ->
        expect do
            lazy-zip do
                lazy-range 1
                lazy-range 10
                lazy-range 20
            |> lazy-take 4
        .to-equal do
            [
                [1 10 20]
                [2 11 21]
                [3 12 22]
                [4 13 23]
            ]

    test '2 empty' ->
        expect do
            lazy-zip do
                lazy-list-empty()
                lazy-list-empty()
                lazy-range 10
            |> lazy-wake
        .to-equal do
            []

    test '1 empty' ->
        expect do
            lazy-zip do
                lazy-range 1
                lazy-list-empty()
                lazy-range 1
            |> lazy-wake
        .to-equal do
            []

    test '3 empty' ->
        expect do
            lazy-zip do
                lazy-list-empty()
                lazy-list-empty()
                lazy-list-empty()
            |> lazy-wake
        .to-equal do
            []

    test 'different sizes' ->
        expect do
            lazy-zip do
                lazy-range 1 4
                lazy-range 10
                lazy-range 2 6
            |> lazy-wake
        .to-equal do
            [
                [1 10 2]
                [2 11 3]
                [3 12 4]
                [4 13 5]
            ]

describe 'lazy-zip-with' ->
    test 'normal' ->
        expect do
            lazy-zip-with do
                (a, b, c) -> a + b + c
                lazy-range 1
                lazy-range 10
                lazy-range 20
            |> lazy-take 4
        .to-equal do
            [31 34 37 40]

    test '2 empty' ->
        expect do
            lazy-zip-with do
                (a, b, c) -> a + b + c
                lazy-list-empty()
                lazy-list-empty()
                lazy-range 10
            |> lazy-wake
        .to-equal do
            []

    test '1 empty' ->
        expect do
            lazy-zip-with do
                (a, b, c) -> a + b + c
                lazy-range 1
                lazy-list-empty()
                lazy-range 1
            |> lazy-wake
        .to-equal do
            []

    test '3 empty' ->
        expect do
            lazy-zip-with do
                (a, b, c) -> a + b + c
                lazy-list-empty()
                lazy-list-empty()
                lazy-list-empty()
            |> lazy-wake
        .to-equal do
            []

    test 'different sizes' ->
        expect do
            lazy-zip-with do
                (a, b, c) -> a + b + c
                lazy-range 1 4
                lazy-range 10
                lazy-range 2 6
            |> lazy-wake
        .to-equal do
            [13 16 19 22]

describe 'lazy-at' ->
    test 'synonynm' ->
        expect lazy-at .to-be lazy-pick

    test 'fibonacci(34) (0-based)' ->
        expect do
            [1 1]
            |> lazy-list (+)
            |> lazy-at 33
        .to-equal do
            5_702_887

    test 'normal' ->
        expect do
            lazy-range 4
            |> lazy-at 3
        .to-equal do
            7

    test 'invalid' ->
        expect do
            lazy-range 4 5
            |> lazy-at 3
        .to-equal do
            void

    test 'empty' ->
        expect do
            lazy-list-empty()
            |> lazy-at 3
        .to-equal do
            void

describe 'lazy-elem-indices' ->
    test 'normal' ->
        expect do
            (->*
                yield 4
                yield 5
                yield 4
                yield 6
            )()
            |> lazy-elem-indices 4
        .to-equal do
            [0 2]

    test 'not there' ->
        expect do
            (->*
                yield 4
                yield 5
                yield 4
                yield 6
            )()
            |> lazy-elem-indices 10
        .to-equal do
            []

    test 'empty' ->
        expect do
            lazy-list-empty()
            |> lazy-elem-indices 10
        .to-equal do
            []

describe 'lazy-elem-index' ->
    test 'normal' ->
        expect do
            (->*
                yield 4
                yield 5
                yield 4
                yield 6
            )()
            |> lazy-elem-index 5
        .to-equal do
            1

    test 'duplicate' ->
        expect do
            (->*
                yield 4
                yield 5
                yield 4
                yield 6
            )()
            |> lazy-elem-index 4
        .to-equal do
            0

    test 'not there' ->
        expect do
            (->*
                yield 4
                yield 5
                yield 4
                yield 6
            )()
            |> lazy-elem-index 10
        .to-equal do
            void

    test 'empty' ->
        expect do
            lazy-list-empty()
            |> lazy-elem-index 10
        .to-equal do
            void




describe 'lazy-find-indices' ->
    test 'normal' ->
        expect do
            (->*
                yield 4
                yield 5
                yield 4
                yield 6
            )()
            |> lazy-find-indices even
        .to-equal do
            [0 2 3]

    test 'not there' ->
        expect do
            (->*
                yield 4
                yield 8
                yield 4
                yield 6
            )()
            |> lazy-find-indices odd
        .to-equal do
            []

    test 'empty' ->
        expect do
            lazy-list-empty()
            |> lazy-find-indices even
        .to-equal do
            []

describe 'lazy-find-index' ->
    test 'normal' ->
        expect do
            (->*
                yield 4
                yield 5
                yield 7
                yield 9
            )()
            |> lazy-find-index even
        .to-equal do
            0

    test 'duplicate' ->
        expect do
            (->*
                yield 4
                yield 5
                yield 4
                yield 6
            )()
            |> lazy-find-index even
        .to-equal do
            0

    test 'not there' ->
        expect do
            (->*
                yield 4
                yield 8
                yield 4
                yield 6
            )()
            |> lazy-find-index odd
        .to-equal do
            void

    test 'empty' ->
        expect do
            lazy-list-empty()
            |> lazy-find-index even
        .to-equal do
            void

